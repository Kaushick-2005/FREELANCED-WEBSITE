'use client';

import { useEffect, useMemo, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, SlidersHorizontal, Grid3x3 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/luxury/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
  { key: 'newest', label: 'Newest' },
];

export function AllProductsOverlay() {
  const { allProductsOpen, setAllProductsOpen, lang } = useStore();
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

  useEffect(() => {
    if (!allProductsOpen) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!active) return;
        const data = await res.json();
        setProducts(data.products || []);
      } catch { setProducts([]); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [allProductsOpen]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filter !== 'All') {
      list = list.filter((p) => p.material === filter || p.category === filter || p.tags.includes(filter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) || p.nameTa?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) || p.material.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'newest': list.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      default: list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
    return list;
  }, [products, filter, sort, search]);

  return (
    <AnimatePresence>
      {allProductsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[88] flex flex-col bg-background"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-gold/20 glass-dark p-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Grid3x3 className="h-5 w-5 text-gold" />
                <h2 className={`font-serif-lux text-xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {lang === 'ta' ? 'அனைத்து நகைகள்' : 'All Products'}
                </h2>
                <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs text-gold-light">{filtered.length}</span>
              </div>
              <button
                onClick={() => setAllProductsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-gold-light hover:bg-gold hover:text-royal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="sticky top-[57px] z-10 border-b border-gold/15 bg-background/95 backdrop-blur p-3">
            <div className="mx-auto max-w-7xl space-y-3">
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
                      filter === f ? 'btn-gold border-transparent' : 'border-gold/30 text-foreground/70 hover:border-gold hover:text-gold'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-xs flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t.search}
                    className={`w-full rounded-full border border-gold/30 bg-card/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none ${lang === 'ta' ? 'font-tamil' : ''}`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-gold" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-full border border-gold/30 bg-card/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key} className="bg-card">{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mx-auto max-w-7xl">
              {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-2xl glass p-3">
                      <Skeleton className="aspect-square w-full rounded-xl" />
                      <Skeleton className="mt-3 h-3 w-2/3" />
                      <Skeleton className="mt-2 h-6 w-full" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-foreground/50">
                  <p className={lang === 'ta' ? 'font-tamil' : ''}>{lang === 'ta' ? 'தயாரிப்புகள் இல்லை' : 'No products found'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
