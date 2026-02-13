import React, { forwardRef } from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            ref={ref}
            className={`h-5 w-5 cursor-pointer rounded-md border-2 bg-white/50 text-primary-500 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-gray-800/50 dark:hover:bg-gray-800/70 ${
              error
                ? 'border-red-300 dark:border-red-500/50'
                : 'border-gray-200 dark:border-gray-700'
            } ${className} `}
            {...props}
          />
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          )}
        </label>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
