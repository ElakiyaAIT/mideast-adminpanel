import { type JSX, type ReactNode } from 'react';
import { cn } from '../../utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  headerAction?: ReactNode;
}

export const Card = ({
  children,
  className,
  title,
  description,
  headerAction,
}: CardProps): JSX.Element => {
  return (
    <div
      className={cn(
        'glass-frost rounded-2xl p-6',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-frost-lg',
        'hover:border-white/50 dark:hover:border-white/20',
        className,
      )}
    >
      {(title || description || headerAction) && (
        <div className="mb-4 border-b border-gray-100 pb-4 dark:border-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {title && (
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
              )}
            </div>
            {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
          </div>
        </div>
      )}
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
};
