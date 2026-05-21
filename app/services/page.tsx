'use client';

import Link from 'next/link';
import { Globe, Smartphone, Settings, Palette, TrendingUp, CreditCard, Briefcase, ShoppingBag, Search, Brain, ArrowRight, CircleCheck as CheckCircle2, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    titleAr: 'تطوير المواقع الإلكترونية',
    description: 'High-performance web applications engineered for scale. From marketing websites to complex enterprise platforms — built with modern stacks and optimized for conversion.',
    descriptionAr: 'تطبيقات ويب عالية الأداء مبنية للتوسع. من مواقع التسويق إلى منصات المؤسسات المعقدة — بأحدث التقنيات ومُحسَّنة للتحويل.',
    benefits: ['Lightning-fast load times (< 2s)', 'Mobile-first responsive design', 'SEO-optimized architecture', 'CMS integration', 'Custom dashboards & admin panels'],
    benefitsAr: ['أوقات تحميل فائقة السرعة (أقل من ثانيتين)', 'تصميم متجاوب يُقدّم الجوال أولاً', 'بنية محسّنة لمحركات البحث', 'تكامل مع أنظمة إدارة المحتوى', 'لوحات تحكم وأنظمة إدارية مخصصة'],
    process: ['Discovery & Requirements', 'Architecture Design', 'Development Sprint', 'QA & Testing', 'Launch & Monitoring'],
    processAr: ['الاستكشاف وتحديد المتطلبات', 'تصميم البنية التقنية', 'دورة التطوير', 'ضمان الجودة والاختبار', 'الإطلاق والمراقبة'],
    color: '#3b82f6',
    category: 'Technology',
    categoryAr: 'التقنية',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    titleAr: 'تطوير تطبيقات الجوال',
    description: 'Native iOS and Android applications, as well as cross-platform solutions using React Native. Deliver seamless experiences that users love and businesses depend on.',
    descriptionAr: 'تطبيقات iOS و Android الأصلية وكذلك الحلول متعددة المنصات باستخدام React Native. نقدم تجارب سلسة يحبها المستخدمون وتعتمد عليها الأعمال.',
    benefits: ['iOS & Android coverage', 'Offline functionality', 'Push notifications', 'App Store optimization', 'Analytics integration'],
    benefitsAr: ['تغطية iOS و Android', 'وظائف بدون اتصال', 'إشعارات فورية', 'تحسين متاجر التطبيقات', 'تكامل التحليلات'],
    process: ['UX Research', 'Prototype & Design', 'Development', 'Beta Testing', 'App Store Submission'],
    processAr: ['أبحاث تجربة المستخدم', 'النموذج الأولي والتصميم', 'التطوير', 'اختبار النسخة التجريبية', 'نشر التطبيق'],
    color: '#10b981',
    category: 'Technology',
    categoryAr: 'التقنية',
  },
  {
    icon: Settings,
    title: 'Systems Development & Automation',
    titleAr: 'تطوير الأنظمة والأتمتة',
    description: 'Custom ERP, CRM, and workflow automation systems that eliminate manual processes and unlock operational efficiency at scale.',
    descriptionAr: 'أنظمة ERP و CRM وأتمتة سير العمل المخصصة التي تقضي على العمليات اليدوية وتُطلق الكفاءة التشغيلية على نطاق واسع.',
    benefits: ['Workflow automation', 'ERP/CRM customization', 'API integrations', 'Real-time dashboards', 'Role-based access control'],
    benefitsAr: ['أتمتة سير العمل', 'تخصيص ERP/CRM', 'تكاملات API', 'لوحات بيانات فورية', 'التحكم في الوصول بالصلاحيات'],
    process: ['Process Audit', 'System Design', 'Development', 'User Training', 'Continuous Optimization'],
    processAr: ['تدقيق العمليات', 'تصميم النظام', 'التطوير', 'تدريب المستخدمين', 'التحسين المستمر'],
    color: '#f5a623',
    category: 'Technology',
    categoryAr: 'التقنية',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    titleAr: 'تصميم تجربة وواجهة المستخدم',
    description: 'Research-driven design that converts. We create design systems and user experiences that reduce friction, increase trust, and drive measurable business results.',
    descriptionAr: 'تصميم مدفوع بالأبحاث يُحوّل الزوار إلى عملاء. نبني أنظمة تصميم وتجارب مستخدم تقلل الاحتكاك وتزيد الثقة وتحقق نتائج أعمال قابلة للقياس.',
    benefits: ['User research & testing', 'Design system creation', 'Conversion optimization', 'Accessibility compliance', 'Interactive prototypes'],
    benefitsAr: ['أبحاث واختبار المستخدمين', 'إنشاء نظام تصميم', 'تحسين التحويل', 'الامتثال لمعايير إمكانية الوصول', 'نماذج أولية تفاعلية'],
    process: ['User Research', 'Information Architecture', 'Wireframing', 'Visual Design', 'Usability Testing'],
    processAr: ['بحث المستخدمين', 'هندسة المعلومات', 'الإطارات السلكية', 'التصميم البصري', 'اختبار قابلية الاستخدام'],
    color: '#ec4899',
    category: 'Design',
    categoryAr: 'التصميم',
  },
  {
    icon: TrendingUp,
    title: 'Business Development & Restructuring',
    titleAr: 'تطوير الأعمال وإعادة الهيكلة',
    description: 'Strategic business transformation from the ground up. We analyze, restructure, and rebuild operations for sustainable competitive advantage.',
    descriptionAr: 'تحول استراتيجي شامل للأعمال من الأساس. نحلل ونُعيد الهيكلة ونُعيد بناء العمليات لميزة تنافسية مستدامة.',
    benefits: ['Market entry strategy', 'Operational restructuring', 'Revenue model optimization', 'Competitive analysis', 'KPI framework design'],
    benefitsAr: ['استراتيجية دخول السوق', 'إعادة الهيكلة التشغيلية', 'تحسين نموذج الإيرادات', 'التحليل التنافسي', 'تصميم إطار KPI'],
    process: ['Business Audit', 'Gap Analysis', 'Strategy Development', 'Implementation', 'Performance Tracking'],
    processAr: ['تدقيق الأعمال', 'تحليل الفجوات', 'تطوير الاستراتيجية', 'التنفيذ', 'تتبع الأداء'],
    color: '#8b5cf6',
    category: 'Business',
    categoryAr: 'الأعمال',
  },
  {
    icon: CreditCard,
    title: 'Payment Gateway Integration',
    titleAr: 'تكامل بوابات الدفع',
    description: 'Seamless, secure payment processing integrated into your platforms. We support all major Saudi and international payment gateways.',
    descriptionAr: 'معالجة مدفوعات سلسة وآمنة مدمجة في منصاتك. ندعم جميع بوابات الدفع السعودية والدولية الرئيسية.',
    benefits: ['Mada, Tabby, Tamara', 'Stripe & PayPal', 'Apple Pay & Google Pay', 'STC Pay & Urpay', 'PCI DSS compliant'],
    benefitsAr: ['مدى، تابي، تمارا', 'Stripe و PayPal', 'Apple Pay و Google Pay', 'STC Pay و Urpay', 'متوافق مع PCI DSS'],
    process: ['Gateway Selection', 'API Integration', 'Security Testing', 'Checkout Optimization', 'Monitoring Setup'],
    processAr: ['اختيار بوابة الدفع', 'تكامل API', 'اختبار الأمان', 'تحسين الدفع', 'إعداد المراقبة'],
    color: '#14b8a6',
    category: 'Technology',
    categoryAr: 'التقنية',
  },
  {
    icon: Briefcase,
    title: 'Full Business Consulting',
    titleAr: 'الاستشارات التجارية الشاملة',
    description: 'End-to-end business establishment — from legal entity setup to market strategy and brand positioning. We build businesses from concept to launch.',
    descriptionAr: 'إنشاء أعمال شامل من الألف إلى الياء — من التأسيس القانوني إلى استراتيجية السوق وتموضع العلامة التجارية. نبني الأعمال من الفكرة إلى الإطلاق.',
    benefits: ['Commercial registration', 'Business plan development', 'Brand strategy', 'Financial modeling', 'Market entry consulting'],
    benefitsAr: ['التسجيل التجاري', 'تطوير خطة الأعمال', 'استراتيجية العلامة التجارية', 'النمذجة المالية', 'استشارات دخول السوق'],
    process: ['Concept Validation', 'Business Planning', 'Legal Setup', 'Brand Development', 'Market Launch'],
    processAr: ['التحقق من الفكرة', 'التخطيط التجاري', 'الإعداد القانوني', 'تطوير العلامة', 'الإطلاق في السوق'],
    color: '#f59e0b',
    category: 'Business',
    categoryAr: 'الأعمال',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Store Setup (Salla)',
    titleAr: 'إعداد متاجر إلكترونية على سلة',
    description: 'Complete Salla e-commerce store setup with custom themes, product catalog management, payment integration, and conversion optimization.',
    descriptionAr: 'إعداد متجر سلة الإلكتروني بالكامل مع قوالب مخصصة وإدارة كتالوج المنتجات وتكامل الدفع وتحسين التحويل.',
    benefits: ['Custom Salla theme design', 'Product catalog setup', 'Payment gateway activation', 'Shipping configuration', 'SEO & marketing setup'],
    benefitsAr: ['تصميم قالب سلة مخصص', 'إعداد كتالوج المنتجات', 'تفعيل بوابة الدفع', 'إعداد الشحن', 'إعداد SEO والتسويق'],
    process: ['Store Planning', 'Theme Customization', 'Product Import', 'Payment Setup', 'Launch & Training'],
    processAr: ['تخطيط المتجر', 'تخصيص القالب', 'استيراد المنتجات', 'إعداد الدفع', 'الإطلاق والتدريب'],
    color: '#06b6d4',
    category: 'E-commerce',
    categoryAr: 'التجارة الإلكترونية',
  },
  {
    icon: Search,
    title: 'SEO Optimization',
    titleAr: 'تحسين محركات البحث',
    description: 'Technical and content SEO strategies that drive sustainable organic growth. Dominate search rankings in your target market — Arabic and English.',
    descriptionAr: 'استراتيجيات SEO تقنية ومحتوى تدفع النمو العضوي المستدام. احتلّ صدارة نتائج البحث في سوقك المستهدف — بالعربية والإنجليزية.',
    benefits: ['Technical SEO audit', 'Keyword strategy', 'Content optimization', 'Link building', 'Local SEO for Saudi market'],
    benefitsAr: ['تدقيق SEO التقني', 'استراتيجية الكلمات المفتاحية', 'تحسين المحتوى', 'بناء الروابط', 'SEO المحلي للسوق السعودي'],
    process: ['SEO Audit', 'Keyword Research', 'On-Page Optimization', 'Content Strategy', 'Reporting & Refinement'],
    processAr: ['تدقيق SEO', 'بحث الكلمات المفتاحية', 'تحسين الصفحات', 'استراتيجية المحتوى', 'التقارير والتحسين'],
    color: '#84cc16',
    category: 'Marketing',
    categoryAr: 'التسويق',
  },
  {
    icon: Brain,
    title: 'AI Solutions',
    titleAr: 'حلول الذكاء الاصطناعي',
    description: 'Custom AI integrations that give your business a competitive edge. Intelligent chatbots, automation workflows, and machine learning systems tailored to your needs.',
    descriptionAr: 'تكاملات ذكاء اصطناعي مخصصة تمنح أعمالك ميزة تنافسية. روبوتات محادثة ذكية وتدفقات أتمتة وأنظمة تعلم آلي مصممة لاحتياجاتك.',
    benefits: ['AI chatbot development', 'Process automation with AI', 'Data analytics & insights', 'Predictive modeling', 'LLM integration (GPT, Gemini)'],
    benefitsAr: ['تطوير روبوتات المحادثة', 'أتمتة العمليات بالذكاء الاصطناعي', 'تحليل البيانات والرؤى', 'النمذجة التنبؤية', 'تكامل نماذج اللغة الكبيرة (GPT، Gemini)'],
    process: ['AI Readiness Assessment', 'Use Case Definition', 'Model Selection', 'Integration & Training', 'Monitoring & Refinement'],
    processAr: ['تقييم الجاهزية للذكاء الاصطناعي', 'تحديد حالات الاستخدام', 'اختيار النموذج', 'التكامل والتدريب', 'المراقبة والتحسين'],
    color: '#f43f5e',
    category: 'AI & Innovation',
    categoryAr: 'الذكاء الاصطناعي والابتكار',
  },
];

export default function ServicesPage() {
  const { t, locale } = useI18n();
  const isAR = locale === 'ar';

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="section-label mb-6 inline-flex">
            {t.services.heroLabel}
          </span>
          <h1 className="heading-xl text-white mb-6">
            {t.services.heroTitle1}{' '}
            <span className="orange-gradient-text">{t.services.heroTitle2}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.services.heroSub}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={i} className="glass-card-hover p-8">
                <div className="flex items-start gap-5 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${service.color}25 0%, ${service.color}08 100%)`,
                      border: `1px solid ${service.color}30`,
                    }}
                  >
                    <Icon size={24} style={{ color: service.color }} />
                  </div>
                  <div>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full mb-2 inline-block"
                      style={{ background: `${service.color}15`, color: service.color, border: `1px solid ${service.color}25` }}
                    >
                      {isAR ? service.categoryAr : service.category}
                    </span>
                    <h2 className="text-white font-bold text-xl mb-1">
                      {isAR ? service.titleAr : service.title}
                    </h2>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed mb-6">
                  {isAR ? service.descriptionAr : service.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-white font-semibold text-sm mb-3">{t.services.keyBenefits}</p>
                    <ul className="space-y-2">
                      {(isAR ? service.benefitsAr : service.benefits).map((benefit, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color: service.color }} />
                          <span className="text-slate-400 text-xs">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-white font-semibold text-sm mb-3">{t.services.ourProcess}</p>
                    <ol className="space-y-2">
                      {(isAR ? service.processAr : service.process).map((step, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: `${service.color}20`, color: service.color }}
                          >
                            {j + 1}
                          </span>
                          <span className="text-slate-400 text-xs">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                  style={{ color: service.color }}
                >
                  {t.services.getStartedWith} {isAR ? service.titleAr : service.title}
                  <ChevronRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-16 glass-card p-10 text-center border-brand-orange/15">
          <h2 className="heading-md text-white mb-4">
            {t.services.ctaTitle}
          </h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            {t.services.ctaSub}
          </p>
          <Link href="/contact" className="btn-primary text-base px-8 py-3.5">
            {t.services.ctaBtn}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
