import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { userApi } from '../../api';
import type {
  UpdateUserProfileDto,
  UserListQueryParams,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponseDto,
  UserResponseDto,
} from '../../dto';
import { normalizeApiError, getUserFriendlyMessage } from '../../utils/errorHandler';
import { showToast } from '../../utils/toast';
import { authKeys } from './useAuth';

// Query keys
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserListQueryParams) => [...userKeys.lists(), params] as const,
};

/**
 * Get user profile
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const response = await userApi.getProfile();
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch profile');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get paginated users list (Admin only)
 */
export const useUsersList = (
  params: UserListQueryParams = {},
): UseQueryResult<PaginatedResponseDto<UserResponseDto>> => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await userApi.getUsers(params);
      return response;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
  });
};

/**
 * Update user profile mutation
 * updated on feb 20.2.2026
 * response.data.user -> response.data
 * !response.data.user -> response.data
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserProfileDto) => {
      const response = await userApi.updateProfile(data);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update profile');
      }
      return response.data;
    },
    onSuccess: (user) => {
      // Update both user and auth profile queries
      queryClient.setQueryData(userKeys.profile(), user);
      queryClient.setQueryData(authKeys.profile(), user);
      showToast.success('Profile updated successfully');
    },
    onError: (error) => {
      const normalizedError = normalizeApiError(error);
      const message = getUserFriendlyMessage(normalizedError);
      showToast.error(message);
    },
  });
};

/**
 * Create user mutation (Admin only)
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await userApi.createUser(data);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create user');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all user list queries to refetch with new data
      void queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      showToast.success('User created successfully');
    },
    onError: (error) => {
      const normalizedError = normalizeApiError(error);
      const message = getUserFriendlyMessage(normalizedError);
      showToast.error(message);
    },
  });
};

/**
 * Update user mutation (Admin only)
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDto }) => {
      const response = await userApi.updateUser(id, data);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update user');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all user list queries to refetch with updated data
      void queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      showToast.success('User updated successfully');
    },
    onError: (error) => {
      const normalizedError = normalizeApiError(error);
      const message = getUserFriendlyMessage(normalizedError);
      showToast.error(message);
    },
  });
};

/**
 * Delete user mutation (Admin only - soft delete)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await userApi.deleteUser(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete user');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate all user list queries to refetch without deleted user
      void queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      showToast.success('User deleted successfully');
    },
    onError: (error) => {
      const normalizedError = normalizeApiError(error);
      const message = getUserFriendlyMessage(normalizedError);
      showToast.error(message);
    },
  });
};
