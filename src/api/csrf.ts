import axios from 'axios';
import { API_BASE_URL } from '../constants';

class CsrfService {
  private token: string | null = null;
  private fetching: Promise<string> | null = null;
  private readonly headerName = 'x-csrf-token';

  async getToken(): Promise<string> {
    if (this.token) return this.token;

    if (!this.fetching) {
      this.fetching = axios
        .get(`${API_BASE_URL}/csrf/token`, {
          withCredentials: true,
        })
        .then((res) => {
          this.token = res.data.data.token as string;
          return this.token;
        })
        .finally(() => {
          this.fetching = null;
        });
    }

    return this.fetching;
  }

  clearToken(): void {
    this.token = null;
  }

  getHeaderName(): string {
    return this.headerName;
  }
}

export const csrfService = new CsrfService();
