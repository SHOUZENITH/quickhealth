'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Search
} from 'lucide-react';

export default function AdminDashboard() {
  const supabase = createClientComponentClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    // Fetch orders with their items AND the profile of the user who bought it
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        profiles (display_name, gender)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status Logic
  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      // Refresh local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050b14] text-gray-900 dark:text-white font-sans p-8">
      
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Manage pharmacy orders</p>
          </div>
        </div>

        {/* Stats Grid (Mockup for Visuals) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[#0a111d] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500"><Package className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold">{orders.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#0a111d] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500"><Clock className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#0a111d] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10 text-green-500"><CheckCircle className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <h3 className="text-2xl font-bold">
                  {formatIDR(orders.reduce((acc, curr) => acc + curr.total_amount, 0))}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white dark:bg-[#0a111d] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-lg">Recent Orders</h3>
            <button onClick={fetchOrders} className="text-sm text-blue-500 hover:underline">Refresh</button>
          </div>

          {loading ? (
             <div className="p-12 text-center text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
             <div className="p-12 text-center text-gray-500">No orders found.</div>
          ) : (
            <div>
              {orders.map((order) => (
                <div key={order.id} className="border-b border-gray-100 dark:border-white/5 last:border-0 transition hover:bg-gray-50 dark:hover:bg-white/5">
                  
                  {/* Order Header Row */}
                  <div 
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold`}>
                        {order.profiles?.display_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">
                            {order.profiles?.display_name || 'Unknown User'}
                        </h4>
                        <p className="text-xs text-gray-500">Order ID: {order.id.slice(0, 8)}...</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                       <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-bold">{formatIDR(order.total_amount)}</p>
                       </div>
                       
                       <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(order.status)}`}>
                          {order.status}
                       </div>

                       {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
                    </div>
                  </div>

                  {/* Expanded Details (Items & Actions) */}
                  {expandedOrderId === order.id && (
                    <div className="px-6 pb-6 pt-0 pl-20 animate-in slide-in-from-top-2 duration-200">
                      <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4">
                        <h5 className="text-xs font-bold uppercase text-gray-500 mb-3">Order Items</h5>
                        <ul className="space-y-2 mb-4">
                          {order.order_items.map((item: any) => (
                            <li key={item.id} className="flex justify-between text-sm">
                              <span>
                                <span className="font-bold text-gray-900 dark:text-white">{item.quantity}x</span> {item.product_name}
                              </span>
                              <span className="text-gray-500">{formatIDR(item.price_per_unit * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="border-t border-gray-200 dark:border-white/10 pt-4 flex gap-2">
                           <p className="text-xs font-bold uppercase text-gray-500 py-2 mr-2">Update Status:</p>
                           {['pending', 'paid', 'shipped', 'delivered'].map((status) => (
                             <button
                               key={status}
                               onClick={() => updateStatus(order.id, status)}
                               className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                                 order.status === status 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white dark:bg-transparent border-gray-300 dark:border-white/20 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                               }`}
                             >
                               {status.charAt(0).toUpperCase() + status.slice(1)}
                             </button>
                           ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}