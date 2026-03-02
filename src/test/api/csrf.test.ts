import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { csrfService } from '../../api/csrf';

vi.mock('axios');

const mockedAxios = vi.mocked(axios, true);

interface CsrfApiResponse {
  data: {
    data: {
      token: string;
    };
  };
}

describe('CsrfService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    csrfService.clearToken();
  });

  it('fetches token once and caches it', async () => {
    const mockResponse: CsrfApiResponse = {
      data: {
        data: {
          token: 'abc123',
        },
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const token1 = await csrfService.getToken();
    const token2 = await csrfService.getToken();

    expect(token1).toBe('abc123');
    expect(token2).toBe('abc123');
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('prevents duplicate concurrent fetches', async () => {
    let resolveFn!: (value: CsrfApiResponse) => void;

    const pendingPromise = new Promise<CsrfApiResponse>((resolve) => {
      resolveFn = resolve;
    });

    mockedAxios.get.mockReturnValue(pendingPromise);

    const promise1 = csrfService.getToken();
    const promise2 = csrfService.getToken();

    resolveFn({
      data: {
        data: {
          token: 'concurrent-token',
        },
      },
    });

    const [token1, token2] = await Promise.all([promise1, promise2]);

    expect(token1).toBe('concurrent-token');
    expect(token2).toBe('concurrent-token');
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('refetches after clearing token', async () => {
    const mockResponse: CsrfApiResponse = {
      data: {
        data: {
          token: 'new-token',
        },
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    await csrfService.getToken();
    csrfService.clearToken();
    await csrfService.getToken();

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('returns correct header name', () => {
    expect(csrfService.getHeaderName()).toBe('x-csrf-token');
  });
});
