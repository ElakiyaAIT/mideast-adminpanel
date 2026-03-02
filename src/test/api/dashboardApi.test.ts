import { describe, it, expect, vi, beforeEach } from 'vitest';
import axiosInstance from '../../api/axiosInstance';
import { dashboardApi } from '../../api/dashboardApi';
import type { DashboardStatsDto, DashboardWidgetDto } from '../../dto/dashboard.dto';
import type { ApiResponse } from '../../dto/api.dto';

vi.mock('../../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedAxios = vi.mocked(axiosInstance, true);

const mockDashboardStats: DashboardStatsDto = {
  totalUsers: 100,
  activeUsers: 80,
  totalRevenue: 50000,
  monthlyGrowth: 10.5,
};

const mockDashboardWidgets: DashboardWidgetDto[] = [
  {
    id: '1',
    title: 'Total Users',
    value: 100,
    change: 5.2,
    changeType: 'increase',
    icon: 'users',
  },
  {
    id: '2',
    title: 'Revenue',
    value: 50000,
    change: -2.1,
    changeType: 'decrease',
    icon: 'dollar',
  },
];

const createApiResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  message: 'Success',
  data,
});

describe('Dashboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch dashboard stats', async () => {
    const mockResponse = createApiResponse(mockDashboardStats);

    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await dashboardApi.getStats();

    expect(mockedAxios.get).toHaveBeenCalledWith('/dashboard/stats');
    expect(result).toEqual(mockResponse);
  });

  it('should fetch dashboard widgets', async () => {
    const mockResponse = createApiResponse(mockDashboardWidgets);

    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await dashboardApi.getWidgets();

    expect(mockedAxios.get).toHaveBeenCalledWith('/dashboard/widgets');
    expect(result).toEqual(mockResponse);
  });

  it('should handle error when fetching stats', async () => {
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValue(error);

    await expect(dashboardApi.getStats()).rejects.toThrow('Network error');
  });

  it('should handle error when fetching widgets', async () => {
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValue(error);

    await expect(dashboardApi.getWidgets()).rejects.toThrow('Network error');
  });
});
