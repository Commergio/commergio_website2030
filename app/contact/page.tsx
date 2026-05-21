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
  const { locale } = useI18n();
  const isAR = locale === 'ar';
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
          <span className="section-label mb-6 inline-flex">{isAR ? 'تواصل معنا' : 'Get in Touch'}</span>
          <h1 className="heading-xl text-white mb-6">
            {isAR ? 'ابدأ رحلة' : 'Start Your'}{' '}
            <span className="orange-gradient-text">{isAR ? 'التحول' : 'Transformation'}</span>{' '}
            {isAR ? 'اليوم' : 'Today'}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {isAR
              ? 'سواء كنت شركة ناشئة أو مؤسسة كبيرة — فريقنا جاهز لبناء ميزتك التنافسية القادمة.'
              : 'Whether you&apos;re a startup or enterprise — our team is ready to architect your next competitive advantage.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="glass-card p-8">
              <h2 className="text-white font-bold text-xl mb-2">{isAR ? 'أرسل لنا رسالة' : 'Send Us a Message'}</h2>
              <p className="text-slate-400 text-sm mb-8">{isAR ? 'نرد خلال ساعتين في أوقات العمل.' : 'We respond within 2 hours during business hours.'}</p>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={56} className="text-brand-orange mx-auto mb-4" />
                  <h3 className="text-white font-bold text-xl mb-2">{isAR ? 'تم إرسال الرسالة!' : 'Message Sent!'}</h3>
                  <p className="text-slate-400 mb-6">{isAR ? 'شكرًا لتواصلك. سيتواصل معك فريقنا خلال ساعتين.' : 'Thank you for reaching out. Our team will contact you within 2 hours.'}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-secondary text-sm"
                  >
                    {isAR ? 'إرسال رسالة أخرى' : 'Send Another Message'}
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
                        {isAR ? 'الاسم الكامل' : 'Full Name'} <span className="text-brand-orange">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={update('name')}
                        required
                        placeholder={isAR ? 'الاسم الكامل' : 'Your full name'}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {isAR ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-brand-orange">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={update('email')}
                        required
                        placeholder={isAR ? 'you@example.com' : 'your@email.com'}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{isAR ? 'الشركة' : 'Company'}</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={update('company')}
                        placeholder={isAR ? 'اسم الشركة' : 'Your company name'}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{isAR ? 'الخدمة المطلوبة' : 'Service Interested In'}</label>
                      <select
                        value={form.service}
                        onChange={update('service')}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200 text-sm appearance-none"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        <option value="" className="bg-navy-800">{isAR ? 'اختر خدمة' : 'Select a service'}</option>
                        {services.map((s) => (
                          <option key={s} value={s} className="bg-navy-800">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isAR ? 'الرسالة' : 'Message'} <span className="text-brand-orange">*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={update('message')}
                      required
                      rows={5}
                      placeholder={isAR ? 'أخبرنا عن مشروعك وأهدافك والمتطلبات الخاصة...' : 'Tell us about your project, goals, and any specific requirements...'}
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
                        {isAR ? 'جاري الإرسال...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        {isAR ? 'إرسال الرسالة' : 'Send Message'}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-5">{isAR ? 'معلومات التواصل' : 'Contact Information'}</h3>
              <div className="space-y-5">
                {[
                  {
                    icon: Mail,
                    label: isAR ? 'البريد الإلكتروني' : 'Email',
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
                    label: isAR ? 'الموقع' : 'Location',
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
              <h3 className="text-white font-bold mb-3">{isAR ? 'واتساب مباشر' : 'WhatsApp Direct'}</h3>
              <p className="text-slate-400 text-sm mb-4">{isAR ? 'للحصول على مساعدة فورية، تواصل معنا عبر واتساب. متوسط وقت الرد أقل من 30 دقيقة.' : 'For immediate assistance, reach us on WhatsApp. Average response time: under 30 minutes.'}</p>
              <a
                href="https://wa.me/966562270319"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center"
              >
                <MessageCircle size={18} className="text-green-400" />
                {isAR ? 'فتح محادثة واتساب' : 'Open WhatsApp Chat'}
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
                <span className="text-white font-semibold text-sm">{isAR ? 'متاح الآن' : 'Available Now'}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {isAR
                  ? 'ساعات العمل: الأحد - الخميس، 9:00 ص - 6:00 م (AST). دعم طارئ 24/7 للعملاء الحاليين.'
                  : 'Business Hours: Sun - Thu, 9:00 AM - 6:00 PM (AST). Emergency support available 24/7 for active clients.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
