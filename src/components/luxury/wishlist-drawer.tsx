'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

export function WishlistDrawer() {
  const { wishlistOpen, setWishlistOpen, wishlist, removeFromWishlist, addToCart, lang, toggleWishlist } = useStore();
  const t = translations[lang];
  const { toast } = useToast();

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80]"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setWishlistOpen(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col glass-dark"
          >
            <div className="flex items-center justify-between border-b border-gold/20 p-5">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                <h2 className={`font-serif-lux text-xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {t.wishlist}
                </h2>
                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-300">{wishlist.length}</span>
              </div>
              <button onClick={() => setWishlistOpen(false)} className="rounded-full p-2 text-gold-light hover:bg-gold/15">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {wishlist.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <Heart className="h-16 w-16 text-red-400/30" />
                  <p className={`text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>{t.wishlistEmpty}</p>
                  <button
                    onClick={() => setWishlistOpen(false)}
                    className="btn-outline-gold rounded-full px-5 py-2 text-sm"
                  >
                    {t.shopNow}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-3 rounded-xl glass p-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                        <Image src={item.product.image} alt={item.product.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <h4 className={`line-clamp-1 text-sm font-semibold text-foreground/90 ${lang === 'ta' && item.product.nameTa ? 'font-tamil' : ''}`}>
                          {lang === 'ta' && item.product.nameTa ? item.product.nameTa : item.product.name}
                        </h4>
                        <p className="text-[11px] text-foreground/50">{item.product.purity}</p>
                        <p className="font-serif-lux text-base font-bold text-gold-gradient">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </p>
                        <div className="mt-auto flex items-center gap-2">
                          <button
                            onClick={() => {
                              addToCart(item.product, 1);
                              toggleWishlist(item.product);
                              toast({ title: lang === 'ta' ? 'கார்ட்டில் சேர்க்கப்பட்டது' : 'Moved to cart' });
                            }}
                            className="btn-gold flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            {t.addToCart}
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.product.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
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
