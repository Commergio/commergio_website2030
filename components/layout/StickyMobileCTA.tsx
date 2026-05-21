'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n-context';

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const { t, isRTL } = useI18n();

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="m-3 flex gap-2" style={{ background: 'rgba(4,11,22,0.85)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '12px' }}>
            <Link href="/contact" className="btn-primary flex-1 justify-center py-3.5 text-sm">
              {t.hero.cta1}
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://wa.me/966562270319"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)' }}
            >
              <MessageCircle size={20} style={{ color: '#25D366' }} />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
