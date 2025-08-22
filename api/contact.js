// Laufzeit fest auf Node (kein Edge)
module.exports.config = { runtime: 'nodejs' };

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS,GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}
function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }
function errDetail(e) {
  // Resend liefert häufig { name, message, statusCode, details, ... }
  if (!e) return 'unknown';
  if (typeof e === 'string') return e;
  if (e.message) return e.message;
  if (e.details) return typeof e.details === 'string' ? e.details : JSON.stringify(e.details);
  try { return JSON.stringify(e); } catch { return String(e); }
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  // Debug-GET: zeigt ENV-Flags
  if (req.method === 'GET') {
    return sendJson(res, 200, {
      ok: true,
      node: process.version,
      env: {
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        CONTACT_TO: !!process.env.CONTACT_TO,
        MAIL_FROM: !!process.env.MAIL_FROM,
      },
    });
  }

  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method_not_allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') body = safeParse(body);
    body = body || {};
    const { name, email, message, agree, hp } = body;

    if (hp) return sendJson(res, 200, { ok: true }); // Honeypot

    if (!email || !message || agree !== true) {
      return sendJson(res, 400, { ok: false, error: 'invalid_payload' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO = process.env.CONTACT_TO;
    const MAIL_FROM = process.env.MAIL_FROM || 'TrueScale <onboarding@resend.dev>';

    if (!RESEND_API_KEY || !CONTACT_TO || !MAIL_FROM) {
      return sendJson(res, 500, { ok: false, error: 'missing_env' });
    }

    let Resend;
    try { ({ Resend } = require('resend')); }
    catch (e) {
      console.error('[contact] resend require failed:', e);
      return sendJson(res, 500, { ok: false, error: 'resend_missing', detail: errDetail(e) });
    }

    const resend = new Resend(RESEND_API_KEY);

    const text = [
      'Neue Kontaktanfrage:',
      `Name: ${name || '–'}`,
      `E-Mail: ${email}`,
      '',
      'Nachricht:',
      message,
    ].join('\n');

    try {
      const { data, error } = await resend.emails.send({
        from: MAIL_FROM,
        to: CONTACT_TO,
        subject: `Kontaktanfrage von ${name || 'unbekannt'}`,
        replyTo: email,
        text,
      });

      if (error) {
        console.error('[contact] resend error:', error);
        return sendJson(res, 502, { ok: false, error: 'mail_failed', detail: errDetail(error) });
      }

      return sendJson(res, 200, { ok: true, id: data && data.id ? data.id : undefined });
    } catch (err) {
      console.error('[contact] resend send threw:', err);
      return sendJson(res, 502, { ok: false, error: 'mail_failed', detail: errDetail(err) });
    }
  } catch (err) {
    console.error('[contact] unhandled error:', err);
    return sendJson(res, 500, { ok: false, error: 'internal_error', detail: errDetail(err) });
  }
};
