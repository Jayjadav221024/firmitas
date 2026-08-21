import { Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAction } from '../services/auditService.js';

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
    const cleanKey = key || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const existing = await Category.findOne({ key: cleanKey });
    if (existing) return res.status(400).json({ success: false, message: 'Category key already exists' });

    const category = await Category.create({
      name,
      key: cleanKey,
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
    const updates = req.body;

    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
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
