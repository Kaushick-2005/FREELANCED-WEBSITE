'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Phone, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Logo } from './logo';

type Mode = 'login' | 'register';

export function AuthModal() {
  const { loginOpen, setLoginOpen, setUser, lang } = useStore();
  const t = translations[lang];
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>('login');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setMode('login');
    setName(''); setEmail(''); setPhone(''); setPassword('');
    setError('');
  };

  const close = () => {
    setLoginOpen(false);
    setTimeout(reset, 300);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone || !password) {
      setError(lang === 'ta' ? 'அனைத்து புலங்களையும் நிரப்பவும்' : 'Please fill all fields');
      return;
    }
    if (password.length < 6) {
      setError(lang === 'ta' ? 'கடவாய் குறைந்தது 6 எழுத்துகள்' : 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'already_used') {
          setError(data.message);
        } else {
          setError(data.error || 'Registration failed');
        }
        setLoading(false);
        return;
      }
      // Account created directly (no OTP)
      setUser(data.user);
      toast({ title: lang === 'ta' ? 'வரவேற்கிறோம்!' : 'Welcome!', description: data.user.name });
      close();
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError(lang === 'ta' ? 'அனைத்து புலங்களையும் நிரப்பவும்' : 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      setUser(data.user);
      toast({ title: lang === 'ta' ? 'உள்நுழைந்தது!' : 'Logged in!', description: data.user.name });
      close();
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {loginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={close} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl gold-border bg-card"
          >
            <button
              onClick={close}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-gold-light hover:bg-gold hover:text-royal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="marble-bg flex flex-col items-center justify-center p-8 pb-6 text-center">
              <Logo size={56} />
              <h2 className={`mt-4 font-serif-lux text-2xl font-bold text-gold-gradient ${lang === 'ta' ? 'font-tamil' : ''}`}>
                {mode === 'login' ? (lang === 'ta' ? 'உள்நுழைய' : 'Welcome Back')
                  : (lang === 'ta' ? 'பதிவு செய்ய' : 'Create Account')}
              </h2>
              <p className="mt-1 text-xs text-foreground/60">
                {mode === 'login' ? (lang === 'ta' ? 'ரமீஸ் ஜுவெல்லர்ஸ் கணக்கிற்கு உள்நுழையவும்' : 'Sign in to your Rameez Jewellerz account')
                  : (lang === 'ta' ? 'புதிய கணக்கை உருவாக்கவும்' : 'Register for a new account')}
              </p>
            </div>

            <div className="p-6">
              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Login mode */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                      {lang === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
                    </label>
                    <div className="mt-1.5 relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-gold focus:outline-none"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                      {lang === 'ta' ? 'கடவாய்' : 'Password'}
                    </label>
                    <div className="mt-1.5 relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPwd ? 'text' : 'password'}
                        className="w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-9 text-sm text-foreground focus:border-gold focus:outline-none"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-gold">
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-gold w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60">
                    {loading ? '...' : (lang === 'ta' ? 'உள்நுழை' : 'Sign In')}
                  </button>
                  <p className="text-center text-xs text-foreground/40">
                    {lang === 'ta' ? 'புதிய வாடிக்கையாளரா? ' : 'New customer? '}
                    <button type="button" onClick={() => { setMode('register'); setError(''); }} className="font-semibold text-gold hover:underline">
                      {lang === 'ta' ? 'பதிவு செய்யவும்' : 'Register here'}
                    </button>
                  </p>
                </form>
              )}

              {/* Register mode */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                      {lang === 'ta' ? 'பெயர்' : 'Full Name'}
                    </label>
                    <div className="mt-1.5 relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-gold focus:outline-none" placeholder="Your name" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                      {lang === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
                    </label>
                    <div className="mt-1.5 relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-gold focus:outline-none" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                      {lang === 'ta' ? 'தொலைபேசி' : 'Phone'}
                    </label>
                    <div className="mt-1.5 relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-gold focus:outline-none" placeholder="+91 90000 00000" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                      {lang === 'ta' ? 'கடவாய்' : 'Password'}
                    </label>
                    <div className="mt-1.5 relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                      <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPwd ? 'text' : 'password'} className="w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-9 text-sm text-foreground focus:border-gold focus:outline-none" placeholder="Min 6 characters" />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-gold">
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-gold w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60">
                    {loading ? '...' : (lang === 'ta' ? 'பதிவு செய்' : 'Register')}
                  </button>
                  <p className="text-center text-xs text-foreground/40">
                    {lang === 'ta' ? 'ஏற்கனவே கணக்கு உள்ளதா? ' : 'Already have an account? '}
                    <button type="button" onClick={() => { setMode('login'); setError(''); }} className="font-semibold text-gold hover:underline">
                      {lang === 'ta' ? 'உள்நுழை' : 'Sign In'}
                    </button>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
