import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { BannerDto, CreateBannerDto, UpdateBannerDto, ApiResponse } from '../../dto';
import axiosInstance from '../../api/axiosInstance';
import { bannerApi } from '../../api/cmsApi';

// Proper module mock (Vitest way)
vi.mock('../../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('bannerApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBanner: BannerDto = {
    _id: '1',
    title: 'Test Banner',
    imageUrl: 'https://example.com/image.jpg',
    position: 'category_top',
    status: 'active',
    sortOrder: 1,
    clickCount: 0,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe('getBanners', () => {
    it('should fetch all banners', async () => {
      const mockResponse: ApiResponse<BannerDto[]> = {
        success: true,
        data: [mockBanner],
        message: 'Fetched successfully',
      };

      vi.mocked(axiosInstance.get).mockResolvedValue({
        data: mockResponse,
      });

      const result = await bannerApi.getBanners();

      expect(axiosInstance.get).toHaveBeenCalledWith('/admin/cms/banners');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getBanner', () => {
    it('should fetch a single banner by id', async () => {
      const mockResponse: ApiResponse<BannerDto> = {
        success: true,
        data: mockBanner,
        message: 'Fetched successfully',
      };

      vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockResponse });

      const result = await bannerApi.getBanner('1');

      expect(axiosInstance.get).toHaveBeenCalledWith('/admin/cms/banners/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createBanner', () => {
    it('should create a banner', async () => {
      const createDto: CreateBannerDto = {
        title: 'New Banner',
        imageUrl: 'https://example.com/new.jpg',
        position: 'category_top',
      };

      const mockResponse: ApiResponse<BannerDto> = {
        success: true,
        data: mockBanner,
        message: 'Created successfully',
      };

      vi.mocked(axiosInstance.post).mockResolvedValue({ data: mockResponse });

      const result = await bannerApi.createBanner(createDto);

      expect(axiosInstance.post).toHaveBeenCalledWith('/admin/cms/banners', createDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateBanner', () => {
    it('should update a banner', async () => {
      const updateDto: UpdateBannerDto = {
        title: 'Updated Banner',
      };

      const mockResponse: ApiResponse<BannerDto> = {
        success: true,
        data: mockBanner,
        message: 'Updated successfully',
      };

      vi.mocked(axiosInstance.patch).mockResolvedValue({ data: mockResponse });

      const result = await bannerApi.updateBanner('1', updateDto);

      expect(axiosInstance.patch).toHaveBeenCalledWith('/admin/cms/banners/1', updateDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteBanner', () => {
    it('should delete a banner', async () => {
      const mockResponse: ApiResponse<void> = {
        success: true,
        data: undefined,
        message: 'Deleted successfully',
      };

      vi.mocked(axiosInstance.delete).mockResolvedValue({ data: mockResponse });

      const result = await bannerApi.deleteBanner('1');

      expect(axiosInstance.delete).toHaveBeenCalledWith('/admin/cms/banners/1');
      expect(result).toBe(mockResponse);
    });
  });

  describe('uploadImage', () => {
    it('should upload an image', async () => {
      const file = new File(['dummy'], 'banner.png', {
        type: 'image/png',
      });

      const mockResponse = {
        data: {
          url: 'https://example.com/uploaded.png',
        },
      };

      vi.mocked(axiosInstance.post).mockResolvedValue({ data: mockResponse });

      const result = await bannerApi.uploadImage(file);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/admin/upload/banner-image',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      expect(result).toBe(mockResponse);
    });
  });
});
