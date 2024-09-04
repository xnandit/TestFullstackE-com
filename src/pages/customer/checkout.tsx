import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Checkout.module.css';

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    const transaction_no = `TXN${Math.floor(Math.random() * 1000000)}`;
    const total_amount = cartData.reduce((sum, item) => sum + Number(item.variant.price) * item.qty, 0);
    const invoiceData = {
      transaction_no,
      total_amount,
      items: cartData.map(item => ({
        ...item,
        variant: {
          ...item.variant,
          price: Number(item.variant.price) // Convert price to number
        }
      })),
    };
    setInvoice(invoiceData);
    setCart(cartData);

    // Kirim data transaksi ke API
    const saveTransaction = async () => {
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transaction_no,
            total_amount,
            created_user: 'customer', // Sesuaikan dengan user yang sedang login
          }),
        });

        if (res.ok) {
          console.log('Transaction saved successfully');
        } else {
          console.error('Failed to save transaction');
        }
      } catch (error) {
        console.error('Error saving transaction:', error);
      }
    };

    saveTransaction();

    localStorage.removeItem('cart');
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Invoice</h1>
      {invoice ? (
        <div className={styles.invoice}>
          <h2>Transaction No: {invoice.transaction_no}</h2>
          <h3>Total Amount: {invoice.total_amount.toFixed(2)}</h3>
          <ul>
            {invoice.items.map((item, index) => (
              <li key={index}>
                {item.variant.name} - {item.qty} x {item.variant.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CheckoutPage;
