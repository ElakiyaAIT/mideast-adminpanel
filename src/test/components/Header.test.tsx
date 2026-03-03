import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { useLogout, useCurrentUser } from '../../hooks/queries';
import { toggleTheme } from '../../store/themeSlice';
import { Header } from '../../components/layout/Header';

// Mock hooks
vi.mock('../../hooks/redux', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));
vi.mock('../../components/LogoutConfirmModal', () => ({
  LogoutConfirmModal: ({ onConfirm, onClose, isOpen }: {isOpen:boolean,onClose:()=>void,onConfirm:()=>void}) =>
    isOpen ? (
      <div>
        <p>Are you sure you want to logout?</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null,
}));
vi.mock('../../hooks/queries', () => ({
  useLogout: vi.fn(),
  useCurrentUser: vi.fn(),
}));

vi.mock('../../store/themeSlice', () => ({
  toggleTheme: vi.fn(),
}));


describe('<Header />', () => {
  const mockDispatch = vi.fn();
  const mockLogout = { mutate: vi.fn(), isPending: false };
beforeEach(() => {
  vi.clearAllMocks();

  const mockUseAppDispatch = useAppDispatch as unknown as ReturnType<typeof vi.fn>;
  const mockUseAppSelector = useAppSelector as unknown as ReturnType<typeof vi.fn>;
  const mockUseCurrentUser = useCurrentUser as unknown as ReturnType<typeof vi.fn>;
  const mockUseLogout = useLogout as unknown as ReturnType<typeof vi.fn>;

  mockUseAppDispatch.mockReturnValue(mockDispatch);
  mockUseAppSelector.mockReturnValue({ mode: 'light' });
  mockUseCurrentUser.mockReturnValue({ data: { firstName: 'John' } });
  mockUseLogout.mockReturnValue(mockLogout);
});

  it('renders page title and welcome message', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome back, John')).toBeInTheDocument();
  });

  it('toggles theme on button click', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(themeButton);

    expect(mockDispatch).toHaveBeenCalledWith(toggleTheme());
  });

  it('opens logout modal when logout button is clicked', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    expect(screen.getByText(/are you sure you want to logout/i)).toBeInTheDocument();
  });

  it('calls logout mutation when confirming logout', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/logout/i));
    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);

    expect(mockLogout.mutate).toHaveBeenCalled();
  });

  it('closes logout modal when cancelling logout', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/logout/i));
    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(screen.queryByText(/are you sure you want to logout/i)).not.toBeInTheDocument();
  });
});