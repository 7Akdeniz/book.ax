/**
 * 🐘 Direct PostgreSQL Client
 * 
 * Verwendet für lokale Entwicklung direkt PostgreSQL (Port 5433)
 * statt Supabase. Für Production wird weiterhin Supabase verwendet.
 * 
 * Usage:
 *   import { query } from '@/lib/db/postgres';
 *   const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
 */

import { Pool, QueryResult, QueryResultRow } from 'pg';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const hasLocalDB = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost');

// Create connection pool
let pool: Pool | null = null;

/**
 * Get or create PostgreSQL connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    console.log('🐘 Initializing PostgreSQL connection pool...');
    console.log('📍 Database URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')); // Hide password

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum number of clients in pool
      idleTimeoutMillis: 30000, // Close idle clients after 30s
      connectionTimeoutMillis: 5000, // Connection timeout 5s
    });

    // Error handling
    pool.on('error', (err: Error) => {
      console.error('💥 Unexpected PostgreSQL pool error:', err);
    });

    // Connection success
    pool.on('connect', () => {
      console.log('✅ PostgreSQL client connected');
    });
  }

  return pool;
}

/**
 * Execute a database query
 * 
 * @param text SQL query with $1, $2, etc. placeholders
 * @param params Array of parameter values
 * @returns Query result
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 100ms)
    if (duration > 100) {
      console.warn(`⚠️ Slow query (${duration}ms):`, text.substring(0, 100));
    }
    
    return result;
  } catch (error) {
    console.error('💥 Database query error:', error);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Get a client from the pool (for transactions)
 * 
 * Usage:
 *   const client = await getClient();
 *   try {
 *     await client.query('BEGIN');
 *     await client.query('INSERT INTO ...');
 *     await client.query('UPDATE ...');
 *     await client.query('COMMIT');
 *   } catch (e) {
 *     await client.query('ROLLBACK');
 *     throw e;
 *   } finally {
 *     client.release();
 *   }
 */
export async function getClient() {
  const pool = getPool();
  return pool.connect();
}

/**
 * Close the connection pool (for graceful shutdown)
 */
export async function closePool() {
  if (pool) {
    console.log('🔌 Closing PostgreSQL connection pool...');
    await pool.end();
    pool = null;
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW() as now, version() as version');
    console.log('✅ PostgreSQL connection successful!');
    console.log('⏰ Server time:', result.rows[0].now);
    console.log('🐘 Version:', result.rows[0].version.split(' ')[0], result.rows[0].version.split(' ')[1]);
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    return false;
  }
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    await closePool();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await closePool();
    process.exit(0);
  });
}

// Export default object
export default {
  query,
  getClient,
  getPool,
  closePool,
  testConnection,
};
