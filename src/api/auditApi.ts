import axiosInstance from './axiosInstance';
import type { AuditLogDto, AuditLogQueryParams, PaginatedResponseDto } from '../dto';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}
export const auditApi = {
  /**
   * Get all audit logs with filters
   */
  getAuditLogs: async (
    params: AuditLogQueryParams = {},
  ): Promise<ApiResponse<PaginatedResponseDto<AuditLogDto>>> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponseDto<AuditLogDto>>>(
      '/admin/audit-logs',
      { params },
    );
    return response.data;
  },
};
