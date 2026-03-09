import { describe, it, expect, vi, beforeEach } from 'vitest';
import axiosInstance from '../../api/axiosInstance';
import type {
  AuthResponseDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  GoogleSignInRequestDto,
  LoginRequestDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  UserDto,
} from '../../dto/auth.dto';
import { authApi, type ApiResponse } from '../../api';
import type { UserRole } from '../../types';

// Mock axiosInstance
vi.mock('../../api/axiosInstance');

const mockedAxios = vi.mocked(axiosInstance, true);

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUser: UserDto = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADMIN' as UserRole,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  it('should login successfully', async () => {
    const requestData: LoginRequestDto = { email: 'test@test.com', password: 'password123' };
    const mockResponse: ApiResponse<AuthResponseDto> = {
      data: { user: mockUser, message: 'Login successful' },
      success: true,
      message: 'Success',
      timestamp: '',
      path: '',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await authApi.login(requestData);

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/admin-login', requestData);
    expect(response).toEqual(mockResponse);
  });

  it('should register successfully', async () => {
    const requestData: RegisterRequestDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };
    const mockResponse: ApiResponse<AuthResponseDto> = {
      data: { user: mockUser, message: 'Registration successful' },
      success: true,
      message: 'Success',
      timestamp: '',
      path: '',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await authApi.register(requestData);

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/register', requestData);
    expect(response).toEqual(mockResponse);
  });

  it('should logout successfully', async () => {
    const mockResponse: ApiResponse<LogoutResponseDto> = {
      data: { message: 'Logged out' },
      success: true,
      message: 'Success',
      timestamp: '',
      path: '',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await authApi.logout();

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/logout');
    expect(response).toEqual(mockResponse);
  });

  it('should refresh token successfully', async () => {
    const mockResponse: ApiResponse<RefreshTokenResponseDto> = {
      data: { message: 'Token refreshed successfully' },
      success: true,
      message: 'Success',
      timestamp: '',
      path: '',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await authApi.refreshToken();

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/refresh', {});
    expect(response).toEqual(mockResponse);
  });

  it('should get current user', async () => {
    const mockResponse: ApiResponse<UserDto> = {
      data: mockUser,
      success: true,
      message: 'Success',
      timestamp: '',
      path: '',
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const response = await authApi.getCurrentUser();

    expect(mockedAxios.get).toHaveBeenCalledWith('/auth/profile');
    expect(response).toEqual(mockResponse);
  });

  it('should send forgot password request', async () => {
    const requestData: ForgotPasswordRequestDto = { email: 'test@test.com' };
    const mockResponse: ApiResponse<ForgotPasswordResponseDto> = {
      data: { message: 'Reset email sent' },
      success: true,
      message: 'Success',
      timestamp: '',
      path: '',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await authApi.forgotPassword(requestData);

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/forgot-password', requestData);
    expect(response).toEqual(mockResponse);
  });

  it('should sign in with Google', async () => {
    const requestData: GoogleSignInRequestDto = { idToken: 'googleToken123' };
    const mockResponse: ApiResponse<AuthResponseDto> = {
      data: { user: mockUser, message: 'Google sign-in successful' },
      success: true,
      message: 'Success',
      timestamp: '',
      path: '',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await authApi.googleSignIn(requestData);

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/google-signin', requestData);
    expect(response).toEqual(mockResponse);
  });

  it('should reset password', async () => {
    const requestData: ResetPasswordRequestDto = {
      token: 'resetToken',
      newPassword: 'newPassword123',
    };
    const mockResponse: ApiResponse<ResetPasswordResponseDto> = {
      data: { message: 'Password reset successful' },
      success: true,
      message: 'Success',
      timestamp: '',
      path: '',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await authApi.resetPassword(requestData);

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/reset-password', requestData);
    expect(response).toEqual(mockResponse);
  });
});
