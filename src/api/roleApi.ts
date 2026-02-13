import axiosInstance from './axiosInstance';
import type { ApiResponse } from '../dto';

export interface RoleDto {
  id: string;
  name: string;
  description: string;
}

export const roleApi = {
  getRoles: async (): Promise<ApiResponse<RoleDto[]>> => {
    const response = await axiosInstance.get<ApiResponse<RoleDto[]>>('/roles');
    return response.data;
  },
};
