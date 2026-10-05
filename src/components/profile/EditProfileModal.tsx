import React, { useState } from 'react';
import { X, Save, Trash2, Camera, Shield, Globe } from 'lucide-react';
import { UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);
  const [coverImage, setCoverImage] = useState(user.coverImage);
  const [website, setWebsite] = useState(user.links.website || '');
  const [isPrivate, setIsPrivate] = useState(user.isPrivate);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      showToast('Name and username are required', 'error');
      return;
    }

    const updated: UserProfile = {
      ...user,
      name: name.trim(),
      username: username.trim().replace(/^@/, ''),
      bio: bio.trim(),
      avatar: avatar.trim() || user.avatar,
      coverImage: coverImage.trim() || user.coverImage,
      isPrivate,
      links: {
        ...user.links,
        website: website.trim() || undefined
      }
    };

    StorageService.updateCurrentUser(updated);
    onSave(updated);
    showToast('Profile updated successfully!', 'success');
  };

  const handleDeleteAccount = () => {
    StorageService.resetAllData();
    showToast('Account data reset to demo mode', 'info');
    window.location.reload();
  };

  return (
    <div id="editPage" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <h3 className="font-brand text-base font-bold text-white">Edit DRISHYAM Profile</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Display Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Display Name</label>
            <input
              id="editName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Username (@handle)</label>
            <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 px-3">
              <span className="text-slate-500 font-mono">@</span>
              <input
                id="editUsername"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-2.5 px-1 bg-transparent text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Bio / About You</label>
            <textarea
              id="editBio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Avatar URL */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Profile Picture URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <img
                src={avatar || user.avatar}
                alt="Preview"
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Cover Header Image URL</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Website Link */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Website / Portfolio Link</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Private Account</p>
              <p className="text-[11px] text-slate-400">Only approved followers can see your posts and videos</p>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="pt-2 border-t border-slate-800">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-rose-500 hover:text-rose-400 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account & Reset Local Data</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-800/60 space-y-2">
                <p className="text-xs text-rose-300 font-semibold">
                  Are you sure? This will reset all your demo videos, followers and data.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
