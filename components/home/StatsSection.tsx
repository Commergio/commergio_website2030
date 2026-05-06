'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n-context';
import { useTheme } from '@/lib/theme-context';

const stats = [
  { value: 50, suffix: '+', label: 'Projects Delivered', labelAr: 'مشروع منجز', icon: '📦' },
  { value: 98, suffix: '%', label: 'Client Satisfaction', labelAr: 'رضا العملاء', icon: '⭐' },
  { value: 10, suffix: '+', label: 'Industries Served', labelAr: 'قطاعات مختلفة', icon: '🏭' },
  { value: 5, suffix: 'M+', label: 'SAR Revenue for Clients', labelAr: 'ريال عائدات للعملاء', icon: '💰' },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else { setCount(Math.floor(start)); }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold orange-gradient-text font-syne" style={{ letterSpacing: '-0.03em' }}>
      {count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const { locale } = useI18n();
  const isRTL = locale === 'ar';
  const { theme } = useTheme();

  return (
    <section className="py-16 px-4 md:px-8 relative overflow-hidden transition-colors duration-500"
      style={{ background: theme === 'light' ? 'rgba(237,241,249,0.98)' : 'rgba(4,11,22,0.95)' }}>
      <div className="divider-gradient absolute top-0 left-0 right-0" />
      <div className="divider-gradient absolute bottom-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="glass-card p-6 md:p-8 text-center group hover:border-brand-orange/20 transition-all duration-300"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
            >
              <CountUp target={stat.value} suffix={stat.suffix} />
              <p className="text-slate-400 text-sm mt-2 font-medium leading-snug">
                {isRTL ? stat.labelAr : stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
