import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { orderApi } from '../../api';
import type {
  OrderDto,
  UpdateOrderStatusDto,
  CancelOrderDto,
  OrderQueryParams,
  PaginatedResponseDto,
  ApiResponse,
} from '../../dto';

/**
 * Hook to fetch orders with filters
 */
export const useOrders = (
  params?: OrderQueryParams,
): UseQueryResult<PaginatedResponseDto<OrderDto>> => {
  return useQuery<PaginatedResponseDto<OrderDto>>({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrders(params),
  });
};

/**
 * Hook to fetch a single order by ID
 */
export const useOrder = (id: string) => {
  return useQuery<ApiResponse<OrderDto>>({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOrder(id),
    enabled: !!id,
  });
};

/**
 * Hook to update order status
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusDto }) =>
      orderApi.updateOrderStatus(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
    onError: (error: Error) => {
      console.error('Failed to update order status:', error);
    },
  });
};

/**
 * Hook to cancel an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CancelOrderDto }) =>
      orderApi.cancelOrder(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
    onError: (error: Error) => {
      console.error('Failed to cancel order:', error);
    },
  });
};
