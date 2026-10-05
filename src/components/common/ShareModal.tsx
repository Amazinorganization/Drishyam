import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Share2 } from 'lucide-react';
import { useToast } from './Toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  thumbnail?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url = window.location.href,
  thumbnail
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Watch "${title}" on DRISHYAM`,
          url
        });
        showToast('Shared successfully!', 'success');
        onClose();
      } catch (err) {
        // User cancelled or share aborted
      }
    } else {
      handleCopyLink();
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`Watch "${title}" on DRISHYAM 🇮🇳\n${url}`);

  const shareTargets = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-500',
      action: () => window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank')
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-400',
      action: () => window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank')
    },
    {
      name: 'X (Twitter)',
      icon: Share2,
      color: 'bg-slate-800 hover:bg-slate-700',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank')
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-brand text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-500" />
            Share Content
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {thumbnail && (
          <div className="flex items-center gap-3 mt-4 p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <img
              src={thumbnail}
              alt={title}
              className="w-16 h-10 object-cover rounded-lg shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Styled fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <p className="text-xs font-medium text-slate-200 line-clamp-2">{title}</p>
          </div>
        )}

        {/* Quick Indian & Global Messaging Channels */}
        <div className="grid grid-cols-3 gap-3 my-5">
          {shareTargets.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={item.action}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition active:scale-95"
              >
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-300">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Copy Link Row */}
        <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-950 border border-slate-800">
          <input
            type="text"
            readOnly
            value={url}
            className="bg-transparent text-xs text-slate-400 focus:outline-none flex-1 truncate"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shrink-0 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full mt-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-amber-500" />
            More device sharing options...
          </button>
        )}
      </div>
    </div>
  );
};
