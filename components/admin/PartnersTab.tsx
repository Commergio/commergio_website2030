'use client';

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import { Plus, Pencil, Trash2, Loader as Loader2, X, Save, Star, Globe, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Partner } from '@/lib/types';
import ImageUpload from './ImageUpload';
import { useAdminI18n } from '@/lib/admin-i18n-context';

const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-slate-800 text-sm focus:outline-none transition-all duration-200 focus:border-orange-400/40";
const inputStyle = { background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(15,23,42,0.12)' };

type PartnerForm = Omit<Partner, 'id' | 'created_at'>;

const emptyForm = (): PartnerForm => ({
  name: '',
  name_ar: '',
  description: '',
  description_ar: '',
  logo_url: '',
  website_url: '',
  is_featured: false,
  display_order: 0,
});

export default function PartnersTab() {
  const { t, locale } = useAdminI18n();
  const isAR = locale === 'ar';
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState<PartnerForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('partners').select('*').order('display_order', { ascending: true });
    if (error) console.error('partners fetch:', error.message);
    setPartners(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPartners(); }, []);

  const openAdd = () => { setSaveError(''); setForm(emptyForm()); setEditing(null); setModal('add'); };
  const openEdit = (p: Partner) => {
    setSaveError('');
    setForm({
      name: p.name,
      name_ar: p.name_ar || '',
      description: p.description,
      description_ar: p.description_ar || '',
      logo_url: p.logo_url,
      website_url: p.website_url,
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
    let err = null;
    if (modal === 'add') {
      const { error } = await supabase.from('partners').insert([form]);
      err = error;
    } else if (editing) {
      const { error } = await supabase.from('partners').update(form).eq('id', editing.id);
      err = error;
    }
    setSaving(false);
    if (err) {
      setSaveError(err.message);
      console.error('partners save:', err);
      return;
    }
    closeModal();
    fetchPartners();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from('partners').delete().eq('id', id);
    setDeleting(null);
    fetchPartners();
  };

  const toggleFeatured = async (p: Partner) => {
    await supabase.from('partners').update({ is_featured: !p.is_featured }).eq('id', p.id);
    fetchPartners();
  };

  const displayName = (p: Partner) => isAR ? (p.name_ar || p.name) : p.name;
  const displayDesc = (p: Partner) => isAR ? (p.description_ar || p.description) : p.description;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">{t.partnersTitle}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {t.partnersCount.replace('{count}', String(partners.length))} · {t.featuredCount.replace('{count}', String(partners.filter(p => p.is_featured).length))}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm px-4 py-2.5">
          <Plus size={15} /> {t.addPartnerBtn}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-brand-orange" size={28} /></div>
      ) : partners.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}>
            <Globe size={24} className="text-brand-orange opacity-60" />
          </div>
          <p className="text-white font-semibold mb-1">{t.noPartnersYet}</p>
          <p className="text-slate-500 text-sm mb-6">{t.noPartnersSub}</p>
          <button onClick={openAdd} className="btn-primary text-sm"><Plus size={15} /> {t.addPartnerBtn}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {partners.map((p) => (
            <div key={p.id} className="glass-card p-4 flex items-center gap-4 group hover:border-white/12 transition-all duration-200">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-white p-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {p.logo_url ? (
                  <img src={p.logo_url} alt={displayName(p)} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <span className="text-white font-bold text-lg">{p.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-semibold text-sm truncate">{displayName(p)}</p>
                  {p.is_featured && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ background: 'rgba(245,166,35,0.12)', color: '#f5a623', border: '1px solid rgba(245,166,35,0.2)' }}>
                      {t.statusFeatured}
                    </span>
                  )}
                </div>
                {displayDesc(p) && <p className="text-slate-500 text-xs mt-0.5 truncate">{displayDesc(p)}</p>}
                {p.website_url && (
                  <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-slate-600 hover:text-brand-orange mt-1 transition-colors">
                    <ExternalLink size={10} /> {p.website_url.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleFeatured(p)} title={t.statusFeatured} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${p.is_featured ? 'text-brand-orange' : 'text-slate-600 hover:text-slate-300'}`} style={{ background: 'rgba(255,255,255,0.05)' }}>
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
        <PartnerModal
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

function PartnerModal({ form, setForm, onSave, onClose, saving, saveError, isEdit }: {
  form: PartnerForm;
  setForm: Dispatch<SetStateAction<PartnerForm>>;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  saveError: string;
  isEdit: boolean;
}) {
  const { t } = useAdminI18n();
  const [uploading, setUploading] = useState(false);
  const set = (field: keyof PartnerForm, value: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const handleUploadingChange = useCallback((next: boolean) => setUploading(next), []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-6"
        style={{ background: 'rgba(248,250,252,0.98)', border: '1px solid rgba(15,23,42,0.1)', boxShadow: '0 24px 80px rgba(15,23,42,0.16)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg" style={{ letterSpacing: '-0.02em' }}>{isEdit ? t.editPartner : t.addPartnerBtn}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{t.partnerDetails}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <ImageUpload
            bucket="partner-logos"
            currentUrl={form.logo_url}
            onUpload={(url) => set('logo_url', url)}
            onUploadingChange={handleUploadingChange}
            label={t.uploadImage}
          />

          {/* Bilingual name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.partnerNameEn}</label>
              <input className={inputCls} style={inputStyle} placeholder={t.partnerNameEnPlaceholder} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.partnerNameAr}</label>
              <input className={inputCls} style={inputStyle} placeholder={t.partnerNameArPlaceholder} value={form.name_ar} onChange={(e) => set('name_ar', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">{t.websiteUrl}</label>
            <input className={inputCls} style={inputStyle} placeholder="https://partner.com" value={form.website_url} onChange={(e) => set('website_url', e.target.value)} />
          </div>

          {/* Bilingual description */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.descriptionEn}</label>
              <textarea className={inputCls} style={inputStyle} rows={3} placeholder={t.descEnPlaceholder} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.descriptionAr}</label>
              <textarea className={inputCls} style={inputStyle} rows={3} placeholder={t.descArPlaceholder} value={form.description_ar} onChange={(e) => set('description_ar', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.displayOrder}</label>
              <input className={inputCls} style={inputStyle} type="number" min={0} value={form.display_order} onChange={(e) => set('display_order', Number(e.target.value))} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  className="w-10 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
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
          <button onClick={onSave} disabled={saving || uploading || !form.name.trim()} className="btn-primary flex-1">
            {saving || uploading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {uploading ? t.uploading : saving ? t.saving : isEdit ? t.update : t.add}
          </button>
        </div>
      </div>
    </div>
  );
}
