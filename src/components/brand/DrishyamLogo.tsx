import React from 'react';

interface DrishyamLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const DrishyamLogo: React.FC<DrishyamLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', badge: 'text-[11px]' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', badge: 'text-xs' }
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`}
      role="banner"
      aria-label="DRISHYAM Home"
    >
      {/* Aperture Iris Mandala Icon */}
      <div className={`relative ${currentSize.icon} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,122,0,0.35)]">
          <defs>
            <linearGradient id="logoSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5722" />
              <stop offset="50%" stopColor="#FF8F00" />
              <stop offset="100%" stopColor="#FFA000" />
            </linearGradient>
            <linearGradient id="logoCenter" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Outer Lens Ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#logoSaffron)" strokeWidth="6" />

          {/* Dynamic Shutter Blades (Aperture) */}
          <path d="M50 12 L72 32 L58 48 Z" fill="url(#logoSaffron)" opacity="0.95" />
          <path d="M88 50 L68 72 L52 58 Z" fill="url(#logoSaffron)" opacity="0.9" />
          <path d="M50 88 L28 68 L42 52 Z" fill="url(#logoSaffron)" opacity="0.95" />
          <path d="M12 50 L32 28 L48 42 Z" fill="url(#logoSaffron)" opacity="0.9" />

          {/* Vision Core (Pupil + Play Triangle) */}
          <circle cx="50" cy="50" r="19" fill="#0B0F19" stroke="url(#logoCenter)" strokeWidth="2.5" />
          <polygon points="46,42 46,58 60,50" fill="#FFFFFF" />

          {/* Saffron spark */}
          <circle cx="70" cy="24" r="3.5" fill="#FFD700" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-brand font-black tracking-tight text-white dark:text-white ${currentSize.text}`}>
              DRISHYAM
            </span>
            <span className="font-semibold text-amber-500 tracking-wider text-[11px] uppercase">
              BHARAT
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
