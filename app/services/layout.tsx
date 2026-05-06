import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Web, Mobile, AI & Business Solutions',
  description: 'Explore Commergio\'s full suite of services: web development, mobile apps, AI solutions, e-commerce, SEO, UI/UX design, and business consulting — all under one roof.',
  openGraph: {
    title: 'Services | Web, Mobile, AI & Business Solutions',
    description: 'Enterprise-grade technology and business services delivered by Commergio from Riyadh, Saudi Arabia.',
    url: 'https://commergio.com/services',
  },
  alternates: { canonical: 'https://commergio.com/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
