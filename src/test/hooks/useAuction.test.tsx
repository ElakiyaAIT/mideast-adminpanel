import { vi } from 'vitest';
import React from 'react';

// ✅ MOCK EXACT SAME PATH AS HOOK
vi.mock('../../api', () => ({
  auctionApi: {
    getAuctions: vi.fn(),
    getAuction: vi.fn(),
    getAuctionEquipment: vi.fn(),
    getAuctionBids: vi.fn(),
    createAuction: vi.fn(),
    updateAuction: vi.fn(),
    assignEquipment: vi.fn(),
    cancelAuction: vi.fn(),
    deleteAuction: vi.fn(),
  },
}));

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  useAuctions,
  useAuction,
  useAuctionEquipment,
  useAuctionBids,
  useCreateAuction,
  useUpdateAuction,
  useAssignEquipment,
  useCancelAuction,
  useDeleteAuction,
} from '../../hooks/queries/useAuction';
import type {
  AuctionDto,
  CreateAuctionDto,
  UpdateAuctionDto,
  AssignEquipmentDto,
  BidDto,
  EquipmentDto,
  ApiResponse,
} from '../../dto';
import { CreatePaginatedResponse } from '../../test/test.utils';

import { auctionApi } from '../../api';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Auction Query Hooks', () => {
  it('useAuctions - success', async () => {
    const mockData = CreatePaginatedResponse<AuctionDto>();
    vi.mocked(auctionApi.getAuctions).mockResolvedValue(mockData);

    const { result } = renderHook(() => useAuctions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auctionApi.getAuctions).toHaveBeenCalled();
  });

  it('useAuction - enabled false when id empty', () => {
    renderHook(() => useAuction(''), { wrapper: createWrapper() });

    expect(auctionApi.getAuction).not.toHaveBeenCalled();
  });

  it('useAuction - success', async () => {
    const mockData = CreatePaginatedResponse<AuctionDto>();
    vi.mocked(auctionApi.getAuction).mockResolvedValue(mockData);

    const { result } = renderHook(() => useAuction('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auctionApi.getAuction).toHaveBeenCalledWith('1');
  });

  it('useAuctionEquipment - success', async () => {
    const mockData: ApiResponse<EquipmentDto[]> = { success: true, data: [] };
    vi.mocked(auctionApi.getAuctionEquipment).mockResolvedValue(mockData);

    const { result } = renderHook(() => useAuctionEquipment('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auctionApi.getAuctionEquipment).toHaveBeenCalledWith('1');
  });

  it('useAuctionBids - success', async () => {
    const mockData: ApiResponse<BidDto[]> = { success: true, data: [] };
    vi.mocked(auctionApi.getAuctionBids).mockResolvedValue(mockData);

    const { result } = renderHook(() => useAuctionBids('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auctionApi.getAuctionBids).toHaveBeenCalledWith('1');
  });

  it('useAuctions - error', async () => {
    vi.mocked(auctionApi.getAuctions).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAuctions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('useAuction - error', async () => {
    vi.mocked(auctionApi.getAuction).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAuction('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('useAuctionEquipment - error', async () => {
    vi.mocked(auctionApi.getAuctionEquipment).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAuctionEquipment('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('useAuctionBids - error', async () => {
    vi.mocked(auctionApi.getAuctionBids).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAuctionBids('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});

describe('Auction Mutation Hooks', () => {
  it('useCreateAuction - success', async () => {
    const input: CreateAuctionDto = {
      title: 'Test Auction',
      description: 'Test description',
      type: 'online',
      startDate: '2026-01-01T00:00:00Z',
      endDate: '2026-01-02T00:00:00Z',
    };
    vi.mocked(auctionApi.createAuction).mockResolvedValue({
      success: true,
      data: {
        _id: '1',
        title: 'Test',
        description: 'Test auction',
        type: 'online',
        status: 'scheduled',
        equipmentCount: 0,
        totalBids: 0,
        isDeleted: false,
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-02T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    });

    const { result } = renderHook(() => useCreateAuction(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(input);
    expect(auctionApi.createAuction).toHaveBeenCalled();
  });

  it('useUpdateAuction - success', async () => {
    const data: UpdateAuctionDto = { title: 'Updated' };
    vi.mocked(auctionApi.updateAuction).mockResolvedValue({
      success: true,
      data: {
        _id: '1',
        title: 'Updated',
        description: 'Test auction',
        type: 'online',
        status: 'scheduled',
        equipmentCount: 0,
        totalBids: 0,
        isDeleted: false,
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-02T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    });

    const { result } = renderHook(() => useUpdateAuction(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ id: '1', data });
    });

    expect(auctionApi.updateAuction).toHaveBeenCalledWith('1', {
      title: 'Updated',
    });
  });

  it('useAssignEquipment - success', async () => {
    const data: AssignEquipmentDto = { equipmentIds: ['eq1'] };
    vi.mocked(auctionApi.assignEquipment).mockResolvedValue({
      success: true,
      data: { assigned: data.equipmentIds.length },
    });

    const { result } = renderHook(() => useAssignEquipment(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ id: '1', data });
    });

    expect(auctionApi.assignEquipment).toHaveBeenCalled();
  });

  it('useCancelAuction - success', async () => {
    const mockAuction: AuctionDto = {
      _id: '1',
      title: 'Cancelled Auction',
      description: 'Test auction',
      type: 'online',
      status: 'cancelled',
      startDate: '2026-01-01T00:00:00Z',
      endDate: '2026-01-02T00:00:00Z',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      equipmentCount: 0,
      totalBids: 0,
      isDeleted: false,
    };
    vi.mocked(auctionApi.cancelAuction).mockResolvedValue({
      success: true,
      data: mockAuction,
    });
    const { result } = renderHook(() => useCancelAuction(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(auctionApi.cancelAuction).toHaveBeenCalledWith('1');
  });

  it('useDeleteAuction - success', async () => {
    vi.mocked(auctionApi.deleteAuction).mockResolvedValue({ success: true, data: undefined });

    const { result } = renderHook(() => useDeleteAuction(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(auctionApi.deleteAuction).toHaveBeenCalledWith('1');
  });

  it('useCreateAuction - error', async () => {
    const input: CreateAuctionDto = {
      title: 'Test Auction',
      description: 'Test description',
      type: 'online',
      startDate: '2026-01-01T00:00:00Z',
      endDate: '2026-01-02T00:00:00Z',
    };
    vi.mocked(auctionApi.createAuction).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useCreateAuction(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync(input)).rejects.toThrow('API Error');
  });

  it('useUpdateAuction - error', async () => {
    const data: UpdateAuctionDto = { title: 'Updated' };
    vi.mocked(auctionApi.updateAuction).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useUpdateAuction(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync({ id: '1', data })).rejects.toThrow('API Error');
  });

  it('useAssignEquipment - error', async () => {
    const data: AssignEquipmentDto = { equipmentIds: ['eq1'] };
    vi.mocked(auctionApi.assignEquipment).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAssignEquipment(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync({ id: '1', data })).rejects.toThrow('API Error');
  });

  it('useCancelAuction - error', async () => {
    vi.mocked(auctionApi.cancelAuction).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useCancelAuction(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync('1')).rejects.toThrow('API Error');
  });

  it('useDeleteAuction - error', async () => {
    vi.mocked(auctionApi.deleteAuction).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useDeleteAuction(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync('1')).rejects.toThrow('API Error');
  });
});
