import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, pdfBase64, userName } = req.body;

  if (!email || !pdfBase64) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const firstName = userName && userName !== 'User' ? userName.split(' ')[0] : 'there';

    const result = await resend.emails.send({
      from: 'hello@hello.absovex.com',
      to: email,
      subject: 'Your ABSOVEX Health Stack Report',
      html: `
        <h2>Your Personalized Report is Ready</h2>
        <p>Hi ${firstName},</p>
        <p>Your ABSOVEX Health Stack Report is attached. This report is personalized based on the information you provided about your medications, supplements, and daily routine.</p>
        <p>Remember to consult a physician or licensed pharmacist before making any changes to your medication or supplement routine.</p>
        <p>Best regards,<br/>The ABSOVEX Team</p>
      `,
      attachments: [
        {
          filename: 'Absovex_Health_Stack_Report.pdf',
          content: Buffer.from(pdfBase64, 'base64')
        }
      ]
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return res.status(500).json({ success: false, error: result.error });
    }

    console.log('Email sent successfully:', result.id);
    return res.status(200).json({ success: true, messageId: result.id });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
