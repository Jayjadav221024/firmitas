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
        console.log('[Seed] Cleared collections.');
        // 1. Roles & Permissions
        const allModules = [
            'dashboard',
            'users',
            'roles',
            'email_setup',
            'email_for',
            'email_template',
            'website_editor',
            'products',
            'categories',
            'testimonials',
            'faqs',
            'blogs',
            'inquiries',
            'job_openings',
            'job_applications',
            'audit_logs'
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
            description: 'Unrestricted access to all admin and website features',
            permissions: superAdminPermissions,
            isSystem: true
        });
        const editorRole = await Role_js_1.Role.create({
            name: 'Editor',
            key: 'editor',
            description: 'Can manage products, content, and inquiries without deleting system configurations',
            permissions: editorPermissions,
            isSystem: false
        });
        // 2. Admin Users
        const salt = await bcryptjs_1.default.genSalt(10);
        const superAdminHash = await bcryptjs_1.default.hash('Admin@123', salt);
        await User_js_1.User.create({
            name: 'Super Admin',
            email: 'admin@shreerajtraders.com',
            passwordHash: superAdminHash,
            role: superAdminRole._id,
            isActive: true,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        });
        // 3. Brands
        const brands = await Brand_js_1.Brand.insertMany([
            { name: 'Siemens', slug: 'siemens' },
            { name: 'CGL (Crompton Greaves)', slug: 'cgl' },
            { name: 'Hindustan Electric', slug: 'hindustan-electric' },
            { name: 'Shree Raj Traders', slug: 'shree-raj-traders' }
        ]);
        // 4. Categories
        const categories = await Category_js_1.Category.insertMany([
            { name: 'Switchgears', key: 'switchgears', displayOrder: 1, isActive: true },
            { name: 'Motors', key: 'motors', displayOrder: 2, isActive: true },
            { name: 'FRP Gratings', key: 'frp-gratings', displayOrder: 3, isActive: true },
            { name: 'FRP Cable Trays', key: 'frp-cable-trays', displayOrder: 4, isActive: true }
        ]);
        // 5. Products (Matching user's exact sample items)
        const sampleProducts = [
            {
                srNo: 1,
                name: 'Low Voltage Control Product',
                brandName: 'Siemens',
                categoryKey: 'switchgears',
                slug: 'low-voltage-control-product',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200',
                images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'],
                description: 'Siemens Sirius Low Voltage industrial control components for power distribution and machinery safety.',
                metaTitle: 'Siemens Low Voltage Control Product - Shreeraj Traders',
                metaDescription: 'Authorized Siemens Low Voltage Control distributor in Ahmedabad.'
            },
            {
                srNo: 2,
                name: 'MCB',
                brandName: 'Siemens',
                categoryKey: 'switchgears',
                slug: 'mcb',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200',
                images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'],
                description: 'High reliability miniature circuit breaker with instant trip mechanism and thermal protection.',
                metaTitle: 'Siemens MCB Switches - Shreeraj Traders',
                metaDescription: 'Top grade Siemens MCB miniature circuit breakers.'
            },
            {
                srNo: 3,
                name: 'Sinnova',
                brandName: 'Siemens',
                categoryKey: 'switchgears',
                slug: 'sinnova',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200',
                images: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800'],
                description: 'Siemens Sinnova range offering premium modular switchgear and electrical protection.',
                metaTitle: 'Siemens Sinnova Switchgear - Shreeraj Traders',
                metaDescription: 'Sinnova modular electrical switchgear.'
            },
            {
                srNo: 4,
                name: 'Siemens Motor',
                brandName: 'Siemens',
                categoryKey: 'motors',
                slug: 'siemens-motor',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=200',
                images: ['https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800'],
                description: 'Energy efficient 3-phase AC induction motors for severe duty industrial applications.',
                metaTitle: 'Siemens Electric Motors - Shreeraj Traders',
                metaDescription: 'IE2, IE3, and IE4 high efficiency Siemens motors.'
            },
            {
                srNo: 5,
                name: 'Hindustan Electric Motor',
                brandName: 'Hindustan Electric',
                categoryKey: 'motors',
                slug: 'hindustan-electric-motor',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=200',
                images: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800'],
                description: 'Heavy duty Hindustan Electric motors engineered for Indian industrial conditions.',
                metaTitle: 'Hindustan Electric Motors Supplier - Shreeraj Traders',
                metaDescription: 'Durable Hindustan Electric 3-phase induction motors.'
            },
            {
                srNo: 6,
                name: 'Checkered Plate',
                brandName: 'Shree Raj Traders',
                categoryKey: 'frp-gratings',
                slug: 'cheker-plate',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200',
                images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'],
                description: 'High-strength anti-skid FRP checkered plate for walkway flooring and chemical environments.',
                metaTitle: 'FRP Checkered Plate - Shreeraj Traders',
                metaDescription: 'Corrosion-resistant FRP checkered plate.'
            },
            {
                srNo: 7,
                name: 'Ladder Type Cable Tray',
                brandName: 'Shree Raj Traders',
                categoryKey: 'frp-cable-trays',
                slug: 'ladder-type-cable-tray',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=200',
                images: ['https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800'],
                description: 'FRP Ladder type cable management trays engineered for heavy cable loading and aggressive atmospheres.',
                metaTitle: 'Ladder Type FRP Cable Tray - Shreeraj Traders',
                metaDescription: 'Heavy-duty fiberglass ladder cable trays.'
            },
            {
                srNo: 8,
                name: 'Crompton Greaves Motor',
                brandName: 'CGL (Crompton Greaves)',
                categoryKey: 'motors',
                slug: 'crompton-greaves-motor',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200',
                images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'],
                description: 'Crompton Greaves energy efficient motors for pumps, blowers, and manufacturing plants.',
                metaTitle: 'Crompton Greaves Motor - Shreeraj Traders',
                metaDescription: 'CGL high efficiency motors distributor.'
            },
            {
                srNo: 9,
                name: 'Grit Top',
                brandName: 'Shree Raj Traders',
                categoryKey: 'frp-gratings',
                slug: 'grit-top',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200',
                images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'],
                description: 'Molded FRP grating with quartz grit anti-slip surface for offshore and oil & gas facilities.',
                metaTitle: 'FRP Grit Top Grating - Shreeraj Traders',
                metaDescription: 'Grit top non-slip composite grating.'
            },
            {
                srNo: 10,
                name: 'Perforated Cable Tray',
                brandName: 'Shree Raj Traders',
                categoryKey: 'frp-cable-trays',
                slug: 'perforated-cable-tray',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=200',
                images: ['https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800'],
                description: 'Fiberglass reinforced polymer perforated trays for power and telecommunication cabling.',
                metaTitle: 'Perforated FRP Cable Tray - Shreeraj Traders',
                metaDescription: 'Corrosion proof perforated cable trays.'
            },
            {
                srNo: 11,
                name: 'Meniscus Top',
                brandName: 'Shree Raj Traders',
                categoryKey: 'frp-gratings',
                slug: 'meniscus-top',
                status: 'active',
                image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200',
                images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'],
                description: 'Standard concave meniscus surface molded grating for industrial drainage and platform walkways.',
                metaTitle: 'Meniscus Top FRP Grating - Shreeraj Traders',
                metaDescription: 'Meniscus top FRP grating.'
            }
        ];
        await Product_js_1.Product.insertMany(sampleProducts);
        // 6. Website Editor Pages & Dynamic Section Schemas
        const pagesData = [
            { key: 'seo', name: 'SEO', route: '/', displayOrder: 1 },
            { key: 'site-wide', name: 'SITE-WIDE', route: '/', displayOrder: 2 },
            { key: 'home', name: 'HOME PAGE', route: '/', displayOrder: 3 },
            { key: 'about', name: 'ABOUT US', route: '/about', displayOrder: 4 },
            { key: 'products', name: 'PRODUCTS', route: '/products', displayOrder: 5 },
            { key: 'contact', name: 'CONTACT', route: '/contact', displayOrder: 6 },
            { key: 'blog', name: 'BLOG', route: '/blogs', displayOrder: 7 },
            { key: 'gallery', name: 'GALLERY', route: '/gallery', displayOrder: 8 },
            { key: 'careers', name: 'CAREERS', route: '/careers', displayOrder: 9 },
            { key: 'locations', name: 'LOCATIONS', route: '/locations', displayOrder: 10 },
            { key: 'city-landing', name: 'CITY LANDING', route: '/cities/ahmedabad', displayOrder: 11 }
        ];
        await WebsiteEditor_js_1.Page.insertMany(pagesData);
        // Create Section Schemas & Contents for Site-Wide and Home Page
        const sectionsToCreate = [
            // Site-Wide Sections
            {
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
                defaultData: {
                    brandTitle: 'SHREE RAJ TRADERS',
                    partnerSubtitle: 'SIEMENS · CGL · HINDUSTAN ELECTRIC',
                    ctaButtonText: 'GET QUOTE',
                    ctaPhoneNumber: '+91-97267 88690'
                },
                isEdited: true // Exactly matching user's screenshot showing EDITED badge
            },
            {
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
                defaultData: {
                    officeAddress: '104, Sakar-III, Near Income Tax Circle, Ashram Road, Ahmedabad, Gujarat 380014',
                    primaryEmail: 'sales@shreerajtraders.com',
                    salesPhone: '+91 98250 12345',
                    workingHours: 'Mon - Sat: 9:30 AM to 7:00 PM'
                },
                isEdited: false
            },
            {
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
                defaultData: {
                    copyrightText: '© 2026 Shree Raj Traders. All Rights Reserved.',
                    gstin: '24AAAAA0000A1Z5',
                    cin: 'U51909GJ2005PTC045678'
                },
                isEdited: false
            },
            // Home Page Sections
            {
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
                defaultData: {
                    partnerBadge: 'AUTHORIZED CHANNEL PARTNER · OVER SIX DECADES',
                    mainHeadingLine1: 'SWITCHGEARS, MOTORS &',
                    highlightHeadingLine2: 'FRP PRODUCTS',
                    mainHeadingLine3: 'FOR INDIAN INDUSTRY',
                    subheading: 'Welcome to Shree Raj Traders — a trusted Siemens switchgear supplier in Ahmedabad and authorized channel partner for motors, gearboxes, switchgear, and FRP cable trays and gratings.',
                    primaryCtaText: 'REQUEST A QUOTE',
                    secondaryCtaPhone: '+91-97267 88690'
                },
                isEdited: false
            },
            {
                pageKey: 'home',
                key: 'key-stats',
                name: 'Key Metrics & Experience Highlights',
                description: '4-column achievement stats counter bar.',
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
                    stat1Value: '60+',
                    stat1Label: 'Years in Distribution',
                    stat2Value: '10,000+',
                    stat2Label: 'Industrial Clients Served',
                    stat3Value: '100%',
                    stat3Label: 'Genuine OEM Backed Products',
                    stat4Value: '24-48 hrs',
                    stat4Label: 'Dispatch for Ready Stock'
                },
                isEdited: false
            },
            {
                pageKey: 'home',
                key: 'product-categories-grid',
                name: 'Featured Categories Showcase',
                description: 'Highlights Switchgear, Motors, and FRP products with quick inquiry links.',
                order: 3,
                fields: [
                    { key: 'sectionTitle', label: 'Section Title', type: 'text' },
                    { key: 'sectionSubtitle', label: 'Section Subtitle', type: 'textarea' }
                ],
                defaultData: {
                    sectionTitle: 'Engineered Products from Global Leaders',
                    sectionSubtitle: 'Direct factory supply of low voltage switchgears, energy-efficient induction motors, and corrosion-resistant FRP infrastructure components.'
                },
                isEdited: false
            }
        ];
        for (const secData of sectionsToCreate) {
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
                draft.brandTitle = 'SHREE RAJ TRADERS - PVT LTD';
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
            user: 'notifications@shreerajtraders.com',
            pass: 'AppPassword123!',
            fromName: 'Shreeraj Traders Admin',
            fromEmail: 'sales@shreerajtraders.com',
            isConfigured: true
        });
        await Entities_js_1.EmailMapping.insertMany([
            {
                eventKey: 'new_rfq',
                eventName: 'New RFQ / Quote Inquiry',
                description: 'Sent when a visitor submits a quote request on the website',
                recipients: ['sales@shreerajtraders.com', 'admin@shreerajtraders.com'],
                templateKey: 'rfq_notification',
                isActive: true
            },
            {
                eventKey: 'new_job_application',
                eventName: 'New Job Application',
                description: 'Sent when a candidate applies for an opening',
                recipients: ['hr@shreerajtraders.com'],
                templateKey: 'job_app_notification',
                isActive: true
            },
            {
                eventKey: 'admin_password_reset',
                eventName: 'Admin Password Reset',
                description: 'Password reset link sent to admin users',
                recipients: ['{{userEmail}}'],
                templateKey: 'password_reset',
                isActive: true
            }
        ]);
        await Entities_js_1.EmailTemplate.insertMany([
            {
                key: 'rfq_notification',
                name: 'RFQ Inquiry Notification',
                subject: 'New RFQ Received from {{customerName}} - {{company}}',
                htmlBody: '<div style="font-family:sans-serif;padding:20px;"><h2>New RFQ Received</h2><p><strong>Name:</strong> {{customerName}}</p><p><strong>Company:</strong> {{company}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Phone:</strong> {{phone}}</p><p><strong>Products:</strong> {{productName}}</p><p><strong>Message:</strong> {{message}}</p></div>',
                variables: ['customerName', 'company', 'email', 'phone', 'productName', 'message']
            },
            {
                key: 'job_app_notification',
                name: 'Job Application Received',
                subject: 'New Application for {{jobTitle}}: {{candidateName}}',
                htmlBody: '<div style="font-family:sans-serif;padding:20px;"><h2>New Job Application</h2><p><strong>Position:</strong> {{jobTitle}}</p><p><strong>Candidate:</strong> {{candidateName}}</p><p><strong>Email:</strong> {{email}}</p><p><strong>Phone:</strong> {{phone}}</p><p><a href="{{resumeUrl}}">Download Resume</a></p></div>',
                variables: ['jobTitle', 'candidateName', 'email', 'phone', 'resumeUrl']
            }
        ]);
        // 8. Testimonials & FAQs & Jobs
        await Entities_js_1.Testimonial.insertMany([
            {
                name: 'Rajesh Patel',
                company: 'Gujarat Heavy Chemicals Ltd.',
                quote: 'Shree Raj Traders has been our exclusive Siemens switchgear & motor vendor for over 15 years. Instant delivery and authentic material.',
                rating: 5,
                isActive: true,
                displayOrder: 1
            },
            {
                name: 'Amit Shah',
                company: 'Torrent Power Contractor Consortium',
                quote: 'High quality FRP cable trays with zero defect rate. Passed all third-party flammability & load tests easily.',
                rating: 5,
                isActive: true,
                displayOrder: 2
            }
        ]);
        await Entities_js_1.Faq.insertMany([
            {
                question: 'Are all Siemens switchgears supplied with original test certificates?',
                answer: 'Yes, every Siemens switchgear and motor is 100% factory original and comes with manufacturer warranty and test certificates.',
                category: 'Switchgears',
                displayOrder: 1,
                isActive: true
            },
            {
                question: 'What is the lead time for standard FRP cable trays & gratings?',
                answer: 'Standard sizes are maintained in Ahmedabad warehouse ready for immediate 24-hour dispatch.',
                category: 'FRP Products',
                displayOrder: 2,
                isActive: true
            }
        ]);
        await Entities_js_1.JobOpening.insertMany([
            {
                title: 'Industrial Sales Engineer (Switchgear & Motors)',
                department: 'Sales & Business Development',
                location: 'Ahmedabad, Gujarat',
                description: 'Responsible for B2B client acquisition, OEM technical consultations, and quoting Siemens/CGL motors.',
                requirements: ['B.E./Diploma in Electrical Engineering', '2+ years experience in industrial electrical sales'],
                status: 'open'
            }
        ]);
        console.log('✅ [Seed] Database seeded successfully with Shreeraj Traders data!');
        process.exit(0);
    }
    catch (err) {
        console.error('❌ [Seed] Error during seeding:', err);
        process.exit(1);
    }
}
seed();
