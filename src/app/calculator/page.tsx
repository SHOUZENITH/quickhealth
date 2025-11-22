'use client';

import { useState } from 'react';
import { HealthInput } from '@/utils/healthEngine';
import ResultView from '@/components/ResultView';
import PageNavigation from '@/components/PageNavigation'; // <--- 1. Import this

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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // --- Handle Start Over Logic ---
  const handleStartOver = () => {
    setIsSubmitted(false); 
    setStep(1);            
    window.scrollTo(0, 0); 
  };

  if (isSubmitted) {
    return <ResultView data={formData} onRetry={handleStartOver} />;
  }

  // Reusable Styles
  const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl mt-10 transition-colors duration-200">
      
      {/* --- 2. ADDED: Global Page Navigation (Exit Calculator) --- */}
      <div className="mb-6">
        <PageNavigation />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Step {step}: {getStepTitle(step)}
      </h1>

      {/* --- STEP 1: BIOMETRICS --- */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Umur (Tahun)</span>
            <input 
              type="number" 
              value={formData.age === 0 ? '' : formData.age} 
              onChange={(e) => handleChange('age', Number(e.target.value))} 
              className={inputClass} 
            />
          </label>
          <label className="block">
            <span className={labelClass}>Gender</span>
            <select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} className={inputClass}>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Tinggi (cm)</span>
            <input 
              type="number" 
              value={formData.height === 0 ? '' : formData.height} 
              onChange={(e) => handleChange('height', Number(e.target.value))} 
              className={inputClass} 
            />
          </label>
          <label className="block">
            <span className={labelClass}>Berat (kg)</span>
            <input 
              type="number" 
              value={formData.weight === 0 ? '' : formData.weight} 
              onChange={(e) => handleChange('weight', Number(e.target.value))} 
              className={inputClass} 
            />
          </label>
        </div>
      )}

      {/* --- STEP 2: DIET --- */}
      {step === 2 && (
        <div className="space-y-4">
           <label className="block">
            <span className={labelClass}>Frekuensi Makan Utama</span>
            <select value={formData.makan_freq} onChange={(e) => handleChange('makan_freq', e.target.value)} className={inputClass}>
              <option value="≤2x">≤2x (Jarang)</option>
              <option value="3x">3x (Normal)</option>
              <option value="≥3x">≥3x (Sering)</option>
            </select>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
                <span className={labelClass}>Fast Food per Minggu</span>
                <select value={formData.fast_food} onChange={(e) => handleChange('fast_food', e.target.value)} className={inputClass}>
                <option value="≤1x/minggu">Jarang (≤1x)</option>
                <option value="2–3x/minggu">Sedang (2–3x)</option>
                <option value="≥3x/minggu">Sering (≥3x)</option>
                </select>
            </label>
            <label className="block">
                <span className={labelClass}>Minuman Manis per Minggu</span>
                <select value={formData.manis} onChange={(e) => handleChange('manis', e.target.value)} className={inputClass}>
                <option value="≤1x/minggu">Jarang (≤1x)</option>
                <option value="2–4x/minggu">Sedang (2–4x)</option>
                <option value="≥4x/minggu">Sering (≥4x)</option>
                </select>
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Konsumsi Sayur/Buah</span>
            <select value={formData.sayur} onChange={(e) => handleChange('sayur', e.target.value)} className={inputClass}>
              <option value="≤7x">Jarang (≤1x sehari)</option>
              <option value="7–14x">Cukup (1-2x sehari)</option>
              <option value="≥14x">Rutin (≥2x sehari)</option>
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>Konsumsi Air Putih</span>
            <select value={formData.air} onChange={(e) => handleChange('air', e.target.value)} className={inputClass}>
              <option value="≤1L">Kurang (≤1L)</option>
              <option value="1–2L">Cukup (1–2L)</option>
              <option value="≥2L">Bagus (≥2L)</option>
            </select>
          </label>
        </div>
      )}

      {/* --- STEP 3: SLEEP & ACTIVITY --- */}
      {step === 3 && (
        <div className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                    <span className={labelClass}>Durasi Tidur</span>
                    <select value={formData.tidur_durasi} onChange={(e) => handleChange('tidur_durasi', e.target.value)} className={inputClass}>
                    <option value="≤6 jam">Kurang (≤6 jam)</option>
                    <option value="6–8 jam">Cukup (6–8 jam)</option>
                    <option value="≥8 jam">Panjang (≥8 jam)</option>
                    </select>
                </label>
                <label className="block">
                    <span className={labelClass}>Kualitas Tidur</span>
                    <select value={formData.tidur_quality} onChange={(e) => handleChange('tidur_quality', e.target.value)} className={inputClass}>
                    <option value="Sangat lelah">Bangun Lelah</option>
                    <option value="Netral">Biasa Saja</option>
                    <option value="Sangat segar">Bangun Segar</option>
                    </select>
                </label>
           </div>

          <label className="block">
            <span className={labelClass}>Frekuensi Olahraga</span>
            <select value={formData.olahraga} onChange={(e) => handleChange('olahraga', e.target.value)} className={inputClass}>
              <option value="Tidak pernah">Tidak pernah</option>
              <option value="1–3x">Kadang-kadang (1–3x sebulan)</option>
              <option value="4–8x">Rutin (1-2x seminggu)</option>
              <option value="≥8x">Sangat Aktif ({'>'}2x seminggu)</option>
            </select>
          </label>
          
          <label className="block">
            <span className={labelClass}>Langkah Harian (Estimasi)</span>
            <select value={formData.langkah} onChange={(e) => handleChange('langkah', e.target.value)} className={inputClass}>
              <option value="≤3000">Sedikit (≤3000)</option>
              <option value="3000–7000">Sedang (3000–7000)</option>
              <option value="≥7000">Banyak (≥7000)</option>
            </select>
          </label>
        </div>
      )}

      {/* --- STEP 4: MENTAL --- */}
      {step === 4 && (
        <div className="space-y-4">
           <label className="block">
            <span className={labelClass}>Tingkat Stres (1-5)</span>
            <input 
              type="range" 
              min="1" max="5" 
              value={formData.stres_level} 
              onChange={(e) => handleChange('stres_level', Number(e.target.value))} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600" 
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Santai</span><span>Sangat Stres</span>
            </div>
          </label>
          
          <label className="block">
            <span className={labelClass}>Mood Rata-rata (1-5)</span>
            <input 
              type="range" 
              min="1" max="5" 
              value={formData.mood_level} 
              onChange={(e) => handleChange('mood_level', Number(e.target.value))} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600" 
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Buruk</span><span>Sangat Baik</span>
            </div>
          </label>

           <label className="block">
            <span className={labelClass}>Screen Time per hari</span>
             <select value={formData.screen} onChange={(e) => handleChange('screen', e.target.value)} className={inputClass}>
              <option value="≤4 jam">Rendah (≤4 jam)</option>
              <option value="4–6 jam">Sedang (4–6 jam)</option>
              <option value="≥6 jam">Tinggi (≥6 jam)</option>
            </select>
          </label>
        </div>
      )}

      {/* Navigation Buttons (Step Back / Next) */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        {step > 1 ? (
          <button onClick={prevStep} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
            Back
          </button>
        ) : <div></div>}
        
        {step < 4 ? (
          <button onClick={nextStep} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-lg shadow-blue-500/30">
            Next
          </button>
        ) : (
          <button onClick={() => setIsSubmitted(true)} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-colors shadow-lg shadow-green-500/30">
            Analyze Health
          </button>
        )}
      </div>
    </div>
  );
}

function getStepTitle(step: number) {
  switch(step) {
    case 1: return "Data Dasar";
    case 2: return "Pola Makan";
    case 3: return "Tidur & Aktivitas";
    case 4: return "Keseharian & Mental";
    default: return "";
  }
}