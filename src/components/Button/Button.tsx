import { type ButtonHTMLAttributes, type JSX, type ReactNode } from 'react';
import { cn } from '../../utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps): JSX.Element => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gradient-to-r from-primary-500 to-primary-600 text-gray-100 hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500/50 focus:ring-offset-2 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 dark:text-gray-900 shadow-md hover:scale-[1.02] backdrop-blur-sm border border-primary-400/30',
    secondary:
      'glass-light text-gray-900 hover:glass hover:shadow-frost focus:ring-gray-500/50 focus:ring-offset-2 dark:text-gray-100 border border-white/20 dark:border-white/10',
    outline:
      'glass-light border-2 border-primary-500/50 text-primary-600 hover:border-primary-500 focus:ring-primary-500/50 focus:ring-offset-2 dark:border-primary-400/50 dark:text-primary-400 shadow-sm hover:shadow-frost',
    ghost:
      'text-gray-700 hover:glass-light focus:ring-gray-500/50 focus:ring-offset-2 dark:text-gray-300 transition-all duration-200 border border-transparent hover:border-white/20 dark:hover:border-white/10',
    danger:
      'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500/50 focus:ring-offset-2 shadow-md hover:scale-[1.02] backdrop-blur-sm border border-red-400/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
