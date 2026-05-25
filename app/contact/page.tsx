'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CircleCheck as CheckCircle2, Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n-context';

const services = [
  'Web Development',
  'Mobile App Development',
  'Systems & Automation',
  'UI/UX Design',
  'Business Development',
  'Payment Integration',
  'Business Consulting',
  'E-commerce (Salla)',
  'SEO Optimization',
  'AI Solutions',
  'Other',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: { name: string; email: string; message: string }) {
  if (!form.name.trim() || form.name.trim().length < 2) return 'Please enter your full name.';
  if (!EMAIL_RE.test(form.email)) return 'Please enter a valid email address.';
  if (!form.message.trim() || form.message.trim().length < 10) return 'Please write a message (at least 10 characters).';
  if (form.message.length > 4000) return 'Message is too long (max 4000 characters).';
  return null;
}

export default function ContactPage() {
  const { t, pick } = useI18n();
  const [form, setForm] = useState({
    name: '', email: '', company: '', service: '', message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [lastSubmit, setLastSubmit] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check — bots fill hidden fields
    if (honeypot) return;

    // Rate limit: 60s between submissions
    const now = Date.now();
    if (now - lastSubmit < 60_000) {
      setStatus('error');
      setErrorMsg('Please wait a moment before submitting again.');
      return;
    }

    const validationError = validate(form);
    if (validationError) {
      setStatus('error');
      setErrorMsg(validationError);
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase.from('messages').insert([{
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        company: form.company.trim(),
        service: form.service,
        message: form.message.trim(),
      }]);
      if (error) throw error;
      setStatus('success');
      setLastSubmit(Date.now());
      setForm({ name: '', email: '', company: '', service: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Failed to send message. Please try again or contact us directly.');
    }
  };

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (status === 'error') setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative pt-32 pb-16 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="section-label mb-6 inline-flex">{t.contact.label}</span>
          <h1 className="heading-xl text-white mb-6">
            {t.contact.title1}{' '}
            <span className="orange-gradient-text">{t.contact.title2}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.contact.sub}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="glass-card p-8">
              <h2 className="text-white font-bold text-xl mb-2">{t.contact.formTitle}</h2>
              <p className="text-slate-400 text-sm mb-8">{pick('We respond within 2 hours during business hours.', 'نرد خلال ساعتين في أوقات العمل.')}</p>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={56} className="text-brand-orange mx-auto mb-4" />
                  <h3 className="text-white font-bold text-xl mb-2">{t.contact.successTitle}</h3>
                  <p className="text-slate-400 mb-6">{pick('Thank you for reaching out. Our team will contact you within 2 hours.', 'شكرًا لتواصلك. سيتواصل معك فريقنا خلال ساعتين.')}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-secondary text-sm"
                  >
                    {t.contact.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot — hidden from real users, bots fill it */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                    <input tabIndex={-1} type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} autoComplete="off" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {t.contact.name} <span className="text-brand-orange">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={update('name')}
                        required
                        placeholder={pick('Your full name', 'الاسم الكامل')}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {t.contact.email} <span className="text-brand-orange">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={update('email')}
                        required
                        placeholder={pick('your@email.com', 'you@example.com')}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t.contact.company}</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={update('company')}
                        placeholder={pick('Your company name', 'اسم الشركة')}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t.contact.service}</label>
                      <select
                        value={form.service}
                        onChange={update('service')}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200 text-sm appearance-none"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        <option value="" className="bg-navy-800">{t.contact.selectService}</option>
                        {services.map((s) => (
                          <option key={s} value={s} className="bg-navy-800">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t.contact.message} <span className="text-brand-orange">*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={update('message')}
                      required
                      rows={5}
                      placeholder={t.contact.messagePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200 text-sm resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full text-base py-4"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {t.contact.sending}
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        {t.contact.send}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5">{pick('Contact Information', 'معلومات التواصل')}</h3>
              <div className="space-y-5">
                {[
                  {
                    icon: Mail,
                    label: pick('Email', 'البريد الإلكتروني'),
                    value: 'info@commergio.com',
                    href: 'mailto:info@commergio.com',
                  },
                  {
                    icon: Phone,
                    label: 'WhatsApp',
                    value: '+966 562 270 319',
                    href: 'https://wa.me/966562270319',
                  },
                  {
                    icon: MapPin,
                    label: pick('Location', 'الموقع'),
                    value: 'Riyadh, Saudi Arabia',
                    href: 'https://maps.app.goo.gl/nTd97fy7G81CmC1P7',
                  },
                ].map(({ icon: Icon, label, value, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange/20 transition-colors">
                      <Icon size={16} className="text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                      <p className="text-slate-200 text-sm font-medium group-hover:text-brand-orange transition-colors">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-3">{t.contact.preferWhatsApp}</h3>
              <p className="text-slate-400 text-sm mb-4">{t.contact.whatsAppSub}</p>
              <a
                href="https://wa.me/966562270319"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center"
              >
                <MessageCircle size={18} className="text-green-400" />
                {t.contact.whatsAppBtn}
              </a>
            </div>

            <div className="glass-card p-0 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6282!2d46.6745!3d24.6877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQxJzE1LjciTiA0NsKwNDAnMjguMiJF!5e0!3m2!1sen!2ssa!4v1234567890"
                width="100%"
                height="200"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                title="Commergio Location"
              />
            </div>

            <div className="glass-card p-6 border-brand-orange/15">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white font-semibold text-sm">{pick('Available Now', 'متاح الآن')}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {pick(
                  'Business Hours: Sun - Thu, 9:00 AM - 6:00 PM (AST). Emergency support available 24/7 for active clients.',
                  'ساعات العمل: الأحد - الخميس، 9:00 ص - 6:00 م (AST). دعم طارئ 24/7 للعملاء الحاليين.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
