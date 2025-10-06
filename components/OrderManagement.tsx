import React, { useState, useEffect } from 'react';
import { supabase } from '../contexts/AuthContext';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  shipping_address: any;
  billing_address: any;
  tracking_number: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_snapshot: any;
}

interface OrderManagementProps {
  onClose: () => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({ onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey(first_name, last_name, email),
          order_items(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedOrders = data?.map(order => ({
        ...order,
        customer_name: order.profiles ? `${order.profiles.first_name} ${order.profiles.last_name}` : 'Guest',
        customer_email: order.profiles?.email || 'N/A',
        items: order.order_items || []
      })) || [];
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'shipped': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'shipped':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span className="text-white/60">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No orders yet</h3>
        <p className="text-white/60">Your orders will appear here once you make a purchase.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === status
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all cursor-pointer"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">#{order.order_number}</h3>
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-white/60">
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  <span className="font-medium text-white">€{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Order #{selectedOrder.order_number}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Order Status */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span>{selectedOrder.status}</span>
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Items</h3>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Product #{item.product_id}</p>
                      <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-semibold">€{item.total_price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 rounded-xl p-6 space-y-3">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>€{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax</span>
                  <span>€{selectedOrder.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>€{selectedOrder.shipping_amount.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>€{selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};