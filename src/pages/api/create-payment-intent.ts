import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { getProduct } from '@/lib/products';

import { rateLimit } from '@/lib/rate-limit';

interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

function isValidShipping(s: unknown): s is ShippingAddress {
  if (!s || typeof s !== 'object') return false;
  const obj = s as Record<string, unknown>;
  return (
    typeof obj.line1 === 'string' && obj.line1.trim().length > 0 &&
    typeof obj.city === 'string' && obj.city.trim().length > 0 &&
    typeof obj.state === 'string' && obj.state.trim().length > 0 &&
    typeof obj.postal_code === 'string' && obj.postal_code.trim().length > 0 &&
    typeof obj.country === 'string' && obj.country.trim().length === 2
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate Limiting: 5 attempts per minute per IP
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const { success } = rateLimit(ip, 5, 60000);
  if (!success) {
    return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
  }

  try {
    console.log('Incoming Payment Intent Request Body:', req.body);
    const { items, name, email, linkedinUrl, shipping } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || items.length > 50) {
      console.log('Validation Error: Invalid items payload');
      return res.status(400).json({ error: 'Invalid items payload' });
    }

    if (!name || typeof name !== 'string' || name.length > 200 || !email || typeof email !== 'string' || email.length > 200) {
      console.log('Validation Error: Missing name or email');
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    if (!isValidShipping(shipping)) {
      console.log('Validation Error: Invalid shipping', shipping);
      return res.status(400).json({ error: 'Missing or invalid shipping address' });
    }

    let totalAmount = 0;
    const summaries = [];

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
      }

      const product = getProduct(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Invalid product` });
      }
      totalAmount += product.price * item.quantity;
      summaries.push(`${product.name} (Size: ${String(item.size).slice(0, 5)}, Qty: ${item.quantity})`);
    }

    const sizes = items.map((i: { size: string }) => String(i.size).slice(0,5)).join(', ').substring(0, 499);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: {
        customerName: name,
        customerEmail: email,
        sizes: sizes,
        linkedinUrl: linkedinUrl || '',
        resumeUploaded: 'false',
        resumeUrl: '',
        shipLine1: shipping.line1.substring(0, 499),
        shipLine2: (shipping.line2 || '').substring(0, 499),
        shipCity: shipping.city.substring(0, 499),
        shipState: shipping.state.substring(0, 499),
        shipPostalCode: shipping.postal_code.substring(0, 499),
        shipCountry: shipping.country,
      },
      shipping: {
        name: name,
        address: {
          line1: shipping.line1,
          line2: shipping.line2 || undefined,
          city: shipping.city,
          state: shipping.state,
          postal_code: shipping.postal_code,
          country: shipping.country,
        },
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
