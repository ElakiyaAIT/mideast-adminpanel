import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { LucideIcon } from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { forwardRef, type SVGProps } from 'react';

/**
 * Partial lucide mock (keep all real exports)
 */
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();

  return {
    ...actual,
    ArrowUpRight: () => <svg data-testid="arrow-up" />,
    ArrowDownRight: () => <svg data-testid="arrow-down" />,
  };
});

/**
 * Dummy icon for injection
 */
const MockIcon: LucideIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => (
  <svg ref={ref} data-testid="stat-icon" {...props} />
));
describe('StatCard', () => {
  it('renders title and formatted numeric value', () => {
    render(<StatCard title="Revenue" value={10000} icon={MockIcon} />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('renders string value without formatting', () => {
    render(<StatCard title="Plan" value="Pro" icon={MockIcon} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('renders positive trend correctly', () => {
    render(
      <StatCard
        title="Users"
        value={500}
        icon={MockIcon}
        trend={{ value: 12, isPositive: true, label: 'vs last week' }}
      />,
    );

    // Icon direction
    expect(screen.getByTestId('arrow-up')).toBeInTheDocument();

    // Percentage formatting
    expect(screen.getByText('+12%')).toBeInTheDocument();

    // Label
    expect(screen.getByText('vs last week')).toBeInTheDocument();

    // Assert positive styling (green gradient)
    const badge = screen.getByText('+12%').closest('span');
    expect(badge?.className).toContain('from-green-500');
  });

  it('renders negative trend correctly', () => {
    render(
      <StatCard
        title="Users"
        value={500}
        icon={MockIcon}
        trend={{ value: 8, isPositive: false }}
      />,
    );

    expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
    expect(screen.getByText('8%')).toBeInTheDocument();

    const badge = screen.getByText('8%').closest('span');
    expect(badge?.className).toContain('from-red-500');
  });

  it('renders the provided icon', () => {
    render(<StatCard title="Sales" value={100} icon={MockIcon} />);

    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('applies custom gradient classes', () => {
    const { container } = render(
      <StatCard
        title="Custom"
        value={1}
        icon={MockIcon}
        gradientFrom="red-500"
        gradientTo="blue-500"
      />,
    );

    expect(container.querySelector('.from-red-500')).toBeInTheDocument();
    expect(container.querySelector('.to-blue-500')).toBeInTheDocument();
  });

  it('does not render trend section when trend is undefined', () => {
    render(<StatCard title="No Trend" value={100} icon={MockIcon} />);

    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });
});
