import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://commergio.com';
  const now = new Date();

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

  const serviceSlugs = [
    'web-development',
    'mobile-app-development',
    'systems-automation',
    'ui-ux-design',
    'business-development',
    'payment-integration',
    'business-consulting',
    'ecommerce-salla',
    'seo-optimization',
    'ai-solutions',
  ];

  const servicePages = serviceSlugs.map((slug) => ({
    url: `${base}/services/${slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
    lastModified: now,
  }));

  return [
    ...staticPages.map((p) => ({ ...p, lastModified: now })),
    ...servicePages,
  ];
}
