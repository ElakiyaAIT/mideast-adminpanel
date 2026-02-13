import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '../types';
import { STORAGE_KEYS, THEME } from '../constants';

const getInitialTheme = (): ThemeMode => {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === THEME.LIGHT || stored === THEME.DARK) {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME.DARK : THEME.LIGHT;
};

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem(STORAGE_KEYS.THEME, action.payload);
      document.documentElement.classList.toggle('dark', action.payload === THEME.DARK);
    },
    toggleTheme: (state) => {
      const newMode: ThemeMode = state.mode === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
      state.mode = newMode;
      localStorage.setItem(STORAGE_KEYS.THEME, newMode);
      document.documentElement.classList.toggle('dark', newMode === THEME.DARK);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
