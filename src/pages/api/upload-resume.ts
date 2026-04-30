import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { stripe } from '@/lib/stripe';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '10mb',
  },
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Upload Route: Starting stream capture...');
    
    // Read the stream manually with a promise for better reliability
    const body = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', (err) => reject(err));
      // Safety timeout after 30 seconds
      setTimeout(() => reject(new Error('Request stream timed out')), 30000);
    });

    console.log(`Upload Route: Captured ${body.length} bytes.`);

    // Extract boundary from content-type
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      console.log('Upload Route: Error - Invalid content type');
      return res.status(400).json({ error: 'Invalid content type' });
    }
    const boundary = boundaryMatch[1];

    // Parse the multipart data
    const parts = parseMultipart(body, boundary);
    console.log(`Upload Route: Parsed ${parts.length} parts.`);

    const orderId = parts.find((p) => p.name === 'orderId')?.value?.trim();
    const filePart = parts.find((p) => p.name === 'file');

    if (!orderId || !filePart || !filePart.data) {
      console.log('Upload Route: Error - Missing orderId or file part');
      return res.status(400).json({ error: 'Missing orderId or file' });
    }

    console.log(`Upload Route: Processing order ${orderId}, file ${filePart.filename || 'unknown'}`);

    // Fetch customer info from Stripe to include in the internal email
    const paymentIntent = await stripe.paymentIntents.retrieve(orderId);
    const meta = paymentIntent.metadata || {};
    const customerName = meta.customerName || 'Unknown Candidate';
    const customerEmail = meta.customerEmail || 'Unknown Email';
    const linkedinUrl = meta.linkedinUrl || 'Not provided';
    const shippingInfo = `
      Address: ${meta.shipLine1 || ''} ${meta.shipLine2 || ''}
      City: ${meta.shipCity || ''}, ${meta.shipState || ''} ${meta.shipPostalCode || ''}
      Country: ${meta.shipCountry || ''}
    `;

    // Send email via Resend
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL is not configured');
    }

    console.log(`Upload Route: Sending comprehensive docket to ${adminEmail}...`);
    await resend.emails.send({
      from: 'Netwearing System <system@upload.netwearing.com>',
      to: adminEmail,
      subject: `[DOCKET] New Candidate Materialization: ${customerName}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2 style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">New Candidate Submission</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <hr />
          <p><strong>Candidate Name:</strong> ${customerName}</p>
          <p><strong>Contact Email:</strong> ${customerEmail}</p>
          <p><strong>LinkedIn Profile:</strong> ${linkedinUrl}</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Shipping Information:</p>
            <pre style="margin: 5px 0;">${shippingInfo}</pre>
          </div>
          <p>The candidate's resume is attached to this email.</p>
        </div>
      `,
      attachments: [
        {
          filename: filePart.filename || 'resume.pdf',
          content: filePart.data,
        },
      ],
    });

    console.log('Upload Route: Updating Stripe metadata...');
    // Update Stripe PaymentIntent metadata securely
    await stripe.paymentIntents.update(orderId, {
      metadata: {
        resumeUploaded: 'true',
        resumeFilename: filePart.filename || 'resume',
      },
    });

    console.log('Upload Route: Success!');
    return res.status(200).json({ success: true });
  } catch (err: unknown) {
    console.error('Upload Route: ERROR:', err);
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
  
  let start = 0;
  while (start < body.length) {
    const boundaryIndex = body.indexOf(boundaryBuffer, start);
    if (boundaryIndex === -1) break;
    
    const sectionStart = boundaryIndex + boundaryBuffer.length;
    let sectionEnd = body.indexOf(boundaryBuffer, sectionStart);
    if (sectionEnd === -1) {
        // Check for closing boundary
        const closingBoundary = Buffer.from(`--${boundary}--`);
        const closeIndex = body.indexOf(closingBoundary, start);
        if (closeIndex !== -1) sectionEnd = closeIndex;
        else break;
    }
    
    const section = body.slice(sectionStart, sectionEnd);
    if (section.length === 0) {
        start = sectionEnd;
        continue;
    }
    
    // Find header-body separator (\r\n\r\n)
    const separator = Buffer.from('\r\n\r\n');
    const separatorIndex = section.indexOf(separator);
    if (separatorIndex === -1) {
        start = sectionEnd;
        continue;
    }
    
    const headerStr = section.slice(0, separatorIndex).toString();
    const data = section.slice(separatorIndex + 4);
    
    // Clean up trailing \r\n from data (multipart spec)
    const cleanData = data.length >= 2 && data[data.length-2] === 0x0D && data[data.length-1] === 0x0A
        ? data.slice(0, data.length - 2)
        : data;

    const part: MultipartPart = {};
    const nameMatch = headerStr.match(/name="([^"]+)"/);
    if (nameMatch) part.name = nameMatch[1];

    const filenameMatch = headerStr.match(/filename="([^"]+)"/);
    if (filenameMatch) part.filename = filenameMatch[1];

    const ctMatch = headerStr.match(/Content-Type:\s*(.+)/i);
    if (ctMatch) part.contentType = ctMatch[1].trim();

    if (part.filename) {
      part.data = cleanData;
    } else {
      part.value = cleanData.toString();
    }

    parts.push(part);
    start = sectionEnd;
  }

  return parts;
}
