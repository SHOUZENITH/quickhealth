'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LogOut, 
  Home, 
  Plus, 
  Clock, 
  ChevronRight, 
  Activity, 
  Weight, 
  Calendar,
  X,
  LayoutDashboard
} from 'lucide-react';
import ResultView from '@/components/ResultView'; 

interface Assessment {
  id: string;
  created_at: string;
  health_score: number;
  bmi: number;
  weight_kg: number;
  form_data: any;
}

interface DashboardClientProps {
  session: any;
  initialAssessments: Assessment[] | null;
}

export default function DashboardClient({ session, initialAssessments }: DashboardClientProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  
  // State for Modal
  const [selectedItem, setSelectedItem] = useState<Assessment | null>(null);
  
  const assessments = initialAssessments || [];
  const latest = assessments[0];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  // Helper for date formatting
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a192f] transition-colors duration-300 relative">
      
      {/* --- BACKGROUND EFFECTS (from Block 2) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10">
          
          {/* --- NAVBAR --- */}
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            {/* FIXED: Explicit colors for Light (gray-600) vs Dark (white) */}
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition text-gray-600 dark:text-blue-100 font-bold"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full shadow-sm backdrop-blur-md">
                <div className="text-xs text-right">
                  <span className="block text-gray-400 uppercase tracking-wider font-bold text-[10px]">Logged in as</span>
                  <span className="font-bold text-gray-900 dark:text-white truncate max-w-[150px] block">
                    {session?.user?.email}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 pb-12 space-y-12">
            
            {/* --- 1. HERO SECTION (Latest Snapshot) --- */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Latest Snapshot</h2>
              </div>

              {latest ? (
                // Added onClick and cursor-pointer to make it open the modal
                <div 
                    onClick={() => setSelectedItem(latest)}
                    className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl shadow-blue-500/20 cursor-pointer group transition-transform hover:scale-[1.01]"
                >
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-white/20 transition duration-700"></div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium mb-6 border border-white/10">
                            <Calendar className="w-3 h-3" />
                            {formatDate(latest.created_at)}
                          </div>
                          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Overall Health Score</h1>
                          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
                            Your latest analysis indicates <span className="font-bold text-white">{latest.health_score > 60 ? 'Good' : latest.health_score > 40 ? 'Moderate' : 'Needs Attention'}</span> health. 
                            Click to view full details.
                          </p>
                      </div>

                      <div className="flex items-center justify-start md:justify-end gap-8">
                          <div className="text-right border-r border-white/20 pr-8">
                            <span className="block text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Weight</span>
                            <span className="text-4xl font-black">{latest.weight_kg} <span className="text-xl font-medium text-blue-200">kg</span></span>
                          </div>
                          
                          {/* Circular Score */}
                          <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle className="text-black/20 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent"></circle>
                                <circle 
                                  className="text-white stroke-current" 
                                  strokeWidth="10" 
                                  strokeLinecap="round" 
                                  cx="50" cy="50" r="40" 
                                  fill="transparent"
                                  strokeDasharray="251.2"
                                  strokeDashoffset={251.2 - (251.2 * latest.health_score) / 100}
                                ></circle>
                            </svg>
                            <span className="absolute text-4xl font-black">{latest.health_score}</span>
                          </div>
                      </div>
                    </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-[2.5rem] p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <Activity className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Analysis Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Take your first health checkup to see your score here.</p>
                    <Link href="/calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">
                      <Plus className="w-5 h-5" /> Start Checkup
                    </Link>
                </div>
              )}
            </div>

            {/* --- 2. HISTORY SECTION --- */}
            <div>
              <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">History</h2>
                  </div>
                  <Link href="/calculator" className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    <Plus className="w-4 h-4" /> New Checkup
                  </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assessments.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => setSelectedItem(item)}
                        className="group bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-blue-200 dark:hover:border-blue-500/30 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                              <div className="font-bold text-gray-900 dark:text-white mb-1">
                                {formatDate(item.created_at)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {formatTime(item.created_at)}
                              </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.health_score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' :
                              item.health_score >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300' :
                              'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                          }`}>
                              Score: {item.health_score}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mb-6">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Weight className="w-4 h-4 text-blue-500" />
                              <span className="font-bold">{item.weight_kg} <span className="text-xs font-normal text-gray-400">kg</span></span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Activity className="w-4 h-4 text-pink-500" />
                              <span className="font-bold">{item.bmi} <span className="text-xs font-normal text-gray-400">BMI</span></span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 dark:border-white/5">
                          <button className="w-full flex items-center justify-between text-sm font-bold text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                              View Details
                              <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
      </div>

      {/* --- VIEW DETAILS MODAL (from Block 2) --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
            
            {/* Modal Window */}
            <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-gray-50 dark:bg-[#0f172a] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f172a] z-20">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                             <LayoutDashboard className="w-5 h-5 text-blue-500" />
                             Historical Assessment
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Recorded on {new Date(selectedItem.created_at).toLocaleDateString()} at {new Date(selectedItem.created_at).toLocaleTimeString()}
                        </p>
                    </div>
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition text-gray-500 dark:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto p-6 bg-gray-50 dark:bg-[#0a192f]">
                    <ResultView data={selectedItem.form_data} onRetry={() => setSelectedItem(null)} />
                </div>
            </div>
        </div>
      )}

    </div>
  );
}