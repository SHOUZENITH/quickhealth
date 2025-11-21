'use client';

import { useState } from 'react';
import { HealthInput, calcHealthScore, calcBMI, calcBMR, calcTDEE } from '@/utils/healthEngine'; // Import from Step 2
import ResultView from '@/components/ResultView'; // We will build this next

export default function CalculatorPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initial State matching your Python defaults
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

  if (isSubmitted) {
    return <ResultView data={formData} onRetry={() => setIsSubmitted(false)} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Step {step}: {getStepTitle(step)}
      </h1>

      {/* --- STEP 1: BIOMETRICS --- */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">Umur (Tahun)</span>
            <input type="number" value={formData.age} onChange={(e) => handleChange('age', Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
          </label>
          <label className="block">
            <span className="text-gray-700">Gender</span>
            <select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Tinggi (cm)</span>
            <input type="number" value={formData.height} onChange={(e) => handleChange('height', Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
          </label>
          <label className="block">
            <span className="text-gray-700">Berat (kg)</span>
            <input type="number" value={formData.weight} onChange={(e) => handleChange('weight', Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
          </label>
        </div>
      )}

      {/* --- STEP 2: DIET (Sample Fields) --- */}
      {step === 2 && (
        <div className="space-y-4">
           <label className="block">
            <span className="text-gray-700">Frekuensi Makan Utama</span>
            <select value={formData.makan_freq} onChange={(e) => handleChange('makan_freq', e.target.value)} className="block w-full border p-2 rounded">
              <option value="≤2x">≤2x</option>
              <option value="3x">3x</option>
              <option value="≥3x">≥3x</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Konsumsi Air Putih</span>
            <select value={formData.air} onChange={(e) => handleChange('air', e.target.value)} className="block w-full border p-2 rounded">
              <option value="≤1L">Kurang dari 1 Liter</option>
              <option value="1–2L">1 - 2 Liter</option>
              <option value="≥2L">Lebih dari 2 Liter</option>
            </select>
          </label>
           {/* Add Fast Food, Sayur, Manis here similar to above */}
        </div>
      )}

      {/* --- STEP 3: SLEEP & ACTIVITY --- */}
      {step === 3 && (
        <div className="space-y-4">
           <label className="block">
            <span className="text-gray-700">Durasi Tidur</span>
            <select value={formData.tidur_durasi} onChange={(e) => handleChange('tidur_durasi', e.target.value)} className="block w-full border p-2 rounded">
              <option value="≤6 jam">Kurang dari 6 jam</option>
              <option value="6–8 jam">6 - 8 jam</option>
              <option value="≥8 jam">Lebih dari 8 jam</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Frekuensi Olahraga</span>
            <select value={formData.olahraga} onChange={(e) => handleChange('olahraga', e.target.value)} className="block w-full border p-2 rounded">
              <option value="Tidak pernah">Tidak pernah</option>
              <option value="1–3x">1–3x sebulan</option>
              <option value="4–8x">1-2x seminggu (4-8x sebulan)</option>
              <option value="≥8x">Rutin ({'>'}2x seminggu)</option>
            </select>
          </label>
        </div>
      )}

      {/* --- STEP 4: MENTAL --- */}
      {step === 4 && (
        <div className="space-y-4">
           <label className="block">
            <span className="text-gray-700">Tingkat Stres (1-5)</span>
            <input type="range" min="1" max="5" value={formData.stres_level} onChange={(e) => handleChange('stres_level', Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
                <span>Santai</span><span>Sangat Stres</span>
            </div>
          </label>
           <label className="block">
            <span className="text-gray-700">Screen Time per hari</span>
             <select value={formData.screen} onChange={(e) => handleChange('screen', e.target.value)} className="block w-full border p-2 rounded">
              <option value="≤4 jam">≤4 jam</option>
              <option value="4–6 jam">4–6 jam</option>
              <option value="≥6 jam">≥6 jam</option>
            </select>
          </label>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t">
        {step > 1 ? (
          <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded text-gray-700">Back</button>
        ) : <div></div>}
        
        {step < 4 ? (
          <button onClick={nextStep} className="px-4 py-2 bg-blue-600 rounded text-white">Next</button>
        ) : (
          <button onClick={() => setIsSubmitted(true)} className="px-6 py-2 bg-green-600 rounded text-white font-bold">Analyze Health</button>
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