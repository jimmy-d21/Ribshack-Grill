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