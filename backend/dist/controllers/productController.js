"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.toggleProductStatus = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_js_1 = require("../models/Product.js");
const auditService_js_1 = require("../services/auditService.js");
const http_js_1 = require("../utils/http.js");
const getProducts = async (req, res) => {
    try {
        const { search, category, brand, status, page = 1, limit = 200, sortBy, sortOrder = 'asc' } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brandName: { $regex: search, $options: 'i' } },
                { categoryKey: { $regex: search, $options: 'i' } },
                { composition: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } }
            ];
        }
        if (category && category !== 'all')
            query.categoryKey = category;
        if (brand)
            query.brandName = brand;
        if (status)
            query.status = status;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const sortOption = sortBy
            ? { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
            : { srNo: 1, createdAt: 1 };
        const [products, total] = await Promise.all([
            Product_js_1.Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
            Product_js_1.Product.countDocuments(query)
        ]);
        const formatted = products.map((p, index) => ({
            id: p._id,
            _id: p._id,
            srNo: p.srNo || skip + index + 1,
            name: p.name,
            brandName: p.brandName || 'Firmitas Healthcare',
            categoryKey: p.categoryKey,
            category: p.categoryKey,
            slug: p.slug,
            status: p.status,
            composition: p.composition || '',
            form: p.form || 'Tablet',
            rxType: p.rxType || 'Rx',
            packaging: p.packaging || 'Standard Pack',
            storage: p.storage || 'Store in cool and dry place',
            therapeuticUse: p.therapeuticUse || p.description || '',
            use: p.therapeuticUse || p.description || '',
            image: p.image || (p.images && p.images[0]) || '',
            images: p.images || [],
            description: p.description,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            createdAt: p.createdAt
        }));
        return res.json({
            success: true,
            data: formatted,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        if ((0, http_js_1.rejectInvalidId)(res, req.params.id, 'Product'))
            return;
        const product = await Product_js_1.Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        return res.json({ success: true, data: product });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, brandName, categoryKey, category, slug, status, composition, form, rxType, packaging, storage, therapeuticUse, image, images, description, metaTitle, metaDescription } = req.body;
        if (!name || !String(name).trim()) {
            return res.status(400).json({ success: false, message: 'Product name is required' });
        }
        const catKey = (categoryKey || category || 'ethical').toLowerCase().trim();
        // Use the slug the admin actually typed. The previous version appended a
        // random number to every slug, so the saved URL never matched the form.
        const cleanSlug = (0, http_js_1.slugify)(slug || name);
        if (!cleanSlug) {
            return res.status(400).json({ success: false, message: 'Could not derive a slug from the product name' });
        }
        const existing = await Product_js_1.Product.findOne({ slug: cleanSlug });
        if (existing) {
            return res.status(400).json({ success: false, message: `Product slug '${cleanSlug}' already exists` });
        }
        const count = await Product_js_1.Product.countDocuments();
        const product = await Product_js_1.Product.create({
            srNo: count + 1,
            name,
            brandName: brandName || 'Firmitas Healthcare',
            categoryKey: catKey,
            slug: cleanSlug,
            status: status || 'active',
            composition: composition || '',
            form: form || 'Tablet',
            rxType: rxType || 'Rx',
            packaging: packaging || 'Standard Pack',
            storage: storage || 'Store in cool and dry place',
            therapeuticUse: therapeuticUse || description || '',
            image: image || (images && images[0]) || '',
            images: images || (image ? [image] : []),
            description: description || therapeuticUse || '',
            metaTitle: metaTitle || name,
            metaDescription: metaDescription || description?.slice(0, 160) || ''
        });
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Admin',
            actorEmail: req.user?.email,
            action: 'Created Product',
            module: 'products',
            targetId: String(product._id),
            targetName: product.name
        });
        return res.status(201).json({ success: true, data: product });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'Product'))
            return;
        const updates = { ...req.body };
        // Never let the client rewrite identity/bookkeeping fields.
        delete updates._id;
        delete updates.id;
        delete updates.createdAt;
        delete updates.updatedAt;
        if (updates.category && !updates.categoryKey) {
            updates.categoryKey = updates.category;
        }
        delete updates.category;
        if (updates.categoryKey) {
            updates.categoryKey = String(updates.categoryKey).toLowerCase().trim();
        }
        if (updates.slug) {
            updates.slug = (0, http_js_1.slugify)(updates.slug);
            const existing = await Product_js_1.Product.findOne({ slug: updates.slug, _id: { $ne: id } });
            if (existing) {
                return res.status(400).json({ success: false, message: `Product slug '${updates.slug}' already in use` });
            }
        }
        const product = await Product_js_1.Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Admin',
            actorEmail: req.user?.email,
            action: 'Updated Product',
            module: 'products',
            targetId: String(product._id),
            targetName: product.name,
            diff: updates
        });
        return res.json({ success: true, data: product });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateProduct = updateProduct;
const toggleProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'Product'))
            return;
        const product = await Product_js_1.Product.findById(id);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        product.status = product.status === 'active' ? 'inactive' : 'active';
        await product.save();
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Admin',
            actorEmail: req.user?.email,
            action: `Toggled Product Status to ${product.status}`,
            module: 'products',
            targetId: String(product._id),
            targetName: product.name
        });
        return res.json({ success: true, data: product });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.toggleProductStatus = toggleProductStatus;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'Product'))
            return;
        const product = await Product_js_1.Product.findByIdAndDelete(id);
        if (!product)
            return res.status(404).json({ success: false, message: 'Product not found' });
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Admin',
            actorEmail: req.user?.email,
            action: 'Deleted Product',
            module: 'products',
            targetId: String(id),
            targetName: product.name
        });
        return res.json({ success: true, message: 'Product deleted successfully' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteProduct = deleteProduct;
