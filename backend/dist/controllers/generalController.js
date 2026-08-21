"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.saveEmailTemplate = exports.getEmailTemplates = exports.updateEmailMapping = exports.getEmailMappings = exports.saveEmailSetup = exports.getEmailSetup = exports.updateJobApplicationStatus = exports.getJobApplications = exports.deleteJobOpening = exports.updateJobOpening = exports.createJobOpening = exports.getJobOpenings = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogs = exports.deleteFaq = exports.updateFaq = exports.createFaq = exports.getFaqs = exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonials = exports.updateInquiryStatus = exports.createInquiry = exports.getInquiries = exports.getDashboardStats = void 0;
const Entities_js_1 = require("../models/Entities.js");
const Product_js_1 = require("../models/Product.js");
const WebsiteEditor_js_1 = require("../models/WebsiteEditor.js");
const http_js_1 = require("../utils/http.js");
// Dashboard Metrics
const getDashboardStats = async (req, res) => {
    try {
        const [totalProducts, activeProducts, openInquiries, jobApps, draftSections, recentAuditLogs] = await Promise.all([
            Product_js_1.Product.countDocuments(),
            Product_js_1.Product.countDocuments({ status: 'active' }),
            Entities_js_1.Inquiry.countDocuments({ status: { $in: ['new', 'in-progress'] } }),
            Entities_js_1.JobApplication.countDocuments({ status: 'new' }),
            WebsiteEditor_js_1.SectionContent.countDocuments({ isEdited: true }),
            Entities_js_1.AuditLog.find().sort({ createdAt: -1 }).limit(10)
        ]);
        return res.json({
            success: true,
            data: {
                totalProducts,
                activeProducts,
                openInquiries,
                jobApps,
                draftSections,
                recentActivity: recentAuditLogs
            }
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getDashboardStats = getDashboardStats;
// Inquiries (RFQs)
const getInquiries = async (req, res) => {
    try {
        const inquiries = await Entities_js_1.Inquiry.find().sort({ createdAt: -1 });
        return res.json({ success: true, data: inquiries });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getInquiries = getInquiries;
const createInquiry = async (req, res) => {
    try {
        const { name, company, email, phone, products, message } = req.body;
        const inquiry = await Entities_js_1.Inquiry.create({
            name,
            company,
            email,
            phone,
            products: products || [],
            message,
            status: 'new'
        });
        return res.status(201).json({ success: true, data: inquiry });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.createInquiry = createInquiry;
const updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'Inquiry'))
            return;
        const { status, assignedAdmin, notes } = req.body;
        const updates = {};
        if (status !== undefined)
            updates.status = status;
        if (assignedAdmin !== undefined)
            updates.assignedAdmin = assignedAdmin;
        if (notes !== undefined)
            updates.notes = notes;
        const inquiry = await Entities_js_1.Inquiry.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!inquiry)
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        return res.json({ success: true, data: inquiry });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateInquiryStatus = updateInquiryStatus;
// Testimonials CRUD
const getTestimonials = async (req, res) => {
    try {
        const items = await Entities_js_1.Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });
        return res.json({ success: true, data: items });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getTestimonials = getTestimonials;
const createTestimonial = async (req, res) => {
    try {
        const item = await Entities_js_1.Testimonial.create(req.body);
        return res.status(201).json({ success: true, data: item });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.createTestimonial = createTestimonial;
const updateTestimonial = async (req, res) => {
    try {
        if ((0, http_js_1.rejectInvalidId)(res, req.params.id, 'Testimonial'))
            return;
        const item = await Entities_js_1.Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item)
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        return res.json({ success: true, data: item });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateTestimonial = updateTestimonial;
const deleteTestimonial = async (req, res) => {
    try {
        if ((0, http_js_1.rejectInvalidId)(res, req.params.id, 'Testimonial'))
            return;
        const deleted = await Entities_js_1.Testimonial.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        return res.json({ success: true, message: 'Deleted' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteTestimonial = deleteTestimonial;
// FAQs CRUD
const getFaqs = async (req, res) => {
    try {
        const faqs = await Entities_js_1.Faq.find().sort({ displayOrder: 1 });
        return res.json({ success: true, data: faqs });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getFaqs = getFaqs;
const createFaq = async (req, res) => {
    try {
        const faq = await Entities_js_1.Faq.create(req.body);
        return res.status(201).json({ success: true, data: faq });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.createFaq = createFaq;
const updateFaq = async (req, res) => {
    try {
        if ((0, http_js_1.rejectInvalidId)(res, req.params.id, 'FAQ'))
            return;
        const faq = await Entities_js_1.Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!faq)
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        return res.json({ success: true, data: faq });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateFaq = updateFaq;
const deleteFaq = async (req, res) => {
    try {
        if ((0, http_js_1.rejectInvalidId)(res, req.params.id, 'FAQ'))
            return;
        const deleted = await Entities_js_1.Faq.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        return res.json({ success: true, message: 'Deleted' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteFaq = deleteFaq;
// Blogs CRUD
const getBlogs = async (req, res) => {
    try {
        const blogs = await Entities_js_1.Blog.find().sort({ createdAt: -1 });
        return res.json({ success: true, data: blogs });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getBlogs = getBlogs;
const createBlog = async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title || !String(title).trim()) {
            return res.status(400).json({ success: false, message: 'Article title is required' });
        }
        if (!body || !String(body).trim()) {
            return res.status(400).json({ success: false, message: 'Article content is required' });
        }
        const cleanSlug = (0, http_js_1.slugify)(req.body.slug || title);
        const existing = await Entities_js_1.Blog.findOne({ slug: cleanSlug });
        if (existing) {
            return res.status(400).json({ success: false, message: `Article slug '${cleanSlug}' already exists` });
        }
        const blog = await Entities_js_1.Blog.create({ ...req.body, slug: cleanSlug });
        return res.status(201).json({ success: true, data: blog });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.createBlog = createBlog;
const updateBlog = async (req, res) => {
    try {
        if ((0, http_js_1.rejectInvalidId)(res, req.params.id, 'Article'))
            return;
        const updates = { ...req.body };
        if (updates.slug) {
            updates.slug = (0, http_js_1.slugify)(updates.slug);
            const clash = await Entities_js_1.Blog.findOne({ slug: updates.slug, _id: { $ne: req.params.id } });
            if (clash) {
                return res.status(400).json({ success: false, message: `Article slug '${updates.slug}' already in use` });
            }
        }
        const blog = await Entities_js_1.Blog.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!blog)
            return res.status(404).json({ success: false, message: 'Article not found' });
        return res.json({ success: true, data: blog });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        if ((0, http_js_1.rejectInvalidId)(res, req.params.id, 'Article'))
            return;
        const deleted = await Entities_js_1.Blog.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, message: 'Article not found' });
        return res.json({ success: true, message: 'Deleted' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteBlog = deleteBlog;
// Job Openings & Applications
const getJobOpenings = async (req, res) => {
    try {
        const jobs = await Entities_js_1.JobOpening.find().sort({ createdAt: -1 });
        return res.json({ success: true, data: jobs });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getJobOpenings = getJobOpenings;
const createJobOpening = async (req, res) => {
    try {
        const job = await Entities_js_1.JobOpening.create(req.body);
        return res.status(201).json({ success: true, data: job });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.createJobOpening = createJobOpening;
const updateJobOpening = async (req, res) => {
    try {
        if ((0, http_js_1.rejectInvalidId)(res, req.params.id, 'Job opening'))
            return;
        const job = await Entities_js_1.JobOpening.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job)
            return res.status(404).json({ success: false, message: 'Job opening not found' });
        return res.json({ success: true, data: job });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateJobOpening = updateJobOpening;
const deleteJobOpening = async (req, res) => {
    try {
        if ((0, http_js_1.rejectInvalidId)(res, req.params.id, 'Job opening'))
            return;
        const deleted = await Entities_js_1.JobOpening.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, message: 'Job opening not found' });
        return res.json({ success: true, message: 'Deleted' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteJobOpening = deleteJobOpening;
const getJobApplications = async (req, res) => {
    try {
        const apps = await Entities_js_1.JobApplication.find().populate('jobOpening').sort({ createdAt: -1 });
        return res.json({ success: true, data: apps });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getJobApplications = getJobApplications;
const updateJobApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'Job application'))
            return;
        const { status } = req.body;
        const app = await Entities_js_1.JobApplication.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!app)
            return res.status(404).json({ success: false, message: 'Job application not found' });
        return res.json({ success: true, data: app });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateJobApplicationStatus = updateJobApplicationStatus;
// Email Suite Controllers
const getEmailSetup = async (req, res) => {
    try {
        let setup = await Entities_js_1.EmailSetup.findOne();
        if (!setup) {
            // Nothing configured yet — return an unconfigured shell so the form can
            // render its empty state. Do not invent credentials.
            setup = await Entities_js_1.EmailSetup.create({ isConfigured: false });
        }
        return res.json({
            success: true,
            data: {
                id: setup._id,
                host: setup.host,
                port: setup.port,
                secure: setup.secure,
                user: setup.user,
                pass: setup.pass ? '••••••••' : '',
                fromName: setup.fromName,
                fromEmail: setup.fromEmail,
                isConfigured: setup.isConfigured
            }
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getEmailSetup = getEmailSetup;
const saveEmailSetup = async (req, res) => {
    try {
        let setup = await Entities_js_1.EmailSetup.findOne();
        if (!setup)
            setup = new Entities_js_1.EmailSetup();
        const { host, port, secure, user, pass, fromName, fromEmail } = req.body;
        if (host)
            setup.host = host;
        if (port)
            setup.port = Number(port);
        if (secure !== undefined)
            setup.secure = secure;
        if (user)
            setup.user = user;
        if (pass && pass !== '••••••••')
            setup.pass = pass;
        if (fromName)
            setup.fromName = fromName;
        if (fromEmail)
            setup.fromEmail = fromEmail;
        setup.isConfigured = true;
        await setup.save();
        return res.json({ success: true, message: 'Email configuration saved successfully' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.saveEmailSetup = saveEmailSetup;
const getEmailMappings = async (req, res) => {
    try {
        const mappings = await Entities_js_1.EmailMapping.find().sort({ eventKey: 1 });
        return res.json({ success: true, data: mappings });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getEmailMappings = getEmailMappings;
const updateEmailMapping = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'Email mapping'))
            return;
        const mapping = await Entities_js_1.EmailMapping.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!mapping)
            return res.status(404).json({ success: false, message: 'Email mapping not found' });
        return res.json({ success: true, data: mapping });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateEmailMapping = updateEmailMapping;
const getEmailTemplates = async (req, res) => {
    try {
        const templates = await Entities_js_1.EmailTemplate.find().sort({ name: 1 });
        return res.json({ success: true, data: templates });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getEmailTemplates = getEmailTemplates;
const saveEmailTemplate = async (req, res) => {
    try {
        const { key, name, subject, htmlBody, variables } = req.body;
        let template = await Entities_js_1.EmailTemplate.findOne({ key });
        if (!template) {
            template = await Entities_js_1.EmailTemplate.create({ key, name, subject, htmlBody, variables });
        }
        else {
            template.name = name;
            template.subject = subject;
            template.htmlBody = htmlBody;
            if (variables)
                template.variables = variables;
            await template.save();
        }
        return res.json({ success: true, data: template });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.saveEmailTemplate = saveEmailTemplate;
const getAuditLogs = async (req, res) => {
    try {
        const logs = await Entities_js_1.AuditLog.find().sort({ createdAt: -1 }).limit(100);
        return res.json({ success: true, data: logs });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAuditLogs = getAuditLogs;
