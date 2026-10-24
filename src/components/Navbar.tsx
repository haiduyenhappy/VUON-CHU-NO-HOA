import React from 'react';
import { Volume2, VolumeX, Sparkles, Home, BookOpen, Trees, Map, Edit3, Heart } from 'lucide-react';
import { AppSettings, Student, AuthUser } from '../types';
import { TEACHER_CONFIG } from '../constants/teacherConfig';

export type AppView = 
  | 'home' 
  | 'student' 
  | 'teacher' 
  | 'family' 
  | 'reading_garden' 
  | 'idea_map' 
  | 'essay_feedback'
  | 'progress_journey'
  | 'admin_system'
  | 'login-student'
  | 'login-teacher'
  | 'login-family';

interface NavbarProps {
  currentRole: AppView;
  currentUser: AuthUser | null;
  activeStudent: Student | null;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  onOpenProgressModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  activeStudent,
  settings,
  onUpdateSettings,
  onNavigate,
  onLogout,
  onOpenProgressModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Logo and Slogan */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Về Trang chủ Vườn Chữ Nở Hoa"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-400 to-sky-400 p-0.5 shadow-sm group-hover:rotate-6 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl">
              🌸
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-purple-950 tracking-tight font-display">
                Trợ Lí Tập Làm Văn AI
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                Vườn Chữ Nở Hoa
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-purple-800/80 font-medium hidden md:block">
              Mỗi em một ý tưởng – Mỗi bài viết một sắc màu
            </p>
          </div>
        </div>

        {/* Center: Direct Navigation Tabs for Trang 1, Trang 2, Thư viện, Tiến bộ */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
          {/* Trang 1: Bản đồ ý tưởng */}
          <button
            onClick={() => onNavigate('idea_map')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentRole === 'idea_map'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
            title="Trang 1: Bản đồ ý tưởng - Khơi nguồn ý tưởng và lập dàn ý"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Bản đồ ý tưởng</span>
          </button>

          {/* Trang 2: Cô góp ý bài văn */}
          <button
            onClick={() => onNavigate('essay_feedback')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentRole === 'essay_feedback'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-pink-50 text-pink-900 hover:bg-pink-100 border border-pink-200'
            }`}
            title="Trang 2: Cô góp ý bài văn - Đọc chữ viết tay, nhận xét và trao đổi"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Cô góp ý bài văn</span>
          </button>

          {/* Thư viện bài tập / Vườn đọc thú vị */}
          <button
            onClick={() => onNavigate('reading_garden')}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentRole === 'reading_garden'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-900 hover:bg-sky-100 border border-sky-200'
            }`}
            title="Thư viện bài tập & Vườn đọc thú vị"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Thư viện bài đọc</span>
          </button>

          {/* Tiến bộ của con */}
          {activeStudent && (
            <button
              onClick={onOpenProgressModal}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              title="Xem cây hoa và tiến bộ của em"
            >
              <Trees className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Tiến bộ</span>
              <span className="text-[11px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                {activeStudent.flowersEarned} 🌸
              </span>
            </button>
          )}
        </nav>

        {/* Right: Quick Controls (Sound, Motion, Privacy, Home) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-1.5 sm:p-2 rounded-full border transition-colors ${
              settings.soundEnabled
                ? 'bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200'
                : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
            }`}
            title={settings.soundEnabled ? 'Âm thanh: Đang BẬT' : 'Âm thanh: Đang TẮT'}
            aria-label="Bật tắt âm thanh"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
            className={`p-1.5 sm:p-2 rounded-full border transition-colors hidden sm:flex ${
              settings.reducedMotion
                ? 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200'
                : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
            }`}
            title={settings.reducedMotion ? 'Chuyển động: Đã giảm' : 'Chuyển động: Sinh động'}
            aria-label="Giảm hiệu ứng chuyển động"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* User session status badge and Logout */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 ml-1">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200 max-w-[200px] sm:max-w-[340px]">
                {currentUser.role === 'student' && (
                  <span className="truncate">
                    {activeStudent?.avatar || '🌸'} HS: {activeStudent?.name || 'Học sinh'}
                  </span>
                )}
                {currentUser.role === 'teacher' && (
                  <span className="truncate flex items-center gap-1">
                    {currentUser.teacherRole === 'SUPER_ADMIN' ? (
                      <span className="text-amber-700 font-black">👑 Quản trị: {currentUser.teacherName || TEACHER_CONFIG.name}</span>
                    ) : (
                      <span>👩‍🏫 GV: {currentUser.teacherName || TEACHER_CONFIG.name}</span>
                    )}
                  </span>
                )}
                {currentUser.role === 'family' && (
                  <span className="truncate" title={currentUser.parentName || currentUser.caregiver?.name ? `PH: ${currentUser.parentName || currentUser.caregiver?.name} (Phụ huynh của: ${activeStudent?.name || 'con'})` : `Phụ huynh của: ${activeStudent?.name || 'con'}`}>
                    🏡 PH: {currentUser.parentName || currentUser.caregiver?.name || (activeStudent ? `Phụ huynh của: ${activeStudent.name}` : 'Gia đình')}
                    {(currentUser.parentName || currentUser.caregiver?.name) && activeStudent?.name ? ` (Phụ huynh của: ${activeStudent.name})` : ''}
                  </span>
                )}
              </div>
              {currentUser.teacherRole === 'SUPER_ADMIN' && (
                <button
                  onClick={() => onNavigate(currentRole === 'admin_system' ? 'teacher' : 'admin_system')}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer shadow-xs"
                  title="Chuyển đổi giữa Trang Quản trị hệ thống và Lớp học của tôi"
                >
                  {currentRole === 'admin_system' ? '👩‍🏫 Về lớp tôi' : '👑 Quản trị HT'}
                </button>
              )}
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 transition-colors whitespace-nowrap cursor-pointer"
                title="Đăng xuất khỏi phiên làm việc"
              >
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            currentRole !== 'home' && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors ml-0.5"
                title="Về Cổng chính Vườn Chữ Nở Hoa"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Trang chủ</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
