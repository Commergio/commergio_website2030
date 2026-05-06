import type { Metadata } from 'next';
import Link from 'next/link';
import { Handshake, ExternalLink, ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Partners',
  description: 'Commergio\'s strategic partners and business allies.',
};

const partners = [
  {
    name: 'Saleh Bin Jilan Al Barakati',
    nameAr: 'صالح بن جيلان البركاتي',
    role: 'Financial & Tax Consulting',
    roleAr: 'الاستشارات المالية والضريبية',
    initials: 'SB',
    color: '#f5a623',
    description: 'A premier financial advisory and tax consulting firm providing comprehensive services to businesses across Saudi Arabia. Specializing in VAT compliance, financial restructuring, and investment advisory.',
    services: [
      'VAT Registration & Compliance',
      'Financial Statement Preparation',
      'Tax Planning & Advisory',
      'Business Valuation',
      'Investment Consulting',
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
    description: 'Enterprise cloud infrastructure partners providing AWS, Azure, and GCP solutions tailored for Saudi data residency requirements and CITC compliance.',
    services: [
      'Cloud Migration',
      'DevOps Implementation',
      'Security Compliance',
      '24/7 Infrastructure Monitoring',
    ],
  },
  {
    name: 'Digital Marketing Network MENA',
    nameAr: 'شبكة التسويق الرقمي في الشرق الأوسط',
    role: 'Digital Marketing & Growth',
    roleAr: 'التسويق الرقمي والنمو',
    initials: 'DM',
    color: '#10b981',
    description: 'Specialized digital marketing agency focused on the Saudi and MENA markets, delivering performance campaigns in Arabic and English.',
    services: [
      'Performance Marketing',
      'Content Creation (Arabic)',
      'Influencer Marketing',
      'Social Media Management',
    ],
  },
];

const partnerBenefits = [
  'Revenue sharing on referred clients',
  'Co-branded marketing materials',
  'Technical integration support',
  'Joint proposal development',
  'Priority project pipeline access',
  'Dedicated partner success manager',
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="section-label mb-6 inline-flex">Strategic Partners · الشركاء الاستراتيجيون</span>
          <h1 className="heading-xl text-white mb-6">
            Stronger Together —{' '}
            <span className="orange-gradient-text">Our Partner Ecosystem</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We collaborate with industry leaders to deliver comprehensive, best-in-class solutions to our mutual clients.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20 space-y-16">
        <div>
          <div className="space-y-6">
            {partners.map((partner, i) => (
              <div
                key={i}
                className={`glass-card-hover p-8 ${partner.featured ? 'ring-1 ring-brand-orange/25' : ''}`}
              >
                {partner.featured && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-orange/15 text-brand-orange border border-brand-orange/25">
                      Featured Partner
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
                        <h2 className="text-white font-bold text-xl">{partner.name}</h2>
                        <p className="text-slate-500 text-sm font-arabic">{partner.nameAr}</p>
                        <p className="font-medium text-sm mt-0.5" style={{ color: partner.color }}>{partner.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{partner.description}</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-3">Services Offered</p>
                    <ul className="space-y-2">
                      {partner.services.map((service, j) => (
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
        </div>

        <div className="glass-card p-10 border-brand-orange/15">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Handshake size={40} className="text-brand-orange mb-4" />
              <h2 className="heading-md text-white mb-4">
                Become a Commergio Partner
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Join our growing ecosystem of technology and business partners. Whether you&apos;re a technology company, consulting firm, or specialized service provider — let&apos;s create value together.
              </p>
              <Link href="/contact" className="btn-primary text-base px-8 py-3.5">
                Apply for Partnership
                <ArrowRight size={18} />
              </Link>
            </div>
            <div>
              <p className="text-white font-semibold mb-4">Partner Benefits</p>
              <ul className="space-y-3">
                {partnerBenefits.map((benefit, i) => (
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
