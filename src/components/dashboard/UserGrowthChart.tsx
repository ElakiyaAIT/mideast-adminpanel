import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Chart } from '../Chart';
import type { JSX } from 'react';

interface UserGrowthDataPoint {
  name: string;
  users: number;
  new: number;
}

interface UserGrowthChartProps {
  data: UserGrowthDataPoint[];
}

export const UserGrowthChart = ({ data }: UserGrowthChartProps): JSX.Element => {
  return (
    <Chart title="User Growth" description="Weekly user statistics">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
          <Bar dataKey="users" fill="#ebdb34" radius={[8, 8, 0, 0]} name="Total Users" />
          <Bar dataKey="new" fill="#facc15" radius={[8, 8, 0, 0]} name="New Users" />
        </BarChart>
      </ResponsiveContainer>
    </Chart>
  );
};
