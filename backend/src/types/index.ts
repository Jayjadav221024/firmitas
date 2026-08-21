export type ActionType = 'view' | 'create' | 'edit' | 'delete' | 'publish';

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

export interface PermissionMatrix {
  [module: string]: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    publish?: boolean;
  };
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roleId: string;
  roleName: string;
  permissions: PermissionMatrix;
  isActive: boolean;
  createdAt: string;
}

export interface ProductDTO {
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
  updatedAt?: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  key: string;
  parentCategory?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface BrandDTO {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  isActive: boolean;
}

export interface SectionFieldSchema {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'image' | 'number' | 'boolean' | 'link' | 'array';
  placeholder?: string;
  helperText?: string;
  itemSchema?: SectionFieldSchema[];
}

export interface SectionSchema {
  id: string;
  pageKey: string;
  key: string;
  name: string;
  description: string;
  order: number;
  fields: SectionFieldSchema[];
  appliesTo?: string[];
}

export interface SectionContentDTO {
  id: string;
  sectionId: string;
  pageKey: string;
  sectionKey: string;
  draftData: Record<string, any>;
  publishedData: Record<string, any>;
  isEdited: boolean;
  lastEditedBy?: string;
  lastEditedAt?: string;
  status: 'draft' | 'published';
}

export interface InquiryDTO {
  id: string;
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

export interface JobOpeningDTO {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface JobApplicationDTO {
  id: string;
  jobOpeningId?: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverNote?: string;
  status: 'new' | 'shortlisted' | 'rejected' | 'hired';
  createdAt: string;
}
