import { QueryClient } from '@tanstack/react-query';

interface AxiosLikeError {
  response?: {
    status?: number;
  };
}

function isAxiosLikeError(error: unknown): error is AxiosLikeError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: (failureCount, error): boolean => {
        if (isAxiosLikeError(error)) {
          const status = error.response?.status;

          if (typeof status === 'number' && status >= 400 && status < 500) {
            return status === 408 || status === 429;
          }
        }

        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});
