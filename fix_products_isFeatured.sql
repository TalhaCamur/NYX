-- Fix products table - Add missing isFeatured column
-- Run this in Supabase SQL Editor

-- Add isFeatured column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'isFeatured'
    ) THEN
        ALTER TABLE products ADD COLUMN isFeatured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Update existing records to have isFeatured = false
UPDATE products 
SET isFeatured = false 
WHERE isFeatured IS NULL;

-- Check the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;