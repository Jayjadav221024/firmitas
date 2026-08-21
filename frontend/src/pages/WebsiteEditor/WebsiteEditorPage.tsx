import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { adminApi } from '../../api/client';
import { WebsiteSection } from '../../types';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Pencil,
  Eye,
  Undo2,
  X,
  Layers,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useUIStore, useAuthStore } from '../../store';

const TABS = [
  { key: 'seo', label: 'SEO', count: 12 },
  { key: 'site-wide', label: 'SITE-WIDE', count: 3 },
  { key: 'home', label: 'HOME PAGE', count: 8 },
  { key: 'about', label: 'ABOUT US', count: 6 },
  { key: 'categories', label: 'CATEGORIES', count: 4 },
  { key: 'products', label: 'PRODUCTS', count: 10 },
  { key: 'why-choose-us', label: 'WHY CHOOSE US', count: 4 },
  { key: 'compliance', label: 'COMPLIANCE', count: 4 },
  { key: 'contact', label: 'CONTACT', count: 5 },
  { key: 'enquiry', label: 'ENQUIRY / RFQ', count: 3 }
];

export const WebsiteEditorPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuthStore();
  const { activeTab, setActiveTab } = useUIStore();

  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editingSection, setEditingSection] = useState<WebsiteSection | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch sections for current tab
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['website-sections', activeTab],
    queryFn: async () => {
      return await adminApi.getSectionsByPage(activeTab);
    }
  });

  // Fetch overall site stats
  const { data: siteStats = { totalSections: 52, editedSections: 1, summaryText: '1 of 52 sections across the site have been edited.' } } = useQuery({
    queryKey: ['website-stats'],
    queryFn: async () => await adminApi.getStats()
  });

  // Save Draft Mutation
  const saveDraftMutation = useMutation({
    mutationFn: async ({ sectionId, data }: { sectionId: string; data: any }) => {
      return await adminApi.saveSectionDraft(sectionId, activeTab, data);
    },
    onSuccess: () => {
      toast.success('Draft saved successfully');
      setEditingSection(null);
      queryClient.invalidateQueries({ queryKey: ['website-sections'] });
      queryClient.invalidateQueries({ queryKey: ['website-stats'] });
      sendIframeMessage('REFRESH_PREVIEW', {});
    },
    onError: () => toast.error('Failed to save section draft')
  });

  // Publish Section Mutation
  const publishMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      return await adminApi.publishSection(sectionId, activeTab);
    },
    onSuccess: () => {
      toast.success('Section published to live site!');
      queryClient.invalidateQueries({ queryKey: ['website-sections'] });
      queryClient.invalidateQueries({ queryKey: ['website-stats'] });
      sendIframeMessage('REFRESH_PREVIEW', {});
    }
  });

  // Revert Changes Mutation
  const revertMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      return await adminApi.revertSection(sectionId, activeTab);
    },
    onSuccess: () => {
      toast.info('Reverted changes to published version');
      queryClient.invalidateQueries({ queryKey: ['website-sections'] });
      queryClient.invalidateQueries({ queryKey: ['website-stats'] });
      sendIframeMessage('REFRESH_PREVIEW', {});
    }
  });

  // postMessage Bridge to iframe
  const sendIframeMessage = (type: string, payload: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type, ...payload }, '*');
    }
  };

  const handleShowMe = (sectionKey: string) => {
    sendIframeMessage('HIGHLIGHT_SECTION', { sectionKey });
  };

  const handleOpenEdit = (section: WebsiteSection) => {
    setEditingSection(section);
    setFormData(section.content?.draftData || {});
  };

  const getViewportWidth = () => {
    switch (deviceViewport) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] space-y-4">
      {/* Top Banner / Description */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">
            Open a page, hover any part of it and press Edit. Every block on the public website is listed here, so nothing can be left unmaintained.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
        >
          <span>Open live page</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Horizontal Tabs with Count Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar border-b border-[#1e2433]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-900/40'
                  : 'bg-[#161b26] text-slate-400 hover:text-slate-200 hover:bg-[#1e2536]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-teal-800/80 text-teal-100' : 'bg-slate-700/60 text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Two-Pane Layout: Left Sections List / Right Live Preview */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        {/* Left Pane: Sections List */}
        <div className="lg:col-span-5 flex flex-col h-full bg-[#121620] border border-[#1e2433] rounded-2xl overflow-hidden shadow-sm">
          {/* Header Summary */}
          <div className="p-4 border-b border-[#1e2433] bg-[#0e121a] space-y-1">
            <h3 className="text-sm font-semibold text-white capitalize">
              Sections on {activeTab.replace('-', ' ')}
            </h3>
            <p className="text-xs text-slate-400">
              Header, footer and contact details — these appear on every page.
            </p>
            <p className="text-[11px] text-teal-400 font-medium pt-1">
              {siteStats.summaryText}
            </p>
          </div>

          {/* Section Cards List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-32 bg-slate-800/20 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : sections.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No editable sections registered for this tab.
              </div>
            ) : (
              sections.map((sec) => (
                <div
                  key={sec.id}
                  className={`p-4 rounded-xl border transition-all ${
                    sec.content?.isEdited
                      ? 'bg-[#151b27] border-teal-500/40 shadow-sm shadow-teal-950/20'
                      : 'bg-[#141822] border-[#1e2535] hover:border-slate-700'
                  }`}
                >
                  {/* Card Title & Edited Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400">
                        <Layers size={14} />
                      </div>
                      <h4 className="text-sm font-semibold text-white">{sec.name}</h4>
                    </div>

                    {sec.content?.isEdited && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                        EDITED
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {sec.description}
                  </p>

                  {/* Last Edited By Timestamp */}
                  {sec.content?.lastEditedAt && (
                    <p className="text-[11px] text-slate-400 mt-2">
                      Last edited by {sec.content.lastEditedBy || 'Super Admin'} on{' '}
                      {new Date(sec.content.lastEditedAt).toLocaleDateString()},{' '}
                      {new Date(sec.content.lastEditedAt).toLocaleTimeString()}
                    </p>
                  )}

                  {/* Action Buttons matching screenshot */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#1e2535]">
                    {hasPermission('website_editor', 'edit') && (
                      <button
                        onClick={() => handleOpenEdit(sec)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Pencil size={13} />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleShowMe(sec.key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2130] hover:bg-[#232c3f] text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
                    >
                      <Eye size={13} />
                      <span>Show me</span>
                    </button>

                    {sec.content?.isEdited && hasPermission('website_editor', 'publish') && (
                      <button
                        onClick={() => publishMutation.mutate(sec.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/30 transition-colors"
                      >
                        <CheckCircle2 size={13} />
                        <span>Publish</span>
                      </button>
                    )}

                    {sec.content?.isEdited && (
                      <button
                        onClick={() => revertMutation.mutate(sec.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-rose-400 rounded-lg text-xs transition-colors ml-auto"
                        title="Revert to last published state"
                      >
                        <Undo2 size={13} />
                        <span>Undo my changes</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Live Public Website Preview Iframe */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#121620] border border-[#1e2433] rounded-2xl overflow-hidden shadow-sm">
          {/* Iframe Top Toolbar: Device Viewport Toggle & Refresh */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e121a] border-b border-[#1e2433]">
            <div className="flex items-center gap-1 bg-[#161b26] p-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setDeviceViewport('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceViewport === 'desktop' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor size={15} />
              </button>
              <button
                onClick={() => setDeviceViewport('tablet')}
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceViewport === 'tablet' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View"
              >
                <Tablet size={15} />
              </button>
              <button
                onClick={() => setDeviceViewport('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceViewport === 'mobile' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone size={15} />
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono">/ (Home Preview)</div>

            <button
              onClick={() => {
                if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#161b26] rounded-xl border border-slate-700/60 hover:border-slate-600"
            >
              <RotateCw size={13} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Iframe Container */}
          <div className="flex-1 bg-slate-900/60 flex items-center justify-center p-2 overflow-auto relative">
            {/* Edit Mode Floating Banner matching screenshot */}
            <div className="absolute top-4 z-20 pointer-events-none">
              <div className="px-4 py-1.5 rounded-full bg-black/85 text-white border border-teal-500/40 text-[11px] font-bold tracking-wider shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                <span>EDIT MODE · HOVER A SECTION, THEN PRESS EDIT</span>
              </div>
            </div>

            {/* Embedded Live Preview */}
            <div className={`h-full transition-all duration-300 bg-white rounded-xl shadow-xl overflow-hidden ${getViewportWidth()}`}>
              <iframe
                ref={iframeRef}
                src="/?preview=true"
                className="w-full h-full border-0"
                title="Public Site Live Preview"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Schema-Driven Edit Drawer */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg h-full bg-[#121620] border-l border-[#1e2433] shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2433] bg-[#0e121a]">
              <div>
                <h2 className="text-base font-semibold text-white">Edit: {editingSection.name}</h2>
                <p className="text-xs text-slate-400">{editingSection.description}</p>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Dynamic Fields Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm custom-scrollbar">
              {editingSection.fields?.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>

                  {field.type === 'textarea' || field.type === 'richtext' ? (
                    <textarea
                      rows={4}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                    />
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                    />
                  )}
                  {field.helperText && (
                    <p className="text-[11px] text-slate-400 mt-1">{field.helperText}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1e2433] bg-[#0e121a]">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveDraftMutation.mutate({ sectionId: editingSection.id, data: formData })}
                disabled={saveDraftMutation.isPending}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-900/30 disabled:opacity-50"
              >
                {saveDraftMutation.isPending ? 'Saving...' : 'Save Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
