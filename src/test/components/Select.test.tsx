import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Select } from '../../components/Select';

const mockOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

describe('Select Component', () => {
  it('renders label when provided', () => {
    render(<Select label="Test Label" options={mockOptions} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<Select label="Test Label" required options={mockOptions} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders default placeholder option when not multiple', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('does not render placeholder when multiple is true', () => {
    render(<Select options={mockOptions} multiple />);
    expect(screen.queryByText('Select...')).not.toBeInTheDocument();
  });

  it('renders all provided options', () => {
    render(<Select options={mockOptions} />);
    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('renders helper text when no error', () => {
    render(<Select options={mockOptions} helperText="Helpful text" />);
    expect(screen.getByText('Helpful text')).toBeInTheDocument();
  });

  it('renders error message and hides helper text', () => {
    render(<Select options={mockOptions} helperText="Helpful text" error="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('Helpful text')).not.toBeInTheDocument();
  });

  it('calls onChange when selecting option', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Select options={mockOptions} onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '2');

    expect(handleChange).toHaveBeenCalled();
    expect((select as HTMLSelectElement).value).toBe('2');
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLSelectElement>();

    render(<Select ref={ref} options={mockOptions} />);

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
