'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, ArrowUpRight, ShieldCheck, ExternalLink } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { useI18n } from '@/lib/i18n-context';
import { isRtlLocale } from '@/lib/locale-text';

const SERVICE_ITEMS = [
  { en: 'Web Development', ar: 'تطوير المواقع' },
  { en: 'Mobile App Development', ar: 'تطوير تطبيقات الجوال' },
  { en: 'UI/UX Design', ar: 'تصميم واجهات المستخدم' },
  { en: 'AI Solutions', ar: 'حلول الذكاء الاصطناعي' },
  { en: 'E-commerce (Salla)', ar: 'متاجر إلكترونية' },
  { en: 'SEO Optimization', ar: 'تحسين محركات البحث' },
  { en: 'Business Consulting', ar: 'الاستشارات التجارية' },
  { en: 'Payment Gateway Integration', ar: 'بوابات الدفع' },
] as const;

export default function Footer() {
  const { t, locale, pick } = useI18n();
  const isRTL = isRtlLocale(locale);

  const serviceLinks = SERVICE_ITEMS.map((item) => pick(item.en, item.ar));

  const footerLinks = [
    { label: pick('About Us', 'من نحن'), href: '/about' },
    { label: pick('Portfolio', 'أعمالنا'), href: '/portfolio' },
    { label: pick('Blog', 'المدونة'), href: '/blog' },
    { label: pick('Partners', 'الشركاء'), href: '/partners' },
    { label: pick('Contact', 'تواصل معنا'), href: '/contact' },
  ];

  return (
    <footer className="relative bg-[#f8fafc] border-t border-amber-900/10 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="mb-5">
              <BrandLogo size={40} />
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {t.footer.tagline}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: 'https://www.linkedin.com/company/commergio?trk=blended-typeahead', label: 'LinkedIn' },
                { icon: Twitter, href: 'https://x.com/commergio?s=21', label: 'X (Twitter)' },
                { icon: Instagram, href: 'https://www.instagram.com/commergio?igsh=aWE1ejAzOHVpZ3ll', label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-orange hover:border-brand-orange/30 hover:scale-110 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.servicesTitle}</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-slate-600 hover:text-brand-orange text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-orange/40 group-hover:bg-brand-orange transition-colors" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.companyTitle}</h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-brand-orange text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-slate-900 font-semibold mt-8 mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-600 hover:text-brand-orange text-sm transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-brand-orange" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <a href="mailto:info@commergio.com" className="text-slate-700 hover:text-brand-orange text-sm transition-colors">
                    info@commergio.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-brand-orange" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">WhatsApp</p>
                  <a href="https://wa.me/966562270319" className="text-slate-700 hover:text-brand-orange text-sm transition-colors">
                    +966 562 270 319
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-brand-orange" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Location</p>
                  <p className="text-slate-700 text-sm">Riyadh, Saudi Arabia</p>
                  <p className="text-slate-500 text-xs">الرياض، المملكة العربية السعودية</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gradient mb-6" />

        {/* Saudi Business Center verification badge */}
        <div className="flex justify-center mb-6">
          <a
            href="https://eauthenticate.saudibusiness.gov.sa/certificate-details"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex max-w-full items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.9)',
              borderColor: 'rgba(15,23,42,0.1)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(245,166,35,0.3)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(245,166,35,0.09)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(15,23,42,0.1)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.9)';
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <ShieldCheck size={16} className="text-emerald-400" />
            </div>
            <div className={`${isRTL ? 'text-right' : 'text-left'} min-w-0`}>
              <p className="text-slate-800 text-xs font-semibold leading-tight">
                {isRTL ? 'موثّق لدى مركز الأعمال السعودي' : 'Verified by Saudi Business Center'}
              </p>
              <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5 whitespace-normal">
                {isRTL ? 'اضغط للتحقق' : 'Click to verify'}
                <ExternalLink size={10} />
              </p>
            </div>
          </a>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            {t.footer.rights.replace('{year}', new Date().getFullYear().toString())}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-slate-500 text-sm">
              {t.footer.founded}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
