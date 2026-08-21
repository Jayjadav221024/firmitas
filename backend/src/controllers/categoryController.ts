import { Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAction } from '../services/auditService.js';
import { rejectInvalidId, slugify } from '../utils/http.js';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 }).populate('parentCategory');
    return res.json({ success: true, data: categories });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, key, parentCategory, displayOrder, isActive } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const cleanKey = slugify(key || name);
    if (!cleanKey) {
      return res.status(400).json({ success: false, message: 'Could not derive a category key from the name' });
    }

    const existing = await Category.findOne({ key: cleanKey });
    if (existing) return res.status(400).json({ success: false, message: 'Category key already exists' });

    const category = await Category.create({
      name,
      key: cleanKey,
      // The form submits '' when no parent is chosen; '' is not a valid ObjectId.
      parentCategory: parentCategory || null,
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await logAction({
      actor: req.user?.name || 'Admin',
      actorEmail: req.user?.email,
      action: 'Created Category',
      module: 'categories',
      targetId: String(category._id),
      targetName: category.name
    });

    return res.status(201).json({ success: true, data: category });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (rejectInvalidId(res, id, 'Category')) return;

    const updates = { ...req.body };
    delete updates._id;
    delete updates.id;

    // '' from the select must become null, not an invalid ObjectId cast.
    if (updates.parentCategory === '' || updates.parentCategory === undefined) {
      updates.parentCategory = null;
    }

    if (updates.key) {
      updates.key = slugify(updates.key);
      const clash = await Category.findOne({ key: updates.key, _id: { $ne: id } });
      if (clash) {
        return res.status(400).json({ success: false, message: `Category key '${updates.key}' already in use` });
      }
    }

    const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await logAction({
      actor: req.user?.name || 'Admin',
      actorEmail: req.user?.email,
      action: 'Updated Category',
      module: 'categories',
      targetId: String(category._id),
      targetName: category.name
    });

    return res.json({ success: true, data: category });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (rejectInvalidId(res, id, 'Category')) return;

    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await logAction({
      actor: req.user?.name || 'Admin',
      actorEmail: req.user?.email,
      action: 'Deleted Category',
      module: 'categories',
      targetId: String(id),
      targetName: category.name
    });

    return res.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    return res.json({ success: true, data: brands });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
