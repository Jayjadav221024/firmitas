// Single source of persistent mock database for Firmitas Admin Console
import { productsData } from '../data/products';
import { faqsData } from '../data/faqs';
import { company } from '../data/company';

export const getAdminData = (key: string, defaultData: any = []) => {
  const existing = localStorage.getItem(`firmitas_admin_${key}`) || localStorage.getItem(`shreeraj_admin_${key}`);
  if (!existing) {
    localStorage.setItem(`firmitas_admin_${key}`, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(existing);
  } catch {
    return defaultData;
  }
};

export const setStorage = (key: string, data: any) => {
  localStorage.setItem(`firmitas_admin_${key}`, JSON.stringify(data));
};

export const clearAdminStorage = () => {
  const keys = ['products', 'categories', 'faqs', 'testimonials', 'blogs', 'inquiries', 'job-openings', 'job-applications', 'users', 'roles', 'website-sections'];
  keys.forEach(k => {
    localStorage.removeItem(`firmitas_admin_${k}`);
    localStorage.removeItem(`shreeraj_admin_${k}`);
  });
};

// Firmitas Real Products Catalog
export const initialProducts = productsData.map((p, idx) => ({
  id: p.id || `prod-${idx + 1}`,
  _id: p.id || `prod-${idx + 1}`,
  srNo: idx + 1,
  name: p.name,
  slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  brandName: 'Firmitas Healthcare',
  categoryKey: p.category,
  categoryName: p.category === 'ethical' ? 'Ethical & Generics' : p.category === 'surgical' ? 'Surgical & Hospital Supplies' : p.category === 'otc' ? 'OTC Products' : 'Critical Care',
  composition: p.composition || '',
  form: p.form || 'Tablet',
  rxType: p.rxType || 'Rx',
  packaging: p.packaging || 'Standard Packaging',
  storage: p.storage || 'Store in cool and dry place',
  therapeuticUse: p.use || '',
  dosage: 'As directed by physician',
  shortDescription: p.use || p.composition || '',
  description: `${p.name} (${p.composition || ''}) supplied by Firmitas 1 Pharma Solutions. ${p.use || ''} Standard packaging: ${p.packaging}.`,
  metaTitle: `${p.name} Supplier & Distributor - Firmitas 1`,
  metaDescription: `Wholesale supplier and bulk distributor of ${p.name} (${p.composition || ''}) with guaranteed batch compliance and cold-chain integrity.`,
  keywords: `${p.name}, ${p.category}, Firmitas pharma, bulk medicine supplier`,
  images: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80'
  ],
  pdfBrochure: '',
  coaAvailable: true,
  status: 'active',
  createdAt: new Date().toISOString()
}));

// Firmitas 4 Divisions / Categories
export const initialCategories = [
  {
    id: 'ethical',
    _id: 'ethical',
    key: 'ethical',
    name: 'Ethical & Generics',
    slug: 'ethical-generics',
    displayOrder: 1,
    tagline: 'Prescription formulations and bioequivalent generics across major therapeutic segments.',
    shortDescription: 'Supplying hospitals, retail chains and institutional pharmacies with certified prescription drugs.',
    metaTitle: 'Ethical & Generic Pharmaceuticals Distributor - Firmitas 1',
    metaDescription: 'Bulk distributor of high quality ethical and generic medicines with full CoA and regulatory compliance.',
    isActive: true,
    productCount: productsData.filter(p => p.category === 'ethical').length
  },
  {
    id: 'surgical',
    _id: 'surgical',
    key: 'surgical',
    name: 'Surgical & Hospital Supplies',
    slug: 'surgical-hospital-supplies',
    displayOrder: 2,
    tagline: 'Disposables, surgical consumables, PPE and hospital ward equipment.',
    shortDescription: 'Sterile disposables, wound care, cannulas, gloves and essential clinical consumables.',
    metaTitle: 'Surgical & Hospital Consumables Supplier - Firmitas 1',
    metaDescription: 'Complete surgical disposables and hospital equipment supplier for clinics, nursing homes and hospitals.',
    isActive: true,
    productCount: productsData.filter(p => p.category === 'surgical').length
  },
  {
    id: 'otc',
    _id: 'otc',
    key: 'otc',
    name: 'OTC Products',
    slug: 'otc-products',
    displayOrder: 3,
    tagline: 'Over-the-counter lines, vitamins, wellness supplements and digestive care.',
    shortDescription: 'High-demand consumer healthcare formulations and retail pharmacy shelf lines.',
    metaTitle: 'OTC & Wellness Health Products Distributor - Firmitas 1',
    metaDescription: 'Wholesale distributor of OTC products, vitamins, rehydration salts, and daily wellness items.',
    isActive: true,
    productCount: productsData.filter(p => p.category === 'otc').length
  },
  {
    id: 'critical',
    _id: 'critical',
    key: 'critical',
    name: 'Critical Care',
    slug: 'critical-care',
    displayOrder: 4,
    tagline: 'Emergency, ICU injectables, IV infusions, and temperature-controlled biologicals.',
    shortDescription: 'Specialty critical care and life-saving formulations managed under active 2°C–8°C cold chain.',
    metaTitle: 'Critical Care & ICU Injectables Supplier - Firmitas 1',
    metaDescription: 'Reliable cold-chain critical care pharmaceuticals for emergency wards and intensive care units.',
    isActive: true,
    productCount: productsData.filter(p => p.category === 'critical').length
  }
];

// Firmitas FAQs
export const initialFaqs = faqsData.map((f, i) => ({
  id: `faq-${i + 1}`,
  _id: `faq-${i + 1}`,
  question: f.q,
  answer: f.a,
  category: i < 3 ? 'Licensing & Orders' : i < 6 ? 'Delivery & Logistics' : 'Quality & Compliance',
  displayOrder: i + 1,
  isActive: true
}));

// Testimonials
export const initialTestimonials = [
  {
    id: 'test-1',
    _id: 'test-1',
    name: 'Dr. Rajesh Patel',
    designation: 'Chief of Pharmacy',
    company: 'Apex Multi-Speciality Hospital',
    location: 'Ahmedabad, Gujarat',
    quote: 'Firmitas 1 has been our primary pharmaceutical distributor for over 3 years. Their cold-chain integrity and timely delivery for critical care injectables are unmatched.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'test-2',
    _id: 'test-2',
    name: 'Mehul Shah',
    designation: 'Procurement Director',
    company: 'Sanjivani Healthcare Network',
    location: 'Surat, Gujarat',
    quote: 'Complete batch documentation, valid CoAs with every dispatch, and zero stockout issues for essential surgical disposables and generic lines.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'test-3',
    _id: 'test-3',
    name: 'Vikram Joshi',
    designation: 'Retail Pharmacy Chain Head',
    company: 'MediCare Chemist Group',
    location: 'Vadodara, Gujarat',
    quote: 'Competitive wholesale pricing and very responsive quotation turnaround. When we send an RFQ, we receive pricing confirmation within hours.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isActive: true
  }
];

// Blogs
export const initialBlogs = [
  {
    id: 'blog-1',
    _id: 'blog-1',
    title: 'Good Distribution Practice (GDP) in Modern Pharmaceutical Supply Chains',
    slug: 'gdp-in-modern-pharmaceutical-supply-chains',
    summary: 'How strict adherence to GDP protocols ensures product efficacy and patient safety from warehouse to clinical administration.',
    content: 'Pharmaceutical logistics requires continuous monitoring of environmental factors including temperature, humidity, and physical handling. GDP ensures that products consistently meet defined quality standards...',
    author: 'Firmitas Quality Assurance Team',
    category: 'Supply Chain & Quality',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'blog-2',
    _id: 'blog-2',
    title: 'Cold Chain Logistics: Protecting Temperature-Sensitive Critical Care Formulations',
    slug: 'cold-chain-logistics-critical-care-formulations',
    summary: 'A deep dive into active and passive temperature control methods for biologicals, emergency injectables, and vaccines.',
    content: 'Maintaining an unbroken 2°C to 8°C cold chain is essential for preserving the biological potency of critical care drugs. From thermal insulated shippers to digital data loggers...',
    author: 'Firmitas Logistics Cell',
    category: 'Cold Chain Protocols',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

// Inquiries / RFQs
export const initialInquiries = [
  {
    id: 'inq-1',
    _id: 'inq-1',
    srNo: 1,
    name: 'Dr. Sameer Sen',
    email: 'procurement@cityhospital.org',
    phone: '+91 98980 11223',
    organization: 'City Life Hospital',
    city: 'Ahmedabad',
    drugLicenceNo: 'GJ/AHM/20B-11204',
    category: 'Critical Care & Surgical',
    requirement: 'Bulk quotation requested for Meropenem 1g Injections (500 vials) and Disposable 5ml Syringes (20,000 units).',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

// Job Openings
export const initialJobOpenings = [
  {
    id: 'job-1',
    _id: 'job-1',
    title: 'Institutional Sales Executive - Hospital Supplies',
    department: 'Sales & Business Development',
    location: 'Ahmedabad, Gujarat',
    type: 'Full-time',
    experience: '2-4 Years in Pharma Distribution',
    description: 'Responsible for building relationships with hospitals, nursing homes and chemist networks across Gujarat.',
    requirements: ['B.Pharm / B.Sc / MBA with pharma sales background', 'Strong network with regional healthcare institutions', 'Excellent negotiation and CRM skills'],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'job-2',
    _id: 'job-2',
    title: 'Quality Assurance & Regulatory Officer',
    department: 'Compliance & Warehouse',
    location: 'Gujarat, India',
    type: 'Full-time',
    experience: '3+ Years',
    description: 'Manage batch documentation, Certificate of Analysis (CoA) verification, and Good Distribution Practice compliance.',
    requirements: ['M.Pharm / B.Pharm with QA background', 'Deep knowledge of Indian Drugs & Cosmetics Act', 'Experience in cold-chain audit management'],
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

export const initialJobApplications = [];

// Admin Users & Roles
export const initialRoles = [
  {
    id: 'role_superadmin',
    _id: 'role_superadmin',
    key: 'super_admin',
    name: 'Super Admin',
    description: 'Unrestricted access to all Firmitas admin, catalog, and visual CMS controls',
    isSystem: true,
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: true, publish: true },
      products: { view: true, create: true, edit: true, delete: true, publish: true },
      categories: { view: true, create: true, edit: true, delete: true, publish: true },
      website_editor: { view: true, create: true, edit: true, delete: true, publish: true },
      users: { view: true, create: true, edit: true, delete: true, publish: true },
      roles: { view: true, create: true, edit: true, delete: true, publish: true },
      email_setup: { view: true, create: true, edit: true, delete: true, publish: true },
      email_for: { view: true, create: true, edit: true, delete: true, publish: true },
      email_template: { view: true, create: true, edit: true, delete: true, publish: true },
      inquiries: { view: true, create: true, edit: true, delete: true, publish: true },
      job_openings: { view: true, create: true, edit: true, delete: true, publish: true },
      job_applications: { view: true, create: true, edit: true, delete: true, publish: true },
      testimonials: { view: true, create: true, edit: true, delete: true, publish: true },
      faqs: { view: true, create: true, edit: true, delete: true, publish: true },
      blogs: { view: true, create: true, edit: true, delete: true, publish: true }
    }
  },
  {
    id: 'role_editor',
    _id: 'role_editor',
    key: 'editor',
    name: 'Editor',
    description: 'Can manage catalog products, inquiries, and website CMS sections',
    isSystem: false,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, publish: false },
      products: { view: true, create: true, edit: true, delete: false, publish: true },
      categories: { view: true, create: true, edit: true, delete: false, publish: true },
      website_editor: { view: true, create: true, edit: true, delete: false, publish: true },
      inquiries: { view: true, create: false, edit: true, delete: false, publish: false },
      job_openings: { view: true, create: true, edit: true, delete: false, publish: true },
      job_applications: { view: true, create: false, edit: true, delete: false, publish: false },
      testimonials: { view: true, create: true, edit: true, delete: false, publish: true },
      faqs: { view: true, create: true, edit: true, delete: false, publish: true },
      blogs: { view: true, create: true, edit: true, delete: false, publish: true }
    }
  }
];

export const initialUsers = [
  {
    id: 'usr_superadmin',
    _id: 'usr_superadmin',
    name: 'Super Admin',
    email: 'admin@firmitas.com',
    roleId: 'role_superadmin',
    roleKey: 'super_admin',
    roleName: 'Super Admin',
    isActive: true,
    avatar: '',
    createdAt: new Date().toISOString()
  }
];

// Complete Firmitas Website Sections CMS for all Tabs
export const initialWebsiteSections: Record<string, any[]> = {
  'site-wide': [
    {
      id: 'sec-sw-1',
      pageKey: 'site-wide',
      key: 'top-nav-bar',
      name: 'Top Navigation & Branding',
      description: 'Brand name, tagline, hotline, and primary navigation CTA.',
      order: 1,
      fields: [
        { key: 'brandTitle', label: 'Brand Name', type: 'text' },
        { key: 'tagline', label: 'Company Tagline', type: 'text' },
        { key: 'ctaButtonText', label: 'Header CTA Button', type: 'text' },
        { key: 'primaryPhone', label: 'Phone Number', type: 'text' },
        { key: 'primaryEmail', label: 'Contact Email', type: 'text' }
      ],
      content: {
        draftData: {
          brandTitle: 'Firmitas 1',
          tagline: 'Global Reach. Trusted Care.',
          ctaButtonText: 'Request a Quote',
          primaryPhone: company.phone || '+91 82002 28607',
          primaryEmail: company.email || 'sales@firmitas1.com'
        },
        publishedData: {
          brandTitle: 'Firmitas 1',
          tagline: 'Global Reach. Trusted Care.',
          ctaButtonText: 'Request a Quote',
          primaryPhone: company.phone || '+91 82002 28607',
          primaryEmail: company.email || 'sales@firmitas1.com'
        },
        isEdited: false,
        status: 'published',
        lastEditedBy: 'Super Admin',
        lastEditedAt: new Date().toISOString()
      }
    },
    {
      id: 'sec-sw-2',
      pageKey: 'site-wide',
      key: 'company-contact-details',
      name: 'Company Contact & Office Details',
      description: 'Corporate address, operating hours, phone numbers and sales email.',
      order: 2,
      fields: [
        { key: 'legalName', label: 'Legal Company Name', type: 'text' },
        { key: 'officeAddress', label: 'Office Address', type: 'textarea' },
        { key: 'workingHours', label: 'Working Hours', type: 'text' },
        { key: 'whatsappNumber', label: 'WhatsApp Number', type: 'text' }
      ],
      content: {
        draftData: {
          legalName: company.legalName || 'Firmitas 1 Pharma Solutions',
          officeAddress: company.addressLines.join(' '),
          workingHours: company.hours || 'Monday to Saturday, 09:00 – 18:00 IST',
          whatsappNumber: company.whatsapp || '918200228607'
        },
        publishedData: {
          legalName: company.legalName || 'Firmitas 1 Pharma Solutions',
          officeAddress: company.addressLines.join(' '),
          workingHours: company.hours || 'Monday to Saturday, 09:00 – 18:00 IST',
          whatsappNumber: company.whatsapp || '918200228607'
        },
        isEdited: false,
        status: 'published',
        lastEditedBy: 'Super Admin',
        lastEditedAt: new Date().toISOString()
      }
    },
    {
      id: 'sec-sw-3',
      pageKey: 'site-wide',
      key: 'footer-content',
      name: 'Footer & Compliance Disclaimer',
      description: 'Footer copyright, regulatory disclaimer, and compliance badges.',
      order: 3,
      fields: [
        { key: 'copyrightText', label: 'Copyright Notice', type: 'text' },
        { key: 'disclaimerText', label: 'Wholesale / B2B Disclaimer', type: 'textarea' }
      ],
      content: {
        draftData: {
          copyrightText: `© ${new Date().getFullYear()} Firmitas 1 Pharma Solutions. All Rights Reserved.`,
          disclaimerText: 'Firmitas 1 is a B2B pharmaceutical and healthcare distributor. All prescription medicines and surgical supplies are provided exclusively against valid drug licenses and institutional credentials.'
        },
        publishedData: {
          copyrightText: `© ${new Date().getFullYear()} Firmitas 1 Pharma Solutions. All Rights Reserved.`,
          disclaimerText: 'Firmitas 1 is a B2B pharmaceutical and healthcare distributor. All prescription medicines and surgical supplies are provided exclusively against valid drug licenses and institutional credentials.'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ],

  'home': [
    {
      id: 'sec-hm-1',
      pageKey: 'home',
      key: 'hero-banner',
      name: 'Hero Banner & Core Promise',
      description: 'Primary headline, subtitle, institutional badge and CTA buttons on the Home page.',
      order: 1,
      fields: [
        { key: 'badgeText', label: 'Top Pill / Badge', type: 'text' },
        { key: 'mainHeadline', label: 'Main Headline', type: 'text' },
        { key: 'subHeadline', label: 'Sub-headline / Paragraph', type: 'textarea' },
        { key: 'primaryCta', label: 'Primary Button Label', type: 'text' },
        { key: 'secondaryCta', label: 'Secondary Button Label', type: 'text' }
      ],
      content: {
        draftData: {
          badgeText: 'Institutional Healthcare & Pharmaceutical Supply',
          mainHeadline: 'Global Reach. Trusted Care. Reliable Healthcare Supply.',
          subHeadline: 'Supplying hospitals, clinics, and pharmacy networks with certified ethical drugs, surgical consumables, OTC lines, and critical care essentials with zero supply-chain disruptions.',
          primaryCta: 'Request a Quotation',
          secondaryCta: 'Explore Products'
        },
        publishedData: {
          badgeText: 'Institutional Healthcare & Pharmaceutical Supply',
          mainHeadline: 'Global Reach. Trusted Care. Reliable Healthcare Supply.',
          subHeadline: 'Supplying hospitals, clinics, and pharmacy networks with certified ethical drugs, surgical consumables, OTC lines, and critical care essentials with zero supply-chain disruptions.',
          primaryCta: 'Request a Quotation',
          secondaryCta: 'Explore Products'
        },
        isEdited: false,
        status: 'published'
      }
    },
    {
      id: 'sec-hm-2',
      pageKey: 'home',
      key: 'four-divisions',
      name: '4 Supply Divisions Highlight',
      description: 'Headings and introductory summary for the 4 core supply verticals.',
      order: 2,
      fields: [
        { key: 'sectionHeading', label: 'Section Title', type: 'text' },
        { key: 'sectionSubtitle', label: 'Section Subtitle', type: 'textarea' }
      ],
      content: {
        draftData: {
          sectionHeading: 'Complete Supply Coverage Across 4 Core Verticals',
          sectionSubtitle: 'Everything your hospital, clinic, or pharmacy requires — sourced directly from accredited WHO-GMP manufacturers.'
        },
        publishedData: {
          sectionHeading: 'Complete Supply Coverage Across 4 Core Verticals',
          sectionSubtitle: 'Everything your hospital, clinic, or pharmacy requires — sourced directly from accredited WHO-GMP manufacturers.'
        },
        isEdited: false,
        status: 'published'
      }
    },
    {
      id: 'sec-hm-3',
      pageKey: 'home',
      key: 'why-choose-preview',
      name: 'Why Choose Us Preview',
      description: 'Highlighting batch traceability, cold chain integrity, and rapid delivery.',
      order: 3,
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'summary', label: 'Summary Paragraph', type: 'textarea' }
      ],
      content: {
        draftData: {
          title: 'Built on Rigorous Compliance & Verified Sourcing',
          summary: 'From validated cold-chain storage (2°C–8°C) to complete batch documentation with Certificate of Analysis (CoA), we protect patient safety at every step.'
        },
        publishedData: {
          title: 'Built on Rigorous Compliance & Verified Sourcing',
          summary: 'From validated cold-chain storage (2°C–8°C) to complete batch documentation with Certificate of Analysis (CoA), we protect patient safety at every step.'
        },
        isEdited: false,
        status: 'published'
      }
    },
    {
      id: 'sec-hm-4',
      pageKey: 'home',
      key: 'cta-banner',
      name: 'Bottom Call-to-Action Strip',
      description: 'Bottom conversion banner leading to Enquiry / RFQ.',
      order: 4,
      fields: [
        { key: 'headline', label: 'Banner Headline', type: 'text' },
        { key: 'buttonText', label: 'Button Label', type: 'text' },
        { key: 'supportNotice', label: 'Support Notice / SLA', type: 'text' }
      ],
      content: {
        draftData: {
          headline: 'Ready to Streamline Your Pharmaceutical Supply?',
          buttonText: 'Submit an RFQ Now',
          supportNotice: 'Quotations generated within 2-4 business hours for institutional buyers.'
        },
        publishedData: {
          headline: 'Ready to Streamline Your Pharmaceutical Supply?',
          buttonText: 'Submit an RFQ Now',
          supportNotice: 'Quotations generated within 2-4 business hours for institutional buyers.'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ],

  'about': [
    {
      id: 'sec-ab-1',
      pageKey: 'about',
      key: 'about-hero',
      name: 'About Page Header & Mission',
      description: 'Main heading, company overview, and core mission statement.',
      order: 1,
      fields: [
        { key: 'pageTitle', label: 'Page Title', type: 'text' },
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'missionStatement', label: 'Mission Statement', type: 'textarea' }
      ],
      content: {
        draftData: {
          pageTitle: 'About Firmitas 1',
          tagline: 'Bridging Healthcare Demand with Certified Quality',
          missionStatement: 'To deliver uncompromising quality in pharmaceutical and healthcare distribution by combining strict regulatory compliance, transparent batch tracking, and reliable logistics across India and global markets.'
        },
        publishedData: {
          pageTitle: 'About Firmitas 1',
          tagline: 'Bridging Healthcare Demand with Certified Quality',
          missionStatement: 'To deliver uncompromising quality in pharmaceutical and healthcare distribution by combining strict regulatory compliance, transparent batch tracking, and reliable logistics across India and global markets.'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ],

  'categories': [
    {
      id: 'sec-cat-1',
      pageKey: 'categories',
      key: 'categories-header',
      name: 'Categories Page Header',
      description: 'Header text and introduction for the 4 supply divisions.',
      order: 1,
      fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' }
      ],
      content: {
        draftData: {
          title: 'Supply Categories & Therapeutic Divisions',
          description: 'Comprehensive pharmaceutical and surgical product lines available for wholesale institutional distribution.'
        },
        publishedData: {
          title: 'Supply Categories & Therapeutic Divisions',
          description: 'Comprehensive pharmaceutical and surgical product lines available for wholesale institutional distribution.'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ],

  'products': [
    {
      id: 'sec-pr-1',
      pageKey: 'products',
      key: 'products-header',
      name: 'Product Catalog Header & Disclaimer',
      description: 'Title, filter instructions, and B2B quotation notice on the Products page.',
      order: 1,
      fields: [
        { key: 'title', label: 'Catalog Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'licensingNotice', label: 'Licensing Disclaimer Notice', type: 'textarea' }
      ],
      content: {
        draftData: {
          title: 'Institutional Pharmaceutical & Supply Catalog',
          subtitle: 'Search across 40+ molecules, formulations, surgical consumables, and critical care injectables.',
          licensingNotice: 'Notice: This catalog is published for licensed healthcare institutions, hospitals, and pharmacies. Prices and batch lots are quoted upon official RFQ verification.'
        },
        publishedData: {
          title: 'Institutional Pharmaceutical & Supply Catalog',
          subtitle: 'Search across 40+ molecules, formulations, surgical consumables, and critical care injectables.',
          licensingNotice: 'Notice: This catalog is published for licensed healthcare institutions, hospitals, and pharmacies. Prices and batch lots are quoted upon official RFQ verification.'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ],

  'why-choose-us': [
    {
      id: 'sec-wcu-1',
      pageKey: 'why-choose-us',
      key: 'wcu-header',
      name: 'Why Choose Us Overview',
      description: 'Main heading, quality commitments, and operational advantages.',
      order: 1,
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'commitmentText', label: 'Quality Commitment Statement', type: 'textarea' }
      ],
      content: {
        draftData: {
          title: 'Why Healthcare Providers Choose Firmitas 1',
          subtitle: 'Reliable Supply Chains. Complete Batch Authenticity. Dedicated Support.',
          commitmentText: 'We understand that in healthcare, reliability is not just a business metric — it is a patient outcome. Every batch we dispatch is vetted for compliance, temperature control, and manufacturer authentication.'
        },
        publishedData: {
          title: 'Why Healthcare Providers Choose Firmitas 1',
          subtitle: 'Reliable Supply Chains. Complete Batch Authenticity. Dedicated Support.',
          commitmentText: 'We understand that in healthcare, reliability is not just a business metric — it is a patient outcome. Every batch we dispatch is vetted for compliance, temperature control, and manufacturer authentication.'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ],

  'compliance': [
    {
      id: 'sec-cmp-1',
      pageKey: 'compliance',
      key: 'compliance-header',
      name: 'Compliance & Quality Standards',
      description: 'Regulatory compliance details, GDP certification, and CoA verification.',
      order: 1,
      fields: [
        { key: 'title', label: 'Page Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'gdpSummary', label: 'GDP Policy Summary', type: 'textarea' }
      ],
      content: {
        draftData: {
          title: 'Regulatory Compliance & Quality Assurance',
          subtitle: 'Adhering strictly to Indian CDSCO guidelines and WHO Good Distribution Practices.',
          gdpSummary: 'All pharmaceutical stock is stored in temperature-regulated facilities with continuous data logging, strict pest control, and batch-wise quarantine protocols.'
        },
        publishedData: {
          title: 'Regulatory Compliance & Quality Assurance',
          subtitle: 'Adhering strictly to Indian CDSCO guidelines and WHO Good Distribution Practices.',
          gdpSummary: 'All pharmaceutical stock is stored in temperature-regulated facilities with continuous data logging, strict pest control, and batch-wise quarantine protocols.'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ],

  'contact': [
    {
      id: 'sec-cnt-1',
      pageKey: 'contact',
      key: 'contact-header',
      name: 'Contact Page Information',
      description: 'Contact headings, SLA notice, and direct inquiry channels.',
      order: 1,
      fields: [
        { key: 'title', label: 'Contact Header Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'slaNotice', label: 'Response Time Notice', type: 'text' }
      ],
      content: {
        draftData: {
          title: 'Get in Touch with Our Procurement Team',
          subtitle: 'We are here to assist with hospital rate contracts, bulk procurement, and supply inquiries.',
          slaNotice: 'Standard RFQs and catalog inquiries are responded to within 2 to 4 business hours.'
        },
        publishedData: {
          title: 'Get in Touch with Our Procurement Team',
          subtitle: 'We are here to assist with hospital rate contracts, bulk procurement, and supply inquiries.',
          slaNotice: 'Standard RFQs and catalog inquiries are responded to within 2 to 4 business hours.'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ],

  'enquiry': [
    {
      id: 'sec-enq-1',
      pageKey: 'enquiry',
      key: 'enquiry-header',
      name: 'Enquiry & RFQ Form Header',
      description: 'Instructions, minimum order policies, and required document guidelines.',
      order: 1,
      fields: [
        { key: 'title', label: 'Form Title', type: 'text' },
        { key: 'subtitle', label: 'Form Subtitle', type: 'text' },
        { key: 'instructions', label: 'Submission Instructions', type: 'textarea' }
      ],
      content: {
        draftData: {
          title: 'Request a Quotation (RFQ)',
          subtitle: 'Submit your required molecules, quantities, and delivery timeline.',
          instructions: 'Please provide valid institution details and drug license numbers where applicable. Our procurement specialists will return a detailed quotation with batch availability.'
        },
        publishedData: {
          title: 'Request a Quotation (RFQ)',
          subtitle: 'Submit your required molecules, quantities, and delivery timeline.',
          instructions: 'Please provide valid institution details and drug license numbers where applicable. Our procurement specialists will return a detailed quotation with batch availability.'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ],

  'seo': [
    {
      id: 'sec-seo-1',
      pageKey: 'seo',
      key: 'meta-tags',
      name: 'Global Site SEO & OpenGraph',
      description: 'Default Meta title, description, and keywords for search engine indexing.',
      order: 1,
      fields: [
        { key: 'siteTitle', label: 'Default Site Title', type: 'text' },
        { key: 'metaDescription', label: 'Default Meta Description', type: 'textarea' },
        { key: 'keywords', label: 'Keywords (Comma separated)', type: 'text' }
      ],
      content: {
        draftData: {
          siteTitle: 'Firmitas 1 — Pharmaceutical & Healthcare Supplies Distributor',
          metaDescription: 'Trusted wholesale distributor of ethical & generic medicines, surgical supplies, OTC products, and critical care injectables with guaranteed cold-chain compliance.',
          keywords: 'Firmitas, pharmaceutical distributor, hospital supplies India, wholesale medicines, generic drugs distributor, critical care supplier'
        },
        publishedData: {
          siteTitle: 'Firmitas 1 — Pharmaceutical & Healthcare Supplies Distributor',
          metaDescription: 'Trusted wholesale distributor of ethical & generic medicines, surgical supplies, OTC products, and critical care injectables with guaranteed cold-chain compliance.',
          keywords: 'Firmitas, pharmaceutical distributor, hospital supplies India, wholesale medicines, generic drugs distributor, critical care supplier'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ]
};
