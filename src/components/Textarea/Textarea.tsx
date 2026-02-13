import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, required, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50',
            'glass-light text-gray-900 dark:text-gray-100',
            'border border-white/30 dark:border-white/10',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'hover:glass hover:border-white/40 hover:shadow-frost dark:hover:border-white/15',
            'focus:border-primary-500/50 focus:shadow-glow',
            'resize-none',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50',
            className,
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
