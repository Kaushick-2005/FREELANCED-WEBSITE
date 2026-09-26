'use client';

import { LayoutDashboard, Package, ShoppingCart, Users, Percent, Star, Plus, Trash2, Edit, Save, XCircle, IndianRupee, Image as ImageIcon, Mail, File as FileIcon, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Tab = 'overview' | 'products' | 'offers' | 'reviews' | 'orders' | 'customers' | 'quotes' | 'gallery' | 'messages';

export function AdminDashboardContent() {
  const [tab, setTab] = useState<Tab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Sequential fetch to avoid server overload
  const fetchAll = async () => {
    try {
      const pr = await fetch('/api/products').then((r) => r.json()).catch(() => ({ products: [] }));
      setProducts(pr.products || []);
      const or = await fetch('/api/orders').then((r) => r.json()).catch(() => ({ orders: [] }));
      setOrders(or.orders || []);
      const of = await fetch('/api/offers').then((r) => r.json()).catch(() => ({ offers: [] }));
      setOffers(of.offers || []);
      const rv = await fetch('/api/reviews').then((r) => r.json()).catch(() => ({ reviews: [] }));
      setReviews(rv.reviews || []);
      const qt = await fetch('/api/custom-quote').then((r) => r.json()).catch(() => ({ quotes: [] }));
      setQuotes(qt.quotes || []);
      const gl = await fetch('/api/gallery').then((r) => r.json()).catch(() => ({ images: [] }));
      setGallery(gl.images || []);
      const ms = await fetch('/api/contact').then((r) => r.json()).catch(() => ({ messages: [] }));
      setMessages(ms.messages || []);
    } catch { /* ignore */ }
  };

  const refresh = fetchAll;

  useEffect(() => {
    queueMicrotask(() => fetchAll());
  }, []);

  const revenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-56 shrink-0">
        <div className="flex gap-1 overflow-x-auto rounded-2xl glass p-2 lg:flex-col">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'offers', icon: Percent, label: 'Offers' },
            { id: 'reviews', icon: Star, label: 'Reviews' },
            { id: 'orders', icon: ShoppingCart, label: 'Orders' },
            { id: 'customers', icon: Users, label: 'Customers' },
            { id: 'quotes', icon: Package, label: 'Custom Quotes' },
            { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
            { id: 'messages', icon: Mail, label: 'Messages' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as Tab)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all lg:w-full',
                tab === item.id ? 'btn-gold' : 'text-foreground/70 hover:bg-gold/10 hover:text-gold'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {tab === 'overview' && <Overview revenue={revenue} productCount={products.length} orderCount={orders.length} orders={orders} reviewCount={reviews.length} quoteCount={quotes.length} />}
        {tab === 'products' && <ProductsTab products={products} onRefresh={refresh} />}
        {tab === 'offers' && <OffersTab offers={offers} onRefresh={refresh} />}
        {tab === 'reviews' && <ReviewsTab products={products} reviews={reviews} onRefresh={refresh} />}
        {tab === 'orders' && <OrdersTab orders={orders} onRefresh={refresh} />}
        {tab === 'customers' && <CustomersTab orders={orders} />}
        {tab === 'quotes' && <QuotesTab quotes={quotes} onRefresh={refresh} />}
        {tab === 'gallery' && <GalleryTab images={gallery} onRefresh={refresh} />}
        {tab === 'messages' && <MessagesTab messages={messages} onRefresh={refresh} />}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change, color }: { icon: any; label: string; value: string; change?: string; color: string }) {
  return (
    <div className="card-luxury relative overflow-hidden rounded-2xl glass p-5">
      <div className={cn('pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl', color)} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-foreground/50">{label}</p>
          <p className="mt-1 font-serif-lux text-2xl font-bold text-gold-gradient">{value}</p>
          {change && <p className="mt-1 text-xs text-emerald-400">↑ {change}</p>}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl text-gold ring-1 ring-gold/30', color)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function Overview({ revenue, productCount, orderCount, orders, reviewCount, quoteCount }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} change="12.5%" color="bg-gold/20" />
        <StatCard icon={ShoppingCart} label="Orders" value={String(orderCount)} change="8.2%" color="bg-emerald-500/20" />
        <StatCard icon={Package} label="Products" value={String(productCount)} color="bg-rosegold/20" />
        <StatCard icon={Star} label="Reviews" value={String(reviewCount)} color="bg-blue-500/20" />
      </div>

      <div className="rounded-2xl glass p-5">
        <h3 className="mb-4 font-serif-lux text-lg font-bold text-gold-light">Sales Analytics (Last 7 days)</h3>
        <div className="flex h-40 items-end justify-between gap-2">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-lg bg-gradient-to-t from-gold-dark to-gold-light" style={{ height: `${h}%`, minHeight: '8px' }} />
              <span className="text-[10px] text-foreground/50">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl glass p-5">
        <h3 className="mb-3 font-serif-lux text-lg font-bold text-gold-light">Recent Orders</h3>
        <div className="space-y-2">
          {orders.slice(0, 5).map((o: any, i: number) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-background/40 p-3">
              <div>
                <p className="text-sm font-medium text-foreground/90">{o.customerName}</p>
                <p className="text-xs text-foreground/50">{o.phone} · {o.paymentMethod || 'Book Order'}</p>
              </div>
              <div className="text-right">
                <p className="font-serif-lux text-sm font-bold text-gold-gradient">₹{(o.total || 0).toLocaleString('en-IN')}</p>
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-400">{o.status || 'Pending'}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="py-4 text-center text-sm text-foreground/50">No orders yet</p>}
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ products, onRefresh }: { products: Product[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const toggleFlag = async (p: Product, flag: 'isNew' | 'isBestSeller' | 'isFeatured' | 'isOffer') => {
    await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id: p.id, [flag]: !p[flag] }) });
    onRefresh();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    toast({ title: 'Product deleted' });
    onRefresh();
  };

  const filtered = search.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.material.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-serif-lux text-lg font-bold text-gold-light">Manage Products ({filtered.length})</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-gold/30 bg-card/50 py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none sm:w-48"
            />
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-gold flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>

      {showForm && <ProductForm product={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); onRefresh(); }} />}

      <div className="overflow-x-auto rounded-2xl glass">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-left text-xs uppercase tracking-wider text-foreground/60">
              <th className="p-3">Product</th>
              <th className="p-3">Material</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Flags</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-gold/10 hover:bg-gold/5">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <img src={p.image} alt="" className="h-8 w-8 rounded object-cover" />
                    <span className="font-medium text-foreground/90">{p.name}</span>
                  </div>
                </td>
                <td className="p-3 text-foreground/70">{p.material}</td>
                <td className="p-3 font-semibold text-gold-light">₹{p.price.toLocaleString('en-IN')}</td>
                <td className="p-3 text-foreground/70">{p.stock}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => toggleFlag(p, 'isNew')} className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold', p.isNew ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400')}>NEW</button>
                    <button onClick={() => toggleFlag(p, 'isBestSeller')} className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold', p.isBestSeller ? 'bg-gold text-royal' : 'bg-gold/20 text-gold')}>HOT</button>
                    <button onClick={() => toggleFlag(p, 'isFeatured')} className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold', p.isFeatured ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-400')}>FEAT</button>
                    <button onClick={() => toggleFlag(p, 'isOffer')} className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold', p.isOffer ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-400')}>OFF</button>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(p); setShowForm(true); }} className="rounded p-1.5 text-gold hover:bg-gold/15"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => deleteProduct(p.id)} className="rounded p-1.5 text-red-400 hover:bg-red-500/15"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: product?.name || '', nameTa: product?.nameTa || '',
    description: product?.description || '', descriptionTa: product?.descriptionTa || '',
    category: product?.category || 'Necklace', material: product?.material || 'Gold',
    purity: product?.purity || '916 Hallmark (22K)', weight: product?.weight || 10,
    price: product?.price || 50000, oldPrice: product?.oldPrice || 0,
    stock: product?.stock || 10,
    isFeatured: product?.isFeatured || false, isNew: product?.isNew || false,
    isBestSeller: product?.isBestSeller || false, isOffer: product?.isOffer || false,
  });
  const [images, setImages] = useState<string[]>(product?.images || (product?.image ? [product.image] : []));
  const [uploading, setUploading] = useState(false);

  // Convert file to Base64 (stored directly in MongoDB, no local upload needed)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const base64 = await fileToBase64(files[i]);
        uploaded.push(base64);
      }
      setImages((prev) => [...prev, ...uploaded]);
      toast({ title: `${uploaded.length} image(s) uploaded` });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = async () => {
    if (images.length === 0) {
      toast({ title: 'Please upload at least one image', variant: 'destructive' });
      return;
    }
    const body: any = {
      ...form,
      image: images[0],
      images,
      tags: [form.material, form.category],
    };
    body.action = product ? 'update' : 'create';
    if (product) body.id = product.id;
    await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    toast({ title: product ? 'Product updated' : 'Product created' });
    onSaved();
  };

  return (
    <div className="mb-4 rounded-2xl gold-border bg-card/80 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-serif-lux text-base font-bold text-gold-light">{product ? 'Edit Product' : 'Add New Product'}</h4>
        <button onClick={onClose} className="text-foreground/40 hover:text-red-400"><XCircle className="h-5 w-5" /></button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <FormField label="Name (Tamil)" value={form.nameTa} onChange={(v) => setForm({ ...form, nameTa: v })} />
        <FormField label="Category (e.g. Necklace, Ring, Bangle, Wedding, Temple...)" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
        <FormField label="Material" value={form.material} onChange={(v) => setForm({ ...form, material: v })} />
        <FormField label="Purity" value={form.purity} onChange={(v) => setForm({ ...form, purity: v })} />
        <FormField label="Weight (g)" value={String(form.weight)} onChange={(v) => setForm({ ...form, weight: Number(v) })} type="number" />
        <FormField label="Price (₹)" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} type="number" />
        <FormField label="Old Price (₹)" value={String(form.oldPrice)} onChange={(v) => setForm({ ...form, oldPrice: Number(v) })} type="number" />
        <FormField label="Stock" value={String(form.stock)} onChange={(v) => setForm({ ...form, stock: Number(v) })} type="number" />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <FormField label="Description (English)" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
        <FormField label="Description (Tamil)" value={form.descriptionTa} onChange={(v) => setForm({ ...form, descriptionTa: v })} textarea />
      </div>

      {/* Image upload */}
      <div className="mt-3">
        <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">Product Images (PNG/JPG) — Upload 1 to 3 photos</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} alt={`Product ${i + 1}`} className="h-20 w-20 rounded-lg object-cover ring-1 ring-gold/30" />
              {i === 0 && <span className="absolute -top-1 -left-1 rounded-full bg-gold px-1.5 py-0.5 text-[8px] font-bold text-royal">MAIN</span>}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          {images.length < 3 && (
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gold/40 text-center transition-colors hover:border-gold hover:bg-gold/5">
              <Plus className="h-5 w-5 text-gold" />
              <span className="text-[9px] text-foreground/50">{uploading ? 'Adding...' : 'Add Image'}</span>
              <input type="file" accept="image/png,image/jpeg,image/jpg" multiple onChange={handleUpload} className="hidden" />
            </label>
          )}
        </div>
        <p className="mt-1 text-[10px] text-foreground/40">First image will be the main product image shown in listings. Images stored in database.</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {[{ k: 'isFeatured', l: 'Featured' }, { k: 'isNew', l: 'New Arrival' }, { k: 'isBestSeller', l: 'Best Seller' }, { k: 'isOffer', l: 'On Offer' }].map((f) => (
          <label key={f.k} className="flex items-center gap-1.5 text-xs text-foreground/70">
            <input type="checkbox" checked={(form as any)[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.checked })} className="accent-[var(--gold)]" />
            {f.l}
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={save} disabled={uploading} className="btn-gold flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"><Save className="h-4 w-4" /> Save</button>
        <button onClick={onClose} className="rounded-lg border border-gold/30 px-4 py-2 text-sm text-foreground/70 hover:bg-gold/10">Cancel</button>
      </div>
    </div>
  );
}

function OffersTab({ offers, onRefresh }: { offers: any[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const deleteOffer = async (id: string) => {
    if (!confirm('Delete this offer?')) return;
    await fetch('/api/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    toast({ title: 'Offer deleted' });
    onRefresh();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-lux text-lg font-bold text-gold-light">Manage Offers ({offers.length})</h3>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-gold flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" /> Add Offer
        </button>
      </div>
      {showForm && <OfferForm offer={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); onRefresh(); }} />}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o, i) => (
          <div key={o.id || i} className="rounded-2xl gold-border bg-gradient-to-br from-gold/10 to-rosegold/5 p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-royal/60 px-3 py-1 font-serif-lux text-sm font-bold text-gold-light ring-1 ring-gold/40">{o.discountLabel}</span>
                <p className="mt-2 text-sm font-semibold text-foreground/90">{o.title}</p>
                {o.titleTa && <p className="text-xs text-foreground/60 font-tamil">{o.titleTa}</p>}
                <p className="mt-1 text-xs text-foreground/60">{o.description}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(o); setShowForm(true); }} className="rounded p-1.5 text-gold hover:bg-gold/15"><Edit className="h-4 w-4" /></button>
                <button onClick={() => deleteOffer(o.id)} className="rounded p-1.5 text-red-400 hover:bg-red-500/15"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OfferForm({ offer, onClose, onSaved }: { offer: any; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: offer?.title || '', titleTa: offer?.titleTa || '', description: offer?.description || '',
    descriptionTa: offer?.descriptionTa || '', discountLabel: offer?.discountLabel || '',
    offerType: offer?.offerType || 'percent', discountValue: offer?.discountValue || 0,
    icon: offer?.icon || 'Crown', active: offer?.active ?? true, order: offer?.order || 0,
  });
  const save = async () => {
    const body: any = { ...form };
    body.action = offer ? 'update' : 'create';
    if (offer) body.id = offer.id;
    await fetch('/api/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    toast({ title: offer ? 'Offer updated' : 'Offer created' });
    onSaved();
  };
  return (
    <div className="mb-4 rounded-2xl gold-border bg-card/80 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-serif-lux text-base font-bold text-gold-light">{offer ? 'Edit Offer' : 'Add New Offer'}</h4>
        <button onClick={onClose} className="text-foreground/40 hover:text-red-400"><XCircle className="h-5 w-5" /></button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <FormField label="Title (Tamil)" value={form.titleTa} onChange={(v) => setForm({ ...form, titleTa: v })} />
        <FormField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        <FormField label="Description (Tamil)" value={form.descriptionTa} onChange={(v) => setForm({ ...form, descriptionTa: v })} />
        <FormField label="Discount Label (e.g. 25% OFF)" value={form.discountLabel} onChange={(v) => setForm({ ...form, discountLabel: v })} />
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">Offer Type</label>
          <select value={form.offerType} onChange={(e) => setForm({ ...form, offerType: e.target.value })} className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background/50 p-2 text-sm text-foreground focus:border-gold focus:outline-none">
            <option value="percent">Percent</option><option value="flat">Flat</option><option value="making">Making Charge</option>
            <option value="coin">Coin Offer</option><option value="gift">Gift Offer</option><option value="text">Text Only</option>
          </select>
        </div>
        <FormField label="Icon (Crown/Sparkles/Coins/Gift/Percent/Tag/Star)" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
        <FormField label="Discount Value" value={String(form.discountValue)} onChange={(v) => setForm({ ...form, discountValue: Number(v) })} type="number" />
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={save} className="btn-gold flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"><Save className="h-4 w-4" /> Save</button>
        <button onClick={onClose} className="rounded-lg border border-gold/30 px-4 py-2 text-sm text-foreground/70 hover:bg-gold/10">Cancel</button>
      </div>
    </div>
  );
}

function ReviewsTab({ products, reviews, onRefresh }: { products: Product[]; reviews: any[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ productId: '', author: '', rating: 5, title: '', comment: '', reviewType: 'product' });

  const addReview = async () => {
    if (!form.productId || !form.author || !form.comment) { toast({ title: 'Fill all fields', variant: 'destructive' }); return; }
    await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create', ...form, rating: Number(form.rating), source: 'admin' }) });
    toast({ title: 'Review added' });
    setForm({ productId: '', author: '', rating: 5, title: '', comment: '', reviewType: 'product' });
    setShowForm(false);
    onRefresh();
  };

  const saveEdit = async (id: string) => {
    const review = reviews.find((r) => r.id === id);
    if (!review) return;
    await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id, author: review.author, title: review.title, comment: review.comment, rating: review.rating }) });
    toast({ title: 'Review updated' });
    setEditingId(null);
    onRefresh();
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    toast({ title: 'Review deleted' });
    onRefresh();
  };

  const toggleVisible = async (id: string, current: boolean) => {
    await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id, visible: !current }) });
    toast({ title: !current ? 'Review is now visible on customer page' : 'Review hidden from customer page' });
    onRefresh();
  };

  const updateField = (id: string, field: string, value: any) => {
    // Edit in place — updates are saved when admin clicks the save button
    const review = reviews.find((r) => r.id === id);
    if (review) {
      (review as any)[field] = value;
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-lux text-lg font-bold text-gold-light">Manage Reviews ({reviews.length})</h3>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="btn-gold flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Add Review</button>
      </div>
      <p className="mb-4 rounded-lg bg-gold/5 p-3 text-xs text-foreground/50">
        Admin manages both product reviews and customer reviews. Toggle "Visible" to control which reviews appear on the customer review page. Reviews from users are marked as "User" source.
      </p>

      {showForm && (
        <div className="mb-4 rounded-2xl gold-border bg-card/80 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">Product</label>
              <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background/50 p-2 text-sm text-foreground focus:border-gold focus:outline-none">
                <option value="">Select product</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <FormField label="Customer Name" value={form.author} onChange={(v) => setForm({ ...form, author: v })} />
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">Rating</label>
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background/50 p-2 text-sm text-foreground focus:border-gold focus:outline-none">
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">Review Type</label>
              <select value={form.reviewType} onChange={(e) => setForm({ ...form, reviewType: e.target.value })} className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background/50 p-2 text-sm text-foreground focus:border-gold focus:outline-none">
                <option value="product">Product Review (shows on product page)</option>
                <option value="customer">Customer Review (shows on customer review page)</option>
              </select>
            </div>
            <FormField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          </div>
          <FormField label="Comment" value={form.comment} onChange={(v) => setForm({ ...form, comment: v })} textarea />
          <div className="mt-3 flex gap-2">
            <button onClick={addReview} className="btn-gold flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"><Save className="h-4 w-4" /> Add Review</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-gold/30 px-4 py-2 text-sm text-foreground/70 hover:bg-gold/10">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl glass p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground/90">{r.author}</span>
                  <span className="text-gold">{'★'.repeat(r.rating)}<span className="text-gold/20">{'★'.repeat(5 - r.rating)}</span></span>
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[8px] font-bold',
                    r.reviewType === 'customer' ? 'bg-blue-500/15 text-blue-400' : 'bg-emerald-500/15 text-emerald-400'
                  )}>
                    {r.reviewType === 'customer' ? 'CUSTOMER' : 'PRODUCT'}
                  </span>
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[8px] font-bold',
                    r.source === 'user' ? 'bg-purple-500/15 text-purple-400' : 'bg-gold/15 text-gold'
                  )}>
                    {r.source === 'user' ? 'USER' : 'ADMIN'}
                  </span>
                  <button
                    onClick={() => toggleVisible(r.id, r.visible !== false)}
                    className={cn('rounded-full px-1.5 py-0.5 text-[8px] font-bold transition-colors',
                      r.visible !== false ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30' : 'bg-gray-500/15 text-gray-400 hover:bg-gray-500/30'
                    )}
                  >
                    {r.visible !== false ? '👁 VISIBLE' : '🚫 HIDDEN'}
                  </button>
                </div>

                {editingId === r.id ? (
                  <div className="mt-2 space-y-2">
                    <input
                      value={r.author}
                      onChange={(e) => updateField(r.id, 'author', e.target.value)}
                      className="w-full rounded border border-gold/30 bg-background/50 p-1.5 text-xs text-foreground"
                      placeholder="Author name"
                    />
                    <input
                      value={r.title || ''}
                      onChange={(e) => updateField(r.id, 'title', e.target.value)}
                      className="w-full rounded border border-gold/30 bg-background/50 p-1.5 text-xs text-foreground"
                      placeholder="Title"
                    />
                    <textarea
                      value={r.comment}
                      onChange={(e) => updateField(r.id, 'comment', e.target.value)}
                      rows={2}
                      className="w-full rounded border border-gold/30 bg-background/50 p-1.5 text-xs text-foreground"
                    />
                    <select
                      value={r.rating}
                      onChange={(e) => updateField(r.id, 'rating', Number(e.target.value))}
                      className="rounded border border-gold/30 bg-background/50 p-1.5 text-xs text-foreground"
                    >
                      {[5, 4, 3, 2, 1].map((rt) => <option key={rt} value={rt}>{rt} Stars</option>)}
                    </select>
                  </div>
                ) : (
                  <>
                    {r.title && <p className="mt-1 text-xs font-medium text-gold-light">{r.title}</p>}
                    <p className="mt-0.5 text-xs text-foreground/65">{r.comment}</p>
                    {r.product?.name && <p className="mt-1 text-[10px] text-foreground/40">on {r.product.name}</p>}
                  </>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                {editingId === r.id ? (
                  <>
                    <button onClick={() => saveEdit(r.id)} className="rounded p-1.5 text-emerald-400 hover:bg-emerald-500/15" title="Save"><Save className="h-4 w-4" /></button>
                    <button onClick={() => setEditingId(null)} className="rounded p-1.5 text-foreground/60 hover:bg-foreground/10" title="Cancel"><XCircle className="h-4 w-4" /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingId(r.id)} className="rounded p-1.5 text-gold hover:bg-gold/15" title="Edit"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => deleteReview(r.id)} className="rounded p-1.5 text-red-400 hover:bg-red-500/15" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="py-8 text-center text-sm text-foreground/50">No reviews yet. Add the first review based on customer feedback.</p>}
      </div>
    </div>
  );
}

function OrdersTab({ orders, onRefresh }: { orders: any[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id, status }) });
    toast({ title: 'Order status updated' });
    onRefresh();
  };

  const filtered = search.trim()
    ? orders.filter((o) =>
        (o.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.phone || '').includes(search) ||
        (o.email || '').toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-serif-lux text-lg font-bold text-gold-light">Orders ({filtered.length})</h3>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, phone..."
            className="w-full rounded-full border border-gold/30 bg-card/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none"
          />
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-2xl glass p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-gold-light">{o.id || 'N/A'}</p>
                <p className="mt-1 text-sm font-semibold text-foreground/90">{o.customerName}</p>
                <p className="text-xs text-foreground/50">{o.phone} {o.email ? `· ${o.email}` : ''}</p>
                {o.address && <p className="text-xs text-foreground/40">{o.address}, {o.city} - {o.pincode}</p>}
                <p className="mt-1 text-[10px] text-foreground/40">{o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : ''}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-serif-lux text-lg font-bold text-gold-gradient">₹{(o.total || 0).toLocaleString('en-IN')}</span>
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-400">{o.status || 'Pending'}</span>
                <select onChange={(e) => updateStatus(o.id, e.target.value)} value={o.status || 'Pending'} className="rounded border border-gold/30 bg-background/50 p-1 text-xs text-foreground">
                  <option>Pending</option><option>Confirmed</option><option>Contacted</option><option>Completed</option><option>Cancelled</option>
                </select>
              </div>
            </div>
            {/* Order items */}
            {o.items && o.items.length > 0 && (
              <div className="mt-3 border-t border-gold/10 pt-2">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-foreground/50">Ordered Items ({o.items.length})</p>
                <div className="space-y-1">
                  {o.items.map((item: any, idx: number) => (
                    <div key={item.id || idx} className="flex items-center justify-between text-xs">
                      <span className="text-foreground/70">{item.name} × {item.quantity} <span className="text-foreground/40">({item.weight}g)</span></span>
                      <span className="text-gold-light">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="mt-2 text-[10px] text-foreground/40">Payment: {o.paymentMethod || 'Book Order'}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-foreground/50">No orders found</p>}
      </div>
    </div>
  );
}

function CustomersTab({ orders }: { orders: any[] }) {
  // Unique customers by phone
  const customerMap = new Map<string, any>();
  orders.forEach((o) => {
    const existing = customerMap.get(o.phone);
    if (existing) {
      existing.orderCount++;
      existing.totalSpent += o.total || 0;
    } else {
      customerMap.set(o.phone, { ...o, orderCount: 1, totalSpent: o.total || 0 });
    }
  });
  const customers = Array.from(customerMap.values());

  return (
    <div>
      <h3 className="mb-4 font-serif-lux text-lg font-bold text-gold-light">Customers ({customers.length})</h3>
      <div className="overflow-x-auto rounded-2xl glass">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-left text-xs uppercase tracking-wider text-foreground/60">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i} className="border-b border-gold/10 hover:bg-gold/5">
                <td className="p-3 text-foreground/90">{c.customerName}</td>
                <td className="p-3 text-foreground/70">{c.phone}</td>
                <td className="p-3 text-foreground/70">{c.email || '—'}</td>
                <td className="p-3 text-foreground/70">{c.orderCount}</td>
                <td className="p-3 font-semibold text-gold-light">₹{c.totalSpent.toLocaleString('en-IN')}</td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-foreground/50">No customers yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QuotesTab({ quotes, onRefresh }: { quotes: any[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/custom-quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id, status }) });
    toast({ title: 'Quote status updated' });
    onRefresh();
  };

  const filtered = search.trim()
    ? quotes.filter((q) =>
        (q.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (q.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (q.phone || '').includes(search) ||
        (q.material || '').toLowerCase().includes(search.toLowerCase())
      )
    : quotes;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-serif-lux text-lg font-bold text-gold-light">Custom Quote Requests ({filtered.length})</h3>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, phone..."
            className="w-full rounded-full border border-gold/30 bg-card/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none"
          />
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map((q) => (
          <div key={q.id} className="rounded-2xl glass p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground/90">{q.name}</span>
                  <span className="text-xs text-foreground/50">· {q.phone}</span>
                </div>
                <p className="mt-1 text-xs text-foreground/60">Material: <span className="text-gold-light">{q.material}</span> · Budget: <span className="text-gold-light">₹{Number(q.budget).toLocaleString('en-IN')}</span></p>
                <p className="mt-1 text-sm text-foreground/70">{q.description}</p>
                {(() => {
                  let imgs: string[] = [];
                  try { imgs = JSON.parse(q.image || '[]'); } catch { if (q.image) imgs = [q.image]; }
                  if (imgs.length === 0) return null;
                  return (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {imgs.map((img, i) => {
                        const isPdf = img.startsWith('data:application/pdf') || img.endsWith('.pdf');
                        const downloadFile = () => {
                          const a = document.createElement('a');
                          a.href = img;
                          a.download = `${q.id || 'quote'}-file-${i + 1}.${isPdf ? 'pdf' : 'png'}`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        };
                        return (
                          <div key={i} className="relative">
                            {isPdf ? (
                              <button onClick={downloadFile} className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-gold/30 bg-background/50 p-2 hover:border-gold hover:bg-gold/10">
                                <FileIcon className="h-6 w-6 text-gold" />
                                <span className="mt-1 text-[8px] text-foreground/60">PDF</span>
                                <span className="text-[7px] text-gold">Download</span>
                              </button>
                            ) : (
                              <button onClick={downloadFile} className="group relative block">
                                <img src={img} alt={`Design ${i + 1}`} className="h-20 w-20 rounded-lg object-cover ring-1 ring-gold/30" />
                                <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-royal/70 text-[8px] font-bold text-gold opacity-0 transition-opacity group-hover:opacity-100">Download</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                <p className="mt-2 text-[10px] text-foreground/40">{new Date(q.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-400">{q.status || 'Pending'}</span>
                <select onChange={(e) => updateStatus(q.id, e.target.value)} value={q.status || 'Pending'} className="rounded border border-gold/30 bg-background/50 p-1 text-xs text-foreground">
                  <option>Pending</option><option>Contacted</option><option>Quoted</option><option>Completed</option><option>Rejected</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-foreground/50">No quote requests found</p>}
      </div>
    </div>
  );
}

function GalleryTab({ images, onRefresh }: { images: any[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', labelTa: '', category: 'Gold', image: '' });
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setForm((f) => ({ ...f, image: data.url }));
      toast({ title: 'Image uploaded' });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
    setUploading(false);
  };

  const addImage = async () => {
    if (!form.label || !form.image) { toast({ title: 'Fill label and upload image', variant: 'destructive' }); return; }
    await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create', ...form }) });
    toast({ title: 'Gallery image added' });
    setForm({ label: '', labelTa: '', category: 'Gold', image: '' });
    setShowForm(false);
    onRefresh();
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Delete this gallery image?')) return;
    await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    toast({ title: 'Image deleted' });
    onRefresh();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif-lux text-lg font-bold text-gold-light">Shop Gallery ({images.length})</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Add Image</button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-2xl gold-border bg-card/80 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Label" value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
            <FormField label="Label (Tamil)" value={form.labelTa} onChange={(v) => setForm({ ...form, labelTa: v })} />
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background/50 p-2 text-sm text-foreground focus:border-gold focus:outline-none">
                {['Gold', 'Silver', 'Bridal', 'Bangles', 'Rings', 'Temple'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">Image (PNG/JPG)</label>
              <div className="mt-1.5 flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gold/40 px-3 py-2 text-xs text-foreground/60 hover:border-gold hover:bg-gold/5">
                  <ImageIcon className="h-4 w-4 text-gold" />
                  {uploading ? 'Uploading...' : form.image ? '✓ Uploaded' : 'Upload'}
                  <input type="file" accept="image/png,image/jpeg" onChange={handleUpload} className="hidden" />
                </label>
                {form.image && <img src={form.image} alt="" className="h-10 w-10 rounded object-cover" />}
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={addImage} className="btn-gold flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"><Save className="h-4 w-4" /> Add to Gallery</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-gold/30 px-4 py-2 text-sm text-foreground/70 hover:bg-gold/10">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative overflow-hidden rounded-xl glass">
            <img src={img.image} alt={img.label} className="aspect-square w-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-royal/90 to-transparent p-2">
              <button onClick={() => deleteImage(img.id)} className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div>
                <p className="text-xs font-semibold text-gold-light">{img.label}</p>
                <p className="text-[10px] text-foreground/60">{img.category}</p>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="col-span-full py-8 text-center text-sm text-foreground/50">No gallery images yet</p>}
      </div>
    </div>
  );
}

function MessagesTab({ messages, onRefresh }: { messages: any[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
    toast({ title: 'Message deleted' });
    onRefresh();
  };
  return (
    <div>
      <h3 className="mb-4 font-serif-lux text-lg font-bold text-gold-light">Contact Messages ({messages.length})</h3>
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="rounded-2xl glass p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground/90">{m.name}</p>
                <p className="text-xs text-foreground/50">{m.phone} {m.email ? `· ${m.email}` : ''}</p>
                <p className="mt-2 text-sm text-foreground/70">{m.message}</p>
                <p className="mt-2 text-[10px] text-foreground/40">{m.createdAt ? new Date(m.createdAt).toLocaleString('en-IN') : ''}</p>
              </div>
              <button onClick={() => deleteMessage(m.id)} className="shrink-0 rounded p-1.5 text-red-400 hover:bg-red-500/15">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="py-8 text-center text-sm text-foreground/50">No messages yet</p>}
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', textarea }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background/50 p-2 text-sm text-foreground focus:border-gold focus:outline-none" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-lg border border-gold/30 bg-background/50 p-2 text-sm text-foreground focus:border-gold focus:outline-none" />
      )}
    </div>
  );
}
