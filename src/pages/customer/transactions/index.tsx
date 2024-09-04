import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useRouter } from 'next/router';
import styles from './Transactions.module.css';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== 'customer') {
      router.push('/auth/login');
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/customer/transactions', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [auth, router]);

  if (!auth.isAuthenticated || auth.role !== 'customer') {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Transactions</h1>
      <ul className={styles.transactionList}>
        {transactions.map((transaction) => (
          <li key={transaction.id} className={styles.transactionItem}>
            Transaction #{transaction.transaction_no} - ${transaction.total_amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;
