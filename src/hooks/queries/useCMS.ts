import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { bannerApi, staticPageApi } from '../../api';
import type {
  BannerDto,
  CreateBannerDto,
  UpdateBannerDto,
  StaticPageDto,
  CreateStaticPageDto,
  UpdateStaticPageDto,
  ApiResponse,
  FilterStaticPageDto,
  PaginatedResponseDto,
} from '../../dto';

// ============================================================
// BANNERS
// ============================================================

/**
 * Hook to fetch all banners
 */
export const useBanners = (): UseQueryResult<ApiResponse<BannerDto[]>> => {
  return useQuery<ApiResponse<BannerDto[]>>({
    queryKey: ['banners'],
    queryFn: () => bannerApi.getBanners(),
  });
};

/**
 * Hook to fetch a single banner by ID
 */
export const useBanner = (id: string) => {
  return useQuery<ApiResponse<BannerDto>>({
    queryKey: ['banner', id],
    queryFn: () => bannerApi.getBanner(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new banner
 */
export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBannerDto) => bannerApi.createBanner(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['banners'] });
      // console.log('Banner created successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to create banner');
    },
  });
};

/**
 * Hook to update a banner
 */
export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBannerDto }) =>
      bannerApi.updateBanner(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['banners'] });
      void queryClient.invalidateQueries({ queryKey: ['banner', variables.id] });
      // console.log('Banner updated successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to update banner');
    },
  });
};

/**
 * Hook to delete a banner
 */
export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bannerApi.deleteBanner(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['banners'] });
      // console.log('Banner deleted successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to delete banner');
    },
  });
};

// ============================================================
// STATIC PAGES
// ============================================================

/**
 * Hook to fetch all static pages
 */
export const useStaticPages = (filters?: FilterStaticPageDto) => {
  return useQuery<PaginatedResponseDto<StaticPageDto>>({
    queryKey: ['static-pages', filters],
    queryFn: async () => {
      return staticPageApi.getPages(filters);
    },
  });
};

/**
 * Hook to fetch a single static page by slug
 */
export const useStaticPage = (slug: string) => {
  return useQuery<ApiResponse<StaticPageDto>>({
    queryKey: ['static-page', slug],
    queryFn: () => staticPageApi.getPage(slug),
    enabled: !!slug,
  });
};

/**
 * Hook to create a new static page
 */
export const useCreateStaticPage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaticPageDto) => staticPageApi.createPage(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['static-pages'] });
      // console.log('Page created successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to create page');
    },
  });
};

/**
 * Hook to update a static page
 */
export const useUpdateStaticPage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateStaticPageDto }) =>
      staticPageApi.updatePage(slug, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['static-pages'] });
      void queryClient.invalidateQueries({ queryKey: ['static-page', variables.slug] });
      // console.log('Page updated successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to update page');
    },
  });
};

/**
 * Hook to delete a static page
 */
export const useDeleteStaticPage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => staticPageApi.deletePage(slug),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['static-pages'] });
      // console.log('Page deleted successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to delete page');
    },
  });
};
