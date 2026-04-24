import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  items,
  evidenceType,
  evidenceValue,
}: {
  to: string;
  customerName: string;
  orderId: string;
  items: string[];
  evidenceType: 'LinkedIn URL' | 'Résumé Attachment';
  evidenceValue?: string;
}) {
  const { data, error } = await resend.emails.send({
    from: 'Netwearing™ Recruitment <recruitment@upload.netwearing.com>',
    to: [to],
    subject: `APPLICATION RECEIVED: Reference #${orderId.slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; color: #1c1c1c; border: 1px solid #e0ddd8; padding: 40px; background-color: #f3f2ef;">
        <div style="text-align: center; border-bottom: 2px solid #e0ddd8; padding-bottom: 20px; mb-4;">
          <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 2px;">OFFICIAL CORRESPONDENCE</div>
          <h1 style="font-size: 24px; font-weight: bold; margin-top: 10px;">CANDIDATE ACKNOWLEDGMENT</h1>
        </div>
        
        <p style="font-size: 14px; margin-top: 30px;">
          Dear <strong>${customerName}</strong>,
        </p>
        
        <p style="font-size: 14px; line-height: 1.6;">
          Your application for professional materialization has been successfully processed. Our algorithms are currently reviewing the following evidence for synergistic alignment with our manufacturing standards:
        </p>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 4px; margin: 25px 0; border: 1px dashed #0a66c2;">
          <h2 style="font-size: 12px; color: #0a66c2; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">CREDENTIAL EVIDENCE</h2>
          <p style="font-size: 13px; margin-bottom: 5px;"><strong>Status:</strong> [RECEIVED]</p>
          <p style="font-size: 13px; margin-bottom: 20px;"><strong>Source:</strong> ${evidenceType} ${evidenceValue ? `(${evidenceValue})` : ''}</p>

          <h2 style="font-size: 12px; color: #0a66c2; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">ORDER DOCKET</h2>
          <ul style="list-style: none; padding: 0; font-size: 13px;">
            ${items.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
          <p style="font-size: 11px; color: #666; margin-top: 15px;">
            Reference ID: ${orderId}
          </p>
        </div>

        <p style="font-size: 14px; line-height: 1.6;">
          Your physical credentials will be dispatched via secure courier. You will receive a follow-up notification once your professional history has been bonded to 100% ring-spun cotton.
        </p>

        <p style="font-size: 14px; margin-top: 30px; border-top: 1px solid #e0ddd8; pt-20px;">
          Regards,<br />
          <strong>Netwearing™ Talent Acquisition Bot</strong>
        </p>

        <div style="text-align: center; font-size: 10px; color: #999; margin-top: 40px;">
          © 2026 Netwearing™ · Synergistic Bureaucracy in Motion
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Error sending email:', error);
    throw error;
  }

  return data;
}
