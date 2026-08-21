import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { adminApi } from '../../api/client';
import { Plus, Pencil, Trash2, X, FolderTree } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../store';

export const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    parentCategory: '',
    displayOrder: 0,
    isActive: true
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => adminApi.getCategories()
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingCat?._id || editingCat?.id) {
        const id = editingCat._id || editingCat.id;
        return await adminApi.updateCategory(id, payload);
      }
      return await adminApi.createCategory(payload);
    },
    onSuccess: () => {
      toast.success(editingCat ? 'Category updated' : 'Category created');
      setIsOpen(false);
      setEditingCat(null);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to save category')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await adminApi.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete category')
  });

  const handleOpenCreate = () => {
    setEditingCat(null);
    setFormData({ name: '', key: '', parentCategory: '', displayOrder: categories.length + 1, isActive: true });
    setIsOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      key: cat.key,
      parentCategory: cat.parentCategory?._id || '',
      displayOrder: cat.displayOrder || 0,
      isActive: cat.isActive !== undefined ? cat.isActive : true
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Product Categories</h2>
          <p className="text-xs text-slate-400">Hierarchical category keys used across catalog and website filters.</p>
        </div>
        {hasPermission('categories', 'create') && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      <div className="bg-[#121620] border border-[#1e2433] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#1e2433] text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-[#0e121a]">
              <th className="py-3.5 px-5">NAME</th>
              <th className="py-3.5 px-5">CATEGORY KEY (SLUG)</th>
              <th className="py-3.5 px-5">PARENT CATEGORY</th>
              <th className="py-3.5 px-4 text-center">DISPLAY ORDER</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
              <th className="py-3.5 px-5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a202d] text-slate-200">
            {categories.map((cat: any) => (
              <tr key={cat._id || cat.id} className="hover:bg-[#161c28] transition-colors">
                <td className="py-4 px-5 font-semibold text-white flex items-center gap-2">
                  <FolderTree size={16} className="text-teal-400" />
                  <span>{cat.name}</span>
                </td>
                <td className="py-4 px-5 font-mono text-xs text-teal-300">{cat.key}</td>
                <td className="py-4 px-5 text-slate-400 text-xs">{cat.parentCategory?.name || '—'}</td>
                <td className="py-4 px-4 text-center text-xs text-slate-300">{cat.displayOrder}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cat.isActive ? 'bg-teal-500/15 text-teal-400' : 'bg-slate-700/40 text-slate-400'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenEdit(cat)} className="p-1.5 text-slate-400 hover:text-teal-400">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteMutation.mutate(cat._id || cat.id)} className="p-1.5 text-slate-400 hover:text-rose-400">
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
              <h3 className="text-base font-semibold text-white">{editingCat ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, key: editingCat ? formData.key : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Category Key (Slug) *</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Status</label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#1e2433]">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs">Cancel</button>
              <button onClick={() => saveMutation.mutate(formData)} className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
