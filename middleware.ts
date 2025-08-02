// Next.js middleware for authentication
// This runs before every request to check authentication status

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const authRoutes = ['/sign-in', '/sign-up'];
  
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // If accessing protected route without token, redirect to sign-in
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If accessing auth route with token, redirect to dashboard
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
