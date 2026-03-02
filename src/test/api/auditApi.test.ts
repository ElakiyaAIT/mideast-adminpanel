import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  type AuditLogDto,
  type PaginatedResponseDto,
  type AuditLogQueryParams,
  AuditActionType,
} from '../../dto';
import { auditApi, type ApiResponse } from '../../api/auditApi';
import axiosInstance from '../../api/axiosInstance';

// Mock axiosInstance
vi.mock('../../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('auditApi', () => {
  const mockLogs: AuditLogDto[] = [
    {
      _id: '1',
      adminId: { _id: 'a1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      action: AuditActionType.CREATE,
      targetType: 'User',
      createdAt: '2026-02-27T12:00:00Z',
      description: 'Created a new user',
    },
    {
      _id: '2',
      adminId: { _id: 'a2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      action: AuditActionType.DELETE,
      targetType: 'Order',
      createdAt: '2026-02-27T13:00:00Z',
      description: 'Deleted an order',
    },
  ];

  const mockResponse: ApiResponse<PaginatedResponseDto<AuditLogDto>> = {
    success: true,
    message: 'Fetched successfully',
    data: {
      items: mockLogs,
      pagination: {
        page: 1,
        limit: 10,
        total: mockLogs.length,
        totalPages: Math.ceil(mockLogs.length / 10),
      },
    },
    timestamp: '2026-02-27T14:00:00Z',
    path: '/admin/audit-logs',
  };

  beforeEach(() => {
    // Reset the mock function directly
    (axiosInstance.get as ReturnType<typeof vi.fn>).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch audit logs successfully with query params', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockResponse });

    const params: AuditLogQueryParams = { adminId: 'a1', action: AuditActionType.CREATE };
    const result = await auditApi.getAuditLogs(params);

    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/audit-logs', { params });
    expect(result).toEqual(mockResponse);
    expect(result.data.items[0].action).toBe(AuditActionType.CREATE);
  });

  it('should fetch audit logs successfully without params', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockResponse });

    const result = await auditApi.getAuditLogs();

    expect(axiosInstance.get).toHaveBeenCalledWith('/admin/audit-logs', { params: {} });
    expect(result.success).toBe(true);
    expect(result.data.pagination.total).toBe(mockLogs.length);
    expect(result.data.pagination.totalPages).toBe(Math.ceil(mockLogs.length / 10));
  });

  it('should throw an error when axios fails', async () => {
    const error = new Error('Network Error');
    vi.mocked(axiosInstance.get).mockRejectedValue(error);

    await expect(auditApi.getAuditLogs()).rejects.toThrow('Network Error');
  });
});
