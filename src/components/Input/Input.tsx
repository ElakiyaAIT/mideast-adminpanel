import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, required, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Input wrapper for icon */}
        <div className="relative">
          <input
            ref={ref}
            aria-invalid={hasError}
            className={cn(
              'w-full rounded-xl px-4 py-3 pr-10 transition-all duration-300',
              'focus:outline-none focus:ring-2',
              'glass-light text-gray-900 dark:text-gray-100',
              'border border-white/30 dark:border-white/10',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'hover:glass hover:border-white/40 hover:shadow-frost dark:hover:border-white/15',
              hasError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                : 'focus:border-primary-500/50 focus:ring-primary-500/50',
              className,
            )}
            {...props}
          />

          {/* Error icon */}
          {hasError && (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-red-500">
              <AlertCircle size={18} />
            </span>
          )}
        </div>

        {/* Helper / Error text */}
        {helperText && !hasError && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}

        {hasError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
