import { useEffect, useState, type JSX } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Input, Button, Select, Textarea, ImageUpload } from '../../../components';
import { equipmentApi } from '../../../api/equipmentApi';
import {
  useCreateEquipment,
  useUpdateEquipment,
  useEquipmentCategories,
  useUsersList,
} from '../../../hooks/queries';
import type { EquipmentDto, CreateEquipmentDto, UpdateEquipmentDto, Condition } from '../../../dto';
import { ConditionType, ListingTypeType } from '../../../dto';
import type { ListingType } from '../../../dto';
import { equipmentSchema, type EquipmentFormData } from '../../../utils/validation';

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment?: EquipmentDto | null;
  mode: 'create' | 'edit';
}

const EquipmentFormModal = ({
  isOpen,
  onClose,
  equipment,
  mode,
}: EquipmentFormModalProps): JSX.Element => {
  const createMutation = useCreateEquipment();
  const updateMutation = useUpdateEquipment();

  // Fetch categories and sellers
  const { data: categoriesData } = useEquipmentCategories({ page: 1, limit: 100 });
  const { data: usersData } = useUsersList({ page: 1, limit: 100 });

  const categories = categoriesData?.items || [];
  const sellers = usersData?.items || [];

  // const prevOpenRef = useRef(isOpen);
  // const prevEquipmentIdRef = useRef(equipment?._id);

  // Image upload state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(equipmentSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      sellerId: '',
      listingType: ListingTypeType.BUY_NOW,
      buyNowPrice: undefined,
      reservePrice: undefined,
      make: '',
      models: '',
      year: new Date().getFullYear(),
      serialNumber: '',
      hoursUsed: undefined,
      condition: ConditionType.NEW,
      location: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      },
    },
  });

  const listingType = useWatch({
    control,
    name: 'listingType',
  });
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

  useEffect(() => {
    // const justOpened = isOpen && !prevOpenRef.current;
    // const equipmentChanged = equipment?._id !== prevEquipmentIdRef.current;

    // if (justOpened || equipmentChanged) {
    if (mode === 'edit' && equipment) {
      reset({
        title: equipment.title,
        description: stripHtml(equipment.description),
        categoryId: equipment?.categoryId?._id as string,
        sellerId: equipment.sellerId?._id as string,
        listingType: equipment.listingType,
        buyNowPrice: equipment.buyNowPrice || undefined,
        reservePrice: equipment.reservePrice || undefined,
        make: equipment.make,
        models: equipment.models,
        year: equipment.year,
        serialNumber: equipment.serialNumber || '',
        hoursUsed: equipment.hoursUsed || undefined,
        condition: equipment.condition as Condition,
        location: equipment.location,
      });
      setExistingImages(equipment.images || []);
      setImageFiles([]);
    } else {
      reset({
        title: '',
        description: '',
        categoryId: '',
        sellerId: '',
        listingType: ListingTypeType.BUY_NOW,
        buyNowPrice: undefined,
        reservePrice: undefined,
        make: '',
        models: '',
        year: new Date().getFullYear(),
        serialNumber: '',
        hoursUsed: undefined,
        condition: ConditionType.NEW,
        location: {
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA',
        },
      });
      setExistingImages([]);
      setImageFiles([]);
    }

    // prevOpenRef.current = isOpen;
    // prevEquipmentIdRef.current = equipment?._id;
  }, [mode, equipment, isOpen, reset]);

  const onSubmit = async (data: EquipmentFormData): Promise<void> => {
    try {
      setIsUploading(true);

      // Upload new images if any
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const response = await equipmentApi.uploadImages(imageFiles);
        uploadedImageUrls = response.data.urls;
      }

      // Combine existing and newly uploaded images
      const allImageUrls = [...existingImages, ...uploadedImageUrls];

      if (mode === 'create') {
        const createData: CreateEquipmentDto = {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          sellerId: data.sellerId,
          listingType: data.listingType as ListingType,
          buyNowPrice: data.buyNowPrice,
          reservePrice: data.reservePrice,
          make: data.make,
          models: data.models,
          year: data.year,
          serialNumber: data.serialNumber || undefined,
          hoursUsed: data.hoursUsed,
          condition: data.condition || undefined,
          location: data.location,
          images: allImageUrls.length > 0 ? allImageUrls : undefined,
        };

        await createMutation.mutateAsync(createData);
      } else if (mode === 'edit' && equipment) {
        const updateData: UpdateEquipmentDto = {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          listingType: data.listingType as ListingType,
          buyNowPrice: data.buyNowPrice,
          reservePrice: data.reservePrice,
          make: data.make,
          models: data.models,
          year: data.year,
          serialNumber: data.serialNumber || undefined,
          hoursUsed: data.hoursUsed,
          condition: data.condition || undefined,
          location: data.location,
          images: allImageUrls,
        };

        await updateMutation.mutateAsync({ id: equipment._id, data: updateData });
      }

      onClose();
    } finally {
      setIsUploading(false);
    }
  };

  const handleImagesChange = (files: File[]): void => {
    setImageFiles(files);
  };

  const handleRemoveExistingImage = (index: number): void => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isUploading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Equipment' : 'Edit Equipment'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] space-y-4 overflow-y-auto">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>

          <Input
            label="Title"
            type="text"
            {...register('title')}
            error={errors.title?.message}
            placeholder="e.g., 2019 John Deere 644K Wheel Loader"
            required
            data-testid="title-input"
          />

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Detailed description of the equipment..."
            required
            data-testid="description-input"
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Category"
                  {...field}
                  error={errors.categoryId?.message}
                  options={categories.map((cat) => ({
                    value: cat._id,
                    label: cat.name,
                  }))}
                  required
                  data-testid="categoryId-input"
                />
              )}
            />

            {mode === 'create' && (
              <Controller
                name="sellerId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Seller"
                    {...field}
                    error={errors.sellerId?.message}
                    options={sellers.map((seller) => ({
                      value: seller.id,
                      label: `${seller.firstName} ${seller.lastName} (${seller.email})`,
                    }))}
                    required
                    data-testid="sellerId-input"
                  />
                )}
              />
            )}
          </div>
        </div>

        {/* Equipment Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Equipment Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Make"
              type="text"
              {...register('make')}
              error={errors.make?.message}
              placeholder="e.g., John Deere"
              required
              data-testid="make-input"
            />

            <Input
              label="Model"
              type="text"
              {...register('models')}
              error={errors.models?.message}
              placeholder="e.g., 644K"
              required
              data-testid="models-input"
            />

            <Input
              label="Year"
              type="number"
              {...register('year', { valueAsNumber: true })}
              error={errors.year?.message}
              placeholder="e.g., 2019"
              data-testid="year-input"
            />

            <Input
              label="Serial Number"
              type="text"
              {...register('serialNumber')}
              error={errors.serialNumber?.message}
              placeholder="Optional"
              data-testid="serial-input"
            />

            <Input
              label="Hours Used"
              type="number"
              {...register('hoursUsed', { valueAsNumber: true })}
              error={errors.hoursUsed?.message}
              placeholder="e.g., 1250"
              required
              data-testid="hours-input"
            />

            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <Select
                  label="Condition"
                  {...field}
                  error={errors.condition?.message}
                  options={Object.values(ConditionType).map((type) => ({
                    value: type,
                    label: type.replace(/_/g, ' ').toUpperCase(),
                  }))}
                  required
                  data-testid="condition-input"
                />
              )}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing</h3>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="listingType"
              control={control}
              render={({ field }) => (
                <Select
                  label="Listing Type"
                  {...field}
                  error={errors.listingType?.message}
                  options={Object.values(ListingTypeType).map((type) => ({
                    value: type,
                    label: type.replace(/_/g, ' ').toUpperCase(),
                  }))}
                  required
                  data-testid="listing-input"
                />
              )}
            />

            <Input
              label="Buy Now Price ($)"
              type="number"
              {...register('buyNowPrice', { valueAsNumber: true })}
              error={errors.buyNowPrice?.message}
              placeholder="e.g., 125000"
              required
              data-testid="buynow-input"
            />

            {listingType !== ListingTypeType.BUY_NOW && (
              <Input
                label="Reserve Price ($)"
                type="number"
                {...register('reservePrice', { valueAsNumber: true })}
                error={errors.reservePrice?.message}
                placeholder="e.g., 100000"
                data-testid="reservePrice"
              />
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h3>

          <Input
            label="Address"
            type="text"
            {...register('location.address')}
            error={errors.location?.address?.message}
            placeholder="Street address"
            required
            data-testid="address-input"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              {...register('location.city')}
              error={errors.location?.city?.message}
              required
              data-testid="city-input"
            />

            <Input
              label="State"
              type="text"
              {...register('location.state')}
              error={errors.location?.state?.message}
              required
              data-testid="state-input"
            />

            <Input
              required
              label="ZIP Code"
              type="text"
              {...register('location.zipCode')}
              error={errors.location?.zipCode?.message}
              data-testid="zipcode-input"
            />

            <Input
              label="Country"
              type="text"
              {...register('location.country')}
              error={errors.location?.country?.message}
              data-testid="country-input"
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Images</h3>
          <ImageUpload
            label="Equipment Images"
            maxFiles={10}
            value={existingImages}
            onChange={handleImagesChange}
            onRemove={handleRemoveExistingImage}
            disabled={isLoading}
            helperText="Upload up to 10 images of the equipment"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-4">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create Equipment' : 'Update Equipment'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EquipmentFormModal;
