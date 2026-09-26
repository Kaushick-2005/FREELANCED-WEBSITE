'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, Lock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { SectionTitle } from './about';
import { useToast } from '@/hooks/use-toast';

const WHATSAPP = '919000000000';
const PHONE = '+919000000000';

export function Contact() {
  const { lang, user, setLoginOpen } = useStore();
  const t = translations[lang];
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: lang === 'ta' ? 'உள்நுழைய வேண்டும்' : 'Login required', variant: 'destructive' });
      setLoginOpen(true);
      return;
    }
    if (!message.trim()) {
      toast({ title: lang === 'ta' ? 'செய்தி உள்ளிடவும்' : 'Please enter a message', variant: 'destructive' });
      return;
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          email: user.email,
          message: message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        toast({
          title: lang === 'ta' ? 'செய்தி அனுப்பப்பட்டது!' : 'Message sent!',
          description: lang === 'ta' ? 'விரைவில் தொடர்பு கொள்கிறோம்.' : 'We will get back to you soon.',
        });
        setMessage('');
        setTimeout(() => setSent(false), 4000);
      } else {
        toast({ title: 'Error', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    }
  };

  const info = [
    {
      icon: MapPin,
      label: t.location,
      value: 'No. 42, Main Road, Valliyur, Tirunelveli District, Tamil Nadu 627117',
      href: 'https://maps.google.com/?q=Valliyur,Tirunelveli',
      ta: 'வள்ளியூர், திருநெல்வேலி',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 90000 00000',
      href: `tel:${PHONE}`,
      ta: 'தொலைபேசி',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+91 90000 00000',
      href: `https://wa.me/${WHATSAPP}`,
      ta: 'வாட்ஸ்அப்',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'care@rameezjewellerz.com',
      href: 'mailto:care@rameezjewellerz.com',
      ta: 'மின்னஞ்சல்',
    },
    {
      icon: Clock,
      label: t.businessHours,
      value: 'Mon – Sun: 9:30 AM – 8:30 PM',
      ta: 'வியாபார நேரம்',
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'தொடர்பு' : 'Contact'}
          title={t.contactUs}
          subtitle={lang === 'ta' ? 'எங்களை தொடர்பு கொள்ளவும்' : "We'd love to hear from you"}
          tamil={lang === 'ta'}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Contact info + map */}
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {info.map((it, i) => (
                <motion.a
                  key={i}
                  href={it.href}
                  target={it.href?.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="card-luxury group flex items-start gap-3 rounded-2xl glass p-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-rosegold/10 text-gold ring-1 ring-gold/30 transition-transform group-hover:scale-110">
                    <it.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[11px] uppercase tracking-wider text-foreground/50 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      {lang === 'ta' ? it.ta : it.label}
                    </p>
                    <p className="text-sm font-medium text-foreground/85 break-words">{it.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-2xl gold-border"
            >
              <iframe
                title="Rameez Jewellerz Location"
                src="https://www.google.com/maps?q=Valliyur,Tirunelveli,Tamil+Nadu&output=embed"
                className="h-64 w-full grayscale-[0.3] invert-[0.92] hue-rotate-180"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl glass-gold p-6 md:p-8"
          >
            <h3 className={`font-serif-lux text-2xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {t.sendMessage}
            </h3>

            {user ? (
              <>
                <div className="mt-3 rounded-xl glass p-3">
                  <p className="text-[10px] uppercase tracking-wider text-foreground/50">{lang === 'ta' ? 'உங்கள் விவரம்' : 'Your Details'}</p>
                  <p className="text-sm font-semibold text-foreground/90">{user.name}</p>
                  <p className="text-xs text-foreground/60">{user.phone} {user.email ? `· ${user.email}` : ''}</p>
                </div>
                <form onSubmit={submit} className="mt-4 space-y-4">
                  <div>
                    <label className={`text-xs font-medium uppercase tracking-wider text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                      {t.yourMessage}
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      className={`mt-2 w-full rounded-xl border border-gold/30 bg-background/50 p-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40 ${lang === 'ta' ? 'font-tamil' : ''}`}
                      placeholder={lang === 'ta' ? 'உங்கள் செய்தி...' : 'Your message...'}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sent}
                    className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
                  >
                    {sent ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        {lang === 'ta' ? 'அனுப்பப்பட்டது!' : 'Sent!'}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span className={lang === 'ta' ? 'font-tamil' : ''}>{t.sendMessage}</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="mt-4 flex flex-col items-center gap-3 py-8 text-center">
                <Lock className="h-10 w-10 text-gold/40" />
                <p className={`text-sm text-foreground/60 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                  {lang === 'ta' ? 'செய்தி அனுப்ப உள்நுழையவும். உங்கள் விவரங்கள் தானாக இணைக்கப்படும்.' : 'Please login to send a message. Your details will be auto-filled from your profile.'}
                </p>
                <button
                  onClick={() => setLoginOpen(true)}
                  className="btn-gold rounded-full px-6 py-2.5 text-sm font-semibold"
                >
                  {t.login}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
