import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testFE',
    password: 'admin',
    port: 5432,
});

export interface ProductCategory {
    id: number;
    name: string;
    active: boolean;
    created_user: string;
    created_date: string;
    updated_user?: string; // Membuat updated_user opsional
    updated_date: string | null;
}

// Get all product categories
export const fetchProductCategories = async (): Promise<ProductCategory[]> => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM product_categories ORDER BY id');
        return result.rows.map(row => ({
            ...row,
            created_date: new Date(row.created_date).toISOString(),
            updated_date: row.updated_date ? new Date(row.updated_date).toISOString() : null,
        }));
    } finally {
        client.release();
    }
};

// Create a new product category
export const createProductCategory = async (category: Omit<ProductCategory, 'id' | 'created_date' | 'updated_date'>): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query(
            'INSERT INTO product_categories (name, active, created_user) VALUES ($1, $2, $3)',
            [category.name, category.active, category.created_user]
        );
    } finally {
        client.release();
    }
};

// Update an existing product category
export const updateProductCategory = async (id: number, category: Partial<ProductCategory>): Promise<void> => {
    const client = await pool.connect();
    try {
        const { name, active, updated_user } = category;
        await client.query(
            `UPDATE product_categories 
       SET name = $1, active = $2, updated_user = $3, updated_date = NOW()
       WHERE id = $4`,
            [name, active, updated_user, id]
        );
    } finally {
        client.release();
    }
};

// Delete a product category
export const deleteProductCategory = async (id: number): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM product_categories WHERE id = $1', [id]);
    } finally {
        client.release();
    }
};
