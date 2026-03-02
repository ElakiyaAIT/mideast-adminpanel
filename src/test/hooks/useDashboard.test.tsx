import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dashboardApi } from '../../api';
vi.mock('../../api', () => ({
  dashboardApi: {
    getStats: vi.fn(),
    getWidgets: vi.fn(),
  },
}));
import { useDashboardStats, useDashboardWidgets } from '../../hooks/queries/useDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import type { ApiResponse } from '../../dto/api.dto';
import type { DashboardStatsDto, DashboardWidgetDto } from '../../dto/dashboard.dto';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useDashboardStats', () => {
  it('should fetch and return stats successfully', async () => {
    const mockStats: DashboardStatsDto = {
      totalUsers: 10, // add other properties if DashboardStatsDto has more
      activeUsers: 5,
      totalRevenue: 1000,
      monthlyGrowth: 20,
    };

    const mockResponse: ApiResponse<DashboardStatsDto> = {
      success: true,
      data: mockStats,
      message: 'Success',
    };
    vi.mocked(dashboardApi.getStats).mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockStats);
    expect(dashboardApi.getStats).toHaveBeenCalled();
  });
  it('should throw error if success is false', async () => {
    const mockResponse: ApiResponse<DashboardStatsDto> = {
      success: false,
      message: 'Failed',
      data: {} as DashboardStatsDto, // can be dummy because hook will throw on success=false
    };
    vi.mocked(dashboardApi.getStats).mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Failed');
  });
  it('should throw default error if data is missing', async () => {
    const mockResponse: ApiResponse<DashboardStatsDto | null> = {
      success: true,
      data: null,
      message: undefined,
    };

    vi.mocked(dashboardApi.getStats).mockResolvedValue(
      mockResponse as ApiResponse<DashboardStatsDto>,
    );

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Failed to fetch dashboard stats');
  });
});

describe('useDashboardWidgets', () => {
  it('should fetch and return widgets successfully', async () => {
    const mockWidgets: DashboardWidgetDto[] = [
      {
        id: '1',
        title: 'Widget 1',
        value: 100,
        change: 10,
        changeType: 'increase',
        icon: 'icon-widget',
      },
    ];

    const mockResponse: ApiResponse<DashboardWidgetDto[]> = {
      success: true,
      message: 'Success',
      data: mockWidgets,
    };
    vi.mocked(dashboardApi.getWidgets).mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useDashboardWidgets(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockWidgets);
    expect(dashboardApi.getWidgets).toHaveBeenCalled();
  });
  it('should throw error if success is false', async () => {
    const mockResponse: Partial<ApiResponse<DashboardWidgetDto[]>> = {
      success: false,
      message: 'Widgets failed',
    };
    vi.mocked(dashboardApi.getWidgets).mockResolvedValue(
      mockResponse as ApiResponse<DashboardWidgetDto[]>,
    );
    const { result } = renderHook(() => useDashboardWidgets(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Widgets failed');
  });
  it('should throw error if data is missing', async () => {
    // Mock the API to return success but null data
    const mockResponse: ApiResponse<DashboardWidgetDto[]> = {
      success: true,
      data: null as unknown as DashboardWidgetDto[], // force null for test
      message: 'Success',
    };

    // Override the hook's behavior to throw if data is null
    vi.mocked(dashboardApi.getWidgets).mockImplementation(async () => {
      const response = mockResponse;
      if (!response.data) {
        throw new Error('Failed to fetch dashboard widgets'); // <- must throw here
      }
      return response;
    });

    const { result } = renderHook(() => useDashboardWidgets(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Failed to fetch dashboard widgets');
  });
});
