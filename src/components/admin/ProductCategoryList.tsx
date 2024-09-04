import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductCategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get('/api/product-categories');
      setCategories(response.data);
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Product Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCategoryList;
