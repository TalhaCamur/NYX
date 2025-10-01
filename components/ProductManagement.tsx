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
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Role-based access control
  const isAuthorized = user && (user.roles.includes('seller') || user.roles.includes('admin') || user.roles.includes('super-admin'));
  const canManageAllProducts = user && (user.roles.includes('admin') || user.roles.includes('super-admin'));
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
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
  
  // New states for enhanced form
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState('');
  const [specs, setSpecs] = useState<Array<{name: string, value: string}>>([{name: '', value: ''}]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (openAddForm) {
      setShowAddForm(true);
      setEditingProduct(null);
      resetForm();
    }
  }, [openAddForm]);

  const fetchProducts = async () => {
    try {
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

  // Image upload function
  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    });
    
    try {
      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Add new spec row
  const addSpec = () => {
    setSpecs(prev => [...prev, {name: '', value: ''}]);
  };

  // Remove spec row
  const removeSpec = (index: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  // Update spec
  const updateSpec = (index: number, field: 'name' | 'value', value: string) => {
    setSpecs(prev => prev.map((spec, i) => 
      i === index ? {...spec, [field]: value} : spec
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Form submitted!', formData);
    try {
      // Combine uploaded images with URL images
      const allImages = [
        ...uploadedImages,
        ...imageUrls.split(',').map(url => url.trim()).filter(url => url)
      ];
      
      // Convert specs array to object
      const specsObject = specs.reduce((acc, spec) => {
        if (spec.name && spec.value) {
          acc[spec.name] = spec.value;
        }
        return acc;
      }, {} as Record<string, string>);
      
      const productData = {
        ...formData,
        price: applyDiscount ? parseFloat(discountedPrice) : parseFloat(formData.price),
        original_price: applyDiscount ? parseFloat(formData.price) : null,
        stock: parseInt(formData.stock),
        images: allImages,
        specs: specsObject,
        features: formData.features.split(',').map(feature => feature.trim()).filter(feature => feature),
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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

      setEditingProduct(null);
      setShowAddForm(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tagline: '',
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
    setApplyDiscount(false);
    setDiscountedPrice('');
    setUploadedImages([]);
    setImageUrls('');
    setSpecs([{name: '', value: ''}]);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      tagline: product.tagline,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      stock: product.stock.toString(),
      sku: product.sku || '',
      images: product.images.join(', '),
      specs: JSON.stringify(product.specs, null, 2),
      features: product.features.join(', '),
      is_visible: product.is_visible,
      is_featured: product.is_featured || false
    });
    
    // Set discount state
    setApplyDiscount(!!product.original_price);
    setDiscountedPrice(product.original_price ? product.price.toString() : '');
    
    // Set images
    setUploadedImages([]);
    setImageUrls(product.images.join(', '));
    
    // Set specs
    const specsArray = Object.entries(product.specs || {}).map(([name, value]) => ({name, value}));
    setSpecs(specsArray.length > 0 ? specsArray : [{name: '', value: ''}]);
    
    setShowAddForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Access control check
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-nyx-black rounded-2xl border border-nyx-gray/50 p-8 text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">You don't have permission to manage products.</p>
          <p className="text-sm text-gray-500 mb-6">Required roles: Seller, Admin, or Super Admin</p>
          <button
            onClick={onClose}
            className="bg-nyx-gray text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-nyx-black p-8 rounded-2xl">
          <div className="text-white">Loading products...</div>
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
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center text-white mb-2">
                    <div className="relative inline-block w-12 h-6 mr-3">
                      <input
                        type="checkbox"
                        checked={applyDiscount}
                        onChange={(e) => setApplyDiscount(e.target.checked)}
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
                    Apply Discount
                  </label>
                  {applyDiscount && (
                    <input
                      type="number"
                      step="0.01"
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(e.target.value)}
                      placeholder="Discounted price"
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-white mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white h-24"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Product Images</label>
                
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">Upload Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-nyx-blue file:text-nyx-black hover:file:bg-white"
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-gray-400 mt-1">Uploading images...</p>}
                </div>
                
                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-2">Uploaded Images</label>
                    <div className="flex flex-wrap gap-2">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt={`Uploaded ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Image URLs */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Or add image URLs (comma-separated)</label>
                  <textarea
                    value={imageUrls}
                    onChange={(e) => setImageUrls(e.target.value)}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white h-20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Product Specifications</label>
                <div className="space-y-3">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder="Spec name (e.g., Weight, Dimensions)"
                        value={spec.name}
                        onChange={(e) => updateSpec(index, 'name', e.target.value)}
                        className="flex-1 bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Spec value (e.g., 2.5kg, 10x15cm)"
                        value={spec.value}
                        onChange={(e) => updateSpec(index, 'value', e.target.value)}
                        className="flex-1 bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="bg-red-500 text-white w-8 h-8 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                        disabled={specs.length === 1}
                        title="Remove specification"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSpec}
                    className="bg-nyx-blue text-nyx-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
                  >
                    Add Specification
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Features (comma-separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                />
              </div>

              <div className="space-y-4">
                {/* Visible to Everyone Switch */}
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

                {/* Featured Product Switch */}
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
                      <p className="text-sm text-gray-400">Product will be highlighted on homepage and featured sections</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-nyx-blue text-nyx-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-nyx-gray text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-nyx-gray rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                      <p className="text-gray-300 mb-2">{product.tagline}</p>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Price: ${product.price}</span>
                        <span>Stock: {product.stock}</span>
                        <span>SKU: {product.sku || 'N/A'}</span>
                        <span className={product.is_visible ? 'text-green-400' : 'text-red-400'}>
                          {product.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                        {product.is_featured && <span className="text-yellow-400">Featured</span>}
                      </div>
                    </div>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
