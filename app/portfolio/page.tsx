'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { portfolioProjectHref } from '@/lib/portfolioProjectUrl';
import { supabase } from '@/lib/supabase';
import type { PortfolioProject } from '@/lib/types';

export default function PortfolioPage() {
  const { t, pick } = useI18n();

  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];
  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="section-label mb-6 inline-flex">{t.portfolio.heroLabel}</span>
          <h1 className="heading-xl text-white mb-6">
            {t.portfolio.heroTitle1}{' '}
            <span className="orange-gradient-text">{t.portfolio.heroTitle2}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.portfolio.heroSub}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-orange text-navy-950 shadow-orange-glow'
                  : 'glass-card text-slate-400 hover:text-white hover:border-brand-orange/30'
              }`}
            >
              {cat === 'All' ? pick('All', 'الكل') : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-10">{pick('Loading projects...', 'جارٍ تحميل المشاريع...')}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-10">{pick('No projects found.', 'لا توجد مشاريع حالياً.')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => {
            const href = portfolioProjectHref(project.project_url);
            return (
            <div
              key={project.id}
              className={`glass-card-hover overflow-hidden group ${project.is_featured ? 'ring-1 ring-brand-orange/20' : ''}`}
            >
              {project.is_featured && (
                <div className="px-4 py-1.5 bg-brand-orange/10 border-b border-brand-orange/20">
                  <span className="text-xs font-semibold text-brand-orange">{t.portfolio.featuredBadge}</span>
                </div>
              )}
              <div className="h-48 overflow-hidden bg-white/95 p-3">
                <img
                  src={project.images?.[0] || 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={pick(project.title, project.title_ar)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${project.color}15`, color: project.color, border: `1px solid ${project.color}25` }}
                  >
                    {project.category}
                  </span>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${project.color}20`, color: project.color }}
                  >
                    {project.metric}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mb-1">
                  {pick(project.client_name, project.client_name_ar)}
                </p>
                <h3 className="text-white font-bold text-lg mb-3">
                  {pick(project.title, project.title_ar)}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {pick(project.description, project.description_ar)}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(project.tech_stack || []).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                      {tech}
                    </span>
                  ))}
                </div>
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                    style={{ color: project.color || '#f5a623' }}
                  >
                    {pick('View Project', 'عرض المشروع')}
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
            );
          })}
        </div>
        )}

        <div className="mt-16 glass-card p-10 text-center border-brand-orange/15">
          <h2 className="heading-md text-white mb-4">{t.portfolio.ctaTitle}</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {t.portfolio.ctaSub}
          </p>
          <Link href="/contact" className="btn-primary text-base px-8 py-3.5">
            {t.portfolio.ctaBtn}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
