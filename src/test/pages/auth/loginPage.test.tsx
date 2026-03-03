import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { Mock } from 'vitest';
import type { LoginFormData } from '../../../utils/validation';
import LoginPage from '../../../pages/auth/LoginPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockMutate: Mock<(data: LoginFormData) => void> = vi.fn();

vi.mock('../../../hooks/queries', () => ({
  useLogin: vi.fn(),
}));

import { useLogin } from '../../../hooks/queries';

const mockUseLogin = useLogin as Mock;

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
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('renders login form correctly', () => {
    renderComponent();

    expect(screen.getByText(/welcome back to mideast equipment/i)).toBeInTheDocument();

    expect(screen.getByTestId('emailId-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter the password/i);

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password123!@');

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!@',
      });
    });
  });

  it('toggles password visibility', async () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText(/enter the password/i) as HTMLInputElement;

    expect(passwordInput.type).toBe('password');

    const toggleButton = screen.getByTestId('password-toggle');

    await userEvent.click(toggleButton);

    expect(passwordInput.type).toBe('text');

    await userEvent.click(toggleButton);

    expect(passwordInput.type).toBe('password');
  });

  it('renders loading state when login is pending', () => {
    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    renderComponent();

    const submitButton = screen.getByRole('button', { name: /loading/i });

    expect(submitButton).toBeDisabled();
  });
});
