import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Heart,
  MessageSquare,
  UserPlus,
  Sparkles,
  Video
} from 'lucide-react';
import { AppNotification, VideoItem } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onSelectVideo: (videoId: string) => void;
  onSelectCreator: (creatorId: string) => void;
  onRefresh: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectVideo,
  onSelectCreator,
  onRefresh
}) => {
  const [filter, setFilter] = useState<'all' | 'comments' | 'follows' | 'system'>('all');
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    StorageService.markNotificationsRead();
    onRefresh();
    showToast('All notifications marked as read', 'info');
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'comments') return n.type === 'comment' || n.type === 'reply';
    if (filter === 'follows') return n.type === 'follow';
    if (filter === 'system') return n.type === 'system';
    return true;
  });

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'like':
      case 'reaction':
        return <Heart className="w-4 h-4 text-rose-500 fill-current" />;
      case 'comment':
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-cyan-400" />;
      case 'system':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div id="notificationsPage" className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-brand text-base font-bold text-white">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="p-1.5 text-xs text-slate-400 hover:text-white flex items-center gap-1 rounded-lg hover:bg-slate-800"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              <span>Mark all</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-2 bg-slate-950 border-b border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'comments', label: 'Comments' },
            { id: 'follows', label: 'Follows' },
            { id: 'system', label: 'DRISHYAM' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                filter === tab.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.targetId && item.targetType === 'video') {
                    onSelectVideo(item.targetId);
                    onClose();
                  } else if (item.senderId) {
                    onSelectCreator(item.senderId);
                    onClose();
                  }
                }}
                className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition ${
                  item.isRead
                    ? 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/50'
                    : 'bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30'
                }`}
              >
                <div className="relative shrink-0 mt-0.5">
                  <img
                    src={item.senderAvatar}
                    alt={item.senderName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 flex items-center justify-center">
                    {getIcon(item.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <p className="text-slate-200 leading-snug">
                    <strong className="font-bold text-white">{item.senderName} </strong>
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Bell className="w-10 h-10 mx-auto text-slate-600 mb-1" />
              <p className="text-sm font-semibold text-white">No notifications right now</p>
              <p className="text-xs text-slate-500">We will notify you when creators upload or interact.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
