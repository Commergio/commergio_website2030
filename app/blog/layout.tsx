import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Tech Insights & Digital Strategy',
  description: 'Expert articles on digital transformation, AI, e-commerce, mobile development, and business strategy — written by the Commergio team.',
  openGraph: {
    title: 'Blog | Tech Insights & Digital Strategy',
    description: 'Stay ahead with strategic insights and technical deep-dives from Commergio\'s experts.',
    url: 'https://commergio.com/blog',
  },
  alternates: { canonical: 'https://commergio.com/blog' },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
