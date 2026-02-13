import { describe, it, expect } from 'vitest';
import { normalizeApiError, getUserFriendlyMessage } from './errorHandler';
import type { AxiosError } from 'axios';

describe('errorHandler', () => {
  describe('normalizeApiError', () => {
    it('should normalize Axios error with response', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {
            message: 'Resource not found',
            code: 'NOT_FOUND',
          },
        },
      } as unknown as AxiosError;

      const result = normalizeApiError(error);
      expect(result).toEqual({
        message: 'Resource not found',
        statusCode: 404,
        code: 'NOT_FOUND',
        details: error.response?.data,
      });
    });

    it('should normalize Axios error without response', () => {
      const error = {
        isAxiosError: true,
        message: 'Network error',
      } as unknown as AxiosError;

      const result = normalizeApiError(error);
      expect(result).toEqual({
        message: 'Network error',
      });
    });

    it('should normalize standard Error', () => {
      const error = new Error('Something went wrong');
      const result = normalizeApiError(error);
      expect(result).toEqual({
        message: 'Something went wrong',
      });
    });

    it('should normalize string error', () => {
      const error = 'String error';
      const result = normalizeApiError(error);
      expect(result).toEqual({
        message: 'String error',
      });
    });

    it('should handle unknown error', () => {
      const error = null;
      const result = normalizeApiError(error);
      expect(result).toEqual({
        message: 'An unexpected error occurred. Please try again.',
      });
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return user-friendly message for 401', () => {
      const error = { message: 'Unauthorized', statusCode: 401 };
      const result = getUserFriendlyMessage(error);
      expect(result).toBe('Your session has expired. Please log in again.');
    });

    it('should return user-friendly message for 403', () => {
      const error = { message: 'Forbidden', statusCode: 403 };
      const result = getUserFriendlyMessage(error);
      expect(result).toBe('You do not have permission to perform this action.');
    });

    it('should return user-friendly message for 404', () => {
      const error = { message: 'Not found', statusCode: 404 };
      const result = getUserFriendlyMessage(error);
      expect(result).toBe('The requested resource was not found.');
    });

    it('should return user-friendly message for 500', () => {
      const error = { message: 'Server error', statusCode: 500 };
      const result = getUserFriendlyMessage(error);
      expect(result).toBe('A server error occurred. Please try again later.');
    });

    it('should return original message for unknown status codes', () => {
      const error = { message: 'Custom error', statusCode: 400 };
      const result = getUserFriendlyMessage(error);
      expect(result).toBe('Custom error');
    });
  });
});
