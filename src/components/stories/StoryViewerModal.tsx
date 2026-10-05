import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StoryItem } from '../../types';
import { useToast } from '../common/Toast';

interface StoryViewerModalProps {
  stories: StoryItem[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { showToast } = useToast();

  const currentStory = stories[currentIndex];
  const storyDurationMs = 5000;
  const progressInterval = 50;

  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + (progressInterval / storyDurationMs) * 100;
      });
    }, progressInterval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, stories.length, onClose]);

  if (!currentStory) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReaction = (emoji: string) => {
    confetti({
      particleCount: 15,
      spread: 30,
      origin: { y: 0.8 },
      colors: ['#FF7A00', '#F59E0B', '#E11D48']
    });
    showToast(`Sent ${emoji} to ${currentStory.userName}`, 'success');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    showToast(`Reply sent to ${currentStory.userName}`, 'success');
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Story container max phone size */}
      <div
        className="relative w-full h-full sm:max-w-sm sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Media Background */}
        {currentStory.mediaType === 'image' && currentStory.mediaUrl ? (
          <img
            src={currentStory.mediaUrl}
            alt={currentStory.caption}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              currentStory.gradientBg || 'from-amber-600 via-rose-700 to-indigo-900'
            } flex items-center justify-center p-8 text-center`}
          >
            <p className="font-brand text-2xl sm:text-3xl font-bold text-white leading-relaxed drop-shadow-md">
              {currentStory.caption}
            </p>
          </div>
        )}

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* Top Segmented Progress Bar */}
        <div className="relative z-20 p-3 pt-4 flex flex-col gap-2.5">
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-75"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Creator Profile in Story Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.userName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-xs font-bold text-white drop-shadow">
                  {currentStory.userName}
                </span>
                <span className="text-[10px] text-slate-300 ml-2 drop-shadow">
                  {currentStory.createdAt}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white bg-black/30 backdrop-blur-sm"
              aria-label="Close story viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Left/Right Tap Navigation Zones */}
        <div
          onClick={handlePrev}
          className="absolute inset-y-16 left-0 w-1/3 z-10 cursor-pointer"
        />
        <div
          onClick={handleNext}
          className="absolute inset-y-16 right-0 w-1/3 z-10 cursor-pointer"
        />

        {/* Bottom Story Caption & Reply Input */}
        <div className="relative z-20 p-4 space-y-3">
          {currentStory.mediaType === 'image' && currentStory.caption && (
            <p className="text-xs sm:text-sm text-white font-medium drop-shadow bg-black/40 backdrop-blur-md p-2.5 rounded-xl">
              {currentStory.caption}
            </p>
          )}

          {/* Quick Reaction Emojis */}
          <div className="flex items-center gap-3 justify-center py-1">
            {['🙏', '🔥', '❤️', '👏', '😍'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-lg hover:scale-125 transition-transform flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Reply to ${currentStory.userName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full bg-black/60 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 backdrop-blur-md"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2 rounded-full bg-amber-500 text-slate-950 font-bold disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
