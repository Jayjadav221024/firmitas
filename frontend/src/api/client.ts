import axios from 'axios';

/**
 * Single source of truth for the backend origin.
 *
 * Set VITE_API_URL in `.env` (dev) / `.env.production` (build). It may be given
 * with or without the trailing `/api` — both normalise to the same value.
 */
const rawBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  .trim()
  .replace(/\/+$/, '');
const normalizedBaseUrl = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

export const API_BASE_URL = normalizedBaseUrl;

// A Render free-tier service spins down when idle and needs roughly 50s to
// wake. Allow for that cold start rather than failing the first request.
const REQUEST_TIMEOUT_MS = 90_000;

const api = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: REQUEST_TIMEOUT_MS
});

export const TOKEN_STORAGE_KEY = 'firmitas_token';
export const USER_STORAGE_KEY = 'firmitas_user';

// Attach the real access token, when there is one. There is deliberately no
// fallback token: an unauthenticated request must fail with 401 so the UI can
// send the user to the login screen.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// An expired or invalid session drops the stored credentials and returns the
// user to the login page instead of silently rendering stale data.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/admin/login')) {
        window.location.assign('/admin/login');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Turns an axios failure into an Error carrying the backend's own message, so
 * React Query's `onError` can surface something useful in the toast.
 */
function toApiError(error: any, fallback: string): Error {
  if (error?.code === 'ECONNABORTED') {
    return new Error('The server took too long to respond. It may be waking up — please try again.');
  }
  if (error?.code === 'ERR_NETWORK') {
    return new Error('Cannot reach the server. Check your connection and that the API is running.');
  }
  const message =
    error?.response?.data?.message ||
    error?.message ||
    fallback;
  return new Error(message);
}

/** Unwraps `{ success, data }` and normalises a missing list to `[]`. */
function list<T = any>(payload: any): T[] {
  const data = payload?.data;
  return Array.isArray(data) ? data : [];
}

/**
 * Every method below talks to the Firmitas backend and nothing else.
 *
 * There is no local/offline fallback store. The previous version caught each
 * failure and served a hardcoded array from localStorage, which meant reads
 * showed data the database did not contain and writes reported success while
 * the database was never touched. Errors now propagate so the UI shows the real
 * outcome, and an empty database renders the empty state.
 */
export const adminApi = {
  // ----------------------------- PRODUCTS ----------------------------------
  getProducts: async (params?: any) => {
    try {
      const query: Record<string, any> = { limit: 200 };
      if (params?.search) query.search = params.search;
      if (params?.category && params.category !== 'all') query.category = params.category;
      if (params?.brand) query.brand = params.brand;
      if (params?.status) query.status = params.status;

      const res = await api.get('/products', { params: query });
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load products');
    }
  },

  createProduct: async (product: any) => {
    try {
      const res = await api.post('/products', product);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to create product');
    }
  },

  updateProduct: async (id: string, updates: any) => {
    try {
      const res = await api.put(`/products/${id}`, updates);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to update product');
    }
  },

  toggleProductStatus: async (id: string) => {
    try {
      const res = await api.patch(`/products/${id}/toggle-status`);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to change product status');
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch (e) {
      throw toApiError(e, 'Failed to delete product');
    }
  },

  // ---------------------------- CATEGORIES ---------------------------------
  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load categories');
    }
  },

  createCategory: async (cat: any) => {
    try {
      const res = await api.post('/categories', cat);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to create category');
    }
  },

  updateCategory: async (id: string, updates: any) => {
    try {
      const res = await api.put(`/categories/${id}`, updates);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to update category');
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    } catch (e) {
      throw toApiError(e, 'Failed to delete category');
    }
  },

  getBrands: async () => {
    try {
      const res = await api.get('/brands');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load brands');
    }
  },

  // --------------------------- JOB OPENINGS --------------------------------
  getJobOpenings: async () => {
    try {
      const res = await api.get('/job-openings');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load job openings');
    }
  },

  createJobOpening: async (job: any) => {
    try {
      const res = await api.post('/job-openings', job);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to create job opening');
    }
  },

  updateJobOpening: async (id: string, updates: any) => {
    try {
      const res = await api.put(`/job-openings/${id}`, updates);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to update job opening');
    }
  },

  deleteJobOpening: async (id: string) => {
    try {
      const res = await api.delete(`/job-openings/${id}`);
      return res.data;
    } catch (e) {
      throw toApiError(e, 'Failed to delete job opening');
    }
  },

  // -------------------------- JOB APPLICATIONS -----------------------------
  getJobApplications: async () => {
    try {
      const res = await api.get('/job-applications');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load job applications');
    }
  },

  updateJobApplicationStatus: async (id: string, status: string) => {
    try {
      const res = await api.patch(`/job-applications/${id}`, { status });
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to update applicant status');
    }
  },

  // ------------------------- INQUIRIES / RFQS ------------------------------
  getInquiries: async () => {
    try {
      const res = await api.get('/inquiries');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load inquiries');
    }
  },

  updateInquiryStatus: async (id: string, status: string) => {
    try {
      const res = await api.patch(`/inquiries/${id}`, { status });
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to update inquiry status');
    }
  },

  // ------------------------------- FAQS ------------------------------------
  getFaqs: async () => {
    try {
      const res = await api.get('/faqs');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load FAQs');
    }
  },

  createFaq: async (faq: any) => {
    try {
      const res = await api.post('/faqs', faq);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to create FAQ');
    }
  },

  updateFaq: async (id: string, updates: any) => {
    try {
      const res = await api.put(`/faqs/${id}`, updates);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to update FAQ');
    }
  },

  deleteFaq: async (id: string) => {
    try {
      const res = await api.delete(`/faqs/${id}`);
      return res.data;
    } catch (e) {
      throw toApiError(e, 'Failed to delete FAQ');
    }
  },

  // --------------------------- TESTIMONIALS --------------------------------
  getTestimonials: async () => {
    try {
      const res = await api.get('/testimonials');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load testimonials');
    }
  },

  createTestimonial: async (item: any) => {
    try {
      const res = await api.post('/testimonials', item);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to create testimonial');
    }
  },

  updateTestimonial: async (id: string, updates: any) => {
    try {
      const res = await api.put(`/testimonials/${id}`, updates);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to update testimonial');
    }
  },

  deleteTestimonial: async (id: string) => {
    try {
      const res = await api.delete(`/testimonials/${id}`);
      return res.data;
    } catch (e) {
      throw toApiError(e, 'Failed to delete testimonial');
    }
  },

  // ------------------------------- BLOGS -----------------------------------
  getBlogs: async () => {
    try {
      const res = await api.get('/blogs');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load articles');
    }
  },

  createBlog: async (blog: any) => {
    try {
      const res = await api.post('/blogs', blog);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to publish article');
    }
  },

  updateBlog: async (id: string, updates: any) => {
    try {
      const res = await api.put(`/blogs/${id}`, updates);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to update article');
    }
  },

  deleteBlog: async (id: string) => {
    try {
      const res = await api.delete(`/blogs/${id}`);
      return res.data;
    } catch (e) {
      throw toApiError(e, 'Failed to delete article');
    }
  },

  // ------------------------ WEBSITE EDITOR (CMS) ---------------------------
  getPages: async () => {
    try {
      const res = await api.get('/website-editor/pages');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load pages');
    }
  },

  getSectionsByPage: async (pageKey: string) => {
    try {
      const res = await api.get(`/website-editor/sections/${pageKey}`);
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load page sections');
    }
  },

  saveSectionDraft: async (sectionId: string, _pageKey: string, data: any) => {
    try {
      const res = await api.post(`/website-editor/sections/${sectionId}/draft`, { data });
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to save draft');
    }
  },

  publishSection: async (sectionId: string, _pageKey?: string) => {
    try {
      const res = await api.post(`/website-editor/sections/${sectionId}/publish`);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to publish section');
    }
  },

  revertSection: async (sectionId: string, _pageKey?: string) => {
    try {
      const res = await api.post(`/website-editor/sections/${sectionId}/revert`);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to revert section');
    }
  },

  getStats: async () => {
    try {
      const res = await api.get('/website-editor/stats');
      return res.data?.data ?? { totalSections: 0, editedSections: 0, summaryText: '' };
    } catch (e) {
      throw toApiError(e, 'Failed to load editor stats');
    }
  },

  // --------------------------- USERS & ROLES -------------------------------
  getUsers: async () => {
    try {
      const res = await api.get('/users');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load admin users');
    }
  },

  createUser: async (user: any) => {
    try {
      const res = await api.post('/users', user);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to create user');
    }
  },

  updateUser: async (id: string, updates: any) => {
    try {
      const res = await api.put(`/users/${id}`, updates);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to update user');
    }
  },

  deleteUser: async (id: string) => {
    try {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    } catch (e) {
      throw toApiError(e, 'Failed to delete user');
    }
  },

  getRoles: async () => {
    try {
      const res = await api.get('/roles');
      return list(res.data);
    } catch (e) {
      throw toApiError(e, 'Failed to load roles');
    }
  },

  createRole: async (role: any) => {
    try {
      const res = await api.post('/roles', role);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to create role');
    }
  },

  updateRole: async (id: string, updates: any) => {
    try {
      const res = await api.put(`/roles/${id}`, updates);
      return res.data?.data;
    } catch (e) {
      throw toApiError(e, 'Failed to update role');
    }
  },

  deleteRole: async (id: string) => {
    try {
      const res = await api.delete(`/roles/${id}`);
      return res.data;
    } catch (e) {
      throw toApiError(e, 'Failed to delete role');
    }
  }
};

export default api;
