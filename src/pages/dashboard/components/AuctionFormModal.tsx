import { useEffect, useRef, useState, type JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Input, Button, Select, Textarea, ImageUpload } from '../../../components';
import { useCreateAuction, useUpdateAuction } from '../../../hooks/queries';
import type { AuctionDto, CreateAuctionDto, UpdateAuctionDto } from '../../../dto';
import { AuctionTypeType } from '../../../dto';
import type { AuctionType } from '../../../dto';
import { auctionSchema, type AuctionFormData } from '../../../utils/validation';
import { auctionApi } from '../../../api/auctionApi';

interface AuctionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction?: AuctionDto | null;
  mode: 'create' | 'edit';
}

const AuctionFormModal = ({
  isOpen,
  onClose,
  auction,
  mode,
}: AuctionFormModalProps): JSX.Element => {
  const createMutation = useCreateAuction();
  const updateMutation = useUpdateAuction();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const prevOpenRef = useRef(isOpen);
  const prevAuctionIdRef = useRef(auction?._id);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(auctionSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      type: AuctionTypeType.TIMED as AuctionType,
      startDate: '',
      endDate: '',
      address: '',
      city: '',
      state: '',
      proxibidId: '',
      equipmentfactsId: '',
    },
  });

  useEffect(() => {
    const justOpened = isOpen && !prevOpenRef.current;
    const auctionChanged = auction?._id !== prevAuctionIdRef.current;

    if (justOpened || auctionChanged) {
      // Format dates for input[type="datetime-local"]
      const formatDateForInput = (dateString: string) => {
        // const date = new Date(dateString);
        return new Date(dateString).toLocaleString('sv-SE').slice(0, 16);
      };

      if (mode === 'edit' && auction) {
        reset({
          title: auction.title,
          description: auction.description,
          type: auction.type,
          startDate: formatDateForInput(auction.startDate),
          endDate: formatDateForInput(auction.endDate),
          address: auction.location?.address || '',
          city: auction.location?.city || '',
          state: auction.location?.state || '',
          proxibidId: auction.externalPlatform?.proxibidId || '',
          equipmentfactsId: auction.externalPlatform?.equipmentfactsId || '',
        });
        setTimeout(() => {
          setExistingImages(auction.images || []);
          setImageFiles([]);
        }, 0);
      } else {
        reset({
          title: '',
          description: '',
          type: AuctionTypeType.TIMED as AuctionType,
          startDate: '',
          endDate: '',
          address: '',
          city: '',
          state: '',
          proxibidId: '',
          equipmentfactsId: '',
        });
      }
    }

    prevOpenRef.current = isOpen;
    prevAuctionIdRef.current = auction?._id;
  }, [mode, auction, isOpen, reset]);

  const handleImageChange = (files: File[]): void => {
    setImageFiles(files);
  };

  const handleRemoveImage = (index: number): void => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AuctionFormData): Promise<void> => {
    let images = [...existingImages];

    if (imageFiles.length > 0) {
      setIsUploading(true);
      const uploadRes = await auctionApi.uploadAuctionImages(imageFiles);
      images = [...images, ...uploadRes.data.urls];
      setIsUploading(false);
    }
    const location =
      data.address || data.city || data.state
        ? {
            address: data.address || undefined,
            city: data.city || undefined,
            state: data.state || undefined,
          }
        : undefined;

    const externalPlatform =
      data.proxibidId || data.equipmentfactsId
        ? {
            proxibidId: data.proxibidId || undefined,
            equipmentfactsId: data.equipmentfactsId || undefined,
          }
        : undefined;

    if (mode === 'create') {
      const createData: CreateAuctionDto = {
        title: data.title,
        description: data.description,
        type: data.type as AuctionType,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        location,
        externalPlatform,
        images,
      };

      await createMutation.mutateAsync(createData);
    } else if (mode === 'edit' && auction) {
      const updateData: UpdateAuctionDto = {
        title: data.title,
        description: data.description,
        type: data.type as AuctionType,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        location,
        externalPlatform,
        images,
      };

      await updateMutation.mutateAsync({ id: auction._id, data: updateData });
    }

    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Auction' : 'Edit Auction'}
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
            placeholder="e.g., Spring Heavy Equipment Auction"
            data-testid="title-input"
            required
          />

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Detailed description of the auction..."
            data-testid="description-input"
            required
          />
          <ImageUpload
            label="Auction Images"
            maxFiles={10}
            value={existingImages}
            onChange={handleImageChange}
            onRemove={(index) => handleRemoveImage(index)}
            disabled={isUploading}
            helperText="Upload auction images (max 10)"
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Auction Type"
                {...field}
                error={errors.type?.message}
                options={Object.values(AuctionTypeType).map((type) => ({
                  value: type,
                  label: type.charAt(0).toUpperCase() + type.slice(1),
                }))}
              />
            )}
          />
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule</h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date & Time"
              type="datetime-local"
              {...register('startDate')}
              error={errors.startDate?.message}
              data-testId="startDate-input"
              required
            />

            <Input
              label="End Date & Time"
              type="datetime-local"
              {...register('endDate')}
              error={errors.endDate?.message}
              data-testId="endDate-input"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Location (Optional)
          </h3>

          <Input
            label="Address"
            type="text"
            {...register('address')}
            error={errors.address?.message}
            placeholder="Street address"
            data-testid="address-input"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              data-testid="city-input"
              {...register('city')}
              error={errors.city?.message}
            />

            <Input
              label="State"
              type="text"
              data-testid="state-input"
              {...register('state')}
              error={errors.state?.message}
            />
          </div>
        </div>

        {/* External Platforms */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            External Platforms (Optional)
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Proxibid ID"
              type="text"
              {...register('proxibidId')}
              error={errors.proxibidId?.message}
              placeholder="Proxibid auction ID"
            />

            <Input
              label="EquipmentFacts ID"
              type="text"
              {...register('equipmentfactsId')}
              error={errors.equipmentfactsId?.message}
              placeholder="EquipmentFacts auction ID"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-4">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create Auction' : 'Update Auction'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AuctionFormModal;
