'use client';

import { motion } from 'framer-motion';
import { Award, Gem, HandHeart, Sparkles, ShieldCheck, Crown } from 'lucide-react';
import { useStore } from '@/lib/store';

const TA_POINTS = [
  'ரமீஸ் ஜுவெல்லர்ஸ் – திருநெல்வேலி வள்ளியூரின் இதயத்தில் அமைந்துள்ள நம்பிக்கைக்குரிய நகைக்கடை.',
  'Since 1991, BIS 916 Hallmark தரத்துடன் வாடிக்கையாளர்களின் நம்பிக்கையை பெற்ற நிறுவனம்.',
  'தங்கம், வெள்ளி மற்றும் வைர நகைகளில் சிறந்த வடிவமைப்புகளையும், வாடிக்கையாளர்களின் விருப்பத்திற்கேற்ற தனிப்பயன் (Customized) நகைகளையும் வழங்கி வருகிறோம்.',
  'பாரம்பரிய கைவினைத்திறனையும் நவீன வடிவமைப்புகளையும் இணைத்து ஒவ்வொரு நகையையும் சிறந்த தரத்தில் உருவாக்குகிறோம்.',
  'வாடிக்கையாளர் திருப்தி, தரம் மற்றும் நம்பிக்கையே எங்கள் முதன்மை.',
  'நாங்கள் தரமான தங்கம், வெள்ளி மற்றும் நவீன நகை வடிவமைப்புகளில் சிறந்த சேவையை வழங்கி வருகிறோம்.',
  'உங்கள் விருப்பத்திற்கு ஏற்ப Customized Jewellery Design வசதியும் உள்ளது.',
  'பாரம்பரியம், நம்பிக்கை மற்றும் தரம் என்பவற்றை அடிப்படையாகக் கொண்டு ஒவ்வொரு நகையும் உருவாக்கப்படுகிறது.',
  'உங்கள் சிறப்பு தருணங்களை மேலும் அழகாக்கும் நகைகளை சிறந்த விலையில் வழங்குவதே எங்கள் நோக்கம்.',
];

const EN_POINTS = [
  'Rameez Jewellerz — a trusted jewellery house in the heart of Valliyur, Tirunelveli.',
  'Since 1991, we have earned our customers\' trust with BIS 916 Hallmark quality.',
  'We offer finest designs in Gold, Silver and Diamond jewellery, plus custom-made pieces tailored to your wishes.',
  'Blending traditional craftsmanship with modern design, every piece is crafted to the highest standard.',
  'Customer satisfaction, quality and trust are our top priorities.',
  'We deliver outstanding service in quality gold, silver and contemporary jewellery design.',
  'Customized Jewellery Design is available to suit your preference.',
  'Every piece is created on the foundation of heritage, trust and quality.',
  'Our mission: to make your special moments even more beautiful with exquisite jewellery at the best price.',
];

const ICONS = [Crown, Award, Gem, HandHeart, ShieldCheck, Sparkles, Gem, Crown, HandHeart];

export function About() {
  const { lang } = useStore();
  const points = lang === 'ta' ? TA_POINTS : EN_POINTS;

  return (
    <section id="about" className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(/products/about-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-royal via-royal/90 to-royal" />
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-rosegold/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <SectionTitle
          kicker={lang === 'ta' ? 'எங்களை பற்றி' : 'About Us'}
          title={lang === 'ta' ? 'ரமீஸ் ஜுவெல்லர்ஸ்' : 'About Rameez Jewellerz'}
          subtitle={
            lang === 'ta'
              ? 'நம்பிக்கை, தரம் மற்றும் பாரம்பரியத்தின் சின்னம்'
              : 'A symbol of trust, quality and heritage'
          }
          tamil={lang === 'ta'}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="card-luxury group relative overflow-hidden rounded-2xl glass p-6"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/10 blur-2xl transition-all group-hover:bg-gold/25" />
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-light/20 to-gold-dark/20 text-gold ring-1 ring-gold/30 transition-transform group-hover:scale-110">
                {(() => {
                  const Icon = ICONS[i % ICONS.length];
                  return <Icon className="h-6 w-6" />;
                })()}
              </div>
              <p className={`text-sm leading-relaxed text-foreground/80 ${lang === 'ta' ? 'font-tamil' : ''}`}>
                {p}
              </p>
              <div className="mt-4 font-serif-lux text-3xl font-bold text-gold/30">
                {String(i + 1).padStart(2, '0')}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Heritage banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 overflow-hidden rounded-3xl gold-border bg-card/60 p-8 text-center backdrop-blur-md md:p-12"
        >
          <Crown className="mx-auto mb-4 h-10 w-10 text-gold animate-glow" />
          <p className={`mx-auto max-w-3xl font-serif-lux text-2xl italic text-gold-light md:text-3xl ${lang === 'ta' ? 'font-tamil' : ''}`}>
            {lang === 'ta'
              ? 'பாரம்பரியம், நம்பிக்கை மற்றும் தரம் — ஒவ்வொரு நகையிலும் ஒளிரும்.'
              : 'Heritage, Trust and Quality — shining in every piece.'}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-foreground/60">
            <span className="h-px w-8 bg-gold/50" />
            Est. 1991 · Valliyur · Tirunelveli
            <span className="h-px w-8 bg-gold/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function SectionTitle({
  kicker,
  title,
  subtitle,
  tamil,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  tamil?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
        <span className="h-px w-6 bg-gold/60" />
        {kicker}
        <span className="h-px w-6 bg-gold/60" />
      </div>
      <h2 className={`font-serif-lux text-4xl font-bold text-gold-gradient md:text-5xl ${tamil ? 'font-tamil' : ''}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base text-foreground/65 ${tamil ? 'font-tamil' : ''}`}>{subtitle}</p>
      )}
    </motion.div>
  );
}
