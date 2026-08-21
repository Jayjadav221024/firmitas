import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings,
  Mail,
  FileCode,
  Globe,
  Package,
  Layers,
  MessageSquareQuote,
  HelpCircle,
  BookOpen,
  Inbox,
  Briefcase,
  UserCheck,
  Moon,
  Sun,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';

interface NavItemConfig {
  to: string;
  label: string;
  module: string;
  icon: React.ElementType;
}

const navItems: NavItemConfig[] = [
  { to: '/admin/dashboard', label: 'Dashboard', module: 'dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Admin Users', module: 'users', icon: Users },
  { to: '/admin/roles', label: 'User Roles', module: 'roles', icon: ShieldCheck },
  { to: '/admin/email/setup', label: 'Email Setup', module: 'email_setup', icon: Settings },
  { to: '/admin/email/for', label: 'Email For', module: 'email_for', icon: Mail },
  { to: '/admin/email/templates', label: 'Email Template', module: 'email_template', icon: FileCode },
  { to: '/admin/website-editor', label: 'Website Editor', module: 'website_editor', icon: Globe },
  { to: '/admin/products', label: 'Products', module: 'products', icon: Package },
  { to: '/admin/categories', label: 'Categories', module: 'categories', icon: Layers },
  { to: '/admin/testimonials', label: 'Testimonials', module: 'testimonials', icon: MessageSquareQuote },
  { to: '/admin/faqs', label: 'FAQs', module: 'faqs', icon: HelpCircle },
  { to: '/admin/blogs', label: 'Blogs', module: 'blogs', icon: BookOpen },
  { to: '/admin/inquiries', label: 'Inquiries (RFQs)', module: 'inquiries', icon: Inbox },
  { to: '/admin/job-openings', label: 'Job Openings', module: 'job_openings', icon: Briefcase },
  { to: '/admin/job-applications', label: 'Job Applications', module: 'job_applications', icon: UserCheck }
];

export const AdminSidebar: React.FC = () => {
  const { user, hasPermission, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar, isDarkMode, toggleDarkMode } = useUIStore();

  const allowedNavItems = navItems.filter((item) => hasPermission(item.module, 'view'));

  return (
    <aside
      className={`relative flex flex-col h-screen bg-[#0b0e14] text-slate-300 border-r border-[#1a1f2c] transition-all duration-300 z-30 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#1a1f2c]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-base shadow-md shadow-teal-900/30 flex-shrink-0">
            F1
          </div>
          {!isSidebarCollapsed && (
            <div className="truncate">
              <h1 className="text-sm font-semibold text-white tracking-wide truncate">
                Firmitas 1
              </h1>
              <p className="text-xs text-slate-400 truncate">Pharma CMS & Admin</p>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 custom-scrollbar">
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-700/50'
                    : 'text-slate-300 hover:text-white hover:bg-[#151a24]'
                }`
              }
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon size={19} className="flex-shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom User & Actions Section */}
      <div className="p-3 border-t border-[#1a1f2c] bg-[#0d1017] space-y-2">
        {/* User Card */}
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-[#151a24] transition-colors">
          <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-teal-300 flex-shrink-0">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SU'}
          </div>
          {!isSidebarCollapsed && (
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Super Admin'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.roleName || 'Super Admin'}</p>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-[#151a24] transition-colors"
        >
          {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
          {!isSidebarCollapsed && <span>{isDarkMode ? 'Dark mode' : 'Light mode'}</span>}
        </button>

        {/* Sign Out */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut size={16} />
          {!isSidebarCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};
