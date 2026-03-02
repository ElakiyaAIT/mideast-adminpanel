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
  useStaticPages,
  useStaticPage,
  useCreateStaticPage,
  useUpdateStaticPage,
  useDeleteStaticPage,
  useBanners,
  useBanner,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from '../../hooks/queries/useCMS';
import { staticPageApi, bannerApi } from '../../api';
import React from 'react';
import type {
  BannerDto,
  CreateBannerDto,
  CreateStaticPageDto,
  StaticPageDto,
  UpdateBannerDto,
  UpdateStaticPageDto,
  FilterStaticPageDto,
} from '../../dto/cms.dto';
import type { ApiResponse, PaginatedResponse } from '../../dto/api.dto';

const createWrapper = (client?: QueryClient) => {
  const queryClient =
    client ??
    new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
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

    const { result } = renderHook(() => useBanners(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(bannerApi.getBanners).toHaveBeenCalled();
  });

  it('useBanner - enabled false with empty id', () => {
    renderHook(() => useBanner(''), {
      wrapper: createWrapper(),
    });

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

    const { result } = renderHook(() => useBanner('1'), {
      wrapper: createWrapper(),
    });

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
      // Add other BannerDto required fields if needed
    };
    const mockResponse: ApiResponse<BannerDto> = {
      success: true,
      message: 'Created successfully',
      data: mockBanner,
    };
    vi.mocked(bannerApi.createBanner).mockResolvedValue(mockResponse);

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateBanner(), {
      wrapper: createWrapper(queryClient),
    });
    const requestData: CreateBannerDto = {
      title: 'Banner',
      imageUrl: 'http://example.com/banner.jpg',
      position: 'category_top',
      // Add other required fields if needed
    };

    await act(async () => {
      await result.current.mutateAsync(requestData);
    });

    expect(bannerApi.createBanner).toHaveBeenCalledWith(requestData);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['banners'],
    });
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
      // Add other BannerDto required fields if needed
    };
    const mockResponse: ApiResponse<BannerDto> = {
      success: true,
      message: 'Updated successfully',
      data: mockBanner,
    };
    vi.mocked(bannerApi.updateBanner).mockResolvedValue(mockResponse);

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateBanner(), {
      wrapper: createWrapper(queryClient),
    });
    const requestData: UpdateBannerDto = {
      title: 'Updated',
      // Add other fields if required
    };
    await act(async () => {
      await result.current.mutateAsync({
        id: '1',
        data: requestData,
      });
    });

    expect(bannerApi.updateBanner).toHaveBeenCalledWith('1', requestData);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['banners'],
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['banner', '1'],
    });
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

    const { result } = renderHook(() => useDeleteBanner(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(bannerApi.deleteBanner).toHaveBeenCalledWith('1');
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['banners'],
    });
  });

  it('useCreateBanner - error branch with message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(bannerApi.createBanner).mockRejectedValue(new Error('Fail'));

    const { result } = renderHook(() => useCreateBanner(), { wrapper: createWrapper() });

    const requestData: CreateBannerDto = {
      title: 'Test Banner',
      imageUrl: 'http://example.com/banner.jpg',
      position: 'category_top',
    };

    act(() => {
      result.current.mutate(requestData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(consoleSpy).toHaveBeenCalledWith('Fail');
  });

  it('useCreateBanner - error branch without message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error();
    error.message = '';
    vi.mocked(bannerApi.createBanner).mockRejectedValue(error);

    const { result } = renderHook(() => useCreateBanner(), { wrapper: createWrapper() });

    const requestData: CreateBannerDto = {
      title: 'Test Banner',
      imageUrl: 'http://example.com/banner.jpg',
      position: 'category_top',
    };

    act(() => {
      result.current.mutate(requestData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create banner');
  });

  it('useUpdateBanner - error branch with message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(bannerApi.updateBanner).mockRejectedValue(new Error('Fail'));

    const { result } = renderHook(() => useUpdateBanner(), { wrapper: createWrapper() });

    const requestData: { id: string; data: UpdateBannerDto } = {
      id: '1',
      data: { title: 'Updated title' },
    };

    act(() => {
      result.current.mutate(requestData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(consoleSpy).toHaveBeenCalledWith('Fail');
  });

  it('useUpdateBanner - error branch without message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error();
    error.message = '';
    vi.mocked(bannerApi.updateBanner).mockRejectedValue(error);

    const { result } = renderHook(() => useUpdateBanner(), { wrapper: createWrapper() });

    const requestData: { id: string; data: UpdateBannerDto } = {
      id: '1',
      data: { title: 'Updated title' },
    };

    act(() => {
      result.current.mutate(requestData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(consoleSpy).toHaveBeenCalledWith('Failed to update banner');
  });

  it('useDeleteBanner - error branch with message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(bannerApi.deleteBanner).mockRejectedValue(new Error('Fail'));

    const { result } = renderHook(() => useDeleteBanner(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync('1')).rejects.toThrow('Fail');
    expect(consoleSpy).toHaveBeenCalledWith('Fail');
  });

  it('useDeleteBanner - error branch without message', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error();
    error.message = '';
    vi.mocked(bannerApi.deleteBanner).mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteBanner(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync('1')).rejects.toThrow(error);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to delete banner');
  });
});
describe('Static Page Query Hooks', () => {
  it('useStaticPages - success', async () => {
    const mockResponse: PaginatedResponse<StaticPageDto> = {
      items: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
    vi.mocked(staticPageApi.getPages).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useStaticPages(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(staticPageApi.getPages).toHaveBeenCalled();
    });
  });

  it('useStaticPages - with filters', async () => {
    const filters: FilterStaticPageDto = { page: 1, limit: 5, search: 'test' };
    const mockResponse: PaginatedResponse<StaticPageDto> = {
      items: [],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0,
      },
    };
    vi.mocked(staticPageApi.getPages).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useStaticPages(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(staticPageApi.getPages).toHaveBeenCalledWith(filters);
    });
  });

  it('useStaticPage - enabled false with empty slug', () => {
    renderHook(() => useStaticPage(''), {
      wrapper: createWrapper(),
    });

    expect(staticPageApi.getPage).not.toHaveBeenCalled();
  });

  it('useStaticPage - success', async () => {
    const mockResponse: ApiResponse<StaticPageDto> = {
      success: true,
      message: 'Page fetched successfully',
      data: {
        _id: '1',
        title: 'Test Page',
        slug: 'test-slug',
        content: 'Page content',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        isPublished: true,
        isDeleted: false,
      },
    };
    vi.mocked(staticPageApi.getPage).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useStaticPage('test-slug'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(staticPageApi.getPage).toHaveBeenCalledWith('test-slug');
  });
});

describe('Static Page Mutation Hooks', () => {
  it('useCreateStaticPage - success & invalidates pages', async () => {
    const mockPage: StaticPageDto = {
      _id: '1',
      title: 'Page',
      slug: 'page',
      content: 'Page content',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      isPublished: true,
      isDeleted: false,
    };

    const mockResponse: ApiResponse<StaticPageDto> = {
      success: true,
      message: 'Page created successfully',
      data: mockPage,
    };
    vi.mocked(staticPageApi.createPage).mockResolvedValue(mockResponse);

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateStaticPage(), {
      wrapper: createWrapper(queryClient),
    });
    const createData: CreateStaticPageDto = {
      title: 'Page',
      slug: 'page',
      content: 'Page content',
    };

    await act(async () => {
      await result.current.mutateAsync(createData);
    });

    expect(staticPageApi.createPage).toHaveBeenCalledWith(createData);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['static-pages'],
    });
  });

  it('useUpdateStaticPage - success & invalidates queries', async () => {
    const mockPage: StaticPageDto = {
      _id: 'home',
      title: 'Updated',
      slug: 'home',
      content: 'Updated content',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z',
      isDeleted: false,
      isPublished: true,
    };

    const mockResponse: ApiResponse<StaticPageDto> = {
      success: true,
      message: 'Page updated successfully',
      data: mockPage,
    };

    vi.mocked(staticPageApi.updatePage).mockResolvedValue(mockResponse);

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateStaticPage(), {
      wrapper: createWrapper(queryClient),
    });

    const updateData: UpdateStaticPageDto = {
      title: 'Updated',
      content: 'Updated content',
    };

    await act(async () => {
      await result.current.mutateAsync({ slug: 'home', data: updateData });
    });

    expect(staticPageApi.updatePage).toHaveBeenCalledWith('home', updateData);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['static-pages'],
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['static-page', 'home'],
    });
  });

  it('useDeleteStaticPage - success & invalidates pages', async () => {
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Page deleted successfully',
      data: undefined,
    };

    vi.mocked(staticPageApi.deletePage).mockResolvedValue(mockResponse);
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useDeleteStaticPage(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync('home');
    });

    expect(staticPageApi.deletePage).toHaveBeenCalledWith('home');
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['static-pages'],
    });
  });
  describe('Error branches coverage', () => {
    it('useCreateStaticPage - error branch', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(staticPageApi.createPage).mockRejectedValue(new Error('Fail'));

      const { result } = renderHook(() => useCreateStaticPage(), { wrapper: createWrapper() });

      const requestData: CreateStaticPageDto = {
        title: 'Test Page',
        slug: 'test-page',
        content: 'Test content',
      };

      act(() => {
        result.current.mutate(requestData);
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(consoleSpy).toHaveBeenCalledWith('Fail');
    });

    it('useUpdateStaticPage - error branch', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(staticPageApi.updatePage).mockRejectedValue(new Error('Fail'));

      const { result } = renderHook(() => useUpdateStaticPage(), { wrapper: createWrapper() });

      const requestData: { slug: string; data: UpdateStaticPageDto } = {
        slug: 'home',
        data: { title: 'Updated title', content: 'Updated content' },
      };

      act(() => {
        result.current.mutate(requestData);
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(consoleSpy).toHaveBeenCalledWith('Fail');
    });

    it('useDeleteStaticPage - error branch', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(staticPageApi.deletePage).mockRejectedValue(new Error('Fail'));

      const { result } = renderHook(() => useDeleteStaticPage(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.mutateAsync('home')).rejects.toThrow('Fail');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
