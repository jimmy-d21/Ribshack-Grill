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