import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';
import { Toaster } from 'sonner';

export const AdminLayout: React.FC = () => {
  const { user } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const location = useLocation();

  // Format title from route
  const getPageTitle = () => {
    const path = location.pathname.replace('/admin/', '').replace('/admin', '');
    if (!path || path === 'dashboard') return 'Dashboard';
    if (path.startsWith('website-editor')) return 'Website Editor';
    if (path.startsWith('products')) return 'Products';
    if (path.startsWith('categories')) return 'Categories';
    if (path.startsWith('users')) return 'Admin Users';
    if (path.startsWith('roles')) return 'User Roles';
    if (path.startsWith('email/setup')) return 'Email Setup';
    if (path.startsWith('email/for')) return 'Email For';
    if (path.startsWith('email/templates')) return 'Email Template';
    if (path.startsWith('inquiries')) return 'Inquiries (RFQs)';
    if (path.startsWith('job-openings')) return 'Job Openings';
    if (path.startsWith('job-applications')) return 'Job Applications';
    if (path.startsWith('testimonials')) return 'Testimonials';
    if (path.startsWith('faqs')) return 'FAQs';
    if (path.startsWith('blogs')) return 'Blogs';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${isDarkMode ? 'dark bg-[#0f1117] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <Toaster richColors position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className={`h-16 flex items-center justify-between px-8 border-b ${isDarkMode ? 'bg-[#0f1117] border-[#1e2330]' : 'bg-white border-slate-200'} z-20 flex-shrink-0`}>
          <h1 className="text-xl font-semibold tracking-tight">{getPageTitle()}</h1>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notification Bell */}
            <button
              className={`p-2 rounded-full relative transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
            </button>

            {/* Profile Avatar & Details */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-700/40">
              <div className="w-8 h-8 rounded-full bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-xs font-bold text-teal-400">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SU'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-tight">{user?.name || 'Super Admin'}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{user?.roleName || 'Super Admin'}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto min-w-0 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
