import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import { Settings, Mail, FileCode, Save, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export const EmailSetupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    fromName: 'Firmitas 1 Pharma Admin',
    fromEmail: 'sales@firmitas1.com'
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ['email-setup'],
    queryFn: async () => {
      const data = (await api.get('/email/setup')).data;
      if (data.data) {
        setFormData((prev) => ({ ...prev, ...data.data }));
      }
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/email/setup', payload)).data,
    onSuccess: () => toast.success('SMTP Configuration saved'),
    onError: () => toast.error('Failed to save SMTP configuration')
  });

  return (
    <div className="max-w-2xl bg-[#121620] border border-[#1e2433] rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-white">SMTP & Transactional Email Setup</h2>
        <p className="text-xs text-slate-400">Configure outbound credentials for quotes, password resets, and notifications.</p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">SMTP Host *</label>
            <input
              type="text"
              value={formData.host}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Port</label>
            <input
              type="number"
              value={formData.port}
              onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Username / API Key</label>
            <input
              type="text"
              value={formData.user}
              onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Password / App Password</label>
            <input
              type="password"
              value={formData.pass}
              onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">From Sender Name</label>
            <input
              type="text"
              value={formData.fromName}
              onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">From Email Address</label>
            <input
              type="email"
              value={formData.fromEmail}
              onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
            />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#1e2433] flex justify-end">
        <button
          onClick={() => saveMutation.mutate(formData)}
          className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl"
        >
          <Save size={15} />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
};

export const EmailForPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: res } = useQuery({
    queryKey: ['email-mappings'],
    queryFn: async () => (await api.get('/email/mappings')).data
  });

  const mappings = res?.data || [];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-white">Email For — Event Routing</h2>
        <p className="text-xs text-slate-400">Map system triggers to department recipient lists.</p>
      </div>

      <div className="bg-[#121620] border border-[#1e2433] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#1e2433] text-[11px] font-semibold text-slate-400 uppercase bg-[#0e121a]">
              <th className="py-3 px-5">SYSTEM EVENT</th>
              <th className="py-3 px-5">RECIPIENTS</th>
              <th className="py-3 px-5">ASSIGNED TEMPLATE</th>
              <th className="py-3 px-4 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a202d] text-slate-200">
            {mappings.map((m: any) => (
              <tr key={m._id} className="hover:bg-[#161c28]">
                <td className="py-4 px-5">
                  <p className="font-semibold text-white">{m.eventName}</p>
                  <p className="text-xs text-slate-400">{m.description}</p>
                </td>
                <td className="py-4 px-5 font-mono text-xs text-teal-300">
                  {m.recipients?.join(', ') || 'sales@shreerajtraders.com'}
                </td>
                <td className="py-4 px-5 text-xs text-slate-300">{m.templateKey}</td>
                <td className="py-4 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-400">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const EmailTemplatePage: React.FC = () => {
  const { data: res } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => (await api.get('/email/templates')).data
  });

  const templates = res?.data || [];
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-4 bg-[#121620] border border-[#1e2433] rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white">Email Templates</h3>
        <div className="space-y-2">
          {templates.map((tpl: any) => (
            <button
              key={tpl._id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-colors ${
                selectedTemplate?._id === tpl._id ? 'bg-teal-950/40 border-teal-500 text-white' : 'bg-[#161b26] border-slate-700/60 text-slate-300'
              }`}
            >
              <p className="font-semibold">{tpl.name}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Subject: {tpl.subject}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8 bg-[#121620] border border-[#1e2433] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Template HTML Body & Placeholders</h3>
        {selectedTemplate ? (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Subject Line</label>
              <input
                type="text"
                readOnly
                value={selectedTemplate.subject}
                className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">HTML Preview</label>
              <div
                className="p-4 bg-white text-slate-800 rounded-xl max-h-72 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: selectedTemplate.htmlBody }}
              />
            </div>
            <div>
              <p className="text-slate-400 font-medium">Available Variables: <span className="font-mono text-teal-400">{selectedTemplate.variables?.join(', ')}</span></p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">Select a template from the left pane to preview its layout and merge tags.</p>
        )}
      </div>
    </div>
  );
};
