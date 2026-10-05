import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { DrishyamLogo } from '../brand/DrishyamLogo';
import { StorageService } from '../../services/storage';
import { CREATORS } from '../../data/seedData';
import { useToast } from '../common/Toast';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      showToast('Please enter both username and password', 'error');
      return;
    }

    // Check if matching creator in demo or current user
    const foundCreator = CREATORS.find(
      (c) => c.username.toLowerCase() === username.trim().toLowerCase()
    );

    const userToLogin = foundCreator || {
      ...StorageService.getCurrentUser(),
      username: username.trim().replace(/^@/, '')
    };

    StorageService.updateCurrentUser(userToLogin);
    StorageService.setLoggedIn(true);
    showToast(`Welcome back to DRISHYAM, ${userToLogin.name}! 🇮🇳`, 'success');
    onLoginSuccess(userToLogin);
    onClose();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      username: username.trim().replace(/^@/, ''),
      email: email.trim() || `${username.trim()}@drishyam.in`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
      bio: 'New explorer & creator on DRISHYAM 🇮🇳',
      followersCount: 1,
      followingCount: 3,
      totalVideos: 0,
      totalShorts: 0,
      totalPosts: 0,
      joinedDate: 'Joined Today',
      isVerified: false,
      isCreator: false,
      role: 'user',
      isPrivate: false,
      links: {}
    };

    StorageService.updateCurrentUser(newUser);
    StorageService.setLoggedIn(true);
    showToast(`Account created! Welcome to DRISHYAM, ${newUser.name}!`, 'success');
    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickDemoSwitch = (creator: UserProfile) => {
    StorageService.updateCurrentUser(creator);
    StorageService.setLoggedIn(true);
    showToast(`Switched account to ${creator.name} (@${creator.username})`, 'success');
    onLoginSuccess(creator);
    onClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Password reset link simulated: Please check your inbox', 'info');
    setShowForgotPassword(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl p-6 sm:p-7 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <DrishyamLogo size="lg" showText={false} />
          <h2 className="font-brand text-2xl font-bold text-white tracking-tight">
            {showForgotPassword
              ? 'Reset Your Password'
              : isSignup
              ? 'Join DRISHYAM Bharat'
              : 'Sign In to DRISHYAM'}
          </h2>
          <p className="text-xs text-slate-400">
            {showForgotPassword
              ? 'Enter your email or phone to receive a recovery token'
              : isSignup
              ? 'Create a creator or viewer account in seconds'
              : 'Access your watch history, subscriptions, and studio'}
          </p>
        </div>

        {/* FORGOT PASSWORD FORM */}
        {showForgotPassword ? (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Registered Email or Username</label>
              <input
                type="text"
                required
                placeholder="aarav@drishyam.in"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              Back to Login
            </button>
          </form>
        ) : (
          /* LOGIN OR SIGNUP FORM */
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-3.5 text-xs">
            {isSignup && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Name</label>
                <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                  <User className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    id="signupName"
                    type="text"
                    required
                    placeholder="e.g., Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2.5 px-2 bg-transparent text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Username</label>
              <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                <span className="text-slate-500 font-mono">@</span>
                <input
                  id={isSignup ? 'signupUsername' : 'loginUsername'}
                  type="text"
                  required
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full py-2.5 px-2 bg-transparent text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {isSignup && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Email Address</label>
                <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 px-2 bg-transparent text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300">Password</label>
                {!isSignup && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  id={isSignup ? 'signupPassword' : 'loginPassword'}
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 px-2 bg-transparent text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Confirm Password</label>
                <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-500">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-2.5 px-2 bg-transparent text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {!isSignup && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberSession"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="rememberSession" className="text-slate-400 text-xs cursor-pointer">
                  Remember this device session
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition active:scale-98 mt-2"
            >
              {isSignup ? 'Create DRISHYAM Account' : 'Sign In'}
            </button>

            {/* Toggle Login / Signup */}
            <div className="pt-2 text-center text-xs text-slate-400">
              {isSignup ? 'Already have an account? ' : "Don't have an account yet? "}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="font-bold text-amber-400 hover:underline"
              >
                {isSignup ? 'Sign In' : 'Sign Up Free'}
              </button>
            </div>
          </form>
        )}

        {/* 1-Tap Quick Switch Demo Accounts (For easy phone testing) */}
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 text-center">
            Or test instantly with pre-loaded creator profiles:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {CREATORS.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleQuickDemoSwitch(c)}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 transition text-left"
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate text-[11px]">{c.name.split(' ')[0]}</p>
                  <p className="text-[9px] text-slate-400 font-mono truncate">@{c.username}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
