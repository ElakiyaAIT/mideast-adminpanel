import { vi } from 'vitest';
import React from 'react';

// ============================================================
// MOCKS
// ============================================================

vi.mock('../../api/testimonialApi', () => ({
  testimonialApi: {
    getTestimonials: vi.fn(),
    createTestimonial: vi.fn(),
    updateTestimonial: vi.fn(),
    deleteTestimonial: vi.fn(),
  },
}));

vi.mock('../../utils', () => ({
  showToast: {
    success: vi.fn(),
  },
}));

// ============================================================
// IMPORTS
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from '../../hooks/queries/useTestimonial'; // <-- adjust path

import { testimonialApi } from '../../api/testimonialApi';
import { showToast } from '../../utils';
import type { PaginatedResponseDto } from '../../dto';
import type {
  TestimonialDto,
  CreateTestimonialDto,
  UpdateTestimonialDto,
  FilterTestimonialDto,
} from '../../dto/testimonial.dto';

// ============================================================
// TEST WRAPPER
// ============================================================

const createWrapper = (queryClient?: QueryClient) => {
  const client =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================================
// SHARED MOCK DATA
// ============================================================

const mockTestimonials: PaginatedResponseDto<TestimonialDto> = {
  items: [
    {
      _id: '1',
      name: 'John Doe',
      review: 'Great!',
      role: 'Project Manager',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  },
};

const mockCreatePayload: CreateTestimonialDto = {
  name: 'Jane Doe',
  review: 'Awesome!',
  role: 'Project Manager',
};
const mockUpdatePayload: UpdateTestimonialDto = { review: 'Updated message' };

// ============================================================
// useTestimonials (QUERY)
// ============================================================

describe('useTestimonials', () => {
  it('should fetch testimonials successfully', async () => {
    vi.mocked(testimonialApi.getTestimonials).mockResolvedValue(mockTestimonials);

    const { result } = renderHook(() => useTestimonials(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(testimonialApi.getTestimonials).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockTestimonials);
  });

  it('should pass filters to API', async () => {
    const filters: FilterTestimonialDto = { page: 1, limit: 10 };

    vi.mocked(testimonialApi.getTestimonials).mockResolvedValue(mockTestimonials);

    const { result } = renderHook(() => useTestimonials(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(testimonialApi.getTestimonials).toHaveBeenCalledWith(filters);
  });
});

// ============================================================
// useCreateTestimonial
// ============================================================

describe('useCreateTestimonial', () => {
  it('should create testimonial, invalidate cache and show toast', async () => {
    vi.mocked(testimonialApi.createTestimonial).mockResolvedValue({
      success: true,
      data: { _id: '2', ...mockCreatePayload, createdAt: '', updatedAt: '', image: undefined },
    });
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateTestimonial(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(mockCreatePayload);
    });

    expect(testimonialApi.createTestimonial).toHaveBeenCalledWith(mockCreatePayload);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['testimonials'],
    });

    expect(showToast.success).toHaveBeenCalledWith('Testimonial Created Successfully');
  });
});

// ============================================================
// useUpdateTestimonial
// ============================================================

describe('useUpdateTestimonial', () => {
  it('should update testimonial, invalidate cache and show toast', async () => {
    vi.mocked(testimonialApi.updateTestimonial).mockResolvedValue({
      success: true,
      data: {
        _id: '1',
        name: 'John Doe',
        role: 'Project Manager',
        review: 'Updated message',
        createdAt: '',
        updatedAt: '',
      },
    });
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateTestimonial(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({ id: '1', data: mockUpdatePayload });
    });

    expect(testimonialApi.updateTestimonial).toHaveBeenCalledWith('1', mockUpdatePayload);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['testimonials'],
    });

    expect(showToast.success).toHaveBeenCalledWith('Testimonial Updated Successfully');
  });
});

// ============================================================
// useDeleteTestimonial
// ============================================================

describe('useDeleteTestimonial', () => {
  it('should delete testimonial, invalidate cache and show toast', async () => {
    vi.mocked(testimonialApi.deleteTestimonial).mockResolvedValue({
      success: true,
      data: undefined,
    });

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useDeleteTestimonial(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(testimonialApi.deleteTestimonial).toHaveBeenCalledWith('1');

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['testimonials'],
    });

    expect(showToast.success).toHaveBeenCalledWith('Testimonial Deleted Successfully');
  });
});
