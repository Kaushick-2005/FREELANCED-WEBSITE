'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquarePlus } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { SectionTitle } from './about';
import { cn } from '@/lib/utils';

export function Reviews() {
  const { lang } = useStore();
  const t = translations[lang];
  const [reviews, setReviews] = useState<any[]>([]);
  const [overallRating, setOverallRating] = useState(0);
  const [totalReviewCount, setTotalReviewCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Fetch only visible reviews for display, but get overall rating from ALL reviews
        const res = await fetch('/api/reviews?approved=true&visible=true');
        if (!active) return;
        const data = await res.json();
        setReviews(data.reviews || []);
        setOverallRating(data.overallRating || 0);
        setTotalReviewCount(data.totalReviewCount || 0);
      } catch { /* ignore */ }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!auto || reviews.length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, [auto, reviews.length]);

  // Overall rating comes from ALL reviews (visible + hidden), not just displayed ones
  const avg = overallRating > 0 ? overallRating.toFixed(1) : '—';
  const totalReviews = totalReviewCount;

  return (
    <section id="reviews" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'கருத்துக்கள்' : 'Reviews'}
          title={t.customerReviews}
          subtitle={lang === 'ta' ? 'உண்மையான வாடிக்கையாளர் அனுபவங்கள்' : 'Real customer experiences'}
          tamil={lang === 'ta'}
        />

        {loading ? (
          <div className="mx-auto mt-10 max-w-2xl animate-pulse rounded-3xl glass-gold p-10">
            <div className="mx-auto h-6 w-3/4 rounded bg-gold/10" />
            <div className="mx-auto mt-4 h-4 w-1/2 rounded bg-gold/10" />
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-10 max-w-2xl rounded-3xl glass p-10 text-center"
          >
            <MessageSquarePlus className="mx-auto h-12 w-12 text-gold/40" />
            <h3 className={`mt-4 font-serif-lux text-xl font-bold text-gold-light ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {lang === 'ta' ? 'இதுவரை கருத்துக்கள் இல்லை' : 'No Reviews Yet'}
            </h3>
            <p className={`mt-2 text-sm text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {lang === 'ta'
                ? 'வாடிக்கையாளர்கள் நகை வாங்கி கருத்து தெரிவித்தவுடன் இங்கே காட்டப்படும்.'
                : 'Reviews will appear here once customers purchase and share their experience.'}
            </p>
            <p className="mt-1 text-xs text-foreground/40">
              {lang === 'ta' ? 'நம்பிக்கையுடன் — ரமீஸ் ஜுவெல்லர்ஸ்' : 'Trusted — Rameez Jewellerz'}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => {
                  const avgNum = parseFloat(avg);
                  // Show full star, half star, or empty star based on average
                  if (i + 1 <= Math.floor(avgNum)) {
                    return <Star key={i} className="h-6 w-6 fill-gold text-gold" style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.5))' }} />;
                  }
                  if (i < avgNum && i + 1 > avgNum) {
                    // Half star — use a relative positioned star with half fill
                    return (
                      <div key={i} className="relative h-6 w-6">
                        <Star className="absolute inset-0 h-6 w-6 text-gold/30" />
                        <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                          <Star className="h-6 w-6 fill-gold text-gold" style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.5))' }} />
                        </div>
                      </div>
                    );
                  }
                  return <Star key={i} className="h-6 w-6 text-gold/30" />;
                })}
              </div>
              <span className="font-serif-lux text-3xl font-bold text-gold-gradient">{avg}</span>
              <span className="text-sm text-foreground/50">/ 5.0 · {totalReviews} reviews</span>
            </div>

            <div
              className="relative mt-10"
              onMouseEnter={() => setAuto(false)}
              onMouseLeave={() => setAuto(true)}
            >
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                    className="glass-gold mx-auto max-w-2xl rounded-3xl p-8 text-center md:p-10"
                  >
                    <Quote className="mx-auto mb-4 h-10 w-10 text-gold/60" />
                    {reviews[index].title && (
                      <p className={`mb-2 font-serif-lux text-lg font-semibold text-gold-light ${lang === 'ta' ? 'font-tamil' : ''}`}>
                        {reviews[index].title}
                      </p>
                    )}
                    <p className={`font-serif-lux text-xl italic leading-relaxed text-foreground/85 md:text-2xl ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      {reviews[index].comment}
                    </p>
                    <div className="mt-5 flex items-center justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn('h-4 w-4', i < reviews[index].rating ? 'fill-gold text-gold' : 'text-gold/20')} />
                      ))}
                    </div>
                    <p className="mt-4 font-semibold text-gold-light">{reviews[index].author}</p>
                    {reviews[index].product?.name && (
                      <p className="text-xs text-foreground/50">on {reviews[index].product.name}</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setIndex((i) => (i - 1 + reviews.length) % reviews.length)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-royal"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-1.5">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-gold' : 'w-2 bg-gold/30 hover:bg-gold/60'}`}
                      aria-label={`Go to ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setIndex((i) => (i + 1) % reviews.length)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-gold hover:text-royal"
                  aria-label="Next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
