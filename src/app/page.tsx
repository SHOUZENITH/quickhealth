'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  Stethoscope, 
  Pill, 
  Bot, 
  BookOpen, 
  ChevronRight, 
  Lock, 
  CheckCircle2,
  Instagram,
  X,
  LayoutDashboard
} from 'lucide-react';

// --- MAIN HOME COMPONENT ---
export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [session, setSession] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    checkUser();
  }, [supabase.auth]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050b14] text-gray-900 dark:text-white font-sans selection:bg-blue-100 dark:selection:bg-blue-500/30 flex flex-col relative transition-colors duration-300">
      
      {/* --- 1. NAVBAR --- */}
      <nav className="w-full border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#050b14]/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
               <Image 
                 src="/logonobg.png" 
                 alt="QuickHealth Logo" 
                 fill 
                 className="object-contain"
               />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              QuickHealth
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            {/* STRATEGY UPDATE: Concrete links instead of generic "Services" */}
            <Link href="/feature/pharmacy" className="hover:text-blue-600 dark:hover:text-white transition-colors">Pharmacy</Link>
            <Link href="/feature/consult" className="hover:text-blue-600 dark:hover:text-white transition-colors">Doctors</Link>
            <Link href="/feature/articles" className="hover:text-blue-600 dark:hover:text-white transition-colors">Library</Link>
          </div>

          {/* --- AUTH BUTTON LOGIC --- */}
          <div className="flex items-center gap-4">
              {session ? (
              // IF LOGGED IN: Show Dashboard Button
              <Link 
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg shadow-blue-500/30 dark:shadow-blue-900/20 flex items-center gap-2 active:scale-95"
              >
                  Dashboard <LayoutDashboard className="w-4 h-4" />
              </Link>
              ) : (
              // IF LOGGED OUT: Show Login Button
              <button 
                  onClick={() => setShowLogin(true)}
                  className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white text-sm font-bold transition active:scale-95"
              >
                  Sign In
              </button>
              )}
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6">
        {/* Abstract Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></span>
              v2.0 Now Live
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900 dark:text-white">
              Your Health, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-400">Simplified.</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Instant health analysis, telemedicine access, and pharmacy delivery in one platform. Start your journey to better health today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/feature/calculator" 
                className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 dark:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1"
              >
                <Activity className="h-5 w-5" />
                Start Free Checkup
              </Link>
              
              {/* UPDATED: Explore Plans Button now scrolls to features to show Free vs Paid */}
              <Link 
                  href="#features"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-400 font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition backdrop-blur-sm"
              >
                  Explore Plans
              </Link>
            </div>
            
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 dark:text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
                  <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
                  <span>Encrypted Data</span>
              </div>
            </div>
          </div>

          {/* Floating Card Visual */}
          <div className="hidden lg:block relative pl-12">
            <div className="relative z-10 bg-white/80 dark:bg-[#0f1729]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl dark:shadow-none transform rotate-3 hover:rotate-0 transition duration-500 ease-out group">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-white/10 pb-4">
                  <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">Health Score</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Latest Analysis</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-green-500/30 flex items-center justify-center bg-green-500/10 text-green-600 dark:text-green-400 font-black text-2xl">
                      85
                  </div>
              </div>
              <div className="space-y-6">
                  <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                          <span>Diet Quality</span>
                          <span className="text-green-600 dark:text-green-400">Excellent</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full w-full overflow-hidden">
                          <div className="h-full bg-green-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                          <span>Sleep Hygiene</span>
                          <span className="text-yellow-500 dark:text-yellow-400">Needs Work</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full w-full overflow-hidden">
                          <div className="h-full bg-yellow-500 w-[65%] rounded-full"></div>
                      </div>
                  </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                          <span>Daily Steps</span>
                          <span className="text-blue-600 dark:text-blue-400">On Track</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full w-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[72%] rounded-full"></div>
                      </div>
                  </div>
              </div>
            </div>
            {/* Decor elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-[80px] -z-10"></div>
          </div>
        </div>
      </section>

      {/* --- 3. FEATURES GRID --- */}
      {/* Added ID for anchor scrolling */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 border-t border-gray-200 dark:border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Everything you need for better health</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From instant analysis to professional consultations, we have got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. CALCULATOR */}
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-blue-500 dark:text-blue-400" />}
            title="Instant Checkup"
            description="Analyze BMI, BMR, and lifestyle habits in under 2 minutes. Get personalized reports."
            badge="Free Forever"
            badgeColor="bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
            iconBg="bg-blue-50 dark:bg-blue-500/10"
            href="/feature/calculator"
            buttonText="Start Now"
            active={true}
          />
          
          {/* 2. PHARMACY */}
          <FeatureCard 
            icon={<Pill className="w-6 h-6 text-purple-500 dark:text-purple-400" />}
            title="Quick Apotek"
            description="Order vitamins & supplements from trusted pharmacies. Fast delivery to your door."
            badge="Free Access"
            badgeColor="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
            iconBg="bg-purple-50 dark:bg-purple-500/10"
            href="/feature/pharmacy"
            buttonText="Browse Store"
            active={true} 
          />
          
          {/* 3. LIBRARY */}
          <FeatureCard 
            icon={<BookOpen className="w-6 h-6 text-orange-500 dark:text-orange-400" />}
            title="Health Library"
            description="Expert-verified articles on nutrition, sleep science, and mental wellness."
            badge="Free Resources"
            badgeColor="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
            iconBg="bg-orange-50 dark:bg-orange-500/10"
            href="/feature/articles"
            buttonText="Read Articles"
            active={true}
          />
          
          {/* 4. CONSULT (UNLOCKED) */}
          <FeatureCard 
            icon={<Stethoscope className="w-6 h-6 text-rose-500 dark:text-rose-400" />}
            title="Consult Doctor"
            description="Connect with General Practitioners and Specialists via high-quality video calls."
            badge="Premium"
            badgeColor="bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
            iconBg="bg-rose-50 dark:bg-rose-500/10"
            href="/feature/consult"
            buttonText="Find a Doctor"
            active={true} // Explicitly active
            locked={false} // Explicitly unlocked
          />
          
          {/* 5. AI ASSISTANT (LOCKED) */}
          <FeatureCard 
            icon={<Bot className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />}
            title="Health Assistant"
            description="Your 24/7 AI companion for health advice, symptom checking, and reminders."
            badge="Subscription"
            badgeColor="bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/10 dark:text-gray-300 dark:border-white/10"
            iconBg="bg-indigo-50 dark:bg-indigo-500/10"
            href="/feature/assistant"
            buttonText="Chat Now"
            active={false} // Inactive
            locked={true}  // Locked
          />
          
          {/* 6. LAB TESTS (Placeholder) */}
          <FeatureCard 
            icon={<CheckCircle2 className="w-6 h-6 text-teal-500 dark:text-teal-400" />}
            title="Lab Tests"
            description="Book home sample collection for blood tests and get digital reports."
            badge="Coming Soon"
            badgeColor="bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-gray-500 dark:border-white/5"
            iconBg="bg-teal-50 dark:bg-teal-500/10"
            href="#"
            buttonText="Join Waitlist"
            active={false}
            footer="In Development"
          />
        </div>
      </section>

      {/* --- 4. FOOTER --- */}
      <footer className="bg-gray-50 dark:bg-[#0a111d] border-t border-gray-200 dark:border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image src="/logonobg.png" alt="QuickHealth Logo" fill className="object-contain" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                            QuickHealth
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                        Empowering individuals to take control of their well-being through accessible technology, professional medical guidance, and simplified healthcare services.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 dark:text-white mb-4">Company</h4>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                        <li><Link href="/footer/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">About Us</Link></li>
                        <li><Link href="/footer/partner" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Partner with Us</Link></li>
                        <li><Link href="/footer/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact Support</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 dark:text-white mb-4">Legal</h4>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                        <li><Link href="/footer/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Privacy Policy</Link></li>
                        <li><Link href="/footer/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">© 2025 QuickHealth. All rights reserved.</p>
                <div className="flex gap-6 items-center">
                   <Link href="https://www.instagram.com/quickhealth.binus?igsh=Y2R3eGUybzJ2bnMx" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                      <Instagram className="w-5 h-5" />
                   </Link>
                   <Link href="https://www.tiktok.com/@quickhealth.binus?_r=1&_t=ZS-91UngOmFhmp" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                      <TikTokIcon />
                   </Link>
                </div>
            </div>
        </div>
      </footer>

      {/* --- LOGIN MODAL --- */}
      {showLogin && (
         <LoginModal onClose={() => setShowLogin(false)} />
      )}

    </div>
  );
}

// --- LOGIN MODAL COMPONENT ---
function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const inputClass = "mt-1 block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white p-3 focus:border-blue-500 focus:ring-blue-500 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                 <Image src="/logonobg.png" alt="Logo" width={128} height={128} className="object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Login to access your dashboard</p>
        </div>

        {message && (
          <div className="mb-6 p-4 text-sm rounded-xl border bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="name@example.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <button onClick={handleLogin} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20 dark:shadow-blue-900/20">
              {loading ? 'Processing...' : 'Log In'}
            </button>
            <div className="text-center text-sm text-gray-500 mt-2">
                Don't have an account? <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- FEATURE CARD COMPONENT ---
function FeatureCard({ icon, title, description, badge, badgeColor, iconBg, href, buttonText, active, locked, footer }: any) {
  return (
    <div className="group relative bg-white dark:bg-[#0a111d] border border-gray-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none">
      {locked && (
        <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition">
          <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconBg || 'bg-gray-100 dark:bg-gray-800'}`}>
          {icon}
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${badgeColor}`}>
          {badge}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-grow">
        {description}
      </p>

      <div className="mt-auto">
        {footer ? (
              <div className="w-full py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-600 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10 cursor-not-allowed">
                 {footer}
              </div>
        ) : (
            <Link 
                href={active && !locked ? href : '#'} 
                className={`block w-full py-3 rounded-xl text-center font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    active && !locked
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 dark:shadow-blue-900/20' 
                    : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/5 cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
            >
                {locked ? 'Unlock Feature' : buttonText}
                {!locked && active && <ChevronRight className="w-4 h-4" />}
                {locked && <Lock className="w-4 h-4 ml-1" />}
            </Link>
        )}
      </div>
    </div>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}