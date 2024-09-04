import { NextApiRequest, NextApiResponse } from 'next';
import { 
  fetchProductVariants, 
  createProductVariant, 
  updateProductVariant, 
  deleteProductVariant 
} from '../../../services/productVariantService';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { productId } = req.query;

  // Validasi productId
  if (!productId || isNaN(Number(productId))) {
    return res.status(400).json({ error: 'Invalid or missing productId' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const variants = await fetchProductVariants(Number(productId));
        if (variants.length > 0) {
          res.status(200).json(variants);
        } else {
          res.status(404).json({ error: 'No product variants found' });
        }
      } catch (error) {
        console.error('Failed to load product variants:', error);
        res.status(500).json({ error: 'Failed to load product variants' });
      }
      break;

    case 'POST':
      try {
        const { code, name, image_location, qty, price, active, created_user } = req.body;
        await createProductVariant({ product_id: Number(productId), code, name, image_location, qty, price, active, created_user });
        res.status(201).json({ message: 'Product variant created' });
      } catch (error) {
        console.error('Failed to create product variant:', error);
        res.status(500).json({ error: 'Failed to create product variant' });
      }
      break;

    case 'PUT':
      try {
        const { id, code, name, image_location, qty, price, active, updated_user } = req.body;
        await updateProductVariant(id, { code, name, image_location, qty, price, active, updated_user });
        res.status(200).json({ message: 'Product variant updated' });
      } catch (error) {
        console.error('Failed to update product variant:', error);
        res.status(500).json({ error: 'Failed to update product variant' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await deleteProductVariant(id);
        res.status(200).json({ message: 'Product variant deleted' });
      } catch (error) {
        console.error('Failed to delete product variant:', error);
        res.status(500).json({ error: 'Failed to delete product variant' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
