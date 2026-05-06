'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe as Globe2, Users, Shield, TrendingUp, Clock, CircleCheck as CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const icons = [Zap, Globe2, Users, Shield, TrendingUp, Clock];
const accentColors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#a855f7', '#14b8a6'];

export default function WhyCommergio() {
const { t, locale } = useI18n();
const isRTL = locale === 'ar';
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

return (
<>
{/* WHY SECTION */} <section className="section-padding bg-[#F8FAFC]"> <div className="container-max">
<div
className="grid lg:grid-cols-2 gap-16 items-start"
dir={mounted ? (isRTL ? 'rtl' : 'ltr') : 'ltr'}
>


        {/* النص */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm text-[#F59E0B] font-medium mb-4 inline-block">
            {t.why.label}
          </span>

          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-5">
            {t.why.title1}{' '}
            <span className="text-[#F59E0B]">{t.why.title2}</span>
          </h2>

          <p className="text-gray-600 mb-8 max-w-lg leading-relaxed">
            {t.why.sub}
          </p>

          <ul className="space-y-3 mb-10">
            {(t.why.values as readonly string[]).map((val, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                <CheckCircle2 size={16} className="text-[#F59E0B]" />
                {val}
              </li>
            ))}
          </ul>

          {/* badge */}
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                🇸🇦
              </div>
              <p className="text-[#0F172A] font-semibold text-sm">
                {t.why.badge}
              </p>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              {t.why.badgeSub}
            </p>
          </div>
        </motion.div>

        {/* الكروت */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.why.reasons.map((reason, i) => {
            const Icon = icons[i];
            const color = accentColors[i];

            return (
              <motion.div
                key={i}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center rounded-lg"
                    style={{ background: `${color}15` }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>

                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: `${color}10`, color }}
                  >
                    {reason.metric}
                  </span>
                </div>

                <p className="text-[#0F172A] font-semibold text-sm mb-1">
                  {reason.title}
                </p>
                <p className="text-gray-500 text-xs">
                  {reason.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  </section>

  {/* TEAM SECTION */}
  <section className="bg-white py-16">
    <div className="container-max">
      <div
        className="grid lg:grid-cols-1 gap-10 items-center"
        dir={mounted ? (isRTL ? 'rtl' : 'ltr') : 'ltr'}
      >

        {/* النص */}
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <span className="text-sm text-[#F59E0B] mb-3 block">
            {isRTL ? 'فريقنا' : 'Our Team'}
          </span>

          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
            {isRTL ? (
              <>فرق حقيقية. <span className="text-[#F59E0B]">حلول حقيقية.</span></>
            ) : (
              <>Real Teams. <span className="text-[#F59E0B]">Real Solutions.</span></>
            )}
          </h2>

          <p className="text-gray-600 mb-6 max-w-md">
            {isRTL
              ? 'كل مشروع يُبنى بواسطة فريق متخصص لضمان نجاحك.'
              : 'Every project is built by a dedicated team to ensure your success.'}
          </p>

          <div className="flex flex-wrap gap-3">
            {(isRTL
              ? ['مهندسون متخصصون', 'مصممون خبراء', 'استراتيجيو نمو']
              : ['Dedicated Engineers', 'Expert Designers', 'Growth Strategists']
            ).map((tag, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  </section>
</>


);
}
