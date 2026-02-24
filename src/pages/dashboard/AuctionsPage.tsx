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
  Pagination,
  Select,
  ConfirmDialog,
} from '../../components';
import { Search, RefreshCw, Gavel, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuctions, useDeleteAuction } from '../../hooks/queries';
import { useDebounce } from '../../hooks/useDebounce';
import type { FilterAuctionDto, AuctionDto } from '../../dto';
import type { AuctionStatus } from '../../dto';
import { AuctionStatusType } from '../../dto';
import AuctionFormModal from './components/AuctionFormModal';
import TableSkeleton, { type ColumnConfig } from '../../components/Skeleton/TableSkeleton';

const AuctionsPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | ''>('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<AuctionDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [auctionToDelete, setAuctionToDelete] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const queryParams = useMemo(
    (): FilterAuctionDto => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
    }),
    [page, limit, debouncedSearch, statusFilter],
  );

  // Skeleton Column Config
  const auctionColumns: ColumnConfig[] = [
    { width: 160, variant: 'rounded' }, // Auction
    { width: 80, variant: 'rounded' }, // Type
    { width: 100, variant: 'text' }, // Start Date
    { width: 100, variant: 'text' }, // End Date
    { width: 90, variant: 'rounded' }, // Status
    { width: 60, variant: 'rounded' }, // Actions
  ];
  const { data, isLoading, isFetching, refetch } = useAuctions(queryParams);
  const deleteMutation = useDeleteAuction();

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleAddAuction = (): void => {
    setSelectedAuction(null);
    setIsAddModalOpen(true);
  };

  const handleEditAuction = (auction: AuctionDto): void => {
    setSelectedAuction(auction);
    setIsEditModalOpen(true);
  };

  const handleDeleteAuction = (id: string): void => {
    setAuctionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (auctionToDelete) {
      await deleteMutation.mutateAsync(auctionToDelete);
      setAuctionToDelete(null);
    }
  };

  const handleCloseModals = (): void => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedAuction(null);
  };

  const getStatusBadge = (status: AuctionStatus) => {
    const variants: Record<AuctionStatus, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> =
      {
        [AuctionStatusType.DRAFT]: 'secondary',
        [AuctionStatusType.SCHEDULED]: 'info',
        [AuctionStatusType.LIVE]: 'success',
        [AuctionStatusType.ENDED]: 'warning',
        [AuctionStatusType.CANCELLED]: 'danger',
      };
    return (
      <Badge variant={variants[status]} size="sm">
        {status}
      </Badge>
    );
  };

  //loading skeleton
  if (isLoading && !data) {
    return (
      <div className="mt-10">
        <TableSkeleton columns={auctionColumns} rows={5} />
      </div>
    );
  }

  const auctions = data?.items || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Auctions</h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Manage equipment auctions
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleAddAuction}>
          <Plus className="mr-2 h-4 w-4" />
          Create Auction
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as AuctionStatus | '');
              setPage(1);
            }}
            options={[
              { label: 'All Status', value: '' },
              ...Object.values(AuctionStatusType).map((status) => ({
                label: status,
                value: status,
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
              <TableHead>Auction</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctions.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="py-12">
                  <div className="text-center">
                    <Gavel className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 font-medium text-gray-500">No auctions found</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              auctions.map((auction: AuctionDto) => (
                <TableRow key={auction._id} hover>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-500/30">
                        <Gavel className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {auction.title}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info" size="sm">
                      {auction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(auction.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(auction.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(auction.status)}</TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Edit auction"
                        onClick={() => handleEditAuction(auction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete auction"
                        onClick={() => handleDeleteAuction(auction._id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
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
              Showing {auctions.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} auctions
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </Card>

      {/* Modals */}
      <AuctionFormModal isOpen={isAddModalOpen} onClose={handleCloseModals} mode="create" />

      <AuctionFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        auction={selectedAuction}
        mode="edit"
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Auction"
        message="Are you sure you want to delete this auction? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AuctionsPage;
