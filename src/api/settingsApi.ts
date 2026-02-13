import axiosInstance from './axiosInstance';
import type { SystemSettingDto, UpdateSystemSettingDto, SystemSettingsQueryParams } from '../dto';
import type { ApiResponse } from '../dto';

export const settingsApi = {
  /**
   * Get all system settings
   */
  getSettings: async (
    params?: SystemSettingsQueryParams,
  ): Promise<ApiResponse<SystemSettingDto[]>> => {
    const response = await axiosInstance.get<ApiResponse<SystemSettingDto[]>>('/admin/settings', {
      params,
    });
    return response.data;
  },

  /**
   * Get a single system setting by key
   */
  getSetting: async (key: string): Promise<ApiResponse<SystemSettingDto>> => {
    const response = await axiosInstance.get(`/admin/settings/${key}`);
    return response.data.data;
  },

  /**
   * Update a system setting
   */
  updateSetting: async (
    key: string,
    data: UpdateSystemSettingDto,
  ): Promise<ApiResponse<SystemSettingDto>> => {
    const response = await axiosInstance.patch<ApiResponse<SystemSettingDto>>(
      `/admin/settings/${key}`,
      data,
    );
    return response.data;
  },
};
