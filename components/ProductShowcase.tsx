import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import ArrowRightIcon from './icons/ArrowRightIcon';
import { useAuth } from '../contexts/AuthContext';
import TrashIcon from './icons/TrashIcon';

// Sub-component for individual product cards
export const ProductCard = ({ product, navigateTo }: { product: Product; navigateTo: (page: string, params?: any) => void }) => {
    const { user } = useAuth();
    const { cartItems, addToCart, updateItemQuantity, removeFromCart } = useCart();
    const isAuthorized = user && (user.roles.includes('seller') || user.roles.includes('admin') || user.roles.includes('super-admin'));

    const cartItem = cartItems.find(item => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    return (
        <div className="bg-dark-accent rounded-2xl border border-white/10 overflow-hidden flex flex-col group relative">
             {!product.isVisible && isAuthorized && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full z-10">
                    Hidden
                </div>
            )}
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
                 <div className="mt-auto pt-4 space-y-2">
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-white">€{product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">€{product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    
                    {quantityInCart === 0 ? (
                        <button
                            onClick={handleAddToCart}
                            className="w-full font-semibold py-3 px-5 rounded-full transition-all duration-300 transform group-hover:scale-105 text-sm bg-brand-purple text-white hover:bg-brand-purple/80"
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <div className="flex items-center justify-between bg-dark border border-gray-700 rounded-full h-[46px]">
                            <button 
                                onClick={() => quantityInCart === 1 ? removeFromCart(product.id) : updateItemQuantity(product.id, quantityInCart - 1)} 
                                className="p-3 text-gray-400 hover:text-white transition-colors rounded-full"
                                aria-label={quantityInCart === 1 ? "Remove item" : "Decrease quantity"}
                            >
                                {quantityInCart === 1 ? <TrashIcon className="w-5 h-5 text-red-500" /> : <span className="w-5 h-5 flex items-center justify-center text-2xl leading-none font-light">-</span>}
                            </button>
                            <span className="font-bold text-white text-lg select-none">{quantityInCart}</span>
                            <button 
                                onClick={() => updateItemQuantity(product.id, quantityInCart + 1)} 
                                disabled={quantityInCart >= 5}
                                className="p-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
                                aria-label="Increase quantity"
                            >
                                <span className="w-5 h-5 flex items-center justify-center text-2xl leading-none font-light">+</span>
                            </button>
                        </div>
                    )}

                    {isAuthorized && (
                        <button
                            onClick={() => navigateTo('edit-product', { id: product.id })}
                            className="w-full text-center font-semibold py-3 px-5 rounded-full transition-all duration-300 text-sm bg-gray-700 text-white hover:bg-gray-600"
                        >
                            Edit Product
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

interface ProductShowcaseProps {
  navigateTo: (page: string, params?: any) => void;
  products: Product[];
}

const ProductShowcase = ({ navigateTo, products }: ProductShowcaseProps) => {
    const { user } = useAuth();
    const isAuthorized = user && (user.roles.includes('seller') || user.roles.includes('admin') || user.roles.includes('super-admin'));

    const displayedProducts = (isAuthorized ? products : products.filter(p => p.isVisible)).slice(0, 4);
    
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
                    {displayedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} navigateTo={navigateTo} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;