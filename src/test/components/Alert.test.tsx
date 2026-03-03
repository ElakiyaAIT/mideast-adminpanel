import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '../../components/Alert/Alert';


describe('Alert component', () => {
  it('renders with default info variant', () => {
    render(<Alert>Info message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('renders with a title', () => {
    render(<Alert title="Alert Title">Message</Alert>);

    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('renders with success variant', () => {
    render(<Alert variant="success">Success message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-green-500/30'); // checking the container class
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('renders with error variant', () => {
    render(<Alert variant="error">Error message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-red-500/30');
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders a close button if onClose is provided', () => {
    const onClose = vi.fn();
    render(<Alert onClose={onClose}>Closable message</Alert>);

    const button = screen.getByRole('button', { name: /close alert/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render a close button if onClose is not provided', () => {
    render(<Alert>Non-closable message</Alert>);

    const button = screen.queryByRole('button', { name: /close alert/i });
    expect(button).not.toBeInTheDocument();
  });

  it('applies additional className', () => {
    render(<Alert className="custom-class">Message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });
});