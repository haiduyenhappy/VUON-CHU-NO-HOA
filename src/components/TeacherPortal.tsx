import React, { useState, useEffect } from 'react';
import { Student, Submission, AppSettings, WritingTask, GardenType } from '../types';
import { CURRICULUM_TASKS, GARDEN_INFOS } from '../data/curriculumData';
import { playPop, playChime } from '../utils/audio';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Star, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Printer, 
  Send, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Eye, 
  HelpCircle,
  FileText,
  UserCheck,
  ArrowLeft,
  Edit3
} from 'lucide-react';

interface TeacherPortalProps {
  students: Student[];
  settings: AppSettings;
  onBackToGarden: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  students,
  settings,
  onBackToGarden
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'reviewed' | 'draft'>('all');
  const [filterVolume, setFilterVolume] = useState<'all' | '1' | '2'>('all');
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Teacher feedback form state
  const [teacherComment, setTeacherComment] = useState('');
  const [editedAiNotes, setEditedAiNotes] = useState('');
  const [confirmedStars, setConfirmedStars] = useState<number>(5);
  const [flowerSticker, setFlowerSticker] = useState<string>('🌸 Bông hoa chăm ngoan');
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Printable report card mode
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Fetch submissions from backend
  const fetchSubmissions = async () => {
    setIsLoadingSubmissions(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (e) {
      console.error('Error fetching submissions:', e);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Filter students
  const filteredStudents = students.filter(s => {
    const displayName = settings.demoPrivacyMode ? s.demoName : s.name;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (selectedStudent && sub.studentId !== selectedStudent.id) return false;
    if (filterStatus !== 'all' && sub.status !== filterStatus) return false;
    if (filterVolume !== 'all' && String(sub.volume) !== filterVolume) return false;
    return true;
  });

  // Class statistics for "Cả lớp mình hôm nay"
  const totalSubmissions = submissions.length;
  const completedCount = submissions.filter(s => s.status === 'submitted' || s.status === 'reviewed').length;
  const reviewedCount = submissions.filter(s => s.status === 'reviewed').length;
  const independentCount = submissions.filter(s => s.isIndependentTest).length;
  const needingHelpCount = students.filter(s => s.flowersEarned < 6).length;

  const handleSelectSubmission = (sub: Submission) => {
    playPop(settings.soundEnabled);
    setSelectedSubmission(sub);
    setTeacherComment(sub.teacherFeedback?.comment || '');
    setEditedAiNotes(sub.teacherFeedback?.editedAiNotes || (sub.aiFeedback ? `Gợi ý của Hoa Nhỏ: ${sub.aiFeedback.flowerPraise} - ${sub.aiFeedback.leafReminder}` : ''));
    setConfirmedStars(sub.teacherFeedback?.confirmedStars || sub.aiFeedback?.suggestedStars || 5);
    setFlowerSticker(sub.teacherFeedback?.flowerSticker || '🌸 Bông hoa chăm ngoan');
    setSuccessMsg('');
  };

  const handleSaveTeacherFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setIsSavingFeedback(true);
    playChime(settings.soundEnabled);

    try {
      const res = await fetch('/api/teacher/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          comment: teacherComment,
          confirmedStars,
          flowerSticker,
          editedAiNotes,
          teacherName: 'Cô Nguyễn Thu Hà'
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Đã lưu nhận xét và tặng hoa cho em thành công!');
        fetchSubmissions();
        setSelectedSubmission(data.submission);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingFeedback(false);
    }
  };

  const flowerStickers = [
    '🌸 Bông hoa chăm ngoan',
    '🌻 Bông hoa sáng tạo',
    '🌷 Bông hoa viết hay',
    '🌺 Bông hoa giàu cảm xúc',
    '🌼 Bông hoa tiến bộ vượt bậc',
    '🐝 Chú ong chăm chỉ'
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Banner: Góc Cô Giáo */}
      <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-amber-100 rounded-3xl p-4 sm:p-5 border-2 border-emerald-300 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playPop(settings.soundEnabled);
              onBackToGarden();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-emerald-950 border-2 border-emerald-300 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-102"
            title="Quay lại vườn hoa chính"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700" />
            <span>← Quay lại</span>
          </button>

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-emerald-400 flex items-center justify-center text-2xl sm:text-3xl shadow-xs">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Góc Cô Giáo
              </span>
              <span className="text-xs text-stone-500 font-bold">Lớp 3 – Trường TH Lê Đức Thọ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-display">
              Cô Nguyễn Thu Hà • Đồng hành cùng 35 mầm hoa
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs sm:text-sm shadow-xs transition-colors"
            title="In sổ tay tiến bộ lớp học"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>In sổ theo dõi</span>
          </button>
        </div>
      </div>

      {/* Pedagogical Dashboard Cards: Cả lớp mình hôm nay */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border-2 border-emerald-200 shadow-xs">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
            Cả lớp mình hôm nay
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 font-display">
            35 / 35
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            Đủ 35 học sinh theo danh sách
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border-2 border-amber-200 shadow-xs">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
            Bài các em đã viết
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-1 font-display">
            {completedCount} bài
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
            {reviewedCount} bài cô đã nhận xét
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border-2 border-purple-200 shadow-xs">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
            Em tự thử sức
          </span>
          <div className="text-2xl sm:text-3xl font-black text-purple-900 mt-1 font-display">
            {independentCount} bài
          </div>
          <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
            Tự viết độc lập (không AI)
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border-2 border-rose-200 shadow-xs">
          <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
            Những cây bút cần cô giúp
          </span>
          <div className="text-2xl sm:text-3xl font-black text-rose-900 mt-1 font-display">
            {needingHelpCount} em
          </div>
          <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
            Cần khích lệ thêm ý tưởng
          </p>
        </div>
      </div>

      {/* Main Grid: Student List on Left, Submissions / Reviews on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 35 Students List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="font-extrabold text-xs uppercase tracking-wider text-stone-700">
              Danh sách 35 học sinh Lớp 3
            </span>
            {selectedStudent && (
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Xem tất cả lớp
              </button>
            )}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm theo họ tên hoặc mã..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:border-emerald-400 focus:outline-hidden text-xs bg-stone-50/50"
            />
          </div>

          {/* Student items */}
          <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
            {filteredStudents.map((st, index) => {
              const isSelected = selectedStudent?.id === st.id;
              const studentSubs = submissions.filter(sub => sub.studentId === st.id);
              return (
                <div
                  key={st.id}
                  onClick={() => {
                    playPop(settings.soundEnabled);
                    setSelectedStudent(isSelected ? null : st);
                  }}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/80 shadow-xs'
                      : 'border-stone-100 hover:border-emerald-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-extrabold text-stone-400 w-5 text-right">
                      {index + 1}.
                    </span>
                    <span className="text-lg">{st.avatar}</span>
                    <div className="truncate">
                      <div className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                        {settings.demoPrivacyMode ? st.demoName : st.name}
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium">
                        {st.id} • Cây cấp {st.treeLevel} • {st.flowersEarned} 🌸
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      studentSubs.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {studentSubs.length} bài
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Submissions / Essay Detail / Teacher Review (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Submissions Filter Toolbar */}
          <div className="bg-white p-3.5 rounded-3xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600">Trạng thái:</span>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                  filterStatus === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                Tất cả ({submissions.length})
              </button>
              <button
                onClick={() => setFilterStatus('submitted')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                  filterStatus === 'submitted' ? 'bg-amber-400 text-amber-950' : 'bg-stone-100 text-stone-600'
                }`}
              >
                Chờ cô xem ({submissions.filter(s => s.status === 'submitted').length})
              </button>
              <button
                onClick={() => setFilterStatus('reviewed')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                  filterStatus === 'reviewed' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                Cô đã nhận xét ({submissions.filter(s => s.status === 'reviewed').length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600">Tập:</span>
              <select
                value={filterVolume}
                onChange={(e) => setFilterVolume(e.target.value as any)}
                className="text-xs font-bold px-2.5 py-1 rounded-xl border border-stone-200 bg-stone-50 focus:outline-hidden"
              >
                <option value="all">Cả 2 tập</option>
                <option value="1">Tập 1</option>
                <option value="2">Tập 2</option>
              </select>
            </div>
          </div>

          {/* If a submission is selected for review */}
          {selectedSubmission ? (
            <div className="bg-white rounded-3xl border-2 border-emerald-300 p-5 shadow-lg space-y-5 animate-fade-in">
              {/* Back to list & Section Title */}
              <div className="flex flex-wrap items-center justify-between border-b border-stone-100 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100"
                  >
                    ← Trở lại danh sách bài
                  </button>
                  <span className="text-sm font-black text-emerald-950 font-display flex items-center gap-1.5">
                    <span>🌷</span>
                    <span>CÔ XEM BÀI CỦA EM</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedSubmission.isIndependentTest && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                      ⭐ Bài tự thử sức
                    </span>
                  )}
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    selectedSubmission.status === 'reviewed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {selectedSubmission.status === 'reviewed' ? 'Đã nhận xét' : 'Đang chờ cô nhận xét'}
                  </span>
                </div>
              </div>

              {/* Student info & prompt */}
              <div className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl">
                <div>
                  <span className="text-xs font-bold text-emerald-800">Học sinh:</span>
                  <div className="font-black text-sm text-stone-900">
                    {students.find(s => s.id === selectedSubmission.studentId)?.name || selectedSubmission.studentId} ({selectedSubmission.studentId})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-500">Đề bài:</span>
                  <div className="font-bold text-xs text-stone-800">{selectedSubmission.taskTitle}</div>
                </div>
              </div>

              {/* Writing Versions Evolution (Dàn ý -> Bản nháp 1 -> Bài hoàn thiện) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Initial & Developed Outline */}
                <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 text-xs space-y-1.5">
                  <span className="font-extrabold text-amber-900 uppercase block">
                    📋 Dàn ý của em
                  </span>
                  <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                    {(selectedSubmission.developedOutline?.length ? selectedSubmission.developedOutline : selectedSubmission.initialOutline || []).map((o, i) => (
                      <div key={i} className="bg-white p-1.5 rounded-lg border border-amber-100">
                        <span className="font-bold text-amber-800 block text-[10px]">{o.section}:</span>
                        <p className="text-stone-700">{o.content}</p>
                      </div>
                    ))}
                    {(!selectedSubmission.developedOutline?.length && !selectedSubmission.initialOutline?.length) && (
                      <p className="text-stone-400 italic">Học sinh tự viết trực tiếp.</p>
                    )}
                  </div>
                </div>

                {/* 2. First Draft */}
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                  <span className="font-extrabold text-stone-700 uppercase block">
                    📝 Bản viết đầu tiên
                  </span>
                  <p className="text-stone-600 italic bg-white p-2 rounded-xl border border-stone-100 min-h-[90px] leading-relaxed">
                    {selectedSubmission.firstDraft || selectedSubmission.drafts?.[0]?.content || selectedSubmission.finalContent}
                  </p>
                </div>

                {/* 3. Final Content */}
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
                  <span className="font-extrabold text-emerald-900 uppercase block">
                    ✨ Bài sau chỉnh sửa
                  </span>
                  <p className="text-stone-800 font-medium bg-white p-2 rounded-xl border border-emerald-100 min-h-[90px] leading-relaxed">
                    {selectedSubmission.finalContent}
                  </p>
                </div>
              </div>

              {/* AI Feedback reference with editable notes by teacher */}
              {selectedSubmission.aiFeedback && (
                <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-sky-900">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span>Gợi ý từ Hoa Nhỏ (AI):</span>
                    </div>
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                      Cô có quyền biên tập lại trước khi gửi học sinh
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded-xl border border-sky-100">
                      <span className="font-bold text-rose-700 block">🌸 Khen ngợi:</span>
                      <p className="text-stone-700 mt-0.5">{selectedSubmission.aiFeedback.flowerPraise}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-sky-100">
                      <span className="font-bold text-emerald-700 block">🍃 Nhắc nhở:</span>
                      <p className="text-stone-700 mt-0.5">{selectedSubmission.aiFeedback.leafReminder}</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-sky-100">
                      <span className="font-bold text-amber-700 block">⭐ Thử thách:</span>
                      <p className="text-stone-700 mt-0.5">{selectedSubmission.aiFeedback.smallChallenge}</p>
                    </div>
                  </div>

                  {/* Teacher edit of AI suggestions */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-sky-900 mb-1">
                      ✏️ Ghi chú chỉnh sửa gợi ý AI (nếu cô muốn bổ sung hoặc rút gọn):
                    </label>
                    <textarea
                      rows={2}
                      value={editedAiNotes}
                      onChange={(e) => setEditedAiNotes(e.target.value)}
                      placeholder="Cô chỉnh sửa lại gợi ý của AI cho phù hợp hơn với em..."
                      className="w-full p-2 rounded-xl border border-sky-300 text-xs bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Teacher Evaluation & Official Feedback Form */}
              <form onSubmit={handleSaveTeacherFeedback} className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-200 space-y-4">
                <span className="font-black text-emerald-950 text-sm font-display block">
                  Lời nhận xét chính thức và hoa thưởng của Cô giáo:
                </span>

                <div>
                  <textarea
                    rows={3}
                    value={teacherComment}
                    onChange={(e) => setTeacherComment(e.target.value)}
                    placeholder="Cô ghi lời động viên ân cần, chỉ ra điểm sáng tạo và hướng dẫn em rèn luyện thêm..."
                    className="w-full p-3 rounded-xl border border-emerald-300 focus:outline-hidden text-sm bg-white"
                    required
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Confirmed stars */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-700">Đánh giá sao:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setConfirmedStars(s)}
                          className={`p-1 rounded-md transition-transform ${
                            confirmedStars >= s ? 'text-amber-500 scale-110' : 'text-stone-300'
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Flower Sticker */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-700">Huy hiệu hoa:</span>
                    <select
                      value={flowerSticker}
                      onChange={(e) => setFlowerSticker(e.target.value)}
                      className="text-xs font-bold p-1.5 rounded-xl border border-emerald-300 bg-white"
                    >
                      {flowerStickers.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingFeedback}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Lưu nhận xét cho em</span>
                  </button>
                </div>

                {successMsg && (
                  <p className="text-xs font-bold text-emerald-800 bg-emerald-100 p-2 rounded-xl">
                    ✓ {successMsg}
                  </p>
                )}
              </form>
            </div>
          ) : (
            /* Submissions Cards List */
            <div className="space-y-3">
              {filteredSubmissions.map((sub) => {
                const student = students.find(s => s.id === sub.studentId);
                const displayName = settings.demoPrivacyMode ? student?.demoName : student?.name;
                const garden = GARDEN_INFOS[sub.gardenType] || GARDEN_INFOS.ke_chuyen;
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubmission(sub)}
                    className="bg-white rounded-3xl border-2 border-stone-200 hover:border-emerald-400 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{student?.avatar || '🌸'}</span>
                        <div>
                          <div className="font-bold text-sm text-stone-900">
                            {displayName || sub.studentId}
                          </div>
                          <div className="text-xs text-stone-500 font-medium">
                            {sub.taskTitle} • Tập {sub.volume}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.isIndependentTest && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            Tự thử sức
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          sub.status === 'reviewed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.status === 'reviewed' ? 'Đã nhận xét' : 'Chờ cô xem'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 italic mb-3 bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
                      "{sub.finalContent}"
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 text-stone-500 font-medium">
                      <span>Bắt đầu: {new Date(sub.startedAt).toLocaleDateString('vi-VN')}</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <span>Bấm để chấm bài</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredSubmissions.length === 0 && (
                <div className="bg-white rounded-3xl border-2 border-dashed border-stone-300 p-8 text-center text-stone-500 text-sm">
                  Chưa có bài viết nào trong bộ lọc này.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
