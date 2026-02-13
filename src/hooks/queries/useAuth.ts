import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import type {
  LoginRequestDto,
  RegisterRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
} from '../../dto';
import { normalizeApiError, getUserFriendlyMessage } from '../../utils/errorHandler';
import { showToast } from '../../utils/toast';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

/**
 * Get current user profile
 * This hook is the single source of truth for authentication state
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch user profile');
      }
      return response.data;
    },
    retry: false, // Don't retry on 401 - just fail fast
    staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
    gcTime: 1000 * 60 * 10, // 10 minutes - cache retention (formerly cacheTime)
    refetchOnWindowFocus: true, // Revalidate when user returns to tab
    refetchOnMount: true, // Always check on component mount
    refetchOnReconnect: true, // Check when internet reconnects
  });
};

/**
 * Login mutation
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequestDto) => {
      const response = await authApi.login(credentials);
      if (!response.success || !response.data.user) {
        throw new Error(response.message || 'Login failed');
      }
      return response.data.user;
    },
    onSuccess: (user) => {
      // Invalidate and refetch user profile
      queryClient.setQueryData(authKeys.profile(), user);
      showToast.success('Login successful');
      void navigate('/');
    },
    onError: (error) => {
      const normalizedError = normalizeApiError(error);
      showToast.error(normalizedError.message);
    },
  });
};

/**
 * Register mutation
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterRequestDto) => {
      const response = await authApi.register(data);
      if (!response.success || !response.data.user) {
        throw new Error(response.message || 'Registration failed');
      }
      return response.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.profile(), user);
      showToast.success('Registration successful');
      void navigate('/');
    },
    onError: (error) => {
      const normalizedError = normalizeApiError(error);
      showToast.error(normalizedError.message);
    },
  });
};

/**
 * Logout mutation
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await authApi.logout();
      if (!response.success) {
        throw new Error(response.message || 'Logout failed');
      }
      return response.data;
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      showToast.success('Logged out successfully');
      void navigate('/login');
    },
    onError: (error) => {
      // Still logout even if API call fails
      queryClient.clear();
      const normalizedError = normalizeApiError(error);
      console.error('Logout error:', normalizedError);
      void navigate('/login');
    },
  });
};

/**
 * Forgot password mutation
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequestDto) => {
      const response = await authApi.forgotPassword(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to send password reset email');
      }
      return response.data;
    },
    onSuccess: () => {
      showToast.success('Password reset email sent');
    },
    onError: (error) => {
      const normalizedError = normalizeApiError(error);
      const message = getUserFriendlyMessage(normalizedError);
      showToast.error(message);
    },
  });
};

/**
 * Reset password mutation
 */
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ResetPasswordRequestDto) => {
      const response = await authApi.resetPassword(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to reset password');
      }
      return response.data;
    },
    onSuccess: () => {
      showToast.success('Password reset successfully');
      void navigate('/login');
    },
    onError: (error) => {
      const normalizedError = normalizeApiError(error);
      const message = getUserFriendlyMessage(normalizedError);
      showToast.error(message);
    },
  });
};
