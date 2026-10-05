import React, { useState } from 'react';
import { X, Plus, FolderPlus, Check, Lock, Globe } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { useToast } from './Toast';
import { Playlist } from '../../types';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose, videoId }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => StorageService.getPlaylists());
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleToggleVideo = (pl: Playlist) => {
    const hasVideo = pl.videoIds.includes(videoId);
    let updatedVideoIds: string[];
    if (hasVideo) {
      updatedVideoIds = pl.videoIds.filter((id) => id !== videoId);
      showToast(`Removed from "${pl.title}"`, 'info');
    } else {
      updatedVideoIds = [...pl.videoIds, videoId];
      showToast(`Saved to "${pl.title}"`, 'success');
    }

    const updatedPlaylists = playlists.map((p) =>
      p.id === pl.id ? { ...p, videoIds: updatedVideoIds } : p
    );
    setPlaylists(updatedPlaylists);
    StorageService.savePlaylists(updatedPlaylists);
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPl: Playlist = {
      id: `pl_${Date.now()}`,
      userId: StorageService.getCurrentUser().id,
      title: newTitle.trim(),
      description: '',
      isPrivate,
      createdAt: 'Just now',
      videoIds: [videoId]
    };

    const updated = [newPl, ...playlists];
    setPlaylists(updated);
    StorageService.savePlaylists(updated);
    setNewTitle('');
    setIsCreating(false);
    showToast(`Created & added to "${newPl.title}"`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-brand text-base font-bold text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-amber-500" />
            Save to Playlist
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing playlists checkbox list */}
        <div className="my-4 max-h-56 overflow-y-auto space-y-2 pr-1">
          {playlists.map((pl) => {
            const isChecked = pl.videoIds.includes(videoId);
            return (
              <div
                key={pl.id}
                onClick={() => handleToggleVideo(pl)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 cursor-pointer border border-slate-700/50 transition select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                      isChecked
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'border-slate-600 bg-slate-900 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-white truncate">{pl.title}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      {pl.isPrivate ? (
                        <>
                          <Lock className="w-3 h-3 text-slate-500" /> Private
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3 text-slate-500" /> Public
                        </>
                      )}
                      <span>·</span>
                      <span>{pl.videoIds.length} videos</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create new playlist toggle */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 text-xs font-medium text-amber-400 hover:bg-amber-500/10 flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Create new playlist
          </button>
        ) : (
          <form onSubmit={handleCreatePlaylist} className="mt-3 pt-3 border-t border-slate-800 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Playlist Name</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g., Favorite Indian Beats"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Make Private</span>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded accent-amber-500 w-4 h-4"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="flex-1 py-1.5 rounded-xl bg-amber-500 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
