import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Flame,
  Heart,
  Laugh,
  Sparkles,
  Share2,
  FolderPlus,
  Download,
  ShieldAlert,
  CheckCircle2,
  Subtitles,
  Send,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoItem, ReactionType, VideoComment } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { ShareModal } from '../common/ShareModal';
import { PlaylistModal } from '../common/PlaylistModal';
import { ReportModal } from '../common/ReportModal';
import { VideoCard } from './VideoCard';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
  onSelectVideo: (video: VideoItem) => void;
  onCreatorClick?: (creatorId: string) => void;
  allVideos: VideoItem[];
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  onSelectVideo,
  onCreatorClick,
  allVideos
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [quality, setQuality] = useState('1080p (HD)');
  const [captionsOn, setCaptionsOn] = useState(false);
  const [doubleTapFeedback, setDoubleTapFeedback] = useState<'forward' | 'backward' | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Social states
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [reactionsCount, setReactionsCount] = useState({
    like: 0,
    namaste: 0,
    fire: 0,
    heart: 0,
    laugh: 0,
    mindblown: 0
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentSort, setCommentSort] = useState<'top' | 'newest'>('top');
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // Modals
  const [shareOpen, setShareOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (!video) return;

    // Load initial states
    setIsPlaying(true);
    setCurrentTime(0);
    setUserReaction(video.userReaction || null);
    setReactionsCount({ ...video.reactions });

    const followingList = StorageService.getFollowing();
    setIsFollowing(followingList.includes(video.creatorId));

    const allComments = StorageService.getComments();
    setComments(allComments[video.id] || []);

    // Record watch history
    StorageService.recordWatchHistory(video.id, 5);

    // Auto-hide controls timer
    let hideTimer: NodeJS.Timeout;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3500);
    };

    window.addEventListener('mousemove', resetTimer);
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      clearTimeout(hideTimer);
    };
  }, [video]);

  if (!video) return null;

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || video.durationSeconds || 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
    showToast(`Playback speed: ${speed}x`, 'info');
  };

  // Double tap seeking
  const handleDoubleTap = (side: 'left' | 'right') => {
    if (!videoRef.current) return;
    if (side === 'left') {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
      setDoubleTapFeedback('backward');
    } else {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
      setDoubleTapFeedback('forward');
    }
    setTimeout(() => setDoubleTapFeedback(null), 650);
  };

  // Reactions & Celebrations
  const handleReaction = (type: ReactionType) => {
    const wasSelected = userReaction === type;
    const newReactions = { ...reactionsCount };

    if (wasSelected) {
      newReactions[type] = Math.max(0, newReactions[type] - 1);
      setUserReaction(null);
    } else {
      if (userReaction) {
        newReactions[userReaction] = Math.max(0, newReactions[userReaction] - 1);
      }
      newReactions[type] += 1;
      setUserReaction(type);

      // Trigger celebratory micro-confetti on cultural/fire reactions
      if (type === 'namaste' || type === 'fire' || type === 'heart') {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#FF7A00', '#F59E0B', '#0D9488', '#E11D48']
        });
      }
      showToast(`Reacted with ${type.toUpperCase()}`, 'success');
    }

    setReactionsCount(newReactions);
  };

  const handleFollowToggle = () => {
    const nowFollowing = StorageService.toggleFollow(video.creatorId);
    setIsFollowing(nowFollowing);
    showToast(
      nowFollowing ? `Following ${video.creatorName}` : `Unfollowed ${video.creatorName}`,
      'info'
    );
  };

  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(10);
    showToast('Starting DRISHYAM offline download...', 'info');

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          showToast('Downloaded to offline storage successfully!', 'success');
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const user = StorageService.getCurrentUser();
    const commentItem: VideoComment = {
      id: `comm_${Date.now()}`,
      videoId: video.id,
      userId: user.id,
      userName: user.name,
      userHandle: user.username,
      userAvatar: user.avatar,
      isVerified: user.isVerified,
      content: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0,
      replies: []
    };

    StorageService.addComment(video.id, commentItem);
    setComments([commentItem, ...comments]);
    setNewCommentText('');
    showToast('Comment published', 'success');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;
    const user = StorageService.getCurrentUser();
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: `rep_${Date.now()}`,
              commentId,
              userId: user.id,
              userName: user.name,
              userHandle: user.username,
              userAvatar: user.avatar,
              isVerified: user.isVerified,
              content: replyText.trim(),
              timestamp: 'Just now',
              likes: 0
            }
          ]
        };
      }
      return c;
    });

    setComments(updated);
    const allComments = StorageService.getComments();
    allComments[video.id] = updated;
    localStorage.setItem(StorageService.getComments.name, JSON.stringify(allComments));
    setReplyText('');
    setReplyingToCommentId(null);
    showToast('Reply posted', 'success');
  };

  const upNextVideos = allVideos.filter((v) => v.id !== video.id).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] overflow-y-auto">
      {/* Top sticky exit bar on mobile */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-2 truncate pr-2">
          <span className="font-brand font-black text-amber-500 text-sm tracking-wider">DRISHYAM</span>
          <span className="text-slate-500 text-xs">/</span>
          <span className="text-xs text-slate-300 font-medium truncate">{video.title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close video player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player & Video Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Custom HTML5 Video Player Container */}
          <div
            ref={playerContainerRef}
            className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl group select-none"
            onMouseEnter={() => setShowControls(true)}
          >
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnail}
              autoPlay
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {/* Double Tap Seek Zones */}
            <div
              className="absolute inset-y-0 left-0 w-1/4 z-10"
              onDoubleClick={() => handleDoubleTap('left')}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/4 z-10"
              onDoubleClick={() => handleDoubleTap('right')}
            />

            {/* Double Tap Ripple Indicator */}
            {doubleTapFeedback && (
              <div
                className={`absolute top-1/2 -translate-y-1/2 z-20 px-4 py-3 rounded-2xl bg-black/75 backdrop-blur-md text-amber-400 font-bold text-sm flex items-center gap-1.5 animate-in fade-in zoom-in-75 duration-200 ${
                  doubleTapFeedback === 'backward' ? 'left-8' : 'right-8'
                }`}
              >
                <span>{doubleTapFeedback === 'backward' ? '◀◀ 10s' : '10s ▶▶'}</span>
              </div>
            )}

            {/* Captions Overlay Simulator */}
            {captionsOn && (
              <div className="absolute bottom-16 inset-x-8 z-20 text-center pointer-events-none">
                <span className="px-3 py-1.5 rounded-lg bg-black/85 text-xs sm:text-sm text-yellow-300 font-medium">
                  {currentTime < 5 ? '[Namaste and welcome back to DRISHYAM]' : '[Captions: Auto-generated Hindi / English Subtitles]'}
                </span>
              </div>
            )}

            {/* Player Controls Bar */}
            <div
              className={`absolute inset-x-0 bottom-0 z-30 p-2 sm:p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Seek Bar Slider */}
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Seek video slider"
                  className="video-seek-slider w-full h-1.5 rounded-full bg-slate-700/80 accent-amber-500"
                />
              </div>

              {/* Bottom Control Buttons Row */}
              <div className="flex items-center justify-between text-white text-xs">
                {/* Left controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1 rounded-lg hover:text-amber-400 transition"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <div className="flex items-center gap-1.5 group/vol">
                    <button onClick={toggleMute} className="p-1 hover:text-amber-400">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      aria-label="Volume slider"
                      className="w-16 h-1 accent-amber-500 bg-slate-700 rounded-full"
                    />
                  </div>

                  <span className="text-[11px] font-mono text-slate-300 tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 relative">
                  {/* Captions toggle */}
                  <button
                    onClick={() => {
                      setCaptionsOn(!captionsOn);
                      showToast(captionsOn ? 'Subtitles off' : 'Subtitles turned on', 'info');
                    }}
                    className={`p-1.5 rounded-lg transition ${
                      captionsOn ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Subtitles / Closed Captions"
                  >
                    <Subtitles className="w-4 h-4" />
                  </button>

                  {/* Settings popup */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
                      title="Playback settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {showSettingsMenu && (
                      <div className="absolute right-0 bottom-8 z-40 w-44 rounded-2xl bg-slate-900 border border-slate-700 p-2 text-xs shadow-2xl space-y-1">
                        <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500">Speed</div>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                          <button
                            key={spd}
                            onClick={() => handleSpeedChange(spd)}
                            className={`w-full text-left px-2 py-1 rounded-lg ${
                              playbackSpeed === spd ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {spd}x {spd === 1 && '(Normal)'}
                          </button>
                        ))}
                        <div className="h-px bg-slate-800 my-1" />
                        <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500">Quality</div>
                        {['4K Ultra HD', '1080p (HD)', '720p', '480p'].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setQuality(q);
                              setShowSettingsMenu(false);
                              showToast(`Quality set to ${q}`, 'info');
                            }}
                            className={`w-full text-left px-2 py-1 rounded-lg ${
                              quality === q ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
                    title="Fullscreen"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Metadata Header */}
          <div className="space-y-3">
            <h1 className="font-brand text-lg sm:text-xl font-bold text-white leading-snug">
              {video.title}
            </h1>

            {/* Zero-Pill Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 tabular-nums">
              <span>{video.views.toLocaleString()} views</span>
              <span aria-hidden="true">·</span>
              <span>{video.uploadedAt}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400/90 font-medium">#{video.category}</span>
            </div>

            {/* Creator Row & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-800">
              {/* Creator Card */}
              <div
                onClick={() => onCreatorClick?.(video.creatorId)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={video.creatorAvatar}
                  alt={video.creatorName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-amber-500 transition"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                      {video.creatorName}
                    </span>
                    {video.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">@{video.creatorHandle}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollowToggle();
                  }}
                  className={`ml-2 px-4 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
                    isFollowing
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      : 'bg-white text-slate-950 hover:bg-amber-400 hover:text-black shadow-md'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              {/* Action Buttons: Cultural Reactions, Share, Save */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Cultural Reactions Bar */}
                <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
                  <button
                    onClick={() => handleReaction('like')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      userReaction === 'like' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                    title="Like video"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{reactionsCount.like.toLocaleString()}</span>
                  </button>

                  <button
                    onClick={() => handleReaction('namaste')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      userReaction === 'namaste' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                    title="Namaste / Respect"
                  >
                    <span>🙏</span>
                    <span className="hidden sm:inline">{reactionsCount.namaste.toLocaleString()}</span>
                  </button>

                  <button
                    onClick={() => handleReaction('fire')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      userReaction === 'fire' ? 'bg-rose-500 text-white font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                    title="Fire"
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span className="hidden sm:inline">{reactionsCount.fire.toLocaleString()}</span>
                  </button>

                  <button
                    onClick={() => handleReaction('heart')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      userReaction === 'heart' ? 'bg-pink-500 text-white font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                    title="Love"
                  >
                    <Heart className="w-3.5 h-3.5 text-pink-500" />
                  </button>

                  <button
                    onClick={() => handleReaction('laugh')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      userReaction === 'laugh' ? 'bg-yellow-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                    title="Haha"
                  >
                    <Laugh className="w-3.5 h-3.5 text-yellow-500" />
                  </button>

                  <button
                    onClick={() => handleReaction('mindblown')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      userReaction === 'mindblown' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                    title="Mindblown"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => setShareOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Share</span>
                </button>

                {/* Save to Playlist */}
                <button
                  onClick={() => setPlaylistOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Save</span>
                </button>

                {/* Offline Download */}
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition"
                  title="Download for offline playback"
                >
                  <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce text-amber-400' : 'text-emerald-400'}`} />
                  <span>{isDownloading ? `${downloadProgress}%` : 'Download'}</span>
                </button>

                {/* Report button */}
                <button
                  onClick={() => setReportOpen(true)}
                  className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
                  title="Report video"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Description Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className={descriptionExpanded ? '' : 'line-clamp-2'}>
                {video.description}
              </p>

              {video.hashtags && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {video.hashtags.map((tag) => (
                    <span key={tag} className="text-amber-400 font-medium hover:underline cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                className="font-semibold text-slate-400 hover:text-white block pt-1"
              >
                {descriptionExpanded ? 'Show less' : '...more'}
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <h3 className="font-brand text-base font-bold text-white">
                  {comments.length} Comments
                </h3>
              </div>

              {/* Sort by */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setCommentSort('top')}
                  className={`px-2.5 py-1 rounded-lg ${
                    commentSort === 'top' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
                  }`}
                >
                  Top
                </button>
                <button
                  onClick={() => setCommentSort('newest')}
                  className={`px-2.5 py-1 rounded-lg ${
                    commentSort === 'newest' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
                  }`}
                >
                  Newest
                </button>
              </div>
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-3">
              <img
                src={StorageService.getCurrentUser().avatar}
                alt="Your Avatar"
                className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment on DRISHYAM..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs disabled:opacity-40 transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-4 pt-2">
              {comments.map((comm) => (
                <div key={comm.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <img
                      src={comm.userAvatar}
                      alt={comm.userName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">{comm.userName}</span>
                        {comm.isVerified && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                        <span className="text-[11px] text-slate-500 tabular-nums">{comm.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{comm.content}</p>

                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                        <button
                          onClick={() => {
                            const updated = comments.map((c) =>
                              c.id === comm.id
                                ? { ...c, likes: (c.likes || 0) + (c.hasLiked ? -1 : 1), hasLiked: !c.hasLiked }
                                : c
                            );
                            setComments(updated);
                          }}
                          className={`flex items-center gap-1 hover:text-white ${
                            comm.hasLiked ? 'text-amber-400 font-bold' : ''
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{comm.likes}</span>
                        </button>

                        <button
                          onClick={() =>
                            setReplyingToCommentId(replyingToCommentId === comm.id ? null : comm.id)
                          }
                          className="hover:text-white"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Reply Input Box */}
                      {replyingToCommentId === comm.id && (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            autoFocus
                            placeholder={`Reply to @${comm.userHandle}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                          <button
                            onClick={() => handleAddReply(comm.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                          >
                            Reply
                          </button>
                        </div>
                      )}

                      {/* Nested Replies */}
                      {comm.replies && comm.replies.length > 0 && (
                        <div className="mt-3 pl-3 border-l-2 border-slate-800 space-y-3">
                          {comm.replies.map((rep) => (
                            <div key={rep.id} className="flex items-start gap-2.5">
                              <img
                                src={rep.userAvatar}
                                alt={rep.userName}
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-800"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-semibold text-white">
                                    {rep.userName}
                                  </span>
                                  {rep.isVerified && <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400" />}
                                  <span className="text-[10px] text-slate-500 tabular-nums">
                                    {rep.timestamp}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 mt-0.5">{rep.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Up Next Recommended Videos */}
        <div className="space-y-3">
          <h3 className="font-brand text-sm font-bold text-slate-200">Up Next on DRISHYAM</h3>
          <div className="space-y-2">
            {upNextVideos.map((item) => (
              <VideoCard
                key={item.id}
                video={item}
                layout="horizontal"
                onSelect={(v) => {
                  onSelectVideo(v);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onCreatorClick={onCreatorClick}
              />
            ))}
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={video.title}
        thumbnail={video.thumbnail}
      />

      <PlaylistModal
        isOpen={playlistOpen}
        onClose={() => setPlaylistOpen(false)}
        videoId={video.id}
      />

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetId={video.id}
        targetTitle={video.title}
        targetType="video"
      />
    </div>
  );
};
