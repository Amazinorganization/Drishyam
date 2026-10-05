import React, { useState } from 'react';
import {
  MoreVertical,
  Clock,
  FolderPlus,
  Share2,
  EyeOff,
  ShieldAlert,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { VideoItem } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { ShareModal } from '../common/ShareModal';
import { PlaylistModal } from '../common/PlaylistModal';
import { ReportModal } from '../common/ReportModal';

interface VideoCardProps {
  video: VideoItem;
  onSelect: (video: VideoItem) => void;
  onCreatorClick?: (creatorId: string) => void;
  layout?: 'grid' | 'horizontal';
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelect,
  onCreatorClick,
  layout = 'grid'
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { showToast } = useToast();

  if (hidden) return null;

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const handleWatchLater = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    const added = StorageService.addVideoToPlaylist('pl_watchlater', video.id);
    if (added) {
      showToast('Added to Watch Later', 'success');
    } else {
      showToast('Already in Watch Later', 'info');
    }
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    const saved = StorageService.toggleSaveVideo(video.id);
    showToast(saved ? 'Saved to your Library' : 'Removed from Saved', 'success');
  };

  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setHidden(true);
    showToast('Video hidden from recommendations', 'info');
  };

  if (layout === 'horizontal') {
    return (
      <div
        onClick={() => onSelect(video)}
        className="group flex gap-3 p-2 rounded-2xl hover:bg-slate-800/50 cursor-pointer transition select-none"
      >
        {/* Thumbnail */}
        <div className="relative w-36 sm:w-44 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/85 text-[10px] font-mono text-white font-semibold">
            {video.duration}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-400 line-clamp-2 transition-colors">
              {video.title}
            </h4>
            <p
              onClick={(e) => {
                e.stopPropagation();
                onCreatorClick?.(video.creatorId);
              }}
              className="text-[11px] text-slate-400 hover:text-white mt-1 flex items-center gap-1 cursor-pointer truncate"
            >
              <span>{video.creatorName}</span>
              {video.isVerified && <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 tabular-nums">
            <span>{formatViews(video.views)} views</span>
            <span aria-hidden="true">·</span>
            <span>{video.uploadedAt}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => onSelect(video)}
        className="group relative flex flex-col rounded-2xl overflow-hidden bg-slate-900/60 dark:bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/40"
      >
        {/* Thumbnail Aspect 16:9 */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* Quality tag top left */}
          {video.quality && (
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-amber-400 tracking-wider">
              {video.quality}
            </div>
          )}

          {/* Duration tag bottom right */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-sm text-[11px] font-mono text-white font-semibold">
            {video.duration}
          </div>
        </div>

        {/* Video Card Body */}
        <div className="p-3 sm:p-3.5 flex items-start gap-3">
          {/* Creator Avatar */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onCreatorClick?.(video.creatorId);
            }}
            className="relative shrink-0 cursor-pointer group/avatar"
          >
            <img
              src={video.creatorAvatar}
              alt={video.creatorName}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700 group-hover/avatar:ring-amber-500 transition-all"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pr-1">
            <h3 className="text-sm font-semibold text-slate-100 group-hover:text-amber-400 line-clamp-2 leading-snug transition-colors">
              {video.title}
            </h3>

            <div
              onClick={(e) => {
                e.stopPropagation();
                onCreatorClick?.(video.creatorId);
              }}
              className="mt-1 flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer truncate"
            >
              <span className="truncate">{video.creatorName}</span>
              {video.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-label="Verified" />
              )}
            </div>

            {/* Zero-Pill Unboxed Metadata with Typographic Separator */}
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 tabular-nums">
              <span>{formatViews(video.views)} views</span>
              <span aria-hidden="true">·</span>
              <span>{video.uploadedAt}</span>
            </div>
          </div>

          {/* 3-Dots Action Trigger with ≥ 44px Touch Target */}
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              aria-label="Video actions"
              className="min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Popover */}
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                />
                <div className="absolute right-0 top-10 z-50 w-48 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={handleWatchLater}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition"
                  >
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Watch later</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      setPlaylistOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition"
                  >
                    <FolderPlus className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Add to playlist</span>
                  </button>

                  <button
                    onClick={handleSaveToggle}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition"
                  >
                    <Bookmark className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Save to library</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      setShareOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition"
                  >
                    <Share2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Share</span>
                  </button>

                  <div className="h-px bg-slate-800 my-1" />

                  <button
                    onClick={handleHide}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left text-slate-400 hover:text-slate-200 transition"
                  >
                    <EyeOff className="w-4 h-4 shrink-0" />
                    <span>Not interested</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      setReportOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-950/40 text-left text-rose-400 transition"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Report video</span>
                  </button>
                </div>
              </>
            )}
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
    </>
  );
};
