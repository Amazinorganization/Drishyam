import React, { useState } from 'react';
import {
  X,
  Upload,
  Video,
  Smartphone,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoCategory, VideoItem, CommunityPost, StoryItem } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContentCreated: () => void;
  defaultTab?: 'video' | 'short' | 'post' | 'story';
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onContentCreated,
  defaultTab = 'video'
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'short' | 'post' | 'story'>(defaultTab);

  // Video/Short form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoCategory>('Technology');
  const [language, setLanguage] = useState('Hindi & English (Bilingual)');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [allowComments, setAllowComments] = useState(true);
  const [allowRemix, setAllowRemix] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoFileUrl, setVideoFileUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Post form state
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'image' | 'poll'>('text');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);

  // Story form state
  const [storyCaption, setStoryCaption] = useState('');
  const [storyGradient, setStoryGradient] = useState('from-amber-600 via-rose-700 to-indigo-900');

  const { showToast } = useToast();

  if (!isOpen) return null;

  const CATEGORIES: VideoCategory[] = [
    'Technology',
    'Cinema',
    'Music',
    'Food',
    'Travel',
    'Gaming',
    'Comedy',
    'Explainer',
    'Culture'
  ];

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockUrl = URL.createObjectURL(file);
      setVideoFileUrl(mockUrl);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      showToast(`Selected file: ${file.name}`, 'info');
    }
  };

  const handlePublishVideo = (isShortVideo = false) => {
    if (!title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    // Simulate multi-stage upload & video processing
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          const currentUser = StorageService.getCurrentUser();
          const newVideo: VideoItem = {
            id: `vid_custom_${Date.now()}`,
            title: title.trim(),
            description: description.trim() || 'Uploaded via DRISHYAM Creator Studio',
            videoUrl: videoFileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnail:
              thumbnailUrl.trim() ||
              'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
            duration: isShortVideo ? '0:45' : '12:30',
            durationSeconds: isShortVideo ? 45 : 750,
            creatorId: currentUser.id,
            creatorName: currentUser.name,
            creatorHandle: currentUser.username,
            creatorAvatar: currentUser.avatar,
            isVerified: currentUser.isVerified,
            views: 1,
            uploadedAt: 'Just now',
            category: category,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            hashtags: ['#Drishyam', `#${category}`],
            reactions: { like: 1, namaste: 0, fire: 0, heart: 0, laugh: 0, mindblown: 0 },
            commentsCount: 0,
            quality: '1080p 60fps',
            isShort: isShortVideo,
            visibility: visibility,
            allowComments: allowComments,
            allowRemix: allowRemix
          };

          if (isShortVideo) {
            const allShorts = StorageService.getShorts();
            StorageService.saveShorts([newVideo, ...allShorts]);
          } else {
            StorageService.addVideo(newVideo);
          }

          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FF7A00', '#0D9488', '#F59E0B']
          });

          showToast(
            isShortVideo ? 'Short published successfully! 🚀' : 'Video published to DRISHYAM! 🚀',
            'success'
          );
          onContentCreated();
          onClose();
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handlePublishPost = () => {
    if (!postContent.trim()) {
      showToast('Please write some content', 'error');
      return;
    }

    const currentUser = StorageService.getCurrentUser();
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userHandle: currentUser.username,
      userAvatar: currentUser.avatar,
      isVerified: currentUser.isVerified,
      content: postContent.trim(),
      mediaType: postType === 'poll' ? 'poll' : postImageUrl ? 'image' : undefined,
      mediaUrl: postImageUrl.trim() || undefined,
      pollOptions:
        postType === 'poll'
          ? pollOptions.map((opt, i) => ({ id: `opt_${i}`, text: opt, votes: 0 }))
          : undefined,
      totalVotes: postType === 'poll' ? 0 : undefined,
      timestamp: 'Just now',
      likes: 1,
      commentsCount: 0,
      sharesCount: 0,
      tags: ['Community', 'Bharat']
    };

    StorageService.addPost(newPost);
    showToast('Post shared with your community!', 'success');
    onContentCreated();
    onClose();
  };

  const handlePublishStory = () => {
    if (!storyCaption.trim()) {
      showToast('Please add a caption for your story', 'error');
      return;
    }

    const currentUser = StorageService.getCurrentUser();
    const newStory: StoryItem = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      mediaUrl: '',
      mediaType: 'gradient',
      gradientBg: storyGradient,
      caption: storyCaption.trim(),
      createdAt: 'Just now',
      expiresAt: 'In 24 hours',
      viewsCount: 1,
      isViewed: false
    };

    StorageService.addStory(newStory);
    showToast('Story published for 24 hours! 🌟', 'success');
    onContentCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="font-brand text-lg font-bold text-white">DRISHYAM Creator Studio</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/80 border-b border-slate-800/80 shrink-0">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'video'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Upload Video</span>
          </button>

          <button
            onClick={() => setActiveTab('short')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'short'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Upload Short</span>
          </button>

          <button
            onClick={() => setActiveTab('post')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'post'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Create Post</span>
          </button>

          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'story'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Add Story</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* TAB 1 & 2: Video or Short Upload */}
          {(activeTab === 'video' || activeTab === 'short') && (
            <div className="space-y-4">
              {/* Dropzone */}
              <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-2xl p-6 text-center bg-slate-950/50 transition cursor-pointer group">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleSimulatedFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-200">
                  {videoFileUrl ? 'Video file selected (Tap to replace)' : 'Select video to upload'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  MP4, WebM or MOV up to 4K resolution · H.264 / AV1 hardware accelerated
                </p>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  {activeTab === 'short' ? 'Short Title / Hook' : 'Video Title *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g., Revolutionizing Solar Microgrids in Rural Rajasthan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  placeholder="Tell viewers what this video is about, timestamps, credits, and links..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Category & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VideoCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Audio Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Hindi & English (Bilingual)">Hindi & English (Bilingual)</option>
                    <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                    <option value="English (Global)">English (Global)</option>
                    <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                    <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                    <option value="Bengali (বাংলা)">Bengali (বাংলা)</option>
                    <option value="Marathi (मराठी)">Marathi (मराठी)</option>
                  </select>
                </div>
              </div>

              {/* Custom Thumbnail URL */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Custom Thumbnail Image URL (optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or leave blank for auto frame"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Audience & Settings */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-200">Visibility</p>
                    <p className="text-[11px] text-slate-400">Choose who can view this content</p>
                  </div>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                  >
                    <option value="public">Public (Everyone)</option>
                    <option value="unlisted">Unlisted (Link only)</option>
                    <option value="private">Private (Only you)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span className="text-slate-300">Allow Comments</span>
                  <input
                    type="checkbox"
                    checked={allowComments}
                    onChange={(e) => setAllowComments(e.target.checked)}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span className="text-slate-300">Allow Remix & Shorts Audio</span>
                  <input
                    type="checkbox"
                    checked={allowRemix}
                    onChange={(e) => setAllowRemix(e.target.checked)}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                </div>
              </div>

              {/* Upload Progress Indicator */}
              {isUploading && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-amber-400">
                    <span>Transcoding 4K Stream & Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Community Post Creator */}
          {activeTab === 'post' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPostType('text')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                    postType === 'text'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'border-slate-700 bg-slate-950 text-slate-300'
                  }`}
                >
                  Text Post
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('image')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                    postType === 'image'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'border-slate-700 bg-slate-950 text-slate-300'
                  }`}
                >
                  Image Post
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('poll')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                    postType === 'poll'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'border-slate-700 bg-slate-950 text-slate-300'
                  }`}
                >
                  Interactive Poll
                </button>
              </div>

              <textarea
                rows={4}
                placeholder="Share an announcement, opinion, or question with your DRISHYAM community..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
              />

              {postType === 'image' && (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={postImageUrl}
                    onChange={(e) => setPostImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {postType === 'poll' && (
                <div className="space-y-2">
                  <label className="font-semibold text-slate-300">Poll Options</label>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...pollOptions];
                          updated[idx] = e.target.value;
                          setPollOptions(updated);
                        }}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                          className="p-2 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {pollOptions.length < 5 && (
                    <button
                      type="button"
                      onClick={() => setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`])}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add option
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Story Creator */}
          {activeTab === 'story' && (
            <div className="space-y-4">
              <div
                className={`w-full h-44 rounded-2xl bg-gradient-to-br ${storyGradient} flex items-center justify-center p-6 text-center shadow-inner`}
              >
                <p className="font-brand text-lg font-bold text-white drop-shadow">
                  {storyCaption || 'Your 24-Hour Story Preview'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Story Text / Mood</label>
                <input
                  type="text"
                  placeholder="e.g., Live recording starts in 10 minutes! 🪕✨"
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-2">Select Theme Gradient</label>
                <div className="flex gap-2.5">
                  {[
                    'from-amber-600 via-rose-700 to-indigo-900',
                    'from-emerald-600 via-teal-700 to-slate-950',
                    'from-purple-600 via-pink-600 to-amber-600',
                    'from-blue-600 via-indigo-700 to-slate-950'
                  ].map((grad) => (
                    <button
                      key={grad}
                      type="button"
                      onClick={() => setStoryGradient(grad)}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} border-2 transition ${
                        storyGradient === grad ? 'border-white scale-110' : 'border-transparent opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-800 flex justify-end gap-2.5 shrink-0 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
          >
            Cancel
          </button>

          {activeTab === 'video' && (
            <button
              type="button"
              disabled={isUploading}
              onClick={() => handlePublishVideo(false)}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition"
            >
              Publish Video
            </button>
          )}

          {activeTab === 'short' && (
            <button
              type="button"
              disabled={isUploading}
              onClick={() => handlePublishVideo(true)}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition"
            >
              Publish Short
            </button>
          )}

          {activeTab === 'post' && (
            <button
              type="button"
              onClick={handlePublishPost}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              Publish Post
            </button>
          )}

          {activeTab === 'story' && (
            <button
              type="button"
              onClick={handlePublishStory}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              Publish Story
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
