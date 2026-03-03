import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the redux hook
vi.mock('../../hooks/redux', () => ({
  useAppSelector: vi.fn(),
}));

import { useAppSelector } from '../../hooks/redux';
import { GlobalLoader } from '../../components/Loader/GlobalLoader';

describe('GlobalLoader', () => {
  it('renders null when isLoading is false', () => {
    (useAppSelector as any).mockImplementation(() => ({
      isLoading: false,
      loadingMessage: '',
    }));

    const { container } = render(<GlobalLoader />);
    expect(container.firstChild).toBeNull();
  });

  it('renders loader when isLoading is true', () => {
    (useAppSelector as any).mockImplementation(() => ({
      isLoading: true,
      loadingMessage: '',
    }));

    render(<GlobalLoader />);
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute('aria-live', 'polite');
    expect(loader).toHaveAttribute('aria-label', 'Loading');
  });

 it('renders loading message and bouncing dots if provided', () => {
  const message = 'Please wait...';
  (useAppSelector as any).mockImplementation(() => ({
    isLoading: true,
    loadingMessage: message,
  }));

  render(<GlobalLoader />);
  const loader = screen.getByRole('status');
  expect(loader).toBeInTheDocument();
  expect(loader).toHaveAttribute('aria-label', message);

  // Check that the message is rendered
  expect(screen.getByText(message)).toBeInTheDocument();

  // Check bouncing dots by class name
  const bouncingDots = loader.querySelectorAll('.animate-bounce');
  expect(bouncingDots).toHaveLength(3);
});

  it('renders all layers of the loader', () => {
    (useAppSelector as any).mockImplementation(() => ({
      isLoading: true,
      loadingMessage: '',
    }));

    render(<GlobalLoader />);
    const loader = screen.getByRole('status');

    // Outer ring
    expect(loader.querySelector('.animate-spin-slow')).toBeInTheDocument();
    // Middle ring
    expect(loader.querySelector('.animate-spin')).toBeInTheDocument();
    // Inner pulsing dot
    expect(loader.querySelector('.animate-pulse-slow')).toBeInTheDocument();
  });
});