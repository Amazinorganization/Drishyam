import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  TrendingUp,
  History,
  Filter,
  CheckCircle2,
  Video,
  Smartphone,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';
import { VideoItem, CommunityPost, UserProfile, VideoCategory } from '../../types';
import { VideoCard } from '../video/VideoCard';
import { CommunityPostCard } from '../posts/CommunityPostCard';
import { CREATORS } from '../../data/seedData';

interface GlobalSearchProps {
  videos: VideoItem[];
  shorts: VideoItem[];
  posts: CommunityPost[];
  onSelectVideo: (video: VideoItem) => void;
  onSelectCreator: (creatorId: string) => void;
  initialQuery?: string;
  onClose?: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  videos,
  shorts,
  posts,
  onSelectVideo,
  onSelectCreator,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<'all' | 'videos' | 'shorts' | 'creators' | 'posts'>('all');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'views'>('relevance');

  // Recent searches saved in memory/localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Varanasi Ganga Aarti 4K',
    'Bengaluru Drone Labs',
    'Dum Biryani Awadh',
    'Sitar fusion live'
  ]);

  const TRENDING_SEARCHES = [
    '#DigitalBharat',
    'Pan-Indian Sci-Fi BTS',
    'Electric Sitar Raga',
    'UPI 2.0 Explainer',
    'Ladakh Winter Motorcycle',
    'Mysore Masala Dosa'
  ];

  const EXPLORE_HUBS = [
    { title: 'Tech & AI Bharat', count: '1.4K videos', color: 'from-amber-500 to-orange-600', query: 'Tech' },
    { title: 'Indian Cinema & OTT', count: '3.2K videos', color: 'from-purple-600 to-indigo-600', query: 'Cinema' },
    { title: 'Classical & Folk', count: '890 videos', color: 'from-rose-500 to-pink-600', query: 'Classical' },
    { title: 'Desi Rasoi & Gastronomy', count: '2.1K videos', color: 'from-emerald-500 to-teal-600', query: 'Food' },
    { title: 'Himalayan Expeditions', count: '640 videos', color: 'from-cyan-500 to-blue-600', query: 'Travel' }
  ];

  const handleSearchSubmit = (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      setRecentSearches([searchTerm, ...recentSearches.slice(0, 5)]);
    }
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  // Filter & Search Logic
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return null;

    let matchedVideos = videos.filter((v) => {
      const matchText =
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.creatorName.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)) ||
        v.hashtags.some((h) => h.toLowerCase().includes(q));
      const matchCategory = selectedCategory === 'All' || v.category === selectedCategory;
      return matchText && matchCategory;
    });

    let matchedShorts = shorts.filter((s) => {
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.creatorName.toLowerCase().includes(q)
      );
    });

    let matchedCreators = CREATORS.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q)
      );
    });

    let matchedPosts = posts.filter((p) => {
      return (
        p.content.toLowerCase().includes(q) ||
        p.userName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

    // Sorting
    if (sortBy === 'newest') {
      // Keep natural order or sort
    } else if (sortBy === 'views') {
      matchedVideos.sort((a, b) => b.views - a.views);
      matchedShorts.sort((a, b) => b.views - a.views);
    }

    return {
      videos: matchedVideos,
      shorts: matchedShorts,
      creators: matchedCreators,
      posts: matchedPosts,
      totalCount:
        matchedVideos.length + matchedShorts.length + matchedCreators.length + matchedPosts.length
    };
  }, [query, videos, shorts, posts, selectedCategory, sortBy]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-2 sm:px-4 py-2">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          id="searchQueryInput"
          placeholder="Search videos, Shorts, creators, topics across DRISHYAM..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchSubmit(query);
          }}
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-xl transition"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* When NO query is entered: Show Explore Hubs, Trending Searches & Recent Searches */}
      {!query ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Explore Featured Hubs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              <h3 className="font-brand text-base font-bold text-white">Explore DRISHYAM Hubs</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {EXPLORE_HUBS.map((hub) => (
                <div
                  key={hub.title}
                  onClick={() => handleSearchSubmit(hub.query)}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${hub.color} hover:brightness-110 cursor-pointer shadow-lg transition-transform active:scale-95 text-white flex flex-col justify-between h-28`}
                >
                  <p className="font-bold text-sm leading-snug">{hub.title}</p>
                  <div className="flex items-center justify-between text-[11px] opacity-90">
                    <span>{hub.count}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Searches Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-500" />
              <h3 className="font-brand text-base font-bold text-white">Trending in India</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSearchSubmit(item)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-amber-400 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-400" />
                  <h3 className="font-brand text-sm font-semibold text-slate-300">Recent Searches</h3>
                </div>
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-amber-500/80 hover:text-amber-400"
                >
                  Clear History
                </button>
              </div>

              <div className="space-y-1">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    onClick={() => handleSearchSubmit(term)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer text-xs text-slate-300 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                      <span>{term}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* When search query is active: Show Filter Tabs & Result Cards */
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Segmented Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
              {[
                { id: 'all', label: 'All Results' },
                { id: 'videos', label: `Videos (${searchResults?.videos.length || 0})` },
                { id: 'shorts', label: `Shorts (${searchResults?.shorts.length || 0})` },
                { id: 'creators', label: `Creators (${searchResults?.creators.length || 0})` },
                { id: 'posts', label: `Posts (${searchResults?.posts.length || 0})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    filterType === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="views">Most Viewed</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <p className="text-xs text-slate-400">
            Found <span className="font-semibold text-white">{searchResults?.totalCount || 0}</span> items matching &ldquo;{query}&rdquo;
          </p>

          {/* Empty State */}
          {searchResults && searchResults.totalCount === 0 && (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">No results found for &ldquo;{query}&rdquo;</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for broader keywords like &ldquo;Varanasi&rdquo;, &ldquo;Tech&rdquo;, &ldquo;Biryani&rdquo;, or browse trending topics.
              </p>
            </div>
          )}

          {/* Matched Creators row */}
          {(filterType === 'all' || filterType === 'creators') &&
            searchResults &&
            searchResults.creators.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-brand text-xs uppercase font-bold text-amber-500 tracking-wider">
                  Creators & Channels
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.creators.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onSelectCreator(c.id)}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition"
                    >
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-white truncate">{c.name}</p>
                          {c.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <p className="text-xs text-slate-400">@{c.username} · {c.followersCount.toLocaleString()} followers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Matched Videos Grid */}
          {(filterType === 'all' || filterType === 'videos') &&
            searchResults &&
            searchResults.videos.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-brand text-xs uppercase font-bold text-amber-500 tracking-wider">
                  Videos
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.videos.map((vid) => (
                    <VideoCard
                      key={vid.id}
                      video={vid}
                      onSelect={onSelectVideo}
                      onCreatorClick={onSelectCreator}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Matched Shorts Grid */}
          {(filterType === 'all' || filterType === 'shorts') &&
            searchResults &&
            searchResults.shorts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-brand text-xs uppercase font-bold text-amber-500 tracking-wider">
                  DRISHYAM Shorts
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {searchResults.shorts.map((sh) => (
                    <div
                      key={sh.id}
                      onClick={() => onSelectVideo(sh)}
                      className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 cursor-pointer border border-slate-800"
                    >
                      <img
                        src={sh.thumbnail}
                        alt={sh.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 inset-x-2.5 text-left">
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
            )}

          {/* Matched Community Posts */}
          {(filterType === 'all' || filterType === 'posts') &&
            searchResults &&
            searchResults.posts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-brand text-xs uppercase font-bold text-amber-500 tracking-wider">
                  Community Posts
                </h4>
                <div className="space-y-3">
                  {searchResults.posts.map((post) => (
                    <CommunityPostCard
                      key={post.id}
                      post={post}
                      onCreatorClick={onSelectCreator}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
