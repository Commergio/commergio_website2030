'use client';

import { useState, useEffect } from 'react';
import { Handshake, Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { supabase } from '@/lib/supabase';
import type { Partner } from '@/lib/types';

export default function PartnersSection() {
  const { t, locale } = useI18n();
  const isAR = locale === 'ar';
  const [mounted, setMounted] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      const { data: featured } = await supabase
        .from('partners')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });
      if (featured && featured.length > 0) {
        setPartners(featured);
        return;
      }
      const { data: all } = await supabase
        .from('partners')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(24);
      setPartners(all || []);
    };
    load();
  }, []);

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: '#f8fafc' }}>
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="divider-gradient absolute top-0 left-0 right-0" />

      <div className="container-max relative z-10">
        <div className="text-center mb-14">
          <span className="section-label mb-4 inline-flex">
            {t.partners.label}
          </span>
          <h2 className="heading-lg text-slate-900 mb-4">
            {t.partners.title1}{' '}
            <span className="orange-gradient-text">{t.partners.title2}</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            {t.partners.sub}
          </p>
        </div>

        {mounted && partners.length > 0 ? (
          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 mb-14 ${partners.length >= 4 ? 'md:grid-cols-4' : ''} ${partners.length >= 6 ? 'lg:grid-cols-6' : partners.length >= 4 ? 'lg:grid-cols-4' : ''}`}>
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} isAR={isAR} />
            ))}
          </div>
        ) : mounted ? (
          <div className="glass-card p-10 text-center mb-14">
            <Globe size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Partners coming soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-14">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="glass-card p-5 flex flex-col items-center gap-3"
                style={{ animation: `pulse 2s ease-in-out ${i * 0.1}s infinite` }}
              >
                <div className="w-14 h-14 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="h-3 rounded w-16" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
            ))}
          </div>
        )}

        <div className="glass-card p-8 text-center" style={{ borderColor: 'rgba(245,166,35,0.15)' }}>
          <Handshake size={40} className="text-brand-orange mx-auto mb-4" />
          <h3 className="text-slate-900 text-xl font-bold mb-3">{t.partners.becomePartner}</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            {t.partners.becomePartnerSub}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/partners#signing-videos" className="btn-secondary text-sm">
              {isAR ? 'حفلات توقيع الشراكات' : 'Partnership Signing Videos'}
            </a>
            <a href="mailto:info@commergio.com" className="btn-primary">
              {isAR ? 'شاركنا' : 'Partner With Us'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerCard({ partner, isAR }: { partner: Partner; isAR: boolean }) {
  const displayName = isAR ? (partner.name_ar || partner.name) : partner.name;
  const displayDesc = isAR ? (partner.description_ar || partner.description) : partner.description;
  const inner = (
    <div
      className="glass-card group flex flex-col items-center gap-3 p-5 text-center transition-all duration-300 hover:-translate-y-1"
      style={{ cursor: partner.website_url ? 'pointer' : 'default' }}
    >
      {/* Logo: grayscale → color on hover */}
      <div
        className="relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-white p-1"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '2px solid rgba(15,23,42,0.1)',
          boxShadow: '0 4px 14px rgba(15,23,42,0.08)',
        }}
      >
        {partner.logo_url ? (
          <img
            src={partner.logo_url}
            alt={partner.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-full transition-all duration-400 grayscale group-hover:grayscale-0 group-hover:scale-105"
            style={{ transitionDuration: '400ms' }}
          />
        ) : (
          <Globe
            size={24}
            className="text-slate-500 group-hover:text-slate-300 transition-colors duration-300"
          />
        )}
        {/* Tooltip ring on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: '0 0 0 2px rgba(245,166,35,0.5)' }}
        />
      </div>

      {/* Partner name — tooltip-style on hover */}
      <div className="flex flex-col items-center gap-0.5">
        <p className="text-slate-900 text-sm font-semibold leading-tight group-hover:text-brand-orange transition-colors duration-200">
          {displayName}
        </p>
        {displayDesc && (
          <p className="text-slate-500 text-xs leading-snug line-clamp-2 group-hover:text-slate-400 transition-colors duration-200 max-w-[140px]">
            {displayDesc}
          </p>
        )}
        {partner.website_url && (
          <p className="text-slate-600 text-xs mt-1 group-hover:text-brand-orange/60 transition-colors duration-200 truncate max-w-[120px]">
            {partner.website_url.replace(/^https?:\/\//, '')}
          </p>
        )}
      </div>
    </div>
  );

  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return inner;
}
