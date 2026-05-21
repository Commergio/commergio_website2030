'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WA_URL = 'https://wa.me/966562270319?text=Hello%2C%20I%20want%20to%20start%20a%20project%20with%20Commergio';

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const t = setTimeout(() => {
      if (window.scrollY < 300) setVisible(true);
    }, 4000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      className="fixed bottom-24 right-5 z-50 lg:bottom-8 lg:right-8 flex flex-col items-end gap-2"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
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
