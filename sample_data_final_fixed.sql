-- Insert sample products
INSERT INTO products (name, slug, description, price, images, category_id, is_visible, stock) VALUES
('NYX-1 Smart Sensor', 'nyx-1-smart-sensor', 'Smart PIR Motion Sensor with 24-month battery life and Adaptive AI Learning.', 129.99, ARRAY['https://via.placeholder.com/400'], (SELECT id FROM categories WHERE slug = 'smart-sensors'), true, 50),
('NYX-Bulb Smart LED', 'nyx-bulb-smart-led', 'Smart LED bulb with 16 million colors and voice control integration.', 39.99, ARRAY['https://via.placeholder.com/400'], (SELECT id FROM categories WHERE slug = 'smart-lighting'), true, 100),
('NYX-Cam Security Camera', 'nyx-cam-security-camera', '4K security camera with night vision and motion detection.', 199.99, ARRAY['https://via.placeholder.com/400'], (SELECT id FROM categories WHERE slug = 'smart-security'), true, 25);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, status) VALUES
('Welcome to NYX Smart Home', 'welcome-to-nyx-smart-home', 'Welcome to the future of smart home technology with NYX.', 'Welcome to the future of smart home technology with NYX...', 'https://via.placeholder.com/400', 'published'),
('Smart Home Security Tips', 'smart-home-security-tips', 'Learn how to secure your smart home with these essential tips.', 'Learn how to secure your smart home with these essential tips...', 'https://via.placeholder.com/400', 'published'),
('Energy Efficiency with Smart Lighting', 'energy-efficiency-with-smart-lighting', 'Discover how smart lighting can help you save energy.', 'Discover how smart lighting can help you save energy...', 'https://via.placeholder.com/400', 'published');
