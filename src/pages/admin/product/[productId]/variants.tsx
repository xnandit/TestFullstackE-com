import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../Product.module.css';

const ProductVariantPage = () => {
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [imageLocation, setImageLocation] = useState('');
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { productId } = router.query;
  console.log(productId);


  useEffect(() => {
    if (productId) {
      const loadVariants = async () => {
        try {
          const response = await fetch(`/api/product-variants/${productId}`);
          const data = await response.json();
          // Pastikan price adalah number
          const formattedData = data.map(variant => ({
            ...variant,
            price: Number(variant.price) || 0, // Convert to number or default to 0
          }));
          setVariants(formattedData);
        } catch (error) {
          console.error('Failed to load product variants:', error);
        }
      };
      loadVariants();
    }
  }, [productId]);
  
  const handleSave = async () => {
    if (!name || !code || !imageLocation || qty <= 0 || price <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }

    setLoading(true);
    try {
      if (selectedVariant) {
        await fetch(`/api/product-variants/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedVariant.id, code, name, image_location: imageLocation, qty, price, active, updated_user: 'admin' }),
        });
      } else {
        await fetch(`/api/product-variants/${productId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: Number(productId), code, name, image_location: imageLocation, qty, price, active, created_user: 'admin' }),
        });
      }
      const updatedVariants = await fetch(`/api/product-variants/${productId}`).then(res => res.json());
      setVariants(updatedVariants);
      resetForm();
    } catch (error) {
      console.error('Failed to save variant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (variant) => {
    setSelectedVariant(variant);
    setName(variant.name);
    setCode(variant.code);
    setImageLocation(variant.image_location);
    setQty(variant.qty);
    setPrice(variant.price);
    setActive(variant.active);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;

    setLoading(true);
    try {
      await fetch(`/api/product-variants/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const updatedVariants = await fetch(`/api/product-variants/${productId}`).then(res => res.json());
      setVariants(updatedVariants);
    } catch (error) {
      console.error('Failed to delete variant:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedVariant(null);
    setName('');
    setCode('');
    setImageLocation('');
    setQty(0);
    setPrice(0);
    setActive(true);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Product Variants</h1>
      <div className={styles.form}>
        <input type="text" placeholder="Variant Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Variant Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <input type="text" placeholder="Image Location" value={imageLocation} onChange={(e) => setImageLocation(e.target.value)} />
        <input type="number" placeholder="Quantity" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        <label>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active
        </label>
        <button onClick={handleSave} disabled={loading}>
          {selectedVariant ? 'Update Variant' : 'Create Variant'}
        </button>
      </div>
      <ul className={styles.variantList}>
        {variants && variants.length > 0 ? (
          variants.map((variant) => {
            const price = Number(variant.price) || 0; // Pastikan price adalah number
            return (
              <li key={variant.id} className={styles.variantItem}>
                <span>{variant.name} - {variant.code} - ${price.toFixed(2)}</span>
                <button onClick={() => handleEdit(variant)} disabled={loading}>Edit</button>
                <button onClick={() => handleDelete(variant.id)} disabled={loading}>Delete</button>
              </li>
            );
          })
        ) : (
          <p>No variants available.</p>
        )}
      </ul>
    </div>
  );
};

export default ProductVariantPage;
