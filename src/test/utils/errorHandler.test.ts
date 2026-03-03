import { describe, it, expect } from 'vitest';
import type { AxiosError } from 'axios';
import {
  normalizeApiError,
  getUserFriendlyMessage,
  type NormalizedError,
} from '../../utils/errorHandler';

describe('normalizeApiError', () => {
  it('normalizes axios error with response data', () => {
    const axiosError = {
      isAxiosError: true,
      message: 'Request failed',
      response: {
        status: 400,
        data: {
          message: 'Invalid input',
          code: 'VALIDATION_ERROR',
        },
      },
    } as AxiosError;

    const result = normalizeApiError(axiosError);

    expect(result).toEqual({
      message: 'Invalid input',
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details: {
        message: 'Invalid input',
        code: 'VALIDATION_ERROR',
      },
    });
  });

  it('falls back to axios error message when no response data', () => {
    const axiosError = {
      isAxiosError: true,
      message: 'Network Error',
      response: undefined,
    } as AxiosError;

    const result = normalizeApiError(axiosError);

    expect(result).toEqual({
      message: 'Network Error',
      statusCode: undefined,
    });
  });

  it('normalizes standard Error instance', () => {
    const error = new Error('Something went wrong');

    const result = normalizeApiError(error);

    expect(result).toEqual({
      message: 'Something went wrong',
    });
  });

  it('normalizes string error', () => {
    const result = normalizeApiError('Simple error');

    expect(result).toEqual({
      message: 'Simple error',
    });
  });

  it('returns default message for unknown error type', () => {
    const result = normalizeApiError({ foo: 'bar' });

    expect(result).toEqual({
      message: 'An unexpected error occurred. Please try again.',
    });
  });

  it('uses default message if axios response has no message', () => {
    const axiosError = {
      isAxiosError: true,
      message: 'Request failed',
      response: {
        status: 400,
        data: {},
      },
    } as AxiosError;

    const result = normalizeApiError(axiosError);

    expect(result).toEqual({
      message: 'An error occurred',
      statusCode: 400,
      code: undefined,
      details: {},
    });
  });
});

describe('getUserFriendlyMessage', () => {
  it('returns custom message for 401', () => {
    const error: NormalizedError = {
      message: 'Unauthorized',
      statusCode: 401,
    };

    expect(getUserFriendlyMessage(error)).toBe('Your session has expired. Please log in again.');
  });

  it('returns custom message for 403', () => {
    const error: NormalizedError = {
      message: 'Forbidden',
      statusCode: 403,
    };

    expect(getUserFriendlyMessage(error)).toBe(
      'You do not have permission to perform this action.',
    );
  });

  it('returns custom message for 404', () => {
    const error: NormalizedError = {
      message: 'Not Found',
      statusCode: 404,
    };

    expect(getUserFriendlyMessage(error)).toBe('The requested resource was not found.');
  });

  it('returns custom message for 429', () => {
    const error: NormalizedError = {
      message: 'Too many requests',
      statusCode: 429,
    };

    expect(getUserFriendlyMessage(error)).toBe('Too many requests. Please try again later.');
  });

  it('returns custom message for 500', () => {
    const error: NormalizedError = {
      message: 'Server error',
      statusCode: 500,
    };

    expect(getUserFriendlyMessage(error)).toBe('A server error occurred. Please try again later.');
  });

  it('returns generic server message for status >= 500', () => {
    const error: NormalizedError = {
      message: 'Bad gateway',
      statusCode: 502,
    };

    expect(getUserFriendlyMessage(error)).toBe('A server error occurred. Please try again later.');
  });

  it('returns original message for non-mapped status codes', () => {
    const error: NormalizedError = {
      message: 'Bad request',
      statusCode: 400,
    };

    expect(getUserFriendlyMessage(error)).toBe('Bad request');
  });

  it('returns original message when no status code', () => {
    const error: NormalizedError = {
      message: 'Custom error',
    };

    expect(getUserFriendlyMessage(error)).toBe('Custom error');
  });
});
