'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChevronDown, ChevronUp, Clock, Package, CheckCircle } from 'lucide-react';

export default function PharmacistOrders() {
  const supabase = createClientComponentClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    // Fetch orders + items + user name
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        profiles (display_name)
      `)
      .order('created_at', { ascending: false });
    
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    // Optimistic Update (Update UI instantly)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    // Update DB
    await supabase.from('orders').update({ status }).eq('id', id);
  };

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Incoming Orders</h1>
        <p className="text-gray-500">Validate prescriptions and process shipments.</p>
      </div>

      {/* Simple Stats for Pharmacist */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#0a111d] p-5 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-4">
           <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg"><Clock className="w-6 h-6"/></div>
           <div><p className="text-xs text-gray-500 uppercase">Pending</p><h3 className="text-xl font-bold">{orders.filter(o => o.status === 'pending').length}</h3></div>
        </div>
        <div className="bg-white dark:bg-[#0a111d] p-5 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-4">
           <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg"><Package className="w-6 h-6"/></div>
           <div><p className="text-xs text-gray-500 uppercase">Processing</p><h3 className="text-xl font-bold">{orders.filter(o => o.status === 'paid' || o.status === 'shipped').length}</h3></div>
        </div>
        <div className="bg-white dark:bg-[#0a111d] p-5 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-4">
           <div className="p-3 bg-green-500/10 text-green-500 rounded-lg"><CheckCircle className="w-6 h-6"/></div>
           <div><p className="text-xs text-gray-500 uppercase">Completed</p><h3 className="text-xl font-bold">{orders.filter(o => o.status === 'delivered').length}</h3></div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a111d] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
           <div className="p-12 text-center text-gray-500">No orders found.</div>
        ) : (
           orders.map((order) => (
            <div key={order.id} className="border-b border-gray-100 dark:border-white/5 last:border-0">
               {/* Order Row */}
               <div 
                 className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition"
                 onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
               >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold">
                      {order.profiles?.display_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="font-bold">{order.profiles?.display_name || 'Unknown User'}</h4>
                      <p className="text-xs text-gray-500">Ordered: {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                     <span className="font-bold">{formatIDR(order.total_amount)}</span>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                     }`}>{order.status}</span>
                     {expandedId === order.id ? <ChevronUp className="w-4 h-4 text-gray-400"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
                  </div>
               </div>
               
               {/* Expanded Details */}
               {expandedId === order.id && (
                 <div className="px-6 pb-6 pt-0 pl-4 md:pl-20 bg-gray-50/50 dark:bg-black/20">
                   {/* Items List */}
                   <div className="py-4 space-y-2">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">
                            <span className="font-bold text-gray-900 dark:text-white">{item.quantity}x</span> {item.product_name}
                          </span>
                          <span className="text-gray-500">{formatIDR(item.price_per_unit * item.quantity)}</span>
                        </div>
                      ))}
                   </div>

                   {/* Prescription Check */}
                   {order.prescription_url && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Prescription Attached</p>
                        <a href={order.prescription_url} target="_blank" className="text-sm underline text-blue-500">View Document</a>
                      </div>
                   )}

                   {/* Action Buttons */}
                   <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-white/10">
                      <span className="text-xs font-bold uppercase text-gray-500 py-2 mr-2">Set Status:</span>
                      {['pending', 'paid', 'shipped', 'delivered'].map(status => (
                        <button 
                          key={status}
                          onClick={() => updateStatus(order.id, status)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold capitalize border transition ${
                            order.status === status 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-white dark:bg-transparent border-gray-300 dark:border-white/20 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                   </div>
                 </div>
               )}
            </div>
           ))
        )}
      </div>
    </div>
  );
}