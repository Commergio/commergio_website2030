import type { Product } from '@/lib/types';

/** Default featured products when Supabase is unavailable or the query fails. */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fallback-1',
    product_name: 'Commergio CRM Suite',
    product_name_ar: 'منصة كوميرجيو لإدارة العملاء',
    short_description: 'Unified CRM to manage leads, sales pipeline, and customer operations.',
    short_description_ar: 'منصة موحدة لإدارة العملاء المحتملين وخط المبيعات وعمليات خدمة العملاء.',
    full_description:
      'Unified CRM to manage leads, sales pipeline, and customer operations across your team. Built for Saudi businesses that need bilingual workflows and clear reporting.',
    full_description_ar:
      'منصة موحدة لإدارة العملاء المحتملين وخط المبيعات وعمليات خدمة العملاء عبر فريقك. مصممة للشركات السعودية التي تحتاج سير عمل ثنائي اللغة وتقارير واضحة.',
    product_image_url:
      'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=900',
    product_url: '',
    category: 'Platform',
    is_featured: true,
    display_order: 0,
    created_at: '',
  },
  {
    id: 'fallback-2',
    product_name: 'AI Support Assistant',
    product_name_ar: 'مساعد الدعم بالذكاء الاصطناعي',
    short_description: 'Arabic-first AI assistant for customer support and ticket triage.',
    short_description_ar: 'مساعد ذكي عربي لخدمة العملاء وفرز التذاكر تلقائيًا.',
    full_description:
      'Arabic-first AI assistant for customer support and ticket triage. Automate common questions, escalate complex cases, and keep conversations in Arabic or English.',
    full_description_ar:
      'مساعد ذكي عربي لخدمة العملاء وفرز التذاكر تلقائيًا. أتمتة الأسئلة الشائعة وتصعيد الحالات المعقدة والحفاظ على المحادثات بالعربية أو الإنجليزية.',
    product_image_url:
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=900',
    product_url: '',
    category: 'SaaS',
    is_featured: true,
    display_order: 1,
    created_at: '',
  },
  {
    id: 'fallback-3',
    product_name: 'Operations Dashboard',
    product_name_ar: 'لوحة متابعة العمليات',
    short_description: 'Real-time analytics dashboard for operations, finance, and KPIs.',
    short_description_ar: 'لوحة لحظية لمتابعة العمليات والمالية ومؤشرات الأداء.',
    full_description:
      'Real-time analytics dashboard for operations, finance, and KPIs. Connect your data sources and give leadership a single view of what matters.',
    full_description_ar:
      'لوحة لحظية لمتابعة العمليات والمالية ومؤشرات الأداء. اربط مصادر بياناتك وامنح القيادة رؤية موحدة لما يهم.',
    product_image_url:
      'https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=900',
    product_url: '',
    category: 'Tool',
    is_featured: true,
    display_order: 2,
    created_at: '',
  },
];

export function getFallbackProduct(id: string | undefined | null): Product | null {
  if (!id) return null;
  return FALLBACK_PRODUCTS.find((product) => product.id === id) ?? null;
}
