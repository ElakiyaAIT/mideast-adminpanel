import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogoutConfirmModal } from '../../components/LogoutConfirmModal/LogoutConfirmModal';
import React from 'react';
/**
 * Mock Modal to simplify rendering behavior
 */
vi.mock('../Modal', () => ({
  Modal: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
}));

/**
 * Mock Button to behave like a normal button
 */
vi.mock('../Button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    disabled: boolean;
    onClick?: () => void;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('LogoutConfirmModal', () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<LogoutConfirmModal isOpen={false} onClose={onClose} onConfirm={onConfirm} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<LogoutConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />);

    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
  });

  it('renders title and message', () => {
    render(<LogoutConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />);

    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to logout/i)).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<LogoutConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Logout is clicked', () => {
    render(<LogoutConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText('Logout'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(
      <LogoutConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} isLoading={true} />,
    );

    expect(screen.getByText('Logging out...')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('does not show Logout text when loading', () => {
    render(
      <LogoutConfirmModal isOpen={true} onClose={onClose} onConfirm={onConfirm} isLoading={true} />,
    );

    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});
