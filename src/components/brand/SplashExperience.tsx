import React, { useEffect, useState } from 'react';
import { DrishyamLogo } from './DrishyamLogo';

interface SplashExperienceProps {
  onComplete: () => void;
  minDurationMs?: number;
}

export const SplashExperience: React.FC<SplashExperienceProps> = ({
  onComplete,
  minDurationMs = 1200
}) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onComplete, 400);
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F19] transition-opacity duration-400 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl" />
      </div>

      <div className="relative flex flex-col items-center gap-6 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <DrishyamLogo size="xl" showText={false} />

        <div className="space-y-1.5">
          <h1 className="font-brand text-3xl sm:text-4xl font-black text-white tracking-tight">
            DRISHYAM
          </h1>
          <p className="text-xs text-amber-500/90 font-medium tracking-widest uppercase">
            India's Digital Video Ecosystem
          </p>
        </div>

        {/* Minimalist loading indicator */}
        <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full animate-[progress_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
