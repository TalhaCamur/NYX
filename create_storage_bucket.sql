-- Create Supabase Storage Bucket for product images
-- Run this in Supabase SQL Editor

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create RLS policy for public read access
CREATE POLICY "Public read access for product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Create RLS policy for authenticated users to upload
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

-- Create RLS policy for authenticated users to update
CREATE POLICY "Authenticated users can update product images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

-- Create RLS policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete product images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);