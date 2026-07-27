import type { ReactNode } from 'react';

export type BlogPost = {
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  category: string;
  categoryAr: string;
  readTime: string;
  readTimeAr: string;
  date: string;
  dateAr: string;
  color: string;
  image: string;
  featured?: boolean;
  content: ReactNode;
  contentAr: ReactNode;
};

/**
 * Single source of truth for public blog posts.
 * Listing and detail pages must both derive from this catalog so every
 * linked slug has a renderable article body.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-reshaping-saudi-business-2025',
    title: "How AI is Reshaping Saudi Arabia's Business Landscape in 2025",
    titleAr: 'كيف يعيد الذكاء الاصطناعي تشكيل مشهد الأعمال في المملكة العربية السعودية',
    excerpt:
      "Artificial intelligence is no longer a futuristic concept — it's actively transforming how Saudi businesses operate, compete, and grow. This comprehensive guide explores the AI revolution in the Kingdom.",
    excerptAr:
      'لم يعد الذكاء الاصطناعي مجرد مفهوم مستقبلي — بل إنه يُحوّل بنشاط طريقة عمل الشركات السعودية وتنافسها ونموها. هذا الدليل الشامل يستكشف ثورة الذكاء الاصطناعي في المملكة.',
    category: 'AI & Technology',
    categoryAr: 'الذكاء الاصطناعي والتقنية',
    readTime: '6 min read',
    readTimeAr: '6 د قراءة',
    date: 'Jan 15, 2025',
    dateAr: '15 يناير 2025',
    color: '#f5a623',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
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
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
