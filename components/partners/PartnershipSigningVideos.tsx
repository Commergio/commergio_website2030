'use client';

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { Film, Play, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { dateLocaleForUi } from '@/lib/locale-text';
import { supabase } from '@/lib/supabase';
import type { PartnershipSigningVideo } from '@/lib/types';
import type { Locale } from '@/lib/i18n';

type PartnershipSigningVideosProps = {
  /** Homepage: light elevated section matching site style */
  prominent?: boolean;
  /** Max videos to show (homepage uses 2 for speed) */
  limit?: number;
  /** Link to /partners#signing-videos */
  showAllLink?: boolean;
};

const VIDEO_FIELDS =
  'id, partner_name, partner_name_ar, title, title_ar, description, description_ar, video_url, thumbnail_url, recorded_at, display_order';

function formatDate(dateStr: string | null, locale: Locale) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString(dateLocaleForUi(locale), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function PartnershipSigningVideos({
  prominent = false,
  limit,
  showAllLink = false,
}: PartnershipSigningVideosProps) {
  const { t, locale, pick, isRTL } = useI18n();
  const [videos, setVideos] = useState<PartnershipSigningVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    const { data, error } = await supabase
      .from('partnership_signing_videos')
      .select(VIDEO_FIELDS)
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    if (error) {
      console.error('signing videos fetch:', error.message);
      setFetchError(error.message);
      setVideos([]);
    } else {
      setVideos((data as PartnershipSigningVideo[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pauseOthers = useCallback((exceptId: string) => {
    document.querySelectorAll<HTMLVideoElement>('video[data-signing-video]').forEach((el) => {
      if (el.dataset.videoId !== exceptId) el.pause();
    });
  }, []);

  const skeleton = (
    <div className={`grid grid-cols-1 ${prominent ? 'lg:grid-cols-2' : 'md:grid-cols-2'} gap-6 lg:gap-8`}>
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl aspect-video animate-pulse border border-slate-200/80"
          style={{ background: 'rgba(15, 23, 42, 0.04)' }}
        />
      ))}
    </div>
  );

  if (loading) {
    return wrapSection(skeleton, prominent);
  }

  if (fetchError) {
    const misconfigured =
      fetchError.includes('does not exist') ||
      fetchError.includes('relation') ||
      fetchError.includes('schema cache');
    const errorBlock = (
      <div className="glass-card p-8 text-center border-amber-200/60">
        <p className="text-slate-900 font-semibold mb-2">
          {pick('Could not load signing videos', 'تعذر تحميل فيديوهات التوقيع')}
        </p>
        <p className="text-slate-600 text-sm mb-4">
          {misconfigured
            ? pick(
                'Run the Supabase SQL migration for partnership_signing_videos, then retry.',
                'نفّذ ملف SQL في Supabase (جدول partnership_signing_videos) ثم أعد المحاولة.'
              )
            : fetchError}
        </p>
        <button type="button" onClick={load} className="btn-secondary text-sm">
          {pick('Retry', 'إعادة المحاولة')}
        </button>
      </div>
    );
    return wrapSection(errorBlock, prominent);
  }

  if (videos.length === 0) return null;

  const displayed = limit ? videos.slice(0, limit) : videos;
  const hasMore = limit ? videos.length > limit : false;

  const inner = (
    <>
      <div className={`text-center ${prominent ? 'mb-12 md:mb-14' : 'mb-10'}`}>
        {prominent ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 border border-amber-200/70 bg-amber-50/80 text-amber-800 text-xs font-semibold tracking-wide">
            <Sparkles size={14} className="text-brand-orange" />
            {t.partners.signingVideosLabel}
          </div>
        ) : (
          <span className="section-label mb-4 inline-flex">{t.partners.signingVideosLabel}</span>
        )}
        <h2
          className={`mb-4 ${
            prominent
              ? 'heading-lg text-slate-900 md:text-[2.75rem] leading-tight'
              : 'heading-md text-white'
          }`}
        >
          {t.partners.signingVideosTitle1}{' '}
          <span className="orange-gradient-text">{t.partners.signingVideosTitle2}</span>
        </h2>
        {prominent && (
          <div
            className="w-20 h-0.5 mx-auto mb-5 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #f5a623, transparent)',
            }}
          />
        )}
        <p
          className={`max-w-2xl mx-auto leading-relaxed ${
            prominent
              ? 'text-slate-600 text-base md:text-lg'
              : 'text-slate-400 text-sm md:text-base'
          }`}
        >
          {t.partners.signingVideosSub}
        </p>
      </div>

      <div
        className={`grid gap-6 lg:gap-8 ${
          displayed.length === 1
            ? 'grid-cols-1 max-w-4xl mx-auto'
            : prominent
              ? 'grid-cols-1 lg:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {displayed.map((video) => (
          <SigningVideoCard
            key={video.id}
            video={video}
            pick={pick}
            locale={locale}
            isActive={activeId === video.id}
            featured={prominent && displayed.length === 1}
            elevated={prominent}
            onActivate={() => {
              setActiveId(video.id);
              pauseOthers(video.id);
            }}
          />
        ))}
      </div>

      {(showAllLink || hasMore) && (
        <div className="text-center mt-10 md:mt-12">
          <Link
            href="/partners#signing-videos"
            className={`btn-primary inline-flex ${prominent ? 'text-base px-8 py-3.5' : 'text-sm'}`}
          >
            {t.partners.viewAllSigningVideos}
            <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
          </Link>
        </div>
      )}
    </>
  );

  return wrapSection(inner, prominent);
}

function wrapSection(content: ReactNode, prominent: boolean) {
  if (prominent) {
    return (
      <section
        id="signing-videos-home"
        className="section-padding relative overflow-hidden scroll-mt-24 bg-[#f8fafc]"
      >
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="divider-gradient absolute top-0 left-0 right-0" />
        <div className="absolute -top-24 end-0 w-80 h-80 rounded-full bg-amber-400/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-64 h-64 rounded-full bg-slate-300/20 blur-3xl pointer-events-none" />

        <div className="container-max relative z-10">
          <div
            className="relative rounded-[1.75rem] border border-slate-200/70 bg-white/75 backdrop-blur-md px-5 py-10 md:px-10 md:py-14 shadow-[0_4px_24px_rgba(15,23,42,0.05),0_24px_64px_rgba(245,166,35,0.06)]"
            style={{
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.9) inset, 0 12px 48px rgba(15,23,42,0.06), 0 0 0 1px rgba(245,166,35,0.08)',
            }}
          >
            <div
              className="absolute top-0 inset-x-8 h-px hidden md:block"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(245,166,35,0.45) 20%, rgba(245,166,35,0.45) 80%, transparent)',
              }}
            />
            {content}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="signing-videos" className="scroll-mt-24 py-4">
      {content}
    </section>
  );
}

function SigningVideoCard({
  video,
  pick,
  locale,
  isActive,
  featured = false,
  elevated = false,
  onActivate,
}: {
  video: PartnershipSigningVideo;
  pick: (en: string, ar?: string) => string;
  locale: Locale;
  isActive: boolean;
  featured?: boolean;
  /** Homepage: refined shadow and hover lift */
  elevated?: boolean;
  onActivate: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);

  const partnerName = pick(video.partner_name, video.partner_name_ar);
  const title = pick(video.title, video.title_ar);
  const description = pick(video.description, video.description_ar);
  const dateLabel = formatDate(video.recorded_at, locale);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      },
      { rootMargin: '80px', threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePlay = () => {
    onActivate();
    setStarted(true);
    videoRef.current?.play();
  };

  const cardClass = `glass-card-hover overflow-hidden flex flex-col rounded-2xl ${
    elevated
      ? `transition-all duration-300 hover:-translate-y-1 ${
          featured
            ? 'ring-2 ring-amber-300/50 shadow-[0_20px_50px_rgba(15,23,42,0.1)]'
            : 'shadow-[0_8px_30px_rgba(15,23,42,0.07)]'
        }`
      : featured
        ? 'ring-2 ring-brand-orange/30 shadow-[0_20px_60px_rgba(245,166,35,0.12)]'
        : ''
  }`;

  return (
    <article ref={containerRef} className={cardClass}>
      <div
        className={`relative bg-slate-900 group overflow-hidden ${
          featured ? 'aspect-[16/9] md:aspect-[2/1]' : 'aspect-video'
        }`}
      >
        <div
          className="absolute inset-0 z-[1] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'linear-gradient(180deg, transparent 50%, rgba(15,23,42,0.35) 100%)',
          }}
        />
        {inView && started && video.video_url ? (
          <video
            ref={videoRef}
            data-signing-video
            data-video-id={video.id}
            className="w-full h-full object-cover bg-black"
            controls
            playsInline
            preload="none"
            poster={video.thumbnail_url || undefined}
            src={video.video_url}
            onPlay={onActivate}
          />
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            className="absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label={title || partnerName}
          >
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-navy-900">
                <Film size={40} className="text-slate-600" />
              </div>
            )}
            <span
              className={`relative z-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
                featured ? 'w-20 h-20' : 'w-14 h-14'
              }`}
              style={{
                background: 'linear-gradient(135deg, #f5a623 0%, #e09118 100%)',
                boxShadow: '0 8px 24px rgba(245,166,35,0.4)',
              }}
            >
              <Play
                size={featured ? 28 : 22}
                className="text-navy-950 ml-0.5"
                fill="currentColor"
              />
            </span>
          </button>
        )}
        {isActive && (
          <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-md font-medium bg-black/50 text-white border border-white/10">
            {pick('Playing', 'قيد التشغيل')}
          </span>
        )}
      </div>

      <div
        className={`p-5 md:p-6 flex flex-col gap-2 flex-1 bg-white border-t border-slate-100/90`}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          {partnerName}
        </p>
        {title && (
          <h3 className="font-bold leading-snug text-slate-900 text-lg md:text-xl">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{description}</p>
        )}
        {dateLabel && (
          <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-auto pt-2">
            <Calendar size={12} className="text-amber-600/80 shrink-0" />
            {dateLabel}
          </p>
        )}
      </div>
    </article>
  );
}
