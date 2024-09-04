// /services/transactionService.ts
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testFE',
    password: 'admin',
    port: 5432,
});

export interface Transaction {
  id: number;
  transaction_no: string;
  total_amount: number;
  active: boolean;
  created_user: string;
  created_date: string;
  updated_user?: string; // Membuat updated_user opsional
  updated_date: string | null;
}

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM transactions ORDER BY created_date DESC');
    return result.rows.map(row => ({
      ...row,
      created_date: new Date(row.created_date).toISOString(),
      updated_date: row.updated_date ? new Date(row.updated_date).toISOString() : null,
    }));
  } finally {
    client.release();
  }
};

export const createTransaction = async (transaction_no: string, total_amount: number, created_user: string): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO transactions (transaction_no, total_amount, created_user) VALUES ($1, $2, $3)',
      [transaction_no, total_amount, created_user]
    );
  } finally {
    client.release();
  }
};
