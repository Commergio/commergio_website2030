'use client';

import { useI18n } from '@/lib/i18n-context';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function ContactCTA() {
  const { t, locale } = useI18n();
  const isRTL = locale === 'ar';

  const cards = [
    {
      title: isRTL ? 'استشارة مجانية' : 'Free Consultation',
      desc: isRTL ? 'مكالمة استكشافية بدون التزام' : 'No-obligation discovery call',
    },
    {
      title: isRTL ? 'عرض سريع' : 'Quick Proposal',
      desc: isRTL ? 'احصل على عرض خلال 24 ساعة' : 'Detailed proposal within 24 hours',
    },
    {
      title: isRTL ? 'انطلاق سريع' : 'Fast Kickoff',
      desc: isRTL ? 'بدء المشروع خلال 72 ساعة' : 'Projects start within 72 hours',
    },
  ];

  return (
    <section className="section-padding bg-light">

      <div className="container-max text-center">

        {/* Header */}
        <div className="max-w-3xl mx-auto">

          <span className="section-label mb-6 inline-block">
            {t.cta.label}
          </span>

          <h2 className="heading-lg mb-6">
            {t.cta.title1}{' '}
            <span className="text-orange-500">{t.cta.title2}</span>
          </h2>

          <p className="text-muted text-lg mb-2">
            {t.cta.sub}
          </p>

          <p className="text-sm text-gray-500 mb-10">
            {t.cta.subAr}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">

            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              {t.cta.btn1}
              <ArrowRight size={20} />
            </Link>

            <a
              href="https://wa.me/966562270319"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base px-8 py-4 flex items-center gap-2 justify-center"
            >
              <MessageCircle size={20} />
              {t.cta.btn2}
            </a>

          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((item, i) => (
              <div key={i} className="card p-5 text-center">
                <p className="text-gray-900 font-semibold mb-1 text-sm">
                  {item.title}
                </p>
                <p className="text-muted text-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}