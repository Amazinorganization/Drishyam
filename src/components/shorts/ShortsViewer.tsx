import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Disc3,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
  X,
  Send,
  MoreVertical,
  ShieldAlert,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoItem } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { ShareModal } from '../common/ShareModal';
import { ReportModal } from '../common/ReportModal';

interface ShortsViewerProps {
  shorts: VideoItem[];
  initialIndex?: number;
  onClose?: () => void;
  onCreatorClick?: (creatorId: string) => void;
}

export const ShortsViewer: React.FC<ShortsViewerProps> = ({
  shorts,
  initialIndex = 0,
  onClose,
  onCreatorClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likes, setLikes] = useState<Record<string, { count: number; hasLiked: boolean }>>({});
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { showToast } = useToast();

  const currentShort = shorts[currentIndex] || shorts[0];

  useEffect(() => {
    // Initialize likes and following for current short
    if (currentShort) {
      if (!likes[currentShort.id]) {
        setLikes((prev) => ({
          ...prev,
          [currentShort.id]: {
            count: currentShort.reactions.like,
            hasLiked: false
          }
        }));
      }

      const following = StorageService.getFollowing();
      setFollowingMap((prev) => ({
        ...prev,
        [currentShort.creatorId]: following.includes(currentShort.creatorId)
      }));

      // Load comments for current short
      const allComments = StorageService.getComments();
      setCommentsList(allComments[currentShort.id] || [
        {
          id: 'sc_1',
          userName: 'Rohan Deshmukh',
          userHandle: 'rohan_d',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          content: 'This represents authentic India so well! 🇮🇳🔥',
          timestamp: '2h ago',
          likes: 34
        }
      ]);

      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex, currentShort]);

  if (!currentShort) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        No shorts available
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop back to first
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = () => {
    const cur = likes[currentShort.id] || { count: currentShort.reactions.like, hasLiked: false };
    const hasLiked = !cur.hasLiked;
    const count = cur.count + (hasLiked ? 1 : -1);

    setLikes((prev) => ({
      ...prev,
      [currentShort.id]: { count, hasLiked }
    }));

    if (hasLiked) {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { x: 0.9, y: 0.6 },
        colors: ['#FF7A00', '#F59E0B', '#E11D48']
      });
      showToast('Liked Short!', 'success');
    }
  };

  const handleFollow = () => {
    const nowFollowing = StorageService.toggleFollow(currentShort.creatorId);
    setFollowingMap((prev) => ({
      ...prev,
      [currentShort.creatorId]: nowFollowing
    }));
    showToast(
      nowFollowing ? `Following ${currentShort.creatorName}` : `Unfollowed ${currentShort.creatorName}`,
      'info'
    );
  };

  const handleSaveToggle = () => {
    const saved = StorageService.toggleSaveVideo(currentShort.id);
    showToast(saved ? 'Saved to library' : 'Removed from library', 'success');
  };

  const handleAddShortComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const user = StorageService.getCurrentUser();
    const commentItem = {
      id: `sc_${Date.now()}`,
      userName: user.name,
      userHandle: user.username,
      userAvatar: user.avatar,
      content: newComment.trim(),
      timestamp: 'Just now',
      likes: 0
    };

    setCommentsList([commentItem, ...commentsList]);
    setNewComment('');
    showToast('Comment posted', 'success');
  };

  const currentLikeState = likes[currentShort.id] || {
    count: currentShort.reactions.like,
    hasLiked: false
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] sm:h-[85vh] max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden bg-black shadow-2xl flex items-center justify-center select-none">
      {/* 9:16 Video Player */}
      <video
        ref={videoRef}
        src={currentShort.videoUrl}
        poster={currentShort.thumbnail}
        autoPlay
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Top Header Scrim */}
      <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="font-brand font-black text-amber-500 text-sm tracking-wider">DRISHYAM</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
            SHORTS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/80"
              aria-label="Close Shorts"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Center Play/Pause indicator on click */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center pl-1 shadow-2xl">
            <Play className="w-8 h-8 fill-current" />
          </div>
        </div>
      )}

      {/* Right Action Bar (Ergonomic Thumb-Zone) */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4">
        {/* Like */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition ${
              currentLikeState.hasLiked
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40'
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <Heart className={`w-6 h-6 ${currentLikeState.hasLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-[11px] font-semibold text-white tabular-nums drop-shadow">
            {currentLikeState.count >= 1000
              ? `${(currentLikeState.count / 1000).toFixed(1)}K`
              : currentLikeState.count}
          </span>
        </button>

        {/* Comment Drawer Trigger */}
        <button
          onClick={() => setShowComments(true)}
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center backdrop-blur-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white tabular-nums drop-shadow">
            {commentsList.length}
          </span>
        </button>

        {/* Share */}
        <button
          onClick={() => setShareOpen(true)}
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center backdrop-blur-md">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white drop-shadow">Share</span>
        </button>

        {/* Save */}
        <button
          onClick={handleSaveToggle}
          className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center backdrop-blur-md">
            <Bookmark className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white drop-shadow">Save</span>
        </button>

        {/* More 3 dots */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center backdrop-blur-md"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-12 bottom-0 w-36 rounded-2xl bg-slate-900 border border-slate-700 p-1.5 text-xs text-slate-200 shadow-2xl z-30">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  showToast('Marked as Not Interested', 'info');
                }}
                className="w-full flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Not interested</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setReportOpen(true);
                }}
                className="w-full flex items-center gap-2 p-2 text-rose-400 hover:bg-rose-950/40 rounded-xl"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report Short</span>
              </button>
            </div>
          )}
        </div>

        {/* Spinning Vinyl Audio Badge */}
        <div className="w-11 h-11 rounded-full bg-slate-900 border-2 border-amber-500/80 flex items-center justify-center animate-[spin_4s_linear_infinite] mt-1 shadow-lg">
          <Disc3 className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      {/* Bottom Creator & Audio Details Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 pr-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-10 text-left space-y-2">
        {/* Creator Identity with 1-Tap Follow */}
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => onCreatorClick?.(currentShort.creatorId)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img
              src={currentShort.creatorAvatar}
              alt={currentShort.creatorName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition truncate">
              @{currentShort.creatorHandle}
            </span>
            {currentShort.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
          </div>

          <button
            onClick={handleFollow}
            className={`px-3 py-1 rounded-full text-xs font-bold transition active:scale-95 ${
              followingMap[currentShort.creatorId]
                ? 'bg-slate-800/90 text-slate-300'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
            }`}
          >
            {followingMap[currentShort.creatorId] ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Description & Hashtags */}
        <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
          {currentShort.description || currentShort.title}
        </p>

        {/* Audio Track Marquee */}
        <div className="flex items-center gap-2 text-[11px] text-amber-300/90">
          <Disc3 className="w-3 h-3 text-amber-400 shrink-0 animate-spin" />
          <span className="truncate">
            {currentShort.audioTitle || 'Original DRISHYAM Audio'} · {currentShort.audioArtist || currentShort.creatorName}
          </span>
        </div>
      </div>

      {/* Up/Down Navigation Buttons */}
      <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-2 z-20">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/90 disabled:opacity-30 backdrop-blur-sm"
          title="Previous Short"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm"
          title="Next Short"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Bottom Sheet Drawer */}
      {showComments && (
        <div className="absolute inset-x-0 bottom-0 top-1/3 z-30 bg-slate-900/95 border-t border-slate-700/80 rounded-t-3xl backdrop-blur-xl flex flex-col p-4 text-white animate-in slide-in-from-bottom duration-200">
          {/* Drag Handle */}
          <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mb-2" />

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold font-brand flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              Comments ({commentsList.length})
            </h3>
            <button onClick={() => setShowComments(false)} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Comment list */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
            {commentsList.map((comm) => (
              <div key={comm.id} className="flex items-start gap-2.5">
                <img
                  src={comm.userAvatar}
                  alt={comm.userName}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <span className="font-semibold text-white">{comm.userName}</span>
                    <span>·</span>
                    <span>{comm.timestamp}</span>
                  </div>
                  <p className="text-slate-200 text-xs mt-0.5">{comm.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment form */}
          <form onSubmit={handleAddShortComment} className="pt-2 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Add a comment on this Short..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={currentShort.title}
        thumbnail={currentShort.thumbnail}
      />

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetId={currentShort.id}
        targetTitle={currentShort.title}
        targetType="short"
      />
    </div>
  );
};
