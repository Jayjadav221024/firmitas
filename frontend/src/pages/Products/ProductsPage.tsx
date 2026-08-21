import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { adminApi } from '../../api/client';
import { Product } from '../../types';
import {
  Search,
  Plus,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../store';

export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuthStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    brandName: 'Firmitas Healthcare',
    categoryKey: 'ethical',
    slug: '',
    status: 'active' as 'active' | 'inactive',
    composition: '',
    form: 'Tablet',
    rxType: 'Rx',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 25°C, protect from light',
    therapeuticUse: '',
    image: '',
    description: '',
    metaTitle: '',
    metaDescription: ''
  });

  // Fetch Products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', search, selectedCategory, selectedBrand],
    queryFn: async () => {
      return await adminApi.getProducts({ search, category: selectedCategory, brand: selectedBrand });
    }
  });

  // Fetch Categories & Brands for filters
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await adminApi.getCategories()
  });

  const brands = [
    { name: 'Firmitas Healthcare' },
    { name: 'Cipla' },
    { name: 'Sun Pharma' },
    { name: 'Dr. Reddy’s' },
    { name: 'Lupin' },
    { name: 'Mankind Pharma' }
  ];

  // Toggle status mutation (optimistic)
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      return await adminApi.toggleProductStatus(id);
    },
    onSuccess: (data) => {
      toast.success(`Status updated`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['public-catalog-products'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to toggle status')
  });

  // Save product mutation (Create / Update)
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingProduct?.id || (editingProduct as any)?._id) {
        const id = editingProduct?.id || (editingProduct as any)?._id;
        return await adminApi.updateProduct(id, payload);
      } else {
        return await adminApi.createProduct(payload);
      }
    },
    onSuccess: () => {
      toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
      setIsDrawerOpen(false);
      setEditingProduct(null);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['public-catalog-products'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to save product')
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await adminApi.deleteProduct(id);
    },
    onSuccess: () => {
      toast.success('Product deleted successfully');
      setDeleteConfirmId(null);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['public-catalog-products'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete product')
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brandName: 'Firmitas Healthcare',
      categoryKey: 'ethical',
      slug: '',
      status: 'active',
      composition: '',
      form: 'Tablet',
      rxType: 'Rx',
      packaging: '10 x 10 Blister (Box of 100)',
      storage: 'Store below 25°C, protect from light',
      therapeuticUse: '',
      image: '',
      description: '',
      metaTitle: '',
      metaDescription: ''
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      brandName: p.brandName || 'Firmitas Healthcare',
      categoryKey: p.categoryKey || p.category || 'ethical',
      slug: p.slug,
      status: p.status || 'active',
      composition: p.composition || '',
      form: p.form || 'Tablet',
      rxType: p.rxType || 'Rx',
      packaging: p.packaging || '10 x 10 Blister',
      storage: p.storage || 'Store in cool and dry place',
      therapeuticUse: p.therapeuticUse || p.use || p.description || '',
      image: p.image || '',
      description: p.description || p.therapeuticUse || '',
      metaTitle: p.metaTitle || '',
      metaDescription: p.metaDescription || ''
    });
    setIsDrawerOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingProduct ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));
  };

  return (
    <div className="space-y-5">
      {/* Top action & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search bar matching screenshot */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-700/60 bg-[#161b26] text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Column/Filter dropdown toggle */}
          <button className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-700/60 bg-[#161b26] text-slate-300 hover:text-white hover:border-slate-600 transition-all">
            <SlidersHorizontal size={14} />
            <span>Columns</span>
          </button>

          {/* Add Product Button */}
          {hasPermission('products', 'create') && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-sm shadow-teal-900/30 transition-all"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Table matching screenshot columns */}
      <div className="bg-[#121620] border border-[#1e2433] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#1e2433] text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-[#0e121a]">
                <th className="py-3.5 px-5">SR NO</th>
                <th className="py-3.5 px-4">IMAGE</th>
                <th className="py-3.5 px-5">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <span>PRODUCT NAME</span>
                    <ChevronDown size={13} />
                  </div>
                </th>
                <th className="py-3.5 px-5">BRAND NAME</th>
                <th className="py-3.5 px-5">CATEGORY KEY</th>
                <th className="py-3.5 px-5">SLUG URL</th>
                <th className="py-3.5 px-4 text-center">STATUS</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a202d] text-slate-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="py-5 px-6 bg-slate-800/10"></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                products.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-[#161c28] transition-colors group">
                    {/* SR NO */}
                    <td className="py-4 px-5 text-slate-400 font-medium text-xs">
                      {p.srNo || idx + 1}
                    </td>

                    {/* IMAGE */}
                    <td className="py-4 px-4">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          onClick={() => setPreviewImage(p.image!)}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700 cursor-pointer hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>

                    {/* PRODUCT NAME */}
                    <td className="py-4 px-5 font-semibold text-white">
                      {p.name}
                    </td>

                    {/* BRAND NAME */}
                    <td className="py-4 px-5 text-slate-300">
                      {p.brandName}
                    </td>

                    {/* CATEGORY KEY */}
                    <td className="py-4 px-5 text-slate-300 font-mono text-xs">
                      {p.categoryKey}
                    </td>

                    {/* SLUG URL */}
                    <td className="py-4 px-5 text-slate-400 font-mono text-xs truncate max-w-[160px]">
                      {p.slug}
                    </td>

                    {/* STATUS PILL BADGE */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => toggleMutation.mutate(p.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
                          p.status === 'active'
                            ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 hover:bg-teal-500/25'
                            : 'bg-slate-700/40 text-slate-400 border border-slate-600/40 hover:bg-slate-700/60'
                        }`}
                        title="Click to toggle status inline"
                      >
                        {p.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasPermission('products', 'edit') && (
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-950/40 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {hasPermission('products', 'delete') && (
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl h-full bg-[#121620] border-l border-[#1e2433] shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2433] bg-[#0e121a]">
              <h2 className="text-base font-semibold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Paracetamol Tablets IP 650mg"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Brand / Manufacturer *
                  </label>
                  <select
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Firmitas Healthcare">Firmitas Healthcare</option>
                    <option value="Cipla">Cipla</option>
                    <option value="Sun Pharma">Sun Pharma</option>
                    <option value="Dr. Reddy’s">Dr. Reddy’s</option>
                    <option value="Lupin">Lupin</option>
                    <option value="Mankind Pharma">Mankind Pharma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Division / Category *
                  </label>
                  <select
                    value={formData.categoryKey}
                    onChange={(e) => setFormData({ ...formData, categoryKey: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 font-mono text-xs"
                  >
                    <option value="ethical">ethical (Ethical & Generics)</option>
                    <option value="surgical">surgical (Surgical & Hospital Supplies)</option>
                    <option value="otc">otc (OTC Products)</option>
                    <option value="critical">critical (Critical Care)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Composition / Active Molecule
                </label>
                <input
                  type="text"
                  value={formData.composition}
                  onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                  placeholder="e.g. Paracetamol 650 mg"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Dosage Form
                  </label>
                  <select
                    value={formData.form}
                    onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="IV Fluid">IV Fluid</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Topical">Topical / Cream</option>
                    <option value="Disposable">Disposable Device</option>
                    <option value="Dressing">Dressing / Gauze</option>
                    <option value="PPE">PPE / Gloves</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Rx Classification
                  </label>
                  <select
                    value={formData.rxType}
                    onChange={(e) => setFormData({ ...formData, rxType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                  >
                    <option value="Rx">Rx (Prescription)</option>
                    <option value="OTC">OTC (Over the Counter)</option>
                    <option value="Consumable">Consumable (Surgical/Device)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Packaging / Presentation
                  </label>
                  <input
                    type="text"
                    value={formData.packaging}
                    onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                    placeholder="e.g. 10 x 10 Blister (Box of 100)"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Storage Condition
                  </label>
                  <input
                    type="text"
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    placeholder="e.g. Store below 25°C / Cold chain 2°C–8°C"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Therapeutic Use / Indication
                </label>
                <input
                  type="text"
                  value={formData.therapeuticUse}
                  onChange={(e) => setFormData({ ...formData, therapeuticUse: e.target.value })}
                  placeholder="e.g. Analgesic and antipyretic for fever and pain relief."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Slug URL (Auto-Generated / Unique) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. paracetamol-650-tablets"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Meta Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="e.g. Paracetamol Tablets - Firmitas 1"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#161b26] border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-xs"
                  >
                    <option value="active">Active (Visible on Website)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1e2433] bg-[#0e121a]">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveMutation.mutate(formData)}
                disabled={saveMutation.isPending || !formData.name}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-900/30 disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-[#121620] border border-[#1e2433] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-semibold text-white">Delete Product?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Full Size Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-2xl max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-slate-700"
          />
        </div>
      )}
    </div>
  );
};
