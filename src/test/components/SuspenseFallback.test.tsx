import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuspenseFallback } from '../../components/SuspenseFallback';

describe('SuspenseFallback', () => {
  it('renders with default message', () => {
    render(<SuspenseFallback />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<SuspenseFallback message="Please wait..." />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('applies fullScreen styles by default', () => {
    const { container } = render(<SuspenseFallback />);

    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.className).toContain('fixed');
    expect(wrapper.className).toContain('inset-0');
  });

  it('applies non-fullscreen styles when fullScreen is false', () => {
    const { container } = render(<SuspenseFallback fullScreen={false} />);

    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.className).toContain('min-h-[400px]');
    expect(wrapper.className).not.toContain('fixed');
  });

  it('renders animated loading dots', () => {
    const { container } = render(<SuspenseFallback />);

    // There are 3 bouncing dots
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots.length).toBe(3);
  });

  it('renders spinning loader rings', () => {
    const { container } = render(<SuspenseFallback />);

    const spinElements = container.querySelectorAll('.animate-spin');
    expect(spinElements.length).toBeGreaterThan(0);
  });
});
