import type { JSX } from 'react';
import { useAppSelector } from '../../hooks/redux';

export const GlobalLoader = (): JSX.Element | null => {
  const { isLoading, loadingMessage } = useAppSelector((state) => state.loader);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/60 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-label={loadingMessage || 'Loading'}
    >
      <div className="flex min-w-[280px] max-w-[320px] animate-scale-in flex-col items-center gap-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-large dark:border-gray-800 dark:bg-gray-900">
        {/* Premium Multi-layer Loader */}
        <div className="relative h-16 w-16">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 animate-spin-slow rounded-full border-4 border-primary-100 dark:border-primary-900/30"></div>
          {/* Middle ring */}
          <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-primary-400 dark:border-t-primary-500"></div>
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-pulse-slow rounded-full bg-primary-500 shadow-lg shadow-primary-500/50"></div>
          </div>
        </div>

        {/* Loading Message */}
        {loadingMessage && (
          <div className="text-center">
            <p className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              {loadingMessage}
            </p>
            <div className="mt-3 flex justify-center gap-1.5">
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary-500 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary-500 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary-500"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
