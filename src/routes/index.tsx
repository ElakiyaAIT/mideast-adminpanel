import { lazy, Suspense, type JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard, GuestGuard } from '../guards';
import { ROUTES } from '../constants';
import { SuspenseFallback } from '../components/SuspenseFallback';

// Lazy load all pages for optimal code splitting
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const DashboardHomePage = lazy(() => import('../pages/dashboard/DashboardHomePage'));
const UsersPage = lazy(() => import('../pages/dashboard/UsersPage'));
const AnalyticsPage = lazy(() => import('../pages/dashboard/AnalyticsPage'));
const ReportsPage = lazy(() => import('../pages/dashboard/ReportsPage'));
const ProfilePage = lazy(() => import('../pages/dashboard/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/dashboard/SettingsPage'));
// Equipment pages
const EquipmentCategoriesPage = lazy(() => import('../pages/dashboard/EquipmentCategoriesPage'));
const EquipmentPage = lazy(() => import('../pages/dashboard/EquipmentPage'));
const EquipmentApprovalsPage = lazy(() => import('../pages/dashboard/EquipmentApprovalsPage'));
// Auction pages
const AuctionsPage = lazy(() => import('../pages/dashboard/AuctionsPage'));
// Order pages
const OrdersPage = lazy(() => import('../pages/dashboard/OrdersPage'));
// Payment pages
const PaymentsPage = lazy(() => import('../pages/dashboard/PaymentsPage'));
const PayoutsPage = lazy(() => import('../pages/dashboard/PayoutsPage'));
// CMS pages
const BannersPage = lazy(() => import('../pages/dashboard/BannersPage'));
const StaticPagesPage = lazy(() => import('../pages/dashboard/StaticPagesPage'));
// Notification pages
const NotificationsPage = lazy(() => import('../pages/dashboard/NotificationsPage'));
// System pages
const SystemSettingsPage = lazy(() => import('../pages/dashboard/SystemSettingsPage'));
const AuditLogsPage = lazy(() => import('../pages/dashboard/AuditLogsPage'));
//Testimonial Pages
const TestimonialPage=lazy(()=>import ('../pages/dashboard/TestimonialsPage'));
export const AppRoutes = (): JSX.Element => {
  return (
    <BrowserRouter>
      {/* Centralized Suspense boundary with premium fallback */}
      <Routes>
        {/* Auth Routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <GuestGuard>
              <Suspense fallback={<SuspenseFallback message="Loading login..." />}>
                <LoginPage />
              </Suspense>
            </GuestGuard>
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            <GuestGuard>
              <Suspense fallback={<SuspenseFallback message="Loading registration..." />}>
                <RegisterPage />
              </Suspense>
            </GuestGuard>
          }
        />

        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <GuestGuard>
              <Suspense fallback={<SuspenseFallback message="Loading..." />}>
                <ForgotPasswordPage />
              </Suspense>
            </GuestGuard>
          }
        />

        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <GuestGuard>
              <Suspense fallback={<SuspenseFallback message="Loading..." />}>
                <ResetPasswordPage />
              </Suspense>
            </GuestGuard>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <AuthGuard>
              <Suspense fallback={<SuspenseFallback message="Loading dashboard..." />}>
                <DashboardLayout />
              </Suspense>
            </AuthGuard>
          }
        >
          <Route
            index
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading dashboard..." fullScreen={false} />}
              >
                <DashboardHomePage />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading profile..." fullScreen={false} />}
              >
                <ProfilePage />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading users..." fullScreen={false} />}
              >
                <UsersPage />
              </Suspense>
            }
          />
          <Route
            path="analytics"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading analytics..." fullScreen={false} />}
              >
                <AnalyticsPage />
              </Suspense>
            }
          />
          <Route
            path="reports"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading reports..." fullScreen={false} />}
              >
                <ReportsPage />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading profile..." fullScreen={false} />}
              >
                <ProfilePage />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading settings..." fullScreen={false} />}
              >
                <SettingsPage />
              </Suspense>
            }
          />
          <Route
            path="equipment/categories"
            element={
              <Suspense
                fallback={
                  <SuspenseFallback message="Loading equipment categories..." fullScreen={false} />
                }
              >
                <EquipmentCategoriesPage />
              </Suspense>
            }
          />
          <Route
            path="equipment"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading equipment..." fullScreen={false} />}
              >
                <EquipmentPage />
              </Suspense>
            }
          />
          <Route
            path="equipment/approvals"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading approvals..." fullScreen={false} />}
              >
                <EquipmentApprovalsPage />
              </Suspense>
            }
          />
          <Route
            path="auctions"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading auctions..." fullScreen={false} />}
              >
                <AuctionsPage />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading orders..." fullScreen={false} />}
              >
                <OrdersPage />
              </Suspense>
            }
          />
          <Route
            path="payments"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading payments..." fullScreen={false} />}
              >
                <PaymentsPage />
              </Suspense>
            }
          />
          <Route
            path="payouts"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading payouts..." fullScreen={false} />}
              >
                <PayoutsPage />
              </Suspense>
            }
          />
          <Route
            path="cms/banners"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading banners..." fullScreen={false} />}
              >
                <BannersPage />
              </Suspense>
            }
          />
          <Route
            path="cms/pages"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading pages..." fullScreen={false} />}
              >
                <StaticPagesPage />
              </Suspense>
            }
          />
          <Route
            path="notifications"
            element={
              <Suspense
                fallback={
                  <SuspenseFallback message="Loading notifications..." fullScreen={false} />
                }
              >
                <NotificationsPage />
              </Suspense>
            }
          />
          <Route
            path="system/settings"
            element={
              <Suspense
                fallback={
                  <SuspenseFallback message="Loading system settings..." fullScreen={false} />
                }
              >
                <SystemSettingsPage />
              </Suspense>
            }
          />
          <Route
            path="system/audit-logs"
            element={
              <Suspense
                fallback={<SuspenseFallback message="Loading audit logs..." fullScreen={false} />}
              >
                <AuditLogsPage />
              </Suspense>
            }
          />
           <Route
            path="testimonials"
            element={
              <Suspense
              fallback={<SuspenseFallback message="Loading Testimonials..." fullScreen={false}/>}>
              <TestimonialPage/>
              </Suspense>
            }
            />
        </Route>
           
        {/* Catch all route */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
