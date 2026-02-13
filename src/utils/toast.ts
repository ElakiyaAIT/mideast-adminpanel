import toast, { type ToastOptions } from 'react-hot-toast';

export const showToast = {
  success: (message: string, options?: ToastOptions): string => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
    });
  },

  error: (message: string, options?: ToastOptions): string => {
    return toast.error(message, {
      duration: 5000,
      position: 'top-right',
      ...options,
    });
  },

  warning: (message: string, options?: ToastOptions): string => {
    return toast(message, {
      icon: '⚠️',
      duration: 4000,
      position: 'top-right',
      ...options,
    });
  },

  info: (message: string, options?: ToastOptions): string => {
    return toast(message, {
      icon: 'ℹ️',
      duration: 4000,
      position: 'top-right',
      ...options,
    });
  },
};

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const apiError = error as { response?: { data?: { message?: string } }; message?: string };
    return (
      apiError.response?.data?.message ||
      apiError.message ||
      'An unexpected error occurred. Please try again.'
    );
  }

  return 'An unexpected error occurred. Please try again.';
};
