'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Handshake } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import PartnershipSigningVideos from '@/components/partners/PartnershipSigningVideos';

const partners = [
  {
    name: 'Saleh Bin Jilan Al Barakati',
    nameAr: 'صالح بن جيلان البركاتي',
    role: 'Financial & Tax Consulting',
    roleAr: 'الاستشارات المالية والضريبية',
    initials: 'SB',
    color: '#f5a623',
    description:
      'A premier financial advisory and tax consulting firm providing comprehensive services to businesses across Saudi Arabia. Specializing in VAT compliance, financial restructuring, and investment advisory.',
    descriptionAr:
      'شركة رائدة في الاستشارات المالية والضريبية تقدم خدمات شاملة للشركات في المملكة، متخصصة في الامتثال لضريبة القيمة المضافة وإعادة الهيكلة المالية والاستشارات الاستثمارية.',
    services: [
      'VAT Registration & Compliance',
      'Financial Statement Preparation',
      'Tax Planning & Advisory',
      'Business Valuation',
      'Investment Consulting',
    ],
    servicesAr: [
      'تسجيل ضريبة القيمة المضافة والامتثال',
      'إعداد القوائم المالية',
      'التخطيط الضريبي والاستشارات',
      'تقييم الأعمال',
      'الاستشارات الاستثمارية',
    ],
    featured: true,
  },
  {
    name: 'Cloud Infrastructure Alliance',
    nameAr: 'تحالف البنية التحتية السحابية',
    role: 'Cloud & Infrastructure',
    roleAr: 'الخدمات السحابية والبنية التحتية',
    initials: 'CI',
    color: '#3b82f6',
    description:
      'Enterprise cloud infrastructure partners providing AWS, Azure, and GCP solutions tailored for Saudi data residency requirements and CITC compliance.',
    descriptionAr:
      'شركاء بنية تحتية سحابية للمؤسسات يقدمون حلول AWS وAzure وGCP وفق متطلبات إقامة البيانات في المملكة وامتثال هيئة الاتصالات.',
    services: ['Cloud Migration', 'DevOps Implementation', 'Security Compliance', '24/7 Infrastructure Monitoring'],
    servicesAr: ['الترحيل السحابي', 'تنفيذ DevOps', 'الامتثال الأمني', 'مراقبة البنية التحتية 24/7'],
  },
  {
    name: 'Digital Marketing Network MENA',
    nameAr: 'شبكة التسويق الرقمي في الشرق الأوسط',
    role: 'Digital Marketing & Growth',
    roleAr: 'التسويق الرقمي والنمو',
    initials: 'DM',
    color: '#10b981',
    description:
      'Specialized digital marketing agency focused on the Saudi and MENA markets, delivering performance campaigns in Arabic and English.',
    descriptionAr:
      'وكالة تسويق رقمي متخصصة في السوق السعودي ومنطقة الشرق الأوسط، تقدم حملات أداء بالعربية والإنجليزية.',
    services: ['Performance Marketing', 'Content Creation (Arabic)', 'Influencer Marketing', 'Social Media Management'],
    servicesAr: ['تسويق الأداء', 'إنشاء المحتوى (عربي)', 'تسويق المؤثرين', 'إدارة وسائل التواصل'],
  },
];

export default function PartnersPageContent() {
  const { t, pick, locale } = useI18n();
  const p = t.partnersPage;

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="section-label mb-6 inline-flex">{p.label}</span>
          <h1 className="heading-xl text-white mb-6">
            {p.title1}{' '}
            <span className="orange-gradient-text">{p.title2}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{p.sub}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20 space-y-16">
        <div className="space-y-6">
          {partners.map((partner, i) => (
              <div
                key={i}
                className={`glass-card-hover p-8 ${partner.featured ? 'ring-1 ring-brand-orange/25' : ''}`}
              >
                {partner.featured && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-orange/15 text-brand-orange border border-brand-orange/25">
                      {p.featured}
                    </span>
                  </div>
                )}
                <div className="grid md:grid-cols-3 gap-8 items-start">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${partner.color}30 0%, ${partner.color}10 100%)`,
                          border: `2px solid ${partner.color}30`,
                          color: partner.color,
                        }}
                      >
                        {partner.initials}
                      </div>
                      <div>
                        <h2 className="text-white font-bold text-xl">{pick(partner.name, partner.nameAr)}</h2>
                        <p className="font-medium text-sm mt-0.5" style={{ color: partner.color }}>
                          {pick(partner.role, partner.roleAr)}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {pick(partner.description, partner.descriptionAr)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-3">{p.servicesOffered}</p>
                    <ul className="space-y-2">
                      {(locale === 'en' ? partner.services : partner.servicesAr).map((service, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle2 size={14} style={{ color: partner.color }} className="flex-shrink-0" />
                          <span className="text-slate-400 text-sm">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <PartnershipSigningVideos />

        <div className="glass-card p-10 border-brand-orange/15">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Handshake size={40} className="text-brand-orange mb-4" />
              <h2 className="heading-md text-white mb-4">{p.becomeTitle}</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">{p.becomeSub}</p>
              <Link href="/contact" className="btn-primary text-base px-8 py-3.5">
                {p.applyBtn}
                <ArrowRight size={18} />
              </Link>
            </div>
            <div>
              <p className="text-white font-semibold mb-4">{p.benefitsTitle}</p>
              <ul className="space-y-3">
                {p.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-brand-orange flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
