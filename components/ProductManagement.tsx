import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../contexts/AuthContext';

interface ProductManagementProps {
  onClose: () => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({ onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    sku: '',
    images: '',
    specs: '',
    features: '',
    isVisible: true,
    isFeatured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
        images: formData.images.split(',').map(url => url.trim()).filter(url => url),
        specs: formData.specs ? JSON.parse(formData.specs) : {},
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
      originalPrice: '',
      stock: '',
      sku: '',
      images: '',
      specs: '',
      features: '',
      isVisible: true,
      isFeatured: false
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      tagline: product.tagline,
      description: product.description || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      stock: product.stock.toString(),
      sku: product.sku || '',
      images: product.images.join(', '),
      specs: JSON.stringify(product.specs, null, 2),
      features: product.features.join(', '),
      isVisible: product.isVisible,
      isFeatured: product.isFeatured || false
    });
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
              onClick={() => {
                setShowAddForm(true);
                setEditingProduct(null);
                resetForm();
              }}
              className="bg-nyx-blue text-nyx-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
            >
              Add Product
            </button>
            <button
              onClick={onClose}
              className="bg-nyx-gray text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
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
                  <label className="block text-white mb-2">Price</label>
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
                  <label className="block text-white mb-2">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                  />
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
                <label className="block text-white mb-2">Images (comma-separated URLs)</label>
                <textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white h-20"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Specs (JSON format)</label>
                <textarea
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white h-24 font-mono"
                />
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

              <div className="flex gap-4">
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="mr-2"
                  />
                  Visible
                </label>
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="mr-2"
                  />
                  Featured
                </label>
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
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
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
                        <span className={product.isVisible ? 'text-green-400' : 'text-red-400'}>
                          {product.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                        {product.isFeatured && <span className="text-yellow-400">Featured</span>}
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
