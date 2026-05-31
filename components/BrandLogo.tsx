'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BRAND_LOGO_PATH, BRAND_LOGO_HEIGHT, brandLogoDimensions } from '@/lib/brand';

interface BrandLogoProps {
  showText?: boolean;
  /** Logo height in px; defaults to largest standard size for context. */
  size?: number;
  /** Navbar: use maximum height within the header bar. */
  fillHeight?: boolean;
}

export default function BrandLogo({
  showText = false,
  size,
  fillHeight = false,
}: BrandLogoProps) {
  const imageHeight = size ?? (fillHeight ? BRAND_LOGO_HEIGHT.navbar : BRAND_LOGO_HEIGHT.default);
  const { width: imageWidth, height: boxHeight } = brandLogoDimensions(imageHeight);

  return (
    <Link
      href="/"
      className={`flex items-center gap-3 group flex-shrink-0 min-w-0 ${fillHeight ? 'h-full' : ''}`}
      aria-label="Commergio — الرئيسية"
    >
      <div
        className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ width: imageWidth, height: boxHeight, maxHeight: fillHeight ? '100%' : undefined }}
      >
        <Image
          src={BRAND_LOGO_PATH}
          alt="Commergio"
          fill
          sizes={fillHeight ? '200px' : '(max-width: 768px) 180px, 240px'}
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
