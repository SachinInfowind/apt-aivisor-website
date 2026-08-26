import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

/**
 * Configures the Redux store.
 * We export the makeStore function to create a new store instance for each request in SSR (if needed),
 * but for client-side, we generally use a single store instance.
 */
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    // Adding middleware is easy here if we need like saga or custom logger
  });
};

// Types to be used across the application for strong typing
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
