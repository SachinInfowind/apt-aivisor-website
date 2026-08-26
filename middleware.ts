import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PROTECTED_ROUTES, AUTH_ROUTES } from './config/routes';

/**
 * Middleware to handle Route Protection in Next.js App Router.
 * This runs on the edge before a request is completed, allowing us to redirect based on auth status.
 * It is placed in the root directory as required by Next.js convention.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Example: Read token from cookies to determine authentication status
  // In a real application, you would verify this token securely.
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;

  // Check if current path matches any of the protected or auth-specific routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // If user is trying to access a protected route without being authenticated
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is already authenticated and tries to access login/register
  if (isAuthRoute && isAuthenticated) {
    // Redirect to a dashboard or home
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Let the request continue normally for public routes or authorized access
  return NextResponse.next();
}

/**
 * Config to specify which paths the middleware should run on.
 * We exclude static files, images, Next.js internal paths, and API routes 
 * to optimize performance and prevent unnecessary middleware executions.
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
