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
  Input,
  Skeleton,
  Pagination,
  Select,
} from '../../components';
import { Search, RefreshCw, CreditCard, Eye } from 'lucide-react';
import { usePayments } from '../../hooks/queries';
import { useDebounce } from '../../hooks/useDebounce';
import type { PaymentQueryParams, PaymentDto } from '../../dto';
import { PaymentStatusType } from '../../dto';
import type { PaymentStatus } from '../../dto';
import { formatCurrency } from '../../utils';
import PaymentDetailModal from './components/PaymentDetailModal';

const PaymentsPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const queryParams = useMemo(
    (): PaymentQueryParams => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
    }),
    [page, limit, debouncedSearch, statusFilter],
  );

  const { data, isLoading, isFetching, refetch } = usePayments(queryParams);

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleViewPayment = (payment: PaymentDto): void => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsDetailModalOpen(false);
    setSelectedPayment(null);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const variants: Record<PaymentStatus, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> =
      {
        [PaymentStatusType.PENDING]: 'warning',
        [PaymentStatusType.PROCESSING]: 'info',
        [PaymentStatusType.COMPLETED]: 'success',
        [PaymentStatusType.FAILED]: 'danger',
        [PaymentStatusType.REFUNDED]: 'secondary',
        [PaymentStatusType.PARTIALLY_REFUNDED]: 'warning',
      };
    return (
      <Badge variant={variants[status]} size="sm">
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  if (isLoading && !data) {
    return (
      <div className="animate-fade-in space-y-6">
        <Skeleton variant="text" width="250px" height={40} />
        <Card>
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Card>
      </div>
    );
  }

  const payments = data?.items || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
          Manage payment transactions
        </p>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as PaymentStatus | '');
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Status' },
              ...Object.values(PaymentStatusType).map((status) => ({
                value: status,
                label: status.replace(/_/g, ' '),
              })),
            ]}
          />
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead align="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <td colSpan={7} className="py-12">
                  <div className="text-center">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 font-medium text-gray-500">No payments found</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              payments.map((payment: PaymentDto) => (
                <TableRow key={payment._id} hover>
                  <TableCell>
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                      {payment.transactionId || payment._id.slice(0, 8)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {payment.order?._id.slice(0, 8) || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info" size="sm">
                      {payment.paymentMethod.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="View payment details"
                      onClick={() => handleViewPayment(payment)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {payments.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} payments
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <PaymentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentsPage;
