/**
 * Development database server using PGlite.
 * Emulates a PostgreSQL server on port 5433.
 * Data is persisted to .pglite/ directory.
 * Run with: node scripts/dev-db.mjs
 */
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const DATA_DIR = '.pglite';
const PORT = 5433;

if (!existsSync(DATA_DIR)) {
  await mkdir(DATA_DIR, { recursive: true });
}

const db = new PGlite(DATA_DIR);
const server = new PGLiteSocketServer({ db, port: PORT, host: '127.0.0.1' });

await server.start();
console.log(`✅ PGlite dev database listening on postgresql://postgres@localhost:${PORT}/postgres`);
console.log(`   Data stored in: ${DATA_DIR}/`);
console.log(`   Press Ctrl+C to stop.\n`);

process.on('SIGINT', async () => {
  await server.stop();
  process.exit(0);
});
