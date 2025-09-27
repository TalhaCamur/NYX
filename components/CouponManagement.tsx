import React, { useState, useEffect } from 'react';
import { supabase } from '../contexts/AuthContext';

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  minimum_amount: number;
  maximum_discount: number;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  created_at: string;
}

interface CouponManagementProps {
  onClose: () => void;
}

export const CouponManagement: React.FC<CouponManagementProps> = ({ onClose }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed_amount',
    value: '',
    minimum_amount: '',
    maximum_discount: '',
    usage_limit: '',
    is_active: true,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const couponData = {
        ...formData,
        value: parseFloat(formData.value),
        minimum_amount: parseFloat(formData.minimum_amount) || 0,
        maximum_discount: formData.maximum_discount ? parseFloat(formData.maximum_discount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([couponData]);
        
        if (error) throw error;
      }

      setEditingCoupon(null);
      setShowAddForm(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      minimum_amount: '',
      maximum_discount: '',
      usage_limit: '',
      is_active: true,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: ''
    });
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      type: coupon.type,
      value: coupon.value.toString(),
      minimum_amount: coupon.minimum_amount.toString(),
      maximum_discount: coupon.maximum_discount?.toString() || '',
      usage_limit: coupon.usage_limit?.toString() || '',
      is_active: coupon.is_active,
      valid_from: new Date(coupon.valid_from).toISOString().split('T')[0],
      valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);
      
      if (error) throw error;
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const handleToggleActive = async (couponId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', couponId);
      
      if (error) throw error;
      fetchCoupons();
    } catch (error) {
      console.error('Error updating coupon status:', error);
    }
  };

  const isCouponValid = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;
    
    return coupon.is_active && 
           now >= validFrom && 
           (!validUntil || now <= validUntil) &&
           (!coupon.usage_limit || coupon.used_count < coupon.usage_limit);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-nyx-black p-8 rounded-2xl">
          <div className="text-white">Loading coupons...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-nyx-black rounded-2xl border border-nyx-gray/50 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-nyx-gray/50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Coupon Management</h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingCoupon(null);
                resetForm();
              }}
              className="bg-nyx-blue text-nyx-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
            >
              Add Coupon
            </button>
            <button
              onClick={onClose}
              className="bg-nyx-gray text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed_amount' })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed_amount">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2">Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Minimum Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimum_amount}
                    onChange={(e) => setFormData({ ...formData, minimum_amount: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Maximum Discount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maximum_discount}
                    onChange={(e) => setFormData({ ...formData, maximum_discount: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Valid Until</label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-nyx-gray border border-gray-700 rounded-lg py-2 px-3 text-white h-20"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-nyx-blue text-nyx-black px-6 py-2 rounded-lg font-semibold hover:bg-white transition-colors"
                >
                  {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCoupon(null);
                    resetForm();
                  }}
                  className="bg-nyx-gray text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="bg-nyx-gray rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{coupon.code}</h3>
                        <span className="text-gray-300">{coupon.name}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          isCouponValid(coupon) ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {isCouponValid(coupon) ? 'Valid' : 'Invalid'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          coupon.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                        }`}>
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{coupon.description}</p>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Type: {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}</span>
                        <span>Min: ${coupon.minimum_amount}</span>
                        <span>Used: {coupon.used_count}/{coupon.usage_limit || '∞'}</span>
                        <span>Valid: {new Date(coupon.valid_from).toLocaleDateString()} - {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : 'No expiry'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(coupon.id, coupon.is_active)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          coupon.is_active 
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {coupon.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete
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
