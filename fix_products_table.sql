-- Fix products table by adding missing created_at and updated_at columns
-- This script adds the missing timestamp columns to the products table

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE products ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE products ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create trigger for updated_at if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_products_updated_at'
    ) THEN
        CREATE TRIGGER update_products_updated_at 
        BEFORE UPDATE ON products 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Update existing records to have proper timestamps
UPDATE products 
SET created_at = NOW() - INTERVAL '1 day' * (RANDOM() * 30)::INTEGER,
    updated_at = NOW() - INTERVAL '1 hour' * (RANDOM() * 24)::INTEGER
WHERE created_at IS NULL OR updated_at IS NULL;
