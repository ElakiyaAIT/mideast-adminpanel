import type { JSX } from 'react';
import { Card, Skeleton } from '../../components';
import {
  StatCard,
  RevenueChart,
  UserGrowthChart,
  CategoryChart,
  DashboardWidgets,
} from '../../components/dashboard';
import { useDashboardStats, useDashboardWidgets } from '../../hooks/queries';
import { formatCurrency } from '../../utils';
import { Users, Activity, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

// Mock chart data - replace with real data from API when available
const revenueData = [
  { name: 'Jan', value: 45000, target: 40000 },
  { name: 'Feb', value: 52000, target: 45000 },
  { name: 'Mar', value: 48000, target: 50000 },
  { name: 'Apr', value: 61000, target: 55000 },
  { name: 'May', value: 55000, target: 60000 },
  { name: 'Jun', value: 67000, target: 65000 },
];

const userGrowthData = [
  { name: 'Week 1', users: 1200, new: 150 },
  { name: 'Week 2', users: 1350, new: 180 },
  { name: 'Week 3', users: 1480, new: 200 },
  { name: 'Week 4', users: 1620, new: 220 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#ebdb34' },
  { name: 'Clothing', value: 25, color: '#facc15' },
  { name: 'Food', value: 20, color: '#fde047' },
  { name: 'Books', value: 15, color: '#fef08a' },
  { name: 'Other', value: 5, color: '#fef9c3' },
];

const DashboardHomePage = (): JSX.Element => {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: widgets, isLoading: isLoadingWidgets } = useDashboardWidgets();

  const isLoading = isLoadingStats || isLoadingWidgets;

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="space-y-3">
          <Skeleton variant="text" width="300px" height={40} />
          <Skeleton variant="text" width="400px" height={20} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton variant="text" width="60%" height={16} />
                  <Skeleton variant="text" width="40%" height={32} />
                </div>
                <Skeleton variant="circular" width={56} height={56} />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
              <Skeleton variant="text" width="50%" height={24} />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={300}
                className="mt-4 rounded-xl"
              />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <h1 className="text-gradient-brand text-3xl font-bold tracking-tight lg:text-4xl">
          Dashboard Overview
        </h1>
        <p className="text-base font-medium text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            trend={{ value: 12.5, isPositive: true }}
            icon={Users}
            gradientFrom="primary-500"
            gradientTo="primary-600"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            trend={{ value: 8.2, isPositive: true }}
            icon={Activity}
            gradientFrom="green-500"
            gradientTo="green-600"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            trend={{ value: 15.3, isPositive: true }}
            icon={DollarSign}
            gradientFrom="blue-500"
            gradientTo="blue-600"
          />
          <StatCard
            title="Monthly Growth"
            value={`${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}%`}
            trend={{
              value: Math.abs(stats.monthlyGrowth),
              isPositive: stats.monthlyGrowth > 0,
              label: stats.monthlyGrowth > 0 ? 'Growing' : 'Declining',
            }}
            icon={stats.monthlyGrowth > 0 ? TrendingUp : TrendingDown}
            gradientFrom="purple-500"
            gradientTo="purple-600"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueData} />
        <UserGrowthChart data={userGrowthData} />
        <CategoryChart data={categoryData} />
      </div>

      {widgets && <DashboardWidgets widgets={widgets} />}
    </div>
  );
};

export default DashboardHomePage;
