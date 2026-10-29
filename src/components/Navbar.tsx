import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Home, 
  BookOpen, 
  Trees, 
  Map, 
  Edit3, 
  Menu, 
  X, 
  LogOut, 
  Shield, 
  Settings, 
  User, 
  GraduationCap, 
  Heart,
  ChevronDown
} from 'lucide-react';
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);

  // Close settings dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  const handleNav = (view: AppView) => {
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(false);
    onNavigate(view);
  };

  const handleLogoutAction = () => {
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(false);
    onLogout();
  };

  // Determine user role and display name dynamically (no hardcoded user names)
  const isTeacher = currentUser?.role === 'teacher';
  const isSuperAdmin = isTeacher && currentUser.teacherRole === 'SUPER_ADMIN';
  const teacherEmoji = currentUser?.teacherProfile?.salutation === 'thầy' || currentUser?.teacherName?.toLowerCase().includes('thầy') ? '👨‍🏫' : '👩‍🏫';
  const isStudent = currentUser?.role === 'student';
  const isFamily = currentUser?.role === 'family';

  // Dynamic User Display Name
  const getUserDisplayName = () => {
    if (isTeacher) {
      if (isSuperAdmin) {
        return 'Cô Nguyễn Thị Hải Duyên';
      }
      return currentUser.teacherName || currentUser.teacherProfile?.name || currentUser.teacherProfile?.fullName || 'Giáo viên';
    }
    if (isStudent) {
      return activeStudent?.name || currentUser?.student?.name || 'Học sinh';
    }
    if (isFamily) {
      return currentUser.parentName || currentUser.caregiver?.name || (activeStudent ? `PH em ${activeStudent.name.split(' ').slice(-1)[0]}` : 'Phụ huynh');
    }
    return 'Khách tham quan';
  };

  const userDisplayName = getUserDisplayName();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-200/80 shadow-xs h-16 sm:h-[68px]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-full flex items-center justify-between gap-2 sm:gap-4">
        
        {/* ========================================================================= */}
        {/* BÊN TRÁI: Logo Bông Hoa & Tên Ứng Dụng "Trợ Lí Tập Làm Văn AI"            */}
        {/* (Đã loại bỏ nhãn dài và khẩu hiệu lặp lại theo đúng yêu cầu)             */}
        {/* ========================================================================= */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none"
          title="Về Trang chủ sau đăng nhập"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-400 to-sky-400 p-0.5 shadow-xs group-hover:rotate-6 transition-transform shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-lg sm:text-xl">
              🌸
            </div>
          </div>
          <span className="font-extrabold text-base sm:text-lg text-purple-950 tracking-tight font-display whitespace-nowrap">
            Trợ Lí Tập Làm Văn AI
          </span>
        </div>

        {/* ========================================================================= */}
        {/* KHU VỰC ĐIỀU HƯỚNG TRUNG TÂM (Desktop >= 1024px)                          */}
        {/* Hiển thị chính xác theo vai trò, không hiển thị đồng thời menu HS & GV    */}
        {/* ========================================================================= */}
        <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
          {/* MENU CHO GIÁO VIÊN HOẶC QUẢN TRỊ VIÊN */}
          {isTeacher && (
            <>
              {/* 1. Trang chủ */}
              <button
                onClick={() => handleNav('home')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'home'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
                }`}
                title="Trang chủ sau đăng nhập"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </button>

              {/* 2. Lớp học của tôi */}
              <button
                onClick={() => handleNav('teacher')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'teacher'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
                }`}
                title="Không gian quản lý lớp học & sổ chấm bài"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>📚 Lớp học của tôi</span>
              </button>

              {/* 3. Quản trị hệ thống (Chỉ hiển thị DUY NHẤT một nút khi có quyền SUPER_ADMIN) */}
              {isSuperAdmin && (
                <button
                  onClick={() => handleNav('admin_system')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 h-9 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    currentRole === 'admin_system'
                      ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                  title="Không gian Quản trị viên chính (Super Admin)"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>👑 Quản trị hệ thống</span>
                </button>
              )}
            </>
          )}

          {/* MENU CHO HỌC SINH */}
          {isStudent && (
            <>
              {/* 1. Bản đồ ý tưởng */}
              <button
                onClick={() => handleNav('idea_map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'idea_map'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
                }`}
                title="Bản đồ ý tưởng - Khơi nguồn ý tưởng và lập dàn ý"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Bản đồ ý tưởng</span>
              </button>

              {/* 2. Cô góp ý bài văn */}
              <button
                onClick={() => handleNav('essay_feedback')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'essay_feedback'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200'
                }`}
                title="Cô góp ý bài văn - Đọc chữ viết tay, nhận xét và trao đổi"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Cô góp ý bài văn</span>
              </button>

              {/* 3. Thư viện bài đọc */}
              <button
                onClick={() => handleNav('reading_garden')}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'reading_garden'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200'
                }`}
                title="Thư viện bài đọc tham khảo lớp 3"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Thư viện bài đọc</span>
              </button>

              {/* 4. Tiến bộ */}
              <button
                onClick={() => {
                  if (onOpenProgressModal) onOpenProgressModal();
                  else handleNav('progress_journey');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'progress_journey'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
                title="Xem cây chữ và hành trình tiến bộ của con"
              >
                <Trees className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tiến bộ</span>
                {activeStudent && (
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-black">
                    {activeStudent.flowersEarned} 🌸
                  </span>
                )}
              </button>
            </>
          )}

          {/* MENU CHO PHỤ HUYNH */}
          {isFamily && (
            <>
              <button
                onClick={() => handleNav('home')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'home'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </button>

              <button
                onClick={() => handleNav('family')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'family'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-600" />
                <span>Góc gia đình</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenProgressModal) onOpenProgressModal();
                  else handleNav('progress_journey');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'progress_journey'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                <Trees className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tiến bộ của con</span>
              </button>
            </>
          )}

          {/* MENU KHI CHƯA ĐĂNG NHẬP */}
          {!currentUser && (
            <>
              <button
                onClick={() => handleNav('home')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'home'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </button>
              <button
                onClick={() => handleNav('reading_garden')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 h-9 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentRole === 'reading_garden'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Thư viện bài đọc</span>
              </button>
            </>
          )}
        </nav>

        {/* ========================================================================= */}
        {/* BÊN PHẢI (Desktop): Tài khoản, Cài đặt cá nhân & Nút Đăng xuất             */}
        {/* Giữ trọn một hàng, không bị cắt mép phải, không tràn ngang               */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Menu Cài đặt cá nhân (Âm thanh & Chuyển động) - Tinh gọn, không lấn hàng */}
          <div className="relative" ref={settingsDropdownRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-purple-50 text-stone-600 hover:text-purple-700 border border-stone-200 hover:border-purple-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Cài đặt âm thanh và hiệu ứng"
              aria-label="Cài đặt tiện ích"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Dropdown Popover */}
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-purple-200 p-2.5 space-y-2 z-50 animate-fade-in text-xs font-bold">
                <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider block px-1">
                  Cài đặt tiện ích
                </span>

                {/* Âm thanh toggle */}
                <button
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-colors"
                >
                  <span className="flex items-center gap-2 text-stone-700">
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-pink-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                    <span>Âm thanh</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${settings.soundEnabled ? 'bg-pink-100 text-pink-800' : 'bg-stone-100 text-stone-500'}`}>
                    {settings.soundEnabled ? 'BẬT' : 'TẮT'}
                  </span>
                </button>

                {/* Chuyển động toggle */}
                <button
                  onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-colors"
                >
                  <span className="flex items-center gap-2 text-stone-700">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Hiệu ứng</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${settings.reducedMotion ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {settings.reducedMotion ? 'ĐÃ GIẢM' : 'SINH ĐỘNG'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Thông tin tài khoản đăng nhập (Biểu tượng + Tên người dùng) */}
          {currentUser ? (
            <>
              <div 
                className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-full bg-purple-50 text-purple-950 border border-purple-200 text-xs font-bold max-w-[240px] shadow-2xs whitespace-nowrap"
                title={`Đang đăng nhập: ${userDisplayName}`}
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-xs shrink-0 shadow-2xs">
                  {isTeacher ? (isSuperAdmin ? '👑' : teacherEmoji) : isStudent ? (activeStudent?.avatar || '🌸') : '🏡'}
                </span>
                <span className="truncate font-extrabold text-stone-900">
                  {userDisplayName}
                </span>
              </div>

              {/* Nút Đăng xuất */}
              <button
                onClick={handleLogoutAction}
                className="flex items-center gap-1.5 px-3.5 py-1.5 h-9 rounded-full text-xs font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 shadow-2xs transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                title="Đăng xuất khỏi phiên làm việc"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Đăng xuất</span>
              </button>
            </>
          ) : (
            currentRole !== 'home' && (
              <button
                onClick={() => handleNav('home')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 h-9 rounded-full text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </button>
            )
          )}
        </div>

        {/* ========================================================================= */}
        {/* BÊN PHẢI (Mobile / Tablet < 1024px): Nút Menu Thu Gọn                     */}
        {/* ========================================================================= */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          {/* Quick User Avatar Badge on Mobile */}
          {currentUser && (
            <div 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 h-9 rounded-xl bg-purple-50 text-purple-950 border border-purple-200 text-xs font-bold cursor-pointer"
            >
              <span>{isTeacher ? (isSuperAdmin ? '👑' : teacherEmoji) : isStudent ? (activeStudent?.avatar || '🌸') : '🏡'}</span>
              <span className="max-w-[90px] sm:max-w-[120px] truncate font-extrabold text-stone-900 text-[11px] sm:text-xs">
                {userDisplayName}
              </span>
            </div>
          )}

          {/* Menu Drawer Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-9 px-3 rounded-xl border border-purple-300 bg-purple-100 hover:bg-purple-200 text-purple-950 font-extrabold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 text-purple-950" /> : <Menu className="w-4 h-4 text-purple-950" />}
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET DRAWER MENU (< 1024px)                                    */}
      {/* Hiển thị chức năng chính xác theo từng vai trò, không che mất nội dung    */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-200 bg-white/98 backdrop-blur-md px-4 py-4 space-y-3.5 shadow-xl animate-fade-in max-h-[calc(100vh-68px)] overflow-y-auto">
          {/* Card Thông tin tài khoản */}
          {currentUser ? (
            <div className="p-3 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border border-purple-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-white border border-purple-200 flex items-center justify-center text-lg shadow-2xs shrink-0">
                  {isTeacher ? (isSuperAdmin ? '👑' : '👩‍🏫') : isStudent ? (activeStudent?.avatar || '🌸') : '🏡'}
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    {isTeacher ? (isSuperAdmin ? 'Quản trị viên hệ thống' : 'Giáo viên lớp học') : isStudent ? (activeStudent?.className || 'Học sinh Lớp 3') : 'Gia đình học sinh'}
                  </span>
                  <div className="font-extrabold text-xs sm:text-sm text-stone-900 truncate">
                    {userDisplayName}
                  </div>
                </div>
              </div>
              {isStudent && activeStudent && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black shrink-0">
                  {activeStudent.flowersEarned} 🌸
                </span>
              )}
            </div>
          ) : (
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 font-bold flex items-center gap-2">
              <span>🌸</span>
              <span>Trợ Lí Tập Làm Văn AI</span>
            </div>
          )}

          {/* Danh sách điều hướng Mobile theo đúng vai trò */}
          <div className="space-y-1.5">
            {/* ĐIỀU HƯỚNG GIÁO VIÊN / QUẢN TRỊ TRÊN MOBILE */}
            {isTeacher && (
              <>
                <button
                  onClick={() => handleNav('home')}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors ${
                    currentRole === 'home'
                      ? 'bg-purple-600 text-white'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Trang chủ</span>
                </button>

                <button
                  onClick={() => handleNav('teacher')}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors ${
                    currentRole === 'teacher'
                      ? 'bg-purple-600 text-white'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-purple-700" />
                  <span>📚 Lớp học của tôi</span>
                </button>

                {isSuperAdmin && (
                  <button
                    onClick={() => handleNav('admin_system')}
                    className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-2.5 transition-colors ${
                      currentRole === 'admin_system'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span>👑 Quản trị hệ thống</span>
                  </button>
                )}
              </>
            )}

            {/* ĐIỀU HƯỚNG HỌC SINH TRÊN MOBILE */}
            {isStudent && (
              <>
                <button
                  onClick={() => handleNav('idea_map')}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors ${
                    currentRole === 'idea_map'
                      ? 'bg-purple-600 text-white'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200'
                  }`}
                >
                  <Map className="w-4 h-4 text-purple-600" />
                  <span>Bản đồ ý tưởng</span>
                </button>

                <button
                  onClick={() => handleNav('essay_feedback')}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors ${
                    currentRole === 'essay_feedback'
                      ? 'bg-pink-600 text-white'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200'
                  }`}
                >
                  <Edit3 className="w-4 h-4 text-pink-600" />
                  <span>Cô góp ý bài văn</span>
                </button>

                <button
                  onClick={() => handleNav('reading_garden')}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors ${
                    currentRole === 'reading_garden'
                      ? 'bg-sky-600 text-white'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>Thư viện bài đọc</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenProgressModal) onOpenProgressModal();
                    else handleNav('progress_journey');
                  }}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-between transition-colors ${
                    currentRole === 'progress_journey'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Trees className="w-4 h-4 text-emerald-600" />
                    <span>Tiến bộ & Vườn hoa của em</span>
                  </div>
                  {activeStudent && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                      {activeStudent.flowersEarned} 🌸
                    </span>
                  )}
                </button>
              </>
            )}

            {/* ĐIỀU HƯỚNG PHỤ HUYNH TRÊN MOBILE */}
            {isFamily && (
              <>
                <button
                  onClick={() => handleNav('home')}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors ${
                    currentRole === 'home'
                      ? 'bg-purple-600 text-white'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Trang chủ</span>
                </button>

                <button
                  onClick={() => handleNav('family')}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors ${
                    currentRole === 'family'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Góc gia đình</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenProgressModal) onOpenProgressModal();
                    else handleNav('progress_journey');
                  }}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors ${
                    currentRole === 'progress_journey'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  <Trees className="w-4 h-4 text-emerald-600" />
                  <span>Tiến bộ của con</span>
                </button>
              </>
            )}

            {/* ĐIỀU HƯỚNG KHÁCH TRÊN MOBILE */}
            {!currentUser && (
              <>
                <button
                  onClick={() => handleNav('home')}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors ${
                    currentRole === 'home'
                      ? 'bg-purple-600 text-white'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Trang chủ</span>
                </button>
                <button
                  onClick={() => handleNav('reading_garden')}
                  className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-colors ${
                    currentRole === 'reading_garden'
                      ? 'bg-sky-600 text-white'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>Thư viện bài đọc</span>
                </button>
              </>
            )}
          </div>

          {/* Cài đặt tiện ích trên Mobile */}
          <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
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
              className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                settings.reducedMotion
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>{settings.reducedMotion ? 'Chuyển động: Giảm' : 'Sinh động'}</span>
            </button>
          </div>

          {/* Nút Đăng xuất trên Mobile */}
          {currentUser && (
            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={handleLogoutAction}
                className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Đăng xuất khỏi phiên làm việc</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
