import React, { useState, useEffect } from 'react';
import { Student, Submission, AppSettings } from '../types';
import { TEACHER_CONFIG } from '../constants/teacherConfig';
import { playPop, playChime } from '../utils/audio';
import { 
  Trees, 
  Star, 
  Award, 
  Heart, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  BookOpen, 
  ArrowLeft, 
  Calendar,
  Flame,
  FileText,
  Smile,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ProgressJourneyPageProps {
  student: Student;
  settings: AppSettings;
  onBack: () => void;
  returnViewName?: string; // Tên vị trí quay lại (vd: "Góc của em" hoặc "Góc gia đình")
}

export const ProgressJourneyPage: React.FC<ProgressJourneyPageProps> = ({
  student,
  settings,
  onBack,
  returnViewName = 'Góc học tập'
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubDetail, setSelectedSubDetail] = useState<Submission | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'reviewed' | 'submitted'>('all');

  useEffect(() => {
    fetch(`/api/submissions?studentId=${student.id}`)
      .then(res => res.json())
      .then(d => {
        setSubmissions(d.submissions || []);
      })
      .catch(() => {});
  }, [student.id]);

  const treeTitles = [
    'Hạt mầm bé bỏng',
    'Cây non đâm chồi',
    'Cây vươn cành kết nụ',
    'Cây nở hoa rực rỡ',
    'Khu vườn chữ trăm hoa khoe sắc'
  ];

  const reviewedSubmissions = submissions.filter(s => s.status === 'reviewed');
  const filteredSubmissions = submissions.filter(s => {
    if (filterType === 'all') return true;
    if (filterType === 'reviewed') return s.status === 'reviewed';
    return s.status === 'submitted';
  });

  const badges = [
    {
      id: 'mam_xanh',
      title: 'Hạt mầm đầu tiên',
      icon: '🌱',
      description: 'Hoàn thành bài viết mở đầu hành trình.',
      achieved: submissions.length >= 1
    },
    {
      id: 'cham_chi',
      title: 'Cây bút chăm chỉ',
      icon: '🐝',
      description: 'Hoàn thành từ 2 bài tập làm văn trở lên.',
      achieved: submissions.length >= 2
    },
    {
      id: 'tu_vung',
      title: 'Vườn chữ rực rỡ',
      icon: '🌸',
      description: 'Tích lũy từ 5 bông hoa chữ đẹp trở lên.',
      achieved: student.flowersEarned >= 5
    },
    {
      id: 'sang_tao',
      title: 'Trái tim sáng tạo',
      icon: '💖',
      description: 'Được cô giáo khen ngợi về cảm xúc và ý tưởng.',
      achieved: reviewedSubmissions.length >= 1
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Navigation Bar with Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-3xl border-2 border-emerald-200 shadow-xs">
        <button
          onClick={() => {
            playPop(settings.soundEnabled);
            onBack();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs sm:text-sm border border-stone-300 transition-all hover:scale-102"
        >
          <ArrowLeft className="w-4 h-4 text-stone-700" />
          <span>← Quay lại {returnViewName}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            Hành trình của con • Đánh giá định tính GDPT 2018
          </span>
        </div>
      </div>

      {/* Main Student Header Card */}
      <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-amber-100 rounded-3xl p-5 sm:p-7 border-2 border-emerald-300 shadow-sm flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border-3 border-emerald-400 flex items-center justify-center text-4xl sm:text-5xl shadow-md">
            {student.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                Mã số: {student.id}
              </span>
              <span className="text-xs font-bold text-stone-600">
                {student.className || 'Lớp 3'} – {TEACHER_CONFIG.schoolShort}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-display mt-0.5">
              Hành Trình Của {settings.demoPrivacyMode ? student.demoName : student.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-800 font-medium">
              Chủ nhiệm: <strong>{TEACHER_CONFIG.name}</strong> • Mã kết nối gia đình: <strong>{student.parentCode}</strong>
            </p>
          </div>
        </div>

        {/* Highlight Stats Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-emerald-200 text-center shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 block">Bông hoa chữ</span>
            <span className="text-xl sm:text-2xl font-black text-rose-600 flex items-center justify-center gap-1">
              <span>🌸</span>
              <span>{student.flowersEarned}</span>
            </span>
          </div>

          <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-emerald-200 text-center shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 block">Ngôi sao sáng</span>
            <span className="text-xl sm:text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
              <span>⭐</span>
              <span>{student.starsEarned}</span>
            </span>
          </div>

          <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-emerald-200 text-center shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 block">Bài hoàn thành</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 flex items-center justify-center gap-1">
              <span>📝</span>
              <span>{submissions.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* The Visual Growing Tree & Flowers Garden */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 border-2 border-emerald-300 relative overflow-hidden text-center shadow-xs">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold shadow-xs mb-3">
          <Trees className="w-4 h-4 text-emerald-600" />
          <span>Cấp độ vườn hoa: {student.treeLevel}/5 – {treeTitles[student.treeLevel - 1] || treeTitles[0]}</span>
        </div>

        {/* Tree SVG Illustration */}
        <div className="py-2 flex justify-center">
          <svg viewBox="0 0 200 160" className="w-48 h-40 drop-shadow-md">
            {/* Hill */}
            <ellipse cx="100" cy="155" rx="85" ry="22" fill="#86efac" />
            {/* Trunk */}
            <path d="M 94 150 Q 92 100 95 80 Q 98 60 100 50 Q 102 60 105 80 Q 108 100 106 150 Z" fill="#78350f" />
            {/* Branches */}
            <path d="M 98 80 Q 80 70 70 65" stroke="#78350f" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 102 85 Q 120 75 130 70" stroke="#78350f" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Foliage based on tree level */}
            <circle cx="100" cy="45" r={22 + student.treeLevel * 6} fill="#4ade80" opacity="0.9" />
            <circle cx="75" cy="55" r={16 + student.treeLevel * 4} fill="#22c55e" opacity="0.85" />
            <circle cx="125" cy="55" r={16 + student.treeLevel * 4} fill="#22c55e" opacity="0.85" />
            {/* Blooming flowers on the tree */}
            {student.flowersEarned >= 2 && <circle cx="85" cy="40" r="6" fill="#f43f5e" />}
            {student.flowersEarned >= 4 && <circle cx="115" cy="45" r="7" fill="#ec4899" />}
            {student.flowersEarned >= 6 && <circle cx="100" cy="28" r="7" fill="#fbbf24" />}
            {student.flowersEarned >= 8 && <circle cx="70" cy="65" r="6" fill="#f43f5e" />}
            {student.flowersEarned >= 10 && <circle cx="130" cy="62" r="7" fill="#a855f7" />}
          </svg>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-emerald-950 mt-1 max-w-lg mx-auto">
          Mỗi bài văn con viết là một giọt phù sa nuôi dưỡng cây chữ lớn lên. Hôm nay con đã đạt <strong>{student.flowersEarned} bông hoa chữ</strong> và <strong>{student.starsEarned} ngôi sao chăm ngoan</strong>!
        </p>
      </div>

      {/* Formative Qualitative Skills Evaluation - No numerical GPA */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 font-display">
                Sự Tiến Bộ Theo 4 Năng Lực Viết (GDPT 2018)
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Đánh giá theo mức độ tiến bộ định tính, khích lệ tự nhiên, không áp đặt điểm số
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skill 1: Chính tả & Dấu câu */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-xs sm:text-sm flex items-center gap-1.5">
                <span>✏️</span>
                <span>Chính tả & Dấu câu</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                Thực hiện khá tốt
              </span>
            </div>
            <div className="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: '85%' }} />
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Con biết viết hoa đầu câu, dùng dấu chấm ngắt câu rõ ràng và ít mắc lỗi chính tả cơ bản.
            </p>
          </div>

          {/* Skill 2: Bố cục & Trình tự */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-xs sm:text-sm flex items-center gap-1.5">
                <span>📑</span>
                <span>Bố cục & Trình tự ý</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-200 text-sky-900">
                Có tiến bộ vượt bậc
              </span>
            </div>
            <div className="w-full bg-sky-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-sky-600 h-full rounded-full transition-all duration-500" style={{ width: '80%' }} />
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Biết lập dàn ý 3 phần (Mở đoạn, Thân đoạn, Kết đoạn) trước khi viết và triển khai các ý theo trình tự hợp lý.
            </p>
          </div>

          {/* Skill 3: Vốn từ & Hình ảnh */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-xs sm:text-sm flex items-center gap-1.5">
                <span>🌸</span>
                <span>Vốn từ & Hình ảnh so sánh</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Khá tốt & phong phú
              </span>
            </div>
            <div className="w-full bg-amber-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '90%' }} />
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Vận dụng từ láy, từ gợi cảm giác và hình ảnh so sánh sinh động giúp bài văn giàu sức gợi.
            </p>
          </div>

          {/* Skill 4: Cảm xúc chân thật */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-xs sm:text-sm flex items-center gap-1.5">
                <span>💖</span>
                <span>Cảm xúc & Dấu ấn cá nhân</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900">
                Tiếp tục phát huy nhé!
              </span>
            </div>
            <div className="w-full bg-rose-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: '95%' }} />
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Bài viết luôn chan chứa tình cảm chân thật dành cho gia đình, bạn bè và mái trường thân yêu.
            </p>
          </div>
        </div>
      </div>

      {/* Flower Badges Section */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <span className="text-xl">🏆</span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 font-display">
              Bộ Sưu Tập Huy Hiệu Hoa Nhỏ
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Ghi nhận những dấu mốc nỗ lực trên từng trang viết
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                b.achieved
                  ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300 shadow-xs'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div className="text-3xl mb-1.5">{b.icon}</div>
              <h4 className="font-extrabold text-xs sm:text-sm text-stone-900">{b.title}</h4>
              <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">{b.description}</p>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                b.achieved ? 'bg-amber-200 text-amber-900' : 'bg-stone-200 text-stone-600'
              }`}>
                {b.achieved ? '✓ Đã đạt' : 'Đang phấn đấu'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions History with Teacher Feedback */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 font-display">
                Nhật Ký Các Bài Viết Đã Nở Hoa ({submissions.length})
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Lưu giữ bài văn, lời nhận xét từ {TEACHER_CONFIG.name} và các bản sửa mới
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                filterType === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Tất cả ({submissions.length})
            </button>
            <button
              onClick={() => setFilterType('reviewed')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                filterType === 'reviewed' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Đã nhận xét ({reviewedSubmissions.length})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredSubmissions.map((sub, idx) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl border-2 border-stone-200 hover:border-emerald-300 transition-all bg-white hover:bg-emerald-50/20 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base text-stone-900">
                    {sub.taskTitle}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {sub.status === 'reviewed' ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ {sub.teacherFeedback?.flowerSticker || '🌸 Bông hoa viết hay'}
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      ⏳ Đang chờ cô đọc
                    </span>
                  )}
                  <button
                    onClick={() => setSelectedSubDetail(selectedSubDetail?.id === sub.id ? null : sub)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 ml-1"
                  >
                    <span>{selectedSubDetail?.id === sub.id ? 'Thu gọn' : 'Xem bài'}</span>
                  </button>
                </div>
              </div>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-stone-700 italic bg-stone-50 p-3 rounded-xl border border-stone-100 line-clamp-2">
                "{sub.finalContent}"
              </p>

              {/* Detailed View when expanded */}
              {selectedSubDetail?.id === sub.id && (
                <div className="pt-2 space-y-3 border-t border-stone-100 animate-fade-in">
                  <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
                    <span className="text-xs font-bold text-amber-900 block mb-1">Toàn văn bài viết của con:</span>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium whitespace-pre-wrap">
                      {sub.finalContent}
                    </p>
                  </div>

                  {sub.teacherFeedback && sub.teacherFeedback.status === 'published' && (
                    <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <span>👩‍🏫</span>
                          <span>Lời dặn dò từ {sub.teacherFeedback.teacherName || TEACHER_CONFIG.name}:</span>
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                          {sub.teacherFeedback.flowerSticker || '🌸 Bông hoa khen ngợi'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-stone-800 italic bg-white p-2.5 rounded-lg border border-emerald-100">
                        "{sub.teacherFeedback.comment}"
                      </p>
                      {sub.teacherFeedback.teacherAdvice && (
                        <p className="text-xs text-purple-900 font-medium">
                          <strong>💌 Lời cô dặn:</strong> {sub.teacherFeedback.teacherAdvice}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {submissions.length === 0 && (
            <div className="p-8 text-center text-stone-400 text-sm italic">
              Con chưa nộp bài viết nào. Hãy vào Góc của em để cùng Hoa Nhỏ gieo hạt ý tưởng nhé!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
