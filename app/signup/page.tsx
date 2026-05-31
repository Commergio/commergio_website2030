'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, CircleAlert as AlertCircle, CircleCheck, Loader } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { BRAND_LOGO_HEIGHT } from '@/lib/brand';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';

export default function SignupPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { pick, isRTL } = useI18n();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const validate = () => {
    if (!email.trim()) return pick('Email is required.', 'البريد الإلكتروني مطلوب.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return pick('Enter a valid email address.', 'أدخل بريدًا إلكترونيًا صالحًا.');
    if (!password) return pick('Password is required.', 'كلمة المرور مطلوبة.');
    if (password.length < 8) return pick('Password must be at least 8 characters.', 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.');
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return pick('Password must contain letters and numbers.', 'يجب أن تحتوي كلمة المرور على أحرف وأرقام.');
    if (password !== confirm) return pick('Passwords do not match.', 'كلمتا المرور غير متطابقتين.');
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setDone(true);
  };

  const inputCls = `w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200 ${
    isLight
      ? 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10'
      : 'bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-brand-orange/50 focus:bg-white/8'
  }`;

  const pwStrength = password.length === 0 ? 0
    : password.length < 8 ? 1
    : password.length < 12 && (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) ? 2
    : password.length >= 12 ? 4 : 3;

  const strengthLabel = pick(
    ['', 'Too short', 'Weak', 'Fair', 'Strong'][pwStrength],
    ['', 'قصيرة جدًا', 'ضعيفة', 'متوسطة', 'قوية'][pwStrength]
  );
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'][pwStrength];

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-16 ${isLight ? 'bg-gray-50' : 'bg-[#050d1a]'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f5a623 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrandLogo size={BRAND_LOGO_HEIGHT.auth} />
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.04)',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: isLight ? '0 4px 40px rgba(0,0,0,0.08)' : '0 4px 40px rgba(0,0,0,0.4)',
          }}
        >
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                <CircleCheck size={28} className="text-emerald-400" />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>{pick('Account Created', 'تم إنشاء الحساب')}</h2>
              <p className={`text-sm mb-6 ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>
                {pick('Check your email to confirm your account, then sign in.', 'تحقق من بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.')}
              </p>
              <Link href="/login" className="btn-primary w-full justify-center">
                {pick('Go to Sign In', 'الذهاب لتسجيل الدخول')}
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className={`text-2xl font-bold mb-1 ${isLight ? 'text-gray-900' : 'text-white'}`} style={{ letterSpacing: '-0.02em' }}>
                  {pick('Create Account', 'إنشاء حساب')}
                </h1>
                <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>
                  {pick('Already have an account? ', 'لديك حساب بالفعل؟ ')}
                  <Link href="/login" className="text-brand-orange hover:text-brand-orange/80 font-medium transition-colors">
                    {pick('Sign in', 'تسجيل الدخول')}
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4" noValidate>
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
                      placeholder={pick('you@company.com', 'you@example.com')}
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
                      placeholder={pick('Min. 8 characters', '8 أحرف على الأقل')}
                      className={`${inputCls} pr-10`}
                      autoComplete="new-password"
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

                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: i <= pwStrength ? strengthColor : isLight ? '#e5e7eb' : 'rgba(255,255,255,0.1)' }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium" style={{ color: strengthColor }}>{strengthLabel}</span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-gray-600' : 'text-slate-400'}`}>
                    {pick('Confirm password', 'تأكيد كلمة المرور')}
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); setError(''); }}
                      placeholder={pick('Repeat your password', 'أعد كتابة كلمة المرور')}
                      className={`${inputCls} pr-10`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 mt-1 justify-center"
                >
                  {loading ? <Loader size={15} className="animate-spin" /> : null}
                  {loading ? (pick('Creating account…', 'جارٍ إنشاء الحساب…')) : (pick('Create Account', 'إنشاء الحساب'))}
                </button>
              </form>
            </>
          )}
        </div>

        <p className={`text-center text-xs mt-6 ${isLight ? 'text-gray-400' : 'text-slate-500'}`}>
          <Link href="/" className="hover:text-brand-orange transition-colors">
            {pick('← Back to website', 'العودة للموقع ←')}
          </Link>
        </p>
      </div>
    </div>
  );
}
