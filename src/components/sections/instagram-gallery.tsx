'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Heart, ExternalLink } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { SectionTitle } from './about';

const POSTS = [
  { src: '/products/gold-necklace-1.png', likes: 2341, caption: 'Royal Temple Necklace' },
  { src: '/products/bridal-set.png', likes: 4521, caption: 'Complete Bridal Set' },
  { src: '/products/rosegold-necklace.png', likes: 1893, caption: 'Rose Gold Romance' },
  { src: '/products/diamond-ring.png', likes: 3201, caption: 'Halo Diamond Ring' },
  { src: '/products/gold-bangles.png', likes: 2756, caption: 'Filigree Bangles' },
  { src: '/products/silver-necklace.png', likes: 1452, caption: 'Silver Minimalist' },
  { src: '/products/temple-necklace.png', likes: 3987, caption: 'Antique Temple' },
  { src: '/products/gold-earrings.png', likes: 2103, caption: 'Pearl Jhumka' },
];

export function InstagramGallery() {
  const { lang } = useStore();
  const t = translations[lang];

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'சமூகம்' : 'Social'}
          title={t.instagramGallery}
          subtitle={lang === 'ta' ? 'எங்களை இன்ஸ்டாகிராமில் பின்தொடரவும்' : 'Follow our luxury journey'}
          tamil={lang === 'ta'}
        />

        <div className="mt-6 flex justify-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold group flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
          >
            <Instagram className="h-4 w-4" />
            <span className={lang === 'ta' ? 'font-tamil' : ''}>{t.followUs}</span>
            <span className="text-gold-light">@rameezjewellerz</span>
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Masonry-ish grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {POSTS.map((post, i) => (
            <motion.a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className={`group relative zoom-container overflow-hidden rounded-2xl glass ${
                i % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              <div className="relative aspect-square">
                <Image
                  src={post.src}
                  alt={post.caption}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-royal/90 via-royal/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Instagram className="h-8 w-8 text-white drop-shadow" />
                  <div className="mt-2 flex items-center gap-1 text-white">
                    <Heart className="h-4 w-4 fill-white" />
                    <span className="text-sm font-semibold">{post.likes.toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-xs text-gold-light">{post.caption}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
