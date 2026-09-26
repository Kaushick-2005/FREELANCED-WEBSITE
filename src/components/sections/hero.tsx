'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Phone, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { translations } from '@/lib/i18n';

const WHATSAPP = '919000000000';
const PHONE = '+919000000000';

export function Hero() {
  const { lang } = useStore();
  const t = translations[lang];
  const [sparkles, setSparkles] = useState<{ left: number; top: number; dur: number; delay: number }[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setSparkles(
        Array.from({ length: 30 }).map(() => ({
          left: Math.random() * 100,
          top: Math.random() * 100,
          dur: 2 + Math.random() * 3,
          delay: Math.random() * 4,
        }))
      );
    });
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/products/hero-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-royal via-royal/85 to-royal/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-royal via-transparent to-royal/60" />
      </div>

      {/* Animated gold light beams */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 left-1/4 h-[200%] w-[2px] origin-top"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.35), transparent)' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 right-1/3 h-[200%] w-[2px] origin-top"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.25), transparent)' }}
        />
      </div>

      {/* sparkles */}
      <div className="pointer-events-none absolute inset-0">
        {sparkles.map((s, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: s.dur,
              repeat: Infinity,
              delay: s.delay,
            }}
          >
            <Sparkles className="h-2 w-2 text-gold" style={{ filter: 'drop-shadow(0 0 4px #d4af37)' }} />
          </motion.span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold-light backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Since 1991 · BIS 916 Hallmark · Valliyur, Tirunelveli
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className={`font-tamil text-5xl font-bold leading-tight text-gold-gradient sm:text-6xl md:text-7xl lg:text-8xl`}
          >
            {t.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className={`mt-3 font-tamil text-xl text-gold-light/90 sm:text-2xl md:text-3xl`}
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="my-6 h-px w-40 origin-left bg-gradient-to-r from-gold via-gold-light to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg"
          >
            {t.heroDesc}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              onClick={() => scrollTo('#collections')}
              className="btn-gold group flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              <span className={lang === 'ta' ? 'font-tamil' : ''}>{t.exploreCollection}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo('#featured')}
              className="btn-outline-gold flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className={lang === 'ta' ? 'font-tamil' : ''}>{t.shopNow}</span>
            </button>
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3.5 text-sm font-semibold text-gold-light transition-all hover:bg-gold/15"
            >
              <Phone className="h-4 w-4" />
              <span className={lang === 'ta' ? 'font-tamil' : ''}>{t.callNow}</span>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-emerald-500/50 px-6 py-3.5 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/15"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </motion.div>

          {/* stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-12 flex flex-wrap gap-8"
          >
            {[
              { value: '33+', label: lang === 'ta' ? 'ஆண்டுகள் அனுபவம்' : 'Years of Trust' },
              { value: '10K+', label: lang === 'ta' ? 'திருப்தி வாடிக்கையாளர்கள்' : 'Happy Customers' },
              { value: '916', label: lang === 'ta' ? 'ஹால்மார்க் தரம்' : 'Hallmark Purity' },
              { value: '500+', label: lang === 'ta' ? 'நகை வடிவமைப்புகள்' : 'Unique Designs' },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-serif-lux text-3xl font-bold text-gold-gradient">{s.value}</div>
                <div className={`text-xs text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex h-9 w-5 items-start justify-center rounded-full border border-gold/50 p-1"
        >
          <div className="h-2 w-1 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
