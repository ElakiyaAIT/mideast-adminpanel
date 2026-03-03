import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryChart } from '../../components/dashboard/CategoryChart';
import type React from 'react';


// Mock Recharts to just render children as plain divs
vi.mock('recharts', () => {
  return {
    PieChart: ({ children }: {children:React.ReactNode}) => <div data-testid="piechart">{children}</div>,
    Pie: ({ data, children }: {children:React.ReactNode,data:any}) => (
      <div data-testid="pie" data-length={data.length}>
        {children}
      </div>
    ),
    Cell: ({ fill }: any) => <div data-testid="cell" data-fill={fill}></div>,
    Tooltip: () => <div data-testid="tooltip" />,
    ResponsiveContainer: ({ children }: {children:React.ReactNode}) => <div>{children}</div>,
  };
});

const sampleData = [
  { name: 'Electronics', value: 40, color: '#FF0000' },
  { name: 'Furniture', value: 30, color: '#00FF00' },
  { name: 'Clothing', value: 20, color: '#0000FF' },
  { name: 'Books', value: 10, color: '#FFFF00' },
];

describe('CategoryChart', () => {
  it('renders Chart wrapper with title and description', () => {
    render(<CategoryChart data={sampleData} />);
    expect(screen.getByText('Category Distribution')).toBeInTheDocument();
    expect(screen.getByText('Sales by category')).toBeInTheDocument();
  });

  it('renders Pie with correct number of cells', () => {
    const { getAllByTestId } = render(<CategoryChart data={sampleData} />);
    const pie = getAllByTestId('pie')[0];
    expect(Number(pie.getAttribute('data-length'))).toBe(sampleData.length);

    const cells = getAllByTestId('cell');
    expect(cells).toHaveLength(sampleData.length);
    cells.forEach((cell, index) => {
      expect(cell.getAttribute('data-fill')).toBe(sampleData[index].color);
    });
  });

  it('renders Tooltip', () => {
    render(<CategoryChart data={sampleData} />);
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });
});
