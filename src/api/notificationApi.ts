import axiosInstance from './axiosInstance';
import type {
  NotificationDto,
  SendNotificationDto,
  NotificationQueryParams,
  PaginatedResponseDto,
} from '../dto';
import type { ApiResponse } from '../dto';

export const notificationApi = {
  /**
   * Get all notifications with filters
   */
  getNotifications: async (
    params: NotificationQueryParams = {},
  ): Promise<ApiResponse<PaginatedResponseDto<NotificationDto>>> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponseDto<NotificationDto>>>(
      '/admin/notifications',
      { params },
    );
    return response.data;
  },

  /**
   * Send a notification
   */
  sendNotification: async (data: SendNotificationDto): Promise<ApiResponse<NotificationDto>> => {
    const response = await axiosInstance.post<ApiResponse<NotificationDto>>(
      '/admin/notifications/send',
      data,
    );
    return response.data;
  },
};
