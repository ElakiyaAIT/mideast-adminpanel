import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { equipmentApi, equipmentCategoryApi } from '../../api';
import type {
  EquipmentCategoryDto,
  CreateEquipmentCategoryDto,
  UpdateEquipmentCategoryDto,
  EquipmentCategoryQueryParams,
  EquipmentDto,
  CreateEquipmentDto,
  UpdateEquipmentDto,
  FilterEquipmentDto,
  ApproveEquipmentDto,
  RejectEquipmentDto,
  BulkApproveDto,
  PaginatedResponseDto,
  ApiResponse,
} from '../../dto';

// ============================================================
// EQUIPMENT CATEGORIES
// ============================================================

/**
 * Hook to fetch equipment categories with filters
 */
export const useEquipmentCategories = (
  params?: EquipmentCategoryQueryParams,
): UseQueryResult<PaginatedResponseDto<EquipmentCategoryDto>> => {
  return useQuery({
    queryKey: ['equipment-categories', params],
    queryFn: async () => {
      const response = await equipmentCategoryApi.getCategories(params);

      return response;
    },
  });
};

/**
 * Hook to fetch a single equipment category by ID
 */
export const useEquipmentCategory = (id: string) => {
  return useQuery<ApiResponse<EquipmentCategoryDto>>({
    queryKey: ['equipment-category', id],
    queryFn: () => equipmentCategoryApi.getCategory(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new equipment category
 */
export const useCreateEquipmentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEquipmentCategoryDto) => equipmentCategoryApi.createCategory(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment-categories'] });
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to create category');
    },
  });
};

/**
 * Hook to update an equipment category
 */
export const useUpdateEquipmentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEquipmentCategoryDto }) =>
      equipmentCategoryApi.updateCategory(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['equipment-categories'] });
      void queryClient.invalidateQueries({ queryKey: ['equipment-category', variables.id] });
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to update category');
    },
  });
};

/**
 * Hook to delete an equipment category
 */
export const useDeleteEquipmentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => equipmentCategoryApi.deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment-categories'] });
      console.log('Category deleted successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to delete category');
    },
  });
};

/**
 * Hook to restore a deleted equipment category
 */
export const useRestoreEquipmentCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => equipmentCategoryApi.restoreCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment-categories'] });
      console.log('Category restored successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to restore category');
    },
  });
};

// ============================================================
// EQUIPMENT
// ============================================================

/**
 * Hook to fetch equipment with filters
 */
export const useEquipment = (
  filters?: FilterEquipmentDto,
): UseQueryResult<PaginatedResponseDto<EquipmentDto>> => {
  return useQuery({
    queryKey: ['equipment', filters],
    queryFn: async () => {
      const response = await equipmentApi.getEquipment(filters);
      return response;
    },
  });
};

/**
 * Hook to fetch pending equipment approvals
 */
export const usePendingApprovals = (
  page?: number,
  limit?: number,
): UseQueryResult<PaginatedResponseDto<EquipmentDto>> => {
  return useQuery<PaginatedResponseDto<EquipmentDto>>({
    queryKey: ['equipment', 'pending-approvals', page, limit],
    queryFn: async () => {
      const response = await equipmentApi.getPendingApprovals(page, limit);
      return response;
    },
  });
};

/**
 * Hook to fetch a single equipment by ID
 */
export const useEquipmentById = (id: string) => {
  return useQuery<ApiResponse<EquipmentDto>>({
    queryKey: ['equipment', id],
    queryFn: () => equipmentApi.getEquipmentById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create new equipment
 */
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEquipmentDto) => equipmentApi.createEquipment(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to create equipment');
    },
  });
};

/**
 * Hook to update equipment
 */
export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEquipmentDto }) =>
      equipmentApi.updateEquipment(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
      void queryClient.invalidateQueries({ queryKey: ['equipment', variables.id] });
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to update equipment');
    },
  });
};

/**
 * Hook to approve equipment
 */
export const useApproveEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveEquipmentDto }) =>
      equipmentApi.approveEquipment(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
      void queryClient.invalidateQueries({ queryKey: ['equipment', variables.id] });
      void queryClient.invalidateQueries({ queryKey: ['equipment', 'pending-approvals'] });
      console.log('Equipment approved successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to approve equipment');
    },
  });
};

/**
 * Hook to reject equipment
 */
export const useRejectEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectEquipmentDto }) =>
      equipmentApi.rejectEquipment(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
      void queryClient.invalidateQueries({ queryKey: ['equipment', variables.id] });
      void queryClient.invalidateQueries({ queryKey: ['equipment', 'pending-approvals'] });
      console.log('Equipment rejected successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to reject equipment');
    },
  });
};

/**
 * Hook to bulk approve equipment
 */
export const useBulkApproveEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkApproveDto) => equipmentApi.bulkApprove(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
      void queryClient.invalidateQueries({ queryKey: ['equipment', 'pending-approvals'] });
      console.log('Equipment bulk approved successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to bulk approve equipment');
    },
  });
};

/**
 * Hook to delete equipment
 */
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => equipmentApi.deleteEquipment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] });
      console.log('Equipment deleted successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to delete equipment');
    },
  });
};
