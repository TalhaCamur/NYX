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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      } else if (newStatus === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
      
      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          tracking_number: trackingNumber,
          status: 'shipped',
          shipped_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Error updating tracking number:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'confirmed': return 'bg-blue-600';
      case 'processing': return 'bg-purple-600';
      case 'shipped': return 'bg-indigo-600';
      case 'delivered': return 'bg-green-600';
      case 'cancelled': return 'bg-red-600';
      case 'refunded': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      case 'refunded': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-nyx-black p-8 rounded-2xl">
          <div className="text-white">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-nyx-black rounded-2xl border border-nyx-gray/50 w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-nyx-gray/50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Order Management</h2>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <button
              onClick={onClose}
              className="bg-nyx-gray text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {selectedOrder ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Order Details: {selectedOrder.order_number}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-nyx-gray text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Orders
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-nyx-gray rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Customer Information</h4>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  </div>
                </div>

                <div className="bg-nyx-gray rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Order Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Payment:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                        {selectedOrder.payment_status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Total:</span>
                      <span className="text-white font-semibold">${selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-nyx-gray rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <div>
                        <p className="text-white font-medium">{item.product_snapshot?.name || 'Product'}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">${item.unit_price}</p>
                        <p className="text-gray-400 text-sm">Total: ${item.total_price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-nyx-gray rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Shipping Address</h4>
                <div className="text-gray-300">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(selectedOrder.shipping_address, null, 2)}</pre>
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                  className="bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                >
                  <option value="">Update Status</option>
                  <option value="confirmed">Confirm</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancel</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Tracking Number"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTrackingUpdate(selectedOrder.id, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-nyx-gray rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{order.order_number}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </div>
                      <div className="text-gray-300 mb-2">
                        <p>Customer: {order.customer_name}</p>
                        <p>Email: {order.customer_email}</p>
                        <p>Items: {order.items.length}</p>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Total: ${order.total_amount}</span>
                        <span>Created: {new Date(order.created_at).toLocaleDateString()}</span>
                        {order.tracking_number && <span>Tracking: {order.tracking_number}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
