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
    
    setFormData({
      name: product.name || '',
      tag_line: product.tag_line || '',
      description: product.description || '',
      price: hasDiscount ? (product.original_price?.toString() || '') : (product.price?.toString() || ''),
      original_price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      sku: product.sku || '',
      images: product.images?.join(', ') || '',
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-nyx-black rounded-2xl border border-nyx-gray/50 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-nyx-gray/50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Product Management</h2>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="bg-nyx-gray text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showAddForm ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Manage Products</h3>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-nyx-blue text-nyx-black px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Product
                </button>
              </div>

              {/* Products List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nyx-blue mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No products found. Add your first product!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-nyx-gray/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="aspect-square overflow-hidden rounded-lg mb-3">
                        <img 
                          src={product.images?.[0] || product.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold truncate">{product.name}</h4>
                        <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-nyx-blue font-bold">€{product.price}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>Stock: {product.stock}</span>
                          <span className={product.is_visible ? 'text-green-400' : 'text-red-400'}>
                            {product.is_visible ? 'Visible' : 'Hidden'}
                          </span>
                          {product.is_featured && <span className="text-yellow-400">Featured</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Form Header with Back Button */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-nyx-gray text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Products
                </button>
                <h3 className="text-xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name and Tagline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2 font-medium">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-medium">Tagline</label>
                    <input
                      type="text"
                      value={formData.tag_line}
                      onChange={(e) => setFormData({ ...formData, tag_line: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors"
                      placeholder="Short product tagline"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white mb-2 font-medium">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors h-24 resize-none"
                    placeholder="Describe your product..."
                    required
                  />
                </div>

                {/* Price Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2 font-medium">Price (€) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    {/* Apply Discount Switch */}
                    <div className="flex items-end">
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
                      <label className="block text-white mb-2 font-medium">Discounted Price (€) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.original_price}
                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                        className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors"
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
                    <label className="block text-white mb-2 font-medium">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-medium">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors"
                      placeholder="Product SKU"
                    />
                  </div>
                </div>

                {/* Image URLs */}
                <div>
                  <label className="block text-white mb-2 font-medium">Image URLs</label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                  <p className="text-sm text-gray-400 mt-1">Separate multiple URLs with commas</p>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-white mb-2 font-medium">Features</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors"
                    placeholder="WiFi, Bluetooth, Voice Control"
                  />
                  <p className="text-sm text-gray-400 mt-1">Separate features with commas</p>
                </div>

                {/* Specifications */}
                <div>
                  <label className="block text-white mb-2 font-medium">Specifications</label>
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
                          className="bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors"
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
                            className="flex-1 bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-nyx-blue focus:outline-none transition-colors"
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
                    className="bg-nyx-blue text-nyx-black px-6 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-nyx-black"></div>
                        {editingProduct ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingProduct ? 'Update Product' : 'Create Product'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-nyx-gray text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};