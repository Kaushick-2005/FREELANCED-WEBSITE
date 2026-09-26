'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Heart, ShoppingBag, Zap, Star, BadgeCheck, ShieldCheck, ZoomIn, Minus, Plus, Share2, MessageSquare } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function QuickViewModal() {
  const { quickView, setQuickView, addRecentlyViewed } = useStore();
  const product = quickView;

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setQuickView(null)} />
          <QuickViewContent key={product.id} product={product} onClose={() => setQuickView(null)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickViewContent({ product, onClose }: { product: any; onClose: () => void }) {
  const { addToCart, toggleWishlist, isWished, lang, setCheckoutOpen, requireAuth } = useStore();
  const t = translations[lang];
  const { toast } = useToast();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  // Fetch real reviews for this product
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${product.id}&approved=true`);
        if (!active) return;
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch { /* ignore */ }
    })();
    return () => { active = false; };
  }, [product.id]);

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
  const discount = product?.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      onClick={(e) => e.stopPropagation()}
      className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl gold-border bg-card"
    >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-gold-light backdrop-blur hover:bg-gold hover:text-royal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-2">
              {/* Image side */}
              <div className="relative bg-royal/60 p-4">
                <div
                  className="relative aspect-square overflow-hidden rounded-2xl"
                  onMouseEnter={() => setZoom(true)}
                  onMouseLeave={() => setZoom(false)}
                >
                  <motion.div
                    animate={{ scale: zoom ? 1.6 : 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    className="h-full w-full"
                  >
                    <Image
                      src={product.images[activeImg] || product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width:768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </motion.div>

                  {/* badges */}
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {discount > 0 && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">-{discount}%</span>
                    )}
                    {product.isBestSeller && (
                      <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-royal">BESTSELLER</span>
                    )}
                  </div>

                  {/* zoom hint */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] text-gold-light backdrop-blur">
                    <ZoomIn className="h-3 w-3" /> Hover to zoom
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="mt-3 flex justify-center gap-2">
                  {product.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={cn(
                        'relative h-14 w-14 overflow-hidden rounded-lg border-2 transition-all',
                        activeImg === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                      )}
                    >
                      <Image src={img} alt="" fill sizes="56px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Details side */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-gold">
                    <BadgeCheck className="h-3.5 w-3.5" /> {product.material}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gold/50" />
                  <span className="text-foreground/60">{product.category}</span>
                </div>

                <h2 className={`mt-2 font-serif-lux text-2xl font-bold text-foreground ${lang === 'ta' && product.nameTa ? 'font-tamil' : ''}`}>
                  {lang === 'ta' && product.nameTa ? product.nameTa : product.name}
                </h2>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn('h-4 w-4', i < Math.round(product.rating) ? 'fill-gold text-gold' : 'text-foreground/30')}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-foreground/60">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                <div className="mt-4 flex items-end gap-3">
                  <span className="font-serif-lux text-3xl font-bold text-gold-gradient">{fmt(product.price)}</span>
                  {product.oldPrice && product.oldPrice > 0 ? (
                    <span className="price-strike text-base text-foreground/40">{fmt(product.oldPrice)}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-foreground/50">
                  {lang === 'ta' ? 'விலை GST உட்பட' : 'Inclusive of all taxes'}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-gold/10 p-2">
                    <p className="text-[10px] uppercase text-foreground/50">{t.purity}</p>
                    <p className="text-xs font-semibold text-gold-light">{product.purity}</p>
                  </div>
                  <div className="rounded-lg bg-gold/10 p-2">
                    <p className="text-[10px] uppercase text-foreground/50">{t.weight}</p>
                    <p className="text-xs font-semibold text-gold-light">{product.weight}g</p>
                  </div>
                  <div className="rounded-lg bg-gold/10 p-2">
                    <p className="text-[10px] uppercase text-foreground/50">{t.inStock}</p>
                    <p className="text-xs font-semibold text-emerald-400">{product.stock}</p>
                  </div>
                </div>

                <p className={`mt-4 text-sm leading-relaxed text-foreground/70 ${lang === 'ta' && product.descriptionTa ? 'font-tamil' : ''}`}>
                  {lang === 'ta' && product.descriptionTa ? product.descriptionTa : product.description}
                </p>

                {/* qty */}
                <div className="mt-5 flex items-center gap-3">
                  <span className={`text-sm text-foreground/70 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                    {lang === 'ta' ? 'அளவு' : 'Quantity'}:
                  </span>
                  <div className="flex items-center gap-1 rounded-full border border-gold/30">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-8 w-8 items-center justify-center text-gold hover:bg-gold/15">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm text-foreground">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} className="flex h-8 w-8 items-center justify-center text-gold hover:bg-gold/15">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* actions */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      addToCart(product, qty);
                      toast({ title: lang === 'ta' ? 'கார்ட்டில் சேர்க்கப்பட்டது' : 'Added to cart' });
                    }}
                    className="btn-outline-gold flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {t.addToCart}
                  </button>
                  <button
                    onClick={() => {
                      if (!requireAuth()) {
                        toast({ title: lang === 'ta' ? 'உள்நுழைய வேண்டும்' : 'Login required', description: lang === 'ta' ? 'வாங்க உள்நுழையவும்' : 'Please login to buy' });
                        return;
                      }
                      addToCart(product, qty);
                      onClose();
                      setCheckoutOpen(true);
                    }}
                    className="btn-gold flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
                  >
                    <Zap className="h-4 w-4" />
                    {t.buyNow}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => {
                      toggleWishlist(product);
                      toast({ title: isWished(product.id) ? (lang === 'ta' ? 'நீக்கப்பட்டது' : 'Removed') : (lang === 'ta' ? 'சேர்க்கப்பட்டது' : 'Added') });
                    }}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-medium transition-colors',
                      isWished(product.id) ? 'text-red-400' : 'text-foreground/60 hover:text-red-400'
                    )}
                  >
                    <Heart className={cn('h-4 w-4', isWished(product.id) && 'fill-current')} />
                    {t.wishlist}
                  </button>
                  <button
                    onClick={async () => {
                      const productUrl = `${window.location.origin}/?product=${product.id}`;
                      const shareText = lang === 'ta'
                        ? `ரமீஸ் ஜுவெல்லர்ஸ் — ${product.name} | ₹${product.price.toLocaleString('en-IN')}\n${productUrl}`
                        : `Rameez Jewellerz — ${product.name} | ₹${product.price.toLocaleString('en-IN')}\n${productUrl}`;

                      // Try native share first (mobile)
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: `${product.name} — Rameez Jewellerz`,
                            text: shareText,
                            url: productUrl,
                          });
                          return;
                        } catch { /* user cancelled — fall through to copy */ }
                      }

                      // Fallback: copy to clipboard using textarea (works even when document not focused)
                      try {
                        const textarea = document.createElement('textarea');
                        textarea.value = shareText;
                        textarea.style.position = 'fixed';
                        textarea.style.opacity = '0';
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textarea);
                        toast({ title: lang === 'ta' ? 'இணைப்பு நகல் எடுக்கப்பட்டது' : 'Product link copied!' });
                      } catch {
                        toast({ title: lang === 'ta' ? 'பகிர முடியவில்லை' : 'Could not copy', variant: 'destructive' });
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-gold"
                  >
                    <Share2 className="h-4 w-4" />
                    {lang === 'ta' ? 'பகிர்' : 'Share'}
                  </button>
                </div>

                {/* Reviews */}
                <div className="mt-5 border-t border-gold/15 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`flex items-center gap-2 text-sm font-semibold text-gold ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      <MessageSquare className="h-4 w-4" />
                      {lang === 'ta' ? 'வாடிக்கையாளர் கருத்துக்கள்' : 'Customer Reviews'}
                      <span className="text-xs font-normal text-foreground/50">({reviews.length})</span>
                    </h4>
                    {reviews.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="font-serif-lux text-lg font-bold text-gold-gradient">
                          {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                        </span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn('h-3 w-3', i < Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) ? 'fill-gold text-gold' : 'text-foreground/20')} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1 no-scrollbar">
                    {reviews.length === 0 ? (
                      <p className="py-3 text-center text-xs text-foreground/40">
                        {lang === 'ta' ? 'இதுவரை கருத்துக்கள் இல்லை. முதல் கருத்தை தெரிவிக்கவும்!' : 'No reviews yet. Be the first to review!'}
                      </p>
                    ) : (
                      reviews.map((r) => (
                        <div key={r.id} className="rounded-lg bg-background/40 p-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground/90">{r.author}</span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={cn('h-3 w-3', i < r.rating ? 'fill-gold text-gold' : 'text-foreground/20')} />
                              ))}
                            </div>
                          </div>
                          {r.title && <p className="mt-1 text-xs font-medium text-gold-light">{r.title}</p>}
                          <p className="mt-0.5 text-xs text-foreground/65">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* trust */}
                <div className="mt-4 flex items-center justify-center gap-4 border-t border-gold/15 pt-4 text-[10px] text-foreground/50">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <BadgeCheck className="h-3.5 w-3.5 text-gold" /> Hallmark
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold" /> Easy Exchange
                  </span>
                </div>
              </div>
            </div>
    </motion.div>
  );
}
