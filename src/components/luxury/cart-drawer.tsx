'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    removeFromCart,
    updateQty,
    cartTotal,
    lang,
    setCheckoutOpen,
    coupon,
    setCoupon,
    clearCart,
  } = useStore();
  const t = translations[lang];
  const { toast } = useToast();
  const [code, setCode] = useState('');

  const subtotal = cartTotal();
  const discount = coupon
    ? coupon.type === 'percent'
      ? Math.round((subtotal * coupon.discount) / 100)
      : coupon.discount
    : 0;
  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async () => {
    if (!code.trim()) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase(), subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCoupon({ code: data.code, discount: data.discount, type: data.type });
        toast({ title: lang === 'ta' ? 'கூப்பன் செயல்படுத்தப்பட்டது!' : 'Coupon applied!', description: `-${data.discount}` });
      } else {
        toast({ title: lang === 'ta' ? 'தவறான கூப்பன்' : 'Invalid coupon', description: data.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80]"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col glass-dark"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-gold/20 p-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <h2 className={`font-serif-lux text-xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {t.cart}
                </h2>
                <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs text-gold-light">{cart.length}</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="rounded-full p-2 text-gold-light hover:bg-gold/15">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag className="h-16 w-16 text-gold/30" />
                  <p className={`text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>{t.cartEmpty}</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="btn-outline-gold rounded-full px-5 py-2 text-sm"
                  >
                    {t.shopNow}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
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
                        <p className="text-[11px] text-foreground/50">{item.product.purity} · {item.product.weight}g</p>
                        <p className="font-serif-lux text-base font-bold text-gold-gradient">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-gold/30">
                            <button
                              onClick={() => updateQty(item.product.id, item.quantity - 1)}
                              className="flex h-6 w-6 items-center justify-center text-gold hover:bg-gold/15"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.product.id, item.quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center text-gold hover:bg-gold/15"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-400/70 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <button
                    onClick={clearCart}
                    className="mx-auto block text-xs text-foreground/40 hover:text-red-400"
                  >
                    {lang === 'ta' ? 'கார்ட்டை காலி செய்' : 'Clear cart'}
                  </button>
                </div>
              )}
            </div>

            {/* footer */}
            {cart.length > 0 && (
              <div className="border-t border-gold/20 p-4">
                {/* coupon */}
                <div className="mb-3 flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder={lang === 'ta' ? 'கூப்பன் கோட்' : 'Coupon code'}
                      className="w-full rounded-lg border border-gold/30 bg-background/50 py-2 pl-9 pr-3 text-xs uppercase text-foreground placeholder:normal-case focus:border-gold focus:outline-none"
                    />
                  </div>
                  <button onClick={applyCoupon} className="btn-outline-gold rounded-lg px-3 text-xs font-semibold">
                    {lang === 'ta' ? 'செயல்' : 'Apply'}
                  </button>
                </div>

                {coupon && (
                  <div className="mb-3 flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs">
                    <span className="text-emerald-400">✓ {coupon.code}</span>
                    <span className="font-semibold text-emerald-400">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-foreground/70">
                    <span>{t.subtotal}</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>{lang === 'ta' ? 'தள்ளுபடி' : 'Discount'}</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gold/15 pt-2 font-serif-lux text-lg font-bold">
                    <span className="text-gold-light">{t.total}</span>
                    <span className="text-gold-gradient">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!useStore.getState().requireAuth()) return;
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className="btn-gold mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
                >
                  {t.checkout}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
