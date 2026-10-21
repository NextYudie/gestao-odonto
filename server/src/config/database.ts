import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

let pool: mysql.Pool | null = null;

export const createConnection = async (): Promise<void> => {
  if (pool) return;

  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'clinic_management',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z',
    dateStrings: false,
  });

  // Test the connection
  const connection = await pool.getConnection();
  connection.release();
};

export const getPool = (): mysql.Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call createConnection() first.');
  }
  return pool;
};

export const closeConnection = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('📪 Database connection pool closed');
  }
};

/**
 * Executes a SQL query and returns all matching rows.
 */
export const executeQuery = async <T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> => {
  const db = getPool();
  const [rows] = await db.execute<mysql.RowDataPacket[]>(query, params);
  return rows as unknown as T[];
};

/**
 * Executes a SQL query and returns only the first row, or null if not found.
 */
export const executeQuerySingle = async <T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> => {
  const rows = await executeQuery<T>(query, params);
  return rows[0] ?? null;
};

/**
 * Executes a modifying SQL query (INSERT, UPDATE, DELETE).
 * Returns the mysql2 ResultSetHeader with insertId, affectedRows, etc.
 */
export const executeMutation = async (
  query: string,
  params: any[] = []
): Promise<mysql.ResultSetHeader> => {
  const db = getPool();
  const [result] = await db.execute<mysql.ResultSetHeader>(query, params);
  return result;
};

/**
 * Executes multiple queries in a single transaction.
 * Rolls back automatically on error.
 */
export const executeTransaction = async (
  queries: Array<{ query: string; params?: any[] }>
): Promise<mysql.ResultSetHeader[]> => {
  const db = getPool();
  const connection = await db.getConnection();
  const results: mysql.ResultSetHeader[] = [];

  try {
    await connection.beginTransaction();

    for (const { query, params = [] } of queries) {
      const [result] = await connection.execute<mysql.ResultSetHeader>(query, params);
      results.push(result);
    }

    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
