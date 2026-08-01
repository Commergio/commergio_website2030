'use client';

import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { Plus, Pencil, Trash2, Loader as Loader2, X, Save, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { CompanyService } from '@/lib/types';
import { useAdminI18n } from '@/lib/admin-i18n-context';
import { SERVICE_ICON_OPTIONS, getServiceIcon } from '@/lib/service-icons';
import { linesToList, listToLines, slugifyTitle } from '@/lib/services-fallback';

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl text-slate-800 text-sm focus:outline-none transition-all duration-200 focus:border-orange-400/40';
const inputStyle = { background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(15,23,42,0.12)' };

type ServiceForm = {
  title: string;
  title_ar: string;
  short_description: string;
  short_description_ar: string;
  description: string;
  description_ar: string;
  slug: string;
  icon: string;
  color: string;
  category: string;
  category_ar: string;
  benefits_text: string;
  benefits_ar_text: string;
  process_text: string;
  process_ar_text: string;
  ecosystem_angle: number;
  show_on_homepage: boolean;
  is_published: boolean;
  display_order: number;
};

const emptyForm = (): ServiceForm => ({
  title: '',
  title_ar: '',
  short_description: '',
  short_description_ar: '',
  description: '',
  description_ar: '',
  slug: '',
  icon: 'Globe',
  color: '#3b82f6',
  category: '',
  category_ar: '',
  benefits_text: '',
  benefits_ar_text: '',
  process_text: '',
  process_ar_text: '',
  ecosystem_angle: 0,
  show_on_homepage: true,
  is_published: true,
  display_order: 0,
});

function toForm(s: CompanyService): ServiceForm {
  return {
    title: s.title,
    title_ar: s.title_ar,
    short_description: s.short_description,
    short_description_ar: s.short_description_ar,
    description: s.description,
    description_ar: s.description_ar,
    slug: s.slug,
    icon: s.icon,
    color: s.color,
    category: s.category,
    category_ar: s.category_ar,
    benefits_text: listToLines(s.benefits),
    benefits_ar_text: listToLines(s.benefits_ar),
    process_text: listToLines(s.process),
    process_ar_text: listToLines(s.process_ar),
    ecosystem_angle: s.ecosystem_angle,
    show_on_homepage: s.show_on_homepage,
    is_published: s.is_published,
    display_order: s.display_order,
  };
}

function toPayload(form: ServiceForm) {
  return {
    title: form.title.trim(),
    title_ar: form.title_ar.trim(),
    short_description: form.short_description.trim(),
    short_description_ar: form.short_description_ar.trim(),
    description: form.description.trim(),
    description_ar: form.description_ar.trim(),
    slug: form.slug.trim() || slugifyTitle(form.title),
    icon: form.icon,
    color: form.color,
    category: form.category.trim(),
    category_ar: form.category_ar.trim(),
    benefits: linesToList(form.benefits_text),
    benefits_ar: linesToList(form.benefits_ar_text),
    process: linesToList(form.process_text),
    process_ar: linesToList(form.process_ar_text),
    ecosystem_angle: form.ecosystem_angle,
    show_on_homepage: form.show_on_homepage,
    is_published: form.is_published,
    display_order: form.display_order,
  };
}

export default function ServicesTab() {
  const { t, locale } = useAdminI18n();
  const isAR = locale === 'ar';
  const [services, setServices] = useState<CompanyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<CompanyService | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('company_services')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) console.error('company_services fetch:', error.message);
    setServices((data || []).map((row) => row as CompanyService));
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAdd = () => {
    setSaveError('');
    setForm(emptyForm());
    setEditing(null);
    setModal('add');
  };

  const openEdit = (s: CompanyService) => {
    setSaveError('');
    setForm(toForm(s));
    setEditing(s);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setEditing(null);
    setSaveError('');
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setSaveError(t.serviceNameRequired);
      return;
    }
    setSaving(true);
    setSaveError('');
    const payload = toPayload(form);
    let err = null;
    if (modal === 'add') {
      const { error } = await supabase.from('company_services').insert([payload]);
      err = error;
    } else if (editing) {
      const { error } = await supabase.from('company_services').update(payload).eq('id', editing.id);
      err = error;
    }
    setSaving(false);
    if (err) {
      setSaveError(err.message);
      return;
    }
    closeModal();
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from('company_services').delete().eq('id', id);
    setDeleting(null);
    fetchServices();
  };

  const togglePublished = async (s: CompanyService) => {
    await supabase.from('company_services').update({ is_published: !s.is_published }).eq('id', s.id);
    fetchServices();
  };

  const displayName = (s: CompanyService) => (isAR ? s.title_ar || s.title : s.title);
  const displayDesc = (s: CompanyService) =>
    isAR ? s.short_description_ar || s.short_description : s.short_description;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-white font-semibold">{t.servicesTitle}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {t.servicesCount.replace('{count}', String(services.length))} ·{' '}
            {t.publishedCount.replace('{count}', String(services.filter((s) => s.is_published).length))}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm px-4 py-2.5">
          <Plus size={15} /> {t.addServiceBtn}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-brand-orange" size={28} />
        </div>
      ) : services.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}
          >
            <Layers size={24} className="text-brand-orange opacity-60" />
          </div>
          <p className="text-white font-semibold mb-1">{t.noServicesYet}</p>
          <p className="text-slate-500 text-sm mb-6">{t.noServicesSub}</p>
          <button onClick={openAdd} className="btn-primary text-sm">
            <Plus size={15} /> {t.addServiceBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((s) => {
            const Icon = getServiceIcon(s.icon);
            return (
              <div key={s.id} className="glass-card p-4 flex gap-4 group hover:border-white/12 transition-all duration-200">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${s.color}25 0%, ${s.color}08 100%)`,
                    border: `1px solid ${s.color}30`,
                  }}
                >
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-white font-semibold text-sm truncate">{displayName(s)}</p>
                    {!s.is_published && (
                      <span className="text-xs px-1.5 py-0.5 rounded-md font-medium text-slate-500 border border-slate-300/30">
                        {t.statusUnpublished}
                      </span>
                    )}
                    {s.show_on_homepage && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                        style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}
                      >
                        {t.onHomepage}
                      </span>
                    )}
                  </div>
                  {s.category && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mb-1"
                      style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}25` }}
                    >
                      {isAR ? s.category_ar || s.category : s.category}
                    </span>
                  )}
                  {displayDesc(s) && <p className="text-slate-500 text-xs line-clamp-2">{displayDesc(s)}</p>}
                </div>
                <div className="flex items-start gap-1 flex-shrink-0">
                  <button
                    onClick={() => togglePublished(s)}
                    className={`text-xs px-2 py-1 rounded-lg transition-all ${s.is_published ? 'text-emerald-600' : 'text-slate-500'}`}
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    {s.is_published ? t.statusPublished : t.statusUnpublished}
                  </button>
                  <button
                    onClick={() => openEdit(s)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    {deleting === s.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <ServiceModal
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

function ServiceModal({
  form,
  setForm,
  onSave,
  onClose,
  saving,
  saveError,
  isEdit,
}: {
  form: ServiceForm;
  setForm: Dispatch<SetStateAction<ServiceForm>>;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  saveError: string;
  isEdit: boolean;
}) {
  const { t } = useAdminI18n();
  const set = (field: keyof ServiceForm, value: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const Icon = getServiceIcon(form.icon);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-6"
        style={{
          background: 'rgba(248,250,252,0.98)',
          border: '1px solid rgba(15,23,42,0.1)',
          boxShadow: '0 24px 80px rgba(15,23,42,0.16)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg" style={{ letterSpacing: '-0.02em' }}>
              {isEdit ? t.editService : t.addServiceBtn}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">{t.serviceDetails}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.serviceNameEn}</label>
              <input
                className={inputCls}
                style={inputStyle}
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({
                    ...form,
                    title,
                    slug: form.slug || slugifyTitle(title),
                  });
                }}
              />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.serviceNameAr}</label>
              <input className={inputCls} style={inputStyle} value={form.title_ar} onChange={(e) => set('title_ar', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-500 mb-1.5">{t.serviceSlug}</label>
              <input className={inputCls} style={inputStyle} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.serviceIcon}</label>
              <select className={inputCls} style={inputStyle} value={form.icon} onChange={(e) => set('icon', e.target.value)}>
                {SERVICE_ICON_OPTIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.serviceColor}</label>
              <input className={inputCls} style={inputStyle} type="color" value={form.color} onChange={(e) => set('color', e.target.value)} />
            </div>
          </div>

          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: `${form.color}10`, border: `1px solid ${form.color}25` }}
          >
            <Icon size={20} style={{ color: form.color }} />
            <span className="text-xs text-slate-600">{t.iconPreview}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.category} (EN)</label>
              <input className={inputCls} style={inputStyle} value={form.category} onChange={(e) => set('category', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.category} (AR)</label>
              <input className={inputCls} style={inputStyle} value={form.category_ar} onChange={(e) => set('category_ar', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.shortDescEn}</label>
              <input className={inputCls} style={inputStyle} value={form.short_description} onChange={(e) => set('short_description', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.shortDescAr}</label>
              <input className={inputCls} style={inputStyle} value={form.short_description_ar} onChange={(e) => set('short_description_ar', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.fullDescEn}</label>
              <textarea className={inputCls} style={inputStyle} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.fullDescAr}</label>
              <textarea className={inputCls} style={inputStyle} rows={3} value={form.description_ar} onChange={(e) => set('description_ar', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.benefitsEn}</label>
              <textarea className={inputCls} style={inputStyle} rows={4} value={form.benefits_text} onChange={(e) => set('benefits_text', e.target.value)} placeholder={t.onePerLine} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.benefitsAr}</label>
              <textarea className={inputCls} style={inputStyle} rows={4} value={form.benefits_ar_text} onChange={(e) => set('benefits_ar_text', e.target.value)} placeholder={t.onePerLine} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.processEn}</label>
              <textarea className={inputCls} style={inputStyle} rows={4} value={form.process_text} onChange={(e) => set('process_text', e.target.value)} placeholder={t.onePerLine} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.processAr}</label>
              <textarea className={inputCls} style={inputStyle} rows={4} value={form.process_ar_text} onChange={(e) => set('process_ar_text', e.target.value)} placeholder={t.onePerLine} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.displayOrder}</label>
              <input className={inputCls} style={inputStyle} type="number" min={0} value={form.display_order} onChange={(e) => set('display_order', Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.ecosystemAngle}</label>
              <input className={inputCls} style={inputStyle} type="number" min={0} max={360} value={form.ecosystem_angle} onChange={(e) => set('ecosystem_angle', Number(e.target.value))} />
            </div>
            <div className="space-y-2 pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-500">
                <input type="checkbox" checked={form.show_on_homepage} onChange={(e) => set('show_on_homepage', e.target.checked)} />
                {t.showOnHomepage}
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-500">
                <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} />
                {t.publishOnSite}
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
          <button onClick={onClose} className="btn-secondary flex-1">
            {t.cancel}
          </button>
          <button onClick={onSave} disabled={saving || !form.title.trim()} className="btn-primary flex-1">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? t.saving : isEdit ? t.update : t.add}
          </button>
        </div>
      </div>
    </div>
  );
}
