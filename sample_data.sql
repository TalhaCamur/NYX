-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, is_visible, stock) VALUES
('NYX-1 Smart Sensor', 'The NYX-1 Smart PIR Motion Sensor features industry-leading 24-month battery life and Adaptive AI Learning that reduces false triggers by learning your household patterns.', 129.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Smart Sensors', true, 50),
('NYX-Bulb Smart LED', 'Experience the perfect blend of functionality and aesthetics with the NYX-Bulb. Control 16 million colors, set dynamic scenes, and enjoy seamless voice assistant integration.', 39.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Smart Lighting', true, 100),
('NYX-Cam Security Camera', 'Monitor your home with crystal-clear 4K video, advanced night vision, and intelligent motion detection. The NYX-Cam blends seamlessly into any modern interior.', 199.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Smart Security', true, 25);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, author_name, status, featured_image) VALUES
('Welcome to NYX Smart Home', 'Welcome to the future of smart home technology with NYX. Our innovative products are designed to make your home more intelligent, secure, and energy-efficient.', 'Welcome to the future of smart home technology with NYX...', 'NYX Team', 'published', 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800'),
('Smart Home Security Tips', 'Learn how to secure your smart home with these essential tips and best practices for protecting your connected devices and personal data.', 'Learn how to secure your smart home with these essential tips...', 'NYX Team', 'published', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'),
('Energy Efficiency with Smart Lighting', 'Discover how smart lighting can help you save energy and reduce your electricity bills while creating the perfect ambiance for every room.', 'Discover how smart lighting can help you save energy...', 'NYX Team', 'published', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800');
