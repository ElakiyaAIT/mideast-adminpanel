import axiosInstance from './axiosInstance';
import type {
  AuctionDto,
  CreateAuctionDto,
  UpdateAuctionDto,
  AssignEquipmentDto,
  FilterAuctionDto,
  BidDto,
  PaginatedResponseDto,
} from '../dto';
import type { ApiResponse } from '../dto';
import type { EquipmentDto } from '../dto';

export const auctionApi = {
  /**
   * Get all auctions with filters
   */
  getAuctions: async (
    filters: FilterAuctionDto = {},
  ): Promise<PaginatedResponseDto<AuctionDto>> => {
    const response = await axiosInstance.get('/admin/auctions', { params: filters });
    return response.data.data;
  },

  /**
   * Get a single auction by ID
   */
  getAuction: async (id: string): Promise<PaginatedResponseDto<AuctionDto>> => {
    const response = await axiosInstance.get<PaginatedResponseDto<AuctionDto>>(
      `/admin/auctions/${id}`,
    );
    return response.data;
  },

  /**
   * Get equipment assigned to an auction
   */
  getAuctionEquipment: async (id: string): Promise<ApiResponse<EquipmentDto[]>> => {
    const response = await axiosInstance.get<ApiResponse<EquipmentDto[]>>(
      `/admin/auctions/${id}/equipment`,
    );
    return response.data;
  },

  /**
   * Get bids for an auction
   */
  getAuctionBids: async (id: string): Promise<ApiResponse<BidDto[]>> => {
    const response = await axiosInstance.get<ApiResponse<BidDto[]>>(`/admin/auctions/${id}/bids`);
    return response.data;
  },

  /**
   * Create a new auction
   */
  createAuction: async (data: CreateAuctionDto): Promise<ApiResponse<AuctionDto>> => {
    const response = await axiosInstance.post<ApiResponse<AuctionDto>>('/admin/auctions', data);
    return response.data;
  },
  /**
   * Upload auction images
   */
  uploadAuctionImages: async (files: File[]): Promise<ApiResponse<{ urls: string[] }>> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axiosInstance.post<ApiResponse<{ urls: string[] }>>(
      '/admin/upload/auction-images',
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
   * Update an auction
   */
  updateAuction: async (id: string, data: UpdateAuctionDto): Promise<ApiResponse<AuctionDto>> => {
    const response = await axiosInstance.patch<ApiResponse<AuctionDto>>(
      `/admin/auctions/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Assign equipment to an auction
   */
  assignEquipment: async (
    id: string,
    data: AssignEquipmentDto,
  ): Promise<ApiResponse<{ assigned: number }>> => {
    const response = await axiosInstance.post<ApiResponse<{ assigned: number }>>(
      `/admin/auctions/${id}/equipment`,
      data,
    );
    return response.data;
  },

  /**
   * Cancel an auction
   */
  cancelAuction: async (id: string): Promise<ApiResponse<AuctionDto>> => {
    const response = await axiosInstance.post<ApiResponse<AuctionDto>>(
      `/admin/auctions/${id}/cancel`,
    );
    return response.data;
  },

  /**
   * Delete an auction
   */
  deleteAuction: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/admin/auctions/${id}`);
    return response.data;
  },
};
