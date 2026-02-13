import { Card, Badge } from '../';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JSX } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon: LucideIcon;
  iconColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export const StatCard = ({
  title,
  value,
  trend,
  icon: Icon,
  iconColor: _iconColor = 'primary',
  gradientFrom = 'primary-500',
  gradientTo = 'primary-600',
}: StatCardProps): JSX.Element => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <Card className="group relative overflow-hidden">
      <div
        className={`absolute right-0 top-0 h-32 w-32 bg-gradient-to-br from-${gradientFrom}/20 -translate-y-16 translate-x-16 rounded-full to-transparent blur-2xl transition-transform duration-500 group-hover:scale-150`}
      />
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">{formattedValue}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <Badge variant={trend.isPositive ? 'success' : 'danger'} size="sm">
                {trend.isPositive ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </Badge>
              {trend.label && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div
            className={`h-16 w-16 rounded-2xl bg-gradient-to-br from-${gradientFrom} to-${gradientTo} flex items-center justify-center shadow-glow transition-shadow duration-300 group-hover:shadow-glow-lg`}
          >
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    </Card>
  );
};
