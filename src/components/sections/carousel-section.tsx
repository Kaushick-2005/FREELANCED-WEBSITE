'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/luxury/product-card';
import { SectionTitle } from './about';
import { cn } from '@/lib/utils';

export function CarouselSection({ type }: { type: 'new' | 'best' }) {
  const { lang } = useStore();
  const t = translations[lang];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/products');
        if (!active) return;
        const data = await res.json();
        const all: Product[] = data.products || [];
        const filtered =
          type === 'new' ? all.filter((p) => p.isNew) : all.filter((p) => p.isBestSeller);
        setProducts(filtered);
      } catch {
        /* ignore */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [type]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  const title = type === 'new' ? t.newArrivals : t.bestSellers;
  const kicker = type === 'new' ? (lang === 'ta' ? 'புதியவை' : 'Fresh') : (lang === 'ta' ? 'பிரபலம்' : 'Trending');
  const Icon = type === 'new' ? Sparkles : TrendingUp;

  return (
    <section id={type === 'new' ? 'new-arrivals' : 'best-sellers'} className="relative py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              <Icon className="h-3.5 w-3.5" />
              {kicker}
            </div>
            <h2 className={`font-serif-lux text-3xl font-bold text-gold-gradient md:text-4xl ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {title}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-royal"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-royal"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[260px] shrink-0 rounded-2xl glass p-3">
                <div className="aspect-square w-full animate-pulse rounded-xl bg-gold/10" />
                <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-gold/10" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {products.map((p, i) => (
              <div key={p.id} className="w-[260px] shrink-0 sm:w-[280px]">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
