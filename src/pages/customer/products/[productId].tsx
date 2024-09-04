import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './ProductVariant.module.css';

const ProductVariantPage = () => {
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { productId } = router.query;

  useEffect(() => {
    if (productId) {
      const loadVariants = async () => {
        try {
          const res = await fetch(`/api/product-variants/${productId}`);
          const data = await res.json();
          setVariants(data);
        } catch (error) {
          console.error("Failed to load product variants", error);
          setError("Failed to load product variants");
        }
      };
      loadVariants();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (selectedVariant) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push({ variant: selectedVariant, qty: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      router.push('/customer/cart');
    } else {
      alert('Please select a variant.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Product Variant</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.variantGrid}>
        {variants.map((variant) => (
          <div key={variant.id} className={styles.variantCard}>
            <h2>{variant.name}</h2>
            <p>Price: {variant.price}</p>
            <p>Available: {variant.qty}</p>
            <button
              onClick={() => setSelectedVariant(variant)}
              className={`${styles.selectButton} ${selectedVariant?.id === variant.id ? styles.selected : ''}`}
            >
              {selectedVariant?.id === variant.id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleAddToCart} className={styles.addToCartButton}>Add to Cart</button>
    </div>
  );
};

export default ProductVariantPage;
