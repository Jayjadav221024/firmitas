import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { adminApi } from '../../api/client';
import {
  Inbox,
  Briefcase,
  UserCheck,
  MessageSquareQuote,
  HelpCircle,
  BookOpen,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

// ---------------------- DASHBOARD ----------------------
export const DashboardPage: React.FC = () => {
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: () => adminApi.getProducts() });
  const { data: inqs = [] } = useQuery({ queryKey: ['inquiries'], queryFn: () => adminApi.getInquiries() });
  const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: () => adminApi.getJobOpenings() });
  const { data: apps = [] } = useQuery({ queryKey: ['job-apps'], queryFn: () => adminApi.getJobApplications() });

  const statCards = [
    { label: 'Pharmaceutical Products', value: products.length, desc: 'Lines in Firmitas catalog', icon: FileText, color: 'text-teal-400' },
    { label: 'Active Quotations / RFQs', value: inqs.length, desc: 'Pending hospital/store inquiries', icon: Inbox, color: 'text-sky-400' },
    { label: 'Open Job Positions', value: jobs.length, desc: 'Active hiring listings', icon: Briefcase, color: 'text-amber-400' },
    { label: 'Candidate Applications', value: apps.length, desc: 'Received CVs this week', icon: UserCheck, color: 'text-indigo-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="p-5 rounded-2xl bg-[#121620] border border-[#1e2433] space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">{card.label}</span>
                <Icon size={18} className={card.color} />
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <p className="text-[11px] text-slate-400">{card.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#121620] border border-[#1e2433] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Recent RFQs / Inquiries</h3>
          <div className="divide-y divide-[#1a202d]">
            {inqs.slice(0, 4).map((inq: any) => (
              <div key={inq.id || inq._id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{inq.name} ({inq.company})</p>
                  <p className="text-slate-400 text-[11px] font-mono">{inq.email} · {inq.phone}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-teal-500/15 text-teal-400">
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#121620] border border-[#1e2433] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Catalog Divisions Overview</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#161b26] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-white">Ethical & Generic Drugs</span>
              <span className="text-teal-400 font-bold">{products.filter((p: any) => p.categoryKey === 'ethical').length} Lines</span>
            </div>
            <div className="p-3 bg-[#161b26] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-white">Surgical & Hospital Supplies</span>
              <span className="text-teal-400 font-bold">{products.filter((p: any) => p.categoryKey === 'surgical').length} Lines</span>
            </div>
            <div className="p-3 bg-[#161b26] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-white">OTC & Health Supplements</span>
              <span className="text-teal-400 font-bold">{products.filter((p: any) => p.categoryKey === 'otc').length} Lines</span>
            </div>
            <div className="p-3 bg-[#161b26] rounded-xl flex items-center justify-between">
              <span className="font-semibold text-white">Critical Care & Cold Chain</span>
              <span className="text-teal-400 font-bold">{products.filter((p: any) => p.categoryKey === 'critical').length} Lines</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------- JOB OPENINGS (WITH FULL CRUD) ----------------------
export const JobOpeningsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Hospital & Institutional Supply',
    location: 'Ahmedabad / Gujarat',
    description: '',
    status: 'open'
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => adminApi.getJobOpenings()
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingJob?.id || editingJob?._id) {
        const id = editingJob.id || editingJob._id;
        return await adminApi.updateJobOpening(id, formData);
      }
      return await adminApi.createJobOpening(formData);
    },
    onSuccess: () => {
      toast.success(editingJob ? 'Job position updated' : 'New job position posted');
      setIsOpen(false);
      setEditingJob(null);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to save job opening')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await adminApi.deleteJobOpening(id),
    onSuccess: () => {
      toast.success('Job opening deleted');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete job opening')
  });

  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: 'Hospital & Institutional Supply',
      location: 'Ahmedabad / Gujarat',
      description: '',
      status: 'open'
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (job: any) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      description: job.description,
      status: job.status || 'open'
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Career Openings</h2>
          <p className="text-xs text-slate-400">Manage published job vacancies and requirements for sales & warehouse staff.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl"
        >
          <Plus size={16} />
          <span>Post New Opening</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((j: any) => (
          <div key={j.id || j._id} className="p-5 rounded-2xl bg-[#121620] border border-[#1e2433] space-y-3 relative group">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{j.title}</h3>
                <p className="text-xs text-teal-400 font-medium">{j.department} · {j.location}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${j.status === 'open' ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-700 text-slate-300'}`}>
                {j.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{j.description}</p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1a202d]">
              <button onClick={() => handleOpenEdit(j)} className="p-1.5 text-slate-400 hover:text-teal-400">
                <Pencil size={15} />
              </button>
              <button onClick={() => deleteMutation.mutate(j.id || j._id)} className="p-1.5 text-slate-400 hover:text-rose-400">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#121620] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e2433] pb-3">
              <h3 className="text-base font-semibold text-white">{editingJob ? 'Edit Opening' : 'Post Opening'}</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Position Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  placeholder="e.g. Hospital Sales Executive"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Role Description *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#1e2433]">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs">Cancel</button>
              <button onClick={() => saveMutation.mutate()} className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------- JOB APPLICATIONS (WITH STATUS PIPELINE) ----------------------
export const JobApplicationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: apps = [] } = useQuery({
    queryKey: ['job-apps'],
    queryFn: () => adminApi.getJobApplications()
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await adminApi.updateJobApplicationStatus(id, status);
    },
    onSuccess: () => {
      toast.success('Applicant status updated');
      queryClient.invalidateQueries({ queryKey: ['job-apps'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update applicant status')
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-white">Job Applications</h2>
        <p className="text-xs text-slate-400">Review received CVs and manage applicant screening pipeline.</p>
      </div>

      <div className="bg-[#121620] border border-[#1e2433] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#1e2433] text-[11px] font-semibold text-slate-400 uppercase bg-[#0e121a]">
              <th className="py-3.5 px-5">CANDIDATE</th>
              <th className="py-3.5 px-5">ROLE APPLIED</th>
              <th className="py-3.5 px-5">CONTACT</th>
              <th className="py-3.5 px-5">EXPERIENCE / NOTE</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a202d] text-slate-200">
            {apps.map((a: any) => (
              <tr key={a.id || a._id} className="hover:bg-[#161c28]">
                <td className="py-4 px-5 font-semibold text-white">{a.name}</td>
                <td className="py-4 px-5 text-xs text-teal-300 font-medium">{a.jobTitle}</td>
                <td className="py-4 px-5 text-xs text-slate-400">{a.email} · {a.phone}</td>
                <td className="py-4 px-5 text-xs text-slate-400 max-w-xs truncate">{a.coverNote || '—'}</td>
                <td className="py-4 px-4 text-center">
                  <select
                    value={a.status}
                    onChange={(e) => updateMutation.mutate({ id: a.id || a._id, status: e.target.value })}
                    className="px-2.5 py-1 rounded-lg bg-[#161b26] border border-slate-700 text-xs text-teal-400 font-medium"
                  >
                    <option value="new">New</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------------------- INQUIRIES / RFQS (WITH PIPELINE UPDATE) ----------------------
export const InquiriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: inquiries = [] } = useQuery({
    queryKey: ['inquiries'],
    queryFn: () => adminApi.getInquiries()
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await adminApi.updateInquiryStatus(id, status);
    },
    onSuccess: () => {
      toast.success('Inquiry status updated');
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update inquiry status')
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-white">Inquiries & Quote Requests (RFQs)</h2>
        <p className="text-xs text-slate-400">Incoming B2B requirements from hospital and pharmacy enquiry forms.</p>
      </div>

      <div className="bg-[#121620] border border-[#1e2433] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#1e2433] text-[11px] font-semibold text-slate-400 uppercase bg-[#0e121a]">
              <th className="py-3.5 px-5">BUYER & ENTITY</th>
              <th className="py-3.5 px-5">CONTACT</th>
              <th className="py-3.5 px-5">REQUESTED LINES</th>
              <th className="py-3.5 px-5">MESSAGE</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a202d] text-slate-200">
            {inquiries.map((inq: any) => (
              <tr key={inq.id || inq._id} className="hover:bg-[#161c28]">
                <td className="py-4 px-5">
                  <p className="font-semibold text-white">{inq.name}</p>
                  <p className="text-xs text-slate-400">{inq.company}</p>
                </td>
                <td className="py-4 px-5 text-xs text-slate-300">
                  <p>{inq.email}</p>
                  <p className="text-slate-400 font-mono">{inq.phone}</p>
                </td>
                <td className="py-4 px-5 text-xs font-mono text-teal-300">{inq.products?.join(', ') || 'General Pharma Supply'}</td>
                <td className="py-4 px-5 text-xs text-slate-400 max-w-xs">{inq.message || '—'}</td>
                <td className="py-4 px-4 text-center">
                  <select
                    value={inq.status}
                    onChange={(e) => updateMutation.mutate({ id: inq.id || inq._id, status: e.target.value })}
                    className="px-2.5 py-1 rounded-lg bg-[#161b26] border border-slate-700 text-xs text-teal-400 font-medium"
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------------------- FAQS (FULL CRUD) ----------------------
export const FAQsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', category: 'General' });

  const { data: faqs = [] } = useQuery({ queryKey: ['faqs'], queryFn: () => adminApi.getFaqs() });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingFaq?.id || editingFaq?._id) {
        return await adminApi.updateFaq(editingFaq.id || editingFaq._id, formData);
      }
      return await adminApi.createFaq(formData);
    },
    onSuccess: () => {
      toast.success(editingFaq ? 'FAQ updated' : 'FAQ created');
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to save FAQ')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await adminApi.deleteFaq(id),
    onSuccess: () => {
      toast.success('FAQ deleted');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete FAQ')
  });

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: 'General' });
    setIsOpen(true);
  };

  const handleOpenEdit = (faq: any) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer, category: faq.category || 'General' });
    setIsOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Questions and answers shown on the public Firmitas website.</p>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl">
          <Plus size={16} /><span>Add FAQ</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((f: any) => (
          <div key={f.id || f._id} className="p-4 rounded-xl bg-[#121620] border border-[#1e2433] flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950/60 text-teal-400 border border-teal-500/20">{f.category}</span>
              <h4 className="text-sm font-semibold text-white pt-1">{f.question}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{f.answer}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => handleOpenEdit(f)} className="p-1.5 text-slate-400 hover:text-teal-400"><Pencil size={15} /></button>
              <button onClick={() => deleteMutation.mutate(f.id || f._id)} className="p-1.5 text-slate-400 hover:text-rose-400"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#121620] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e2433] pb-3">
              <h3 className="text-base font-semibold text-white">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#1e2433]">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs">Cancel</button>
              <button onClick={() => saveMutation.mutate()} className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------- TESTIMONIALS (FULL CRUD) ----------------------
export const TestimonialsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', company: '', quote: '', rating: 5 });

  const { data: testimonials = [] } = useQuery({ queryKey: ['testimonials'], queryFn: () => adminApi.getTestimonials() });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingItem?.id || editingItem?._id) {
        return await adminApi.updateTestimonial(editingItem.id || editingItem._id, formData);
      }
      return await adminApi.createTestimonial(formData);
    },
    onSuccess: () => {
      toast.success(editingItem ? 'Testimonial updated' : 'Testimonial created');
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to save testimonial')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await adminApi.deleteTestimonial(id),
    onSuccess: () => {
      toast.success('Testimonial deleted');
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete testimonial')
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', company: '', quote: '', rating: 5 });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ name: item.name, company: item.company, quote: item.quote, rating: item.rating || 5 });
    setIsOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Client Testimonials</h2>
          <p className="text-xs text-slate-400">Hospital and pharmacy client feedback.</p>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl">
          <Plus size={16} /><span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t: any) => (
          <div key={t.id || t._id} className="p-5 rounded-2xl bg-[#121620] border border-[#1e2433] space-y-3">
            <p className="text-xs italic text-slate-300 leading-relaxed">"{t.quote}"</p>
            <div className="flex items-center justify-between pt-2 border-t border-[#1a202d]">
              <div>
                <p className="text-xs font-semibold text-white">{t.name}</p>
                <p className="text-[11px] text-teal-400">{t.company}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleOpenEdit(t)} className="p-1.5 text-slate-400 hover:text-teal-400"><Pencil size={15} /></button>
                <button onClick={() => deleteMutation.mutate(t.id || t._id)} className="p-1.5 text-slate-400 hover:text-rose-400"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#121620] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e2433] pb-3">
              <h3 className="text-base font-semibold text-white">{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Hospital / Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Quote / Review *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#1e2433]">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs">Cancel</button>
              <button onClick={() => saveMutation.mutate()} className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------- BLOGS (FULL CRUD) ----------------------
export const BlogsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', body: '', author: 'Firmitas Editorial' });

  const { data: blogs = [] } = useQuery({ queryKey: ['blogs'], queryFn: () => adminApi.getBlogs() });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingBlog?.id || editingBlog?._id) {
        return await adminApi.updateBlog(editingBlog.id || editingBlog._id, formData);
      }
      return await adminApi.createBlog(formData);
    },
    onSuccess: () => {
      toast.success(editingBlog ? 'Article updated' : 'Article published');
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to save article')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await adminApi.deleteBlog(id),
    onSuccess: () => {
      toast.success('Article deleted');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete article')
  });

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormData({ title: '', slug: '', body: '', author: 'Firmitas Editorial' });
    setIsOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBlog(b);
    setFormData({ title: b.title, slug: b.slug, body: b.body, author: b.author || 'Firmitas Editorial' });
    setIsOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Articles & Insights</h2>
          <p className="text-xs text-slate-400">Pharmaceutical compliance guides and industry insights.</p>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl">
          <Plus size={16} /><span>New Article</span>
        </button>
      </div>

      <div className="space-y-3">
        {blogs.map((b: any) => (
          <div key={b.id || b._id} className="p-4 rounded-xl bg-[#121620] border border-[#1e2433] flex items-start justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white">{b.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{b.body}</p>
              <p className="text-[11px] text-teal-400 mt-2 font-mono">By {b.author} · Slug: {b.slug}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => handleOpenEdit(b)} className="p-1.5 text-slate-400 hover:text-teal-400"><Pencil size={15} /></button>
              <button onClick={() => deleteMutation.mutate(b.id || b._id)} className="p-1.5 text-slate-400 hover:text-rose-400"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-[#121620] border border-[#1e2433] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1e2433] pb-3">
              <h3 className="text-base font-semibold text-white">{editingBlog ? 'Edit Article' : 'New Article'}</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: editingBlog ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Slug URL</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Article Content *</label>
                <textarea
                  rows={5}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#161b26] border border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#1e2433]">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs">Cancel</button>
              <button onClick={() => saveMutation.mutate()} className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
