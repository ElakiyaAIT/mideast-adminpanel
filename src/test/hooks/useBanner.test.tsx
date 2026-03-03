import { vi } from 'vitest';
vi.mock('../../api', () => ({
  bannerApi: {
    getBanners: vi.fn(),
    getBanner: vi.fn(),
    createBanner: vi.fn(),
    updateBanner: vi.fn(),
    deleteBanner: vi.fn(),
  },
  staticPageApi: {
    getPages: vi.fn(),
    getPage: vi.fn(),
    createPage: vi.fn(),
    updatePage: vi.fn(),
    deletePage: vi.fn(),
  },
}));

import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useBanners,
  useBanner,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from '../../hooks/queries/useCMS';
import { bannerApi } from '../../api';
import React from 'react';
import type { BannerDto, CreateBannerDto, UpdateBannerDto } from '../../dto/cms.dto';
import type { ApiResponse } from '../../dto/api.dto';

const createWrapper = (client?: QueryClient) => {
  const queryClient =
    client ??
    new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Banner Query Hooks', () => {
  it('useBanners - success', async () => {
    const mockResponse: ApiResponse<BannerDto[]> = { success: true, message: 'ok', data: [] };
    vi.mocked(bannerApi.getBanners).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useBanners(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(bannerApi.getBanners).toHaveBeenCalled();
  });

  it('useBanner - enabled false with empty id', () => {
    renderHook(() => useBanner(''), { wrapper: createWrapper() });
    expect(bannerApi.getBanner).not.toHaveBeenCalled();
  });

  it('useBanner - success', async () => {
    const mockBanner: BannerDto = {
      _id: '1',
      title: 'Test Banner',
      isDeleted: false,
      imageUrl: 'http://example.com/banner.jpg',
      position: 'category_top',
      status: 'active',
      sortOrder: 1,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const mockResponse: ApiResponse<BannerDto> = {
      success: true,
      message: 'Fetched successfully',
      data: mockBanner,
    };
    vi.mocked(bannerApi.getBanner).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useBanner('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(bannerApi.getBanner).toHaveBeenCalledWith('1');
  });
});

describe('Banner Mutation Hooks', () => {
  it('useCreateBanner - success & invalidates', async () => {
    const mockBanner: BannerDto = {
      _id: '1',
      title: 'Banner',
      isDeleted: false,
      imageUrl: 'http://example.com/banner.jpg',
      position: 'category_top',
      status: 'active',
      sortOrder: 1,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const mockResponse: ApiResponse<BannerDto> = {
      success: true,
      message: 'Created successfully',
      data: mockBanner,
    };
    vi.mocked(bannerApi.createBanner).mockResolvedValue(mockResponse);

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateBanner(), { wrapper: createWrapper(queryClient) });
    const requestData: CreateBannerDto = {
      title: 'Banner',
      imageUrl: 'http://example.com/banner.jpg',
      position: 'category_top',
    };

    await act(async () => await result.current.mutateAsync(requestData));

    expect(bannerApi.createBanner).toHaveBeenCalledWith(requestData);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['banners'] });
  });

  it('useUpdateBanner - success & invalidates', async () => {
    const mockBanner: BannerDto = {
      _id: '1',
      title: 'Banner',
      isDeleted: false,
      imageUrl: 'http://example.com/banner.jpg',
      position: 'category_top',
      status: 'active',
      sortOrder: 1,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const mockResponse: ApiResponse<BannerDto> = {
      success: true,
      message: 'Updated successfully',
      data: mockBanner,
    };
    vi.mocked(bannerApi.updateBanner).mockResolvedValue(mockResponse);

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateBanner(), { wrapper: createWrapper(queryClient) });
    const requestData: UpdateBannerDto = { title: 'Updated' };

    await act(async () => await result.current.mutateAsync({ id: '1', data: requestData }));

    expect(bannerApi.updateBanner).toHaveBeenCalledWith('1', requestData);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['banners'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['banner', '1'] });
  });

  it('useDeleteBanner - success & invalidates', async () => {
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Banner deleted successfully',
      data: undefined,
    };
    vi.mocked(bannerApi.deleteBanner).mockResolvedValue(mockResponse);

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useDeleteBanner(), { wrapper: createWrapper(queryClient) });
    await act(async () => await result.current.mutateAsync('1'));

    expect(bannerApi.deleteBanner).toHaveBeenCalledWith('1');
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['banners'] });
  });

  // Error branches
  it('useCreateBanner - error with message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(bannerApi.createBanner).mockRejectedValue(new Error('Fail'));

    const { result } = renderHook(() => useCreateBanner(), { wrapper: createWrapper() });
    act(() => result.current.mutate({ title: 'Test', imageUrl: '', position: 'category_top' }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(consoleSpy).toHaveBeenCalledWith('Fail');
  });

  it('useCreateBanner - error without message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error();
    error.message = '';
    vi.mocked(bannerApi.createBanner).mockRejectedValue(error);

    const { result } = renderHook(() => useCreateBanner(), { wrapper: createWrapper() });
    act(() => result.current.mutate({ title: 'Test', imageUrl: '', position: 'category_top' }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create banner');
  });

  it('useUpdateBanner - error with message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(bannerApi.updateBanner).mockRejectedValue(new Error('Fail'));

    const { result } = renderHook(() => useUpdateBanner(), { wrapper: createWrapper() });
    act(() => result.current.mutate({ id: '1', data: { title: 'Updated' } }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(consoleSpy).toHaveBeenCalledWith('Fail');
  });

  it('useUpdateBanner - error without message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error();
    error.message = '';
    vi.mocked(bannerApi.updateBanner).mockRejectedValue(error);

    const { result } = renderHook(() => useUpdateBanner(), { wrapper: createWrapper() });
    act(() => result.current.mutate({ id: '1', data: { title: 'Updated' } }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(consoleSpy).toHaveBeenCalledWith('Failed to update banner');
  });

  it('useDeleteBanner - error with message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(bannerApi.deleteBanner).mockRejectedValue(new Error('Fail'));

    const { result } = renderHook(() => useDeleteBanner(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync('1')).rejects.toThrow('Fail');
    expect(consoleSpy).toHaveBeenCalledWith('Fail');
  });

  it('useDeleteBanner - error without message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error();
    error.message = '';
    vi.mocked(bannerApi.deleteBanner).mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteBanner(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync('1')).rejects.toThrow(error);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to delete banner');
  });
});
