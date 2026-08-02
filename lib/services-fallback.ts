import type { LucideIcon } from 'lucide-react';
import type { CompanyService } from '@/lib/types';
import { getServiceIcon } from '@/lib/service-icons';

export type ServiceEcosystemNode = {
  id: string;
  icon: LucideIcon;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  color: string;
  slug: string;
  angle: number;
};

export function toEcosystemNode(service: CompanyService): ServiceEcosystemNode {
  return {
    id: service.slug || service.id,
    icon: getServiceIcon(service.icon),
    title: service.title,
    titleAr: service.title_ar,
    description: service.short_description || service.description,
    descriptionAr: service.short_description_ar || service.description_ar,
    color: service.color,
    slug: service.slug,
    angle: service.ecosystem_angle,
  };
}

/** Default services when Supabase table is empty or unavailable. */
export const FALLBACK_COMPANY_SERVICES: CompanyService[] = [
  {
    id: 'fallback-web',
    title: 'Web Development',
    title_ar: 'تطوير المواقع الإلكترونية',
    short_description: 'High-performance web applications built with modern stacks.',
    short_description_ar: 'تطبيقات ويب عالية الأداء بأحدث التقنيات.',
    description:
      'High-performance web applications engineered for scale. From marketing websites to complex enterprise platforms — built with modern stacks and optimized for conversion.',
    description_ar:
      'تطبيقات ويب عالية الأداء مبنية للتوسع. من مواقع التسويق إلى منصات المؤسسات المعقدة — بأحدث التقنيات ومُحسَّنة للتحويل.',
    slug: 'web-development',
    icon: 'Globe',
    color: '#3b82f6',
    category: 'Technology',
    category_ar: 'التقنية',
    benefits: ['Lightning-fast load times (< 2s)', 'Mobile-first responsive design', 'SEO-optimized architecture', 'CMS integration', 'Custom dashboards & admin panels'],
    benefits_ar: ['أوقات تحميل فائقة السرعة (أقل من ثانيتين)', 'تصميم متجاوب يُقدّم الجوال أولاً', 'بنية محسّنة لمحركات البحث', 'تكامل مع أنظمة إدارة المحتوى', 'لوحات تحكم وأنظمة إدارية مخصصة'],
    process: ['Discovery & Requirements', 'Architecture Design', 'Development Sprint', 'QA & Testing', 'Launch & Monitoring'],
    process_ar: ['الاستكشاف وتحديد المتطلبات', 'تصميم البنية التقنية', 'دورة التطوير', 'ضمان الجودة والاختبار', 'الإطلاق والمراقبة'],
    ecosystem_angle: 0,
    show_on_homepage: true,
    is_published: true,
    display_order: 0,
    created_at: '',
  },
  {
    id: 'fallback-mobile',
    title: 'Mobile App Development',
    title_ar: 'تطوير تطبيقات الجوال',
    short_description: 'Native and cross-platform mobile applications for iOS & Android.',
    short_description_ar: 'تطبيقات الجوال الأصلية ومتعددة المنصات.',
    description:
      'Native iOS and Android applications, as well as cross-platform solutions using React Native. Deliver seamless experiences that users love and businesses depend on.',
    description_ar:
      'تطبيقات iOS و Android الأصلية وكذلك الحلول متعددة المنصات باستخدام React Native. نقدم تجارب سلسة يحبها المستخدمون وتعتمد عليها الأعمال.',
    slug: 'mobile-app-development',
    icon: 'Smartphone',
    color: '#10b981',
    category: 'Technology',
    category_ar: 'التقنية',
    benefits: ['iOS & Android coverage', 'Offline functionality', 'Push notifications', 'App Store optimization', 'Analytics integration'],
    benefits_ar: ['تغطية iOS و Android', 'وظائف بدون اتصال', 'إشعارات فورية', 'تحسين متاجر التطبيقات', 'تكامل التحليلات'],
    process: ['UX Research', 'Prototype & Design', 'Development', 'Beta Testing', 'App Store Submission'],
    process_ar: ['أبحاث تجربة المستخدم', 'النموذج الأولي والتصميم', 'التطوير', 'اختبار النسخة التجريبية', 'نشر التطبيق'],
    ecosystem_angle: 36,
    show_on_homepage: true,
    is_published: true,
    display_order: 1,
    created_at: '',
  },
  {
    id: 'fallback-systems',
    title: 'Systems Development & Automation',
    title_ar: 'تطوير الأنظمة والأتمتة',
    short_description: 'Custom ERP, CRM, and workflow automation systems.',
    short_description_ar: 'أنظمة ERP وCRM وأتمتة سير العمل.',
    description:
      'Custom ERP, CRM, and workflow automation systems that eliminate manual processes and unlock operational efficiency at scale.',
    description_ar:
      'أنظمة ERP و CRM وأتمتة سير العمل المخصصة التي تقضي على العمليات اليدوية وتُطلق الكفاءة التشغيلية على نطاق واسع.',
    slug: 'systems-automation',
    icon: 'Settings',
    color: '#f5a623',
    category: 'Technology',
    category_ar: 'التقنية',
    benefits: ['Workflow automation', 'ERP/CRM customization', 'API integrations', 'Real-time dashboards', 'Role-based access control'],
    benefits_ar: ['أتمتة سير العمل', 'تخصيص ERP/CRM', 'تكاملات API', 'لوحات بيانات فورية', 'التحكم في الوصول بالصلاحيات'],
    process: ['Process Audit', 'System Design', 'Development', 'User Training', 'Continuous Optimization'],
    process_ar: ['تدقيق العمليات', 'تصميم النظام', 'التطوير', 'تدريب المستخدمين', 'التحسين المستمر'],
    ecosystem_angle: 72,
    show_on_homepage: true,
    is_published: true,
    display_order: 2,
    created_at: '',
  },
  {
    id: 'fallback-uiux',
    title: 'UI/UX Design',
    title_ar: 'تصميم تجربة وواجهة المستخدم',
    short_description: 'Research-driven design systems that convert visitors into customers.',
    short_description_ar: 'أنظمة تصميم تحوّل الزوار إلى عملاء.',
    description:
      'Research-driven design that converts. We create design systems and user experiences that reduce friction, increase trust, and drive measurable business results.',
    description_ar:
      'تصميم مدفوع بالأبحاث يُحوّل الزوار إلى عملاء. نبني أنظمة تصميم وتجارب مستخدم تقلل الاحتكاك وتزيد الثقة وتحقق نتائج أعمال قابلة للقياس.',
    slug: 'ui-ux-design',
    icon: 'Palette',
    color: '#ec4899',
    category: 'Design',
    category_ar: 'التصميم',
    benefits: ['User research & testing', 'Design system creation', 'Conversion optimization', 'Accessibility compliance', 'Interactive prototypes'],
    benefits_ar: ['أبحاث واختبار المستخدمين', 'إنشاء نظام تصميم', 'تحسين التحويل', 'الامتثال لمعايير إمكانية الوصول', 'نماذج أولية تفاعلية'],
    process: ['User Research', 'Information Architecture', 'Wireframing', 'Visual Design', 'Usability Testing'],
    process_ar: ['بحث المستخدمين', 'هندسة المعلومات', 'الإطارات السلكية', 'التصميم البصري', 'اختبار قابلية الاستخدام'],
    ecosystem_angle: 108,
    show_on_homepage: true,
    is_published: true,
    display_order: 3,
    created_at: '',
  },
  {
    id: 'fallback-bizdev',
    title: 'Business Development & Restructuring',
    title_ar: 'تطوير الأعمال وإعادة الهيكلة',
    short_description: 'Strategic restructuring and business transformation services.',
    short_description_ar: 'إعادة الهيكلة والتحول التجاري الاستراتيجي.',
    description:
      'Strategic business transformation from the ground up. We analyze, restructure, and rebuild operations for sustainable competitive advantage.',
    description_ar:
      'تحول استراتيجي شامل للأعمال من الأساس. نحلل ونُعيد الهيكلة ونُعيد بناء العمليات لميزة تنافسية مستدامة.',
    slug: 'business-development',
    icon: 'TrendingUp',
    color: '#8b5cf6',
    category: 'Business',
    category_ar: 'الأعمال',
    benefits: ['Market entry strategy', 'Operational restructuring', 'Revenue model optimization', 'Competitive analysis', 'KPI framework design'],
    benefits_ar: ['استراتيجية دخول السوق', 'إعادة الهيكلة التشغيلية', 'تحسين نموذج الإيرادات', 'التحليل التنافسي', 'تصميم إطار KPI'],
    process: ['Business Audit', 'Gap Analysis', 'Strategy Development', 'Implementation', 'Performance Tracking'],
    process_ar: ['تدقيق الأعمال', 'تحليل الفجوات', 'تطوير الاستراتيجية', 'التنفيذ', 'تتبع الأداء'],
    ecosystem_angle: 144,
    show_on_homepage: true,
    is_published: true,
    display_order: 4,
    created_at: '',
  },
  {
    id: 'fallback-payment',
    title: 'Payment Gateway Integration',
    title_ar: 'تكامل بوابات الدفع',
    short_description: 'Seamless payment gateways: Mada, Tabby, Tamara, Stripe.',
    short_description_ar: 'بوابات دفع متكاملة: مدى، تابي، تمارا، سترايب.',
    description:
      'Seamless, secure payment processing integrated into your platforms. We support all major Saudi and international payment gateways.',
    description_ar:
      'معالجة مدفوعات سلسة وآمنة مدمجة في منصاتك. ندعم جميع بوابات الدفع السعودية والدولية الرئيسية.',
    slug: 'payment-integration',
    icon: 'CreditCard',
    color: '#14b8a6',
    category: 'Technology',
    category_ar: 'التقنية',
    benefits: ['Mada, Tabby, Tamara', 'Stripe & PayPal', 'Apple Pay & Google Pay', 'STC Pay & Urpay', 'PCI DSS compliant'],
    benefits_ar: ['مدى، تابي، تمارا', 'Stripe و PayPal', 'Apple Pay و Google Pay', 'STC Pay و Urpay', 'متوافق مع PCI DSS'],
    process: ['Gateway Selection', 'API Integration', 'Security Testing', 'Checkout Optimization', 'Monitoring Setup'],
    process_ar: ['اختيار بوابة الدفع', 'تكامل API', 'اختبار الأمان', 'تحسين الدفع', 'إعداد المراقبة'],
    ecosystem_angle: 180,
    show_on_homepage: true,
    is_published: true,
    display_order: 5,
    created_at: '',
  },
  {
    id: 'fallback-consulting',
    title: 'Full Business Consulting',
    title_ar: 'الاستشارات التجارية الشاملة',
    short_description: 'End-to-end business setup from legal structure to market entry.',
    short_description_ar: 'تأسيس الأعمال من الهيكل القانوني إلى دخول السوق.',
    description:
      'End-to-end business establishment — from legal entity setup to market strategy and brand positioning. We build businesses from concept to launch.',
    description_ar:
      'إنشاء أعمال شامل من الألف إلى الياء — من التأسيس القانوني إلى استراتيجية السوق وتموضع العلامة التجارية. نبني الأعمال من الفكرة إلى الإطلاق.',
    slug: 'business-consulting',
    icon: 'Briefcase',
    color: '#f59e0b',
    category: 'Business',
    category_ar: 'الأعمال',
    benefits: ['Commercial registration', 'Business plan development', 'Brand strategy', 'Financial modeling', 'Market entry consulting'],
    benefits_ar: ['التسجيل التجاري', 'تطوير خطة الأعمال', 'استراتيجية العلامة التجارية', 'النمذجة المالية', 'استشارات دخول السوق'],
    process: ['Concept Validation', 'Business Planning', 'Legal Setup', 'Brand Development', 'Market Launch'],
    process_ar: ['التحقق من الفكرة', 'التخطيط التجاري', 'الإعداد القانوني', 'تطوير العلامة', 'الإطلاق في السوق'],
    ecosystem_angle: 216,
    show_on_homepage: true,
    is_published: true,
    display_order: 6,
    created_at: '',
  },
  {
    id: 'fallback-ecommerce',
    title: 'E-commerce Store Setup (Salla)',
    title_ar: 'إعداد متاجر إلكترونية على سلة',
    short_description: 'Full Salla store setup with custom themes and optimization.',
    short_description_ar: 'إعداد متجر سلة كامل بقوالب مخصصة.',
    description:
      'Complete Salla e-commerce store setup with custom themes, product catalog management, payment integration, and conversion optimization.',
    description_ar:
      'إعداد متجر سلة الإلكتروني بالكامل مع قوالب مخصصة وإدارة كتالوج المنتجات وتكامل الدفع وتحسين التحويل.',
    slug: 'ecommerce-salla',
    icon: 'ShoppingBag',
    color: '#06b6d4',
    category: 'E-commerce',
    category_ar: 'التجارة الإلكترونية',
    benefits: ['Custom Salla theme design', 'Product catalog setup', 'Payment gateway activation', 'Shipping configuration', 'SEO & marketing setup'],
    benefits_ar: ['تصميم قالب سلة مخصص', 'إعداد كتالوج المنتجات', 'تفعيل بوابة الدفع', 'إعداد الشحن', 'إعداد SEO والتسويق'],
    process: ['Store Planning', 'Theme Customization', 'Product Import', 'Payment Setup', 'Launch & Training'],
    process_ar: ['تخطيط المتجر', 'تخصيص القالب', 'استيراد المنتجات', 'إعداد الدفع', 'الإطلاق والتدريب'],
    ecosystem_angle: 252,
    show_on_homepage: true,
    is_published: true,
    display_order: 7,
    created_at: '',
  },
  {
    id: 'fallback-seo',
    title: 'SEO Optimization',
    title_ar: 'تحسين محركات البحث',
    short_description: 'Technical and content SEO that dominates Google rankings.',
    short_description_ar: 'SEO تقني ومحتوى يتصدر نتائج جوجل.',
    description:
      'Technical and content SEO strategies that drive sustainable organic growth. Dominate search rankings in your target market — Arabic and English.',
    description_ar:
      'استراتيجيات SEO تقنية ومحتوى تدفع النمو العضوي المستدام. احتلّ صدارة نتائج البحث في سوقك المستهدف — بالعربية والإنجليزية.',
    slug: 'seo-optimization',
    icon: 'Search',
    color: '#84cc16',
    category: 'Marketing',
    category_ar: 'التسويق',
    benefits: ['Technical SEO audit', 'Keyword strategy', 'Content optimization', 'Link building', 'Local SEO for Saudi market'],
    benefits_ar: ['تدقيق SEO التقني', 'استراتيجية الكلمات المفتاحية', 'تحسين المحتوى', 'بناء الروابط', 'SEO المحلي للسوق السعودي'],
    process: ['SEO Audit', 'Keyword Research', 'On-Page Optimization', 'Content Strategy', 'Reporting & Refinement'],
    process_ar: ['تدقيق SEO', 'بحث الكلمات المفتاحية', 'تحسين الصفحات', 'استراتيجية المحتوى', 'التقارير والتحسين'],
    ecosystem_angle: 288,
    show_on_homepage: true,
    is_published: true,
    display_order: 8,
    created_at: '',
  },
  {
    id: 'fallback-ai',
    title: 'AI Solutions',
    title_ar: 'حلول الذكاء الاصطناعي',
    short_description: 'Custom AI integrations, chatbots, and machine learning systems.',
    short_description_ar: 'تكاملات الذكاء الاصطناعي والروبوتات وأنظمة التعلم الآلي.',
    description:
      'Custom AI integrations that give your business a competitive edge. Intelligent chatbots, automation workflows, and machine learning systems tailored to your needs.',
    description_ar:
      'تكاملات ذكاء اصطناعي مخصصة تمنح أعمالك ميزة تنافسية. روبوتات محادثة ذكية وتدفقات أتمتة وأنظمة تعلم آلي مصممة لاحتياجاتك.',
    slug: 'ai-solutions',
    icon: 'Brain',
    color: '#f43f5e',
    category: 'AI & Innovation',
    category_ar: 'الذكاء الاصطناعي والابتكار',
    benefits: ['AI chatbot development', 'Process automation with AI', 'Data analytics & insights', 'Predictive modeling', 'LLM integration (GPT, Gemini)'],
    benefits_ar: ['تطوير روبوتات المحادثة', 'أتمتة العمليات بالذكاء الاصطناعي', 'تحليل البيانات والرؤى', 'النمذجة التنبؤية', 'تكامل نماذج اللغة الكبيرة (GPT، Gemini)'],
    process: ['AI Readiness Assessment', 'Use Case Definition', 'Model Selection', 'Integration & Training', 'Monitoring & Refinement'],
    process_ar: ['تقييم الجاهزية للذكاء الاصطناعي', 'تحديد حالات الاستخدام', 'اختيار النموذج', 'التكامل والتدريب', 'المراقبة والتحسين'],
    ecosystem_angle: 324,
    show_on_homepage: true,
    is_published: true,
    display_order: 9,
    created_at: '',
  },
];

export function normalizeCompanyService(row: Record<string, unknown>): CompanyService {
  const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    title_ar: String(row.title_ar ?? ''),
    short_description: String(row.short_description ?? ''),
    short_description_ar: String(row.short_description_ar ?? ''),
    description: String(row.description ?? ''),
    description_ar: String(row.description_ar ?? ''),
    slug: String(row.slug ?? ''),
    icon: String(row.icon ?? 'Globe'),
    color: String(row.color ?? '#3b82f6'),
    category: String(row.category ?? ''),
    category_ar: String(row.category_ar ?? ''),
    benefits: arr(row.benefits),
    benefits_ar: arr(row.benefits_ar),
    process: arr(row.process),
    process_ar: arr(row.process_ar),
    ecosystem_angle: Number(row.ecosystem_angle ?? 0),
    show_on_homepage: Boolean(row.show_on_homepage ?? true),
    is_published: Boolean(row.is_published ?? true),
    display_order: Number(row.display_order ?? 0),
    created_at: String(row.created_at ?? ''),
  };
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Keep auto-generated service slugs in sync while the admin types a title.
 * Once the slug no longer matches the previous title's auto-slug (manual edit),
 * leave it alone.
 */
export function nextAutoSlug(previousTitle: string, previousSlug: string, nextTitle: string): string {
  const previousAuto = slugifyTitle(previousTitle);
  const customized = previousSlug !== '' && previousSlug !== previousAuto;
  return customized ? previousSlug : slugifyTitle(nextTitle);
}

export function linesToList(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

export function listToLines(items: string[]): string {
  return items.join('\n');
}
