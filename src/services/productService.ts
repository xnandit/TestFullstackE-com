import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testFE',
  password: 'admin',
  port: 5432,
});

export interface Product {
  id: number;
  plu: string;
  name: string;
  product_category_id: number;
  image_location: string; // Menambahkan properti untuk gambar
  qty: number; // Menambahkan properti untuk kuantitas
  active: boolean;
  created_user: string;
  created_date: string;
  updated_user?: string; // Membuat updated_user opsional
  updated_date: string | null;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM products ORDER BY id');
    return result.rows.map(row => ({
      ...row,
      created_date: new Date(row.created_date).toISOString(),
      updated_date: row.updated_date ? new Date(row.updated_date).toISOString() : null,
      image_location: row.image_location, // Menambahkan properti image_location
      qty: row.qty, // Menambahkan properti qty
    }));
  } finally {
    client.release();
  }
};

  
export const createProduct = async (product: Omit<Product, 'id' | 'created_date' | 'updated_date'>): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO products (plu, name, product_category_id, image_location, qty, active, created_user) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        product.plu, 
        product.name, 
        product.product_category_id, 
        product.image_location, 
        product.qty, 
        product.active, 
        product.created_user
      ]
    );
  } finally {
    client.release();
  }
};
  
export const updateProduct = async (id: number, product: Partial<Product>): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE products 
       SET plu = $1, name = $2, product_category_id = $3, image_location = $4, qty = $5, active = $6, updated_user = $7, updated_date = NOW()
       WHERE id = $8`,
      [product.plu, product.name, product.product_category_id, product.image_location, product.qty, product.active, product.updated_user, id]
    );
  } finally {
    client.release();
  }
};

  
  export const deleteProduct = async (id: number): Promise<void> => {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM products WHERE id = $1', [id]);
    } finally {
      client.release();
    }
};
