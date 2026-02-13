import axiosInstance from './axiosInstance';
import type {
  SalesReportDto,
  SalesReportQueryParams,
  AuctionReportDto,
  AuctionReportQueryParams,
  UserActivityReportDto,
  UserActivityReportQueryParams,
} from '../dto';
import type { ApiResponse } from '../dto';

export const reportsApi = {
  /**
   * Get sales report
   */
  getSalesReport: async (params: SalesReportQueryParams): Promise<ApiResponse<SalesReportDto>> => {
    const response = await axiosInstance.get<ApiResponse<SalesReportDto>>('/admin/reports/sales', {
      params,
    });
    return response.data;
  },

  /**
   * Get auction report
   */
  getAuctionReport: async (
    params: AuctionReportQueryParams,
  ): Promise<ApiResponse<AuctionReportDto>> => {
    const response = await axiosInstance.get<ApiResponse<AuctionReportDto>>(
      '/admin/reports/auctions',
      { params },
    );
    return response.data;
  },

  /**
   * Get user activity report
   */
  getUserActivityReport: async (
    params: UserActivityReportQueryParams,
  ): Promise<ApiResponse<UserActivityReportDto>> => {
    const response = await axiosInstance.get<ApiResponse<UserActivityReportDto>>(
      '/admin/reports/user-activity',
      { params },
    );
    return response.data;
  },
};
