export type ModuleType =
  | 'dashboard'
  | 'users'
  | 'roles'
  | 'email_setup'
  | 'email_for'
  | 'email_template'
  | 'website_editor'
  | 'products'
  | 'categories'
  | 'testimonials'
  | 'faqs'
  | 'blogs'
  | 'inquiries'
  | 'job_openings'
  | 'job_applications'
  | 'audit_logs';

export type ActionType = 'view' | 'create' | 'edit' | 'delete' | 'publish';

export interface PermissionMatrix {
  [module: string]: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    publish?: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roleId: string;
  roleName: string;
  roleKey: string;
  permissions: PermissionMatrix;
}

export interface Product {
  id: string;
  srNo?: number;
  image?: string;
  images?: string[];
  name: string;
  brandName: string;
  categoryKey: string;
  slug: string;
  status: 'active' | 'inactive';
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  key: string;
  parentCategory?: any;
  displayOrder: number;
  isActive: boolean;
}

export interface Role {
  _id?: string;
  id?: string;
  name: string;
  key: string;
  description: string;
  permissions: PermissionMatrix;
  isSystem: boolean;
}

export interface SectionFieldSchema {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'image' | 'number' | 'boolean' | 'link' | 'array';
  placeholder?: string;
  helperText?: string;
}

export interface WebsiteSection {
  id: string;
  pageKey: string;
  key: string;
  name: string;
  description: string;
  order: number;
  fields: SectionFieldSchema[];
  content: {
    id?: string;
    draftData: Record<string, any>;
    publishedData: Record<string, any>;
    isEdited: boolean;
    status: 'draft' | 'published';
    lastEditedBy?: string;
    lastEditedAt?: string;
  };
}

export interface Inquiry {
  id: string;
  _id?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  products: string[];
  message: string;
  status: 'new' | 'in-progress' | 'closed';
  assignedAdmin?: string;
  notes?: string;
  createdAt: string;
}

export interface JobOpening {
  _id?: string;
  id?: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements?: string[];
  status: 'open' | 'closed';
}

export interface JobApplication {
  _id?: string;
  id?: string;
  jobOpening?: any;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverNote?: string;
  status: 'new' | 'shortlisted' | 'rejected' | 'hired';
  createdAt: string;
}
