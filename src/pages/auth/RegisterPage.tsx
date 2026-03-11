import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRegister } from '../../hooks/queries';
import { Button, Input } from '../../components';
import { ROUTES } from '../../constants';
import { registerSchema, type RegisterFormData } from '../../utils/validation';
import type { JSX } from 'react';

const RegisterPage = (): JSX.Element => {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    const payload = {
      ...data,
      isActive: true,
    };
    registerMutation.mutate(payload);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="glass-frost rounded-3xl border border-white/40 p-8 shadow-frost-lg dark:border-white/15">
          <div>
            <h2 className="text-gradient-brand mt-6 text-center text-3xl font-extrabold">
              Create your account
            </h2>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-400"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {registerMutation.isError && (
              <div className="glass-light rounded-xl border border-red-500/30 bg-red-50/50 px-4 py-3 text-red-700 backdrop-blur-md dark:border-red-500/20 dark:bg-red-900/10 dark:text-red-400">
                {registerMutation.error instanceof Error
                  ? registerMutation.error.message
                  : 'Registration failed. Please try again.'}
              </div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First name"
                  data-testid="first-name-input"
                  type="text"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  autoComplete="given-name"
                  placeholder="First name"
                />
                <Input
                  label="Last name"
                  data-testid="last-name-input"
                  type="text"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  autoComplete="family-name"
                  placeholder="Last name"
                />
              </div>
              <Input
                label="Email address"
                data-testid="emailId-input"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                autoComplete="email"
                placeholder="Enter your email"
              />
              <Input
                label="Password"
                data-testid="password-input"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                autoComplete="new-password"
                placeholder="Create a password"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Password must contain at least one uppercase letter, one lowercase letter, one
                number, and one special character
              </p>
            </div>

            <div>
              <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
                Create account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
