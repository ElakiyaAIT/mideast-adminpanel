import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import type { JSX } from 'react';

const DashboardLayout = (): JSX.Element => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white antialiased dark:bg-gray-950">
      {/* Premium background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary-500/8 absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow rounded-full blur-[120px]" />
        <div className="bg-primary-500/8 absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/2 translate-y-1/2 animate-pulse-slow rounded-full blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/5 blur-[100px]" />
      </div>

      <Sidebar />
      {/* Main Content Area */}
      <div className="relative z-10 lg:pl-72">
        <Header />
        <main
          className="p-4 pt-20 transition-all duration-300 sm:p-6 lg:p-8 lg:pt-0"
          role="main"
          id="main-content"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
