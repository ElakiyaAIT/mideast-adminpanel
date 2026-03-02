import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
  CreateStaticPageDto,
  FilterStaticPageDto,
  StaticPageDto,
  UpdateStaticPageDto,
} from '../../dto/cms.dto';
import type { ApiResponse, PaginatedResponseDto } from '../../dto';
import axiosInstance from '../../api/axiosInstance';
import { staticPageApi } from '../../api/cmsApi';

// Mock axiosInstance
vi.mock('../../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const createStaticPage = (overrides?: Partial<StaticPageDto>): StaticPageDto => ({
  _id: '1',
  title: 'Test Page',
  slug: 'test-page',
  content: 'Content',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  isDeleted: false,
  isPublished: true,
  ...overrides,
});

// Paginated response factory
const createPaginatedResponse = (items: StaticPageDto[]): PaginatedResponseDto<StaticPageDto> => ({
  items,
  pagination: {
    total: items.length,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
});

// Generic API response factory
const createApiResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  message: 'Success',
  data,
});

// Axios response wrapper
const mockAxiosResponse = <T>(data: ApiResponse<T>) => ({
  data,
});

describe('staticPageApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPages', () => {
    it('should fetch paginated static pages', async () => {
      const filters: FilterStaticPageDto = { page: 1, limit: 10 };

      const page = createStaticPage();
      const paginated = createPaginatedResponse([page]);
      const response = createApiResponse(paginated);

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockAxiosResponse(response));

      const result = await staticPageApi.getPages(filters);

      expect(axiosInstance.get).toHaveBeenCalledWith('/admin/cms/pages', {
        params: filters,
      });
      expect(result).toEqual(paginated);
    });
  });

  describe('getPage', () => {
    it('should fetch a single page by slug', async () => {
      const slug = 'test-page';

      const page = createStaticPage({ slug });
      const response = createApiResponse(page);

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockAxiosResponse(response));

      const result = await staticPageApi.getPage(slug);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/admin/cms/pages/${slug}`);
      expect(result).toEqual(response);
    });
  });

  describe('createPage', () => {
    it('should create a static page', async () => {
      const payload: CreateStaticPageDto = {
        title: 'New Page',
        slug: 'new-page',
        content: 'New content',
      };

      const createdPage = createStaticPage({
        _id: '2',
        ...payload,
      });

      const mockResponse = createApiResponse(createdPage);

      vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: mockResponse });

      const result = await staticPageApi.createPage(payload);

      expect(axiosInstance.post).toHaveBeenCalledWith('/admin/cms/pages', payload);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updatePage', () => {
    it('should update a static page', async () => {
      const slug = 'test-page';

      const payload: UpdateStaticPageDto = {
        title: 'Updated Title',
      };

      const updatedPage = createStaticPage({
        title: 'Updated Title',
        updatedAt: '2024-01-02',
      });

      const mockResponse = createApiResponse(updatedPage);

      vi.mocked(axiosInstance.patch).mockResolvedValueOnce({ data: mockResponse });

      const result = await staticPageApi.updatePage(slug, payload);

      expect(axiosInstance.patch).toHaveBeenCalledWith(`/admin/cms/pages/${slug}`, payload);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deletePage', () => {
    it('should delete a static page', async () => {
      const slug = 'test-page';

      const mockResponse = createApiResponse<void>(undefined);

      vi.mocked(axiosInstance.delete).mockResolvedValueOnce({ data: mockResponse });

      const result = await staticPageApi.deletePage(slug);

      expect(axiosInstance.delete).toHaveBeenCalledWith(`/admin/cms/pages/${slug}`);
      expect(result).toEqual(mockResponse);
    });
  });
});
