import { useState, type JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
  Skeleton,
  Modal,
  Input,
  Select,
  ConfirmDialog,
} from '../../components';
import { Plus, Edit, Trash2, RefreshCw, Image } from 'lucide-react';
import { useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from '../../hooks/queries';
import type { BannerDto, CreateBannerDto, UpdateBannerDto } from '../../dto';
import type { BannerStatus } from '../../dto';
import { BannerPositionType, BannerStatusType } from '../../dto';
import { bannerSchema, type BannerFormData } from '../../utils/validation';

const BannersPage = (): JSX.Element => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerDto | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useBanners();
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bannerSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      imageUrl: '',
      linkUrl: null,
      position: BannerPositionType.HOME_HERO,
      status: BannerStatusType.ACTIVE,
      sortOrder: 1,
    },
  });

  const handleAdd = (): void => {
    setIsEditMode(false);
    setSelectedBanner(null);
    reset({
      title: '',
      imageUrl: '',
      linkUrl: null,
      position: BannerPositionType.HOME_HERO,
      status: BannerStatusType.ACTIVE,
      sortOrder: 1,
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (banner: BannerDto): void => {
    setIsEditMode(true);
    setSelectedBanner(banner);
    reset({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || null,
      position: banner.position,
      status: banner.status,
      sortOrder: banner.sortOrder,
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string): void => {
    setBannerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (bannerToDelete) {
      await deleteMutation.mutateAsync(bannerToDelete);
      setBannerToDelete(null);
    }
  };

  const onSubmit = async (data: BannerFormData): Promise<void> => {
    if (isEditMode && selectedBanner) {
      const updateData: UpdateBannerDto = data;
      await updateMutation.mutateAsync({ id: selectedBanner._id, data: updateData });
    } else {
      await createMutation.mutateAsync(data as CreateBannerDto);
    }
    setIsFormModalOpen(false);
  };

  const getStatusBadge = (status: BannerStatus) => {
    const variants: Record<BannerStatus, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> =
      {
        [BannerStatusType.ACTIVE]: 'success',
        [BannerStatusType.INACTIVE]: 'secondary',
        [BannerStatusType.SCHEDULED]: 'info',
        [BannerStatusType.EXPIRED]: 'danger',
      };
    return (
      <Badge variant={variants[status]} size="sm">
        {status}
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

  const banners = data ? data.data : [];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Banners</h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Manage website banners
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="md" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Banner
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead align="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="py-12">
                  <div className="text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 font-medium text-gray-500">No banners found</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              banners.length > 0 &&
              banners.map((banner: BannerDto) => (
                <TableRow key={banner._id} hover>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border">
                        <Image className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {banner.title}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info" size="sm">
                      {banner.position.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(banner.status)}</TableCell>
                  <TableCell>
                    <p className="text-sm">{banner.sortOrder}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{banner.clickCount || 0}</p>
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(banner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(banner._id)}
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
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={isEditMode ? 'Edit Banner' : 'Add Banner'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" type="text" {...register('title')} error={errors.title?.message} />
          <Input
            label="Image URL"
            type="text"
            {...register('imageUrl')}
            error={errors.imageUrl?.message}
          />
          <Input
            label="Link URL"
            type="text"
            {...register('linkUrl')}
            error={errors.linkUrl?.message}
          />
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <Select
                label="Position"
                {...field}
                error={errors.position?.message}
                options={Object.values(BannerPositionType).map((pos) => ({
                  value: pos,
                  label: pos.replace(/_/g, ' '),
                }))}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                {...field}
                error={errors.status?.message}
                options={Object.values(BannerStatusType).map((status) => ({
                  value: status,
                  label: status,
                }))}
              />
            )}
          />
          <Input
            label="Display Order"
            type="number"
            {...register('sortOrder', { valueAsNumber: true })}
            error={errors.sortOrder?.message}
          />
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default BannersPage;
