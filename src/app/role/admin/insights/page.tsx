'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Activity, AlertTriangle } from 'lucide-react';

export default function InsightsPage() {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState<any>({ total: 0, avgScore: 0, risks: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const { data } = await supabase.from('health_assessments').select('*');
      if (data && data.length > 0) {
        const total = data.length;
        const avgScore = Math.round(data.reduce((acc, curr) => acc + (curr.health_score || 0), 0) / total);
        const risks = data.filter((r: any) => r.bmi > 25).length;
        setStats({ total, avgScore, risks });
      }
    };
    loadStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Health Insights</h2>
        <p className="text-gray-500">Population health statistics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <p className="text-blue-100 font-medium mb-1">Avg Health Score</p>
          <h3 className="text-5xl font-bold">{stats.avgScore}</h3>
          <div className="mt-4 text-xs bg-blue-900/50 inline-block px-2 py-1 rounded text-blue-200">
             Based on {stats.total} assessments
          </div>
        </div>

        <div className="bg-white dark:bg-[#0a111d] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm">High Risk Users</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.risks}</h3>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
           </div>
           <p className="text-sm text-gray-500">Users with BMI {'>'} 25 indicating potential health risks.</p>
           <div className="mt-4 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: `${stats.total ? (stats.risks / stats.total) * 100 : 0}%` }}></div>
           </div>
        </div>

        <div className="bg-white dark:bg-[#0a111d] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col justify-center items-center text-center">
            <Activity className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
            <p className="text-gray-500">Total Checkups Run</p>
        </div>
      </div>
    </div>
  );
}