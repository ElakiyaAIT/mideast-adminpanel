// tests/auctionApi.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axiosInstance from '../../api/axiosInstance';
import type {
  AssignEquipmentDto,
  AuctionDto,
  CreateAuctionDto,
  FilterAuctionDto,
  UpdateAuctionDto,
  BidDto,
} from '../../dto/auction.dto';
import type { EquipmentDto, PaginatedResponseDto } from '../../dto';
import { auctionApi } from '../../api/auctionApi';
import type { ApiResponse } from '../../api';

vi.mock('../../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedAxios = vi.mocked(axiosInstance, true);

const mockAuction: AuctionDto = {
  _id: '1',
  title: 'Auction 1',
  status: 'scheduled',
  startDate: '',
  endDate: '',
  description: 'Test auction',
  type: 'online',
  equipmentCount: 0,
  totalBids: 0,
  isDeleted: false,
  createdAt: '',
  updatedAt: '',
};

const mockAuctionList: PaginatedResponseDto<AuctionDto> = {
  items: [mockAuction],
  pagination: {
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

const createAuctionPayload: CreateAuctionDto = {
  title: 'New Auction',
  startDate: '',
  endDate: '',
  type: 'online',
  description: 'Test create auction',
};

const updateAuctionPayload: UpdateAuctionDto = {
  title: 'Updated Auction',
};

const assignEquipmentPayload: AssignEquipmentDto = {
  equipmentIds: ['eq1'],
};

const mockEquipment: EquipmentDto[] = [
  {
    _id: 'eq1',
    title: 'Excavator',
    description: '',
    listingType: 'auction',
    status: 'approved',
    make: 'make',
    models: 'model',
    year: 2025,
    viewCount: 0,
    inquiryCount: 0,
    isDeleted: false,
    isFeatured: true,
    isPublished: true,
    createdAt: '',
    updatedAt: '',
    location: { address: '', state: '', city: '', country: '', zipCode: '' },
  },
];

describe('auctionApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch auctions with filters', async () => {
    const filters: FilterAuctionDto = { status: 'scheduled' };
    mockedAxios.get.mockResolvedValue({ data: { data: mockAuctionList } });

    const result = await auctionApi.getAuctions(filters);

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/auctions', { params: filters });
    expect(result).toEqual(mockAuctionList);
  });

  it('should fetch auctions without filters', async () => {
    mockedAxios.get.mockResolvedValue({ data: { data: mockAuctionList } });

    const result = await auctionApi.getAuctions();

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/auctions', { params: {} });
    expect(result).toEqual(mockAuctionList);
  });

  it('should fetch a single auction by ID', async () => {
    const mockResponse: PaginatedResponseDto<AuctionDto> = {
      items: [mockAuction],
      pagination: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.getAuction('1');

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/auctions/1');
    expect(result).toEqual(mockResponse);
  });

  it('should fetch auction equipment', async () => {
    const mockResponse: ApiResponse<EquipmentDto[]> = {
      success: true,
      message: 'Equipment fetched successfully',
      data: mockEquipment,
      timestamp: '',
      path: '',
    };
    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.getAuctionEquipment('1');

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/auctions/1/equipment');
    expect(result).toEqual(mockResponse);
  });

  it('should fetch auction bids', async () => {
    const mockBid: BidDto = {
      _id: 'bid1',
      auctionId: 'auction1',
      equipmentId: 'eq1',
      bidderId: 'user1',
      bidder: {
        _id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      amount: 1000,
      status: 'active',
      isWinning: true,
      placedAt: '2023-01-01T00:00:00Z',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };
    const mockResponse: ApiResponse<BidDto[]> = {
      success: true,
      message: 'Bids fetched successfully',
      data: [mockBid],
      timestamp: '',
      path: '',
    };
    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.getAuctionBids('1');

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/auctions/1/bids');
    expect(result).toEqual(mockResponse);
  });

  it('should create a new auction', async () => {
    const mockResponse: ApiResponse<AuctionDto> = {
      success: true,
      message: 'Auction created successfully',
      data: { ...mockAuction, ...createAuctionPayload, _id: '2' },
      timestamp: '',
      path: '',
    };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.createAuction(createAuctionPayload);

    expect(mockedAxios.post).toHaveBeenCalledWith('/admin/auctions', createAuctionPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should upload auction images', async () => {
    const files = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.png', { type: 'image/png' }),
    ];
    const mockResponse: ApiResponse<{ urls: string[] }> = {
      success: true,
      message: 'Images uploaded successfully',
      data: { urls: ['url1', 'url2'] },
      timestamp: '',
      path: '',
    };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.uploadAuctionImages(files);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/admin/upload/auction-images',
      expect.any(FormData),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should update an auction', async () => {
    const mockResponse: ApiResponse<AuctionDto> = {
      success: true,
      message: 'Auction updated successfully',
      data: { ...mockAuction, ...updateAuctionPayload },
      timestamp: '',
      path: '',
    };
    mockedAxios.patch.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.updateAuction('1', updateAuctionPayload);

    expect(mockedAxios.patch).toHaveBeenCalledWith('/admin/auctions/1', updateAuctionPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should assign equipment to an auction', async () => {
    const mockResponse: ApiResponse<{ assigned: number }> = {
      success: true,
      message: 'Equipment assigned successfully',
      data: { assigned: 1 },
      timestamp: '',
      path: '',
    };

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.assignEquipment('1', assignEquipmentPayload);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/admin/auctions/1/equipment',
      assignEquipmentPayload,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should cancel an auction', async () => {
    const mockResponse: ApiResponse<AuctionDto> = {
      success: true,
      message: 'Auction cancelled successfully',
      data: { ...mockAuction, status: 'cancelled' },
      timestamp: '',
      path: '',
    };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.cancelAuction('1');

    expect(mockedAxios.post).toHaveBeenCalledWith('/admin/auctions/1/cancel');
    expect(result).toEqual(mockResponse);
  });

  it('should delete an auction', async () => {
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Auction deleted successfully',
      data: undefined,
      timestamp: '',
      path: '',
    };
    mockedAxios.delete.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.deleteAuction('1');

    expect(mockedAxios.delete).toHaveBeenCalledWith('/admin/auctions/1');
    expect(result).toEqual(mockResponse);
  });

  it('should fetch auctions with complex filters', async () => {
    const filters: FilterAuctionDto = {
      status: 'live',
      type: 'online',
      page: 2,
      limit: 20,
      search: 'test auction',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    };
    mockedAxios.get.mockResolvedValue({ data: { data: mockAuctionList } });

    const result = await auctionApi.getAuctions(filters);

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/auctions', { params: filters });
    expect(result).toEqual(mockAuctionList);
  });

  it('should update an auction with partial data', async () => {
    const partialUpdatePayload: UpdateAuctionDto = {
      description: 'Updated description',
    };
    const mockResponse: ApiResponse<AuctionDto> = {
      success: true,
      message: 'Auction updated successfully',
      data: { ...mockAuction, ...partialUpdatePayload },
      timestamp: '',
      path: '',
    };
    mockedAxios.patch.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.updateAuction('1', partialUpdatePayload);

    expect(mockedAxios.patch).toHaveBeenCalledWith('/admin/auctions/1', partialUpdatePayload);
    expect(result).toEqual(mockResponse);
  });

  it('should handle error when fetching auctions', async () => {
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValue(error);

    await expect(auctionApi.getAuctions()).rejects.toThrow('Network error');
  });

  it('should handle error when creating auction', async () => {
    const error = new Error('Creation failed');
    mockedAxios.post.mockRejectedValue(error);

    await expect(auctionApi.createAuction(createAuctionPayload)).rejects.toThrow('Creation failed');
  });

  it('should handle error when updating auction', async () => {
    const error = new Error('Update failed');
    mockedAxios.patch.mockRejectedValue(error);

    await expect(auctionApi.updateAuction('1', updateAuctionPayload)).rejects.toThrow(
      'Update failed',
    );
  });

  it('should handle error when deleting auction', async () => {
    const error = new Error('Deletion failed');
    mockedAxios.delete.mockRejectedValue(error);

    await expect(auctionApi.deleteAuction('1')).rejects.toThrow('Deletion failed');
  });

  it('should assign equipment with multiple IDs', async () => {
    const multiAssignPayload: AssignEquipmentDto = {
      equipmentIds: ['eq1', 'eq2', 'eq3'],
    };
    const mockResponse: ApiResponse<{ assigned: number }> = {
      success: true,
      message: 'Equipment assigned successfully',
      data: { assigned: 3 },
      timestamp: '',
      path: '',
    };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.assignEquipment('1', multiAssignPayload);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/admin/auctions/1/equipment',
      multiAssignPayload,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should upload auction images with single file', async () => {
    const files = [new File(['test'], 'test.png', { type: 'image/png' })];
    const mockResponse: ApiResponse<{ urls: string[] }> = {
      success: true,
      message: 'Image uploaded successfully',
      data: { urls: ['url1'] },
      timestamp: '',
      path: '',
    };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.uploadAuctionImages(files);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/admin/upload/auction-images',
      expect.any(FormData),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should fetch auction bids with external bidder', async () => {
    const mockBid: BidDto = {
      _id: 'bid1',
      auctionId: 'auction1',
      equipmentId: 'eq1',
      externalBidId: 'ext123',
      externalBidder: {
        name: 'External Bidder',
        paddleNumber: 'P123',
        platform: 'Proxibid',
      },
      amount: 1500,
      status: 'won',
      isWinning: true,
      placedAt: '2023-01-01T00:00:00Z',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };
    const mockResponse: ApiResponse<BidDto[]> = {
      success: true,
      message: 'Bids fetched successfully',
      data: [mockBid],
      timestamp: '',
      path: '',
    };
    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await auctionApi.getAuctionBids('1');

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/auctions/1/bids');
    expect(result).toEqual(mockResponse);
  });
});
