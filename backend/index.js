// Render (and some Node hosts) default to `node index.js`.
// This file bootstraps the compiled server output.

/* eslint-disable @typescript-eslint/no-var-requires */

try {
  // Prefer compiled output
  require('./dist/server.js');
} catch (err) {
  // Helpful message if build didn't run
  // eslint-disable-next-line no-console
  console.error('Failed to start backend. Did the TypeScript build run?');
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
}
