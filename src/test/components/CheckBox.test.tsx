import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import Checkbox from '../../components/Checkbox/Checkbox';

describe('Checkbox Component', () => {
  it('renders checkbox input', () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Checkbox label="Accept Terms" />);

    expect(screen.getByText('Accept Terms')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    render(<Checkbox />);

    expect(screen.queryByText('Accept Terms')).not.toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Checkbox error="Required field" />);

    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('applies error styles when error exists', () => {
    render(<Checkbox error="Invalid" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.className).toContain('border-red-300');
  });

  it('applies default border style when no error', () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.className).toContain('border-gray-200');
  });

  it('passes checked state correctly', async () => {
    const user = userEvent.setup();

    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Checkbox ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('accepts custom className', () => {
    render(<Checkbox className="custom-class" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('calls onChange handler when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
