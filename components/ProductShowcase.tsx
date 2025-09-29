import React from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  navigateTo: (page: string, params?: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, navigateTo }) => {
  const { addToCart } = useCart();


  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div 
      className="product-card cursor-pointer"
      onClick={() => navigateTo('product-detail', { product })}
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.images?.[0] || product.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 hover:text-nyx-blue transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4">{product.description?.substring(0, 100)}...</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">${product.price}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-nyx-blue text-nyx-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};