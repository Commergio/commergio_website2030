'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import StartProjectModal from '@/components/StartProjectModal';
import { useI18n } from '@/lib/i18n-context';

const WA_URL = 'https://wa.me/966562270319?text=Hello%2C%20I%20want%20to%20start%20a%20project%20with%20Commergio';

interface MiniCTAProps {
  heading: string;
  sub?: string;
  primaryLabel?: string;
  primaryHref?: string;
  source?: string;
}

export default function MiniCTA({ heading, sub, primaryLabel = 'Start Your Project', primaryHref, source = 'homepage' }: MiniCTAProps) {
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="relative overflow-hidden py-10 px-4 md:px-8"
        style={{ background: 'rgba(245,166,35,0.04)', borderTop: '1px solid rgba(245,166,35,0.12)', borderBottom: '1px solid rgba(245,166,35,0.12)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 50%, rgba(245,166,35,0.04) 0%, transparent 70%)' }}
        />
        <div className="container-max relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-xl md:text-2xl mb-1" style={{ letterSpacing: '-0.02em' }}>
              {heading}
            </p>
            {sub && <p className="text-slate-400 text-sm">{sub}</p>}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {primaryHref ? (
              <Link href={primaryHref} className="btn-primary px-6 py-3">
                {primaryLabel}
                <ArrowRight size={15} />
              </Link>
            ) : (
              <button onClick={() => setModalOpen(true)} className="btn-primary px-6 py-3">
                {primaryLabel}
                <ArrowRight size={15} />
              </button>
            )}
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366' }}
              title={t.home.whatsapp}
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </motion.div>

      {modalOpen && (
        <StartProjectModal onClose={() => setModalOpen(false)} source={source} />
      )}
    </>
  );
}
