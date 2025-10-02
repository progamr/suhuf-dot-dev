import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check if user has session cookie (NextAuth sets this)
  // Try different cookie names based on environment
  const sessionToken = req.cookies.get('authjs.session-token') || 
                       req.cookies.get('next-auth.session-token') || 
                       req.cookies.get('__Secure-authjs.session-token') ||
                       req.cookies.get('__Secure-next-auth.session-token');
  const isLoggedIn = !!sessionToken;

  // Public auth pages (login, signup, verify-email)
  const isAuthPage = pathname.startsWith('/login') || 
                     pathname.startsWith('/signup') || 
                     pathname.startsWith('/verify-email');

  const isOnboardingPage = pathname.startsWith('/onboarding');

  // If logged in and trying to access auth pages, redirect to home
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Onboarding check is now handled client-side in the page component
  // Middleware only handles basic auth redirects

  // If not logged in and trying to access onboarding, redirect to login
  if (!isLoggedIn && isOnboardingPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
