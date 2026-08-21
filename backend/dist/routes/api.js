"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_js_1 = require("../controllers/authController.js");
const productController_js_1 = require("../controllers/productController.js");
const categoryController_js_1 = require("../controllers/categoryController.js");
const websiteEditorController_js_1 = require("../controllers/websiteEditorController.js");
const userController_js_1 = require("../controllers/userController.js");
const generalController_js_1 = require("../controllers/generalController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// Auth
router.post('/auth/login', authController_js_1.login);
router.get('/auth/me', auth_js_1.authenticateJWT, authController_js_1.getMe);
// Dashboard
router.get('/dashboard/stats', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('dashboard', 'view'), generalController_js_1.getDashboardStats);
// Products
router.get('/products', productController_js_1.getProducts);
router.get('/products/:id', productController_js_1.getProductById);
router.post('/products', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('products', 'create'), productController_js_1.createProduct);
router.put('/products/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('products', 'edit'), productController_js_1.updateProduct);
router.patch('/products/:id/toggle-status', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('products', 'edit'), productController_js_1.toggleProductStatus);
router.delete('/products/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('products', 'delete'), productController_js_1.deleteProduct);
// Categories & Brands
router.get('/categories', categoryController_js_1.getCategories);
router.post('/categories', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('categories', 'create'), categoryController_js_1.createCategory);
router.put('/categories/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('categories', 'edit'), categoryController_js_1.updateCategory);
router.delete('/categories/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('categories', 'delete'), categoryController_js_1.deleteCategory);
router.get('/brands', categoryController_js_1.getBrands);
// Website Editor (CMS)
router.get('/website-editor/pages', websiteEditorController_js_1.getPages);
router.get('/website-editor/sections/:pageKey', websiteEditorController_js_1.getSectionsByPage);
router.get('/website-editor/stats', websiteEditorController_js_1.getSiteStats);
router.post('/website-editor/sections/:sectionId/draft', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('website_editor', 'edit'), websiteEditorController_js_1.saveSectionDraft);
router.post('/website-editor/sections/:sectionId/publish', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('website_editor', 'publish'), websiteEditorController_js_1.publishSection);
router.post('/website-editor/sections/:sectionId/revert', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('website_editor', 'edit'), websiteEditorController_js_1.revertSectionChanges);
router.get('/website-editor/public/:pageKey', websiteEditorController_js_1.getPublicPageContent);
// Roles & Users
router.get('/roles', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('roles', 'view'), userController_js_1.getRoles);
router.post('/roles', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('roles', 'create'), userController_js_1.createRole);
router.put('/roles/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('roles', 'edit'), userController_js_1.updateRole);
router.delete('/roles/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('roles', 'delete'), userController_js_1.deleteRole);
router.get('/users', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('users', 'view'), userController_js_1.getUsers);
router.post('/users', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('users', 'create'), userController_js_1.createUser);
router.put('/users/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('users', 'edit'), userController_js_1.updateUser);
router.delete('/users/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('users', 'delete'), userController_js_1.deleteUser);
// Testimonials, FAQs, Blogs
router.get('/testimonials', generalController_js_1.getTestimonials);
router.post('/testimonials', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('testimonials', 'create'), generalController_js_1.createTestimonial);
router.put('/testimonials/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('testimonials', 'edit'), generalController_js_1.updateTestimonial);
router.delete('/testimonials/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('testimonials', 'delete'), generalController_js_1.deleteTestimonial);
router.get('/faqs', generalController_js_1.getFaqs);
router.post('/faqs', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('faqs', 'create'), generalController_js_1.createFaq);
router.put('/faqs/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('faqs', 'edit'), generalController_js_1.updateFaq);
router.delete('/faqs/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('faqs', 'delete'), generalController_js_1.deleteFaq);
router.get('/blogs', generalController_js_1.getBlogs);
router.post('/blogs', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('blogs', 'create'), generalController_js_1.createBlog);
router.put('/blogs/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('blogs', 'edit'), generalController_js_1.updateBlog);
router.delete('/blogs/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('blogs', 'delete'), generalController_js_1.deleteBlog);
// Inquiries (RFQs)
router.get('/inquiries', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('inquiries', 'view'), generalController_js_1.getInquiries);
router.post('/inquiries', generalController_js_1.createInquiry);
router.patch('/inquiries/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('inquiries', 'edit'), generalController_js_1.updateInquiryStatus);
// Careers
router.get('/job-openings', generalController_js_1.getJobOpenings);
router.post('/job-openings', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('job_openings', 'create'), generalController_js_1.createJobOpening);
router.put('/job-openings/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('job_openings', 'edit'), generalController_js_1.updateJobOpening);
router.delete('/job-openings/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('job_openings', 'delete'), generalController_js_1.deleteJobOpening);
router.get('/job-applications', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('job_applications', 'view'), generalController_js_1.getJobApplications);
router.patch('/job-applications/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('job_applications', 'edit'), generalController_js_1.updateJobApplicationStatus);
// Email Suite
router.get('/email/setup', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('email_setup', 'view'), generalController_js_1.getEmailSetup);
router.post('/email/setup', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('email_setup', 'edit'), generalController_js_1.saveEmailSetup);
router.get('/email/mappings', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('email_for', 'view'), generalController_js_1.getEmailMappings);
router.put('/email/mappings/:id', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('email_for', 'edit'), generalController_js_1.updateEmailMapping);
router.get('/email/templates', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('email_template', 'view'), generalController_js_1.getEmailTemplates);
router.post('/email/templates', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('email_template', 'edit'), generalController_js_1.saveEmailTemplate);
// Audit Logs
router.get('/audit-logs', auth_js_1.authenticateJWT, (0, auth_js_1.checkPermission)('dashboard', 'view'), generalController_js_1.getAuditLogs);
exports.default = router;
