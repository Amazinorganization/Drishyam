import React from 'react';
import { Plus } from 'lucide-react';
import { StoryItem } from '../../types';
import { StorageService } from '../../services/storage';

interface StoriesBarProps {
  stories: StoryItem[];
  onSelectStory: (index: number) => void;
  onAddStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  onSelectStory,
  onAddStory
}) => {
  const currentUser = StorageService.getCurrentUser();

  return (
    <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-2 px-1 select-none">
      {/* Add Your Story Item */}
      <div
        onClick={onAddStory}
        className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
      >
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 border-2 border-dashed border-amber-500/60 group-hover:border-amber-400 transition">
          <img
            src={currentUser.avatar}
            alt="Your Story"
            className="w-full h-full rounded-full object-cover group-hover:scale-105 transition"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-md ring-2 ring-[#0B0F19]">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
        <span className="text-[11px] font-medium text-slate-300 max-w-[68px] truncate">
          Your Story
        </span>
      </div>

      {/* Story Rings */}
      {stories.map((story, index) => (
        <div
          key={story.id}
          onClick={() => onSelectStory(index)}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          {/* Gradient Ring representing unviewed vs viewed story */}
          <div
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
              story.isViewed
                ? 'bg-slate-700'
                : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 shadow-md shadow-amber-500/20'
            }`}
          >
            <div className="w-full h-full rounded-full bg-[#0B0F19] p-0.5">
              <img
                src={story.userAvatar}
                alt={story.userName}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-200 group-hover:text-amber-400 max-w-[68px] truncate text-center">
            {story.userName.split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  );
};
