import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import { BRAND_LOGO_URL } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Commergio | Technology & Business Solutions — Saudi Arabia',
  description: 'From idea to scalable digital business. Commergio delivers enterprise web development, mobile apps, AI solutions, and digital transformation services in Saudi Arabia.',
  openGraph: {
    title: 'Commergio | Technology & Business Solutions — Saudi Arabia',
    description: 'From idea to scalable digital business. Your strategic tech partner in the Kingdom.',
    url: 'https://commergio.com',
    images: [{ url: BRAND_LOGO_URL, width: 1200, height: 630, alt: 'Commergio' }],
  },
  alternates: { canonical: 'https://commergio.com' },
};
import StatsSection from '@/components/home/StatsSection';
import Testimonials from '@/components/home/Testimonials';
import BlogPreview from '@/components/home/BlogPreview';
import ContactCTA from '@/components/home/ContactCTA';
import HomeMiniCTAs from '@/components/home/HomeMiniCTAs';

const ServicesEcosystem = dynamic(() => import('@/components/home/ServicesEcosystem'), { ssr: false });
const FeaturedProducts = dynamic(() => import('@/components/home/FeaturedProducts'), { ssr: false });
const WhyCommergio = dynamic(() => import('@/components/home/WhyCommergio'), { ssr: false });
const PortfolioHighlights = dynamic(() => import('@/components/home/PortfolioHighlights'), { ssr: false });
const PartnersSection = dynamic(() => import('@/components/home/PartnersSection'), { ssr: false });
const PartnershipSigningVideosSection = dynamic(
  () => import('@/components/home/PartnershipSigningVideosSection'),
  { ssr: false }
);
const TeamCTA = dynamic(() => import('@/components/home/TeamCTA'), { ssr: false });

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ServicesEcosystem />
      <HomeMiniCTAs />
      <FeaturedProducts />
      <WhyCommergio />
      <TeamCTA />
      {/* Portfolio section temporarily hidden — re-enable when ready */}
      {/* <PortfolioHighlights /> */}
      <Testimonials />
      <PartnershipSigningVideosSection />
      <PartnersSection />
      <BlogPreview />
      <ContactCTA />
    </>
  );
}
