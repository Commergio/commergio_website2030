'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const testimonials = [
  {
    name: 'Abdullah Al-Rashidi',
    title: 'CEO, AlFarouk Retail Group',
    content: "Commergio transformed our entire digital infrastructure in 3 months. The e-commerce platform they built doubled our online revenue in the first quarter. Their understanding of the Saudi market is unmatched.",
    contentAr: 'حوّلت كوميرجيو بنيتنا الرقمية بالكامل في 3 أشهر. مضاعفة إيراداتنا الإلكترونية في الربع الأول كان أمراً مذهلاً. خبرتهم بالسوق السعودي لا مثيل لها.',
    rating: 5,
    avatar: 'A',
    color: '#f5a623',
  },
  {
    name: 'Fatima Al-Zahrani',
    title: 'Founder, HealthFirst Clinics',
    content: "We needed a healthcare management system that understood Saudi regulations. Commergio delivered exactly that — on time and under budget. Our clinical operations are now 60% more efficient.",
    contentAr: 'احتجنا لنظام إدارة صحية يفهم الأنظمة السعودية. كوميرجيو قدّمت بالضبط ما طلبناه — في الوقت وضمن الميزانية. عملياتنا أصبحت أكثر كفاءة بنسبة 60%.',
    rating: 5,
    avatar: 'F',
    color: '#10b981',
  },
  {
    name: 'Mohammed Al-Otaibi',
    title: 'COO, Riyadh Properties',
    content: "The real estate platform they built is world-class. Interactive tours, automated CRM, and lead management — everything we asked for and more. Our sales team productivity tripled.",
    contentAr: 'المنصة العقارية التي بنوها لنا عالمية المستوى. جولات تفاعلية، CRM آلي، إدارة العملاء المحتملين — كل ما طلبناه وأكثر. تضاعفت إنتاجية فريق المبيعات 3 مرات.',
    rating: 5,
    avatar: 'M',
    color: '#3b82f6',
  },
  {
    name: 'Sara Al-Ghamdi',
    title: 'Marketing Director, Luxe Fashion',
    content: "Commergio's SEO and digital strategy increased our organic traffic by 300% in 4 months. They think like business strategists, not just developers. They truly partner with you.",
    contentAr: 'زادت استراتيجية SEO والتسويق الرقمي من كوميرجيو حركة مرورنا العضوية بنسبة 300% في 4 أشهر. يفكرون كاستراتيجيين تجاريين، لا مجرد مطورين.',
    rating: 5,
    avatar: 'S',
    color: '#ec4899',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const { t, locale } = useI18n();
  const isRTL = locale === 'ar';

  const go = (idx: number) => {
    setDir(idx > active ? 1 : -1);
    setActive(idx);
  };
  const prev = () => go((active - 1 + testimonials.length) % testimonials.length);
  const next = () => go((active + 1) % testimonials.length);

  const current = testimonials[active];

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: '#f8fafc' }}>
      <div className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245,166,35,0.12) 0%, transparent 70%)' }} />
      <div className="divider-gradient absolute top-0 left-0 right-0" />

      <div className="container-max relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-label mb-5 inline-flex">{t.testimonials.label}</span>
          <h2 className="heading-lg text-slate-900">
            {t.testimonials.title1}{' '}
            <span className="orange-gradient-text">{t.testimonials.title2}</span>
          </h2>
          <p className="text-slate-500 mt-3 text-base max-w-lg mx-auto">{t.testimonials.sub}</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative" style={{ minHeight: '280px' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, x: dir * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -30 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-8 md:p-10"
                style={{ borderColor: `${current.color}18` }}
              >
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-brand-orange text-brand-orange" />
                  ))}
                </div>

                <p className="text-slate-800 text-base md:text-lg leading-relaxed mb-8 font-normal">
                  &ldquo;{isRTL ? current.contentAr : current.content}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${current.color} 0%, ${current.color}88 100%)` }}
                  >
                    {current.avatar}
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-sm">{current.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{current.title}</p>
                  </div>
                  <div className="ms-auto">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${current.color}12`, border: `1px solid ${current.color}20` }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <path d="M0 10V6.5C0 4.5 1.3 2.7 4 1L5.5 2.8C4 3.7 3.2 4.7 3.1 5.7H5V10H0ZM8 10V6.5C8 4.5 9.3 2.7 12 1L13.5 2.8C12 3.7 11.2 4.7 11.1 5.7H13V10H8Z" fill={current.color} opacity="0.7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 h-2 bg-brand-orange' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all duration-200 hover:border-amber-300/40"
              >
                {isRTL ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all duration-200 hover:border-amber-300/40"
              >
                {isRTL ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
