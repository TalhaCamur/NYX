-- Force Schema Cache Refresh
-- Run this in Supabase SQL Editor

-- Method 1: Force schema reload
NOTIFY pgrst, 'reload schema';

-- Method 2: Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'products'
);

-- Method 3: Check columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;
