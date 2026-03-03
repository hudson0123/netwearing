import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { getProduct } from '@/lib/products';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productId, name, email, size } = req.body;

    if (!productId || !name || !email || !size) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = getProduct(productId);
    if (!product) {
      return res.status(400).json({ error: 'Invalid product' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.price,
      currency: 'usd',
      metadata: {
        productId: product.id,
        productName: product.name,
        customerName: name,
        customerEmail: email,
        size,
        resumeUploaded: 'false',
        resumeUrl: '',
      },
      receipt_email: email,
      description: `${product.name} — Size ${size}`,
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
