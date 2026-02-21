import axiosInstance from './axiosInstance';
import type {
  EquipmentCategoryDto,
  CreateEquipmentCategoryDto,
  UpdateEquipmentCategoryDto,
  EquipmentCategoryQueryParams,
  EquipmentDto,
  CreateEquipmentDto,
  UpdateEquipmentDto,
  ApproveEquipmentDto,
  RejectEquipmentDto,
  BulkApproveDto,
  FilterEquipmentDto,
} from '../dto';
import type { ApiResponse, PaginatedResponse } from '../dto';

// ============================================
// EQUIPMENT CATEGORY API
// ============================================

export const equipmentCategoryApi = {
  /**
   * Get all equipment categories
   */
  getCategories: async (
    params: EquipmentCategoryQueryParams = {},
  ): Promise<PaginatedResponse<EquipmentCategoryDto>> => {
    const response = await axiosInstance.get('/admin/equipment-categories', { params });
    return response.data.data;
  },

  /**
   * Get a single equipment category by ID
   */
  getCategory: async (id: string): Promise<ApiResponse<EquipmentCategoryDto>> => {
    const response = await axiosInstance.get<ApiResponse<EquipmentCategoryDto>>(
      `/admin/equipment-categories/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new equipment category
   */
  createCategory: async (
    data: CreateEquipmentCategoryDto,
  ): Promise<ApiResponse<EquipmentCategoryDto>> => {
    const response = await axiosInstance.post<ApiResponse<EquipmentCategoryDto>>(
      '/admin/equipment-categories',
      data,
    );
    return response.data;
  },
  /**
   * Upload equipment category image
   */
  uploadCategoryImage: async (file: File): Promise<ApiResponse<{ urls: string[] }>> => {
    const formData = new FormData();
    formData.append('images', file);

    const response = await axiosInstance.post<ApiResponse<{ urls: string[] }>>(
      '/admin/upload/equipment-category-images',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  /**
   * Update an equipment category
   */
  updateCategory: async (
    id: string,
    data: UpdateEquipmentCategoryDto,
  ): Promise<ApiResponse<EquipmentCategoryDto>> => {
    const response = await axiosInstance.patch<ApiResponse<EquipmentCategoryDto>>(
      `/admin/equipment-categories/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete an equipment category (soft delete)
   */
  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      `/admin/equipment-categories/${id}`,
    );
    return response.data;
  },

  /**
   * Restore a deleted equipment category
   */
  restoreCategory: async (id: string): Promise<ApiResponse<EquipmentCategoryDto>> => {
    const response = await axiosInstance.patch<ApiResponse<EquipmentCategoryDto>>(
      `/admin/equipment-categories/${id}/restore`,
    );
    return response.data;
  },
};

// ============================================
// EQUIPMENT API
// ============================================

export const equipmentApi = {
  /**
   * Get all equipment with filters
   */
  getEquipment: async (
    filters: FilterEquipmentDto = {},
  ): Promise<PaginatedResponse<EquipmentDto>> => {
    const response = await axiosInstance.get('/admin/equipment', { params: filters });
    return response.data.data;
  },

  /**
   * Get equipment pending approval
   */
  getPendingApprovals: async (
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<EquipmentDto>> => {
    const response = await axiosInstance.get('/admin/equipment/pending-approvals', {
      params: { page, limit },
    });
    return response.data.data;
  },

  /**
   * Get a single equipment by ID
   */
  getEquipmentById: async (id: string): Promise<ApiResponse<EquipmentDto>> => {
    const response = await axiosInstance.get<ApiResponse<EquipmentDto>>(`/admin/equipment/${id}`);
    return response.data;
  },

  /**
   * Upload equipment images
   */
  uploadImages: async (files: File[]): Promise<ApiResponse<{ urls: string[] }>> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axiosInstance.post<ApiResponse<{ urls: string[] }>>(
      '/admin/upload/equipment-images',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  /**
   * Create new equipment listing
   */
  createEquipment: async (data: CreateEquipmentDto): Promise<ApiResponse<EquipmentDto>> => {
    const response = await axiosInstance.post<ApiResponse<EquipmentDto>>('/admin/equipment', data);
    return response.data;
  },

  /**
   * Update equipment listing
   */
  updateEquipment: async (
    id: string,
    data: UpdateEquipmentDto,
  ): Promise<ApiResponse<EquipmentDto>> => {
    const response = await axiosInstance.patch<ApiResponse<EquipmentDto>>(
      `/admin/equipment/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Approve equipment listing
   */
  approveEquipment: async (
    id: string,
    data: ApproveEquipmentDto,
  ): Promise<ApiResponse<EquipmentDto>> => {
    const response = await axiosInstance.post<ApiResponse<EquipmentDto>>(
      `/admin/equipment/${id}/approve`,
      data,
    );
    return response.data;
  },

  /**
   * Reject equipment listing
   */
  rejectEquipment: async (
    id: string,
    data: RejectEquipmentDto,
  ): Promise<ApiResponse<EquipmentDto>> => {
    const response = await axiosInstance.post<ApiResponse<EquipmentDto>>(
      `/admin/equipment/${id}/reject`,
      data,
    );
    return response.data;
  },

  /**
   * Bulk approve equipment listings
   */
  bulkApprove: async (data: BulkApproveDto): Promise<ApiResponse<{ approved: number }>> => {
    const response = await axiosInstance.post<ApiResponse<{ approved: number }>>(
      '/admin/equipment/bulk-approve',
      data,
    );
    return response.data;
  },

  /**
   * Delete equipment listing (soft delete)
   */
  deleteEquipment: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/admin/equipment/${id}`);
    return response.data;
  },

  /**
   * Increment view count
   */
  incrementView: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      `/admin/equipment/${id}/increment-view`,
    );
    return response.data;
  },

  /**
   * Increment inquiry count
   */
  incrementInquiry: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(
      `/admin/equipment/${id}/increment-inquiry`,
    );
    return response.data;
  },
};
