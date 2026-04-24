import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const buf = await getRawBody(req);
  const sig = req.headers['stripe-signature'] as string;

  let event;

  try {
    if (!webhookSecret) {
        // Fallback for development if secret not set (WARNING: INSECURE)
        console.warn('STRIPE_WEBHOOK_SECRET not set. Proceeding without verification (DEV ONLY)');
        event = JSON.parse(buf.toString());
    } else {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { customerEmail, customerName, items, linkedinUrl, resumeUploaded, resumeFilename } = paymentIntent.metadata;

    console.log(`Payment confirmed for ${customerEmail}. Sending confirmation email...`);

    try {
      // Determine evidence type
      let evidenceType: 'LinkedIn URL' | 'Résumé Attachment' = 'LinkedIn URL';
      let evidenceValue = '';

      if (resumeUploaded === 'true') {
        evidenceType = 'Résumé Attachment';
        evidenceValue = resumeFilename || 'Submitted';
      } else if (linkedinUrl) {
        evidenceType = 'LinkedIn URL';
        evidenceValue = linkedinUrl;
      }

      // Decode items summary from metadata if needed, or use the description
      const itemSummaries = paymentIntent.description ? paymentIntent.description.split(' | ') : ['The Résumé Shirt'];

      await sendOrderConfirmationEmail({
        to: customerEmail,
        customerName: customerName,
        orderId: paymentIntent.id,
        items: itemSummaries,
        evidenceType,
        evidenceValue,
      });
      
      console.log(`Confirmation email sent to ${customerEmail}`);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }
  }

  res.json({ received: true });
}
