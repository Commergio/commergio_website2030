'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Target, Eye, Heart, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const team = [
  {
    name: 'Iyad Abu Jameh',
    nameAr: 'إياد أبو جامع',
    role: 'Chief Executive Officer',
    roleAr: 'الرئيس التنفيذي',
    bio: "Visionary leader with deep expertise in technology strategy and business development. Drives Commergio's mission to transform Saudi Arabia's digital landscape.",
    bioAr: 'قائد رؤيوي بخبرة عميقة في استراتيجية التقنية وتطوير الأعمال. يقود مهمة كوميرجيو لتحويل المشهد الرقمي في المملكة العربية السعودية.',
    image: '/images/team/2.jpeg',
    accent: '#f5a623',
  },
  {
    name: 'Muhannad Abu Jameh',
    nameAr: 'مهند أبو جامع',
    role: 'General Manager',
    roleAr: 'المدير العام',
    bio: 'Operations excellence specialist with a track record of scaling technology teams and delivering complex enterprise projects on time and budget.',
    bioAr: 'متخصص في التميز التشغيلي مع سجل حافل في توسيع فرق التقنية وتسليم مشاريع المؤسسات المعقدة في الوقت المحدد وضمن الميزانية.',
    image: '/images/team/1.jpeg',
    accent: '#3b82f6',
  },
  {
    name: 'Mohamed Alsadiq',
    nameAr: 'محمد الصادق',
    role: 'Chief Technology Officer',
    roleAr: 'مدير التقنية',
    bio: 'Full-stack  software architect and AI specialist. Leads the engineering team in building scalable, enterprise-grade technology systems that power client success.',
    bioAr: 'مهندس برمجيات full-stack ومتخصص في الذكاء الاصطناعي وبناء الانظمه. يقود الفريق الهندسي في بناء أنظمة تقنية قابلة للتوسع بمستوى المؤسسات تدعم نجاح العملاء.',
    image: '/images/team/3.jpeg',
    accent: '#10b981',
  },
];

const valuesData = [
  {
    icon: Target,
    titleEn: 'Results-Driven',
    titleAr: 'موجّه نحو النتائج',
    descEn: 'Every decision is measured against business outcomes. We succeed when our clients succeed.',
    descAr: 'كل قرار يُقاس بمدى تأثيره على الأعمال. ننجح حين ينجح عملاؤنا.',
  },
  {
    icon: Heart,
    titleEn: 'Client-First',
    titleAr: 'العميل أولاً',
    descEn: 'Deep partnership over transactional relationships. Your growth is our mission.',
    descAr: 'شراكة عميقة تتجاوز المعاملات التجارية. نموّك هو مهمتنا.',
  },
  {
    icon: Eye,
    titleEn: 'Strategic Vision',
    titleAr: 'الرؤية الاستراتيجية',
    descEn: "We don't just build — we architect long-term competitive advantages.",
    descAr: 'لا نكتفي بالبناء — نهندس مزايا تنافسية طويلة الأمد.',
  },
  {
    icon: Users,
    titleEn: 'Expert Team',
    titleAr: 'فريق من الخبراء',
    descEn: 'Senior specialists only. Every project gets our A-team, every time.',
    descAr: 'متخصصون أقدام فقط. كل مشروع يحصل على أفضل فريقنا، في كل مرة.',
  },
];

const milestonesData = [
  {
    year: '2025',
    titleEn: 'Founded in Riyadh',
    titleAr: 'التأسيس في الرياض',
    descEn: "Commergio established with a vision to become Saudi Arabia's premier tech partner.",
    descAr: 'تأسست كوميرجيو برؤية لتصبح الشريك التقني الأول في المملكة العربية السعودية.',
  },
  {
    year: '2025',
    titleEn: 'First Enterprise Client',
    titleAr: 'أول عميل مؤسسي',
    descEn: 'Secured and delivered first major enterprise project — a full digital transformation for a regional retail group.',
    descAr: 'تم تأمين وتسليم أول مشروع مؤسسي كبير — تحول رقمي كامل لمجموعة تجزئة إقليمية.',
  },
  {
    year: '2025',
    titleEn: '10 Projects Milestone',
    titleAr: 'إنجاز 10 مشاريع',
    descEn: 'Reached 10 successfully delivered projects across e-commerce, healthcare, and real estate.',
    descAr: 'تم إنجاز 10 مشاريع بنجاح عبر قطاعات التجارة الإلكترونية والرعاية الصحية والعقارات.',
  },
  {
    year: '2025',
    titleEn: 'AI Division Launch',
    titleAr: 'إطلاق قسم الذكاء الاصطناعي',
    descEn: 'Launched dedicated AI solutions division to serve the growing demand for intelligent automation.',
    descAr: 'إطلاق قسم متخصص لحلول الذكاء الاصطناعي لخدمة الطلب المتنامي على الأتمتة الذكية.',
  },
];

export default function AboutPage() {
  const { t, pick } = useI18n();

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label mb-6 inline-flex">
                {t.about.heroLabel}
              </span>
              <h1 className="heading-xl text-white mb-6">
                {t.about.heroTitle1}{' '}
                <span className="orange-gradient-text">{t.about.heroTitle2}</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-4">
                {t.about.heroPara1}
              </p>
              <p className="text-slate-400 leading-relaxed mb-6">
                {t.about.heroPara2}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 col-span-2 border-brand-orange/15">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={20} className="text-brand-orange" />
                  <span className="text-white font-semibold">{t.about.location}</span>
                </div>
                <p className="text-slate-400 text-sm">{t.about.locationSub}</p>
              </div>
              {[
                { label: t.about.statFounded, value: '2025', icon: Calendar },
                { label: t.about.statTeam, value: '20+', icon: Users },
                { label: t.about.statProjects, value: '50+', icon: Target },
                { label: t.about.statIndustries, value: '10+', icon: Eye },
              ].map(({ label, value, icon: Icon }, i) => (
                <div key={i} className="glass-card p-5 text-center">
                  <Icon size={20} className="text-brand-orange mx-auto mb-2" />
                  <p className="text-2xl font-bold orange-gradient-text">{value}</p>
                  <p className="text-slate-400 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20 space-y-20">
        <div>
          <div className="text-center mb-12">
            <span className="section-label mb-4 inline-flex">{t.about.valuesLabel}</span>
            <h2 className="heading-lg text-white">
              {t.about.valuesTitle1}{' '}
              <span className="orange-gradient-text">{t.about.valuesTitle2}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuesData.map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="glass-card-hover p-6 text-center">
                  <div className="service-icon-wrap mx-auto">
                    <Icon size={22} className="text-brand-orange" />
                  </div>
                  <h3 className="text-white font-bold mb-2">
                    {pick(value.titleEn, value.titleAr)}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {pick(value.descEn, value.descAr)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-center mb-12">
            <span className="section-label mb-4 inline-flex">{t.about.leadershipLabel}</span>
            <h2 className="heading-lg text-white">
              {t.about.leadershipTitle1}{' '}
              <span className="orange-gradient-text">{t.about.leadershipTitle2}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl overflow-hidden cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.038)',
                  border: '1px solid rgba(255,255,255,0.075)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.25)',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${member.accent}35`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 1px 0 rgba(255,255,255,0.08) inset, 0 12px 48px rgba(0,0,0,0.4), 0 0 28px ${member.accent}12`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.075)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.25)';
                }}
              >
                {/* Header area without photo */}
                <div className="h-20 px-6 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.55)', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: `${member.accent}18`, border: `1px solid ${member.accent}35`, color: member.accent }}
                  >
                    {pick(member.name, member.nameAr).split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: `${member.accent}18`, border: `1px solid ${member.accent}35`, color: member.accent }}
                  >
                    {pick(member.role, member.roleAr)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-5">
                  <h3
                    className="font-bold text-xl mb-1 text-white"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {pick(member.name, member.nameAr)}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="h-px flex-1"
                      style={{ background: `linear-gradient(90deg, ${member.accent}60, transparent)` }}
                    />
                    <span className="text-xs font-semibold" style={{ color: member.accent }}>
                      {pick(member.role, member.roleAr)}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {pick(member.bio, member.bioAr)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-center mb-12">
            <span className="section-label mb-4 inline-flex">{t.about.journeyLabel}</span>
            <h2 className="heading-lg text-white">
              {t.about.journeyTitle1}{' '}
              <span className="orange-gradient-text">{t.about.journeyTitle2}</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-orange/50 via-brand-orange/20 to-transparent hidden md:block" />
            <div className="space-y-6">
              {milestonesData.map((m, i) => (
                <div key={i} className="glass-card-hover p-6 md:ml-20 relative">
                  <div className="absolute -left-20 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-3">
                    <span className="text-brand-orange font-bold text-sm">{m.year}</span>
                    <div className="w-4 h-4 rounded-full bg-brand-orange border-2 border-navy-900" />
                  </div>
                  <h3 className="text-white font-bold mb-2">
                    {pick(m.titleEn, m.titleAr)}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {pick(m.descEn, m.descAr)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-10 text-center border-brand-orange/15">
          <h2 className="heading-md text-white mb-4">{t.about.ctaTitle}</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {t.about.ctaSub}
          </p>
          <Link href="/contact" className="btn-primary text-base px-8 py-3.5">
            {t.about.ctaBtn}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
