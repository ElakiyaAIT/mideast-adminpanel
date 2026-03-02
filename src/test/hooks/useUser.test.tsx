import { vi } from 'vitest';
import React from 'react';
// ============================================================
// MOCKS
// ============================================================

vi.mock('../../api', () => ({
  userApi: {
    getProfile: vi.fn(),
    getUsers: vi.fn(),
    updateProfile: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

vi.mock('../../utils/toast', () => ({
  showToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../utils/errorHandler', () => ({
  normalizeApiError: vi.fn((e) => e),
  getUserFriendlyMessage: vi.fn(() => 'Friendly error message'),
}));

vi.mock('./useAuth', () => ({
  authKeys: {
    profile: () => ['auth', 'profile'],
  },
}));

// ============================================================
// IMPORTS
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  useUserProfile,
  useUsersList,
  useUpdateProfile,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  userKeys,
} from '../../hooks/queries/useUser'; // <-- adjust path

import { userApi } from '../../api';
import { showToast } from '../../utils/toast';
import type {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserProfileResponseDto,
  UserProfileDto,
  UserResponseDto,
} from '../../dto/user.dto';
import type { PaginatedResponseDto } from '../../dto';

export const mockUserProfile: UserProfileDto = {
  id: '1',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'admin', // UserRole type
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockUpdatedUserProfile: UpdateUserProfileResponseDto = {
  user: {
    ...mockUserProfile,
    firstName: 'Updated',
    lastName: 'Name',
  },
  message: 'Profile updated successfully',
};

export const mockUserResponse: UserResponseDto = {
  id: '2',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  roleId: { _id: 'role1', name: 'User' },
  roleName: 'User',
  isActive: true,
  isEmailVerified: true,
  lastLoginAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockPaginatedUsers: PaginatedResponseDto<UserResponseDto> = {
  items: [mockUserResponse],
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  },
};

export const mockCreateUserDto: CreateUserDto = {
  email: 'newuser@example.com',
  firstName: 'New',
  lastName: 'User',
  roleId: 'role1',
};

export const mockUpdateUserDto: UpdateUserDto = {
  firstName: 'Updated',
  lastName: 'User',
  email: 'updated@example.com',
  roleId: 'role1',
  isActive: true,
};
// ============================================================
// TEST WRAPPER
// ============================================================

const createWrapper = (queryClient?: QueryClient) => {
  const client =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================================
// useUserProfile
// ============================================================

describe('useUserProfile', () => {
  it('should fetch profile successfully', async () => {
    vi.mocked(userApi.getProfile).mockResolvedValue({
      success: true,
      data: mockUserProfile,
    });

    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUserProfile);
  });
  it('should throw error if API fails', async () => {
    // Mock API response with data=null to satisfy type
    vi.mocked(userApi.getProfile).mockResolvedValue({
      success: false,
      data: mockUserProfile, // must be present
      message: 'Failed',
    });

    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ============================================================
// useUsersList
// ============================================================

describe('useUsersList', () => {
  it('should fetch users list with params', async () => {
    const params = { page: 1 };
    vi.mocked(userApi.getUsers).mockResolvedValue(mockPaginatedUsers);

    const { result } = renderHook(() => useUsersList(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(userApi.getUsers).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual(mockPaginatedUsers);
  });
});

// ============================================================
// useUpdateProfile
// ============================================================

describe('useUpdateProfile', () => {
  it('should update profile and set query data + show success toast', async () => {
    // Mock API response
    vi.mocked(userApi.updateProfile).mockResolvedValue({
      success: true,
      data: mockUpdatedUserProfile,
    });

    const queryClient = new QueryClient();
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData');

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      // Pass valid UpdateUserProfileDto
      await result.current.mutateAsync({ firstName: 'Updated', lastName: 'Name' });
    });

    expect(setQueryDataSpy).toHaveBeenCalledWith(userKeys.profile(), mockUpdatedUserProfile);

    expect(showToast.success).toHaveBeenCalledWith('Profile updated successfully');
  });

  it('should show error toast on failure', async () => {
    vi.mocked(userApi.updateProfile).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      // Use valid UpdateUserProfileDto
      await result.current.mutateAsync({ firstName: 'Fail', lastName: 'Test' }).catch(() => {});
    });

    expect(showToast.error).toHaveBeenCalledWith('Friendly error message');
  });
});

// ============================================================
// useCreateUser
// ============================================================

describe('useCreateUser', () => {
  it('should invalidate list queries and show success toast', async () => {
    // API resolves with UserResponseDto
    vi.mocked(userApi.createUser).mockResolvedValue({
      success: true,
      data: mockUserResponse,
    });

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      // Pass a proper CreateUserDto
      await result.current.mutateAsync(mockCreateUserDto);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: userKeys.lists(),
    });

    expect(showToast.success).toHaveBeenCalledWith('User created successfully');
  });
});

describe('useCreateUser - error branch', () => {
  it('should show error toast if API throws', async () => {
    // API throws error
    vi.mocked(userApi.createUser).mockRejectedValue(new Error('Create error'));

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      // Pass a valid CreateUserDto
      await result.current.mutateAsync(mockCreateUserDto).catch(() => {});
    });

    expect(showToast.error).toHaveBeenCalledWith('Friendly error message');
  });

  it('should show error toast if API throws', async () => {
    vi.mocked(userApi.createUser).mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(mockCreateUserDto).catch(() => {});
    });

    expect(showToast.error).toHaveBeenCalledWith('Friendly error message');
  });
});

// ============================================================
// useUpdateUser
// ============================================================

describe('useUpdateUser', () => {
  it('should invalidate list queries on success', async () => {
    // Mock API returns a UserResponseDto
    vi.mocked(userApi.updateUser).mockResolvedValue({ success: true, data: mockUserResponse });

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      // Pass a proper UpdateUserDto, roleId must be a string
      await result.current.mutateAsync({ id: mockUserResponse.id, data: mockUpdateUserDto });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: userKeys.lists(),
    });

    expect(showToast.success).toHaveBeenCalledWith('User updated successfully');
  });
});

describe('useUpdateUser - error branch', () => {
  it('should show error toast if API returns success false', async () => {
    // Mock API response as type-safe ApiResponse<UserResponseDto>
    vi.mocked(userApi.updateUser).mockResolvedValue({
      success: false,
      data: mockUserResponse, // still required to match type, but success=false triggers error branch
      message: 'Update failed',
    });

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      // Pass properly typed object for mutateAsync
      await result.current
        .mutateAsync({ id: mockUserResponse.id, data: mockUpdateUserDto })
        .catch(() => {});
    });

    expect(showToast.error).toHaveBeenCalledWith('Friendly error message');
  });

  it('should show error toast if API throws', async () => {
    // Mock API to throw an error
    vi.mocked(userApi.updateUser).mockRejectedValue(new Error('Update error'));

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current
        .mutateAsync({ id: mockUserResponse.id, data: mockUpdateUserDto })
        .catch(() => {});
    });

    expect(showToast.error).toHaveBeenCalledWith('Friendly error message');
  });
});
// ============================================================
// useDeleteUser
// ============================================================

describe('useDeleteUser', () => {
  it('should invalidate list queries on delete', async () => {
    // Type-safe mock response
    vi.mocked(userApi.deleteUser).mockResolvedValue({
      success: true,
      data: undefined, // ApiResponse<void>
      message: 'Deleted successfully',
    });

    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync('1');
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: userKeys.lists(),
    });

    expect(showToast.success).toHaveBeenCalledWith('User deleted successfully');
  });
});

describe('useDeleteUser - error branch', () => {
  it('should show error toast if API returns success false', async () => {
    // Type-safe mock response for ApiResponse<void>
    vi.mocked(userApi.deleteUser).mockResolvedValue({
      success: false,
      data: undefined,
      message: 'Delete failed',
    });

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      // Pass a valid string ID for deletion
      await result.current.mutateAsync('1').catch(() => {});
    });

    expect(showToast.error).toHaveBeenCalledWith('Friendly error message');
  });

  it('should show error toast if API throws', async () => {
    vi.mocked(userApi.deleteUser).mockRejectedValue(new Error('Delete error'));

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync('1').catch(() => {});
    });

    expect(showToast.error).toHaveBeenCalledWith('Friendly error message');
  });
});
