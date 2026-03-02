import { vi } from 'vitest';
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { equipmentApi } from '../../api';
import {
  useEquipment,
  useEquipmentById,
  useCreateEquipment,
  useUpdateEquipment,
  useApproveEquipment,
  useBulkApproveEquipment,
  useRejectEquipment,
  useDeleteEquipment,
  usePendingApprovals,
} from '../../hooks/queries/useEquipment';
import type {
  CreateEquipmentDto,
  UpdateEquipmentDto,
  ApproveEquipmentDto,
  BulkApproveDto,
  RejectEquipmentDto,
} from '../../dto/equipment.dto';
import type { ApiResponse } from '../../dto/api.dto';

vi.mock('../../api', () => ({
  equipmentApi: {
    getEquipment: vi.fn(),
    getPendingApprovals: vi.fn(),
    getEquipmentById: vi.fn(),
    createEquipment: vi.fn(),
    updateEquipment: vi.fn(),
    approveEquipment: vi.fn(),
    rejectEquipment: vi.fn(),
    bulkApprove: vi.fn(),
    deleteEquipment: vi.fn(),
  },
  equipmentCategoryApi: {
    getCategories: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const createWrapper = (queryClient?: QueryClient) => {
  const client =
    queryClient ||
    new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const defaultEquipment = {
  _id: '1',
  title: 'Equipment 1',
  description: 'Test',
  listingType: 'auction' as const,
  status: 'active' as const,
  make: 'make',
  models: 'model',
  year: 2025,
  location: { address: '123', city: 'City', state: 'State', country: 'Country', zipCode: '12345' },
  viewCount: 0,
  inquiryCount: 0,
  isFeatured: false,
  isDeleted: false,
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============================================================
// EQUIPMENT QUERY HOOKS
// ============================================================
describe('Equipment Query Hooks', () => {
  it('useEquipment - success', async () => {
    vi.mocked(equipmentApi.getEquipment).mockResolvedValue({
      items: [defaultEquipment],
      pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });
    const { result } = renderHook(() => useEquipment(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(equipmentApi.getEquipment).toHaveBeenCalled();
  });

  it('useEquipmentById - disabled when id empty', () => {
    renderHook(() => useEquipmentById(''), { wrapper: createWrapper() });
    expect(equipmentApi.getEquipmentById).not.toHaveBeenCalled();
  });

  it('useEquipmentById - success', async () => {
    vi.mocked(equipmentApi.getEquipmentById).mockResolvedValue({
      data: defaultEquipment,
      success: true,
      message: 'ok',
    });
    const { result } = renderHook(() => useEquipmentById('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(equipmentApi.getEquipmentById).toHaveBeenCalledWith('1');
  });
});

// ============================================================
// MUTATION HOOKS: CREATE, UPDATE, APPROVE, REJECT, DELETE
// ============================================================
describe('Equipment Mutation Hooks', () => {
  it('useCreateEquipment - success', async () => {
    vi.mocked(equipmentApi.createEquipment).mockResolvedValue({
      data: defaultEquipment,
      success: true,
      message: 'Created',
    });
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useCreateEquipment(), {
      wrapper: createWrapper(queryClient),
    });

    const mockInput: CreateEquipmentDto = { ...defaultEquipment, categoryId: '1', sellerId: '1' };
    await act(async () => {
      await result.current.mutateAsync(mockInput);
    });

    expect(equipmentApi.createEquipment).toHaveBeenCalledWith(mockInput);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment'] });
  });

  it('useUpdateEquipment - success', async () => {
    vi.mocked(equipmentApi.updateEquipment).mockResolvedValue({
      data: defaultEquipment,
      success: true,
      message: 'Updated',
    });
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useUpdateEquipment(), {
      wrapper: createWrapper(queryClient),
    });

    const mockInput: UpdateEquipmentDto = {
      title: 'Updated',
      description: 'Updated equipment description',
    };
    await act(async () => {
      await result.current.mutateAsync({ id: '1', data: mockInput });
    });

    expect(equipmentApi.updateEquipment).toHaveBeenCalledWith('1', mockInput);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment', '1'] });
  });

  it('useApproveEquipment - success', async () => {
    vi.mocked(equipmentApi.approveEquipment).mockResolvedValue({
      data: defaultEquipment,
      success: true,
      message: 'Approved',
    });
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useApproveEquipment(), {
      wrapper: createWrapper(queryClient),
    });

    const mockInput: ApproveEquipmentDto = { isPublished: true };
    await act(async () => {
      await result.current.mutateAsync({ id: '1', data: mockInput });
    });

    expect(equipmentApi.approveEquipment).toHaveBeenCalledWith('1', mockInput);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment', '1'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment', 'pending-approvals'] });
  });

  it('useBulkApproveEquipment - success', async () => {
    const mockResponse: ApiResponse<{ approved: number }> = {
      data: { approved: 2 },
      success: true,
      message: 'Bulk approved successfully',
    };
    vi.mocked(equipmentApi.bulkApprove).mockResolvedValue(mockResponse);

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useBulkApproveEquipment(), {
      wrapper: createWrapper(queryClient),
    });

    const mockInput: BulkApproveDto = { equipmentIds: ['1', '2'], isPublished: true };
    await act(async () => {
      await result.current.mutateAsync(mockInput);
    });

    expect(equipmentApi.bulkApprove).toHaveBeenCalledWith(mockInput);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment', 'pending-approvals'] });
  });

  it('useRejectEquipment - success', async () => {
    vi.mocked(equipmentApi.rejectEquipment).mockResolvedValue({
      data: defaultEquipment,
      success: true,
      message: 'Rejected',
    });
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useRejectEquipment(), {
      wrapper: createWrapper(queryClient),
    });

    const mockInput: RejectEquipmentDto = { rejectionReason: 'Invalid' };
    await act(async () => {
      await result.current.mutateAsync({ id: '1', data: mockInput });
    });

    expect(equipmentApi.rejectEquipment).toHaveBeenCalledWith('1', mockInput);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment', '1'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment', 'pending-approvals'] });
  });

  it('useDeleteEquipment - success', async () => {
    vi.mocked(equipmentApi.deleteEquipment).mockResolvedValue({
      data: undefined,
      success: true,
      message: 'Deleted',
    });
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useDeleteEquipment(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(equipmentApi.deleteEquipment).toHaveBeenCalledWith('1');
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment'] });
  });

  it('usePendingApprovals - success', async () => {
    vi.mocked(equipmentApi.getPendingApprovals).mockResolvedValue({
      items: [defaultEquipment],
      pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });
    const { result } = renderHook(() => usePendingApprovals(1, 10), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(equipmentApi.getPendingApprovals).toHaveBeenCalledWith(1, 10);
  });
});

// ============================================================
// ERROR BRANCH COVERAGE
// ============================================================
describe('Error Branch Coverage', () => {
  it('createEquipment error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(equipmentApi.createEquipment).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useCreateEquipment(), { wrapper: createWrapper() });
    const mockInput: CreateEquipmentDto = { ...defaultEquipment, categoryId: '1', sellerId: '1' };
    await expect(result.current.mutateAsync(mockInput)).rejects.toThrow('Fail');
    expect(spy).toHaveBeenCalled();
  });

  it('updateEquipment error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(equipmentApi.updateEquipment).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useUpdateEquipment(), { wrapper: createWrapper() });
    const mockInput = { title: 'Updated' };
    await expect(result.current.mutateAsync({ id: '1', data: mockInput })).rejects.toThrow('Fail');
    expect(spy).toHaveBeenCalled();
  });

  it('approveEquipment error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(equipmentApi.approveEquipment).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useApproveEquipment(), { wrapper: createWrapper() });
    const mockInput: ApproveEquipmentDto = { isPublished: true };
    await expect(result.current.mutateAsync({ id: '1', data: mockInput })).rejects.toThrow('Fail');
    expect(spy).toHaveBeenCalled();
  });

  it('bulkApproveEquipment error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(equipmentApi.bulkApprove).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useBulkApproveEquipment(), { wrapper: createWrapper() });
    const mockInput: BulkApproveDto = { equipmentIds: ['1', '2'], isPublished: true };
    await expect(result.current.mutateAsync(mockInput)).rejects.toThrow('Fail');
    expect(spy).toHaveBeenCalled();
  });

  it('rejectEquipment error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(equipmentApi.rejectEquipment).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useRejectEquipment(), { wrapper: createWrapper() });
    const mockInput: RejectEquipmentDto = { rejectionReason: 'Invalid' };
    await expect(result.current.mutateAsync({ id: '1', data: mockInput })).rejects.toThrow('Fail');
    expect(spy).toHaveBeenCalled();
  });

  it('deleteEquipment error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(equipmentApi.deleteEquipment).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useDeleteEquipment(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync('1')).rejects.toThrow('Fail');
    expect(spy).toHaveBeenCalled();
  });

  it('useEquipment - error', async () => {
    vi.mocked(equipmentApi.getEquipment).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useEquipment(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Fail');
  });

  it('useEquipmentById - error', async () => {
    vi.mocked(equipmentApi.getEquipmentById).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useEquipmentById('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Fail');
  });

  it('usePendingApprovals - error', async () => {
    vi.mocked(equipmentApi.getPendingApprovals).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => usePendingApprovals(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Fail');
  });
});
