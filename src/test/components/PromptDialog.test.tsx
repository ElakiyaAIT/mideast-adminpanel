import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptDialog } from '../../components/PromptDialog';
import type React from 'react';

// Mock child components
vi.mock('../../components', () => ({
  Modal: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
  Button: ({
    children,
    onClick,
    disabled,
    type,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }) => (
    <button onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  ),

  Input: ({
    value,
    onChange,
    placeholder,
    type,
    ...rest
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input value={value} onChange={onChange} placeholder={placeholder} type={type} {...rest} />
  ),
}));

describe('PromptDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    title: 'Test Title',
    message: 'Test Message',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    render(<PromptDialog {...defaultProps} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<PromptDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('submits trimmed value', async () => {
    const user = userEvent.setup();
    render(<PromptDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter text...');
    await user.type(input, '  hello world  ');

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith('  hello world  ');
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows error if minlength not met', async () => {
    const user = userEvent.setup();
    render(<PromptDialog {...defaultProps} minlength={5} />);

    const input = screen.getByPlaceholderText('Enter text...');
    await user.type(input, 'abc');

    await user.click(screen.getByText('Submit'));

    expect(screen.getByText('Enter atleast 5 characters')).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('calls onClose when cancel clicked', async () => {
    const user = userEvent.setup();
    render(<PromptDialog {...defaultProps} />);

    await user.click(screen.getByText('Cancel'));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('disables buttons when loading', () => {
    render(<PromptDialog {...defaultProps} isLoading />);

    expect(screen.getByText('Cancel')).toBeDisabled();
    expect(screen.getByText('Processing...')).toBeDisabled();
  });

  it('renders textarea when multiline is true', () => {
    render(<PromptDialog {...defaultProps} multiline />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
