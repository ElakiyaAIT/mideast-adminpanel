import { useState, useMemo, type JSX } from 'react';
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
  Pagination,
  Select,
} from '../../components';
import { RefreshCw, FileText, Calendar } from 'lucide-react';
import { useAuditLogs } from '../../hooks/queries';
import type { AuditLogQueryParams, AuditLogDto } from '../../dto';
import type { AuditAction } from '../../dto';
import { AuditActionType } from '../../dto';
import type { ColumnConfig } from '../../components/Skeleton/TableSkeleton';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';
import { UAParser } from 'ua-parser-js';

const AuditLogsPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [actionFilter, setActionFilter] = useState<AuditAction | ''>('');

  // Skeleton Column Config
  const auditLogColumns: ColumnConfig[] = [
    { width: 250, count: 2 }, // Admin: name + email
    { width: 120, variant: 'rounded' }, // Action: badge style
    { width: 400 }, // Description
    { width: 250, count: 2 }, // Target: type + id
    { width: 150 }, // IP Address
    { width: 200 }, // Date
  ];

  const formatUserAgent = (uaString?: string) => {
    if (!uaString) return 'Unknown Device';

    const parser = new UAParser(uaString);
    const browser = parser.getBrowser(); // e.g., { name: "Chrome", version: "145.0.0.0" }
    const os = parser.getOS(); // e.g., { name: "Windows", version: "10" }

    // Create a human-readable string
    return `${browser.name || 'Unknown Browser'} on ${os.name || 'Unknown OS'} ${os.version || ''}`.trim();
  };
  const queryParams = useMemo(
    (): AuditLogQueryParams => ({
      page,
      limit,
      action: actionFilter || undefined,
    }),
    [page, limit, actionFilter],
  );

  const { data, isLoading, isFetching, refetch } = useAuditLogs(queryParams);

  const getActionBadge = (action: AuditAction) => {
    const variants: Record<AuditAction, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
      [AuditActionType.CREATE]: 'success',
      [AuditActionType.UPDATE]: 'info',
      [AuditActionType.DELETE]: 'danger',
      [AuditActionType.APPROVE]: 'success',
      [AuditActionType.REJECT]: 'danger',
      [AuditActionType.CANCEL]: 'warning',
      [AuditActionType.VERIFY]: 'success',
      [AuditActionType.SUSPEND]: 'danger',
      [AuditActionType.BLOCK]: 'danger',
      [AuditActionType.RESTORE]: 'info',
      [AuditActionType.LOGIN]: 'secondary',
      [AuditActionType.LOGOUT]: 'secondary',
      [AuditActionType.REFUND]: 'warning',
      [AuditActionType.PAYOUT]: 'success',
    };
    return (
      <Badge variant={variants[action]} size="sm">
        {action}
      </Badge>
    );
  };

  //loading skeleton
  if (isLoading && !data) {
    return (
      <div className="mt-10">
        <TableSkeleton columns={auditLogColumns} rows={5} cardWrapper={true} />
      </div>
    );
  }

  const logs = data?.data?.items || [];
  const total = data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.pagination?.totalPages || 1;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Track all admin activities
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value as AuditAction | '');
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Actions' },
              ...Object.values(AuditActionType).map((action) => ({
                value: action,
                label: action,
              })),
            ]}
          />
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <td colSpan={5} className="py-12">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 font-medium text-gray-500">No audit logs found</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              logs.map((log: AuditLogDto) => (
                <TableRow key={log._id} hover>
                  <TableCell>
                    <div>
                      <p
                        className="truncate font-semibold text-gray-900 dark:text-white"
                        title={`${log.adminId?.firstName} ${log.adminId?.lastName}`}
                      >
                        {log.adminId?.firstName} {log.adminId?.lastName}
                      </p>
                      <p className="truncate text-xs text-gray-500" title={log?.adminId?.email}>
                        {log.adminId?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell className="max-w-xs">
                    <p
                      className="truncate text-sm font-medium text-gray-900 dark:text-white"
                      title={log.description}
                    >
                      {log.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.targetType}
                      </p>
                      <p className="text-xs text-gray-500">{log.targetId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                      {log.ipAddress || '-'}
                    </code>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                      {formatUserAgent(log?.userAgent) || '-'}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {logs.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} logs
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuditLogsPage;
