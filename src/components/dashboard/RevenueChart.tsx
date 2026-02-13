import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Chart } from '../Chart';
import type { JSX } from 'react';

interface RevenueDataPoint {
  name: string;
  value: number;
  target: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export const RevenueChart = ({ data }: RevenueChartProps): JSX.Element => {
  return (
    <Chart
      title="Revenue Overview"
      description="Monthly revenue vs target"
      className="lg:col-span-2"
    >
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ebdb34" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ebdb34" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-400" />
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
            dataKey="value"
            stroke="#ebdb34"
            strokeWidth={3}
            fill="url(#colorRevenue)"
            name="Revenue"
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#colorTarget)"
            name="Target"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Chart>
  );
};
