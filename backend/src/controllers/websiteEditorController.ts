import { Request, Response } from 'express';
import { Page, Section, SectionContent } from '../models/WebsiteEditor.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAction } from '../services/auditService.js';
import { rejectInvalidId } from '../utils/http.js';

export const getPages = async (req: Request, res: Response) => {
  try {
    const pages = await Page.find().sort({ displayOrder: 1 });

    // Aggregate sections count for each page
    const counts = await Section.aggregate([
      { $group: { _id: '$pageKey', count: { $sum: 1 } } }
    ]);
    const countMap: Record<string, number> = {};
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
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSectionsByPage = async (req: Request, res: Response) => {
  try {
    const { pageKey } = req.params;
    const sections = await Section.find({ pageKey }).sort({ order: 1 });

    const sectionIds = sections.map((s) => s._id);
    const contents = await SectionContent.find({ sectionId: { $in: sectionIds } });
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
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSiteStats = async (req: Request, res: Response) => {
  try {
    const [totalSections, editedCount] = await Promise.all([
      Section.countDocuments(),
      SectionContent.countDocuments({ isEdited: true })
    ]);

    return res.json({
      success: true,
      data: {
        totalSections,
        editedSections: editedCount,
        summaryText: `${editedCount} of ${totalSections} sections across the site have been edited.`
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveSectionDraft = async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId } = req.params;
    if (rejectInvalidId(res, sectionId, 'Section schema')) return;

    const { data } = req.body;

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ success: false, message: 'Section schema not found' });

    let content = await SectionContent.findOne({ sectionId: section._id });
    if (!content) {
      content = new SectionContent({
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
    } else {
      content.draftData = data;
      content.isEdited = JSON.stringify(content.publishedData) !== JSON.stringify(data);
      content.status = content.isEdited ? 'draft' : 'published';
      content.lastEditedBy = req.user?.name || 'Super Admin';
      content.lastEditedAt = new Date();
    }

    await content.save();

    await logAction({
      actor: req.user?.name || 'Super Admin',
      actorEmail: req.user?.email,
      action: 'Saved Section Draft',
      module: 'website_editor',
      targetId: String(section._id),
      targetName: section.name,
      diff: data
    });

    return res.json({ success: true, data: content });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const publishSection = async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId } = req.params;
    if (rejectInvalidId(res, sectionId, 'Section schema')) return;

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ success: false, message: 'Section schema not found' });

    const content = await SectionContent.findOne({ sectionId: section._id });
    if (!content) return res.status(404).json({ success: false, message: 'Section content not found' });

    content.publishedData = content.draftData;
    content.isEdited = false;
    content.status = 'published';
    content.lastEditedBy = req.user?.name || 'Super Admin';
    content.lastEditedAt = new Date();
    await content.save();

    await logAction({
      actor: req.user?.name || 'Super Admin',
      actorEmail: req.user?.email,
      action: 'Published Section Content',
      module: 'website_editor',
      targetId: String(section._id),
      targetName: section.name
    });

    return res.json({ success: true, data: content, message: 'Section published successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const revertSectionChanges = async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId } = req.params;
    if (rejectInvalidId(res, sectionId, 'Section')) return;

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    const content = await SectionContent.findOne({ sectionId: section._id });
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });

    content.draftData = content.publishedData;
    content.isEdited = false;
    content.status = 'published';
    content.lastEditedBy = req.user?.name || 'Super Admin';
    content.lastEditedAt = new Date();
    await content.save();

    await logAction({
      actor: req.user?.name || 'Super Admin',
      actorEmail: req.user?.email,
      action: 'Reverted Section Changes',
      module: 'website_editor',
      targetId: String(section._id),
      targetName: section.name
    });

    return res.json({ success: true, data: content, message: 'Reverted changes to published version' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getPublicPageContent = async (req: Request, res: Response) => {
  try {
    const { pageKey } = req.params;
    const isPreview = req.query.preview === 'true';

    const sections = await Section.find({ pageKey }).sort({ order: 1 });
    const sectionIds = sections.map((s) => s._id);
    const contents = await SectionContent.find({ sectionId: { $in: sectionIds } });
    const contentMap = new Map(contents.map((c) => [c.sectionKey, c]));

    const mergedContent: Record<string, any> = {};
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
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
