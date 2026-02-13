import { useState, useMemo, type JSX, useEffect } from 'react';
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
  Input,
  Skeleton,
  Pagination,
  Modal,
  ConfirmDialog,
  Checkbox,
  ImageUpload,
} from '../../components';
import { Plus, Edit, Trash2, Search, RefreshCw, FolderTree } from 'lucide-react';
import {
  useEquipmentCategories,
  useDeleteEquipmentCategory,
  useCreateEquipmentCategory,
  useUpdateEquipmentCategory,
} from '../../hooks/queries';
import { useDebounce } from '../../hooks/useDebounce';
import type {
  EquipmentCategoryQueryParams,
  EquipmentCategoryDto,
  CreateEquipmentCategoryDto,
  UpdateEquipmentCategoryDto,
} from '../../dto';
import { createCategorySchema, type CreateCategoryFormData } from '../../utils/validation';
import {  equipmentCategoryApi } from '../../api/equipmentApi';

const EquipmentCategoriesPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategoryDto | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  //IMAGE UPLOAD IN EQUIPMENT CATEGORY
  const [imageFile, setImageFile] = useState<File | null>(null);
const [existingImage, setExistingImage] = useState<string | null>(null);
const [isUploading, setIsUploading] = useState(false);

  // Debounce search term
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Build query params
  const queryParams = useMemo(
    (): EquipmentCategoryQueryParams => ({
      page,
      limit,
      search: debouncedSearch || undefined,
    }),
    [page, limit, debouncedSearch],
  );

  // Fetch categories
  const { data, isLoading, isFetching, refetch } = useEquipmentCategories(queryParams);

  // Mutations
  const createMutation = useCreateEquipmentCategory();
  const updateMutation = useUpdateEquipmentCategory();
  const deleteMutation = useDeleteEquipmentCategory();

  // Form handling with react-hook-form
  // Note: We use createCategorySchema which includes slug validation.
  // In edit mode, slug is kept in form state but the input is hidden (non-editable).
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createCategorySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      isActive: true,
    },
  });

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = (): void => {
    setIsEditMode(false);
    setSelectedCategory(null);
    reset({
      name: '',
      slug: '',
      description: '',
      isActive: true,
    });
    setIsFormModalOpen(true);
  };

  const handleEditCategory = (category: EquipmentCategoryDto): void => {
    setIsEditMode(true);
    setSelectedCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      isActive: category.isActive,
    });
     setExistingImage(category.imageUrl ?? null);
    setImageFile(null); // reset new upload
    setIsFormModalOpen(true);
  };

  const handleDeleteCategory = (id: string): void => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  //IMAGE UPLOAD
  const handleImageChange = (files: File[]): void => {
  setImageFile(files[0] ?? null); // single image
};

const handleRemoveImage = (): void => {
  setExistingImage(null);
    setImageFile(null);

};


  const onSubmit = async (data: CreateCategoryFormData): Promise<void> => {
    
        let imageUrl = existingImage ?? undefined;

        if (imageFile) {
    setIsUploading(true);
    const response = await equipmentCategoryApi.uploadCategoryImage(imageFile);
    imageUrl = response.data.urls[0];
    setIsUploading(false);
  }


    if (isEditMode && selectedCategory) {
      // In edit mode, we only send the fields that are allowed to be updated
      const updateData: UpdateEquipmentCategoryDto = {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
              ...(imageUrl !== undefined && { imageUrl }), // ✅ key line

      };
      await updateMutation.mutateAsync({ id: selectedCategory._id, data: updateData });
    } else {
       const createData: CreateEquipmentCategoryDto = {
        ...data,
          description: data.description ?? '',
        imageUrl,
      };
      // In create mode, we send all fields including slug
      await createMutation.mutateAsync(createData);
    }
    setExistingImage(null);
    setImageFile(null);
    setIsFormModalOpen(false);
  };

  const confirmDelete = async (): Promise<void> => {
    if (categoryToDelete) {
      await deleteMutation.mutateAsync(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  // Loading skeleton
  if (isLoading && !data) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="space-y-3">
          <Skeleton variant="text" width="250px" height={40} />
          <Skeleton variant="text" width="400px" height={20} />
        </div>
        <Card>
          <Skeleton variant="rectangular" width="100%" height={400} className="rounded-xl" />
        </Card>
      </div>
    );
  }

  const categories = data?.items || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;
const resetFormState = (): void => {
  reset({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });
  setImageFile(null);
  setExistingImage(null);
  setIsEditMode(false);
  setSelectedCategory(null);
};

    return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">
            Equipment Categories
          </h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Manage equipment categories and their attributes
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Categories Table */}
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
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <td colSpan={5} className="py-12">
                    <div className="text-center">
                      <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 font-medium text-gray-500 dark:text-gray-400">
                        No categories found
                      </p>
                    </div>
                  </td>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category._id} hover>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-500/30">
                          <FolderTree className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {category.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-xs truncate text-sm text-gray-700 dark:text-gray-300">
                        {category.description || '-'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? 'success' : 'secondary'} size="sm">
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit category"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete category"
                          onClick={() => handleDeleteCategory(category._id)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {categories.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} categories
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {setIsFormModalOpen(false);resetFormState()}}
        title={isEditMode ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            type="text"
            placeholder="Enter category name"
            {...register('name')}
            error={errors.name?.message}
            required
          />

          {!isEditMode && (
            <Input
              label="Slug"
              type="text"
              placeholder="Enter category slug (e.g., heavy-equipment)"
              {...register('slug')}
              error={errors.slug?.message}
              required
            />
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              placeholder="Enter category description"
              {...register('description')}
              className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800"
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <Controller
            name="isActive"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Checkbox
                label="Active"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                {...field}
                error={errors.isActive?.message}
              />
            )}
          />
            <ImageUpload
              label="Category Image"
              maxFiles={1}
              value={existingImage ? [existingImage] : []}
              onChange={handleImageChange}
              onRemove={() => handleRemoveImage()}
              disabled={isUploading}
              helperText="Upload a category image"
            />


          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={() => {setIsFormModalOpen(false);resetFormState()}}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default EquipmentCategoriesPage;
