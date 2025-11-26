'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Users, 
  Activity, 
  LogOut,
  LayoutDashboard 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname(); // To check which page is active
  const [authorized, setAuthorized] = useState(false);

  // --- GLOBAL SECURITY CHECK ---
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // REPLACE WITH YOUR EMAIL
      if (user?.email !== 'admin123@gmail.com') { 
        router.push('/'); 
      } else {
        setAuthorized(true);
      }
    };
    checkAdmin();
  }, [supabase, router]);

  if (!authorized) return null; // Wait for check

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050b14] text-gray-900 dark:text-white font-sans flex">
      
      {/* --- STATIC SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-white/5 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-200 dark:border-white/5 flex items-center gap-3">
           <div className="p-2 bg-blue-600 rounded-lg">
             <LayoutDashboard className="w-5 h-5 text-white" />
           </div>
           <div>
             <h1 className="font-bold text-lg">Admin</h1>
             <p className="text-xs text-gray-500">Command Center</p>
           </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <SidebarLink 
            href="/admin/pharmacy" 
            icon={<Package className="w-5 h-5" />} 
            label="Pharmacy Orders" 
            active={pathname === '/admin/pharmacy'}
          />
          <SidebarLink 
            href="/admin/insights" 
            icon={<Activity className="w-5 h-5" />} 
            label="Health Insights" 
            active={pathname === '/admin/insights'}
          />
          <SidebarLink 
            href="/admin/crm" 
            icon={<Users className="w-5 h-5" />} 
            label="User CRM" 
            active={pathname === '/admin/crm'}
          />
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/5">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
            Exit Dashboard
          </button>
        </div>
      </aside>

      {/* --- PAGE CONTENT --- */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 w-full text-sm font-medium rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}