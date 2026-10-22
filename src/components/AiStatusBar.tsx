import React from 'react';
import { Sparkles } from 'lucide-react';

interface AiStatusBarProps {
  isLoading: boolean;
  message: string;
  reducedMotion?: boolean;
}

export const AiStatusBar: React.FC<AiStatusBarProps> = ({
  isLoading,
  message,
  reducedMotion = false
}) => {
  if (!isLoading) return null;

  return (
    <div className="w-full my-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-sky-100 border-2 border-purple-300 shadow-md animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl animate-pulse">🌸</span>
          <span className="text-xs sm:text-sm font-black text-purple-950 font-display">
            {message}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-purple-700 font-bold">
          <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
          <span className="hidden sm:inline">Đang xử lý</span>
        </div>
      </div>

      {/* Animated glowing progress bar */}
      <div className="w-full h-2.5 bg-white/80 rounded-full overflow-hidden p-0.5 border border-purple-200">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400 ${
            !reducedMotion ? 'animate-pulse' : ''
          }`}
          style={{
            width: '100%',
            animationDuration: '1.4s'
          }}
        />
      </div>
    </div>
  );
};
