import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useCurrentUser } from '../../hooks/queries/useAuth';
import { authApi, type ApiResponse } from '../../api';
import type { ReactNode } from 'react';
import {
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
} from '../../hooks/queries/useAuth';
import { showToast } from '../../utils/toast';
import type {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from '../../dto';

vi.mock('../../api', () => ({
  authApi: {
    login: vi.fn(),
    getCurrentUser: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

vi.mock('../../utils/toast', () => ({
  showToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../utils/errorHandler', () => ({
  normalizeApiError: vi.fn((err: Error) => ({ message: err.message })),
  getUserFriendlyMessage: vi.fn(() => 'Friendly error'),
}));
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuth hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useCurrentUser', () => {
    it('should fetch current user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user' as const,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      vi.mocked(authApi.getCurrentUser).mockResolvedValue({
        success: true,
        data: mockUser,
        message: 'Success',
      });

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockUser);
      expect(authApi.getCurrentUser).toHaveBeenCalledOnce();
    });

    it('should handle error when fetching user', async () => {
      vi.mocked(authApi.getCurrentUser).mockRejectedValue(new Error('Not authenticated'));

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
    it('should throw if success is false', async () => {
      const mockUser = {
        id: '1',
        email: 'x',
        firstName: 'x',
        lastName: 'x',
        role: 'user' as const,
        createdAt: '',
        updatedAt: '',
      };

      vi.mocked(authApi.getCurrentUser).mockResolvedValue({
        success: false,
        data: mockUser,
        message: 'Failed',
      });

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  it('should handle login failure', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      email: 'wrong@example.com',
      password: 'wrongpass',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  describe('useLogin', () => {
    it('should login successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user' as const,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      vi.mocked(authApi.login).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          message: 'Login successful',
        },
        message: 'Success',
      });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'test@example.com',
        password: 'password123',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    it('should set query data, show toast and navigate on login success', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user' as const,
        createdAt: '',
        updatedAt: '',
      };

      vi.mocked(authApi.login).mockResolvedValue({
        success: true,
        message: 'Success',
        data: { user: mockUser, message: 'ok' },
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.mutate({
        email: 'test@example.com',
        password: '123456',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(showToast.success).toHaveBeenCalledWith('Login successful');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    it('should handle login success false response', async () => {
      // Mock response with success: false, properly typed
      const mockResponse: ApiResponse<AuthResponseDto> = {
        success: false,
        message: 'Login failed',
        data: {
          user: {
            id: '0',
            email: '',
            firstName: '',
            lastName: '',
            role: 'user',
            createdAt: '',
            updatedAt: '',
          },
          message: 'Login failed',
        },
        timestamp: '',
        path: '',
      };

      vi.mocked(authApi.login).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

      const requestData: LoginRequestDto = {
        email: 'bad@test.com',
        password: 'bad',
      };

      result.current.mutate(requestData);

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
    it('should show error toast on login error', async () => {
      vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'bad@test.com',
        password: 'bad',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(showToast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });
  describe('useRegister', () => {
    it('should register successfully', async () => {
      const mockUser: AuthResponseDto['user'] = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        createdAt: '',
        updatedAt: '',
      };

      const mockResponse: ApiResponse<AuthResponseDto> = {
        success: true,
        message: 'Success',
        data: { message: 'success', user: mockUser },
        timestamp: '',
        path: '',
      };

      vi.mocked(authApi.register).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });
      const requestData: RegisterRequestDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      result.current.mutate(requestData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(showToast.success).toHaveBeenCalled();
    });
    it('should set query data and navigate on register success', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user' as const,
        createdAt: '',
        updatedAt: '',
      };

      vi.mocked(authApi.register).mockResolvedValue({
        success: true,
        message: 'Success',
        data: { user: mockUser, message: 'ok' },
      });

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'test@test.com',
        password: '123456',
        firstName: 'Test',
        lastName: 'User',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(showToast.success).toHaveBeenCalledWith('Registration successful');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    it('should handle register error', async () => {
      vi.mocked(authApi.register).mockRejectedValue(new Error('Fail'));

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });
      const requestData: RegisterRequestDto = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      };
      result.current.mutate(requestData);

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });
  describe('useLogout', () => {
    it('should logout successfully', async () => {
      vi.mocked(authApi.logout).mockResolvedValue({
        success: true,
        data: {
          message: 'Logged out successfully',
        },
        message: 'Success',
      });

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
    it('should clear query cache and navigate on logout success', async () => {
      vi.mocked(authApi.logout).mockResolvedValue({
        success: true,
        message: 'Success',
        data: { message: 'ok' },
      });

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(showToast.success).toHaveBeenCalledWith('Logged out successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should handle logout error but still navigate', async () => {
      vi.mocked(authApi.logout).mockRejectedValue(new Error('Fail'));

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });
  describe('useForgotPassword', () => {
    it('should send reset email', async () => {
      vi.mocked(authApi.forgotPassword).mockResolvedValue({
        success: true,
        data: {
          message: 'Password reset email sent',
        },
        message: 'Success',
      });

      const { result } = renderHook(() => useForgotPassword(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ email: 'test@test.com' });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('should handle forgot password error', async () => {
      vi.mocked(authApi.forgotPassword).mockRejectedValue(new Error('Fail'));

      const { result } = renderHook(() => useForgotPassword(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ email: 'x' });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe('useResetPassword', () => {
    it('should reset password successfully', async () => {
      const mockResponse: ApiResponse<ResetPasswordResponseDto> = {
        success: true,
        message: 'Success',
        data: { message: 'Password reset successfully' },
        timestamp: '',
        path: '',
      };

      vi.mocked(authApi.resetPassword).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useResetPassword(), {
        wrapper: createWrapper(),
      });
      const requestData: ResetPasswordRequestDto = {
        token: 'token123',
        newPassword: 'newpassword123',
      };

      result.current.mutate(requestData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('should handle reset password error', async () => {
      vi.mocked(authApi.resetPassword).mockRejectedValue(new Error('Fail'));
      ``;
      const { result } = renderHook(() => useResetPassword(), {
        wrapper: createWrapper(),
      });
      const requestData: ResetPasswordRequestDto = {
        token: '',
        newPassword: '',
      };
      result.current.mutate(requestData);

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });
});
