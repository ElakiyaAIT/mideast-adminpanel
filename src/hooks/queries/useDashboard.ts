import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api';
import type { DashboardStatsDto, DashboardWidgetDto } from '../../dto';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  widgets: () => [...dashboardKeys.all, 'widgets'] as const,
};

/**
 * Get dashboard stats
 */
export const useDashboardStats = () => {
  return useQuery<DashboardStatsDto, Error>({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const response = await dashboardApi.getStats();

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch dashboard stats');
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Get dashboard widgets
 */
export const useDashboardWidgets = () => {
  return useQuery<DashboardWidgetDto[], Error>({
    queryKey: dashboardKeys.widgets(),
    queryFn: async () => {
      const response = await dashboardApi.getWidgets();
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch dashboard widgets');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
