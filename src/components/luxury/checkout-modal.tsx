'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Phone, Lock, Download } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { generateInvoicePDF } from '@/lib/invoice';

export function CheckoutModal() {
  const { checkoutOpen, setCheckoutOpen, cart, cartTotal, coupon, lang, clearCart, user } = useStore();
  const t = translations[lang];
  const { toast } = useToast();
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [orderId, setOrderId] = useState('');
  const [saving, setSaving] = useState(false);

  // Delivery details — auto-filled from user profile, editable
  const [delivery, setDelivery] = useState({
    address: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    if (checkoutOpen && user) {
      setDelivery({
        address: (user as any).address || '',
        city: (user as any).city || '',
        pincode: (user as any).pincode || '',
      });
      setStep('confirm');
    }
  }, [checkoutOpen, user]);

  const isLoggedIn = !!user;
  const subtotal = cartTotal();
  const discount = coupon
    ? coupon.type === 'percent'
      ? Math.round((subtotal * coupon.discount) / 100)
      : coupon.discount
    : 0;
  const total = Math.max(0, subtotal - discount);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      useStore.getState().setLoginOpen(true);
      return;
    }

    // Validate delivery details
    if (!delivery.address || !delivery.city || !delivery.pincode) {
      toast({
        title: lang === 'ta' ? 'விலாசம் தேவை' : 'Address required',
        description: lang === 'ta' ? 'தயவுசெய்து உங்கள் விலாசம், நகரம், பின்கோட் நிரப்பவும்' : 'Please fill address, city, and pincode',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || null,
          customerName: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || '',
          address: delivery.address,
          city: delivery.city,
          pincode: delivery.pincode,
          paymentMethod: 'Book Order (Onsite)',
          items: cart.map((c) => ({
            productId: c.product.id,
            name: c.product.name,
            price: c.product.price,
            quantity: c.quantity,
            weight: c.product.weight,
          })),
          subtotal,
          discount,
          total,
          couponCode: coupon?.code,
        }),
      });
      const data = await res.json();
      setOrderId(data.order?.id || 'RJ' + Date.now().toString().slice(-8));
      setStep('success');
      toast({ title: lang === 'ta' ? 'ஆர்டர் பதிவாகியது!' : 'Order Booked!' });
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
    setSaving(false);
  };

  const close = () => {
    setCheckoutOpen(false);
    setTimeout(() => {
      if (step === 'success') {
        clearCart();
        setStep('confirm');
      }
    }, 300);
  };

  const downloadInvoice = () => {
    generateInvoicePDF({
      orderId,
      customerName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: delivery.address,
      city: delivery.city,
      pincode: delivery.pincode,
      items: cart.map((c) => ({
        name: c.product.name,
        quantity: c.quantity,
        price: c.product.price,
        weight: c.product.weight,
      })),
      subtotal,
      discount,
      total,
      paymentMethod: 'Book Order (Onsite)',
      status: 'Pending',
    });
  };

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={close} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl gold-border bg-card"
          >
            <button
              onClick={close}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-gold-light hover:bg-gold hover:text-royal"
            >
              <X className="h-5 w-5" />
            </button>

            {!isLoggedIn ? (
              <div className="p-8 text-center">
                <Lock className="mx-auto h-12 w-12 text-gold/50" />
                <h2 className={`mt-4 font-serif-lux text-xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {lang === 'ta' ? 'உள்நுழைய வேண்டும்' : 'Login Required'}
                </h2>
                <p className="mt-2 text-sm text-foreground/60">
                  {lang === 'ta' ? 'ஆர்டர் பதிவு செய்ய உள்நுழையவும்' : 'Please login to book your order'}
                </p>
                <button
                  onClick={() => { setCheckoutOpen(false); useStore.getState().setLoginOpen(true); }}
                  className="btn-gold mt-4 rounded-full px-6 py-2.5 text-sm font-semibold"
                >
                  {t.login}
                </button>
              </div>
            ) : step === 'confirm' ? (
              <div className="max-h-[90vh] overflow-y-auto p-6">
                <h2 className={`font-serif-lux text-2xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {lang === 'ta' ? 'ஆர்டர் பதிவு' : 'Book Order'}
                </h2>

                {/* User info from DB (read-only) */}
                <div className="mt-4 rounded-xl glass p-4">
                  <p className="text-[10px] uppercase tracking-wider text-foreground/50">{lang === 'ta' ? 'கணக்கு விவரம்' : 'Account Details'}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground/90">{user?.name}</p>
                  <p className="text-xs text-foreground/60">{user?.phone} {user?.email ? `· ${user.email}` : ''}</p>
                </div>

                {/* Delivery details (editable) */}
                <form onSubmit={submit} className="mt-4 space-y-4">
                  <div>
                    <h3 className={`mb-2 text-sm font-semibold uppercase tracking-wider text-gold ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      {lang === 'ta' ? 'டெலிவரி விலாசம்' : 'Delivery Address'}
                    </h3>
                    <p className="mb-2 text-[11px] text-foreground/50">
                      {lang === 'ta'
                        ? 'உங்கள் சேமித்த விலாசம் கீழே உள்ளது. தேவையெனில் மாற்றலாம்.'
                        : 'Your saved address is pre-filled below. You can edit it if needed.'}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">{lang === 'ta' ? 'முகவரி' : 'Address'}</label>
                        <textarea
                          value={delivery.address}
                          onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                          rows={2}
                          required
                          className="mt-1.5 w-full rounded-xl border border-gold/30 bg-background/50 p-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                          placeholder="Door no, Street, Area"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">{lang === 'ta' ? 'நகரம்' : 'City'}</label>
                          <input
                            value={delivery.city}
                            onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                            required
                            className="mt-1.5 w-full rounded-xl border border-gold/30 bg-background/50 p-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">{lang === 'ta' ? 'பின்கோட்' : 'Pincode'}</label>
                          <input
                            value={delivery.pincode}
                            onChange={(e) => setDelivery({ ...delivery, pincode: e.target.value })}
                            required
                            className="mt-1.5 w-full rounded-xl border border-gold/30 bg-background/50 p-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book order note */}
                  <div className="rounded-xl border border-gold/30 bg-gold/5 p-3">
                    <p className={`flex items-center gap-2 text-xs text-foreground/70 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      <Phone className="h-3.5 w-3.5 shrink-0 text-gold" />
                      {lang === 'ta'
                        ? 'ஆர்டர் பதிவு செய்யப்பட்டது. எங்கள் குழு தொலைபேசி மூலம் தொடர்பு கொள்ளும். பணம் கடையில் செலுத்தலாம்.'
                        : 'Order will be booked. Our team will call to confirm. Payment at store (onsite).'}
                    </p>
                  </div>

                  {/* Order summary */}
                  <div className="rounded-2xl glass p-4">
                    <h3 className={`mb-2 text-sm font-semibold uppercase tracking-wider text-gold ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      {lang === 'ta' ? 'ஆர்டர் சுருக்கம்' : 'Order Summary'}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground/70">{cart.length} item(s)</span>
                        <span className="text-foreground/90">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>{lang === 'ta' ? 'தள்ளுபடி' : 'Discount'}</span>
                          <span>-₹{discount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-gold/15 pt-2 font-serif-lux text-lg font-bold">
                        <span className="text-gold-light">{lang === 'ta' ? 'தோராய மொத்தம்' : 'Est. Total'}</span>
                        <span className="text-gold-gradient">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={saving} className="btn-gold w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60">
                    {saving ? '...' : (lang === 'ta' ? 'ஆர்டர் உறுதிப்படுத்து' : 'Confirm & Book Order')}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/30"
                >
                  <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                </motion.div>
                <h2 className={`mt-5 font-serif-lux text-3xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {lang === 'ta' ? 'ஆர்டர் பதிவாகியது!' : 'Order Booked!'}
                </h2>
                <p className="mt-2 text-sm text-foreground/70">
                  {lang === 'ta'
                    ? 'உங்கள் ஆர்டர் பதிவு செய்யப்பட்டது. எங்கள் குழு விரைவில் தொடர்பு கொள்ளும்.'
                    : 'Your order has been booked. Our team will contact you shortly to confirm.'}
                </p>
                <div className="mt-4 rounded-xl glass px-6 py-3">
                  <p className="text-xs uppercase tracking-wider text-foreground/50">Order ID</p>
                  <p className="font-serif-lux text-2xl font-bold text-gold-gradient">{orderId}</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={downloadInvoice} className="btn-outline-gold flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold">
                    <Download className="h-4 w-4" /> {lang === 'ta' ? 'விலைப்பட்டியல்' : 'Invoice'}
                  </button>
                  <button onClick={close} className="btn-gold rounded-xl px-6 py-2.5 text-sm font-semibold">
                    {lang === 'ta' ? 'தொடர்' : 'Continue'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
