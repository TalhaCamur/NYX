-- Check discount data in products table
-- Run this in Supabase SQL Editor

SELECT 
  id,
  name,
  price,
  original_price,
  CASE 
    WHEN original_price IS NOT NULL AND original_price > price 
    THEN ROUND(((original_price - price) / original_price) * 100)
    ELSE 0
  END as discount_percentage
FROM products 
ORDER BY id;
