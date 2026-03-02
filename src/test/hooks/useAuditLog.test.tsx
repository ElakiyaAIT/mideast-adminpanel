import { vi } from 'vitest';
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { auditApi, type ApiResponse } from '../../api';
import { useAuditLogs } from '../../hooks/queries/useAuditLog';
import type { AuditLogDto, AuditLogQueryParams, PaginatedResponseDto } from '../../dto';

// ✅ MOCK exact same path
vi.mock('../../api', () => ({
  auditApi: {
    getAuditLogs: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useAuditLogs', () => {
  it('should fetch audit logs successfully', async () => {
    const mockResponse: ApiResponse<PaginatedResponseDto<AuditLogDto>> = {
      success: true,
      message: 'Fetched successfully',
      data: {
        items: [],
        pagination: { total: 0, totalPages: 0, page: 1, limit: 10 },
      },
      timestamp: new Date().toISOString(),
      path: '/admin/audit-logs',
    };

    vi.mocked(auditApi.getAuditLogs).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuditLogs(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(auditApi.getAuditLogs).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should pass query params correctly', async () => {
    const params: AuditLogQueryParams = { page: 2, limit: 20 };

    const mockResponse: ApiResponse<PaginatedResponseDto<AuditLogDto>> = {
      success: true,
      message: 'Fetched successfully',
      data: {
        items: [],
        pagination: { total: 0, totalPages: 0, page: 2, limit: 20 },
      },
      timestamp: new Date().toISOString(),
      path: '/admin/audit-logs',
    };

    vi.mocked(auditApi.getAuditLogs).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuditLogs(params), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(auditApi.getAuditLogs).toHaveBeenCalledWith(params);
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  it('should handle error state', async () => {
    vi.mocked(auditApi.getAuditLogs).mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useAuditLogs(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
