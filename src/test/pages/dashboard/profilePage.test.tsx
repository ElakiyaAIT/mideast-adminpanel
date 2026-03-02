import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Mock } from 'vitest';
import { useUserProfile, useCurrentUser, useUpdateProfile } from '../../../hooks/queries';
import ProfilePage from '../../../pages/dashboard/ProfilePage';
import userEvent from '@testing-library/user-event';
// --------------------
// Mocks
// --------------------
vi.mock('../../../hooks/queries');

const mockUseUserProfile = useUserProfile as Mock;
const mockUseCurrentUser = useCurrentUser as Mock;
const mockUseUpdateProfile = useUpdateProfile as Mock;

const mockMutate = vi.fn();

const mockProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'admin',
  createdAt: '2023-01-01T00:00:00Z',
};

const mockAuthUser = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
};
(useUserProfile as Mock).mockReturnValue({
  data: null, // no profile yet
  isLoading: true, // loading state
  error: null,
});

(useCurrentUser as Mock).mockReturnValue({
  data: null, // simulate no auth user
});
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
        <ProfilePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

// --------------------
// Tests
// --------------------
describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseUserProfile.mockReturnValue({ data: mockProfile, isLoading: false, error: null });
    mockUseCurrentUser.mockReturnValue({ data: mockAuthUser });
    mockUseUpdateProfile.mockReturnValue({ mutate: mockMutate, isPending: false, error: null });
  });

  it('renders skeleton loader when loading', async () => {
    // Override mocks for loading state
    mockUseUserProfile.mockReturnValue({ data: null, isLoading: true, error: null });
    mockUseCurrentUser.mockReturnValue({ data: null });

    renderComponent();

    await waitFor(() => {
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  it('renders profile form correctly', async () => {
    renderComponent();

    // Wait for RHF reset to complete
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProfile.firstName)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockProfile.lastName)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockProfile.email)).toBeInTheDocument();
    });

    expect(screen.getByText(/Role/i)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.role)).toBeInTheDocument();
    expect(screen.getByText(/Member since/i)).toBeInTheDocument();
  });

  it('submits updated profile when form is dirty', async () => {
    renderComponent();

    await waitFor(() => screen.getByDisplayValue(mockProfile.firstName));

    const firstNameInput = screen.getByTestId('first-name-input') as HTMLInputElement;

    // Properly update RHF controlled input
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Johnny');

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        firstName: 'Johnny',
        lastName: mockProfile.lastName,
        email: mockProfile.email,
      });
    });
  });

  it('disables save button when form is not dirty', async () => {
    renderComponent();

    await waitFor(() => screen.getByDisplayValue(mockProfile.firstName));

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    expect(saveButton).toBeDisabled();
  });

  it('displays error message if update fails', async () => {
    const errorMsg = 'Update failed';
    mockUseUpdateProfile.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: { message: errorMsg },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });
});
