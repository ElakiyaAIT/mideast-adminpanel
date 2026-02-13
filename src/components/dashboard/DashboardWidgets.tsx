import { Card, Badge } from '../';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { DashboardWidgetDto } from '../../dto';
import type { JSX } from 'react';

interface DashboardWidgetsProps {
  widgets: DashboardWidgetDto[];
}

const iconMap: Record<string, typeof Activity> = {
  users: Activity,
  revenue: Activity,
  activity: Activity,
};

export const DashboardWidgets = ({ widgets }: DashboardWidgetsProps): JSX.Element | null => {
  if (widgets.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {widgets.map((widget) => {
        const Icon = iconMap[widget.icon] || Activity;
        return (
          <Card
            key={widget.id}
            title={widget.title}
            className="transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="mb-3 text-4xl font-bold text-gray-900 dark:text-white">
                  {widget.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  {widget.changeType === 'increase' ? (
                    <Badge variant="success" size="sm">
                      <TrendingUp className="mr-1 h-3 w-3" />+{widget.change}%
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="sm">
                      <TrendingDown className="mr-1 h-3 w-3" />
                      {widget.change}%
                    </Badge>
                  )}
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/20 to-primary-600/20 dark:border-primary-500/30 dark:from-primary-500/30 dark:to-primary-600/30">
                  <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
