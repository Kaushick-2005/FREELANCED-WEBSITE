'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, Mail, Phone, MapPin, Lock, LogOut, Edit2, Check, KeyRound } from 'lucide-react';
import { useStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function UserProfileModal() {
  const { user, setUser, lang } = useStore();
  const t = translations[lang];
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', pincode: '',
  });
  const [pwdForm, setPwdForm] = useState({ newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const onOpenProfile = () => { setOpen(true); };
    window.addEventListener('open-user-profile', onOpenProfile);
    return () => window.removeEventListener('open-user-profile', onOpenProfile);
  }, []);

  useEffect(() => {
    if (!open || !user) return;
    queueMicrotask(() => {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: (user as any).address || '',
        city: (user as any).city || '',
        pincode: (user as any).pincode || '',
      });
      setEditing(false);
      setChangingPwd(false);
    });
  }, [open, user]);

  if (!user) return null;

  const saveProfile = async () => {
    if (!form.name || !form.email || !form.phone) {
      toast({ title: lang === 'ta' ? 'பெயர், மின்னஞ்சல், தொலைபேசி தேவை' : 'Name, email, phone are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.message || data.error || 'Error', variant: 'destructive' });
        setSaving(false);
        return;
      }
      setUser({ ...user, name: data.user.name, email: data.user.email, phone: data.user.phone, address: data.user.address, city: data.user.city, pincode: data.user.pincode } as any);
      setEditing(false);
      toast({ title: lang === 'ta' ? 'விவரம் புதுப்பிக்கப்பட்டது' : 'Profile updated successfully' });
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    }
    setSaving(false);
  };

  const changePassword = async () => {
    if (!pwdForm.newPassword || pwdForm.newPassword.length < 6) {
      toast({ title: lang === 'ta' ? 'கடவாய் குறைந்தது 6 எழுத்துகள்' : 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast({ title: lang === 'ta' ? 'கடவாய் பொருந்தவில்லை' : 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, newPassword: pwdForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || 'Error', variant: 'destructive' });
        setSaving(false);
        return;
      }
      toast({ title: lang === 'ta' ? 'கடவாய் மாற்றப்பட்டது' : 'Password changed successfully' });
      setChangingPwd(false);
      setPwdForm({ newPassword: '', confirmPassword: '' });
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl gold-border bg-card"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-gold-light hover:bg-gold hover:text-royal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="marble-bg flex items-center gap-4 p-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark font-serif-lux text-2xl font-bold text-royal">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-serif-lux text-xl font-bold text-gold-gradient">{user.name}</h2>
                <p className="truncate text-xs text-foreground/60">{user.email}</p>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-lux text-lg font-bold text-gold-light">
                  {lang === 'ta' ? 'தனிப்பட்ட விவரங்கள்' : 'Personal Details'}
                </h3>
                {!editing && !changingPwd && (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-gold hover:underline">
                    <Edit2 className="h-3.5 w-3.5" /> {lang === 'ta' ? 'திருத்து' : 'Edit'}
                  </button>
                )}
              </div>

              {/* Profile fields */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field icon={UserIcon} label={lang === 'ta' ? 'பெயர்' : 'Name'} value={form.name} editing={editing} onChange={(v) => setForm({ ...form, name: v })} />
                <Field icon={Mail} label={lang === 'ta' ? 'மின்னஞ்சல்' : 'Email'} value={form.email} editing={editing} onChange={(v) => setForm({ ...form, email: v })} />
                <Field icon={Phone} label={lang === 'ta' ? 'தொலைபேசி' : 'Phone'} value={form.phone} editing={editing} onChange={(v) => setForm({ ...form, phone: v })} />
                <Field icon={MapPin} label={lang === 'ta' ? 'பின்கோட்' : 'Pincode'} value={form.pincode} editing={editing} onChange={(v) => setForm({ ...form, pincode: v })} />
                <div className="sm:col-span-2">
                  <Field icon={MapPin} label={lang === 'ta' ? 'முகவரி' : 'Address'} value={form.address} editing={editing} onChange={(v) => setForm({ ...form, address: v })} />
                </div>
                <Field icon={MapPin} label={lang === 'ta' ? 'நகரம்' : 'City'} value={form.city} editing={editing} onChange={(v) => setForm({ ...form, city: v })} />
              </div>

              {editing && (
                <div className="mt-4 flex gap-2">
                  <button onClick={saveProfile} disabled={saving} className="btn-gold flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
                    <Check className="h-4 w-4" /> {saving ? '...' : (lang === 'ta' ? 'சேமி' : 'Save')}
                  </button>
                  <button onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email, phone: user.phone, address: (user as any).address || '', city: (user as any).city || '', pincode: (user as any).pincode || '' }); }} className="rounded-xl border border-gold/30 px-5 py-2.5 text-sm text-foreground/70 hover:bg-gold/10">
                    {lang === 'ta' ? 'ரத்து' : 'Cancel'}
                  </button>
                </div>
              )}

              {/* Change password section */}
              <div className="mt-6 border-t border-gold/15 pt-4">
                {!changingPwd ? (
                  <button onClick={() => setChangingPwd(true)} className="flex items-center gap-2 text-sm font-medium text-gold hover:underline">
                    <KeyRound className="h-4 w-4" />
                    {lang === 'ta' ? 'கடவாய் மாற்று' : 'Change Password'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gold-light">
                      <KeyRound className="h-4 w-4" />
                      {lang === 'ta' ? 'கடவாய் மாற்று' : 'Change Password'}
                    </h4>
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">{lang === 'ta' ? 'புதிய கடவாய்' : 'New Password'}</label>
                      <div className="mt-1.5 relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                        <input type="password" value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} className="w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-gold focus:outline-none" placeholder="Min 6 characters" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">{lang === 'ta' ? 'கடவாய் உறுதிப்படுத்து' : 'Confirm Password'}</label>
                      <div className="mt-1.5 relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                        <input type="password" value={pwdForm.confirmPassword} onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} className="w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-gold focus:outline-none" placeholder="Re-enter password" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={changePassword} disabled={saving} className="btn-gold flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
                        <Check className="h-4 w-4" /> {saving ? '...' : (lang === 'ta' ? 'மாற்று' : 'Update')}
                      </button>
                      <button onClick={() => { setChangingPwd(false); setPwdForm({ newPassword: '', confirmPassword: '' }); }} className="rounded-xl border border-gold/30 px-5 py-2.5 text-sm text-foreground/70 hover:bg-gold/10">
                        {lang === 'ta' ? 'ரத்து' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={() => { setOpen(false); setUser(null); toast({ title: lang === 'ta' ? 'வெளியேறியது' : 'Logged out' }); }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" /> {lang === 'ta' ? 'வெளியேறு' : 'Logout'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ icon: Icon, label, value, editing, onChange }: { icon: any; label: string; value: string; editing: boolean; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-foreground/60">{label}</label>
      <div className="mt-1.5 relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 text-foreground/40" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!editing}
          className={cn(
            'w-full rounded-xl border border-gold/30 bg-background/50 py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-gold focus:outline-none',
            !editing && 'opacity-70'
          )}
        />
      </div>
    </div>
  );
}
