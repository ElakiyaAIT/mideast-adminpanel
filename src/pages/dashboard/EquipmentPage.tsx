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
  ConfirmDialog,
} from '../../components';
import { Search, RefreshCw, Package, Edit, Trash2, Plus } from 'lucide-react';
import { useEquipment, useDeleteEquipment } from '../../hooks/queries';
import { useDebounce } from '../../hooks/useDebounce';
import type { FilterEquipmentDto, EquipmentDto } from '../../dto';
import { EquipmentStatusType } from '../../dto';
import type { EquipmentStatus } from '../../dto';
import { formatCurrency } from '../../utils';
import EquipmentFormModal from './components/EquipmentFormModal';

const EquipmentPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | ''>('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const queryParams = useMemo(
    (): FilterEquipmentDto => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
    }),
    [page, limit, debouncedSearch, statusFilter],
  );

  const { data, isLoading, isFetching, refetch } = useEquipment(queryParams);
  const deleteMutation = useDeleteEquipment();

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string): void => {
    setEquipmentToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (equipmentToDelete) {
      await deleteMutation.mutateAsync(equipmentToDelete);
      setEquipmentToDelete(null);
    }
  };

  const handleAddEquipment = (): void => {
    setSelectedEquipment(null);
    setIsAddModalOpen(true);
  };

  const handleEditEquipment = (item: EquipmentDto): void => {
    setSelectedEquipment(item);
    setIsEditModalOpen(true);
  };

  const handleCloseModals = (): void => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedEquipment(null);
  };

  const getStatusBadge = (status: EquipmentStatus) => {
    const variants: Record<
      EquipmentStatus,
      'success' | 'warning' | 'danger' | 'info' | 'secondary'
    > = {
      [EquipmentStatusType.DRAFT]: 'secondary',
      [EquipmentStatusType.PENDING_APPROVAL]: 'warning',
      [EquipmentStatusType.APPROVED]: 'success',
      [EquipmentStatusType.REJECTED]: 'danger',
      [EquipmentStatusType.ACTIVE]: 'info',
      [EquipmentStatusType.SOLD]: 'success',
      [EquipmentStatusType.ARCHIVED]: 'secondary',
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

  const equipment = data?.items || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">
            Equipment Listings
          </h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Manage all equipment listings
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleAddEquipment}>
          <Plus className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as EquipmentStatus | '');
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Status' },
              ...Object.values(EquipmentStatusType).map((status) => ({
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
        <div className="relative">
          {isFetching && data && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
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
                      <p className="mt-2 font-medium text-gray-500">No equipment found</p>
                    </div>
                  </td>
                </TableRow>
              ) : (
                equipment.length > 0 &&
                equipment.map((item: EquipmentDto) => (
                  <TableRow key={item._id} hover>
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
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(item.buyNowPrice || 0)}
                      </p>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {item.sellerId?.firstName} {item.sellerId?.lastName}
                      </p>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit equipment"
                          onClick={() => handleEditEquipment(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete equipment"
                          onClick={() => handleDelete(item._id)}
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
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {equipment.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} items
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      {/* Modals */}
      <EquipmentFormModal isOpen={isAddModalOpen} onClose={handleCloseModals} mode="create" />

      <EquipmentFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        equipment={selectedEquipment}
        mode="edit"
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Equipment"
        message="Are you sure you want to delete this equipment? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default EquipmentPage;
