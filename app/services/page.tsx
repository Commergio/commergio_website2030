'use client';

import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2, ChevronRight, Loader as Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { pickList } from '@/lib/locale-text';
import { useCompanyServices } from '@/hooks/useCompanyServices';
import { getServiceIcon } from '@/lib/service-icons';

export default function ServicesPage() {
  const { t, pick, locale } = useI18n();
  const { services, loading } = useCompanyServices();

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="section-label mb-6 inline-flex">{t.services.heroLabel}</span>
          <h1 className="heading-xl text-white mb-6">
            {t.services.heroTitle1}{' '}
            <span className="orange-gradient-text">{t.services.heroTitle2}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.services.heroSub}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-brand-orange" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <div key={service.id} className="glass-card-hover p-8">
                  <div className="flex items-start gap-5 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${service.color}25 0%, ${service.color}08 100%)`,
                        border: `1px solid ${service.color}30`,
                      }}
                    >
                      <Icon size={24} style={{ color: service.color }} />
                    </div>
                    <div>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full mb-2 inline-block"
                        style={{
                          background: `${service.color}15`,
                          color: service.color,
                          border: `1px solid ${service.color}25`,
                        }}
                      >
                        {pick(service.category, service.category_ar)}
                      </span>
                      <h2 className="text-white font-bold text-xl mb-1">
                        {pick(service.title, service.title_ar)}
                      </h2>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed mb-6">
                    {pick(service.description, service.description_ar)}
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-white font-semibold text-sm mb-3">{t.services.keyBenefits}</p>
                      <ul className="space-y-2">
                        {pickList(locale, service.benefits, service.benefits_ar).map((benefit, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color: service.color }} />
                            <span className="text-slate-400 text-xs">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-white font-semibold text-sm mb-3">{t.services.ourProcess}</p>
                      <ol className="space-y-2">
                        {pickList(locale, service.process, service.process_ar).map((step, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: `${service.color}20`, color: service.color }}
                            >
                              {j + 1}
                            </span>
                            <span className="text-slate-400 text-xs">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                    style={{ color: service.color }}
                  >
                    {t.services.getStartedWith} {pick(service.title, service.title_ar)}
                    <ChevronRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 glass-card p-10 text-center border-brand-orange/15">
          <h2 className="heading-md text-white mb-4">{t.services.ctaTitle}</h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">{t.services.ctaSub}</p>
          <Link href="/contact" className="btn-primary text-base px-8 py-3.5">
            {t.services.ctaBtn}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
