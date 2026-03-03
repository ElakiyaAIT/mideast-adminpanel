import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosError } from 'axios';
import type { ApiResponse, ApiErrorResponse } from '../../dto';

import {
  handleSuccess,
  handleCreateSuccess,
  handleUpdateSuccess,
  handleDeleteSuccess,
  handleError,
  handleValidationError,
  handleAuthError,
  handleNetworkError,
  withErrorHandler,
  withMutationHandler,
  handleFormSubmit,
} from '../../utils/responseHandler';

import * as errorHandler from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import type { NormalizedError } from '../../utils/errorHandler';

// ===========================
// MOCKS
// ===========================

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('./errorHandler', () => ({
  normalizeApiError: vi.fn(),
  getUserFriendlyMessage: vi.fn(),
}));

// ===========================
// TEST SETUP
// ===========================

beforeEach(() => {
  vi.clearAllMocks();
});

// ===========================
// SUCCESS HANDLERS
// ===========================

describe('Success Handlers', () => {
  const mockResponse: ApiResponse<{ id: number }> = {
    data: { id: 1 },
    success: true,
    message: 'Success message',
  };

  it('handleSuccess should return success result and show toast', () => {
    const result = handleSuccess(mockResponse);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 1 });
    expect(toast.success).toHaveBeenCalledWith('Success message', { duration: 3000 });
  });

  it('handleCreateSuccess should show entity specific message', () => {
    handleCreateSuccess(mockResponse, 'User');

    expect(toast.success).toHaveBeenCalledWith('User created successfully', { duration: 3000 });
  });

  it('handleUpdateSuccess should show update message', () => {
    handleUpdateSuccess(mockResponse, 'Product');

    expect(toast.success).toHaveBeenCalledWith('Product updated successfully', { duration: 3000 });
  });

  it('handleDeleteSuccess should show delete message', () => {
    handleDeleteSuccess(mockResponse, 'Item');

    expect(toast.success).toHaveBeenCalledWith('Item deleted successfully', { duration: 3000 });
  });
});

// ===========================
// ERROR HANDLERS
// ===========================

describe('Error Handlers', () => {
  it('handleError should normalize error and show toast', () => {
    const mockError = new Error('Server error');

    vi.spyOn(errorHandler, 'normalizeApiError').mockReturnValue({
      message: 'Internal server error',
      statusCode: 500,
    });

    vi.spyOn(errorHandler, 'getUserFriendlyMessage').mockReturnValue('Something went wrong');

    const result = handleError(mockError);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Something went wrong');
    expect(result.statusCode).toBe(500);
    expect(toast.error).toHaveBeenCalledWith('Something went wrong', { duration: 4000 });
  });

  it('handleAuthError should use fallback message', () => {
    const mockError = new Error('Unauthorized');
    const normalized: NormalizedError = {
      message: 'Unauthorized',
      statusCode: 401,
    };
    vi.spyOn(errorHandler, 'normalizeApiError').mockReturnValue(normalized);
    vi.spyOn(errorHandler, 'getUserFriendlyMessage').mockReturnValue('');

    handleAuthError(mockError);

    expect(toast.error).toHaveBeenCalledWith('Authentication failed. Please try again.', {
      duration: 4000,
    });
  });

  it('handleNetworkError should detect network errors', () => {
    const networkError = new Error('Network Error');
    const normalized: NormalizedError = {
      message: 'Network Error',
      statusCode: undefined,
    };
    vi.spyOn(errorHandler, 'normalizeApiError').mockReturnValue(normalized);
    vi.spyOn(errorHandler, 'getUserFriendlyMessage').mockReturnValue('');

    handleNetworkError(networkError);

    expect(toast.error).toHaveBeenCalledWith(
      'Network error. Please check your connection and try again.',
      { duration: 4000 },
    );
  });
});

// ===========================
// VALIDATION ERROR HANDLER
// ===========================

describe('handleValidationError', () => {
  it('should return validation errors from axios response', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: 'Validation failed',
          statusCode: 400,
          code: 'VALIDATION_ERROR',
          errors: {
            email: ['Email is required'],
          },
        },
      },
    } as unknown as AxiosError<ApiErrorResponse>;

    const result = handleValidationError(axiosError);

    expect(result.success).toBe(false);

    expect(result.validationErrors).toEqual({
      email: ['Email is required'],
    });

    expect(toast.error).toHaveBeenCalledWith('Email is required', { duration: 4000 });
  });
});

// ===========================
// WRAPPER HANDLERS
// ===========================

describe('withErrorHandler', () => {
  it('should return success result when API resolves', async () => {
    const apiCall = vi.fn<() => Promise<ApiResponse<number>>>().mockResolvedValue({
      success: true,
      data: 123,
    });

    const result = await withErrorHandler(apiCall);

    expect(result.success).toBe(true);
    expect(result.data).toBe(123);
  });

  it('should handle error when API rejects', async () => {
    const apiCall = vi
      .fn<() => Promise<ApiResponse<number>>>()
      .mockRejectedValue(new Error('Failed'));

    vi.spyOn(errorHandler, 'normalizeApiError').mockReturnValue({
      message: 'Failed',
      statusCode: 500,
    } satisfies NormalizedError);
    vi.spyOn(errorHandler, 'getUserFriendlyMessage').mockReturnValue('API failed');

    const result = await withErrorHandler(apiCall);

    expect(result.success).toBe(false);
    expect(result.error).toBe('API failed');
  });
});

describe('withMutationHandler', () => {
  it('should call handleSuccess on resolve', async () => {
    const apiCall = vi.fn<() => Promise<ApiResponse<string>>>().mockResolvedValue({
      success: true,
      data: 'ok',
    });

    const result = await withMutationHandler(apiCall);

    expect(result.success).toBe(true);
    expect(result.data).toBe('ok');
    expect(toast.success).toHaveBeenCalled();
  });
});

describe('handleFormSubmit', () => {
  it('should handle create success', async () => {
    const submitFn = vi
      .fn<() => Promise<ApiResponse<string>>>()
      .mockResolvedValue({ data: 'created', success: true });

    const result = await handleFormSubmit(submitFn, 'User');

    expect(result.success).toBe(true);
    expect(toast.success).toHaveBeenCalledWith('User created successfully', { duration: 3000 });
  });

  it('should handle validation error on reject', async () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: 'Validation failed',
          statusCode: 400,
          code: 'VALIDATION_ERROR',
          errors: {
            name: ['Name is required'],
          },
        },
      },
    } as unknown as AxiosError<ApiErrorResponse>;

    const submitFn: () => Promise<ApiResponse<string>> = vi.fn().mockRejectedValue(axiosError);

    const result = await handleFormSubmit(submitFn, 'User');

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        (
          result as typeof result & {
            validationErrors?: Record<string, string[]>;
          }
        ).validationErrors,
      ).toEqual({
        name: ['Name is required'],
      });
    }
  });
});
