import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { adminApi } from '../../api/client';
import { Users, Plus, Pencil, Trash2, X, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    isActive: true
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminApi.getUsers()
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => adminApi.getRoles()
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', roleId: roles[0]?.id || 'role-1', isActive: true });
    setIsOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      roleId: user.roleId || '',
      isActive: user.isActive
    });
    setIsOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingUser?.id) {
        return await adminApi.updateUser(editingUser.id, payload);
      }
      return await adminApi.createUser(payload);
    },
    onSuccess: () => {
      toast.success(editingUser ? 'User updated' : 'User created');
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to save user')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await adminApi.deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Admin Accounts</h2>
          <p className="text-xs text-slate-400">Manage administrator and team member credentials and assigned roles.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl"
        >
          <Plus size={16} />
          <span>Add Admin User</span>
        </button>
      </div>

      <div className="bg-[#121620] border border-[#1e2433] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#1e2433] text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-[#0e121a]">
              <th className="py-3.5 px-5">USER</th>
              <th className="py-3.5 px-5">EMAIL</th>
              <th className="py-3.5 px-5">ASSIGNED ROLE</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
              <th className="py-3.5 px-5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a202d] text-slate-200">
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-[#161c28] transition-colors">
                <td className="py-4 px-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-950/80 border border-teal-500/40 flex items-center justify-center font-bold text-teal-300 text-xs">
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold text-white">{u.name}</span>
                </td>
                <td className="py-4 px-5 text-slate-300 text-xs">{u.email}</td>
                <td className="py-4 px-5">
                  <span className="px-2.5 py-1 rounded-lg bg-[#1a2232] border border-slate-700/60 text-xs text-teal-300 font-medium">
                    {u.roleName}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.isActive ? 'bg-teal-500/15 text-teal-400' : 'bg-slate-700/40 text-slate-400'}`}>
                    {u.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenEdit(u)} className="p-1.5 text-slate-400 hover:text-teal-400">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteMutation.mutate(u.id)} className="p-1.5 text-slate-400 hover:text-rose-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#121620] border border-[#1e2433] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2433] pb-3">
              <h3 className="text-base font-semibold text-white">{editingUser ? 'Edit User' : 'New Admin User'}</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Role *</label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  >
                    {roles.map((r: any) => (
                      <option key={r._id || r.id} value={r._id || r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Account Status</label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  >
                    <option value="true">Active</option>
                    <option value="false">Deactivated</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#1e2433]">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs">Cancel</button>
              <button onClick={() => saveMutation.mutate(formData)} className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl">Save User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
