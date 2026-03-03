import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ColumnConfig } from '../../components/Skeleton/TableSkeleton';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import type React from 'react';

// ✅ MOCK BEFORE IMPORT RESOLUTION
vi.mock('../../components', () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table data-testid="table">{children}</table>
  ),
  TableHeader: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
  TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
  TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
  TableHead: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  TableCell: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <td data-testid="table-cell" className={className}>
      {children}
    </td>
  ),
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  Skeleton: ({ variant, width }: { variant?: string; width: string | number }) => (
    <div data-testid="skeleton" data-variant={variant} data-width={width} />
  ),
}));

describe('TableSkeleton', () => {
  const baseColumns: ColumnConfig[] = [{ width: '50%' }, { width: 100, count: 2 }];

  it('renders inside Card by default', () => {
    render(<TableSkeleton columns={baseColumns} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('does not wrap in Card when cardWrapper is false', () => {
    render(<TableSkeleton columns={baseColumns} cardWrapper={false} />);

    expect(screen.queryByTestId('card')).not.toBeInTheDocument();
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('renders correct number of header skeletons', () => {
    render(<TableSkeleton columns={baseColumns} />);

    const skeletons = screen.getAllByTestId('skeleton');

    // 2 header skeletons + (rows * cell skeletons)
    // default rows = 5
    // column 1 → 1 skeleton per row
    // column 2 → count: 2 per row
    // so per row = 3 skeletons
    // 5 rows = 15
    // total = 15 + 2 header = 17
    expect(skeletons.length).toBe(17);
  });

  it('respects custom row count', () => {
    render(<TableSkeleton columns={baseColumns} rows={2} />);

    const skeletons = screen.getAllByTestId('skeleton');

    // header: 2
    // rows: 2
    // per row: 3
    // total = 2 + (2*3) = 8
    expect(skeletons.length).toBe(8);
  });

  it('renders horizontal skeletons when horizontalCount is provided', () => {
    const columns: ColumnConfig[] = [{ horizontalCount: 3, width: 90 }];

    render(<TableSkeleton columns={columns} rows={1} />);

    const skeletons = screen.getAllByTestId('skeleton');

    // 1 header + 3 horizontal in row
    expect(skeletons.length).toBe(4);
  });

  it('applies correct variant defaults', () => {
    render(<TableSkeleton columns={baseColumns} rows={1} />);

    const skeletons = screen.getAllByTestId('skeleton');

    // header skeleton default variant = text
    expect(skeletons[0]).toHaveAttribute('data-variant', 'text');
  });

  it('applies custom variant when provided', () => {
    const columns: ColumnConfig[] = [{ variant: 'rounded' }];

    render(<TableSkeleton columns={columns} rows={1} />);

    const skeleton = screen.getAllByTestId('skeleton')[0];
    expect(skeleton).toHaveAttribute('data-variant', 'rounded');
  });
});
