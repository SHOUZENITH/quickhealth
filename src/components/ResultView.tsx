'use client';

import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { HealthInput, calcHealthScore, calcBMI, calcBMR, getBMICategory } from '@/utils/healthEngine'; 
import PageNavigation from '@/components/PageNavigation'; // <--- 1. Import this

interface ResultProps {
  data: HealthInput;
  onRetry: () => void;
}

export default function ResultView({ data, onRetry }: ResultProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const [saving, setSaving] = useState(false);

  // Logic Kalkulasi
  const bmi = calcBMI(data.weight, data.height);
  const bmiCat = getBMICategory(bmi);
  const bmr = calcBMR(data.gender, data.weight, data.height, data.age); 
  const results = calcHealthScore(data);

  // 1. Handle Print
  const handlePrint = useReactToPrint({
    contentRef: componentRef, 
    documentTitle: `QuickHealth_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // 2. Handle Save to Supabase
  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please login to save your history!");
      setSaving(false);
      return;
    }

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
    
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-10">
      
      {/* --- 2. ADDED: Navigation Bar --- */}
      <div className="mb-6">
        <PageNavigation />
      </div>

      {/* --- PRINTABLE AREA --- */}
      <div ref={componentRef} className="bg-white dark:bg-gray-800 p-8 md:p-10 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">🩺 QuickHealth</h1>
            <p className="text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Stats */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Physical Indicators</h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl space-y-3 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between">
                        <span>BMI</span>
                        <span className="font-bold text-gray-900 dark:text-white">{bmi} <span className="text-sm font-normal text-blue-500">({bmiCat})</span></span>
                    </div>
                    <div className="flex justify-between">
                        <span>BMR (Calories/Day)</span>
                        <span className="font-bold text-gray-900 dark:text-white">{Math.round(bmr)} kcal</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Target Water</span>
                        <span className="font-bold text-gray-900 dark:text-white">{((data.weight * 35)/1000).toFixed(1)} L</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Score */}
            <div className="text-center flex flex-col justify-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Overall Health Score</h2>
                <div className="text-6xl font-black text-blue-600 dark:text-blue-500 mb-2">
                    {results.overall}<span className="text-3xl text-gray-300 dark:text-gray-600">/100</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {results.overall > 80 ? "Excellent! Keep it up." : 
                     results.overall > 50 ? "Good, but room for improvement." : "Needs attention."}
                </p>
            </div>
        </div>

        {/* Breakdown */}
        <div className="mt-8">
            <h3 className="text-lg font-bold border-b border-gray-100 dark:border-gray-700 mb-4 pb-2 text-gray-800 dark:text-gray-200">Detailed Breakdown</h3>
            <div className="space-y-4">
                <ScoreBar label="Diet & Nutrition" score={results.breakdown.diet} />
                <ScoreBar label="Sleep Quality" score={results.breakdown.sleep} />
                <ScoreBar label="Physical Activity" score={results.breakdown.activity} />
                <ScoreBar label="Mental Wellbeing" score={results.breakdown.mental} />
            </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-800/30">
            <strong>Disclaimer:</strong> This is a simplified health algorithm for educational purposes. 
            Please consult our chatbot for more information or our doctor for professional medical advice.
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-6 mb-20">
        <button onClick={onRetry} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium">
            Start Over
        </button>
        
        <div className="flex gap-3 w-full sm:w-auto">
            <button 
                onClick={() => handlePrint()} 
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center gap-2 transition-all"
            >
                📄 Download PDF
            </button>

            <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
                {saving ? "Saving..." : "💾 Save to History"}
            </button>
        </div>
      </div>
    </div>
  );
}

// Helper Component (Styled for Dark Mode)
function ScoreBar({ label, score }: { label: string, score: number }) {
    let color = "bg-red-500";
    if(score > 50) color = "bg-yellow-400"; 
    if(score > 75) color = "bg-green-500";

    return (
        <div className="flex items-center justify-between gap-4">
            <span className="w-32 font-medium text-sm text-gray-600 dark:text-gray-300">{label}</span>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${score}%` }}></div>
            </div>
            <span className="w-8 text-right text-sm font-bold text-gray-700 dark:text-white">{score}</span>
        </div>
    );
}