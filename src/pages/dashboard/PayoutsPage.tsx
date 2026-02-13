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
  PromptDialog,
} from '../../components';
import { Search, RefreshCw, DollarSign, Check, Pause, Eye } from 'lucide-react';
import { usePayouts, useApprovePayout, useHoldPayout } from '../../hooks/queries';
import { useDebounce } from '../../hooks/useDebounce';
import type { PayoutQueryParams, PayoutDto } from '../../dto';
import { PayoutStatusType } from '../../dto';
import type { PayoutStatus } from '../../dto';
import { formatCurrency } from '../../utils';
import PayoutDetailModal from './components/PayoutDetailModal';

const PayoutsPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | ''>('');

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutDto | null>(null);
  const [isHoldDialogOpen, setIsHoldDialogOpen] = useState(false);
  const [payoutToHold, setPayoutToHold] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const queryParams = useMemo(
    (): PayoutQueryParams => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
    }),
    [page, limit, debouncedSearch, statusFilter],
  );

  const { data, isLoading, isFetching, refetch } = usePayouts(queryParams);
  const approveMutation = useApprovePayout();
  const holdMutation = useHoldPayout();

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleApprove = async (id: string): Promise<void> => {
    await approveMutation.mutateAsync({ id, data: { notes: 'Approved by admin' } });
  };

  const handleHold = (id: string): void => {
    setPayoutToHold(id);
    setIsHoldDialogOpen(true);
  };

  const confirmHold = async (reason: string): Promise<void> => {
    if (payoutToHold) {
      await holdMutation.mutateAsync({ id: payoutToHold, data: { holdReason: reason } });
      setPayoutToHold(null);
    }
  };

  const handleViewPayout = (payout: PayoutDto): void => {
    setSelectedPayout(payout);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsDetailModalOpen(false);
    setSelectedPayout(null);
  };

  const getStatusBadge = (status: PayoutStatus) => {
    const variants: Record<PayoutStatus, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> =
      {
        [PayoutStatusType.PENDING]: 'warning',
        [PayoutStatusType.APPROVED]: 'info',
        [PayoutStatusType.PROCESSING]: 'info',
        [PayoutStatusType.COMPLETED]: 'success',
        [PayoutStatusType.FAILED]: 'danger',
        [PayoutStatusType.ON_HOLD]: 'warning',
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

  const payouts = data?.items || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Payouts</h1>
        <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
          Manage seller payouts
        </p>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search payouts..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as PayoutStatus | '');
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Status' },
              ...Object.values(PayoutStatusType).map((status) => ({
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
              <TableHead>Payout ID</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead align="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length === 0 ? (
              <TableRow>
                <td colSpan={7} className="py-12">
                  <div className="text-center">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 font-medium text-gray-500">No payouts found</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              payouts.map((payout: PayoutDto) => (
                <TableRow key={payout._id} hover>
                  <TableCell>
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                      {payout._id.slice(0, 8)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {payout.seller?.firstName} {payout.seller?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{payout.seller?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{formatCurrency(payout.amount)}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {payout.order?._id.slice(0, 8) || '-'}
                    </p>
                  </TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2">
                      {payout.status === PayoutStatusType.PENDING && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(payout._id)}
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleHold(payout._id)}
                            disabled={holdMutation.isPending}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View payout details"
                        onClick={() => handleViewPayout(payout)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
              Showing {payouts.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} payouts
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
      <PayoutDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        payout={selectedPayout}
      />

      <PromptDialog
        isOpen={isHoldDialogOpen}
        onClose={() => setIsHoldDialogOpen(false)}
        onSubmit={confirmHold}
        title="Hold Payout"
        message="Please provide a reason for holding this payout:"
        placeholder="Enter reason for hold..."
        confirmText="Hold Payout"
        isLoading={holdMutation.isPending}
        multiline
      />
    </div>
  );
};

export default PayoutsPage;
