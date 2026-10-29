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
  ChevronUp,
  ChevronDown,
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

  // Expanded essay card IDs (Zone 4: independent expand/collapse per submission)
  const [expandedSubIds, setExpandedSubIds] = useState<Record<string, boolean>>({});

  // Filter for Bar Chart (Zone 2)
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<WritingSkillId | 'all'>('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState<'all' | 'semester1' | 'semester2' | 'month'>('all');
  const [barChartMode, setBarChartMode] = useState<'composite' | 'grouped'>('composite');
  
  // Selected Bar Detail for inline viewing (non-blocking, mobile-friendly)
  const [selectedBarDetail, setSelectedBarDetail] = useState<{
    subId: string;
    subTitle: string;
    date: string;
    skillName: string;
    score: number;
    levelLabel: string;
    evaluator: string;
    comment?: string;
    evidence?: string;
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

  // Helper to extract genuine skill score (teacher or AI evaluation)
  const getSubmissionSkillScore = (sub: Submission, skillId: WritingSkillId): { score: number; evalItem: any; evaluator: string; evidence?: string; comment?: string } | null => {
    const teacherEval = sub.teacherSkillEvaluations?.find(e => e.skillId === skillId);
    if (teacherEval && typeof teacherEval.score === 'number') {
      return {
        score: teacherEval.score,
        evalItem: teacherEval,
        evaluator: `Cô giáo ${sub.teacherFeedback?.teacherName || TEACHER_CONFIG.name}`,
        evidence: teacherEval.evidence,
        comment: teacherEval.comment || sub.teacherFeedback?.comment
      };
    }
    const aiEval = sub.aiSkillEvaluations?.find(e => e.skillId === skillId);
    if (aiEval && typeof aiEval.score === 'number') {
      return {
        score: aiEval.score,
        evalItem: aiEval,
        evaluator: 'AI trợ lý phân tích',
        evidence: aiEval.evidence,
        comment: sub.aiFeedback?.flowerPraise
      };
    }
    return null;
  };

  // Helper to compute genuine composite score (average of evaluated skills only)
  const getSubmissionCompositeScore = (sub: Submission): { score: number; count: number; evaluator: string; comment?: string } | null => {
    let scores: number[] = [];
    let evaluator = 'Chưa đánh giá';
    let comment = sub.teacherFeedback?.comment;

    if (sub.teacherSkillEvaluations && sub.teacherSkillEvaluations.length > 0) {
      scores = sub.teacherSkillEvaluations.map(e => e.score);
      evaluator = `Cô giáo ${sub.teacherFeedback?.teacherName || TEACHER_CONFIG.name}`;
      comment = sub.teacherFeedback?.comment;
    } else if (sub.aiSkillEvaluations && sub.aiSkillEvaluations.length > 0) {
      scores = sub.aiSkillEvaluations.map(e => e.score);
      evaluator = 'AI trợ lý phân tích';
      comment = sub.aiFeedback?.flowerPraise;
    } else if (sub.status === 'reviewed') {
      // Fallback only if marked reviewed with confirmed stars
      const base = (sub.teacherFeedback?.confirmedStars || 5) * 18;
      scores = [base];
      evaluator = `Cô giáo ${sub.teacherFeedback?.teacherName || TEACHER_CONFIG.name}`;
      comment = sub.teacherFeedback?.comment;
    }

    if (scores.length === 0) return null;
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { score: avg, count: scores.length, evaluator, comment };
  };

  // Submissions for Vertical Bar Chart (Zone 2)
  // RULE: Only include submissions with actual evaluation data (teacher or AI), no unassessed drafts, no fake scores!
  const chartSubmissions = useMemo(() => {
    const list = [...submissions].reverse().filter(s => {
      const hasTeacher = s.teacherSkillEvaluations && s.teacherSkillEvaluations.length > 0;
      const hasAi = s.aiSkillEvaluations && s.aiSkillEvaluations.length > 0;
      const isReviewed = s.status === 'reviewed';
      return hasTeacher || hasAi || isReviewed;
    });

    if (timeRangeFilter === 'month') {
      const monthAgo = Date.now() - 30 * 86400000;
      return list.filter(s => new Date(s.startedAt).getTime() >= monthAgo);
    }
    if (timeRangeFilter === 'semester1') {
      // Semester 1: Sept (8), Oct (9), Nov (10), Dec (11), Jan (0)
      return list.filter(s => {
        const m = new Date(s.startedAt).getMonth();
        return m >= 8 || m === 0;
      });
    }
    if (timeRangeFilter === 'semester2') {
      // Semester 2: Feb (1), Mar (2), Apr (3), May (4)
      return list.filter(s => {
        const m = new Date(s.startedAt).getMonth();
        return m >= 1 && m <= 4;
      });
    }
    return list;
  }, [submissions, timeRangeFilter]);

  // Toggle independent essay expansion
  const toggleExpandSub = (subId: string) => {
    playPop(settings.soundEnabled);
    setExpandedSubIds(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

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
      {/* KHU VỰC 2: BIỂU ĐỒ CỘT TIẾN BỘ THEO THỜI GIAN                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 font-display">
                Khu vực 2: Biểu Đồ Cột Tiến Bộ Theo Thời Gian
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Theo dõi chỉ số đánh giá năng lực viết qua từng bài (GDPT 2018)
              </p>
            </div>
          </div>

          {/* Time Filter Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-stone-500 mr-1">Thời gian:</span>
            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setTimeRangeFilter('all');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timeRangeFilter === 'all'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Cả năm học
            </button>
            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setTimeRangeFilter('semester1');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timeRangeFilter === 'semester1'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Học kỳ I
            </button>
            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setTimeRangeFilter('semester2');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timeRangeFilter === 'semester2'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Học kỳ II
            </button>
            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setTimeRangeFilter('month');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timeRangeFilter === 'month'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Tháng này
            </button>
          </div>
        </div>

        {/* Skill Filter Chips & Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-stone-600 mr-1">Chọn kỹ năng:</span>
            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setSelectedSkillFilter('all');
              }}
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
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setSelectedSkillFilter(m.id);
                }}
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

          {/* Grouped vs Composite Toggle for "All Skills" */}
          {selectedSkillFilter === 'all' && (
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
              <button
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setBarChartMode('composite');
                }}
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  barChartMode === 'composite'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📊 Cột tổng hợp
              </button>
              <button
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setBarChartMode('grouped');
                }}
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  barChartMode === 'grouped'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📶 Cột nhóm 7 kỹ năng
              </button>
            </div>
          )}
        </div>

        {/* Vertical Bar Chart Graphic */}
        <div className="relative pt-3 pb-2 space-y-3">
          {chartSubmissions.length > 0 ? (
            <div className="w-full overflow-x-auto">
              {(() => {
                const chartWidth = Math.max(560, chartSubmissions.length * 120 + 120);
                const chartHeight = 255;
                const startX = 95;
                const endX = chartWidth - 30;
                const slotWidth = (endX - startX) / Math.max(1, chartSubmissions.length);

                return (
                  <div className="min-w-[540px]">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64">
                      {/* Grid guidelines for 4 qualitative levels */}
                      <g className="opacity-35">
                        {/* 90 - Xuất sắc */}
                        <line x1="85" y1="42.5" x2={chartWidth - 20} y2="42.5" stroke="#10b981" strokeDasharray="3 3" strokeWidth="1.2" />
                        {/* 75 - Tốt */}
                        <line x1="85" y1="68.75" x2={chartWidth - 20} y2="68.75" stroke="#0ea5e9" strokeDasharray="3 3" strokeWidth="1.2" />
                        {/* 60 - Tiến bộ */}
                        <line x1="85" y1="95" x2={chartWidth - 20} y2="95" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="1.2" />
                        {/* 45 - Rèn thêm */}
                        <line x1="85" y1="121.25" x2={chartWidth - 20} y2="121.25" stroke="#f43f5e" strokeDasharray="3 3" strokeWidth="1.2" />
                      </g>

                      {/* Y-Axis Labels */}
                      <text x="78" y="46" textAnchor="end" fontSize="10" fill="#047857" fontWeight="bold">Xuất sắc (90)</text>
                      <text x="78" y="72" textAnchor="end" fontSize="10" fill="#0284c7" fontWeight="bold">Tốt (75)</text>
                      <text x="78" y="98" textAnchor="end" fontSize="10" fill="#d97706" fontWeight="bold">Tiến bộ (60)</text>
                      <text x="78" y="124" textAnchor="end" fontSize="10" fill="#e11d48" fontWeight="bold">Rèn thêm (45)</text>
                      <text x="78" y="204" textAnchor="end" fontSize="10" fill="#64748b" fontWeight="bold">0</text>

                      {/* Axes lines */}
                      <line x1="85" y1="20" x2="85" y2="200" stroke="#cbd5e1" strokeWidth="2" />
                      <line x1="85" y1="200" x2={chartWidth - 20} y2="200" stroke="#cbd5e1" strokeWidth="2" />

                      {/* Render Vertical Bars */}
                      {chartSubmissions.map((sub, sIdx) => {
                        const subCenter = startX + sIdx * slotWidth + slotWidth / 2;
                        const subDate = new Date(sub.startedAt).toLocaleDateString('vi-VN');

                        // CASE 1: Single skill selected
                        if (selectedSkillFilter !== 'all') {
                          const meta = WRITING_SKILLS_META.find(m => m.id === selectedSkillFilter);
                          const skillData = getSubmissionSkillScore(sub, selectedSkillFilter);
                          const skillColor = meta ? {
                            hieu_de: '#10b981',
                            tim_y: '#f59e0b',
                            sap_xep_y: '#0284c7',
                            dien_dat: '#6366f1',
                            chinh_ta_dau_cau: '#0d9488',
                            cam_xuc_sang_tao: '#f43f5e',
                            tu_chinh_sua: '#a855f7'
                          }[meta.id] || '#10b981' : '#10b981';

                          if (!skillData) {
                            return (
                              <g key={sub.id}>
                                <text x={subCenter} y="190" textAnchor="middle" fontSize="10" fill="#94a3b8" fontStyle="italic">
                                  Chưa chấm
                                </text>
                                <text x={subCenter} y="218" textAnchor="middle" fontSize="11" fill="#1e293b" fontWeight="bold">
                                  Bài {sIdx + 1}
                                </text>
                                <text x={subCenter} y="232" textAnchor="middle" fontSize="9" fill="#64748b">
                                  {subDate}
                                </text>
                              </g>
                            );
                          }

                          const score = skillData.score;
                          const barHeight = Math.max(6, (score / 100) * 175);
                          const barY = 200 - barHeight;
                          const barWidth = Math.min(46, slotWidth * 0.45);
                          const barX = subCenter - barWidth / 2;
                          const { label } = getLevelFromScore(score);

                          return (
                            <g 
                              key={sub.id} 
                              className="cursor-pointer group"
                              onClick={() => {
                                playPop(settings.soundEnabled);
                                setSelectedBarDetail({
                                  subId: sub.id,
                                  subTitle: sub.taskTitle,
                                  date: subDate,
                                  skillName: meta?.name || 'Kỹ năng',
                                  score,
                                  levelLabel: label,
                                  evaluator: skillData.evaluator,
                                  comment: skillData.comment,
                                  evidence: skillData.evidence
                                });
                              }}
                            >
                              <rect
                                x={barX}
                                y={barY}
                                width={barWidth}
                                height={barHeight}
                                fill={skillColor}
                                rx="5"
                                className="transition-all duration-300 group-hover:opacity-90 group-hover:brightness-110"
                              />
                              <text
                                x={subCenter}
                                y={barY - 6}
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="bold"
                                fill={skillColor}
                              >
                                {score}
                              </text>
                              <text x={subCenter} y="218" textAnchor="middle" fontSize="11" fill="#1e293b" fontWeight="bold">
                                Bài {sIdx + 1}
                              </text>
                              <text x={subCenter} y="232" textAnchor="middle" fontSize="9" fill="#64748b">
                                {subDate}
                              </text>
                            </g>
                          );
                        }

                        // CASE 2A: All skills - Composite Bar Mode
                        if (barChartMode === 'composite') {
                          const comp = getSubmissionCompositeScore(sub);
                          if (!comp) {
                            return (
                              <g key={sub.id}>
                                <text x={subCenter} y="190" textAnchor="middle" fontSize="10" fill="#94a3b8" fontStyle="italic">
                                  Chưa chấm
                                </text>
                                <text x={subCenter} y="218" textAnchor="middle" fontSize="11" fill="#1e293b" fontWeight="bold">
                                  Bài {sIdx + 1}
                                </text>
                                <text x={subCenter} y="232" textAnchor="middle" fontSize="9" fill="#64748b">
                                  {subDate}
                                </text>
                              </g>
                            );
                          }

                          const score = comp.score;
                          const barHeight = Math.max(6, (score / 100) * 175);
                          const barY = 200 - barHeight;
                          const barWidth = Math.min(46, slotWidth * 0.45);
                          const barX = subCenter - barWidth / 2;
                          const { label } = getLevelFromScore(score);

                          // Color by qualitative performance level
                          const barColor = score >= 90 ? '#059669' : score >= 75 ? '#0284c7' : score >= 60 ? '#d97706' : '#e11d48';

                          return (
                            <g 
                              key={sub.id} 
                              className="cursor-pointer group"
                              onClick={() => {
                                playPop(settings.soundEnabled);
                                setSelectedBarDetail({
                                  subId: sub.id,
                                  subTitle: sub.taskTitle,
                                  date: subDate,
                                  skillName: 'Tổng hợp 7 kỹ năng viết',
                                  score,
                                  levelLabel: label,
                                  evaluator: comp.evaluator,
                                  comment: comp.comment || 'Chỉ số trung bình các tiêu chí đánh giá kỹ năng viết.'
                                });
                              }}
                            >
                              <rect
                                x={barX}
                                y={barY}
                                width={barWidth}
                                height={barHeight}
                                fill={barColor}
                                rx="5"
                                className="transition-all duration-300 group-hover:opacity-90 group-hover:brightness-110"
                              />
                              <text
                                x={subCenter}
                                y={barY - 6}
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="bold"
                                fill={barColor}
                              >
                                {score}
                              </text>
                              <text x={subCenter} y="218" textAnchor="middle" fontSize="11" fill="#1e293b" fontWeight="bold">
                                Bài {sIdx + 1}
                              </text>
                              <text x={subCenter} y="232" textAnchor="middle" fontSize="9" fill="#64748b">
                                {subDate}
                              </text>
                            </g>
                          );
                        }

                        // CASE 2B: All skills - Grouped Columns Mode (7 Bars Side-by-Side per Submission)
                        const groupWidth = Math.min(slotWidth * 0.85, 126);
                        const singleBarWidth = Math.max(6, Math.floor((groupWidth - 6 * 2) / 7));
                        const groupStartX = subCenter - (7 * singleBarWidth + 6 * 2) / 2;

                        const skillColors: Record<string, string> = {
                          hieu_de: '#10b981',
                          tim_y: '#f59e0b',
                          sap_xep_y: '#0284c7',
                          dien_dat: '#6366f1',
                          chinh_ta_dau_cau: '#0d9488',
                          cam_xuc_sang_tao: '#f43f5e',
                          tu_chinh_sua: '#a855f7'
                        };

                        return (
                          <g key={sub.id}>
                            {WRITING_SKILLS_META.map((meta, mIdx) => {
                              const skillData = getSubmissionSkillScore(sub, meta.id);
                              const subX = groupStartX + mIdx * (singleBarWidth + 2);
                              const color = skillColors[meta.id] || '#10b981';

                              if (!skillData) {
                                return (
                                  <rect
                                    key={meta.id}
                                    x={subX}
                                    y={196}
                                    width={singleBarWidth}
                                    height={4}
                                    fill="#e2e8f0"
                                    rx="1"
                                  />
                                );
                              }

                              const score = skillData.score;
                              const barHeight = Math.max(4, (score / 100) * 175);
                              const barY = 200 - barHeight;
                              const { label } = getLevelFromScore(score);

                              return (
                                <rect
                                  key={meta.id}
                                  x={subX}
                                  y={barY}
                                  width={singleBarWidth}
                                  height={barHeight}
                                  fill={color}
                                  rx="2"
                                  className="cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => {
                                    playPop(settings.soundEnabled);
                                    setSelectedBarDetail({
                                      subId: sub.id,
                                      subTitle: sub.taskTitle,
                                      date: subDate,
                                      skillName: meta.name,
                                      score,
                                      levelLabel: label,
                                      evaluator: skillData.evaluator,
                                      comment: skillData.comment,
                                      evidence: skillData.evidence
                                    });
                                  }}
                                >
                                  <title>{`${meta.name}: ${score}đ (${label})`}</title>
                                </rect>
                              );
                            })}
                            <text x={subCenter} y="218" textAnchor="middle" fontSize="11" fill="#1e293b" fontWeight="bold">
                              Bài {sIdx + 1}
                            </text>
                            <text x={subCenter} y="232" textAnchor="middle" fontSize="9" fill="#64748b">
                              {subDate}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-400 italic bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              Chưa có dữ liệu bài viết được đánh giá trong khoảng thời gian này.
            </div>
          )}

          {/* Formative note */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 font-medium px-2">
            <span>* Chỉ số trực quan hóa định tính theo chuẩn năng lực môn Tiếng Việt GDPT 2018 (Xuất sắc: ≥90, Tốt: 75–89, Tiến bộ: 60–74, Rèn thêm: &lt;60), không phải điểm số kiểm tra chính thức.</span>
            <span className="text-emerald-800 font-bold">💡 Bấm vào cột để xem chi tiết nhận xét & dẫn chứng</span>
          </div>

          {/* Legend for 7 grouped skills if grouped mode is active */}
          {selectedSkillFilter === 'all' && barChartMode === 'grouped' && (
            <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700">
              <span className="text-stone-500 mr-1">Màu sắc 7 kỹ năng:</span>
              {WRITING_SKILLS_META.map(m => {
                const colorMap: Record<string, string> = {
                  hieu_de: '#10b981',
                  tim_y: '#f59e0b',
                  sap_xep_y: '#0284c7',
                  dien_dat: '#6366f1',
                  chinh_ta_dau_cau: '#0d9488',
                  cam_xuc_sang_tao: '#f43f5e',
                  tu_chinh_sua: '#a855f7'
                };
                return (
                  <span key={m.id} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorMap[m.id] }} />
                    <span>{m.name}</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Non-blocking Inline Details Card when user clicks or hovers a bar */}
          {selectedBarDetail && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border-2 border-emerald-300 shadow-sm space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between gap-2 border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-stone-900 font-display">
                      {selectedBarDetail.subTitle}
                    </h4>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Thời gian đánh giá: {selectedBarDetail.date} • {selectedBarDetail.evaluator}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBarDetail(null)}
                  className="px-2.5 py-1 text-xs font-bold rounded-xl bg-white text-stone-600 hover:text-stone-900 border border-emerald-200 hover:bg-emerald-100 shadow-xs"
                >
                  ✕ Đóng chi tiết
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="text-stone-600">Kỹ năng:</span>
                  <span className="text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {selectedBarDetail.skillName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="text-stone-600">Mức độ đạt được:</span>
                  <span className="text-emerald-950 font-black bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300 shadow-xs">
                    {selectedBarDetail.levelLabel} ({selectedBarDetail.score}/100)
                  </span>
                </div>
              </div>

              {selectedBarDetail.evidence && (
                <div className="text-xs text-stone-700 bg-white p-2.5 rounded-xl border border-emerald-200 leading-relaxed">
                  <strong className="text-emerald-950 block font-bold mb-0.5">🔍 Dẫn chứng trong bài làm:</strong>
                  {selectedBarDetail.evidence}
                </div>
              )}

              {selectedBarDetail.comment && (
                <div className="text-xs text-emerald-950 bg-white p-2.5 rounded-xl border border-emerald-200 italic leading-relaxed">
                  <strong className="text-emerald-900 not-italic block font-bold mb-0.5">💬 Lời nhận xét:</strong>
                  "{selectedBarDetail.comment}"
                </div>
              )}
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

        {/* Submissions Cards List with Independent Collapsed/Expanded States */}
        <div className="space-y-4">
          {filteredSubmissions.map((sub, idx) => {
            const isInProgress = sub.lifecycleStatus === 'DANG_LAM' || sub.status === 'draft' || sub.lifecycleStatus === 'CAN_CHINH_SUA';
            const isExpanded = !!expandedSubIds[sub.id];
            const fullContent = sub.finalContent || sub.firstDraft || '';
            const previewSnippet = fullContent
              ? (fullContent.length > 95 ? fullContent.slice(0, 95).trim() + '...' : fullContent)
              : (isInProgress ? 'Bài đang được thực hiện (bản nháp)...' : 'Chưa có nội dung.');

            return (
              <div
                key={sub.id}
                className={`p-4 sm:p-6 rounded-3xl border-2 transition-all bg-white space-y-4 shadow-xs ${
                  isExpanded ? 'border-amber-300 ring-2 ring-amber-100' : 'border-stone-200 hover:border-emerald-300'
                }`}
              >
                {/* Card Header */}
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
                  <div className="flex items-center gap-2 flex-wrap">
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

                    {/* View Journey Stepper / Timeline Button (Independent Modal) */}
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

                {/* STATE 1: COLLAPSED (THU GỌN) */}
                {!isExpanded && (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-stone-700 italic bg-stone-50 p-3.5 rounded-2xl border border-stone-100 leading-relaxed">
                      "{previewSnippet}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => toggleExpandSub(sub.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 font-extrabold text-xs transition-all shadow-xs hover:scale-101"
                      >
                        <BookOpen className="w-4 h-4 text-amber-700" />
                        <span>📖 Đọc toàn bộ bài</span>
                      </button>

                      {sub.teacherFeedback && sub.teacherFeedback.status === 'published' && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          {sub.teacherFeedback.flowerSticker || '🌸 Đã có nhận xét từ cô giáo'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* STATE 2: EXPANDED (MỞ RỘNG - KHÔNG CẮT CHỮ, KHÔNG GIỚI HẠN CHIỀU CAO) */}
                {isExpanded && (
                  <div className="space-y-4 pt-1 animate-fade-in">
                    {/* Header bar of expanded mode */}
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wide flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        <span>Toàn văn bài viết của con ({fullContent.length} ký tự)</span>
                      </span>
                      <button
                        onClick={() => toggleExpandSub(sub.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-300 transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Thu gọn</span>
                      </button>
                    </div>

                    {/* Pristine Full Essay Content with Preserved Format & Punctuation */}
                    <div 
                      className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 border-2 border-amber-200 leading-relaxed text-stone-900 text-sm sm:text-base font-medium whitespace-pre-wrap break-words select-text shadow-inner"
                      style={{ height: 'auto', maxHeight: 'none', overflow: 'visible' }}
                    >
                      {fullContent || (isInProgress ? 'Bài đang được thực hiện (bản nháp đang triển khai).' : 'Chưa có nội dung bài viết.')}
                    </div>

                    {/* Teacher Feedback Section (Full & Uncut) */}
                    {sub.teacherFeedback && sub.teacherFeedback.status === 'published' && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-emerald-200 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">👩‍🏫</span>
                            <div>
                              <h5 className="font-extrabold text-xs sm:text-sm text-emerald-950">
                                Nhận xét chính thức từ {sub.teacherFeedback.teacherName || TEACHER_CONFIG.name}
                              </h5>
                              <span className="text-[11px] text-emerald-700 font-medium">
                                Ngày nhận xét: {new Date(sub.teacherFeedback.timestamp).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300 shadow-xs">
                            {sub.teacherFeedback.flowerSticker || '🌸 Bông hoa khen ngợi'}
                          </span>
                        </div>

                        {/* Full Teacher Comment - No truncation */}
                        <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs">
                          <p className="text-xs sm:text-sm text-stone-800 font-semibold italic leading-relaxed whitespace-pre-wrap break-words">
                            "{sub.teacherFeedback.comment}"
                          </p>
                        </div>

                        {/* Qualitative Formative Details */}
                        {(sub.teacherFeedback.praiseIdea || sub.teacherFeedback.wordSentenceSuggestions || sub.teacherFeedback.emotionCreativityEncouragement || sub.teacherFeedback.teacherAdvice) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
                            {sub.teacherFeedback.praiseIdea && (
                              <div className="bg-rose-50/80 p-3 rounded-xl border border-rose-200">
                                <strong className="text-rose-900 block font-bold mb-1">🌸 Ý tưởng nổi bật:</strong>
                                <span className="text-stone-700 leading-relaxed">{sub.teacherFeedback.praiseIdea}</span>
                              </div>
                            )}
                            {sub.teacherFeedback.wordSentenceSuggestions && (
                              <div className="bg-emerald-100/70 p-3 rounded-xl border border-emerald-200">
                                <strong className="text-emerald-900 block font-bold mb-1">✏️ Góp ý dùng từ & diễn đạt:</strong>
                                <span className="text-stone-700 leading-relaxed">{sub.teacherFeedback.wordSentenceSuggestions}</span>
                              </div>
                            )}
                            {sub.teacherFeedback.emotionCreativityEncouragement && (
                              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                                <strong className="text-amber-900 block font-bold mb-1">💖 Khích lệ cảm xúc & sáng tạo:</strong>
                                <span className="text-stone-700 leading-relaxed">{sub.teacherFeedback.emotionCreativityEncouragement}</span>
                              </div>
                            )}
                            {sub.teacherFeedback.teacherAdvice && (
                              <div className="bg-sky-50/80 p-3 rounded-xl border border-sky-200">
                                <strong className="text-sky-900 block font-bold mb-1">💌 Lời dặn dò phát triển:</strong>
                                <span className="text-stone-700 leading-relaxed">{sub.teacherFeedback.teacherAdvice}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 7 Skills Evaluation Grid */}
                        {sub.teacherSkillEvaluations && sub.teacherSkillEvaluations.length > 0 && (
                          <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                            <span className="text-xs font-bold text-emerald-950 block">
                              📊 Mức độ đạt chuẩn 7 kỹ năng viết (GDPT 2018):
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {sub.teacherSkillEvaluations.map(ev => (
                                <div key={ev.skillId} className="bg-stone-50 p-2 rounded-lg border border-stone-200 text-[11px] space-y-0.5">
                                  <span className="text-stone-600 font-medium block truncate">{ev.skillName}</span>
                                  <div className="flex items-center justify-between font-bold text-emerald-800">
                                    <span>{ev.levelLabel}</span>
                                    <span>{ev.score}đ</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI Feedback Section (if available) */}
                    {sub.aiFeedback && (
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-stone-700 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <span>🤖</span>
                          <span>Gợi ý hoàn thiện từ Trợ lý Hoa Nhỏ AI:</span>
                        </div>
                        {sub.aiFeedback.flowerPraise && (
                          <p className="bg-white p-2.5 rounded-xl border border-amber-200">
                            <strong>🌸 Lời khen:</strong> {sub.aiFeedback.flowerPraise}
                          </p>
                        )}
                        {sub.aiFeedback.leafReminder && (
                          <p className="bg-white p-2.5 rounded-xl border border-amber-200">
                            <strong>🍃 Lưu ý:</strong> {sub.aiFeedback.leafReminder}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Bottom Collapse Button */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => toggleExpandSub(sub.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-300 transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>▲ Thu gọn bài viết</span>
                      </button>
                    </div>
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
