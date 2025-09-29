-- Drop all tables in correct order
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS legal_documents CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_all_users_with_profiles();
DROP FUNCTION IF EXISTS update_user_roles(user_id UUID, new_roles TEXT[]);
DROP FUNCTION IF EXISTS delete_user_as_admin(user_id UUID);

-- Drop policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view all products" ON products;
DROP POLICY IF EXISTS "Users can view all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can view own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can view all coupons" ON coupons;
DROP POLICY IF EXISTS "Users can view all legal documents" ON legal_documents;

-- Drop indexes
DROP INDEX IF EXISTS idx_profiles_user_id;
DROP INDEX IF EXISTS idx_profiles_email;
DROP INDEX IF EXISTS idx_products_owner;
DROP INDEX IF EXISTS idx_products_visible;
DROP INDEX IF EXISTS idx_products_featured;
DROP INDEX IF EXISTS idx_products_price;
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_blog_posts_author;
DROP INDEX IF EXISTS idx_blog_posts_status;
DROP INDEX IF EXISTS idx_blog_posts_published;
DROP INDEX IF EXISTS idx_blog_posts_tags;
DROP INDEX IF EXISTS idx_orders_user;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_created;
DROP INDEX IF EXISTS idx_order_items_order;
DROP INDEX IF EXISTS idx_order_items_product;
DROP INDEX IF EXISTS idx_cart_items_user;
DROP INDEX IF EXISTS idx_cart_items_product;
DROP INDEX IF EXISTS idx_reviews_product;
DROP INDEX IF EXISTS idx_reviews_user;
DROP INDEX IF EXISTS idx_coupons_code;
DROP INDEX IF EXISTS idx_coupons_active;
DROP INDEX IF EXISTS idx_legal_docs_slug;
DROP INDEX IF EXISTS idx_audit_logs_user;
DROP INDEX IF EXISTS idx_audit_logs_action;
DROP INDEX IF EXISTS idx_audit_logs_created;

-- Drop views
DROP VIEW IF EXISTS product_details;
DROP VIEW IF EXISTS user_order_summary;
DROP VIEW IF EXISTS blog_post_summary;

-- Drop triggers
DROP TRIGGER IF EXISTS update_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_updated_at ON products;
DROP TRIGGER IF EXISTS update_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS update_updated_at ON orders;
DROP TRIGGER IF EXISTS update_updated_at ON legal_documents;
DROP TRIGGER IF EXISTS audit_log_trigger ON profiles;
DROP TRIGGER IF EXISTS audit_log_trigger ON products;
DROP TRIGGER IF EXISTS audit_log_trigger ON blog_posts;
DROP TRIGGER IF EXISTS audit_log_trigger ON orders;

-- Drop types
DROP TYPE IF EXISTS order_status;
DROP TYPE IF EXISTS payment_status;
DROP TYPE IF EXISTS blog_post_status;
DROP TYPE IF EXISTS user_role_type;
DROP TYPE IF EXISTS audit_action_type;

-- Drop extensions
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS "pgcrypto";
