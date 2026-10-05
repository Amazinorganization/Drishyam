import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  CheckCircle2,
  MoreVertical,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CommunityPost } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';
import { ShareModal } from '../common/ShareModal';

interface CommunityPostCardProps {
  post: CommunityPost;
  onCreatorClick?: (creatorId: string) => void;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  onCreatorClick
}) => {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
  const [selectedPollOption, setSelectedPollOption] = useState<string | null>(
    post.pollUserVotedOptionId || null
  );
  const [pollOptions, setPollOptions] = useState(post.pollOptions || []);
  const [totalVotes, setTotalVotes] = useState(post.totalVotes || 0);
  const [shareOpen, setShareOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const { showToast } = useToast();

  const handleLike = () => {
    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);
    setLikes((prev) => prev + (nextLiked ? 1 : -1));

    if (nextLiked) {
      confetti({
        particleCount: 15,
        spread: 35,
        origin: { y: 0.8 },
        colors: ['#FF7A00', '#F59E0B']
      });
      showToast('Liked post!', 'success');
    }
  };

  const handleVote = (optionId: string) => {
    if (selectedPollOption) return; // already voted

    const updatedOptions = pollOptions.map((opt) =>
      opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    );

    setSelectedPollOption(optionId);
    setPollOptions(updatedOptions);
    setTotalVotes((prev) => prev + 1);

    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.7 },
      colors: ['#0D9488', '#FF7A00', '#F59E0B']
    });
    showToast('Vote submitted!', 'success');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([newComment.trim(), ...comments]);
    setNewComment('');
    showToast('Comment added', 'success');
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 sm:p-5 text-slate-100 shadow-md space-y-3.5">
      {/* Post Author Header */}
      <div className="flex items-center justify-between">
        <div
          onClick={() => onCreatorClick?.(post.userId)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-amber-500 transition"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                {post.userName}
              </span>
              {post.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>@{post.userHandle}</span>
              <span aria-hidden="true">·</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        <button className="p-1.5 rounded-full text-slate-400 hover:text-white">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Post Body Content */}
      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {/* Attached Media / Image */}
      {post.mediaType === 'image' && post.mediaUrl && (
        <div className="rounded-xl overflow-hidden bg-slate-950 aspect-video max-h-96">
          <img
            src={post.mediaUrl}
            alt="Post media"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Interactive Poll */}
      {post.mediaType === 'poll' && pollOptions.length > 0 && (
        <div className="space-y-2 pt-1">
          {pollOptions.map((opt) => {
            const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            const isSelected = selectedPollOption === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                className={`relative overflow-hidden rounded-xl border p-3 cursor-pointer select-none transition ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-800 bg-slate-950/70 hover:bg-slate-800/60'
                }`}
              >
                {/* Progress bar background */}
                {selectedPollOption && (
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                      isSelected ? 'bg-amber-500/25' : 'bg-slate-800/50'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium text-slate-200 flex items-center gap-2">
                    {isSelected && <Check className="w-4 h-4 text-amber-400 stroke-[3]" />}
                    {opt.text}
                  </span>
                  {selectedPollOption && (
                    <span className="font-mono font-bold text-amber-400 tabular-nums">
                      {percentage}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          <p className="text-[11px] text-slate-400 font-mono text-right tabular-nums pt-0.5">
            {totalVotes.toLocaleString()} votes
          </p>
        </div>
      )}

      {/* Tags */}
      {post.tags && (
        <div className="flex flex-wrap gap-2 text-xs">
          {post.tags.map((t) => (
            <span key={t} className="text-amber-400 hover:underline cursor-pointer">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Interaction Footer Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition ${
              hasLiked ? 'text-rose-500 font-bold' : 'hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
            <span className="tabular-nums">{likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="tabular-nums">{post.commentsCount + comments.length}</span>
          </button>
        </div>

        <button
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-1.5 hover:text-white transition"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Drawer / Area */}
      {showComments && (
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Post
            </button>
          </form>

          {comments.map((c, i) => (
            <div key={i} className="text-xs text-slate-300 p-2 rounded-xl bg-slate-950/60">
              <span className="font-semibold text-white">You: </span>
              {c}
            </div>
          ))}
        </div>
      )}

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={post.content}
      />
    </div>
  );
};
