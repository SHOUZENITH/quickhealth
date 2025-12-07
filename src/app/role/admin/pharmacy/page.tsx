'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CheckCircle, Clock, Package, ChevronUp, ChevronDown } from 'lucide-react';

export default function PharmacyPage() {
  const supabase = createClientComponentClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select(`*, order_items (*), profiles (display_name)`)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Pharmacy Orders</h2>
        <p className="text-gray-500">Manage and track shipments.</p>
      </header>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value={formatIDR(orders.reduce((acc, c) => acc + c.total_amount, 0))} icon={<CheckCircle className="text-green-500" />} />
        <StatCard title="Pending Orders" value={orders.filter(o => o.status === 'pending').length} icon={<Clock className="text-yellow-500" />} />
        <StatCard title="Total Orders" value={orders.length} icon={<Package className="text-blue-500" />} />
      </div>

      <div className="bg-white dark:bg-[#0a111d] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-gray-500">Loading orders...</div>
        ) : orders.map((order) => (
          <div key={order.id} className="border-b border-gray-100 dark:border-white/5 last:border-0">
             <div 
               className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition"
               onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
             >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                    {order.profiles?.display_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="font-bold">{order.profiles?.display_name || 'Unknown'}</h4>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <span className="font-bold">{formatIDR(order.total_amount)}</span>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                      order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      order.status === 'shipped' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                   }`}>{order.status}</span>
                   {expandedId === order.id ? <ChevronUp className="w-4 h-4 text-gray-400"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
                </div>
             </div>
             
             {expandedId === order.id && (
               <div className="px-6 pb-6 pt-0 pl-20 bg-gray-50/50 dark:bg-black/20">
                 <div className="py-4 space-y-2">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300"><b>{item.quantity}x</b> {item.product_name}</span>
                        <span className="text-gray-500">{formatIDR(item.price_per_unit * item.quantity)}</span>
                      </div>
                    ))}
                 </div>
                 <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-white/10">
                    {['pending', 'paid', 'shipped', 'delivered'].map(status => (
                      <button 
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        className={`px-3 py-1 rounded text-xs font-bold capitalize transition ${order.status === status ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-white/10 hover:bg-gray-300'}`}
                      >
                        {status}
                      </button>
                    ))}
                 </div>
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white dark:bg-[#0a111d] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">{icon}</div>
      <div><p className="text-sm text-gray-500">{title}</p><h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3></div>
    </div>
  );
}