
import React, { useState } from 'react';
import { PRODUCTS_DATA } from '../constants';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import ArrowRightIcon from './icons/ArrowRightIcon';

// Sub-component for individual product cards
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { addToCart, openCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product, 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
        setTimeout(() => openCart(), 300);
    };

    return (
        <div className="bg-dark-accent rounded-2xl border border-white/10 overflow-hidden flex flex-col group">
            <div className="aspect-square overflow-hidden">
                <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm flex-grow mb-4">{product.tagline}</p>
                 <div className="mt-auto pt-4 space-y-4">
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`w-full font-semibold py-3 px-5 rounded-full transition-all duration-300 transform group-hover:scale-105 text-sm ${
                            isAdded 
                                ? 'bg-green-500 text-white cursor-default' 
                                : 'bg-brand-purple text-white hover:bg-brand-purple/80'
                        }`}
                    >
                        {isAdded ? 'Added' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ProductsSectionProps {
  navigateTo: (page: string) => void;
  products: Product[];
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ navigateTo, products }) => {
    return (
        <section id="products" className="py-20 md:py-32 bg-dark">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-8">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">Our Collection</h2>
                        <p className="text-gray-300 text-lg md:text-xl">
                            A curated selection of smart devices designed to work in harmony, creating a truly intelligent home.
                        </p>
                    </div>
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); navigateTo('products'); }}
                        className="flex-shrink-0 group flex items-center gap-3 border border-gray-600 text-gray-300 font-medium py-3 px-6 rounded-full hover:border-white hover:text-white transition-all duration-300"
                    >
                        <span>See All Products</span>
                        <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product.name} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;
