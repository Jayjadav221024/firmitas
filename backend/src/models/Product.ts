import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  srNo?: number;
  name: string;
  brandName: string;
  categoryKey: string;
  slug: string;
  status: 'active' | 'inactive';
  image?: string;
  images: string[];
  description?: string;
  specifications?: Record<string, string>;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    srNo: { type: Number },
    name: { type: String, required: true, trim: true },
    brandName: { type: String, required: true },
    categoryKey: { type: String, required: true, lowercase: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    image: { type: String, default: '' },
    images: [{ type: String }],
    description: { type: String, default: '' },
    specifications: { type: Schema.Types.Mixed, default: {} },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' }
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', brandName: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
