'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { HERO_IMAGE_PATH } from '@/lib/brand';
import Image from 'next/image';
import StartProjectModal from '@/components/StartProjectModal';

export default function Hero() {
  const { t, isRTL } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        className="relative min-h-screen flex items-center overflow-hidden bg-[#F8FAFC]"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2FF]" />

        {/* Content */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 grid lg:grid-cols-[1fr_1.15fr] gap-10 sm:gap-12 items-center">

          {/* Text */}
          <div className="flex flex-col">

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#0F172A]">
              <span className="block">
                {t.hero.headline1}
              </span>
              <span className="block mt-2 text-[#F59E0B]">
                {t.hero.headline2}
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#64748B] text-base sm:text-lg mb-8 max-w-lg">
              {t.hero.sub}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition w-full sm:w-auto"
              >
                {t.hero.cta1}
                {isRTL ? <ChevronLeft size={18} /> : <ArrowRight size={18} />}
              </button>

              <Link
                href="/portfolio"
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {t.hero.cta2}
                {isRTL ? <ChevronLeft size={16} /> : <ArrowRight size={16} />}
              </Link>

            </div>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200/60"
          >
            <Image
              src={HERO_IMAGE_PATH}
              alt="Commergio — Technology, Innovation, Growth"
              width={1024}
              height={682}
              className="w-full h-auto object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </motion.div>

        </div>
      </section>

      {modalOpen && (
        <StartProjectModal onClose={() => setModalOpen(false)} source="hero" />
      )}
    </>
  );
}
