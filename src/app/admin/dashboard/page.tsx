'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/luxury/logo';
import { AdminDashboardContent } from '@/components/luxury/admin-dashboard-content';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const adminAuth = sessionStorage.getItem('rameez-admin-auth');
      if (adminAuth === 'true') {
        setAuthed(true);
      } else {
        router.replace('/admin');
      }
    });
  }, [router]);

  const logout = () => {
    sessionStorage.removeItem('rameez-admin-auth');
    router.push('/admin');
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center marble-bg">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen marble-bg">
      <header className="sticky top-0 z-50 border-b border-gold/20 glass-dark">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div>
              <h1 className="font-serif-lux text-lg font-bold text-gold-gradient">Admin Dashboard</h1>
              <p className="text-[10px] uppercase tracking-wider text-foreground/50">Rameez Jewellerz · Secure Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open('/', '_blank')}
              className="flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1.5 text-xs font-medium text-gold-light transition-all hover:bg-gold/15"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Site
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <AdminDashboardContent />
      </main>
    </div>
  );
}
