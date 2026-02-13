import { type JSX, type ReactNode } from 'react';
import { cn } from '../../utils';
import type { ThHTMLAttributes } from 'react';

export interface TableProps {
  children: ReactNode;
  className?: string;
}

export interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center';
}

export interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const Table = ({ children, className }: TableProps): JSX.Element => {
  return (
    <div className="glass-frost overflow-x-auto rounded-xl border border-white/30 shadow-frost dark:border-white/10">
      <table className={cn('w-full', className)}>{children}</table>
    </div>
  );
};

export const TableHeader = ({ children, className }: TableHeaderProps): JSX.Element => {
  return (
    <thead className={cn('glass-light border-b border-white/30 dark:border-white/10', className)}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className }: TableBodyProps): JSX.Element => {
  return (
    <tbody className={cn('divide-y divide-white/20 dark:divide-white/10', className)}>
      {children}
    </tbody>
  );
};

export const TableRow = ({
  children,
  className,
  onClick,
  hover = false,
}: TableRowProps): JSX.Element => {
  return (
    <tr
      className={cn(
        'transition-all duration-200',
        hover && 'hover:glass-light hover:shadow-frost',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className, align = 'left' }: TableHeadProps): JSX.Element => {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      className={cn(
        'px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300',
        alignStyles[align],
        className,
      )}
    >
      {children}
    </th>
  );
};

export const TableCell = ({ children, className, align = 'left' }: TableCellProps): JSX.Element => {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={cn(
        'whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100',
        alignStyles[align],
        className,
      )}
    >
      {children}
    </td>
  );
};
