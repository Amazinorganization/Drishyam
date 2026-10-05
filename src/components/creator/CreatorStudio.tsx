import React, { useState } from 'react';
import {
  TrendingUp,
  Eye,
  Clock,
  Users,
  Award,
  DollarSign,
  Video,
  Trash2,
  Edit,
  Plus,
  ArrowUpRight,
  Sparkles,
  PieChart
} from 'lucide-react';
import { VideoItem, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { useToast } from '../common/Toast';

interface CreatorStudioProps {
  user: UserProfile;
  videos: VideoItem[];
  onUploadClick: () => void;
  onSelectVideo: (video: VideoItem) => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  user,
  videos,
  onUploadClick,
  onSelectVideo
}) => {
  const [creatorVideos, setCreatorVideos] = useState<VideoItem[]>(() =>
    videos.filter((v) => v.creatorId === user.id)
  );
  const { showToast } = useToast();

  const totalViews = creatorVideos.reduce((acc, v) => acc + v.views, 0);
  const totalWatchHours = Math.round(totalViews * 0.12);
  const subscribersGoal = 1000;
  const watchHoursGoal = 4000;

  const handleDeleteVideo = (id: string, title: string) => {
    const updated = creatorVideos.filter((v) => v.id !== id);
    setCreatorVideos(updated);
    const all = StorageService.getVideos().filter((v) => v.id !== id);
    StorageService.saveVideos(all);
    showToast(`Removed "${title}" from your channel`, 'info');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4 py-2 select-none">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-brand text-xl font-bold text-white">DRISHYAM Creator Studio</h1>
            <p className="text-xs text-slate-400">
              Channel Analytics & Content Management for @{user.username}
            </p>
          </div>
        </div>

        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Upload</span>
        </button>
      </div>

      {/* Quantitative Rigor: Key Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Views</span>
            <Eye className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-mono text-2xl font-bold text-white tabular-nums">
            {totalViews.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            +18.4% this month
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Watch Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="font-mono text-2xl font-bold text-white tabular-nums">
            {totalWatchHours.toLocaleString()} hrs
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            +22.1% this month
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Followers</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="font-mono text-2xl font-bold text-white tabular-nums">
            {user.followersCount.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            Active Creator
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Est. Creator Fund</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
            ₹34,250
          </p>
          <p className="text-[10px] text-slate-500">
            Prototype Preview (Simulated)
          </p>
        </div>
      </div>

      {/* DRISHYAM Partner Program Monetization Meter (Section 24) */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-brand text-base font-bold text-white">
              DRISHYAM Bharat Partner Program Eligibility
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            Tier 1 Qualified 🇮🇳
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Followers progress */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Followers: {user.followersCount.toLocaleString()}</span>
              <span className="text-amber-400 font-mono">100% Complete</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 w-full" />
            </div>
            <p className="text-[11px] text-slate-500">Requires 1,000 followers minimum (Met)</p>
          </div>

          {/* Watch hours progress */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Watch Hours: {totalWatchHours.toLocaleString()}</span>
              <span className="text-cyan-400 font-mono">
                {Math.min(100, Math.round((totalWatchHours / watchHoursGoal) * 100))}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((totalWatchHours / watchHoursGoal) * 100))}%`
                }}
              />
            </div>
            <p className="text-[11px] text-slate-500">Requires 4,000 public watch hours (Met)</p>
          </div>
        </div>
      </div>

      {/* Traffic Sources & Analytics breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="font-brand font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-500" />
            Traffic Sources
          </h4>
          <div className="space-y-2 pt-1">
            {[
              { source: 'DRISHYAM Search', pct: 44, color: 'bg-amber-500' },
              { source: 'Shorts Vertical Feed', pct: 28, color: 'bg-rose-500' },
              { source: 'Suggested & Up Next', pct: 18, color: 'bg-cyan-500' },
              { source: 'Direct & Social Shares', pct: 10, color: 'bg-emerald-500' }
            ].map((item) => (
              <div key={item.source} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{item.source}</span>
                  <span className="font-mono font-bold">{item.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="font-brand font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Audience Demographics
          </h4>
          <div className="space-y-2.5 pt-1">
            {[
              { region: 'India (Tier 1 & Metros)', pct: 52 },
              { region: 'India (Tier 2 & Emerging Towns)', pct: 36 },
              { region: 'Global Indian Diaspora (NRI)', pct: 12 }
            ].map((demo) => (
              <div key={demo.region} className="flex justify-between items-center p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-300">{demo.region}</span>
                <span className="font-mono font-bold text-white">{demo.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Management Table */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-brand text-base font-bold text-white">Your Uploaded Content</h3>

        {creatorVideos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Video</th>
                  <th className="pb-3">Visibility</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Views</th>
                  <th className="pb-3 text-right">Comments</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {creatorVideos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 pr-4">
                      <div
                        onClick={() => onSelectVideo(vid)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="w-16 h-10 object-cover rounded-lg shrink-0 bg-slate-950"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white group-hover:text-amber-400 transition truncate max-w-xs">
                            {vid.title}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">{vid.duration}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-slate-300 capitalize">{vid.visibility}</td>
                    <td className="py-3 text-slate-400">{vid.uploadedAt}</td>
                    <td className="py-3 text-right font-mono text-white tabular-nums">
                      {vid.views.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-white tabular-nums">
                      {vid.commentsCount}
                    </td>

                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteVideo(vid.id, vid.title)}
                        className="p-1.5 rounded-lg hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition"
                        title="Delete video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">
            <Video className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-white">No videos uploaded yet</p>
            <button
              onClick={onUploadClick}
              className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Upload Your First Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
