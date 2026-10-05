import React, { useState } from 'react';
import {
  CheckCircle2,
  Share2,
  Edit3,
  Calendar,
  Link as LinkIcon,
  Video,
  Smartphone,
  FileText,
  Bookmark,
  Heart,
  Clock,
  Lock,
  MessageCircle,
  MoreVertical,
  ShieldAlert
} from 'lucide-react';
import { UserProfile, VideoItem, CommunityPost, StoryItem, Playlist } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { ShareModal } from '../common/ShareModal';
import { VideoCard } from '../video/VideoCard';
import { CommunityPostCard } from '../posts/CommunityPostCard';
import { EditProfileModal } from './EditProfileModal';
import { ReportModal } from '../common/ReportModal';

interface ProfileViewProps {
  user: UserProfile;
  videos: VideoItem[];
  shorts: VideoItem[];
  posts: CommunityPost[];
  playlists: Playlist[];
  onSelectVideo: (video: VideoItem) => void;
  onUpdateUser: (updated: UserProfile) => void;
  isCurrentUser: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  videos,
  shorts,
  posts,
  playlists,
  onSelectVideo,
  onUpdateUser,
  isCurrentUser
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'posts' | 'saved' | 'about'>('videos');
  const [isFollowing, setIsFollowing] = useState(() =>
    StorageService.getFollowing().includes(user.id)
  );
  const [followersCount, setFollowersCount] = useState(user.followersCount);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const { showToast } = useToast();

  const handleFollowToggle = () => {
    const nextFollowing = StorageService.toggleFollow(user.id);
    setIsFollowing(nextFollowing);
    setFollowersCount((prev) => prev + (nextFollowing ? 1 : -1));
    showToast(nextFollowing ? `Following @${user.username}` : `Unfollowed @${user.username}`, 'info');
  };

  const userVideos = videos.filter((v) => v.creatorId === user.id);
  const userShorts = shorts.filter((s) => s.creatorId === user.id);
  const userPosts = posts.filter((p) => p.userId === user.id);

  return (
    <div id="profilePage" className="max-w-5xl mx-auto space-y-6 pb-12 select-none">
      {/* Cover Header Image */}
      <div className="relative w-full h-40 sm:h-64 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80" />

        {/* Share & Report action buttons top right */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setShareModalOpen(true)}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition"
            title="Share profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {!isCurrentUser && (
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-slate-300 hover:text-rose-400 transition"
              title="Report user"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Profile Info Bar */}
      <div className="px-4 sm:px-6 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        {/* Avatar & Identifiers */}
        <div className="flex items-end gap-4">
          <div className="relative">
            <img
              id="profilePic"
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-[#0B0F19] shadow-2xl bg-slate-900"
              referrerPolicy="no-referrer"
            />
            {user.isCreator && (
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase shadow-md">
                CREATOR
              </span>
            )}
          </div>

          <div className="pb-1">
            <div className="flex items-center gap-2">
              <h1 id="profileName" className="font-brand text-xl sm:text-2xl font-bold text-white leading-tight">
                {user.name}
              </h1>
              {user.isVerified && (
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" aria-label="Verified creator" />
              )}
            </div>
            <p id="profileUsername" className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Profile Action Buttons */}
        <div className="flex items-center gap-2.5">
          {isCurrentUser ? (
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-white border border-slate-700 transition"
            >
              <Edit3 className="w-4 h-4 text-amber-500" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition active:scale-95 ${
                  isFollowing
                    ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>

              <button
                onClick={() => showToast('Direct Messaging arriving in V2.0!', 'info')}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
                title="Message"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bio & Unboxed Metadata */}
      <div className="px-4 sm:px-6 space-y-3">
        <p id="profileBio" className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
          {user.bio}
        </p>

        {/* Quantitative Rigor Stats & Metas */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400 tabular-nums">
          <span id="followers">
            <strong className="text-white font-bold">{followersCount.toLocaleString()}</strong> followers
          </span>
          <span aria-hidden="true">·</span>
          <span id="following">
            <strong className="text-white font-bold">{user.followingCount}</strong> following
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-white font-bold">{userVideos.length}</strong> videos
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-white font-bold">{userShorts.length}</strong> Shorts
          </span>
        </div>

        {/* Joined date & Links */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{user.joinedDate}</span>
          </div>

          {user.links.website && (
            <a
              href={user.links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-500 hover:underline"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>{user.links.website.replace('https://', '')}</span>
            </a>
          )}
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div className="px-4 sm:px-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'videos', label: `Videos (${userVideos.length})`, icon: Video },
            { id: 'shorts', label: `Shorts (${userShorts.length})`, icon: Smartphone },
            { id: 'posts', label: `Posts (${userPosts.length})`, icon: FileText },
            ...(isCurrentUser ? [{ id: 'saved', label: 'Playlists & Saved', icon: Bookmark }] : []),
            { id: 'about', label: 'About', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        <div className="py-6">
          {/* VIDEOS TAB */}
          {activeTab === 'videos' && (
            userVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userVideos.map((vid) => (
                  <VideoCard
                    key={vid.id}
                    video={vid}
                    onSelect={onSelectVideo}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400">
                <Video className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-white">No long-form videos published yet</p>
                <p className="text-xs text-slate-500 mt-1">Upload long-form 4K videos through Creator Studio.</p>
              </div>
            )
          )}

          {/* SHORTS TAB */}
          {activeTab === 'shorts' && (
            userShorts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {userShorts.map((sh) => (
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
            ) : (
              <div className="py-16 text-center text-slate-400">
                <Smartphone className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-white">No Shorts uploaded yet</p>
              </div>
            )
          )}

          {/* POSTS TAB */}
          {activeTab === 'posts' && (
            userPosts.length > 0 ? (
              <div className="space-y-4 max-w-2xl">
                {userPosts.map((post) => (
                  <CommunityPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-white">No community posts yet</p>
              </div>
            )
          )}

          {/* SAVED & PLAYLISTS TAB (For current user) */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <h3 className="font-brand text-base font-bold text-white">Your Playlists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {playlists.map((pl) => (
                  <div
                    key={pl.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                      {pl.coverThumbnail ? (
                        <img
                          src={pl.coverThumbnail}
                          alt={pl.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Bookmark className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white">
                        {pl.videoIds.length} videos
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white truncate">{pl.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        {pl.isPrivate ? <Lock className="w-3 h-3" /> : null}
                        <span>{pl.isPrivate ? 'Private' : 'Public'}</span>
                        <span>·</span>
                        <span>{pl.createdAt}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="max-w-2xl rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4 text-xs text-slate-300">
              <h3 className="font-brand text-base font-bold text-white">Channel Details</h3>
              <p className="leading-relaxed">{user.bio}</p>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Views Across Content:</span>
                  <span className="font-mono font-bold text-white">2.8M views</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Joined Platform:</span>
                  <span className="text-white">{user.joinedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verification Tier:</span>
                  <span className="text-cyan-400 font-bold">DRISHYAM Verified Partner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Country:</span>
                  <span className="text-white">India 🇮🇳</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={`${user.name} on DRISHYAM`}
        url={`https://drishyam.in/@${user.username}`}
      />

      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
        onSave={(updated) => {
          onUpdateUser(updated);
          setEditModalOpen(false);
        }}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetId={user.id}
        targetTitle={user.name}
        targetType="user"
      />
    </div>
  );
};
