import { useEffect, type JSX } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResetPassword } from '../../hooks/queries';
import { Button, Input } from '../../components';
import { ROUTES } from '../../constants';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../utils/validation';

const ResetPasswordPage = (): JSX.Element | null => {
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (token) {
      setValue('token', token);
    } else {
      // Redirect to login if no token
      void navigate(ROUTES.LOGIN);
    }
  }, [token, setValue, navigate]);

  const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
    resetPasswordMutation.mutate(data);
  };

  if (!token) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary-500/10 blur-[100px]" />
      </div>
      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="glass-frost rounded-3xl border border-white/40 p-8 shadow-frost-lg dark:border-white/15">
          <div>
            <h2 className="text-gradient-brand mt-6 text-center text-3xl font-extrabold">
              Reset your password
            </h2>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter your new password below.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {resetPasswordMutation.isError && (
              <div className="glass-light rounded-xl border border-red-500/30 bg-red-50/50 px-4 py-3 text-red-700 backdrop-blur-md dark:border-red-500/20 dark:bg-red-900/10 dark:text-red-400">
                {resetPasswordMutation.error instanceof Error
                  ? resetPasswordMutation.error.message
                  : 'Failed to reset password. Please try again.'}
              </div>
            )}
            <div className="space-y-4">
              <input type="hidden" {...register('token')} />
              <Input
                label="New Password"
                type="password"
                {...register('newPassword')}
                error={errors.newPassword?.message}
                autoComplete="new-password"
                placeholder="Enter your new password"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Password must contain at least one uppercase letter, one lowercase letter, one
                number, and one special character
              </p>
            </div>

            <div>
              <Button type="submit" className="w-full" isLoading={resetPasswordMutation.isPending}>
                Reset password
              </Button>
            </div>

            <div className="text-center">
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-400"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
