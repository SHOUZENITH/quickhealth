'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Search, 
  ShoppingBag, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  Pill, 
  Thermometer, 
  Bandage, 
  HeartPulse, 
  Sparkles,
  X,
  CheckCircle2,
  Loader2,
  FileText,
  UploadCloud,
  AlertCircle,
  ImageIcon
} from 'lucide-react';

// Categories are UI filters (static is fine for this)
const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'vitamins', name: 'Vitamins', icon: <Pill className="w-4 h-4" /> },
  { id: 'pain', name: 'Pain Relief', icon: <HeartPulse className="w-4 h-4" /> },
  { id: 'prescription', name: 'Prescription (Rx)', icon: <FileText className="w-4 h-4" /> },
  { id: 'cold', name: 'Cold & Flu', icon: <Thermometer className="w-4 h-4" /> },
  { id: 'firstaid', name: 'First Aid', icon: <Bandage className="w-4 h-4" /> },
];

export default function PharmacyPage() {
  const supabase = createClientComponentClient();
  
  // --- STATE MANAGEMENT ---
  
  // 1. Data State (Real Products from DB)
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // 2. Filter State
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 3. Cart State (with Persistence)
  const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 4. Checkout/User State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [user, setUser] = useState<any>(null);

  // --- EFFECTS (The Logic) ---

  // A. Fetch Products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Error loading products:", error);
      } else {
        setProducts(data || []);
      }
      setLoadingProducts(false);
    };
    fetchProducts();
  }, [supabase]);

  // B. Initialize User & Load Cart from Memory
  useEffect(() => {
    const init = async () => {
      // Get Logged In User
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Load Cart from LocalStorage (The "Grab Memory" Feature)
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('qh_cart');
        if (savedCart) {
            try { setCart(JSON.parse(savedCart)); } 
            catch (e) { console.error("Cart parse error", e); }
        }
        setIsCartLoaded(true); 
      }
    };
    init();
  }, [supabase]);

  // C. Save Cart to Memory (Whenever it changes)
  useEffect(() => {
    if (isCartLoaded) {
        localStorage.setItem('qh_cart', JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  // --- HELPER LOGIC ---

  // Filter Logic (Now uses 'products' state instead of mock data)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]); // Added 'products' dependency

  // Check if Cart needs Rx
  const cartHasRxItems = useMemo(() => {
    return cart.some(item => item.product.requires_prescription);
  }, [cart]);

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  // --- CART OPERATIONS ---

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

  // --- CHECKOUT HANDLER ---

  const handleCheckout = async () => {
    if (!user) {
        alert("Please login to checkout");
        return;
    }
    // Security Block: Must have Rx file if Rx items exist
    if (cartHasRxItems && !uploadedFile) {
        alert("Please upload a doctor's prescription.");
        return;
    }
    
    setCheckoutStatus('loading');

    try {
        let prescriptionUrl = null;

        // 1. Upload Prescription (If exists)
        if (uploadedFile) {
           const fileExt = uploadedFile.name.split('.').pop();
           const fileName = `${user.id}-${Date.now()}.${fileExt}`;
           // Assuming you have a 'prescriptions' bucket. If not, we skip upload for now.
           // const { data, error } = await supabase.storage.from('prescriptions').upload(fileName, uploadedFile);
           // if (data) prescriptionUrl = data.path;
           prescriptionUrl = "simulated_url_for_mvp"; 
        }

        // 2. Create Order Record
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                total_amount: cartTotal,
                status: 'pending',
                shipping_address: 'Default Address',
                prescription_url: prescriptionUrl
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. Create Line Items
        const orderItems = cart.map(item => ({
            order_id: orderData.id,
            product_name: item.product.name,
            quantity: item.quantity,
            price_per_unit: item.product.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // 4. Success & Cleanup
        setCheckoutStatus('success');
        setCart([]);
        setUploadedFile(null);
        localStorage.removeItem('qh_cart');
        
        setTimeout(() => {
            setCheckoutStatus('idle');
            setIsCartOpen(false);
        }, 3000);

    } catch (error: any) {
        console.error('Checkout failed:', error);
        alert('Checkout failed: ' + error.message);
        setCheckoutStatus('idle');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // --- UI RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050b14] text-gray-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050b14]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
              Quick Apotek
            </h1>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition group">
            <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#050b14]">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* SEARCH SECTION */}
      <div className="bg-white dark:bg-[#0a111d] border-b border-gray-200 dark:border-white/5 pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-2">Find your medication</h2>
            <p className="text-gray-500 dark:text-gray-400">Order vitamins, supplements, and prescription medicines.</p>
          </div>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#0a111d] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
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

      {/* MAIN PRODUCTS GRID */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse"></div>
             ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white dark:bg-[#0a111d] border border-gray-200 dark:border-white/5 rounded-2xl p-4 hover:border-blue-500/30 transition-all hover:shadow-lg dark:hover:shadow-none flex flex-col relative overflow-hidden">
                
                {/* Prescription Badge */}
                {product.requires_prescription && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl z-10 shadow-sm">
                    Rx Required
                  </div>
                )}

                {/* Image Logic: Real URL vs Fallback Icon */}
                <div className={`aspect-[4/3] w-full rounded-xl mb-4 flex items-center justify-center relative overflow-hidden ${!product.image_url ? (product.image_style || 'bg-gray-100 dark:bg-white/10') : ''}`}>
                  {product.image_url ? (
                    <Image 
                      src={product.image_url} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      {product.category === 'vitamins' ? <Pill className="w-12 h-12 opacity-50" /> :
                       product.category === 'prescription' ? <FileText className="w-12 h-12 opacity-50" /> :
                       product.category === 'pain' ? <HeartPulse className="w-12 h-12 opacity-50" /> :
                       product.category === 'cold' ? <Thermometer className="w-12 h-12 opacity-50" /> :
                       product.category === 'firstaid' ? <Bandage className="w-12 h-12 opacity-50" /> :
                       <Sparkles className="w-12 h-12 opacity-50" />}
                    </>
                  )}
                </div>
                
                <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">
                        {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
                    </span>
                </div>
                
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                
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

      {/* --- CART DRAWER --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-[#0a111d]">
              <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                 checkoutStatus === 'success' ? (
                     <div className="flex flex-col items-center justify-center h-full text-center">
                         <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6"><CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" /></div>
                         <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Order Placed!</h3>
                         <p className="text-gray-500">We received your order.</p>
                     </div>
                 ) : (
                    <div className="text-center py-12 text-gray-500">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Your cart is empty.</p>
                    </div>
                 )
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      {/* Cart Item Image */}
                      <div className={`w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden ${!item.product.image_url ? (item.product.image_style || 'bg-gray-100') : ''}`}>
                          {item.product.requires_prescription && <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded z-10">Rx</span>}
                          
                          {item.product.image_url ? (
                            <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 opacity-50" />
                          )}
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm mb-1">{item.product.name}</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-bold mb-3">{formatIDR(item.product.price)}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md transition"><Minus className="w-3 h-3" /></button>
                            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md transition"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* PRESCRIPTION UPLOAD AREA */}
                  {cartHasRxItems && (
                    <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-500/20 animate-in slide-in-from-bottom-2">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-400">Prescription Required</h4>
                          <p className="text-xs text-yellow-700 dark:text-yellow-500/80 mt-1">Upload a photo of your recipe to checkout.</p>
                        </div>
                      </div>
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className={`w-full py-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 transition ${uploadedFile ? 'border-green-500 bg-green-50 dark:bg-green-500/10 text-green-600' : 'border-yellow-300 dark:border-yellow-500/30 text-yellow-700'}`}>
                          {uploadedFile ? <><CheckCircle2 className="w-4 h-4" /><span className="text-xs font-bold truncate max-w-[200px]">{uploadedFile.name}</span></> : <><UploadCloud className="w-4 h-4" /><span className="text-xs font-bold">Upload Photo</span></>}
                        </div>
                      </div>
                    </div>
                  )}
                </>
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
                  disabled={checkoutStatus === 'loading' || (cartHasRxItems && !uploadedFile)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkoutStatus === 'loading' ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Checkout Now"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}