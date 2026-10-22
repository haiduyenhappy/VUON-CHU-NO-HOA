import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface HoaNhoMascotProps {
  mood?: 'happy' | 'thinking' | 'praising' | 'encouraging';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  reducedMotion?: boolean;
  onTalk?: () => void;
}

export const HoaNhoMascot: React.FC<HoaNhoMascotProps> = ({
  mood = 'happy',
  message,
  size = 'md',
  reducedMotion = false,
  onTalk
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36'
  };

  return (
    <div className="flex items-end gap-3.5 select-none">
      {/* Mascot illustration */}
      <div 
        onClick={onTalk}
        className={`relative ${sizeClasses[size]} cursor-pointer group flex-shrink-0 transition-transform ${
          !reducedMotion ? 'hover:scale-105 active:scale-95 animate-bounce-gentle' : ''
        }`}
        title="Hoa Nhỏ - Người bạn đồng hành cùng em"
      >
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full bg-amber-300/40 blur-md -z-10 group-hover:bg-amber-400/50 transition-all" />

        {/* Flower SVG Character */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Flower Stem & Leaves */}
          <path d="M 50 72 Q 48 88 50 96" stroke="#22c55e" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 48 82 Q 32 78 30 84 Q 38 90 48 85" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" />
          <path d="M 52 80 Q 68 76 70 82 Q 62 88 52 83" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" />

          {/* Flower Petals */}
          <g fill="#fb7185" stroke="#e11d48" strokeWidth="1.5">
            {/* 6 cute rounded petals */}
            <circle cx="50" cy="22" r="14" />
            <circle cx="74" cy="36" r="14" />
            <circle cx="74" cy="62" r="14" />
            <circle cx="50" cy="74" r="14" />
            <circle cx="26" cy="62" r="14" />
            <circle cx="26" cy="36" r="14" />
          </g>

          {/* Flower Face Center */}
          <circle cx="50" cy="48" r="23" fill="#fef08a" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Rosy Cheeks */}
          <ellipse cx="38" cy="54" rx="4" ry="2.5" fill="#f43f5e" opacity="0.45" />
          <ellipse cx="62" cy="54" rx="4" ry="2.5" fill="#f43f5e" opacity="0.45" />

          {/* Eyes depending on mood */}
          {mood === 'happy' || mood === 'praising' ? (
            <>
              {/* Joyful curved eyes */}
              <path d="M 36 44 Q 40 39 44 44" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 56 44 Q 60 39 64 44" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* Curious looking-up eyes */}
              <circle cx="41" cy="42" r="3.2" fill="#451a03" />
              <circle cx="42" cy="41" r="1.2" fill="#ffffff" />
              <circle cx="61" cy="42" r="3.2" fill="#451a03" />
              <circle cx="62" cy="41" r="1.2" fill="#ffffff" />
            </>
          ) : (
            <>
              {/* Gentle open eyes */}
              <circle cx="40" cy="45" r="3.2" fill="#451a03" />
              <circle cx="41" cy="44" r="1.2" fill="#ffffff" />
              <circle cx="60" cy="45" r="3.2" fill="#451a03" />
              <circle cx="61" cy="44" r="1.2" fill="#ffffff" />
            </>
          )}

          {/* Friendly Smile */}
          <path d="M 43 53 Q 50 61 57 53" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Cute Little Dewdrop on petal */}
          <circle cx="70" cy="28" r="3" fill="#67e8f9" opacity="0.8" />
          <circle cx="71" cy="27" r="1" fill="#ffffff" />
        </svg>

        {/* Floating mini sparkles */}
        {!reducedMotion && (
          <div className="absolute -top-1 -right-1 text-amber-500 animate-pulse">
            <Sparkles className="w-5 h-5 drop-shadow" />
          </div>
        )}
      </div>

      {/* Speech bubble */}
      {message && (
        <div className="relative bg-white/95 backdrop-blur-sm border-2 border-amber-300 rounded-3xl rounded-bl-sm p-4 shadow-lg text-stone-800 text-sm sm:text-base max-w-sm sm:max-w-md md:max-w-lg leading-relaxed">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>Hoa Nhỏ nhắn bạn:</span>
          </div>
          <p className="font-medium text-stone-700">{message}</p>
        </div>
      )}
    </div>
  );
};
