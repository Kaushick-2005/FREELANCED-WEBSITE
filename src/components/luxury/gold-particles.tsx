'use client';

import { useState, useEffect } from 'react';

type Particle = { left: number; size: number; delay: number; duration: number; drift: number };

export function GoldParticles({ count = 25 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setParticles(
        Array.from({ length: count }).map(() => ({
          left: Math.random() * 100,
          size: 2 + Math.random() * 4,
          delay: Math.random() * 8,
          duration: 8 + Math.random() * 12,
          drift: (Math.random() - 0.5) * 40,
        }))
      );
    });
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'radial-gradient(circle, #f5e6a8 0%, #d4af37 60%, transparent 100%)',
            boxShadow: '0 0 8px #d4af37, 0 0 16px rgba(212,175,55,0.4)',
            animation: `particle-float ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
