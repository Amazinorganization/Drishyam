import React, { useState } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Loader2,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

import { DrishyamLogo } from '../brand/DrishyamLogo';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { UserProfile } from '../../types';
import { supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { showToast } = useToast();

  if (!isOpen) return null;

  const cleanUsername = username.trim().replace(/^@/, '');

  const resetForm = () => {
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const finishLogin = async (
    authUser: {
      id: string;
      email?: string;
      user_metadata?: Record<string, unknown>;
    }
  ) => {
    const metadata = authUser.user_metadata || {};

    const savedUser: UserProfile = {
      id: authUser.id,
      name:
        String(metadata.name || '').trim() ||
        authUser.email?.split('@')[0] ||
        'Drishyam User',
      username:
        String(metadata.username || '').trim() ||
        authUser.email?.split('@')[0] ||
        `user_${authUser.id.slice(0, 8)}`,
      email: authUser.email || '',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      coverImage:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
      bio: 'New explorer & creator on DRISHYAM 🇮🇳',
      followersCount: 0,
      followingCount: 0,
      totalVideos: 0,
      totalShorts: 0,
      totalPosts: 0,
      joinedDate: new Date().toLocaleDateString('en-IN'),
      isVerified: Boolean(authUser.email_confirmed_at),
      isCreator: false,
      role: 'user',
      isPrivate: false,
      links: {},
    };

    StorageService.updateCurrentUser(savedUser);
    StorageService.setLoggedIn(true);

    onLoginSuccess(savedUser);
    onClose();
    resetForm();
  };

   const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (!data.user) {
        showToast('Login failed. Please try again.', 'error');
        return;
      }

      await finishLogin(data.user);
      showToast('Welcome back to DRISHYAM!', 'success');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to sign in.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !cleanUsername || !email.trim() || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      showToast(
        'Username must be 3–20 characters and contain only letters, numbers, or underscores.',
        'error'
      );
      return;
    }

    if (password.length < 6) {
      showToast('Password must contain at least 6 characters.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
  email: email.trim(),
  password,
  options: {
    emailRedirectTo:'com.drishyam.app://login-callback'‚
    data: {
      name: name.trim(),
      username: cleanUsername,
    },
  },
});
      if (error) throw error;

      if (data.session && data.user) {
        await finishLogin(data.user);
        showToast('Your DRISHYAM account has been created!', 'success');
      } else {
        showToast(
          'Account created! Please verify your email, then return and sign in.',
          'success'
        );
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to create account.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast('Please enter your registered email address.', 'error');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: 'com.drishyam.app://login-callback',
        }
      );

      if (error) throw error;

      showToast(
        'If this email is registered, a password reset email will be sent.',
        'success'
      );
      setMode('login');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to send reset email.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (newMode: AuthMode) => {
    setMode(newMode);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl p-6 sm:p-7 flex flex-col max-h-[95vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <DrishyamLogo size="lg" showText={false} />

          <h2 className="font-brand text-2xl font-bold text-white tracking-tight">
            {mode === 'forgot'
              ? 'Reset Your Password'
              : mode === 'signup'
                ? 'Join DRISHYAM Bharat'
                : 'Sign In to DRISHYAM'}
          </h2>

          <p className="text-xs text-slate-400">
            {mode === 'forgot'
              ? 'Enter your registered email address.'
              : mode === 'signup'
                ? 'Create your account and join the community.'
                : 'Sign in with your registered email and password.'}
          </p>
        </div>

        {mode === 'forgot' ? (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                Email Address
              </label>

              <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />

                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-2 bg-transparent text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => changeMode('login')}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </form>
        ) : (
          <form
            onSubmit={mode === 'signup' ? handleSignup : handleLogin}
            className="space-y-3.5 text-xs"
          >
            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    Full Name
                  </label>

                  <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />

                    <input
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full py-3 px-2 bg-transparent text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    Username
                  </label>

                  <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                    <span className="text-slate-500">@</span>

                    <input
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="your_username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full py-3 px-2 bg-transparent text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                Email Address
              </label>

              <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />

                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-2 bg-transparent text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">
                Password
              </label>

              <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={
                    mode === 'signup' ? 'new-password' : 'current-password'
                  }
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 px-2 bg-transparent text-white focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  Confirm Password
                </label>

                <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                  <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-3 px-2 bg-transparent text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => changeMode('forgot')}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition"
            >
              {loading
                ? 'Please wait...'
                : mode === 'signup'
                  ? 'Create DRISHYAM Account'
                  : 'Sign In'}
            </button>

            <div className="pt-2 text-center text-xs text-slate-400">
              {mode === 'signup'
                ? 'Already have an account? '
                : "Don't have an account yet? "}

              <button
                type="button"
                onClick={() =>
                  changeMode(mode === 'signup' ? 'login' : 'signup')
                }
                className="font-bold text-amber-400 hover:underline"
              >
                {mode === 'signup' ? 'Sign In' : 'Sign Up Free'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Your account is protected by Supabase Authentication.
          </p>
        </div>
      </div>
    </div>
  );
};