'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Using Link for the Home button
import { X, Home } from 'lucide-react'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  // Reusable Input Class
  const inputClass = "mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-900 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:bg-white transition-all outline-none";

  return (
    // 1. OUTER CONTAINER: Relative helps position the absolute children
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
      
      {/* --- BACKGROUND LAYER START --- */}
      {/* Fixed ensures it stays put even if content scrolls. z-0 puts it at the back. */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          
          {/* Blobs: Added explicit bright colors and 'blur-3xl' to make them visible */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] pointer-events-none"></div>
          
          {/* Overlay: This darkens the background slightly to make the white card pop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      </div>
      {/* --- BACKGROUND LAYER END --- */}


      {/* --- CONTENT LAYER (z-10 puts it above the background) --- */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-300">
        
        {/* TOP BAR: Custom Home Button + X Button */}
        <div className="mb-6 flex justify-between items-center">
           {/* Custom Home Button (Replaces PageNavigation) */}
           <Link 
             href="/" 
             className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium transition-all border border-white/10"
           >
             <Home className="w-4 h-4" />
             <span>Home</span>
           </Link>

           {/* Close/X Button */}
           <Link 
             href="/" 
             className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10"
           >
              <X className="w-5 h-5" />
           </Link>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-black/40 border border-white/20">
        
          {/* Branding */}
          <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-2">
                  <div className="relative w-12 h-12 flex-shrink-0">
                      <Image 
                          src="/logonobg.jpg"
                          alt="QuickHealth Logo"
                          fill 
                          className="object-contain rounded-lg"
                      />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">
                      QuickHealth
                  </span>
              </div>
              <p className="text-gray-500 text-sm mt-2 font-medium">Login to access your dashboard</p>
          </div>
          
          {/* Messages */}
          {message && (
            <div className={`mb-6 p-4 text-sm rounded-xl border flex items-start gap-2 ${
              message.includes('Check') 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Form Inputs */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30"
              >
                {loading ? 'Processing...' : 'Log In'}
              </button>
              
              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold tracking-wider">OR</span>
                  <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full bg-gray-50 text-gray-700 font-bold border border-gray-200 py-3.5 px-4 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all"
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-blue-200/60">© 2025 QuickHealth. Secure & Private.</p>
        </div>
      </div>
    </div>
  );
}