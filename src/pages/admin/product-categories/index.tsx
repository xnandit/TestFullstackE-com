import { useState, useEffect } from 'react';
import styles from './ProductCategories.module.css';

const ProductCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/product-categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
        setError("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  const handleSave = async () => {
    if (name.trim() === '') {
      alert('Category name cannot be empty');
      return;
    }

    try {
      if (editingId) {
        await fetch('/api/product-categories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: editingId, name, active, updated_user: 'admin' }),
        });
      } else {
        await fetch('/api/product-categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, active, created_user: 'admin' }),
        });
      }
      const updatedCategories = await (await fetch('/api/product-categories')).json();
      setCategories(updatedCategories);
      resetForm();
    } catch (error) {
      console.error("Failed to save category", error);
      setError("Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setActive(category.active);
    setEditingId(category.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch('/api/product-categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const updatedCategories = await (await fetch('/api/product-categories')).json();
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to delete category", error);
      setError("Failed to delete category");
    }
  };

  const resetForm = () => {
    setName('');
    setActive(true);
    setEditingId(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Categories</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.form}>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <li key={category.id} className={styles.categoryItem}>
            <span>{category.name} - {category.active ? 'Active' : 'Inactive'}</span>
            <div>
              <button onClick={() => handleEdit(category)} className={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(category.id)} className={styles.deleteButton}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCategoriesPage;
