'use client';

import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

const WHATSAPP = '919000000000';
const MESSAGE = encodeURIComponent(
  'Hello Rameez Jewellerz! I would like to know more about your jewellery collections.'
);

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1.4, type: 'spring', stiffness: 200, damping: 15 }}
      className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3"
    >
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-dark w-64 rounded-2xl border border-gold/30 p-4 shadow-2xl"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-gold-light">Chat with us</span>
            <button onClick={() => setOpen(false)} className="text-gold-light/60 hover:text-gold">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mb-3 text-xs text-foreground/70">
            Hi! 👋 How can we help you find the perfect jewellery today?
          </p>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
          >
            <MessageCircle className="h-4 w-4" />
            Start WhatsApp Chat
          </a>
        </motion.div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/50" />
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </motion.div>
  );
}
