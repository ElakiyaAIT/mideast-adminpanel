import axiosInstance from '../../api/axiosInstance';
import { csrfService } from '../../api/csrf';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HTTP_STATUS } from '../../constants';
import axios from 'axios';

describe('axiosInstance interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock getToken to return 'csrf-token'
    vi.spyOn(csrfService, 'getToken').mockResolvedValue('csrf-token');
    vi.spyOn(csrfService, 'getHeaderName').mockReturnValue('X-CSRF-TOKEN');
  });

  it('adds CSRF token for POST requests', async () => {
    const requestInterceptor = axiosInstance.interceptors.request.handlers![0]!.fulfilled!;

    const config: InternalAxiosRequestConfig = {
      method: 'POST',
      headers: new axios.AxiosHeaders(), // proper type
    };

    const result = await requestInterceptor(config);

    expect(csrfService.getToken).toHaveBeenCalled();
    expect(csrfService.getHeaderName).toHaveBeenCalled();
    expect(result.headers['X-CSRF-TOKEN']).toBe('csrf-token');
  });
  it('does not add CSRF token for GET requests', async () => {
    const requestInterceptor = axiosInstance.interceptors.request.handlers![0]!.fulfilled!;
    const config: InternalAxiosRequestConfig = {
      method: 'GET',
      headers: {} as unknown as InternalAxiosRequestConfig['headers'],
    };
    await requestInterceptor(config);
    expect(csrfService.getToken).not.toHaveBeenCalled();
  });

  it('passes successful response', () => {
    const responseInterceptor = axiosInstance.interceptors.response.handlers![0]!.fulfilled!;
    const response = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as unknown as AxiosResponse;
    expect(responseInterceptor(response)).toBe(response);
  });

  it('rejects non-401 errors', async () => {
    const responseInterceptor = axiosInstance.interceptors.response.handlers![0]!.rejected!;
    const error = { response: { status: 500 }, config: {} } as AxiosError;
    await expect(responseInterceptor(error)).rejects.toBe(error);
  });

  it('skips refresh for auth endpoints', async () => {
    const responseInterceptor = axiosInstance.interceptors.response.handlers![0]!.rejected!;
    const error = {
      response: { status: HTTP_STATUS.UNAUTHORIZED },
      config: { url: '/auth/login' },
    } as AxiosError;

    await expect(responseInterceptor(error)).rejects.toBe(error);
  });
});
