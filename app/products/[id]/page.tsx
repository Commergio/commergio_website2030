'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Package, CircleCheck as CheckCircle2, MessageSquare, Zap } from 'lucide-react';
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

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, pick } = useI18n();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#030b17' }}>
        <div className="w-10 h-10 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#030b17' }}>
        <div className="text-center">
          <Package size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-6">Product not found.</p>
          <Link href="/#products" className="btn-primary">
            <ArrowLeft size={15} />
            {t.products.backToProducts}
          </Link>
        </div>
      </div>
    );
  }

  const accent = categoryColors[product.category] || '#f5a623';
  const productUrl = normalizeExternalUrl(product.product_url || '');

  return (
    <main className="min-h-screen" style={{ background: '#030b17' }}>
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      {/* Hero */}
      <div className="relative overflow-hidden pt-28 pb-20 px-4 md:px-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent}10 0%, transparent 70%)`,
          }}
        />
        <div className="divider-gradient absolute bottom-0 left-0 right-0" />

        <div className="container-max relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-10 transition-colors duration-200 group"
            >
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
              {t.products.backToProducts}
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
                style={{
                  background: `${accent}15`,
                  border: `1px solid ${accent}30`,
                  color: accent,
                  letterSpacing: '0.06em',
                }}
              >
                <Zap size={11} />
                {product.category}
              </span>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.05]"
                style={{ letterSpacing: '-0.03em' }}
              >
                {pick(product.product_name, product.product_name_ar)}
              </h1>

              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
                {pick(product.short_description, product.short_description_ar)}
              </p>

              <div className="flex flex-wrap gap-3">
                {productUrl ? (
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-7 py-3.5"
                  >
                    {t.products.viewProduct}
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <a href="/contact" className="btn-primary px-7 py-3.5">
                    {t.products.requestDemoBtn}
                    <MessageSquare size={14} />
                  </a>
                )}
                <a href="/contact" className="btn-secondary px-7 py-3.5">
                  {t.products.contactSales}
                </a>
              </div>
            </motion.div>

            {/* Right: image */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow: `0 0 0 1px ${accent}25, 0 24px 80px rgba(0,0,0,0.6), 0 0 60px ${accent}12`,
                }}
              >
                {product.product_image_url ? (
                  <img
                    src={product.product_image_url}
                    alt={pick(product.product_name, product.product_name_ar)}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div
                    className="w-full aspect-video flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${accent}08, ${accent}04)` }}
                  >
                    <Package size={80} style={{ color: accent, opacity: 0.12 }} />
                  </div>
                )}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${accent}03, transparent 65%)` }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="section-padding pt-16">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content col */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Full description */}
              {product.full_description && (
                <div className="glass-card p-8">
                  <h2 className="text-white text-2xl font-bold mb-5" style={{ letterSpacing: '-0.02em' }}>
                    {t.products.fullDescription}
                  </h2>
                  <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {pick(product.full_description, product.full_description_ar)}
                  </div>
                </div>
              )}

              {/* Who is this for */}
              <div className="glass-card p-8">
                <h2 className="text-white text-2xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>
                  Who Is This For?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Growing Businesses', desc: 'Companies scaling rapidly that need enterprise infrastructure without the enterprise cost.' },
                    { title: 'Operations-Heavy Teams', desc: 'Teams drowning in manual processes who need automation and unified data.' },
                    { title: 'Customer-Facing Enterprises', desc: 'Businesses that need best-in-class UX to retain and convert customers.' },
                    { title: 'Tech-Forward Leaders', desc: 'Decision-makers who want measurable ROI from every technology investment.' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: accent }} />
                      <div>
                        <p className="text-white text-sm font-semibold mb-1">{item.title}</p>
                        <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 30-day results */}
              <div
                className="rounded-2xl p-8"
                style={{ background: `${accent}06`, border: `1px solid ${accent}18` }}
              >
                <h2 className="text-white text-2xl font-bold mb-2" style={{ letterSpacing: '-0.02em' }}>
                  What You Get in 30 Days
                </h2>
                <p className="text-slate-400 text-sm mb-6">Measurable outcomes from day one of deployment.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { metric: 'Week 1', title: 'Onboarded & Live', desc: 'Full setup, training, and live deployment with your data.' },
                    { metric: 'Week 2–3', title: 'Measurable Efficiency', desc: 'Workflows automated, team fully up to speed, first KPIs tracked.' },
                    { metric: 'Day 30', title: 'ROI Visible', desc: 'Quantifiable time savings, cost reduction, or revenue impact.' },
                  ].map((item) => (
                    <div key={item.metric} className="text-center p-5 rounded-xl" style={{ background: `${accent}08`, border: `1px solid ${accent}15` }}>
                      <p className="text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: accent }}>{item.metric}</p>
                      <p className="text-white font-bold text-sm mb-1.5">{item.title}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key capabilities */}
              <div className="glass-card p-8">
                <h2 className="text-white text-2xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>
                  Key Capabilities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Enterprise-grade security & compliance',
                    'Scalable cloud infrastructure',
                    'Arabic & English interface',
                    'Real-time analytics dashboard',
                    'API-first architecture',
                    'Dedicated support & SLA',
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: accent }} />
                      <span className="text-slate-300 text-sm leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Sticky sidebar wrapper */}
              <div className="lg:sticky lg:top-28 space-y-5">
                {/* Quick facts */}
                <div className="rounded-2xl p-6" style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}>
                  <h3 className="text-white font-bold mb-4">Quick Facts</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Category', value: product.category },
                      { label: 'Availability', value: 'Available Now' },
                      { label: 'Support', value: '24/7 Included' },
                      { label: 'Deployment', value: 'Cloud / On-premise' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">{label}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA card */}
                <div className="glass-card p-6 text-center" style={{ borderColor: `${accent}20` }}>
                  <div
                    className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}
                  >
                    <MessageSquare size={20} style={{ color: accent }} />
                  </div>
                  <h3 className="text-white font-bold mb-2">Ready to get started?</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    Talk to our team. We&apos;ll set up a live demo tailored to your business.
                  </p>
                  <div className="space-y-3">
                    <a href="/contact" className="btn-primary w-full justify-center text-sm">
                      {t.products.requestDemoBtn}
                    </a>
                    <a
                      href="https://wa.me/966562270319?text=Hello%2C%20I'm%20interested%20in%20a%20demo%20for%20your%20product"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366' }}
                    >
                      <MessageSquare size={14} />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Urgency */}
                <div
                  className="rounded-2xl p-5 flex items-start gap-3"
                  style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.15)' }}
                >
                  <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse flex-shrink-0 mt-1.5" />
                  <p className="text-slate-400 text-xs leading-relaxed">
                    <span className="text-brand-orange font-semibold">Limited onboarding slots.</span>
                    {' '}We work with a maximum of 5 new product clients per month to ensure quality delivery.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
