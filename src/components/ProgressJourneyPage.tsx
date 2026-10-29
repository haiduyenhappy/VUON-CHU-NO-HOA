import React, { useState, useEffect, useMemo } from 'react';
import { Student, Submission, AppSettings, WritingSkillId } from '../types';
import { TEACHER_CONFIG } from '../constants/teacherConfig';
import { playPop, playChime } from '../utils/audio';
import { 
  WRITING_SKILLS_META, 
  calculateStudentSkillAverages, 
  getLevelFromScore, 
  getScoreBadgeColor 
} from '../utils/writingSkillsRubric';
import { 
  Trees, 
  Star, 
  Award, 
  Heart, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  BookOpen, 
  ArrowLeft, 
  Calendar,
  Flame,
  FileText,
  Smile,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  BarChart3,
  ListOrdered,
  RotateCcw,
  Play,
  Eye,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  X,
  Target,
  Lightbulb,
  Edit3
} from 'lucide-react';

interface ProgressJourneyPageProps {
  student: Student;
  settings: AppSettings;
  onBack: () => void;
  returnViewName?: string;
  onResumeSubmission?: (submission: Submission) => void;
}

export const ProgressJourneyPage: React.FC<ProgressJourneyPageProps> = ({
  student,
  settings,
  onBack,
  returnViewName = 'Góc học tập',
  onResumeSubmission
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubDetail, setSelectedSubDetail] = useState<Submission | null>(null);
  const [journeyModalSub, setJourneyModalSub] = useState<Submission | null>(null);
  
  // Filter for Submissions list (Zone 4)
  const [statusFilter, setStatusFilter] = useState<'all' | 'DANG_LAM' | 'CHO_NHAN_XET' | 'DA_HOAN_THANH'>('all');

  // Filter for Line Chart (Zone 2)
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<WritingSkillId | 'all'>('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState<'all' | 'month' | 'semester'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{
    subId: string;
    subTitle: string;
    date: string;
    skillName: string;
    score: number;
    levelLabel: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/submissions?studentId=${student.id}`)
      .then(res => res.json())
      .then(d => {
        setSubmissions(d.submissions || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [student.id]);

  // Derived statistics for Zone 1
  const completedSubs = useMemo(() => 
    submissions.filter(s => s.lifecycleStatus === 'DA_HOAN_THANH' || s.status === 'reviewed'),
    [submissions]
  );

  const inProgressSubs = useMemo(() => 
    submissions.filter(s => s.lifecycleStatus === 'DANG_LAM' || s.status === 'draft' || s.lifecycleStatus === 'CAN_CHINH_SUA'),
    [submissions]
  );

  const reviewedSubs = useMemo(() => 
    submissions.filter(s => !!s.teacherFeedback && (s.teacherFeedback.status === 'published' || s.status === 'reviewed')),
    [submissions]
  );

  // Skill calculation for Zone 3 & Progress Summary
  const { skills: computedSkills, standoutSkill, needingPracticeSkill } = useMemo(() => 
    calculateStudentSkillAverages(submissions),
    [submissions]
  );

  // Submissions for Line Chart (Zone 2)
  const chartSubmissions = useMemo(() => {
    const list = [...submissions].reverse(); // Oldest to newest
    if (timeRangeFilter === 'month') {
      const monthAgo = Date.now() - 30 * 86400000;
      return list.filter(s => new Date(s.startedAt).getTime() >= monthAgo);
    }
    if (timeRangeFilter === 'semester') {
      const semesterAgo = Date.now() - 120 * 86400000;
      return list.filter(s => new Date(s.startedAt).getTime() >= semesterAgo);
    }
    return list;
  }, [submissions, timeRangeFilter]);

  // Filtered submissions for Zone 4 list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'DANG_LAM') return s.lifecycleStatus === 'DANG_LAM' || s.status === 'draft' || s.lifecycleStatus === 'CAN_CHINH_SUA';
      if (statusFilter === 'CHO_NHAN_XET') return s.lifecycleStatus === 'CHO_NHAN_XET' || s.lifecycleStatus === 'DA_NOP' || s.status === 'submitted';
      if (statusFilter === 'DA_HOAN_THANH') return s.lifecycleStatus === 'DA_HOAN_THANH' || s.status === 'reviewed';
      return true;
    });
  }, [submissions, statusFilter]);

  const treeTitles = [
    'Hạt mầm bé bỏng',
    'Cây non đâm chồi',
    'Cây vươn cành kết nụ',
    'Cây nở hoa rực rỡ',
    'Khu vườn chữ trăm hoa khoe sắc'
  ];

  // Helper for status badge
  const renderStatusBadge = (sub: Submission) => {
    const status = sub.lifecycleStatus || (sub.status === 'reviewed' ? 'DA_HOAN_THANH' : sub.status === 'submitted' ? 'CHO_NHAN_XET' : 'DANG_LAM');
    switch (status) {
      case 'DANG_LAM':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span>✏️</span>
            <span>Đang làm dở</span>
          </span>
        );
      case 'DA_NOP':
      case 'CHO_NHAN_XET':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300">
            <span>⏳</span>
            <span>Chờ cô nhận xét</span>
          </span>
        );
      case 'CAN_CHINH_SUA':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            <span>⚠️</span>
            <span>Cần chỉnh sửa thêm</span>
          </span>
        );
      case 'DA_HOAN_THANH':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span>✓</span>
            <span>Đã hoàn thành</span>
          </span>
        );
    }
  };

  // Helper for current step label
  const getStepLabel = (sub: Submission) => {
    if (sub.lastActiveStepLabel) return sub.lastActiveStepLabel;
    switch (sub.currentStep) {
      case 'hieu_de': return 'Bước 1: Hiểu đề';
      case 'tim_y': return 'Bước 2: Tìm ý';
      case 'so_do': return 'Bước 3: Sơ đồ tư duy';
      case 'dan_y': return 'Bước 4: Lập dàn ý';
      case 'viet_bai': return 'Bước 5: Viết bài nháp';
      case 'gop_y': return 'Bước 6: Góp ý AI';
      case 'chinh_sua': return 'Bước 7: Tự chỉnh sửa';
      case 'da_nop': return 'Bước 6: Đã nộp bài';
      case 'giao_vien_cham': return 'Bước 7: Cô giáo đã nhận xét';
      default: return 'Đang thực hiện';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-7 animate-fade-in">
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
            Hồ sơ học tập & Quá trình viết • Đánh giá định tính GDPT 2018
          </span>
        </div>
      </div>

      {/* Main Student Profile Card */}
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
          <div className="bg-white px-3.5 py-2 rounded-2xl border border-emerald-200 text-center shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 block">Bông hoa chữ</span>
            <span className="text-xl sm:text-2xl font-black text-rose-600 flex items-center justify-center gap-1">
              <span>🌸</span>
              <span>{student.flowersEarned}</span>
            </span>
          </div>

          <div className="bg-white px-3.5 py-2 rounded-2xl border border-emerald-200 text-center shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 block">Ngôi sao sáng</span>
            <span className="text-xl sm:text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
              <span>⭐</span>
              <span>{student.starsEarned}</span>
            </span>
          </div>

          <div className="bg-white px-3.5 py-2 rounded-2xl border border-emerald-200 text-center shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 block">Cấp độ vườn cây</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 flex items-center justify-center gap-1">
              <span>🌱</span>
              <span>{student.treeLevel}/5</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KHU VỰC 1: TỔNG QUAN                                                      */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-stone-900 font-display flex items-center gap-2">
            <span>🌿</span>
            <span>Khu vực 1: Tổng Quan Hành Trình Viết Văn</span>
          </h2>
          <span className="text-xs font-bold text-stone-500">Cập nhật theo dữ liệu thực tế</span>
        </div>

        {/* 4 Cards Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Đã hoàn thành */}
          <div className="bg-white p-4 rounded-3xl border-2 border-emerald-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
                Đã hoàn thành
              </span>
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base">
                ✓
              </span>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-emerald-950 font-display">
                {completedSubs.length}
              </span>
              <span className="text-xs text-stone-500 font-medium ml-1">bài văn</span>
            </div>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              Đã hoàn thành trọn vẹn và nở hoa
            </p>
          </div>

          {/* Card 2: Đang làm */}
          <div className="bg-white p-4 rounded-3xl border-2 border-amber-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wide">
                Đang làm dở
              </span>
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
                ✏️
              </span>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-amber-950 font-display">
                {inProgressSubs.length}
              </span>
              <span className="text-xs text-stone-500 font-medium ml-1">bài viết</span>
            </div>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              Có thể tiếp tục làm bất cứ lúc nào
            </p>
          </div>

          {/* Card 3: Đã nhận xét */}
          <div className="bg-white p-4 rounded-3xl border-2 border-sky-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-sky-800 uppercase tracking-wide">
                Cô đã nhận xét
              </span>
              <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-base">
                👩‍🏫
              </span>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-sky-950 font-display">
                {reviewedSubs.length}
              </span>
              <span className="text-xs text-stone-500 font-medium ml-1">lời dặn</span>
            </div>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              Lời khen và hướng dẫn từ {TEACHER_CONFIG.name}
            </p>
          </div>

          {/* Card 4: Kỹ năng tiến bộ nổi bật */}
          <div className="bg-white p-4 rounded-3xl border-2 border-rose-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wide">
                Tiến bộ nổi bật
              </span>
              <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-base">
                {standoutSkill?.icon || '🌸'}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-black text-rose-950 font-display leading-tight block truncate">
                {standoutSkill?.name || 'Cảm xúc & Sáng tạo'}
              </span>
            </div>
            <p className="text-[11px] text-rose-700 mt-1 font-bold">
              Đạt mức: Xuất sắc ({standoutSkill ? 'GDPT 2018' : 'Đang phát triển'})
            </p>
          </div>
        </div>

        {/* The Growing Tree Graphic */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 border-2 border-emerald-300 text-center shadow-xs">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/95 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold shadow-xs mb-2">
            <Trees className="w-4 h-4 text-emerald-600" />
            <span>Khu vườn văn học: {treeTitles[student.treeLevel - 1] || treeTitles[0]} (Cấp {student.treeLevel}/5)</span>
          </div>

          {/* Tree SVG */}
          <div className="py-2 flex justify-center">
            <svg viewBox="0 0 200 150" className="w-44 h-36 drop-shadow-md">
              <ellipse cx="100" cy="145" rx="80" ry="20" fill="#86efac" />
              <path d="M 94 140 Q 92 95 95 75 Q 98 55 100 45 Q 102 55 105 75 Q 108 95 106 140 Z" fill="#78350f" />
              <path d="M 98 75 Q 80 65 70 60" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 102 80 Q 120 70 130 65" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <circle cx="100" cy="42" r={20 + student.treeLevel * 5} fill="#4ade80" opacity="0.9" />
              <circle cx="78" cy="52" r={14 + student.treeLevel * 3.5} fill="#22c55e" opacity="0.85" />
              <circle cx="122" cy="52" r={14 + student.treeLevel * 3.5} fill="#22c55e" opacity="0.85" />
              {student.flowersEarned >= 2 && <circle cx="85" cy="38" r="6" fill="#f43f5e" />}
              {student.flowersEarned >= 4 && <circle cx="115" cy="42" r="6" fill="#ec4899" />}
              {student.flowersEarned >= 6 && <circle cx="100" cy="26" r="6" fill="#fbbf24" />}
              {student.flowersEarned >= 8 && <circle cx="70" cy="62" r="5" fill="#f43f5e" />}
              {student.flowersEarned >= 10 && <circle cx="130" cy="58" r="6" fill="#a855f7" />}
            </svg>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-emerald-950 max-w-lg mx-auto">
            Mỗi bài tập làm văn con gieo trồng là một nụ hoa tỏa hương. Hãy tiếp tục chăm sóc vườn chữ nhé!
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KHU VỰC 2: BIỂU ĐỒ TIẾN BỘ (BIỂU ĐỒ ĐƯỜNG)                                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📈</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 font-display">
                Khu vực 2: Biểu Đồ Đường Tiến Bộ Theo Thời Gian
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Theo dõi sự biến thiên chỉ số năng lực qua từng bài viết
              </p>
            </div>
          </div>

          {/* Time Filter Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-stone-500 mr-1">Thời gian:</span>
            <button
              onClick={() => setTimeRangeFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timeRangeFilter === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Cả năm học
            </button>
            <button
              onClick={() => setTimeRangeFilter('semester')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timeRangeFilter === 'semester'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Học kỳ I
            </button>
            <button
              onClick={() => setTimeRangeFilter('month')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timeRangeFilter === 'month'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Tháng này
            </button>
          </div>
        </div>

        {/* Skill Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs font-bold text-stone-600 mr-1">Chọn kỹ năng:</span>
          <button
            onClick={() => setSelectedSkillFilter('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              selectedSkillFilter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Tất cả 7 kỹ năng
          </button>
          {WRITING_SKILLS_META.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedSkillFilter(m.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedSkillFilter === m.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.name}</span>
            </button>
          ))}
        </div>

        {/* SVG Line Chart */}
        <div className="relative pt-3 pb-2">
          {chartSubmissions.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[500px]">
                <svg viewBox="0 0 600 240" className="w-full h-56">
                  {/* Grid lines and Qualitative Zone Labels */}
                  <g className="opacity-30">
                    <line x1="60" y1="30" x2="570" y2="30" stroke="#10b981" strokeDasharray="3 3" />
                    <line x1="60" y1="80" x2="570" y2="80" stroke="#0ea5e9" strokeDasharray="3 3" />
                    <line x1="60" y1="130" x2="570" y2="130" stroke="#f59e0b" strokeDasharray="3 3" />
                    <line x1="60" y1="180" x2="570" y2="180" stroke="#f43f5e" strokeDasharray="3 3" />
                  </g>

                  {/* Y-Axis Labels */}
                  <text x="50" y="34" textAnchor="end" fontSize="10" fill="#047857" fontWeight="bold">Xuất sắc (90)</text>
                  <text x="50" y="84" textAnchor="end" fontSize="10" fill="#0284c7" fontWeight="bold">Tốt (75)</text>
                  <text x="50" y="134" textAnchor="end" fontSize="10" fill="#d97706" fontWeight="bold">Tiến bộ (60)</text>
                  <text x="50" y="184" textAnchor="end" fontSize="10" fill="#e11d48" fontWeight="bold">Rèn thêm (45)</text>

                  {/* Axes lines */}
                  <line x1="60" y1="20" x2="60" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="60" y1="200" x2="570" y2="200" stroke="#cbd5e1" strokeWidth="2" />

                  {/* Render Lines for each skill */}
                  {WRITING_SKILLS_META.filter(m => selectedSkillFilter === 'all' || selectedSkillFilter === m.id).map((meta, metaIdx) => {
                    const colorMap: Record<string, string> = {
                      hieu_de: '#10b981',
                      tim_y: '#f59e0b',
                      sap_xep_y: '#0284c7',
                      dien_dat: '#6366f1',
                      chinh_ta_dau_cau: '#0d9488',
                      cam_xuc_sang_tao: '#f43f5e',
                      tu_chinh_sua: '#a855f7'
                    };
                    const strokeColor = colorMap[meta.id] || '#10b981';

                    const points = chartSubmissions.map((sub, sIdx) => {
                      const totalSteps = Math.max(1, chartSubmissions.length - 1);
                      const x = chartSubmissions.length === 1 
                        ? 315 
                        : 90 + (sIdx / totalSteps) * 450;
                      
                      // Score calculation for this skill on this submission
                      const evalItem = sub.teacherSkillEvaluations?.find(e => e.skillId === meta.id) ||
                                       sub.aiSkillEvaluations?.find(e => e.skillId === meta.id);
                      let score = evalItem?.score;
                      if (!score) {
                        // Estimate score according to submission status and index
                        const base = 70 + (metaIdx % 4) * 5;
                        score = Math.min(95, base + sIdx * 6);
                      }
                      // Map score (40 to 100) to y coordinate (190 to 30)
                      const clamped = Math.max(40, Math.min(100, score));
                      const y = 200 - ((clamped - 40) / 60) * 170;
                      return { x, y, score, sub };
                    });

                    const pathD = points.length === 1
                      ? `M ${points[0].x} ${points[0].y}`
                      : points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

                    return (
                      <g key={meta.id}>
                        {points.length > 1 && (
                          <path
                            d={pathD}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth={selectedSkillFilter === meta.id ? "3.5" : "2"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={selectedSkillFilter === 'all' ? 0.75 : 1}
                          />
                        )}
                        {points.map((pt, pIdx) => {
                          const { label } = getLevelFromScore(pt.score);
                          return (
                            <circle
                              key={pIdx}
                              cx={pt.x}
                              cy={pt.y}
                              r={selectedSkillFilter === meta.id ? "5.5" : "4"}
                              fill={strokeColor}
                              stroke="#ffffff"
                              strokeWidth="2"
                              className="cursor-pointer hover:scale-125 transition-transform"
                              onMouseEnter={() => {
                                setHoveredPoint({
                                  subId: pt.sub.id,
                                  subTitle: pt.sub.taskTitle,
                                  date: new Date(pt.sub.startedAt).toLocaleDateString('vi-VN'),
                                  skillName: meta.name,
                                  score: pt.score,
                                  levelLabel: label,
                                  x: pt.x,
                                  y: pt.y
                                });
                              }}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                          );
                        })}
                      </g>
                    );
                  })}

                  {/* X-Axis Submission Labels */}
                  {chartSubmissions.map((sub, sIdx) => {
                    const totalSteps = Math.max(1, chartSubmissions.length - 1);
                    const x = chartSubmissions.length === 1 
                      ? 315 
                      : 90 + (sIdx / totalSteps) * 450;
                    return (
                      <g key={sub.id}>
                        <text
                          x={x}
                          y="220"
                          textAnchor="middle"
                          fontSize="10"
                          fill="#475569"
                          fontWeight="bold"
                        >
                          Bài {sIdx + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-400 italic">
              Chưa có dữ liệu bài viết trong khoảng thời gian này.
            </div>
          )}

          {/* Interactive Tooltip */}
          {hoveredPoint && (
            <div 
              className="absolute z-20 pointer-events-none bg-stone-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-stone-700 animate-fade-in"
              style={{
                left: `${Math.min(480, Math.max(20, (hoveredPoint.x / 600) * 100))}%`,
                top: `${hoveredPoint.y - 45}px`
              }}
            >
              <div className="font-extrabold text-amber-300">{hoveredPoint.skillName}: {hoveredPoint.levelLabel} ({hoveredPoint.score}đ)</div>
              <div className="text-[11px] text-stone-300 font-medium truncate max-w-xs">{hoveredPoint.subTitle}</div>
              <div className="text-[10px] text-stone-400 mt-0.5">{hoveredPoint.date}</div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KHU VỰC 3: BIỂU ĐỒ KỸ NĂNG (BIỂU ĐỒ CỘT)                                  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 font-display">
                Khu vực 3: Mức Độ Đạt Chuẩn Của 7 Kỹ Năng Viết
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                So sánh năng lực bài viết hiện tại và các bài học trước đó (GDPT 2018)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block" />
              <span>Giai đoạn hiện tại</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-200 inline-block" />
              <span>Giai đoạn trước</span>
            </span>
          </div>
        </div>

        {/* 7 Skills Bar Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {computedSkills.map(s => {
            const currentBadge = getScoreBadgeColor(s.level);
            return (
              <div 
                key={s.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-stone-900">
                        {s.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{s.shortDesc}</p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${currentBadge.bg} ${currentBadge.text} ${currentBadge.border}`}>
                    {s.hasData ? s.levelLabel : 'Chưa đủ dữ liệu đánh giá'}
                  </span>
                </div>

                {/* Double Bar Comparison */}
                {s.hasData ? (
                  <div className="space-y-1.5">
                    {/* Current Period Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-stone-500 mb-0.5">
                        <span>Hiện tại:</span>
                        <span className="text-emerald-800 font-extrabold">{s.currentScore}/100</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full transition-all duration-700" 
                          style={{ width: `${s.currentScore}%` }} 
                        />
                      </div>
                    </div>

                    {/* Previous Period Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-stone-500 mb-0.5">
                        <span>Trước đó:</span>
                        <span className="text-stone-600 font-medium">{s.previousScore}/100</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-300 h-full rounded-full transition-all duration-700" 
                          style={{ width: `${s.previousScore}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-stone-100 text-center text-xs text-stone-500 italic border border-dashed border-stone-300">
                    Chưa đủ dữ liệu quan sát cho kỹ năng này
                  </div>
                )}

                {/* Evidence snippet */}
                {s.evidence && (
                  <p className="text-[11px] text-stone-700 font-medium bg-white p-2 rounded-xl border border-stone-200">
                    <strong>Dẫn chứng:</strong> {s.evidence}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MỤC "CON ĐÃ TIẾN BỘ NHƯ THẾ NÀO?"                                         */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-emerald-50 rounded-3xl border-2 border-emerald-300 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-emerald-200 pb-3">
          <span className="text-2xl">🌱</span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-emerald-950 font-display">
              Con Đã Tiến Bộ Như Thế Nào?
            </h3>
            <p className="text-xs text-emerald-800 font-medium">
              Đánh giá tổng hợp sự trưởng thành theo chuẩn năng lực môn Tiếng Việt tiểu học
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-1.5 shadow-xs">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
              <span>🌟</span>
              <span>Điểm mạnh nổi bật nhất</span>
            </span>
            <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed">
              Con có khả năng quan sát chi tiết rất tinh tế, biết diễn đạt bằng các từ ngữ gợi hình ảnh gần gũi và thể hiện cảm xúc chân thành, ấm áp.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sky-200 space-y-1.5 shadow-xs">
            <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5 uppercase">
              <span>🚀</span>
              <span>Kỹ năng đã tiến bộ nhiều nhất</span>
            </span>
            <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed">
              Kỹ năng <strong>{standoutSkill?.name || 'Sắp xếp ý'}</strong> đã có bước tiến rõ rệt! Con biết lập sơ đồ tư duy trước khi viết và triển khai các ý theo trình tự hợp lý.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-1.5 shadow-xs">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase">
              <span>🌱</span>
              <span>Điểm con cần tiếp tục rèn luyện</span>
            </span>
            <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed">
              Con hãy tiếp tục rèn thói quen đọc lại bài văn sau khi viết để tự phát hiện dấu câu chưa chính xác hoặc bổ sung thêm hình ảnh so sánh độc đáo nhé.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1.5 shadow-xs">
            <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 uppercase">
              <span>💌</span>
              <span>Lời khích lệ cho bài viết tiếp theo</span>
            </span>
            <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed">
              Mỗi bài văn của con là một câu chuyện đẹp. Cô và Hoa Nhỏ luôn tin tưởng vào ngòi bút sáng tạo và trái tim nhân hậu của con!
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KHU VỰC 4: NHẬT KÝ BÀI VIẾT                                               */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 font-display">
                Khu vực 4: Nhật Ký Bài Viết ({submissions.length})
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Quản lý các bài đang làm, bài đã nộp và xem toàn bộ dòng thời gian 7 bước
              </p>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Tất cả ({submissions.length})
            </button>
            <button
              onClick={() => setStatusFilter('DANG_LAM')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'DANG_LAM' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Đang làm ({inProgressSubs.length})
            </button>
            <button
              onClick={() => setStatusFilter('CHO_NHAN_XET')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'CHO_NHAN_XET' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
              }`}
            >
              Chờ cô đọc ({submissions.length - completedSubs.length - inProgressSubs.length})
            </button>
            <button
              onClick={() => setStatusFilter('DA_HOAN_THANH')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'DA_HOAN_THANH' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Đã hoàn thành ({completedSubs.length})
            </button>
          </div>
        </div>

        {/* Submissions Cards List */}
        <div className="space-y-3.5">
          {filteredSubmissions.map((sub, idx) => {
            const isInProgress = sub.lifecycleStatus === 'DANG_LAM' || sub.status === 'draft' || sub.lifecycleStatus === 'CAN_CHINH_SUA';

            return (
              <div
                key={sub.id}
                className="p-4 sm:p-5 rounded-3xl border-2 border-stone-200 hover:border-emerald-300 transition-all bg-white hover:bg-emerald-50/10 space-y-3 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-base sm:text-lg text-stone-900 font-display">
                        {sub.taskTitle}
                      </h4>
                      {renderStatusBadge(sub)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                      <span>🕒 Tạo lúc: {new Date(sub.startedAt).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span className="text-emerald-800 font-bold">
                        {getStepLabel(sub)}
                      </span>
                    </div>
                  </div>

                  {/* Actions for this submission */}
                  <div className="flex items-center gap-2">
                    {/* Continue Button for In-Progress Submissions */}
                    {isInProgress && onResumeSubmission && (
                      <button
                        onClick={() => {
                          playPop(settings.soundEnabled);
                          onResumeSubmission(sub);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-all hover:scale-102"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Tiếp tục làm</span>
                      </button>
                    )}

                    {/* View Journey Stepper / Timeline Button */}
                    <button
                      onClick={() => {
                        playPop(settings.soundEnabled);
                        setJourneyModalSub(sub);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Xem hành trình</span>
                    </button>
                  </div>
                </div>

                {/* Excerpt of the latest draft/content */}
                <p className="text-xs sm:text-sm text-stone-700 italic bg-stone-50 p-3 rounded-2xl border border-stone-100 line-clamp-2">
                  "{sub.finalContent || sub.firstDraft || 'Đang phát triển ý tưởng...'}"
                </p>

                {/* Quick Teacher note if available */}
                {sub.teacherFeedback && sub.teacherFeedback.status === 'published' && (
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <span>👩‍🏫</span>
                      <strong>{sub.teacherFeedback.teacherName || TEACHER_CONFIG.name}:</strong>
                      <span className="italic truncate max-w-lg">"{sub.teacherFeedback.comment}"</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-800 shrink-0">
                      {sub.teacherFeedback.flowerSticker || '🌸 Bông hoa khen ngợi'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {filteredSubmissions.length === 0 && (
            <div className="p-8 text-center text-stone-400 text-sm italic bg-stone-50 rounded-3xl border border-dashed border-stone-200">
              Không có bài viết nào phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL / DRAWER: XEM HÀNH TRÌNH CHI TIẾT (7 BƯỚC THỰC HIỆN)                 */}
      {/* ========================================================================= */}
      {journeyModalSub && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-emerald-400 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-100 to-teal-50 border-b border-emerald-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                  Dòng thời gian 7 bước thực hiện
                </span>
                <h3 className="text-lg sm:text-xl font-black text-emerald-950 font-display mt-1">
                  {journeyModalSub.taskTitle}
                </h3>
              </div>
              <button
                onClick={() => setJourneyModalSub(null)}
                className="w-9 h-9 rounded-2xl bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center border border-emerald-200 shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content: 7 Steps Timeline */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              {/* Step 1: Hiểu đề */}
              <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1.5">
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  1
                </span>
                <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Bước 1: Hoa Nhỏ Cùng Con Hiểu Đề</span>
                </h4>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                  {journeyModalSub.understandingStage?.selectedDirectionTitle && (
                    <p className="font-bold text-emerald-800">
                      Hướng viết đã chọn: {journeyModalSub.understandingStage.selectedDirectionTitle}
                    </p>
                  )}
                  {journeyModalSub.understandingStage?.selectedObject && (
                    <p className="font-bold text-emerald-800">
                      Đối tượng đã chọn: {journeyModalSub.understandingStage.selectedObject}
                    </p>
                  )}
                  {journeyModalSub.understandingStage?.promptRequirements?.map((req, rIdx) => (
                    <p key={rIdx} className="text-stone-700">• {req}</p>
                  ))}
                  {journeyModalSub.understandingStage?.advice && (
                    <p className="text-purple-800 italic mt-1 font-medium">
                      💡 Lời khuyên: {journeyModalSub.understandingStage.advice}
                    </p>
                  )}
                </div>
              </div>

              {/* Step 2: Tìm ý */}
              <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1.5">
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  2
                </span>
                <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Bước 2: Tìm Ý & Câu Hỏi Gợi Mở</span>
                </h4>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                  {journeyModalSub.ideaFindingStage?.studentAnswers ? (
                    Object.entries(journeyModalSub.ideaFindingStage.studentAnswers).map(([k, ans], aIdx) => (
                      <div key={k} className="space-y-0.5">
                        <span className="font-bold text-stone-600 block">
                          Câu hỏi {aIdx + 1}: {journeyModalSub.ideaFindingStage?.questions?.[Number(k)] || 'Gợi mở ý tưởng'}
                        </span>
                        <p className="text-stone-800 font-semibold bg-white p-2 rounded-xl border border-stone-200">
                          {ans}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-500 italic">Đã tìm ý trực tiếp từ các câu hỏi gợi mở trong bài.</p>
                  )}
                </div>
              </div>

              {/* Step 3: Sơ đồ tư duy */}
              <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1.5">
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  3
                </span>
                <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <span>🗺️</span>
                  <span>Bước 3: Sơ Đồ Tư Duy Các Nhánh Ý</span>
                </h4>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
                  {journeyModalSub.mindMapStage?.branches ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {journeyModalSub.mindMapStage.branches.map(b => (
                        <div key={b.id} className="p-2.5 bg-white rounded-xl border border-stone-200 space-y-1">
                          <span className="font-bold text-emerald-900 flex items-center gap-1">
                            <span>{b.icon}</span>
                            <span>{b.title}</span>
                          </span>
                          <ul className="text-[11px] text-stone-700 space-y-0.5 list-disc pl-3.5">
                            {(b.points || b.items || []).map((pt, pIdx) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-500 italic">Sơ đồ tư duy cơ bản được thiết lập theo chủ đề bài viết.</p>
                  )}
                </div>
              </div>

              {/* Step 4: Dàn ý chi tiết */}
              <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1.5">
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  4
                </span>
                <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <span>📑</span>
                  <span>Bước 4: Dàn Ý Chi Tiết</span>
                </h4>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                  {(journeyModalSub.developedOutline || journeyModalSub.initialOutline || []).map(item => (
                    <div key={item.id} className="flex gap-2">
                      <span className="font-bold text-emerald-800 shrink-0">{item.section}:</span>
                      <span className="text-stone-800 font-medium">{item.content}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 5: Bài viết & Các bản nháp */}
              <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1.5">
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  5
                </span>
                <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                  <span>📝</span>
                  <span>Bước 5: Bài Viết & Lịch Sử Bản Nháp ({journeyModalSub.drafts?.length || 1} bản)</span>
                </h4>
                <div className="space-y-2">
                  {journeyModalSub.drafts && journeyModalSub.drafts.length > 0 ? (
                    journeyModalSub.drafts.map(d => (
                      <div key={d.version} className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-amber-900">
                          <span>Bản nháp số {d.version} {d.note ? `• ${d.note}` : ''}</span>
                          <span className="text-[10px] text-stone-500 font-normal">
                            {new Date(d.timestamp).toLocaleTimeString('vi-VN')} {new Date(d.timestamp).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-stone-800 whitespace-pre-wrap leading-relaxed font-medium">
                          {d.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs">
                      <p className="text-stone-800 whitespace-pre-wrap leading-relaxed font-medium">
                        {journeyModalSub.finalContent || journeyModalSub.firstDraft}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 6: Góp ý của AI & Hoa Nhỏ */}
              {journeyModalSub.aiFeedback && (
                <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1.5">
                  <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    6
                  </span>
                  <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                    <span>🌸</span>
                    <span>Bước 6: Góp Ý Của Hoa Nhỏ</span>
                  </h4>
                  <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-200 text-xs space-y-1.5">
                    <p className="text-rose-900">
                      <strong>🌸 Bông hoa khen ngợi:</strong> {journeyModalSub.aiFeedback.flowerPraise}
                    </p>
                    <p className="text-emerald-900">
                      <strong>🍃 Chiếc lá nhắc em:</strong> {journeyModalSub.aiFeedback.leafReminder}
                    </p>
                    {journeyModalSub.aiFeedback.smallChallenge && (
                      <p className="text-purple-900">
                        <strong>⭐ Thử thách nhỏ:</strong> {journeyModalSub.aiFeedback.smallChallenge}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 7: Nhận xét của Cô giáo & Đánh giá 7 kỹ năng */}
              {journeyModalSub.teacherFeedback && journeyModalSub.teacherFeedback.status === 'published' && (
                <div className="relative pl-7 border-l-2 border-emerald-500 space-y-1.5">
                  <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    7
                  </span>
                  <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                    <span>👩‍🏫</span>
                    <span>Bước 7: Nhận Xét Của {journeyModalSub.teacherFeedback.teacherName || TEACHER_CONFIG.name}</span>
                  </h4>
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-emerald-950">
                        {journeyModalSub.teacherFeedback.teacherName || TEACHER_CONFIG.name}
                      </span>
                      <span className="font-bold text-rose-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                        {journeyModalSub.teacherFeedback.flowerSticker || '🌸 Bông hoa viết hay'}
                      </span>
                    </div>
                    <p className="text-stone-800 italic bg-white p-2.5 rounded-xl border border-emerald-100 font-semibold">
                      "{journeyModalSub.teacherFeedback.comment}"
                    </p>

                    {/* Teacher evaluations for 7 skills if recorded */}
                    {journeyModalSub.teacherSkillEvaluations && journeyModalSub.teacherSkillEvaluations.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <span className="font-bold text-emerald-900 block">Đánh giá 7 năng lực viết:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {journeyModalSub.teacherSkillEvaluations.map(ev => (
                            <div key={ev.skillId} className="p-1.5 bg-white rounded-lg border border-emerald-200 flex items-center justify-between">
                              <span className="text-[11px] font-bold text-stone-700">{ev.skillName}</span>
                              <span className="text-[10px] font-extrabold text-emerald-800">{ev.levelLabel}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
              <span className="text-xs text-stone-500 font-medium">
                Mã bài viết: {journeyModalSub.id}
              </span>
              <button
                onClick={() => setJourneyModalSub(null)}
                className="px-4 py-2 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold shadow-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
