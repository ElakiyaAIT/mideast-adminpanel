import { useEffect, type JSX, type ReactNode } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setTheme } from '../store/themeSlice';
import type { ThemeMode } from '../types';
import { THEME } from '../constants';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  const { mode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(THEME.LIGHT, THEME.DARK);
    root.classList.add(mode);
    dispatch(setTheme(mode));
  }, [mode, dispatch]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent): void => {
      if (!localStorage.getItem('app_theme')) {
        const newMode: ThemeMode = e.matches ? THEME.DARK : THEME.LIGHT;
        dispatch(setTheme(newMode));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  return <>{children}</>;
};
