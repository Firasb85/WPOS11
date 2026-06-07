import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

let dbClient: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!dbClient) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is not set');
    const client = neon(connectionString);
    dbClient = drizzle(client);
  }
  return dbClient;
}

export async function executeQuery(query: string, params?: unknown[]) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  const client = neon(connectionString);
  const result = params ? await client(query, params) : await client(query);
  return { rows: result as Record<string, unknown>[] };
}

export async function queryOne<T = Record<string, unknown>>(query: string, params?: unknown[]): Promise<T | null> {
  const result = await executeQuery(query, params);
  return result.rows.length > 0 ? (result.rows[0] as T) : null;
}

export async function queryMany<T = Record<string, unknown>>(query: string, params?: unknown[]): Promise<T[]> {
  const result = await executeQuery(query, params);
  return result.rows as T[];
}

export async function executeInsert(query: string, params?: unknown[]): Promise<string | null> {
  const result = await executeQuery(query, params);
  return result.rows.length > 0 ? String(result.rows[0].id ?? '') || null : null;
}

export async function checkConnection(): Promise<boolean> {
  try { await executeQuery('SELECT 1'); return true; }
  catch { return false; }
}
