'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Briefcase } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { supabase } from '@/lib/supabase';
import type { PortfolioProject } from '@/lib/types';

const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    title_ar: 'منصة التجارة الإلكترونية',
    client_name: 'Retail Enterprise',
    client_name_ar: 'مؤسسة تجزئة',
    category: 'E-commerce',
    description: 'Full-stack Salla-powered e-commerce platform with custom theme, inventory management, and payment gateway integration. Achieved 4x revenue growth in 6 months.',
    description_ar: 'منصة تجارة إلكترونية متكاملة على سلة مع قالب مخصص وإدارة المخزون وتكامل بوابة الدفع. حققت نمواً في الإيرادات بمقدار 4 أضعاف في 6 أشهر.',
    tech_stack: ['Salla', 'React', 'Node.js', 'Mada'],
    metric: '4x Revenue',
    color: '#f5a623',
    images: ['https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800'],
    project_url: '',
    is_featured: true,
    display_order: 0,
    created_at: '',
  },
  {
    id: '2',
    title: 'Healthcare Management System',
    title_ar: 'نظام إدارة الرعاية الصحية',
    client_name: 'Medical Group',
    client_name_ar: 'مجموعة طبية',
    category: 'SaaS Platform',
    description: 'Custom ERP for a multi-branch medical group. Patient management, billing, scheduling, and reporting — all in one unified platform.',
    description_ar: 'نظام ERP مخصص لمجموعة طبية متعددة الفروع. إدارة المرضى والفواتير والجدولة والتقارير — في منصة موحدة واحدة.',
    tech_stack: ['Next.js', 'PostgreSQL', 'Prisma', 'AWS'],
    metric: '60% Efficiency',
    color: '#10b981',
    images: ['https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800'],
    project_url: '',
    is_featured: true,
    display_order: 1,
    created_at: '',
  },
  {
    id: '3',
    title: 'Real Estate Digital Platform',
    title_ar: 'منصة عقارية رقمية',
    client_name: 'Property Developer',
    client_name_ar: 'مطور عقاري',
    category: 'Web Platform',
    description: 'Interactive property listings platform with 3D tours, CRM integration, and automated lead nurturing. Generated 500+ qualified leads in Q1.',
    description_ar: 'منصة قوائم عقارية تفاعلية مع جولات ثلاثية الأبعاد وتكامل CRM ورعاية العملاء المحتملين الآلية. توليد أكثر من 500 عميل محتمل في الربع الأول.',
    tech_stack: ['React', 'Three.js', 'Supabase', 'Stripe'],
    metric: '500+ Leads',
    color: '#3b82f6',
    images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'],
    project_url: '',
    is_featured: true,
    display_order: 2,
    created_at: '',
  },
];

export default function PortfolioHighlights() {
  const { t, pick } = useI18n();
  const [projects, setProjects] = useState<PortfolioProject[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    const load = async () => {
      const { data: featured } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(3);
      if (featured && featured.length > 0) {
        setProjects(featured);
        return;
      }
      const { data: anyRows } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(3);
      if (anyRows && anyRows.length > 0) setProjects(anyRows);
    };
    load();
  }, []);

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: '#f8fafc' }} id="portfolio">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="divider-gradient absolute top-0 left-0 right-0" />

      <div className="container-max relative z-10">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="section-label mb-4 inline-flex">
              {t.portfolio.label}
            </span>
            <h2 className="heading-lg text-slate-900">
              {t.portfolio.title1}{' '}
              <span className="orange-gradient-text">{t.portfolio.title2}</span>
            </h2>
          </div>
          <Link href="/portfolio" className="btn-secondary text-sm whitespace-nowrap">
            {t.portfolio.viewAll}
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="glass-card-hover overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className="relative rounded-t-2xl overflow-hidden h-[220px] flex items-center justify-center bg-slate-100"
                style={
                  project.images && project.images[0]
                    ? {
                        backgroundImage: `url(${project.images[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }
                    : undefined
                }
              >
                {!(project.images && project.images[0]) && (
                  <Briefcase size={40} className="relative z-10 text-gray-300" />
                )}
                <div className="absolute inset-0 rounded-t-2xl" style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(248,250,252,0.35))' }} />
                <div className="absolute top-3 left-3">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${project.color || '#f5a623'}20`, border: `1px solid ${project.color || '#f5a623'}30`, color: project.color || '#f5a623' }}
                  >
                    {project.category}
                  </span>
                </div>
                {project.metric && (
                  <div className="absolute top-3 right-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${project.color || '#f5a623'}30`, color: project.color || '#f5a623' }}
                    >
                      {project.metric}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-slate-500 text-xs mb-1">{pick(project.client_name, project.client_name_ar || '')}</p>
                <h3 className="text-slate-900 font-bold text-lg mb-2">{pick(project.title, project.title_ar || '')}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{pick(project.description, project.description_ar || '')}</p>

                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {project.project_url ? (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                    style={{ color: project.color || '#f5a623' }}
                  >
                    View Project
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <Link
                    href="/portfolio"
                    className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                    style={{ color: project.color || '#f5a623' }}
                  >
                    {t.portfolio.viewCase}
                    <ExternalLink size={14} />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
