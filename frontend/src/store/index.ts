import { create } from 'zustand';
import { User } from '../types';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasPermission: (moduleName: string, action?: 'view' | 'create' | 'edit' | 'delete' | 'publish') => boolean;
}

/**
 * Restores a previous session from localStorage. Both the token and the user
 * record must be present and parseable — a half-written session is treated as
 * signed out rather than silently granting access.
 */
function restoreSession(): { user: User | null; token: string | null } {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!token || !rawUser) return { user: null, token: null };

    const user = JSON.parse(rawUser) as User;
    if (!user || !user.roleKey) return { user: null, token: null };

    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

export const useAuthStore = create<AuthState>((set, get) => {
  const { user, token } = restoreSession();

  return {
    user,
    token,
    // Derived from a real token issued by the backend. It is never hardcoded
    // to true — doing so let anybody open /admin without signing in.
    isAuthenticated: Boolean(token && user),

    login: (token: string, user: User) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
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
