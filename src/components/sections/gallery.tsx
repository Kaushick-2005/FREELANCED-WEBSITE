'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { SectionTitle } from './about';
import { cn } from '@/lib/utils';

type Item = { src: string; label: string; labelTa: string; cat: string; span?: boolean };

const FALLBACK_ITEMS: Item[] = [
  { src: '/products/gold-necklace-1.png', label: 'Gold Necklace', labelTa: 'தங்க நெக்லஸ்', cat: 'Gold', span: true },
  { src: '/products/silver-necklace.png', label: 'Silver Necklace', labelTa: 'வெள்ளி நெக்லஸ்', cat: 'Silver' },
  { src: '/products/bridal-set.png', label: 'Bridal Set', labelTa: 'மணமகள் செட்', cat: 'Bridal' },
  { src: '/products/gold-bangles.png', label: 'Gold Bangles', labelTa: 'தங்க வளையல்', cat: 'Bangles' },
  { src: '/products/gold-ring-diamond.png', label: 'Gold Ring', labelTa: 'தங்க மோதிரம்', cat: 'Rings' },
  { src: '/products/temple-necklace.png', label: 'Temple Jewellery', labelTa: 'கோயில் நகை', cat: 'Temple', span: true },
  { src: '/products/gallery-1.png', label: 'Boutique Display', labelTa: 'கடை காட்சி', cat: 'Gold' },
  { src: '/products/gallery-2.png', label: 'Bridal Showcase', labelTa: 'மணமகள் காட்சி', cat: 'Bridal' },
];

const FILTERS = ['All', 'Gold', 'Silver', 'Bridal', 'Bangles', 'Rings', 'Temple'];

export function Gallery() {
  const { lang } = useStore();
  const t = translations[lang];
  const [filter, setFilter] = useState('All');
  const [zoom, setZoom] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>(FALLBACK_ITEMS);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/gallery');
        if (!active) return;
        const data = await res.json();
        if (data.images && data.images.length > 0) {
          const mapped: Item[] = data.images.map((img: any, i: number) => ({
            src: img.image,
            label: img.label,
            labelTa: img.labelTa || img.label,
            cat: img.category,
            span: i % 5 === 0,
          }));
          setItems(mapped);
        }
      } catch { /* keep fallback */ }
    })();
    return () => { active = false; };
  }, []);

  const filteredItems = filter === 'All' ? items : items.filter((i) => i.cat === filter);

  return (
    <section id="gallery" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'கேலரி' : 'Gallery'}
          title={t.shopGallery}
          subtitle={lang === 'ta' ? 'எங்கள் நகைகளின் அழகு' : 'A glimpse of our exquisite collection'}
          tamil={lang === 'ta'}
        />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-medium transition-all',
                filter === f
                  ? 'btn-gold border-transparent'
                  : 'border-gold/30 text-foreground/70 hover:border-gold hover:text-gold'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item, i) => (
            <motion.button
              key={item.src + i}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setZoom(item)}
              className={cn(
                'group relative zoom-container overflow-hidden rounded-2xl glass',
                item.span && 'sm:col-span-2 sm:row-span-2'
              )}
            >
              <div className={cn('relative w-full', item.span ? 'aspect-square' : 'aspect-square')}>
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal/90 via-transparent to-transparent opacity-70" />
              </div>
              <div className="absolute inset-0 flex items-end p-3">
                <div className="translate-y-2 transition-transform group-hover:translate-y-0">
                  <span className="text-xs font-bold text-gold-light">{item.cat}</span>
                  <p className={`text-sm text-foreground/90 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                    {lang === 'ta' ? item.labelTa : item.label}
                  </p>
                </div>
              </div>
              <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-gold opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-4 w-4" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Gold Making Process Video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 overflow-hidden rounded-3xl gold-border"
        >
          <div className="grid lg:grid-cols-5">
            <div className="lg:col-span-3 relative aspect-video bg-royal">
              {/* iframe template — replace src with your gold making process video URL later */}
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
                title="Gold Making Process — Rameez Jewellerz"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col justify-center">
              <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                {lang === 'ta' ? 'நேரடி காணொளி' : 'Live Video'}
              </div>
              <h3 className={`font-serif-lux text-2xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
                {lang === 'ta' ? 'தங்கம் செய்யும் முறை' : 'Gold Making Process'}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed text-foreground/70 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                {lang === 'ta'
                  ? 'எங்கள் நிபுணர் கைவினைஞர்கள் எப்படி ஒவ்வொரு நகையையும் உருவாக்குகிறார்கள் என்பதை காணுங்கள். பாரம்பரிய கைவினைத்திறனும் நவீன தரமும் இணைந்த அழகை அனுபவிக்கவும்.'
                  : 'Watch our master craftsmen create each piece of jewellery. Experience the blend of traditional craftsmanship and modern quality that makes every Rameez Jewellerz piece unique.'}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-foreground/50">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" /> BIS 916 Hallmark
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Since 1991
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-3xl overflow-hidden rounded-3xl gold-border"
            >
              <button
                onClick={() => setZoom(null)}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-gold-light backdrop-blur hover:bg-gold hover:text-royal"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative aspect-square w-full">
                <Image src={zoom.src} alt={zoom.label} fill sizes="80vw" className="object-cover" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-royal to-transparent p-6">
                <p className={`font-serif-lux text-2xl font-bold text-gold-light ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {lang === 'ta' ? zoom.labelTa : zoom.label}
                </p>
                <p className="text-sm text-gold">{zoom.cat}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
