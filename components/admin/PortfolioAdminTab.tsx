'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader as Loader2, X, Save, Star, Briefcase, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PortfolioProject } from '@/lib/types';
import { MultiImageUpload } from './ImageUpload';
import { useAdminI18n } from '@/lib/admin-i18n-context';

const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-slate-800 text-sm focus:outline-none transition-all duration-200 focus:border-orange-400/40";
const inputStyle = { background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(15,23,42,0.12)' };

type ProjectForm = Omit<PortfolioProject, 'id' | 'created_at'> & { tech_stack_str: string };

const emptyForm = (): ProjectForm => ({
  title: '',
  title_ar: '',
  description: '',
  description_ar: '',
  client_name: '',
  client_name_ar: '',
  images: [],
  project_url: '',
  tech_stack: [],
  tech_stack_str: '',
  category: '',
  metric: '',
  color: '#f5a623',
  is_featured: false,
  display_order: 0,
});

const COLOR_OPTIONS = ['#f5a623', '#10b981', '#3b82f6', '#ec4899', '#f43f5e', '#8b5cf6', '#06b6d4'];

const normalizeExternalUrl = (value: string) => {
  const raw = value.trim();
  if (!raw) return '';
  const noLeadingSlashes = raw.replace(/^\/+/, '');
  if (/^https?:\/\//i.test(noLeadingSlashes)) return noLeadingSlashes;
  return `https://${noLeadingSlashes}`;
};

export default function PortfolioAdminTab() {
  const { t, locale } = useAdminI18n();
  const isAR = locale === 'ar';
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('portfolio_projects').select('*').order('display_order', { ascending: true });
    if (error) console.error('portfolio fetch:', error.message);
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => { setSaveError(''); setForm(emptyForm()); setEditing(null); setModal('add'); };
  const openEdit = (p: PortfolioProject) => {
    setSaveError('');
    setForm({
      title: p.title,
      title_ar: p.title_ar || '',
      description: p.description,
      description_ar: p.description_ar || '',
      client_name: p.client_name,
      client_name_ar: p.client_name_ar || '',
      images: p.images || [],
      project_url: p.project_url,
      tech_stack: p.tech_stack || [],
      tech_stack_str: (p.tech_stack || []).join(', '),
      category: p.category,
      metric: p.metric,
      color: p.color || '#f5a623',
      is_featured: p.is_featured,
      display_order: p.display_order,
    });
    setEditing(p);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); setSaveError(''); };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    const normalizedProjectUrl = normalizeExternalUrl(form.project_url);

    if (normalizedProjectUrl) {
      try {
        new URL(normalizedProjectUrl);
      } catch {
        setSaving(false);
        setSaveError(isAR ? 'رابط المشروع غير صالح. أدخل رابطًا صحيحًا مثل https://example.com' : 'Invalid project URL. Please use a valid URL like https://example.com');
        return;
      }
    }

    const payload = {
      title: form.title,
      title_ar: form.title_ar,
      description: form.description,
      description_ar: form.description_ar,
      client_name: form.client_name,
      client_name_ar: form.client_name_ar,
      images: form.images,
      project_url: normalizedProjectUrl,
      tech_stack: form.tech_stack_str.split(',').map((s) => s.trim()).filter(Boolean),
      category: form.category,
      metric: form.metric,
      color: form.color,
      is_featured: form.is_featured,
      display_order: form.display_order,
    };
    let err = null;
    if (modal === 'add') {
      const { error } = await supabase.from('portfolio_projects').insert([payload]);
      err = error;
    } else if (editing) {
      const { error } = await supabase.from('portfolio_projects').update(payload).eq('id', editing.id);
      err = error;
    }
    setSaving(false);
    if (err) {
      setSaveError(err.message);
      console.error('portfolio save:', err);
      return;
    }
    closeModal();
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from('portfolio_projects').delete().eq('id', id);
    setDeleting(null);
    fetchProjects();
  };

  const toggleFeatured = async (p: PortfolioProject) => {
    await supabase.from('portfolio_projects').update({ is_featured: !p.is_featured }).eq('id', p.id);
    fetchProjects();
  };

  const displayTitle = (p: PortfolioProject) => isAR ? (p.title_ar || p.title) : p.title;
  const displayClient = (p: PortfolioProject) => isAR ? (p.client_name_ar || p.client_name) : p.client_name;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">{t.portfolioTitle}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {t.portfolioCount.replace('{count}', String(projects.length))} · {t.featuredCount.replace('{count}', String(projects.filter(p => p.is_featured).length))}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm px-4 py-2.5">
          <Plus size={15} /> {t.addProjectBtn}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-brand-orange" size={28} /></div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.15)' }}>
            <Briefcase size={24} style={{ color: '#ec4899', opacity: 0.7 }} />
          </div>
          <p className="text-white font-semibold mb-1">{t.noProjectsYet}</p>
          <p className="text-slate-500 text-sm mb-6">{t.noProjectsSub}</p>
          <button onClick={openAdd} className="btn-primary text-sm"><Plus size={15} /> {t.addProjectBtn}</button>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div key={p.id} className="glass-card p-4 flex items-center gap-4 group hover:border-white/12 transition-all duration-200">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white p-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={displayTitle(p)} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Briefcase size={20} className="text-slate-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-white font-semibold text-sm">{displayTitle(p)}</p>
                  {p.is_featured && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(245,166,35,0.12)', color: '#f5a623', border: '1px solid rgba(245,166,35,0.2)' }}>
                      {t.statusFeatured}
                    </span>
                  )}
                  {p.metric && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: `${p.color || '#f5a623'}15`, color: p.color || '#f5a623', border: `1px solid ${p.color || '#f5a623'}25` }}>
                      {p.metric}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-xs">{displayClient(p)}{p.category ? ` · ${p.category}` : ''}</p>
                {p.images && p.images.length > 1 && (
                  <p className="text-slate-600 text-xs mt-0.5">{p.images.length} images</p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {p.project_url && (
                  <a href={p.project_url} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <ExternalLink size={13} />
                  </a>
                )}
                <button onClick={() => toggleFeatured(p)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${p.is_featured ? 'text-brand-orange' : 'text-slate-600 hover:text-slate-300'}`} style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Star size={13} fill={p.is_featured ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {deleting === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ProjectModal
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
          saveError={saveError}
          isEdit={modal === 'edit'}
        />
      )}
    </div>
  );
}

function ProjectModal({ form, setForm, onSave, onClose, saving, saveError, isEdit }: {
  form: ProjectForm;
  setForm: (f: ProjectForm) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  saveError: string;
  isEdit: boolean;
}) {
  const { t } = useAdminI18n();
  const [imagesUploading, setImagesUploading] = useState(false);
  const set = (field: keyof ProjectForm, value: string | boolean | number | string[]) =>
    setForm({ ...form, [field]: value });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-6"
        style={{ background: 'rgba(248,250,252,0.98)', border: '1px solid rgba(15,23,42,0.1)', boxShadow: '0 24px 80px rgba(15,23,42,0.16)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg" style={{ letterSpacing: '-0.02em' }}>{isEdit ? t.editProject : t.addProjectBtn}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{t.projectDetails}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <MultiImageUpload
            bucket="portfolio-images"
            currentUrls={form.images}
            onUpload={(urls) => set('images', urls)}
            onUploadingChange={setImagesUploading}
            label={t.uploadImages}
          />

          {/* Bilingual title */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.projectTitleEn}</label>
              <input className={inputCls} style={inputStyle} placeholder={t.projectTitleEnPlaceholder} value={form.title} onChange={(e) => set('title', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.projectTitleAr}</label>
              <input className={inputCls} style={inputStyle} placeholder={t.projectTitleArPlaceholder} value={form.title_ar} onChange={(e) => set('title_ar', e.target.value)} />
            </div>
          </div>

          {/* Bilingual client name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.clientNameEn}</label>
              <input className={inputCls} style={inputStyle} placeholder={t.clientNameEnPlaceholder} value={form.client_name} onChange={(e) => set('client_name', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.clientNameAr}</label>
              <input className={inputCls} style={inputStyle} placeholder={t.clientNameArPlaceholder} value={form.client_name_ar} onChange={(e) => set('client_name_ar', e.target.value)} />
            </div>
          </div>

          {/* Category, metric, URL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.category}</label>
              <input className={inputCls} style={inputStyle} placeholder="e.g. SaaS Platform" value={form.category} onChange={(e) => set('category', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.keyMetric}</label>
              <input className={inputCls} style={inputStyle} placeholder="e.g. 4x Revenue" value={form.metric} onChange={(e) => set('metric', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1.5">{t.projectUrl}</label>
              <input className={inputCls} style={inputStyle} placeholder="https://…" value={form.project_url} onChange={(e) => set('project_url', e.target.value)} />
            </div>
          </div>

          {/* Bilingual description */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.projectDescEn}</label>
              <textarea className={inputCls} style={inputStyle} rows={3} placeholder={t.projectDescEnPlaceholder} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.projectDescAr}</label>
              <textarea className={inputCls} style={inputStyle} rows={3} placeholder={t.projectDescArPlaceholder} value={form.description_ar} onChange={(e) => set('description_ar', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">{t.techStack}</label>
            <input className={inputCls} style={inputStyle} placeholder="React, Node.js, Supabase" value={form.tech_stack_str} onChange={(e) => set('tech_stack_str', e.target.value)} />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">{t.accentColor}</label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('color', c)}
                  className="w-7 h-7 rounded-full transition-all duration-150"
                  style={{ background: c, boxShadow: form.color === c ? `0 0 0 3px rgba(255,255,255,0.15), 0 0 0 5px ${c}` : 'none', transform: form.color === c ? 'scale(1.15)' : 'scale(1)' }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.displayOrder}</label>
              <input className={`${inputCls} w-24`} style={inputStyle} type="number" min={0} value={form.display_order} onChange={(e) => set('display_order', Number(e.target.value))} />
            </div>
            <div className="pt-4">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  className="w-10 h-6 rounded-full relative transition-all duration-200"
                  style={{ background: form.is_featured ? 'rgba(245,166,35,0.5)' : 'rgba(255,255,255,0.08)', border: `1px solid ${form.is_featured ? 'rgba(245,166,35,0.5)' : 'rgba(255,255,255,0.12)'}` }}
                  onClick={() => set('is_featured', !form.is_featured)}
                >
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ background: form.is_featured ? '#f5a623' : 'rgba(255,255,255,0.3)', left: form.is_featured ? '19px' : '1px' }} />
                </div>
                <span className="text-xs text-slate-400">{t.featuredOnHomepage}</span>
              </label>
            </div>
          </div>
        </div>

        {saveError && (
          <div className="mt-4 px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/25">
            <p className="text-red-600 text-xs leading-relaxed">{saveError}</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">{t.cancel}</button>
          <button
            onClick={onSave}
            disabled={saving || imagesUploading || !form.title.trim()}
            className="btn-primary flex-1"
          >
            {saving || imagesUploading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? t.saving : imagesUploading ? t.uploading : isEdit ? t.update : t.add}
          </button>
        </div>
      </div>
    </div>
  );
}
