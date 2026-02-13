import axiosInstance from './axiosInstance';
import type { AuditLogDto, AuditLogQueryParams, PaginatedResponseDto } from '../dto';

export const auditApi = {
  /**
   * Get all audit logs with filters
   */
  getAuditLogs: async (
    params: AuditLogQueryParams = {},
  ): Promise<PaginatedResponseDto<AuditLogDto>> => {
    const response = await axiosInstance.get('/admin/audit-logs', { params });
    return response.data;
  },
};
