'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Smartphone, Settings, Palette, TrendingUp,
  CreditCard, Briefcase, ShoppingBag, Search, Brain, ArrowRight, X
} from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const serviceNodes = [
  {
    id: 'web',
    icon: Globe,
    title: 'Web Development',
    titleAr: 'تطوير المواقع',
    description: 'High-performance web applications built with modern stacks.',
    descriptionAr: 'تطبيقات ويب عالية الأداء بأحدث التقنيات.',
    color: '#3b82f6',
    slug: 'web-development',
    angle: 0,
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile Apps',
    titleAr: 'تطبيقات الجوال',
    description: 'Native and cross-platform mobile applications for iOS & Android.',
    descriptionAr: 'تطبيقات الجوال الأصلية ومتعددة المنصات.',
    color: '#10b981',
    slug: 'mobile-app-development',
    angle: 36,
  },
  {
    id: 'systems',
    icon: Settings,
    title: 'Systems & Automation',
    titleAr: 'الأنظمة والأتمتة',
    description: 'Custom ERP, CRM, and workflow automation systems.',
    descriptionAr: 'أنظمة ERP وCRM وأتمتة سير العمل.',
    color: '#f5a623',
    slug: 'systems-automation',
    angle: 72,
  },
  {
    id: 'uiux',
    icon: Palette,
    title: 'UI/UX Design',
    titleAr: 'تصميم الواجهات',
    description: 'Research-driven design systems that convert visitors into customers.',
    descriptionAr: 'أنظمة تصميم تحوّل الزوار إلى عملاء.',
    color: '#ec4899',
    slug: 'ui-ux-design',
    angle: 108,
  },
  {
    id: 'bizdev',
    icon: TrendingUp,
    title: 'Business Development',
    titleAr: 'تطوير الأعمال',
    description: 'Strategic restructuring and business transformation services.',
    descriptionAr: 'إعادة الهيكلة والتحول التجاري الاستراتيجي.',
    color: '#a855f7',
    slug: 'business-development',
    angle: 144,
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Payment Integration',
    titleAr: 'بوابات الدفع',
    description: 'Seamless payment gateways: Mada, Tabby, Tamara, Stripe.',
    descriptionAr: 'بوابات دفع متكاملة: مدى، تابي، تمارا، سترايب.',
    color: '#14b8a6',
    slug: 'payment-integration',
    angle: 180,
  },
  {
    id: 'consulting',
    icon: Briefcase,
    title: 'Business Consulting',
    titleAr: 'الاستشارات التجارية',
    description: 'End-to-end business setup from legal structure to market entry.',
    descriptionAr: 'تأسيس الأعمال من الهيكل القانوني إلى دخول السوق.',
    color: '#f59e0b',
    slug: 'business-consulting',
    angle: 216,
  },
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    title: 'E-commerce (Salla)',
    titleAr: 'متاجر سلة',
    description: 'Full Salla store setup with custom themes and optimization.',
    descriptionAr: 'إعداد متجر سلة كامل بقوالب مخصصة.',
    color: '#06b6d4',
    slug: 'ecommerce-salla',
    angle: 252,
  },
  {
    id: 'seo',
    icon: Search,
    title: 'SEO Optimization',
    titleAr: 'تحسين محركات البحث',
    description: 'Technical and content SEO that dominates Google rankings.',
    descriptionAr: 'SEO تقني ومحتوى يتصدر نتائج جوجل.',
    color: '#84cc16',
    slug: 'seo-optimization',
    angle: 288,
  },
  {
    id: 'ai',
    icon: Brain,
    title: 'AI Solutions',
    titleAr: 'حلول الذكاء الاصطناعي',
    description: 'Custom AI integrations, chatbots, and machine learning systems.',
    descriptionAr: 'تكاملات الذكاء الاصطناعي والروبوتات وأنظمة التعلم الآلي.',
    color: '#f43f5e',
    slug: 'ai-solutions',
    angle: 324,
  },
];

function EcosystemSVG({
  activeId,
  hoveredId,
  onHover,
  onLeave,
  onSelect,
  isRTL,
}: {
  activeId: string | null;
  hoveredId: string | null;
  onHover: (id: string) => void;
  onLeave: () => void;
  onSelect: (id: string) => void;
  isRTL: boolean;
}) {
  const centerX = 400;
  const centerY = 400;
  const orbitRadius = 280;
  const nodeRadius = 44;

  const nodes = serviceNodes.map((s) => {
    const rad = (s.angle * Math.PI) / 180;
    return {
      ...s,
      x: centerX + orbitRadius * Math.cos(rad),
      y: centerY + orbitRadius * Math.sin(rad),
    };
  });

  return (
    <svg
      viewBox="0 0 800 800"
      className="w-full max-w-[640px] mx-auto"
      style={{ filter: 'drop-shadow(0 0 60px rgba(245,166,35,0.05))' }}
    >
      <defs>
        <radialGradient id="orbitGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(245,166,35,0.08)" />
          <stop offset="100%" stopColor="rgba(245,166,35,0)" />
        </radialGradient>
        {serviceNodes.map((s) => (
          <radialGradient key={`grad-${s.id}`} id={`grad-${s.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0.05" />
          </radialGradient>
        ))}
      </defs>

      <circle cx={centerX} cy={centerY} r={orbitRadius + 60} fill="url(#orbitGlow)" />
      <circle
        cx={centerX}
        cy={centerY}
        r={orbitRadius}
        fill="none"
        stroke="rgba(245,166,35,0.08)"
        strokeWidth="1"
        strokeDasharray="4 8"
      />

      {nodes.map((node) => {
        const isActive = activeId === node.id || hoveredId === node.id;
        return (
          <line
            key={`line-${node.id}`}
            x1={centerX}
            y1={centerY}
            x2={node.x}
            y2={node.y}
            stroke={isActive ? node.color : 'rgba(255,255,255,0.06)'}
            strokeWidth={isActive ? 1.5 : 1}
            strokeDasharray={isActive ? 'none' : '3 6'}
            style={{ transition: 'all 0.3s ease' }}
          />
        );
      })}

      {nodes.map((node) => {
        const isActive = activeId === node.id;
        const isHovered = hoveredId === node.id;
        const highlighted = isActive || isHovered;

        return (
          <g
            key={`node-${node.id}`}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={onLeave}
            onClick={() => onSelect(node.id)}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius + 16}
              fill="transparent"
            />
            {highlighted && (
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius + 4}
                fill={`${node.color}12`}
                stroke={`${node.color}30`}
                strokeWidth="1"
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeRadius}
              fill={highlighted ? `url(#grad-${node.id})` : 'rgba(255,255,255,0.03)'}
              stroke={highlighted ? node.color : 'rgba(255,255,255,0.1)'}
              strokeWidth={highlighted ? 1.5 : 1}
              style={{ transition: 'all 0.25s ease' }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function MobileServiceCard({ service, isRTL }: { service: typeof serviceNodes[0]; isRTL: boolean }) {
  const Icon = service.icon;
  return (
    <Link href={`/services/${service.slug}`}>
      <div
        className="glass-card p-4 flex items-center gap-3 group hover:-translate-y-0.5 transition-all duration-200"
        style={{ borderColor: `${service.color}20` }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${service.color}25 0%, ${service.color}08 100%)`,
            border: `1px solid ${service.color}30`,
          }}
        >
          <Icon size={18} style={{ color: service.color }} />
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">
            {isRTL ? service.titleAr : service.title}
          </p>
          <p className="text-slate-500 text-xs truncate">
            {isRTL ? service.descriptionAr : service.description}
          </p>
        </div>
        <ArrowRight size={14} className="text-slate-600 group-hover:text-brand-orange transition-colors flex-shrink-0 ml-auto" />
      </div>
    </Link>
  );
}

export default function ServicesEcosystem() {
  const { t, locale } = useI18n();
  const isRTL = locale === 'ar';
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const effectiveRTL = mounted ? isRTL : false;

  const activeNode = serviceNodes.find((s) => s.id === activeId);
  const hoveredNode = serviceNodes.find((s) => s.id === hoveredId);
  const displayNode = activeNode || hoveredNode || null;

  return (
    <section className="section-padding bg-navy-900 relative overflow-hidden" id="services">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,166,35,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="container-max relative z-10">
        <div className="text-center mb-12">
          <span className="section-label mb-4 inline-flex">
            {t.services.label} · {effectiveRTL ? 'What We Do' : 'ما نقدمه'}
          </span>
          <h2 className="heading-lg text-white mb-5">
            {t.services.title1}{' '}
            <span className="orange-gradient-text">{t.services.title2}</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">{t.services.sub}</p>
        </div>

        <div className="hidden lg:block">
          <div className="relative">
            <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
              <div className="space-y-3">
                {serviceNodes.slice(0, 5).map((node) => {
                  const Icon = node.icon;
                  const isHighlighted = hoveredId === node.id || activeId === node.id;
                  return (
                    <motion.div
                      key={node.id}
                      className="glass-card p-4 flex items-center gap-3 cursor-pointer"
                      style={{
                        borderColor: isHighlighted ? `${node.color}40` : undefined,
                        boxShadow: isHighlighted ? `0 0 20px ${node.color}15` : undefined,
                      }}
                      onMouseEnter={() => setHoveredId(node.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setActiveId(activeId === node.id ? null : node.id)}
                      whileHover={{ x: effectiveRTL ? -4 : 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${node.color}25 0%, ${node.color}08 100%)`,
                          border: `1px solid ${node.color}30`,
                        }}
                      >
                        <Icon size={16} style={{ color: node.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                          {effectiveRTL ? node.titleAr : node.title}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="relative w-[420px] flex-shrink-0">
                <EcosystemSVG
                  activeId={activeId}
                  hoveredId={hoveredId}
                  onHover={setHoveredId}
                  onLeave={() => setHoveredId(null)}
                  onSelect={(id) => setActiveId(activeId === id ? null : id)}
                  isRTL={effectiveRTL}
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center w-28">
                    <p className="text-brand-orange font-bold text-xs leading-snug text-center">
                      {t.services.ecosystem.center}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {displayNode && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-72 glass-card p-4 pointer-events-none z-20"
                      style={{ borderColor: `${displayNode.color}30` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: `${displayNode.color}20`, border: `1px solid ${displayNode.color}30` }}
                        >
                          <displayNode.icon size={14} style={{ color: displayNode.color }} />
                        </div>
                        <p className="text-white font-semibold text-sm">
                          {effectiveRTL ? displayNode.titleAr : displayNode.title}
                        </p>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {effectiveRTL ? displayNode.descriptionAr : displayNode.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                {serviceNodes.slice(5).map((node) => {
                  const Icon = node.icon;
                  const isHighlighted = hoveredId === node.id || activeId === node.id;
                  return (
                    <motion.div
                      key={node.id}
                      className="glass-card p-4 flex items-center gap-3 cursor-pointer"
                      style={{
                        borderColor: isHighlighted ? `${node.color}40` : undefined,
                        boxShadow: isHighlighted ? `0 0 20px ${node.color}15` : undefined,
                      }}
                      onMouseEnter={() => setHoveredId(node.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setActiveId(activeId === node.id ? null : node.id)}
                      whileHover={{ x: effectiveRTL ? 4 : -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${node.color}25 0%, ${node.color}08 100%)`,
                          border: `1px solid ${node.color}30`,
                        }}
                      >
                        <Icon size={16} style={{ color: node.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                          {effectiveRTL ? node.titleAr : node.title}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
          {serviceNodes.map((node) => (
            <MobileServiceCard key={node.id} service={node} isRTL={effectiveRTL} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-primary text-base px-8 py-3.5">
            {t.services.viewAll}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
