import {
  UserProfile,
  VideoItem,
  StoryItem,
  CommunityPost,
  VideoComment,
  AppNotification,
  Playlist,
  ReportItem
} from '../types';
import {
  CURRENT_USER,
  CREATORS,
  INITIAL_VIDEOS,
  INITIAL_SHORTS,
  INITIAL_STORIES,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PLAYLISTS
} from '../data/seedData';

// Prototype LocalStorage Keys for Backward Compatibility
export const STORAGE_KEYS = {
  ACCOUNT: 'drishyamAccount',
  LOGGED_IN: 'drishyamLoggedIn',
  POSTS: 'drishyamPosts',
  VIDEOS: 'drishyamVideos',
  SHORTS: 'drishyamShorts',
  STORIES: 'drishyamStories',
  NOTIFICATIONS: 'drishyamNotifications',
  FOLLOWING: 'drishyamFollowing',
  THEME: 'drishyamTheme',
  COMMENTS: 'drishyamComments',
  PLAYLISTS: 'drishyamPlaylists',
  SAVED_VIDEOS: 'drishyamSavedVideos',
  WATCH_HISTORY: 'drishyamWatchHistory',
  REPORTS: 'drishyamReports',
  USER_REACTIONS: 'drishyamUserReactions'
};

// Defensive JSON reader
function getJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[DRISHYAM Storage] Corrupted or unreadable key "${key}". Resetting to fallback.`, err);
    return fallback;
  }
}

// Defensive JSON writer
function setJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[DRISHYAM Storage] Failed to write key "${key}". Quota exceeded or private browsing restriction.`, err);
  }
}

export const StorageService = {
  // Authentication & Account
  getCurrentUser(): UserProfile {
    const account = getJson<UserProfile | null>(STORAGE_KEYS.ACCOUNT, null);
    if (account) return account;
    // Initialize default current user
    setJson(STORAGE_KEYS.ACCOUNT, CURRENT_USER);
    return CURRENT_USER;
  },

  updateCurrentUser(updates: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    setJson(STORAGE_KEYS.ACCOUNT, updated);
    return updated;
  },

  isLoggedIn(): boolean {
    const status = localStorage.getItem(STORAGE_KEYS.LOGGED_IN);
    return status === null ? true : status === 'true'; // Default true for seamless prototype experience
  },

  setLoggedIn(status: boolean): void {
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, status ? 'true' : 'false');
  },

  // Following list: string array of user IDs
  getFollowing(): string[] {
    return getJson<string[]>(STORAGE_KEYS.FOLLOWING, [
      'user_priya_02',
      'user_vikram_03',
      'user_ananya_04',
      'user_kabir_05'
    ]);
  },

  toggleFollow(userId: string): boolean {
    const following = this.getFollowing();
    const isCurrentlyFollowing = following.includes(userId);
    let updated: string[];

    if (isCurrentlyFollowing) {
      updated = following.filter((id) => id !== userId);
    } else {
      updated = [...following, userId];
    }
    setJson(STORAGE_KEYS.FOLLOWING, updated);

    // Update current user following count
    const user = this.getCurrentUser();
    this.updateCurrentUser({
      followingCount: Math.max(0, user.followingCount + (isCurrentlyFollowing ? -1 : 1))
    });

    return !isCurrentlyFollowing;
  },

  // Videos
  getVideos(): VideoItem[] {
    const stored = getJson<VideoItem[] | null>(STORAGE_KEYS.VIDEOS, null);
    if (stored && stored.length > 0) return stored;
    setJson(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    return INITIAL_VIDEOS;
  },

  saveVideos(videos: VideoItem[]): void {
    setJson(STORAGE_KEYS.VIDEOS, videos);
  },

  addVideo(video: VideoItem): void {
    const videos = this.getVideos();
    const updated = [video, ...videos];
    this.saveVideos(updated);

    // Update creator stats
    const user = this.getCurrentUser();
    if (video.isShort) {
      this.updateCurrentUser({ totalShorts: user.totalShorts + 1 });
    } else {
      this.updateCurrentUser({ totalVideos: user.totalVideos + 1 });
    }
  },

  // Shorts
  getShorts(): VideoItem[] {
    const stored = getJson<VideoItem[] | null>(STORAGE_KEYS.SHORTS, null);
    if (stored && stored.length > 0) return stored;
    setJson(STORAGE_KEYS.SHORTS, INITIAL_SHORTS);
    return INITIAL_SHORTS;
  },

  saveShorts(shorts: VideoItem[]): void {
    setJson(STORAGE_KEYS.SHORTS, shorts);
  },

  // Stories
  getStories(): StoryItem[] {
    const stored = getJson<StoryItem[] | null>(STORAGE_KEYS.STORIES, null);
    if (stored && stored.length > 0) return stored;
    setJson(STORAGE_KEYS.STORIES, INITIAL_STORIES);
    return INITIAL_STORIES;
  },

  saveStories(stories: StoryItem[]): void {
    setJson(STORAGE_KEYS.STORIES, stories);
  },

  addStory(story: StoryItem): void {
    const stories = this.getStories();
    setJson(STORAGE_KEYS.STORIES, [story, ...stories]);
  },

  // Community Posts
  getPosts(): CommunityPost[] {
    const stored = getJson<CommunityPost[] | null>(STORAGE_KEYS.POSTS, null);
    if (stored && stored.length > 0) return stored;
    setJson(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    return INITIAL_POSTS;
  },

  savePosts(posts: CommunityPost[]): void {
    setJson(STORAGE_KEYS.POSTS, posts);
  },

  addPost(post: CommunityPost): void {
    const posts = this.getPosts();
    setJson(STORAGE_KEYS.POSTS, [post, ...posts]);
    const user = this.getCurrentUser();
    this.updateCurrentUser({ totalPosts: user.totalPosts + 1 });
  },

  // Comments
  getComments(): Record<string, VideoComment[]> {
    const stored = getJson<Record<string, VideoComment[]> | null>(STORAGE_KEYS.COMMENTS, null);
    if (stored) return stored;
    setJson(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    return INITIAL_COMMENTS;
  },

  addComment(videoId: string, comment: VideoComment): void {
    const all = this.getComments();
    const videoComments = all[videoId] || [];
    all[videoId] = [comment, ...videoComments];
    setJson(STORAGE_KEYS.COMMENTS, all);

    // Increment video comments count
    const videos = this.getVideos();
    const target = videos.find((v) => v.id === videoId);
    if (target) {
      target.commentsCount += 1;
      this.saveVideos(videos);
    }
  },

  // Notifications
  getNotifications(): AppNotification[] {
    const stored = getJson<AppNotification[] | null>(STORAGE_KEYS.NOTIFICATIONS, null);
    if (stored) return stored;
    setJson(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  },

  markNotificationsRead(): void {
    const notifs = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    setJson(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // Playlists
  getPlaylists(): Playlist[] {
    const stored = getJson<Playlist[] | null>(STORAGE_KEYS.PLAYLISTS, null);
    if (stored) return stored;
    setJson(STORAGE_KEYS.PLAYLISTS, INITIAL_PLAYLISTS);
    return INITIAL_PLAYLISTS;
  },

  savePlaylists(playlists: Playlist[]): void {
    setJson(STORAGE_KEYS.PLAYLISTS, playlists);
  },

  addVideoToPlaylist(playlistId: string, videoId: string): boolean {
    const playlists = this.getPlaylists();
    const pl = playlists.find((p) => p.id === playlistId);
    if (!pl) return false;
    if (!pl.videoIds.includes(videoId)) {
      pl.videoIds.push(videoId);
      this.savePlaylists(playlists);
      return true;
    }
    return false;
  },

  // Saved / Watch Later
  getSavedVideoIds(): string[] {
    return getJson<string[]>(STORAGE_KEYS.SAVED_VIDEOS, ['vid_01', 'vid_03']);
  },

  toggleSaveVideo(videoId: string): boolean {
    const saved = this.getSavedVideoIds();
    const exists = saved.includes(videoId);
    let updated: string[];
    if (exists) {
      updated = saved.filter((id) => id !== videoId);
    } else {
      updated = [...saved, videoId];
    }
    setJson(STORAGE_KEYS.SAVED_VIDEOS, updated);
    return !exists;
  },

  // Watch History
  getWatchHistory(): { videoId: string; watchedAt: string; progressPercent: number }[] {
    return getJson(STORAGE_KEYS.WATCH_HISTORY, [
      { videoId: 'vid_02', watchedAt: 'Yesterday', progressPercent: 65 },
      { videoId: 'vid_01', watchedAt: '3 days ago', progressPercent: 95 }
    ]);
  },

  recordWatchHistory(videoId: string, progressPercent = 10): void {
    const history = this.getWatchHistory().filter((h) => h.videoId !== videoId);
    history.unshift({
      videoId,
      watchedAt: 'Just now',
      progressPercent
    });
    setJson(STORAGE_KEYS.WATCH_HISTORY, history.slice(0, 30));
  },

  clearWatchHistory(): void {
    setJson(STORAGE_KEYS.WATCH_HISTORY, []);
  },

  // Reports
  getReports(): ReportItem[] {
    return getJson<ReportItem[]>(STORAGE_KEYS.REPORTS, [
      {
        id: 'rep_01',
        reporterId: 'user_anonymous',
        targetId: 'comm_spam_sample',
        targetType: 'comment',
        targetTitle: 'Promotional crypto link in comments',
        reason: 'Spam or deceptive links',
        details: 'Automated referral link bot detected in discussion.',
        timestamp: '3 hours ago',
        status: 'pending'
      }
    ]);
  },

  addReport(report: Omit<ReportItem, 'id' | 'timestamp' | 'status'>): void {
    const reports = this.getReports();
    const newReport: ReportItem = {
      ...report,
      id: `rep_${Date.now()}`,
      timestamp: 'Just now',
      status: 'pending'
    };
    setJson(STORAGE_KEYS.REPORTS, [newReport, ...reports]);
  },

  resolveReport(reportId: string, action: 'resolved' | 'dismissed'): void {
    const reports = this.getReports().map((r) =>
      r.id === reportId ? { ...r, status: action } : r
    );
    setJson(STORAGE_KEYS.REPORTS, reports);
  },

  // Reset all to pristine seed data
  resetAllData(): void {
    localStorage.clear();
    setJson(STORAGE_KEYS.ACCOUNT, CURRENT_USER);
    setJson(STORAGE_KEYS.LOGGED_IN, 'true');
    setJson(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    setJson(STORAGE_KEYS.SHORTS, INITIAL_SHORTS);
    setJson(STORAGE_KEYS.STORIES, INITIAL_STORIES);
    setJson(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    setJson(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    setJson(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setJson(STORAGE_KEYS.PLAYLISTS, INITIAL_PLAYLISTS);
    setJson(STORAGE_KEYS.FOLLOWING, ['user_priya_02', 'user_vikram_03']);
  }
};
