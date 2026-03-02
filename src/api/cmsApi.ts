import axiosInstance from './axiosInstance';
import type {
  BannerDto,
  CreateBannerDto,
  UpdateBannerDto,
  StaticPageDto,
  CreateStaticPageDto,
  UpdateStaticPageDto,
  FilterStaticPageDto,
  PaginatedResponseDto,
} from '../dto';
import type { ApiResponse } from '../dto';

// ============================================
// BANNER API
// ============================================

export const bannerApi = {
  /**
   * Get all banners
   */
  getBanners: async (): Promise<ApiResponse<BannerDto[]>> => {
    const response = await axiosInstance.get<ApiResponse<BannerDto[]>>('/admin/cms/banners');
    return response.data;
  },

  /**
   * Get a single banner by ID
   */
  getBanner: async (id: string): Promise<ApiResponse<BannerDto>> => {
    const response = await axiosInstance.get<ApiResponse<BannerDto>>(`/admin/cms/banners/${id}`);
    return response.data;
  },

  /**
   * Create a new banner
   */
  createBanner: async (data: CreateBannerDto): Promise<ApiResponse<BannerDto>> => {
    const response = await axiosInstance.post<ApiResponse<BannerDto>>('/admin/cms/banners', data);
    return response.data;
  },

  /**
   * Update a banner
   */
  updateBanner: async (id: string, data: UpdateBannerDto): Promise<ApiResponse<BannerDto>> => {
    const response = await axiosInstance.patch<ApiResponse<BannerDto>>(
      `/admin/cms/banners/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a banner
   */
  deleteBanner: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/admin/cms/banners/${id}`);
    return response.data;
  },

  //UPLOAD IMAGE
  uploadImage: async (file: File): Promise<{ data: { url: string } }> => {
    const formData = new FormData();

    formData.append('image', file); // MUST match FileInterceptor('image')

    const response = await axiosInstance.post('/admin/upload/banner-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

// ============================================
// STATIC PAGE API
// ============================================

export const staticPageApi = {
  /**
   * Get all static pages
   */
  getPages: async (filters?: FilterStaticPageDto): Promise<PaginatedResponseDto<StaticPageDto>> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponseDto<StaticPageDto>>>(
      '/admin/cms/pages',
      { params: filters },
    );
    return response.data.data;
  },

  /**
   * Get a single static page by slug
   */
  getPage: async (slug: string): Promise<ApiResponse<StaticPageDto>> => {
    const response = await axiosInstance.get<ApiResponse<StaticPageDto>>(
      `/admin/cms/pages/${slug}`,
    );
    return response.data;
  },

  /**
   * Create a new static page
   */
  createPage: async (data: CreateStaticPageDto): Promise<ApiResponse<StaticPageDto>> => {
    const response = await axiosInstance.post<ApiResponse<StaticPageDto>>('/admin/cms/pages', data);
    return response.data;
  },

  /**
   * Update a static page
   */
  updatePage: async (
    slug: string,
    data: UpdateStaticPageDto,
  ): Promise<ApiResponse<StaticPageDto>> => {
    const response = await axiosInstance.patch<ApiResponse<StaticPageDto>>(
      `/admin/cms/pages/${slug}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a static page
   */
  deletePage: async (slug: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/admin/cms/pages/${slug}`);
    return response.data;
  },
};
