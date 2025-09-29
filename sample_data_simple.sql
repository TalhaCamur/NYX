-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, is_visible, stock) VALUES
('NYX-1 Smart Sensor', 'Smart PIR Motion Sensor with 24-month battery life and Adaptive AI Learning.', 129.99, 'https://via.placeholder.com/400', 'Smart Sensors', true, 50),
('NYX-Bulb Smart LED', 'Smart LED bulb with 16 million colors and voice control integration.', 39.99, 'https://via.placeholder.com/400', 'Smart Lighting', true, 100),
('NYX-Cam Security Camera', '4K security camera with night vision and motion detection.', 199.99, 'https://via.placeholder.com/400', 'Smart Security', true, 25);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, author_name, status, featured_image) VALUES
('Welcome to NYX Smart Home', 'Welcome to the future of smart home technology with NYX.', 'Welcome to the future of smart home technology with NYX...', 'NYX Team', 'published', 'https://via.placeholder.com/400'),
('Smart Home Security Tips', 'Learn how to secure your smart home with these essential tips.', 'Learn how to secure your smart home with these essential tips...', 'NYX Team', 'published', 'https://via.placeholder.com/400'),
('Energy Efficiency with Smart Lighting', 'Discover how smart lighting can help you save energy.', 'Discover how smart lighting can help you save energy...', 'NYX Team', 'published', 'https://via.placeholder.com/400');
