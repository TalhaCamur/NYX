-- Check storage buckets
-- Run this in Supabase SQL Editor

SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'product-images';
