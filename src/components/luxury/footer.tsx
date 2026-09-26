'use client';

import { motion } from 'framer-motion';
import { Instagram, MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Logo } from './logo';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';

const WHATSAPP = '919000000000';

export function Footer() {
  const { lang } = useStore();
  const t = translations[lang];

  const quickLinks = [
    { label: t.home, href: '#home' },
    { label: t.about, href: '#about' },
    { label: t.featured, href: '#featured' },
    { label: t.gallery, href: '#gallery' },
    { label: t.contact, href: '#contact' },
  ];

  // Collection links — dispatch filter event + scroll to featured products
  const collections = [
    { label: t.gold, filter: 'Gold' },
    { label: t.silver, filter: 'Silver' },
    { label: t.roseGold, filter: 'Rose Gold' },
    { label: 'Diamond', filter: 'Diamond' },
    { label: t.wedding, filter: 'Wedding' },
  ];

  const support = [
    { label: 'FAQ', href: '#contact' },
    { label: t.privacyPolicy, href: '/privacy-policy' },
    { label: t.terms, href: '/terms' },
  ];

  const go = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const goCollection = (filter: string) => {
    window.dispatchEvent(new CustomEvent('filter-collection', { detail: filter }));
    document.querySelector('#featured')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goLink = (href: string) => {
    if (href.startsWith('/')) {
      window.location.assign(href);
    } else {
      go(href);
    }
  };

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-gold/20 bg-royal">
      {/* top glow */}
      <div className="divider-gold" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo size={56} />
            <p className="mt-4 font-serif-lux text-xl text-gold-gradient">Rameez Jewellerz</p>
            <p className="mt-1 font-tamil text-sm text-gold-light/80">
              ரமீஸ் ஜுவெல்லர்ஸ்
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">
              {lang === 'ta'
                ? 'ஒளிரும் அழகு, நிலைக்கும் மதிப்பு — 1991 முதல் நம்பிக்கையுடன்.'
                : 'Radiant Beauty, Enduring Value — Trusted since 1991.'}
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { icon: Instagram, href: 'https://instagram.com', color: 'hover:text-pink-400' },
                { icon: MessageCircle, href: `https://wa.me/${WHATSAPP}`, color: 'hover:text-emerald-400' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold-light/80 transition-all hover:scale-110 hover:border-gold ${s.color}`}
                >
                  <s.icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className={`mb-4 text-sm font-semibold uppercase tracking-wider text-gold ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {t.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => go(l.href)}
                    className="group flex items-center gap-2 text-sm text-foreground/65 transition-colors hover:text-gold"
                  >
                    <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
                    <span className={lang === 'ta' ? 'font-tamil' : ''}>{l.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections — filter products on click */}
          <div>
            <h4 className={`mb-4 text-sm font-semibold uppercase tracking-wider text-gold ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {t.ourCollections}
            </h4>
            <ul className="space-y-2.5">
              {collections.map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => goCollection(l.filter)}
                    className="group flex items-center gap-2 text-sm text-foreground/65 transition-colors hover:text-gold"
                  >
                    <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
                    <span className={lang === 'ta' ? 'font-tamil' : ''}>{l.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className={`mb-4 text-sm font-semibold uppercase tracking-wider text-gold ${lang === 'ta' ? 'font-tamil' : ''}`}>
              {t.customerSupport}
            </h4>
            <ul className="space-y-2.5">
              {support.map((l, i) => (
                <li key={i}>
                  <button
                    onClick={() => goLink(l.href)}
                    className="group flex items-center gap-2 text-sm text-foreground/65 transition-colors hover:text-gold"
                  >
                    <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
                    <span className={lang === 'ta' ? 'font-tamil' : ''}>{l.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* contact strip */}
        <div className="mt-10 grid grid-cols-1 gap-4 border-t border-gold/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <ContactItem icon={MapPin} label={t.location} value="Valliyur, Tirunelveli" />
          <ContactItem icon={Phone} label="Phone" value="+91 90000 00000" href="tel:+919000000000" />
          <ContactItem icon={Mail} label="Email" value="care@rameezjewellerz.com" href="mailto:care@rameezjewellerz.com" />
          <ContactItem icon={Clock} label={t.businessHours} value="9:30 AM – 8:30 PM" />
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gold/15 pt-6 text-center text-xs text-foreground/55 sm:flex-row sm:text-left">
          <p>
            © 2026 <span className="text-gold-light font-semibold">Rameez Jewellerz</span>. {t.rights}.
          </p>
          <p className="font-tamil text-gold-light/70">
            ரமீஸ் ஜுவெல்லர்ஸ் — ஒளிரும் அழகு, நிலைக்கும் மதிப்பு
          </p>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-foreground/50">{label}</p>
        <p className="text-sm text-foreground/85">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="transition-opacity hover:opacity-80">
      {content}
    </a>
  ) : (
    content
  );
}
