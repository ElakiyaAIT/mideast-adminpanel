import { type JSX, type ReactNode } from 'react';
import { cn } from '../../utils';

export interface ChartProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export const Chart = ({
  title,
  description,
  children,
  className,
  headerAction,
}: ChartProps): JSX.Element => {
  return (
    <div
      className={cn(
        'glass-frost rounded-2xl border border-white/30 dark:border-white/10',
        'shadow-frost transition-all duration-300 hover:-translate-y-1 hover:shadow-frost-lg',
        'p-6',
        className,
      )}
    >
      {(title || description || headerAction) && (
        <div className="mb-6 flex items-start justify-between">
          <div>
            {title && (
              <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
};
