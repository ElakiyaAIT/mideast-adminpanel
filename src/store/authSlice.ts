import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Auth slice now only manages UI state (isAuthenticated flag for immediate UI updates)
// Server state (user data) is managed by React Query
interface AuthState {
  isAuthenticated: boolean; // UI-only flag for immediate state updates
}

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
