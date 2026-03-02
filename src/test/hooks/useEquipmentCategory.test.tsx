import { vi } from 'vitest';
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { equipmentCategoryApi } from '../../api';
import {
  useEquipmentCategories,
  useEquipmentCategory,
  useCreateEquipmentCategory,
  useUpdateEquipmentCategory,
  useDeleteEquipmentCategory,
  useRestoreEquipmentCategory,
} from '../../hooks/queries/useEquipment';
import type {
  CreateEquipmentCategoryDto,
  UpdateEquipmentCategoryDto,
} from '../../dto/equipment.dto';

vi.mock('../../api', () => ({
  equipmentCategoryApi: {
    getCategories: vi.fn(),
    getCategory: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    restoreCategory: vi.fn(),
  },
  equipmentApi: {
    getEquipment: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const createWrapper = (queryClient?: QueryClient) => {
  const client =
    queryClient ||
    new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const defaultCategory = {
  _id: '1',
  name: 'Test Category',
  description: 'A test category',
  slug: 'test',
  isDeleted: false,
  isActive: true,
  sortOrder: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============================================================
// EQUIPMENT CATEGORY QUERY HOOKS
// ============================================================
describe('Equipment Category Query Hooks', () => {
  it('useEquipmentCategories - success', async () => {
    vi.mocked(equipmentCategoryApi.getCategories).mockResolvedValue({
      items: [defaultCategory],
      pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });

    const { result } = renderHook(() => useEquipmentCategories(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(equipmentCategoryApi.getCategories).toHaveBeenCalled();
  });

  it('useEquipmentCategories - with params', async () => {
    const params = { page: 2, limit: 20, search: 'test' };
    vi.mocked(equipmentCategoryApi.getCategories).mockResolvedValue({
      items: [defaultCategory],
      pagination: { total: 1, page: 2, limit: 20, totalPages: 1 },
    });

    const { result } = renderHook(() => useEquipmentCategories(params), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(equipmentCategoryApi.getCategories).toHaveBeenCalledWith(params);
  });

  it('useEquipmentCategory - disabled when id empty', () => {
    renderHook(() => useEquipmentCategory(''), { wrapper: createWrapper() });
    expect(equipmentCategoryApi.getCategory).not.toHaveBeenCalled();
  });

  it('useEquipmentCategory - success', async () => {
    vi.mocked(equipmentCategoryApi.getCategory).mockResolvedValue({
      data: defaultCategory,
      success: true,
      message: 'ok',
    });

    const { result } = renderHook(() => useEquipmentCategory('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(equipmentCategoryApi.getCategory).toHaveBeenCalledWith('1');
  });
});

// ============================================================
// EQUIPMENT CATEGORY MUTATION HOOKS
// ============================================================
describe('Equipment Category Mutation Hooks', () => {
  it('useCreateEquipmentCategory - success', async () => {
    vi.mocked(equipmentCategoryApi.createCategory).mockResolvedValue({
      data: defaultCategory,
      success: true,
      message: 'Created',
    });

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useCreateEquipmentCategory(), {
      wrapper: createWrapper(queryClient),
    });

    const mockInput: CreateEquipmentCategoryDto = {
      name: 'Cat',
      description: 'Test category',
      slug: 'test',
    };

    await act(async () => {
      await result.current.mutateAsync(mockInput);
    });

    expect(equipmentCategoryApi.createCategory).toHaveBeenCalledWith(mockInput);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment-categories'] });
  });

  it('useUpdateEquipmentCategory - success', async () => {
    vi.mocked(equipmentCategoryApi.updateCategory).mockResolvedValue({
      data: defaultCategory,
      success: true,
      message: 'Updated',
    });

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useUpdateEquipmentCategory(), {
      wrapper: createWrapper(queryClient),
    });

    const mockInput: UpdateEquipmentCategoryDto = {
      name: 'Updated',
      description: 'Updated category description',
    };
    await act(async () => {
      await result.current.mutateAsync({ id: '1', data: mockInput });
    });

    expect(equipmentCategoryApi.updateCategory).toHaveBeenCalledWith('1', mockInput);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment-categories'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment-category', '1'] });
  });

  it('useDeleteEquipmentCategory - success', async () => {
    vi.mocked(equipmentCategoryApi.deleteCategory).mockResolvedValue({
      data: undefined,
      success: true,
      message: 'Deleted',
    });
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useDeleteEquipmentCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(equipmentCategoryApi.deleteCategory).toHaveBeenCalledWith('1');
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment-categories'] });
  });

  it('useRestoreEquipmentCategory - success', async () => {
    vi.mocked(equipmentCategoryApi.restoreCategory).mockResolvedValue({
      data: defaultCategory,
      success: true,
      message: 'Restored',
    });
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useRestoreEquipmentCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(equipmentCategoryApi.restoreCategory).toHaveBeenCalledWith('1');
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['equipment-categories'] });
  });
});

// ============================================================
// ERROR BRANCH COVERAGE
// ============================================================
describe('Equipment Category Error Branch Coverage', () => {
  it('useCreateEquipmentCategory - error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(equipmentCategoryApi.createCategory).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useCreateEquipmentCategory(), { wrapper: createWrapper() });
    const mockInput: CreateEquipmentCategoryDto = { name: 'Cat', slug: 'cat', description: '' };
    await expect(result.current.mutateAsync(mockInput)).rejects.toThrow('Fail');
    expect(spy).toHaveBeenCalled();
  });

  it('useUpdateEquipmentCategory - error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(equipmentCategoryApi.updateCategory).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useUpdateEquipmentCategory(), { wrapper: createWrapper() });
    const mockInput = { name: 'Updated' };
    await expect(result.current.mutateAsync({ id: '1', data: mockInput })).rejects.toThrow('Fail');
    expect(spy).toHaveBeenCalled();
  });

  it('useDeleteEquipmentCategory - error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(equipmentCategoryApi.deleteCategory).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useDeleteEquipmentCategory(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync('1')).rejects.toThrow('Fail');
    expect(spy).toHaveBeenCalled();
  });

  it('useRestoreEquipmentCategory - error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(equipmentCategoryApi.restoreCategory).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useRestoreEquipmentCategory(), {
      wrapper: createWrapper(),
    });
    await expect(result.current.mutateAsync('1')).rejects.toThrow('Fail');
    expect(spy).toHaveBeenCalled();
  });
});
