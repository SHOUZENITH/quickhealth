import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PageNavigation from '@/components/PageNavigation'; // <--- 1. Import this

// This is a Server Component
export default async function Dashboard() {
  const cookieStore = await cookies();

  // Pass cookies to Supabase client
  const supabase = createServerComponentClient({ 
    cookies: () => cookieStore as any 
  });

  // Check session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch data
  const { data: assessments } = await supabase
    .from('health_assessments')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto p-6">
      
      {/* --- 2. ADDED: Navigation Bar --- */}
      <div className="mb-2">
        <PageNavigation />
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Health History</h1>
        <div className="space-x-4 flex items-center">
            <span className="text-gray-600 dark:text-gray-300">Hello, {session.user.email}</span>
            
            <form action="/auth/signout" method="post" className="inline">
                 <button type="submit" className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:underline transition-colors">
                    Sign Out
                 </button>
            </form>
        </div>
      </div>

      {/* Call to Action Box - Dark Mode Friendly */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800/50 flex justify-between items-center mb-8 transition-colors">
        <div>
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Track your progress</h2>
            <p className="text-blue-700 dark:text-blue-300 text-sm">Take a new assessment to see how your score changes.</p>
        </div>
        <Link 
            href="/calculator" 
            className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg shadow-blue-600/20 hover:bg-blue-700 dark:hover:bg-blue-500 transition-all"
        >
            + New Checkup
        </Link>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">BMI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {assessments?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.weight_kg} kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.bmi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Badge Logic with Dark Mode Support */}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.health_score >= 80 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300' 
                        : item.health_score >= 50 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                    }`}>
                    {item.health_score}/100
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
            
            {assessments?.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        No history found. Go take your first checkup!
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}