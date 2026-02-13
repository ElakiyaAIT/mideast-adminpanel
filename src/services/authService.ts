import { queryClient } from '../lib/queryClient';
import { authKeys } from '../hooks/queries/useAuth';
import { authApi } from '../api';

class AuthService {
  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      queryClient.clear();
    }
  }

  async checkAuth(): Promise<void> {
    try {
      // Prefetch user profile to check authentication
      await queryClient.prefetchQuery({
        queryKey: authKeys.profile(),
        queryFn: async () => {
          const response = await authApi.getCurrentUser();
          // if (!response.success || !response.data) {
          //   throw new Error('Not authenticated');
          // }
          return response.data;
        },
        staleTime: 1000 * 60 * 5,
      });
    } catch (error) {
      console.error('Auth check error:', error);
      // Auth check failed - user will be redirected by guards
      queryClient.setQueryData(authKeys.profile(), null);
    }
  }

  async refreshToken(): Promise<void> {
    try {
      await authApi.refreshToken();
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
