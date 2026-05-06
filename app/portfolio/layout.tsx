import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Projects That Define Excellence',
  description: 'Explore Commergio\'s portfolio of delivered projects — e-commerce platforms, mobile apps, AI systems, and enterprise solutions for clients across Saudi Arabia.',
  openGraph: {
    title: 'Portfolio | Projects That Define Excellence',
    description: 'Real results for real businesses. Browse our work across web, mobile, AI, and enterprise tech.',
    url: 'https://commergio.com/portfolio',
  },
  alternates: { canonical: 'https://commergio.com/portfolio' },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
