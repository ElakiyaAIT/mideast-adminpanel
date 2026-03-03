import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { Textarea } from '../../components/Textarea/Textarea';

describe('Textarea component', () => {
  it('renders label when provided', () => {
    render(<Textarea label="Message" />);
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('renders required asterisk when required', () => {
    render(<Textarea label="Message" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders helper text when no error', () => {
    render(<Textarea helperText="Enter your message" />);
    expect(screen.getByText('Enter your message')).toBeInTheDocument();
  });

  it('renders error message when error exists', () => {
    render(<Textarea error="Message is required" />);
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  it('does not show helper text when error exists', () => {
    render(<Textarea helperText="Helper text" error="Error text" />);

    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('Error text')).toBeInTheDocument();
  });

  it('uses default rows value (4)', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(4);
  });

  it('applies custom rows value', () => {
    render(<Textarea rows={6} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(6);
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('allows user to type into textarea', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    expect(textarea.value).toBe('Hello world');
  });

  it('applies error styling class when error exists', () => {
    render(<Textarea error="Invalid input" />);
    const textarea = screen.getByRole('textbox');

    expect(textarea.className).toContain('border-red-500/50');
  });
});
