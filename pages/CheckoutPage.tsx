import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutPageProps {
    navigateTo: (page: string, params?: any) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigateTo }) => {
    const { cartItems, getCartTotalPrice, clearCart } = useCart();
    const { user } = useAuth();
    
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Redirect if cart is empty
    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigateTo('products');
        }
    }, [cartItems, navigateTo]);

    // Form states
    const [email, setEmail] = useState(user?.email || '');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [country, setCountry] = useState('Turkey');
    
    // Payment states
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    // Format card number (XXXX XXXX XXXX XXXX)
    const formatCardNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
        return formatted.substring(0, 19);
    };

    // Format expiry date (MM / YY)
    const formatExpiryDate = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length >= 2) {
            return numbers.substring(0, 2) + ' / ' + numbers.substring(2, 4);
        }
        return numbers;
    };

    // Handle card number input
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
        
        // Auto-submit when all fields filled (TEST MODE)
        const digitsOnly = formatted.replace(/\D/g, '');
        if (digitsOnly.length === 16 && expiryDate && cvc && cardholderName) {
            handlePayment();
        }
    };

    // Handle expiry date input
    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiryDate(e.target.value);
        setExpiryDate(formatted);
    };

    // Handle CVC input
    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numbers = e.target.value.replace(/\D/g, '').substring(0, 3);
        setCvc(numbers);
    };

    // Detect card brand
    const getCardBrand = (number: string) => {
        const digitsOnly = number.replace(/\D/g, '');
        if (digitsOnly.startsWith('4')) return 'visa';
        if (digitsOnly.startsWith('5')) return 'mastercard';
        if (digitsOnly.startsWith('3')) return 'amex';
        return 'unknown';
    };

    // Handle payment (TEST MODE - NO REAL PAYMENT)
    const handlePayment = async () => {
        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            const fakeOrderNumber = 'NYX' + Date.now().toString().slice(-10);
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full">
                    {/* Success Card */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Premium Header with Gradient */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
                            <p className="text-blue-100">Thank you for your purchase</p>
                        </div>

                        {/* Order Details */}
                        <div className="px-8 py-6 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-500">Order Number</span>
                                <span className="text-sm font-semibold text-gray-900 font-mono">#{orderNumber}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">Confirmation Email</span>
                                <span className="text-sm font-medium text-blue-600">{user?.email}</span>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="px-8 py-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4">
                                {cartItems && cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <img 
                                            src={item.images?.[0] || item.imageUrl} 
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">€{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Total */}
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">€{getCartTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">VAT (18%)</span>
                                    <span className="text-gray-900">€{(getCartTotalPrice() * 0.18).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">€{(getCartTotalPrice() * 1.18).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-8 py-6 bg-gray-50 space-y-3">
                            <button
                                onClick={() => navigateTo('products')}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigateTo('profile')}
                                className="w-full bg-white text-gray-700 font-medium py-3.5 px-4 rounded-xl hover:bg-gray-50 transition-all border border-gray-200"
                            >
                                View My Orders
                            </button>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Need help? <button onClick={() => navigateTo('contact')} className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const cardBrand = getCardBrand(cardNumber);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Premium header with logo */}
            <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigateTo('products')}
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-900">Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left side - Payment form */}
                    <div>
                        {/* Email */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Card information */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Card information
                            </label>
                            <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                {/* Card number */}
                                <div className="relative border-b border-gray-300">
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="1234 1234 1234 1234"
                                        className="w-full px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none"
                                    />
                                    {cardBrand !== 'unknown' && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {cardBrand === 'visa' && (
                                                <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none">
                                                    <rect width="48" height="32" rx="4" fill="#1434CB"/>
                                                    <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">VISA</text>
                                                </svg>
                                            )}
                                            {cardBrand === 'mastercard' && (
                                                <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none">
                                                    <rect width="48" height="32" rx="4" fill="#EB001B"/>
                                                    <circle cx="18" cy="16" r="10" fill="#FF5F00" opacity="0.8"/>
                                                    <circle cx="30" cy="16" r="10" fill="#F79E1B" opacity="0.8"/>
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* Expiry & CVC */}
                                <div className="grid grid-cols-2">
                                    <input
                                        type="text"
                                        value={expiryDate}
                                        onChange={handleExpiryDateChange}
                                        placeholder="MM / YY"
                                        className="px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none border-r border-gray-300"
                                        maxLength={7}
                                    />
                                    <input
                                        type="text"
                                        value={cvc}
                                        onChange={handleCvcChange}
                                        placeholder="CVC"
                                        className="px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none"
                                        maxLength={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cardholder name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cardholder name
                            </label>
                            <input
                                type="text"
                                value={cardholderName}
                                onChange={(e) => setCardholderName(e.target.value)}
                                placeholder="Full name on card"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Country */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country or region
                            </label>
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                                <option value="Turkey">Turkey</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="Spain">Spain</option>
                                <option value="Italy">Italy</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Austria">Austria</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Norway">Norway</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Finland">Finland</option>
                                <option value="Poland">Poland</option>
                                <option value="Czech Republic">Czech Republic</option>
                                <option value="Greece">Greece</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Thailand">Thailand</option>
                                <option value="Singapore">Singapore</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Philippines">Philippines</option>
                                <option value="Vietnam">Vietnam</option>
                                <option value="Japan">Japan</option>
                                <option value="South Korea">South Korea</option>
                                <option value="Australia">Australia</option>
                                <option value="New Zealand">New Zealand</option>
                                <option value="Canada">Canada</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Chile">Chile</option>
                                <option value="South Africa">South Africa</option>
                                <option value="Egypt">Egypt</option>
                                <option value="UAE">United Arab Emirates</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="India">India</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="China">China</option>
                            </select>
                        </div>

                        {/* Pay button */}
                        <button
                            onClick={handlePayment}
                            disabled={!cardNumber || !expiryDate || !cvc || !cardholderName || isProcessing || cardNumber.replace(/\D/g, '').length !== 16}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Pay €{(getCartTotalPrice() * 1.18).toFixed(2)}
                                </>
                            )}
                        </button>

                        {/* Security footer */}
                        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>256-bit SSL encryption</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Order summary */}
                    <div className="lg:pl-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>
                            
                            {/* Cart items */}
                            <div className="space-y-4 mb-6">
                                {cartItems && cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative">
                                            <img
                                                src={item.images?.[0] || item.imageUrl}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                            />
                                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-400 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            €{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price breakdown */}
                            <div className="space-y-2 border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">€{getCartTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (VAT 18%)</span>
                                    <span className="text-gray-900">€{(getCartTotalPrice() * 0.18).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-semibold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">€{(getCartTotalPrice() * 1.18).toFixed(2)}</span>
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
