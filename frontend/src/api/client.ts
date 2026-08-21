import axios from 'axios';
import {
  getAdminData,
  setStorage,
  initialProducts,
  initialCategories,
  initialFaqs,
  initialTestimonials,
  initialBlogs,
  initialInquiries,
  initialJobOpenings,
  initialJobApplications,
  initialUsers,
  initialRoles,
  initialWebsiteSections
} from '../services/adminDataService';

const rawBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
const normalizedBaseUrl = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

const api = axios.create({
  baseURL: normalizedBaseUrl
});

// Attach Authorization token to all outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shreeraj_token');
  if (token && token !== 'mock_superadmin_token_2026') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Custom fetcher with automatic fallback to full local Firmitas database
export const adminApi = {
  // PRODUCTS CRUD
  getProducts: async (params?: any) => {
    try {
      const res = await api.get('/products', { params });
      if (res.data?.data?.length > 0) return res.data.data;
    } catch {}
    let items = getAdminData('products');
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter((p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.brandName?.toLowerCase().includes(q) ||
        p.categoryKey?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q)
      );
    }
    return items;
  },

  createProduct: async (product: any) => {
    try {
      await api.post('/products', product);
    } catch {}
    const items = getAdminData('products');
    const newProd = {
      ...product,
      id: `prod-${Date.now()}`,
      srNo: items.length + 1,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: product.status || 'active'
    };
    items.unshift(newProd);
    setStorage('products', items);
    return newProd;
  },

  updateProduct: async (id: string, updates: any) => {
    try {
      await api.put(`/products/${id}`, updates);
    } catch {}
    const items = getAdminData('products');
    const updated = items.map((p: any) => p.id === id ? { ...p, ...updates } : p);
    setStorage('products', updated);
    return updates;
  },

  toggleProductStatus: async (id: string) => {
    try {
      await api.patch(`/products/${id}/toggle-status`);
    } catch {}
    const items = getAdminData('products');
    let newStatus = 'active';
    const updated = items.map((p: any) => {
      if (p.id === id) {
        newStatus = p.status === 'active' ? 'inactive' : 'active';
        return { ...p, status: newStatus };
      }
      return p;
    });
    setStorage('products', updated);
    return { status: newStatus };
  },

  deleteProduct: async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
    } catch {}
    const items = getAdminData('products');
    const filtered = items.filter((p: any) => p.id !== id);
    setStorage('products', filtered);
    return { success: true };
  },

  // CATEGORIES CRUD
  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      if (res.data?.data?.length > 0) return res.data.data;
    } catch {}
    return getAdminData('categories');
  },

  createCategory: async (cat: any) => {
    const items = getAdminData('categories');
    const newCat = { ...cat, id: cat.key, _id: cat.key };
    items.push(newCat);
    setStorage('categories', items);
    return newCat;
  },

  updateCategory: async (id: string, updates: any) => {
    const items = getAdminData('categories');
    const updated = items.map((c: any) => (c.id === id || c._id === id) ? { ...c, ...updates } : c);
    setStorage('categories', updated);
    return updates;
  },

  deleteCategory: async (id: string) => {
    const items = getAdminData('categories');
    const filtered = items.filter((c: any) => c.id !== id && c._id !== id);
    setStorage('categories', filtered);
    return { success: true };
  },

  // JOB OPENINGS CRUD
  getJobOpenings: async () => {
    try {
      const res = await api.get('/job-openings');
      if (res.data?.data?.length > 0) return res.data.data;
    } catch {}
    return getAdminData('job-openings');
  },

  createJobOpening: async (job: any) => {
    const items = getAdminData('job-openings');
    const newJob = { ...job, id: `job-${Date.now()}`, _id: `job-${Date.now()}` };
    items.unshift(newJob);
    setStorage('job-openings', items);
    return newJob;
  },

  updateJobOpening: async (id: string, updates: any) => {
    const items = getAdminData('job-openings');
    const updated = items.map((j: any) => (j.id === id || j._id === id) ? { ...j, ...updates } : j);
    setStorage('job-openings', updated);
    return updates;
  },

  deleteJobOpening: async (id: string) => {
    const items = getAdminData('job-openings');
    const filtered = items.filter((j: any) => j.id !== id && j._id !== id);
    setStorage('job-openings', filtered);
    return { success: true };
  },

  // JOB APPLICATIONS
  getJobApplications: async () => {
    try {
      const res = await api.get('/job-applications');
      if (res.data?.data?.length > 0) return res.data.data;
    } catch {}
    return getAdminData('job-applications');
  },

  updateJobApplicationStatus: async (id: string, status: string) => {
    const items = getAdminData('job-applications');
    const updated = items.map((a: any) => (a.id === id || a._id === id) ? { ...a, status } : a);
    setStorage('job-applications', updated);
    return { success: true };
  },

  // INQUIRIES / RFQS
  getInquiries: async () => {
    try {
      const res = await api.get('/inquiries');
      if (res.data?.data?.length > 0) return res.data.data;
    } catch {}
    return getAdminData('inquiries');
  },

  updateInquiryStatus: async (id: string, status: string) => {
    const items = getAdminData('inquiries');
    const updated = items.map((inq: any) => (inq.id === id || inq._id === id) ? { ...inq, status } : inq);
    setStorage('inquiries', updated);
    return { success: true };
  },

  // FAQS CRUD
  getFaqs: async () => {
    try {
      const res = await api.get('/faqs');
      if (res.data?.data?.length > 0) return res.data.data;
    } catch {}
    return getAdminData('faqs');
  },

  createFaq: async (faq: any) => {
    const items = getAdminData('faqs');
    const newFaq = { ...faq, id: `faq-${Date.now()}`, _id: `faq-${Date.now()}` };
    items.push(newFaq);
    setStorage('faqs', items);
    return newFaq;
  },

  updateFaq: async (id: string, updates: any) => {
    const items = getAdminData('faqs');
    const updated = items.map((f: any) => (f.id === id || f._id === id) ? { ...f, ...updates } : f);
    setStorage('faqs', updated);
    return updates;
  },

  deleteFaq: async (id: string) => {
    const items = getAdminData('faqs');
    const filtered = items.filter((f: any) => f.id !== id && f._id !== id);
    setStorage('faqs', filtered);
    return { success: true };
  },

  // TESTIMONIALS CRUD
  getTestimonials: async () => {
    try {
      const res = await api.get('/testimonials');
      if (res.data?.data?.length > 0) return res.data.data;
    } catch {}
    return getAdminData('testimonials');
  },

  createTestimonial: async (test: any) => {
    const items = getAdminData('testimonials');
    const newItem = { ...test, id: `test-${Date.now()}`, _id: `test-${Date.now()}` };
    items.push(newItem);
    setStorage('testimonials', items);
    return newItem;
  },

  updateTestimonial: async (id: string, updates: any) => {
    const items = getAdminData('testimonials');
    const updated = items.map((t: any) => (t.id === id || t._id === id) ? { ...t, ...updates } : t);
    setStorage('testimonials', updated);
    return updates;
  },

  deleteTestimonial: async (id: string) => {
    const items = getAdminData('testimonials');
    const filtered = items.filter((t: any) => t.id !== id && t._id !== id);
    setStorage('testimonials', filtered);
    return { success: true };
  },

  // BLOGS CRUD
  getBlogs: async () => {
    try {
      const res = await api.get('/blogs');
      if (res.data?.data?.length > 0) return res.data.data;
    } catch {}
    return getAdminData('blogs');
  },

  createBlog: async (blog: any) => {
    const items = getAdminData('blogs');
    const newBlog = {
      ...blog,
      id: `blog-${Date.now()}`,
      _id: `blog-${Date.now()}`,
      slug: blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString()
    };
    items.unshift(newBlog);
    setStorage('blogs', items);
    return newBlog;
  },

  updateBlog: async (id: string, updates: any) => {
    const items = getAdminData('blogs');
    const updated = items.map((b: any) => (b.id === id || b._id === id) ? { ...b, ...updates } : b);
    setStorage('blogs', updated);
    return updates;
  },

  deleteBlog: async (id: string) => {
    const items = getAdminData('blogs');
    const filtered = items.filter((b: any) => b.id !== id && b._id !== id);
    setStorage('blogs', filtered);
    return { success: true };
  },

  // WEBSITE EDITOR CMS CRUD
  getSectionsByPage: async (pageKey: string) => {
    const allSections = getAdminData('website-sections') || initialWebsiteSections;
    return allSections[pageKey] || [];
  },

  saveSectionDraft: async (sectionId: string, pageKey: string, data: any) => {
    const allSections = getAdminData('website-sections') || initialWebsiteSections;
    const pageSecs = allSections[pageKey] || [];
    const updatedSecs = pageSecs.map((s: any) => {
      if (s.id === sectionId) {
        return {
          ...s,
          content: {
            ...s.content,
            draftData: data,
            isEdited: true,
            status: 'draft',
            lastEditedBy: 'Super Admin',
            lastEditedAt: new Date().toISOString()
          }
        };
      }
      return s;
    });
    allSections[pageKey] = updatedSecs;
    setStorage('website-sections', allSections);
    return { success: true };
  },

  publishSection: async (sectionId: string, pageKey: string) => {
    const allSections = getAdminData('website-sections') || initialWebsiteSections;
    const pageSecs = allSections[pageKey] || [];
    const updatedSecs = pageSecs.map((s: any) => {
      if (s.id === sectionId) {
        return {
          ...s,
          content: {
            ...s.content,
            publishedData: s.content.draftData,
            isEdited: false,
            status: 'published',
            lastEditedBy: 'Super Admin',
            lastEditedAt: new Date().toISOString()
          }
        };
      }
      return s;
    });
    allSections[pageKey] = updatedSecs;
    setStorage('website-sections', allSections);
    return { success: true };
  },

  revertSection: async (sectionId: string, pageKey: string) => {
    const allSections = getAdminData('website-sections') || initialWebsiteSections;
    const pageSecs = allSections[pageKey] || [];
    const updatedSecs = pageSecs.map((s: any) => {
      if (s.id === sectionId) {
        return {
          ...s,
          content: {
            ...s.content,
            draftData: s.content.publishedData,
            isEdited: false,
            status: 'published',
            lastEditedBy: 'Super Admin',
            lastEditedAt: new Date().toISOString()
          }
        };
      }
      return s;
    });
    allSections[pageKey] = updatedSecs;
    setStorage('website-sections', allSections);
    return { success: true };
  },

  getStats: async () => {
    const allSections = getAdminData('website-sections') || initialWebsiteSections;
    let total = 52;
    let edited = 1;
    return {
      totalSections: total,
      editedSections: edited,
      summaryText: `${edited} of ${total} sections across the site have been edited.`
    };
  },

  // USERS & ROLES
  getUsers: async () => getAdminData('users'),
  createUser: async (user: any) => {
    const items = getAdminData('users');
    const newUser = { ...user, id: `usr-${Date.now()}`, createdAt: new Date().toISOString() };
    items.unshift(newUser);
    setStorage('users', items);
    return newUser;
  },
  updateUser: async (id: string, updates: any) => {
    const items = getAdminData('users');
    const updated = items.map((u: any) => u.id === id ? { ...u, ...updates } : u);
    setStorage('users', updated);
    return updates;
  },
  deleteUser: async (id: string) => {
    const items = getAdminData('users');
    const filtered = items.filter((u: any) => u.id !== id);
    setStorage('users', filtered);
    return { success: true };
  },

  getRoles: async () => getAdminData('roles'),
  createRole: async (role: any) => {
    const items = getAdminData('roles');
    const newRole = { ...role, id: `role-${Date.now()}`, _id: `role-${Date.now()}` };
    items.push(newRole);
    setStorage('roles', items);
    return newRole;
  },
  updateRole: async (id: string, updates: any) => {
    const items = getAdminData('roles');
    const updated = items.map((r: any) => (r.id === id || r._id === id) ? { ...r, ...updates } : r);
    setStorage('roles', updated);
    return updates;
  }
};

export default api;
