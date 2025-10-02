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
        author_id: user?.id || null,
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
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      featuredImage: post.featured_image || post.imageUrl || '',
      status: post.status || 'draft',
      tags: post.tags?.join(', ') || '',
      seoTitle: post.seo_title || post.seoTitle || '',
      seoDescription: post.seo_description || post.seoDescription || ''
    });
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
    <div className="bg-nyx-black rounded-2xl border border-nyx-gray/50 w-full">
      <div className="p-6 border-b border-nyx-gray/50 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Blog Management</h2>
        {!showAddForm && (
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingPost(null);
              resetForm();
            }}
            className="bg-nyx-blue text-nyx-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
          >
            Add Post
          </button>
        )}
      </div>

      <div className="p-6">
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white h-20"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white h-40"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Status</label>
                  <div className="relative inline-block">
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="bg-transparent text-white pl-2 pr-8 py-2 text-sm appearance-none border-0 outline-none cursor-pointer"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                    <svg className="w-4 h-4 text-gray-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                    placeholder="smart home, technology, automation"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-2">SEO Description</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white h-20"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-nyx-blue text-nyx-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
                >
                  {editingPost ? 'Update Post' : 'Add Post'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPost(null);
                    resetForm();
                  }}
                  className="bg-nyx-gray text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-nyx-gray rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          post.status === 'published' ? 'bg-green-600 text-white' :
                          post.status === 'draft' ? 'bg-yellow-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{post.excerpt}</p>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Author: {post.author_name || post.author || 'NYX Team'}</span>
                        <span>Created: {new Date(post.created_at || post.date).toLocaleDateString()}</span>
                        <span>Views: {post.view_count || post.viewCount || 0}</span>
                        {post.tags && post.tags.length > 0 && (
                          <span>Tags: {post.tags.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePublish(post.id, post.status || 'draft')}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          post.status === 'published' 
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {post.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};
