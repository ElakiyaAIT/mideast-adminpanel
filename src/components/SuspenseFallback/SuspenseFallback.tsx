import type { JSX } from 'react';

interface SuspenseFallbackProps {
  message?: string;
  fullScreen?: boolean;
}

export const SuspenseFallback = ({
  message = 'Loading...',
  fullScreen = true,
}: SuspenseFallbackProps): JSX.Element => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900'
    : 'flex items-center justify-center min-h-[400px] bg-transparent';

  return (
    <div className={containerClass}>
      <div className="flex animate-fade-in flex-col items-center gap-6">
        {/* Premium animated loader with glass morphism */}
        <div className="relative">
          {/* Glowing background */}
          <div className="absolute inset-0 h-20 w-20 -translate-x-2 -translate-y-2 animate-pulse-slow rounded-full bg-primary-500/20 blur-xl" />

          {/* Outer rotating ring */}
          <div className="relative h-20 w-20 animate-spin-slow rounded-full border-4 border-primary-100 dark:border-primary-900/30">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary-500"></div>
            <div
              className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-primary-400"
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            ></div>
          </div>

          {/* Inner pulsing dot with glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-pulse-slow rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow"></div>
          </div>
        </div>

        {/* Loading text with premium styling */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-gradient-brand animate-pulse text-base font-semibold">{message}</p>
          <div className="flex gap-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary-500 shadow-glow [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary-500 shadow-glow [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-primary-500 shadow-glow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
