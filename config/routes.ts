/**
 * Defines standard public and protected routes for the application.
 * This centralized configuration helps manage route access control logic 
 * in the Next.js middleware and across components.
 */

export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/about',
  '/ssr-example', // Added SSR Example as public for demonstration
];

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
];

// Auth routes are routes that should not be accessible if the user is ALREADY logged in
export const AUTH_ROUTES = [
  '/login',
  '/register',
];
