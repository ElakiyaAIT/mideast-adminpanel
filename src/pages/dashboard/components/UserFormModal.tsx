import { useEffect, type JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Input, Button, Select, Checkbox } from '../../../components';
import { createUserSchema, editUserSchema } from '../../../utils/validation';
import type { CreateUserDto, UpdateUserDto, UserResponseDto } from '../../../dto';
import { useRoles } from '../../../hooks/queries/useRole';
import { useCreateUser, useUpdateUser } from '../../../hooks/queries/useUser';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserResponseDto | null;
  mode: 'create' | 'edit';
}

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  isActive: boolean;
};

const UserFormModal = ({ isOpen, onClose, user, mode }: UserFormModalProps): JSX.Element => {
  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEditMode = mode === 'edit';
  const schema = isEditMode ? editUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      roleId: '',
      isActive: true,
    },
  });

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen && user && isEditMode) {
      reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId._id,
        isActive: user.isActive,
      });
    } else if (isOpen && !isEditMode) {
      reset({
        email: '',
        firstName: '',
        lastName: '',
        roleId: '',
        isActive: true,
      });
    }
  }, [isOpen, user, isEditMode, reset]);

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      if (isEditMode && user) {
        const updateData: UpdateUserDto = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          roleId: data.roleId,
          isActive: data.isActive,
        };
        await updateUserMutation.mutateAsync({ id: user.id, data: updateData });
      } else {
        const createData: CreateUserDto = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          roleId: data.roleId,
          isActive: data.isActive,
        };
        await createUserMutation.mutateAsync(createData);
      }
      handleClose();
    } catch (_error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleClose = (): void => {
    reset();
    onClose();
  };

  const roleOptions =
    roles?.map((role) => ({
      value: role.id,
      label: role.name,
    })) || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit User' : 'Add New User'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            type="text"
            placeholder="Enter first name"
            {...register('firstName')}
            error={errors.firstName?.message}
            required
          />
          <Input
            label="Last Name"
            type="text"
            placeholder="Enter last name"
            {...register('lastName')}
            error={errors.lastName?.message}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter email address"
          {...register('email')}
          error={errors.email?.message}
          required
        />

        <Controller
          name="roleId"
          control={control}
          render={({ field }) => (
            <Select
              label="Role"
              options={roleOptions}
              {...field}
              error={errors.roleId?.message}
              disabled={isLoadingRoles}
              required
            />
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Checkbox
              label="Active User"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              {...field}
              error={errors.isActive?.message}
            />
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting || isLoadingRoles}
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
