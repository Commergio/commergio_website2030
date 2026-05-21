'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Film, Play, Calendar } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { supabase } from '@/lib/supabase';
import type { PartnershipSigningVideo } from '@/lib/types';

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

export default function PartnershipSigningVideos() {
  const { t, locale } = useI18n();
  const isAR = locale === 'ar';
  const [videos, setVideos] = useState<PartnershipSigningVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('partnership_signing_videos')
        .select(VIDEO_FIELDS)
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      if (!error && data) setVideos(data as PartnershipSigningVideo[]);
      setLoading(false);
    };
    load();
  }, []);

  const pauseOthers = useCallback((exceptId: string) => {
    document.querySelectorAll<HTMLVideoElement>('video[data-signing-video]').forEach((el) => {
      if (el.dataset.videoId !== exceptId) el.pause();
    });
  }, []);

  if (loading) {
    return (
      <section className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="glass-card aspect-video animate-pulse"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (videos.length === 0) return null;

  return (
    <section id="signing-videos" className="scroll-mt-24">
      <div className="text-center mb-10">
        <span className="section-label mb-4 inline-flex">{t.partners.signingVideosLabel}</span>
        <h2 className="heading-md text-white mb-3">
          {t.partners.signingVideosTitle1}{' '}
          <span className="orange-gradient-text">{t.partners.signingVideosTitle2}</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
          {t.partners.signingVideosSub}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {videos.map((video) => (
          <SigningVideoCard
            key={video.id}
            video={video}
            isAR={isAR}
            locale={locale}
            isActive={activeId === video.id}
            onActivate={() => {
              setActiveId(video.id);
              pauseOthers(video.id);
            }}
          />
        ))}
      </div>
    </section>
  );
}

function SigningVideoCard({
  video,
  isAR,
  locale,
  isActive,
  onActivate,
}: {
  video: PartnershipSigningVideo;
  isAR: boolean;
  locale: string;
  isActive: boolean;
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
      className="glass-card-hover overflow-hidden flex flex-col"
    >
      <div className="relative aspect-video bg-navy-900 group">
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
              className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f5a623 0%, #e09118 100%)',
                boxShadow: '0 8px 24px rgba(245,166,35,0.4)',
              }}
            >
              <Play size={22} className="text-navy-950 ml-0.5" fill="currentColor" />
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
