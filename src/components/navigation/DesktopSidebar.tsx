import React from 'react';
import {
  Home,
  Smartphone,
  Compass,
  Users,
  Clock,
  Bookmark,
  ThumbsUp,
  Sparkles,
  Settings,
  Shield,
  FolderPlus
} from 'lucide-react';
import { UserProfile } from '../../types';

interface DesktopSidebarProps {
  currentTab: 'home' | 'shorts' | 'explore' | 'profile' | 'studio';
  onSelectTab: (tab: 'home' | 'shorts' | 'explore' | 'profile' | 'studio') => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  user: UserProfile;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onOpenAdmin,
  user
}) => {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-[calc(100vh-3.75rem)] sticky top-[3.75rem] border-r border-slate-800/80 p-3 bg-[#0B0F19]/60 overflow-y-auto select-none space-y-6">
      {/* Primary Navigation Section */}
      <div className="space-y-1">
        <button
          onClick={() => onSelectTab('home')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
            currentTab === 'home'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Home className="w-4 h-4 stroke-[2.5]" />
          <span>Home Feed</span>
        </button>

        <button
          onClick={() => onSelectTab('shorts')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
            currentTab === 'shorts'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4 stroke-[2.5]" />
          <span>DRISHYAM Shorts</span>
        </button>

        <button
          onClick={() => onSelectTab('explore')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
            currentTab === 'explore'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Compass className="w-4 h-4 stroke-[2.5]" />
          <span>Explore Hubs</span>
        </button>
      </div>

      <div className="h-px bg-slate-800/80" />

      {/* Library & Personal Content */}
      <div className="space-y-1">
        <div className="px-3.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Library
        </div>

        <button
          onClick={() => onSelectTab('profile')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
            currentTab === 'profile'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <img
            src={user.avatar}
            alt="You"
            className="w-4 h-4 rounded-full object-cover shrink-0"
            referrerPolicy="no-referrer"
          />
          <span>Your Channel</span>
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition"
        >
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Watch History</span>
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition"
        >
          <Bookmark className="w-4 h-4 text-slate-500" />
          <span>Saved & Watch Later</span>
        </button>
      </div>

      <div className="h-px bg-slate-800/80" />

      {/* Creator & Admin Tools */}
      <div className="space-y-1">
        <div className="px-3.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Platform Tools
        </div>

        <button
          onClick={() => onSelectTab('studio')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
            currentTab === 'studio'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-amber-400 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Creator Studio</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-xs text-rose-400/90 hover:text-rose-300 hover:bg-slate-900 transition"
        >
          <Shield className="w-4 h-4" />
          <span>Trust & Moderation</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </button>
      </div>

      {/* Footer Branding Info */}
      <div className="pt-4 text-[10px] text-slate-500 px-3.5 space-y-1">
        <p className="font-semibold text-slate-400">DRISHYAM Bharat Ecosystem</p>
        <p>© 2026 DRISHYAM India Inc.</p>
      </div>
    </aside>
  );
};
