'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader as Loader2, Send, CircleCheck as CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';

interface Props {
  onClose: () => void;
  defaultService?: string;
  source?: string;
}

const inputCls = 'w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200';

export default function StartProjectModal({ onClose, defaultService = '', source = 'website' }: Props) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const m = t.startProject;
  const isLight = theme === 'light';
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: defaultService,
    budget_range: '',
    message: '',
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [formError, setFormError] = useState('');

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setFormError('');
  };

  const inputStyle = isLight
    ? { background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(0,0,0,0.1)', color: '#0c1628' }
    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' };
  const inputFocusStyle = { borderColor: isLight ? 'rgba(217,119,6,0.4)' : 'rgba(245,166,35,0.4)' };

  const getInputStyle = (field: string) => ({
    ...inputStyle,
    ...(focusedField === field ? inputFocusStyle : {}),
  });

  const handleSubmit = async () => {
    if (honeypot) return;
    if (!form.name.trim() || form.name.trim().length < 2) {
      setFormError(m.errName);
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError(m.errEmail);
      return;
    }
    if (form.message && form.message.length > 4000) {
      setFormError(m.errMessage);
      return;
    }
    setSaving(true);
    setFormError('');

    try {
      const { error } = await supabase.from('project_leads').insert([
        {
          ...form,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          message: form.message.trim(),
          source,
        },
      ]);
      if (error) throw error;
      setDone(true);
    } catch (error) {
      console.error('project_leads insert:', error);
      setFormError(m.errSubmit);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="relative w-full sm:max-w-xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl"
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          style={{
            background: isLight ? 'rgba(248,249,252,0.98)' : 'rgba(5,13,26,0.97)',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.09)',
            boxShadow: isLight
              ? '0 32px 100px rgba(0,0,0,0.15), 0 0 0 1px rgba(217,119,6,0.1)'
              : '0 32px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,166,35,0.1)',
          }}
        >
          {!done ? (
            <div className="p-7">
              <div className="flex items-start justify-between mb-7">
                <div>
                  <h2
                    className={`font-black text-2xl mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    {m.title}
                  </h2>
                  <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{m.sub}</p>
                </div>
                <button
                  onClick={onClose}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
                  style={{ background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)' }}
                >
                  <X size={17} />
                </button>
              </div>

              <div className="space-y-4">
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                  <input tabIndex={-1} type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">{m.nameLabel}</label>
                    <input
                      className={inputCls}
                      style={getInputStyle('name')}
                      placeholder={m.namePlaceholder}
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">{m.companyLabel}</label>
                    <input
                      className={inputCls}
                      style={getInputStyle('company')}
                      placeholder={m.companyPlaceholder}
                      value={form.company}
                      onChange={(e) => set('company', e.target.value)}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">{m.emailLabel}</label>
                    <input
                      className={inputCls}
                      style={getInputStyle('email')}
                      placeholder={m.emailPlaceholder}
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">{m.phoneLabel}</label>
                    <input
                      className={inputCls}
                      style={getInputStyle('phone')}
                      placeholder="+966 5XX XXX XXX"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">{m.serviceLabel}</label>
                  <select
                    className={inputCls}
                    style={getInputStyle('service')}
                    value={form.service}
                    onChange={(e) => set('service', e.target.value)}
                    onFocus={() => setFocusedField('service')}
                    onBlur={() => setFocusedField(null)}
                  >
                    <option value="" style={{ background: '#050d1a' }}>
                      {m.selectService}
                    </option>
                    {m.services.map((s) => (
                      <option key={s} value={s} style={{ background: '#050d1a' }}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">{m.budgetLabel}</label>
                  <select
                    className={inputCls}
                    style={getInputStyle('budget')}
                    value={form.budget_range}
                    onChange={(e) => set('budget_range', e.target.value)}
                    onFocus={() => setFocusedField('budget')}
                    onBlur={() => setFocusedField(null)}
                  >
                    <option value="" style={{ background: '#050d1a' }}>
                      {m.selectBudget}
                    </option>
                    {m.budgets.map((b) => (
                      <option key={b} value={b} style={{ background: '#050d1a' }}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">{m.messageLabel}</label>
                  <textarea
                    className={inputCls}
                    style={getInputStyle('message')}
                    rows={3}
                    placeholder={m.messagePlaceholder}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl mt-5 mb-5"
                style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)' }}
              >
                <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse flex-shrink-0" />
                <p className="text-slate-400 text-xs">
                  <span className="text-brand-orange font-semibold">{m.urgencyBold}</span> {m.urgencyRest}
                </p>
              </div>

              {formError && <p className="text-red-400 text-xs px-1">{formError}</p>}

              <button
                onClick={handleSubmit}
                disabled={saving || !form.name.trim()}
                className="btn-primary w-full py-4 text-base justify-center"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {saving ? m.sending : m.submit}
              </button>
            </div>
          ) : (
            <div className="p-10 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div
                  className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  <CheckCircle size={36} className="text-emerald-400" />
                </div>
              </motion.div>
              <h3 className={`font-black text-2xl mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`} style={{ letterSpacing: '-0.03em' }}>
                {m.successTitle}
              </h3>
              <p className={`mb-2 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {m.successThanks}
                <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{form.name}</span>
                {m.successBody}
                <span className="text-brand-orange font-semibold">24 {m.successHours}</span>.
              </p>
              <p className="text-slate-500 text-sm mb-8">{m.successFoot}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/966562270319?text=Hello%2C%20I%20just%20submitted%20a%20project%20brief%20on%20Commergio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ background: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.25)' }}
                >
                  {m.whatsappFollow}
                </a>
                <button onClick={onClose} className="btn-secondary">
                  {m.close}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
