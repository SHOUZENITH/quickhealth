'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  ShoppingBag, 
  LogOut,
  Stethoscope,
  LayoutDashboard
} from 'lucide-react';

export default function PharmacistLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      // 1. Check if logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      // 2. Check the Role in the Database
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // 3. Authorization Logic: Pharmacists OR Admins allowed
      if (profile?.role === 'pharmacist' || profile?.role === 'admin') {
        setAuthorized(true);
      } else {
        router.push('/'); // Kick out patients
      }
    };
    checkRole();
  }, [supabase, router]);

  if (!authorized) return null; 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050b14] text-gray-900 dark:text-white font-sans flex">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-white/5 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-200 dark:border-white/5 flex items-center gap-3">
           <div className="p-2 bg-emerald-600 rounded-lg">
             <Stethoscope className="w-5 h-5 text-white" />
           </div>
           <div>
             <h1 className="font-bold text-lg">Pharmacy</h1>
             <p className="text-xs text-gray-500">Staff Portal</p>
           </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Daily Operations
          </div>
          
          <Link 
            href="/role/pharmacist" 
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition ${
              pathname === '/role/pharmacist' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <Package className="w-5 h-5" />
            Incoming Orders
          </Link>

          <Link 
            href="/role/pharmacist/inventory" 
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition ${
              pathname === '/role/pharmacist/inventory' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Inventory
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/5">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
            Exit Portal
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}