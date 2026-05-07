'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader as Loader2, X, Save, Star, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ImageUpload from './ImageUpload';
import { useAdminI18n } from '@/lib/admin-i18n-context';

const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-slate-800 text-sm focus:outline-none transition-all duration-200 focus:border-orange-400/40";
const inputStyle = { background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(15,23,42,0.12)' };

const CATEGORIES = ['SaaS', 'Platform', 'Tool', 'Mobile App', 'API', 'Other'];

const categoryColors: Record<string, string> = {
  SaaS: '#f5a623',
  Platform: '#3b82f6',
  Tool: '#10b981',
  'Mobile App': '#ec4899',
  API: '#06b6d4',
  Other: '#94a3b8',
};

type ProductForm = Omit<Product, 'id' | 'created_at'>;

const emptyForm = (): ProductForm => ({
  product_name: '',
  product_name_ar: '',
  short_description: '',
  short_description_ar: '',
  full_description: '',
  full_description_ar: '',
  product_image_url: '',
  product_url: '',
  category: 'SaaS',
  is_featured: false,
  display_order: 0,
});

export default function ProductsTab() {
  const { t, locale } = useAdminI18n();
  const isAR = locale === 'ar';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('display_order', { ascending: true });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setForm(emptyForm()); setEditing(null); setModal('add'); };
  const openEdit = (p: Product) => {
    setForm({
      product_name: p.product_name,
      product_name_ar: p.product_name_ar || '',
      short_description: p.short_description,
      short_description_ar: p.short_description_ar || '',
      full_description: p.full_description,
      full_description_ar: p.full_description_ar || '',
      product_image_url: p.product_image_url,
      product_url: p.product_url,
      category: p.category,
      is_featured: p.is_featured,
      display_order: p.display_order,
    });
    setEditing(p);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = async () => {
    setSaving(true);
    if (modal === 'add') {
      await supabase.from('products').insert([form]);
    } else if (editing) {
      await supabase.from('products').update(form).eq('id', editing.id);
    }
    setSaving(false);
    closeModal();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from('products').delete().eq('id', id);
    setDeleting(null);
    fetchProducts();
  };

  const toggleFeatured = async (p: Product) => {
    await supabase.from('products').update({ is_featured: !p.is_featured }).eq('id', p.id);
    fetchProducts();
  };

  const displayName = (p: Product) => isAR ? (p.product_name_ar || p.product_name) : p.product_name;
  const displayDesc = (p: Product) => isAR ? (p.short_description_ar || p.short_description) : p.short_description;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">{t.productsTitle}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {t.productsCount.replace('{count}', String(products.length))} · {t.featuredCount.replace('{count}', String(products.filter(p => p.is_featured).length))}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm px-4 py-2.5">
          <Plus size={15} /> {t.addProductBtn}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-brand-orange" size={28} /></div>
      ) : products.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}>
            <Package size={24} className="text-brand-orange opacity-60" />
          </div>
          <p className="text-white font-semibold mb-1">{t.noProductsYet}</p>
          <p className="text-slate-500 text-sm mb-6">{t.noProductsSub}</p>
          <button onClick={openAdd} className="btn-primary text-sm"><Plus size={15} /> {t.addProductBtn}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((p) => {
            const catColor = categoryColors[p.category] || '#94a3b8';
            return (
              <div key={p.id} className="glass-card p-4 flex gap-4 group hover:border-white/12 transition-all duration-200">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-white p-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {p.product_image_url ? (
                    <img src={p.product_image_url} alt={displayName(p)} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={24} className="text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-white font-semibold text-sm truncate">{displayName(p)}</p>
                    {p.is_featured && (
                      <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ background: 'rgba(245,166,35,0.12)', color: '#f5a623', border: '1px solid rgba(245,166,35,0.2)' }}>
                        {t.statusFeatured}
                      </span>
                    )}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mb-1" style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}25` }}>
                    {p.category}
                  </span>
                  {displayDesc(p) && <p className="text-slate-500 text-xs truncate">{displayDesc(p)}</p>}
                </div>
                <div className="flex items-start gap-1 flex-shrink-0">
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
            );
          })}
        </div>
      )}

      {modal && (
        <ProductModal
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
          isEdit={modal === 'edit'}
        />
      )}
    </div>
  );
}

function ProductModal({ form, setForm, onSave, onClose, saving, isEdit }: {
  form: ProductForm;
  setForm: (f: ProductForm) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  isEdit: boolean;
}) {
  const { t } = useAdminI18n();
  const set = (field: keyof ProductForm, value: string | boolean | number) =>
    setForm({ ...form, [field]: value });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-6"
        style={{ background: 'rgba(248,250,252,0.98)', border: '1px solid rgba(15,23,42,0.1)', boxShadow: '0 24px 80px rgba(15,23,42,0.16)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg" style={{ letterSpacing: '-0.02em' }}>{isEdit ? t.editProduct : t.addProductBtn}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{t.productDetails}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <ImageUpload
            bucket="product-images"
            currentUrl={form.product_image_url}
            onUpload={(url) => set('product_image_url', url)}
            label={t.uploadImage}
          />

          {/* Bilingual name fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.productNameEn}</label>
              <input className={inputCls} style={inputStyle} placeholder={t.productNameEnPlaceholder} value={form.product_name} onChange={(e) => set('product_name', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.productNameAr}</label>
              <input className={inputCls} style={inputStyle} placeholder={t.productNameArPlaceholder} value={form.product_name_ar} onChange={(e) => set('product_name_ar', e.target.value)} />
            </div>
          </div>

          {/* Category + URL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.category}</label>
              <select className={inputCls} style={inputStyle} value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.productUrl}</label>
              <input className={inputCls} style={inputStyle} placeholder="https://…" value={form.product_url} onChange={(e) => set('product_url', e.target.value)} />
            </div>
          </div>

          {/* Bilingual short description */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.shortDescEn}</label>
              <input className={inputCls} style={inputStyle} placeholder={t.shortDescEnPlaceholder} value={form.short_description} onChange={(e) => set('short_description', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.shortDescAr}</label>
              <input className={inputCls} style={inputStyle} placeholder={t.shortDescArPlaceholder} value={form.short_description_ar} onChange={(e) => set('short_description_ar', e.target.value)} />
            </div>
          </div>

          {/* Bilingual full description */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.fullDescEn}</label>
              <textarea className={inputCls} style={inputStyle} rows={3} placeholder={t.fullDescEnPlaceholder} value={form.full_description} onChange={(e) => set('full_description', e.target.value)} />
            </div>
            <div dir="rtl">
              <label className="block text-xs text-slate-500 mb-1.5">{t.fullDescAr}</label>
              <textarea className={inputCls} style={inputStyle} rows={3} placeholder={t.fullDescArPlaceholder} value={form.full_description_ar} onChange={(e) => set('full_description_ar', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">{t.displayOrder}</label>
              <input className={inputCls} style={inputStyle} type="number" min={0} value={form.display_order} onChange={(e) => set('display_order', Number(e.target.value))} />
            </div>
            <div className="pb-1">
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

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">{t.cancel}</button>
          <button onClick={onSave} disabled={saving || !form.product_name.trim()} className="btn-primary flex-1">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? t.saving : isEdit ? t.update : t.add}
          </button>
        </div>
      </div>
    </div>
  );
}

