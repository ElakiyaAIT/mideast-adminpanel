import React, { type JSX, type ReactNode } from 'react';
import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'wave',
}: SkeletonProps): JSX.Element => {
  const baseStyles = 'skeleton';

  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'skeleton-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], animationStyles[animation], className)}
      style={style}
      aria-busy="true"
      aria-label="Loading content"
    />
  );
};

interface SkeletonGroupProps {
  children: ReactNode;
  className?: string;
}

export const SkeletonGroup = ({ children, className }: SkeletonGroupProps): JSX.Element => {
  return <div className={cn('space-y-3', className)}>{children}</div>;
};

interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export const SkeletonCard = ({
  className,
  showAvatar = false,
  lines = 3,
}: SkeletonCardProps): JSX.Element => {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-soft dark:border-gray-700 dark:bg-gray-800',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        {showAvatar && <Skeleton variant="circular" width={48} height={48} animation="wave" />}
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" width="60%" height={20} animation="wave" />
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              variant="text"
              width={index === lines - 1 ? '40%' : '100%'}
              height={16}
              animation="wave"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export const SkeletonTable = ({
  rows = 5,
  columns = 4,
  showHeader = true,
}: SkeletonTableProps): JSX.Element => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-soft dark:border-gray-700 dark:bg-gray-800">
      {showHeader && (
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width={`${100 / columns}%`}
                height={20}
                animation="wave"
              />
            ))}
          </div>
        </div>
      )}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  variant="text"
                  width={`${100 / columns}%`}
                  height={16}
                  animation="wave"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
