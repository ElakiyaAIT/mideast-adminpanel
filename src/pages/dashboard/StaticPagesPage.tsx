import React, { useState, type JSX } from 'react';
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
  Modal,
  Input,
  Checkbox,
  ConfirmDialog,
} from '../../components';
import { Plus, Edit, Trash2, RefreshCw, FileText } from 'lucide-react';
import {
  useStaticPages,
  useCreateStaticPage,
  useUpdateStaticPage,
  useDeleteStaticPage,
} from '../../hooks/queries';
import type { StaticPageDto, CreateStaticPageDto, UpdateStaticPageDto } from '../../dto';
import { staticPageSchema } from '../../utils/validation';
import { ValidationError } from 'yup';
import type { ColumnConfig } from '../../components/Skeleton/TableSkeleton';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';

const StaticPagesPage = (): JSX.Element => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<StaticPageDto | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Skeleton Column Config
  const StaticPagesColumns: ColumnConfig[] = [
    { width: 150 }, // Title
    { width: 80, variant: 'rounded' }, //Slug
    { width: 80, variant: 'rounded' }, // Status
    { width: 100 }, // Last Updated
    { width: 60, horizontalCount: 2, variant: 'rounded' },
  ];

  const [formData, setFormData] = useState<CreateStaticPageDto>({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    isPublished: true,
  });

  const { data, isLoading, isFetching, refetch } = useStaticPages();
  const createMutation = useCreateStaticPage();
  const updateMutation = useUpdateStaticPage();
  const deleteMutation = useDeleteStaticPage();

  const handleAdd = (): void => {
    setErrors({});
    setIsEditMode(false);
    setSelectedPage(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      isPublished: true,
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (page: StaticPageDto): void => {
    setErrors({});
    setIsEditMode(true);
    setSelectedPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      metaKeywords: page.metaKeywords,
      isPublished: page.isPublished,
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = (slug: string): void => {
    setPageToDelete(slug);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (pageToDelete) {
      await deleteMutation.mutateAsync(pageToDelete);
      setPageToDelete(null);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;

    let value: string | boolean;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      value = target.checked; // ✅ safe
    } else {
      value = target.value; // ✅ safe
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setErrors({});
      await staticPageSchema.validate(formData, {
        abortEarly: false,
      });
      if (isEditMode && selectedPage) {
        const updateData: UpdateStaticPageDto = {
          title: formData.title,
          content: formData.content,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          metaKeywords: formData.metaKeywords,
          isPublished: formData.isPublished,
        };
        await updateMutation.mutateAsync({ slug: selectedPage.slug, data: updateData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsFormModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const formErrors: Record<string, string> = {};
        err.inner.forEach((validationError) => {
          if (validationError.path) {
            formErrors[validationError.path] = validationError.message;
          }
        });
        setErrors(formErrors);
      } else {
        console.error('Unexpected error:', err);
        // optionally set a global error state
      }
    }
  };

  //loading skeleton
  if (isLoading && !data) {
    return (
      <div className="animate-fade-in space-y-6">
        <TableSkeleton columns={StaticPagesColumns} rows={5} cardWrapper={true} />
      </div>
    );
  }

  const pages = data ? data.data : [];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Static Pages</h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Manage static website pages
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="md" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Page
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
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead align="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <td colSpan={5} className="py-12">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 font-medium text-gray-500">No pages found</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              pages.map((page: StaticPageDto) => (
                <TableRow key={page._id} hover>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border">
                        <FileText className="h-5 w-5 text-primary-600" />
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">{page.title}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                      {page.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={page.isPublished ? 'success' : 'secondary'} size="sm">
                      {page.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(page)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(page.slug)}
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
        title={isEditMode ? 'Edit Page' : 'Add Page'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            {/* <label className="mb-2 block text-sm font-medium">Title </label> */}
            <Input
              label="Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              error={errors?.title}
            />
          </div>

          {!isEditMode && (
            <div>
              {/* <label className="mb-2 block text-sm font-medium">Slug *</label> */}
              <Input
                label="Slug"
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                error={errors?.slug}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Content <span className="text-sm text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full rounded-lg border p-2 dark:border-gray-600 dark:bg-gray-800"
              rows={6}
            />
            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
          </div>

          <div>
            {/* <label className="mb-2 block text-sm font-medium">Meta Title</label> */}
            <Input
              label="Meta Title"
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              error={errors?.metaTitle}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              className="w-full rounded-lg border p-2 dark:border-gray-600 dark:bg-gray-800"
              rows={3}
            />
            {errors?.metaDescription && (
              <p className="mt-1 text-sm text-red-500">{errors?.metaDescription}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox name="isPublished" checked={formData.isPublished} onChange={handleChange} />
            <label className="text-sm font-medium">Published</label>
          </div>

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
        title="Delete Page"
        message="Are you sure you want to delete this page? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default StaticPagesPage;
