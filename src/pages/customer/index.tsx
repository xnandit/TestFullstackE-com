import { GetStaticProps } from 'next';
import { FC } from 'react';
import { fetchProducts, Product } from '../../services/productService';
import styles from './CustomerDashboard.module.css';
import { useRouter } from 'next/router';

const CustomerHomePage: FC<{ products: Product[] }> = ({ products }) => {
  const router = useRouter();

  const handleSelectProduct = (productId: number) => {
    router.push(`/customer/products/${productId}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Available Products</h1>
      <div className={styles.productList}>
        {products.map((product) => {
          const createdDate = new Date(product.created_date);
          const updatedDate = product.updated_date ? new Date(product.updated_date) : null;

          return (
            <div key={product.id} className={styles.productCard}>
              <img src={product.image_location} alt={product.name} className={styles.productImage} />
              <h2>{product.name}</h2>
              <p>PLU: {product.plu}</p>
              <p>Available: {product.qty}</p>
              <p>Category ID: {product.product_category_id}</p>
              <p>Status: {product.active ? 'Active' : 'Inactive'}</p>
              <p>
                Created By: {product.created_user} on{' '}
                {isNaN(createdDate.getTime()) ? 'Invalid Date' : createdDate.toLocaleDateString()}
              </p>
              {updatedDate && (
                <p>
                  Updated By: {product.updated_user} on{' '}
                  {isNaN(updatedDate.getTime()) ? 'Invalid Date' : updatedDate.toLocaleDateString()}
                </p>
              )}
              <button onClick={() => handleSelectProduct(product.id)} className={styles.selectButton}>
                Select
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await fetchProducts();

  return {
    props: {
      products,
    },
  };
};

export default CustomerHomePage;
