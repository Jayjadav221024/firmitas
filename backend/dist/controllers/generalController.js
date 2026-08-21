"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.saveEmailTemplate = exports.getEmailTemplates = exports.updateEmailMapping = exports.getEmailMappings = exports.saveEmailSetup = exports.getEmailSetup = exports.updateJobApplicationStatus = exports.getJobApplications = exports.deleteJobOpening = exports.updateJobOpening = exports.createJobOpening = exports.getJobOpenings = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogs = exports.deleteFaq = exports.updateFaq = exports.createFaq = exports.getFaqs = exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonials = exports.updateInquiryStatus = exports.createInquiry = exports.getInquiries = exports.getDashboardStats = void 0;
const Entities_js_1 = require("../models/Entities.js");
const Product_js_1 = require("../models/Product.js");
const WebsiteEditor_js_1 = require("../models/WebsiteEditor.js");
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
        const { status, assignedAdmin, notes } = req.body;
        const inquiry = await Entities_js_1.Inquiry.findByIdAndUpdate(id, { status, assignedAdmin, notes }, { new: true });
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
        const item = await Entities_js_1.Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json({ success: true, data: item });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateTestimonial = updateTestimonial;
const deleteTestimonial = async (req, res) => {
    try {
        await Entities_js_1.Testimonial.findByIdAndDelete(req.params.id);
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
        const faq = await Entities_js_1.Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json({ success: true, data: faq });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateFaq = updateFaq;
const deleteFaq = async (req, res) => {
    try {
        await Entities_js_1.Faq.findByIdAndDelete(req.params.id);
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
        const cleanSlug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
        const blog = await Entities_js_1.Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json({ success: true, data: blog });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        await Entities_js_1.Blog.findByIdAndDelete(req.params.id);
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
        const job = await Entities_js_1.JobOpening.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json({ success: true, data: job });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateJobOpening = updateJobOpening;
const deleteJobOpening = async (req, res) => {
    try {
        await Entities_js_1.JobOpening.findByIdAndDelete(req.params.id);
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
        const { status } = req.body;
        const app = await Entities_js_1.JobApplication.findByIdAndUpdate(id, { status }, { new: true });
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
            setup = await Entities_js_1.EmailSetup.create({
                host: 'smtp.gmail.com',
                port: 587,
                fromName: 'Shreeraj Traders Admin',
                fromEmail: 'info@shreerajtraders.com',
                isConfigured: true
            });
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
        const mapping = await Entities_js_1.EmailMapping.findByIdAndUpdate(id, req.body, { new: true });
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
