import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { paymentApi, payoutApi } from '../../api';
import type {
  PaymentDto,
  RefundPaymentDto,
  PaymentQueryParams,
  PayoutDto,
  ApprovePayoutDto,
  HoldPayoutDto,
  PayoutQueryParams,
  PaginatedResponseDto,
  ApiResponse,
} from '../../dto';

// ============================================================
// PAYMENTS
// ============================================================

/**
 * Hook to fetch payments with filters
 */
export const usePayments = (
  params?: PaymentQueryParams,
): UseQueryResult<PaginatedResponseDto<PaymentDto>> => {
  return useQuery<PaginatedResponseDto<PaymentDto>>({
    queryKey: ['payments', params],
    queryFn: () => paymentApi.getPayments(params),
  });
};

/**
 * Hook to fetch a single payment by ID
 */
export const usePayment = (id: string) => {
  return useQuery<ApiResponse<PaymentDto>>({
    queryKey: ['payment', id],
    queryFn: () => paymentApi.getPayment(id),
    enabled: !!id,
  });
};

/**
 * Hook to refund a payment
 */
export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RefundPaymentDto }) =>
      paymentApi.refundPayment(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['payments'] });
      void queryClient.invalidateQueries({ queryKey: ['payment', variables.id] });
    },
    onError: (error: Error) => {
      console.error('Failed to refund payment:', error);
    },
  });
};

// ============================================================
// PAYOUTS
// ============================================================

/**
 * Hook to fetch payouts with filters
 */
export const usePayouts = (
  params?: PayoutQueryParams,
): UseQueryResult<PaginatedResponseDto<PayoutDto>> => {
  return useQuery<PaginatedResponseDto<PayoutDto>>({
    queryKey: ['payouts', params],
    queryFn: () => payoutApi.getPayouts(params),
  });
};

/**
 * Hook to fetch a single payout by ID
 */
export const usePayout = (id: string) => {
  return useQuery<ApiResponse<PayoutDto>>({
    queryKey: ['payout', id],
    queryFn: () => payoutApi.getPayout(id),
    enabled: !!id,
  });
};

/**
 * Hook to approve a payout
 */
export const useApprovePayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApprovePayoutDto }) =>
      payoutApi.approvePayout(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['payouts'] });
      void queryClient.invalidateQueries({ queryKey: ['payout', variables.id] });
    },
    onError: (error: Error) => {
      console.error('Failed to approve payout:', error);
    },
  });
};

/**
 * Hook to hold a payout
 */
export const useHoldPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: HoldPayoutDto }) =>
      payoutApi.holdPayout(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['payouts'] });
      void queryClient.invalidateQueries({ queryKey: ['payout', variables.id] });
      console.log('Payout held successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to hold payout:', error);
    },
  });
};
