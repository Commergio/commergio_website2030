'use client';

import Link from 'next/link';
import Image from 'next/image';

interface BrandLogoProps {
  /** Show text next to icon. Default: true. On mobile the text is auto-hidden. */
  showText?: boolean;
  /** Size of the logo image in px. Default: 52 */
  size?: number;
  /** Make logo image take full parent height */
  fillHeight?: boolean;
}

export default function BrandLogo({ showText = true, size = 52, fillHeight = false }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-3 group flex-shrink-0 ${fillHeight ? 'h-full' : ''}`}
      aria-label="Commergio — الرئيسية"
    >
      <div
        className={`relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          fillHeight ? 'h-full aspect-square' : ''
        }`}
        style={fillHeight ? undefined : { width: size, height: size }}
      >
        <Image
          src="/images/commergio-logo-new.png"
          alt="كوميرجيو"
          fill
          sizes="(max-width: 768px) 80px, 120px"
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-slate-900 font-bold text-base font-arabic" style={{ letterSpacing: '0.01em' }}>
            كوميرجيو
          </span>
          <span className="text-slate-500 text-xs font-arabic">
            تقنية واستشارات أعمال
          </span>
        </div>
      )}
    </Link>
  );
}
