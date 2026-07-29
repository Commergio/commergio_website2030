'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Package, ExternalLink, Zap, CircleCheck as CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n-context';
import type { Product } from '@/lib/types';
import { normalizeExternalUrl } from '@/lib/normalizeExternalUrl';

const categoryColors: Record<string, string> = {
  SaaS: '#f5a623',
  Platform: '#3b82f6',
  Tool: '#10b981',
  'Mobile App': '#ec4899',
  API: '#06b6d4',
  Other: '#94a3b8',
};

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fallback-1',
    product_name: 'Commergio CRM Suite',
    product_name_ar: 'منصة كوميرجيو لإدارة العملاء',
    short_description: 'Unified CRM to manage leads, sales pipeline, and customer operations.',
    short_description_ar: 'منصة موحدة لإدارة العملاء المحتملين وخط المبيعات وعمليات خدمة العملاء.',
    full_description: '',
    full_description_ar: '',
    product_image_url: 'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=900',
    product_url: '',
    category: 'Platform',
    is_featured: true,
    display_order: 0,
    created_at: '',
  },
  {
    id: 'fallback-2',
    product_name: 'AI Support Assistant',
    product_name_ar: 'مساعد الدعم بالذكاء الاصطناعي',
    short_description: 'Arabic-first AI assistant for customer support and ticket triage.',
    short_description_ar: 'مساعد ذكي عربي لخدمة العملاء وفرز التذاكر تلقائيًا.',
    full_description: '',
    full_description_ar: '',
    product_image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=900',
    product_url: '',
    category: 'SaaS',
    is_featured: true,
    display_order: 1,
    created_at: '',
  },
  {
    id: 'fallback-3',
    product_name: 'Operations Dashboard',
    product_name_ar: 'لوحة متابعة العمليات',
    short_description: 'Real-time analytics dashboard for operations, finance, and KPIs.',
    short_description_ar: 'لوحة لحظية لمتابعة العمليات والمالية ومؤشرات الأداء.',
    full_description: '',
    full_description_ar: '',
    product_image_url: 'https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=900',
    product_url: '',
    category: 'Tool',
    is_featured: true,
    display_order: 2,
    created_at: '',
  },
];

export default function FeaturedProducts() {
  const { t, pick } = useI18n();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      const { data: featured, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });
      if (!error && featured && featured.length > 0) {
        setProducts(featured);
        return;
      }
      const { data: anyProducts } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(6);
      if (anyProducts && anyProducts.length > 0) {
        setProducts(anyProducts);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    };
    load();
  }, []);

  if (!mounted) return null;

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: '#f8fafc' }} id="products">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="divider-gradient absolute top-0 left-0 right-0" />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(245,166,35,0.06) 0%, transparent 70%)' }}
      />

      <div className="container-max relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label mb-5 inline-flex">
            <Zap size={12} className="mr-1" />
            {t.products.label}
          </span>
          <h2 className="heading-lg text-slate-900 mb-5">
            {t.products.title1}{' '}
            <span className="orange-gradient-text">{t.products.title2}</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {t.products.sub}
          </p>
        </motion.div>

        <div className={`grid grid-cols-1 gap-8 ${products.length === 1 ? 'max-w-lg mx-auto' : products.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {products.map((product, i) => {
            const accent = categoryColors[product.category] || '#f5a623';
            return (
              <ProductCard key={product.id} product={product} accent={accent} index={i} pick={pick} />
            );
          })}
        </div>

        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-slate-600 text-sm mb-4">{t.products.allProducts}</p>
          <a href="/contact" className="btn-primary px-8 py-3.5 text-sm">
            {t.products.requestDemo}
            <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  accent,
  index,
  pick,
}: {
  product: Product;
  accent: string;
  index: number;
  pick: (en: string, ar?: string) => string;
}) {
  const displayName = pick(product.product_name, product.product_name_ar);
  const displayDesc = pick(product.short_description, product.short_description_ar);
  const productUrl = normalizeExternalUrl(product.product_url || '');
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl flex flex-col"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      style={{
        background: 'rgba(255,255,255,0.95)',
        border: `1px solid rgba(15,23,42,0.08)`,
        boxShadow: '0 8px 28px rgba(15,23,42,0.08)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Gradient border glow on hover — achieved via pseudo via absolute overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{
          boxShadow: `0 0 0 1px ${accent}30, 0 10px 30px rgba(15,23,42,0.1), 0 0 24px ${accent}14`,
        }}
      />

      {/* Product Image */}
      <div className="relative h-52 overflow-hidden rounded-t-2xl flex-shrink-0 bg-white/95 p-3">
        {product.product_image_url ? (
          <img
            src={product.product_image_url}
            alt={product.product_name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accent}08, ${accent}04)` }}
          >
            <Package size={52} style={{ color: accent, opacity: 0.15 }} />
          </div>
        )}
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(248,250,252,0.55))' }}
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm"
            style={{
              background: `${accent}18`,
              border: `1px solid ${accent}35`,
              color: accent,
              letterSpacing: '0.04em',
            }}
          >
            {product.category}
          </span>
        </div>

        {/* Subtle icon top-right */}
        <div
          className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
        >
          <Package size={15} style={{ color: accent }} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3
          className="text-slate-900 font-bold text-xl mb-2 leading-tight"
          style={{ letterSpacing: '-0.02em' }}
        >
          {displayName}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-2 flex-1">
          {displayDesc}
        </p>

        {/* Key benefit highlight */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5"
          style={{
            background: `${accent}08`,
            border: `1px solid ${accent}18`,
          }}
        >
          <CheckCircle2 size={15} style={{ color: accent, flexShrink: 0 }} />
          <span className="text-xs font-medium" style={{ color: `${accent}` }}>
            Enterprise-ready · Scalable · Fully supported
          </span>
        </div>

        {/* CTA row */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <div
            className="h-px flex-1 rounded-full"
            style={{ background: `linear-gradient(to right, ${accent}35, transparent)` }}
          />
          <div className="flex items-center gap-2">
            {productUrl ? (
              <a
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold transition-all duration-200 group/btn"
                style={{ color: accent }}
              >
                View Product
                <ExternalLink
                  size={13}
                  className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </a>
            ) : (
              <Link
                href={`/products/${product.id}`}
                className="flex items-center gap-2 text-sm font-semibold transition-all duration-200 group/btn"
                style={{ color: accent }}
              >
                Learn More
                <ArrowRight
                  size={13}
                  className="transition-transform duration-200 group-hover/btn:translate-x-1"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
