/**
 * Turn a CMS portfolio project_url into a safe absolute external href.
 * Returns null when empty so callers can omit the link.
 */
export function portfolioProjectHref(url: string | null | undefined): string | null {
  const raw = (url || '').trim();
  if (!raw) return null;
  const cleaned = raw.replace(/^\/+/, '');
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  return `https://${cleaned}`;
}
