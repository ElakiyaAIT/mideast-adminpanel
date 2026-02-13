import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from 'axios';
import type { AxiosResponse } from 'axios';
import { API_BASE_URL, HTTP_STATUS } from '../constants';
import type { ApiResponse, ApiErrorResponse } from '../dto';
import { csrfService } from './csrf';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _skipRefresh?: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Refresh token state management
let isRefreshing = false;
let refreshPromise: Promise<AxiosResponse<unknown>> | null = null;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;
const failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue.length = 0;
};

const shouldSkipRefresh = (url: string | undefined): boolean => {
  if (!url) return true;
  const skipPaths = ['/auth/logout', '/auth/refresh', '/auth/login', '/auth/register'];
  return skipPaths.some((path) => url.includes(path));
};

const isAuthPage = (): boolean => {
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  return authPaths.some((path) => window.location.pathname.includes(path));
};

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // csrf handling
    const method = config.method?.toUpperCase() || 'GET';
    const needsCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (needsCsrf) {
      const token = await csrfService.getToken();
      config.headers[csrfService.getHeaderName()] = token;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _skipRefresh?: boolean;
    };

    // Reset refresh attempts on successful requests (not 401)
    if (error.response?.status !== HTTP_STATUS.UNAUTHORIZED) {
      refreshAttempts = 0;
    }

    // Skip refresh logic for specific endpoints or if already marked to skip
    if (
      !originalRequest ||
      originalRequest._retry ||
      originalRequest._skipRefresh ||
      shouldSkipRefresh(originalRequest.url) ||
      isAuthPage()
    ) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Prevent infinite refresh loops
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        refreshAttempts = 0;
        refreshPromise = null;
        isRefreshing = false;
        processQueue(error);
        if (!isAuthPage()) {
          window.location.replace('/login');
        }
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing && refreshPromise) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Start refresh process
      originalRequest._retry = true;
      isRefreshing = true;
      refreshAttempts += 1;

      refreshPromise = axiosInstance
        .post<ApiResponse<unknown>>('/auth/refresh', {}, {
          _skipRefresh: true,
        } as CustomAxiosRequestConfig)
        .then((response) => {
          if (response.status === HTTP_STATUS.OK) {
            refreshAttempts = 0; // Reset on success
            processQueue(null);
            return axiosInstance(originalRequest);
          }
          throw new Error('Refresh token failed');
        })
        .catch((refreshError) => {
          refreshAttempts += 1;
          processQueue(refreshError as AxiosError);
          // if (!isAuthPage()) {
          //   window.location.replace('/login');
          // }
          return Promise.reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });

      return refreshPromise;
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
