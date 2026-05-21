'use client';

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { Film, Play, Calendar, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { supabase } from '@/lib/supabase';
import type { PartnershipSigningVideo } from '@/lib/types';

type PartnershipSigningVideosProps = {
  /** Full-width dark homepage band */
  prominent?: boolean;
  /** Max videos to show (homepage uses 2 for speed) */
  limit?: number;
  /** Link to /partners#signing-videos */
  showAllLink?: boolean;
};

const VIDEO_FIELDS =
  'id, partner_name, partner_name_ar, title, title_ar, description, description_ar, video_url, thumbnail_url, recorded_at, display_order';

function formatDate(dateStr: string | null, locale: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
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
  const { t, locale } = useI18n();
  const isAR = locale === 'ar';
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
          className="glass-card aspect-video animate-pulse"
          style={{ background: 'rgba(255,255,255,0.03)' }}
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
      <div className="glass-card p-8 text-center border-amber-500/20">
        <p className="text-white font-semibold mb-2">
          {isAR ? 'تعذر تحميل فيديوهات التوقيع' : 'Could not load signing videos'}
        </p>
        <p className="text-slate-500 text-sm mb-4">
          {misconfigured
            ? isAR
              ? 'نفّذ ملف SQL في Supabase (جدول partnership_signing_videos) ثم أعد المحاولة.'
              : 'Run the Supabase SQL migration for partnership_signing_videos, then retry.'
            : fetchError}
        </p>
        <button type="button" onClick={load} className="btn-secondary text-sm">
          {isAR ? 'إعادة المحاولة' : 'Retry'}
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
        <span className="section-label mb-4 inline-flex">{t.partners.signingVideosLabel}</span>
        <h2
          className={`text-white mb-3 ${
            prominent ? 'heading-lg md:text-5xl' : 'heading-md'
          }`}
        >
          {t.partners.signingVideosTitle1}{' '}
          <span className="orange-gradient-text">{t.partners.signingVideosTitle2}</span>
        </h2>
        <p
          className={`text-slate-400 max-w-2xl mx-auto ${
            prominent ? 'text-base md:text-lg' : 'text-sm md:text-base'
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
            isAR={isAR}
            locale={locale}
            isActive={activeId === video.id}
            featured={prominent && displayed.length === 1}
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
            <ArrowRight size={18} className={isAR ? 'rotate-180' : ''} />
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
        className="section-padding relative overflow-hidden scroll-mt-24"
        style={{ background: '#040c18' }}
      >
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
        <div className="absolute inset-0 grid-pattern opacity-25" />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(245,166,35,0.6) 50%, transparent)',
          }}
        />
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[min(100%,720px)] h-64 rounded-full pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(ellipse, rgba(245,166,35,0.25) 0%, transparent 70%)',
          }}
        />
        <div className="container-max relative z-10">{content}</div>
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
  isAR,
  locale,
  isActive,
  featured = false,
  onActivate,
}: {
  video: PartnershipSigningVideo;
  isAR: boolean;
  locale: string;
  isActive: boolean;
  featured?: boolean;
  onActivate: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);

  const partnerName = isAR ? video.partner_name_ar || video.partner_name : video.partner_name;
  const title = isAR ? video.title_ar || video.title : video.title;
  const description = isAR ? video.description_ar || video.description : video.description;
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

  return (
    <article
      ref={containerRef}
      className={`glass-card-hover overflow-hidden flex flex-col ${
        featured ? 'ring-2 ring-brand-orange/30 shadow-[0_20px_60px_rgba(245,166,35,0.12)]' : ''
      }`}
    >
      <div className={`relative bg-navy-900 group ${featured ? 'aspect-[16/9] md:aspect-[2/1]' : 'aspect-video'}`}>
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
            {isAR ? 'قيد التشغيل' : 'Playing'}
          </span>
        )}
      </div>

      <div className="p-5 md:p-6 flex flex-col gap-2 flex-1">
        <p className="text-brand-orange text-xs font-semibold uppercase tracking-wide">
          {partnerName}
        </p>
        {title && <h3 className="text-white font-bold text-lg leading-snug">{title}</h3>}
        {description && (
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{description}</p>
        )}
        {dateLabel && (
          <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-auto pt-2">
            <Calendar size={12} />
            {dateLabel}
          </p>
        )}
      </div>
    </article>
  );
}
