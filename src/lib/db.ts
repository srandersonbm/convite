import { Pool, type QueryResultRow } from "pg";

declare global {
  var __pgPool: Pool | undefined;
  var __schemaReady: Promise<void> | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não configurada. Defina a variável de ambiente com a connection string do Postgres."
    );
  }
  // Neon/most managed Postgres providers require SSL; local dev (PGlite proxy) does not.
  const needsSsl = !/localhost|127\.0\.0\.1/.test(connectionString);
  return new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });
}

function getPool(): Pool {
  if (!global.__pgPool) {
    global.__pgPool = createPool();
  }
  return global.__pgPool;
}

async function ensureSchema(): Promise<void> {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS invite_links (
      id BIGSERIAL PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      guest_label TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      confirmed_name TEXT,
      confirmed_at TIMESTAMPTZ
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS invite_links_token_idx ON invite_links (token);
  `);
}

// Runs once per warm serverless instance / dev process.
function schemaReady(): Promise<void> {
  if (!global.__schemaReady) {
    global.__schemaReady = ensureSchema();
  }
  return global.__schemaReady;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  await schemaReady();
  const pool = getPool();
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export type InviteStatus = "pending" | "confirmed" | "revoked";

export interface InviteLink {
  id: number;
  token: string;
  guest_label: string;
  status: InviteStatus;
  created_at: string;
  confirmed_name: string | null;
  confirmed_at: string | null;
}
