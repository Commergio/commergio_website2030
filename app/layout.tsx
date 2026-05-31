import type { Metadata } from 'next';
import { Inter, Syne, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/lib/theme-context';
import { I18nProvider } from '@/lib/i18n-context';
import SchemaOrg from '@/components/SchemaOrg';
import StickyMobileCTA from '@/components/layout/StickyMobileCTA';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { BRAND_LOGO_URL } from '@/lib/brand';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  metadataBase: new URL('https://commergio.com'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  title: {
    default: 'Commergio | كوميرجيو — Technology & Business Solutions',
    template: '%s | Commergio',
  },
  description: 'Commergio delivers enterprise-grade digital transformation, software development, and commercial solutions. Your strategic technology partner in Saudi Arabia.',
  keywords: ['technology solutions', 'digital transformation', 'Saudi Arabia', 'web development', 'mobile apps', 'AI solutions', 'كوميرجيو', 'تحول رقمي'],
  authors: [{ name: 'Commergio' }],
  creator: 'Commergio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    url: 'https://commergio.com',
    title: 'Commergio | Technology & Business Solutions',
    description: 'Enterprise-grade digital transformation and technology solutions from Saudi Arabia.',
    siteName: 'Commergio',
    images: [{ url: BRAND_LOGO_URL, width: 1200, height: 630, alt: 'Commergio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commergio | Technology & Business Solutions',
    description: 'Enterprise-grade digital transformation and technology solutions from Saudi Arabia.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://commergio.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${syne.variable} ${notoSansArabic.variable}`}
    >
      <head>
       
        <SchemaOrg />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <I18nProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <StickyMobileCTA />
            <FloatingWhatsApp />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
