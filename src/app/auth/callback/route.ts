import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ 
        cookies: () => cookieStore as any 
    });
    
    // Exchange the auth code for a user session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard after successful login
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}