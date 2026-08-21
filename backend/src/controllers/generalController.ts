import { Request, Response } from 'express';
import {
  Testimonial,
  Faq,
  Blog,
  Inquiry,
  JobOpening,
  JobApplication,
  EmailSetup,
  EmailMapping,
  EmailTemplate,
  AuditLog
} from '../models/Entities.js';
import { Product } from '../models/Product.js';
import { SectionContent } from '../models/WebsiteEditor.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAction } from '../services/auditService.js';
import { rejectInvalidId, slugify } from '../utils/http.js';

// Dashboard Metrics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalProducts,
      activeProducts,
      openInquiries,
      jobApps,
      draftSections,
      recentAuditLogs
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Inquiry.countDocuments({ status: { $in: ['new', 'in-progress'] } }),
      JobApplication.countDocuments({ status: 'new' }),
      SectionContent.countDocuments({ isEdited: true }),
      AuditLog.find().sort({ createdAt: -1 }).limit(10)
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
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Inquiries (RFQs)
export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: inquiries });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, products, message } = req.body;
    const inquiry = await Inquiry.create({
      name,
      company,
      email,
      phone,
      products: products || [],
      message,
      status: 'new'
    });

    return res.status(201).json({ success: true, data: inquiry });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateInquiryStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (rejectInvalidId(res, id, 'Inquiry')) return;

    const { status, assignedAdmin, notes } = req.body;
    const updates: Record<string, any> = {};
    if (status !== undefined) updates.status = status;
    if (assignedAdmin !== undefined) updates.assignedAdmin = assignedAdmin;
    if (notes !== undefined) updates.notes = notes;

    const inquiry = await Inquiry.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    return res.json({ success: true, data: inquiry });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Testimonials CRUD
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const items = await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });
    return res.json({ success: true, data: items });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const item = await Testimonial.create(req.body);
    return res.status(201).json({ success: true, data: item });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    if (rejectInvalidId(res, req.params.id, 'Testimonial')) return;
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    return res.json({ success: true, data: item });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    if (rejectInvalidId(res, req.params.id, 'Testimonial')) return;
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    return res.json({ success: true, message: 'Deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// FAQs CRUD
export const getFaqs = async (req: Request, res: Response) => {
  try {
    const faqs = await Faq.find().sort({ displayOrder: 1 });
    return res.json({ success: true, data: faqs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createFaq = async (req: AuthRequest, res: Response) => {
  try {
    const faq = await Faq.create(req.body);
    return res.status(201).json({ success: true, data: faq });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateFaq = async (req: AuthRequest, res: Response) => {
  try {
    if (rejectInvalidId(res, req.params.id, 'FAQ')) return;
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    return res.json({ success: true, data: faq });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteFaq = async (req: AuthRequest, res: Response) => {
  try {
    if (rejectInvalidId(res, req.params.id, 'FAQ')) return;
    const deleted = await Faq.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'FAQ not found' });
    return res.json({ success: true, message: 'Deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Blogs CRUD
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: blogs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { title, body } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Article title is required' });
    }
    if (!body || !String(body).trim()) {
      return res.status(400).json({ success: false, message: 'Article content is required' });
    }

    const cleanSlug = slugify(req.body.slug || title);
    const existing = await Blog.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: `Article slug '${cleanSlug}' already exists` });
    }

    const blog = await Blog.create({ ...req.body, slug: cleanSlug });
    return res.status(201).json({ success: true, data: blog });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  try {
    if (rejectInvalidId(res, req.params.id, 'Article')) return;

    const updates = { ...req.body };
    if (updates.slug) {
      updates.slug = slugify(updates.slug);
      const clash = await Blog.findOne({ slug: updates.slug, _id: { $ne: req.params.id } });
      if (clash) {
        return res.status(400).json({ success: false, message: `Article slug '${updates.slug}' already in use` });
      }
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Article not found' });
    return res.json({ success: true, data: blog });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  try {
    if (rejectInvalidId(res, req.params.id, 'Article')) return;
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Article not found' });
    return res.json({ success: true, message: 'Deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Job Openings & Applications
export const getJobOpenings = async (req: Request, res: Response) => {
  try {
    const jobs = await JobOpening.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: jobs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createJobOpening = async (req: AuthRequest, res: Response) => {
  try {
    const job = await JobOpening.create(req.body);
    return res.status(201).json({ success: true, data: job });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateJobOpening = async (req: AuthRequest, res: Response) => {
  try {
    if (rejectInvalidId(res, req.params.id, 'Job opening')) return;
    const job = await JobOpening.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job opening not found' });
    return res.json({ success: true, data: job });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteJobOpening = async (req: AuthRequest, res: Response) => {
  try {
    if (rejectInvalidId(res, req.params.id, 'Job opening')) return;
    const deleted = await JobOpening.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Job opening not found' });
    return res.json({ success: true, message: 'Deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const apps = await JobApplication.find().populate('jobOpening').sort({ createdAt: -1 });
    return res.json({ success: true, data: apps });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateJobApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (rejectInvalidId(res, id, 'Job application')) return;

    const { status } = req.body;
    const app = await JobApplication.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!app) return res.status(404).json({ success: false, message: 'Job application not found' });
    return res.json({ success: true, data: app });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Email Suite Controllers
export const getEmailSetup = async (req: Request, res: Response) => {
  try {
    let setup = await EmailSetup.findOne();
    if (!setup) {
      // Nothing configured yet — return an unconfigured shell so the form can
      // render its empty state. Do not invent credentials.
      setup = await EmailSetup.create({ isConfigured: false });
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
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveEmailSetup = async (req: AuthRequest, res: Response) => {
  try {
    let setup = await EmailSetup.findOne();
    if (!setup) setup = new EmailSetup();

    const { host, port, secure, user, pass, fromName, fromEmail } = req.body;
    if (host) setup.host = host;
    if (port) setup.port = Number(port);
    if (secure !== undefined) setup.secure = secure;
    if (user) setup.user = user;
    if (pass && pass !== '••••••••') setup.pass = pass;
    if (fromName) setup.fromName = fromName;
    if (fromEmail) setup.fromEmail = fromEmail;
    setup.isConfigured = true;

    await setup.save();
    return res.json({ success: true, message: 'Email configuration saved successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getEmailMappings = async (req: Request, res: Response) => {
  try {
    const mappings = await EmailMapping.find().sort({ eventKey: 1 });
    return res.json({ success: true, data: mappings });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateEmailMapping = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (rejectInvalidId(res, id, 'Email mapping')) return;

    const mapping = await EmailMapping.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!mapping) return res.status(404).json({ success: false, message: 'Email mapping not found' });
    return res.json({ success: true, data: mapping });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getEmailTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await EmailTemplate.find().sort({ name: 1 });
    return res.json({ success: true, data: templates });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveEmailTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { key, name, subject, htmlBody, variables } = req.body;
    let template = await EmailTemplate.findOne({ key });
    if (!template) {
      template = await EmailTemplate.create({ key, name, subject, htmlBody, variables });
    } else {
      template.name = name;
      template.subject = subject;
      template.htmlBody = htmlBody;
      if (variables) template.variables = variables;
      await template.save();
    }
    return res.json({ success: true, data: template });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    return res.json({ success: true, data: logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
