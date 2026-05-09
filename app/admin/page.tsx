'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import {
  LayoutDashboard, MessageSquare, FileText, Briefcase, Receipt,
  Plus, CircleCheck as CheckCircle2, TrendingUp, Mail, Loader as Loader2,
  X, Save, Globe, Package, Languages, LogOut,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ContactMessage, Invoice, InvoiceItem } from '@/lib/types';
import { AdminI18nProvider, useAdminI18n } from '@/lib/admin-i18n-context';
import PartnersTab from '@/components/admin/PartnersTab';
import ProductsTab from '@/components/admin/ProductsTab';
import PortfolioAdminTab from '@/components/admin/PortfolioAdminTab';

type Tab = 'overview' | 'messages' | 'invoices' | 'blog' | 'portfolio' | 'partners' | 'products';

const ADMIN_EMAIL = 'info@commergio.com';
const TEMP_BYPASS_ADMIN_AUTH = true;

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

useEffect(() => {
  const checkUser = async () => {
    if (TEMP_BYPASS_ADMIN_AUTH) {
      setAuthed(true);
      setChecking(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = '/login';
      return;
    }

    const userEmail = session.user?.email?.toLowerCase() ?? '';
    if (userEmail !== ADMIN_EMAIL.toLowerCase()) {
      await supabase.auth.signOut();
      window.location.href = '/login';
      return;
    }

    setAuthed(true);
    setChecking(false);
  };

  checkUser();
}, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={28} className="animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!authed) return null;

  return (
    <AdminI18nProvider>
      <AdminDashboardInner />
    </AdminI18nProvider>
  );
}

function AdminDashboardInner() {
  const { t, locale, setLocale, isRTL } = useAdminI18n();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };
  const [tab, setTab] = useState<Tab>('overview');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState({
  messages: 0,
  products: 0,
  partners: 0,
  invoices: 0,
});
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const fetchStats = async () => {
    const [{ count: messagesCount }, { count: productsCount }, { count: partnersCount }, { count: invoicesCount }] =
      await Promise.all([
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('partners').select('*', { count: 'exact', head: true }),
        supabase.from('invoices').select('*', { count: 'exact', head: true }),
      ]);
    setStats({
      messages: messagesCount || 0,
      products: productsCount || 0,
      partners: partnersCount || 0,
      invoices: invoicesCount || 0,
    });
  };

useEffect(() => {
  fetchMessages();
  fetchStats();
}, []);

const fetchMessages = async () => {
  try {
    setLoading(true);

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch messages error:', error.message);
      setMessages([]);
      return;
    }

    setMessages(data ?? []);
  } catch (err) {
    console.error('Unexpected error:', err);
    setMessages([]);
  } finally {
    setLoading(false);
  }
};
const fetchInvoices = async () => {
  setLoading(true);
  const { data } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });
  setInvoices(data || []);
  setLoading(false);
};

const markMessageRead = async (id: string) => {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'read' })
    .eq('id', id);

  if (error) {
    console.error('Update error:', error.message);
    return;
  }

  setMessages((prev) =>
    prev.map((m) =>
      m.id === id ? { ...m, status: 'read' } : m
    )
  );
};
  const nav = [
    { id: 'overview', labelKey: 'overview', icon: LayoutDashboard },
    { id: 'messages', labelKey: 'messages', icon: MessageSquare },
    { id: 'invoices', labelKey: 'invoices', icon: Receipt },
    { id: 'blog', labelKey: 'blog', icon: FileText },
    { id: 'portfolio', labelKey: 'portfolio', icon: Briefcase },
    { id: 'partners', labelKey: 'partners', icon: Globe },
    { id: 'products', labelKey: 'products', icon: Package },
  ] as const;

  return (
    <div className="admin-light min-h-screen pt-20 bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top header */}
      <div className="border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <BrandLogo size={40} />
              <div>
                <h1 className="text-xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>{t.controlPanel}</h1>
                <p className="text-slate-500 text-xs mt-0.5">Commergio · كوميرجيو</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-slate-200">
                <button
                  onClick={() => setLocale('en')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${locale === 'en' ? 'text-[#040c18]' : 'text-slate-400 hover:text-white'}`}
                  style={locale === 'en' ? { background: 'linear-gradient(135deg, #f5a623 0%, #e09118 100%)' } : {}}
                >
                  <Languages size={12} />
                  EN
                </button>
                <button
                  onClick={() => setLocale('ar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${locale === 'ar' ? 'text-[#040c18]' : 'text-slate-400 hover:text-white'}`}
                  style={locale === 'ar' ? { background: 'linear-gradient(135deg, #f5a623 0%, #e09118 100%)' } : {}}
                >
                  <Languages size={12} />
                  AR
                </button>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-medium hidden sm:block">{t.allSystemsOp}</span>
              </div>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 transition-all duration-200 bg-white border border-slate-200"
                title="Sign out"
              >
                <LogOut size={13} />
                <span className="hidden sm:block">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Tab navigation */}
        <div className="flex gap-1 mb-7 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {nav.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as Tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                tab === id ? 'text-[#040c18]' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={tab === id ? {
                background: 'linear-gradient(135deg, #f5a623 0%, #e09118 100%)',
                boxShadow: '0 4px 14px rgba(245,166,35,0.25)',
              } : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <Icon size={14} />
              {t[labelKey]}
            </button>
          ))}
        </div>

        {tab === 'overview' && <OverviewTab stats={stats} />}
        {tab === 'messages' && <MessagesTab messages={messages} loading={loading} onMarkRead={markMessageRead} />}
       {tab === 'invoices' && (
  <InvoicesTab
    invoices={invoices}
    loading={loading}
    onNew={() => setShowInvoiceModal(true)}
    onRefresh={() => {}}
  />
)}
        {tab === 'blog' && <BlogTab />}
        {tab === 'portfolio' && <PortfolioAdminTab />}
        {tab === 'partners' && <PartnersTab />}
        {tab === 'products' && <ProductsTab />}
      </div>

      {showInvoiceModal && (
        <InvoiceModal onClose={() => { setShowInvoiceModal(false); fetchInvoices(); }} />
      )}
      <style jsx global>{`
        .admin-light .glass-card {
          background: rgba(255, 255, 255, 0.92) !important;
          border-color: rgba(15, 23, 42, 0.08) !important;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 1) inset, 0 8px 28px rgba(15, 23, 42, 0.08) !important;
        }
        .admin-light .text-white { color: #0f172a !important; }
        .admin-light .text-slate-300 { color: #334155 !important; }
        .admin-light .text-slate-400 { color: #475569 !important; }
        .admin-light .text-slate-500 { color: #64748b !important; }
        .admin-light .text-slate-600 { color: #64748b !important; }
        .admin-light [style*='rgba(6,14,28'],
        .admin-light [style*='rgba(5,13,26'],
        .admin-light [style*='rgba(4,11,22'],
        .admin-light [style*='#040b16'],
        .admin-light [style*='#050d1a'] {
          background: rgba(248, 250, 252, 0.96) !important;
          border-color: rgba(15, 23, 42, 0.1) !important;
        }
        .admin-light [class*='bg-black/75'],
        .admin-light [class*='bg-black/80'] {
          background: rgba(15, 23, 42, 0.35) !important;
        }
      `}</style>
    </div>
  );
}

function OverviewTab({ stats }: { stats: { messages: number; products: number; partners: number; invoices: number } }) {
  const { t } = useAdminI18n();

  const statsData = [
  { labelKey: 'messages', value: stats.messages, icon: MessageSquare, color: '#f5a623', bg: 'rgba(245,166,35,0.08)' },
  { labelKey: 'invoices', value: stats.invoices, icon: Receipt, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  { labelKey: 'blog', value: 0, icon: FileText, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  { labelKey: 'portfolio', value: 0, icon: Briefcase, color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
  { labelKey: 'partners', value: stats.partners, icon: Globe, color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
  { labelKey: 'products', value: stats.products, icon: Package, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
] as const;

  const quickActions = [
    { labelKey: 'viewMessages', icon: MessageSquare, color: '#f5a623' },
    { labelKey: 'createInvoice', icon: Receipt, color: '#10b981' },
    { labelKey: 'addProject', icon: Briefcase, color: '#ec4899' },
    { labelKey: 'addProduct', icon: Package, color: '#8b5cf6' },
  ] as const;

  const systemItems = [
    'database', 'contactForm', 'invoiceSystem', 'storage', 'partnersCMS', 'productsCMS',
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {statsData.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-5 group hover:border-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: stat.bg, border: `1px solid ${stat.color}20` }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <TrendingUp size={12} className="text-slate-600" />
              </div>
              <p className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.02em' }}>{stat.value}</p>
              <p className="text-slate-500 text-xs">{t[stat.labelKey]}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-6">
        <h3 className="text-white font-semibold text-sm mb-4">{t.quickActions}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button key={i} className="glass-card-hover p-4 text-start">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${action.color}12`, border: `1px solid ${action.color}20` }}>
                  <Icon size={15} style={{ color: action.color }} />
                </div>
                <p className="text-white text-xs font-medium">{t[action.labelKey]}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-white font-semibold text-sm mb-4">{t.systemStatus}</h3>
        <div className="space-y-1">
          {systemItems.map((key) => (
            <div key={key} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <span className="text-slate-400 text-sm">{t[key]}</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 size={11} />
                {t.operational}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessagesTab({ messages, loading, onMarkRead }: {
  messages: ContactMessage[];
  loading: boolean;
  onMarkRead: (id: string) => void;
}) {
  const { t, isRTL } = useAdminI18n();

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="animate-spin text-brand-orange" size={28} />
    </div>
  );

  if (messages.length === 0) return (
    <div className="glass-card p-16 text-center">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}>
        <MessageSquare size={24} className="text-brand-orange opacity-60" />
      </div>
      <p className="text-white font-semibold mb-1">{t.noMessagesYet}</p>
      <p className="text-slate-500 text-sm">{t.noMessagesSub}</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <div key={msg.id} className="glass-card p-5 transition-all duration-200"
          style={{ borderColor: msg.status === 'unread' ? 'rgba(245,166,35,0.2)' : undefined }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <p className="text-white font-semibold text-sm">{msg.name}</p>
                {msg.status === 'unread' && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,166,35,0.1)', color: '#f5a623', border: '1px solid rgba(245,166,35,0.2)' }}>
                    {t.statusNew}
                  </span>
                )}
                {msg.service && (
                  <span className="text-xs px-2 py-0.5 rounded-full text-slate-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {msg.service}
                  </span>
                )}
              </div>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Mail size={11} />{msg.email}</span>
                {msg.company && <span>· {msg.company}</span>}
                <span>· {new Date(msg.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{msg.message}</p>
            </div>
            {msg.status === 'unread' && (
              <button onClick={() => onMarkRead(msg.id)}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all text-slate-400 hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {t.markRead}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function InvoicesTab({ invoices, loading, onNew, onRefresh }: {
  invoices: Invoice[];
  loading: boolean;
  onNew: () => void;
  onRefresh: () => void;
}) {
  const { t, isRTL } = useAdminI18n();

  const statusLabels: Record<string, string> = {
    draft: t.statusDraft,
    sent: t.statusSent,
    paid: t.statusPaid,
    overdue: t.statusOverdue,
  };

  const statusConfig: Record<string, { color: string; bg: string }> = {
    draft: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
    sent: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    paid: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    overdue: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-white font-semibold">{t.invoices}</p>
        <button onClick={onNew} className="btn-primary text-sm px-4 py-2.5">
          <Plus size={15} />
          {t.newInvoice}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-brand-orange" size={28} />
        </div>
      ) : invoices.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <Receipt size={24} className="text-emerald-400 opacity-60" />
          </div>
          <p className="text-white font-semibold mb-1">{t.noInvoicesYet}</p>
          <p className="text-slate-500 text-sm mb-6">{t.noInvoicesSub}</p>
          <button onClick={onNew} className="btn-primary text-sm">
            <Plus size={15} /> {t.createInvoiceBtn}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => {
            const cfg = statusConfig[inv.status] || statusConfig.draft;
            return (
              <div key={inv.id} className="glass-card p-5 hover:border-white/12 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-white font-semibold text-sm">{inv.invoice_number}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                        {statusLabels[inv.status] || inv.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">{inv.client_name}{inv.client_company ? ` · ${inv.client_company}` : ''}</p>
                    <p className="text-slate-600 text-xs mt-0.5">{new Date(inv.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</p>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <p className="text-white font-bold text-base">{inv.total?.toLocaleString()} SAR</p>
                    <p className="text-slate-500 text-xs">{t.inclVat.replace('{rate}', String(inv.tax_rate))}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BlogTab() {
  const { t } = useAdminI18n();
  return (
    <div className="glass-card p-16 text-center">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
        <FileText size={24} style={{ color: '#3b82f6', opacity: 0.7 }} />
      </div>
      <p className="text-white font-semibold mb-1">{t.blogManagement}</p>
      <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">{t.blogSub}</p>
      <button className="btn-primary text-sm">
        <Plus size={15} />
        {t.createPost}
      </button>
    </div>
  );
}

function InvoiceModal({ onClose }: { onClose: () => void }) {
  const { t } = useAdminI18n();
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_company: '',
    notes: '',
    due_date: '',
    tax_rate: 15,
  });
  const [items, setItems] = useState<Omit<InvoiceItem, 'total'>[]>([
    { description: '', quantity: 1, unit_price: 0 },
  ]);
  const [saving, setSaving] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const taxAmount = (subtotal * form.tax_rate) / 100;
  const total = subtotal + taxAmount;

  const addItem = () => setItems((prev) => [...prev, { description: '', quantity: 1, unit_price: 0 }]);
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof Omit<InvoiceItem, 'total'>, value: string | number) => {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  const handleSave = async () => {
    setSaving(true);
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const fullItems = items.map((item) => ({ ...item, total: item.quantity * item.unit_price }));
    await supabase.from('invoices').insert([{
      invoice_number: invoiceNumber,
      ...form,
      items: fullItems,
      subtotal,
      tax_amount: taxAmount,
      total,
      status: 'draft',
    }]);
    setSaving(false);
    onClose();
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-slate-800 text-sm focus:outline-none transition-all duration-200 focus:border-brand-orange/40";
  const inputStyle = { background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(15,23,42,0.12)' };

  const clientFields: { label: string; field: string; placeholder: string; type?: string }[] = [
    { label: t.clientName, field: 'client_name', placeholder: '' },
    { label: t.email, field: 'client_email', placeholder: 'email@co.com' },
    { label: t.company, field: 'client_company', placeholder: '' },
    { label: t.dueDate, field: 'due_date', placeholder: '', type: 'date' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-xl max-h-[95vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-6"
        style={{ background: 'rgba(248,250,252,0.98)', border: '1px solid rgba(15,23,42,0.1)', boxShadow: '0 24px 80px rgba(15,23,42,0.16)' }}>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg" style={{ letterSpacing: '-0.02em' }}>{t.newInvoice}</h2>
            <p className="text-slate-500 text-xs mt-0.5">{t.savedAsDraft}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">{t.clientDetails}</p>
            <div className="grid grid-cols-2 gap-3">
              {clientFields.map(({ label, field, placeholder, type }) => (
                <div key={field}>
                  <label className="block text-xs text-slate-500 mb-1.5">{label}</label>
                  <input
                    type={type || 'text'}
                    value={(form as Record<string, string | number>)[field] as string}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t.lineItems}</p>
              <button onClick={addItem} className="text-xs text-brand-orange hover:text-orange-300 flex items-center gap-1 transition-colors">
                <Plus size={12} /> {t.addItem}
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input className={`col-span-6 ${inputCls} text-xs`} style={inputStyle} placeholder={t.description} value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} />
                  <input className={`col-span-2 ${inputCls} text-xs`} style={inputStyle} type="number" placeholder={t.qty} value={item.quantity} onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))} />
                  <input className={`col-span-3 ${inputCls} text-xs`} style={inputStyle} type="number" placeholder="SAR" value={item.unit_price} onChange={(e) => updateItem(i, 'unit_price', Number(e.target.value))} />
                  <button onClick={() => removeItem(i)} className="col-span-1 text-slate-600 hover:text-red-400 transition-colors flex justify-center"><X size={13} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 space-y-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{t.subtotal}</span>
              <span className="text-slate-200">{subtotal.toLocaleString()} SAR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{t.vat} ({form.tax_rate}%)</span>
              <span className="text-slate-200">{taxAmount.toLocaleString()} SAR</span>
            </div>
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="flex justify-between">
              <span className="text-white font-semibold text-sm">{t.total}</span>
              <span className="text-brand-orange font-bold text-base">{total.toLocaleString()} SAR</span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="btn-secondary flex-1">{t.cancel}</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? t.saving : t.saveDraft}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
