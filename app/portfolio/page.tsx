'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const projects = [
  {
    title: 'E-Commerce Platform Transformation',
    titleAr: 'تحويل منصة التجارة الإلكترونية',
    client: 'Retail Enterprise Group',
    clientAr: 'مجموعة تجزئة مؤسسية',
    category: 'E-commerce',
    categoryAr: 'التجارة الإلكترونية',
    description: 'Complete digital commerce transformation on Salla — custom theme, inventory management, multi-payment gateway integration, and conversion optimization. Achieved 4x revenue growth in 6 months.',
    descriptionAr: 'تحويل رقمي شامل لمنصة سلة — قالب مخصص وإدارة المخزون وتكامل بوابات دفع متعددة وتحسين التحويل. تحقيق نمو 4 أضعاف في الإيرادات خلال 6 أشهر.',
    tech: ['Salla', 'React', 'Node.js', 'Mada', 'Tabby'],
    metric: '4x Revenue in 6mo',
    metricAr: '4 أضعاف الإيرادات في 6 أشهر',
    image: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#f5a623',
    featured: true,
  },
  {
    title: 'Healthcare Management Platform',
    titleAr: 'منصة إدارة الرعاية الصحية',
    client: 'Multi-Branch Medical Group',
    clientAr: 'مجموعة طبية متعددة الفروع',
    category: 'Business Systems',
    categoryAr: 'أنظمة الأعمال',
    description: 'Custom ERP for a multi-branch medical group — patient management, appointment scheduling, billing, lab integration, and comprehensive reporting.',
    descriptionAr: 'نظام ERP مخصص لمجموعة طبية متعددة الفروع — إدارة المرضى وجدولة المواعيد والفواتير وتكامل المختبر والتقارير الشاملة.',
    tech: ['Next.js', 'PostgreSQL', 'Prisma', 'AWS', 'Docker'],
    metric: '60% Operational Efficiency',
    metricAr: '60% كفاءة تشغيلية',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#10b981',
    featured: true,
  },
  {
    title: 'Real Estate Digital Platform',
    titleAr: 'منصة عقارية رقمية',
    client: 'Riyadh Property Developer',
    clientAr: 'مطور عقاري في الرياض',
    category: 'Web Development',
    categoryAr: 'تطوير الويب',
    description: 'Interactive property listing platform with 3D virtual tours, CRM integration, automated lead nurturing, and multilingual support.',
    descriptionAr: 'منصة قوائم عقارية تفاعلية مع جولات افتراضية ثلاثية الأبعاد وتكامل CRM ورعاية العملاء المحتملين الآلية ودعم متعدد اللغات.',
    tech: ['React', 'Three.js', 'Supabase', 'Stripe', 'Arabic i18n'],
    metric: '500+ Qualified Leads Q1',
    metricAr: '+500 عميل محتمل في الربع الأول',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#3b82f6',
    featured: true,
  },
  {
    title: 'Restaurant Chain Mobile App',
    titleAr: 'تطبيق جوال لسلسلة مطاعم',
    client: 'F&B Group',
    clientAr: 'مجموعة أغذية ومشروبات',
    category: 'Mobile App',
    categoryAr: 'تطبيقات الجوال',
    description: 'Cross-platform mobile ordering app for a 12-branch restaurant chain — loyalty program, table reservations, delivery tracking, and integrated POS.',
    descriptionAr: 'تطبيق طلب متعدد المنصات لسلسلة مطاعم من 12 فرعاً — برنامج ولاء وحجز طاولات وتتبع التوصيل ونقطة بيع متكاملة.',
    tech: ['React Native', 'Node.js', 'Firebase', 'Stripe'],
    metric: '25K Downloads Month 1',
    metricAr: '25 ألف تنزيل في الشهر الأول',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#ec4899',
    featured: false,
  },
  {
    title: 'AI-Powered Customer Service Bot',
    titleAr: 'روبوت خدمة عملاء بالذكاء الاصطناعي',
    client: 'Telecom Company',
    clientAr: 'شركة اتصالات',
    category: 'AI Solutions',
    categoryAr: 'حلول الذكاء الاصطناعي',
    description: 'Arabic-first intelligent chatbot handling 80% of customer queries autonomously. Integrated with CRM, ticketing, and live agent escalation.',
    descriptionAr: 'روبوت محادثة ذكي عربي يُعالج 80% من استفسارات العملاء بشكل مستقل. متكامل مع CRM وإدارة التذاكر وتصعيد الوكيل المباشر.',
    tech: ['GPT-4', 'Next.js', 'Supabase', 'Arabic NLP'],
    metric: '80% Query Automation',
    metricAr: '80% أتمتة الاستفسارات',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#f43f5e',
    featured: false,
  },
  {
    title: 'Corporate Website & SEO',
    titleAr: 'موقع مؤسسي وتحسين محركات البحث',
    client: 'Financial Services Firm',
    clientAr: 'شركة خدمات مالية',
    category: 'Web Development',
    categoryAr: 'تطوير الويب',
    description: 'Premium bilingual corporate website with full SEO optimization achieving first-page Google rankings for 40+ target keywords within 3 months.',
    descriptionAr: 'موقع مؤسسي ثنائي اللغة مميز مع تحسين SEO كامل حقق تصنيفات الصفحة الأولى في جوجل لأكثر من 40 كلمة مفتاحية مستهدفة خلال 3 أشهر.',
    tech: ['Next.js', 'Tailwind CSS', 'SEO', 'Analytics'],
    metric: '300% Organic Traffic',
    metricAr: '300% زيادة في الزيارات العضوية',
    image: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#84cc16',
    featured: false,
  },
];

const categoryKeys = ['Web Development', 'Mobile App', 'E-commerce', 'AI Solutions', 'Business Systems'];

export default function PortfolioPage() {
  const { t, locale } = useI18n();
  const isAR = locale === 'ar';

  const [activeIdx, setActiveIdx] = useState(0);

  const categories = t.portfolio.categories;
  const activeCategory = activeIdx === 0 ? 'All' : categoryKeys[activeIdx - 1];

  const filtered = activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="section-label mb-6 inline-flex">{t.portfolio.heroLabel}</span>
          <h1 className="heading-xl text-white mb-6">
            {t.portfolio.heroTitle1}{' '}
            <span className="orange-gradient-text">{t.portfolio.heroTitle2}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.portfolio.heroSub}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeIdx === i
                  ? 'bg-brand-orange text-navy-950 shadow-orange-glow'
                  : 'glass-card text-slate-400 hover:text-white hover:border-brand-orange/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <div
              key={i}
              className={`glass-card-hover overflow-hidden group ${project.featured ? 'ring-1 ring-brand-orange/20' : ''}`}
            >
              {project.featured && (
                <div className="px-4 py-1.5 bg-brand-orange/10 border-b border-brand-orange/20">
                  <span className="text-xs font-semibold text-brand-orange">{t.portfolio.featuredBadge}</span>
                </div>
              )}
              <div className="h-48 overflow-hidden bg-white/95 p-3">
                <img
                  src={project.image}
                  alt={isAR ? project.titleAr : project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${project.color}15`, color: project.color, border: `1px solid ${project.color}25` }}
                  >
                    {isAR ? project.categoryAr : project.category}
                  </span>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${project.color}20`, color: project.color }}
                  >
                    {isAR ? project.metricAr : project.metric}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mb-1">
                  {isAR ? project.clientAr : project.client}
                </p>
                <h3 className="text-white font-bold text-lg mb-3">
                  {isAR ? project.titleAr : project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {isAR ? project.descriptionAr : project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 glass-card p-10 text-center border-brand-orange/15">
          <h2 className="heading-md text-white mb-4">{t.portfolio.ctaTitle}</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {t.portfolio.ctaSub}
          </p>
          <Link href="/contact" className="btn-primary text-base px-8 py-3.5">
            {t.portfolio.ctaBtn}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
