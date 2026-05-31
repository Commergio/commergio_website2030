'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BRAND_LOGO_PATH } from '@/lib/brand';

interface BrandLogoProps {
  /** Show text next to icon. Default: false — logo image includes wordmark. */
  showText?: boolean;
  /** Height of the logo image in px. Default: 52 */
  size?: number;
  /** Make logo image take full parent height (navbar). */
  fillHeight?: boolean;
}

export default function BrandLogo({ showText = false, size = 52, fillHeight = false }: BrandLogoProps) {
  const imageHeight = fillHeight ? 56 : size;
  const imageWidth = Math.round(imageHeight * 1.15);

  return (
    <Link
      href="/"
      className={`flex items-center gap-3 group flex-shrink-0 ${fillHeight ? 'h-full py-1' : ''}`}
      aria-label="Commergio — الرئيسية"
    >
      <div
        className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{ width: imageWidth, height: imageHeight }}
      >
        <Image
          src={BRAND_LOGO_PATH}
          alt="Commergio"
          fill
          sizes="(max-width: 768px) 120px, 160px"
          className="object-contain object-left"
          priority
        />
      </div>

      {showText && (
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-slate-900 font-bold text-base font-arabic" style={{ letterSpacing: '0.01em' }}>
            كوميرجيو
          </span>
          <span className="text-slate-500 text-xs font-arabic">تقنية واستشارات أعمال</span>
        </div>
      )}
    </Link>
  );
}
