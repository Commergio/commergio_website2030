'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const posts = [
  {
    title: "How AI is Reshaping Saudi Arabia's Business Landscape in 2025",
    titleAr: 'كيف يعيد الذكاء الاصطناعي تشكيل مشهد الأعمال في السعودية 2025',
    excerpt:
      "Artificial intelligence is no longer a futuristic concept — it's actively transforming how Saudi businesses operate, compete, and grow.",
    excerptAr:
      'الذكاء الاصطناعي لم يعد مفهوماً مستقبلياً — بل يحوّل فعلياً طريقة عمل الشركات السعودية وتنافسها ونموها.',
    category: 'AI & Technology',
    categoryAr: 'الذكاء الاصطناعي والتقنية',
    readTime: '6 min read',
    readTimeAr: '6 د قراءة',
    date: 'Jan 15, 2025',
    dateAr: '15 يناير 2025',
    color: '#f5a623',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Vision 2030: Digital Transformation Opportunities for Saudi SMEs',
    titleAr: 'رؤية 2030: فرص التحول الرقمي للمنشآت الصغيرة والمتوسطة',
    excerpt:
      'Saudi Vision 2030 is creating unprecedented opportunities for small and medium enterprises ready to embrace digital transformation.',
    excerptAr:
      'رؤية السعودية 2030 تخلق فرصاً غير مسبوقة للمنشآت الصغيرة والمتوسطة المستعدة للتحول الرقمي.',
    category: 'Business Strategy',
    categoryAr: 'استراتيجية الأعمال',
    readTime: '8 min read',
    readTimeAr: '8 د قراءة',
    date: 'Jan 22, 2025',
    dateAr: '22 يناير 2025',
    color: '#10b981',
    image: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'The Complete Guide to E-commerce Success on Salla Platform',
    titleAr: 'الدليل الشامل للنجاح في التجارة الإلكترونية على منصة سلة',
    excerpt:
      "Maximize your Salla store's potential with these proven strategies for product presentation, SEO, and conversion optimization.",
    excerptAr:
      'حقق أقصى إمكانات متجرك على سلة بهذه الاستراتيجيات المجربة لعرض المنتجات وSEO وتحسين التحويل.',
    category: 'E-commerce',
    categoryAr: 'التجارة الإلكترونية',
    readTime: '10 min read',
    readTimeAr: '10 د قراءة',
    date: 'Feb 3, 2025',
    dateAr: '3 فبراير 2025',
    color: '#3b82f6',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function BlogPreview() {
  const { t, pick } = useI18n();

  return (
    <section className="section-padding bg-navy-900 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container-max relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="section-label mb-4 inline-flex">{t.blog.label}</span>
            <h2 className="heading-lg text-white">
              {t.blog.title1}{' '}
              <span className="orange-gradient-text">{t.blog.title2}</span>
            </h2>
          </div>
          <Link href="/blog" className="btn-secondary text-sm whitespace-nowrap">
            {t.blog.allArticles}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link key={i} href="/blog" className="glass-card-hover overflow-hidden group block">
              <div className="bg-white rounded-xl p-3">
                <img
                  src={post.image}
                  alt={pick(post.title, post.titleAr)}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${post.color}15`, color: post.color, border: `1px solid ${post.color}25` }}
                  >
                    <Tag size={10} />
                    {pick(post.category, post.categoryAr)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={11} />
                    {pick(post.readTime, post.readTimeAr)}
                  </span>
                </div>

                <h3 className="text-white font-bold text-base mb-2 leading-snug group-hover:text-brand-orange transition-colors duration-200">
                  {pick(post.title, post.titleAr)}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
                  {pick(post.excerpt, post.excerptAr)}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{pick(post.date, post.dateAr)}</span>
                  <span className="text-xs font-medium flex items-center gap-1" style={{ color: post.color }}>
                    {t.blog.readMore} <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
