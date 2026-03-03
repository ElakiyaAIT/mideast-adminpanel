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
} from '../../hooks/queries/useCMS';
import { staticPageApi } from '../../api';
import React from 'react';
import type {
  StaticPageDto,
  CreateStaticPageDto,
  UpdateStaticPageDto,
  FilterStaticPageDto,
} from '../../dto/cms.dto';
import type { ApiResponse, PaginatedResponse } from '../../dto/api.dto';

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

describe('Static Page Query Hooks', () => {
  it('useStaticPages - success', async () => {
    const mockResponse: PaginatedResponse<StaticPageDto> = {
      items: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
    vi.mocked(staticPageApi.getPages).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useStaticPages(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(staticPageApi.getPages).toHaveBeenCalled();
  });

  it('useStaticPages - with filters', async () => {
    const filters: FilterStaticPageDto = { page: 1, limit: 5, search: 'test' };
    const mockResponse: PaginatedResponse<StaticPageDto> = {
      items: [],
      pagination: { page: 1, limit: 5, total: 0, totalPages: 0 },
    };
    vi.mocked(staticPageApi.getPages).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useStaticPages(filters), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(staticPageApi.getPages).toHaveBeenCalledWith(filters);
  });

  it('useStaticPage - enabled false with empty slug', () => {
    renderHook(() => useStaticPage(''), { wrapper: createWrapper() });
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

    const { result } = renderHook(() => useStaticPage('test-slug'), { wrapper: createWrapper() });
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

    await act(async () => await result.current.mutateAsync(createData));

    expect(staticPageApi.createPage).toHaveBeenCalledWith(createData);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['static-pages'] });
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
    const updateData: UpdateStaticPageDto = { title: 'Updated', content: 'Updated content' };

    await act(async () => await result.current.mutateAsync({ slug: 'home', data: updateData }));

    expect(staticPageApi.updatePage).toHaveBeenCalledWith('home', updateData);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['static-pages'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['static-page', 'home'] });
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
    await act(async () => await result.current.mutateAsync('home'));

    expect(staticPageApi.deletePage).toHaveBeenCalledWith('home');
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['static-pages'] });
  });

  // Error branches
  it('useCreateStaticPage - error branch', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(staticPageApi.createPage).mockRejectedValue(new Error('Fail'));

    const { result } = renderHook(() => useCreateStaticPage(), { wrapper: createWrapper() });
    act(() => result.current.mutate({ title: 'Test Page', slug: 'test', content: 'Test content' }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(consoleSpy).toHaveBeenCalledWith('Fail');
  });

  it('useUpdateStaticPage - error branch', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(staticPageApi.updatePage).mockRejectedValue(new Error('Fail'));

    const { result } = renderHook(() => useUpdateStaticPage(), { wrapper: createWrapper() });
    act(() =>
      result.current.mutate({
        slug: 'home',
        data: { title: 'Updated', content: 'Updated content' },
      }),
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(consoleSpy).toHaveBeenCalledWith('Fail');
  });

  it('useDeleteStaticPage - error branch', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(staticPageApi.deletePage).mockRejectedValue(new Error('Fail'));

    const { result } = renderHook(() => useDeleteStaticPage(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync('home')).rejects.toThrow('Fail');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
