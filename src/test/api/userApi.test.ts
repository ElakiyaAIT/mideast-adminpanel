import { describe, it, expect, vi, beforeEach } from 'vitest';
import axiosInstance from '../../api/axiosInstance';
import { userApi } from '../../api/userApi';
import type {
  UserProfileDto,
  UpdateUserProfileDto,
  UpdateUserProfileResponseDto,
  UserResponseDto,
  UserListQueryParams,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponseDto,
} from '../../dto';
import type { ApiResponse } from '../../dto/api.dto';

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

// ==============================
// Reusable Mock Data
// ==============================

const mockUserProfile: UserProfileDto = {
  id: '1',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockUserResponse: UserResponseDto = {
  id: '1',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  roleId: { _id: 'role1', name: 'User' },
  roleName: 'User',
  isActive: true,
  isEmailVerified: true,
  lastLoginAt: '2023-01-01T00:00:00Z',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockPaginatedUsers: PaginatedResponseDto<UserResponseDto> = {
  items: [mockUserResponse],
  pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
};

const mockUpdateProfilePayload: UpdateUserProfileDto = {
  firstName: 'Jane',
};

const mockUpdateProfileResponse: UpdateUserProfileResponseDto = {
  user: mockUserProfile,
  message: 'Profile updated successfully',
};

const mockCreateUserPayload: CreateUserDto = {
  email: 'newuser@example.com',
  firstName: 'New',
  lastName: 'User',
  roleId: 'role1',
};

const mockUpdateUserPayload: UpdateUserDto = {
  firstName: 'Updated',
};

// ==============================
// Reusable Response Factory
// ==============================
const createApiResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  message: 'Success',
  data,
});

describe('User API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch user profile', async () => {
    const mockResponse = createApiResponse(mockUserProfile);

    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await userApi.getProfile();

    expect(mockedAxios.get).toHaveBeenCalledWith('/auth/profile');
    expect(result).toEqual(mockResponse);
  });

  it('should update user profile', async () => {
    const mockResponse = createApiResponse(mockUpdateProfileResponse);

    mockedAxios.patch.mockResolvedValue({ data: mockResponse });

    const result = await userApi.updateProfile(mockUpdateProfilePayload);

    expect(mockedAxios.patch).toHaveBeenCalledWith('/auth/profile', mockUpdateProfilePayload);
    expect(result).toEqual(mockResponse);
  });

  it('should fetch users list', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: mockPaginatedUsers },
    });

    const result = await userApi.getUsers();

    expect(mockedAxios.get).toHaveBeenCalledWith('/users', { params: {} });
    expect(result).toEqual(mockPaginatedUsers);
  });

  it('should fetch users list with params', async () => {
    const params: UserListQueryParams = { page: 2, limit: 20, search: 'test' };

    mockedAxios.get.mockResolvedValue({
      data: { data: mockPaginatedUsers },
    });

    const result = await userApi.getUsers(params);

    expect(mockedAxios.get).toHaveBeenCalledWith('/users', { params });
    expect(result).toEqual(mockPaginatedUsers);
  });

  it('should fetch single user', async () => {
    const mockResponse = createApiResponse(mockUserResponse);

    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const result = await userApi.getUser('1');

    expect(mockedAxios.get).toHaveBeenCalledWith('/users/1');
    expect(result).toEqual(mockResponse);
  });

  it('should create user', async () => {
    const mockResponse = createApiResponse(mockUserResponse);

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await userApi.createUser(mockCreateUserPayload);

    expect(mockedAxios.post).toHaveBeenCalledWith('/users', mockCreateUserPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should update user', async () => {
    const mockResponse = createApiResponse(mockUserResponse);

    mockedAxios.patch.mockResolvedValue({ data: mockResponse });

    const result = await userApi.updateUser('1', mockUpdateUserPayload);

    expect(mockedAxios.patch).toHaveBeenCalledWith('/users/1', mockUpdateUserPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should delete user', async () => {
    const mockResponse = createApiResponse<void>(undefined);

    mockedAxios.delete.mockResolvedValue({ data: mockResponse });

    const result = await userApi.deleteUser('1');

    expect(mockedAxios.delete).toHaveBeenCalledWith('/users/1');
    expect(result).toEqual(mockResponse);
  });

  it('should restore user', async () => {
    const mockResponse = createApiResponse(mockUserResponse);

    mockedAxios.patch.mockResolvedValue({ data: mockResponse });

    const result = await userApi.restoreUser('1');

    expect(mockedAxios.patch).toHaveBeenCalledWith('/users/1/restore');
    expect(result).toEqual(mockResponse);
  });
});
