'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Palette, FileText, Calendar, Sparkles, ArrowRight, X, File as FileIcon } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { SectionTitle } from './about';
import { useToast } from '@/hooks/use-toast';

export function CustomizedJewellery() {
  const { lang, user, setLoginOpen } = useStore();
  const t = translations[lang];
  const { toast } = useToast();
  const [material, setMaterial] = useState('Gold');
  const [budget, setBudget] = useState(50000);
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<{ url: string; name: string; type: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const steps = [
    { icon: Upload, label: t.uploadDesign, ta: 'வடிவமைப்பை பதிவேற்று' },
    { icon: Palette, label: lang === 'ta' ? 'தங்கம்/வெள்ளி/ரோஸ் கோல்ட்' : 'Select Material', ta: 'மெட்டீரியல் தேர்வு' },
    { icon: FileText, label: t.getQuote, ta: 'விலை பெறு' },
    { icon: Calendar, label: t.bookAppointment, ta: 'சந்திப்பை பதிவு செய்' },
  ];

  // Convert file to Base64 data URI (stored directly in MongoDB, not local files)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    setUploading(true);
    try {
      const uploaded: { url: string; name: string; type: string }[] = [];
      for (let i = 0; i < selected.length; i++) {
        const file = selected[i];
        // Convert to Base64 — stored in DB, not local storage
        const base64 = await fileToBase64(file);
        uploaded.push({ url: base64, name: file.name, type: file.type });
      }
      setFiles((prev) => [...prev, ...uploaded]);
      toast({ title: lang === 'ta' ? `${uploaded.length} கோப்பு(கள்) பதிவேற்றப்பட்டது` : `${uploaded.length} file(s) uploaded` });
    } catch {
      toast({ title: lang === 'ta' ? 'பதிவேற்றம் தோல்வி' : 'Upload failed', variant: 'destructive' });
    }
    setUploading(false);
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: lang === 'ta' ? 'உள்நுழைய வேண்டும்' : 'Login required', variant: 'destructive' });
      setLoginOpen(true);
      return;
    }

    if (!desc) {
      toast({ title: lang === 'ta' ? 'வடிவமைப்பு விளக்கம் தேவை' : 'Please describe your design', variant: 'destructive' });
      return;
    }

    try {
      const res = await fetch('/api/custom-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          email: user.email,
          userId: user.id,
          address: (user as any).address || '',
          material,
          budget,
          description: desc,
          images: files.map((f) => f.url),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast({
          title: lang === 'ta' ? 'கோரிக்கை அனுப்பப்பட்டது!' : 'Request sent!',
          description: lang === 'ta' ? 'எங்கள் குழு விரைவில் உங்களை தொடர்பு கொள்ளும்.' : 'Our team will contact you shortly.',
        });
        setTimeout(() => setSubmitted(false), 4000);
        setDesc('');
        setFiles([]);
      } else {
        toast({ title: 'Error', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    }
  };

  return (
    <section id="customized" className="relative overflow-hidden py-20">
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'தனிப்பயன்' : 'Custom'}
          title={t.customizedJewellery}
          subtitle={t.createDream}
          tamil={lang === 'ta'}
        />

        {/* Steps */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative rounded-2xl glass p-6 text-center"
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-rosegold/10 text-gold ring-1 ring-gold/30">
                <s.icon className="h-7 w-7" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gold">Step {i + 1}</div>
              <p className={`mt-1 text-sm font-medium text-foreground/85 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                {lang === 'ta' ? s.ta : s.label}
              </p>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-gold/40 md:block" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 overflow-hidden rounded-3xl gold-border bg-card/60 backdrop-blur-md"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative hidden lg:block">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(/products/gallery-3.png)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card" />
              <div className="absolute bottom-8 left-8 right-8">
                <Sparkles className="mb-3 h-8 w-8 text-gold animate-glow" />
                <h3 className={`font-serif-lux text-2xl font-bold text-gold-light ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {lang === 'ta' ? 'உங்கள் கனவு நகையை உருவாக்குங்கள்' : 'Craft your dream jewellery'}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">
                  {lang === 'ta'
                    ? 'எங்கள் நிபுணர்கள் உங்கள் வடிவமைப்பை நிஜமாக்குவார்கள்.'
                    : 'Our master craftsmen bring your design to life.'}
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="p-8">
              {!user && (
                <div className="mb-4 rounded-xl border border-gold/40 bg-gold/10 p-3 text-xs text-gold-light">
                  {lang === 'ta' ? 'கோரிக்கை அனுப்ப உள்நுழையவும். உங்கள் விவரங்கள் தானாக இணைக்கப்படும்.' : 'Please login to submit. Your details will be auto-filled from your profile.'}
                </div>
              )}

              {user && (
                <div className="mb-4 rounded-xl glass p-3">
                  <p className="text-[10px] uppercase tracking-wider text-foreground/50">{lang === 'ta' ? 'உங்கள் விவரம்' : 'Your Details'}</p>
                  <p className="text-sm font-semibold text-foreground/90">{user.name}</p>
                  <p className="text-xs text-foreground/60">{user.phone} {user.email ? `· ${user.email}` : ''}</p>
                  {(user as any).address && <p className="text-xs text-foreground/50">{(user as any).address}, {(user as any).city} - {(user as any).pincode}</p>}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-medium uppercase tracking-wider text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                    {lang === 'ta' ? 'மெட்டீரியல்' : 'Material'}
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['Gold', 'Silver', 'Rose Gold', 'Diamond', 'Platinum', 'Brass'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMaterial(m)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                          material === m
                            ? 'btn-gold border-transparent'
                            : 'border-gold/30 text-foreground/70 hover:border-gold hover:text-gold'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`flex justify-between text-xs font-medium uppercase tracking-wider text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                    <span>{lang === 'ta' ? 'பட்ஜெட்' : 'Budget'}</span>
                    <span className="text-gold-light">₹{budget.toLocaleString('en-IN')}</span>
                  </label>
                  <input
                    type="range"
                    min={10000}
                    max={1000000}
                    step={10000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--gold)]"
                  />
                </div>

                <div>
                  <label className={`text-xs font-medium uppercase tracking-wider text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                    {lang === 'ta' ? 'உங்கள் வடிவமைப்பு விளக்கம்' : 'Describe your design'}
                  </label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                    rows={3}
                    placeholder={lang === 'ta' ? 'உங்கள் கனவு நகையை விவரிக்கவும்...' : 'Describe your dream jewellery...'}
                    className={`mt-2 w-full rounded-xl border border-gold/30 bg-background/50 p-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40 ${lang === 'ta' ? 'font-tamil' : ''}`}
                  />
                </div>

                {/* Multi-file upload (images + PDF) */}
                <div>
                  <label className={`text-xs font-medium uppercase tracking-wider text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                    {lang === 'ta' ? 'வடிவமைப்பு கோப்புகள் (PNG, JPG, PDF)' : 'Design Files (PNG, JPG, PDF)'}
                  </label>
                  <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gold/40 p-4 transition-colors hover:border-gold hover:bg-gold/5">
                    <Upload className="h-5 w-5 text-gold" />
                    <span className="text-xs text-foreground/60">
                      {uploading
                        ? (lang === 'ta' ? 'பதிவேற்றுகிறது...' : 'Uploading...')
                        : (lang === 'ta' ? 'படங்கள் அல்லது PDF தேர்வு செய்ய கிளிக் செய்யவும்' : 'Click to select images or PDF')}
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                      multiple
                      onChange={handleUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded files preview */}
                  {files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {files.map((f, i) => (
                        <div key={i} className="relative">
                          {f.type === 'application/pdf' ? (
                            <a href={f.url} target="_blank" rel="noopener noreferrer" className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-gold/30 bg-background/50 p-2 text-center">
                              <FileIcon className="h-6 w-6 text-gold" />
                              <span className="mt-1 truncate text-[8px] text-foreground/60">{f.name}</span>
                            </a>
                          ) : (
                            <img src={f.url} alt={f.name} className="h-20 w-20 rounded-lg object-cover ring-1 ring-gold/30" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-gold w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
                  disabled={submitted || uploading}
                >
                  {submitted
                    ? (lang === 'ta' ? '✓ அனுப்பப்பட்டது!' : '✓ Request Sent!')
                    : (lang === 'ta' ? 'கோரிக்கை அனுப்பு' : 'Get Free Quote')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
