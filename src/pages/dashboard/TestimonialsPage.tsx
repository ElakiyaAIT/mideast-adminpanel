import { useState, useMemo, type JSX } from 'react';
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Pagination,
  ConfirmDialog,
} from '../../components';
import { MessageSquareQuote, Plus, Edit, Trash2 } from 'lucide-react';
// import { useDebounce } from '../../hooks/useDebounce';

// import TestimonialFormModal from './components/TestimonialFormModal';
import type { TestimonialDto, FilterTestimonialDto } from '../../dto/testimonial.dto';
import { useTestimonials, useDeleteTestimonial } from '../../hooks/queries/useTestimonial';
import TestimonialFormModal from './components/TestimonialFormModal';
import type { ColumnConfig } from '../../components/Skeleton/TableSkeleton';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';

const TestimonialsPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  // const [searchTerm, setSearchTerm] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialDto | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);

  // Skeleton Column Config
  const testimonialColumns: ColumnConfig[] = [
    { width: 150 }, // Customer
    { width: 80 }, // Role
    { width: 100, variant: 'rounded' }, // Review
    { width: 60, horizontalCount: 2, variant: 'rounded' }, // Actions
  ];

  // const debouncedSearch = useDebounce(searchTerm, 500);
  const search = '';
  const queryParams = useMemo(
    (): FilterTestimonialDto => ({
      page,
      limit,
      search,
    }),
    [page, limit, search],
  );

  const { data, isLoading } = useTestimonials(queryParams);
  const deleteMutation = useDeleteTestimonial();

  // const handleSearchChange = (value: string): void => {
  //   setSearchTerm(value);
  //   setPage(1);
  // };

  const handleAdd = (): void => {
    setSelectedTestimonial(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (testimonial: TestimonialDto): void => {
    setSelectedTestimonial(testimonial);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string): void => {
    setTestimonialToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (testimonialToDelete) {
      await deleteMutation.mutateAsync(testimonialToDelete);
      setTestimonialToDelete(null);
    }
  };

  const handleCloseModals = (): void => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTestimonial(null);
  };

  //loading skeleton
  if (isLoading && !data) {
    return (
      <div className="mt-10 animate-fade-in space-y-6">
        <TableSkeleton columns={testimonialColumns} rows={5} cardWrapper={true} />
      </div>
    );
  }

  const testimonials = data?.items || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Manage customer testimonials
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Search */}
      {/* <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10"
            />
          </div>

          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </Card> */}

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Review</TableHead>
              <TableHead align="right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {testimonials.length === 0 ? (
              <TableRow>
                <td colSpan={4} className="py-12">
                  <div className="text-center">
                    <MessageSquareQuote className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 font-medium text-gray-500">No testimonials found</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              testimonials.map((testimonial: TestimonialDto) => (
                <TableRow key={testimonial._id} hover>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-500/30">
                        {testimonial.image ? (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="h-10 w-10 rounded-xl object-cover"
                          />
                        ) : (
                          <MessageSquareQuote className="h-5 w-5 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold truncate text-gray-900 dark:text-white" title={testimonial?.name}>
                          {testimonial?.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400" title={testimonial?.role}>
                      {testimonial?.role}
                    </p></TableCell>

                  <TableCell>
                    <p className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400" title={testimonial?.review}>
                      {testimonial?.review}
                    </p>
                  </TableCell>

                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(testimonial)}>
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(testimonial._id)}
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
              Showing {testimonials.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} testimonials
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
      <TestimonialFormModal isOpen={isAddModalOpen} onClose={handleCloseModals} mode="create" />

      <TestimonialFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        testimonial={selectedTestimonial}
        mode="edit"
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default TestimonialsPage;
