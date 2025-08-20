import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message, agree, hp } = req.body;

    if (hp) {
      return res.status(200).json({ ok: true });
    }

    if (!email || !message || !agree) {
      return res.status(400).json({ ok: false, error: 'invalid' });
    }

    const text = [
      'Neue Kontaktanfrage:',
      '',
      `Name: ${name || '–'}`,
      `E-Mail: ${email}`,
      '',
      'Nachricht:',
      message,
    ].join('\n');

    await resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: process.env.CONTACT_TO!,
      subject: `Kontaktanfrage von ${name || 'unbekannt'}`,
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[contact] error:', err);
    return res.status(500).json({ ok: false, error: 'error' });
  }
}
