/** Canonical brand logo (PNG, transparent background). */
export const BRAND_LOGO_PATH = '/images/commergio-logo.png';

export const BRAND_LOGO_URL = `https://commergio.com${BRAND_LOGO_PATH}`;

/** Logo lockup width relative to height (horizontal mark + wordmark). */
export const BRAND_LOGO_WIDTH_RATIO = 2.15;

/** Maximum practical sizes per placement (px). */
export const BRAND_LOGO_HEIGHT = {
  /** Fits standard h-20 header */
  navbar: 52,
  default: 72,
  footer: 88,
  auth: 128,
  admin: 80,
  hero: 920,
} as const;

export function brandLogoDimensions(height: number) {
  return {
    height,
    width: Math.round(height * BRAND_LOGO_WIDTH_RATIO),
  };
}
