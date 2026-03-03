import { useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../../hooks/queries';
import { Button, Input } from '../../components';
import { ROUTES } from '../../constants';
import { loginSchema, type LoginFormData } from '../../utils/validation';

const LoginPage = (): JSX.Element => {
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    loginMutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Upper Background - Industrial Image */}
        <div
          className="absolute left-0 right-0 top-0 h-2/3 bg-cover bg-center"
          style={{
            filter: 'sepia(20%) saturate(80%) brightness(90%)',
          }}
        />

        {/* Lower Background - White with Pattern */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2/3 bg-white"
          style={{
            clipPath: 'ellipse(150% 100% at 50% 100%)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        {/* Login Card */}
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl lg:p-10">
          {/* Title */}
          <h2 className="mb-8 text-2xl font-bold text-black lg:text-3xl">
            Welcome Back to Mideast Equipment
          </h2>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                data-testid="emailId-input"
                {...register('email')}
                error={errors.email?.message}
                autoComplete="email"
                placeholder="Enter your email"
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={errors.password?.message}
                  data-testid="password-input"
                  autoComplete="current-password"
                  placeholder="Enter the password"
                  className="border-gray-300 bg-white pr-10 text-gray-900"
                />
                <button
                  type="button"
                  data-testid="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: '#FDAD3E' }}
                />
                <span className="text-sm text-gray-700">Remember Me</span>
              </label>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm font-medium"
                style={{ color: '#FDAD3E' }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-lg py-3 font-bold text-white"
              isLoading={loginMutation.isPending}
              style={{
                background: 'linear-gradient(to bottom, #FDAD3E, #e89c2a)',
              }}
            >
              SIGN IN
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              No Account yet?{' '}
              <Link to={ROUTES.REGISTER} className="font-medium" style={{ color: '#FDAD3E' }}>
                SIGN UP
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 py-6 text-center">
        <p className="text-sm text-gray-400">
          Copyright© Mideast Equipment Supply 2026. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
