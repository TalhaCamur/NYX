-- Fix placeholder URLs in database
-- This script updates all placeholder URLs to use Unsplash images

-- Update blog posts
UPDATE blog_posts 
SET featured_image = 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=400&fit=crop&crop=center'
WHERE featured_image LIKE '%via.placeholder.com%';

-- Update products
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center']
WHERE images && ARRAY['https://via.placeholder.com/400'];

-- Update categories
UPDATE categories 
SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'
WHERE image_url LIKE '%via.placeholder.com%';
