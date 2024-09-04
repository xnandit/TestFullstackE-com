// /pages/api/products/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../../services/productService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      try {
        const products = await fetchProducts();
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load products' });
      }
      break;

    case 'POST':
      try {
        const { plu, name, product_category_id, image_location, qty, active, created_user } = req.body;
        await createProduct({ plu, name, product_category_id, image_location, qty, active, created_user });
        res.status(201).json({ message: 'Product created' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
      }
      break;

    case 'PUT':
      try {
        const { id, plu, name, product_category_id, image_location, qty, active, updated_user } = req.body;
        await updateProduct(id, { plu, name, product_category_id, image_location, qty, active, updated_user });
        res.status(200).json({ message: 'Product updated' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await deleteProduct(id);
        res.status(200).json({ message: 'Product deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
