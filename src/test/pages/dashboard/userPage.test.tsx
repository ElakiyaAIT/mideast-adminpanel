import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Mock } from 'vitest';
import UsersPage from '../../../pages/dashboard/UsersPage';
import { useUsersList } from '../../../hooks/queries/useUser';
import userEvent from '@testing-library/user-event';
import type { UserResponseDto } from '../../../dto';

// --------------------
// Mocks
// --------------------
vi.mock('../../../hooks/queries/useUser');

const mockUseUsersList = useUsersList as Mock;

const mockUsers: UserResponseDto[] = [
  {
    id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    roleName: 'admin',
    isActive: true,
    isEmailVerified: true,
    lastLoginAt: new Date().toISOString(),
    roleId: {
      _id: '',
      name: '',
    },
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    roleName: 'buyer',
    isActive: false,
    isEmailVerified: false,
    lastLoginAt: null,
    roleId: {
      _id: '',
      name: '',
    },
    createdAt: '',
    updatedAt: '',
  },
];

// --------------------
// Render helper
// --------------------
const renderComponent = (): void => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <UsersPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

// --------------------
// Tests
// --------------------
describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton loader when loading', async () => {
    mockUseUsersList.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    await waitFor(() => {
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  it('renders users table correctly', async () => {
    mockUseUsersList.mockReturnValue({
      data: { items: mockUsers, pagination: { total: 2, totalPages: 1 } },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('opens add user modal when clicking "Add New User"', async () => {
    mockUseUsersList.mockReturnValue({
      data: { items: [], pagination: { total: 0, totalPages: 1 } },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderComponent();

    const addButton = screen.getByRole('button', { name: /Add New User/i });
    await userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Create User/i)).toBeInTheDocument();
    });
  });

  it('displays error message when fetching fails', async () => {
    const errorMsg = 'Failed to fetch users';
    mockUseUsersList.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error(errorMsg),
      refetch: vi.fn(),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Failed to load users')).toBeInTheDocument();
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});
