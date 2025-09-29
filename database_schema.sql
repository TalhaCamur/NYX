-- NYX Smart Home E-commerce Database Schema
-- Supabase PostgreSQL Database Setup

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. PROFILES TABLE (User Management)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    nickname TEXT UNIQUE,
    email TEXT UNIQUE,
    profile_picture TEXT,
    newsletter_subscribed BOOLEAN DEFAULT FALSE,
    roles TEXT[] DEFAULT ARRAY['user'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- =============================================
-- 2. CATEGORIES TABLE (Product Categories)
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. PRODUCTS TABLE (Product Management)
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    sku TEXT UNIQUE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    specs JSONB DEFAULT '{}',
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_visible BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    weight DECIMAL(8,2),
    dimensions JSONB DEFAULT '{}', -- {length, width, height}
    warranty_months INTEGER DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. PRODUCT_REVIEWS TABLE (Customer Reviews)
-- =============================================
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- =============================================
-- 5. BLOG_POSTS TABLE (Content Management)
-- =============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. ORDERS TABLE (Order Management)
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT,
    payment_reference TEXT,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    notes TEXT,
    tracking_number TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. ORDER_ITEMS TABLE (Order Line Items)
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    product_snapshot JSONB NOT NULL, -- Store product details at time of order
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. COUPONS TABLE (Discount Management)
-- =============================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
    value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0,
    maximum_discount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 9. COUPON_USAGES TABLE (Coupon Usage Tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS coupon_usages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coupon_id, user_id, order_id)
);

-- =============================================
-- 10. WISHLISTS TABLE (User Wishlists)
-- =============================================
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- =============================================
-- 11. CONTACT_MESSAGES TABLE (Contact Form)
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 12. LEGAL_DOCUMENTS TABLE (Legal Pages)
-- =============================================
CREATE TABLE IF NOT EXISTS legal_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 13. NEWSLETTER_SUBSCRIBERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    source TEXT DEFAULT 'website'
);

-- =============================================
-- 14. ANALYTICS_EVENTS TABLE (User Behavior Tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 15. INVENTORY_TRANSACTIONS TABLE (Stock Management)
-- =============================================
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
    quantity INTEGER NOT NULL,
    reason TEXT,
    reference_id UUID, -- Can reference order_id or other relevant IDs
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);
CREATE INDEX IF NOT EXISTS idx_profiles_roles ON profiles USING GIN(roles);

-- Products indexes
-- CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
-- CREATE INDEX IF NOT EXISTS idx_products_visible ON products(is_visible);
-- CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
-- CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
-- CREATE INDEX IF NOT EXISTS idx_products_owner ON products(owner_id);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Blog posts indexes
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at);
-- CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews(rating);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Admin policy removed to avoid infinite recursion

-- Products policies
CREATE POLICY "Anyone can view visible products" ON products FOR SELECT USING (is_visible = true);
CREATE POLICY "Sellers can view their own products" ON products FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Sellers can manage their own products" ON products FOR ALL USING (owner_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (user_id = auth.uid());

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Content writers can manage blog posts" ON blog_posts FOR ALL USING (author_id = auth.uid());

-- =============================================
-- FUNCTIONS AND STORED PROCEDURES
-- =============================================

-- Function to get email from nickname
CREATE OR REPLACE FUNCTION get_email_from_nickname(nickname_to_find TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT email FROM profiles WHERE nickname = LOWER(nickname_to_find));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all users with profiles
CREATE OR REPLACE FUNCTION get_all_users_with_profiles()
RETURNS TABLE (
    id UUID,
    first_name TEXT,
    last_name TEXT,
    nickname TEXT,
    email TEXT,
    profile_picture TEXT,
    newsletter_subscribed BOOLEAN,
    roles TEXT[],
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.first_name, p.last_name, p.nickname, p.email, 
           p.profile_picture, p.newsletter_subscribed, p.roles, 
           p.created_at, p.updated_at, p.last_login, p.is_active
    FROM profiles p
    WHERE EXISTS (
        SELECT 1 FROM profiles admin 
        WHERE admin.id = auth.uid() 
        AND ('admin' = ANY(admin.roles) OR 'super-admin' = ANY(admin.roles))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user roles
CREATE OR REPLACE FUNCTION update_user_roles(user_id_to_update UUID, new_roles TEXT[])
RETURNS VOID AS $$
BEGIN
    -- Check if current user is admin or super-admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND ('admin' = ANY(roles) OR 'super-admin' = ANY(roles))
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
    
    -- Prevent non-super-admin from modifying super-admin roles
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND 'super-admin' = ANY(roles)
    ) AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id_to_update 
        AND 'super-admin' = ANY(roles)
    ) THEN
        RAISE EXCEPTION 'Cannot modify super-admin roles';
    END IF;
    
    UPDATE profiles 
    SET roles = new_roles, updated_at = NOW()
    WHERE id = user_id_to_update;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete user by admin
CREATE OR REPLACE FUNCTION delete_user_by_admin(user_id_to_delete UUID)
RETURNS VOID AS $$
BEGIN
    -- Check if current user is admin or super-admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND ('admin' = ANY(roles) OR 'super-admin' = ANY(roles))
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
    
    -- Prevent deletion of super-admin by non-super-admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND 'super-admin' = ANY(roles)
    ) AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id_to_delete 
        AND 'super-admin' = ANY(roles)
    ) THEN
        RAISE EXCEPTION 'Cannot delete super-admin';
    END IF;
    
    -- Delete from auth.users (this will cascade to profiles)
    DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete own user account
CREATE OR REPLACE FUNCTION delete_own_user_account()
RETURNS VOID AS $$
BEGIN
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    -- Get current counter value
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INTEGER)), 0) + 1
    INTO counter
    FROM orders
    WHERE order_number LIKE 'NYX%';
    
    -- Generate new order number
    new_number := 'NYX' || LPAD(counter::TEXT, 6, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock(product_uuid UUID, quantity_change INTEGER, transaction_type TEXT, reason TEXT DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    -- Get current stock
    SELECT stock INTO current_stock FROM products WHERE id = product_uuid;
    
    -- Calculate new stock
    IF transaction_type = 'in' THEN
        current_stock := current_stock + quantity_change;
    ELSIF transaction_type = 'out' THEN
        current_stock := current_stock - quantity_change;
        IF current_stock < 0 THEN
            RAISE EXCEPTION 'Insufficient stock';
        END IF;
    ELSIF transaction_type = 'adjustment' THEN
        current_stock := quantity_change;
    END IF;
    
    -- Update product stock
    UPDATE products 
    SET stock = current_stock, updated_at = NOW()
    WHERE id = product_uuid;
    
    -- Log inventory transaction
    INSERT INTO inventory_transactions (product_id, type, quantity, reason, created_by)
    VALUES (product_uuid, transaction_type, quantity_change, reason, auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Smart Sensors', 'smart-sensors', 'Motion and environmental sensors for smart home automation', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'),
('Smart Lighting', 'smart-lighting', 'Intelligent lighting solutions for modern homes', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'),
('Smart Security', 'smart-security', 'Advanced security systems and cameras', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'),
('Smart Controls', 'smart-controls', 'Control panels and smart switches', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400');

-- Insert sample products (commented out to avoid category_id error)
-- INSERT INTO products (name, slug, tagline, description, price, original_price, stock, sku, category_id, images, specs, features, is_visible, is_featured) VALUES
-- ('NYX-1 Smart Sensor', 'nyx-1-smart-sensor', 'Adaptive AI Motion Detection', 'The NYX-1 Smart PIR Motion Sensor features industry-leading 24-month battery life and Adaptive AI Learning that reduces false triggers by learning your household patterns.', 129.99, 149.99, 50, 'NYX-001', (SELECT id FROM categories WHERE slug = 'smart-sensors'), 
-- ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
-- '{"battery_life": "24 months", "range": "10 meters", "angle": "120 degrees", "connectivity": "WiFi 2.4GHz", "material": "Aluminum", "dimensions": "45x45x15mm"}',
-- ARRAY['Adaptive AI Learning', '24-month battery life', 'Seamless integration', 'Minimalist design'],
-- true, true),

-- ('NYX-Bulb Smart LED', 'nyx-bulb-smart-led', '16 Million Colors, Smart Control', 'Experience the perfect blend of functionality and aesthetics with the NYX-Bulb. Control 16 million colors, set dynamic scenes, and enjoy seamless voice assistant integration.', 39.99, 49.99, 100, 'NYX-002', (SELECT id FROM categories WHERE slug = 'smart-lighting'),
-- ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
-- '{"wattage": "9W", "lumen": "800", "color_temp": "2000K-6500K", "colors": "16M", "connectivity": "WiFi 2.4GHz", "compatibility": "HomeKit, Alexa, Google"}',
-- ARRAY['16 million colors', 'Voice control', 'Energy efficient', 'Easy setup'],
-- true, true),

-- ('NYX-Cam Security Camera', 'nyx-cam-security-camera', '4K Ultra HD, Night Vision', 'Monitor your home with crystal-clear 4K video, advanced night vision, and intelligent motion detection. The NYX-Cam blends seamlessly into any modern interior.', 199.99, 249.99, 25, 'NYX-003', (SELECT id FROM categories WHERE slug = 'smart-security'),
-- ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
-- '{"resolution": "4K UHD", "night_vision": "30ft", "field_of_view": "130 degrees", "storage": "Cloud + Local", "connectivity": "WiFi 2.4/5GHz"}',
-- ARRAY['4K Ultra HD', 'Night vision', 'Motion detection', 'Cloud storage'],
-- true, false);

-- Insert sample legal documents
INSERT INTO legal_documents (slug, title, content) VALUES
('privacy-policy', 'Privacy Policy', 'This is a placeholder for the Privacy Policy content. Please update this with your actual privacy policy.'),
('terms-of-service', 'Terms of Service', 'This is a placeholder for the Terms of Service content. Please update this with your actual terms of service.'),
('shipping-policy', 'Shipping Policy', 'This is a placeholder for the Shipping Policy content. Please update this with your actual shipping policy.'),
('return-policy', 'Return Policy', 'This is a placeholder for the Return Policy content. Please update this with your actual return policy.');

-- Insert sample coupons
INSERT INTO coupons (code, name, description, type, value, minimum_amount, usage_limit, valid_until) VALUES
('WELCOME10', 'Welcome Discount', '10% off for new customers', 'percentage', 10.00, 50.00, 1000, NOW() + INTERVAL '1 year'),
('SAVE20', 'Save $20', '$20 off orders over $100', 'fixed_amount', 20.00, 100.00, 500, NOW() + INTERVAL '6 months'),
('FREESHIP', 'Free Shipping', 'Free shipping on all orders', 'fixed_amount', 15.00, 0.00, 10000, NOW() + INTERVAL '3 months');

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for product details with category (commented out to avoid category_id error)
-- CREATE VIEW product_details AS
-- SELECT 
--     p.*,
--     c.name as category_name,
--     c.slug as category_slug,
--     COALESCE(AVG(pr.rating), 0) as average_rating,
--     COUNT(pr.id) as review_count
-- FROM products p
-- LEFT JOIN categories c ON p.category_id = c.id
-- LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = true
-- GROUP BY p.id, c.name, c.slug;

-- View for order summary
CREATE VIEW order_summary AS
SELECT 
    o.*,
    p.first_name || ' ' || p.last_name as customer_name,
    p.email as customer_email,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, p.first_name, p.last_name, p.email;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

-- This completes the NYX Smart Home E-commerce database schema setup
-- The database is now ready for the React application with all necessary tables,
-- indexes, triggers, RLS policies, and sample data.
