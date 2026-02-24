import { NavLink } from 'react-router-dom';
import {
  Home,
  // User,
  // Settings,
  Menu,
  X,
  ChevronRight,
  Users,
  // BarChart3,
  FileText,
  Package,
  Gavel,
  // ShoppingCart,
  // CreditCard,
  // DollarSign,
  // Image,
  Bell,
  FolderTree,
  CheckSquare,
  MessageSquareQuote,
} from 'lucide-react';
import { useState, type JSX } from 'react';
import { ROUTES } from '../../constants';
import { cn } from '../../utils';

const navigation = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: Home },
  { name: 'Users', href: ROUTES.USERS, icon: Users },
  { name: 'Equipment Categories', href: ROUTES.EQUIPMENT_CATEGORIES, icon: FolderTree },
  { name: 'Equipment', href: ROUTES.EQUIPMENT, icon: Package },
  { name: 'Equipment Approvals', href: ROUTES.EQUIPMENT_APPROVALS, icon: CheckSquare },
  { name: 'Auctions', href: ROUTES.AUCTIONS, icon: Gavel },
  // { name: 'Orders', href: ROUTES.ORDERS, icon: ShoppingCart },
  // { name: 'Payments', href: ROUTES.PAYMENTS, icon: CreditCard },
  // { name: 'Payouts', href: ROUTES.PAYOUTS, icon: DollarSign },
  // { name: 'Banners', href: ROUTES.BANNERS, icon: Image },
  { name: 'Static Pages', href: ROUTES.STATIC_PAGES, icon: FileText },
  { name: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: Bell },
  // { name: 'System Settings', href: ROUTES.SYSTEM_SETTINGS, icon: Settings },
  { name: 'Audit Logs', href: ROUTES.AUDIT_LOGS, icon: FileText },
  // { name: 'Analytics', href: ROUTES.ANALYTICS, icon: BarChart3 },
  // { name: 'Reports', href: ROUTES.REPORTS, icon: FileText },
  // { name: 'Profile', href: ROUTES.PROFILE, icon: User },
  { name: 'Testimonials', href: ROUTES.TESTIMONIAL, icon: MessageSquareQuote },
];

export const Sidebar = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col"
        aria-label="Sidebar navigation"
      >
        <div className="glass-strong flex h-full flex-col border-r border-white/30 shadow-frost dark:border-white/10">
          {/* Logo/Brand Section */}
          <div className="glass-light flex flex-shrink-0 items-center border-b border-white/30 px-6 py-6 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="hover:shadow-glow-brand-lg flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-400/30 bg-gradient-to-br from-primary-500 via-primary-500 to-primary-600 backdrop-blur-sm transition-all duration-300 hover:scale-110">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <div>
                <h1 className="text-gradient-brand text-xl font-bold tracking-tight">
                  Admin Panel
                </h1>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Enterprise Edition
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav
            className="scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-6"
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300',
                      'hover:glass-light hover:shadow-frost',
                      isActive
                        ? 'border border-primary-500/40 text-primary-700 shadow-frost dark:border-primary-500/30 dark:text-primary-300'
                        : 'glass-light border border-transparent text-gray-700 hover:border-white/20 dark:text-gray-300 dark:hover:border-white/10',
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-all duration-300',
                        'group-hover:rotate-3 group-hover:scale-110',
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-all duration-300',
                      '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                    )}
                  />
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile Section */}
          {/* <div className="glass-light flex-shrink-0 border-t border-white/30 p-4 dark:border-white/10">
            <div className="glass flex items-center gap-3 rounded-2xl border border-white/20 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-frost-lg dark:border-white/10">
              <div className="flex-shrink-0">
                <div className="hover:shadow-glow-brand-lg flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-400/30 bg-gradient-to-br from-primary-500 via-primary-500 to-primary-600 text-lg font-bold text-white shadow-glow-brand backdrop-blur-sm transition-all duration-300 hover:scale-110">
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="glass-strong fixed left-0 right-0 top-0 z-40 border-b border-white/30 shadow-frost dark:border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-md">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-30 animate-fade-in bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <aside
              className="glass-strong fixed inset-y-0 left-0 z-40 h-full w-72 animate-slide-in-left border-r border-white/30 shadow-frost-lg dark:border-white/10"
              aria-label="Mobile sidebar navigation"
            >
              <div className="flex h-full flex-col">
                {/* Mobile Menu Header */}
                <div className="glass-light flex items-center justify-between border-b border-white/30 px-6 py-5 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-md">
                      <span className="text-lg font-bold text-white">A</span>
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                        Admin Panel
                      </h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Enterprise Edition</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav
                  className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4 py-6"
                  aria-label="Main navigation"
                >
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                            'hover:glass-light hover:shadow-frost',
                            isActive
                              ? 'border border-primary-500/40 text-primary-700 shadow-frost dark:border-primary-500/30 dark:text-primary-300'
                              : 'glass-light border border-transparent text-gray-700 hover:border-white/20 dark:text-gray-300 dark:hover:border-white/10',
                          )
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      </NavLink>
                    );
                  })}
                </nav>

                {/* Mobile User Profile */}
                {/* <div className="flex-shrink-0 border-t border-white/30 p-4 dark:border-white/10">
                  <div className="glass flex items-center gap-3 rounded-xl border border-white/20 p-3 dark:border-white/10">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 font-semibold text-white shadow-md">
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            </aside>
          </>
        )}
      </div>
    </>
  );
};
