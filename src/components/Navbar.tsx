import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Home, BookOpen, Trees, Map, Edit3, Heart, Menu, X, LogOut, Shield } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (view: AppView) => {
    setIsMobileMenuOpen(false);
    onNavigate(view);
  };

  const handleMobileLogout = () => {
    setIsMobileMenuOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        {/* Logo and Slogan */}
        <div 
          onClick={() => handleMobileNav('home')} 
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          title="Về Trang chủ Vườn Chữ Nở Hoa"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-400 to-sky-400 p-0.5 shadow-sm group-hover:rotate-6 transition-transform shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl">
              🌸
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-base sm:text-lg text-purple-950 tracking-tight font-display whitespace-nowrap">
                Trợ Lí Tập Làm Văn AI
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200 whitespace-nowrap">
                Vườn Chữ Nở Hoa – Cùng Em Viết Văn Sáng Tạo
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-purple-800/80 font-medium hidden md:block truncate">
              Mỗi em một ý tưởng – Mỗi bài viết một sắc màu
            </p>
          </div>
        </div>

        {/* Desktop Center: Direct Navigation Tabs (hidden on mobile, visible on lg screens) */}
        <nav className="hidden lg:flex items-center gap-1.5 py-0.5">
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
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentRole === 'reading_garden'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-900 hover:bg-sky-100 border border-sky-200'
            }`}
            title="Thư viện bài tập & Vườn đọc thú vị"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Thư viện bài đọc</span>
          </button>

          {/* Tiến bộ của con */}
          {activeStudent && (
            <button
              onClick={onOpenProgressModal}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              title="Xem cây hoa và tiến bộ của em"
            >
              <Trees className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tiến bộ</span>
              <span className="text-[11px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                {activeStudent.flowersEarned} 🌸
              </span>
            </button>
          )}
        </nav>

        {/* Desktop Right Controls (hidden on mobile, visible on lg) */}
        <div className="hidden lg:flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-2 rounded-full border transition-colors ${
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
            className={`p-2 rounded-full border transition-colors ${
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
              <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200 max-w-[280px]">
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
                  </span>
                )}
              </div>
              {currentUser.teacherRole === 'SUPER_ADMIN' && (
                <button
                  onClick={() => onNavigate(currentRole === 'admin_system' ? 'teacher' : 'admin_system')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer shadow-xs"
                  title="Chuyển đổi giữa Trang Quản trị hệ thống và Lớp học của tôi"
                >
                  {currentRole === 'admin_system' ? '👩‍🏫 Về lớp tôi' : '👑 Quản trị HT'}
                </button>
              )}
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 transition-colors whitespace-nowrap cursor-pointer"
                title="Đăng xuất khỏi phiên làm việc"
              >
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            currentRole !== 'home' && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors ml-0.5"
                title="Về Cổng chính Vườn Chữ Nở Hoa"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </button>
            )
          )}
        </div>

        {/* Mobile Quick Controls Bar (< lg) */}
        <div className="flex lg:hidden items-center gap-1.5 shrink-0">
          {/* Quick Sound Toggle on Mobile */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl border transition-colors ${
              settings.soundEnabled
                ? 'bg-pink-100 text-pink-800 border-pink-300'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
            title={settings.soundEnabled ? 'Âm thanh: Đang BẬT' : 'Âm thanh: Đang TẮT'}
            aria-label="Bật tắt âm thanh"
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl border-2 border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 active:scale-95 transition-all"
            aria-label={isMobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            title="Menu điều hướng"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-purple-900" /> : <Menu className="w-6 h-6 text-purple-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu (< lg) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-pink-200 bg-white/98 backdrop-blur-md px-4 py-4 space-y-4 shadow-lg animate-fade-in max-h-[calc(100vh-70px)] overflow-y-auto">
          {/* User Profile Card on Mobile */}
          {currentUser ? (
            <div className="p-3.5 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border border-purple-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl shrink-0">
                  {currentUser.role === 'student' ? (activeStudent?.avatar || '🎒') : currentUser.role === 'teacher' ? '👩‍🏫' : '🏡'}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {currentUser.role === 'student' ? 'Học sinh lớp 3' : currentUser.role === 'teacher' ? (currentUser.teacherRole === 'SUPER_ADMIN' ? '👑 Quản trị viên' : 'Giáo viên lớp') : 'Phụ huynh học sinh'}
                  </div>
                  <div className="font-extrabold text-sm text-stone-900 truncate">
                    {currentUser.role === 'student' && (activeStudent?.name || 'Học sinh')}
                    {currentUser.role === 'teacher' && (currentUser.teacherName || TEACHER_CONFIG.name)}
                    {currentUser.role === 'family' && (currentUser.parentName || currentUser.caregiver?.name || (activeStudent ? `PH em ${activeStudent.name}` : 'Phụ huynh'))}
                  </div>
                </div>
              </div>

              {activeStudent && (
                <div className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black">
                  {activeStudent.flowersEarned} 🌸
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-pink-50/70 rounded-2xl border border-pink-200 text-xs text-pink-900 font-bold flex items-center gap-2">
              <span>🌸</span>
              <span>Vườn Chữ Nở Hoa – Cùng Em Viết Văn Sáng Tạo</span>
            </div>
          )}

          {/* Navigation Links (Minimum 44px height for mobile touch targets) */}
          <div className="space-y-1.5">
            <button
              onClick={() => handleMobileNav('home')}
              className={`w-full min-h-[46px] px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-3 transition-colors ${
                currentRole === 'home'
                  ? 'bg-purple-600 text-white'
                  : 'bg-stone-50 text-stone-800 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Trang chủ Vườn Chữ</span>
            </button>

            <button
              onClick={() => handleMobileNav('idea_map')}
              className={`w-full min-h-[46px] px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-3 transition-colors ${
                currentRole === 'idea_map'
                  ? 'bg-purple-600 text-white'
                  : 'bg-stone-50 text-stone-800 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Map className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div>Bản đồ ý tưởng</div>
                <div className="text-[11px] font-normal text-stone-500">Trang 1 • Khơi nguồn ý tưởng và lập dàn ý</div>
              </div>
            </button>

            <button
              onClick={() => handleMobileNav('essay_feedback')}
              className={`w-full min-h-[46px] px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-3 transition-colors ${
                currentRole === 'essay_feedback'
                  ? 'bg-pink-600 text-white'
                  : 'bg-stone-50 text-stone-800 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Edit3 className="w-5 h-5 text-pink-600" />
              <div className="text-left">
                <div>Cô góp ý bài văn</div>
                <div className="text-[11px] font-normal text-stone-500">Trang 2 • Đọc chữ viết tay, nhận xét và trao đổi</div>
              </div>
            </button>

            <button
              onClick={() => handleMobileNav('reading_garden')}
              className={`w-full min-h-[46px] px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-3 transition-colors ${
                currentRole === 'reading_garden'
                  ? 'bg-sky-600 text-white'
                  : 'bg-stone-50 text-stone-800 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <BookOpen className="w-5 h-5 text-sky-600" />
              <div className="text-left">
                <div>Thư viện bài đọc thú vị</div>
                <div className="text-[11px] font-normal text-stone-500">Bài văn mẫu & bài đọc tham khảo lớp 3</div>
              </div>
            </button>

            {activeStudent && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenProgressModal?.();
                }}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-between bg-emerald-50 text-emerald-900 border border-emerald-200"
              >
                <div className="flex items-center gap-3">
                  <Trees className="w-5 h-5 text-emerald-600" />
                  <span>Tiến bộ & Vườn hoa của em</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  {activeStudent.flowersEarned} 🌸
                </span>
              </button>
            )}

            {currentUser?.teacherRole === 'SUPER_ADMIN' && (
              <button
                onClick={() => handleMobileNav(currentRole === 'admin_system' ? 'teacher' : 'admin_system')}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-3 bg-amber-100 text-amber-900 border border-amber-300"
              >
                <Shield className="w-5 h-5 text-amber-700" />
                <span>{currentRole === 'admin_system' ? '👩‍🏫 Về góc lớp học của tôi' : '👑 Trang Quản trị hệ thống'}</span>
              </button>
            )}
          </div>

          {/* Quick Accessibility Settings on Mobile */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`flex-1 min-h-[44px] px-3 py-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 ${
                settings.soundEnabled
                  ? 'bg-pink-100 text-pink-900 border-pink-300'
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-pink-600" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
              <span>{settings.soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`flex-1 min-h-[44px] px-3 py-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 ${
                settings.reducedMotion
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>{settings.reducedMotion ? 'Chuyển động: Giảm' : 'Chuyển động: Sinh động'}</span>
            </button>
          </div>

          {/* Logout / Return Home Action Button on Mobile */}
          <div className="pt-2 border-t border-stone-100">
            {currentUser ? (
              <button
                onClick={handleMobileLogout}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-rose-300 font-black text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Đăng xuất khỏi phiên làm việc</span>
              </button>
            ) : (
              currentRole !== 'home' && (
                <button
                  onClick={handleMobileLogout}
                  className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Về Trang chủ Vườn Chữ</span>
                </button>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};

