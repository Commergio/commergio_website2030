'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { blogPosts } from '@/lib/blog-posts';

export default function BlogPreview() {
  const { t, pick } = useI18n();
  const posts = blogPosts.slice(0, 3);

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

        <div className={`grid grid-cols-1 gap-6 ${posts.length >= 3 ? 'md:grid-cols-3' : posts.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-xl'}`}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-card-hover overflow-hidden group block">
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
