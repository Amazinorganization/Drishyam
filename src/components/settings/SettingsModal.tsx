import React, { useState } from 'react';
import {
  X,
  Moon,
  Sun,
  Monitor,
  Shield,
  Bell,
  PlaySquare,
  Globe,
  HelpCircle,
  LogOut,
  RefreshCw,
  Info
} from 'lucide-react';
import { ThemeMode } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  onLogout
}) => {
  const [activeSection, setActiveSection] = useState<'appearance' | 'account' | 'playback' | 'about'>('appearance');
  const [defaultQuality, setDefaultQuality] = useState('1080p (Auto)');
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [language, setLanguage] = useState('English / हिंदी');
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleResetData = () => {
    StorageService.resetAllData();
    showToast('Platform reset to default seed state', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0">
          <h2 className="font-brand text-lg font-bold text-white">DRISHYAM Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Desktop / Segmented Mobile Layout */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden text-xs">
          {/* Sidebar Navigation */}
          <div className="sm:w-48 p-2 sm:p-3 bg-slate-950/70 border-b sm:border-b-0 sm:border-r border-slate-800 space-y-1 flex sm:flex-col overflow-x-auto sm:overflow-visible shrink-0">
            <button
              onClick={() => setActiveSection('appearance')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition ${
                activeSection === 'appearance' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => setActiveSection('playback')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition ${
                activeSection === 'playback' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PlaySquare className="w-4 h-4" />
              <span>Playback</span>
            </button>

            <button
              onClick={() => setActiveSection('account')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition ${
                activeSection === 'account' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </button>

            <button
              onClick={() => setActiveSection('about')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition ${
                activeSection === 'about' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>
          </div>

          {/* Main Setting Panel */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* APPEARANCE SECTION */}
            {activeSection === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">Color Theme</h3>
                  <p className="text-slate-400 text-xs">
                    Choose how DRISHYAM looks on your screen.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark' as ThemeMode, label: 'Dark Mode', icon: Moon },
                    { id: 'light' as ThemeMode, label: 'Light Mode', icon: Sun },
                    { id: 'system' as ThemeMode, label: 'System Sync', icon: Monitor }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = currentTheme === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onThemeChange(item.id);
                          showToast(`Theme changed to ${item.label}`, 'info');
                        }}
                        className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border text-center transition ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PLAYBACK SECTION */}
            {activeSection === 'playback' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-sm">Video & Audio Preferences</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <p className="font-semibold text-white">Default Video Quality</p>
                      <p className="text-[11px] text-slate-400">Stream resolution preference</p>
                    </div>
                    <select
                      value={defaultQuality}
                      onChange={(e) => setDefaultQuality(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1"
                    >
                      <option value="4K Ultra HD">4K Ultra HD</option>
                      <option value="1080p (Auto)">1080p (Auto)</option>
                      <option value="720p">720p (Data Saver)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <p className="font-semibold text-white">Autoplay Next Video</p>
                      <p className="text-[11px] text-slate-400">Queue continuous recommended videos</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoplayNext}
                      onChange={(e) => setAutoplayNext(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY & DATA SECTION */}
            {activeSection === 'account' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-sm">Data, Session & Account</h3>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Watch History</p>
                      <p className="text-[11px] text-slate-400">Clear recently watched video logs</p>
                    </div>
                    <button
                      onClick={() => {
                        StorageService.clearWatchHistory();
                        showToast('Watch history cleared', 'info');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                    >
                      Clear History
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Reset Demo Storage</p>
                      <p className="text-[11px] text-slate-400">Restore default seed videos, posts & creators</p>
                    </div>
                    <button
                      onClick={handleResetData}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Session Logout</p>
                      <p className="text-[11px] text-slate-400">Switch account or sign out</p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/60 text-rose-300 font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT DRISHYAM SECTION */}
            {activeSection === 'about' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-brand font-black text-amber-500 text-base">DRISHYAM</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                      V1.6 Stable
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    DRISHYAM is an original Indian video-sharing and social ecosystem designed to combine
                    the scale and storytelling of long-form videos with the velocity of Shorts, stories,
                    and community conversations.
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Architected for mobile-first Android performance, PWA installability, and seamless future migration to distributed cloud backends.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-semibold text-white block">Engine:</span>
                    <span>React 19 + TypeScript + Vite</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-semibold text-white block">Origin:</span>
                    <span>Proudly Indian 🇮🇳</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
