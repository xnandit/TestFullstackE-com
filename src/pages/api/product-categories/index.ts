// /pages/api/product-categories/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { 
  fetchProductCategories, 
  createProductCategory, 
  updateProductCategory, 
  deleteProductCategory 
} from '../../../services/productCategoryService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      try {
        const categories = await fetchProductCategories();
        res.status(200).json(categories);
      } catch (error) {
        res.status(500).json({ error: 'Failed to load categories' });
      }
      break;

    case 'POST':
      try {
        const { name, active, created_user } = req.body;
        await createProductCategory({ name, active, created_user });
        res.status(201).json({ message: 'Category created' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
      }
      break;

    case 'PUT':
      try {
        const { id, name, active, updated_user } = req.body;
        await updateProductCategory(id, { name, active, updated_user });
        res.status(200).json({ message: 'Category updated' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await deleteProductCategory(id);
        res.status(200).json({ message: 'Category deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
