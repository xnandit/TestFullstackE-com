import { useState, useEffect } from 'react';
import styles from './ManageTransactions.module.css';

const ManageTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await fetch('/api/transactions');
        const data = await res.json();
        const formattedData = data.map(transaction => ({
          ...transaction,
          total_amount: Number(transaction.total_amount), // Convert total_amount to number
        }));
        setTransactions(formattedData);
      } catch (error) {
        console.error("Failed to load transactions", error);
        setError("Failed to load transactions");
      }
    };
    loadTransactions();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Transactions</h1>
      {error && <p className={styles.error}>{error}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Transaction No</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Created Date</th>
            <th>Updated By</th>
            <th>Updated Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.transaction_no}</td>
              <td>{transaction.total_amount.toFixed(2)}</td>
              <td>{transaction.active ? 'Active' : 'Inactive'}</td>
              <td>{transaction.created_user}</td>
              <td>{new Date(transaction.created_date).toLocaleDateString()}</td>
              <td>{transaction.updated_user || '-'}</td>
              <td>{transaction.updated_date ? new Date(transaction.updated_date).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTransactionsPage;
