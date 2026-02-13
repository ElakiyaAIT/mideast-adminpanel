import axiosInstance from './axiosInstance';
import type {
  PaymentDto,
  RefundPaymentDto,
  PaymentQueryParams,
  PayoutDto,
  ApprovePayoutDto,
  HoldPayoutDto,
  PayoutQueryParams,
  PaginatedResponseDto,
} from '../dto';
import type { ApiResponse } from '../dto';

// ============================================
// PAYMENT API
// ============================================

export const paymentApi = {
  /**
   * Get all payments with filters
   */
  getPayments: async (
    params: PaymentQueryParams = {},
  ): Promise<PaginatedResponseDto<PaymentDto>> => {
    const response = await axiosInstance.get<PaginatedResponseDto<PaymentDto>>('/admin/payments', {
      params,
    });
    return response.data;
  },

  /**
   * Get a single payment by ID
   */
  getPayment: async (id: string): Promise<ApiResponse<PaymentDto>> => {
    const response = await axiosInstance.get<ApiResponse<PaymentDto>>(`/admin/payments/${id}`);
    return response.data;
  },

  /**
   * Refund a payment
   */
  refundPayment: async (id: string, data: RefundPaymentDto): Promise<ApiResponse<PaymentDto>> => {
    const response = await axiosInstance.post<ApiResponse<PaymentDto>>(
      `/admin/payments/${id}/refund`,
      data,
    );
    return response.data;
  },
};

// ============================================
// PAYOUT API
// ============================================

export const payoutApi = {
  /**
   * Get all payouts with filters
   */
  getPayouts: async (params: PayoutQueryParams = {}): Promise<PaginatedResponseDto<PayoutDto>> => {
    const response = await axiosInstance.get<PaginatedResponseDto<PayoutDto>>('/admin/payouts', {
      params,
    });
    return response.data;
  },

  /**
   * Get a single payout by ID
   */
  getPayout: async (id: string): Promise<ApiResponse<PayoutDto>> => {
    const response = await axiosInstance.get<ApiResponse<PayoutDto>>(`/admin/payouts/${id}`);
    return response.data;
  },

  /**
   * Approve a payout
   */
  approvePayout: async (id: string, data: ApprovePayoutDto): Promise<ApiResponse<PayoutDto>> => {
    const response = await axiosInstance.post<ApiResponse<PayoutDto>>(
      `/admin/payouts/${id}/approve`,
      data,
    );
    return response.data;
  },

  /**
   * Hold a payout
   */
  holdPayout: async (id: string, data: HoldPayoutDto): Promise<ApiResponse<PayoutDto>> => {
    const response = await axiosInstance.post<ApiResponse<PayoutDto>>(
      `/admin/payouts/${id}/hold`,
      data,
    );
    return response.data;
  },
};
