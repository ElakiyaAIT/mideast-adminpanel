import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createCategorySchema, type CreateCategoryFormData } from '../../../utils/validation';
import type { EquipmentCategoryDto } from '../../../dto/equipment.dto';
import { Modal } from '../../../components/Modal/Modal';
import { Input } from '../../../components/Input/Input';
import Checkbox from '../../../components/Checkbox/Checkbox';
import { ImageUpload } from '../../../components/ImageUpload/ImageUpload';
import { Button } from '../../../components/Button/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryFormData) => void;
  isEditMode: boolean;
  selectedCategory?: EquipmentCategoryDto | null;
  imageUrl?: string;
  onImageChange?: (files: File[]) => void;
  onImageRemove?: () => void;
  isUploading?: boolean;
  isPending?: boolean;
}

export const EquipmentCategoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditMode,
  selectedCategory = null,
  imageUrl,
  onImageChange,
  onImageRemove,
  isUploading,
  isPending,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryFormData>({
    resolver: yupResolver(createCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      isActive: true,
    },
  });

  // Automatically reset form & state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form on close
      reset({
        name: '',
        slug: '',
        description: '',
        isActive: true,
      });
      onImageRemove?.(); // reset image
    } else if (isOpen && selectedCategory) {
      // Pre-fill form in edit mode
      reset({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        description: selectedCategory.description || '',
        isActive: selectedCategory.isActive,
      });
    }
  }, [isOpen, selectedCategory, reset, onImageRemove]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose} // Closing modal automatically resets via useEffect
      title={isEditMode ? 'Edit Category' : 'Add Category'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <Input label="Name" {...register('name')} error={errors.name?.message} required />

        {/* Slug only in Add mode */}
        {!isEditMode && (
          <Input label="Slug" {...register('slug')} error={errors.slug?.message} required />
        )}

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            placeholder="Enter category description"
            {...register('description')}
            className="w-full rounded-lg border p-2 dark:border-gray-600 dark:bg-gray-800"
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Active Checkbox */}
        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Checkbox label="Active" checked={value} onChange={(e) => onChange(e.target.checked)} />
          )}
        />

        {/* Image Upload */}
        <ImageUpload
          label="Category Image"
          maxFiles={1}
          value={imageUrl ? [imageUrl] : []}
          onChange={onImageChange}
          onRemove={onImageRemove}
          disabled={isUploading}
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
