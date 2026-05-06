'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import StartProjectModal from '@/components/StartProjectModal';

export default function TeamCTA() {
  const { locale } = useI18n();
  const isRTL = locale === 'ar';
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const whatsappUrl = 'https://wa.me/966562270319?text=Hello%2C%20I%20want%20to%20start%20a%20project%20with%20Commergio';

  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{ minHeight: 500 }}
        dir={mounted ? (isRTL ? 'rtl' : 'ltr') : 'ltr'}
        suppressHydrationWarning
      >
        {/* Clean light background without image */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }} />

        <div className="container-max relative z-10 flex items-center justify-center min-h-[500px] py-14 sm:py-20 px-4">
          <div className="max-w-3xl w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <span className="section-label mb-6 inline-flex">
                {isRTL ? 'شريكك في النمو' : 'Your Growth Partner'}
              </span>

              <h2 className="text-slate-900 mb-6" style={{ fontSize: 'clamp(1.75rem, 6vw, 3.25rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                {isRTL ? (
                  <>
                    نحن لا نبني أنظمة فقط،{' '}
                    <span className="orange-gradient-text">بل نبني أعمالاً تنمو</span>
                  </>
                ) : (
                  <>
                    Building Business,{' '}
                    <span className="orange-gradient-text">Not Just Software</span>
                  </>
                )}
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto">
                {isRTL
                  ? 'كل مشروع نبنيه هو استثمار في مستقبل أعمالك. فريقنا لا يكتفي بتسليم المنتج، بل يرافقك في كل خطوة نحو التوسع والنمو الحقيقي.'
                  : 'Every project we build is an investment in your business future. Our team doesn\'t just deliver — we partner with you through every step toward real, scalable growth.'}
              </p>

              {/* Glass stat strip */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-10 rounded-2xl overflow-hidden"
                style={{ background: 'rgba(15,23,42,0.08)', border: '1px solid rgba(15,23,42,0.1)' }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {(isRTL
                  ? [['٥٠+', 'مشروع مكتمل'], ['٩٨٪', 'رضا العملاء'], ['٢٤/٧', 'دعم متواصل'], ['٥+', 'سنوات خبرة']]
                  : [['50+', 'Projects Delivered'], ['98%', 'Client Satisfaction'], ['24/7', 'Support Available'], ['5+', 'Years Experience']]
                ).map(([val, label], i) => (
                  <div
                    key={i}
                    className="px-3 sm:px-6 py-4 text-center"
                    style={{ background: 'rgba(255,255,255,0.65)' }}
                  >
                    <p className="text-slate-900 font-bold text-xl sm:text-2xl mb-0.5" style={{ fontVariantNumeric: 'tabular-nums' }}>{val}</p>
                    <p className="text-slate-600 text-xs">{label}</p>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-primary px-7 py-3.5 text-base"
                >
                  {isRTL ? 'ابدأ مشروعك' : 'Start Your Project'}
                  <ArrowRight size={18} />
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(37,211,102,0.12)',
                    border: '1px solid rgba(37,211,102,0.25)',
                    color: '#25d366',
                  }}
                >
                  <MessageCircle size={18} />
                  {isRTL ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {modalOpen && <StartProjectModal onClose={() => setModalOpen(false)} source="team-cta" />}
    </>
  );
}
