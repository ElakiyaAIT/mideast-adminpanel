import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { settingsApi } from '../../api';
import type {
  SystemSettingDto,
  UpdateSystemSettingDto,
  SystemSettingsQueryParams,
  ApiResponse,
} from '../../dto';

/**
 * Hook to fetch system settings with filters
 */
export const useSystemSettings = (
  params?: SystemSettingsQueryParams,
): UseQueryResult<ApiResponse<SystemSettingDto[]>> => {
  return useQuery<ApiResponse<SystemSettingDto[]>>({
    queryKey: ['system-settings', params],
    queryFn: () => settingsApi.getSettings(params),
  });
};

/**
 * Hook to fetch a single setting by key
 */
export const useSystemSetting = (key: string) => {
  return useQuery<ApiResponse<SystemSettingDto>>({
    queryKey: ['system-setting', key],
    queryFn: () => settingsApi.getSetting(key),
    enabled: !!key,
  });
};

/**
 * Hook to update a system setting
 */
export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateSystemSettingDto }) =>
      settingsApi.updateSetting(key, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      void queryClient.invalidateQueries({ queryKey: ['system-setting', variables.key] });
    },
    onError: (error: Error) => {
      console.error('Failed to update system setting:', error);
    },
  });
};
