import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, SkeletonGroup, SkeletonCard, SkeletonTable } from '../../components/Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    render(<Skeleton />);

    const el = screen.getByTestId('skeleton');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(el).toHaveAttribute('aria-label', 'Loading content');
  });

  it('applies correct variant class', () => {
    render(<Skeleton variant="circular" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toContain('rounded-full');
  });

  it('applies animation class', () => {
    render(<Skeleton animation="pulse" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).toContain('animate-pulse');
  });

  it('removes animation when set to none', () => {
    render(<Skeleton animation="none" />);
    const el = screen.getByTestId('skeleton');
    expect(el.className).not.toContain('animate-pulse');
  });

  it('applies numeric width and height as px', () => {
    render(<Skeleton width={100} height={50} />);
    const el = screen.getByTestId('skeleton');
    expect(el.style.width).toBe('100px');
    expect(el.style.height).toBe('50px');
  });

  it('applies string width and height correctly', () => {
    render(<Skeleton width="60%" height="20rem" />);
    const el = screen.getByTestId('skeleton');
    expect(el.style.width).toBe('60%');
    expect(el.style.height).toBe('20rem');
  });
});

describe('SkeletonGroup', () => {
  it('renders children inside wrapper', () => {
    render(
      <SkeletonGroup>
        <div data-testid="child" />
      </SkeletonGroup>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SkeletonGroup className="custom-class">
        <div />
      </SkeletonGroup>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SkeletonCard', () => {
  it('renders correct number of lines', () => {
    render(<SkeletonCard lines={4} />);

    const skeletons = screen.getAllByTestId('skeleton');

    // 1 title + 4 lines = 5
    expect(skeletons.length).toBe(5);
  });

  it('renders avatar when showAvatar is true', () => {
    render(<SkeletonCard showAvatar />);

    const skeletons = screen.getAllByTestId('skeleton');

    // avatar + title + 3 lines (default)
    expect(skeletons.length).toBe(5);
  });

  it('does not render avatar when showAvatar is false', () => {
    render(<SkeletonCard showAvatar={false} />);

    const skeletons = screen.getAllByTestId('skeleton');

    // title + 3 lines = 4
    expect(skeletons.length).toBe(4);
  });

  it('last line has 40% width', () => {
    render(<SkeletonCard lines={3} />);

    const skeletons = screen.getAllByTestId('skeleton');

    const lastLine = skeletons[skeletons.length - 1];
    expect(lastLine.style.width).toBe('40%');
  });
});

describe('SkeletonTable', () => {
  it('renders header when showHeader is true', () => {
    render(<SkeletonTable rows={2} columns={3} showHeader />);

    const skeletons = screen.getAllByTestId('skeleton');

    // header = 3
    // rows = 2 * 3 = 6
    // total = 9
    expect(skeletons.length).toBe(9);
  });

  it('does not render header when showHeader is false', () => {
    render(<SkeletonTable rows={2} columns={3} showHeader={false} />);

    const skeletons = screen.getAllByTestId('skeleton');

    // only rows = 2 * 3 = 6
    expect(skeletons.length).toBe(6);
  });

  it('respects default props', () => {
    render(<SkeletonTable />);

    const skeletons = screen.getAllByTestId('skeleton');

    // default rows=5, columns=4
    // header = 4
    // rows = 5*4 = 20
    // total = 24
    expect(skeletons.length).toBe(24);
  });
});
