import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';

export const metadata: Metadata = {
  title: 'Commergio | Technology & Business Solutions — Saudi Arabia',
  description: 'From idea to scalable digital business. Commergio delivers enterprise web development, mobile apps, AI solutions, and digital transformation services in Saudi Arabia.',
  openGraph: {
    title: 'Commergio | Technology & Business Solutions — Saudi Arabia',
    description: 'From idea to scalable digital business. Your strategic tech partner in the Kingdom.',
    url: 'https://commergio.com',
    images: [{ url: 'https://commergio.com/كوميرجيو copy.png', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://commergio.com' },
};
import StatsSection from '@/components/home/StatsSection';
import Testimonials from '@/components/home/Testimonials';
import BlogPreview from '@/components/home/BlogPreview';
import ContactCTA from '@/components/home/ContactCTA';
import MiniCTA from '@/components/home/MiniCTA';

const ServicesEcosystem = dynamic(() => import('@/components/home/ServicesEcosystem'), { ssr: false });
const FeaturedProducts = dynamic(() => import('@/components/home/FeaturedProducts'), { ssr: false });
const WhyCommergio = dynamic(() => import('@/components/home/WhyCommergio'), { ssr: false });
const PortfolioHighlights = dynamic(() => import('@/components/home/PortfolioHighlights'), { ssr: false });
const PartnersSection = dynamic(() => import('@/components/home/PartnersSection'), { ssr: false });
const TeamCTA = dynamic(() => import('@/components/home/TeamCTA'), { ssr: false });

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ServicesEcosystem />
      <MiniCTA
        heading="Ready to get started? We have 3 slots open this month."
        sub="Fixed price. Fixed timeline. No surprises."
        primaryLabel="View Pricing"
        primaryHref="/pricing"
        source="services-cta"
      />
      <FeaturedProducts />
      <MiniCTA
        heading="هل أنت مهتم بأحد منتجاتنا؟"
        sub="اطلب عرضا تجريبيا وشاهده يعمل مباشرة داخل بيئة عملك."
        primaryLabel="اطلب عرضا تجريبيا"
        source="products-cta"
      />
      <WhyCommergio />
      <TeamCTA />
      <PortfolioHighlights />
      <Testimonials />
      <PartnersSection />
      <BlogPreview />
      <ContactCTA />
    </>
  );
}
