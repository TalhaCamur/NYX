import React, { useState } from 'react';
import { PRODUCT_DATA } from '../constants';
import { CheckIcon } from './icons/CheckIcon';
import { useCart } from '../contexts/CartContext';

const ProductShowcase: React.FC = () => {
    const [mainImage, setMainImage] = useState(PRODUCT_DATA.images[0]);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const { addToCart, openCart } = useCart();
    
    const incrementQuantity = () => setQuantity(q => Math.min(q + 1, 5));
    const decrementQuantity = () => setQuantity(q => Math.max(q - 1, 1));

    const handleAddToCart = () => {
        addToCart(PRODUCT_DATA, quantity);
        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
        setTimeout(() => {
            openCart();
        }, 300);
    };

    return (
        <section id="product" className="py-20 md:py-32 bg-dark">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                {/* Image Gallery */}
                <div className="flex flex-col gap-4 sticky top-28">
                    <div className="aspect-square bg-dark-accent rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 shadow-lg shadow-brand-purple/20 transition-all duration-300 hover:shadow-xl hover:shadow-brand-purple/30">
                        <img src={mainImage} alt="Main product view" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                    {PRODUCT_DATA.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {PRODUCT_DATA.images.map((img, index) => (
                                <div 
                                    key={index} 
                                    className={`aspect-square bg-dark-accent rounded-lg cursor-pointer overflow-hidden border-2 transition-all ${mainImage === img ? 'border-brand-purple scale-105' : 'border-white/10 hover:border-white/30'}`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img src={img} alt={`Product thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="lg:pt-8">
                    <span className="bg-brand-purple/10 text-brand-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Limited Edition - {PRODUCT_DATA.stock} Units
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold my-5">{PRODUCT_DATA.name}</h1>
                    <p className="text-gray-300 text-xl mb-8">{PRODUCT_DATA.tagline}</p>

                    <div className="flex items-baseline space-x-3 mb-8">
                        <span className="text-5xl font-bold text-white">${PRODUCT_DATA.price.toFixed(2)}</span>
                        {PRODUCT_DATA.originalPrice && (
                             <span className="text-2xl text-gray-500 line-through">${PRODUCT_DATA.originalPrice.toFixed(2)}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                         <div className="flex items-center border border-gray-600 rounded-full">
                            <button onClick={decrementQuantity} disabled={quantity <= 1} className="px-5 py-3 text-lg rounded-l-full hover:bg-dark-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed">-</button>
                            <span className="px-4 py-3 text-lg w-12 text-center select-none font-medium">{quantity}</span>
                            <button onClick={incrementQuantity} disabled={quantity >= 5} className="px-5 py-3 text-lg rounded-r-full hover:bg-dark-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className={`flex-1 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 text-lg ${isAdded ? 'bg-green-500 text-white cursor-default' : 'bg-brand-purple text-white hover:bg-brand-purple/80'}`}
                            disabled={isAdded}
                        >
                            {isAdded ? 'Added!' : 'Add to Cart'}
                        </button>
                    </div>

                    <div className="text-sm text-gray-400 flex items-center mb-10">
                        <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>In Stock & Ready to Ship. Max 5 per customer.</span>
                    </div>

                    <div className="bg-dark-accent border border-white/10 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                        <ul className="space-y-3 text-base">
                            {PRODUCT_DATA.specs.map(spec => (
                                <li key={spec.name} className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">{spec.name}</span>
                                    <span className="font-medium text-white">{spec.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;