import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { auditApi } from '../../api';
import type { AuditLogDto, AuditLogQueryParams, PaginatedResponseDto } from '../../dto';

/**
 * Hook to fetch audit logs with filters
 */
export const useAuditLogs = (
  params?: AuditLogQueryParams,
): UseQueryResult<PaginatedResponseDto<AuditLogDto>> => {
  return useQuery<PaginatedResponseDto<AuditLogDto>>({
    queryKey: ['audit-logs', params],
    queryFn: () => auditApi.getAuditLogs(params),
  });
};
