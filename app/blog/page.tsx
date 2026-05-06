'use client';

import Link from 'next/link';
import { Clock, Tag } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const posts = [
  {
    slug: 'ai-reshaping-saudi-business-2025',
    title: 'How AI is Reshaping Saudi Arabia\'s Business Landscape in 2025',
    titleAr: 'كيف يعيد الذكاء الاصطناعي تشكيل مشهد الأعمال في المملكة العربية السعودية',
    excerpt: 'Artificial intelligence is no longer a futuristic concept — it\'s actively transforming how Saudi businesses operate, compete, and grow. This comprehensive guide explores the AI revolution in the Kingdom.',
    excerptAr: 'لم يعد الذكاء الاصطناعي مجرد مفهوم مستقبلي — بل إنه يُحوّل بنشاط طريقة عمل الشركات السعودية وتنافسها ونموها. هذا الدليل الشامل يستكشف ثورة الذكاء الاصطناعي في المملكة.',
    category: 'AI & Technology',
    categoryAr: 'الذكاء الاصطناعي والتقنية',
    readTime: '6 min read',
    readTimeAr: '6 د قراءة',
    date: 'Jan 15, 2025',
    dateAr: '15 يناير 2025',
    color: '#f5a623',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    slug: 'vision-2030-digital-transformation-smes',
    title: 'Vision 2030: Digital Transformation Opportunities for Saudi SMEs',
    titleAr: 'رؤية 2030: فرص التحول الرقمي للشركات الصغيرة والمتوسطة',
    excerpt: 'Saudi Vision 2030 is creating unprecedented opportunities for small and medium enterprises ready to embrace digital transformation. Here\'s how to position your business.',
    excerptAr: 'تُفرز رؤية 2030 السعودية فرصاً غير مسبوقة للشركات الصغيرة والمتوسطة المستعدة للتحول الرقمي. إليك كيف تضع أعمالك في موقع ريادي.',
    category: 'Business Strategy',
    categoryAr: 'استراتيجية الأعمال',
    readTime: '8 min read',
    readTimeAr: '8 د قراءة',
    date: 'Jan 22, 2025',
    dateAr: '22 يناير 2025',
    color: '#10b981',
    image: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    slug: 'complete-guide-ecommerce-salla',
    title: 'The Complete Guide to E-commerce Success on Salla Platform',
    titleAr: 'الدليل الشامل للنجاح في التجارة الإلكترونية على منصة سلة',
    excerpt: 'Maximize your Salla store\'s potential with these proven strategies for product presentation, SEO, and conversion optimization. Drive sustainable e-commerce growth.',
    excerptAr: 'حقّق أقصى إمكانات متجر سلة الخاص بك بهذه الاستراتيجيات المُجرَّبة لعرض المنتجات وتحسين SEO وزيادة التحويلات.',
    category: 'E-commerce',
    categoryAr: 'التجارة الإلكترونية',
    readTime: '10 min read',
    readTimeAr: '10 د قراءة',
    date: 'Feb 3, 2025',
    dateAr: '3 فبراير 2025',
    color: '#3b82f6',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    slug: 'seo-arabic-content-strategy',
    title: 'Arabic SEO: Ranking on Google in Saudi Arabia and MENA',
    titleAr: 'السيو العربي: التصدر على جوجل في المملكة ومنطقة الشرق الأوسط',
    excerpt: 'A technical and strategic guide to dominating Arabic search results. Learn the unique nuances of SEO for the Saudi and MENA market.',
    excerptAr: 'دليل تقني واستراتيجي للهيمنة على نتائج البحث العربي. تعلّم الفروق الدقيقة لـ SEO في السوق السعودي ومنطقة الشرق الأوسط.',
    category: 'Digital Marketing',
    categoryAr: 'التسويق الرقمي',
    readTime: '9 min read',
    readTimeAr: '9 د قراءة',
    date: 'Feb 10, 2025',
    dateAr: '10 فبراير 2025',
    color: '#84cc16',
    image: 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    slug: 'building-scalable-saas-nextjs',
    title: 'Building Scalable SaaS Products with Next.js and Supabase',
    titleAr: 'بناء منتجات SaaS قابلة للتوسع باستخدام Next.js و Supabase',
    excerpt: 'A deep-dive into the modern tech stack powering the most scalable SaaS products. From architecture decisions to deployment strategies.',
    excerptAr: 'تعمق في منظومة التقنيات الحديثة التي تُشغّل أكثر منتجات SaaS قابلية للتوسع. من قرارات البنية إلى استراتيجيات النشر.',
    category: 'AI & Technology',
    categoryAr: 'الذكاء الاصطناعي والتقنية',
    readTime: '12 min read',
    readTimeAr: '12 د قراءة',
    date: 'Feb 18, 2025',
    dateAr: '18 فبراير 2025',
    color: '#f43f5e',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    slug: 'payment-gateway-integration-saudi',
    title: 'Complete Guide to Payment Gateways in Saudi Arabia',
    titleAr: 'الدليل الشامل لبوابات الدفع في المملكة العربية السعودية',
    excerpt: 'Everything you need to know about Mada, Tabby, Tamara, STCPay, and international payment options. Choose the right mix for your business.',
    excerptAr: 'كل ما تحتاج معرفته عن مدى وتابي وتمارا وSTC Pay وخيارات الدفع الدولية. اختر المزيج المناسب لأعمالك.',
    category: 'E-commerce',
    categoryAr: 'التجارة الإلكترونية',
    readTime: '7 min read',
    readTimeAr: '7 د قراءة',
    date: 'Mar 1, 2025',
    dateAr: '1 مارس 2025',
    color: '#14b8a6',
    image: 'https://images.pexels.com/photos/4968384/pexels-photo-4968384.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function BlogPage() {
  const { t, locale } = useI18n();
  const isAR = locale === 'ar';

  const featured = posts.filter((p) => p.featured);
  const regular = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="section-label mb-6 inline-flex">{t.blog.heroLabel}</span>
          <h1 className="heading-xl text-white mb-6">
            {t.blog.heroTitle1}{' '}
            <span className="orange-gradient-text">{t.blog.heroTitle2}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.blog.heroSub}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {featured.map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`} className="glass-card-hover overflow-hidden group block">
              <div className="h-56 overflow-hidden relative bg-white/95 p-3">
                <img
                  src={post.image}
                  alt={isAR ? post.titleAr : post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/35 via-navy-900/15 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-orange text-navy-950">
                    {t.blog.featured}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${post.color}15`, color: post.color, border: `1px solid ${post.color}25` }}
                  >
                    <Tag size={10} />{isAR ? post.categoryAr : post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={11} />{isAR ? post.readTimeAr : post.readTime}
                  </span>
                </div>
                <h2 className="text-white font-bold text-xl mb-2 group-hover:text-brand-orange transition-colors">
                  {isAR ? post.titleAr : post.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
                  {isAR ? post.excerptAr : post.excerpt}
                </p>
                <p className="text-slate-500 text-xs">{isAR ? post.dateAr : post.date}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="divider-gradient mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regular.map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`} className="glass-card-hover overflow-hidden group block">
              <div className="h-36 overflow-hidden bg-white/95 p-2.5">
                <img
                  src={post.image}
                  alt={isAR ? post.titleAr : post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full mb-2 inline-block"
                  style={{ background: `${post.color}15`, color: post.color }}
                >
                  {isAR ? post.categoryAr : post.category}
                </span>
                <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
                  {isAR ? post.titleAr : post.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{isAR ? post.dateAr : post.date}</span>
                  <span>{isAR ? post.readTimeAr : post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
