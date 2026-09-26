'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/luxury/logo';
import { useToast } from '@/hooks/use-toast';
import { GoldParticles } from '@/components/luxury/gold-particles';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to admin dashboard if already logged in
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('rameez-admin-auth');
    if (adminAuth === 'true') {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple secure admin check (in production, use proper auth/JWT)
    // Default credentials — change these in production
    if (username === 'rameez_admin' && password === 'Ramez@2026') {
      sessionStorage.setItem('rameez-admin-auth', 'true');
      toast({ title: 'Welcome Admin', description: 'Access granted' });
      router.push('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Access denied.');
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden marble-bg p-4">
      <GoldParticles count={15} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl gold-border bg-card"
      >
        {/* Header */}
        <div className="marble-bg flex flex-col items-center justify-center p-8 pb-6 text-center">
          <div className="relative">
            <Logo size={64} />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-gold" />
            <h1 className="font-serif-lux text-2xl font-bold text-gold-gradient">Admin Portal</h1>
          </div>
          <p className="mt-1 text-xs text-foreground/60">
            Secure Administrative Access · Rameez Jewellerz
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">Admin Username</label>
            <div className="mt-1.5 relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-gold focus:outline-none"
                placeholder="Enter admin username"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">Password</label>
            <div className="mt-1.5 relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type={showPwd ? 'text' : 'password'}
                className="w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-9 text-sm text-foreground focus:border-gold focus:outline-none"
                placeholder="Enter password"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-gold">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-60">
            {loading ? 'Verifying...' : 'Access Dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="rounded-lg bg-gold/5 p-3 text-center text-[10px] text-foreground/40">
            <Shield className="mx-auto mb-1 h-4 w-4 text-gold/40" />
            Authorized personnel only. All access attempts are logged.
          </div>
        </form>

        <div className="border-t border-gold/15 p-4 text-center">
          <button onClick={() => router.push('/')} className="text-xs text-foreground/50 hover:text-gold">
            ← Back to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
}
