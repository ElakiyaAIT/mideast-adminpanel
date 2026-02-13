import { type JSX, type ReactNode } from 'react';
import { cn } from '../../utils';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

export const Badge = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
}: BadgeProps): JSX.Element => {
  const baseStyles =
    'inline-flex items-center font-semibold rounded-full transition-all duration-200';

  const variants = {
    primary:
      'bg-gradient-to-r from-primary-500 to-primary-600 text-gray-900 shadow-sm hover:shadow-glow border border-primary-400/30 backdrop-blur-sm',
    secondary:
      'glass-light text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-frost border border-white/20 dark:border-white/10',
    success:
      'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:shadow-md backdrop-blur-sm border border-green-400/30',
    warning:
      'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm hover:shadow-md backdrop-blur-sm border border-yellow-400/30',
    danger:
      'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:shadow-md backdrop-blur-sm border border-red-400/30',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md backdrop-blur-sm border border-blue-400/30',
    outline:
      'glass-light border-2 border-primary-500/50 text-primary-600 dark:border-primary-400/50 dark:text-primary-400 hover:border-primary-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>{children}</span>
  );
};
