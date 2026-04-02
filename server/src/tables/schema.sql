-- Admin users
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, 
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Branches
CREATE TABLE branches (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL CHECK (region IN ('Visayas', 'Mindanao', 'Luzon')),
    manager_name VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'maintenance')),
    operating_hours VARCHAR(100),
    
    -- Credentials for Branch Dashboard login
    username VARCHAR(255) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL, 

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('pork', 'chicken', 'beef', 'kbb', 'seafood', 'drinks')), 
    price DECIMAL(10, 2) NOT NULL, 
    description TEXT, 
    is_available BOOLEAN DEFAULT TRUE,
    includes_unli_rice BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    
    -- Relationships
    branch_id INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    
    -- Categorization (Must match the Request Items table)
    unit_measure VARCHAR(20) NOT NULL CHECK (unit_measure IN ('kg', 'pcs', 'packs', 'liters')),
    type VARCHAR(20) NOT NULL CHECK (type IN ('meat', 'drinks', 'rice', 'supplies')),
    
    -- Stock Values
    current_stock_value DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_threshold DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    
    -- Status Logic
    status VARCHAR(20) DEFAULT 'Adequate' CHECK (status IN ('Adequate', 'Low Stock', 'Critical')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- This constraint prevents duplicate rows and allows the ON CONFLICT logic to work.
    CONSTRAINT unique_branch_product UNIQUE (branch_id, product_id)
);

-- Create the custom ENUM type
CREATE TYPE request_priority AS ENUM ('low', 'medium', 'high');

-- Create the "Header" table
CREATE TABLE inventory_requests (
    id SERIAL PRIMARY KEY,
    branch_id INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    priority request_priority DEFAULT 'medium',
    notes TEXT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the "Items" table
CREATE TABLE inventory_request_items (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES inventory_requests(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    unit_measure VARCHAR(20) NOT NULL CHECK (unit_measure IN ('kg', 'pcs', 'packs', 'liters')),
    type VARCHAR(20) NOT NULL CHECK (type IN ('meat', 'drinks', 'rice', 'supplies')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile_number VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the "Orders" table
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'completed');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'online');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refund');

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    branch_id INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    status order_status DEFAULT 'pending',
    payment_meth payment_method DEFAULT 'cash',
    pay_status payment_status DEFAULT 'unpaid',
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    delivery_address TEXT,
    estimated_time INT DEFAULT 30, 
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the "Orders" table
CREATE TYPE items_status AS ENUM ('pending', 'preparing', 'ready', 'served', 'cancelled');

CREATE TABLE order_items (
	id SERIAL PRIMARY KEY,
	order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
	product_id INT NOT NULL REFERENCES products(id),
	quantity INT NOT NULL DEFAULT 1,
	unit_price DECIMAL(10, 2) NOT NULL,
	item_total DECIMAL(10, 2) NOT NULL,
	special_instructions TEXT,
	items_status items_status DEFAULT 'pending',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TYPE staff_role AS ENUM ('manager', 'staff');
CREATE TYPE staff_status AS ENUM ('On Duty', 'Scheduled', 'Off Duty');

-- The Staff Table
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    role staff_role DEFAULT 'staff',
    status staff_status DEFAULT 'Scheduled',
    contact VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    
    -- Link this staff to a specific branch
    branch_id INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    -- Security (If they need to log in to the branch dashboard)
    password VARCHAR(255) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create the custom label type
CREATE TYPE address_label AS ENUM ('Home', 'Work', 'Others');

-- Create the address table
CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label address_label DEFAULT 'Home',
    street VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zipcode VARCHAR(20) NOT NULL, -- Changed from INT to VARCHAR
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT true, -- Added 'BOOLEAN' keyword
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. The Cart Header (One cart per user)
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    branch_id INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    -- Use DECIMAL for money, not INT
    subtotal DECIMAL(10, 2) DEFAULT 0.00,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. The Cart Items (The specific food in the cart)
CREATE TABLE carts_items (
    id SERIAL PRIMARY KEY,
    -- LINK TO THE CART ID, NOT THE USER ID
    cart_id INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    
    quantity INT NOT NULL DEFAULT 1,
    
    -- Optional: Add price here to make calculations easier in the frontend
    unit_price DECIMAL(10, 2), 
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- This prevents the same product appearing twice in the same cart
    CONSTRAINT unique_cart_item UNIQUE (cart_id, product_id)
);