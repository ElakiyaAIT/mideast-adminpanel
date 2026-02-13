import { useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForgotPassword } from '../../hooks/queries';
import { Button, Input } from '../../components';
import { ROUTES } from '../../constants';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../utils/validation';

const ForgotPasswordPage = (): JSX.Element => {
  const forgotPasswordMutation = useForgotPassword();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  if (isSubmitted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary-500/10 blur-[100px]" />
        </div>
        <div className="relative z-10 w-full max-w-md space-y-8">
          <div className="glass-frost rounded-3xl border border-white/40 p-8 text-center shadow-frost-lg dark:border-white/15">
            <h2 className="text-gradient-brand mt-6 text-3xl font-extrabold">Check your email</h2>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              If an account with that email exists, a password reset link has been sent.
            </p>
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-400"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
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
              Forgot your password?
            </h2>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {forgotPasswordMutation.isError && (
              <div className="glass-light rounded-xl border border-red-500/30 bg-red-50/50 px-4 py-3 text-red-700 backdrop-blur-md dark:border-red-500/20 dark:bg-red-900/10 dark:text-red-400">
                {forgotPasswordMutation.error instanceof Error
                  ? forgotPasswordMutation.error.message
                  : 'Failed to send reset email. Please try again.'}
              </div>
            )}
            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                autoComplete="email"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Button type="submit" className="w-full" isLoading={forgotPasswordMutation.isPending}>
                Send reset link
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

export default ForgotPasswordPage;
