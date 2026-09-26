'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/luxury/product-card';
import { SectionTitle } from './about';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
  { key: 'newest', label: 'Newest' },
];

export function FeaturedProducts() {
  const { lang } = useStore();
  const t = translations[lang];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');

  // Build filters dynamically from product categories + materials
  const filters = useMemo(() => {
    const set = new Set<string>(['All']);
    products.forEach((p) => {
      if (p.material) set.add(p.material);
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!active) return;
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Listen to category filter events from collections/nav
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      if (detail) setFilter(detail);
    };
    window.addEventListener('filter-collection', handler);
    return () => window.removeEventListener('filter-collection', handler);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filter !== 'All') {
      list = list.filter(
        (p) =>
          p.material === filter ||
          p.category === filter ||
          p.tags.includes(filter)
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameTa?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
    return list;
  }, [products, filter, sort, search]);

  const paged = filtered.slice(0, page * PER_PAGE);
  const hasMore = paged.length < filtered.length;

  return (
    <section id="featured" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'தயாரிப்புகள்' : 'Products'}
          title={t.featured}
          subtitle={lang === 'ta' ? 'சிறந்த வடிவமைப்புகள் உங்களுக்காக' : 'Our finest curated pieces'}
          tamil={lang === 'ta'}
        />

        {/* Controls */}
        <div className="mt-10 flex flex-col gap-4">
          {/* Filters */}
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-all',
                  filter === f
                    ? 'btn-gold border-transparent'
                    : 'border-gold/30 text-foreground/70 hover:border-gold hover:text-gold'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={t.search}
                className={`w-full rounded-full border border-gold/30 bg-card/50 py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40 ${lang === 'ta' ? 'font-tamil' : ''}`}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-gold"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gold" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-gold/30 bg-card/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key} className="bg-card">
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-foreground/50">{filtered.length} items</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl glass p-3">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="mt-3 h-3 w-2/3" />
                  <Skeleton className="mt-2 h-3 w-1/3" />
                  <Skeleton className="mt-3 h-6 w-full" />
                </div>
              ))
            : paged.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>

        {!loading && paged.length === 0 && (
          <div className="mt-12 text-center text-foreground/50">
            <p className={lang === 'ta' ? 'font-tamil' : ''}>
              {lang === 'ta' ? 'தயாரிப்புகள் இல்லை' : 'No products found'}
            </p>
          </div>
        )}

        {/* Load more + View All Products */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {hasMore && !loading && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="btn-outline-gold rounded-full px-6 py-3 text-sm font-semibold"
            >
              {lang === 'ta' ? 'மேலும் பார்க்க' : 'Load More'} →
            </button>
          )}
          <button
            onClick={() => useStore.getState().setAllProductsOpen(true)}
            className="btn-gold rounded-full px-8 py-3 text-sm font-semibold"
          >
            {lang === 'ta' ? 'அனைத்து நகைகளையும் பார்க்க' : 'View All Products'} →
          </button>
        </div>
      </div>
    </section>
  );
}
