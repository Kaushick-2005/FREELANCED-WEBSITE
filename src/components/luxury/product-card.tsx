'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Eye, Repeat, ShoppingBag, Zap, Star, BadgeCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { toggleWishlist, isWished, addToCart, setQuickView, toggleCompare, compare, lang, requireAuth } = useStore();
  const { toast } = useToast();
  const wished = isWished(product.id);
  const compared = compare.some((c) => c.id === product.id);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

  const onAdd = () => {
    addToCart(product, 1);
    toast({ title: lang === 'ta' ? 'கார்ட்டில் சேர்க்கப்பட்டது' : 'Added to cart', description: product.name });
  };
  const onBuy = () => {
    if (!requireAuth()) {
      toast({ title: lang === 'ta' ? 'உள்நுழைய வேண்டும்' : 'Login required', description: lang === 'ta' ? 'வாங்க உள்நுழையவும்' : 'Please login to buy' });
      return;
    }
    addToCart(product, 1);
    useStore.getState().setCheckoutOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
      className="card-luxury group relative flex flex-col overflow-hidden rounded-2xl glass"
    >
      {/* Image */}
      <div className="zoom-container relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-royal/80 via-transparent to-transparent opacity-60" />

        {/* badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              NEW
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              -{discount}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="flex items-center gap-0.5 rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-bold text-royal backdrop-blur">
              <Zap className="h-2.5 w-2.5" /> HOT
            </span>
          )}
        </div>

        {/* wishlist */}
        <button
          onClick={() => {
            toggleWishlist(product);
            toast({
              title: wished
                ? lang === 'ta' ? 'விருப்பத்திலிருந்து நீக்கப்பட்டது'
                : 'Removed from wishlist'
                : lang === 'ta' ? 'விருப்பப்பட்டியலில் சேர்க்கப்பட்டது' : 'Added to wishlist',
            });
          }}
          aria-label="Wishlist"
          className={cn(
            'absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all',
            wished
              ? 'bg-red-500 text-white scale-110'
              : 'bg-black/40 text-white hover:bg-red-500 hover:text-white'
          )}
        >
          <Heart className={cn('h-4 w-4', wished && 'fill-current')} />
        </button>

        {/* Quick actions (hover) */}
        <div className="absolute inset-x-2 bottom-2 flex translate-y-4 gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => setQuickView(product)}
            className="flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-black/60 text-[11px] font-medium text-white backdrop-blur transition-colors hover:bg-gold hover:text-royal"
            title="Quick View"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button
            onClick={() => toggleCompare(product)}
            aria-label="Compare"
            title="Compare"
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg backdrop-blur transition-colors',
              compared ? 'bg-gold text-royal' : 'bg-black/60 text-white hover:bg-gold hover:text-royal'
            )}
          >
            <Repeat className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 360 hint */}
        <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[9px] text-gold-light opacity-0 backdrop-blur transition-opacity group-hover:opacity-0">
          360°
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gold">
            <BadgeCheck className="h-3 w-3" />
            {product.material}
          </span>
          <span className="flex items-center gap-0.5 text-[11px] text-gold-light">
            <Star className="h-3 w-3 fill-gold text-gold" />
            {product.rating} <span className="text-foreground/40">({product.reviewCount})</span>
          </span>
        </div>

        <h3 className={`line-clamp-1 text-sm font-semibold text-foreground/90 ${lang === 'ta' && product.nameTa ? 'font-tamil' : ''}`}>
          {lang === 'ta' && product.nameTa ? product.nameTa : product.name}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-[11px] text-foreground/55">
          <span>{product.purity}</span>
          <span className="h-1 w-1 rounded-full bg-gold/50" />
          <span>{product.weight}g</span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-end gap-2">
            <span className="font-serif-lux text-lg font-bold text-gold-gradient">
              {fmt(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > 0 ? (
              <span className="price-strike text-xs text-foreground/50">{fmt(product.oldPrice)}</span>
            ) : null}
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <button
              onClick={onAdd}
              className="flex items-center justify-center gap-1 rounded-lg border border-gold/40 py-2 text-[11px] font-semibold text-gold-light transition-all hover:bg-gold hover:text-royal"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {lang === 'ta' ? 'சேர்' : 'Cart'}
            </button>
            <button
              onClick={onBuy}
              className="btn-gold flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-semibold"
            >
              <Zap className="h-3.5 w-3.5" />
              {lang === 'ta' ? 'வாங்க' : 'Buy'}
            </button>
          </div>
        </div>

        {/* stock indicator */}
        <div className="mt-2 flex items-center gap-1.5 text-[10px]">
          <span className={cn('h-1.5 w-1.5 rounded-full', product.stock > 5 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-500')} />
          <span className="text-foreground/50">
            {product.stock > 0
              ? lang === 'ta' ? `கையிருப்பில் உள்ளது (${product.stock})` : `In stock (${product.stock})`
              : lang === 'ta' ? 'கையிருப்பில் இல்லை' : 'Out of stock'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
