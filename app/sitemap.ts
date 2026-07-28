import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://commergio.com';
  const now = new Date();

  // Only list routes that exist under app/. There is no app/services/[slug]
  // page — public CTAs go to /contact — so do not advertise /services/<slug>
  // URLs that would 404 for crawlers and users.
  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${base}/services`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${base}/about`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/portfolio`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${base}/pricing`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/blog`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${base}/partners`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/contact`, priority: 0.9, changeFrequency: 'monthly' as const },
  ];

  return staticPages.map((p) => ({ ...p, lastModified: now }));
}
