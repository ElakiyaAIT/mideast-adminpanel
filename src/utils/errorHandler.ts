import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../dto';

export interface NormalizedError {
  message: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
}

/**
 * Normalizes API errors into a consistent format
 */
export const normalizeApiError = (error: unknown): NormalizedError => {
  // Axios error
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const response = axiosError.response;

    if (response?.data) {
      return {
        message: response.data.message || 'An error occurred',
        statusCode: response.status,
        code: response.data.code,
        details: response.data,
      };
    }

    if (axiosError.message) {
      return {
        message: axiosError.message,
        statusCode: axiosError.response?.status,
      };
    }
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  // Unknown error
  return {
    message: 'An unexpected error occurred. Please try again.',
  };
};

/**
 * Gets user-friendly error message from normalized error
 */
export const getUserFriendlyMessage = (error: NormalizedError): string => {
  const { message, statusCode } = error;

  // Map common HTTP status codes to user-friendly messages
  if (statusCode === 401) {
    return 'Your session has expired. Please log in again.';
  }

  if (statusCode === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (statusCode === 404) {
    return 'The requested resource was not found.';
  }

  if (statusCode === 429) {
    return 'Too many requests. Please try again later.';
  }

  if (statusCode === 500) {
    return 'A server error occurred. Please try again later.';
  }

  if (statusCode && statusCode >= 500) {
    return 'A server error occurred. Please try again later.';
  }

  return message;
};
