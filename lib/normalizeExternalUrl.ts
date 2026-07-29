/**
 * Normalize user-entered external URLs so scheme-less values like
 * `example.com` become absolute `https://example.com` instead of
 * browser-relative paths (e.g. `/example.com` on commer gio.com).
 */
export function normalizeExternalUrl(value: string): string {
  const raw = value.trim();
  if (!raw) return '';
  const noLeadingSlashes = raw.replace(/^\/+/, '');
  if (/^https?:\/\//i.test(noLeadingSlashes)) return noLeadingSlashes;
  return `https://${noLeadingSlashes}`;
}

/** Returns true when a non-empty normalized URL parses as an absolute http(s) URL. */
export function isValidExternalUrl(value: string): boolean {
  const normalized = normalizeExternalUrl(value);
  if (!normalized) return true;
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
