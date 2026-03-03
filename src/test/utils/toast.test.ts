import { describe, it, expect, vi, beforeEach } from 'vitest';
import toast from 'react-hot-toast';
import { showToast, getErrorMessage } from '../../utils/toast';

interface ToastMock {
  (message: string): string;
  success: (message: string) => string;
  error: (message: string) => string;
}

// Mock react-hot-toast
vi.mock('react-hot-toast', () => {
  const toast: ToastMock = Object.assign(
    vi.fn(() => 'toast-id'),
    {
      success: vi.fn(() => 'success-id'),
      error: vi.fn(() => 'error-id'),
    },
  );

  return {
    default: toast,
  };
});

describe('showToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('success', () => {
    it('calls toast.success with default options', () => {
      const id = showToast.success('Success message');

      expect(toast.success).toHaveBeenCalledWith('Success message', {
        duration: 4000,
        position: 'top-right',
      });

      expect(id).toBe('success-id');
    });

    it('merges custom options', () => {
      showToast.success('Success message', { duration: 1000 });

      expect(toast.success).toHaveBeenCalledWith('Success message', {
        duration: 1000,
        position: 'top-right',
      });
    });
  });

  describe('error', () => {
    it('calls toast.error with default options', () => {
      const id = showToast.error('Error message');

      expect(toast.error).toHaveBeenCalledWith('Error message', {
        duration: 5000,
        position: 'top-right',
      });

      expect(id).toBe('error-id');
    });

    it('merges custom options', () => {
      showToast.error('Error message', { position: 'bottom-left' });

      expect(toast.error).toHaveBeenCalledWith('Error message', {
        duration: 5000,
        position: 'bottom-left',
      });
    });
  });

  describe('warning', () => {
    it('calls toast with warning icon and defaults', () => {
      const id = showToast.warning('Warning message');

      expect(toast).toHaveBeenCalledWith('Warning message', {
        icon: '⚠️',
        duration: 4000,
        position: 'top-right',
      });

      expect(id).toBe('toast-id');
    });

    it('merges custom options', () => {
      showToast.warning('Warning message', { duration: 2000 });

      expect(toast).toHaveBeenCalledWith('Warning message', {
        icon: '⚠️',
        duration: 2000,
        position: 'top-right',
      });
    });
  });

  describe('info', () => {
    it('calls toast with info icon and defaults', () => {
      const id = showToast.info('Info message');

      expect(toast).toHaveBeenCalledWith('Info message', {
        icon: 'ℹ️',
        duration: 4000,
        position: 'top-right',
      });

      expect(id).toBe('toast-id');
    });

    it('merges custom options', () => {
      showToast.info('Info message', { position: 'bottom-center' });

      expect(toast).toHaveBeenCalledWith('Info message', {
        icon: 'ℹ️',
        duration: 4000,
        position: 'bottom-center',
      });
    });
  });
});

describe('getErrorMessage', () => {
  it('returns message from Error instance', () => {
    const error = new Error('Something went wrong');

    expect(getErrorMessage(error)).toBe('Something went wrong');
  });

  it('returns message from API error response', () => {
    const error = {
      response: {
        data: {
          message: 'API error occurred',
        },
      },
    };

    expect(getErrorMessage(error)).toBe('API error occurred');
  });

  it('falls back to error.message if no response message', () => {
    const error = {
      message: 'Fallback message',
    };

    expect(getErrorMessage(error)).toBe('Fallback message');
  });

  it('returns default message if object has no message', () => {
    const error = {};

    expect(getErrorMessage(error)).toBe('An unexpected error occurred. Please try again.');
  });

  it('returns default message for non-object, non-error values', () => {
    expect(getErrorMessage('string error')).toBe('An unexpected error occurred. Please try again.');

    expect(getErrorMessage(null)).toBe('An unexpected error occurred. Please try again.');

    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred. Please try again.');
  });
});
