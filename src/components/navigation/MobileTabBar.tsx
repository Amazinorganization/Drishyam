import React from 'react';
import { Home, Compass, Plus, Smartphone, User } from 'lucide-react';

interface MobileTabBarProps {
  currentTab: 'home' | 'shorts' | 'explore' | 'profile';
  onSelectTab: (tab: 'home' | 'shorts' | 'explore' | 'profile') => void;
  onOpenCreate: () => void;
  userAvatar: string;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreate,
  userAvatar
}) => {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-t border-slate-800/80 pb-safe sm:hidden select-none"
      role="navigation"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {/* TAB 1: HOME */}
        <button
          id="homeBtn"
          onClick={() => onSelectTab('home')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'home' ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Home"
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* TAB 2: SHORTS */}
        <button
          onClick={() => onSelectTab('shorts')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'shorts' ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Shorts"
        >
          <Smartphone className={`w-5 h-5 ${currentTab === 'shorts' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">Shorts</span>
        </button>

        {/* TAB 3: CREATE (+) ELEVATED THUMB BUTTON */}
        <div className="flex items-center justify-center">
          <button
            onClick={onOpenCreate}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-90 transition-transform"
            aria-label="Create content"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* TAB 4: EXPLORE / SEARCH */}
        <button
          id="searchBtn"
          onClick={() => onSelectTab('explore')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'explore' ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Explore and Search"
        >
          <Compass className={`w-5 h-5 ${currentTab === 'explore' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">Explore</span>
        </button>

        {/* TAB 5: PROFILE */}
        <button
          id="profileBtn"
          onClick={() => onSelectTab('profile')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'profile' ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Profile"
        >
          <div className="relative">
            <img
              src={userAvatar}
              alt="You"
              className={`w-5 h-5 rounded-full object-cover ring-1 ${
                currentTab === 'profile' ? 'ring-amber-500' : 'ring-slate-700'
              }`}
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">You</span>
        </button>
      </div>
    </nav>
  );
};
