import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { DashboardWidgetDto } from '../../dto';
import { DashboardWidgets } from '../../components/dashboard/DashboardWidgets';

describe('DashboardWidgets', () => {
  const widgets: DashboardWidgetDto[] = [
    {
      id: '1',
      title: 'Users',
      value: 1234,
      icon: 'users',
      change: 10,
      changeType: 'increase',
    },
    {
      id: '2',
      title: 'Revenue',
      value: 5678,
      icon: 'revenue',
      change: 5,
      changeType: 'decrease',
    },
  ];

  it('renders nothing if widgets array is empty', () => {
    const { container } = render(<DashboardWidgets widgets={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the correct number of widgets', () => {
    render(<DashboardWidgets widgets={widgets} />);
    const titles = screen.getAllByText(/Users|Revenue/);
    expect(titles.length).toBe(2);
  });

  it('displays widget values correctly', () => {
    render(<DashboardWidgets widgets={widgets} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('5,678')).toBeInTheDocument();
  });

  it('displays increase badge correctly', () => {
    render(<DashboardWidgets widgets={widgets} />);
    const increaseBadge = screen.getByText('+10%');
    expect(increaseBadge).toBeInTheDocument();
  });

  it('displays decrease badge correctly', () => {
    render(<DashboardWidgets widgets={widgets} />);
    const decreaseBadge = screen.getByText('5%');
    expect(decreaseBadge).toBeInTheDocument();
  });

  it('renders default Activity icon if icon key is unknown', () => {
    const unknownIconWidget: DashboardWidgetDto[] = [
      {
        id: '3',
        title: 'Unknown',
        value: 100,
        icon: 'unknown',
        change: 0,
        changeType: 'increase',
      },
    ];

    const { container } = render(<DashboardWidgets widgets={unknownIconWidget} />);

    const activityIcon = container.querySelector('.lucide-activity');
    expect(activityIcon).toBeInTheDocument();
  });
});
