import Link from 'next/link';
import Image from 'next/image';
import { 
  Activity, 
  Stethoscope, 
  Pill, 
  Bot, 
  BookOpen, 
  ChevronRight, 
  Lock, 
  CheckCircle2,
  Instagram
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* --- 1. NAVBAR --- */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo Area */}
            <div className="flex items-center gap-0">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image 
                  src="/logonobg.jpg"
                  alt="QuickHealth Logo"
                  fill 
                  className="object-contain rounded-lg"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 -ml-2">
                QuickHealth
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
              <Link href="#" className="hover:text-blue-600">Services</Link>
              <Link href="#" className="hover:text-blue-600">Doctors</Link>
              <Link href="#" className="hover:text-blue-600">Articles</Link>
            </div>

            {/* Auth Button */}
            <Link 
              href="/login"
              className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              Login / History
            </Link>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                v2.0 Public Beta
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Your Health Journey, <br/>
                <span className="text-blue-300">Simplified.</span>
              </h1>
              
              <p className="text-xl text-blue-100 max-w-lg leading-relaxed">
                Instant health analysis, telemedicine access, and pharmacy delivery in one platform. Start your free checkup today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/calculator" 
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition transform hover:-translate-y-1"
                >
                  <Activity className="h-5 w-5" />
                  Start Free Checkup
                </Link>
                <button disabled className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-700/50 border border-blue-500/30 text-white font-semibold rounded-xl hover:bg-blue-700 transition backdrop-blur-sm cursor-not-allowed">
                   Explore Plans
                </button>
              </div>
              
              {/* --- UPDATED PART (Option 1) --- */}
              <div className="pt-6 flex items-center gap-4 text-sm text-blue-200 font-medium">
                <div className="flex items-center gap-2 bg-blue-800/30 px-4 py-2 rounded-lg border border-blue-700/50">
                   <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                   <span>Secure & Private Data</span>
                </div>
                <span>• No login required to start</span>
              </div>

            </div>

            <div className="hidden md:block relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <div>
                        <h3 className="font-bold text-lg">Health Score</h3>
                        <p className="text-blue-200 text-sm">Latest Analysis</p>
                    </div>
                    <span className="text-4xl font-black text-green-400">85</span>
                </div>
                <div className="space-y-3">
                    <div className="h-2 bg-white/20 rounded-full w-full overflow-hidden">
                        <div className="h-full bg-green-400 w-[85%]"></div>
                    </div>
                    <div className="flex justify-between text-sm text-blue-100">
                        <span>Diet Quality</span>
                        <span>Excellent</span>
                    </div>
                     <div className="h-2 bg-white/20 rounded-full w-full overflow-hidden">
                        <div className="h-full bg-yellow-400 w-[65%]"></div>
                    </div>
                     <div className="flex justify-between text-sm text-blue-100">
                        <span>Sleep</span>
                        <span>Needs Work</span>
                    </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl opacity-30 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. FEATURES GRID --- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need for better health</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            From instant analysis to professional consultations, we have got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-blue-600" />}
            title="Instant Checkup"
            description="Analyze BMI, BMR, and lifestyle habits in under 2 minutes."
            badge="Free Forever"
            badgeColor="bg-green-100 text-green-800"
            href="/calculator"
            buttonText="Start Now"
            active={true}
          />
          <FeatureCard 
            icon={<Pill className="w-6 h-6 text-purple-600" />}
            title="Quick Apotek"
            description="Order vitamins & supplements. Delivery in <2 hours."
            badge="Free Access"
            badgeColor="bg-green-100 text-green-800"
            href="#"
            buttonText="Browse Store"
            active={false} 
            footer="Coming Soon"
          />
          <FeatureCard 
            icon={<BookOpen className="w-6 h-6 text-orange-600" />}
            title="Health Library"
            description="Verified articles on nutrition, sleep, and mental wellness."
            badge="Free"
            badgeColor="bg-green-100 text-green-800"
            href="#"
            buttonText="Read Articles"
            active={false}
            footer="Coming Soon"
          />
          <FeatureCard 
            icon={<Stethoscope className="w-6 h-6 text-rose-600" />}
            title="Consult Doctor"
            description="Video call with General Practitioners and Specialists."
            badge="Subscription"
            badgeColor="bg-gray-900 text-white"
            href="#"
            buttonText="Upgrade to Pro"
            active={false}
            locked={true}
          />
          <FeatureCard 
            icon={<Bot className="w-6 h-6 text-indigo-600" />}
            title="Health Assistant"
            description="24/7 Personalized health advice based on your data."
            badge="Subscription"
            badgeColor="bg-gray-900 text-white"
            href="#"
            buttonText="Upgrade to Pro"
            active={false}
            locked={true}
          />
          <FeatureCard 
            icon={<CheckCircle2 className="w-6 h-6 text-teal-600" />}
            title="Lab Tests"
            description="Book home sample collection for blood tests."
            badge="Coming Soon"
            badgeColor="bg-gray-100 text-gray-600"
            href="#"
            buttonText="Join Waitlist"
            active={false}
            footer="In Development"
          />
        </div>
      </section>

      {/* --- 4. REVISED FOOTER --- */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                
                {/* Column 1: Brand */}
              <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-0 mb-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                            <Image 
                                src="/logonobg.jpg"
                                alt="QuickHealth Logo"
                                fill 
                                className="object-contain rounded-lg"
                            />
                        </div>
                        <span className="text-2xl font-bold text-white -ml-2">
                            QuickHealth
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        Empowering individuals to take control of their well-being through accessible technology, professional medical guidance, and simplified healthcare services.
                    </p>
                </div>
                
                {/* Column 2: Company */}
                <div>
                    <h4 className="font-bold text-lg mb-4 text-white">Company</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li><Link href="/about" className="hover:text-blue-400 transition">About Us</Link></li>
                        <li><Link href="/partner" className="hover:text-blue-400 transition">Partner with Us</Link></li>
                        <li><Link href="/contact" className="hover:text-blue-400 transition">Contact Support</Link></li>
                    </ul>
                </div>

                {/* Column 3: Legal */}
                <div>
                    <h4 className="font-bold text-lg mb-4 text-white">Legal</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
                        <li><Link href="/cookie" className="hover:text-blue-400 transition">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">© 2025 QuickHealth. All rights reserved.</p>
                
                {/* Social Icons: TikTok and Instagram Only */}
                <div className="flex gap-6 items-center">
                   <Link href="https://www.instagram.com/quickhealth.binus?igsh=Y2R3eGUybzJ2bnMx" className="text-gray-400 hover:text-white transition">
                      <Instagram className="w-5 h-5" />
                   </Link>
                   <Link href="https://www.tiktok.com/@quickhealth.binus?_r=1&_t=ZS-91UngOmFhmp" className="text-gray-400 hover:text-white transition">
                      <TikTokIcon />
                   </Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}

// --- Feature Card Component ---
function FeatureCard({ icon, title, description, badge, badgeColor, href, buttonText, active, locked, footer }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col h-full relative overflow-hidden group">
      {locked && (
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition">
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition duration-300">
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 flex-grow">{description}</p>
      <div className="mt-auto">
        {footer ? (
             <div className="w-full py-2 text-center text-sm text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200 cursor-not-allowed">
                {footer}
             </div>
        ) : (
            <Link 
                href={active ? href : '#'}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition ${
                    active 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                {locked ? 'Unlock Feature' : buttonText}
                {!locked && <ChevronRight className="w-4 h-4" />}
            </Link>
        )}
      </div>
    </div>
  );
}

// --- Custom TikTok Icon (Since lucide-react doesn't have it) ---
function TikTokIcon() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-5 h-5"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}