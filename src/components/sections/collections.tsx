'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { SectionTitle } from './about';
import { useState, useEffect } from 'react';

type Cat = { name: string; nameTa: string; image: string; filter: string; tone: string };

const CATS: Cat[] = [
  { name: 'Gold Jewellery', nameTa: 'தங்க நகைகள்', image: '/products/gold-necklace-1.png', filter: 'Gold', tone: 'from-gold/40' },
  { name: 'Silver Jewellery', nameTa: 'வெள்ளி நகைகள்', image: '/products/silver-necklace.png', filter: 'Silver', tone: 'from-slate-400/30' },
  { name: 'Rose Gold Jewellery', nameTa: 'ரோஸ் கோல்ட் நகைகள்', image: '/products/rosegold-necklace.png', filter: 'Rose Gold', tone: 'from-rosegold/40' },
  { name: 'Diamond Jewellery', nameTa: 'வைர நகைகள்', image: '/products/diamond-necklace.png', filter: 'Diamond', tone: 'from-cyan-200/30' },
  { name: 'Wedding Collection', nameTa: 'திருமண தொகுப்பு', image: '/products/bridal-set.png', filter: 'Wedding', tone: 'from-gold/30' },
  { name: 'Bridal Collection', nameTa: 'மணமகள் தொகுப்பு', image: '/products/gold-necklace-2.png', filter: 'Bridal', tone: 'from-rosegold/30' },
  { name: 'Temple Jewellery', nameTa: 'கோயில் நகைகள்', image: '/products/temple-necklace.png', filter: 'Temple', tone: 'from-amber-600/30' },
  { name: 'Kids Collection', nameTa: 'குழந்தைகள் தொகுப்பு', image: '/products/kids-jewellery.png', filter: 'Kids', tone: 'from-pink-300/30' },
  { name: 'Men Collection', nameTa: 'ஆண்கள் தொகுப்பு', image: '/products/mens-chain.png', filter: 'Men', tone: 'from-yellow-700/30' },
  { name: 'Gift Collection', nameTa: 'பரிசு தொகுப்பு', image: '/products/gold-coin.png', filter: 'Gift', tone: 'from-gold/30' },
];

export function Collections() {
  const { lang } = useStore();
  const t = translations[lang];

  const selectCat = (filter: string) => {
    window.dispatchEvent(new CustomEvent('filter-collection', { detail: filter }));
    document.querySelector('#featured')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="collections" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'தொகுப்புகள்' : 'Collections'}
          title={t.ourCollections}
          subtitle={lang === 'ta' ? 'ஒவ்வொரு தருணத்திற்கும் ஏற்ற நகைகள்' : 'Exquisite jewellery for every occasion'}
          tamil={lang === 'ta'}
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATS.map((cat, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              onClick={() => selectCat(cat.filter)}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl glass text-left card-luxury"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width:640px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.tone} via-royal/40 to-royal/90`} />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/0 transition-all group-hover:ring-gold/60" />
                <h3 className={`text-sm font-bold text-gold-light drop-shadow ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {lang === 'ta' ? cat.nameTa : cat.name}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-foreground/70 transition-all group-hover:text-gold">
                  Explore
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
