'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  ShoppingBag, 
  ArrowLeft, 
  Filter, 
  Plus, 
  Minus, 
  Trash2, 
  Pill, 
  Thermometer, 
  Bandage, 
  HeartPulse, 
  Sparkles,
  X,
  CheckCircle2
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'vitamins', name: 'Vitamins', icon: <Pill className="w-4 h-4" /> },
  { id: 'pain', name: 'Pain Relief', icon: <HeartPulse className="w-4 h-4" /> },
  { id: 'cold', name: 'Cold & Flu', icon: <Thermometer className="w-4 h-4" /> },
  { id: 'firstaid', name: 'First Aid', icon: <Bandage className="w-4 h-4" /> },
];

const PRODUCTS = [
  { id: 1, name: 'Vitamin C 1000mg', category: 'vitamins', price: 150000, image: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400', desc: 'Boosts immune system, 60 tablets.' },
  { id: 2, name: 'Paracetamol 500mg', category: 'pain', price: 25000, image: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400', desc: 'Effective pain relief, 10 strips.' },
  { id: 3, name: 'Multivitamin Complex', category: 'vitamins', price: 220000, image: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400', desc: 'Daily essential nutrients, 90 capsules.' },
  { id: 4, name: 'Cough Syrup', category: 'cold', price: 45000, image: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400', desc: 'Soothing relief for dry coughs.' },
  { id: 5, name: 'Bandage Strip Pack', category: 'firstaid', price: 15000, image: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400', desc: 'Assorted sizes, waterproof.' },
  { id: 6, name: 'Ibuprofen 400mg', category: 'pain', price: 35000, image: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400', desc: 'Anti-inflammatory relief.' },
  { id: 7, name: 'Omega-3 Fish Oil', category: 'vitamins', price: 180000, image: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400', desc: 'Heart health support, 100 softgels.' },
  { id: 8, name: 'Antiseptic Cream', category: 'firstaid', price: 30000, image: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400', desc: 'Prevents infection in minor cuts.' },
  { id: 9, name: 'Flu Medicine Day/Night', category: 'cold', price: 65000, image: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400', desc: 'Complete relief for flu symptoms.' },
];

export default function PharmacyPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Cart Logic
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  const handleCheckout = () => {
      setShowCheckoutSuccess(true);
      setCart([]);
      setTimeout(() => {
          setShowCheckoutSuccess(false);
          setIsCartOpen(false);
      }, 3000);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050b14] text-gray-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050b14]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-400 dark:to-purple-400">
              Quick Apotek
            </h1>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition group"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#050b14]">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- HERO / SEARCH --- */}
      <div className="bg-white dark:bg-[#0a111d] border-b border-gray-200 dark:border-white/5 pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-2">Find your medication</h2>
            <p className="text-gray-500 dark:text-gray-400">Order vitamins, supplements, and first aid essentials. Delivered in &lt;2 hours.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for 'Vitamin C', 'Panadol'..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#0a111d] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white dark:bg-[#0a111d] border border-gray-200 dark:border-white/5 rounded-2xl p-4 hover:border-blue-500/30 transition-all hover:shadow-lg dark:hover:shadow-none flex flex-col">
                <div className={`aspect-[4/3] w-full rounded-xl mb-4 flex items-center justify-center ${product.image}`}>
                  {product.category === 'vitamins' && <Pill className="w-12 h-12" />}
                  {product.category === 'pain' && <HeartPulse className="w-12 h-12" />}
                  {product.category === 'cold' && <Thermometer className="w-12 h-12" />}
                  {product.category === 'firstaid' && <Bandage className="w-12 h-12" />}
                </div>
                
                <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">
                        {CATEGORIES.find(c => c.id === product.category)?.name}
                    </span>
                </div>
                
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">{product.desc}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                  <span className="font-bold text-lg">{formatIDR(product.price)}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        )}
      </main>

      {/* --- CART SIDEBAR (DRAWER) --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-[#0a111d]">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                 !showCheckoutSuccess ? (
                    <div className="text-center py-12 text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Your cart is empty.</p>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-4 text-blue-500 font-bold hover:underline"
                    >
                        Start Shopping
                    </button>
                    </div>
                 ) : (
                     <div className="flex flex-col items-center justify-center h-full text-center animate-in zoom-in duration-300">
                         <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                             <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                         </div>
                         <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Order Placed!</h3>
                         <p className="text-gray-500">Your order has been sent to the pharmacy.</p>
                     </div>
                 )
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className={`w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center ${item.product.image}`}>
                        {item.product.category === 'vitamins' && <Pill className="w-8 h-8" />}
                        {item.product.category === 'pain' && <HeartPulse className="w-8 h-8" />}
                        {item.product.category === 'cold' && <Thermometer className="w-8 h-8" />}
                        {item.product.category === 'firstaid' && <Bandage className="w-8 h-8" />}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm mb-1">{item.product.name}</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-bold mb-3">{formatIDR(item.product.price)}</p>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-gray-50 dark:bg-[#0a111d] border-t border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium">Total</span>
                  <span className="text-2xl font-bold">{formatIDR(cartTotal)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}