import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutPageProps {
    navigateTo: (page: string, params?: any) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigateTo }) => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Redirect if cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            navigateTo('products');
        }
    }, [cart, navigateTo]);

    // Form states
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('Turkey');
    
    // Payment states
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    // Format card number (XXXX XXXX XXXX XXXX)
    const formatCardNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
        return formatted.substring(0, 19); // Max 16 digits + 3 spaces
    };

    // Format expiry date (MM/YY)
    const formatExpiryDate = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length >= 2) {
            return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
        }
        return numbers;
    };

    // Handle card number input
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
        
        // Auto-submit when 16 digits are entered (TEST MODE)
        const digitsOnly = formatted.replace(/\D/g, '');
        if (digitsOnly.length === 16 && cardName && expiryDate && cvv) {
            handlePayment();
        }
    };

    // Handle expiry date input
    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiryDate(e.target.value);
        setExpiryDate(formatted);
    };

    // Handle CVV input
    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numbers = e.target.value.replace(/\D/g, '').substring(0, 3);
        setCvv(numbers);
    };

    // Detect card type
    const getCardType = (number: string) => {
        const digitsOnly = number.replace(/\D/g, '');
        if (digitsOnly.startsWith('4')) return 'Visa';
        if (digitsOnly.startsWith('5')) return 'Mastercard';
        if (digitsOnly.startsWith('3')) return 'American Express';
        return null;
    };

    // Handle payment (TEST MODE - NO REAL PAYMENT)
    const handlePayment = async () => {
        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            // Generate fake order number
            const fakeOrderNumber = 'NYX-' + Date.now().toString().slice(-8);
            setOrderNumber(fakeOrderNumber);
            setPaymentSuccess(true);
            setIsProcessing(false);
            
            // Clear cart after 2 seconds
            setTimeout(() => {
                clearCart();
            }, 2000);
        }, 2000);
    };

    // Payment success screen
    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-dark text-white py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        {/* Success Animation */}
                        <div className="mb-8">
                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
                            <p className="text-gray-400 text-lg mb-2">Thank you for your order</p>
                            <p className="text-nyx-blue font-semibold text-xl">Order #{orderNumber}</p>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-6">
                            <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between text-gray-300">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-lg">
                                    <span>Total</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Message */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                            <p className="text-blue-300 text-sm">
                                📧 A confirmation email has been sent to <span className="font-semibold">{user?.email}</span>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigateTo('products')}
                                className="px-6 py-3 bg-nyx-blue text-nyx-black font-semibold rounded-xl hover:bg-white transition-all"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigateTo('profile')}
                                className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                            >
                                View Orders
                            </button>
                        </div>

                        {/* TEST MODE WARNING */}
                        <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <p className="text-red-300 text-sm font-semibold">
                                ⚠️ TEST MODE: No real payment was processed. This is a demo checkout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const cardType = getCardType(cardNumber);

    return (
        <div className="min-h-screen bg-dark text-white py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigateTo('products')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Products
                        </button>
                        <h1 className="text-4xl font-bold">Checkout</h1>
                        <p className="text-gray-400 mt-2">Complete your purchase</p>
                    </div>

                    {/* TEST MODE WARNING */}
                    <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-300 text-sm font-semibold flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            TEST MODE: Enter any 16-digit card number to complete the test checkout
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Payment Form */}
                        <div className="space-y-6">
                            {/* Card Information */}
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Payment Information</h3>
                                
                                <div className="space-y-4">
                                    {/* Card Number */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={handleCardNumberChange}
                                                placeholder="1234 5678 9012 3456"
                                                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-all"
                                                required
                                            />
                                            {cardType && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-nyx-blue">
                                                    {cardType}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Name */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Cardholder Name</label>
                                        <input
                                            type="text"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            placeholder="JOHN DOE"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-all uppercase"
                                            required
                                        />
                                    </div>

                                    {/* Expiry Date & CVV */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                value={expiryDate}
                                                onChange={handleExpiryDateChange}
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-all"
                                                maxLength={5}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-2">CVV</label>
                                            <input
                                                type="text"
                                                value={cvv}
                                                onChange={handleCvvChange}
                                                placeholder="123"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-all"
                                                maxLength={3}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Billing Address</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Address</label>
                                        <input
                                            type="text"
                                            value={billingAddress}
                                            onChange={(e) => setBillingAddress(e.target.value)}
                                            placeholder="123 Main Street"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-2">City</label>
                                            <input
                                                type="text"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder="Istanbul"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-2">Postal Code</label>
                                            <input
                                                type="text"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                placeholder="34000"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-nyx-blue focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">Country</label>
                                        <select
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-nyx-blue focus:outline-none transition-all"
                                        >
                                            <option value="Turkey">Turkey</option>
                                            <option value="United States">United States</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="Germany">Germany</option>
                                            <option value="France">France</option>
                                            <option value="Spain">Spain</option>
                                            <option value="Italy">Italy</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                                
                                {/* Cart Items */}
                                <div className="space-y-4 mb-6">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h4 className="text-white font-semibold">{item.name}</h4>
                                                <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                                                <p className="text-nyx-blue font-semibold mt-1">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-white/10 pt-4 space-y-2">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-green-400">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Tax (18%)</span>
                                        <span>${(getCartTotal() * 0.18).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold text-xl">
                                        <span>Total</span>
                                        <span>${(getCartTotal() * 1.18).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Pay Button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={!cardNumber || !cardName || !expiryDate || !cvv || isProcessing || cardNumber.replace(/\D/g, '').length !== 16}
                                    className="w-full mt-6 px-6 py-4 bg-nyx-blue text-nyx-black font-bold rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Complete Payment
                                        </>
                                    )}
                                </button>

                                {/* Security Icons */}
                                <div className="mt-4 flex items-center justify-center gap-4 text-gray-500 text-xs">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Secure Payment
                                    </div>
                                    <span>•</span>
                                    <span>SSL Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

