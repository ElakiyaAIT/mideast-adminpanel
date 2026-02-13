import { Card, Chart, Badge } from '../../components';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Eye, MousePointerClick } from 'lucide-react';
import type { JSX } from 'react';

const AnalyticsPage = (): JSX.Element => {
  // Mock analytics data
  const trafficData = [
    { date: 'Mon', visitors: 4000, pageViews: 2400, clicks: 1200 },
    { date: 'Tue', visitors: 3000, pageViews: 1398, clicks: 980 },
    { date: 'Wed', visitors: 2000, pageViews: 9800, clicks: 800 },
    { date: 'Thu', visitors: 2780, pageViews: 3908, clicks: 1100 },
    { date: 'Fri', visitors: 1890, pageViews: 4800, clicks: 900 },
    { date: 'Sat', visitors: 2390, pageViews: 3800, clicks: 1050 },
    { date: 'Sun', visitors: 3490, pageViews: 4300, clicks: 1300 },
  ];

  const conversionData = [
    { month: 'Jan', conversions: 65, rate: 2.5 },
    { month: 'Feb', conversions: 78, rate: 3.1 },
    { month: 'Mar', conversions: 82, rate: 3.4 },
    { month: 'Apr', conversions: 90, rate: 3.8 },
    { month: 'May', conversions: 95, rate: 4.2 },
    { month: 'Jun', conversions: 105, rate: 4.5 },
  ];

  const deviceData = [
    { device: 'Desktop', users: 65, color: '#ebdb34' },
    { device: 'Mobile', users: 25, color: '#facc15' },
    { device: 'Tablet', users: 10, color: '#fde047' },
  ];

  const topPages = [
    { page: '/dashboard', views: 12500, bounce: 12.5 },
    { page: '/products', views: 9800, bounce: 8.2 },
    { page: '/about', views: 7200, bounce: 15.3 },
    { page: '/contact', views: 5400, bounce: 18.7 },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-gradient-brand text-3xl font-bold tracking-tight lg:text-4xl">
          Analytics Dashboard
        </h1>
        <p className="text-base font-medium text-gray-600 dark:text-gray-400">
          Comprehensive insights into your platform performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                Total Visitors
              </p>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">18,920</p>
            <Badge variant="success" size="sm">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5%
            </Badge>
          </div>
        </Card>

        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-2xl" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                Page Views
              </p>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">45,230</p>
            <Badge variant="success" size="sm">
              <TrendingUp className="mr-1 h-3 w-3" />
              +8.3%
            </Badge>
          </div>
        </Card>

        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br from-green-500/20 to-transparent blur-2xl" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                Click Rate
              </p>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                <MousePointerClick className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">4.2%</p>
            <Badge variant="success" size="sm">
              <TrendingUp className="mr-1 h-3 w-3" />
              +0.5%
            </Badge>
          </div>
        </Card>

        <Card className="group relative overflow-hidden">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br from-primary-500/20 to-transparent blur-2xl" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                Revenue
              </p>
              <div className="hover:shadow-glow-brand-lg flex h-12 w-12 items-center justify-center rounded-xl border border-primary-400/30 bg-gradient-to-br from-primary-500 to-primary-600 backdrop-blur-sm transition-all duration-300">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">$125K</p>
            <Badge variant="success" size="sm">
              <TrendingUp className="mr-1 h-3 w-3" />
              +15.2%
            </Badge>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Chart title="Traffic Overview" description="Weekly visitor statistics">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ebdb34" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ebdb34" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-gray-700"
              />
              <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#ebdb34"
                strokeWidth={3}
                fill="url(#colorVisitors)"
                name="Visitors"
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="#facc15"
                strokeWidth={2}
                fill="url(#colorVisitors)"
                fillOpacity={0.2}
                name="Page Views"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Conversion Rate" description="Monthly conversion trends">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-gray-700"
              />
              <XAxis dataKey="month" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="conversions" fill="#ebdb34" radius={[8, 8, 0, 0]} name="Conversions" />
              <Bar dataKey="rate" fill="#facc15" radius={[8, 8, 0, 0]} name="Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Device Distribution" description="Traffic by device type">
          <div className="space-y-4">
            {deviceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.device}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.users}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    {item.users}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Pages" description="Most visited pages">
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div
                key={index}
                className="glass-light hover:glass flex items-center justify-between rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-white/20 hover:shadow-frost dark:hover:border-white/10"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{page.page}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {page.views.toLocaleString()} views
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={page.bounce < 15 ? 'success' : 'warning'} size="sm">
                    {page.bounce}% bounce
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
