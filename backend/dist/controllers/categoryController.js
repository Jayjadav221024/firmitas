"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrands = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const Category_js_1 = require("../models/Category.js");
const Brand_js_1 = require("../models/Brand.js");
const auditService_js_1 = require("../services/auditService.js");
const http_js_1 = require("../utils/http.js");
const getCategories = async (req, res) => {
    try {
        const categories = await Category_js_1.Category.find().sort({ displayOrder: 1, name: 1 }).populate('parentCategory');
        return res.json({ success: true, data: categories });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const { name, key, parentCategory, displayOrder, isActive } = req.body;
        if (!name || !String(name).trim()) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        const cleanKey = (0, http_js_1.slugify)(key || name);
        if (!cleanKey) {
            return res.status(400).json({ success: false, message: 'Could not derive a category key from the name' });
        }
        const existing = await Category_js_1.Category.findOne({ key: cleanKey });
        if (existing)
            return res.status(400).json({ success: false, message: 'Category key already exists' });
        const category = await Category_js_1.Category.create({
            name,
            key: cleanKey,
            // The form submits '' when no parent is chosen; '' is not a valid ObjectId.
            parentCategory: parentCategory || null,
            displayOrder: displayOrder || 0,
            isActive: isActive !== undefined ? isActive : true
        });
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Admin',
            actorEmail: req.user?.email,
            action: 'Created Category',
            module: 'categories',
            targetId: String(category._id),
            targetName: category.name
        });
        return res.status(201).json({ success: true, data: category });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'Category'))
            return;
        const updates = { ...req.body };
        delete updates._id;
        delete updates.id;
        // '' from the select must become null, not an invalid ObjectId cast.
        if (updates.parentCategory === '' || updates.parentCategory === undefined) {
            updates.parentCategory = null;
        }
        if (updates.key) {
            updates.key = (0, http_js_1.slugify)(updates.key);
            const clash = await Category_js_1.Category.findOne({ key: updates.key, _id: { $ne: id } });
            if (clash) {
                return res.status(400).json({ success: false, message: `Category key '${updates.key}' already in use` });
            }
        }
        const category = await Category_js_1.Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!category)
            return res.status(404).json({ success: false, message: 'Category not found' });
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Admin',
            actorEmail: req.user?.email,
            action: 'Updated Category',
            module: 'categories',
            targetId: String(category._id),
            targetName: category.name
        });
        return res.json({ success: true, data: category });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'Category'))
            return;
        const category = await Category_js_1.Category.findByIdAndDelete(id);
        if (!category)
            return res.status(404).json({ success: false, message: 'Category not found' });
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Admin',
            actorEmail: req.user?.email,
            action: 'Deleted Category',
            module: 'categories',
            targetId: String(id),
            targetName: category.name
        });
        return res.json({ success: true, message: 'Category deleted' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteCategory = deleteCategory;
const getBrands = async (req, res) => {
    try {
        const brands = await Brand_js_1.Brand.find().sort({ name: 1 });
        return res.json({ success: true, data: brands });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getBrands = getBrands;
