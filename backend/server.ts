import dotenv from 'dotenv';
dotenv.config(); // Load .env variables FIRST before any other imports

import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI!; // "!" tells TypeScript it's not undefined

function toBoolean(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) return defaultValue;
  return ['1', 'true', 'yes', 'y', 'on'].includes(value.trim().toLowerCase());
}

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

async function ping(url: string): Promise<void> {
  try {
    if (typeof fetch === 'function') {
      await fetch(url, { method: 'GET' });
      return;
    }
  } catch {
    // ignore
  }

  // Fallback for environments without global fetch
  await new Promise<void>((resolve) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { request } = require(url.startsWith('https') ? 'https' : 'http');
      const req = request(url, { method: 'GET' }, (res: any) => {
        res.resume();
        resolve();
      });
      req.on('error', () => resolve());
      req.end();
    } catch {
      resolve();
    }
  });
}

function startWakeupLoop(): void {
  const enabled = toBoolean(process.env.WAKEUP_ENABLED, false);
  if (!enabled) return;

  const intervalMs = Number(process.env.WAKEUP_INTERVAL_MS || 14 * 60 * 1000);
  const explicitUrl = process.env.WAKEUP_URL;
  const baseUrl = process.env.BACKEND_URL || process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL;

  const target = explicitUrl
    ? explicitUrl
    : baseUrl
      ? `${normalizeBaseUrl(baseUrl)}/health`
      : undefined;

  if (!target) {
    console.warn('[wakeup] WAKEUP_ENABLED is true but no WAKEUP_URL or BACKEND_URL/PUBLIC_URL/RENDER_EXTERNAL_URL provided.');
    return;
  }

  const safeInterval = Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 14 * 60 * 1000;
  console.log(`[wakeup] Enabled. Pinging: ${target} every ${safeInterval}ms`);

  const tick = async () => {
    await ping(target);
  };

  // Fire once shortly after startup, then on interval
  setTimeout(tick, 5_000).unref?.();
  setInterval(tick, safeInterval).unref?.();
}

mongoose.connect(MONGO_URI) //  removed old options
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startWakeupLoop();
    });
  })
  .catch((err: unknown) => {
    console.error('Database connection error:', err);
  });
