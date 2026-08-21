import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  key: string;
  parentCategory?: mongoose.Types.ObjectId | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
