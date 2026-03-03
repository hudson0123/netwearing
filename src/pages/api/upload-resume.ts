import type { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import { stripe } from '@/lib/stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data manually
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const body = Buffer.concat(chunks);

    // Extract boundary from content-type
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      return res.status(400).json({ error: 'Invalid content type' });
    }
    const boundary = boundaryMatch[1];

    // Parse the multipart data
    const parts = parseMultipart(body, boundary);

    const orderId = parts.find((p) => p.name === 'orderId')?.value;
    const filePart = parts.find((p) => p.name === 'file');

    if (!orderId || !filePart || !filePart.data) {
      return res.status(400).json({ error: 'Missing orderId or file' });
    }

    // Upload to Vercel Blob
    const blob = await put(`resumes/${orderId}/${filePart.filename}`, filePart.data, {
      access: 'public',
      contentType: filePart.contentType || 'application/pdf',
    });

    // Update Stripe PaymentIntent metadata with resume URL
    await stripe.paymentIntents.update(orderId, {
      metadata: {
        resumeUploaded: 'true',
        resumeUrl: blob.url,
        resumeFilename: filePart.filename || 'resume',
      },
    });

    return res.status(200).json({ url: blob.url });
  } catch (err: unknown) {
    console.error('Upload error:', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return res.status(500).json({ error: message });
  }
}

interface MultipartPart {
  name?: string;
  filename?: string;
  contentType?: string;
  value?: string;
  data?: Buffer;
}

function parseMultipart(body: Buffer, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const bodyStr = body.toString('binary');
  const sections = bodyStr.split(boundaryBuffer.toString('binary'));

  for (const section of sections) {
    if (section.trim() === '' || section.trim() === '--') continue;

    const headerEnd = section.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;

    const headerStr = section.substring(0, headerEnd);
    const dataStr = section.substring(headerEnd + 4);

    // Remove trailing \r\n
    const cleanData = dataStr.endsWith('\r\n')
      ? dataStr.substring(0, dataStr.length - 2)
      : dataStr;

    const part: MultipartPart = {};

    // Parse Content-Disposition
    const nameMatch = headerStr.match(/name="([^"]+)"/);
    if (nameMatch) part.name = nameMatch[1];

    const filenameMatch = headerStr.match(/filename="([^"]+)"/);
    if (filenameMatch) part.filename = filenameMatch[1];

    // Parse Content-Type
    const ctMatch = headerStr.match(/Content-Type:\s*(.+)/i);
    if (ctMatch) part.contentType = ctMatch[1].trim();

    if (part.filename) {
      // File field — store as Buffer
      part.data = Buffer.from(cleanData, 'binary');
    } else {
      // Text field
      part.value = cleanData;
    }

    parts.push(part);
  }

  return parts;
}
