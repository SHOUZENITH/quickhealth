'use client';

import { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { 
  HealthInput, 
  calcHealthScore, 
  calcBMI, 
  calcBMR, 
  getBMICategory, 
  calcWaterNeed 
} from '@/utils/healthEngine'; 
import { 
  Download, Save, RefreshCw, Activity, Flame, Moon, 
  Salad, Brain, CheckCircle2, LayoutDashboard, UserPlus, 
  LogIn, X 
} from 'lucide-react';

interface ResultProps {
  data: HealthInput;
  onRetry: () => void;
  isHistorical?: boolean; 
}

export default function ResultView({ data, onRetry, isHistorical = false }: ResultProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  
  // --- STATE ---
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    checkUser();
  }, [supabase.auth]);

  // --- CALCULATIONS ---
  const bmi = calcBMI(data.weight, data.height);
  const bmiCat = getBMICategory(bmi);
  const bmr = Math.round(calcBMR(data.gender, data.weight, data.height, data.age)); 
  const results = calcHealthScore(data);
  const waterTarget = calcWaterNeed(data.weight);

  // --- HANDLERS ---
  const handlePrint = useReactToPrint({
    contentRef: componentRef, 
    documentTitle: `QuickHealth_Report_${new Date().toISOString().split('T')[0]}`,
  });

  const handleSave = async () => {
    if (!session) {
        setShowLoginPrompt(true);
        return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        const { error } = await supabase.from('health_assessments').insert({
            user_id: user.id,
            weight_kg: data.weight,
            height_cm: data.height,
            age: data.age,
            gender: data.gender,
            form_data: data,
            bmi: bmi,
            health_score: results.overall,
            score_breakdown: results.breakdown
        });

        if (error) alert("Error saving: " + error.message);
        else alert("Saved to your history!");
    }
    setSaving(false);
  };

  const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-emerald-500 dark:text-emerald-400';
      if (score >= 60) return 'text-blue-500 dark:text-blue-400';
      if (score >= 40) return 'text-yellow-500 dark:text-yellow-400';
      return 'text-red-500 dark:text-red-400';
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in duration-500 relative">
      
      {/* --- PRINTABLE AREA START --- */}
      <div ref={componentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block print:p-8">
        
        {/* LEFT COLUMN: SCORE CARD */}
        <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 shadow-xl dark:shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10">
                    <h2 className="text-gray-500 dark:text-blue-200 uppercase tracking-widest text-xs font-bold mb-6">Overall Health Score</h2>
                    <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-gray-100 dark:text-white/10 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                            <circle 
                                className={`${getScoreColor(results.overall)} stroke-current transition-all duration-1000 ease-out`} 
                                strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" 
                                strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * results.overall) / 100}
                            ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-5xl font-black ${getScoreColor(results.overall)}`}>{results.overall}</span>
                            <span className="text-xs text-gray-400 font-medium mt-1">/ 100</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {results.overall > 80 ? "Excellent Condition! 🚀" : results.overall > 60 ? "Good Health 👍" : results.overall > 40 ? "Needs Attention ⚠️" : "Action Required 🚨"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-2">
                        Based on your biometrics and lifestyle habits, your health score indicates 
                        {results.overall > 60 ? " a strong foundation." : " room for significant improvement."}
                    </p>
                </div>
            </div>

            {/* BMI & BMR Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex flex-col items-center justify-center text-center">
                    <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-full text-blue-600 dark:text-blue-300 mb-2">
                        <Activity className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">{bmi}</div>
                    <div className="text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase">BMI ({bmiCat})</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-800/30 flex flex-col items-center justify-center text-center">
                    <div className="bg-orange-100 dark:bg-orange-500/20 p-2 rounded-full text-orange-600 dark:text-orange-300 mb-2">
                        <Flame className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">{bmr}</div>
                    <div className="text-[10px] font-bold text-orange-600 dark:text-orange-300 uppercase">Daily Calories</div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: BREAKDOWN */}
        <div className="lg:col-span-7 flex flex-col h-full">
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 shadow-xl dark:shadow-2xl flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Analysis Breakdown
                </h3>
                <div className="space-y-5">
                    <BreakdownItem icon={<Salad className="w-4 h-4" />} label="Diet & Nutrition" score={results.breakdown.diet} color="text-green-500" bg="bg-green-500" detail={`Water Target: ${waterTarget} L/day`} />
                    <BreakdownItem icon={<Moon className="w-4 h-4" />} label="Sleep Quality" score={results.breakdown.sleep} color="text-indigo-500" bg="bg-indigo-500" detail="Aim for 7-8 hours consistent sleep" />
                    <BreakdownItem icon={<Activity className="w-4 h-4" />} label="Physical Activity" score={results.breakdown.activity} color="text-blue-500" bg="bg-blue-500" detail="Try to reach 7,000+ steps daily" />
                    <BreakdownItem icon={<Brain className="w-4 h-4" />} label="Mental Wellbeing" score={results.breakdown.mental} color="text-purple-500" bg="bg-purple-500" detail="Manage stress with breaks & mindfulness" />
                </div>
                
                <div className="mt-8 p-5 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wide">Suggestion</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {results.overall > 80 
                            ? "You are doing great! Focus on maintaining your current habits and consider advanced training goals." 
                            : "Your lifestyle has some strong points, but consistency is key. Try improving one category at a time, starting with sleep or hydration."}
                    </p>
                </div>
            </div>
        </div>
      </div>
      {/* --- PRINTABLE AREA END --- */}

      {/* --- ACTION BAR --- */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10">
         
         <div className="flex items-center gap-4">
             {/* HIDE Start Over if viewing history */}
             {!isHistorical && (
                <button onClick={onRetry} className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2 px-4 py-2 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Start Over
                </button>
             )}

             {/* HIDE Dashboard button if viewing history */}
             {!isHistorical && session && (
                 <Link href="/dashboard" className="text-sm font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 px-4 py-2 transition-colors border-l border-gray-300 dark:border-white/10 pl-6">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                 </Link>
             )}
         </div>

         <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={() => handlePrint()} className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-gray-200 dark:border-white/5">
                <Download className="w-4 h-4" /> PDF
            </button>

            {/* HIDE Save Results if viewing history */}
            {!isHistorical && (
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? <span className="animate-pulse">Saving...</span> : <><Save className="w-4 h-4" /> Save Results</>}
                </button>
            )}
         </div>
      </div>

      {/* --- LOGIN MODAL --- */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginPrompt(false)}></div>
            
            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center">
                <button 
                    onClick={() => setShowLoginPrompt(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                    <Save className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Save your Progress?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    You need an account to save your health analysis history and track your progress over time.
                </p>

                <div className="flex flex-col gap-3">
                    <Link 
                        href="/login" 
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-4 h-4" /> Log In
                    </Link>
                    <Link 
                        href="/auth/signup" 
                        className="w-full py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" /> Create Account
                    </Link>
                </div>
                
                <p className="mt-6 text-xs text-gray-400">
                    Don't want to save? <button onClick={() => setShowLoginPrompt(false)} className="text-blue-500 hover:underline">Continue as Guest</button>
                </p>
            </div>
        </div>
      )}

    </div>
  );
}

// --- SUB-COMPONENT ---
function BreakdownItem({ icon, label, score, color, bg, detail }: any) {
    return (
        <div className="group">
            <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${bg} bg-opacity-10 ${color}`}>
                        {icon}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">{label}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{detail}</div>
                    </div>
                </div>
                <div className={`font-bold text-sm ${color}`}>{score}/100</div>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ease-out ${bg}`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}