import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Checkout } from './Checkout';
import CloseIcon from './icons/CloseIcon';
import TrashIcon from './icons/TrashIcon';

const CartSidebar = ({ navigateTo }: { navigateTo: (page: string, params?: any) => void }) => {
    const { isCartOpen, closeCart, cartItems, removeFromCart, updateItemQuantity, getCartTotalPrice } = useCart();
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);

    if (!isCartOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/60 z-[99] backdrop-blur-sm"
                onClick={closeCart}
            ></div>
            <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-nyx-black border-l border-nyx-gray/50 z-[100] transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                <header className="flex justify-between items-center p-6 border-b border-nyx-gray/50">
                    <h2 className="text-xl font-semibold">Your Cart</h2>
                    <button onClick={closeCart} className="text-gray-400 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-grow p-6 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-400 h-full flex flex-col justify-center items-center">
                            <p className="text-lg">Your cart is empty.</p>
                            <button onClick={closeCart} className="mt-4 text-nyx-blue hover:underline">Continue Shopping</button>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map(item => (
                                <li key={item.id} className="flex gap-4 items-center">
                                    <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-nyx-gray" />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-400">€{item.price.toFixed(2)}</p>
                                        <div className="flex items-center mt-2">
                                            <div className="flex items-center border border-gray-700 rounded-full text-sm">
                                                {item.quantity === 1 ? (
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)} 
                                                        className="w-8 py-1 hover:bg-nyx-gray/50 rounded-l-full flex items-center justify-center"
                                                        aria-label="Remove item"
                                                    >
                                                        <TrashIcon className="w-4 h-4 text-red-500" />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)} 
                                                        className="w-8 py-1 hover:bg-nyx-gray/50 rounded-l-full"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        -
                                                    </button>
                                                )}
                                                <span className="px-3 select-none">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)} 
                                                    disabled={item.quantity >= 5}
                                                    className="w-8 py-1 hover:bg-nyx-gray/50 rounded-r-full disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 transition-colors mt-2">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <footer className="p-6 border-t border-nyx-gray/50">
                        <div className="flex justify-between items-center mb-4 text-lg">
                            <span className="font-medium">Subtotal</span>
                            <span className="font-bold text-nyx-blue">€{getCartTotalPrice().toFixed(2)}</span>
                        </div>
                         <div className="flex items-start gap-3 mb-4">
                            <input
                                type="checkbox"
                                id="cart-terms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 h-4 w-4 shrink-0 rounded border-gray-600 bg-nyx-black text-nyx-blue focus:ring-nyx-blue focus:ring-offset-nyx-black"
                            />
                            <label htmlFor="cart-terms" className="text-xs text-gray-400">
                                I agree to the{' '}
                                <button type="button" onClick={() => { closeCart(); navigateTo('legal', { slug: 'terms-conditions', title: 'Terms & Conditions' }); }} className="font-semibold text-nyx-blue hover:underline focus:outline-none">
                                    Terms & Conditions
                                </button> and{' '}
                                <button type="button" onClick={() => { closeCart(); navigateTo('legal', { slug: 'privacy-policy', title: 'Privacy Policy' }); }} className="font-semibold text-nyx-blue hover:underline focus:outline-none">
                                    Privacy Policy
                                </button>.
                            </label>
                        </div>
                        <button 
                            onClick={() => setShowCheckout(true)}
                            disabled={!agreedToTerms}
                            className="w-full bg-nyx-blue text-nyx-black font-bold py-3 px-8 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            Proceed to Checkout
                        </button>
                    </footer>
                )}
            </aside>
            {showCheckout && (
                <Checkout
                    onClose={() => setShowCheckout(false)}
                    onSuccess={() => {
                        setShowCheckout(false);
                        closeCart();
                        alert('Order placed successfully!');
                    }}
                />
            )}
        </>
    );
};

export default CartSidebar;