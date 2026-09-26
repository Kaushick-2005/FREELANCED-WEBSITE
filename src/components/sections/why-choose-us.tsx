'use client';

import { motion } from 'framer-motion';
import { Clock, BadgeCheck, ShieldCheck, Crown, Wrench, IndianRupee, Smile, Gem, Lock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { SectionTitle } from './about';

export function WhyChooseUs() {
  const { lang } = useStore();
  const t = translations[lang];

  const items = [
    { icon: Clock, title: 'Since 1991', ta: '1991 முதல்' },
    { icon: BadgeCheck, title: 'BIS 916 Hallmark Gold', ta: 'BIS 916 ஹால்மார்க் தங்கம்' },
    { icon: ShieldCheck, title: 'Trusted Jewellery Store', ta: 'நம்பிக்கையான நகைக்கடை' },
    { icon: Crown, title: 'Premium Designs', ta: 'பிரீமியம் வடிவமைப்புகள்' },
    { icon: Wrench, title: 'Customized Jewellery', ta: 'தனிப்பயன் நகைகள்' },
    { icon: IndianRupee, title: 'Best Price', ta: 'சிறந்த விலை' },
    { icon: Smile, title: 'Customer Satisfaction', ta: 'வாடிக்கையாளர் திருப்தி' },
    { icon: Gem, title: 'Modern Collections', ta: 'நவீன தொகுப்புகள்' },
    { icon: Lock, title: 'Secure Purchase', ta: 'பாதுகாப்பான கொள்முதல்' },
  ];

  return (
    <section id="why-choose-us" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'நம்பிக்கை' : 'Trust'}
          title={t.whyChooseUs}
          subtitle={lang === 'ta' ? 'ஏன் எங்களை தேர்வு செய்ய வேண்டும்' : 'Why customers choose Rameez Jewellerz'}
          tamil={lang === 'ta'}
        />

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="card-luxury group relative overflow-hidden rounded-2xl glass p-6 text-center"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-rosegold/10 text-gold ring-1 ring-gold/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:ring-gold/60">
                <it.icon className="h-8 w-8" />
              </div>
              <h3 className={`text-sm font-semibold text-foreground/90 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                {lang === 'ta' ? it.ta : it.title}
              </h3>
              <div className="mt-2 text-gold/40">
                <BadgeCheck className="mx-auto h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
