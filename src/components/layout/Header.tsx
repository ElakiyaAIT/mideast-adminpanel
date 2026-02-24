import { Moon, Sun, LogOut, Bell, Search, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleTheme } from '../../store/themeSlice';
import { useLogout, useCurrentUser } from '../../hooks/queries';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { Button } from '../Button';
import { LogoutConfirmModal } from '../LogoutConfirmModal';
import { useState, type JSX } from 'react';

const getPageTitle = (pathname: string): string => {
  if (pathname === ROUTES.DASHBOARD) return 'Dashboard';
  if (pathname === ROUTES.USERS) return 'Users';
  if (pathname === ROUTES.ANALYTICS) return 'Analytics';
  if (pathname === ROUTES.REPORTS) return 'Reports';
  if (pathname === ROUTES.PROFILE) return 'Profile';
  if (pathname === ROUTES.SETTINGS) return 'Settings';
  return 'Dashboard';
};

export const Header = (): JSX.Element => {
  const { mode } = useAppSelector((state) => state.theme);
  const { data: user } = useCurrentUser();
  const dispatch = useAppDispatch();
  const logoutMutation = useLogout();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = (): void => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = (): void => {
    logoutMutation.mutate();
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = (): void => {
    setShowLogoutModal(false);
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header
      className="glass-strong sticky top-0 z-20 border-b border-white/30 shadow-frost dark:border-white/10"
      role="banner"
    >
      <div className="flex items-center justify-between px-4 py-4 lg:px-8 lg:py-5">
        {/* Left Section - Page Title & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-gradient-brand text-2xl font-bold tracking-tight lg:text-3xl">
              {pageTitle}
            </h1>
            <p className="mt-1 hidden text-sm font-medium text-gray-500 dark:text-gray-400 sm:block">
              Welcome back, {user?.firstName || 'User'}
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Search Button (Mobile) */}
          <button
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Search Bar (Desktop) */}
          <div className="glass-light hidden items-center gap-3 rounded-xl border border-white/30 px-4 py-2.5 transition-all duration-300 focus-within:border-primary-500/50 focus-within:shadow-frost dark:border-white/10 dark:focus-within:border-primary-500/50 lg:flex">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 border-none bg-transparent text-sm font-medium text-gray-700 placeholder-gray-400 outline-none dark:text-gray-300 dark:placeholder-gray-500"
              aria-label="Search"
            />
          </div>

          {/* Notifications */}
          <button
            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-gray-900"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="rounded-lg p-2 text-gray-500 transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
            title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User Avatar (Desktop) */}
          <div className="hidden items-center gap-3 border-l border-white/20 pl-3 dark:border-white/10 lg:flex">
            <NavLink to={ROUTES.PROFILE}>
              <div className="hover:shadow-glow-brand-lg flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-primary-400/30 bg-gradient-to-br from-primary-500 via-primary-500 to-primary-600 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:scale-110">
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
            </NavLink>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogoutClick}
            className="hidden items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white lg:flex"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>

          {/* Mobile Logout */}
          <button
            onClick={handleLogoutClick}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={logoutMutation.isPending}
      />
    </header>
  );
};
