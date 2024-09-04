import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== 'administrator') {
      router.push('/auth/login');
    }
  }, [auth]);

  if (!auth.isAuthenticated || auth.role !== 'administrator') {
    return null; // Jangan render apa pun jika tidak diotorisasi
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/admin/product-categories" className={styles.navLink}>
              Manage Product Categories
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/admin/product" className={styles.navLink}>
              Manage Products
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/admin/manage-transactions" className={styles.navLink}>
              Manage Transactions
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
