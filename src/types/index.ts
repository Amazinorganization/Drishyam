export type ThemeMode = 'dark' | 'light' | 'system';

export type UserRole = 'user' | 'creator' | 'moderator' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  coverImage: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  totalVideos: number;
  totalShorts: number;
  totalPosts: number;
  joinedDate: string;
  isVerified: boolean;
  isCreator: boolean;
  role: UserRole;
  isPrivate: boolean;
  links: {
    website?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
}

export type VideoCategory =
  | 'All'
  | 'Trending'
  | 'Technology'
  | 'Cinema'
  | 'Music'
  | 'Food'
  | 'Travel'
  | 'Gaming'
  | 'Comedy'
  | 'Explainer'
  | 'Culture';

export type ReactionType = 'like' | 'namaste' | 'fire' | 'heart' | 'laugh' | 'mindblown';

export interface ReactionCounts {
  like: number;
  namaste: number;
  fire: number;
  heart: number;
  laugh: number;
  mindblown: number;
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  isVerified: boolean;
  content: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
}

export interface VideoComment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  isVerified: boolean;
  content: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
  replies: CommentReply[];
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string; // e.g. "14:28"
  durationSeconds: number;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  isVerified: boolean;
  views: number;
  uploadedAt: string;
  category: VideoCategory;
  tags: string[];
  hashtags: string[];
  reactions: ReactionCounts;
  userReaction?: ReactionType;
  commentsCount: number;
  quality: string;
  isShort?: boolean;
  audioTitle?: string;
  audioArtist?: string;
  visibility: 'public' | 'unlisted' | 'private';
  allowComments: boolean;
  allowRemix: boolean;
  scheduledFor?: string;
}

export interface StoryItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'gradient';
  caption: string;
  createdAt: string;
  expiresAt: string;
  viewsCount: number;
  gradientBg?: string;
  textColor?: string;
  isViewed?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  isVerified: boolean;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'poll';
  pollOptions?: PollOption[];
  pollUserVotedOptionId?: string;
  totalVotes?: number;
  timestamp: string;
  likes: number;
  commentsCount: number;
  hasLiked?: boolean;
  sharesCount: number;
  tags: string[];
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  videoIds: string[];
  coverThumbnail?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // recipient
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'like' | 'reaction' | 'comment' | 'reply' | 'follow' | 'mention' | 'upload' | 'system';
  message: string;
  timestamp: string;
  isRead: boolean;
  targetId?: string; // videoId or postId
  targetType?: 'video' | 'short' | 'post' | 'profile';
  targetThumbnail?: string;
}

export interface CreatorAnalytics {
  totalViews: number;
  totalWatchHours: number;
  totalSubscribers: number;
  estimatedEarningsINR: number;
  viewsLast28Days: number;
  subscriberGrowthRate: number;
  topTrafficSources: { source: string; percentage: number }[];
  audienceDemographics: { region: string; percentage: number }[];
}

export interface ReportItem {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: 'video' | 'short' | 'comment' | 'post' | 'user';
  targetTitle: string;
  reason: string;
  details: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
