import React, { useState } from 'react';
import { Student, AppSettings, AuthUser } from '../types';
import { TEACHER_CONFIG } from '../constants/teacherConfig';
import { HoaNhoMascot } from './HoaNhoMascot';
import { playPop, playChime } from '../utils/audio';
import { getVietnamTimePeriod } from '../utils/timeGreeting';
import { 
  Lock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  GraduationCap, 
  Heart, 
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LoginViewProps {
  role: 'student' | 'teacher' | 'family';
  students: Student[];
  settings: AppSettings;
  onLoginSuccess: (user: AuthUser) => void;
  onBackToHome: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  role,
  students,
  settings,
  onLoginSuccess,
  onBackToHome
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const timePeriod = getVietnamTimePeriod();

  // Role-specific config and color theme
  const config = {
    student: {
      gateTitle: 'CÁNH CỔNG 1 – GÓC CỦA EM',
      pageTitle: 'ĐĂNG NHẬP GÓC CỦA EM',
      icon: '🎒',
      accentColor: 'amber',
      badgeBg: 'bg-amber-500 text-white',
      cardBorder: 'border-amber-300',
      headerBg: 'from-amber-100 via-orange-50 to-amber-50',
      submitBtnBg: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200',
      submitText: 'Vào góc học tập',
      usernameLabel: 'Tên đăng nhập hoặc Mã học sinh (ví dụ: HS001, hs01 hoặc Họ tên):',
      usernamePlaceholder: 'Nhập HS001 hoặc tên của em...',
      passwordLabel: 'Mật khẩu của em (Mã PIN):',
      passwordPlaceholder: 'Nhập mật khẩu (Gợi ý: 2016)',
      mascotGreeting: `${timePeriod.greetingTitle} bạn nhỏ yêu quý! Em hãy nhập tên đăng nhập và mật khẩu để Hoa Nhỏ mở góc học tập của riêng em nhé!`,
      demoPresets: [
        { label: 'HS001 • Tuệ An', u: 'HS001', p: '2016' },
        { label: 'HS002 • Bảo An', u: 'HS002', p: '2016' },
        { label: 'HS020 • Tuệ Lâm', u: 'HS020', p: '2016' }
      ]
    },
    teacher: {
      gateTitle: 'CÁNH CỔNG 2 – GÓC GIÁO VIÊN',
      pageTitle: 'ĐĂNG NHẬP GÓC GIÁO VIÊN',
      icon: '👩‍🏫',
      accentColor: 'emerald',
      badgeBg: 'bg-emerald-600 text-white',
      cardBorder: 'border-emerald-300',
      headerBg: 'from-emerald-100 via-teal-50 to-emerald-50',
      submitBtnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200',
      submitText: 'Vào lớp quản lý',
      usernameLabel: 'Tên đăng nhập của giáo viên:',
      usernamePlaceholder: 'cogaovietvan hoặc leductho',
      passwordLabel: 'Mật khẩu bảo mật:',
      passwordPlaceholder: 'Nhập mật khẩu (Gợi ý: 2026)',
      mascotGreeting: `Kính ${timePeriod.greetingTitle.toLowerCase()} thầy/cô! Kính mời thầy/cô đăng nhập để quản lý học sinh, duyệt bài viết và gửi trao những nhận xét ân cần.`,
      demoPresets: [
        { label: '👑 Admin (Cô Duyên)', u: 'haiduyen', p: '2026' },
        { label: 'Thầy Minh (vanminh)', u: 'vanminh', p: '2026' },
        { label: 'Cô Duyên (cogaovietvan)', u: 'cogaovietvan', p: '2026' }
      ]
    },
    family: {
      gateTitle: 'CÁNH CỔNG 3 – GÓC GIA ĐÌNH',
      pageTitle: 'ĐĂNG NHẬP GÓC GIA ĐÌNH',
      icon: '🏡',
      accentColor: 'rose',
      badgeBg: 'bg-rose-500 text-white',
      cardBorder: 'border-rose-300',
      headerBg: 'from-rose-100 via-pink-50 to-rose-50',
      submitBtnBg: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200',
      submitText: 'Cùng con học tốt',
      usernameLabel: 'Mã kết nối của con (hoặc Mã phụ huynh):',
      usernamePlaceholder: 'Ví dụ: PH001, PH002 hoặc HS001',
      passwordLabel: 'Mật khẩu bảo mật gia đình:',
      passwordPlaceholder: 'Nhập mật khẩu (Gợi ý: 2016)',
      mascotGreeting: `Kính ${timePeriod.greetingTitle.toLowerCase()} bố mẹ! Kính mời quý phụ huynh đăng nhập mã kết nối của con để ngắm nhìn bông hoa chữ và sự tiến bộ từng ngày của con.`,
      demoPresets: [
        { label: 'PH bé Tuệ An (PH001)', u: 'PH001', p: '2016' },
        { label: 'PH bé Bảo An (PH002)', u: 'PH002', p: '2016' },
        { label: 'PH bé Tuệ Lâm (PH020)', u: 'PH020', p: '2016' }
      ]
    }
  }[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const u = username.trim();
    const p = password.trim();

    if (!u) {
      setErrorMsg('Vui lòng nhập tên đăng nhập hoặc mã của bạn.');
      return;
    }

    setIsLoading(true);
    playPop(settings.soundEnabled);

    try {
      // 1. First attempt authentication via backend /api/auth
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          code: role === 'teacher' ? (p || u) : (role === 'family' ? u : p),
          studentId: role === 'student' ? u : undefined,
          username: u,
          password: p
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        playChime(settings.soundEnabled);
        let authUser: AuthUser;

        if (role === 'teacher') {
          authUser = {
            role: 'teacher',
            teacherId: data.teacherId || 'GV001',
            teacherRole: data.teacherRole || 'SUPER_ADMIN',
            teacherName: data.teacherName || TEACHER_CONFIG.name,
            assignedClassIds: data.assignedClassIds || ['L3A'],
            teacherProfile: data.teacherProfile,
            token: data.token
          };
        } else if (role === 'student') {
          authUser = {
            role: 'student',
            student: data.student
          };
        } else {
          authUser = {
            role: 'family',
            student: data.student,
            caregiver: data.caregiver,
            parentName: data.caregiver?.name || (data.student ? `Phụ huynh em ${data.student.name.split(' ').slice(-1)[0]}` : undefined),
            parentRelation: data.caregiver?.relation || 'Phụ huynh',
            parentCode: data.caregiver?.code || data.student?.parentCode
          };
        }

        onLoginSuccess(authUser);
        return;
      }

      // 2. Client-side fallback check against loaded students list if server returns 401/404 or in offline state
      if (role === 'student') {
        const normalizedU = u.toLowerCase();
        const found = students.find(s => 
          s.id.toLowerCase() === normalizedU ||
          s.id.toLowerCase() === `hs${normalizedU.replace(/[^0-9]/g, '').padStart(3, '0')}` ||
          s.name.toLowerCase() === normalizedU ||
          s.name.toLowerCase().includes(normalizedU) ||
          s.demoName.toLowerCase().includes(normalizedU)
        );

        if (found) {
          if (!p || p === found.pin || p === '2016' || p === '123456') {
            playChime(settings.soundEnabled);
            onLoginSuccess({ role: 'student', student: found });
            return;
          } else {
            setErrorMsg('Mật khẩu chưa đúng. (Gợi ý mật khẩu mặc định của lớp: 2016)');
            return;
          }
        } else {
          setErrorMsg('Không tìm thấy mã học sinh này. Em hãy kiểm tra lại mã số (ví dụ: HS001) nhé!');
          return;
        }
      }

      if (role === 'teacher') {
        const normalized = (p || u).toLowerCase();
        const isMinh = normalized.includes('thayminh') || u.toLowerCase() === 'thayminh' || u.toLowerCase() === 'vanminh' || normalized.includes('vanminh');
        const isDuyen = normalized.includes('haiduyen') || normalized.includes('cogaovietvan') || normalized.includes('leductho') || normalized === '2026' || p === '2026';
        if (isMinh || isDuyen) {
          playChime(settings.soundEnabled);
          onLoginSuccess({
            role: 'teacher',
            teacherId: isMinh ? 'GV002' : 'GV001',
            teacherRole: isMinh ? 'TEACHER' : 'SUPER_ADMIN',
            teacherName: isMinh ? 'Thầy Trần Văn Minh' : 'Cô Nguyễn Thị Hải Duyên',
            assignedClassIds: isMinh ? ['L4B'] : ['L3A'],
            teacherProfile: {
              id: isMinh ? 'GV002' : 'GV001',
              username: isMinh ? 'vanminh' : 'haiduyen',
              fullName: isMinh ? 'Trần Văn Minh' : 'Nguyễn Thị Hải Duyên',
              name: isMinh ? 'Thầy Trần Văn Minh' : 'Cô Nguyễn Thị Hải Duyên',
              salutation: isMinh ? 'thầy' : 'cô',
              role: isMinh ? 'TEACHER' : 'SUPER_ADMIN',
              status: 'active',
              school: 'Trường Tiểu học Lê Đức Thọ',
              assignedClassIds: isMinh ? ['L4B'] : ['L3A'],
              email: isMinh ? 'tranvanminh@leductho.edu.vn' : 'haiduyen@leductho.edu.vn',
              createdAt: '2026-09-01T08:00:00.000Z'
            }
          });
          return;
        } else {
          setErrorMsg('Mật khẩu giáo viên chưa đúng. (Gợi ý mật khẩu: 2026)');
          return;
        }
      }

      if (role === 'family') {
        const normalizedU = u.toUpperCase().replace(/\s+/g, '');
        const found = students.find(s => 
          s.parentCode.toUpperCase() === normalizedU ||
          s.id.toUpperCase() === normalizedU ||
          s.name.toLowerCase().includes(u.toLowerCase())
        );

        if (found) {
          if (!p || p === found.pin || p === '2016' || p === '123456' || p === found.parentCode) {
            playChime(settings.soundEnabled);
            onLoginSuccess({ role: 'family', student: found, parentCode: found.parentCode });
            return;
          } else {
            setErrorMsg('Mật khẩu chưa đúng. (Gợi ý mật khẩu gia đình: 2016)');
            return;
          }
        } else {
          setErrorMsg('Không tìm thấy mã kết nối gia đình này. Quý phụ huynh vui lòng kiểm tra lại mã kết nối (ví dụ: PH001 hoặc số điện thoại) nhé!');
          return;
        }
      }

      setErrorMsg(data.message || 'Thông tin đăng nhập chưa chính xác. Vui lòng thử lại.');
    } catch (err) {
      console.warn('Network auth error, falling back locally:', err);
      // Local fallback for offline/demo
      if (role === 'teacher' && (p === '2026' || u === 'cogaovietvan' || u === 'leductho')) {
        playChime(settings.soundEnabled);
        onLoginSuccess({ role: 'teacher', teacherName: TEACHER_CONFIG.name });
      } else if (role === 'student' && students.length > 0) {
        playChime(settings.soundEnabled);
        onLoginSuccess({ role: 'student', student: students[0] });
      } else if (role === 'family' && students.length > 0) {
        playChime(settings.soundEnabled);
        onLoginSuccess({ role: 'family', student: students[0], parentCode: students[0].parentCode });
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ. Em hãy kiểm tra lại thông tin nhé.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillPreset = (u: string, p: string) => {
    playPop(settings.soundEnabled);
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[calc(100vh-70px)] py-5 sm:py-8 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative fairy garden elements */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-amber-200/40 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl" />
        {!settings.reducedMotion && (
          <div className="absolute top-20 right-[15%] text-2xl animate-float-slow opacity-70">
            🌸
          </div>
        )}
      </div>

      <div className="w-full max-w-xl relative z-10 space-y-4 sm:space-y-6">
        {/* Navigation back button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
          <button
            onClick={() => {
              playPop(settings.soundEnabled);
              onBackToHome();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border-2 border-stone-200 font-bold text-xs sm:text-sm shadow-xs transition-all min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Về Vườn Chữ Nở Hoa</span>
          </button>

          <span className={`text-[11px] sm:text-xs font-black px-3 py-1 rounded-full shadow-xs uppercase tracking-wider ${config.badgeBg} truncate max-w-full`}>
            {config.gateTitle}
          </span>
        </div>

        {/* Hoa Nhỏ Mascot Speech Bubble Banner */}
        <div className="flex justify-center w-full">
          <HoaNhoMascot
            mood="happy"
            size="md"
            reducedMotion={settings.reducedMotion}
            message={config.mascotGreeting}
          />
        </div>

        {/* Main Pastel Login Card */}
        <div className={`bg-white rounded-3xl border-3 ${config.cardBorder} p-4 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-xs`}>
          {/* Card Top Header */}
          <div className={`-mx-4 -mt-4 sm:-mx-8 sm:-mt-8 p-4 sm:p-5 mb-5 bg-gradient-to-r ${config.headerBg} border-b-2 border-stone-100 flex items-center gap-3`}>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border-2 border-stone-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
              {config.icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 font-display tracking-tight truncate">
                {config.pageTitle}
              </h2>
              <p className="text-[11px] sm:text-sm text-stone-600 font-medium mt-0.5 truncate">
                Vườn Chữ Nở Hoa – Cùng Em Viết Văn Sáng Tạo • Trường TH Lê Đức Thọ
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username / Code input */}
            <div>
              <label className="block text-sm sm:text-base font-extrabold text-stone-800 mb-1.5">
                {config.usernameLabel}
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={config.usernamePlaceholder}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-stone-500 focus:outline-hidden text-base font-semibold bg-stone-50/50 transition-colors"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm sm:text-base font-extrabold text-stone-800">
                  {config.passwordLabel}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Ẩn' : 'Hiện'} mật khẩu</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={config.passwordPlaceholder}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border-2 border-stone-200 focus:border-stone-500 focus:outline-hidden text-base font-semibold bg-stone-50/50 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 flex items-start gap-2.5 text-sm font-semibold animate-fade-in">
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-base sm:text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer ${config.submitBtnBg}`}
            >
              <span>{isLoading ? 'Đang xác thực...' : config.submitText}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Demo Pre-fill helper chips */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tài khoản truy cập nhanh:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.demoPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleFillPreset(preset.u, preset.p)}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-extrabold border border-stone-200 transition-colors flex items-center gap-1"
                >
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Pedagogical notice */}
        <div className="text-center text-xs text-stone-500 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Hệ thống bảo mật phân quyền theo Chương trình GDPT 2018</span>
        </div>
      </div>
    </div>
  );
};
