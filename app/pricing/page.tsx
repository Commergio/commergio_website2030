'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Star, Clock, Shield, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import StartProjectModal from '@/components/StartProjectModal';
import { useI18n } from '@/lib/i18n-context';

const WHATSAPP_URL = 'https://wa.me/966562270319?text=Hello%2C%20I%20want%20to%20start%20a%20project%20with%20Commergio';

type PricingCategory = 'website' | 'ecommerce' | 'seo' | 'systems';

const categories: { id: PricingCategory; label: string; labelAr: string }[] = [
  { id: 'website', label: 'Website Development', labelAr: 'تطوير المواقع' },
  { id: 'ecommerce', label: 'E-commerce (Salla)', labelAr: 'التجارة الإلكترونية' },
  { id: 'seo', label: 'SEO Services', labelAr: 'تحسين محركات البحث' },
  { id: 'systems', label: 'Systems & Automation', labelAr: 'الأنظمة والأتمتة' },
];

interface Plan {
  name: string;
  nameAr: string;
  price: string;
  priceAr: string;
  priceNote?: string;
  priceNoteAr?: string;
  timeline: string;
  timelineAr: string;
  popular?: boolean;
  features: string[];
  featuresAr: string[];
  cta: string;
  ctaAr: string;
  highlight?: string;
  highlightAr?: string;
}

const plans: Record<PricingCategory, Plan[]> = {
  website: [
    {
      name: 'Starter',
      nameAr: 'البداية',
      price: 'From SAR 3,500',
      priceAr: 'ابتداءً من 3,500 ر.س',
      timeline: '5–7 days',
      timelineAr: '5–7 أيام',
      features: [
        'Up to 5 pages',
        'Mobile responsive design',
        'Contact form integration',
        'Basic SEO setup',
        'WhatsApp button',
        '1 month free support',
      ],
      featuresAr: [
        'حتى 5 صفحات',
        'تصميم متجاوب مع الجوال',
        'تكامل نموذج التواصل',
        'إعداد SEO أساسي',
        'زر واتساب',
        'دعم مجاني لمدة شهر',
      ],
      cta: 'Start Now',
      ctaAr: 'ابدأ الآن',
    },
    {
      name: 'Growth',
      nameAr: 'النمو',
      price: 'From SAR 8,000',
      priceAr: 'ابتداءً من 8,000 ر.س',
      timeline: '10–14 days',
      timelineAr: '10–14 يوم',
      popular: true,
      highlight: 'Most Popular',
      highlightAr: 'الأكثر طلبًا',
      features: [
        'Up to 15 pages',
        'Custom UI/UX design',
        'CMS / Blog integration',
        'Advanced SEO optimization',
        'Analytics dashboard',
        'Performance optimization',
        '3 months free support',
        'WhatsApp & live chat',
      ],
      featuresAr: [
        'حتى 15 صفحة',
        'تصميم UI/UX مخصص',
        'تكامل CMS / مدونة',
        'تحسين SEO متقدم',
        'لوحة تحليلات',
        'تحسين الأداء',
        'دعم مجاني 3 أشهر',
        'واتساب + دردشة مباشرة',
      ],
      cta: 'Start Now',
      ctaAr: 'ابدأ الآن',
    },
    {
      name: 'Enterprise',
      nameAr: 'المؤسسات',
      price: 'Custom Quote',
      priceAr: 'سعر حسب الطلب',
      priceNote: 'Contact us',
      priceNoteAr: 'تواصل معنا',
      timeline: '3–6 weeks',
      timelineAr: '3–6 أسابيع',
      features: [
        'Unlimited pages',
        'Custom web application',
        'API integrations',
        'Multi-language (AR/EN)',
        'Advanced analytics',
        'Priority 24/7 support',
        'SLA guarantee',
        'Dedicated project manager',
      ],
      featuresAr: [
        'عدد صفحات غير محدود',
        'تطبيق ويب مخصص',
        'تكاملات API',
        'دعم متعدد اللغات (AR/EN)',
        'تحليلات متقدمة',
        'دعم أولوية 24/7',
        'ضمان SLA',
        'مدير مشروع مخصص',
      ],
      cta: 'Get a Quote',
      ctaAr: 'اطلب عرض سعر',
    },
  ],
  ecommerce: [
    {
      name: 'Salla Starter',
      nameAr: 'سلة - البداية',
      price: 'From SAR 2,500',
      priceAr: 'ابتداءً من 2,500 ر.س',
      timeline: '3–5 days',
      timelineAr: '3–5 أيام',
      features: [
        'Salla store setup',
        'Custom theme installation',
        'Up to 50 products',
        'Payment gateway (Mada, Visa)',
        'Basic product categories',
        '1 month support',
      ],
      featuresAr: [
        'إعداد متجر سلة',
        'تركيب قالب مخصص',
        'حتى 50 منتج',
        'بوابات دفع (مدى، فيزا)',
        'تصنيفات منتجات أساسية',
        'دعم لمدة شهر',
      ],
      cta: 'Start Now',
      ctaAr: 'ابدأ الآن',
    },
    {
      name: 'Salla Growth',
      nameAr: 'سلة - النمو',
      price: 'From SAR 6,000',
      priceAr: 'ابتداءً من 6,000 ر.س',
      timeline: '7–10 days',
      timelineAr: '7–10 أيام',
      popular: true,
      highlight: 'Best Value',
      highlightAr: 'أفضل قيمة',
      features: [
        'Custom Salla theme design',
        'Unlimited products',
        'All payment gateways',
        'Inventory management',
        'Abandoned cart recovery',
        'Promo codes & discounts',
        'SEO product optimization',
        '3 months support',
      ],
      featuresAr: [
        'تصميم قالب سلة مخصص',
        'منتجات غير محدودة',
        'جميع بوابات الدفع',
        'إدارة المخزون',
        'استرجاع السلة المتروكة',
        'كوبونات وعروض',
        'تحسين SEO للمنتجات',
        'دعم 3 أشهر',
      ],
      cta: 'Start Now',
      ctaAr: 'ابدأ الآن',
    },
    {
      name: 'Salla Pro',
      nameAr: 'سلة - الاحترافي',
      price: 'From SAR 12,000',
      priceAr: 'ابتداءً من 12,000 ر.س',
      timeline: '2–4 weeks',
      timelineAr: '2–4 أسابيع',
      features: [
        'Fully custom Salla build',
        'ERP / CRM integration',
        'Multi-branch support',
        'Advanced analytics',
        'Automation workflows',
        'Dedicated account manager',
        '6 months support',
        'Staff training included',
      ],
      featuresAr: [
        'متجر سلة مخصص بالكامل',
        'تكامل ERP / CRM',
        'دعم تعدد الفروع',
        'تحليلات متقدمة',
        'سير عمل آلي',
        'مدير حساب مخصص',
        'دعم 6 أشهر',
        'تدريب الفريق',
      ],
      cta: 'Get a Quote',
      ctaAr: 'اطلب عرض سعر',
    },
  ],
  seo: [
    {
      name: 'Local SEO',
      nameAr: 'SEO المحلي',
      price: 'SAR 1,800 / mo',
      priceAr: '1,800 ر.س / شهريًا',
      timeline: 'First results in 30 days',
      timelineAr: 'أول نتائج خلال 30 يوم',
      features: [
        'Google My Business optimization',
        'Local keyword targeting',
        '10 target keywords',
        'Monthly performance report',
        'On-page optimization',
        'Citation building',
      ],
      featuresAr: [
        'تحسين Google My Business',
        'استهداف الكلمات المحلية',
        '10 كلمات مفتاحية',
        'تقرير أداء شهري',
        'تحسين داخلي للصفحات',
        'بناء الاستشهادات',
      ],
      cta: 'Start Now',
      ctaAr: 'ابدأ الآن',
    },
    {
      name: 'Growth SEO',
      nameAr: 'SEO النمو',
      price: 'SAR 3,500 / mo',
      priceAr: '3,500 ر.س / شهريًا',
      timeline: 'Results in 45–60 days',
      timelineAr: 'نتائج خلال 45–60 يوم',
      popular: true,
      highlight: 'Most Popular',
      highlightAr: 'الأكثر طلبًا',
      features: [
        '30 target keywords',
        'Full technical SEO audit',
        'Content strategy & creation',
        'Backlink building',
        'Competitor analysis',
        'Bi-weekly reports',
        'AR + EN optimization',
        'Schema markup',
      ],
      featuresAr: [
        '30 كلمة مفتاحية',
        'تدقيق SEO تقني شامل',
        'استراتيجية وصناعة محتوى',
        'بناء روابط خارجية',
        'تحليل المنافسين',
        'تقارير نصف شهرية',
        'تحسين عربي + إنجليزي',
        'Schema markup',
      ],
      cta: 'Start Now',
      ctaAr: 'ابدأ الآن',
    },
    {
      name: 'Authority SEO',
      nameAr: 'SEO الهيمنة',
      price: 'SAR 6,500 / mo',
      priceAr: '6,500 ر.س / شهريًا',
      timeline: 'Compounding results',
      timelineAr: 'نتائج تراكمية مستمرة',
      features: [
        'Unlimited target keywords',
        'Full content marketing plan',
        'Premium link building',
        'PR & media coverage',
        'Weekly reporting',
        'Dedicated SEO strategist',
        'Priority execution',
        'Conversion tracking',
      ],
      featuresAr: [
        'كلمات مفتاحية غير محدودة',
        'خطة تسويق محتوى كاملة',
        'روابط خارجية عالية الجودة',
        'تغطية إعلامية وPR',
        'تقارير أسبوعية',
        'استشاري SEO مخصص',
        'تنفيذ بأولوية',
        'تتبع التحويلات',
      ],
      cta: 'Get a Quote',
      ctaAr: 'اطلب عرض سعر',
    },
  ],
  systems: [
    {
      name: 'Basic System',
      nameAr: 'نظام أساسي',
      price: 'From SAR 8,000',
      priceAr: 'ابتداءً من 8,000 ر.س',
      timeline: '2–3 weeks',
      timelineAr: '2–3 أسابيع',
      features: [
        'Custom admin dashboard',
        'User management',
        'Basic reporting',
        'Data export (Excel/PDF)',
        'Role-based access',
        '2 months support',
      ],
      featuresAr: [
        'لوحة تحكم إدارية مخصصة',
        'إدارة المستخدمين',
        'تقارير أساسية',
        'تصدير بيانات (Excel/PDF)',
        'صلاحيات حسب الدور',
        'دعم شهرين',
      ],
      cta: 'Start Now',
      ctaAr: 'ابدأ الآن',
    },
    {
      name: 'Business System',
      nameAr: 'نظام أعمال',
      price: 'From SAR 18,000',
      priceAr: 'ابتداءً من 18,000 ر.س',
      timeline: '4–6 weeks',
      timelineAr: '4–6 أسابيع',
      popular: true,
      highlight: 'Most Requested',
      highlightAr: 'الأكثر طلبًا',
      features: [
        'Full custom ERP/CRM',
        'Multi-module system',
        'Third-party integrations',
        'Automated workflows',
        'Advanced analytics',
        'Mobile-friendly interface',
        'Staff training',
        '6 months support',
      ],
      featuresAr: [
        'ERP/CRM مخصص بالكامل',
        'نظام متعدد الوحدات',
        'تكاملات طرف ثالث',
        'سير عمل آلي',
        'تحليلات متقدمة',
        'واجهة متوافقة مع الجوال',
        'تدريب الفريق',
        'دعم 6 أشهر',
      ],
      cta: 'Start Now',
      ctaAr: 'ابدأ الآن',
    },
    {
      name: 'Enterprise System',
      nameAr: 'نظام مؤسسي',
      price: 'Custom Scope',
      priceAr: 'نطاق مخصص',
      priceNote: 'Contact us',
      priceNoteAr: 'تواصل معنا',
      timeline: '6–12 weeks',
      timelineAr: '6–12 أسبوع',
      features: [
        'Enterprise architecture',
        'API-first design',
        'Cloud infrastructure',
        'Multi-tenant support',
        'AI/automation layer',
        'On-premise or cloud',
        'SLA & 24/7 support',
        'Dedicated dev team',
      ],
      featuresAr: [
        'هندسة مؤسسية',
        'تصميم API-first',
        'بنية تحتية سحابية',
        'دعم متعدد المستأجرين',
        'طبقة ذكاء اصطناعي/أتمتة',
        'تشغيل سحابي أو داخلي',
        'SLA ودعم 24/7',
        'فريق تطوير مخصص',
      ],
      cta: 'Get a Quote',
      ctaAr: 'اطلب عرض سعر',
    },
  ],
};

const specialOfferFeatures = {
  en: [
    'Custom Landing Page: A high-converting professional design.',
    'Direct WhatsApp Integration: For instant customer communication.',
    'Social Media Linking: Seamless connection to your platforms.',
    'Custom Contact Page: Designed for lead generation.',
    'Professional Logo Design: Reflecting your brand identity.',
    'Free Domain & Hosting: Included for the first year.',
  ],
  ar: [
    'صفحة هبوط مخصصة: تصميم احترافي عالي التحويل.',
    'ربط مباشر مع واتساب: للتواصل الفوري مع العملاء.',
    'ربط حسابات السوشال ميديا: اتصال سلس بمنصاتك.',
    'صفحة تواصل مخصصة: مصممة لجذب العملاء المحتملين.',
    'تصميم شعار احترافي: يعكس هوية علامتك التجارية.',
    'دومين واستضافة مجانًا: لمدة سنة كاملة.',
  ],
};

const specialOfferWhyUs = {
  en: [
    'Fast Delivery: Ready in 2 to 3 business days.',
    'Fully Responsive: Perfect viewing on mobile and desktop.',
    'Continuous Technical Support: We are here when you need us.',
  ],
  ar: [
    'تسليم سريع: جاهز خلال 2 إلى 3 أيام عمل.',
    'متوافق بالكامل: عرض مثالي على الجوال وسطح المكتب.',
    'دعم فني مستمر: نحن معك عند الحاجة.',
  ],
};

export default function PricingPage() {
  const { locale, isRTL } = useI18n();
  const isAR = locale === 'ar';
  const [active, setActive] = useState<PricingCategory>('website');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const openModal = (planName: string) => {
    setSelectedPlan(planName);
    setModalOpen(true);
  };

  return (
    <>
      <main className="min-h-screen relative bg-[#f8fafc]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        {/* Hero */}
        <section className="relative pt-32 pb-16 px-4 md:px-8 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,166,35,0.14) 0%, transparent 72%)' }}
          />
          <div className="container-max relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="section-label mb-5 inline-flex">
                <Zap size={12} className="mr-1" />
                {isAR ? 'أسعار واضحة' : 'Transparent Pricing'}
              </span>
              <h1 className="heading-xl text-slate-900 mb-5 leading-tight">
                {isAR ? 'باقات واضحة، ' : 'Clear Packages, '}
                <span className="orange-gradient-text">{isAR ? 'نتائج حقيقية' : 'Real Results'}</span>
              </h1>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
                {isAR
                  ? 'بدون رسوم مخفية وبدون مفاجآت. نطاق عمل واضح وجدول زمني محدد حتى تعرف بالضبط ماذا ستحصل عليه قبل البدء.'
                  : 'No hidden fees. No surprises. Fixed-scope projects with defined timelines so you know exactly what you\'re getting before you sign.'}
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
                {[
                  { icon: Shield, text: isAR ? 'نطاق ثابت بدون فواتير مفاجئة' : 'Fixed scope, no surprise billing' },
                  { icon: Clock, text: isAR ? 'جدول تسليم مضمون' : 'Guaranteed delivery timelines' },
                  { icon: Star, text: isAR ? 'نسبة رضا عملاء 98%' : '98% client satisfaction rate' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon size={15} className="text-brand-orange" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Special Offer */}
        <section className="px-4 md:px-8 pb-2">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="relative overflow-hidden rounded-2xl border border-amber-300/60 bg-white p-6 md:p-8 shadow-[0_10px_32px_rgba(245,166,35,0.16)]"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 55% at 100% 0%, rgba(245,166,35,0.12) 0%, transparent 70%)' }}
              />
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-700">
                  <Star size={13} />
                  {isAR ? 'عرض خاص من الشركة' : 'Special Company Offer'}
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
                  {isAR
                    ? 'باقة التحول الرقمي الاحترافية'
                    : 'Professional Digital Transformation Package'}
                </h2>
                <p className="text-slate-600 text-sm md:text-base mb-4">
                  {isAR
                    ? 'نحن متحمسون لتقديم باقة مميزة تساعدك على إطلاق حضورك الرقمي بشكل احترافي وسريع.'
                    : 'We are excited to offer you a special package to launch your online presence professionally and quickly.'}
                </p>

                <div className="mb-6">
                  <span className="text-sm text-slate-500">{isAR ? 'السعر الخاص:' : 'Special Price:'}</span>
                  <p className="text-3xl md:text-4xl font-black text-brand-orange leading-tight">
                    {isAR ? '1,870 ر.س فقط' : 'Only 1870 SAR!'}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-slate-900 font-bold mb-3">
                      {isAR ? 'الباقة تشمل:' : 'The Package Includes:'}
                    </h3>
                    <ul className="space-y-2.5">
                      {(isAR ? specialOfferFeatures.ar : specialOfferFeatures.en).map((item, idx) => (
                        <li key={`${item}-${idx}`} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                          <Check size={14} className="text-brand-orange mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-slate-900 font-bold mb-3">
                      {isAR ? 'لماذا تختارنا؟' : 'Why Choose Us?'}
                    </h3>
                    <ul className="space-y-2.5 mb-6">
                      {(isAR ? specialOfferWhyUs.ar : specialOfferWhyUs.en).map((item, idx) => (
                        <li key={`${item}-${idx}`} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                          <Check size={14} className="text-brand-orange mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-sm font-semibold text-slate-800 mb-4">
                      {isAR ? 'أطلق حضورك الرقمي اليوم!' : 'Launch your digital presence today!'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => openModal(isAR ? 'باقة التحول الرقمي الاحترافية' : 'Professional Digital Transformation Package')}
                        className="btn-primary px-5 py-3 text-sm">
                        {isAR ? 'احجز العرض الآن' : 'Book This Offer'}
                      </button>
                      <a
                        href="https://commergio.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary px-5 py-3 text-sm"
                      >
                        {isAR ? 'زيارة الموقع' : 'Visit Website'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Urgency bar */}
        <div className="py-3 px-4 text-center text-sm font-semibold" style={{ background: 'rgba(245,166,35,0.08)', borderTop: '1px solid rgba(245,166,35,0.18)', borderBottom: '1px solid rgba(245,166,35,0.18)' }}>
          <span className="text-brand-orange">{isAR ? 'عدد المقاعد محدود —' : 'Limited availability —'}</span>
          <span className="text-slate-700 ml-2">
            {isAR
              ? 'نضم كحد أقصى 5 عملاء جدد شهريًا للحفاظ على الجودة.'
              : 'We onboard a maximum of 5 new clients per month to maintain quality.'}
          </span>
          <a href="#packages" className="text-brand-orange font-bold hover:underline ml-1">
            {isAR ? 'احجز مقعدك الآن ←' : 'Secure your slot →'}
          </a>
        </div>

        {/* Category tabs */}
        <section className="section-padding pt-16" id="packages">
          <div className="container-max">
            <div className="flex flex-wrap justify-center items-stretch gap-2 mb-14">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold leading-snug whitespace-normal min-h-[44px] transition-all duration-200 ${
                    active === cat.id
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {isAR ? cat.labelAr : cat.label}
                </button>
              ))}
            </div>

            {/* Plans grid */}
            <motion.div
              key={active}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {plans[active].map((plan, i) => (
                <PricingCard
                  key={plan.name}
                  plan={plan}
                  index={i}
                  isAR={isAR}
                  onSelect={() => openModal(`${isAR ? plan.nameAr : plan.name} — ${isAR ? categories.find(c => c.id === active)?.labelAr : categories.find(c => c.id === active)?.label}`)}
                />
              ))}
            </motion.div>

            {/* Bottom note */}
            <div className="text-center mt-12 text-slate-500 text-sm">
              {isAR ? 'جميع الأسعار غير شاملة ضريبة القيمة المضافة (15%). لديك متطلبات خاصة؟ ' : 'All prices are exclusive of VAT (15%). Custom requirements? '}
              <a href="/contact" className="text-brand-orange hover:underline">
                {isAR ? 'تواصل معنا لعرض سعر مخصص.' : 'Contact us for a tailored quote.'}
              </a>
            </div>
          </div>
        </section>

        {/* Process steps */}
        <section className="section-padding pt-4 bg-[#f1f5f9]">
          <div className="divider-gradient mb-16" />
          <div className="container-max">
            <div className="text-center mb-14">
              <span className="section-label mb-4 inline-flex">{isAR ? 'آلية العمل' : 'How It Works'}</span>
              <h2 className="heading-lg text-slate-900 mb-4">
                {isAR ? 'من الطلب إلى ' : 'From Inquiry to '}
                <span className="orange-gradient-text">{isAR ? 'الإطلاق خلال 3 خطوات' : 'Launch in 3 Steps'}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: isAR ? 'أرسل متطلباتك' : 'Submit Your Brief',
                  desc: isAR ? 'أخبرنا عن مشروعك وأهدافك وميزانيتك. نعود لك خلال 24 ساعة بعرض مناسب.' : 'Tell us about your project, goals, and budget. We respond within 24 hours with a tailored proposal.',
                  icon: MessageSquare,
                  color: '#f5a623',
                },
                {
                  step: '02',
                  title: isAR ? 'نحلل ونخطط' : 'We Scope & Plan',
                  desc: isAR ? 'فريقنا يضع خطة تنفيذ دقيقة بنطاق واضح وسعر ثابت وجدول زمني ثابت — بدون مفاجآت.' : 'Our senior team designs a precise execution plan. Fixed scope, fixed price, fixed timeline — no surprises.',
                  icon: Shield,
                  color: '#3b82f6',
                },
                {
                  step: '03',
                  title: isAR ? 'ننّفذ ونسلّم' : 'We Build & Deliver',
                  desc: isAR ? 'تطوير سريع مع تحديثات مستمرة. تحصل على منتج جاهز للإطلاق مع دعم بعد التسليم.' : 'Rapid development with daily updates. You get a production-ready product, with post-launch support included.',
                  icon: Zap,
                  color: '#10b981',
                },
              ].map((step, i) => (
                <motion.div
                  key={step.step}
                  className="bg-white border border-slate-200 p-7 relative overflow-hidden rounded-2xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="absolute top-0 right-0 text-7xl font-black opacity-[0.04] leading-none select-none"
                    style={{ color: step.color, fontFamily: 'var(--font-syne), var(--font-inter), sans-serif' }}
                  >
                    {step.step}
                  </div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${step.color}12`, border: `1px solid ${step.color}25` }}
                  >
                    <step.icon size={20} style={{ color: step.color }} />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding">
          <div className="container-max">
            <motion.div
              className="bg-white border border-amber-200 p-8 md:p-12 text-center relative overflow-hidden rounded-2xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(245,166,35,0.05) 0%, transparent 70%)' }}
              />
              <div className="relative z-10">
                <span className="section-label mb-5 inline-flex">{isAR ? 'جاهز للانطلاق؟' : 'Ready to Start?'}</span>
                <h2 className="heading-lg text-slate-900 mb-4">
                  {isAR ? 'مشروعك يبدأ ' : 'Your Project Starts '}
                  <span className="orange-gradient-text">{isAR ? 'اليوم' : 'Today'}</span>
                </h2>
                <p className="text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
                  {isAR
                    ? 'لا تترك المنافسين يسبقونك. لدينا مقاعد محدودة هذا الشهر. أرسل متطلباتك الآن وسنعود لك خلال 24 ساعة.'
                    : 'Don\'t let your competitors get ahead. We have limited slots available this month. Submit your brief now and we\'ll get back to you within 24 hours.'}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button onClick={() => openModal('')} className="btn-primary px-8 py-4 text-base">
                    {isAR ? 'ابدأ مشروعك' : 'Start Your Project'}
                    <ArrowRight size={16} />
                  </button>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                    className="btn-secondary px-8 py-4 text-base"
                    style={{ borderColor: 'rgba(37,211,102,0.3)', color: '#25D366' }}>
                    <MessageSquare size={16} />
                    {isAR ? 'راسلنا عبر واتساب' : 'WhatsApp Us'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {modalOpen && (
        <StartProjectModal
          onClose={() => setModalOpen(false)}
          defaultService={selectedPlan}
          source="pricing"
        />
      )}
    </>
  );
}

function PricingCard({ plan, index, onSelect, isAR }: { plan: Plan; index: number; onSelect: () => void; isAR: boolean }) {
  const title = isAR ? plan.nameAr : plan.name;
  const price = isAR ? plan.priceAr : plan.price;
  const timeline = isAR ? plan.timelineAr : plan.timeline;
  const note = isAR ? (plan.priceNoteAr || plan.priceNote) : plan.priceNote;
  const features = isAR ? plan.featuresAr : plan.features;
  const cta = isAR ? plan.ctaAr : plan.cta;
  const highlight = isAR ? (plan.highlightAr || plan.highlight) : plan.highlight;
  return (
    <motion.div
      className={`relative flex h-full flex-col rounded-2xl overflow-hidden ${plan.popular ? 'ring-1 ring-brand-orange/40' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      style={{
        background: plan.popular ? 'rgba(245,166,35,0.07)' : '#ffffff',
        border: plan.popular ? '1px solid rgba(245,166,35,0.25)' : '1px solid rgba(15,23,42,0.1)',
        boxShadow: plan.popular ? '0 10px 35px rgba(245,166,35,0.16)' : '0 6px 24px rgba(15,23,42,0.08)',
      }}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 py-2 text-center text-xs font-bold tracking-widest uppercase"
          style={{ background: 'linear-gradient(135deg, #f5a623, #e09118)', color: '#040c18' }}>
          {highlight}
        </div>
      )}

      <div className={`p-7 flex flex-col flex-1 ${plan.popular ? 'pt-12' : ''}`}>
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-slate-900 font-bold text-xl mb-3 leading-snug break-words" style={{ letterSpacing: '-0.02em' }}>
            {title}
          </h3>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mb-1 leading-tight break-words" style={{ letterSpacing: '-0.03em' }}>
            {price}
          </div>
          {note && (
            <p className="text-slate-500 text-xs font-medium">{note}</p>
          )}
          <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
            <Clock size={13} className="text-brand-orange" />
            {timeline}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-6" style={{ background: 'rgba(15,23,42,0.1)' }} />

        {/* Features */}
        <ul className="space-y-3 flex-1 mb-8">
          {features.map((f, idx) => (
            <li key={`${f}-${idx}`} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
              <Check size={14} className="text-brand-orange flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={onSelect}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            plan.popular ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          {cta}
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
