import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../../api';
import type {
  SalesReportDto,
  SalesReportQueryParams,
  AuctionReportDto,
  AuctionReportQueryParams,
  UserActivityReportDto,
  UserActivityReportQueryParams,
  ApiResponse,
} from '../../dto';

/**
 * Hook to fetch sales report
 */
export const useSalesReport = (params: SalesReportQueryParams) => {
  return useQuery<ApiResponse<SalesReportDto>>({
    queryKey: ['reports', 'sales', params],
    queryFn: () => reportsApi.getSalesReport(params),
    enabled: !!params.startDate && !!params.endDate,
  });
};

/**
 * Hook to fetch auction performance report
 */
export const useAuctionReport = (params: AuctionReportQueryParams) => {
  return useQuery<ApiResponse<AuctionReportDto>>({
    queryKey: ['reports', 'auction', params],
    queryFn: () => reportsApi.getAuctionReport(params),
    enabled: !!params.startDate && !!params.endDate,
  });
};

/**
 * Hook to fetch user activity report
 */
export const useUserActivityReport = (params: UserActivityReportQueryParams) => {
  return useQuery<ApiResponse<UserActivityReportDto>>({
    queryKey: ['reports', 'user-activity', params],
    queryFn: () => reportsApi.getUserActivityReport(params),
    enabled: !!params.startDate && !!params.endDate,
  });
};
