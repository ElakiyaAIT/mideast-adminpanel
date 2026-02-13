import { type JSX, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../hooks/queries';
import { ROUTES } from '../constants';
import { SuspenseFallback } from '../components/SuspenseFallback';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps): JSX.Element => {
  const { data: user, isLoading, isError } = useCurrentUser();
  const location = useLocation();

  // CRITICAL: Wait for auth check to complete before making decisions
  if (isLoading) {
    // Show loading state while checking authentication
    return <SuspenseFallback message="Checking authentication..." />;
  }

  // If auth check failed or no user data, redirect to login
  if (isError || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
