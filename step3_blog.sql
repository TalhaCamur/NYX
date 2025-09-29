-- Step 3: Blog Posts Table
-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can view own blog posts" ON blog_posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Authors can insert own blog posts" ON blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own blog posts" ON blog_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own blog posts" ON blog_posts FOR DELETE USING (auth.uid() = author_id);

-- Create trigger
CREATE TRIGGER update_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(created_at) WHERE status = 'published';
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, status) VALUES
('Welcome to NYX Smart Home', 'welcome-to-nyx-smart-home', 'Welcome to the future of smart home technology with NYX. Our innovative products are designed to make your home smarter, safer, and more efficient.', 'Welcome to the future of smart home technology with NYX...', 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=400&fit=crop&crop=center', 'published'),
('Smart Home Security Tips', 'smart-home-security-tips', 'Learn how to secure your smart home with these essential tips. From password management to device placement, we cover everything you need to know.', 'Learn how to secure your smart home with these essential tips...', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center', 'published'),
('Energy Efficiency with Smart Lighting', 'energy-efficiency-with-smart-lighting', 'Discover how smart lighting can help you save energy and reduce your electricity bills while creating the perfect ambiance for your home.', 'Discover how smart lighting can help you save energy...', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center', 'published');
