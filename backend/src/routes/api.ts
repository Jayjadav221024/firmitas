import { Router } from 'express';
import { login, getMe } from '../controllers/authController.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct
} from '../controllers/productController.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBrands
} from '../controllers/categoryController.js';
import {
  getPages,
  getSectionsByPage,
  getSiteStats,
  saveSectionDraft,
  publishSection,
  revertSectionChanges,
  getPublicPageContent
} from '../controllers/websiteEditorController.js';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import {
  getDashboardStats,
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getJobOpenings,
  createJobOpening,
  updateJobOpening,
  deleteJobOpening,
  getJobApplications,
  updateJobApplicationStatus,
  getEmailSetup,
  saveEmailSetup,
  getEmailMappings,
  updateEmailMapping,
  getEmailTemplates,
  saveEmailTemplate,
  getAuditLogs
} from '../controllers/generalController.js';
import { authenticateJWT, checkPermission } from '../middleware/auth.js';

const router = Router();

// Auth
router.post('/auth/login', login);
router.get('/auth/me', authenticateJWT, getMe);

// Dashboard
router.get('/dashboard/stats', authenticateJWT, checkPermission('dashboard', 'view'), getDashboardStats);

// Products
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', authenticateJWT, checkPermission('products', 'create'), createProduct);
router.put('/products/:id', authenticateJWT, checkPermission('products', 'edit'), updateProduct);
router.patch('/products/:id/toggle-status', authenticateJWT, checkPermission('products', 'edit'), toggleProductStatus);
router.delete('/products/:id', authenticateJWT, checkPermission('products', 'delete'), deleteProduct);

// Categories & Brands
router.get('/categories', getCategories);
router.post('/categories', authenticateJWT, checkPermission('categories', 'create'), createCategory);
router.put('/categories/:id', authenticateJWT, checkPermission('categories', 'edit'), updateCategory);
router.delete('/categories/:id', authenticateJWT, checkPermission('categories', 'delete'), deleteCategory);
router.get('/brands', getBrands);

// Website Editor (CMS)
router.get('/website-editor/pages', getPages);
router.get('/website-editor/sections/:pageKey', getSectionsByPage);
router.get('/website-editor/stats', getSiteStats);
router.post('/website-editor/sections/:sectionId/draft', authenticateJWT, checkPermission('website_editor', 'edit'), saveSectionDraft);
router.post('/website-editor/sections/:sectionId/publish', authenticateJWT, checkPermission('website_editor', 'publish'), publishSection);
router.post('/website-editor/sections/:sectionId/revert', authenticateJWT, checkPermission('website_editor', 'edit'), revertSectionChanges);
router.get('/website-editor/public/:pageKey', getPublicPageContent);

// Roles & Users
router.get('/roles', authenticateJWT, checkPermission('roles', 'view'), getRoles);
router.post('/roles', authenticateJWT, checkPermission('roles', 'create'), createRole);
router.put('/roles/:id', authenticateJWT, checkPermission('roles', 'edit'), updateRole);
router.delete('/roles/:id', authenticateJWT, checkPermission('roles', 'delete'), deleteRole);

router.get('/users', authenticateJWT, checkPermission('users', 'view'), getUsers);
router.post('/users', authenticateJWT, checkPermission('users', 'create'), createUser);
router.put('/users/:id', authenticateJWT, checkPermission('users', 'edit'), updateUser);
router.delete('/users/:id', authenticateJWT, checkPermission('users', 'delete'), deleteUser);

// Testimonials, FAQs, Blogs
router.get('/testimonials', getTestimonials);
router.post('/testimonials', authenticateJWT, checkPermission('testimonials', 'create'), createTestimonial);
router.put('/testimonials/:id', authenticateJWT, checkPermission('testimonials', 'edit'), updateTestimonial);
router.delete('/testimonials/:id', authenticateJWT, checkPermission('testimonials', 'delete'), deleteTestimonial);

router.get('/faqs', getFaqs);
router.post('/faqs', authenticateJWT, checkPermission('faqs', 'create'), createFaq);
router.put('/faqs/:id', authenticateJWT, checkPermission('faqs', 'edit'), updateFaq);
router.delete('/faqs/:id', authenticateJWT, checkPermission('faqs', 'delete'), deleteFaq);

router.get('/blogs', getBlogs);
router.post('/blogs', authenticateJWT, checkPermission('blogs', 'create'), createBlog);
router.put('/blogs/:id', authenticateJWT, checkPermission('blogs', 'edit'), updateBlog);
router.delete('/blogs/:id', authenticateJWT, checkPermission('blogs', 'delete'), deleteBlog);

// Inquiries (RFQs)
router.get('/inquiries', authenticateJWT, checkPermission('inquiries', 'view'), getInquiries);
router.post('/inquiries', createInquiry);
router.patch('/inquiries/:id', authenticateJWT, checkPermission('inquiries', 'edit'), updateInquiryStatus);

// Careers
router.get('/job-openings', getJobOpenings);
router.post('/job-openings', authenticateJWT, checkPermission('job_openings', 'create'), createJobOpening);
router.put('/job-openings/:id', authenticateJWT, checkPermission('job_openings', 'edit'), updateJobOpening);
router.delete('/job-openings/:id', authenticateJWT, checkPermission('job_openings', 'delete'), deleteJobOpening);

router.get('/job-applications', authenticateJWT, checkPermission('job_applications', 'view'), getJobApplications);
router.patch('/job-applications/:id', authenticateJWT, checkPermission('job_applications', 'edit'), updateJobApplicationStatus);

// Email Suite
router.get('/email/setup', authenticateJWT, checkPermission('email_setup', 'view'), getEmailSetup);
router.post('/email/setup', authenticateJWT, checkPermission('email_setup', 'edit'), saveEmailSetup);
router.get('/email/mappings', authenticateJWT, checkPermission('email_for', 'view'), getEmailMappings);
router.put('/email/mappings/:id', authenticateJWT, checkPermission('email_for', 'edit'), updateEmailMapping);
router.get('/email/templates', authenticateJWT, checkPermission('email_template', 'view'), getEmailTemplates);
router.post('/email/templates', authenticateJWT, checkPermission('email_template', 'edit'), saveEmailTemplate);

// Audit Logs
router.get('/audit-logs', authenticateJWT, checkPermission('dashboard', 'view'), getAuditLogs);

export default router;
