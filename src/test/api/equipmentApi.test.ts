import { describe, it, expect, vi, beforeEach } from 'vitest';
import axiosInstance from '../../api/axiosInstance';
import { equipmentApi, equipmentCategoryApi } from '../../api/equipmentApi';
import type { EquipmentCategoryDto, EquipmentDto } from '../../dto/equipment.dto';
import type { PaginatedResponse } from '../../dto/api.dto';
import type { ApiResponse } from '../../api';

// Mock axiosInstance
vi.mock('../../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedAxios = vi.mocked(axiosInstance, true);

// ===============================
// Reusable Mock Data
// ===============================

// Category
const mockCategory = {} as EquipmentCategoryDto;

const mockCategoryList: PaginatedResponse<EquipmentCategoryDto> = {
  items: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
};

// Equipment
const mockEquipment = {} as EquipmentDto;

const mockEquipmentList: PaginatedResponse<EquipmentDto> = {
  items: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
};

// Create Equipment Payload
const mockCreateEquipmentPayload = {
  title: 'Machine',
  description: '',
  categoryId: '',
  sellerId: '',
  listingType: 'auction' as const,
  make: '',
  models: '',
  year: 2025,
  location: {
    address: '',
    country: '',
    city: '',
    state: '',
    zipCode: '',
  },
};

// ===============================
// Reusable Response Factory
// ===============================
const createApiResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  message: 'Success',
  data,
  timestamp: '',
  path: '',
});

describe('Equipment Category API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch categories', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: mockCategoryList },
    });

    const result = await equipmentCategoryApi.getCategories();

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/equipment-categories', { params: {} });
    expect(result).toEqual(mockCategoryList);
  });

  it('should fetch single category', async () => {
    const mockResponse = createApiResponse(mockCategory);

    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await equipmentCategoryApi.getCategory('1');

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/equipment-categories/1');
    expect(result).toEqual(mockResponse);
  });

  it('should create category', async () => {
    const payload = { name: 'Test', slug: 'test', description: '' };
    const mockResponse = createApiResponse(mockCategory);

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await equipmentCategoryApi.createCategory(payload);

    expect(mockedAxios.post).toHaveBeenCalledWith('/admin/equipment-categories', payload);
    expect(result).toEqual(mockResponse);
  });
  it('should upload category image', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const mockResponse = createApiResponse<{ urls: string[] }>({
      urls: ['image-url'],
    });

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await equipmentCategoryApi.uploadCategoryImage(file);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/admin/upload/equipment-category-images',
      expect.any(FormData),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should update category', async () => {
    const payload = { name: 'Updated' };
    const mockResponse = createApiResponse(mockCategory);

    mockedAxios.patch.mockResolvedValue({ data: mockResponse });

    const result = await equipmentCategoryApi.updateCategory('1', payload);

    expect(mockedAxios.patch).toHaveBeenCalledWith('/admin/equipment-categories/1', payload);
    expect(result).toEqual(mockResponse);
  });

  it('should restore category', async () => {
    const mockResponse = createApiResponse(mockCategory);

    mockedAxios.patch.mockResolvedValue({ data: mockResponse });

    const result = await equipmentCategoryApi.restoreCategory('1');

    expect(mockedAxios.patch).toHaveBeenCalledWith('/admin/equipment-categories/1/restore');
    expect(result).toEqual(mockResponse);
  });
  it('should delete category', async () => {
    const mockResponse = createApiResponse<void>(undefined);

    mockedAxios.delete.mockResolvedValue({ data: mockResponse });

    const result = await equipmentCategoryApi.deleteCategory('1');

    expect(mockedAxios.delete).toHaveBeenCalledWith('/admin/equipment-categories/1');
    expect(result).toEqual(mockResponse);
  });
});

describe('Equipment API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch equipment list', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: mockEquipmentList },
    });

    const result = await equipmentApi.getEquipment();

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/equipment', { params: {} });
    expect(result).toEqual(mockEquipmentList);
  });

  it('should fetch equipment by id', async () => {
    const mockResponse = createApiResponse(mockEquipment);

    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await equipmentApi.getEquipmentById('123');

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/equipment/123');
    expect(result).toEqual(mockResponse);
  });

  it('should create equipment', async () => {
    const mockResponse = createApiResponse(mockEquipment);

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await equipmentApi.createEquipment(mockCreateEquipmentPayload);

    expect(mockedAxios.post).toHaveBeenCalledWith('/admin/equipment', mockCreateEquipmentPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should approve equipment', async () => {
    const payload = { isPublished: true };
    const mockResponse = createApiResponse(mockEquipment);

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await equipmentApi.approveEquipment('1', payload);

    expect(mockedAxios.post).toHaveBeenCalledWith('/admin/equipment/1/approve', payload);
    expect(result).toEqual(mockResponse);
  });

  it('should bulk approve equipment', async () => {
    const payload = { equipmentIds: ['1', '2'], isPublished: true };
    const mockResponse = createApiResponse<{ approved: number }>({
      approved: 2,
    });

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await equipmentApi.bulkApprove(payload);

    expect(mockedAxios.post).toHaveBeenCalledWith('/admin/equipment/bulk-approve', payload);
    expect(result).toEqual(mockResponse);
  });

  it('should fetch pending approvals', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: mockEquipmentList },
    });

    const result = await equipmentApi.getPendingApprovals(1, 10);

    expect(mockedAxios.get).toHaveBeenCalledWith('/admin/equipment/pending-approvals', {
      params: { page: 1, limit: 10 },
    });
    expect(result).toEqual(mockEquipmentList);
  });

  it('should delete equipment', async () => {
    const mockResponse = createApiResponse<void>(undefined);

    mockedAxios.delete.mockResolvedValue({ data: mockResponse });

    const result = await equipmentApi.deleteEquipment('1');

    expect(mockedAxios.delete).toHaveBeenCalledWith('/admin/equipment/1');
    expect(result).toEqual(mockResponse);
  });
  it('should update equipment', async () => {
    const payload = { title: 'Updated' };
    const mockResponse = createApiResponse(mockEquipment);

    mockedAxios.patch.mockResolvedValue({ data: mockResponse });

    const result = await equipmentApi.updateEquipment('1', payload);

    expect(mockedAxios.patch).toHaveBeenCalledWith('/admin/equipment/1', payload);
    expect(result).toEqual(mockResponse);
  });
  it('should reject equipment', async () => {
    const payload = { rejectionReason: 'Invalid' };
    const mockResponse = createApiResponse(mockEquipment);

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await equipmentApi.rejectEquipment('1', payload);

    expect(mockedAxios.post).toHaveBeenCalledWith('/admin/equipment/1/reject', payload);
    expect(result).toEqual(mockResponse);
  });
  it('should increment view count', async () => {
    const mockResponse = createApiResponse<void>(undefined);

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await equipmentApi.incrementView('1');

    expect(mockedAxios.post).toHaveBeenCalledWith('/admin/equipment/1/increment-view');
    expect(result).toEqual(mockResponse);
  });
  it('should increment inquiry count', async () => {
    const mockResponse = createApiResponse<void>(undefined);

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await equipmentApi.incrementInquiry('1');

    expect(mockedAxios.post).toHaveBeenCalledWith('/admin/equipment/1/increment-inquiry');
    expect(result).toEqual(mockResponse);
  });
  it('should upload equipment images', async () => {
    const files = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.png', { type: 'image/png' }),
    ];

    const mockResponse = createApiResponse<{ urls: string[] }>({
      urls: ['url1', 'url2'],
    });

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await equipmentApi.uploadImages(files);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/admin/upload/equipment-images',
      expect.any(FormData),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );

    expect(result).toEqual(mockResponse);
  });
});
