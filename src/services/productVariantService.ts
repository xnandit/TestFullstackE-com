import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testFE',
    password: 'admin',
    port: 5432,
});

export interface ProductVariant {
    id: number;
    product_id: number;
    code: string;
    name: string;
    image_location: string;
    qty: number;
    price: number;
    active: boolean;
    created_user: string;
    created_date: string;
    updated_user?: string; // Membuat updated_user opsional
    updated_date: string | null;
}

export const fetchProductVariants = async (productId: number): Promise<ProductVariant[]> => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM product_variants WHERE product_id = $1 ORDER BY id', [productId]);
        return result.rows.map(row => ({
            ...row,
            created_date: new Date(row.created_date).toISOString(),
            updated_date: row.updated_date ? new Date(row.updated_date).toISOString() : null,
        }));
    } catch (error) {
        console.error('Error fetching product variants:', error);
        throw error; // Re-throw error to be handled by the caller
    } finally {
        client.release();
    }
};

export const createProductVariant = async (variant: Omit<ProductVariant, 'id' | 'created_date' | 'updated_date'>): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        await client.query(
            'INSERT INTO product_variants (product_id, code, name, image_location, qty, price, active, created_user) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [variant.product_id, variant.code, variant.name, variant.image_location, variant.qty, variant.price, variant.active, variant.created_user]
        );

        await client.query('COMMIT'); // Commit transaction
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction in case of error
        console.error('Error creating product variant:', error);
        throw error;
    } finally {
        client.release();
    }
};

export const updateProductVariant = async (id: number, variant: Partial<ProductVariant>): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        await client.query(
            `UPDATE product_variants 
            SET code = $1, name = $2, image_location = $3, qty = $4, price = $5, active = $6, updated_user = $7, updated_date = NOW()
            WHERE id = $8`,
            [variant.code, variant.name, variant.image_location, variant.qty, variant.price, variant.active, variant.updated_user, id]
        );

        await client.query('COMMIT'); // Commit transaction
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction in case of error
        console.error('Error updating product variant:', error);
        throw error;
    } finally {
        client.release();
    }
};

export const deleteProductVariant = async (id: number): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        await client.query('DELETE FROM product_variants WHERE id = $1', [id]);

        await client.query('COMMIT'); // Commit transaction
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction in case of error
        console.error('Error deleting product variant:', error);
        throw error;
    } finally {
        client.release();
    }
};
