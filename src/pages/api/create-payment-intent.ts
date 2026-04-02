import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { getProduct } from '@/lib/products';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, name, email, linkedinUrl, uploadLater } = req.body;

    if (!items || !items.length || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let totalAmount = 0;
    const summaries = [];

    for (const item of items) {
      const product = getProduct(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Invalid product` });
      }
      totalAmount += product.price * item.quantity;
      summaries.push(`${product.name} (Size: ${item.size}, Qty: ${item.quantity})`);
    }

    const sizes = items.map((i: any) => i.size).join(', ');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: {
        customerName: name,
        customerEmail: email,
        sizes: sizes,
        linkedinUrl: linkedinUrl || '',
        uploadLater: String(uploadLater || false),
        resumeUploaded: 'false',
        resumeUrl: '',
      },
      receipt_email: email,
      description: summaries.join(' | '),
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err: unknown) {
    console.error('Stripe error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}
