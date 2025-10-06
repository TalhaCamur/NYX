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

  const discountPercentage = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <a 
      href={`#product-detail/${product.id}`}
      className="product-card cursor-pointer group block"
    >
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.images?.[0] || product.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discountPercentage}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-nyx-blue transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {product.original_price && product.original_price > product.price ? (
              <div className="flex items-center gap-2">
                <span className="text-lg text-gray-400 line-through">€{product.original_price}</span>
                <span className="text-2xl font-bold text-nyx-blue">€{product.price}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-white">€{product.price}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              product.stock > 0 
                ? 'bg-nyx-blue text-nyx-black hover:bg-white hover:scale-105' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </a>
  );
};

// List View Component
export const ProductListItem: React.FC<ProductCardProps> = ({ product, navigateTo }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const discountPercentage = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <a 
      href={`#product-detail/${product.id}`}
      className="bg-nyx-gray/30 backdrop-blur-sm rounded-xl border border-white/10 hover:border-nyx-blue/50 transition-all duration-300 cursor-pointer group overflow-hidden block"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-72 h-64 md:h-auto overflow-hidden relative flex-shrink-0">
          <img 
            src={product.images?.[0] || product.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercentage}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-nyx-blue transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-400 mb-4 line-clamp-3">{product.description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              {/* Price */}
              <div className="flex items-center gap-3">
                {product.original_price && product.original_price > product.price ? (
                  <>
                    <span className="text-xl text-gray-400 line-through">€{product.original_price}</span>
                    <span className="text-3xl font-bold text-nyx-blue">€{product.price}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-white">€{product.price}</span>
                )}
              </div>
              
              {/* Stock */}
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('product-detail', { product });
                }}
                className="px-6 py-3 rounded-lg font-semibold border border-nyx-blue text-nyx-blue hover:bg-nyx-blue hover:text-nyx-black transition-all"
              >
                View Details
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  product.stock > 0 
                    ? 'bg-nyx-blue text-nyx-black hover:bg-white hover:scale-105' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};