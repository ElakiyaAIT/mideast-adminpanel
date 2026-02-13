import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { notificationApi } from '../../api';
import type {
  NotificationDto,
  SendNotificationDto,
  NotificationQueryParams,
  PaginatedResponseDto,
} from '../../dto';

/**
 * Hook to fetch notifications with filters
 */
export const useNotifications = (
  params?: NotificationQueryParams,
): UseQueryResult<PaginatedResponseDto<NotificationDto>> => {
  return useQuery<PaginatedResponseDto<NotificationDto>>({
    queryKey: ['notifications', params],
    queryFn: () => notificationApi.getNotifications(params),
  });
};

/**
 * Hook to send a notification
 */
export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendNotificationDto) => notificationApi.sendNotification(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: Error) => {
      console.error('Failed to send notification:', error);
    },
  });
};
