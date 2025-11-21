'use client';

import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { HealthInput, calcHealthScore, calcBMI, calcBMR, getBMICategory } from '@/utils/healthEngine'; // Adjust imports as needed

interface ResultProps {
  data: HealthInput;
  onRetry: () => void;
}

export default function ResultView({ data, onRetry }: ResultProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const [saving, setSaving] = useState(false);

  const bmi = calcBMI(data.weight, data.height);
  const bmiCat = getBMICategory(bmi);
  const bmr = calcBMR(data.gender, data.weight, data.height, data.age);
  const results = calcHealthScore(data);


  const handlePrint = useReactToPrint({
    contentRef: componentRef, 
    documentTitle: `QuickHealth_Report_${new Date().toISOString().split('T')[0]}`,
  });
  // --- FIX ENDS HERE ---

  // 3. Handle Save to Supabase
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
    <div className="max-w-4xl mx-auto mt-10">
      
      {/* This DIV is what gets downloaded as PDF */}
      <div ref={componentRef} className="bg-white p-10 shadow-xl rounded-xl border border-gray-100">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h1 className="text-4xl font-bold text-blue-600">🩺 QuickHealth</h1>
            <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Stats */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Physical Indicators</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                        <span>BMI</span>
                        <span className="font-bold">{bmi} ({bmiCat})</span>
                    </div>
                    <div className="flex justify-between">
                        <span>BMR (Calories/Day)</span>
                        <span className="font-bold">{Math.round(bmr)} kcal</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Target Water</span>
                        <span className="font-bold">{((data.weight * 35)/1000).toFixed(1)} L</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Score */}
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Overall Health Score</h2>
                <div className="text-6xl font-black text-blue-600 mb-2">
                    {results.overall}/100
                </div>
                <p className="text-sm text-gray-500">
                    {results.overall > 80 ? "Excellent! Keep it up." : 
                     results.overall > 50 ? "Good, but room for improvement." : "Needs attention."}
                </p>
            </div>
        </div>

        <div className="mt-8">
            <h3 className="text-lg font-bold border-b mb-4">Detailed Breakdown</h3>
            <div className="space-y-3">
                <ScoreBar label="Diet & Nutrition" score={results.breakdown.diet} />
                <ScoreBar label="Sleep Quality" score={results.breakdown.sleep} />
                <ScoreBar label="Physical Activity" score={results.breakdown.activity} />
                <ScoreBar label="Mental Wellbeing" score={results.breakdown.mental} />
            </div>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded text-sm text-blue-800">
            <strong>Disclaimer:</strong> This is a simplified health algorithm for educational purposes. 
            Please consult a doctor for professional medical advice.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6 mb-20">
        <button onClick={onRetry} className="px-4 py-2 text-gray-600 hover:underline">
            Start Over
        </button>
        
        <button 
            onClick={() => handlePrint()} 
            className="px-4 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-700 flex items-center gap-2"
        >
            📄 Download PDF
        </button>

        <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
            {saving ? "Saving..." : "💾 Save to History"}
        </button>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string, score: number }) {
    let color = "bg-red-500";
    if(score > 50) color = "bg-yellow-500";
    if(score > 75) color = "bg-green-500";

    return (
        <div className="flex items-center gap-4">
            <span className="w-32 font-medium text-sm">{label}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
            </div>
            <span className="w-8 text-right text-sm font-bold">{score}</span>
        </div>
    );
}