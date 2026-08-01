'use client';

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import { Plus, Pencil, Trash2, Loader as Loader2, X, Save, Film, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PartnershipSigningVideo } from '@/lib/types';
import ImageUpload from './ImageUpload';
import VideoUpload from './VideoUpload';
import { useAdminI18n } from '@/lib/admin-i18n-context';

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl text-slate-800 text-sm focus:outline-none transition-all duration-200 focus:border-orange-400/40';
const inputStyle = {
  background: 'rgba(255,255,255,0.95)',
  border: '1px solid rgba(15,23,42,0.12)',
};

type VideoForm = Omit<PartnershipSigningVideo, 'id' | 'created_at'>;

const emptyForm = (): VideoForm => ({
  partner_name: '',
  partner_name_ar: '',
  title: '',
  title_ar: '',
  description: '',
  description_ar: '',
  video_url: '',
  thumbnail_url: '',
  recorded_at: null,
  is_published: true,
  display_order: 0,
});

export default function PartnershipVideosTab() {
  const { t, locale } = useAdminI18n();
  const isAR = locale === 'ar';
  const [videos, setVideos] = useState<PartnershipSigningVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<PartnershipSigningVideo | null>(null);
  const [form, setForm] = useState<VideoForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('partnership_signing_videos')
      .select(
        'id, partner_name, partner_name_ar, title, title_ar, description, description_ar, video_url, thumbnail_url, recorded_at, is_published, display_order, created_at'
      )
      .order('display_order', { ascending: true });
    if (error) console.error('signing videos fetch:', error.message);
    setVideos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openAdd = () => {
    setSaveError('');
    setForm(emptyForm());
    setEditing(null);
    setModal('add');
  };

  const openEdit = (v: PartnershipSigningVideo) => {
    setSaveError('');
    setForm({
      partner_name: v.partner_name,
      partner_name_ar: v.partner_name_ar || '',
      title: v.title,
      title_ar: v.title_ar || '',
      description: v.description,
      description_ar: v.description_ar || '',
      video_url: v.video_url,
      thumbnail_url: v.thumbnail_url,
      recorded_at: v.recorded_at,
      is_published: v.is_published,
      display_order: v.display_order,
    });
    setEditing(v);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setEditing(null);
    setSaveError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    const payload = {
      ...form,
      recorded_at: form.recorded_at || null,
    };
    let err = null;
    if (modal === 'add') {
      const { error } = await supabase.from('partnership_signing_videos').insert([payload]);
      err = error;
    } else if (editing) {
      const { error } = await supabase
        .from('partnership_signing_videos')
        .update(payload)
        .eq('id', editing.id);
      err = error;
    }
    setSaving(false);
    if (err) {
      setSaveError(err.message);
      return;
    }
    closeModal();
    fetchVideos();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from('partnership_signing_videos').delete().eq('id', id);
    setDeleting(null);
    fetchVideos();
  };

  const togglePublished = async (v: PartnershipSigningVideo) => {
    await supabase
      .from('partnership_signing_videos')
      .update({ is_published: !v.is_published })
      .eq('id', v.id);
    fetchVideos();
  };

  const displayPartner = (v: PartnershipSigningVideo) =>
    isAR ? v.partner_name_ar || v.partner_name : v.partner_name;
  const displayTitle = (v: PartnershipSigningVideo) =>
    isAR ? v.title_ar || v.title : v.title;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-white font-semibold">{t.signingVideosTitle}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {t.signingVideosCount.replace('{count}', String(videos.length))} ·{' '}
            {t.publishedCount.replace(
              '{count}',
              String(videos.filter((v) => v.is_published).length)
            )}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm px-4 py-2.5">
          <Plus size={15} /> {t.addSigningVideoBtn}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-brand-orange" size={28} />
        </div>
      ) : videos.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Film size={28} className="text-brand-orange opacity-60 mx-auto mb-4" />
          <p className="text-white font-semibold mb-1">{t.noSigningVideosYet}</p>
          <p className="text-slate-500 text-sm mb-6">{t.noSigningVideosSub}</p>
          <button onClick={openAdd} className="btn-primary text-sm">
            <Plus size={15} /> {t.addSigningVideoBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {videos.map((v) => (
            <div
              key={v.id}
              className="glass-card p-4 flex gap-4 group hover:border-white/12 transition-all duration-200"
            >
              <div
                className="w-24 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-slate-800"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {v.thumbnail_url ? (
                  <img
                    src={v.thumbnail_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film size={22} className="text-slate-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-semibold text-sm truncate">
                    {displayPartner(v)}
                  </p>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                    style={
                      v.is_published
                        ? {
                            background: 'rgba(16,185,129,0.12)',
                            color: '#10b981',
                            border: '1px solid rgba(16,185,129,0.2)',
                          }
                        : {
                            background: 'rgba(148,163,184,0.12)',
                            color: '#94a3b8',
                            border: '1px solid rgba(148,163,184,0.2)',
                          }
                    }
                  >
                    {v.is_published ? t.statusPublished : t.statusUnpublished}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5 truncate">{displayTitle(v)}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => togglePublished(v)}
                  title={v.is_published ? t.statusUnpublished : t.statusPublished}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {v.is_published ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button
                  onClick={() => openEdit(v)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  disabled={deleting === v.id}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {deleting === v.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <VideoModal
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

function VideoModal({
  form,
  setForm,
  onSave,
  onClose,
  saving,
  saveError,
  isEdit,
}: {
  form: VideoForm;
  setForm: Dispatch<SetStateAction<VideoForm>>;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  saveError: string;
  isEdit: boolean;
}) {
  const { t } = useAdminI18n();
  const [videoUploading, setVideoUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const uploading = videoUploading || thumbUploading;
  const set = (field: keyof VideoForm, value: string | boolean | number | null) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const handleVideoUploadingChange = useCallback((next: boolean) => setVideoUploading(next), []);
  const handleThumbUploadingChange = useCallback((next: boolean) => setThumbUploading(next), []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-lg max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-6"
        style={{
          background: 'rgba(248,250,252,0.98)',
          border: '1px solid rgba(15,23,42,0.1)',
          boxShadow: '0 24px 80px rgba(15,23,42,0.16)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg" style={{ letterSpacing: '-0.02em' }}>
              {isEdit ? t.editSigningVideo : t.addSigningVideoBtn}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">{t.signingVideoDetails}</p>
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
          <VideoUpload
            bucket="partnership-videos"
            currentUrl={form.video_url}
            onUpload={(url) => set('video_url', url)}
            onUploadingChange={handleVideoUploadingChange}
            label={t.uploadVideo}
            hint={t.uploadVideoHint}
          />

          <ImageUpload
            bucket="partnership-thumbnails"
            currentUrl={form.thumbnail_url}
            onUpload={(url) => set('thumbnail_url', url)}
            onUploadingChange={handleThumbUploadingChange}
            label={t.uploadThumbnail}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.partnerNameEn}</label>
              <input
                className={inputCls}
                style={inputStyle}
                placeholder={t.partnerNameEnPlaceholder}
                value={form.partner_name}
                onChange={(e) => set('partner_name', e.target.value)}
              />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.partnerNameAr}</label>
              <input
                className={inputCls}
                style={inputStyle}
                placeholder={t.partnerNameArPlaceholder}
                value={form.partner_name_ar}
                onChange={(e) => set('partner_name_ar', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.signingTitleEn}</label>
              <input
                className={inputCls}
                style={inputStyle}
                placeholder={t.signingTitleEnPlaceholder}
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
              />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.signingTitleAr}</label>
              <input
                className={inputCls}
                style={inputStyle}
                placeholder={t.signingTitleArPlaceholder}
                value={form.title_ar}
                onChange={(e) => set('title_ar', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.descriptionEn}</label>
              <textarea
                className={inputCls}
                style={inputStyle}
                rows={2}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.descriptionAr}</label>
              <textarea
                className={inputCls}
                style={inputStyle}
                rows={2}
                value={form.description_ar}
                onChange={(e) => set('description_ar', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.recordedAt}</label>
              <input
                className={inputCls}
                style={inputStyle}
                type="date"
                value={form.recorded_at || ''}
                onChange={(e) => set('recorded_at', e.target.value || null)}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.displayOrder}</label>
              <input
                className={inputCls}
                style={inputStyle}
                type="number"
                min={0}
                value={form.display_order}
                onChange={(e) => set('display_order', Number(e.target.value))}
              />
            </div>
          </div>

          <div
            className="rounded-xl px-3.5 py-3"
            style={{
              background: form.is_published ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${form.is_published ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            }}
          >
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                className="w-10 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
                style={{
                  background: form.is_published
                    ? 'rgba(16,185,129,0.5)'
                    : 'rgba(239,68,68,0.35)',
                  border: `1px solid ${form.is_published ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.4)'}`,
                }}
                onClick={() => set('is_published', !form.is_published)}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
                  style={{
                    background: form.is_published ? '#10b981' : '#ef4444',
                    left: form.is_published ? '19px' : '1px',
                  }}
                />
              </div>
              <span className={`text-xs font-medium ${form.is_published ? 'text-emerald-700' : 'text-red-600'}`}>
                {t.publishOnSite}
                {!form.is_published && ` — ${t.publishRequiredHint}`}
              </span>
            </label>
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
          <button
            onClick={onSave}
            disabled={saving || uploading || !form.partner_name.trim() || !form.video_url.trim()}
            className="btn-primary flex-1"
          >
            {saving || uploading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {uploading ? t.uploading : saving ? t.saving : isEdit ? t.update : t.add}
          </button>
        </div>
      </div>
    </div>
  );
}
