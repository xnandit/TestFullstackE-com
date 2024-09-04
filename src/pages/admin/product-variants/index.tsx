import { useState, useEffect } from 'react';
import styles from './ProductVariant.module.css';

const ProductVariantPage = ({ productId }) => {
  const [variants, setVariants] = useState([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [imageLocation, setImageLocation] = useState('');
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const [active, setActive] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVariants = async () => {
      try {
        const res = await fetch(`/api/product-variants?productId=${productId}`);
        const data = await res.json();
        setVariants(data);
      } catch (error) {
        console.error("Failed to load product variants", error);
        setError("Failed to load product variants");
      }
    };
    loadVariants();
  }, [productId]);

  const handleSave = async () => {
    if (code.trim() === '' || name.trim() === '') {
      alert('Code and Name cannot be empty');
      return;
    }

    try {
      if (editingId) {
        await fetch('/api/product-variants', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: editingId, code, name, image_location: imageLocation, qty, price, active, updated_user: 'admin' }),
        });
      } else {
        await fetch('/api/product-variants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id: productId, code, name, image_location: imageLocation, qty, price, active, created_user: 'admin' }),
        });
      }
      const updatedVariants = await (await fetch(`/api/product-variants?productId=${productId}`)).json();
      setVariants(updatedVariants);
      resetForm();
    } catch (error) {
      console.error("Failed to save product variant", error);
      setError("Failed to save product variant");
    }
  };

  const handleEdit = (variant) => {
    setCode(variant.code);
    setName(variant.name);
    setImageLocation(variant.image_location);
    setQty(variant.qty);
    setPrice(variant.price);
    setActive(variant.active);
    setEditingId(variant.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch('/api/product-variants', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const updatedVariants = await (await fetch(`/api/product-variants?productId=${productId}`)).json();
      setVariants(updatedVariants);
    } catch (error) {
      console.error("Failed to delete product variant", error);
      setError("Failed to delete product variant");
    }
  };

  const resetForm = () => {
    setCode('');
    setName('');
    setImageLocation('');
    setQty(0);
    setPrice(0);
    setActive(true);
    setEditingId(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Variants</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.form}>
        <input
          type="text"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Variant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Image Location"
          value={imageLocation}
          onChange={(e) => setImageLocation(e.target.value)}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className={styles.input}
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Active
        </label>
        <button onClick={handleSave} className={styles.saveButton}>
          {editingId ? 'Update' : 'Create'}
        </button>
        {editingId && <button onClick={resetForm} className={styles.cancelButton}>Cancel</button>}
      </div>
      <ul className={styles.variantList}>
        {variants.map((variant) => (
          <li key={variant.id} className={styles.variantItem}>
            <span>{variant.code} - {variant.name} - {variant.active ? 'Active' : 'Inactive'}</span>
            <div>
              <button onClick={() => handleEdit(variant)} className={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(variant.id)} className={styles.deleteButton}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductVariantPage;
