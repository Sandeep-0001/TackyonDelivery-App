"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const SMTP_HOST = (process.env.SMTP_HOST || '').trim();
const SMTP_PORT = Number((process.env.SMTP_PORT || '587').trim()) || 587;
const SMTP_SECURE_ENV = (process.env.SMTP_SECURE || '').trim();
const SMTP_REQUIRE_TLS_ENV = (process.env.SMTP_REQUIRE_TLS || '').trim();
const SMTP_TIMEOUT_MS = Number((process.env.SMTP_TIMEOUT_MS || '12000').trim()) || 12000;
const SMTP_TLS_REJECT_UNAUTHORIZED = ((process.env.SMTP_TLS_REJECT_UNAUTHORIZED || 'true').trim() === 'true');
// Sensible defaults:
// - Port 465 typically requires `secure: true`
// - Port 587 typically uses STARTTLS (`secure: false` + `requireTLS: true`)
const SMTP_SECURE = SMTP_SECURE_ENV
    ? (SMTP_SECURE_ENV === 'true')
    : (SMTP_PORT === 465);
const SMTP_REQUIRE_TLS = SMTP_REQUIRE_TLS_ENV
    ? (SMTP_REQUIRE_TLS_ENV === 'true')
    : (SMTP_PORT === 587);
const SMTP_USER = (process.env.SMTP_USER || '').trim();
const SMTP_PASS = (process.env.SMTP_PASS || '').trim();
const MAIL_FROM = (process.env.MAIL_FROM || SMTP_USER || '').trim();
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP configuration is incomplete. Check SMTP_HOST, SMTP_USER and SMTP_PASS in your .env');
}
const transporter = nodemailer_1.default.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    requireTLS: SMTP_REQUIRE_TLS,
    // Fail fast instead of leaving requests hanging when SMTP is misconfigured
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
    tls: {
        rejectUnauthorized: SMTP_TLS_REJECT_UNAUTHORIZED,
    },
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});
function withTimeout(promise, ms, label) {
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => {
        if (timer)
            clearTimeout(timer);
    });
}
// Verify transporter connectivity once at startup to surface auth/network errors early
withTimeout(transporter.verify(), Math.min(8000, SMTP_TIMEOUT_MS), 'SMTP verify')
    .then(() => {
    console.log('SMTP transporter verified');
})
    .catch(err => {
    // Provide a clear message so it's obvious why sending will fail (bad credentials, network, port)
    console.error('SMTP verification failed. Verify credentials, port and whether the provider allows SMTP access.');
    console.error('SMTP verify error:', err && err.message ? err.message : err);
});
async function sendEmail(to, subject, html) {
    const from = MAIL_FROM;
    try {
        const info = await withTimeout(transporter.sendMail({ from, to, subject, html }), SMTP_TIMEOUT_MS, 'SMTP send');
        return info;
    }
    catch (err) {
        // Re-throw after logging so callers (controllers) can return a friendly error
        console.error('sendEmail failed:', err && err.message ? err.message : err);
        throw err;
    }
}
