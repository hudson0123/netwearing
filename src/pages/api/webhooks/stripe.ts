import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { Readable } from 'stream';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { customerEmail, customerName, linkedinUrl, resumeUploaded } = paymentIntent.metadata;

    console.log(`Payment confirmed for ${customerEmail}.`);

    try {
      // If NO resume was uploaded (meaning they used LinkedIn), we send the admin alert here.
      // (If a resume WAS uploaded, the /api/upload-resume route already handled the detailed email)
      if (resumeUploaded !== 'true') {
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
          const shipping = paymentIntent.metadata;
          const shippingInfo = `
            Address: ${shipping.shipLine1 || ''} ${shipping.shipLine2 || ''}
            City: ${shipping.shipCity || ''}, ${shipping.shipState || ''} ${shipping.shipPostalCode || ''}
            Country: ${shipping.shipCountry || ''}
          `;

          await resend.emails.send({
            from: 'Netwearing System <system@upload.netwearing.com>',
            to: adminEmail,
            subject: `[DOCKET] New LinkedIn Candidate: ${customerName}`,
            html: `
              <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
                <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">New Candidate Submission (LinkedIn)</h2>
                <p><strong>Order ID:</strong> ${paymentIntent.id}</p>
                <hr />
                <p><strong>Candidate Name:</strong> ${customerName}</p>
                <p><strong>Contact Email:</strong> ${customerEmail}</p>
                <p><strong>LinkedIn Profile:</strong> ${linkedinUrl || 'Not provided'}</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="margin: 0; font-weight: bold;">Shipping Information:</p>
                  <pre style="margin: 5px 0;">${shippingInfo}</pre>
                </div>
                <p><em>Note: This candidate did not attach a résumé; they verified via LinkedIn instead.</em></p>
              </div>
            `,
          });
          console.log(`LinkedIn-only docket dispatched to ${adminEmail}`);
        }
      } else {
         console.log('Resume detected. Detailed email already dispatched via upload route.');
      }
    } catch (err) {
      console.error('Failed to dispatch internal notification:', err);
    }
  }

  res.json({ received: true });
}
