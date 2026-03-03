import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { RevenueChart } from '../../components/dashboard/RevenueChart';

/**
 * Mock recharts
 */
vi.mock('recharts', () => {
  const MockComponent =
    (testId: string) =>
    ({ children, ...props }: { children?: ReactNode }) => (
      <div data-testid={testId} {...props}>
        {children}
      </div>
    );

  return {
    ResponsiveContainer: MockComponent('responsive-container'),
    AreaChart: MockComponent('area-chart'),
    CartesianGrid: MockComponent('cartesian-grid'),
    XAxis: MockComponent('x-axis'),
    YAxis: MockComponent('y-axis'),
    Tooltip: MockComponent('tooltip'),
    Legend: MockComponent('legend'),
    Area: ({ name }: { name: string }) => <div data-testid="area">{name}</div>,
  };
});

/**
 * Mock Chart wrapper
 */
vi.mock('../Chart', () => ({
  Chart: ({
    title,
    description,
    className,
    children,
  }: {
    title: string;
    description: string;
    className?: string;
    children: ReactNode;
  }) => (
    <div data-testid="chart-wrapper" className={className}>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

describe('RevenueChart', () => {
  const mockData = [
    { name: 'Jan', value: 10000, target: 12000 },
    { name: 'Feb', value: 15000, target: 14000 },
  ];

  it('renders chart title and description', () => {
    render(<RevenueChart data={mockData} />);

    expect(screen.getByText('Revenue Overview')).toBeInTheDocument();
    expect(screen.getByText('Monthly revenue vs target')).toBeInTheDocument();
  });

  it('passes className to Chart wrapper', () => {
    const { container } = render(<RevenueChart data={mockData} />);

    const wrapper = container.querySelector('.lg\\:col-span-2');
    expect(wrapper).toBeInTheDocument();
  });
  it('renders recharts structure', () => {
    render(<RevenueChart data={mockData} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders both areas with correct labels', () => {
    render(<RevenueChart data={mockData} />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
  });
});
