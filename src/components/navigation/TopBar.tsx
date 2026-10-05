import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Moon,
  Sun,
  Shield,
  Settings,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { DrishyamLogo } from '../brand/DrishyamLogo';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { UserProfile, ThemeMode } from '../../types';

interface TopBarProps {
  user: UserProfile;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenCreate: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onOpenStudio: () => void;
  onLogoClick: () => void;
  currentTheme: ThemeMode;
  onToggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenCreate,
  onOpenSearch,
  onOpenProfile,
  onOpenSettings,
  onOpenAdmin,
  onOpenStudio,
  onLogoClick,
  currentTheme,
  onToggleTheme
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0B0F19]/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <DrishyamLogo size="md" onClick={onLogoClick} />
        </div>

        {/* Zone 2: Quick Search Bar Affordance */}
        <div className="flex-1 max-w-xl mx-2 hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 text-xs text-slate-400 transition cursor-pointer shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-amber-500" />
              <span>Search videos, Shorts, creators, and topics...</span>
            </span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Zone 3: Primary Actions (Touch Hitbox ≥ 44px) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Quick Search trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="sm:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* PWA Install Button */}
          <div className="hidden md:block">
            <PWAInstallButton compact />
          </div>

          {/* Create Button (Desktop/Tablet) */}
          <button
            onClick={onOpenCreate}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition active:scale-95"
            title="Create content"
          >
            <Plus className="w-4 h-4 text-amber-500 stroke-[2.5]" />
            <span>Create</span>
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title={`Current theme: ${currentTheme}`}
          >
            {currentTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center justify-center animate-pulse font-mono">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Profile Avatar & Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              aria-label="User menu"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full ring-2 ring-slate-700 hover:ring-amber-500 transition p-0.5"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer border-b border-slate-800"
                  >
                    <p className="font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">@{user.username}</p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenStudio();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition text-amber-400 font-semibold"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Creator Studio</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition text-rose-400"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Moderation</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
