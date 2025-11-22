import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// This is a Server Component (async by default)
export default async function Dashboard() {
  // 1. Await the cookies explicitly (Required in Next.js 15/16)
  const cookieStore = await cookies();

  // 2. Pass the resolved store into the function
  // We cast to 'any' here to fix the build error caused by library version mismatch
  const supabase = createServerComponentClient({ 
    cookies: () => cookieStore as any 
  });

  // 3. Check if user is logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // 4. Fetch health history
  const { data: assessments } = await supabase
    .from('health_assessments')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Health History</h1>
        <div className="space-x-4">
            <span className="text-gray-600">Hello, {session.user.email}</span>
            
            {/* Sign Out Button */}
            <form action="/auth/signout" method="post" className="inline">
                 <button type="submit" className="text-sm text-red-500 hover:underline">
                    Sign Out
                 </button>
            </form>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex justify-between items-center mb-8">
        <div>
            <h2 className="text-lg font-semibold text-blue-900">Track your progress</h2>
            <p className="text-blue-700 text-sm">Take a new assessment to see how your score changes.</p>
        </div>
        <Link 
            href="/calculator" 
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
            + New Checkup
        </Link>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assessments?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.weight_kg} kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.bmi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.health_score >= 80 ? 'bg-green-100 text-green-800' : 
                      item.health_score >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {item.health_score}/100
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed">View</button>
                </td>
              </tr>
            ))}
            
            {assessments?.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
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