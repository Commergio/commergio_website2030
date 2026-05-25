'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Tag, Share2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const blogData: Record<string, {
  title: string; titleAr: string;
  category: string; categoryAr: string;
  readTime: string; readTimeAr: string;
  date: string; dateAr: string;
  image: string; color: string;
  content: React.ReactNode; contentAr: React.ReactNode;
}> = {
  'ai-reshaping-saudi-business-2025': {
    title: "How AI is Reshaping Saudi Arabia's Business Landscape in 2025",
    titleAr: 'كيف يعيد الذكاء الاصطناعي تشكيل مشهد الأعمال في المملكة العربية السعودية',
    category: 'AI & Technology',
    categoryAr: 'الذكاء الاصطناعي والتقنية',
    readTime: '6 min read',
    readTimeAr: '6 د قراءة',
    date: 'January 15, 2025',
    dateAr: '15 يناير 2025',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#f5a623',
    content: (
      <div className="space-y-6">
        <p>
          Artificial intelligence has moved from the realm of speculative technology to an active driver of competitive advantage across Saudi Arabia&apos;s most dynamic industries. From retail to healthcare, real estate to financial services — AI is no longer optional for businesses that intend to lead.
        </p>
        <h2 className="text-white text-xl font-bold mt-8 mb-4">The Saudi AI Opportunity</h2>
        <p>
          Saudi Arabia&apos;s Vision 2030 has positioned the Kingdom as a global technology hub, with significant government investment in AI infrastructure, talent development, and startup ecosystems. This creates a unique environment where early movers gain disproportionate advantages.
        </p>
        <p>
          At Commergio, we&apos;re seeing firsthand how our clients who adopt AI-powered systems are outperforming competitors by 30-60% across key metrics — whether that&apos;s operational efficiency, customer acquisition, or revenue per transaction.
        </p>
        <h2 className="text-white text-xl font-bold mt-8 mb-4">Key AI Applications Driving Results</h2>
        <p>
          The most impactful AI applications we&apos;re deploying for Saudi businesses include intelligent customer service automation (Arabic-first chatbots), predictive inventory management for e-commerce, AI-powered content generation for bilingual marketing, and machine learning models for sales forecasting.
        </p>
        <p>
          Each of these applications delivers measurable ROI within 3-6 months of deployment, making them attractive investments even for businesses with conservative technology budgets.
        </p>
      </div>
    ),
    contentAr: (
      <div className="space-y-6" dir="rtl">
        <p>
          انتقل الذكاء الاصطناعي من عالم التقنيات المستقبلية ليصبح محركاً فعلياً للميزة التنافسية عبر أكثر القطاعات ديناميكية في المملكة العربية السعودية. من التجزئة إلى الرعاية الصحية، ومن العقارات إلى الخدمات المالية — لم يعد الذكاء الاصطناعي خياراً للشركات التي تسعى للريادة.
        </p>
        <h2 className="text-white text-xl font-bold mt-8 mb-4">فرصة الذكاء الاصطناعي في المملكة</h2>
        <p>
          وضعت رؤية 2030 المملكة العربية السعودية في مكانة مركز تقني عالمي، مع استثمارات حكومية ضخمة في البنية التحتية للذكاء الاصطناعي وتطوير الكفاءات وبيئات الشركات الناشئة. هذا يخلق بيئة فريدة يحصل فيها أصحاب الخطوات الأولى على مزايا غير متناسبة.
        </p>
        <p>
          في كوميرجيو، نشهد مباشرة كيف يتفوق عملاؤنا الذين يتبنون الأنظمة المدعومة بالذكاء الاصطناعي على المنافسين بنسبة 30-60% عبر المقاييس الرئيسية — سواء كان ذلك الكفاءة التشغيلية، أو اكتساب العملاء، أو الإيرادات لكل معاملة.
        </p>
        <h2 className="text-white text-xl font-bold mt-8 mb-4">تطبيقات الذكاء الاصطناعي الرئيسية التي تحقق النتائج</h2>
        <p>
          أكثر تطبيقات الذكاء الاصطناعي تأثيراً التي ننشرها للشركات السعودية تشمل: أتمتة خدمة العملاء الذكية (روبوتات محادثة عربية أولاً)، وإدارة المخزون التنبؤية للتجارة الإلكترونية، وإنشاء المحتوى بالذكاء الاصطناعي للتسويق ثنائي اللغة، ونماذج التعلم الآلي لتنبؤ المبيعات.
        </p>
        <p>
          كل هذه التطبيقات تحقق عائداً على الاستثمار قابلاً للقياس خلال 3-6 أشهر من النشر، مما يجعلها استثمارات جذابة حتى للشركات ذات الميزانيات التقنية المحافظة.
        </p>
      </div>
    ),
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { t, pick, locale } = useI18n();
  const post = blogData[params.slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Article not found</p>
          <Link href="/blog" className="btn-primary">
            {t.blog.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-slate-400 hover:text-brand-orange transition-colors text-sm mb-8"
          >
            <ArrowLeft size={16} />
            {t.blog.backToBlog}
          </Link>

          <div className="glass-card p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full section-label"
                style={{ background: `${post.color}15`, color: post.color, border: `1px solid ${post.color}25` }}
              >
                <Tag size={10} />{pick(post.category, post.categoryAr)}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={12} /> {pick(post.readTime, post.readTimeAr)}
              </span>
            </div>

            <h1 className="heading-lg text-white mb-4">
              {pick(post.title, post.titleAr)}
            </h1>
            <p className="text-slate-400 mb-8">
              {pick(`Published ${post.date} · ${t.blog.publishedBy}`, `نشر ${post.dateAr} · ${t.blog.publishedBy}`)}
            </p>

            <div className="h-64 rounded-2xl overflow-hidden mb-8 bg-white/95 p-3">
              <img
                src={post.image}
                alt={pick(post.title, post.titleAr)}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
              {locale === 'en' ? post.content : post.contentAr}
            </div>

            <div className="divider-gradient my-8" />

            <div className="flex items-center justify-between">
              <Link href="/contact" className="btn-primary">
                {t.blog.implementCta}
              </Link>
              <button className="btn-secondary text-sm">
                <Share2 size={16} />
                {t.blog.shareArticle}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
