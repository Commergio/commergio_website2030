'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import { Menu, X, Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale, t, isRTL } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.services, href: '/services' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.portfolio, href: '/portfolio' },
    { label: locale === 'en' ? 'Pricing' : 'الأسعار', href: '/pricing' },
    { label: t.nav.blog, href: '/blog' },
    { label: t.nav.contact, href: '/contact' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const switchLocale = () => setLocale(locale === 'en' ? 'ar' : 'en');

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-amber-900/10 shadow-[0_8px_26px_rgba(15,23,42,0.06)]'
          : 'bg-white/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <BrandLogo fillHeight />

          {/* Desktop Menu */}
          <div className={`hidden lg:flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'text-amber-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className={`hidden lg:flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>

            {/* Language */}
            <button
              onClick={switchLocale}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-amber-900/10 rounded-xl text-slate-700 hover:bg-amber-50 transition"
            >
              <Globe size={14} />
              {locale === 'en' ? 'العربية' : 'English'}
            </button>

            {/* CTA */}
            <Link href="/contact" className="btn-primary text-sm px-5 py-2.5">
              {t.nav.startProject}
            </Link>

          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">

            <button
              onClick={switchLocale}
              className="w-9 h-9 flex items-center justify-center border border-amber-900/10 rounded-xl text-xs text-slate-700 bg-white"
            >
              {locale === 'en' ? 'ع' : 'EN'}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center border border-amber-900/10 rounded-xl text-slate-700 bg-white"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur border-t border-amber-900/10 px-4 py-4 space-y-2 shadow-[0_12px_36px_rgba(15,23,42,0.08)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-xl text-sm ${
                isActive(link.href)
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="block text-center btn-primary mt-3"
          >
            {t.nav.startProject}
          </Link>
        </div>
      )}

    </nav>
  );
}