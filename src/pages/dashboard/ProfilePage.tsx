import { useEffect, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUserProfile, useUpdateProfile } from '../../hooks/queries';
import { useCurrentUser } from '../../hooks/queries';
import { Card, Button, Input } from '../../components';
import { updateProfileSchema, type UpdateProfileFormData } from '../../utils/validation';
import { formatDate } from '../../utils';

const ProfilePage = (): JSX.Element => {
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useUserProfile();
  const { data: authUser } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(updateProfileSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: authUser?.firstName || undefined,
      lastName: authUser?.lastName || undefined,
      email: authUser?.email || '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });
    } else if (authUser) {
      reset({
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        email: authUser.email,
      });
    }
  }, [profile, authUser, reset]);

  const onSubmit = async (data: UpdateProfileFormData): Promise<void> => {
    updateProfileMutation.mutate(data);
  };

  const displayProfile = profile || authUser;
  const isLoading = isLoadingProfile;
  const error = profileError?.message || updateProfileMutation.error?.message;

  if (isLoading && !displayProfile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        {/* <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Profile</h1> */}
        <p className="mt-2 text-base font-medium text-gray-600 dark:text-gray-400">
          Manage your account information and preferences.
        </p>
      </div>

      <Card title="Profile Information">
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              type="text"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              type="text"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />

          {displayProfile && (
            <div className="border-t border-white/30 pt-4 dark:border-white/10">
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Role</p>
                  <p className="font-medium capitalize text-gray-900 dark:text-white">
                    {displayProfile.role}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Member since</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(displayProfile.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" isLoading={updateProfileMutation.isPending} disabled={!isDirty}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
