import { type JSX, type ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils';

export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}: AlertProps): JSX.Element => {
  const variants = {
    success: {
      container:
        'glass-light border-green-500/30 dark:border-green-500/20 bg-green-50/50 dark:bg-green-900/10 backdrop-blur-md',
      icon: 'text-green-600 dark:text-green-400',
      title: 'text-green-800 dark:text-green-300',
      text: 'text-green-700 dark:text-green-400',
      iconComponent: CheckCircle,
    },
    error: {
      container:
        'glass-light border-red-500/30 dark:border-red-500/20 bg-red-50/50 dark:bg-red-900/10 backdrop-blur-md',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-800 dark:text-red-300',
      text: 'text-red-700 dark:text-red-400',
      iconComponent: AlertCircle,
    },
    warning: {
      container:
        'glass-light border-yellow-500/30 dark:border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-900/10 backdrop-blur-md',
      icon: 'text-yellow-600 dark:text-yellow-400',
      title: 'text-yellow-800 dark:text-yellow-300',
      text: 'text-yellow-700 dark:text-yellow-400',
      iconComponent: AlertTriangle,
    },
    info: {
      container:
        'glass-light border-blue-500/30 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10 backdrop-blur-md',
      icon: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-800 dark:text-blue-300',
      text: 'text-blue-700 dark:text-blue-400',
      iconComponent: Info,
    },
  };

  const variantStyles = variants[variant];
  const Icon = variantStyles.iconComponent;

  return (
    <div
      className={cn(
        'relative flex animate-slide-up gap-4 rounded-xl border p-4 shadow-frost',
        variantStyles.container,
        className,
      )}
      role="alert"
    >
      <Icon className={cn('mt-0.5 h-5 w-5 flex-shrink-0', variantStyles.icon)} />
      <div className="min-w-0 flex-1">
        {title && <h4 className={cn('mb-1 font-semibold', variantStyles.title)}>{title}</h4>}
        <div className={cn('text-sm', variantStyles.text)}>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            'flex-shrink-0 rounded-lg p-1 transition-colors',
            'hover:bg-black/5 dark:hover:bg-white/5',
            variantStyles.text,
          )}
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
