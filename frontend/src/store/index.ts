import { create } from 'zustand';
import { User, PermissionMatrix } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasPermission: (moduleName: string, action?: 'view' | 'create' | 'edit' | 'delete' | 'publish') => boolean;
}

// Default Super Admin for instant preview / offline demo
const defaultSuperAdmin: User = {
  id: 'usr_superadmin',
  name: 'Super Admin',
  email: 'admin@firmitas.com',
  avatar: '',
  roleId: 'role_superadmin',
  roleName: 'Super Admin',
  roleKey: 'super_admin',
  permissions: {
    dashboard: { view: true, create: true, edit: true, delete: true, publish: true },
    users: { view: true, create: true, edit: true, delete: true, publish: true },
    roles: { view: true, create: true, edit: true, delete: true, publish: true },
    email_setup: { view: true, create: true, edit: true, delete: true, publish: true },
    email_for: { view: true, create: true, edit: true, delete: true, publish: true },
    email_template: { view: true, create: true, edit: true, delete: true, publish: true },
    website_editor: { view: true, create: true, edit: true, delete: true, publish: true },
    products: { view: true, create: true, edit: true, delete: true, publish: true },
    categories: { view: true, create: true, edit: true, delete: true, publish: true },
    testimonials: { view: true, create: true, edit: true, delete: true, publish: true },
    faqs: { view: true, create: true, edit: true, delete: true, publish: true },
    blogs: { view: true, create: true, edit: true, delete: true, publish: true },
    inquiries: { view: true, create: true, edit: true, delete: true, publish: true },
    job_openings: { view: true, create: true, edit: true, delete: true, publish: true },
    job_applications: { view: true, create: true, edit: true, delete: true, publish: true }
  }
};

export const useAuthStore = create<AuthState>((set, get) => {
  const storedUser = localStorage.getItem('shreeraj_user');
  const storedToken = localStorage.getItem('shreeraj_token');

  return {
    user: storedUser ? JSON.parse(storedUser) : defaultSuperAdmin,
    token: storedToken || 'mock_superadmin_token_2026',
    isAuthenticated: true,

    login: (token: string, user: User) => {
      localStorage.setItem('shreeraj_token', token);
      localStorage.setItem('shreeraj_user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem('shreeraj_token');
      localStorage.removeItem('shreeraj_user');
      set({ token: null, user: null, isAuthenticated: false });
    },

    hasPermission: (moduleName: string, action: 'view' | 'create' | 'edit' | 'delete' | 'publish' = 'view') => {
      const user = get().user;
      if (!user) return false;
      if (user.roleKey === 'super_admin') return true;
      const perms = user.permissions?.[moduleName];
      return perms ? !!perms[action] : false;
    }
  };
});

interface UIState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
  isDarkMode: true,
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  activeTab: 'site-wide',
  setActiveTab: (tab: string) => set({ activeTab: tab })
}));
