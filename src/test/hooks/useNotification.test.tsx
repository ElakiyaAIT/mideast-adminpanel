import { vi } from 'vitest';
import React from 'react';

// ============================================================
// MOCK API
// ============================================================

vi.mock('../../api', () => ({
  notificationApi: {
    getNotifications: vi.fn(),
    sendNotification: vi.fn(),
  },
}));

// ============================================================
// IMPORTS
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { notificationApi, type ApiResponse } from '../../api';
import { useNotifications, useSendNotification } from '../../hooks/queries/useNotification';
import type { NotificationDto, PaginatedResponseDto, SendNotificationDto } from '../../dto';

// ============================================================
// WRAPPER
// ============================================================

const createWrapper = (queryClient?: QueryClient) => {
  const client =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================================
// QUERY TESTS
// ============================================================

describe('useNotifications', () => {
  const mockNotifications: NotificationDto[] = [
    {
      _id: '1',
      title: 'Notification 1',
      message: 'Message 1',
      createdAt: new Date().toISOString(),
      userId: '1',
      type: 'email',
      status: 'sent',
      isRead: false,
      updatedAt: new Date().toISOString(),
    },
    // { _id: '2', title: 'Notification 2', message: 'Message 2', createdAt: new Date().toISOString() },
  ];

  const mockPaginatedResponse: PaginatedResponseDto<NotificationDto> = {
    items: mockNotifications,
    pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
  };

  const mockApiResponse: ApiResponse<PaginatedResponseDto<NotificationDto>> = {
    data: mockPaginatedResponse,
    success: true,
    message: 'Fetched successfully',
  };
  it('should fetch notifications successfully', async () => {
    vi.mocked(notificationApi.getNotifications).mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(notificationApi.getNotifications).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockApiResponse);
  });

  it('should pass params to API', async () => {
    const params = { page: 1, limit: 10 };
    vi.mocked(notificationApi.getNotifications).mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useNotifications(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(notificationApi.getNotifications).toHaveBeenCalledWith(params);
  });
});

// ============================================================
// MUTATION TESTS
// ============================================================

describe('useSendNotification', () => {
  it('should send notification successfully and invalidate cache', async () => {
    const mockPayload: SendNotificationDto = {
      title: 'Test',
      message: 'Hello',
      type: 'email',
      subject: 'Test Subject',
    };

    vi.mocked(notificationApi.sendNotification).mockResolvedValue({
      data: {
        _id: '1',
        title: mockPayload.title,
        message: mockPayload.message,
        subject: mockPayload.subject ?? 'Test Subject', // if subject is required
        type: mockPayload.type ?? 'INFO', // use a default NotificationType
        userId: mockPayload.userId ?? 'user-1', // optional, if needed
        recipientIds: mockPayload.recipientIds ?? ['user-1'], // optional
        data: mockPayload.data ?? {}, // optional
        status: 'sent', // new required field
        isRead: false, // new required field
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), // new required field
      } as NotificationDto,
      success: true,
      message: 'Sent successfully',
    });

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useSendNotification(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(mockPayload);
    });

    expect(notificationApi.sendNotification).toHaveBeenCalledWith(mockPayload);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['notifications'],
    });
  });
});
