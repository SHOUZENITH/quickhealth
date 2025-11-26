'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { User, Mail, Lock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
// 1. Import PageNavigation
import PageNavigation from '@/components/PageNavigation';

export default function SignUpPage() {
  // --- Form State ---
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: 'select',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const supabase = createClientComponentClient();

  // --- Handle Input Change ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Handle Submit ---
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // 1. Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: 'error' });
      setLoading(false);
      return;
    }

    // 2. Supabase Sign Up
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        // We pass the extra data here. Supabase stores this in 'raw_user_meta_data'
        data: {
          full_name: formData.fullName,
          dob: formData.dob,
          gender: formData.gender,
        },
      },
    });

    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ 
        text: "Account created! Please check your email to verify your account.", 
        type: 'success' 
      });
      // Optional: Clear form
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', dob: '', gender: 'select' });
    }
    setLoading(false);
  };

  const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 p-3 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1.5 ml-1 uppercase tracking-wide";

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans">
      
      {/* --- BACKGROUND LAYER (Matches Homepage) --- */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Navigation - REPLACED with Component */}
        <div className="mb-6">
           <PageNavigation variant="glass" backText="Back to Home" />
        </div>

        {/* --- SIGN UP CARD --- */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/40 border border-white/20 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Side: Form */}
            <div className="w-full p-8 md:p-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-8 h-8">
                        <Image src="/logonobg.jpg" alt="Logo" fill className="object-contain rounded-md"/>
                    </div>
                    <span className="font-bold text-xl text-gray-900">QuickHealth</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
                <p className="text-gray-500 text-sm mb-6">Start your health journey today.</p>

                {/* Status Message */}
                {message && (
                    <div className={`mb-6 p-4 text-sm rounded-xl border flex items-start gap-3 ${
                        message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0"/> : <AlertCircle className="w-5 h-5 shrink-0"/>}
                        <p>{message.text}</p>
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-5">
                    
                    {/* Full Name */}
                    <div>
                        <label className={labelClass}>Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input required name="fullName" type="text" value={formData.fullName} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClass}>Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input required name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="name@example.com" />
                        </div>
                    </div>

                    {/* Two Column Grid for Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                <input required name="dob" type="date" value={formData.dob} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Gender</label>
                            <div className="relative">
                                <select required name="gender" value={formData.gender} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                    <option value="select" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <div className="absolute right-3 top-4 w-2 h-2 border-r-2 border-b-2 border-gray-400 rotate-45 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>

                    {/* Password Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                <input required name="password" type="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Confirm</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                <input required name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="••••••••" />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30 mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <button onClick={() => window.history.back()} className="text-blue-600 font-bold hover:underline">
                        Log in
                    </button>
                </p>
            </div>

            {/* Right Side: Decorative Panel (Desktop Only) */}
            <div className="hidden md:flex w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-32 h-32 bg-pink-400 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold mb-6">
                        <CheckCircle2 className="w-3 h-3 text-green-300" />
                        <span>HIPAA Compliant Security</span>
                    </div>
                    <h3 className="text-3xl font-bold leading-tight mb-4">Join 10,000+ Users Improving Their Health.</h3>
                    <p className="text-blue-100 text-sm leading-relaxed opacity-90">
                        Create an account to track your BMI history, consult with doctors, and manage prescriptions all in one place.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                     <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                        <div className="text-2xl font-bold">4.9/5</div>
                        <div className="text-xs text-blue-200">User Rating</div>
                     </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}