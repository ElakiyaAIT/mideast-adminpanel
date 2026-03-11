import axiosInstance from './axiosInstance';
import type {
  LoginRequestDto,
  RegisterRequestDto,
  AuthResponseDto,
  RefreshTokenResponseDto,
  LogoutResponseDto,
  UserProfileDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  GoogleSignInRequestDto,
} from '../dto';
import type { ApiResponse } from '../dto';

export const authApi = {
  login: async (data: LoginRequestDto): Promise<ApiResponse<AuthResponseDto>> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponseDto>>(
      '/auth/admin-login',
      data,
    );
    return response.data;
  },

  register: async (data: RegisterRequestDto): Promise<ApiResponse<AuthResponseDto>> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponseDto>>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<LogoutResponseDto>> => {
    const response = await axiosInstance.post<ApiResponse<LogoutResponseDto>>('/auth/admin-logout');
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<RefreshTokenResponseDto>> => {
    const response = await axiosInstance.post<ApiResponse<RefreshTokenResponseDto>>(
      '/auth/admin-refresh',
      {},
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<UserProfileDto>> => {
    const response = await axiosInstance.get<ApiResponse<UserProfileDto>>('/auth/admin-profile');
    return response.data;
  },

  forgotPassword: async (
    data: ForgotPasswordRequestDto,
  ): Promise<ApiResponse<ForgotPasswordResponseDto>> => {
    const response = await axiosInstance.post<ApiResponse<ForgotPasswordResponseDto>>(
      '/auth/forgot-password',
      data,
    );
    return response.data;
  },

  googleSignIn: async (data: GoogleSignInRequestDto): Promise<ApiResponse<AuthResponseDto>> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponseDto>>(
      '/auth/google-signin',
      data,
    );
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordRequestDto,
  ): Promise<ApiResponse<ResetPasswordResponseDto>> => {
    const response = await axiosInstance.post<ApiResponse<ResetPasswordResponseDto>>(
      '/auth/reset-password',
      data,
    );
    return response.data;
  },
};
