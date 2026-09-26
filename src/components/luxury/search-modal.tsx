'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Search, X, Mic, TrendingUp } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';

const SUGGESTIONS = ['Gold Necklace', 'Bridal Set', 'Diamond Ring', 'Silver Bangle', 'Rose Gold', 'Gold Coin'];

export function SearchModal() {
  const { searchOpen, setSearchOpen, setQuickView, lang } = useStore();
  const t = translations[lang];
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=6`);
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [q]);

  const startVoice = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      alert('Voice search not supported in this browser');
      return;
    }
    const rec = new SR();
    rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => {
      setQ(e.results[0][0].transcript);
    };
    rec.start();
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex items-start justify-center p-4 pt-20"
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <motion.div
            initial={{ y: -30, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.97 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl gold-border bg-card"
          >
            <div className="flex items-center gap-3 border-b border-gold/20 p-4">
              <Search className="h-5 w-5 text-gold" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.search}
                className={`flex-1 bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none ${lang === 'ta' ? 'font-tamil' : ''}`}
              />
              <button
                onClick={startVoice}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${listening ? 'bg-red-500 text-white animate-pulse' : 'text-gold hover:bg-gold/15'}`}
                title="Voice Search"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button onClick={() => setSearchOpen(false)} className="text-foreground/60 hover:text-gold">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {!q.trim() ? (
                <div>
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    <TrendingUp className="h-3.5 w-3.5" /> Trending Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQ(s)}
                        className="rounded-full border border-gold/30 px-3 py-1.5 text-xs text-foreground/70 transition-all hover:border-gold hover:text-gold"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 p-2">
                      <div className="h-14 w-14 animate-pulse rounded-lg bg-gold/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-2/3 animate-pulse rounded bg-gold/10" />
                        <div className="h-3 w-1/3 animate-pulse rounded bg-gold/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <p className="py-8 text-center text-sm text-foreground/50">
                  {lang === 'ta' ? 'தயாரிப்புகள் இல்லை' : 'No products found'}
                </p>
              ) : (
                <div className="space-y-1">
                  {results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setQuickView(p);
                        setSearchOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-gold/10"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`line-clamp-1 text-sm font-medium text-foreground/90 ${lang === 'ta' && p.nameTa ? 'font-tamil' : ''}`}>
                          {lang === 'ta' && p.nameTa ? p.nameTa : p.name}
                        </p>
                        <p className="text-xs text-foreground/50">{p.material} · {p.purity}</p>
                      </div>
                      <span className="font-serif-lux text-sm font-bold text-gold-gradient">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
