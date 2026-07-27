'use client';

import Link from 'next/link';
import { Clock, Tag } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { blogPosts } from '@/lib/blog-posts';

export default function BlogPage() {
  const { t, pick } = useI18n();

  const featured = blogPosts.filter((p) => p.featured);
  const regular = blogPosts.filter((p) => !p.featured);

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
        {featured.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {featured.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-card-hover overflow-hidden group block">
                <div className="h-56 overflow-hidden relative bg-white/95 p-3">
                  <img
                    src={post.image}
                    alt={pick(post.title, post.titleAr)}
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
                      className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{ background: `${post.color}15`, color: post.color, border: `1px solid ${post.color}25` }}
                    >
                      <Tag size={10} />{pick(post.category, post.categoryAr)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={11} />{pick(post.readTime, post.readTimeAr)}
                    </span>
                  </div>
                  <h2 className="text-white font-bold text-xl mb-2 group-hover:text-brand-orange transition-colors">
                    {pick(post.title, post.titleAr)}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
                    {pick(post.excerpt, post.excerptAr)}
                  </p>
                  <p className="text-slate-500 text-xs">{pick(post.date, post.dateAr)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {regular.length > 0 && (
          <>
            <div className="divider-gradient mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {regular.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-card-hover overflow-hidden group block">
                  <div className="h-36 overflow-hidden bg-white/95 p-2.5">
                    <img
                      src={post.image}
                      alt={pick(post.title, post.titleAr)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full mb-2 inline-block"
                      style={{ background: `${post.color}15`, color: post.color }}
                    >
                      {pick(post.category, post.categoryAr)}
                    </span>
                    <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
                      {pick(post.title, post.titleAr)}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{pick(post.date, post.dateAr)}</span>
                      <span>{pick(post.readTime, post.readTimeAr)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
