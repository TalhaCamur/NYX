-- Create products table
-- Run this in Supabase SQL Editor

-- Drop existing table if exists
DROP TABLE IF EXISTS products CASCADE;

-- Create new products table with snake_case column names
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    sku TEXT,
    images TEXT[],
    specs JSONB,
    features TEXT[],
    slug TEXT,
    tag_line TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Add test data
INSERT INTO products (name, description, price, original_price, images, is_featured, is_visible, features, tag_line, stock) VALUES
('Smart Home Hub', 'Control your entire smart home', 299.99, 399.99, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'], true, true, ARRAY['WiFi', 'Bluetooth', 'Voice Control'], 'Smart Control', 10),
('Smart Light Bulb', 'WiFi enabled smart lighting', 29.99, 39.99, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'], true, true, ARRAY['WiFi', 'Dimmable', 'Color Changing'], 'Smart Lighting', 25),
('Smart Thermostat', 'Energy efficient temperature control', 199.99, NULL, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'], false, true, ARRAY['WiFi', 'Learning', 'Energy Saving'], 'Smart Climate', 5);

-- Check the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;
