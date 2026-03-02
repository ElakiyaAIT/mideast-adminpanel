import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
  NotificationDto,
  NotificationQueryParams,
  SendNotificationDto,
} from '../../dto/notification.dto';
import { axiosInstance, notificationApi, type ApiResponse } from '../../api';
import type { PaginatedResponseDto } from '../../dto';

/**
 * Mock axiosInstance
 */
vi.mock('../../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const createNotification = (overrides: Partial<NotificationDto> = {}): NotificationDto => ({
  _id: '1',
  title: 'Test Notification',
  message: 'Test Message',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: '',
  type: 'email',
  isRead: false,
  status: 'sent',
  ...overrides,
});

const createPaginatedResponse = (
  items: NotificationDto[],
): PaginatedResponseDto<NotificationDto> => ({
  items,
  pagination: {
    total: items.length,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
});

const createApiResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  message: '',
  data,
});
describe('notificationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should fetch notifications with params', async () => {
      const params: NotificationQueryParams = { page: 1, limit: 10 };

      const mockResponse = createApiResponse(createPaginatedResponse([createNotification()]));

      vi.mocked(axiosInstance.get).mockResolvedValue({
        data: mockResponse,
      });

      const result = await notificationApi.getNotifications(params);

      expect(axiosInstance.get).toHaveBeenCalledWith('/admin/notifications', { params });

      expect(result).toEqual(mockResponse);
    });

    it('should fetch notifications without params', async () => {
      const mockResponse = createApiResponse(createPaginatedResponse([]));

      vi.mocked(axiosInstance.get).mockResolvedValue({
        data: mockResponse,
      });

      const result = await notificationApi.getNotifications();

      expect(axiosInstance.get).toHaveBeenCalledWith('/admin/notifications', { params: {} });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('sendNotification', () => {
    it('should send notification successfully', async () => {
      const payload: SendNotificationDto = {
        title: 'New Notification',
        message: 'Hello Users',
        type: 'email',
        subject: 'Notification',
      };

      const mockResponse = createApiResponse(
        createNotification({
          _id: '123',
          title: payload.title,
          message: payload.message,
        }),
      );

      vi.mocked(axiosInstance.post).mockResolvedValue({
        data: mockResponse,
      });

      const result = await notificationApi.sendNotification(payload);

      expect(axiosInstance.post).toHaveBeenCalledWith('/admin/notifications/send', payload);

      expect(result).toEqual(mockResponse);
    });
  });
});
