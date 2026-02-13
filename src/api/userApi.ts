import axiosInstance from './axiosInstance';
import type {
  UserProfileDto,
  UpdateUserProfileDto,
  UpdateUserProfileResponseDto,
  UserResponseDto,
  UserListQueryParams,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponseDto,
} from '../dto';
import type { ApiResponse } from '../dto';

export const userApi = {
  getProfile: async (): Promise<ApiResponse<UserProfileDto>> => {
    const response = await axiosInstance.get<ApiResponse<UserProfileDto>>('/auth/profile');
    return response.data;
  },

  updateProfile: async (
    data: UpdateUserProfileDto,
  ): Promise<ApiResponse<UpdateUserProfileResponseDto>> => {
    const response = await axiosInstance.patch<ApiResponse<UpdateUserProfileResponseDto>>(
      '/auth/profile',
      data,
    );
    return response.data;
  },

  getUsers: async (
    params: UserListQueryParams = {},
  ): Promise<PaginatedResponseDto<UserResponseDto>> => {
    const response = await axiosInstance.get('/users', {
      params,
    });
    return response.data.data;
  },

  getUser: async (id: string): Promise<ApiResponse<UserResponseDto>> => {
    const response = await axiosInstance.get<ApiResponse<UserResponseDto>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserDto): Promise<ApiResponse<UserResponseDto>> => {
    const response = await axiosInstance.post<ApiResponse<UserResponseDto>>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserDto): Promise<ApiResponse<UserResponseDto>> => {
    const response = await axiosInstance.patch<ApiResponse<UserResponseDto>>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },

  restoreUser: async (id: string): Promise<ApiResponse<UserResponseDto>> => {
    const response = await axiosInstance.patch<ApiResponse<UserResponseDto>>(
      `/users/${id}/restore`,
    );
    return response.data;
  },
};
