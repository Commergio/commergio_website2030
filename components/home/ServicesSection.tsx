'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Globe, Smartphone, Settings, Palette, TrendingUp,
  CreditCard, Briefcase, ShoppingBag, Search, Brain, ArrowRight
} from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    titleAr: 'تطوير المواقع',
    description: 'High-performance web applications built with modern stacks. From corporate sites to complex platforms — scalable, fast, and conversion-optimized.',
    color: '#3b82f6',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    titleAr: 'تطوير تطبيقات الجوال',
    description: 'Native and cross-platform mobile applications that deliver seamless user experiences across iOS and Android.',
    color: '#10b981',
  },
  {
    icon: Settings,
    title: 'Systems & Automation',
    titleAr: 'الأنظمة والأتمتة',
    description: 'Custom ERP, CRM, and workflow automation systems that eliminate bottlenecks and drive operational efficiency.',
    color: '#f5a623',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    titleAr: 'تصميم واجهات المستخدم',
    description: 'Research-driven design systems that convert visitors into customers. Every pixel crafted to maximize engagement.',
    color: '#ec4899',
  },
  {
    icon: TrendingUp,
    title: 'Business Development',
    titleAr: 'تطوير الأعمال',
    description: 'Strategic restructuring and business transformation services. We rebuild operations from the ground up for sustainable growth.',
    color: '#8b5cf6',
  },
  {
    icon: CreditCard,
    title: 'Payment Integration',
    titleAr: 'بوابات الدفع',
    description: 'Seamless integration with leading payment gateways including Mada, Tabby, Tamara, Stripe, and international processors.',
    color: '#14b8a6',
  },
  {
    icon: Briefcase,
    title: 'Full Business Consulting',
    titleAr: 'الاستشارات التجارية',
    description: 'End-to-end business setup — from legal structure to market entry strategy. We build businesses from concept to launch.',
    color: '#f59e0b',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce (Salla)',
    titleAr: 'متاجر إلكترونية',
    description: 'Full e-commerce store setup on Salla with custom themes, product management, and conversion optimization.',
    color: '#06b6d4',
  },
  {
    icon: Search,
    title: 'SEO Optimization',
    titleAr: 'تحسين محركات البحث',
    description: 'Technical and content SEO that drives organic traffic. Dominate Google rankings in your target market.',
    color: '#84cc16',
  },
  {
    icon: Brain,
    title: 'AI Solutions',
    titleAr: 'حلول الذكاء الاصطناعي',
    description: 'Custom AI integrations, chatbots, automation workflows, and machine learning systems tailored to your business needs.',
    color: '#f43f5e',
  },
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-navy-900 relative overflow-hidden" id="services">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="container-max relative z-10">
        <div className="text-center mb-16">
          <span className="section-label mb-4 inline-flex">
            Our Services · خدماتنا
          </span>
          <h2 className="heading-lg text-white mb-5">
            One Ecosystem,{' '}
            <span className="orange-gradient-text">Infinite Possibilities</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            From vision to execution — we deliver integrated technology and business solutions that drive measurable results for enterprises and startups alike.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {services.slice(0, 5).map((service, i) => (
            <ServiceCard
              key={i}
              service={service}
              index={i}
              isHovered={hoveredIndex === i}
              onHover={() => setHoveredIndex(i)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {services.slice(5).map((service, i) => (
            <ServiceCard
              key={i + 5}
              service={service}
              index={i + 5}
              isHovered={hoveredIndex === i + 5}
              onHover={() => setHoveredIndex(i + 5)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-primary text-base px-8 py-3.5">
            Explore All Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  service: typeof services[0];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const Icon = service.icon;
  return (
    <div
      className={`glass-card p-5 cursor-pointer transition-all duration-300 ${
        isHovered ? 'border-brand-orange/30 -translate-y-1' : ''
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={isHovered ? {
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${service.color}20`,
      } : {}}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{
          background: `linear-gradient(135deg, ${service.color}25 0%, ${service.color}08 100%)`,
          border: `1px solid ${service.color}30`,
        }}
      >
        <Icon size={18} style={{ color: service.color }} />
      </div>
      <h3 className="text-white font-semibold text-sm mb-1.5">{service.title}</h3>
      <p className="text-slate-500 text-xs mb-2">{service.titleAr}</p>
      <p
        className={`text-slate-400 text-xs leading-relaxed transition-all duration-300 ${
          isHovered ? 'line-clamp-none' : 'line-clamp-3'
        }`}
      >
        {service.description}
      </p>
    </div>
  );
}
