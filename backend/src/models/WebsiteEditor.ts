import mongoose, { Schema, Document } from 'mongoose';
import { SectionFieldSchema } from '../types/index.js';

export interface IPage extends Document {
  key: string;
  name: string;
  route: string;
  displayOrder: number;
  sectionCount: number;
}

const PageSchema = new Schema<IPage>(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    route: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    sectionCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Page = mongoose.model<IPage>('Page', PageSchema);

export interface ISection extends Document {
  pageKey: string;
  key: string;
  name: string;
  description: string;
  order: number;
  fields: SectionFieldSchema[];
  appliesTo?: string[];
}

const SectionSchema = new Schema<ISection>(
  {
    pageKey: { type: String, required: true, index: true },
    key: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    fields: { type: Schema.Types.Mixed, required: true },
    appliesTo: [{ type: String }]
  },
  { timestamps: true }
);

SectionSchema.index({ pageKey: 1, key: 1 }, { unique: true });

export const Section = mongoose.model<ISection>('Section', SectionSchema);

export interface ISectionContent extends Document {
  sectionId: mongoose.Types.ObjectId;
  pageKey: string;
  sectionKey: string;
  draftData: Record<string, any>;
  publishedData: Record<string, any>;
  isEdited: boolean;
  status: 'draft' | 'published';
  lastEditedBy: string;
  lastEditedAt: Date;
}

const SectionContentSchema = new Schema<ISectionContent>(
  {
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    pageKey: { type: String, required: true, index: true },
    sectionKey: { type: String, required: true, index: true },
    draftData: { type: Schema.Types.Mixed, default: {} },
    publishedData: { type: Schema.Types.Mixed, default: {} },
    isEdited: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    lastEditedBy: { type: String, default: 'Super Admin' },
    lastEditedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

SectionContentSchema.index({ pageKey: 1, sectionKey: 1 }, { unique: true });

export const SectionContent = mongoose.model<ISectionContent>('SectionContent', SectionContentSchema);
