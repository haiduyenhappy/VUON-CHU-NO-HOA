import React from 'react';
import { HoaNhoMascot } from './HoaNhoMascot';
import { AppSettings, Student } from '../types';
import { playPop } from '../utils/audio';
import { getHomeGreeting } from '../utils/timeGreeting';
import { 
  Sparkles, 
  GraduationCap, 
  Heart, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

interface GardenSceneProps {
  students: Student[];
  settings: AppSettings;
  onNavigateToLogin: (role: 'student' | 'teacher' | 'family') => void;
  onOpenReadingGarden: () => void;
}

export const GardenScene: React.FC<GardenSceneProps> = ({
  students,
  settings,
  onNavigateToLogin,
  onOpenReadingGarden
}) => {
  const homeGreeting = getHomeGreeting();

  const handleStudentGateClick = () => {
    playPop(settings.soundEnabled);
    onNavigateToLogin('student');
  };

  const handleTeacherGateClick = () => {
    playPop(settings.soundEnabled);
    onNavigateToLogin('teacher');
  };

  const handleFamilyGateClick = () => {
    playPop(settings.soundEnabled);
    onNavigateToLogin('family');
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] overflow-hidden bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Decorative fairy garden background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        {/* Soft Sun */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-200/50 rounded-full blur-2xl" />
        <div className="absolute top-6 right-16 w-16 h-16 bg-amber-300 rounded-full shadow-inner opacity-70 animate-pulse" />

        {/* Rainbow Arch */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] border-[16px] border-transparent border-t-rose-200/40 border-r-amber-200/30 border-l-sky-200/40 rounded-t-full pointer-events-none" />

        {/* Floating Clouds */}
        <div className="absolute top-10 left-12 bg-white/70 backdrop-blur-xs px-6 py-3 rounded-full shadow-xs text-xs text-sky-700 font-bold hidden md:flex items-center gap-2">
          <span>☁️ Lớp 3 – Trường Tiểu học Lê Đức Thọ</span>
        </div>

        {/* Animated Butterflies (if motion enabled) */}
        {!settings.reducedMotion && (
          <>
            <div className="absolute top-36 left-[15%] text-2xl animate-float-slow opacity-85 select-none">
              🦋
            </div>
            <div className="absolute top-44 right-[20%] text-xl animate-float-reverse opacity-80 select-none">
              🦋
            </div>
            <div className="absolute top-64 left-[75%] text-lg animate-float-slow opacity-75 select-none">
              🐝
            </div>
          </>
        )}

        {/* Rolling Green Hills at bottom */}
        <div className="absolute -bottom-10 -left-20 -right-20 h-44 bg-gradient-to-t from-emerald-300/60 to-emerald-200/30 rounded-t-[100%] pointer-events-none" />
        <div className="absolute -bottom-16 -left-10 -right-10 h-36 bg-gradient-to-t from-emerald-400/50 to-emerald-300/40 rounded-t-[80%] pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-6xl mx-auto w-full my-auto py-4">
        {/* Header Greeting Banner */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold shadow-xs mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>MỖI EM MỘT Ý TƯỞNG – MỖI BÀI VIẾT MỘT SẮC MÀU</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-emerald-950 font-display tracking-tight drop-shadow-xs mb-2">
            VƯỜN CHỮ NỞ HOA 🌸
          </h1>

          <p className="text-base sm:text-lg text-emerald-800/90 font-medium max-w-2xl mx-auto">
            Không gian rèn luyện viết văn tương tác, nuôi dưỡng cảm xúc và khơi nguồn sáng tạo cho học sinh lớp 3
          </p>
        </div>

        {/* Hoa Nhỏ Welcome Character */}
        <div className="max-w-2xl mx-auto mb-8 flex justify-center">
          <HoaNhoMascot
            mood="happy"
            size="md"
            reducedMotion={settings.reducedMotion}
            message={homeGreeting}
          />
        </div>

        {/* The Three Portal Gates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {/* Gate 1: GÓC CỦA EM */}
          <div
            onClick={handleStudentGateClick}
            className="group relative bg-gradient-to-b from-white to-amber-50/90 rounded-3xl p-6 sm:p-7 border-3 border-amber-300 hover:border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="absolute -top-4 left-6 bg-amber-500 text-white font-extrabold text-xs px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cánh cổng 1</span>
            </div>

            <div>
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                ✏️
              </div>
              <h2 className="text-2xl font-black text-amber-950 mb-2 font-display">
                GÓC CỦA EM
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                Dành cho học sinh: Tìm ý cùng Hoa Nhỏ, lập dàn ý thông minh, tự tay viết đoạn văn, nhận hoa thưởng và ngắm cây lớn lên!
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between">
              <span className="text-sm font-extrabold text-amber-800">Em vào học viết ngay</span>
              <div className="w-9 h-9 rounded-full bg-amber-400 group-hover:bg-amber-500 text-amber-950 flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Gate 2: GÓC GIÁO VIÊN */}
          <div
            onClick={handleTeacherGateClick}
            className="group relative bg-gradient-to-b from-white to-emerald-50/90 rounded-3xl p-6 sm:p-7 border-3 border-emerald-300 hover:border-emerald-400 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="absolute -top-4 left-6 bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Cánh cổng 2</span>
            </div>

            <div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                👩‍🏫
              </div>
              <h2 className="text-2xl font-black text-emerald-950 mb-2 font-display">
                GÓC GIÁO VIÊN
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                Dành cho giáo viên: Quản lý học sinh, soạn và giao bài tập, xem bài làm, nhận xét, theo dõi tiến bộ và trao đổi với phụ huynh.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-200/60 flex items-center justify-between">
              <span className="text-sm font-extrabold text-emerald-800">Vào lớp quản lý</span>
              <div className="w-9 h-9 rounded-full bg-emerald-400 group-hover:bg-emerald-500 text-emerald-950 flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Gate 3: GÓC GIA ĐÌNH */}
          <div
            onClick={handleFamilyGateClick}
            className="group relative bg-gradient-to-b from-white to-rose-50/90 rounded-3xl p-6 sm:p-7 border-3 border-rose-300 hover:border-rose-400 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="absolute -top-4 left-6 bg-rose-500 text-white font-extrabold text-xs px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              <span>Cánh cổng 3</span>
            </div>

            <div>
              <div className="w-16 h-16 rounded-2xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🏡
              </div>
              <h2 className="text-2xl font-black text-rose-950 mb-2 font-display">
                GÓC GIA ĐÌNH
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                Dành cho bố mẹ: Đồng hành cùng con, xem bài viết và sự tiến bộ từng ngày, đọc lời khen của cô giáo và gợi ý trò chuyện cùng con.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-200/60 flex items-center justify-between">
              <span className="text-sm font-extrabold text-rose-800">Bố mẹ vào xem bài của con</span>
              <div className="w-9 h-9 rounded-full bg-rose-400 group-hover:bg-rose-500 text-rose-950 flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quick Feature Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold">
          <button
            onClick={onOpenReadingGarden}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-emerald-900 border border-emerald-300 shadow-xs hover:shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Vườn đọc thú vị (Bài văn tham khảo lớp 3)</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 text-amber-900 border border-amber-300 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>{students.length} Học sinh Lớp 3 • 32 Nhiệm vụ viết Tiếng Việt 3</span>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <footer className="relative z-10 text-center py-2 text-xs text-stone-500 font-medium">
        Trường Tiểu học Lê Đức Thọ • Ứng dụng Vườn Chữ Nở Hoa • Đồng hành phát triển năng lực viết văn Tiếng Việt 3
      </footer>
    </div>
  );
};
