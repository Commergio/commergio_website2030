'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

const WA_URL = 'https://wa.me/966562270319?text=Hello%2C%20I%20want%20to%20start%20a%20project%20with%20Commergio';

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Show tooltip after 4s on desktop
    const t = setTimeout(() => {
      if (window.scrollY < 300) setVisible(true);
      setTooltipOpen(true);
      setTimeout(() => setTooltipOpen(false), 4000);
    }, 4000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(t);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      className="fixed bottom-24 right-5 z-50 lg:bottom-8 lg:right-8 flex flex-col items-end gap-2"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <AnimatePresence>
        {tooltipOpen && (
          <motion.div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white max-w-[200px] text-right"
            style={{
              background: 'rgba(5,13,26,0.95)',
              border: '1px solid rgba(37,211,102,0.25)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
            initial={{ opacity: 0, x: 12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              <p className="text-white font-semibold text-xs mb-0.5">Chat with us</p>
              <p className="text-slate-400 text-xs">Typically replies instantly</p>
            </div>
            <button
              onClick={() => setTooltipOpen(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              boxShadow: '0 4px 24px rgba(37,211,102,0.45), 0 0 0 0 rgba(37,211,102,0.4)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 360, damping: 25 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTooltipOpen(false)}
            title="Chat on WhatsApp"
          >
            {/* Pulse ring */}
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(37,211,102,0.25)', animationDuration: '2s' }}
            />
            <MessageCircle size={26} className="text-white relative z-10" fill="white" />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
