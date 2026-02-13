import axiosInstance from './axiosInstance';
import type {
  OrderDto,
  UpdateOrderStatusDto,
  CancelOrderDto,
  OrderQueryParams,
  PaginatedResponseDto,
} from '../dto';
import type { ApiResponse } from '../dto';

export const orderApi = {
  /**
   * Get all orders with filters
   */
  getOrders: async (params: OrderQueryParams = {}): Promise<PaginatedResponseDto<OrderDto>> => {
    const response = await axiosInstance.get<PaginatedResponseDto<OrderDto>>('/admin/orders', {
      params,
    });
    return response.data;
  },

  /**
   * Get a single order by ID
   */
  getOrder: async (id: string): Promise<ApiResponse<OrderDto>> => {
    const response = await axiosInstance.get<ApiResponse<OrderDto>>(`/admin/orders/${id}`);
    return response.data;
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (
    id: string,
    data: UpdateOrderStatusDto,
  ): Promise<ApiResponse<OrderDto>> => {
    const response = await axiosInstance.patch<ApiResponse<OrderDto>>(
      `/admin/orders/${id}/status`,
      data,
    );
    return response.data;
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (id: string, data: CancelOrderDto): Promise<ApiResponse<OrderDto>> => {
    const response = await axiosInstance.post<ApiResponse<OrderDto>>(
      `/admin/orders/${id}/cancel`,
      data,
    );
    return response.data;
  },
};
