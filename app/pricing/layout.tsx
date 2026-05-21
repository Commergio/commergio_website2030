import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Transparent Plans for Every Business',
  description: 'Commergio offers clear, transparent pricing for web development, mobile apps, AI solutions, and full digital transformation projects. No hidden fees.',
  openGraph: {
    title: 'Pricing | Transparent Plans for Every Business',
    description: 'Find the right plan for your business. Fixed-scope pricing with no surprises.',
    url: 'https://commergio.com/pricing',
  },
  alternates: { canonical: 'https://commergio.com/pricing' },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
