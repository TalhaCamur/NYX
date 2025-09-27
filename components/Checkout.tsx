import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../contexts/AuthContext';

interface CheckoutProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onClose, onSuccess }) => {
  const { cartItems, getCartTotalPrice, getCartTotalQuantity } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const subtotal = getCartTotalPrice();
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const discountAmount = appliedCoupon ? calculateDiscount(subtotal) : 0;
  const total = subtotal + taxAmount + shippingAmount - discountAmount;

  function calculateDiscount(subtotal: number): number {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      const discount = (subtotal * appliedCoupon.value) / 100;
      return appliedCoupon.maximum_discount ? Math.min(discount, appliedCoupon.maximum_discount) : discount;
    } else {
      return Math.min(appliedCoupon.value, subtotal);
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        setCouponError('Invalid coupon code');
        return;
      }
      
      // Check if coupon is valid
      const now = new Date();
      const validFrom = new Date(data.valid_from);
      const validUntil = data.valid_until ? new Date(data.valid_until) : null;
      
      if (now < validFrom || (validUntil && now > validUntil)) {
        setCouponError('Coupon has expired');
        return;
      }
      
      if (data.usage_limit && data.used_count >= data.usage_limit) {
        setCouponError('Coupon usage limit reached');
        return;
      }
      
      if (subtotal < data.minimum_amount) {
        setCouponError(`Minimum order amount of $${data.minimum_amount} required`);
        return;
      }
      
      setAppliedCoupon(data);
      setCouponError('');
    } catch (error) {
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Generate order number
      const { data: orderNumber } = await supabase.rpc('generate_order_number');
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          user_id: user?.id,
          status: 'pending',
          subtotal: subtotal,
          tax_amount: taxAmount,
          shipping_amount: shippingAmount,
          discount_amount: discountAmount,
          total_amount: total,
          payment_status: 'pending',
          payment_method: formData.paymentMethod,
          shipping_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone
          },
          billing_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone
          }
        }])
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        product_snapshot: {
          name: item.name,
          tagline: item.tagline,
          images: item.images,
          specs: item.specs
        }
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Update product stock
      for (const item of cartItems) {
        await supabase.rpc('update_product_stock', {
          product_uuid: item.id,
          quantity_change: item.quantity,
          transaction_type: 'out',
          reason: `Order ${orderNumber}`
        });
      }
      
      // Record coupon usage if applied
      if (appliedCoupon) {
        await supabase
          .from('coupon_usages')
          .insert([{
            coupon_id: appliedCoupon.id,
            user_id: user?.id,
            order_id: order.id,
            discount_amount: discountAmount
          }]);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-nyx-black rounded-2xl border border-nyx-gray/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some products to your cart before checkout.</p>
          <button
            onClick={onClose}
            className="bg-nyx-blue text-nyx-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-nyx-black rounded-2xl border border-nyx-gray/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-nyx-gray/50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Checkout</h2>
          <button
            onClick={onClose}
            className="bg-nyx-gray text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">Card Number</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">CVV</label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white mb-2">Name on Card</label>
                    <input
                      type="text"
                      value={formData.nameOnCard}
                      onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
                      className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded object-cover" />
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Coupon Code</h3>
                <div className="space-y-3">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="bg-nyx-blue text-nyx-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-green-400 font-semibold">{appliedCoupon.code}</p>
                          <p className="text-green-300 text-sm">{appliedCoupon.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  {couponError && <p className="text-red-400 text-sm">{couponError}</p>}
                </div>
              </div>

              <div className="bg-nyx-gray rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">
                    {shippingAmount === 0 ? 'Free' : `$${shippingAmount.toFixed(2)}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-400">Discount</span>
                    <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-2">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold text-lg">Total</span>
                    <span className="text-white font-semibold text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-nyx-blue text-nyx-black py-3 rounded-lg font-semibold hover:bg-white transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
