'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  showShine = true,
  size = 48,
}: {
  className?: string;
  showShine?: boolean;
  size?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative inline-flex items-center', className)}
      style={{ width: size * 1.5, height: size }}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-500 hover:scale-110 hover:rotate-3 cursor-pointer',
          showShine && 'logo-shine animate-glow'
        )}
        style={{ filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.45))' }}
      >
        <Image
          src="/rz-logo.png"
          alt="Rameez Jewellerz Logo"
          fill
          className="object-contain"
          priority
          sizes={`${size * 1.5}px`}
        />
      </div>
    </motion.div>
  );
}
