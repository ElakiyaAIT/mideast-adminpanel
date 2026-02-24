import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { auditApi, type ApiResponse } from '../../api';
import type { AuditLogDto, AuditLogQueryParams, PaginatedResponseDto } from '../../dto';

/**
 * Hook to fetch audit logs with filters
 */
export const useAuditLogs = (
  params?: AuditLogQueryParams,
): UseQueryResult<ApiResponse<PaginatedResponseDto<AuditLogDto>>> => {
  return useQuery<ApiResponse<PaginatedResponseDto<AuditLogDto>>>({
    queryKey: ['audit-logs', params],
    queryFn: () => auditApi.getAuditLogs(params),
    refetchOnMount: true,
    staleTime: 0,
  });
};
