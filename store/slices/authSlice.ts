import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state structure for auth
export interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

/**
 * Auth slice to handle user authentication state across the application.
 * This is used as an example to show how state management works with Redux Toolkit.
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set user after successful login
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    // Action to clear user state on logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
