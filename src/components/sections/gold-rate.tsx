'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { SectionTitle } from './about';
import { cn } from '@/lib/utils';

type Rate = {
  gold24k: number;
  gold22k: number;
  silver: number;
  roseGold: number;
  updated: string;
  change24k: number;
  changeSilver: number;
  loading?: boolean;
  message?: string;
};

export function GoldRate() {
  const { lang } = useStore();
  const t = translations[lang];
  const [rate, setRate] = useState<Rate | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRate = async () => {
    try {
      const res = await fetch('/api/gold-rate');
      if (res.ok) {
        const data = await res.json();
        setRate(data);
        if (data.loading) {
          setRetryCount((c) => c + 1);
        } else {
          setRetryCount(0);
        }
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
    // Only retry if loading failed — otherwise the rate is cached for the whole day
    // Retry after 5 minutes if still loading (not every 10 seconds — saves API quota)
    const id = setInterval(() => {
      if (rate?.loading) {
        fetchRate();
      }
    }, 300000); // 5 minutes retry only if still loading
    return () => clearInterval(id);
  }, [rate?.loading]);

  const isLoading = loading || rate?.loading === true;

  const cards = [
    {
      label: '24K Gold',
      ta: '24K தங்கம்',
      price: rate?.gold24k ?? 0,
      pricePerGram: rate?.gold24k ? rate.gold24k / 10 : 0,
      change: rate?.change24k ?? 0,
      color: 'from-gold-light to-gold-dark',
      sym: 'Au',
    },
    {
      label: '22K Gold',
      ta: '22K தங்கம்',
      price: rate?.gold22k ?? 0,
      pricePerGram: rate?.gold22k ? rate.gold22k / 10 : 0,
      change: rate?.change24k ?? 0,
      color: 'from-gold to-gold-dark',
      sym: 'Au',
    },
    {
      label: 'Silver',
      ta: 'வெள்ளி',
      price: rate?.silver ?? 0,
      pricePerGram: rate?.silver ? rate.silver / 1000 : 0,
      change: rate?.changeSilver ?? 0,
      color: 'from-slate-200 to-slate-400',
      sym: 'Ag',
    },
    {
      label: 'Rose Gold',
      ta: 'ரோஸ் கோல்ட்',
      price: rate?.roseGold ?? 0,
      pricePerGram: rate?.roseGold ? rate.roseGold / 10 : 0,
      change: rate?.change24k ?? 0,
      color: 'from-rosegold to-rose-700',
      sym: 'Rg',
    },
  ];

  return (
    <section id="gold-rate" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-rosegold/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'நேரடி விலை' : 'Live Rates'}
          title={t.liveGoldRate}
          subtitle={lang === 'ta' ? 'இன்றைய தங்க மற்றும் வெள்ளி விலை' : "Today's gold & silver rates"}
          tamil={lang === 'ta'}
        />

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-foreground/50">
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-gold" />
              <span className={lang === 'ta' ? 'font-tamil' : ''}>
                {lang === 'ta' ? 'நேரடி விலை ஏற்றப்படுகிறது...' : 'Loading live rates...'}
              </span>
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3" />
              <span>
                {lang === 'ta' ? 'புதுப்பிக்கப்பட்டது' : 'Updated'}: {rate?.updated ?? '—'}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE
              </span>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 className="h-10 w-10 animate-spin text-gold" />
            <p className={`text-sm text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {lang === 'ta'
                ? 'நேரடி தங்க மற்றும் வெள்ளி விலை விரைவில் ஏற்றப்படும்...'
                : 'Live gold & silver rates will load soon...'}
            </p>
            {retryCount > 0 && (
              <p className="text-[10px] text-foreground/40">
                {lang === 'ta' ? `(மறுமுயற்சி ${retryCount})` : `(Retry ${retryCount})`}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="card-luxury relative overflow-hidden rounded-2xl glass p-6"
                >
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-30 blur-2xl" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.4), transparent)' }} />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium text-foreground/70 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                        {lang === 'ta' ? c.ta : c.label}
                      </p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} font-serif-lux text-lg font-bold text-royal`}>
                      {c.sym}
                    </div>
                  </div>
                  <div className="mt-4 font-serif-lux text-3xl font-bold text-gold-gradient">
                    ₹{c.price.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-foreground/40">
                    {c.label === 'Silver' ? (lang === 'ta' ? '10 கிராமுக்கு' : 'per kg') : (lang === 'ta' ? '10 கிராமுக்கு' : 'per 10 grams')}
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5 rounded-lg bg-gold/5 px-2 py-1">
                    <span className="text-[10px] text-foreground/50">{lang === 'ta' ? '1 கிராம்:' : '1 gram:'}</span>
                    <span className="text-sm font-bold text-gold-light">₹{Math.round(c.pricePerGram).toLocaleString('en-IN')}</span>
                  </div>
                  <div className={cn('mt-2 flex items-center gap-1 text-xs', c.change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {c.change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {Math.abs(c.change).toFixed(2)}% {lang === 'ta' ? 'இன்று' : 'today'}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Investment calculator — uses live gold rate */}
            <div className="mt-10">
              <InvestmentCalculator rate={rate} lang={lang} t={t} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function InvestmentCalculator({ rate, lang, t }: { rate: Rate | null; lang: string; t: any }) {
  const [grams, setGrams] = useState(10);
  const [years, setYears] = useState(5);
  const appreciation = 0.11; // 11% per year average gold appreciation

  // Use live gold rate per gram (gold24k is per 10g, so divide by 10)
  const goldRatePerGram = rate?.gold24k ? rate.gold24k / 10 : 0;

  const now = grams * goldRatePerGram;
  const future = now * Math.pow(1 + appreciation, years);
  const gain = future - now;

  if (!rate?.gold24k) {
    return (
      <div className="card-luxury rounded-2xl glass p-6 text-center">
        <p className={`text-sm text-foreground/50 ${lang === 'ta' ? 'font-tamil' : ''}`}>
          {lang === 'ta' ? 'நேரடி தங்க விலை ஏற்றப்பட்ட பிறகு முதலீட்டு கால்குலேட்டர் காட்டப்படும்' : 'Investment calculator will appear once live gold rates are loaded'}
        </p>
      </div>
    );
  }

  return (
    <div className="card-luxury rounded-2xl glass p-6">
      <h3 className={`flex items-center gap-2 font-serif-lux text-xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
        {t.investmentCalculator}
      </h3>
      <p className="mt-1 text-xs text-foreground/50">
        {lang === 'ta'
          ? `தற்போதைய 24K தங்க விலை: ₹${goldRatePerGram.toFixed(0)}/கிராம் (நேரடி)`
          : `Current 24K gold rate: ₹${goldRatePerGram.toFixed(0)}/gram (live)`}
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <label className="flex justify-between text-xs text-foreground/60">
            <span>{lang === 'ta' ? 'தங்கம் (கிராம்)' : 'Gold (grams)'}</span>
            <span className="text-gold-light">{grams}g</span>
          </label>
          <input type="range" min={1} max={500} step={1} value={grams} onChange={(e) => setGrams(Number(e.target.value))} className="mt-2 w-full accent-[var(--gold)]" />
        </div>
        <div>
          <label className="flex justify-between text-xs text-foreground/60">
            <span>{lang === 'ta' ? 'ஆண்டுகள்' : 'Years'}</span>
            <span className="text-gold-light">{years}</span>
          </label>
          <input type="range" min={1} max={20} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-2 w-full accent-[var(--gold)]" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-gold/10 p-3">
          <p className="text-[10px] uppercase text-foreground/50">{lang === 'ta' ? 'இன்று' : 'Today'}</p>
          <p className="font-serif-lux text-base font-bold text-gold-light">₹{Math.round(now).toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl bg-emerald-500/10 p-3">
          <p className="text-[10px] uppercase text-foreground/50">{lang === 'ta' ? 'லாபம்' : 'Gain'}</p>
          <p className="font-serif-lux text-base font-bold text-emerald-400">₹{Math.round(gain).toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl bg-gold/10 p-3">
          <p className="text-[10px] uppercase text-foreground/50">{lang === 'ta' ? `${years} ஆண்டுகளில்` : `In ${years} yrs`}</p>
          <p className="font-serif-lux text-base font-bold text-gold-light">₹{Math.round(future).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}
