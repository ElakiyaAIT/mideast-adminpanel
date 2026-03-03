import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { UserGrowthChart } from '../../components/dashboard/UserGrowthChart';

/**
 * Mock recharts completely
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
    BarChart: MockComponent('bar-chart'),
    CartesianGrid: MockComponent('cartesian-grid'),
    XAxis: MockComponent('x-axis'),
    YAxis: MockComponent('y-axis'),
    Tooltip: MockComponent('tooltip'),
    Legend: MockComponent('legend'),
    Bar: ({ name }: { name: string }) => <div data-testid="bar">{name}</div>,
  };
});

/**
 * Mock Chart wrapper
 */
vi.mock('../Chart', () => ({
  Chart: ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: ReactNode;
  }) => (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

describe('UserGrowthChart', () => {
  const mockData = [
    { name: 'Week 1', users: 100, new: 20 },
    { name: 'Week 2', users: 150, new: 50 },
  ];

  it('renders chart title and description', () => {
    render(<UserGrowthChart data={mockData} />);

    expect(screen.getByText('User Growth')).toBeInTheDocument();
    expect(screen.getByText('Weekly user statistics')).toBeInTheDocument();
  });

  it('renders recharts container components', () => {
    render(<UserGrowthChart data={mockData} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders both bars with correct labels', () => {
    render(<UserGrowthChart data={mockData} />);

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('New Users')).toBeInTheDocument();
  });
});
