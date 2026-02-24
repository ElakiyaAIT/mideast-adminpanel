import { type JSX } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Skeleton,
  Card,
} from '../../components';

export type ColumnConfig = {
  width?: string | number;
  variant?: 'text' | 'rounded';
  className?: string;
  count?: number; // vertical lines per cell
  horizontalCount?: number; // horizontal skeletons per cell
};

type TableSkeletonProps = {
  columns: ColumnConfig[];
  rows?: number;
  cardWrapper?: boolean; // wrap in Card or not
};

const TableSkeleton = ({
  columns,
  rows = 5,
  cardWrapper = true,
}: TableSkeletonProps): JSX.Element => {
  const tableContent = (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i}>
              <Skeleton
                variant={col.variant || 'text'}
                width={col.width || '60%'}
                height={16}
                className={col.className}
              />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="h-16">
            {columns.map((col, colIndex) => (
              <TableCell
                key={colIndex}
                className={col.horizontalCount ? 'flex gap-2' : 'space-y-1'}
              >
                {col.horizontalCount
                  ? Array.from({ length: col.horizontalCount }).map((_, idx) => (
                      <Skeleton
                        key={idx}
                        variant={col.variant || 'rounded'}
                        width={
                          col.width
                            ? typeof col.width === 'number'
                              ? col.width / (col.horizontalCount ?? 1) - 4 // simple width division
                              : `calc(${col.width} / ${col.horizontalCount} - 4px)`
                            : 40
                        }
                        height={16}
                        className={col.className}
                      />
                    ))
                  : Array.from({ length: col.count || 1 }).map((_, skeletonIndex) => (
                      <Skeleton
                        key={skeletonIndex}
                        variant={col.variant || 'text'}
                        width={col.width || '80%'}
                        height={16}
                        className={col.className}
                      />
                    ))}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (cardWrapper) {
    return <Card>{tableContent}</Card>;
  }

  return tableContent;
};

export default TableSkeleton;
