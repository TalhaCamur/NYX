-- Fix Products Table RLS Policies
-- Run this in Supabase SQL Editor

-- 1. Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Products are viewable by authenticated users" ON products;

-- 3. Create new policies
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Products are viewable by authenticated users" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 5. Check if products table exists and has data
SELECT COUNT(*) as product_count FROM products;
SELECT id, name, is_visible FROM products LIMIT 5;
