import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Chart } from '../Chart';
import type { JSX } from 'react';

interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface CategoryChartProps {
  data: CategoryDataPoint[];
}

export const CategoryChart = ({ data }: CategoryChartProps): JSX.Element => {
  return (
    <Chart title="Category Distribution" description="Sales by category">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Chart>
  );
};
