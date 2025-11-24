import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';

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

  // Render the Client Component with data passed as props
  return <DashboardClient session={session} initialAssessments={assessments} />;
}