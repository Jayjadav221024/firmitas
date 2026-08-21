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
exports.SectionContent = exports.Section = exports.Page = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PageSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    route: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    sectionCount: { type: Number, default: 0 }
}, { timestamps: true });
exports.Page = mongoose_1.default.model('Page', PageSchema);
const SectionSchema = new mongoose_1.Schema({
    pageKey: { type: String, required: true, index: true },
    key: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    fields: { type: mongoose_1.Schema.Types.Mixed, required: true },
    appliesTo: [{ type: String }]
}, { timestamps: true });
SectionSchema.index({ pageKey: 1, key: 1 }, { unique: true });
exports.Section = mongoose_1.default.model('Section', SectionSchema);
const SectionContentSchema = new mongoose_1.Schema({
    sectionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Section', required: true },
    pageKey: { type: String, required: true, index: true },
    sectionKey: { type: String, required: true, index: true },
    draftData: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    publishedData: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    isEdited: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    lastEditedBy: { type: String, default: 'Super Admin' },
    lastEditedAt: { type: Date, default: Date.now }
}, { timestamps: true });
SectionContentSchema.index({ pageKey: 1, sectionKey: 1 }, { unique: true });
exports.SectionContent = mongoose_1.default.model('SectionContent', SectionContentSchema);
