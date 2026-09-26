'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, Heart, Package, LogOut, ChevronDown, Settings } from 'lucide-react';
import { Logo } from './logo';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const NAV = [
  { key: 'home', href: '#home' },
  { key: 'about', href: '#about' },
  { key: 'whyChooseUs', href: '#why-choose-us' },
  { key: 'featured', href: '#featured' },
  { key: 'newArrivals', href: '#new-arrivals' },
  { key: 'bestSellers', href: '#best-sellers' },
  { key: 'offers', href: '#offers' },
  { key: 'liveGoldRate', href: '#gold-rate' },
  { key: 'customerReviews', href: '#reviews' },
  { key: 'customizedJewellery', href: '#customized' },
  { key: 'contact', href: '#contact' },
] as const;

export function Navbar() {
  const { lang, toggleLang, cartCount, setCartOpen, setLoginOpen, setMenuOpen, menuOpen, user, setUser, setWishlistOpen } = useStore();
  const t = translations[lang];
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Only show cart count after mount to avoid hydration mismatch
  const cartBadge = mounted ? cartCount() : 0;

  const go = (href: string, filter?: string) => {
    setMenuOpen(false);
    if (filter) {
      window.dispatchEvent(new CustomEvent('filter-collection', { detail: filter }));
    }
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled ? 'glass-dark shadow-lg shadow-black/40' : 'bg-royal/80 backdrop-blur-md'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
          {/* Logo left */}
          <button onClick={() => go('#home')} className="flex items-center gap-2 shrink-0">
            <Logo size={42} />
            <div className="hidden leading-none sm:block">
              <div className="font-serif-lux text-lg font-semibold text-gold-gradient tracking-wide">
                RAMEEZ
              </div>
              <div className="text-[9px] tracking-[0.3em] text-gold-light/70 uppercase">
                Jewellerz
              </div>
            </div>
          </button>

          {/* Desktop menu */}
          <div className="no-scrollbar hidden items-center gap-4 overflow-x-auto lg:flex">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => go(item.href, (item as any).filter)}
                className="nav-underline shrink-0 text-[13px] font-medium text-foreground/85 transition-colors hover:text-gold"
              >
                <span className={lang === 'ta' ? 'font-tamil' : ''}>{t[item.key]}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <IconBtn label="Language" onClick={toggleLang}>
              <span className="text-[11px] font-bold">{lang === 'ta' ? 'த' : 'EN'}</span>
            </IconBtn>
            <IconBtn label="Cart" onClick={() => setCartOpen(true)} badge={cartBadge} accent>
              <ShoppingBag className="h-[18px] w-[18px]" />
            </IconBtn>
            {user ? (
              <UserMenu />
            ) : (
              <IconBtn label="Login" onClick={() => setLoginOpen(true)} className="hidden sm:inline-flex">
                <User className="h-[18px] w-[18px]" />
              </IconBtn>
            )}
            <button
              className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="absolute right-0 top-0 h-full w-[80%] max-w-sm glass-dark p-6 pt-8 overflow-y-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo size={36} />
                <button onClick={() => setMenuOpen(false)} className="rounded-full p-2 text-gold">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {NAV.map((item, i) => (
                  <motion.button
                    key={item.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => go(item.href, (item as any).filter)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-left text-base text-foreground/90 transition-colors hover:bg-gold/10 hover:text-gold"
                  >
                    <span className={lang === 'ta' ? 'font-tamil' : ''}>{t[item.key]}</span>
                    <span className="text-gold/40">→</span>
                  </motion.button>
                ))}
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {user ? (
                    <>
                      <button
                        onClick={() => { setMenuOpen(false); setWishlistOpen(true); }}
                        className="btn-outline-gold flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm"
                      >
                        <Heart className="h-4 w-4" /> {t.wishlist}
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); window.dispatchEvent(new CustomEvent('open-user-orders')); }}
                        className="btn-outline-gold flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm"
                      >
                        <Package className="h-4 w-4" /> My Orders
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); setUser(null); }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-500/40 py-2.5 text-sm text-red-400"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setMenuOpen(false); setLoginOpen(true); }}
                      className="btn-gold rounded-xl py-2.5 text-sm"
                    >
                      {t.login}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  badge,
  accent,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: number;
  accent?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/85 transition-all hover:bg-gold/15 hover:text-gold hover:scale-105',
        accent && 'text-gold',
        className
      )}
    >
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark px-1 text-[10px] font-bold text-royal">
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </button>
  );
}

function UserMenu() {
  const { user, setUser, setWishlistOpen, lang } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-gold/40 px-2 py-1.5 text-xs font-medium text-gold-light transition-all hover:bg-gold/15"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark font-serif-lux text-base font-bold text-royal">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <ChevronDown className="h-3 w-3 shrink-0 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed right-2 top-16 z-50 w-[min(20rem,calc(100vw-1rem))] overflow-hidden rounded-2xl glass-dark shadow-2xl"
            >
              <div className="border-b border-gold/20 p-4">
                <p className="truncate text-sm font-semibold text-gold-light">{user?.name}</p>
                <p className="truncate text-xs text-foreground/50">{user?.email}</p>
                <p className="truncate text-xs text-foreground/50">{user?.phone}</p>
              </div>
              <div className="p-2">
                <MenuRow icon={Heart} label={lang === 'ta' ? 'விருப்பப்பட்டியல்' : 'My Wishlist'} onClick={() => { setOpen(false); setWishlistOpen(true); }} />
                <MenuRow icon={Package} label={lang === 'ta' ? 'என் ஆர்டர்கள்' : 'My Orders'} onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('open-user-orders')); }} />
                <MenuRow icon={Settings} label={lang === 'ta' ? 'தனிப்பட்ட விவரம்' : 'Personal Details'} onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('open-user-profile')); }} />
                <div className="my-1 h-px bg-gold/15" />
                <MenuRow icon={LogOut} label={lang === 'ta' ? 'வெளியேறு' : 'Logout'} danger onClick={() => { setOpen(false); setUser(null); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuRow({ icon: Icon, label, onClick, danger }: { icon: any; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
        danger ? 'text-red-400 hover:bg-red-500/10' : 'text-foreground/80 hover:bg-gold/10 hover:text-gold'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

