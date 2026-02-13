import { useEffect, useRef, type JSX } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '../store';
import { ThemeProvider } from '../theme/ThemeProvider';
import { ReactQueryProvider } from '../lib/react-query';
import { AppRoutes } from '../routes';
import { GlobalLoader, ErrorBoundary } from '../components';
import { useAppDispatch } from '../hooks/redux';
import { setTheme } from '../store/themeSlice';
import type { ThemeMode } from '../types';
import { STORAGE_KEYS } from '../constants';
import { authService } from '../services/authService';

const AppContent = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeApp = async (): Promise<void> => {
      // Initialize theme
      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      const theme: ThemeMode =
        storedTheme === 'light' || storedTheme === 'dark'
          ? storedTheme
          : window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';

      dispatch(setTheme(theme));
      document.documentElement.classList.toggle('dark', theme === 'dark');

      // Prefetch auth state - this will populate React Query cache
      // The guards will use this cached data for immediate auth checks
      // If this fails, guards will handle redirects appropriately
      try {
        await authService.checkAuth();
      } catch (_error) {
        // No active session found - user will be prompted to login
      }
    };

    void initializeApp();
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <GlobalLoader />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 4000,
        }}
      />
    </>
  );
};

const App = (): JSX.Element => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ReactQueryProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </ReactQueryProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
