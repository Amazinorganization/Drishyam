import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Flame,
  Compass,
  ArrowRight,
  CheckCircle2,
  Users,
  Smartphone,
  Video,
  Play
} from 'lucide-react';
import {
  UserProfile,
  VideoItem,
  StoryItem,
  CommunityPost,
  VideoCategory,
  Playlist
} from './types';
import { StorageService } from './services/storage';
import { CREATORS } from './data/seedData';
import { useTheme } from './hooks/useTheme';
import { ToastProvider, useToast } from './components/common/Toast';

// Component imports
import { SplashExperience } from './components/brand/SplashExperience';
import { TopBar } from './components/navigation/TopBar';
import { MobileTabBar } from './components/navigation/MobileTabBar';
import { DesktopSidebar } from './components/navigation/DesktopSidebar';
import { VideoCard } from './components/video/VideoCard';
import { VideoPlayerModal } from './components/video/VideoPlayerModal';
import { ShortsViewer } from './components/shorts/ShortsViewer';
import { StoriesBar } from './components/stories/StoriesBar';
import { StoryViewerModal } from './components/stories/StoryViewerModal';
import { CommunityPostCard } from './components/posts/CommunityPostCard';
import { GlobalSearch } from './components/search/GlobalSearch';
import { ProfileView } from './components/profile/ProfileView';
import { CreatorStudio } from './components/creator/CreatorStudio';
import { CreateModal } from './components/upload/CreateModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { SettingsModal } from './components/settings/SettingsModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AuthModal } from './components/auth/AuthModal';

function DrishyamAppContent() {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  // App Loading / Splash State
  const [showSplash, setShowSplash] = useState(true);

  // Active View Tab: 'home' | 'shorts' | 'explore' | 'profile' | 'studio'
  const [activeTab, setActiveTab] = useState<'home' | 'shorts' | 'explore' | 'profile' | 'studio'>('home');

  // Home Feed Sub-Filters
  const [homeFeedType, setHomeFeedType] = useState<'recommended' | 'following' | 'posts'>('recommended');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'All'>('All');

  // Application Data States
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => StorageService.getCurrentUser());
  const [videos, setVideos] = useState<VideoItem[]>(() => StorageService.getVideos());
  const [shorts, setShorts] = useState<VideoItem[]>(() => StorageService.getShorts());
  const [stories, setStories] = useState<StoryItem[]>(() => StorageService.getStories());
  const [posts, setPosts] = useState<CommunityPost[]>(() => StorageService.getPosts());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => StorageService.getPlaylists());
  const [notifications, setNotifications] = useState(() => StorageService.getNotifications());
  const [viewingProfileUser, setViewingProfileUser] = useState<UserProfile>(currentUser);

  // Modals & Viewers State
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Category Pills list
  const CATEGORIES: (VideoCategory | 'All')[] = [
    'All',
    'Trending',
    'Technology',
    'Cinema',
    'Music',
    'Food',
    'Travel',
    'Explainer',
    'Culture'
  ];

  // Refresh all state from Storage
  const refreshData = () => {
    setCurrentUser(StorageService.getCurrentUser());
    setVideos(StorageService.getVideos());
    setShorts(StorageService.getShorts());
    setStories(StorageService.getStories());
    setPosts(StorageService.getPosts());
    setPlaylists(StorageService.getPlaylists());
    setNotifications(StorageService.getNotifications());
  };

  const handleSelectCreatorProfile = (creatorId: string) => {
    const creator = CREATORS.find((c) => c.id === creatorId);
    if (creator) {
      setViewingProfileUser(creator);
      setActiveTab('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filtered Videos for Home Feed
  const filteredVideos = videos.filter((v) => {
    if (v.isShort) return false;
    if (homeFeedType === 'following') {
      const followingList = StorageService.getFollowing();
      return followingList.includes(v.creatorId);
    }
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Trending') return v.views > 700000;
    return v.category === selectedCategory;
  });

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col antialiased">
      {/* Splash Startup Animation */}
      {showSplash && (
        <SplashExperience onComplete={() => setShowSplash(false)} minDurationMs={1000} />
      )}

      {/* Top Bar Navigation */}
      <TopBar
        user={currentUser}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onOpenSearch={() => setActiveTab('explore')}
        onOpenProfile={() => {
          setViewingProfileUser(currentUser);
          setActiveTab('profile');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenStudio={() => setActiveTab('studio')}
        onLogoClick={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentTheme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Desktop Collapsible Left Sidebar */}
        <DesktopSidebar
          currentTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'profile') setViewingProfileUser(currentUser);
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          user={currentUser}
        />

        {/* Dynamic Main View Canvas */}
        <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-6 pb-20 sm:pb-8">
          {/* TAB 1: HOME PAGE */}
          {activeTab === 'home' && (
            <div id="homePage" className="space-y-6 animate-in fade-in duration-200">
              {/* Instagram-style 24-hr Stories Bar */}
              <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-3">
                <StoriesBar
                  stories={stories}
                  onSelectStory={(idx) => setActiveStoryIndex(idx)}
                  onAddStory={() => setIsCreateModalOpen(true)}
                />
              </div>

              {/* Feed Mode Tabs & Category Filter Pills */}
              <div className="space-y-3">
                {/* Mode Segmented Controls */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
                  <button
                    onClick={() => setHomeFeedType('recommended')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                      homeFeedType === 'recommended'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Recommended
                  </button>

                  <button
                    onClick={() => setHomeFeedType('following')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                      homeFeedType === 'following'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Following Feed
                  </button>

                  <button
                    onClick={() => setHomeFeedType('posts')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                      homeFeedType === 'posts'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Community Posts
                  </button>
                </div>

                {/* Category Horizontal Filter Buttons */}
                {homeFeedType !== 'posts' && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                          selectedCategory === cat
                            ? 'bg-white text-slate-950 shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* VIEW A: COMMUNITY POSTS FEED */}
              {homeFeedType === 'posts' ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                  {posts.map((post) => (
                    <CommunityPostCard
                      key={post.id}
                      post={post}
                      onCreatorClick={handleSelectCreatorProfile}
                    />
                  ))}
                </div>
              ) : (
                /* VIEW B: VIDEO FEED WITH SHORTS ROW SPOTLIGHT */
                <div className="space-y-8">
                  {/* Hero Spotlight / Featured Video (If on All or Technology) */}
                  {selectedCategory === 'All' && homeFeedType === 'recommended' && videos[0] && (
                    <div
                      onClick={() => setActiveVideo(videos[0])}
                      className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 cursor-pointer shadow-xl hover:border-amber-500/50 transition-all duration-300"
                    >
                      <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full bg-slate-950">
                        <img
                          src={videos[0].thumbnail}
                          alt={videos[0].title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                          DRISHYAM SPOTLIGHT
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 relative -mt-16 sm:-mt-20 z-10 space-y-2">
                        <h2 className="font-brand text-lg sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors max-w-3xl leading-snug">
                          {videos[0].title}
                        </h2>
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                          <span className="font-semibold text-white">{videos[0].creatorName}</span>
                          <span aria-hidden="true">·</span>
                          <span>{videos[0].views.toLocaleString()} views</span>
                          <span aria-hidden="true">·</span>
                          <span>{videos[0].duration}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Primary Video Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredVideos.map((vid) => (
                      <VideoCard
                        key={vid.id}
                        video={vid}
                        onSelect={(v) => setActiveVideo(v)}
                        onCreatorClick={handleSelectCreatorProfile}
                      />
                    ))}
                  </div>

                  {/* Integrated Shorts Carousel Preview Row */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-amber-500" />
                        <h3 className="font-brand text-base font-bold text-white">DRISHYAM Shorts</h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('shorts')}
                        className="text-xs text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {shorts.slice(0, 4).map((sh) => (
                        <div
                          key={sh.id}
                          onClick={() => setActiveVideo(sh)}
                          className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 cursor-pointer border border-slate-800 hover:border-amber-500/50 transition-all duration-200"
                        >
                          <img
                            src={sh.thumbnail}
                            alt={sh.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                          <div className="absolute bottom-3 inset-x-3 text-left">
                            <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                              {sh.title}
                            </p>
                            <p className="text-[10px] text-amber-400 font-mono mt-1">
                              {sh.views.toLocaleString()} views
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Indian Creators Carousel */}
                  <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-brand text-base font-bold text-white">
                        Creators Inspiring India
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {CREATORS.filter((c) => c.id !== currentUser.id).map((creator) => (
                        <div
                          key={creator.id}
                          onClick={() => handleSelectCreatorProfile(creator.id)}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                        >
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">{creator.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              @{creator.username}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DEDICATED SHORTS EXPERIENCE */}
          {activeTab === 'shorts' && (
            <div className="flex justify-center items-center py-2 animate-in fade-in duration-200">
              <ShortsViewer
                shorts={shorts}
                onCreatorClick={handleSelectCreatorProfile}
              />
            </div>
          )}

          {/* TAB 3: GLOBAL SEARCH & EXPLORE HUBS */}
          {activeTab === 'explore' && (
            <div id="searchPage" className="animate-in fade-in duration-200">
              <GlobalSearch
                videos={videos}
                shorts={shorts}
                posts={posts}
                onSelectVideo={(v) => setActiveVideo(v)}
                onSelectCreator={handleSelectCreatorProfile}
              />
            </div>
          )}

          {/* TAB 4: USER & CREATOR PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-200">
              <ProfileView
                user={viewingProfileUser}
                videos={videos}
                shorts={shorts}
                posts={posts}
                playlists={playlists}
                onSelectVideo={(v) => setActiveVideo(v)}
                onUpdateUser={(updated) => {
                  setCurrentUser(updated);
                  setViewingProfileUser(updated);
                }}
                isCurrentUser={viewingProfileUser.id === currentUser.id}
              />
            </div>
          )}

          {/* TAB 5: CREATOR STUDIO */}
          {activeTab === 'studio' && (
            <div className="animate-in fade-in duration-200">
              <CreatorStudio
                user={currentUser}
                videos={videos}
                onUploadClick={() => setIsCreateModalOpen(true)}
                onSelectVideo={(v) => setActiveVideo(v)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Ergonomic Bottom Tab Bar (Section 31 & Pattern 1) */}
      <MobileTabBar
        currentTab={activeTab === 'studio' ? 'profile' : activeTab}
        onSelectTab={(tab) => {
          if (tab === 'profile') setViewingProfileUser(currentUser);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        userAvatar={currentUser.avatar}
      />

      {/* FULL RESPONSIVE VIDEO PLAYER MODAL */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        onSelectVideo={(v) => setActiveVideo(v)}
        onCreatorClick={handleSelectCreatorProfile}
        allVideos={videos}
      />

      {/* 24-HR STORY VIEWER MODAL */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}

      {/* CREATOR STUDIO UPLOAD MODAL */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onContentCreated={refreshData}
      />

      {/* NOTIFICATION CENTER DRAWER */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onSelectVideo={(vId) => {
          const v = videos.find((item) => item.id === vId);
          if (v) setActiveVideo(v);
        }}
        onSelectCreator={handleSelectCreatorProfile}
        onRefresh={refreshData}
      />

      {/* PLATFORM SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onThemeChange={(newTheme) => setTheme(newTheme)}
        onLogout={() => {
          setIsSettingsOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* ADMIN & TRUST MODERATION PANEL */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setCurrentUser(loggedInUser);
          setViewingProfileUser(loggedInUser);
          refreshData();
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <DrishyamAppContent />
    </ToastProvider>
  );
}
