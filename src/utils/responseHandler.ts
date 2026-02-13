import type { AxiosError } from 'axios';
import type { ApiResponse, ApiErrorResponse } from '../dto';
import { normalizeApiError, getUserFriendlyMessage } from './errorHandler';
import toast from 'react-hot-toast';

// ===========================
// TYPES
// ===========================

export interface SuccessHandlerOptions {
  showToast?: boolean;
  toastMessage?: string;
  toastDuration?: number;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  fallbackMessage?: string;
  toastDuration?: number;
}

export interface ApiHandlerResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

// ===========================
// SUCCESS HANDLERS
// ===========================

/**
 * Handles successful API responses consistently
 * @param response - The API response
 * @param options - Success handling options
 * @returns Normalized success result
 */
export const handleSuccess = <T>(
  response: ApiResponse<T>,
  options: SuccessHandlerOptions = {},
): ApiHandlerResult<T> => {
  const { showToast = true, toastMessage, toastDuration = 3000 } = options;

  if (showToast) {
    const message = toastMessage || response.message || 'Operation completed successfully';
    toast.success(message, { duration: toastDuration });
  }

  return {
    success: true,
    data: response.data,
  };
};

/**
 * Handles successful creation operations
 * @param response - The API response
 * @param entityName - Name of the created entity (e.g., 'User', 'Product')
 * @param options - Success handling options
 * @returns Normalized success result
 */
export const handleCreateSuccess = <T>(
  response: ApiResponse<T>,
  entityName: string,
  options: SuccessHandlerOptions = {},
): ApiHandlerResult<T> => {
  return handleSuccess(response, {
    ...options,
    toastMessage: options.toastMessage || `${entityName} created successfully`,
  });
};

/**
 * Handles successful update operations
 * @param response - The API response
 * @param entityName - Name of the updated entity
 * @param options - Success handling options
 * @returns Normalized success result
 */
export const handleUpdateSuccess = <T>(
  response: ApiResponse<T>,
  entityName: string,
  options: SuccessHandlerOptions = {},
): ApiHandlerResult<T> => {
  return handleSuccess(response, {
    ...options,
    toastMessage: options.toastMessage || `${entityName} updated successfully`,
  });
};

/**
 * Handles successful delete operations
 * @param response - The API response
 * @param entityName - Name of the deleted entity
 * @param options - Success handling options
 * @returns Normalized success result
 */
export const handleDeleteSuccess = <T>(
  response: ApiResponse<T>,
  entityName: string,
  options: SuccessHandlerOptions = {},
): ApiHandlerResult<T> => {
  return handleSuccess(response, {
    ...options,
    toastMessage: options.toastMessage || `${entityName} deleted successfully`,
  });
};

// ===========================
// ERROR HANDLERS
// ===========================

/**
 * Handles API errors consistently
 * @param error - The error object
 * @param options - Error handling options
 * @returns Normalized error result
 */
export const handleError = (
  error: unknown,
  options: ErrorHandlerOptions = {},
): ApiHandlerResult<never> => {
  const { showToast = true, fallbackMessage, toastDuration = 4000 } = options;

  const normalizedError = normalizeApiError(error);
  const userMessage = getUserFriendlyMessage(normalizedError);
  const errorMessage = fallbackMessage || userMessage;

  if (showToast) {
    toast.error(errorMessage, { duration: toastDuration });
  }

  return {
    success: false,
    error: errorMessage,
    statusCode: normalizedError.statusCode,
  };
};

/**
 * Handles validation errors with field-specific messages
 * @param error - The error object
 * @param options - Error handling options
 * @returns Normalized error result with validation details
 */
export const handleValidationError = (
  error: unknown,
  options: ErrorHandlerOptions = {},
): ApiHandlerResult<never> & { validationErrors?: Record<string, string[]> } => {
  const { showToast = true, toastDuration = 4000 } = options;

  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const validationErrors = axiosError.response?.data?.errors;

    if (validationErrors) {
      if (showToast) {
        // Show first validation error
        const firstField = Object.keys(validationErrors)[0];
        const firstError = validationErrors[firstField]?.[0];
        if (firstError) {
          toast.error(firstError, { duration: toastDuration });
        }
      }

      return {
        success: false,
        error: 'Validation failed',
        statusCode: axiosError.response?.status,
        validationErrors,
      };
    }
  }

  // Fallback to regular error handling
  return handleError(error, options);
};

/**
 * Handles authentication errors
 * @param error - The error object
 * @param options - Error handling options
 * @returns Normalized error result
 */
export const handleAuthError = (
  error: unknown,
  options: ErrorHandlerOptions = {},
): ApiHandlerResult<never> => {
  return handleError(error, {
    ...options,
    fallbackMessage: options.fallbackMessage || 'Authentication failed. Please try again.',
  });
};

/**
 * Handles network errors
 * @param error - The error object
 * @param options - Error handling options
 * @returns Normalized error result
 */
export const handleNetworkError = (
  error: unknown,
  options: ErrorHandlerOptions = {},
): ApiHandlerResult<never> => {
  // Check if it's a network error
  const isNetworkError =
    error instanceof Error &&
    (error.message.includes('Network Error') || error.message.includes('timeout'));

  if (isNetworkError) {
    return handleError(error, {
      ...options,
      fallbackMessage:
        options.fallbackMessage || 'Network error. Please check your connection and try again.',
    });
  }

  return handleError(error, options);
};

// ===========================
// COMBINED HANDLERS
// ===========================

/**
 * Wraps an API call with standardized error handling
 * @param apiCall - The API call function
 * @param options - Error handling options
 * @returns Promise with normalized result
 */
export const withErrorHandler = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: ErrorHandlerOptions = {},
): Promise<ApiHandlerResult<T>> => {
  try {
    const response = await apiCall();
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleError(error, options);
  }
};

/**
 * Wraps a mutation call with standardized success and error handling
 * @param apiCall - The mutation function
 * @param successOptions - Success handling options
 * @param errorOptions - Error handling options
 * @returns Promise with normalized result
 */
export const withMutationHandler = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  successOptions: SuccessHandlerOptions = {},
  errorOptions: ErrorHandlerOptions = {},
): Promise<ApiHandlerResult<T>> => {
  try {
    const response = await apiCall();
    return handleSuccess(response, successOptions);
  } catch (error) {
    return handleError(error, errorOptions);
  }
};

/**
 * Handles form submission with validation and error handling
 * @param submitFn - The form submission function
 * @param entityName - Name of the entity being submitted
 * @param isUpdate - Whether this is an update operation
 * @returns Promise with normalized result
 */
export const handleFormSubmit = async <T>(
  submitFn: () => Promise<ApiResponse<T>>,
  entityName: string,
  isUpdate = false,
): Promise<ApiHandlerResult<T>> => {
  try {
    const response = await submitFn();
    return isUpdate
      ? handleUpdateSuccess(response, entityName)
      : handleCreateSuccess(response, entityName);
  } catch (error) {
    return handleValidationError(error);
  }
};
