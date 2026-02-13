import { useQuery } from '@tanstack/react-query';
import { roleApi } from '../../api/roleApi';

// Query keys
export const roleKeys = {
  all: ['role'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
};

/**
 * Get all active roles (Admin only)
 */
export const useRoles = () => {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: async () => {
      const response = await roleApi.getRoles();
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch roles');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - roles don't change often
  });
};
