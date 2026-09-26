'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Coins, Gift, Timer, Percent, Tag, Award, Star } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { SectionTitle } from './about';
import { cn } from '@/lib/utils';

const ICONS: Record<string, any> = { Crown, Sparkles, Coins, Gift, Percent, Tag, Award, Star };

const FALLBACK_OFFERS = [
  { title: 'Wedding Offer', titleTa: 'திருமண சலுகை', description: 'Up to 25% off on making charges for bridal sets', descriptionTa: 'திருமண நகைகளில் 25% மேக்கிங் சார்ஜ் தள்ளுபடி', discountLabel: '25% OFF', icon: 'Crown', offerType: 'percent' },
  { title: 'Festival Offer', titleTa: 'திருவிழா சலுகை', description: 'Special festive pricing on all gold jewellery', descriptionTa: 'திருவிழா கால சிறப்பு விலையில் தங்க நகைகள்', discountLabel: '15% OFF', icon: 'Sparkles', offerType: 'percent' },
  { title: 'Making Charge Discount', titleTa: 'மேக்கிங் சார்ஜ் தள்ளுபடி', description: 'Minimum making charges on all jewellery', descriptionTa: 'அனைத்து நகைகளிலும் குறைந்தபட்ச மேக்கிங் சார்ஜ்', discountLabel: '0% Making', icon: 'Percent', offerType: 'making' },
  { title: 'Gold Coin Offer', titleTa: 'தங்க நாணய சலுகை', description: 'Special price on 24K gold coins', descriptionTa: 'தங்க நாணயங்களில் சிறப்பு விலை', discountLabel: 'Best Rate', icon: 'Coins', offerType: 'coin' },
  { title: 'Silver Coin Offer', titleTa: 'வெள்ளி நாணய சலுகை', description: 'Free gift on silver coin purchases', descriptionTa: 'வெள்ளி நாணயங்களில் இலவச பரிசு', discountLabel: 'Free Gift', icon: 'Gift', offerType: 'gift' },
];

const TONES = [
  'from-gold/30 to-rosegold/20',
  'from-rosegold/30 to-gold/20',
  'from-amber-500/30 to-gold/20',
  'from-yellow-500/30 to-gold/20',
  'from-slate-400/30 to-silver/20',
];
const RINGS = ['ring-gold/40', 'ring-rosegold/40', 'ring-amber-400/40', 'ring-yellow-400/40', 'ring-slate-300/40'];

function useCountdown(target: number) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    queueMicrotask(() => {
      setNow(Date.now());
      const id = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(id);
    });
  }, []);
  if (now === 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

export function SpecialOffers() {
  const { lang } = useStore();
  const t = translations[lang];
  const [target, setTarget] = useState(0);
  const { days, hours, mins, secs } = useCountdown(target);
  const [offers, setOffers] = useState<any[]>(FALLBACK_OFFERS);

  useEffect(() => {
    queueMicrotask(() => setTarget(Date.now() + 7 * 24 * 60 * 60 * 1000));
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/offers');
        if (!active) return;
        const data = await res.json();
        if (data.offers && data.offers.length > 0) setOffers(data.offers);
      } catch { /* keep fallback */ }
    })();
    return () => { active = false; };
  }, []);

  return (
    <section id="offers" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'சலுகைகள்' : 'Offers'}
          title={t.specialOffers}
          subtitle={lang === 'ta' ? 'வரையறுக்கப்பட்ட கால சலுகைகள்' : 'Limited time festive offers'}
          tamil={lang === 'ta'}
        />

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-10 max-w-xl"
        >
          <div className="glass-gold flex items-center justify-center gap-3 rounded-2xl p-5">
            <Timer className="h-6 w-6 animate-pulse text-gold" />
            <span className={`text-sm font-medium text-gold-light ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {lang === 'ta' ? 'சலுகை முடிய' : 'Offer ends in'}:
            </span>
            <div className="flex gap-2">
              {[
                { v: days, l: 'Days' },
                { v: hours, l: 'Hrs' },
                { v: mins, l: 'Min' },
                { v: secs, l: 'Sec' },
              ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="min-w-[2.75rem] rounded-lg bg-royal/60 px-2 py-1.5 text-center font-serif-lux text-xl font-bold text-gold-gradient ring-1 ring-gold/30">
                    {String(unit.v).padStart(2, '0')}
                  </div>
                  <span className="mt-1 text-[9px] uppercase tracking-wider text-foreground/50">{unit.l}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Offers grid — admin-managed via /api/offers */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o, i) => {
            const Icon = ICONS[o.icon] || Crown;
            const title = lang === 'ta' ? (o.titleTa || o.title) : o.title;
            const desc = lang === 'ta' ? (o.descriptionTa || o.description) : o.description;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={cn(
                  'card-luxury group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 ring-1',
                  TONES[i % TONES.length],
                  RINGS[i % RINGS.length]
                )}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/20 blur-2xl transition-all group-hover:bg-gold/40" />
                <div className="relative flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-royal/40 text-gold ring-1 ring-gold/30 transition-transform group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-royal/60 px-3 py-1 text-xs font-bold text-gold-light ring-1 ring-gold/40">
                    {o.discountLabel}
                  </span>
                </div>
                <h3 className={`relative mt-4 font-serif-lux text-xl font-bold text-gold-light ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {title}
                </h3>
                <p className={`relative mt-2 text-sm text-foreground/70 ${lang === 'ta' ? 'font-tamil' : ''}`}>{desc}</p>
                <button
                  onClick={() => document.querySelector('#featured')?.scrollIntoView({ behavior: 'smooth' })}
                  className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
                >
                  {t.shopNow} →
                </button>
              </motion.div>
            );
          })}

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="card-luxury relative flex flex-col items-center justify-center overflow-hidden rounded-2xl gold-border bg-card/60 p-6 text-center"
          >
            <Crown className="h-10 w-10 text-gold animate-glow" />
            <h3 className={`mt-3 font-serif-lux text-xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {lang === 'ta' ? 'இன்றே பயன்படுத்துங்கள்' : 'Claim Today'}
            </h3>
            <p className="mt-1 text-xs text-foreground/60">
              {lang === 'ta' ? 'வரையறுக்கப்பட்ட காலம் மட்டுமே' : 'Limited period only'}
            </p>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gold mt-4 rounded-full px-6 py-2.5 text-sm font-semibold"
            >
              {t.bookAppointment}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
