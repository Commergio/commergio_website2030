import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Commergio | Our Story, Team & Mission',
  description: 'Learn about Commergio — founded in Riyadh 2025, our leadership team, values, and mission to deliver world-class technology solutions across Saudi Arabia.',
  openGraph: {
    title: 'About Commergio | Our Story, Team & Mission',
    description: 'Meet the leadership team and learn about our vision to build the digital future of Saudi Arabia.',
    url: 'https://commergio.com/about',
  },
  alternates: { canonical: 'https://commergio.com/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
