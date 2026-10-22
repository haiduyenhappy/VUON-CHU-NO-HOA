import React, { useState } from 'react';
import { HoaNhoMascot } from './HoaNhoMascot';
import { AppSettings, Student } from '../types';
import { playPop, playChime } from '../utils/audio';
import { 
  Sparkles, 
  Pencil, 
  Heart, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Search,
  Lock,
  ArrowRight,
  Flame,
  Award,
  Trees
} from 'lucide-react';

interface GardenSceneProps {
  students: Student[];
  settings: AppSettings;
  onSelectRole: (role: 'student' | 'teacher' | 'family', selectedStudent?: Student) => void;
  onOpenReadingGarden: () => void;
}

export const GardenScene: React.FC<GardenSceneProps> = ({
  students,
  settings,
  onSelectRole,
  onOpenReadingGarden
}) => {
  const [selectedGate, setSelectedGate] = useState<'none' | 'student' | 'teacher' | 'family'>('none');
  const [studentSearch, setStudentSearch] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [chosenStudent, setChosenStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(s => {
    const displayName = settings.demoPrivacyMode ? s.demoName : s.name;
    return displayName.toLowerCase().includes(studentSearch.toLowerCase()) ||
           s.id.toLowerCase().includes(studentSearch.toLowerCase());
  });

  const handleStudentGateClick = () => {
    playPop(settings.soundEnabled);
    setSelectedGate('student');
    setAuthError('');
  };

  const handleTeacherGateClick = () => {
    playPop(settings.soundEnabled);
    setSelectedGate('teacher');
    setAuthError('');
  };

  const handleFamilyGateClick = () => {
    playPop(settings.soundEnabled);
    setSelectedGate('family');
    setAuthError('');
  };

  const handleLoginStudent = (student: Student) => {
    // Student selects themselves
    setChosenStudent(student);
    setAuthError('');
    // Auto-login or verify PIN
    onSelectRole('student', student);
    playChime(settings.soundEnabled);
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = authCode.trim().toLowerCase();
    if (code === '2026' || code === 'cogaovietvan' || code === 'leductho' || code === '') {
      playChime(settings.soundEnabled);
      onSelectRole('teacher');
    } else {
      setAuthError('Mã cô giáo chưa đúng. (Gợi ý nhanh: 2026)');
    }
  };

  const handleFamilyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = authCode.trim().toUpperCase();
    const found = students.find(s => s.parentCode.toUpperCase() === code || s.id.toUpperCase() === code);
    if (found) {
      playChime(settings.soundEnabled);
      onSelectRole('family', found);
    } else {
      // If code is empty, default to the first student for convenient demo
      if (!code && students.length > 0) {
        onSelectRole('family', students[0]);
      } else {
        setAuthError('Không tìm thấy mã gia đình này. (Ví dụ: PH001, PH002 hoặc bấm Xem ngay)');
      }
    }
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
            message="Chào mừng em đến với Vườn Chữ Nở Hoa! Hôm nay, chúng mình sẽ cùng gieo những ý tưởng thật đáng yêu nhé!"
          />
        </div>

        {/* The Three Portal Gates */}
        {selectedGate === 'none' && (
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
                <span className="text-xs font-bold text-amber-800">Em vào học viết ngay</span>
                <div className="w-9 h-9 rounded-full bg-amber-400 group-hover:bg-amber-500 text-amber-950 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Gate 2: GÓC CÔ GIÁO */}
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
                  GÓC CÔ GIÁO
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed font-medium">
                  Dành cho giáo viên: Theo dõi 35 học sinh, xem các bản nháp và dàn ý, gửi lời nhận xét ngọt ngào, chấm hoa thưởng và in phiếu tiến bộ.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Cô vào lớp học</span>
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
                <span className="text-xs font-bold text-rose-800">Bố mẹ vào xem bài của con</span>
                <div className="w-9 h-9 rounded-full bg-rose-400 group-hover:bg-rose-500 text-rose-950 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal / Selector for Student Portal */}
        {selectedGate === 'student' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border-3 border-amber-300 p-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎒</span>
                <div>
                  <h3 className="text-xl font-bold text-amber-950 font-display">
                    Chào em! Em là ai trong lớp mình?
                  </h3>
                  <p className="text-xs text-stone-500">
                    Chọn đúng tên của em để vào góc học tập riêng nhé
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGate('none')}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold px-3 py-1 rounded-full hover:bg-stone-100"
              >
                Trở lại
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Gõ tên của em để tìm nhanh..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-hidden text-sm bg-amber-50/30"
              />
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1 pr-2">
              {filteredStudents.map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleLoginStudent(st)}
                  className="flex items-center gap-3 p-2.5 rounded-2xl border-2 border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/70 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    {st.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-stone-800 truncate">
                      {settings.demoPrivacyMode ? st.demoName : st.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-semibold text-amber-700">{st.id}</span>
                      <span>•</span>
                      <span>{st.flowersEarned} 🌸 hoa</span>
                    </div>
                  </div>
                  <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <p className="text-center py-6 text-sm text-stone-500">
                Không tìm thấy tên bạn này. Em thử tìm lại nhé!
              </p>
            )}
          </div>
        )}

        {/* Modal for Teacher Portal */}
        {selectedGate === 'teacher' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl border-3 border-emerald-300 p-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👩‍🏫</span>
                <h3 className="text-xl font-bold text-emerald-950 font-display">
                  Cánh cổng Góc Cô Giáo
                </h3>
              </div>
              <button
                onClick={() => setSelectedGate('none')}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold px-3 py-1 rounded-full hover:bg-stone-100"
              >
                Trở lại
              </button>
            </div>

            <form onSubmit={handleTeacherLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mã xác thực của cô:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="Nhập mã (Gợi ý: 2026)"
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl border-2 border-emerald-200 focus:border-emerald-400 focus:outline-hidden text-sm"
                  />
                </div>
                {authError && <p className="text-xs text-rose-600 mt-1 font-medium">{authError}</p>}
                <p className="text-[11px] text-stone-400 mt-1">
                  * Dành riêng cho giáo viên chủ nhiệm và phụ trách môn Tiếng Việt Lớp 3.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Vào Góc Cô Giáo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal for Family Portal */}
        {selectedGate === 'family' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl border-3 border-rose-300 p-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏡</span>
                <h3 className="text-xl font-bold text-rose-950 font-display">
                  Cánh cổng Góc Gia Đình
                </h3>
              </div>
              <button
                onClick={() => setSelectedGate('none')}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold px-3 py-1 rounded-full hover:bg-stone-100"
              >
                Trở lại
              </button>
            </div>

            <form onSubmit={handleFamilyLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nhập mã kết nối của con (Ví dụ: PH001, PH002 hoặc HS001):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="Mã PH001 hoặc để trống để xem bạn đầu tiên"
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl border-2 border-rose-200 focus:border-rose-400 focus:outline-hidden text-sm uppercase"
                  />
                </div>
                {authError && <p className="text-xs text-rose-600 mt-1 font-medium">{authError}</p>}
                <p className="text-[11px] text-stone-400 mt-1">
                  * Mỗi gia đình chỉ xem hành trình học viết của riêng con mình, bảo mật thông tin an toàn.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Xem hành trình của con</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

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
            <span>35 Học sinh Lớp 3 • 32 Nhiệm vụ viết Tiếng Việt 3</span>
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
