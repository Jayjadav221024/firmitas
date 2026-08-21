import mongoose from 'mongoose';
import { Response } from 'express';

/**
 * Mongoose throws a CastError for ids that are not valid ObjectIds, which used
 * to surface as a 500. A client asking for a non-existent id should get a 404,
 * so callers check the id first.
 */
export function isValidObjectId(id: unknown): boolean {
  if (typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
}

/** Sends a 404 and returns true when `id` cannot possibly identify a document. */
export function rejectInvalidId(res: Response, id: unknown, label = 'Record'): boolean {
  if (!isValidObjectId(id)) {
    res.status(404).json({ success: false, message: `${label} not found` });
    return true;
  }
  return false;
}

export function slugify(value: string): string {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
