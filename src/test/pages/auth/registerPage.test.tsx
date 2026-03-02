import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { Mock } from 'vitest';
import type { RegisterFormData } from '../../../utils/validation';
import RegisterPage from '../../../pages/auth/RegisterPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockMutate: Mock<(data: RegisterFormData) => void> = vi.fn();

vi.mock('../../../hooks/queries', () => ({
  useRegister: vi.fn(),
}));

import { useRegister } from '../../../hooks/queries';

const mockUseRegister = useRegister as Mock;

// ---- Render helper ----
const renderComponent = (): void => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRegister.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it('renders registration form correctly', () => {
    renderComponent();

    expect(screen.getByText(/create your account/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /create account/i });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    renderComponent();

    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const lastNameInput = screen.getByPlaceholderText(/last name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/create a password/i);

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password123!@');

    const submitButton = screen.getByRole('button', { name: /create account/i });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'Password123!@',
      });
    });
  });

  it('shows error message when registration fails', () => {
    mockUseRegister.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: new Error('Registration failed'),
    });

    renderComponent();

    expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
  });

  it('renders loading state when registration is pending', () => {
    mockUseRegister.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      error: null,
    });

    renderComponent();

    const submitButton = screen.getByRole('button', { name: /loading/i });

    expect(submitButton).toBeDisabled();
  });

  it('has link to login page', () => {
    renderComponent();

    const loginLink = screen.getByRole('link', { name: /sign in to your existing account/i });

    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
