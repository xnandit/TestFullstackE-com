// /pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testFE',
  password: 'admin',
  port: 5432,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      client.release();

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Periksa apakah password cocok dengan yang tersimpan (hashed)
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ role: user.role }, 'secret', { expiresIn: '1h' });
      return res.status(200).json({ token, role: user.role });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

export default handler;
