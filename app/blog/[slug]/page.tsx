'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Tag, Share2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { getBlogPost } from '@/lib/blog-posts';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { t, pick, locale } = useI18n();
  const post = getBlogPost(params.slug);

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
