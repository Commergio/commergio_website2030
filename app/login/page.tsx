'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, CircleAlert as AlertCircle, Loader } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';

const ADMIN_EMAIL = 'info@commergio.com';
const IS_SUPABASE_CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { pick, isRTL } = useI18n();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!IS_SUPABASE_CONFIGURED) {
    setError(
      pick(
        'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.',
        'إعدادات Supabase غير مكتملة. أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY في ملف .env.local.'
      )
    );
    return;
  }

  if (!email.trim()) { setError(pick('Email is required.', 'البريد الإلكتروني مطلوب.')); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(pick('Enter a valid email address.', 'أدخل بريدًا إلكترونيًا صالحًا.')); return; }
  if (!password) { setError(pick('Password is required.', 'كلمة المرور مطلوبة.')); return; }
  if (password.length < 6) { setError(pick('Password must be at least 6 characters.', 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.')); return; }

  setLoading(true);

  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password.trim()
  });

  setLoading(false);

  if (authError) {
    setError(authError.message);
    return;
  }

  const userEmail = data?.user?.email?.toLowerCase() ?? '';
  if (userEmail !== ADMIN_EMAIL.toLowerCase()) {
    await supabase.auth.signOut();
    setError(pick('You are not authorized to access the admin panel.', 'غير مصرح لك بدخول لوحة التحكم.'));
    return;
  }

  // ✅ هذا السطر هو المهم
  window.location.href = '/admin';
};



  const inputCls = `w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200 ${
    isLight
      ? 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10'
      : 'bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-brand-orange/50 focus:bg-white/8'
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-16 ${isLight ? 'bg-gray-50' : 'bg-[#050d1a]'}`}>
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f5a623 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrandLogo size={48} />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.04)',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: isLight ? '0 4px 40px rgba(0,0,0,0.08)' : '0 4px 40px rgba(0,0,0,0.4)',
          }}
        >
          <div className="mb-7">
            <h1 className={`text-2xl font-bold mb-1 ${isLight ? 'text-gray-900' : 'text-white'}`} style={{ letterSpacing: '-0.02em' }}>
              {pick('Admin Sign In', 'تسجيل دخول الإدارة')}
            </h1>
            <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>
              {pick('Authorized personnel only.', 'للمخولين فقط.')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
                {pick('Email address', 'البريد الإلكتروني')}
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder={pick('you@commergio.com', 'you@example.com')}
                  className={inputCls}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
                {pick('Password', 'كلمة المرور')}
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className={`${inputCls} pr-10`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/8 border border-red-500/20">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 justify-center"
            >
              {loading ? <Loader size={15} className="animate-spin" /> : null}
              {loading ? pick('Signing in…', 'جارٍ تسجيل الدخول…') : pick('Sign In', 'تسجيل الدخول')}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className={`text-center text-xs mt-6 ${isLight ? 'text-gray-400' : 'text-slate-500'}`}>
          <Link href="/" className="hover:text-brand-orange transition-colors">
            {pick('← Back to website', 'العودة للموقع ←')}
          </Link>
        </p>
      </div>
    </div>
  );
}
