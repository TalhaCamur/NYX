import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase, useAuth } from '../contexts/AuthContext';

interface ProductManagementProps {
  onClose: () => void;
  openAddForm?: boolean;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({ onClose, openAddForm = false }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Role-based access control
  const isAuthorized = user && (user.roles.includes('seller') || user.roles.includes('admin') || user.roles.includes('super-admin'));
  const canManageAllProducts = user && (user.roles.includes('admin') || user.roles.includes('super-admin'));
  const [formData, setFormData] = useState({
    name: '',
    tag_line: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    sku: '',
    images: '',
    features: '',
    specs: '',
    is_visible: false,
    is_featured: false
  });
  
  // New states for enhanced form
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [specs, setSpecs] = useState<Array<{name: string, value: string}>>([{name: '', value: ''}]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Don't automatically open add form when openAddForm is true
    // Only open when explicitly requested
  }, [openAddForm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    
    // Check if there's a discount (original_price exists and is different from price)
    const hasDiscount = product.original_price && product.original_price > product.price;
    setApplyDiscount(hasDiscount || false);
    
    // Convert specs object to array format for the form
    const specsArray = product.specs 
      ? Object.entries(product.specs).map(([name, value]) => ({ name, value: String(value) }))
      : [{name: '', value: ''}];
    setSpecs(specsArray);
    
    // Set uploaded images from product
    const productImages = product.images || [];
    setUploadedImages(productImages);
    
    setFormData({
      name: product.name || '',
      tag_line: product.tag_line || '',
      description: product.description || '',
      price: hasDiscount ? (product.original_price?.toString() || '') : (product.price?.toString() || ''),
      original_price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      sku: product.sku || '',
      images: productImages.join(', '),
      specs: '',
      features: product.features?.join(', ') || '',
      is_visible: product.is_visible || false,
      is_featured: product.is_featured || false
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setUploadedImages([...uploadedImages, ...uploadedUrls]);
      setFormData({ ...formData, images: [...uploadedImages, ...uploadedUrls].join(', ') });
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setFormData({ ...formData, images: newImages.join(', ') });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tag_line: '',
      description: '',
      price: '',
      original_price: '',
      stock: '',
      sku: '',
      images: '',
      specs: '',
      features: '',
      is_visible: false,
      is_featured: false
    });
    setEditingProduct(null);
    setUploadedImages([]);
    setSpecs([{name: '', value: ''}]);
    setApplyDiscount(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Convert specs array to object
      const specsObj: Record<string, string> = {};
      specs.forEach(spec => {
        if (spec.name && spec.value) {
          specsObj[spec.name] = spec.value;
        }
      });

      // Convert features string to array
      const featuresArray = formData.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      // Handle images
      let imageArray: string[] = [];
      if (uploadedImages.length > 0) {
        imageArray = uploadedImages;
      } else if (formData.images) {
        imageArray = formData.images.split(',').map(url => url.trim()).filter(url => url);
      }

      // Calculate prices based on discount
      let finalPrice: number;
      let originalPrice: number | null = null;
      
      if (applyDiscount && formData.original_price) {
        // If discount is applied, the price field is the original price
        // and original_price field is the discounted price
        originalPrice = parseFloat(formData.price);
        finalPrice = parseFloat(formData.original_price);
      } else {
        // No discount, just use the price field
        finalPrice = parseFloat(formData.price);
        originalPrice = null;
      }

      const productData = {
        name: formData.name,
        tag_line: formData.tag_line,
        description: formData.description,
        price: finalPrice,
        original_price: originalPrice,
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku,
        images: imageArray,
        specs: Object.keys(specsObj).length > 0 ? specsObj : null,
        features: featuresArray,
        is_visible: formData.is_visible,
        is_featured: formData.is_featured
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }

      resetForm();
      setShowAddForm(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-nyx-black rounded-2xl border border-nyx-gray/50 w-full max-w-md p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">You don't have permission to manage products.</p>
          <button
            onClick={onClose}
            className="bg-nyx-blue text-nyx-black px-6 py-2 rounded-lg hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-nyx-black/95 to-nyx-gray/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Premium Header with Gradient Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-nyx-blue/10 via-brand-purple/5 to-transparent border-b border-white/5">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-nyx-blue/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                {/* Premium Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-nyx-blue/20 to-brand-purple/20 border border-nyx-blue/30 mb-3">
                  <div className="w-2 h-2 bg-nyx-blue rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-gray-300 tracking-wider">PRODUCT STUDIO</span>
                </div>
                
                {/* Title */}
                <h1 className="text-3xl font-bold">
                  <span className="text-white">Product</span>{' '}
                  <span className="bg-gradient-to-r from-nyx-blue via-brand-purple to-brand-pink text-transparent bg-clip-text">Management</span>
                </h1>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="group p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
          {!showAddForm ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Your Inventory</p>
                  <h3 className="text-xl font-bold text-white">{products.length} Products</h3>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="group relative px-6 py-3 bg-gradient-to-r from-nyx-blue to-brand-purple text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-nyx-blue/50 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-nyx-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Product</span>
                  </div>
                </button>
              </div>

              {/* Products List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nyx-blue mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
                  <p className="text-gray-400 mb-6">Create your first product to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <div key={product.id} className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:border-nyx-blue/30 transition-all duration-300 hover:shadow-lg hover:shadow-nyx-blue/10">
                      {/* Product Image */}
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={product.images?.[0] || product.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'} 
                          alt={product.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Badges Overlay */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          {product.is_featured && (
                            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-yellow-500/90 text-yellow-950 backdrop-blur-sm">
                              ⭐ Featured
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${
                            product.is_visible 
                              ? 'bg-green-500/90 text-green-950' 
                              : 'bg-red-500/90 text-red-950'
                          }`}>
                            {product.is_visible ? '👁 Visible' : '🔒 Hidden'}
                          </span>
                        </div>
                        {/* Stock Badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-black/70 text-white backdrop-blur-sm">
                            📦 {product.stock} in stock
                          </span>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-4">
                        <h4 className="text-white font-bold text-lg mb-2 truncate">{product.name}</h4>
                        {product.tag_line && (
                          <p className="text-gray-400 text-xs mb-2 line-clamp-1">{product.tag_line}</p>
                        )}
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                        
                        {/* Price */}
                        <div className="mb-4">
                          {product.original_price && product.original_price > product.price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-nyx-blue font-bold text-xl">€{product.price}</span>
                              <span className="text-gray-500 text-sm line-through">€{product.original_price}</span>
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-semibold rounded">
                                -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-nyx-blue font-bold text-xl">€{product.price}</span>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-nyx-blue/20 text-nyx-blue border border-nyx-blue/30 hover:bg-nyx-blue/30 transition-all"
                          >
                            ✎ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Premium Form Container */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                {/* Form Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {editingProduct ? 'Edit Product' : 'Create New Product'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {editingProduct ? 'Update your product details' : 'Add a new product to your inventory'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name and Tagline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">PRODUCT NAME *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Tagline</label>
                    <input
                      type="text"
                      value={formData.tag_line}
                      onChange={(e) => setFormData({ ...formData, tag_line: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                      placeholder="Short product tagline"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all h-24 resize-none"
                    placeholder="Describe your product..."
                    required
                  />
                </div>

                {/* Price Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Price (€) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    {/* Apply Discount Switch */}
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative inline-block w-12 h-6 mr-3">
                          <input
                            type="checkbox"
                            checked={applyDiscount}
                            onChange={(e) => {
                              setApplyDiscount(e.target.checked);
                              if (!e.target.checked) {
                                setFormData({ ...formData, original_price: '' });
                              }
                            }}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                            applyDiscount ? 'bg-nyx-blue' : 'bg-gray-600'
                          }`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              applyDiscount ? 'translate-x-6' : 'translate-x-0.5'
                            } mt-0.5`}></div>
                          </div>
                        </div>
                        <div>
                          <span className="text-white font-medium">Apply Discount</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Discounted Price - Shows only when Apply Discount is ON */}
                  {applyDiscount && (
                    <div className="bg-nyx-blue/10 border border-nyx-blue/30 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Discounted Price (€) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.original_price}
                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                        placeholder="0.00"
                        required={applyDiscount}
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Original: €{formData.price || '0.00'} → Discounted: €{formData.original_price || '0.00'}
                        {formData.price && formData.original_price && parseFloat(formData.price) > parseFloat(formData.original_price) && (
                          <span className="text-nyx-blue ml-2">
                            ({Math.round((1 - parseFloat(formData.original_price) / parseFloat(formData.price)) * 100)}% off)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stock and SKU */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                      placeholder="Product SKU"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Product Images</label>
                    
                    {/* Upload Button */}
                    <div className="flex gap-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="bg-nyx-gray border-2 border-dashed border-gray-600 rounded-lg py-8 px-4 text-center hover:border-nyx-blue transition-colors">
                          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-white font-medium mb-1">
                            {uploading ? 'Uploading...' : 'Click to upload images'}
                          </p>
                          <p className="text-sm text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    {/* Uploaded Images Preview */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {uploadedImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-700"
                            />
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(index)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Or use Image URLs */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Or paste Image URLs</label>
                    <input
                      type="text"
                      value={formData.images}
                      onChange={(e) => {
                        setFormData({ ...formData, images: e.target.value });
                        // Update uploaded images array from URLs
                        const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url);
                        setUploadedImages(urls);
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                    <p className="text-sm text-gray-400 mt-1">Separate multiple URLs with commas</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Features</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                    placeholder="WiFi, Bluetooth, Voice Control"
                  />
                  <p className="text-sm text-gray-400 mt-1">Separate features with commas</p>
                </div>

                {/* Specifications */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">Specifications</label>
                  <div className="space-y-3">
                    {specs.map((spec, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={spec.name}
                          onChange={(e) => {
                            const newSpecs = [...specs];
                            newSpecs[index].name = e.target.value;
                            setSpecs(newSpecs);
                          }}
                          className="bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                          placeholder="Spec name (e.g., Weight)"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => {
                              const newSpecs = [...specs];
                              newSpecs[index].value = e.target.value;
                              setSpecs(newSpecs);
                            }}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:border-nyx-blue focus:ring-2 focus:ring-nyx-blue/20 focus:outline-none transition-all"
                            placeholder="Value (e.g., 1.2kg)"
                          />
                          {specs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setSpecs(specs.filter((_, i) => i !== index))}
                              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSpecs([...specs, { name: '', value: '' }])}
                      className="bg-nyx-gray text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Specification
                    </button>
                  </div>
                </div>

                {/* Switches Section */}
                <div className="space-y-4 border-t border-gray-700 pt-4">
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative inline-block w-12 h-6 mr-3">
                        <input
                          type="checkbox"
                          checked={formData.is_visible}
                          onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          formData.is_visible ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                            formData.is_visible ? 'translate-x-6' : 'translate-x-0.5'
                          } mt-0.5`}></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-white font-medium">Visible to Everyone</span>
                        <p className="text-sm text-gray-400">Product will be visible on the website</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative inline-block w-12 h-6 mr-3">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          formData.is_featured ? 'bg-yellow-500' : 'bg-gray-600'
                        }`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                            formData.is_featured ? 'translate-x-6' : 'translate-x-0.5'
                          } mt-0.5`}></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-white font-medium">Featured Product</span>
                        <p className="text-sm text-gray-400">Product will be shown in featured section on homepage</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 group relative px-6 py-4 bg-gradient-to-r from-nyx-blue to-brand-purple text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-nyx-blue/50 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-nyx-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>{editingProduct ? 'Updating...' : 'Creating...'}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-4 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};