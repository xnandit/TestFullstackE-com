import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Untuk navigasi
import styles from './Product.module.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [plu, setPlu] = useState('');
  const [name, setName] = useState('');
  const [productCategoryId, setProductCategoryId] = useState(0);
  const [active, setActive] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
        setError("Failed to load products");
      }
    };
    loadProducts();
  }, []);

  const handleSave = async () => {
    if (name.trim() === '' || plu.trim() === '') {
      alert('PLU and Name cannot be empty');
      return;
    }

    try {
      if (editingId) {
        await fetch('/api/products', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: editingId, plu, name, product_category_id: productCategoryId, active, updated_user: 'admin' }),
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plu, name, product_category_id: productCategoryId, active, created_user: 'admin' }),
        });
      }
      const updatedProducts = await (await fetch('/api/products')).json();
      setProducts(updatedProducts);
      resetForm();
    } catch (error) {
      console.error("Failed to save product", error);
      setError("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setPlu(product.plu);
    setName(product.name);
    setProductCategoryId(product.product_category_id);
    setActive(product.active);
    setEditingId(product.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const updatedProducts = await (await fetch('/api/products')).json();
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Failed to delete product", error);
      setError("Failed to delete product");
    }
  };

  const handleManageVariants = (productId: number) => {
    router.push(`/admin/product/${productId}/variants`);
  };

  const handleBack = () => {
    router.back(); // Kembali ke halaman sebelumnya
  };

  const resetForm = () => {
    setPlu('');
    setName('');
    setProductCategoryId(0);
    setActive(true);
    setEditingId(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>Back</button>
      <h1 className={styles.title}>Products</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.form}>
        <input
          type="text"
          placeholder="PLU"
          value={plu}
          onChange={(e) => setPlu(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Product Category ID"
          value={productCategoryId}
          onChange={(e) => setProductCategoryId(Number(e.target.value))}
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
      <ul className={styles.productList}>
        {products.map((product) => (
          <li key={product.id} className={styles.productItem}>
            <span>{product.plu} - {product.name} - {product.active ? 'Active' : 'Inactive'}</span>
            <div>
              <button onClick={() => handleEdit(product)} className={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(product.id)} className={styles.deleteButton}>Delete</button>
              <button onClick={() => handleManageVariants(product.id)} className={styles.variantButton}>Manage Variants</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductPage;
