import nodemailer from 'nodemailer';

const SMTP_HOST = (process.env.SMTP_HOST || '').trim();
const SMTP_PORT = Number((process.env.SMTP_PORT || '587').trim()) || 587;
const SMTP_SECURE = ((process.env.SMTP_SECURE || 'false').trim() === 'true');
const SMTP_REQUIRE_TLS = ((process.env.SMTP_REQUIRE_TLS || 'false').trim() === 'true');
const SMTP_USER = (process.env.SMTP_USER || '').trim();
const SMTP_PASS = (process.env.SMTP_PASS || '').trim();
const MAIL_FROM = (process.env.MAIL_FROM || SMTP_USER || '').trim();

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.warn('SMTP configuration is incomplete. Check SMTP_HOST, SMTP_USER and SMTP_PASS in your .env');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  requireTLS: SMTP_REQUIRE_TLS,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

// Verify transporter connectivity once at startup to surface auth/network errors early
transporter.verify()
  .then(() => {
    console.log('SMTP transporter verified');
  })
  .catch(err => {
    // Provide a clear message so it's obvious why sending will fail (bad credentials, network, port)
    console.error('SMTP verification failed. Verify credentials, port and whether the provider allows SMTP access.');
    console.error('SMTP verify error:', err && err.message ? err.message : err);
  });

export async function sendEmail(to: string, subject: string, html: string) {
  const from = MAIL_FROM;
  try {
    const info = await transporter.sendMail({ from, to, subject, html });
    return info;
  } catch (err: any) {
    // Re-throw after logging so callers (controllers) can return a friendly error
    console.error('sendEmail failed:', err && err.message ? err.message : err);
    throw err;
  }
}
