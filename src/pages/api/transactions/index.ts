// /pages/api/transactions/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createTransaction, fetchTransactions } from '../../../services/transactionService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { transaction_no, total_amount, created_user } = req.body;

    try {
      await createTransaction(transaction_no, total_amount, created_user);
      res.status(201).json({ message: 'Transaction saved successfully' });
    } catch (error) {
      console.error('Failed to save transaction:', error);
      res.status(500).json({ error: 'Failed to save transaction' });
    }
  } else if (req.method === 'GET') {
    try {
      const transactions = await fetchTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
