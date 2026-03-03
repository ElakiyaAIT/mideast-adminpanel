import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../components/Button/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);

    expect(screen.getByRole('button', { name: /Click Me/i })).toBeInTheDocument();
  });

  it('applies default variant and size classes', () => {
    render(<Button>Default</Button>);

    const button = screen.getByRole('button', { name: /Default/i });

    // default variant = primary
    expect(button.className).toContain('from-primary-500');
    expect(button.className).toContain('to-primary-600');

    // default size = md
    expect(button.className).toContain('px-6');
    expect(button.className).toContain('py-3');
    expect(button.className).toContain('text-base');
  });

  it('applies danger variant styles', () => {
    render(<Button variant="danger">Delete</Button>);

    const button = screen.getByRole('button', { name: /Delete/i });

    expect(button.className).toContain('from-red-500');
    expect(button.className).toContain('to-red-600');
  });

  it('applies large size styles', () => {
    render(<Button size="lg">Large</Button>);

    const button = screen.getByRole('button', { name: /Large/i });

    expect(button.className).toContain('px-8');
    expect(button.className).toContain('py-4');
    expect(button.className).toContain('text-lg');
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button', { name: /Disabled/i });

    expect(button).toBeDisabled();
  });

  it('is disabled when loading', () => {
    render(<Button isLoading>Submit</Button>);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('shows loading state correctly', () => {
    render(<Button isLoading>Submit</Button>);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Spinner should exist
    const spinner = document.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole('button', { name: /Click/i });

    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when loading', async () => {
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} isLoading>
        Click
      </Button>,
    );

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button', { name: /Custom/i });

    expect(button.className).toContain('custom-class');
  });
});
