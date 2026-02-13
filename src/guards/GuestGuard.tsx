import { type JSX, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/queries';
import { ROUTES } from '../constants';
import { SuspenseFallback } from '../components/SuspenseFallback';

interface GuestGuardProps {
  children: ReactNode;
}

export const GuestGuard = ({ children }: GuestGuardProps): JSX.Element => {
  const { data: user, isLoading } = useCurrentUser();

  // Wait for auth check to complete
  if (isLoading) {
    return <SuspenseFallback message="Loading..." />;
  }

  // If user is already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // User is not authenticated, show guest pages (login/register)
  return <>{children}</>;
};
