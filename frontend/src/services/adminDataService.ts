import { productsData, categories } from '../data/products';
import { faqs } from '../data/faqs';

// Storage helper with fallback
const initStorage = (key: string, defaultData: any) => {
  const existing = localStorage.getItem(`shreeraj_admin_${key}`);
  if (!existing) {
    localStorage.setItem(`shreeraj_admin_${key}`, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(existing);
  } catch {
    return defaultData;
  }
};

export const setStorage = (key: string, data: any) => {
  localStorage.setItem(`shreeraj_admin_${key}`, JSON.stringify(data));
};

export const getStorage = (key: string) => {
  const existing = localStorage.getItem(`shreeraj_admin_${key}`);
  return existing ? JSON.parse(existing) : null;
};

// Shreeraj Traders Products Catalog
export const initialProducts = [
  {
    id: 'prod-1',
    srNo: 1,
    name: 'Low Voltage Control Product',
    brandName: 'Siemens',
    categoryKey: 'switchgears',
    slug: 'low-voltage-control-product',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200',
    description: 'Siemens Sirius Low Voltage industrial control components for power distribution and machinery safety.',
    metaTitle: 'Siemens Low Voltage Control Product - Shreeraj Traders',
    metaDescription: 'Authorized Siemens Low Voltage Control distributor in Ahmedabad.'
  },
  {
    id: 'prod-2',
    srNo: 2,
    name: 'MCB',
    brandName: 'Siemens',
    categoryKey: 'switchgears',
    slug: 'mcb',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200',
    description: 'High reliability miniature circuit breaker with instant trip mechanism and thermal protection.',
    metaTitle: 'Siemens MCB Switches - Shreeraj Traders',
    metaDescription: 'Top grade Siemens MCB miniature circuit breakers.'
  },
  {
    id: 'prod-3',
    srNo: 3,
    name: 'Sinnova',
    brandName: 'Siemens',
    categoryKey: 'switchgears',
    slug: 'sinnova',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200',
    description: 'Siemens Sinnova range offering premium modular switchgear and electrical protection.',
    metaTitle: 'Siemens Sinnova Switchgear - Shreeraj Traders',
    metaDescription: 'Sinnova modular electrical switchgear.'
  },
  {
    id: 'prod-4',
    srNo: 4,
    name: 'Siemens Motor',
    brandName: 'Siemens',
    categoryKey: 'motors',
    slug: 'siemens-motor',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=200',
    description: 'Energy efficient 3-phase AC induction motors for severe duty industrial applications.',
    metaTitle: 'Siemens Electric Motors - Shreeraj Traders',
    metaDescription: 'IE2, IE3, and IE4 high efficiency Siemens motors.'
  },
  {
    id: 'prod-5',
    srNo: 5,
    name: 'Hindustan Electric Motor',
    brandName: 'Hindustan Electric',
    categoryKey: 'motors',
    slug: 'hindustan-electric-motor',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=200',
    description: 'Heavy duty Hindustan Electric motors engineered for Indian industrial conditions.',
    metaTitle: 'Hindustan Electric Motors Supplier - Shreeraj Traders',
    metaDescription: 'Durable Hindustan Electric 3-phase induction motors.'
  },
  {
    id: 'prod-6',
    srNo: 6,
    name: 'Checkered Plate',
    brandName: 'Shree Raj Traders',
    categoryKey: 'frp-gratings',
    slug: 'cheker-plate',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200',
    description: 'High-strength anti-skid FRP checkered plate for walkway flooring and chemical environments.',
    metaTitle: 'FRP Checkered Plate - Shreeraj Traders',
    metaDescription: 'Corrosion-resistant FRP checkered plate.'
  },
  {
    id: 'prod-7',
    srNo: 7,
    name: 'Ladder Type Cable Tray',
    brandName: 'Shree Raj Traders',
    categoryKey: 'frp-cable-trays',
    slug: 'ladder-type-cable-tray',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=200',
    description: 'FRP Ladder type cable management trays engineered for heavy cable loading and aggressive atmospheres.',
    metaTitle: 'Ladder Type FRP Cable Tray - Shreeraj Traders',
    metaDescription: 'Heavy-duty fiberglass ladder cable trays.'
  },
  {
    id: 'prod-8',
    srNo: 8,
    name: 'Crompton Greaves Motor',
    brandName: 'CGL (Crompton Greaves)',
    categoryKey: 'motors',
    slug: 'crompton-greaves-motor',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200',
    description: 'Crompton Greaves energy efficient motors for pumps, blowers, and manufacturing plants.',
    metaTitle: 'Crompton Greaves Motor - Shreeraj Traders',
    metaDescription: 'CGL high efficiency motors distributor.'
  },
  {
    id: 'prod-9',
    srNo: 9,
    name: 'Grit Top',
    brandName: 'Shree Raj Traders',
    categoryKey: 'frp-gratings',
    slug: 'grit-top',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200',
    description: 'Molded FRP grating with quartz grit anti-slip surface for offshore and oil & gas facilities.',
    metaTitle: 'FRP Grit Top Grating - Shreeraj Traders',
    metaDescription: 'Grit top non-slip composite grating.'
  },
  {
    id: 'prod-10',
    srNo: 10,
    name: 'Perforated Cable Tray',
    brandName: 'Shree Raj Traders',
    categoryKey: 'frp-cable-trays',
    slug: 'perforated-cable-tray',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=200',
    description: 'Fiberglass reinforced polymer perforated trays for power and telecommunication cabling.',
    metaTitle: 'Perforated FRP Cable Tray - Shreeraj Traders',
    metaDescription: 'Corrosion proof perforated cable trays.'
  },
  {
    id: 'prod-11',
    srNo: 11,
    name: 'Meniscus Top',
    brandName: 'Shree Raj Traders',
    categoryKey: 'frp-gratings',
    slug: 'meniscus-top',
    status: 'active' as 'active' | 'inactive',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200',
    description: 'Standard concave meniscus surface molded grating for industrial drainage and platform walkways.',
    metaTitle: 'Meniscus Top FRP Grating - Shreeraj Traders',
    metaDescription: 'Meniscus top FRP grating.'
  }
];

// Shreeraj Traders Categories
export const initialCategories = [
  { id: 'switchgears', _id: 'switchgears', name: 'Switchgears', key: 'switchgears', displayOrder: 1, isActive: true },
  { id: 'motors', _id: 'motors', name: 'Motors', key: 'motors', displayOrder: 2, isActive: true },
  { id: 'frp-gratings', _id: 'frp-gratings', name: 'FRP Gratings', key: 'frp-gratings', displayOrder: 3, isActive: true },
  { id: 'frp-cable-trays', _id: 'frp-cable-trays', name: 'FRP Cable Trays', key: 'frp-cable-trays', displayOrder: 4, isActive: true }
];

export const initialTestimonials = [
  {
    id: 'test-1',
    _id: 'test-1',
    name: 'Rajesh Patel',
    company: 'Gujarat Heavy Chemicals Ltd.',
    quote: 'Shree Raj Traders has been our exclusive Siemens switchgear & motor vendor for over 15 years. Instant delivery and authentic material.',
    rating: 5,
    isActive: true,
    displayOrder: 1
  },
  {
    id: 'test-2',
    _id: 'test-2',
    name: 'Amit Shah',
    company: 'Torrent Power Contractor Consortium',
    quote: 'High quality FRP cable trays with zero defect rate. Passed all third-party flammability & load tests easily.',
    rating: 5,
    isActive: true,
    displayOrder: 2
  }
];

export const initialFaqs = [
  {
    id: 'faq-1',
    _id: 'faq-1',
    question: 'Are all Siemens switchgears supplied with original test certificates?',
    answer: 'Yes, every Siemens switchgear and motor is 100% factory original and comes with manufacturer warranty and test certificates.',
    category: 'Switchgears',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'faq-2',
    _id: 'faq-2',
    question: 'What is the lead time for standard FRP cable trays & gratings?',
    answer: 'Standard sizes are maintained in Ahmedabad warehouse ready for immediate 24-hour dispatch.',
    category: 'FRP Products',
    displayOrder: 2,
    isActive: true
  }
];

export const initialBlogs = [
  {
    id: 'blog-1',
    _id: 'blog-1',
    title: 'Selecting High-Efficiency IE3 vs IE4 Motors for Industrial Pumps and Compressors',
    slug: 'selecting-ie3-vs-ie4-motors-guide',
    body: 'Complete technical breakdown of energy savings, torque characteristics and lifecycle ROI when upgrading to IE4 Siemens/CGL motors.',
    author: 'Shreeraj Engineering Team',
    status: 'published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'blog-2',
    _id: 'blog-2',
    title: 'Corrosion Resistance Advantages of FRP Cable Trays in Chemical & Marine Plants',
    slug: 'frp-cable-trays-corrosion-resistance',
    body: 'Why composite FRP cable trays outperform galvanized iron and stainless steel in coastal and acidic chemical processing environments.',
    author: 'Shreeraj Technical Desk',
    status: 'published',
    createdAt: new Date().toISOString()
  }
];

export const initialInquiries = [
  {
    id: 'inq-1',
    _id: 'inq-1',
    name: 'Kiran Desai',
    company: 'Torrent Pharma Engineering Division',
    email: 'kiran.desai@torrentpharma.com',
    phone: '+91 98250 11223',
    products: ['Siemens Motor', 'Low Voltage Control Product'],
    message: 'Need quotation for 10 units of 15 HP IE3 Siemens motors with control panels.',
    status: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inq-2',
    _id: 'inq-2',
    name: 'Sanjay Varma',
    company: 'L&T Infrastructure Projects',
    email: 'sanjay.varma@larsentoubro.com',
    phone: '+91 94280 44556',
    products: ['Ladder Type Cable Tray', 'Checkered Plate'],
    message: 'Require 500 meters of heavy-duty ladder type FRP cable tray for refinery project in Dahej.',
    status: 'in-progress',
    createdAt: new Date().toISOString()
  }
];

export const initialJobOpenings = [
  {
    id: 'job-1',
    _id: 'job-1',
    title: 'Industrial Sales Engineer (Switchgear & Motors)',
    department: 'Sales & Business Development',
    location: 'Ahmedabad, Gujarat',
    description: 'Responsible for B2B client acquisition, OEM technical consultations, and quoting Siemens/CGL motors.',
    requirements: ['B.E./Diploma in Electrical Engineering', '2+ years experience in industrial electrical sales'],
    status: 'open'
  },
  {
    id: 'job-2',
    _id: 'job-2',
    title: 'FRP Projects & Sourcing Coordinator',
    department: 'Projects & Estimation',
    location: 'Ahmedabad, Gujarat',
    description: 'Prepare BOM takeoffs and drawings for FRP cable trays and gratings for EPC contractors.',
    requirements: ['Mechanical / Civil Diploma with AutoCAD proficiency'],
    status: 'open'
  }
];

export const initialJobApplications = [
  {
    id: 'app-1',
    _id: 'app-1',
    jobTitle: 'Industrial Sales Engineer (Switchgear & Motors)',
    name: 'Hardik Patel',
    email: 'hardik.patel@gmail.com',
    phone: '+91 98980 12345',
    resumeUrl: '#',
    coverNote: '4 years of experience selling Siemens switchgear and LV motor control panels in Gujarat industrial estates.',
    status: 'shortlisted',
    createdAt: new Date().toISOString()
  }
];

export const initialUsers = [
  {
    id: 'usr-1',
    name: 'Super Admin',
    email: 'admin@shreerajtraders.com',
    roleId: 'role-1',
    roleName: 'Super Admin',
    roleKey: 'super_admin',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-2',
    name: 'Content Manager',
    email: 'editor@shreerajtraders.com',
    roleId: 'role-2',
    roleName: 'Content Manager',
    roleKey: 'editor',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const initialRoles = [
  {
    id: 'role-1',
    _id: 'role-1',
    name: 'Super Admin',
    key: 'super_admin',
    description: 'Unrestricted master access across all data and website CMS',
    isSystem: true,
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: true, publish: true },
      users: { view: true, create: true, edit: true, delete: true, publish: true },
      roles: { view: true, create: true, edit: true, delete: true, publish: true },
      email_setup: { view: true, create: true, edit: true, delete: true, publish: true },
      email_for: { view: true, create: true, edit: true, delete: true, publish: true },
      email_template: { view: true, create: true, edit: true, delete: true, publish: true },
      website_editor: { view: true, create: true, edit: true, delete: true, publish: true },
      products: { view: true, create: true, edit: true, delete: true, publish: true },
      categories: { view: true, create: true, edit: true, delete: true, publish: true },
      testimonials: { view: true, create: true, edit: true, delete: true, publish: true },
      faqs: { view: true, create: true, edit: true, delete: true, publish: true },
      blogs: { view: true, create: true, edit: true, delete: true, publish: true },
      inquiries: { view: true, create: true, edit: true, delete: true, publish: true },
      job_openings: { view: true, create: true, edit: true, delete: true, publish: true },
      job_applications: { view: true, create: true, edit: true, delete: true, publish: true }
    }
  },
  {
    id: 'role-2',
    _id: 'role-2',
    name: 'Content Manager',
    key: 'editor',
    description: 'Manages products catalog, RFQ inquiries, and section content',
    isSystem: false,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false },
      products: { view: true, create: true, edit: true, delete: true },
      categories: { view: true, create: true, edit: true, delete: false },
      inquiries: { view: true, create: false, edit: true, delete: false },
      testimonials: { view: true, create: true, edit: true, delete: false },
      faqs: { view: true, create: true, edit: true, delete: false },
      blogs: { view: true, create: true, edit: true, delete: false },
      job_openings: { view: true, create: true, edit: true, delete: false },
      job_applications: { view: true, create: false, edit: true, delete: false },
      website_editor: { view: true, create: true, edit: true, delete: false, publish: true }
    }
  }
];

// Website Editor Sections for Shreeraj Traders
export const initialWebsiteSections: Record<string, any[]> = {
  'site-wide': [
    {
      id: 'sec-1',
      pageKey: 'site-wide',
      key: 'top-nav-bar',
      name: 'Top navigation bar',
      description: 'Logo wordmark, menu labels and the "Get Quote" button.',
      order: 1,
      fields: [
        { key: 'brandTitle', label: 'Brand Title', type: 'text' },
        { key: 'partnerSubtitle', label: 'Partners Subtitle', type: 'text' },
        { key: 'ctaButtonText', label: 'CTA Button Text', type: 'text' },
        { key: 'ctaPhoneNumber', label: 'Emergency Hotline / Phone', type: 'text' }
      ],
      content: {
        id: 'cnt-1',
        draftData: {
          brandTitle: 'SHREE RAJ TRADERS',
          partnerSubtitle: 'SIEMENS · CGL · HINDUSTAN ELECTRIC',
          ctaButtonText: 'GET QUOTE',
          ctaPhoneNumber: '+91-97267 88690'
        },
        publishedData: {
          brandTitle: 'SHREE RAJ TRADERS',
          partnerSubtitle: 'SIEMENS · CGL · HINDUSTAN ELECTRIC',
          ctaButtonText: 'GET QUOTE',
          ctaPhoneNumber: '+91-97267 88690'
        },
        isEdited: true,
        status: 'draft',
        lastEditedBy: 'Super Admin',
        lastEditedAt: '2026-08-20T15:31:26.000Z'
      }
    },
    {
      id: 'sec-2',
      pageKey: 'site-wide',
      key: 'company-contact-details',
      name: 'Company contact details',
      description: 'Phone numbers, email addresses and the office address. Used by the header, footer, contact page and every city page at once.',
      order: 2,
      fields: [
        { key: 'officeAddress', label: 'Office Address', type: 'textarea' },
        { key: 'primaryEmail', label: 'Primary Email', type: 'text' },
        { key: 'salesPhone', label: 'Sales Contact Phone', type: 'text' },
        { key: 'workingHours', label: 'Working Hours', type: 'text' }
      ],
      content: {
        id: 'cnt-2',
        draftData: {
          officeAddress: '104, Sakar-III, Near Income Tax Circle, Ashram Road, Ahmedabad, Gujarat 380014',
          primaryEmail: 'sales@shreerajtraders.com',
          salesPhone: '+91 98250 12345',
          workingHours: 'Mon - Sat: 9:30 AM to 7:00 PM'
        },
        publishedData: {
          officeAddress: '104, Sakar-III, Near Income Tax Circle, Ashram Road, Ahmedabad, Gujarat 380014',
          primaryEmail: 'sales@shreerajtraders.com',
          salesPhone: '+91 98250 12345',
          workingHours: 'Mon - Sat: 9:30 AM to 7:00 PM'
        },
        isEdited: false,
        status: 'published',
        lastEditedBy: 'Super Admin',
        lastEditedAt: '2026-08-20T14:15:00.000Z'
      }
    },
    {
      id: 'sec-3',
      pageKey: 'site-wide',
      key: 'footer-content',
      name: 'Footer & Copyright bar',
      description: 'Footer disclaimer, accreditation seals, quick links and copyright notice.',
      order: 3,
      fields: [
        { key: 'copyrightText', label: 'Copyright Text', type: 'text' },
        { key: 'gstin', label: 'GSTIN Number', type: 'text' },
        { key: 'cin', label: 'Company CIN / Reg', type: 'text' }
      ],
      content: {
        id: 'cnt-3',
        draftData: {
          copyrightText: '© 2026 Shree Raj Traders. All Rights Reserved.',
          gstin: '24AAAAA0000A1Z5',
          cin: 'U51909GJ2005PTC045678'
        },
        publishedData: {
          copyrightText: '© 2026 Shree Raj Traders. All Rights Reserved.',
          gstin: '24AAAAA0000A1Z5',
          cin: 'U51909GJ2005PTC045678'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ],
  'home': [
    {
      id: 'sec-4',
      pageKey: 'home',
      key: 'hero-banner',
      name: 'Hero Banner & Value Proposition',
      description: 'Main hero headline, authorized channel partner badge, description paragraph and primary CTAs.',
      order: 1,
      fields: [
        { key: 'partnerBadge', label: 'Partner Badge Text', type: 'text' },
        { key: 'mainHeadingLine1', label: 'Headline Line 1', type: 'text' },
        { key: 'highlightHeadingLine2', label: 'Headline Line 2 (Highlighted)', type: 'text' },
        { key: 'mainHeadingLine3', label: 'Headline Line 3', type: 'text' },
        { key: 'subheading', label: 'Lead Paragraph / Subheading', type: 'textarea' },
        { key: 'primaryCtaText', label: 'Primary CTA Button', type: 'text' },
        { key: 'secondaryCtaPhone', label: 'Secondary Call Button', type: 'text' }
      ],
      content: {
        id: 'cnt-4',
        draftData: {
          partnerBadge: 'AUTHORIZED CHANNEL PARTNER · OVER SIX DECADES',
          mainHeadingLine1: 'SWITCHGEARS, MOTORS &',
          highlightHeadingLine2: 'MOTORS',
          mainHeadingLine3: 'FOR INDIAN INDUSTRY',
          subheading: 'Welcome to Shree Raj Traders – a trusted Siemens switchgear supplier in Ahmedabad and authorized channel partner for motors, gearboxes, switchgear, and FRP cable trays and gratings.',
          primaryCtaText: 'REQUEST A QUOTE',
          secondaryCtaPhone: '+91-97267 88690'
        },
        publishedData: {
          partnerBadge: 'AUTHORIZED CHANNEL PARTNER · OVER SIX DECADES',
          mainHeadingLine1: 'SWITCHGEARS, MOTORS &',
          highlightHeadingLine2: 'MOTORS',
          mainHeadingLine3: 'FOR INDIAN INDUSTRY',
          subheading: 'Welcome to Shree Raj Traders – a trusted Siemens switchgear supplier in Ahmedabad and authorized channel partner for motors, gearboxes, switchgear, and FRP cable trays and gratings.',
          primaryCtaText: 'REQUEST A QUOTE',
          secondaryCtaPhone: '+91-97267 88690'
        },
        isEdited: false,
        status: 'published'
      }
    }
  ]
};

// Initialize all data stores on import
export const getAdminData = (key: string) => {
  switch (key) {
    case 'products': return initStorage('products', initialProducts);
    case 'categories': return initStorage('categories', initialCategories);
    case 'faqs': return initStorage('faqs', initialFaqs);
    case 'testimonials': return initStorage('testimonials', initialTestimonials);
    case 'blogs': return initStorage('blogs', initialBlogs);
    case 'inquiries': return initStorage('inquiries', initialInquiries);
    case 'job-openings': return initStorage('job-openings', initialJobOpenings);
    case 'job-applications': return initStorage('job-applications', initialJobApplications);
    case 'users': return initStorage('users', initialUsers);
    case 'roles': return initStorage('roles', initialRoles);
    case 'website-sections': return initStorage('website-sections', initialWebsiteSections);
    default: return [];
  }
};
