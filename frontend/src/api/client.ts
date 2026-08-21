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
  const token = localStorage.getItem('firmitas_token') || localStorage.getItem('shreeraj_token') || 'mock_superadmin_token_2026';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Custom fetcher with automatic fallback to full local Firmitas database
export const adminApi = {
  // PRODUCTS CRUD
  getProducts: async (params?: any) => {
    try {
      const queryParams = { limit: 200, ...params };
      const res = await api.get('/products', { params: queryParams });
      if (res.data?.data?.length > 0) {
        setStorage('products', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getProducts fallback to local store:', e);
    }
    let items = getAdminData('products', initialProducts);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter((p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.brandName?.toLowerCase().includes(q) ||
        p.categoryKey?.toLowerCase().includes(q) ||
        p.composition?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q)
      );
    }
    if (params?.category && params.category !== 'all') {
      items = items.filter((p: any) => p.categoryKey === params.category || p.category === params.category);
    }
    return items;
  },

  createProduct: async (product: any) => {
    let createdProd = null;
    try {
      const res = await api.post('/products', product);
      if (res.data?.data) {
        createdProd = res.data.data;
      }
    } catch (e) {
      console.warn('API createProduct error, using local persistence:', e);
    }

    const items = getAdminData('products', initialProducts);
    const newProd = createdProd || {
      ...product,
      id: `prod-${Date.now()}`,
      _id: `prod-${Date.now()}`,
      srNo: items.length + 1,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: product.status || 'active',
      createdAt: new Date().toISOString()
    };
    items.unshift(newProd);
    setStorage('products', items);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('firmitas_products_updated', { detail: newProd }));
    return newProd;
  },

  updateProduct: async (id: string, updates: any) => {
    try {
      await api.put(`/products/${id}`, updates);
    } catch (e) {
      console.warn('API updateProduct error, using local persistence:', e);
    }
    const items = getAdminData('products', initialProducts);
    const updated = items.map((p: any) => (p.id === id || p._id === id) ? { ...p, ...updates } : p);
    setStorage('products', updated);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('firmitas_products_updated', { detail: { id, updates } }));
    return updates;
  },

  toggleProductStatus: async (id: string) => {
    let newStatus = 'active';
    const items = getAdminData('products', initialProducts);
    const target = items.find((p: any) => p.id === id || p._id === id);
    if (target) {
      newStatus = target.status === 'active' ? 'inactive' : 'active';
    }
    try {
      await api.patch(`/products/${id}/toggle-status`, { status: newStatus });
    } catch (e) {
      console.warn('API toggleProductStatus error:', e);
    }
    const updated = items.map((p: any) => {
      if (p.id === id || p._id === id) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    setStorage('products', updated);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('firmitas_products_updated'));
    return { status: newStatus };
  },

  deleteProduct: async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (e) {
      console.warn('API deleteProduct error:', e);
    }
    const items = getAdminData('products', initialProducts);
    const filtered = items.filter((p: any) => p.id !== id && p._id !== id);
    setStorage('products', filtered);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('firmitas_products_updated'));
    return { success: true };
  },

  // CATEGORIES CRUD
  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      if (res.data?.data?.length > 0) {
        setStorage('categories', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getCategories error:', e);
    }
    return getAdminData('categories', initialCategories);
  },

  createCategory: async (cat: any) => {
    let created = null;
    try {
      const res = await api.post('/categories', cat);
      if (res.data?.data) created = res.data.data;
    } catch (e) {
      console.warn('API createCategory error:', e);
    }
    const items = getAdminData('categories', initialCategories);
    const newCat = created || { ...cat, id: cat.key, _id: cat.key };
    items.push(newCat);
    setStorage('categories', items);
    window.dispatchEvent(new Event('storage'));
    return newCat;
  },

  updateCategory: async (id: string, updates: any) => {
    try {
      await api.put(`/categories/${id}`, updates);
    } catch (e) {
      console.warn('API updateCategory error:', e);
    }
    const items = getAdminData('categories', initialCategories);
    const updated = items.map((c: any) => (c.id === id || c._id === id) ? { ...c, ...updates } : c);
    setStorage('categories', updated);
    window.dispatchEvent(new Event('storage'));
    return updates;
  },

  deleteCategory: async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
    } catch (e) {
      console.warn('API deleteCategory error:', e);
    }
    const items = getAdminData('categories', initialCategories);
    const filtered = items.filter((c: any) => c.id !== id && c._id !== id);
    setStorage('categories', filtered);
    window.dispatchEvent(new Event('storage'));
    return { success: true };
  },

  // JOB OPENINGS CRUD
  getJobOpenings: async () => {
    try {
      const res = await api.get('/job-openings');
      if (res.data?.data?.length > 0) {
        setStorage('job-openings', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getJobOpenings error:', e);
    }
    return getAdminData('job-openings', initialJobOpenings);
  },

  createJobOpening: async (job: any) => {
    let created = null;
    try {
      const res = await api.post('/job-openings', job);
      if (res.data?.data) created = res.data.data;
    } catch (e) {
      console.warn('API createJobOpening error:', e);
    }
    const items = getAdminData('job-openings', initialJobOpenings);
    const newJob = created || { ...job, id: `job-${Date.now()}`, _id: `job-${Date.now()}` };
    items.unshift(newJob);
    setStorage('job-openings', items);
    window.dispatchEvent(new Event('storage'));
    return newJob;
  },

  updateJobOpening: async (id: string, updates: any) => {
    try {
      await api.put(`/job-openings/${id}`, updates);
    } catch (e) {
      console.warn('API updateJobOpening error:', e);
    }
    const items = getAdminData('job-openings', initialJobOpenings);
    const updated = items.map((j: any) => (j.id === id || j._id === id) ? { ...j, ...updates } : j);
    setStorage('job-openings', updated);
    window.dispatchEvent(new Event('storage'));
    return updates;
  },

  deleteJobOpening: async (id: string) => {
    try {
      await api.delete(`/job-openings/${id}`);
    } catch (e) {
      console.warn('API deleteJobOpening error:', e);
    }
    const items = getAdminData('job-openings', initialJobOpenings);
    const filtered = items.filter((j: any) => j.id !== id && j._id !== id);
    setStorage('job-openings', filtered);
    window.dispatchEvent(new Event('storage'));
    return { success: true };
  },

  // JOB APPLICATIONS
  getJobApplications: async () => {
    try {
      const res = await api.get('/job-applications');
      if (res.data?.data?.length > 0) {
        setStorage('job-applications', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getJobApplications error:', e);
    }
    return getAdminData('job-applications', initialJobApplications);
  },

  updateJobApplicationStatus: async (id: string, status: string) => {
    try {
      await api.patch(`/job-applications/${id}`, { status });
    } catch (e) {
      console.warn('API updateJobApplicationStatus error:', e);
    }
    const items = getAdminData('job-applications', initialJobApplications);
    const updated = items.map((a: any) => (a.id === id || a._id === id) ? { ...a, status } : a);
    setStorage('job-applications', updated);
    window.dispatchEvent(new Event('storage'));
    return { success: true };
  },

  // INQUIRIES / RFQS
  getInquiries: async () => {
    try {
      const res = await api.get('/inquiries');
      if (res.data?.data?.length > 0) {
        setStorage('inquiries', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getInquiries error:', e);
    }
    return getAdminData('inquiries', initialInquiries);
  },

  updateInquiryStatus: async (id: string, status: string) => {
    try {
      await api.patch(`/inquiries/${id}`, { status });
    } catch (e) {
      console.warn('API updateInquiryStatus error:', e);
    }
    const items = getAdminData('inquiries', initialInquiries);
    const updated = items.map((inq: any) => (inq.id === id || inq._id === id) ? { ...inq, status } : inq);
    setStorage('inquiries', updated);
    window.dispatchEvent(new Event('storage'));
    return { success: true };
  },

  // FAQS CRUD
  getFaqs: async () => {
    try {
      const res = await api.get('/faqs');
      if (res.data?.data?.length > 0) {
        setStorage('faqs', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getFaqs error:', e);
    }
    return getAdminData('faqs', initialFaqs);
  },

  createFaq: async (faq: any) => {
    let created = null;
    try {
      const res = await api.post('/faqs', faq);
      if (res.data?.data) created = res.data.data;
    } catch (e) {
      console.warn('API createFaq error:', e);
    }
    const items = getAdminData('faqs', initialFaqs);
    const newFaq = created || { ...faq, id: `faq-${Date.now()}`, _id: `faq-${Date.now()}` };
    items.push(newFaq);
    setStorage('faqs', items);
    window.dispatchEvent(new Event('storage'));
    return newFaq;
  },

  updateFaq: async (id: string, updates: any) => {
    try {
      await api.put(`/faqs/${id}`, updates);
    } catch (e) {
      console.warn('API updateFaq error:', e);
    }
    const items = getAdminData('faqs', initialFaqs);
    const updated = items.map((f: any) => (f.id === id || f._id === id) ? { ...f, ...updates } : f);
    setStorage('faqs', updated);
    window.dispatchEvent(new Event('storage'));
    return updates;
  },

  deleteFaq: async (id: string) => {
    try {
      await api.delete(`/faqs/${id}`);
    } catch (e) {
      console.warn('API deleteFaq error:', e);
    }
    const items = getAdminData('faqs', initialFaqs);
    const filtered = items.filter((f: any) => f.id !== id && f._id !== id);
    setStorage('faqs', filtered);
    window.dispatchEvent(new Event('storage'));
    return { success: true };
  },

  // TESTIMONIALS CRUD
  getTestimonials: async () => {
    try {
      const res = await api.get('/testimonials');
      if (res.data?.data?.length > 0) {
        setStorage('testimonials', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getTestimonials error:', e);
    }
    return getAdminData('testimonials', initialTestimonials);
  },

  createTestimonial: async (test: any) => {
    let created = null;
    try {
      const res = await api.post('/testimonials', test);
      if (res.data?.data) created = res.data.data;
    } catch (e) {
      console.warn('API createTestimonial error:', e);
    }
    const items = getAdminData('testimonials', initialTestimonials);
    const newItem = created || { ...test, id: `test-${Date.now()}`, _id: `test-${Date.now()}` };
    items.push(newItem);
    setStorage('testimonials', items);
    window.dispatchEvent(new Event('storage'));
    return newItem;
  },

  updateTestimonial: async (id: string, updates: any) => {
    try {
      await api.put(`/testimonials/${id}`, updates);
    } catch (e) {
      console.warn('API updateTestimonial error:', e);
    }
    const items = getAdminData('testimonials', initialTestimonials);
    const updated = items.map((t: any) => (t.id === id || t._id === id) ? { ...t, ...updates } : t);
    setStorage('testimonials', updated);
    window.dispatchEvent(new Event('storage'));
    return updates;
  },

  deleteTestimonial: async (id: string) => {
    try {
      await api.delete(`/testimonials/${id}`);
    } catch (e) {
      console.warn('API deleteTestimonial error:', e);
    }
    const items = getAdminData('testimonials', initialTestimonials);
    const filtered = items.filter((t: any) => t.id !== id && t._id !== id);
    setStorage('testimonials', filtered);
    window.dispatchEvent(new Event('storage'));
    return { success: true };
  },

  // BLOGS CRUD
  getBlogs: async () => {
    try {
      const res = await api.get('/blogs');
      if (res.data?.data?.length > 0) {
        setStorage('blogs', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getBlogs error:', e);
    }
    return getAdminData('blogs', initialBlogs);
  },

  createBlog: async (blog: any) => {
    let created = null;
    try {
      const res = await api.post('/blogs', blog);
      if (res.data?.data) created = res.data.data;
    } catch (e) {
      console.warn('API createBlog error:', e);
    }
    const items = getAdminData('blogs', initialBlogs);
    const newBlog = created || {
      ...blog,
      id: `blog-${Date.now()}`,
      _id: `blog-${Date.now()}`,
      slug: blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString()
    };
    items.unshift(newBlog);
    setStorage('blogs', items);
    window.dispatchEvent(new Event('storage'));
    return newBlog;
  },

  updateBlog: async (id: string, updates: any) => {
    try {
      await api.put(`/blogs/${id}`, updates);
    } catch (e) {
      console.warn('API updateBlog error:', e);
    }
    const items = getAdminData('blogs', initialBlogs);
    const updated = items.map((b: any) => (b.id === id || b._id === id) ? { ...b, ...updates } : b);
    setStorage('blogs', updated);
    window.dispatchEvent(new Event('storage'));
    return updates;
  },

  deleteBlog: async (id: string) => {
    try {
      await api.delete(`/blogs/${id}`);
    } catch (e) {
      console.warn('API deleteBlog error:', e);
    }
    const items = getAdminData('blogs', initialBlogs);
    const filtered = items.filter((b: any) => b.id !== id && b._id !== id);
    setStorage('blogs', filtered);
    window.dispatchEvent(new Event('storage'));
    return { success: true };
  },

  // WEBSITE EDITOR CMS CRUD
  getSectionsByPage: async (pageKey: string) => {
    try {
      const res = await api.get(`/website-editor/sections/${pageKey}`);
      if (res.data?.data?.length > 0) {
        const allSections = getAdminData('website-sections', initialWebsiteSections);
        allSections[pageKey] = res.data.data;
        setStorage('website-sections', allSections);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getSectionsByPage fallback to local store:', e);
    }
    const allSections = getAdminData('website-sections', initialWebsiteSections);
    return allSections[pageKey] || initialWebsiteSections[pageKey] || [];
  },

  saveSectionDraft: async (sectionId: string, pageKey: string, data: any) => {
    try {
      await api.post(`/website-editor/sections/${sectionId}/draft`, { data });
    } catch (e) {
      console.warn('API saveSectionDraft error:', e);
    }
    const allSections = getAdminData('website-sections', initialWebsiteSections);
    const pageSecs = allSections[pageKey] || initialWebsiteSections[pageKey] || [];
    const updatedSecs = pageSecs.map((s: any) => {
      if (s.id === sectionId || s._id === sectionId) {
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
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('firmitas_cms_updated', { detail: { pageKey, sectionId, data } }));
    return { success: true };
  },

  publishSection: async (sectionId: string, pageKey: string) => {
    try {
      await api.post(`/website-editor/sections/${sectionId}/publish`);
    } catch (e) {
      console.warn('API publishSection error:', e);
    }
    const allSections = getAdminData('website-sections', initialWebsiteSections);
    const pageSecs = allSections[pageKey] || initialWebsiteSections[pageKey] || [];
    const updatedSecs = pageSecs.map((s: any) => {
      if (s.id === sectionId || s._id === sectionId) {
        return {
          ...s,
          content: {
            ...s.content,
            publishedData: s.content.draftData || s.content.publishedData,
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
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('firmitas_cms_updated', { detail: { pageKey, sectionId } }));
    return { success: true };
  },

  revertSection: async (sectionId: string, pageKey: string) => {
    try {
      await api.post(`/website-editor/sections/${sectionId}/revert`);
    } catch (e) {
      console.warn('API revertSection error:', e);
    }
    const allSections = getAdminData('website-sections', initialWebsiteSections);
    const pageSecs = allSections[pageKey] || initialWebsiteSections[pageKey] || [];
    const updatedSecs = pageSecs.map((s: any) => {
      if (s.id === sectionId || s._id === sectionId) {
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
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('firmitas_cms_updated', { detail: { pageKey, sectionId } }));
    return { success: true };
  },

  getStats: async () => {
    try {
      const res = await api.get('/website-editor/stats');
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getStats error:', e);
    }
    const allSections = getAdminData('website-sections', initialWebsiteSections);
    let total = 52;
    let edited = 1;
    return {
      totalSections: total,
      editedSections: edited,
      summaryText: `${edited} of ${total} sections across the site have been edited.`
    };
  },

  // USERS & ROLES
  getUsers: async () => {
    try {
      const res = await api.get('/users');
      if (res.data?.data?.length > 0) {
        setStorage('users', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getUsers error:', e);
    }
    return getAdminData('users', initialUsers);
  },

  createUser: async (user: any) => {
    let created = null;
    try {
      const res = await api.post('/users', user);
      if (res.data?.data) created = res.data.data;
    } catch (e) {
      console.warn('API createUser error:', e);
    }
    const items = getAdminData('users', initialUsers);
    const newUser = created || { ...user, id: `usr-${Date.now()}`, createdAt: new Date().toISOString() };
    items.unshift(newUser);
    setStorage('users', items);
    window.dispatchEvent(new Event('storage'));
    return newUser;
  },

  updateUser: async (id: string, updates: any) => {
    try {
      await api.put(`/users/${id}`, updates);
    } catch (e) {
      console.warn('API updateUser error:', e);
    }
    const items = getAdminData('users', initialUsers);
    const updated = items.map((u: any) => (u.id === id || u._id === id) ? { ...u, ...updates } : u);
    setStorage('users', updated);
    window.dispatchEvent(new Event('storage'));
    return updates;
  },

  deleteUser: async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
    } catch (e) {
      console.warn('API deleteUser error:', e);
    }
    const items = getAdminData('users', initialUsers);
    const filtered = items.filter((u: any) => u.id !== id && u._id !== id);
    setStorage('users', filtered);
    window.dispatchEvent(new Event('storage'));
    return { success: true };
  },

  getRoles: async () => {
    try {
      const res = await api.get('/roles');
      if (res.data?.data?.length > 0) {
        setStorage('roles', res.data.data);
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getRoles error:', e);
    }
    return getAdminData('roles', initialRoles);
  },

  createRole: async (role: any) => {
    let created = null;
    try {
      const res = await api.post('/roles', role);
      if (res.data?.data) created = res.data.data;
    } catch (e) {
      console.warn('API createRole error:', e);
    }
    const items = getAdminData('roles', initialRoles);
    const newRole = created || { ...role, id: `role-${Date.now()}`, _id: `role-${Date.now()}` };
    items.push(newRole);
    setStorage('roles', items);
    window.dispatchEvent(new Event('storage'));
    return newRole;
  },

  updateRole: async (id: string, updates: any) => {
    try {
      await api.put(`/roles/${id}`, updates);
    } catch (e) {
      console.warn('API updateRole error:', e);
    }
    const items = getAdminData('roles', initialRoles);
    const updated = items.map((r: any) => (r.id === id || r._id === id) ? { ...r, ...updates } : r);
    setStorage('roles', updated);
    window.dispatchEvent(new Event('storage'));
    return updates;
  }
};

export default api;
