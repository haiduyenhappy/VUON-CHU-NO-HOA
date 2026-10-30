import React, { useState, useEffect } from 'react';
import { GoogleTeacherButton } from './GoogleTeacherButton';
import { Student, AppSettings, AuthUser } from '../types';
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
  ShieldCheck,
  AlertCircle,
  HelpCircle
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

  // Chỉ bật tài khoản mẫu khi trình diễn/chấm điểm. Đặt VITE_ENABLE_DEMO_LOGIN=false để ẩn.
  const [demoConfig, setDemoConfig] = useState<{enabled:boolean;student:string[];teacher:string[];family:string[]}>({enabled:true,student:['HS001','HS002','HS020'],teacher:['haiduyen','vanminh'],family:['PH001','PH002','PH020']});
  useEffect(() => { let mounted = true; fetch('/api/demo-login-config').then(r => r.json()).then(data => { if(mounted && data.success) setDemoConfig(data.config); }).catch(() => {}); return () => { mounted = false; }; }, []);
  const demoAccessEnabled = import.meta.env.VITE_ENABLE_DEMO_LOGIN !== 'false' && demoConfig.enabled;
  const demoAccounts = {
    student: [
      { label: 'HS001 · Tuệ An', username: 'HS001', password: '2026' },
      { label: 'HS002 · Bảo An', username: 'HS002', password: '2016' },
      { label: 'HS020 · Tuệ Lâm', username: 'HS020', password: '2016' },
    ],
    teacher: [
      { label: '👑 Cô Duyên – Quản trị & Giáo viên', username: 'haiduyen', password: '2026' },
      { label: '👨‍🏫 Thầy Minh – Giáo viên', username: 'vanminh', password: '2026' },
    ],
    family: [
      { label: 'PH bé Tuệ An (PH001)', username: 'PH001', password: '2016' },
      { label: 'PH bé Bảo An (PH002)', username: 'PH002', password: '2016' },
      { label: 'PH bé Tuệ Lâm (PH020)', username: 'PH020', password: '2016' },
    ],
  };

  const selectDemoAccount = (account: { username: string; password: string }) => {
    setUsername(account.username);
    setPassword(account.password);
    setErrorMsg('');
    playPop(settings.soundEnabled);
  };

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
      usernameLabel: 'Mã học sinh hoặc tên đăng nhập',
      usernamePlaceholder: 'Nhập mã học sinh hoặc tài khoản của em',
      passwordLabel: 'Mật khẩu của em',
      passwordPlaceholder: 'Nhập mật khẩu được cấp',
      guideText: 'Con hãy dùng thông tin đăng nhập do thầy cô cung cấp nhé!',
      mascotGreeting: `${timePeriod.greetingTitle} bạn nhỏ yêu quý! Em hãy nhập mã học sinh và mật khẩu được cấp để Hoa Nhỏ mở góc học tập của riêng em nhé!`
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
      usernameLabel: 'Tên đăng nhập',
      usernamePlaceholder: 'Nhập tên đăng nhập được cấp',
      passwordLabel: 'Mật khẩu',
      passwordPlaceholder: 'Nhập mật khẩu của thầy/cô',
      guideText: 'Sử dụng tài khoản đã được nhà trường hoặc quản trị viên cấp.',
      mascotGreeting: `Kính ${timePeriod.greetingTitle.toLowerCase()} thầy/cô! Kính mời thầy/cô đăng nhập tài khoản được cấp để quản lý lớp học và duyệt bài viết.`
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
      usernameLabel: 'Mã phụ huynh hoặc tên đăng nhập',
      usernamePlaceholder: 'Nhập mã hoặc tài khoản phụ huynh',
      passwordLabel: 'Mật khẩu',
      passwordPlaceholder: 'Nhập mật khẩu của phụ huynh',
      guideText: 'Phụ huynh sử dụng tài khoản được giáo viên cung cấp để theo dõi hành trình học tập của con.',
      mascotGreeting: `Kính ${timePeriod.greetingTitle.toLowerCase()} bố mẹ! Kính mời quý phụ huynh đăng nhập để đồng hành cùng con và theo dõi tiến bộ từng ngày.`
    }
  }[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const u = username.trim();
    const p = password.trim();

    if (!u) {
      setErrorMsg(`Vui lòng nhập ${config.usernameLabel.toLowerCase()}.`);
      return;
    }

    if (!p) {
      setErrorMsg(`Vui lòng nhập ${config.passwordLabel.toLowerCase()}.`);
      return;
    }

    setIsLoading(true);
    playPop(settings.soundEnabled);

    try {
      // 1. Authenticate via backend /api/auth
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
            teacherName: data.teacherName || 'Cô Nguyễn Thị Hải Duyên',
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

      setErrorMsg(data.message || 'Thông tin đăng nhập chưa chính xác. Vui lòng kiểm tra lại.');
    } catch (err) {
      console.warn('Network auth error, falling back locally:', err);
      setErrorMsg('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.');
    } finally {
      setIsLoading(false);
    }
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
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border-2 border-stone-200 font-bold text-xs sm:text-sm shadow-xs transition-all min-h-[40px] cursor-pointer"
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
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight truncate">
                {config.pageTitle}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5 truncate">
                Vườn Chữ Nở Hoa – Cùng Em Viết Văn Sáng Tạo • Trường TH Lê Đức Thọ
              </p>
            </div>
          </div>

          {/* User Role Guidance Notice */}
          <div className="mb-5 p-3 sm:p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-700 font-semibold flex items-center gap-2">
            <span className="text-base shrink-0">💡</span>
            <span>{config.guideText}</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Username / Code input */}
            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-stone-800 mb-1.5">
                {config.usernameLabel}
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={config.usernamePlaceholder}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-stone-500 focus:outline-hidden text-sm sm:text-base font-semibold bg-stone-50/50 transition-colors"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-extrabold text-stone-800">
                  {config.passwordLabel}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer transition-colors"
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
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border-2 border-stone-200 focus:border-stone-500 focus:outline-hidden text-sm sm:text-base font-semibold bg-stone-50/50 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs sm:text-sm font-semibold animate-fade-in">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 sm:py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer ${config.submitBtnBg}`}
            >
              <span>{isLoading ? 'Đang xác thực...' : config.submitText}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {role === 'teacher' && <GoogleTeacherButton onLoginSuccess={onLoginSuccess} />}

            {/* Tài khoản truy cập nhanh – hiển thị gọn giống giao diện ban đầu. */}
            {demoAccessEnabled && (
              <section className="mt-5 pt-4 border-t border-stone-200" aria-label="Tài khoản truy cập nhanh">
                <h3 className="text-xs sm:text-sm font-extrabold text-stone-500 tracking-wide mb-3">
                  ✨ TÀI KHOẢN TRUY CẬP NHANH:
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {demoAccounts[role].filter(account => demoConfig[role].includes(account.username)).map((account) => (
                    <button
                      key={account.username}
                      type="button"
                      onClick={() => selectDemoAccount(account)}
                      title={`Điền tài khoản ${account.label}`}
                      aria-label={`Chọn tài khoản ${account.label}`}
                      className={`inline-flex items-center max-w-full min-h-[32px] px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-extrabold leading-snug transition-colors cursor-pointer ${username === account.username ? 'border-violet-500 bg-violet-100 text-violet-900' : 'border-stone-200 bg-stone-100 text-stone-800 hover:border-violet-300 hover:bg-violet-50'}`}
                    >
                      {account.label}
                    </button>
                  ))}
                </div>
              </section>
            )}

          {/* Forgot Credentials Guidance */}
            <div className="pt-2 text-center text-xs text-stone-500 font-medium flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Quên thông tin đăng nhập? Liên hệ giáo viên hoặc người quản lý tài khoản.</span>
            </div>
          </form>
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
