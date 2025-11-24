'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HealthInput } from '@/utils/healthEngine';
import ResultView from '@/components/ResultView';
import PageNavigation from '@/components/PageNavigation';
import { 
  ChevronRight, ChevronLeft, Activity, Moon, Utensils, Brain, 
  Droplets, Dumbbell, Pizza, Coffee, Timer, Smile, Lightbulb
} from 'lucide-react';

type Option = {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  description?: string;
};

export default function CalculatorPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initial State
  const [formData, setFormData] = useState<HealthInput>({
    age: 25, gender: 'Laki-laki', height: 170, weight: 65,
    makan_freq: '3x', fast_food: '≤1x/minggu', sayur: '7–14x', manis: '2–4x/minggu', air: '1–2L',
    makan_tidur: '2–3 jam', tidur_durasi: '6–8 jam', tidur_konsistensi: 'Cukup teratur', tidur_siang: 'Tidak pernah', tidur_quality: 'Netral',
    olahraga: '1–3x', gaya: 'Cukup aktif', langkah: '3000–7000', screen: '4–6 jam',
    stres_level: 3, mood_level: 3, rokok: 'Tidak pernah', alkohol: 'Tidak pernah',
  });

  const handleChange = (field: keyof HealthInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => { setStep((p) => p + 1); window.scrollTo(0, 0); };
  const prevStep = () => { setStep((p) => p - 1); window.scrollTo(0, 0); };
  const handleStartOver = () => { setIsSubmitted(false); setStep(1); window.scrollTo(0, 0); };

  if (isSubmitted) {
     return (
        <div className="min-h-screen relative bg-gray-50 dark:bg-gradient-to-br dark:from-blue-900 dark:via-blue-800 dark:to-indigo-900 overflow-y-auto pb-10 transition-colors duration-300">
            <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]"></div>
            </div>
            <div className="relative z-10 pt-6 px-4">
                <div className="max-w-4xl mx-auto mb-6">
                    <PageNavigation variant="glass" backText="Exit Results" />
                </div>
                <ResultView data={formData} onRetry={handleStartOver} />
            </div>
        </div>
    );
  }

  // --- SELECTION GRID ---
  const SelectionGrid = ({ field, options }: { field: keyof HealthInput, options: Option[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => (
            <button
                key={String(opt.value)}
                onClick={() => handleChange(field, opt.value)}
                className={`
                    relative p-5 rounded-2xl border text-left transition-all duration-200 group flex flex-col gap-3 h-full
                    ${formData[field] === opt.value 
                        ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/30 transform scale-[1.02]' 
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/30'
                    }
                `}
            >
                {opt.icon && (
                    <div className={`
                        p-3 rounded-xl w-fit transition-colors
                        ${formData[field] === opt.value 
                            ? 'bg-white/20 text-white' 
                            : 'bg-blue-100 text-blue-600 dark:bg-white/5 dark:text-blue-200'}
                    `}>
                        {opt.icon}
                    </div>
                )}
                <div>
                    <div className={`font-bold text-base ${formData[field] === opt.value ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {opt.label}
                    </div>
                    {opt.description && (
                        <div className={`text-sm mt-1 ${formData[field] === opt.value ? 'text-blue-100' : 'text-gray-500 dark:text-blue-100/60'}`}>
                            {opt.description}
                        </div>
                    )}
                </div>
            </button>
        ))}
    </div>
  );

  // STYLES
  const labelClass = "block text-sm font-bold text-gray-700 dark:text-blue-100 ml-1 mb-2 uppercase tracking-wider opacity-90";
  
  // FIX: Added `dark:[&>option]:bg-gray-900` so dropdown options are dark in dark mode
  const inputClass = "w-full rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder-gray-400 text-lg dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-blue-200/20 dark:[&>option]:bg-gray-900 dark:[&>option]:text-white";

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-[#0a192f] font-sans flex flex-col overflow-x-hidden transition-colors duration-300">
      
      {/* BACKGROUND TEXTURE (Dark Mode Only) */}
      <div className="fixed inset-0 z-0 hidden dark:block">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-8">
            <PageNavigation variant="glass" backText="Home" />
            <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <h1 className="text-gray-900 dark:text-white font-bold text-lg">Health Checkup</h1>
                    <p className="text-gray-500 dark:text-blue-300 text-xs">AI-Powered Analysis</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/50">
                    {step}
                </div>
            </div>
        </div>

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow items-start">
            
            {/* LEFT COLUMN: THE FORM */}
            <div className="lg:col-span-8 bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] shadow-xl dark:shadow-2xl overflow-hidden flex flex-col h-full min-h-[600px] transition-all">
                
                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-2xl border border-blue-200 dark:border-blue-400/30 text-blue-600 dark:text-blue-300">
                            {getStepIcon(step)}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-1 block">Step {step} of 4</span>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{getStepTitle(step)}</h2>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 ease-out" style={{ width: `${(step / 4) * 100}%` }}></div>
                    </div>
                </div>

                {/* Form Area */}
                <div className="p-8 flex-grow">
                     {/* STEP 1 */}
                     {step === 1 && (
                        <div className="space-y-10 animate-in slide-in-from-right-8 fade-in duration-500">
                            <div>
                                <label className={labelClass}>Gender Identity</label>
                                <SelectionGrid field="gender" options={[
                                    { value: 'Laki-laki', label: 'Male', description: 'Biological Male', icon: <span className="text-2xl">👨</span> },
                                    { value: 'Perempuan', label: 'Female', description: 'Biological Female', icon: <span className="text-2xl">👩</span> }
                                ]} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className={labelClass}>Age</label>
                                    <input type="number" value={formData.age === 0 ? '' : formData.age} onChange={(e) => handleChange('age', Number(e.target.value))} className={inputClass} placeholder="25" />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClass}>Height (cm)</label>
                                    <input type="number" value={formData.height === 0 ? '' : formData.height} onChange={(e) => handleChange('height', Number(e.target.value))} className={inputClass} placeholder="170" />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClass}>Weight (kg)</label>
                                    <input type="number" value={formData.weight === 0 ? '' : formData.weight} onChange={(e) => handleChange('weight', Number(e.target.value))} className={inputClass} placeholder="65" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
                             <div>
                                <label className={labelClass}>Daily Water Intake</label>
                                <SelectionGrid field="air" options={[
                                    { value: '≤1L', label: 'Low', description: '< 1 Liter', icon: <Droplets className="w-6 h-6"/> },
                                    { value: '1–2L', label: 'Good', description: '1 - 2 Liters', icon: <Droplets className="w-6 h-6"/> },
                                    { value: '≥2L', label: 'Excellent', description: '> 2 Liters', icon: <Droplets className="w-6 h-6"/> },
                                ]} />
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-white/10 w-full"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className={labelClass}>Meal Frequency</label>
                                    <select value={formData.makan_freq} onChange={(e) => handleChange('makan_freq', e.target.value)} className={inputClass}>
                                        <option value="≤2x">Skip meals (≤ 2x)</option>
                                        <option value="3x">Regular (3x)</option>
                                        <option value="≥3x">Frequent Snacking (≥ 3x)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClass}>Veggie Intake</label>
                                    <select value={formData.sayur} onChange={(e) => handleChange('sayur', e.target.value)} className={inputClass}>
                                        <option value="≤7x">Rarely</option>
                                        <option value="7–14x">Sometimes (Daily)</option>
                                        <option value="≥14x">Always (Every meal)</option>
                                    </select>
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                                 <div>
                                     <label className="text-sm font-bold text-gray-500 dark:text-blue-200 mb-3 block flex items-center gap-2"> <Pizza className="w-4 h-4"/> Fast Food / Week</label>
                                     <select value={formData.fast_food} onChange={(e) => handleChange('fast_food', e.target.value)} className={inputClass}>
                                        <option value="≤1x/minggu">Rare (≤1x)</option>
                                        <option value="2–3x/minggu">Moderate (2–3x)</option>
                                        <option value="≥3x/minggu">Often (≥3x)</option>
                                    </select>
                                 </div>
                                 <div>
                                     <label className="text-sm font-bold text-gray-500 dark:text-blue-200 mb-3 block flex items-center gap-2"> <Coffee className="w-4 h-4"/> Sweets / Week</label>
                                     <select value={formData.manis} onChange={(e) => handleChange('manis', e.target.value)} className={inputClass}>
                                        <option value="≤1x/minggu">Rare (≤1x)</option>
                                        <option value="2–4x/minggu">Moderate (2–4x)</option>
                                        <option value="≥4x/minggu">Often (≥4x)</option>
                                    </select>
                                 </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
                             <div>
                                <label className={labelClass}>Weekly Exercise</label>
                                <SelectionGrid field="olahraga" options={[
                                    { value: 'Tidak pernah', label: 'None', description: 'No exercise', icon: <Dumbbell className="w-6 h-6"/> },
                                    { value: '1–3x', label: 'Light', description: '1-3x / Month', icon: <Dumbbell className="w-6 h-6"/> },
                                    { value: '4–8x', label: 'Active', description: '1-2x / Week', icon: <Dumbbell className="w-6 h-6"/> },
                                ]} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className={labelClass}>Sleep Duration</label>
                                    <div className="relative group">
                                        <Timer className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-blue-300"/>
                                        <select value={formData.tidur_durasi} onChange={(e) => handleChange('tidur_durasi', e.target.value)} className={`${inputClass} pl-12`}>
                                            <option value="≤6 jam">Short (≤6 hrs)</option>
                                            <option value="6–8 jam">Ideal (6–8 hrs)</option>
                                            <option value="≥8 jam">Long (≥8 hrs)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClass}>Daily Steps</label>
                                     <div className="relative group">
                                        <Activity className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-blue-300"/>
                                        <select value={formData.langkah} onChange={(e) => handleChange('langkah', e.target.value)} className={`${inputClass} pl-12`}>
                                            <option value="≤3000">Sedentary (≤3000)</option>
                                            <option value="3000–7000">Moderate (3-7k)</option>
                                            <option value="≥7000">Active (≥7000)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4 */}
                    {step === 4 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
                             <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-8 rounded-[2rem] border border-white/20 dark:border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <label className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3"> <Brain className="w-6 h-6 text-purple-500 dark:text-purple-400"/> Stress Level</label>
                                    <span className="text-3xl font-black text-purple-600 dark:text-purple-300">{formData.stres_level}/5</span>
                                </div>
                                <input type="range" min="1" max="5" value={formData.stres_level} onChange={(e) => handleChange('stres_level', Number(e.target.value))} className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 dark:accent-purple-400" />
                                <div className="flex justify-between text-xs font-bold text-purple-600/50 dark:text-purple-200/50 mt-3 uppercase tracking-wider"><span>Very Relaxed</span><span>Highly Stressed</span></div>
                            </div>

                             <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 p-8 rounded-[2rem] border border-white/20 dark:border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <label className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3"> <Smile className="w-6 h-6 text-yellow-500 dark:text-yellow-400"/> Mood Level</label>
                                    <span className="text-3xl font-black text-yellow-600 dark:text-yellow-300">{formData.mood_level}/5</span>
                                </div>
                                <input type="range" min="1" max="5" value={formData.mood_level} onChange={(e) => handleChange('mood_level', Number(e.target.value))} className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 dark:accent-yellow-400" />
                                <div className="flex justify-between text-xs font-bold text-yellow-600/50 dark:text-yellow-200/50 mt-3 uppercase tracking-wider"><span>Unhappy</span><span>Very Happy</span></div>
                            </div>
                            
                            <div>
                                <label className={labelClass}>Daily Screen Time</label>
                                <SelectionGrid field="screen" options={[
                                    { value: '≤4 jam', label: 'Low', description: 'Healthy amount', icon: <span className="text-2xl">🌿</span> },
                                    { value: '4–6 jam', label: 'Average', description: 'Normal usage', icon: <span className="text-2xl">📱</span> },
                                    { value: '≥6 jam', label: 'High', description: 'Heavy usage', icon: <span className="text-2xl">🤖</span> },
                                ]} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex justify-between items-center">
                    {step > 1 ? (
                        <button onClick={prevStep} className="px-8 py-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/10 transition flex items-center gap-3 group font-bold">
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition" /> Back
                        </button>
                    ) : <div className="w-24"></div>}

                    {step < 4 ? (
                        <button onClick={nextStep} className="px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-500/30 transition flex items-center gap-3 group transform hover:scale-[1.02]">
                            Next Step <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </button>
                    ) : (
                        <button onClick={() => setIsSubmitted(true)} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold shadow-xl shadow-green-500/30 transition transform hover:scale-[1.02]">
                            Generate Analysis
                        </button>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: INFO PANEL */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 h-fit">
                
                {/* 1. Dynamic Tip Card - FIX: Dark background for Dark Mode to make text readable */}
                <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 text-gray-900 dark:text-white relative overflow-hidden group shadow-lg">
                    {/* Glow effect only in dark mode */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-400/30 transition duration-1000 hidden dark:block"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-400/20 rounded-lg text-yellow-600 dark:text-yellow-300">
                                <Lightbulb className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-blue-200">Did You Know?</span>
                        </div>
                        
                        <div className="min-h-[200px]">
                             {step === 1 && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold mb-3 leading-tight">BMI is just a starting point.</h3>
                                    <p className="text-gray-600 dark:text-blue-100/90 leading-relaxed mb-6">
                                        Body Mass Index (BMI) is a useful screening tool, but it doesn't measure body fat directly or account for muscle mass.
                                    </p>
                                    <div className="w-full h-40 bg-gray-100 dark:bg-white/10 rounded-xl overflow-hidden relative border border-gray-200 dark:border-white/10">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-blue-200/50 text-xs uppercase font-bold tracking-widest">
                                            [BMI Chart Visualization]
                                        </div>
                                    </div>
                                </div>
                            )}
                             {step === 2 && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold mb-3 leading-tight">Hydration powers your brain.</h3>
                                    <p className="text-gray-600 dark:text-blue-100/90 leading-relaxed mb-6">
                                        Even mild dehydration (1-3% of body weight) can impair energy levels and mood.
                                    </p>
                                </div>
                            )}
                             {step === 3 && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold mb-3 leading-tight">Walking adds years to life.</h3>
                                    <p className="text-gray-600 dark:text-blue-100/90 leading-relaxed mb-6">
                                        Studies show that walking 7,000 steps a day can reduce your risk of premature death by 50% to 70%.
                                    </p>
                                </div>
                            )}
                             {step === 4 && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold mb-3 leading-tight">Stress affects digestion.</h3>
                                    <p className="text-gray-600 dark:text-blue-100/90 leading-relaxed mb-6">
                                        The gut and brain are connected. High stress can disrupt the bacteria in your gut.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Privacy Badge */}
                <div className="bg-white dark:bg-black/20 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-3xl p-6 text-center shadow-sm">
                    <div className="text-3xl mb-2">🔒</div>
                    <h4 className="text-gray-900 dark:text-white font-bold">Encrypted & Private</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your health data is processed locally and never shared with third parties.</p>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}

function getStepIcon(step: number) {
    switch(step) {
      case 1: return <Activity className="w-6 h-6" />;
      case 2: return <Utensils className="w-6 h-6" />;
      case 3: return <Moon className="w-6 h-6" />;
      case 4: return <Brain className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
}
function getStepTitle(step: number) {
    switch(step) {
      case 1: return "Biometrics";
      case 2: return "Diet & Nutrition";
      case 3: return "Sleep & Activity";
      case 4: return "Mental Wellbeing";
      default: return "";
    }
  }