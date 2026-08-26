'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useAppSelector } from '../store/hooks';

// We define a base URL for our API, typically from an environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

// Create a configured axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Custom hook to manage API interceptors.
 * Using a hook allows us to access Redux state (like auth tokens) easily,
 * which can then be injected into our requests.
 */
export const useApi = () => {
  // We can select auth state from redux if we have one
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Request interceptor to add headers or tokens before request is sent
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        // If the user is authenticated, we can inject a dummy token here
        // In real apps, get the token from Redux or Cookies
        if (isAuthenticated && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer dummy_token_123`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle global errors (e.g., 401 Unauthorized)
    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          // Example: trigger a token refresh or redirect to login here
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount to avoid duplicate interceptors
    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [isAuthenticated]);

  // Return the configured axios instance
  return api;
};
