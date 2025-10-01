-- Update products with discount data
-- Run this in Supabase SQL Editor

-- Update existing products with discount data
UPDATE products 
SET original_price = 399.99 
WHERE name = 'Smart Home Hub';

UPDATE products 
SET original_price = 39.99 
WHERE name = 'Smart Light Bulb';

-- Keep Smart Thermostat without discount
UPDATE products 
SET original_price = NULL 
WHERE name = 'Smart Thermostat';

-- Check the results
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
