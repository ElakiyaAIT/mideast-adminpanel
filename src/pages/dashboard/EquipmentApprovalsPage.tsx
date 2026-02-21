import { useState, type JSX } from 'react';
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Skeleton,
  Pagination,
  Checkbox,
  PromptDialog,
} from '../../components';
import { RefreshCw, Package, Check, X, CheckSquare } from 'lucide-react';
import {
  usePendingApprovals,
  useApproveEquipment,
  useRejectEquipment,
  useBulkApproveEquipment,
} from '../../hooks/queries';
import type { EquipmentDto } from '../../dto';
import { formatCurrency } from '../../utils';

const EquipmentApprovalsPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [equipmentToReject, setEquipmentToReject] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = usePendingApprovals(page, limit);
  const approveMutation = useApproveEquipment();
  const rejectMutation = useRejectEquipment();
  const bulkApproveMutation = useBulkApproveEquipment();

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
    setSelectedIds([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAll = (checked: boolean): void => {
    if (checked) {
      setSelectedIds(equipment.map((item) => item._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean): void => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleApprove = async (id: string): Promise<void> => {
    await approveMutation.mutateAsync({
      id,
      data: { isPublished: true, isFeatured: false },
    });
  };

  const handleReject = (id: string): void => {
    setEquipmentToReject(id);
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async (reason: string): Promise<void> => {
    if (equipmentToReject) {
      await rejectMutation.mutateAsync({
        id: equipmentToReject,
        data: { rejectionReason: reason },
      });
      setEquipmentToReject(null);
    }
  };

  const handleBulkApprove = async (): Promise<void> => {
    if (selectedIds.length === 0) return;
    await bulkApproveMutation.mutateAsync({
      equipmentIds: selectedIds,
      isPublished: true,
      isFeatured: false,
    });
    setSelectedIds([]);
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

  const equipment = data?.items || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">
            Equipment Approvals
          </h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Review and approve pending equipment listings
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="primary"
              size="md"
              onClick={handleBulkApprove}
              disabled={bulkApproveMutation.isPending}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Approve Selected ({selectedIds.length})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card>
        <div className="relative">
          {isFetching && data && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={equipment.length > 0 && selectedIds.length === equipment.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead align="right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="py-12">
                    <div className="text-center">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 font-medium text-gray-500">No pending approvals</p>
                    </div>
                  </td>
                </TableRow>
              ) : (
                equipment.map((item: EquipmentDto) => (
                  <TableRow key={item._id} hover>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(item._id)}
                        onChange={(e) => handleSelectOne(item._id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-500/30">
                          <Package className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500">{item.make}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {item.categoryId?.name || '-'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold">
                        {formatCurrency(item.buyNowPrice ? item.buyNowPrice : 0)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {item.sellerId?.firstName} {item.sellerId?.lastName}
                      </p>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(item._id)}
                          disabled={approveMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(item._id)}
                          disabled={rejectMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {equipment.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} pending items
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      <PromptDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onSubmit={confirmReject}
        title="Reject Equipment"
        message="Please provide a reason for rejecting this equipment:"
        placeholder="Enter rejection reason..."
        confirmText="Reject"
        isLoading={rejectMutation.isPending}
        multiline
        minlength={10}
      />
    </div>
  );
};

export default EquipmentApprovalsPage;
