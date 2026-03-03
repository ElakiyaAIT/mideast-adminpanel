import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from '../../components';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('../', async () => {
  const actual = await vi.importActual('../');
  return {
    ...actual,
    Modal: ({ children, isOpen }: { isOpen: boolean; children: React.ReactNode }) =>
      isOpen ? <div data-test-id="modal">{children}</div> : null,
  };
});

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
  };

  it('renders title and message', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
  });

  it('renders default button texts', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders custom button texts', () => {
    render(<ConfirmDialog {...defaultProps} confirmText="Delete" cancelText="Back" />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('Calls onclose when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ConfirmDialog {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Calls onConfirm and onClose when confirm is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(<ConfirmDialog {...defaultProps} onClose={onClose} onConfirm={onConfirm} />);
    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<ConfirmDialog {...defaultProps} isLoading />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const confirmButton = screen.getByRole('button', { name: /processing/i });

    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  it('doesnot render when isOpen is false', async () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
