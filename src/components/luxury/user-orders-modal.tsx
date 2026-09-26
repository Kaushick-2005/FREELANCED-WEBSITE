'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Download, Palette, Star, PenLine } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/invoice';
import { useToast } from '@/hooks/use-toast';

type Tab = 'orders' | 'quotes';

export function UserOrdersModal() {
  const { user, lang } = useStore();
  const t = translations[lang];
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewingItem, setReviewingItem] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '', reviewType: 'product' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const onOpen = () => { setOpen(true); };
    window.addEventListener('open-user-orders', onOpen);
    return () => window.removeEventListener('open-user-orders', onOpen);
  }, []);

  useEffect(() => {
    if (!open || !user) return;
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const [orRes, qtRes] = await Promise.all([
          fetch(`/api/orders?phone=${encodeURIComponent(user.phone)}`).then((r) => r.json()),
          fetch(`/api/custom-quote?phone=${encodeURIComponent(user.phone)}`).then((r) => r.json()),
        ]);
        if (!active) return;
        setOrders(orRes.orders || []);
        setQuotes(qtRes.quotes || []);
      } catch { /* ignore */ }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [open, user]);

  if (!user) return null;

  const statusColor = (status: string) => {
    if (status === 'Cancelled' || status === 'Rejected') return 'bg-red-500/15 text-red-400';
    if (status === 'Pending') return 'bg-amber-500/15 text-amber-400';
    if (status === 'Confirmed' || status === 'Contacted' || status === 'Completed' || status === 'Quoted') return 'bg-emerald-500/15 text-emerald-400';
    return 'bg-blue-500/15 text-blue-400';
  };

  const downloadOrderInvoice = (o: any) => {
    generateInvoicePDF({
      orderId: o.id || 'N/A',
      customerName: o.customerName || user.name,
      phone: o.phone || user.phone,
      email: o.email || user.email,
      address: o.address,
      city: o.city,
      pincode: o.pincode,
      items: (o.items || []).map((it: any) => ({ name: it.name, quantity: it.quantity, price: it.price, weight: it.weight })),
      subtotal: o.subtotal || 0,
      discount: o.discount || 0,
      total: o.total || 0,
      paymentMethod: o.paymentMethod || 'Book Order',
      status: o.status || 'Pending',
    });
  };

  const downloadQuoteInvoice = (q: any) => {
    generateInvoicePDF({
      orderId: q.id || 'N/A',
      customerName: q.name || user.name,
      phone: q.phone || user.phone,
      email: q.email || user.email,
      items: [],
      subtotal: 0,
      total: q.budget || 0,
      type: 'Custom Quote',
      material: q.material,
      budget: q.budget,
      description: q.description,
      status: q.status || 'Pending',
    });
  };

  const openReview = (item: any) => {
    setReviewingItem(item);
    setReviewForm({ rating: 5, title: '', comment: '', reviewType: 'product' });
  };

  const submitReview = async () => {
    if (!reviewingItem || !user) return;
    if (!reviewForm.comment.trim()) {
      toast({ title: lang === 'ta' ? 'கருத்து உள்ளிடவும்' : 'Please enter a comment', variant: 'destructive' });
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          productId: reviewingItem.productId,
          author: user.name,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
          reviewType: reviewForm.reviewType,
          source: 'user',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: lang === 'ta' ? 'கருத்து சமர்ப்பிக்கப்பட்டது!' : 'Review submitted!',
          description: lang === 'ta' ? 'நிர்வாகம் பதிப்பதற்கு முன் அனுமதிக்கும்.' : 'Admin will review and approve it.',
        });
        setReviewingItem(null);
      } else {
        toast({ title: 'Error', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    }
    setSubmittingReview(false);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl gold-border bg-card"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-gold-light hover:bg-gold hover:text-royal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="border-b border-gold/20 p-6">
                <h2 className={`flex items-center gap-2 font-serif-lux text-xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  <Package className="h-5 w-5 text-gold" />
                  {lang === 'ta' ? 'என் ஆர்டர்கள்' : 'My Orders'}
                </h2>
              </div>

              <div className="flex gap-1 border-b border-gold/15 p-2">
                <button onClick={() => setTab('orders')} className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all', tab === 'orders' ? 'btn-gold' : 'text-foreground/60 hover:bg-gold/10')}>
                  <Package className="h-4 w-4" />
                  {lang === 'ta' ? 'ஆர்டர்கள்' : 'Orders'} ({orders.length})
                </button>
                <button onClick={() => setTab('quotes')} className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all', tab === 'quotes' ? 'btn-gold' : 'text-foreground/60 hover:bg-gold/10')}>
                  <Palette className="h-4 w-4" />
                  {lang === 'ta' ? 'தனிப்பயன்' : 'Custom Quotes'} ({quotes.length})
                </button>
              </div>

              <div className="max-h-[55vh] overflow-y-auto p-5">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (<div key={i} className="h-24 animate-pulse rounded-xl bg-gold/10" />))}
                  </div>
                ) : tab === 'orders' ? (
                  orders.length === 0 ? (
                    <div className="py-10 text-center">
                      <Package className="mx-auto h-12 w-12 text-gold/30" />
                      <p className={`mt-3 text-sm text-foreground/50 ${lang === 'ta' ? 'font-tamil' : ''}`}>{lang === 'ta' ? 'ஆர்டர்கள் இல்லை' : 'No orders yet'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((o, i) => (
                        <div key={o.id || i} className="rounded-xl glass p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-gold-light">{o.id || 'N/A'}</span>
                            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', statusColor(o.status || 'Pending'))}>{o.status || 'Pending'}</span>
                          </div>
                          <p className="mt-1 text-xs text-foreground/50">{o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : ''}</p>
                          {o.items && o.items.length > 0 && (
                            <div className="mt-2 space-y-2 border-t border-gold/10 pt-2">
                              {o.items.map((item: any, idx: number) => (
                                <div key={item.id || idx} className="flex items-center justify-between text-xs">
                                  <span className="text-foreground/70">{item.name} × {item.quantity}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gold-light">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    {/* Write Review button — only for ordered items */}
                                    <button
                                      onClick={() => openReview(item)}
                                      className="flex items-center gap-1 rounded-full border border-gold/30 px-2 py-0.5 text-[9px] font-medium text-gold-light transition-colors hover:bg-gold/10"
                                      title={lang === 'ta' ? 'கருத்து எழுது' : 'Write Review'}
                                    >
                                      <PenLine className="h-2.5 w-2.5" />
                                      {lang === 'ta' ? 'கருத்து' : 'Review'}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 flex items-center justify-between border-t border-gold/10 pt-2">
                            <span className="text-xs text-foreground/60">{o.paymentMethod || 'Book Order'}</span>
                            <span className="font-serif-lux text-base font-bold text-gold-gradient">₹{(o.total || 0).toLocaleString('en-IN')}</span>
                          </div>
                          <button onClick={() => downloadOrderInvoice(o)} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-gold/30 py-1.5 text-xs font-medium text-gold-light transition-colors hover:bg-gold/10">
                            <Download className="h-3 w-3" /> {lang === 'ta' ? 'விலைப்பட்டியல் பதிவிறக்கம்' : 'Download Invoice'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  quotes.length === 0 ? (
                    <div className="py-10 text-center">
                      <Palette className="mx-auto h-12 w-12 text-gold/30" />
                      <p className={`mt-3 text-sm text-foreground/50 ${lang === 'ta' ? 'font-tamil' : ''}`}>{lang === 'ta' ? 'தனிப்பயன் கோரிக்கைகள் இல்லை' : 'No custom quotes yet'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quotes.map((q, i) => (
                        <div key={q.id || i} className="rounded-xl glass p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-gold-light">{q.id || 'N/A'}</span>
                            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', statusColor(q.status || 'Pending'))}>{q.status || 'Pending'}</span>
                          </div>
                          <p className="mt-1 text-xs text-foreground/50">{q.createdAt ? new Date(q.createdAt).toLocaleString('en-IN') : ''}</p>
                          <div className="mt-2 space-y-1 border-t border-gold/10 pt-2">
                            <div className="flex items-center justify-between text-xs"><span className="text-foreground/70">{lang === 'ta' ? 'மெட்டீரியல்' : 'Material'}</span><span className="text-gold-light">{q.material}</span></div>
                            <div className="flex items-center justify-between text-xs"><span className="text-foreground/70">{lang === 'ta' ? 'பட்ஜெட்' : 'Budget'}</span><span className="text-gold-light">₹{Number(q.budget).toLocaleString('en-IN')}</span></div>
                          </div>
                          {q.description && <p className="mt-2 line-clamp-2 text-xs text-foreground/60">{q.description.split('\n')[0]}</p>}
                          <button onClick={() => downloadQuoteInvoice(q)} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-gold/30 py-1.5 text-xs font-medium text-gold-light transition-colors hover:bg-gold/10">
                            <Download className="h-3 w-3" /> {lang === 'ta' ? 'மேற்கோள் பதிவிறக்கம்' : 'Download Quote'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Form Modal */}
      <AnimatePresence>
        {reviewingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setReviewingItem(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl gold-border bg-card"
            >
              <button onClick={() => setReviewingItem(null)} className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-gold-light hover:bg-gold hover:text-royal">
                <X className="h-5 w-5" />
              </button>

              <div className="border-b border-gold/20 p-6">
                <h3 className={`flex items-center gap-2 font-serif-lux text-lg font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  <PenLine className="h-4 w-4 text-gold" />
                  {lang === 'ta' ? 'கருத்து எழுது' : 'Write a Review'}
                </h3>
                <p className="mt-1 text-xs text-foreground/60">{reviewingItem.name}</p>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-6">
                <div className="space-y-4">
                  {/* Review Type */}
                  <div>
                    <label className={`text-xs font-medium uppercase tracking-wider text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      {lang === 'ta' ? 'கருத்து வகை' : 'Review Type'}
                    </label>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setReviewForm({ ...reviewForm, reviewType: 'product' })}
                        className={cn('flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                          reviewForm.reviewType === 'product' ? 'btn-gold border-transparent' : 'border-gold/30 text-foreground/70 hover:border-gold'
                        )}
                      >
                        {lang === 'ta' ? 'தயாரிப்பு கருத்து' : 'Product Review'}
                      </button>
                      <button
                        onClick={() => setReviewForm({ ...reviewForm, reviewType: 'customer' })}
                        className={cn('flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                          reviewForm.reviewType === 'customer' ? 'btn-gold border-transparent' : 'border-gold/30 text-foreground/70 hover:border-gold'
                        )}
                      >
                        {lang === 'ta' ? 'வாடிக்கையாளர் கருத்து' : 'Customer Review'}
                      </button>
                    </div>
                    <p className="mt-1 text-[10px] text-foreground/40">
                      {reviewForm.reviewType === 'product'
                        ? (lang === 'ta' ? 'தயாரிப்பு தரம், தோற்றம், விவரங்களை பற்றி எழுதுங்கள்' : 'Describe the product quality, appearance, and details')
                        : (lang === 'ta' ? 'உங்கள் ஷாப்பிங் அனுபவம், சேவை பற்றி எழுதுங்கள்' : 'Describe your shopping experience and service')}
                    </p>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className={`text-xs font-medium uppercase tracking-wider text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      {lang === 'ta' ? 'மதிப்பீடு' : 'Rating'}
                    </label>
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star className={cn('h-7 w-7', star <= reviewForm.rating ? 'fill-gold text-gold' : 'text-gold/20')} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className={`text-xs font-medium uppercase tracking-wider text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      {lang === 'ta' ? 'தலைப்பு' : 'Title'}
                    </label>
                    <input
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-gold/30 bg-background/50 p-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                      placeholder={lang === 'ta' ? 'தலைப்பு (விரும்பினால்)' : 'Title (optional)'}
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className={`text-xs font-medium uppercase tracking-wider text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      {lang === 'ta' ? 'உங்கள் கருத்து' : 'Your Review'}
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      rows={4}
                      required
                      className="mt-1.5 w-full rounded-xl border border-gold/30 bg-background/50 p-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                      placeholder={lang === 'ta' ? 'உங்கள் அனுபவத்தை பகிருங்கள்...' : 'Share your experience...'}
                    />
                  </div>

                  <button
                    onClick={submitReview}
                    disabled={submittingReview}
                    className="btn-gold w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
                  >
                    {submittingReview ? '...' : (lang === 'ta' ? 'கருத்து சமர்ப்பிக்க' : 'Submit Review')}
                  </button>
                  <p className="text-center text-[10px] text-foreground/40">
                    {lang === 'ta' ? 'உங்கள் கருத்து நிர்வாகம் பார்த்த பிறகு வெளியிடப்படும்' : 'Your review will be published after admin approval'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
