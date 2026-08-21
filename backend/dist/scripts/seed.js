"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const Role_js_1 = require("../models/Role.js");
const User_js_1 = require("../models/User.js");
const Category_js_1 = require("../models/Category.js");
const Brand_js_1 = require("../models/Brand.js");
const Product_js_1 = require("../models/Product.js");
const WebsiteEditor_js_1 = require("../models/WebsiteEditor.js");
const Entities_js_1 = require("../models/Entities.js");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shreeraj_traders';
async function seed() {
    try {
        console.log('[Seed] Connecting to MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('[Seed] Connected.');
        // Clear existing collections
        await Promise.all([
            Role_js_1.Role.deleteMany({}),
            User_js_1.User.deleteMany({}),
            Category_js_1.Category.deleteMany({}),
            Brand_js_1.Brand.deleteMany({}),
            Product_js_1.Product.deleteMany({}),
            WebsiteEditor_js_1.Page.deleteMany({}),
            WebsiteEditor_js_1.Section.deleteMany({}),
            WebsiteEditor_js_1.SectionContent.deleteMany({}),
            Entities_js_1.EmailSetup.deleteMany({}),
            Entities_js_1.EmailMapping.deleteMany({}),
            Entities_js_1.EmailTemplate.deleteMany({}),
            Entities_js_1.Testimonial.deleteMany({}),
            Entities_js_1.Faq.deleteMany({}),
            Entities_js_1.Blog.deleteMany({}),
            Entities_js_1.JobOpening.deleteMany({})
        ]);
        // 1. Roles & Permissions
        const allModules = [
            'dashboard', 'users', 'roles', 'email_setup', 'email_for', 'email_template',
            'website_editor', 'products', 'categories', 'testimonials', 'faqs', 'blogs',
            'inquiries', 'job_openings', 'job_applications', 'audit_logs'
        ];
        const superAdminPermissions = {};
        const editorPermissions = {};
        allModules.forEach((m) => {
            superAdminPermissions[m] = { view: true, create: true, edit: true, delete: true, publish: true };
            editorPermissions[m] = {
                view: true,
                create: !['roles', 'email_setup'].includes(m),
                edit: !['roles', 'email_setup'].includes(m),
                delete: false,
                publish: m === 'website_editor'
            };
        });
        const superAdminRole = await Role_js_1.Role.create({
            name: 'Super Admin',
            key: 'super_admin',
            description: 'Unrestricted access to all Firmitas admin and visual CMS controls',
            permissions: superAdminPermissions,
            isSystem: true
        });
        await Role_js_1.Role.create({
            name: 'Content Manager',
            key: 'editor',
            description: 'Can manage pharmaceutical products, enquiries, and section content',
            permissions: editorPermissions,
            isSystem: false
        });
        // 2. Admin Users
        const salt = await bcryptjs_1.default.genSalt(10);
        const superAdminHash = await bcryptjs_1.default.hash('Admin@123', salt);
        await User_js_1.User.create({
            name: 'Super Admin',
            email: 'admin@firmitas.com',
            passwordHash: superAdminHash,
            role: superAdminRole._id,
            isActive: true,
            avatar: ''
        });
        // 3. Brands / Manufacturers
        await Brand_js_1.Brand.insertMany([
            { name: 'Cipla', slug: 'cipla' },
            { name: 'Sun Pharma', slug: 'sun-pharma' },
            { name: 'Dr. Reddy’s', slug: 'dr-reddys' },
            { name: 'Lupin', slug: 'lupin' },
            { name: 'Mankind Pharma', slug: 'mankind' },
            { name: 'Firmitas Healthcare', slug: 'firmitas-healthcare' }
        ]);
        // 4. Categories (Firmitas 4 supply divisions)
        await Category_js_1.Category.insertMany([
            { name: 'Ethical & Generics', key: 'ethical', displayOrder: 1, isActive: true },
            { name: 'Surgical & Hospital Supplies', key: 'surgical', displayOrder: 2, isActive: true },
            { name: 'OTC Products', key: 'otc', displayOrder: 3, isActive: true },
            { name: 'Critical Care', key: 'critical', displayOrder: 4, isActive: true }
        ]);
        // 5. Products (Firmitas actual pharmaceutical products catalog)
        const firmitasProducts = [
            {
                srNo: 1,
                name: 'Paracetamol Tablets IP',
                brandName: 'Firmitas Healthcare',
                categoryKey: 'ethical',
                slug: 'paracetamol-tablets-ip',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200',
                images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'],
                description: 'Paracetamol 500 mg / 650 mg. Analgesic and antipyretic for fever and mild to moderate pain. 10 x 10 Blister.',
                metaTitle: 'Paracetamol Tablets IP - Firmitas Pharmaceuticals',
                metaDescription: 'Bulk B2B distributor of Paracetamol Tablets IP.'
            },
            {
                srNo: 2,
                name: 'Amoxicillin + Clavulanic Acid Tablets',
                brandName: 'Cipla',
                categoryKey: 'ethical',
                slug: 'amoxicillin-clavulanic-acid-tablets',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200',
                images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800'],
                description: 'Amoxicillin 500 mg + Clavulanic Acid 125 mg. Beta-lactamase resistant antibiotic combination in 10 x 6 Blister.',
                metaTitle: 'Amoxicillin + Clavulanic Acid Tablets - Firmitas',
                metaDescription: 'High efficacy broad spectrum antibiotic tablets.'
            },
            {
                srNo: 3,
                name: 'Azithromycin Tablets IP',
                brandName: 'Sun Pharma',
                categoryKey: 'ethical',
                slug: 'azithromycin-tablets-ip',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200',
                images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'],
                description: 'Azithromycin 250 mg / 500 mg. Macrolide antibiotic for respiratory and soft tissue infections.',
                metaTitle: 'Azithromycin Tablets IP - Firmitas',
                metaDescription: 'Macrolide antibiotic formulations for hospital and pharmacy supply.'
            },
            {
                srNo: 4,
                name: 'Disposable Syringes with Needle',
                brandName: 'Firmitas Healthcare',
                categoryKey: 'surgical',
                slug: 'disposable-syringes-with-needle',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200',
                images: ['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800'],
                description: 'Sterile, single use — 1 ml / 2 ml / 5 ml / 10 ml / 20 ml with ultra-sharp needles. Box of 100.',
                metaTitle: 'Disposable Syringes - Firmitas Surgical',
                metaDescription: 'Sterile surgical disposable syringes with needle.'
            },
            {
                srNo: 5,
                name: 'IV Cannula with Injection Port',
                brandName: 'Firmitas Healthcare',
                categoryKey: 'surgical',
                slug: 'iv-cannula-with-injection-port',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200',
                images: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800'],
                description: 'Sizes 18G / 20G / 22G / 24G / 26G sterile intravenous cannulation with colour-coded wings.',
                metaTitle: 'IV Cannula with Port - Firmitas',
                metaDescription: 'Medical grade IV cannula sizes 18G to 26G.'
            },
            {
                srNo: 6,
                name: 'Absorbent Cotton Wool IP',
                brandName: 'Firmitas Healthcare',
                categoryKey: 'surgical',
                slug: 'absorbent-cotton-wool-ip',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200',
                images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'],
                description: '100% Pure Absorbent Cotton, Sterile & Non-sterile 500g roll for wound care and clinical prep.',
                metaTitle: 'Absorbent Cotton Wool IP - Firmitas',
                metaDescription: 'High absorbency hospital grade cotton rolls.'
            },
            {
                srNo: 7,
                name: 'Multivitamin & Mineral Capsules',
                brandName: 'Dr. Reddy’s',
                categoryKey: 'otc',
                slug: 'multivitamin-mineral-capsules',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?w=200',
                images: ['https://images.unsplash.com/photo-1550572017-ed200f5e6343?w=800'],
                description: 'Essential Vitamins A, C, D3, E, B-Complex + Zinc. Daily immune function supplement.',
                metaTitle: 'Multivitamin & Mineral Capsules - Firmitas OTC',
                metaDescription: 'Complete health and multivitamin capsules for retail pharmacy.'
            },
            {
                srNo: 8,
                name: 'ORS Powder (WHO Formula)',
                brandName: 'Mankind Pharma',
                categoryKey: 'otc',
                slug: 'ors-powder-who-formula',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200',
                images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'],
                description: 'Oral Rehydration Salts, WHO recommended formula for electrolyte replacement. Box of 100.',
                metaTitle: 'ORS Powder WHO Formula - Firmitas',
                metaDescription: 'WHO formula Oral Rehydration Salts.'
            },
            {
                srNo: 9,
                name: 'Human Insulin Injection',
                brandName: 'Cipla',
                categoryKey: 'critical',
                slug: 'human-insulin-injection',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200',
                images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'],
                description: 'Human Insulin 40 IU/ml (100 IU/ml available). Supplied under strict validated cold chain (2°C - 8°C).',
                metaTitle: 'Human Insulin Injection - Firmitas Critical Care',
                metaDescription: 'Cold chain verified insulin supplies for hospital and ICU.'
            },
            {
                srNo: 10,
                name: 'Adrenaline Injection IP',
                brandName: 'Firmitas Healthcare',
                categoryKey: 'critical',
                slug: 'adrenaline-injection-ip',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200',
                images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'],
                description: 'Adrenaline 1 mg/ml (1:1000). Emergency management of anaphylaxis and cardiac arrest.',
                metaTitle: 'Adrenaline Injection IP - Firmitas',
                metaDescription: 'Emergency ICU resuscitation adrenaline ampoules.'
            }
        ];
        await Product_js_1.Product.insertMany(firmitasProducts);
        // 6. Website Editor Pages & Dynamic Section Schemas for Firmitas
        const pagesData = [
            { key: 'seo', name: 'SEO', route: '/', displayOrder: 1 },
            { key: 'site-wide', name: 'SITE-WIDE', route: '/', displayOrder: 2 },
            { key: 'home', name: 'HOME PAGE', route: '/', displayOrder: 3 },
            { key: 'about', name: 'ABOUT US', route: '/about', displayOrder: 4 },
            { key: 'categories', name: 'CATEGORIES', route: '/categories', displayOrder: 5 },
            { key: 'products', name: 'PRODUCTS', route: '/products', displayOrder: 6 },
            { key: 'why-choose-us', name: 'WHY CHOOSE US', route: '/why-choose-us', displayOrder: 7 },
            { key: 'compliance', name: 'COMPLIANCE', route: '/compliance', displayOrder: 8 },
            { key: 'contact', name: 'CONTACT', route: '/contact', displayOrder: 9 },
            { key: 'enquiry', name: 'ENQUIRY / RFQ', route: '/enquiry', displayOrder: 10 }
        ];
        await WebsiteEditor_js_1.Page.insertMany(pagesData);
        // Dynamic Sections for Firmitas
        const firmitasSections = [
            {
                pageKey: 'site-wide',
                key: 'top-nav-bar',
                name: 'Top navigation & Header bar',
                description: 'Controls Firmitas branding, quick phone contact, and "Enquire Now" CTA.',
                order: 1,
                fields: [
                    { key: 'brandTitle', label: 'Brand Name', type: 'text' },
                    { key: 'tagline', label: 'Header Tagline', type: 'text' },
                    { key: 'hotlinePhone', label: 'Hotline / WhatsApp Number', type: 'text' },
                    { key: 'enquiryButtonText', label: 'CTA Button Text', type: 'text' }
                ],
                defaultData: {
                    brandTitle: 'Firmitas 1',
                    tagline: 'PHARMACEUTICAL & HEALTHCARE DISTRIBUTOR',
                    hotlinePhone: '+91 98250 00000',
                    enquiryButtonText: 'Request Quote'
                },
                isEdited: true
            },
            {
                pageKey: 'site-wide',
                key: 'company-contact-details',
                name: 'Company compliance & Contact info',
                description: 'Drug licence numbers, registered office address, email and GST details.',
                order: 2,
                fields: [
                    { key: 'registeredAddress', label: 'Warehouse / Office Address', type: 'textarea' },
                    { key: 'primaryEmail', label: 'Orders & Enquiries Email', type: 'text' },
                    { key: 'drugLicenceNo', label: 'Drug Licence Numbers', type: 'text' },
                    { key: 'gstin', label: 'GSTIN Number', type: 'text' }
                ],
                defaultData: {
                    registeredAddress: 'Firmitas Healthcare Logistics Hub, Plot 42, GIDC Industrial Estate, Ahmedabad, Gujarat',
                    primaryEmail: 'supply@firmitas.com',
                    drugLicenceNo: 'Form 20B / 21B: GJ-AHM-123456 / 123457',
                    gstin: '24AAACF1234F1Z9'
                },
                isEdited: false
            },
            {
                pageKey: 'home',
                key: 'hero-banner',
                name: 'Home Hero & Value Proposition',
                description: 'Main banner headline, accept bulk enquiry badge, lead description, and CTAs.',
                order: 1,
                fields: [
                    { key: 'badgeText', label: 'Announcement Badge', type: 'text' },
                    { key: 'heroHeadingLine1', label: 'Hero Heading Line 1', type: 'text' },
                    { key: 'heroHeadingHighlight', label: 'Hero Heading (Gradient / Highlight)', type: 'text' },
                    { key: 'heroSubtitle', label: 'Hero Subtitle / Description', type: 'textarea' },
                    { key: 'primaryCta', label: 'Primary Button Label', type: 'text' },
                    { key: 'secondaryCta', label: 'Secondary Button Label', type: 'text' }
                ],
                defaultData: {
                    badgeText: 'Newly Founded · Now Accepting Bulk Enquiries',
                    heroHeadingLine1: 'Complete Pharmacy',
                    heroHeadingHighlight: 'Solutions',
                    heroSubtitle: 'Firmitas 1 is a newly founded pharmaceutical distributor supplying ethical drugs, surgical essentials, critical care medicines, and OTC products to pharmacies, hospitals, and clinics. Tell us what you need and we will quote it.',
                    primaryCta: 'Request Bulk Quote',
                    secondaryCta: 'View Catalog'
                },
                isEdited: false
            },
            {
                pageKey: 'home',
                key: 'stats-strip',
                name: 'Supply Metrics & Experience Counter',
                description: '4-column highlights: Supply Divisions, Audited Sourcing, 0 Rigid Minimums, 24h Quote Turnaround.',
                order: 2,
                fields: [
                    { key: 'stat1Value', label: 'Stat 1 Value', type: 'text' },
                    { key: 'stat1Label', label: 'Stat 1 Label', type: 'text' },
                    { key: 'stat2Value', label: 'Stat 2 Value', type: 'text' },
                    { key: 'stat2Label', label: 'Stat 2 Label', type: 'text' },
                    { key: 'stat3Value', label: 'Stat 3 Value', type: 'text' },
                    { key: 'stat3Label', label: 'Stat 3 Label', type: 'text' },
                    { key: 'stat4Value', label: 'Stat 4 Value', type: 'text' },
                    { key: 'stat4Label', label: 'Stat 4 Label', type: 'text' }
                ],
                defaultData: {
                    stat1Value: '4+',
                    stat1Label: 'Supply Divisions',
                    stat2Value: '100%',
                    stat2Label: 'Audited Sourcing',
                    stat3Value: '0',
                    stat3Label: 'Rigid Minimums',
                    stat4Value: '24h',
                    stat4Label: 'Quote Turnaround'
                },
                isEdited: false
            }
        ];
        for (const secData of firmitasSections) {
            const sec = await WebsiteEditor_js_1.Section.create({
                pageKey: secData.pageKey,
                key: secData.key,
                name: secData.name,
                description: secData.description,
                order: secData.order,
                fields: secData.fields
            });
            const published = { ...secData.defaultData };
            const draft = { ...secData.defaultData };
            if (secData.isEdited) {
                draft.brandTitle = 'Firmitas 1 - Pharma Logistics Hub';
            }
            await WebsiteEditor_js_1.SectionContent.create({
                sectionId: sec._id,
                pageKey: secData.pageKey,
                sectionKey: secData.key,
                draftData: draft,
                publishedData: published,
                isEdited: secData.isEdited || false,
                status: secData.isEdited ? 'draft' : 'published',
                lastEditedBy: 'Super Admin',
                lastEditedAt: new Date()
            });
        }
        // 7. Email Suite default setup
        await Entities_js_1.EmailSetup.create({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            user: 'orders@firmitas.com',
            pass: 'AppPassword123!',
            fromName: 'Firmitas Admin Portal',
            fromEmail: 'orders@firmitas.com',
            isConfigured: true
        });
        await Entities_js_1.EmailMapping.insertMany([
            {
                eventKey: 'new_rfq',
                eventName: 'New Pharmaceutical Enquiry / Quote',
                description: 'Sent when a hospital/pharmacy submits a quote request',
                recipients: ['orders@firmitas.com', 'admin@firmitas.com'],
                templateKey: 'rfq_notification',
                isActive: true
            }
        ]);
        await Entities_js_1.EmailTemplate.insertMany([
            {
                key: 'rfq_notification',
                name: 'Firmitas RFQ Notification',
                subject: 'New Bulk Quote Request: {{customerName}} ({{company}})',
                htmlBody: '<div style="font-family:sans-serif;padding:20px;"><h2>New Medicine Quotation Request</h2><p><strong>Customer:</strong> {{customerName}}</p><p><strong>Entity:</strong> {{company}}</p><p><strong>Contact:</strong> {{email}} | {{phone}}</p><p><strong>Requirements:</strong> {{productName}}</p></div>',
                variables: ['customerName', 'company', 'email', 'phone', 'productName', 'message']
            }
        ]);
        // 8. Testimonials & FAQs
        await Entities_js_1.Testimonial.insertMany([
            {
                name: 'Dr. S. K. Mehta',
                company: 'Apex Multi-Speciality Hospital',
                quote: 'Firmitas supplies 100% verified batch documentation and genuine cold-chain maintenance for our emergency and ICU supplies.',
                rating: 5,
                isActive: true,
                displayOrder: 1
            },
            {
                name: 'Manoj Patel',
                company: 'Sanjivani Chemist & Druggist',
                quote: 'Prompt quotation and clear batch expiry details before billing. Dependable pharma distributor.',
                rating: 5,
                isActive: true,
                displayOrder: 2
            }
        ]);
        await Entities_js_1.Faq.insertMany([
            {
                question: 'What documents are required to place an order for prescription medicines?',
                answer: 'Valid Wholesale / Retail Drug Licence (Form 20B / 21B) and GST Registration certificate are mandatory.',
                category: 'Compliance',
                displayOrder: 1,
                isActive: true
            },
            {
                question: 'How is the cold-chain integrity verified for critical care items?',
                answer: 'Cold chain medicines are dispatched in temperature-validated insulated shipper boxes with data-logged frozen gel packs maintained between 2°C to 8°C.',
                category: 'Storage & Cold Chain',
                displayOrder: 2,
                isActive: true
            }
        ]);
        console.log('✅ [Seed] Firmitas Database seeded successfully!');
        process.exit(0);
    }
    catch (err) {
        console.error('❌ [Seed] Error seeding Firmitas:', err);
        process.exit(1);
    }
}
seed();
