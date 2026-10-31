import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  Info, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FileText,
  Heart,
  CheckCircle
} from 'lucide-react';
import { Student, Submission, AppSettings } from '../types';
import { 
  extractSubmissionErrors, 
  calculateCompetenciesForSubmission, 
  getPublishedPeriodicExamScores,
  GRADE_COMPETENCY_EXPECTATIONS,
  DetailedErrorItem,
  CompetencyItem,
  PeriodicExamScoreItem
} from '../utils/studentProgressEngine';

interface StudentSkillProgressTabProps {
  student: Student;
  submissions: Submission[];
  settings?: AppSettings;
  onOpenSubmissionReview?: (sub: Submission) => void;
}

export const StudentSkillProgressTab: React.FC<StudentSkillProgressTabProps> = ({
  student,
  submissions,
  settings,
  onOpenSubmissionReview
}) => {
  // 1. Trích xuất danh sách bài viết thực tế của học sinh này
  const studentSubs = useMemo(() => {
    return submissions
      .filter(s => s.studentId === student.id)
      .sort((a, b) => {
        const dateA = new Date(a.completedAt || a.startedAt || 0).getTime();
        const dateB = new Date(b.completedAt || b.startedAt || 0).getTime();
        return dateA - dateB;
      });
  }, [submissions, student.id]);

  // Bộ lọc cho Mục 1: Con cần luyện thêm (Lọc theo bài viết cụ thể hoặc Tất cả)
  const [errorFilterSubId, setErrorFilterSubId] = useState<string>('all');
  const [selectedErrorCategory, setSelectedErrorCategory] = useState<'all' | 'chinh_ta' | 'dung_tu' | 'dat_cau' | 'bo_cuc'>('chinh_ta');

  // Bộ lọc cho Mục 2: Điểm mạnh của con (chọn bài viết để xem năng lực và so sánh)
  const [competencySubId, setCompetencySubId] = useState<string>(() => {
    return studentSubs.length > 0 ? studentSubs[studentSubs.length - 1].id : '';
  });

  // Tự động đồng bộ bài viết khi danh sách thay đổi
  React.useEffect(() => {
    if (studentSubs.length > 0) {
      if (!studentSubs.some(s => s.id === competencySubId)) {
        setCompetencySubId(studentSubs[studentSubs.length - 1].id);
      }
    } else {
      setCompetencySubId('');
    }
  }, [studentSubs, competencySubId]);

  // Khối lớp học sinh (1 đến 5 theo CTGDPT 2018)
  const studentGradeNumber = student.grade || (student.classId?.startsWith('L4') ? 4 : student.classId?.startsWith('L5') ? 5 : 3);
  const gradeExpectations = GRADE_COMPETENCY_EXPECTATIONS[studentGradeNumber] || GRADE_COMPETENCY_EXPECTATIONS[3];

  // -------------------------------------------------------------
  // MỤC 1: DỮ LIỆU "CON CẦN LUYỆN THÊM" (Càng thấp càng tốt)
  // -------------------------------------------------------------
  const relevantSubsForErrors = useMemo(() => {
    if (errorFilterSubId === 'all') return studentSubs;
    return studentSubs.filter(s => s.id === errorFilterSubId);
  }, [studentSubs, errorFilterSubId]);

  const allDetectedErrors = useMemo(() => {
    return extractSubmissionErrors(relevantSubsForErrors);
  }, [relevantSubsForErrors]);

  const errorCountsByCategory = useMemo(() => {
    const counts = {
      chinh_ta: 0,
      dung_tu: 0,
      dat_cau: 0,
      bo_cuc: 0
    };
    allDetectedErrors.forEach(err => {
      if (counts[err.category] !== undefined) {
        counts[err.category]++;
      }
    });
    return counts;
  }, [allDetectedErrors]);

  const activeCategoryErrors = useMemo(() => {
    if (selectedErrorCategory === 'all') return allDetectedErrors;
    return allDetectedErrors.filter(err => err.category === selectedErrorCategory);
  }, [allDetectedErrors, selectedErrorCategory]);

  const maxErrorCount = Math.max(
    errorCountsByCategory.chinh_ta,
    errorCountsByCategory.dung_tu,
    errorCountsByCategory.dat_cau,
    errorCountsByCategory.bo_cuc,
    5
  );

  // -------------------------------------------------------------
  // MỤC 2: DỮ LIỆU "ĐIỂM MẠNH CỦA CON" (Thang 1-5, Càng cao càng tốt)
  // -------------------------------------------------------------
  const { currentSub, prevSub, competencies } = useMemo(() => {
    if (!competencySubId || studentSubs.length === 0) {
      return { currentSub: null, prevSub: null, competencies: [] };
    }
    const currIndex = studentSubs.findIndex(s => s.id === competencySubId);
    const curr = currIndex >= 0 ? studentSubs[currIndex] : studentSubs[studentSubs.length - 1];
    const prev = currIndex > 0 ? studentSubs[currIndex - 1] : null;

    const comps = calculateCompetenciesForSubmission(curr, prev, studentGradeNumber);
    return { currentSub: curr, prevSub: prev, competencies: comps };
  }, [competencySubId, studentSubs, studentGradeNumber]);

  // -------------------------------------------------------------
  // MỤC 3: DỮ LIỆU "CON TIẾN BỘ MỖI NGÀY" (Điểm kiểm tra định kỳ thang 0-10)
  // -------------------------------------------------------------
  const periodicExamScores = useMemo(() => {
    return getPublishedPeriodicExamScores(studentSubs);
  }, [studentSubs]);

  // Đếm các năng lực nổi bật (mức 4 hoặc 5 sao)
  const strongCompetencies = competencies.filter(c => c.score >= 4);

  return (
    <div className="space-y-6">
      {/* 1. Header: Hành trình tiến bộ của con */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-3xl p-5 shadow-sm border border-emerald-700/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {student.avatar || '🌸'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                  {settings?.demoPrivacyMode ? student.demoName : student.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-700/70 text-emerald-100 border border-emerald-500/30">
                  {student.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                  Khối {studentGradeNumber} (GDPT 2018)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 flex items-center gap-2 flex-wrap">
                <span>📚 Đã viết: <strong>{studentSubs.length} bài</strong></span>
                <span>•</span>
                <span>🌸 Hoa tích lũy: <strong>{student.flowersEarned} bông hoa</strong></span>
                <span>•</span>
                <span>⭐ Năng lực nổi bật: <strong>{strongCompetencies.length}/4 tiêu chí</strong></span>
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-right shrink-0">
            <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
              Hành trình tiến bộ
            </span>
          </div>
        </div>
      </div>

      {studentSubs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-stone-200 space-y-3">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h4 className="text-base font-bold text-stone-700">Chưa có bài viết nào của học sinh này</h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Học sinh {settings?.demoPrivacyMode ? student.demoName : student.name} chưa nộp bài viết nào trong hệ thống. Hãy giao bài tập hoặc nhắc học sinh làm bài để kích hoạt hồ sơ năng lực.
          </p>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* MỤC 1: CON CẦN LUYỆN THÊM                                                 */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Header Mục 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                    <AlertCircle className="w-4 h-4" />
                  </span>
                  <h3 className="font-display font-black text-base sm:text-lg text-stone-900">
                    1. Con cần luyện thêm
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Ghi nhận các điểm con cần rèn thêm theo 4 nhóm kỹ năng (Chính tả, Dùng từ, Đặt câu, Bố cục). Bấm vào cột để xem trích đoạn và lời dặn của cô.
                </p>
              </div>

              {/* Bộ lọc bài viết & số liệu thực tế */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                  Tổng điểm cần rèn: {allDetectedErrors.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-500">Xem theo bài:</span>
                  <select
                    value={errorFilterSubId}
                    onChange={(e) => setErrorFilterSubId(e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 focus:outline-hidden focus:border-emerald-500 text-stone-800"
                  >
                    <option value="all">Tất cả bài viết ({studentSubs.length} bài)</option>
                    {studentSubs.map(s => (
                      <option key={s.id} value={s.id}>
                        {new Date(s.completedAt || s.startedAt || '').toLocaleDateString('vi-VN')} - {s.taskTitle || s.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Biểu đồ cột Tần suất điểm cần rèn */}
            <div className="pt-2">
              <div className="grid grid-cols-4 gap-3 sm:gap-6 items-end h-52 pb-4 border-b border-stone-200 relative">
                {/* Đường gióng trục Y */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between text-[10px] text-stone-300 font-mono">
                  <div className="border-b border-dashed border-stone-200 w-full pt-1">
                    <span>{maxErrorCount} điểm</span>
                  </div>
                  <div className="border-b border-dashed border-stone-200 w-full">
                    <span>{Math.round(maxErrorCount / 2)} điểm</span>
                  </div>
                  <div className="border-b border-stone-300 w-full">
                    <span>0 điểm</span>
                  </div>
                </div>

                {[
                  {
                    key: 'chinh_ta',
                    label: 'Chính tả',
                    subLabel: 'Viết hoa & dấu câu',
                    count: errorCountsByCategory.chinh_ta,
                    barColor: 'from-sky-500 to-blue-600',
                    activeRing: 'ring-blue-400 bg-blue-50/50',
                    textColor: 'text-blue-700'
                  },
                  {
                    key: 'dung_tu',
                    label: 'Dùng từ',
                    subLabel: 'Vốn từ & lặp từ',
                    count: errorCountsByCategory.dung_tu,
                    barColor: 'from-indigo-500 to-purple-600',
                    activeRing: 'ring-purple-400 bg-purple-50/50',
                    textColor: 'text-purple-700'
                  },
                  {
                    key: 'dat_cau',
                    label: 'Đặt câu',
                    subLabel: 'Cú pháp & ngữ pháp',
                    count: errorCountsByCategory.dat_cau,
                    barColor: 'from-amber-500 to-orange-600',
                    activeRing: 'ring-amber-400 bg-amber-50/50',
                    textColor: 'text-amber-700'
                  },
                  {
                    key: 'bo_cuc',
                    label: 'Bố cục',
                    subLabel: 'Đoạn & chuyển ý',
                    count: errorCountsByCategory.bo_cuc,
                    barColor: 'from-teal-500 to-emerald-600',
                    activeRing: 'ring-emerald-400 bg-emerald-50/50',
                    textColor: 'text-emerald-700'
                  }
                ].map((col) => {
                  const isSelected = selectedErrorCategory === col.key;
                  const heightPercent = col.count === 0 
                    ? 8 
                    : Math.max(12, Math.round((col.count / maxErrorCount) * 88));

                  return (
                    <div
                      key={col.key}
                      onClick={() => setSelectedErrorCategory(col.key as any)}
                      className={`relative flex flex-col items-center justify-end h-full z-10 cursor-pointer group p-1.5 rounded-2xl transition-all ${
                        isSelected ? `ring-2 ${col.activeRing}` : 'hover:bg-stone-50'
                      }`}
                      title={`Bấm xem chi tiết nhóm ${col.label}`}
                    >
                      <div className={`mb-1.5 text-xs font-black px-2 py-0.5 rounded-full transition-transform group-hover:scale-110 ${
                        col.count === 0 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-stone-900 text-white shadow-xs'
                      }`}>
                        {col.count === 0 ? '✓ 0' : `${col.count} điểm`}
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[56px] rounded-t-xl bg-gradient-to-t ${col.barColor} transition-all duration-300 shadow-xs relative overflow-hidden group-hover:brightness-105 flex items-center justify-center`}
                      >
                        {col.count === 0 && (
                          <span className="text-[10px] font-black text-white/90">
                            TỐT
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-center w-full">
                        <span className={`block font-extrabold text-xs leading-tight ${col.textColor}`}>
                          {col.label}
                        </span>
                        <span className="block text-[10px] text-stone-400 font-medium hidden sm:inline">
                          {col.subLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nút bấm chọn lọc theo nhóm */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-stone-500 mr-1">Xem nhóm:</span>
                  <button
                    onClick={() => setSelectedErrorCategory('all')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedErrorCategory === 'all'
                        ? 'bg-stone-800 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Tất cả ({allDetectedErrors.length})
                  </button>
                  <button
                    onClick={() => setSelectedErrorCategory('chinh_ta')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedErrorCategory === 'chinh_ta'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Chính tả ({errorCountsByCategory.chinh_ta})
                  </button>
                  <button
                    onClick={() => setSelectedErrorCategory('dung_tu')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedErrorCategory === 'dung_tu'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    Dùng từ ({errorCountsByCategory.dung_tu})
                  </button>
                  <button
                    onClick={() => setSelectedErrorCategory('dat_cau')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedErrorCategory === 'dat_cau'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    Đặt câu ({errorCountsByCategory.dat_cau})
                  </button>
                  <button
                    onClick={() => setSelectedErrorCategory('bo_cuc')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedErrorCategory === 'bo_cuc'
                        ? 'bg-teal-600 text-white'
                        : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                    }`}
                  >
                    Bố cục ({errorCountsByCategory.bo_cuc})
                  </button>
                </div>

                <span className="text-[11px] text-stone-400 italic">
                  * Nhấp chuột vào cột để lọc chi tiết
                </span>
              </div>
            </div>

            {/* Chi tiết điểm con cần rèn thêm và lời hướng dẫn */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    Chi tiết các điểm cần rèn {selectedErrorCategory === 'all' ? 'tổng hợp' : `nhóm "${selectedErrorCategory === 'chinh_ta' ? 'Chính tả' : selectedErrorCategory === 'dung_tu' ? 'Dùng từ' : selectedErrorCategory === 'dat_cau' ? 'Đặt câu' : 'Bố cục'}"`} ({activeCategoryErrors.length} điểm)
                  </span>
                </span>
              </div>

              {activeCategoryErrors.length === 0 ? (
                <div className="py-6 text-center text-emerald-800 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xs font-bold">
                    Con đã làm rất tốt! Không có điểm nào cần sửa lại trong phần này.
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Học sinh nắm vững kỹ năng tương ứng với yêu cầu cần đạt Khối {studentGradeNumber}.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {activeCategoryErrors.map((err, idx) => (
                    <div
                      key={err.id || idx}
                      className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            err.category === 'chinh_ta' ? 'bg-blue-100 text-blue-800' :
                            err.category === 'dung_tu' ? 'bg-purple-100 text-purple-800' :
                            err.category === 'dat_cau' ? 'bg-amber-100 text-amber-800' :
                            'bg-teal-100 text-teal-800'
                          }`}>
                            {err.categoryLabel}
                          </span>
                          <span className="font-bold text-stone-900">{err.errorName}</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-medium">
                          {err.date} • {err.submissionTitle}
                        </span>
                      </div>

                      {/* Trích đoạn bài văn */}
                      <div className="text-xs text-stone-600 bg-rose-50/60 p-2 rounded-lg border border-rose-100 font-mono">
                        <span className="font-sans font-bold text-rose-800 mr-1.5">Vị trí bài văn:</span>
                        <span className="text-rose-900 font-medium">"{err.contextText}"</span>
                      </div>

                      {/* Hướng dẫn gợi ý sửa */}
                      <div className="text-xs text-stone-700 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                        <span className="font-bold text-emerald-800 mr-1.5">💡 Lời dặn của cô:</span>
                        <span className="text-emerald-950 font-medium">{err.suggestion}</span>
                        {err.explanation && (
                          <p className="text-[11px] text-stone-500 mt-1 italic">
                            * {err.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MỤC 2: ĐIỂM MẠNH CỦA CON (THANG 1-5, CÀNG CAO CÀNG TỐT)                   */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Header Mục 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                    <Award className="w-4 h-4" />
                  </span>
                  <h3 className="font-display font-black text-base sm:text-lg text-stone-900">
                    2. Điểm mạnh của con
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Đánh giá 4 năng lực thành phần theo thang điểm 1–5 sao và ghi nhận những điểm sáng nổi bật của học sinh.
                </p>
              </div>

              {/* Bộ chọn bài viết */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {prevSub && (
                  <span className="text-xs text-stone-600 font-semibold bg-stone-100 px-2.5 py-1.5 rounded-xl border border-stone-200">
                    So sánh: Bài trước ({new Date(prevSub.completedAt || prevSub.startedAt || '').toLocaleDateString('vi-VN')})
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-500">Bài đánh giá:</span>
                  <select
                    value={competencySubId}
                    onChange={(e) => setCompetencySubId(e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 focus:outline-hidden focus:border-amber-500 text-stone-800 max-w-xs"
                  >
                    {studentSubs.map((s, idx) => (
                      <option key={s.id} value={s.id}>
                        Bài {idx + 1}: {s.taskTitle || s.id} ({new Date(s.completedAt || s.startedAt || '').toLocaleDateString('vi-VN')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Biểu đồ 4 cột năng lực thành phần */}
            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 items-end h-56 pb-4 border-b border-stone-200 relative">
                {/* Đường gióng trục Y từ 1 đến 5 */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between text-[10px] text-stone-300 font-mono">
                  <div className="border-b border-dashed border-stone-200 w-full pt-1 flex justify-between">
                    <span>Mức 5: Xuất sắc</span>
                  </div>
                  <div className="border-b border-dashed border-stone-200 w-full flex justify-between">
                    <span>Mức 4: Khá tốt</span>
                  </div>
                  <div className="border-b border-dashed border-stone-200 w-full flex justify-between">
                    <span>Mức 3: Đạt chuẩn</span>
                  </div>
                  <div className="border-b border-dashed border-stone-200 w-full flex justify-between">
                    <span>Mức 2: Hoàn thành một phần</span>
                  </div>
                  <div className="border-b border-stone-300 w-full flex justify-between">
                    <span>Mức 1: Cần cố gắng</span>
                  </div>
                </div>

                {competencies.map((comp) => {
                  const heightPercent = Math.max(18, Math.round((comp.score / 5) * 92));

                  let deltaBadge = null;
                  if (!prevSub) {
                    deltaBadge = (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        Bài khởi đầu
                      </span>
                    );
                  } else if (comp.deltaFromPrevious > 0) {
                    deltaBadge = (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                        <span>+{comp.deltaFromPrevious} bậc</span>
                      </span>
                    );
                  } else if (comp.deltaFromPrevious < 0) {
                    deltaBadge = (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-0.5">
                        <ArrowDownRight className="w-3 h-3 text-rose-600" />
                        <span>{comp.deltaFromPrevious} bậc</span>
                      </span>
                    );
                  } else {
                    deltaBadge = (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-0.5">
                        <Minus className="w-3 h-3 text-blue-600" />
                        <span>Giữ vững</span>
                      </span>
                    );
                  }

                  let gradient = 'from-emerald-500 to-teal-600';
                  if (comp.score >= 5) gradient = 'from-amber-400 via-amber-500 to-emerald-600';
                  else if (comp.score === 4) gradient = 'from-teal-500 to-emerald-600';
                  else if (comp.score === 3) gradient = 'from-blue-500 to-teal-600';
                  else if (comp.score === 2) gradient = 'from-amber-500 to-orange-500';
                  else gradient = 'from-rose-400 to-rose-600';

                  return (
                    <div
                      key={comp.key}
                      className="relative flex flex-col items-center justify-end h-full z-10 p-1.5 rounded-2xl hover:bg-stone-50 transition-all group"
                    >
                      <div className="mb-2 flex flex-col items-center gap-1">
                        {deltaBadge}
                        <div className="text-xs font-black px-2 py-0.5 rounded-full bg-stone-900 text-white shadow-xs">
                          {comp.score} / 5 ⭐
                        </div>
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[56px] rounded-t-xl bg-gradient-to-t ${gradient} transition-all duration-300 shadow-xs relative overflow-hidden group-hover:brightness-105 flex items-end justify-center pb-1`}
                      >
                        <span className="text-[11px] font-black text-white/90 drop-shadow-xs">
                          {comp.score}★
                        </span>
                      </div>

                      <div className="mt-2 text-center w-full">
                        <span className="block font-extrabold text-xs text-stone-900 leading-tight">
                          {comp.label}
                        </span>
                        <span className="block text-[10px] font-semibold text-emerald-700 mt-0.5">
                          {comp.levelLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Thẻ ghi nhận chi tiết điểm mạnh và minh chứng thực tế */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {competencies.map((comp) => (
                <div
                  key={comp.key}
                  className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{comp.label}</span>
                    </span>
                    <span className="text-xs font-black text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                      {comp.score}/5 ⭐ ({comp.levelLabel})
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 bg-white p-2 rounded-xl border border-stone-200/80">
                    <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wide text-emerald-800">
                      Yêu cầu cần đạt Khối {studentGradeNumber}:
                    </span>
                    <p className="mt-0.5 text-stone-700 leading-relaxed">
                      {comp.gradeExpectation}
                    </p>
                  </div>

                  <div className="text-xs text-stone-600 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wide">
                      Điểm sáng ghi nhận từ bài viết:
                    </span>
                    <p className="mt-0.5 text-emerald-950 italic leading-relaxed">
                      "{comp.evidence}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MỤC 3: CON TIẾN BỘ MỖI NGÀY (LỊCH SỬ ĐIỂM SỐ ĐỊNH KỲ THANG 0-10)          */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Header Mục 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h3 className="font-display font-black text-base sm:text-lg text-stone-900">
                    3. Con tiến bộ mỗi ngày
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Theo dõi sự trưởng thành qua từng bài viết và lịch sử điểm số bài kiểm tra định kỳ chính thức (thang điểm 10).
                </p>
              </div>

              <div className="px-3 py-1 rounded-xl bg-stone-100 text-stone-700 text-xs font-extrabold flex items-center gap-1.5 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>Số bài định kỳ: {periodicExamScores.length}</span>
              </div>
            </div>

            {/* Nếu chưa có bài kiểm tra định kỳ: hiển thị chính xác text yêu cầu */}
            {periodicExamScores.length === 0 ? (
              <div className="py-12 px-4 text-center bg-stone-50/80 rounded-2xl border-2 border-dashed border-stone-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                {/* BẮT BUỘC: Hiển thị chính xác chuỗi "Chưa có bài đánh giá định kỳ" */}
                <h4 className="text-base font-extrabold text-stone-700">
                  Chưa có bài đánh giá định kỳ
                </h4>
                <p className="text-xs text-stone-500 max-w-lg mx-auto leading-relaxed">
                  Học sinh chưa có bài kiểm tra định kỳ nào được giáo viên cho điểm và công bố. Các bài viết đã nộp hiện tại là bài rèn luyện và đánh giá thường xuyên bằng lời nhận xét.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Biểu đồ cột điểm số định kỳ theo thời gian */}
                <div className="pt-2">
                  <div className="grid grid-flow-col auto-cols-fr gap-4 sm:gap-8 items-end h-56 pb-4 border-b border-stone-200 relative overflow-x-auto">
                    {/* Các mốc điểm Y (0, 2, 4, 6, 8, 10) */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between text-[10px] text-stone-300 font-mono">
                      <div className="border-b border-dashed border-stone-200 w-full pt-0.5">
                        <span>10 điểm</span>
                      </div>
                      <div className="border-b border-dashed border-stone-200 w-full">
                        <span>8 điểm (Hoàn thành tốt)</span>
                      </div>
                      <div className="border-b border-dashed border-stone-200 w-full">
                        <span>5 điểm (Hoàn thành)</span>
                      </div>
                      <div className="border-b border-stone-300 w-full">
                        <span>0 điểm</span>
                      </div>
                    </div>

                    {periodicExamScores.map((exam, idx) => {
                      const heightPercent = Math.max(12, Math.round((exam.score / 10) * 90));
                      let barGradient = 'from-blue-500 to-indigo-600';
                      if (exam.score >= 9) barGradient = 'from-emerald-500 to-teal-600';
                      else if (exam.score >= 7) barGradient = 'from-blue-500 to-teal-600';
                      else if (exam.score >= 5) barGradient = 'from-amber-500 to-yellow-600';
                      else barGradient = 'from-rose-500 to-orange-500';

                      return (
                        <div
                          key={exam.submissionId || idx}
                          className="relative flex flex-col items-center justify-end h-full z-10 p-2 rounded-2xl hover:bg-stone-50 transition-all group min-w-[70px]"
                        >
                          <div className="mb-2 text-center">
                            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-stone-900 text-white shadow-xs">
                              {exam.score} / 10
                            </span>
                          </div>

                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full max-w-[48px] rounded-t-xl bg-gradient-to-t ${barGradient} transition-all duration-300 shadow-xs relative overflow-hidden group-hover:brightness-105 flex items-center justify-center`}
                          >
                            <span className="text-xs font-black text-white/90">
                              {exam.score}
                            </span>
                          </div>

                          <div className="mt-2 text-center w-full">
                            <span className="block font-bold text-xs text-stone-900 truncate max-w-[110px]" title={exam.title}>
                              {exam.title}
                            </span>
                            <span className="block text-[10px] text-stone-400 font-medium">
                              {exam.date}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Danh sách các bài kiểm tra định kỳ có dữ liệu thực */}
                <div className="space-y-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
                    Danh mục bài kiểm tra định kỳ đã công bố ({periodicExamScores.length} bài)
                  </span>
                  {periodicExamScores.map((exam, idx) => (
                    <div
                      key={exam.submissionId || idx}
                      className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h5 className="font-extrabold text-xs sm:text-sm text-stone-900">
                            {exam.title}
                          </h5>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Đã công bố
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Ngày nộp: {exam.date} • Người chấm: {exam.teacherName}
                        </p>
                        {exam.comment && (
                          <p className="text-xs text-stone-700 italic mt-1">
                            Nhận xét: "{exam.comment}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                            Điểm số
                          </span>
                          <span className="text-xl font-black text-emerald-700 font-display">
                            {exam.score} / 10
                          </span>
                        </div>

                        {onOpenSubmissionReview && (
                          <button
                            onClick={() => {
                              const targetSub = studentSubs.find(s => s.id === exam.submissionId);
                              if (targetSub) onOpenSubmissionReview(targetSub);
                            }}
                            className="p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer"
                            title="Xem chi tiết bài thi"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentSkillProgressTab;
