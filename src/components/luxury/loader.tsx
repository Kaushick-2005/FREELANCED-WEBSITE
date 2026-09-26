'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';

type P = { left: number; size: number; dur: number; delay: number };

export function Loader() {
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState<P[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setParticles(
        Array.from({ length: 20 }).map(() => ({
          left: Math.random() * 100,
          size: 2 + Math.random() * 4,
          dur: 4 + Math.random() * 6,
          delay: Math.random() * 4,
        }))
      );
    });
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center marble-bg"
        >
          {/* gold particles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  background: 'radial-gradient(circle, #f5e6a8, #d4af37)',
                  animation: `particle-float ${p.dur}s linear ${p.delay}s infinite`,
                  boxShadow: '0 0 8px #d4af37',
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo size={90} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 font-serif-lux text-3xl md:text-4xl text-gold-gradient tracking-wider"
          >
            RAMEEZ JEWELLERZ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-2 font-tamil text-sm md:text-base text-gold-light/80 tracking-wide"
          >
            ரமீஸ் ஜுவெல்லர்ஸ்
          </motion.p>

          {/* loading bar */}
          <div className="mt-8 h-[3px] w-48 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/2 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #f5e6a8, #d4af37, #f5e6a8, transparent)',
              }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 text-[11px] tracking-[0.35em] text-gold-light/60 uppercase"
          >
            Crafting Luxury Since 1991
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
