import React, { forwardRef } from 'react';
import { cn } from '../../utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  required?: boolean;
  multiple?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, className = '', options, multiple, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          // multiple={multiple}
          className={cn(
            'w-full rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50',
            'glass-light text-gray-900 dark:text-gray-100',
            'border border-white/30 dark:border-white/10',
            'hover:glass hover:border-white/40 hover:shadow-frost dark:hover:border-white/15',
            'focus:border-primary-500/50 focus:shadow-glow',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50',
            className,
          )}
          {...props}
        >
          {!multiple && <option value="">Select...</option>}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
