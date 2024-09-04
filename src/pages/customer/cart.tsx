import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Cart.module.css';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);
  }, []);

  const handleCheckout = () => {
    router.push('/customer/checkout');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={styles.cartList}>
          {cart.map((item, index) => (
            <div key={index} className={styles.cartItem}>
              <h2>{item.variant.name}</h2>
              <p>Quantity: {item.qty}</p>
              <p>Price: {item.variant.price}</p>
            </div>
          ))}
          <button onClick={handleCheckout} className={styles.checkoutButton}>Checkout</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
