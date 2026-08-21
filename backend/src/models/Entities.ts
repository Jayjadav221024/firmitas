import mongoose, { Schema, Document } from 'mongoose';

// Testimonial Model
export interface ITestimonial extends Document {
  name: string;
  company: string;
  quote: string;
  rating: number;
  photo?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
export const Testimonial = mongoose.model<ITestimonial>(
  'Testimonial',
  new Schema<ITestimonial>(
    {
      name: { type: String, required: true },
      company: { type: String, required: true },
      quote: { type: String, required: true },
      rating: { type: Number, default: 5 },
      photo: { type: String, default: '' },
      isActive: { type: Boolean, default: true },
      displayOrder: { type: Number, default: 0 }
    },
    { timestamps: true }
  )
);

// FAQ Model
export interface IFaq extends Document {
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
}
export const Faq = mongoose.model<IFaq>(
  'Faq',
  new Schema<IFaq>(
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
      category: { type: String, default: 'General' },
      displayOrder: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
  )
);

// Blog Model
export interface IBlog extends Document {
  title: string;
  slug: string;
  coverImage?: string;
  body: string;
  author: string;
  tags: string[];
  publishDate?: Date;
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
}
export const Blog = mongoose.model<IBlog>(
  'Blog',
  new Schema<IBlog>(
    {
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      coverImage: { type: String, default: '' },
      body: { type: String, required: true },
      author: { type: String, default: 'Shreeraj Editorial Team' },
      tags: [{ type: String }],
      publishDate: { type: Date, default: Date.now },
      status: { type: String, enum: ['draft', 'published'], default: 'published' },
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' }
    },
    { timestamps: true }
  )
);

// Inquiry (RFQ) Model
export interface IInquiry extends Document {
  name: string;
  company: string;
  email: string;
  phone: string;
  products: string[];
  message: string;
  status: 'new' | 'in-progress' | 'closed';
  assignedAdmin?: string;
  notes?: string;
  createdAt: Date;
}
export const Inquiry = mongoose.model<IInquiry>(
  'Inquiry',
  new Schema<IInquiry>(
    {
      name: { type: String, required: true },
      company: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      products: [{ type: String }],
      message: { type: String, default: '' },
      status: { type: String, enum: ['new', 'in-progress', 'closed'], default: 'new' },
      assignedAdmin: { type: String, default: '' },
      notes: { type: String, default: '' }
    },
    { timestamps: true }
  )
);

// Job Opening & Application
export interface IJobOpening extends Document {
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  status: 'open' | 'closed';
}
export const JobOpening = mongoose.model<IJobOpening>(
  'JobOpening',
  new Schema<IJobOpening>(
    {
      title: { type: String, required: true },
      department: { type: String, required: true },
      location: { type: String, default: 'Ahmedabad, Gujarat' },
      description: { type: String, required: true },
      requirements: [{ type: String }],
      status: { type: String, enum: ['open', 'closed'], default: 'open' }
    },
    { timestamps: true }
  )
);

export interface IJobApplication extends Document {
  jobOpening?: mongoose.Types.ObjectId;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverNote?: string;
  status: 'new' | 'shortlisted' | 'rejected' | 'hired';
}
export const JobApplication = mongoose.model<IJobApplication>(
  'JobApplication',
  new Schema<IJobApplication>(
    {
      jobOpening: { type: Schema.Types.ObjectId, ref: 'JobOpening' },
      jobTitle: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      resumeUrl: { type: String, default: '' },
      coverNote: { type: String, default: '' },
      status: { type: String, enum: ['new', 'shortlisted', 'rejected', 'hired'], default: 'new' }
    },
    { timestamps: true }
  )
);

// Email Setup, For, Template
export interface IEmailSetup extends Document {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  isConfigured: boolean;
}
export const EmailSetup = mongoose.model<IEmailSetup>(
  'EmailSetup',
  new Schema<IEmailSetup>(
    {
      host: { type: String, default: 'smtp.gmail.com' },
      port: { type: Number, default: 587 },
      secure: { type: Boolean, default: false },
      user: { type: String, default: '' },
      pass: { type: String, default: '' },
      fromName: { type: String, default: 'Shreeraj Traders Admin' },
      fromEmail: { type: String, default: 'info@shreerajtraders.com' },
      isConfigured: { type: Boolean, default: false }
    },
    { timestamps: true }
  )
);

export interface IEmailMapping extends Document {
  eventKey: string;
  eventName: string;
  description: string;
  recipients: string[];
  templateKey: string;
  isActive: boolean;
}
export const EmailMapping = mongoose.model<IEmailMapping>(
  'EmailMapping',
  new Schema<IEmailMapping>(
    {
      eventKey: { type: String, required: true, unique: true },
      eventName: { type: String, required: true },
      description: { type: String, default: '' },
      recipients: [{ type: String }],
      templateKey: { type: String, default: '' },
      isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
  )
);

export interface IEmailTemplate extends Document {
  key: string;
  name: string;
  subject: string;
  htmlBody: string;
  variables: string[];
}
export const EmailTemplate = mongoose.model<IEmailTemplate>(
  'EmailTemplate',
  new Schema<IEmailTemplate>(
    {
      key: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      subject: { type: String, required: true },
      htmlBody: { type: String, required: true },
      variables: [{ type: String }]
    },
    { timestamps: true }
  )
);

// Audit Log Model
export interface IAuditLog extends Document {
  actor: string;
  actorEmail?: string;
  action: string;
  module: string;
  targetId?: string;
  targetName?: string;
  diff?: any;
  createdAt: Date;
}
export const AuditLog = mongoose.model<IAuditLog>(
  'AuditLog',
  new Schema<IAuditLog>(
    {
      actor: { type: String, required: true },
      actorEmail: { type: String, default: '' },
      action: { type: String, required: true },
      module: { type: String, required: true },
      targetId: { type: String, default: '' },
      targetName: { type: String, default: '' },
      diff: { type: Schema.Types.Mixed, default: null }
    },
    { timestamps: true }
  )
);
