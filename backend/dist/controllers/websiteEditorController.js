"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicPageContent = exports.revertSectionChanges = exports.publishSection = exports.saveSectionDraft = exports.getSiteStats = exports.getSectionsByPage = exports.getPages = void 0;
const WebsiteEditor_js_1 = require("../models/WebsiteEditor.js");
const auditService_js_1 = require("../services/auditService.js");
const http_js_1 = require("../utils/http.js");
const getPages = async (req, res) => {
    try {
        const pages = await WebsiteEditor_js_1.Page.find().sort({ displayOrder: 1 });
        // Aggregate sections count for each page
        const counts = await WebsiteEditor_js_1.Section.aggregate([
            { $group: { _id: '$pageKey', count: { $sum: 1 } } }
        ]);
        const countMap = {};
        counts.forEach((c) => {
            countMap[c._id] = c.count;
        });
        const formatted = pages.map((p) => ({
            id: p._id,
            key: p.key,
            name: p.name,
            route: p.route,
            displayOrder: p.displayOrder,
            sectionCount: countMap[p.key] || 0
        }));
        return res.json({ success: true, data: formatted });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getPages = getPages;
const getSectionsByPage = async (req, res) => {
    try {
        const { pageKey } = req.params;
        const sections = await WebsiteEditor_js_1.Section.find({ pageKey }).sort({ order: 1 });
        const sectionIds = sections.map((s) => s._id);
        const contents = await WebsiteEditor_js_1.SectionContent.find({ sectionId: { $in: sectionIds } });
        const contentMap = new Map(contents.map((c) => [String(c.sectionId), c]));
        const result = sections.map((s) => {
            const content = contentMap.get(String(s._id));
            return {
                id: s._id,
                pageKey: s.pageKey,
                key: s.key,
                name: s.name,
                description: s.description,
                order: s.order,
                fields: s.fields,
                appliesTo: s.appliesTo,
                content: content
                    ? {
                        id: content._id,
                        draftData: content.draftData,
                        publishedData: content.publishedData,
                        isEdited: content.isEdited,
                        status: content.status,
                        lastEditedBy: content.lastEditedBy,
                        lastEditedAt: content.lastEditedAt
                    }
                    : {
                        draftData: {},
                        publishedData: {},
                        isEdited: false,
                        status: 'published',
                        lastEditedBy: 'System',
                        lastEditedAt: new Date()
                    }
            };
        });
        return res.json({ success: true, data: result });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getSectionsByPage = getSectionsByPage;
const getSiteStats = async (req, res) => {
    try {
        const [totalSections, editedCount] = await Promise.all([
            WebsiteEditor_js_1.Section.countDocuments(),
            WebsiteEditor_js_1.SectionContent.countDocuments({ isEdited: true })
        ]);
        return res.json({
            success: true,
            data: {
                totalSections,
                editedSections: editedCount,
                summaryText: `${editedCount} of ${totalSections} sections across the site have been edited.`
            }
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getSiteStats = getSiteStats;
const saveSectionDraft = async (req, res) => {
    try {
        const { sectionId } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, sectionId, 'Section schema'))
            return;
        const { data } = req.body;
        const section = await WebsiteEditor_js_1.Section.findById(sectionId);
        if (!section)
            return res.status(404).json({ success: false, message: 'Section schema not found' });
        let content = await WebsiteEditor_js_1.SectionContent.findOne({ sectionId: section._id });
        if (!content) {
            content = new WebsiteEditor_js_1.SectionContent({
                sectionId: section._id,
                pageKey: section.pageKey,
                sectionKey: section.key,
                draftData: data,
                publishedData: data,
                isEdited: true,
                status: 'draft',
                lastEditedBy: req.user?.name || 'Super Admin',
                lastEditedAt: new Date()
            });
        }
        else {
            content.draftData = data;
            content.isEdited = JSON.stringify(content.publishedData) !== JSON.stringify(data);
            content.status = content.isEdited ? 'draft' : 'published';
            content.lastEditedBy = req.user?.name || 'Super Admin';
            content.lastEditedAt = new Date();
        }
        await content.save();
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Super Admin',
            actorEmail: req.user?.email,
            action: 'Saved Section Draft',
            module: 'website_editor',
            targetId: String(section._id),
            targetName: section.name,
            diff: data
        });
        return res.json({ success: true, data: content });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.saveSectionDraft = saveSectionDraft;
const publishSection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, sectionId, 'Section schema'))
            return;
        const section = await WebsiteEditor_js_1.Section.findById(sectionId);
        if (!section)
            return res.status(404).json({ success: false, message: 'Section schema not found' });
        const content = await WebsiteEditor_js_1.SectionContent.findOne({ sectionId: section._id });
        if (!content)
            return res.status(404).json({ success: false, message: 'Section content not found' });
        content.publishedData = content.draftData;
        content.isEdited = false;
        content.status = 'published';
        content.lastEditedBy = req.user?.name || 'Super Admin';
        content.lastEditedAt = new Date();
        await content.save();
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Super Admin',
            actorEmail: req.user?.email,
            action: 'Published Section Content',
            module: 'website_editor',
            targetId: String(section._id),
            targetName: section.name
        });
        return res.json({ success: true, data: content, message: 'Section published successfully' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.publishSection = publishSection;
const revertSectionChanges = async (req, res) => {
    try {
        const { sectionId } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, sectionId, 'Section'))
            return;
        const section = await WebsiteEditor_js_1.Section.findById(sectionId);
        if (!section)
            return res.status(404).json({ success: false, message: 'Section not found' });
        const content = await WebsiteEditor_js_1.SectionContent.findOne({ sectionId: section._id });
        if (!content)
            return res.status(404).json({ success: false, message: 'Content not found' });
        content.draftData = content.publishedData;
        content.isEdited = false;
        content.status = 'published';
        content.lastEditedBy = req.user?.name || 'Super Admin';
        content.lastEditedAt = new Date();
        await content.save();
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Super Admin',
            actorEmail: req.user?.email,
            action: 'Reverted Section Changes',
            module: 'website_editor',
            targetId: String(section._id),
            targetName: section.name
        });
        return res.json({ success: true, data: content, message: 'Reverted changes to published version' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.revertSectionChanges = revertSectionChanges;
const getPublicPageContent = async (req, res) => {
    try {
        const { pageKey } = req.params;
        const isPreview = req.query.preview === 'true';
        const sections = await WebsiteEditor_js_1.Section.find({ pageKey }).sort({ order: 1 });
        const sectionIds = sections.map((s) => s._id);
        const contents = await WebsiteEditor_js_1.SectionContent.find({ sectionId: { $in: sectionIds } });
        const contentMap = new Map(contents.map((c) => [c.sectionKey, c]));
        const mergedContent = {};
        sections.forEach((s) => {
            const c = contentMap.get(s.key);
            if (c) {
                mergedContent[s.key] = isPreview ? c.draftData : c.publishedData;
            }
        });
        return res.json({
            success: true,
            pageKey,
            isPreview,
            sections: mergedContent
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getPublicPageContent = getPublicPageContent;
