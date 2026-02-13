import { useEffect, useRef, useState, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Input, Button, Textarea, ImageUpload } from '../../../components';

import { testimonialSchema, type TestimonialFormData } from '../../../utils/validation';
import { testimonialApi } from '../../../api/testimonialApi';
import type { TestimonialDto, CreateTestimonialDto, UpdateTestimonialDto } from '../../../dto/testimonial.dto';
import { useCreateTestimonial, useUpdateTestimonial } from '../../../hooks/queries/useTestimonial';

interface TestimonialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial?: TestimonialDto | null;
  mode: 'create' | 'edit';
}

const TestimonialFormModal = ({
  isOpen,
  onClose,
  testimonial,
  mode,
}: TestimonialFormModalProps): JSX.Element => {
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>();
  const [isUploading, setIsUploading] = useState(false);

  const prevOpenRef = useRef(isOpen);
  const prevIdRef = useRef(testimonial?._id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: yupResolver(testimonialSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      role: '',
      review: '',
    },
  });

  useEffect(() => {
    const justOpened = isOpen && !prevOpenRef.current;
    const testimonialChanged = testimonial?._id !== prevIdRef.current;

    if (justOpened || testimonialChanged) {
      if (mode === 'edit' && testimonial) {
        reset({
          name: testimonial.name,
          role: testimonial.role || '',
          review: testimonial.review,
        });

        setExistingImage(testimonial.image);
        setImageFile(null);
      } else {
        reset({
          name: '',
          role: '',
          review: '',
        });

        setExistingImage(undefined);
        setImageFile(null);
      }
    }

    prevOpenRef.current = isOpen;
    prevIdRef.current = testimonial?._id;
  }, [isOpen, testimonial, mode, reset]);

  const handleImageChange = (files: File[]): void => {
    setImageFile(files[0] || null);
  };
const handleRemoveImage = (): void => {
    setExistingImage(null);

};
  const onSubmit = async (data: TestimonialFormData): Promise<void> => {
    let image = existingImage;
console.log("imageFile before upload:", imageFile);

    if (imageFile) {
      setIsUploading(true);
      const uploadRes = await testimonialApi.uploadImage(imageFile);
      image = uploadRes.data.url;
      setIsUploading(false);
    }

    if (mode === 'create') {
      const createData: CreateTestimonialDto = {
        name: data.name,
        role: data.role || '',
        review: data.review,
        image,
      };

      await createMutation.mutateAsync(createData);
    } else if (mode === 'edit' && testimonial) {
      const updateData: UpdateTestimonialDto = {
        name: data.name,
        role: data.role || undefined,
        review: data.review,
        image,
      };

      await updateMutation.mutateAsync({
        id: testimonial._id,
        data: updateData,
      });
    }

    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Testimonial' : 'Edit Testimonial'}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-h-[70vh] space-y-4 overflow-y-auto"
      >
        {/* Basic Info */}
        <Input
          label="Client Name"
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <Input
          label="Designation"
          {...register('role')}
          error={errors.role?.message}
          placeholder="e.g., CEO"
        />

        <Textarea
          label="Testimonial Message"
          {...register('review')}
          error={errors.review?.message}
          required
        />

        {/* Image Upload */}
        <ImageUpload
          label="Client Image"
          maxFiles={1}
          value={existingImage ? [existingImage] : []}
          onRemove={()=> handleRemoveImage()}
          onChange={handleImageChange}
          disabled={isUploading}
          helperText="Upload client photo"
        />

        {/* Actions */}
        <div className="flex gap-3 border-t pt-4">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading
              ? 'Saving...'
              : mode === 'create'
              ? 'Create Testimonial'
              : 'Update Testimonial'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TestimonialFormModal;
