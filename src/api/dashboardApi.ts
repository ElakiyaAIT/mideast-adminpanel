import axiosInstance from './axiosInstance';
import type { DashboardStatsDto, DashboardWidgetDto } from '../dto';
import type { ApiResponse } from '../dto';

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStatsDto>> => {
    const response = await axiosInstance.get<ApiResponse<DashboardStatsDto>>('/dashboard/stats');
    return response.data;
  },

  getWidgets: async (): Promise<ApiResponse<DashboardWidgetDto[]>> => {
    const response =
      await axiosInstance.get<ApiResponse<DashboardWidgetDto[]>>('/dashboard/widgets');
    return response.data;
  },
};
