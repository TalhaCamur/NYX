import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { supabase, useAuth } from '../contexts/AuthContext';

interface BlogManagementProps {
  onUpdate?: () => void;
}

export const BlogManagement: React.FC<BlogManagementProps> = ({ onUpdate }) => {
  const { user } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Role-based access control
  const isAuthorized = user && (user.roles.includes('content_writer') || user.roles.includes('admin') || user.roles.includes('super-admin'));
  const canManageAllPosts = user && (user.roles.includes('admin') || user.roles.includes('super-admin'));
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    status: 'draft',
    tags: '',
    seoTitle: '',
    seoDescription: ''
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Submitting blog post...', formData);
    console.log('👤 Current user:', user);
    
    try {
      const postData: any = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        status: formData.status,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        author_name: user?.nickname || user?.email?.split('@')[0] || 'NYX Team'
      };

      // Add optional fields only if they have values
      if (formData.featuredImage) postData.featured_image = formData.featuredImage;
      if (formData.tags) postData.tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (formData.seoTitle) postData.seo_title = formData.seoTitle;
      if (formData.seoDescription) postData.seo_description = formData.seoDescription;

      console.log('📤 Sending to database:', postData);

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);
        
        if (error) throw error;
        console.log('✅ Blog post updated successfully');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        
        if (error) throw error;
        console.log('✅ Blog post created successfully');
      }

      setEditingPost(null);
      setShowAddForm(false);
      resetForm();
      fetchBlogPosts();
      
      // Call onUpdate callback if provided
      if (onUpdate) {
        console.log('🔄 Calling onUpdate callback');
        onUpdate();
      }
    } catch (error: any) {
      console.error('❌ Error saving blog post:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
      alert(`Failed to save blog post: ${error?.message || 'Unknown error'}\n\nCheck console for details.`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingImage(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setUploadedImageUrl(publicUrl);
      setFormData({ ...formData, featuredImage: publicUrl });
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      status: 'draft',
      tags: '',
      seoTitle: '',
      seoDescription: ''
    });
    setUploadedImageUrl('');
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    const imageUrl = post.featured_image || post.imageUrl || '';
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      featuredImage: imageUrl,
      status: post.status || 'draft',
      tags: post.tags?.join(', ') || '',
      seoTitle: post.seo_title || post.seoTitle || '',
      seoDescription: post.seo_description || post.seoDescription || ''
    });
    setUploadedImageUrl(imageUrl);
    setShowAddForm(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      fetchBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const handlePublish = async (postId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const publishedAt = newStatus === 'published' ? new Date().toISOString() : null;
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: newStatus,
          published_at: publishedAt
        })
        .eq('id', postId);
      
      if (error) throw error;
      fetchBlogPosts();
    } catch (error) {
      console.error('Error updating blog post status:', error);
    }
  };

  // Access control check
  if (!isAuthorized) {
    return (
      <div className="bg-nyx-black rounded-2xl border border-nyx-gray/50 p-8 text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-gray-400 mb-6">You don't have permission to manage blog posts.</p>
        <p className="text-sm text-gray-500 mb-6">Required roles: Content Writer, Admin, or Super Admin</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-nyx-black p-8 rounded-2xl">
        <div className="text-white">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Premium Header with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-nyx-blue/10 via-brand-purple/5 to-transparent border-b border-white/5 backdrop-blur-xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-nyx-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative px-8 py-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-nyx-blue/20 to-brand-purple/20 border border-nyx-blue/30 mb-4">
                <div className="w-2 h-2 bg-nyx-blue rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-gray-300 tracking-wider">CONTENT STUDIO</span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-white">Blog</span>{' '}
                <span className="bg-gradient-to-r from-nyx-blue via-brand-purple to-brand-pink text-transparent bg-clip-text">Management</span>
              </h1>
              
              <p className="text-gray-400 text-sm">Create, edit, and publish your stories</p>
            </div>
            
            {/* Action Button - Only show when not in form */}
            {!showAddForm && (
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingPost(null);
                  resetForm();
                }}
                className="group relative px-6 py-3 bg-gradient-to-r from-nyx-blue to-brand-purple text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-nyx-blue/50 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-nyx-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Post</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-8 py-8 max-w-7xl mx-auto">
          {showAddForm ? (
            <div className="relative">
              {/* Premium Glass Card */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* 1. HEADER (Main Title) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide uppercase">
                      📌 Header (Main Title) *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white text-xl font-semibold placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                      placeholder="Enter the main headline that appears at the top..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">This will be the large header at the top of your blog post</p>
                  </div>

                  {/* 2. FEATURED IMAGE UPLOAD */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide uppercase">
                      🖼️ Featured Image
                    </label>
                    
                    {/* Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="blog-image-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="blog-image-upload"
                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                          uploadingImage
                            ? 'border-gray-600 bg-gray-900/50 cursor-wait'
                            : uploadedImageUrl || formData.featuredImage
                            ? 'border-nyx-blue/50 bg-nyx-blue/5 hover:bg-nyx-blue/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-nyx-blue/50'
                        }`}
                      >
                        {uploadingImage ? (
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nyx-blue mx-auto mb-3"></div>
                            <p className="text-sm text-gray-400">Uploading image...</p>
                          </div>
                        ) : uploadedImageUrl || formData.featuredImage ? (
                          <div className="relative w-full h-full p-4">
                            <img
                              src={uploadedImageUrl || formData.featuredImage}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <p className="text-white text-sm font-semibold">Click to change image</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-gray-400 mb-1">Click to upload image</p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">This image appears below the header in your blog post</p>
                  </div>

                  {/* 3. SUBHEADING */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide uppercase">
                      📝 Subheading
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all resize-none h-24"
                      placeholder="A brief, catchy subtitle or excerpt (2-3 sentences)..."
                    />
                    <p className="text-xs text-gray-500 mt-2">Short summary that appears below the image</p>
                  </div>

                  {/* 4. MAIN CONTENT */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide uppercase">
                      ✍️ Main Content *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all resize-none h-96"
                      placeholder="Write your full article content here...

You can use paragraphs, line breaks, and formatting as needed."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">The main body of your blog post</p>
                  </div>

                  {/* Status & Tags Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">STATUS</label>
                      <div className="relative">
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-4 pr-10 text-white appearance-none cursor-pointer focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                        >
                          <option value="draft">📝 Draft</option>
                          <option value="published">✅ Published</option>
                          <option value="archived">📦 Archived</option>
                        </select>
                        <svg className="w-5 h-5 text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">TAGS</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                        placeholder="tech, design, ai"
                      />
                    </div>
                  </div>

                  {/* SEO Section - Collapsible */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-nyx-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-300 tracking-wide">SEO OPTIMIZATION</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">SEO Title</label>
                        <input
                          type="text"
                          value={formData.seoTitle}
                          onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                          placeholder="Optimized title for search engines"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">SEO Description</label>
                        <textarea
                          value={formData.seoDescription}
                          onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all resize-none h-20"
                          placeholder="Meta description for search results"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6">
                    <button
                      type="submit"
                      className="flex-1 group relative px-6 py-4 bg-gradient-to-r from-nyx-blue to-brand-purple text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-nyx-blue/50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-nyx-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{editingPost ? 'Update Post' : 'Publish Post'}</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingPost(null);
                        resetForm();
                      }}
                      className="px-6 py-4 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {blogPosts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                  <p className="text-gray-400 mb-6">Create your first blog post to get started</p>
                </div>
              ) : (
                blogPosts.map((post) => (
                  <div key={post.id} className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-nyx-blue/30 transition-all duration-300 hover:shadow-lg hover:shadow-nyx-blue/10">
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1 min-w-0">
                        {/* Title and Status */}
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-white truncate">{post.title}</h3>
                          <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                            post.status === 'published' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : post.status === 'draft' 
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {post.status === 'published' ? '✓ Published' : post.status === 'draft' ? '✎ Draft' : '📦 Archived'}
                          </span>
                        </div>
                        
                        {/* Excerpt */}
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt || 'No excerpt available'}</p>
                        
                        {/* Metadata */}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{post.author_name || post.author || 'NYX Team'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(post.created_at || post.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{post.view_count || post.viewCount || 0} views</span>
                          </div>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span>{post.tags.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => handlePublish(post.id, post.status || 'draft')}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            post.status === 'published'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
                              : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                          }`}
                        >
                          {post.status === 'published' ? '⊗ Unpublish' : '✓ Publish'}
                        </button>
                        <button
                          onClick={() => handleEdit(post)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-nyx-blue/20 text-nyx-blue border border-nyx-blue/30 hover:bg-nyx-blue/30 transition-all"
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
      </div>
    </div>
  );
};
