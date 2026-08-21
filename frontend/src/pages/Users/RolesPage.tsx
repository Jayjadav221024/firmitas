import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { adminApi } from '../../api/client';
import { ShieldCheck, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const MODULES = [
  'dashboard', 'users', 'roles', 'email_setup', 'email_for', 'email_template',
  'website_editor', 'products', 'categories', 'testimonials', 'faqs', 'blogs',
  'inquiries', 'job_openings', 'job_applications', 'audit_logs'
];

export const RolesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [matrix, setMatrix] = useState<Record<string, any>>({});

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => adminApi.getRoles()
  });

  const handleOpenEdit = (role: any) => {
    setEditingRole(role);
    setName(role.name);
    setDescription(role.description || '');
    setMatrix(role.permissions || {});
    setIsOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingRole(null);
    setName('');
    setDescription('');
    const initial: Record<string, any> = {};
    MODULES.forEach((m) => {
      initial[m] = { view: true, create: false, edit: false, delete: false, publish: false };
    });
    setMatrix(initial);
    setIsOpen(true);
  };

  const togglePermission = (mod: string, action: string) => {
    setMatrix((prev) => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [action]: !prev[mod]?.[action]
      }
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { name, description, permissions: matrix };
      if (editingRole?.id || editingRole?._id) {
        const id = editingRole.id || editingRole._id;
        return await adminApi.updateRole(id, payload);
      }
      return await adminApi.createRole(payload);
    },
    onSuccess: () => {
      toast.success(editingRole ? 'Role updated' : 'Role created');
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to save role')
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">User Roles & RBAC Permissions Matrix</h2>
          <p className="text-xs text-slate-400">Configure fine-grained module actions (view, create, edit, delete, publish) per role.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl"
        >
          <Plus size={16} />
          <span>Add Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r: any) => (
          <div key={r._id || r.id} className="p-5 rounded-2xl bg-[#121620] border border-[#1e2433] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{r.name}</h3>
                  <p className="text-xs text-slate-400">{r.description || 'Custom administrative role'}</p>
                </div>
              </div>
              <button onClick={() => handleOpenEdit(r)} className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:text-white">
                Edit Matrix
              </button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl bg-[#121620] border border-[#1e2433] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2433]">
              <h3 className="text-base font-semibold text-white">{editingRole ? `Edit Permissions: ${editingRole.name}` : 'Create Role'}</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Role Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="border border-[#1e2433] rounded-xl overflow-hidden mt-4">
                <table className="w-full text-left">
                  <thead className="bg-[#0e121a] text-[11px] uppercase text-slate-400 font-semibold border-b border-[#1e2433]">
                    <tr>
                      <th className="py-2.5 px-4">MODULE</th>
                      <th className="py-2.5 px-3 text-center">VIEW</th>
                      <th className="py-2.5 px-3 text-center">CREATE</th>
                      <th className="py-2.5 px-3 text-center">EDIT</th>
                      <th className="py-2.5 px-3 text-center">DELETE</th>
                      <th className="py-2.5 px-3 text-center">PUBLISH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a202d]">
                    {MODULES.map((m) => (
                      <tr key={m} className="hover:bg-[#161b26]">
                        <td className="py-2.5 px-4 font-mono text-xs capitalize">{m.replace('_', ' ')}</td>
                        {['view', 'create', 'edit', 'delete', 'publish'].map((act) => (
                          <td key={act} className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={!!matrix[m]?.[act]}
                              onChange={() => togglePermission(m, act)}
                              className="rounded border-slate-700 bg-slate-800 text-teal-600 focus:ring-teal-500 cursor-pointer"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#1e2433]">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs">Cancel</button>
              <button onClick={() => saveMutation.mutate()} className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl">Save Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
