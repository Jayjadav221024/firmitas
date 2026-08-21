"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = exports.EmailTemplate = exports.EmailMapping = exports.EmailSetup = exports.JobApplication = exports.JobOpening = exports.Inquiry = exports.Blog = exports.Faq = exports.Testimonial = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.Testimonial = mongoose_1.default.model('Testimonial', new mongoose_1.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5 },
    photo: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
}, { timestamps: true }));
exports.Faq = mongoose_1.default.model('Faq', new mongoose_1.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true }));
exports.Blog = mongoose_1.default.model('Blog', new mongoose_1.Schema({
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
}, { timestamps: true }));
exports.Inquiry = mongoose_1.default.model('Inquiry', new mongoose_1.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    products: [{ type: String }],
    message: { type: String, default: '' },
    status: { type: String, enum: ['new', 'in-progress', 'closed'], default: 'new' },
    assignedAdmin: { type: String, default: '' },
    notes: { type: String, default: '' }
}, { timestamps: true }));
exports.JobOpening = mongoose_1.default.model('JobOpening', new mongoose_1.Schema({
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, default: 'Ahmedabad, Gujarat' },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true }));
exports.JobApplication = mongoose_1.default.model('JobApplication', new mongoose_1.Schema({
    jobOpening: { type: mongoose_1.Schema.Types.ObjectId, ref: 'JobOpening' },
    jobTitle: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resumeUrl: { type: String, default: '' },
    coverNote: { type: String, default: '' },
    status: { type: String, enum: ['new', 'shortlisted', 'rejected', 'hired'], default: 'new' }
}, { timestamps: true }));
exports.EmailSetup = mongoose_1.default.model('EmailSetup', new mongoose_1.Schema({
    host: { type: String, default: 'smtp.gmail.com' },
    port: { type: Number, default: 587 },
    secure: { type: Boolean, default: false },
    user: { type: String, default: '' },
    pass: { type: String, default: '' },
    fromName: { type: String, default: 'Shreeraj Traders Admin' },
    fromEmail: { type: String, default: 'info@shreerajtraders.com' },
    isConfigured: { type: Boolean, default: false }
}, { timestamps: true }));
exports.EmailMapping = mongoose_1.default.model('EmailMapping', new mongoose_1.Schema({
    eventKey: { type: String, required: true, unique: true },
    eventName: { type: String, required: true },
    description: { type: String, default: '' },
    recipients: [{ type: String }],
    templateKey: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true }));
exports.EmailTemplate = mongoose_1.default.model('EmailTemplate', new mongoose_1.Schema({
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    htmlBody: { type: String, required: true },
    variables: [{ type: String }]
}, { timestamps: true }));
exports.AuditLog = mongoose_1.default.model('AuditLog', new mongoose_1.Schema({
    actor: { type: String, required: true },
    actorEmail: { type: String, default: '' },
    action: { type: String, required: true },
    module: { type: String, required: true },
    targetId: { type: String, default: '' },
    targetName: { type: String, default: '' },
    diff: { type: mongoose_1.Schema.Types.Mixed, default: null }
}, { timestamps: true }));
