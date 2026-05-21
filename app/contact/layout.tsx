import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Start Your Project Today',
  description: 'Get in touch with Commergio. We respond within 2 hours. Start your digital transformation journey with Saudi Arabia\'s premier technology partner.',
  openGraph: {
    title: 'Contact Commergio | Start Your Project Today',
    description: 'Reach out via form, email, or WhatsApp. Free consultation — no commitment required.',
    url: 'https://commergio.com/contact',
  },
  alternates: { canonical: 'https://commergio.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
