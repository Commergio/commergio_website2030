/*
  Seed the products CMS with the three homepage fallback products.

  FeaturedProducts only kept static fallbacks while the table had zero rows
  (or zero featured rows). The first featured CMS insert therefore collapsed
  the homepage catalog from three products to one. Fill missing product names
  without overwriting rows an administrator already customized.
*/

INSERT INTO public.products (
  product_name,
  product_name_ar,
  short_description,
  short_description_ar,
  full_description,
  full_description_ar,
  product_image_url,
  product_url,
  category,
  is_featured,
  display_order
)
SELECT
  'Commergio CRM Suite',
  'منصة كوميرجيو لإدارة العملاء',
  'Unified CRM to manage leads, sales pipeline, and customer operations.',
  'منصة موحدة لإدارة العملاء المحتملين وخط المبيعات وعمليات خدمة العملاء.',
  'Unified CRM to manage leads, sales pipeline, and customer operations across your team. Built for Saudi businesses that need bilingual workflows and clear reporting.',
  'منصة موحدة لإدارة العملاء المحتملين وخط المبيعات وعمليات خدمة العملاء عبر فريقك. مصممة للشركات السعودية التي تحتاج سير عمل ثنائي اللغة وتقارير واضحة.',
  'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=900',
  '',
  'Platform',
  true,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE product_name = 'Commergio CRM Suite'
);

INSERT INTO public.products (
  product_name,
  product_name_ar,
  short_description,
  short_description_ar,
  full_description,
  full_description_ar,
  product_image_url,
  product_url,
  category,
  is_featured,
  display_order
)
SELECT
  'AI Support Assistant',
  'مساعد الدعم بالذكاء الاصطناعي',
  'Arabic-first AI assistant for customer support and ticket triage.',
  'مساعد ذكي عربي لخدمة العملاء وفرز التذاكر تلقائيًا.',
  'Arabic-first AI assistant for customer support and ticket triage. Automate common questions, escalate complex cases, and keep conversations in Arabic or English.',
  'مساعد ذكي عربي لخدمة العملاء وفرز التذاكر تلقائيًا. أتمتة الأسئلة الشائعة وتصعيد الحالات المعقدة والحفاظ على المحادثات بالعربية أو الإنجليزية.',
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=900',
  '',
  'SaaS',
  true,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE product_name = 'AI Support Assistant'
);

INSERT INTO public.products (
  product_name,
  product_name_ar,
  short_description,
  short_description_ar,
  full_description,
  full_description_ar,
  product_image_url,
  product_url,
  category,
  is_featured,
  display_order
)
SELECT
  'Operations Dashboard',
  'لوحة متابعة العمليات',
  'Real-time analytics dashboard for operations, finance, and KPIs.',
  'لوحة لحظية لمتابعة العمليات والمالية ومؤشرات الأداء.',
  'Real-time analytics dashboard for operations, finance, and KPIs. Connect your data sources and give leadership a single view of what matters.',
  'لوحة لحظية لمتابعة العمليات والمالية ومؤشرات الأداء. اربط مصادر بياناتك وامنح القيادة رؤية موحدة لما يهم.',
  'https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=900',
  '',
  'Tool',
  true,
  2
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE product_name = 'Operations Dashboard'
);
