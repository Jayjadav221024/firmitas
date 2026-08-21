import mongoose, { Schema, Document } from 'mongoose';
import { PermissionMatrix } from '../types/index.js';

export interface IRole extends Document {
  name: string;
  key: string;
  description: string;
  permissions: PermissionMatrix;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    permissions: { type: Schema.Types.Mixed, required: true },
    isSystem: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);
