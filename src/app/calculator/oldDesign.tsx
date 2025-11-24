'use client';

import { useState } from 'react';
import { HealthInput } from '@/utils/healthEngine';
import ResultView from '@/components/ResultView';
import PageNavigation from '@/components/PageNavigation';
import { ChevronRight, ChevronLeft, Activity, Moon, Utensils, Brain } from 'lucide-react';

export default function CalculatorPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initial State
  const [formData, setFormData] = useState<HealthInput>({
    age: 25,
    gender: 'Laki-laki',
    height: 170,
    weight: 65,
    makan_freq: '3x',
    fast_food: '≤1x/minggu',
    sayur: '7–14x',
    manis: '2–4x/minggu',
    air: '1–2L',
    makan_tidur: '2–3 jam',
    tidur_durasi: '6–8 jam',
    tidur_konsistensi: 'Cukup teratur',
    tidur_siang: 'Tidak pernah',
    tidur_quality: 'Netral',
    olahraga: '1–3x',
    gaya: 'Cukup aktif',
    langkah: '3000–7000',
    screen: '4–6 jam',
    stres_level: 3,
    mood_level: 3,
    rokok: 'Tidak pernah',
    alkohol: 'Tidak pernah',
  });

  const handleChange = (field: keyof HealthInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
      setStep((prev) => prev - 1);
      window.scrollTo(0, 0);
  };

  const handleStartOver = () => {
    setIsSubmitted(false); 
    setStep(1);            
    window.scrollTo(0, 0); 
  };

  if (isSubmitted) {
    // Wrap ResultView in the same background container for consistency
    return (
        <div className="min-h-screen relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-y-auto pb-10">
            <div className="fixed inset-0 z-0 pointer-events-none">
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

  // --- REUSABLE STYLES FOR DARK THEME ---
  const inputContainerClass = "space-y-2";
  const labelClass = "block text-sm font-semibold text-blue-100/90 ml-1";
  const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 text-white p-3 shadow-inner focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/10 transition-all outline-none placeholder-blue-200/30 backdrop-blur-sm";
  const selectClass = "w-full rounded-xl border border-white/10 bg-white/5 text-white p-3 shadow-inner focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-blue-900/80 transition-all outline-none backdrop-blur-sm cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white";

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 font-sans flex flex-col items-center py-10 px-4">
      
      {/* Background Decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-3xl animate-in fade-in zoom-in duration-300">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
            <PageNavigation variant="glass" backText="Back to Home" />
            <div className="text-right hidden sm:block">
                <h1 className="text-white font-bold text-xl">Health Checkup</h1>
                <p className="text-blue-200 text-xs">AI-Powered Analysis</p>
            </div>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Progress Bar & Header */}
            <div className="bg-black/20 p-6 md:p-8 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30 text-blue-300">
                            {getStepIcon(step)}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-blue-300 tracking-wider uppercase">Step {step} of 4</span>
                            <h2 className="text-2xl font-bold text-white">{getStepTitle(step)}</h2>
                        </div>
                    </div>
                </div>
                
                {/* Custom Progress Bar */}
                <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                        style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Form Content Area */}
            <div className="p-6 md:p-8">
                
                {/* --- STEP 1: BIOMETRICS --- */}
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className={inputContainerClass}>
                            <label className={labelClass}>Age (Years)</label>
                            <input 
                                type="number" 
                                value={formData.age === 0 ? '' : formData.age} 
                                onChange={(e) => handleChange('age', Number(e.target.value))} 
                                className={inputClass} 
                                placeholder="e.g. 25"
                            />
                        </div>
                        <div className={inputContainerClass}>
                            <label className={labelClass}>Gender</label>
                            <select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} className={selectClass}>
                                <option value="Laki-laki">Male (Laki-laki)</option>
                                <option value="Perempuan">Female (Perempuan)</option>
                            </select>
                        </div>
                        <div className={inputContainerClass}>
                            <label className={labelClass}>Height (cm)</label>
                            <input 
                                type="number" 
                                value={formData.height === 0 ? '' : formData.height} 
                                onChange={(e) => handleChange('height', Number(e.target.value))} 
                                className={inputClass} 
                                placeholder="e.g. 170"
                            />
                        </div>
                        <div className={inputContainerClass}>
                            <label className={labelClass}>Weight (kg)</label>
                            <input 
                                type="number" 
                                value={formData.weight === 0 ? '' : formData.weight} 
                                onChange={(e) => handleChange('weight', Number(e.target.value))} 
                                className={inputClass} 
                                placeholder="e.g. 65"
                            />
                        </div>
                    </div>
                )}

                {/* --- STEP 2: DIET --- */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className={inputContainerClass}>
                            <label className={labelClass}>Main Meal Frequency</label>
                            <select value={formData.makan_freq} onChange={(e) => handleChange('makan_freq', e.target.value)} className={selectClass}>
                                <option value="≤2x">≤2x (Rare)</option>
                                <option value="3x">3x (Normal)</option>
                                <option value="≥3x">≥3x (Frequent)</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={inputContainerClass}>
                                <label className={labelClass}>Fast Food per Week</label>
                                <select value={formData.fast_food} onChange={(e) => handleChange('fast_food', e.target.value)} className={selectClass}>
                                    <option value="≤1x/minggu">Rare (≤1x)</option>
                                    <option value="2–3x/minggu">Moderate (2–3x)</option>
                                    <option value="≥3x/minggu">Frequent (≥3x)</option>
                                </select>
                            </div>
                            <div className={inputContainerClass}>
                                <label className={labelClass}>Sugary Drinks per Week</label>
                                <select value={formData.manis} onChange={(e) => handleChange('manis', e.target.value)} className={selectClass}>
                                    <option value="≤1x/minggu">Rare (≤1x)</option>
                                    <option value="2–4x/minggu">Moderate (2–4x)</option>
                                    <option value="≥4x/minggu">Frequent (≥4x)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={inputContainerClass}>
                                <label className={labelClass}>Vegetable/Fruit Intake</label>
                                <select value={formData.sayur} onChange={(e) => handleChange('sayur', e.target.value)} className={selectClass}>
                                    <option value="≤7x">Low (≤1x daily)</option>
                                    <option value="7–14x">Okay (1-2x daily)</option>
                                    <option value="≥14x">Good (≥2x daily)</option>
                                </select>
                            </div>
                            <div className={inputContainerClass}>
                                <label className={labelClass}>Water Intake Daily</label>
                                <select value={formData.air} onChange={(e) => handleChange('air', e.target.value)} className={selectClass}>
                                    <option value="≤1L">Low (≤1L)</option>
                                    <option value="1–2L">Okay (1–2L)</option>
                                    <option value="≥2L">Great (≥2L)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- STEP 3: SLEEP & ACTIVITY --- */}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={inputContainerClass}>
                                <label className={labelClass}>Sleep Duration</label>
                                <select value={formData.tidur_durasi} onChange={(e) => handleChange('tidur_durasi', e.target.value)} className={selectClass}>
                                    <option value="≤6 jam">Short (≤6 hrs)</option>
                                    <option value="6–8 jam">Ideal (6–8 hrs)</option>
                                    <option value="≥8 jam">Long (≥8 hrs)</option>
                                </select>
                            </div>
                            <div className={inputContainerClass}>
                                <label className={labelClass}>Sleep Quality</label>
                                <select value={formData.tidur_quality} onChange={(e) => handleChange('tidur_quality', e.target.value)} className={selectClass}>
                                    <option value="Sangat lelah">Wake up Tired</option>
                                    <option value="Netral">Average</option>
                                    <option value="Sangat segar">Wake up Refreshed</option>
                                </select>
                            </div>
                        </div>

                        <div className={inputContainerClass}>
                            <label className={labelClass}>Exercise Frequency</label>
                            <select value={formData.olahraga} onChange={(e) => handleChange('olahraga', e.target.value)} className={selectClass}>
                                <option value="Tidak pernah">Never</option>
                                <option value="1–3x">Occasional (1–3x month)</option>
                                <option value="4–8x">Regular (1-2x week)</option>
                                <option value="≥8x">Active ({'>'}2x week)</option>
                            </select>
                        </div>
                        
                        <div className={inputContainerClass}>
                            <label className={labelClass}>Daily Steps (Est.)</label>
                            <select value={formData.langkah} onChange={(e) => handleChange('langkah', e.target.value)} className={selectClass}>
                                <option value="≤3000">Sedentary (≤3000)</option>
                                <option value="3000–7000">Moderate (3000–7000)</option>
                                <option value="≥7000">Active (≥7000)</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* --- STEP 4: MENTAL --- */}
                {step === 4 && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className={inputContainerClass}>
                            <div className="flex justify-between items-end mb-2">
                                <label className={labelClass}>Stress Level (1-5)</label>
                                <span className="text-2xl font-bold text-blue-300">{formData.stres_level}</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" max="5" 
                                value={formData.stres_level} 
                                onChange={(e) => handleChange('stres_level', Number(e.target.value))} 
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400 hover:accent-blue-300" 
                            />
                            <div className="flex justify-between text-xs text-blue-200/60 mt-2 font-medium uppercase tracking-wide">
                                <span>Relaxed</span><span>High Stress</span>
                            </div>
                        </div>
                        
                        <div className={inputContainerClass}>
                            <div className="flex justify-between items-end mb-2">
                                <label className={labelClass}>Average Mood (1-5)</label>
                                <span className="text-2xl font-bold text-green-300">{formData.mood_level}</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" max="5" 
                                value={formData.mood_level} 
                                onChange={(e) => handleChange('mood_level', Number(e.target.value))} 
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-400 hover:accent-green-300" 
                            />
                            <div className="flex justify-between text-xs text-blue-200/60 mt-2 font-medium uppercase tracking-wide">
                                <span>Poor</span><span>Excellent</span>
                            </div>
                        </div>

                        <div className={inputContainerClass}>
                            <label className={labelClass}>Daily Screen Time</label>
                            <select value={formData.screen} onChange={(e) => handleChange('screen', e.target.value)} className={selectClass}>
                                <option value="≤4 jam">Low (≤4 hrs)</option>
                                <option value="4–6 jam">Average (4–6 hrs)</option>
                                <option value="≥6 jam">High (≥6 hrs)</option>
                            </select>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer / Buttons */}
            <div className="p-6 md:p-8 bg-black/20 border-t border-white/10 flex justify-between items-center">
                {step > 1 ? (
                    <button 
                        onClick={prevStep} 
                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition flex items-center gap-2 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                        Back
                    </button>
                ) : (
                    <div></div> // Empty div to keep layout spaced
                )}

                {step < 4 ? (
                    <button 
                        onClick={nextStep} 
                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30 transition flex items-center gap-2 group"
                    >
                        Next Step
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsSubmitted(true)} 
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold shadow-lg shadow-green-500/30 transition transform hover:scale-[1.02]"
                    >
                        Analyze Health Now
                    </button>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}

// Helper to switch titles based on step
function getStepTitle(step: number) {
  switch(step) {
    case 1: return "Biometrics";
    case 2: return "Diet & Nutrition";
    case 3: return "Sleep & Activity";
    case 4: return "Mental Wellbeing";
    default: return "";
  }
}

// Helper to switch icons based on step
function getStepIcon(step: number) {
    switch(step) {
      case 1: return <Activity className="w-6 h-6" />;
      case 2: return <Utensils className="w-6 h-6" />;
      case 3: return <Moon className="w-6 h-6" />;
      case 4: return <Brain className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  }