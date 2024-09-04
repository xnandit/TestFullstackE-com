CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    plu VARCHAR(50) NOT NULL, -- Product Lookup Code
    name VARCHAR(255) NOT NULL,
    product_category_id INT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_user VARCHAR(100) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_user VARCHAR(100),
    updated_date TIMESTAMP
);


INSERT INTO products (plu, name, product_category_id, active, created_user, created_date, updated_user, updated_date) VALUES
('PLU001', 'Nike Shoes', 1, TRUE, 'admin', '2024-08-01 10:00:00', 'admin', '2024-08-10 12:00:00'),
('PLU002', 'Adidas Sneakers', 1, TRUE, 'admin', '2024-08-02 11:00:00', 'admin', '2024-08-11 13:00:00'),
('PLU003', 'Puma Running Shoes', 1, TRUE, 'admin', '2024-08-03 12:00:00', 'admin', '2024-08-12 14:00:00'),
('PLU004', 'Levi Jeans', 2, TRUE, 'admin', '2024-08-04 13:00:00', 'admin', '2024-08-13 15:00:00'),
('PLU005', 'Uniqlo T-Shirt', 2, TRUE, 'admin', '2024-08-05 14:00:00', 'admin', '2024-08-14 16:00:00'),
('PLU006', 'Samsung Galaxy S21', 3, TRUE, 'admin', '2024-08-06 15:00:00', 'admin', '2024-08-15 17:00:00'),
('PLU007', 'Apple iPhone 13', 3, TRUE, 'admin', '2024-08-07 16:00:00', 'admin', '2024-08-16 18:00:00'),
('PLU008', 'Sony WH-1000XM4', 3, TRUE, 'admin', '2024-08-08 17:00:00', 'admin', '2024-08-17 19:00:00'),
('PLU009', 'Logitech MX Master 3', 4, TRUE, 'admin', '2024-08-09 18:00:00', 'admin', '2024-08-18 20:00:00'),
('PLU010', 'Bose QuietComfort 35', 4, TRUE, 'admin', '2024-08-10 19:00:00', 'admin', '2024-08-19 21:00:00');
	
ALTER TABLE products
ADD COLUMN rating DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
ADD COLUMN total_beli INT NOT NULL DEFAULT 0;


CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_user VARCHAR(50) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_user VARCHAR(50),
    updated_date TIMESTAMP
);


CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    image_location VARCHAR(255),
    qty INT DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_user VARCHAR(50) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_user VARCHAR(50),
    updated_date TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_no VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_user VARCHAR(50) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_user VARCHAR(50),
    updated_date TIMESTAMP
);

ALTER TABLE products ADD COLUMN image_location VARCHAR(255);
ALTER TABLE products ADD COLUMN qty INT;


INSERT INTO product_variants (
    product_id, 
    code, 
    name, 
    image_location, 
    qty, 
    price, 
    active, 
    created_user, 
    updated_user, 
    updated_date
) VALUES 
(
    1, 
    'VAR001', 
    'Nike Shoes - Red', 
    '/images/nike_red.jpg', 
    50, 
    99.99, 
    TRUE, 
    'admin', 
    'admin', 
    CURRENT_TIMESTAMP
),
(
    2, 
    'VAR002', 
    'Adidas Sneakers - Blue', 
    '/images/adidas_blue.jpg', 
    75, 
    89.99, 
    TRUE, 
    'admin', 
    'admin', 
    CURRENT_TIMESTAMP
),
(
    3, 
    'VAR003', 
    'Puma Running Shoes - Green', 
    '/images/puma_green.jpg', 
    100, 
    79.99, 
    TRUE, 
    'admin', 
    'admin', 
    CURRENT_TIMESTAMP
),
(
    4, 
    'VAR004', 
    'Levi Jeans - Black', 
    '/images/levi_black.jpg', 
    150, 
    59.99, 
    TRUE, 
    'admin', 
    'admin', 
    CURRENT_TIMESTAMP
),
(
    5, 
    'VAR005', 
    'Uniqlo T-Shirt - White', 
    '/images/uniqlo_white.jpg', 
    200, 
    29.99, 
    TRUE, 
    'admin', 
    'admin', 
    CURRENT_TIMESTAMP
);


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Pastikan password dienkripsi (hashed)
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, role) VALUES
('admin', '$2b$10$7sGpQH1P7F/JZwKGHpJu9Oy5rKJ9s7nZzQwR9H.MDYOI1mQfOF1iC', 'administrator'), -- Ganti dengan hash password yang dihasilkan untuk admin
('customer', '$2b$10$gW8I1RZp4y/ZfHo3iwkVmeXwZPm/VjGJzG0pdOk0tfl/uIGOPvAXK', 'customer'); 

