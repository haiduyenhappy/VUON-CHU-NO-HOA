import React, { useState, useEffect } from 'react';
import { Student, Submission, AppSettings, LinkedCaregiver } from '../types';
import { TEACHER_CONFIG } from '../constants/teacherConfig';
import { playPop, playChime } from '../utils/audio';
import { getTeacherGreeting } from '../utils/timeGreeting';
import { HoaNhoMascot } from './HoaNhoMascot';
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
  Edit3,
  Bookmark,
  Share2,
  Key,
  Lock,
  Unlock,
  UserPlus,
  Users,
  ShieldCheck,
  Phone,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

interface TeacherPortalProps {
  students: Student[];
  settings: AppSettings;
  onBackToGarden: () => void;
  onRefreshStudents?: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  students,
  settings,
  onBackToGarden,
  onRefreshStudents
}) => {
  // Navigation tabs within Teacher Portal
  const [activeTab, setActiveTab] = useState<'reviews' | 'accounts'>('reviews');

  // Review section state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'reviewed' | 'draft'>('all');
  const [filterVolume, setFilterVolume] = useState<'all' | '1' | '2'>('all');
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Teacher qualitative feedback form state (Formative assessment - Không chấm điểm số)
  const [teacherComment, setTeacherComment] = useState('');
  const [praiseIdea, setPraiseIdea] = useState('');
  const [wordSentenceSuggestions, setWordSentenceSuggestions] = useState('');
  const [emotionCreativityEncouragement, setEmotionCreativityEncouragement] = useState('');
  const [teacherAdvice, setTeacherAdvice] = useState('');
  const [editedAiNotes, setEditedAiNotes] = useState('');
  const [confirmedStars, setConfirmedStars] = useState<number>(5);
  const [flowerSticker, setFlowerSticker] = useState<string>('🌸 Bông hoa chăm ngoan');
  const [feedbackStatus, setFeedbackStatus] = useState<'draft' | 'published'>('published');
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // ---------------- Account Management Section State ----------------
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [accountSearch, setAccountSearch] = useState('');
  const [accountFilter, setAccountFilter] = useState<'all' | 'active' | 'locked'>('all');

  // Modal 1: Reset password handover slip
  const [resetModalData, setResetModalData] = useState<{
    student: Student;
    newPassword: string;
    issuedAt: string;
  } | null>(null);

  // Modal 2: Edit student / Change class
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState('');
  const [editClassName, setEditClassName] = useState('');
  const [editAvatar, setEditAvatar] = useState('🌸');

  // Modal 3: Family connection management
  const [familyLinkStudent, setFamilyLinkStudent] = useState<Student | null>(null);
  const [familyCaregiverName, setFamilyCaregiverName] = useState('');
  const [familyCaregiverPhone, setFamilyCaregiverPhone] = useState('');
  const [familyCaregiverRelation, setFamilyCaregiverRelation] = useState('Bố / Mẹ');
  const [familyConnectionCode, setFamilyConnectionCode] = useState('');

  // Modal 4: Add new student
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentAvatar, setNewStudentAvatar] = useState('🌸');

  // Sync students from props
  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

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

  // Filter students for review view
  const filteredStudents = localStudents.filter(s => {
    const displayName = settings.demoPrivacyMode ? s.demoName : s.name;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (selectedStudent && sub.studentId !== selectedStudent.id) return false;
    if (filterStatus === 'submitted') return sub.status === 'submitted';
    if (filterStatus === 'reviewed') return sub.status === 'reviewed' && sub.teacherFeedback?.status === 'published';
    if (filterStatus === 'draft') return sub.teacherFeedback?.status === 'draft';
    if (filterVolume !== 'all' && String(sub.volume) !== filterVolume) return false;
    return true;
  });

  // Class statistics for "Cả lớp mình hôm nay"
  const completedCount = submissions.filter(s => s.status === 'submitted' || s.status === 'reviewed').length;
  const reviewedCount = submissions.filter(s => s.status === 'reviewed' && s.teacherFeedback?.status === 'published').length;
  const pendingCount = submissions.filter(s => s.status === 'submitted').length;
  const independentCount = submissions.filter(s => s.isIndependentTest).length;
  const needingHelpCount = localStudents.filter(s => s.flowersEarned < 6).length;

  const handleSelectSubmission = (sub: Submission) => {
    playPop(settings.soundEnabled);
    setSelectedSubmission(sub);
    setTeacherComment(sub.teacherFeedback?.comment || '');
    setPraiseIdea(sub.teacherFeedback?.praiseIdea || (sub.aiFeedback?.flowerPraise ? `Ý tưởng hay: ${sub.aiFeedback.flowerPraise}` : ''));
    setWordSentenceSuggestions(sub.teacherFeedback?.wordSentenceSuggestions || (sub.aiFeedback?.leafReminder ? `Góp ý diễn đạt: ${sub.aiFeedback.leafReminder}` : ''));
    setEmotionCreativityEncouragement(sub.teacherFeedback?.emotionCreativityEncouragement || 'Cô rất khen ngợi sự kiên trì và nỗ lực tự tay viết bài của em.');
    setTeacherAdvice(sub.teacherFeedback?.teacherAdvice || (sub.aiFeedback?.smallChallenge ? `Thử thách tiếp theo: ${sub.aiFeedback.smallChallenge}` : ''));
    setEditedAiNotes(sub.teacherFeedback?.editedAiNotes || (sub.aiFeedback ? `Gợi ý của Hoa Nhỏ: ${sub.aiFeedback.flowerPraise} - ${sub.aiFeedback.leafReminder}` : ''));
    setConfirmedStars(sub.teacherFeedback?.confirmedStars || sub.aiFeedback?.suggestedStars || 5);
    setFlowerSticker(sub.teacherFeedback?.flowerSticker || '🌸 Bông hoa chăm ngoan');
    setFeedbackStatus(sub.teacherFeedback?.status || 'published');
    setSuccessMsg('');
  };

  const handleSaveTeacherFeedback = async (targetStatus: 'draft' | 'published') => {
    if (!selectedSubmission) return;

    setIsSavingFeedback(true);
    playChime(settings.soundEnabled);

    try {
      const res = await fetch('/api/teacher/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          comment: teacherComment || praiseIdea || 'Bài viết của em rất đáng khen ngợi!',
          praiseIdea,
          wordSentenceSuggestions,
          emotionCreativityEncouragement,
          teacherAdvice,
          confirmedStars,
          flowerSticker,
          editedAiNotes,
          status: targetStatus,
          teacherName: TEACHER_CONFIG.name
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          targetStatus === 'published' 
            ? '✓ Đã công bố nhận xét và trao hoa cho em thành công! Học sinh và gia đình đã có thể xem được.'
            : '✓ Đã lưu bản nháp nhận xét. Chỉ cô mới thấy nội dung này.'
        );
        fetchSubmissions();
        setSelectedSubmission(data.submission);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingFeedback(false);
    }
  };

  // ---------------- Account Management Actions ----------------

  // Action: Reset Password
  const handleResetPassword = async (st: Student) => {
    playPop(settings.soundEnabled);
    try {
      const res = await fetch('/api/teacher/students/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: st.id })
      });
      const data = await res.json();
      if (data.success) {
        setResetModalData({
          student: data.student,
          newPassword: data.newPassword,
          issuedAt: data.issuedAt
        });
        // Update locally
        setLocalStudents(prev => prev.map(s => s.id === st.id ? data.student : s));
      }
    } catch (e) {
      alert('Không thể cấp lại mật khẩu vào lúc này.');
    }
  };

  // Action: Toggle Account Lock
  const handleToggleLock = async (st: Student) => {
    playPop(settings.soundEnabled);
    const nextStatus = st.accountStatus === 'locked' ? 'active' : 'locked';
    try {
      const res = await fetch('/api/teacher/students/toggle-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: st.id, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setLocalStudents(prev => prev.map(s => s.id === st.id ? { ...s, accountStatus: nextStatus } : s));
      }
    } catch (e) {
      alert('Không thể thay đổi trạng thái tài khoản.');
    }
  };

  // Action: Open Edit Student Modal
  const handleOpenEdit = (st: Student) => {
    playPop(settings.soundEnabled);
    setEditingStudent(st);
    setEditName(st.name);
    setEditClassName(st.className || `${TEACHER_CONFIG.className} – ${TEACHER_CONFIG.schoolShort}`);
    setEditAvatar(st.avatar);
  };

  // Action: Save Edited Student
  const handleSaveEdit = async () => {
    if (!editingStudent) return;
    try {
      const res = await fetch('/api/teacher/students/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStudent.id,
          name: editName,
          className: editClassName,
          avatar: editAvatar
        })
      });
      const data = await res.json();
      if (data.success) {
        setLocalStudents(prev => prev.map(s => s.id === editingStudent.id ? data.student : s));
        setEditingStudent(null);
        if (onRefreshStudents) onRefreshStudents();
      }
    } catch (e) {
      alert('Không thể lưu thông tin học sinh.');
    }
  };

  // Action: Open Family Link Modal
  const handleOpenFamilyLink = (st: Student) => {
    playPop(settings.soundEnabled);
    setFamilyLinkStudent(st);
    const caregiver = st.linkedCaregivers?.[0];
    setFamilyCaregiverName(caregiver?.name || `Gia đình em ${st.name.split(' ').slice(-1)[0]}`);
    setFamilyCaregiverPhone(caregiver?.phone || '');
    setFamilyCaregiverRelation(caregiver?.relation || 'Bố / Mẹ');
    setFamilyConnectionCode(st.parentCode || `PH${st.id.replace(/[^0-9]/g, '')}`);
  };

  // Action: Save Family Link
  const handleSaveFamilyLink = async () => {
    if (!familyLinkStudent) return;
    try {
      const res = await fetch('/api/teacher/students/family-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: familyLinkStudent.id,
          parentCode: familyConnectionCode,
          caregiverName: familyCaregiverName,
          caregiverPhone: familyCaregiverPhone,
          caregiverRelation: familyCaregiverRelation,
          caregiverStatus: 'active'
        })
      });
      const data = await res.json();
      if (data.success) {
        setLocalStudents(prev => prev.map(s => s.id === familyLinkStudent.id ? data.student : s));
        setFamilyLinkStudent(null);
      }
    } catch (e) {
      alert('Không thể cập nhật liên kết gia đình.');
    }
  };

  // Action: Add New Student
  const handleAddNewStudent = async () => {
    if (!newStudentName.trim()) return;
    try {
      const res = await fetch('/api/teacher/students/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentName,
          avatar: newStudentAvatar,
          className: `${TEACHER_CONFIG.className} – ${TEACHER_CONFIG.schoolShort}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setLocalStudents(prev => [...prev, data.student]);
        setIsAddStudentOpen(false);
        setNewStudentName('');
        if (onRefreshStudents) onRefreshStudents();
      }
    } catch (e) {
      alert('Không thể thêm học sinh mới.');
    }
  };

  // Filtered students for Account Management Table
  const accountStudentsList = localStudents.filter(st => {
    const matchSearch = st.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
                        st.id.toLowerCase().includes(accountSearch.toLowerCase()) ||
                        st.parentCode.toLowerCase().includes(accountSearch.toLowerCase());
    if (accountFilter === 'active') return matchSearch && st.accountStatus !== 'locked';
    if (accountFilter === 'locked') return matchSearch && st.accountStatus === 'locked';
    return matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Banner: Góc Cô Giáo */}
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
              <span className="text-xs text-stone-600 font-bold">
                {TEACHER_CONFIG.className} – {TEACHER_CONFIG.school}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-display">
              {TEACHER_CONFIG.tagline}
            </h2>
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-emerald-300 shadow-xs">
          <button
            onClick={() => {
              playPop(settings.soundEnabled);
              setActiveTab('reviews');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              activeTab === 'reviews'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sổ Chấm Bài ({completedCount})</span>
          </button>

          <button
            onClick={() => {
              playPop(settings.soundEnabled);
              setActiveTab('accounts');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              activeTab === 'accounts'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>TÀI KHOẢN LỚP EM ({localStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Hoa Nhỏ Personalized Teacher Greeting */}
      <div className="flex justify-start">
        <HoaNhoMascot
          mood="happy"
          size="sm"
          reducedMotion={settings.reducedMotion}
          message={getTeacherGreeting(TEACHER_CONFIG.name, pendingCount)}
        />
      </div>

      {/* ================= TAB 1: SỔ CHẤM BÀI & NHẬN XÉT ================= */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-fade-in">
          {/* Pedagogical Dashboard Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-3xl border-2 border-emerald-200 shadow-xs">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
                Cả lớp mình hôm nay
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 font-display">
                {localStudents.length} / 35
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
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                          : 'bg-stone-50/50 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-stone-400 w-4 text-right">
                          {index + 1}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-base">
                          {st.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                            {settings.demoPrivacyMode ? st.demoName : st.name}
                          </h4>
                          <span className="text-[11px] text-stone-500 font-medium">
                            {st.id} • {studentSubs.length} bài
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-rose-600 flex items-center gap-0.5">
                          <span>🌸</span>
                          <span>{st.flowersEarned}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Submission List & Formative Assessment Card (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Filter bar */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Lọc:</span>
                  </span>
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      filterStatus === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Tất cả ({submissions.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('submitted')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      filterStatus === 'submitted' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    Chờ cô đọc ({pendingCount})
                  </button>
                  <button
                    onClick={() => setFilterStatus('reviewed')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      filterStatus === 'reviewed' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Đã công bố ({reviewedCount})
                  </button>
                </div>
              </div>

              {/* Submissions list */}
              <div className="space-y-3">
                {filteredSubmissions.map(sub => {
                  const student = localStudents.find(s => s.id === sub.studentId);
                  const isSelected = selectedSubmission?.id === sub.id;

                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleSelectSubmission(sub)}
                      className={`p-4 rounded-3xl border-2 transition-all cursor-pointer bg-white ${
                        isSelected
                          ? 'border-emerald-500 shadow-md ring-2 ring-emerald-200'
                          : 'border-stone-200 hover:border-emerald-300 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{student?.avatar || '🌸'}</span>
                          <div>
                            <span className="text-xs font-bold text-emerald-800">
                              {settings.demoPrivacyMode ? student?.demoName : student?.name} ({sub.studentId})
                            </span>
                            <h4 className="font-extrabold text-sm sm:text-base text-stone-900 font-display">
                              {sub.taskTitle}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {sub.status === 'reviewed' && sub.teacherFeedback?.status === 'published' ? (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                              ✓ Đã công bố nhận xét
                            </span>
                          ) : sub.teacherFeedback?.status === 'draft' ? (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                              📝 Bản nháp của cô
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                              ⏳ Chờ cô đọc
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-stone-400" />
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-700 italic bg-stone-50 p-3 rounded-2xl border border-stone-100 mt-3 line-clamp-2">
                        "{sub.finalContent}"
                      </p>
                    </div>
                  );
                })}

                {filteredSubmissions.length === 0 && (
                  <div className="p-8 text-center text-stone-400 bg-white rounded-3xl border-2 border-dashed border-stone-200">
                    Không có bài viết nào phù hợp với bộ lọc hiện tại.
                  </div>
                )}
              </div>

              {/* Formative Teacher Assessment Form */}
              {selectedSubmission && (
                <div className="bg-white rounded-3xl border-3 border-emerald-400 p-5 sm:p-6 shadow-xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👩‍🏫</span>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-emerald-950 font-display">
                          Phiếu Nhận Xét Định Tính – {TEACHER_CONFIG.name}
                        </h3>
                        <p className="text-xs text-stone-500 font-semibold">
                          Bài của em {localStudents.find(s => s.id === selectedSubmission.studentId)?.name} • Đánh giá theo định hướng GDPT 2018 (Không chấm điểm số)
                        </p>
                      </div>
                    </div>
                  </div>

                  {successMsg && (
                    <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs sm:text-sm font-bold text-emerald-900 animate-pulse">
                      {successMsg}
                    </div>
                  )}

                  {/* 4 Pedagogical Qualitative Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-rose-900 block mb-1">
                        🌸 1. Khen ngợi ý tưởng nổi bật của em:
                      </label>
                      <input
                        type="text"
                        value={praiseIdea}
                        onChange={e => setPraiseIdea(e.target.value)}
                        placeholder="Ví dụ: Ý tưởng gắn kết tình cảm gia đình rất gần gũi, chân thật..."
                        className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-rose-200 focus:border-rose-400 focus:outline-hidden bg-rose-50/40"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-emerald-900 block mb-1">
                        ✏️ 2. Góp ý về cách dùng từ và đặt câu:
                      </label>
                      <input
                        type="text"
                        value={wordSentenceSuggestions}
                        onChange={e => setWordSentenceSuggestions(e.target.value)}
                        placeholder="Ví dụ: Em dùng từ ngữ gợi cảm rất tốt, chú ý thêm dấu chấm ngắt câu..."
                        className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-emerald-200 focus:border-emerald-400 focus:outline-hidden bg-emerald-50/40"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-amber-900 block mb-1">
                        💖 3. Khích lệ cảm xúc và sáng tạo:
                      </label>
                      <input
                        type="text"
                        value={emotionCreativityEncouragement}
                        onChange={e => setEmotionCreativityEncouragement(e.target.value)}
                        placeholder="Ví dụ: Cảm xúc vui sướng và nụ cười rạng rỡ của con làm bài văn bừng sáng..."
                        className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-amber-200 focus:border-amber-400 focus:outline-hidden bg-amber-50/40"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-purple-900 block mb-1">
                        💌 4. Lời dặn dò của cô dành cho em (để em viết bản sửa mới):
                      </label>
                      <textarea
                        rows={2}
                        value={teacherAdvice}
                        onChange={e => setTeacherAdvice(e.target.value)}
                        placeholder="Ví dụ: Con hãy bổ sung thêm 1 hình ảnh so sánh và kiểm tra lại chữ viết hoa để chuẩn bị viết bản sửa số 2 nhé!"
                        className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-purple-200 focus:border-purple-400 focus:outline-hidden bg-purple-50/40"
                      />
                    </div>
                  </div>

                  {/* Flower Sticker & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-600">Hoa khen tặng:</span>
                      <select
                        value={flowerSticker}
                        onChange={e => setFlowerSticker(e.target.value)}
                        className="text-xs font-bold p-2 rounded-xl border border-emerald-300 bg-white"
                      >
                        <option value="🌸 Bông hoa chăm ngoan">🌸 Bông hoa chăm ngoan</option>
                        <option value="🌻 Bông hoa sáng tạo">🌻 Bông hoa sáng tạo</option>
                        <option value="🌷 Bông hoa viết hay">🌷 Bông hoa viết hay</option>
                        <option value="🌺 Bông hoa giàu cảm xúc">🌺 Bông hoa giàu cảm xúc</option>
                        <option value="🌼 Bông hoa tiến bộ vượt bậc">🌼 Bông hoa tiến bộ vượt bậc</option>
                        <option value="🐝 Chú ong chăm chỉ">🐝 Chú ong chăm chỉ</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveTeacherFeedback('draft')}
                        disabled={isSavingFeedback}
                        className="px-4 py-2.5 rounded-2xl border-2 border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs"
                      >
                        Lưu bản nháp của cô
                      </button>
                      <button
                        onClick={() => handleSaveTeacherFeedback('published')}
                        disabled={isSavingFeedback}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-102 flex items-center gap-1.5"
                      >
                        <Send className="w-4 h-4" />
                        <span>Gửi lời nhận xét cho em</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TÀI KHOẢN LỚP EM ================= */}
      {activeTab === 'accounts' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Summary for Accounts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-3xl border-2 border-emerald-200 shadow-xs">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
                Sĩ số lớp em
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 font-display">
                {localStudents.length} / 35
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                {TEACHER_CONFIG.className} • {TEACHER_CONFIG.schoolShort}
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border-2 border-teal-200 shadow-xs">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
                Đang kích hoạt
              </span>
              <div className="text-2xl sm:text-3xl font-black text-teal-800 mt-1 font-display">
                {localStudents.filter(s => s.accountStatus !== 'locked').length} em
              </div>
              <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                Sẵn sàng đăng nhập và học tập
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border-2 border-rose-200 shadow-xs">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
                Tạm khóa bảo mật
              </span>
              <div className="text-2xl sm:text-3xl font-black text-rose-800 mt-1 font-display">
                {localStudents.filter(s => s.accountStatus === 'locked').length} em
              </div>
              <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
                Có thể mở lại bất cứ lúc nào
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border-2 border-purple-200 shadow-xs">
              <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
                Mã kết nối gia đình
              </span>
              <div className="text-2xl sm:text-3xl font-black text-purple-900 mt-1 font-display">
                {localStudents.length} mã
              </div>
              <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                Từ PH001 đến PH035
              </p>
            </div>
          </div>

          {/* Action and Filter Toolbar */}
          <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[260px]">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Tìm học sinh theo tên, mã HS (HS001), mã PH (PH001)..."
                  value={accountSearch}
                  onChange={e => setAccountSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-2xl border border-stone-200 text-xs sm:text-sm bg-stone-50/50 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAccountFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    accountFilter === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Tất cả ({localStudents.length})
                </button>
                <button
                  onClick={() => setAccountFilter('active')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    accountFilter === 'active' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Hoạt động
                </button>
                <button
                  onClick={() => setAccountFilter('locked')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    accountFilter === 'locked' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  Tạm khóa
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddStudentOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Thêm học sinh mới</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 font-bold text-xs shadow-xs transition-colors"
                title="In bảng danh sách tài khoản lớp em"
              >
                <Printer className="w-4 h-4 text-stone-600" />
                <span>In danh sách tài khoản</span>
              </button>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-emerald-50/80 border-b border-emerald-100 text-emerald-950 font-extrabold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-3 text-center w-12">STT</th>
                    <th className="py-3.5 px-4">Họ và tên</th>
                    <th className="py-3.5 px-3">Mã học sinh</th>
                    <th className="py-3.5 px-3">Tên đăng nhập & Lớp</th>
                    <th className="py-3.5 px-3">Tình trạng</th>
                    <th className="py-3.5 px-3">Lần đăng nhập</th>
                    <th className="py-3.5 px-3">Mã kết nối gia đình</th>
                    <th className="py-3.5 px-4 text-center">Thao tác quản lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {accountStudentsList.map((st, idx) => {
                    const isLocked = st.accountStatus === 'locked';
                    const caregiver = st.linkedCaregivers?.[0];

                    return (
                      <tr key={st.id} className="hover:bg-emerald-50/20 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-stone-400">
                          {idx + 1}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-sm">
                              {st.avatar}
                            </span>
                            <div>
                              <span className="font-extrabold text-stone-900 block">
                                {st.name}
                              </span>
                              <span className="text-[11px] text-stone-400 font-medium">
                                {st.demoName}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-emerald-900">
                          {st.id}
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-mono font-semibold text-stone-700 block">
                            {st.username || st.id.toLowerCase()}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {st.className || 'Lớp 3 – TH Lê Đức Thọ'}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          {isLocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <Lock className="w-3 h-3" />
                              <span>Tạm khóa</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Đã kích hoạt</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-stone-600 text-xs">
                          {st.lastLogin || 'Chưa đăng nhập'}
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                              {st.parentCode}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              ({caregiver?.relation || 'PH'})
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {/* Cấp lại mật khẩu */}
                            <button
                              onClick={() => handleResetPassword(st)}
                              className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1 transition-colors"
                              title="Cấp lại mật khẩu an toàn và in phiếu"
                            >
                              <Key className="w-3 h-3 text-amber-700" />
                              <span>Cấp lại MK</span>
                            </button>

                            {/* Khóa / Mở khóa */}
                            <button
                              onClick={() => handleToggleLock(st)}
                              className={`px-2.5 py-1 rounded-xl font-bold text-xs border flex items-center gap-1 transition-colors ${
                                isLocked
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                              }`}
                              title={isLocked ? 'Mở lại tài khoản' : 'Tạm khóa tài khoản'}
                            >
                              {isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                              <span>{isLocked ? 'Mở khóa' : 'Khóa'}</span>
                            </button>

                            {/* Sửa thông tin */}
                            <button
                              onClick={() => handleOpenEdit(st)}
                              className="px-2 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold text-xs"
                              title="Sửa họ tên, đổi lớp mà không xóa lịch sử"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>

                            {/* Liên kết gia đình */}
                            <button
                              onClick={() => handleOpenFamilyLink(st)}
                              className="px-2 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs"
                              title="Quản lý mã kết nối gia đình"
                            >
                              👨‍👩‍👧
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: PHIẾU BÀN GIAO MẬT KHẨU AN TOÀN ================= */}
      {resetModalData && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-amber-400 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in relative">
            <button
              onClick={() => setResetModalData(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-3xl">🔑</span>
              <h3 className="text-xl font-black text-amber-950 font-display">
                Phiếu Bàn Giao Mật Khẩu Học Sinh
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {TEACHER_CONFIG.school} • {TEACHER_CONFIG.className}
              </p>
            </div>

            {/* Slip content */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-300 space-y-3 font-sans">
              <div className="flex justify-between text-xs font-bold text-stone-700 border-b border-amber-200 pb-2">
                <span>Học sinh: <strong className="text-stone-900 text-sm">{resetModalData.student.name}</strong></span>
                <span>Mã số: <strong className="text-amber-900 text-sm">{resetModalData.student.id}</strong></span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-center space-y-1">
                <span className="text-xs text-stone-500 font-bold block uppercase tracking-wider">
                  Mật khẩu mới (Hiển thị 1 lần cho cô)
                </span>
                <span className="text-2xl font-black font-mono text-amber-900 tracking-wider">
                  {resetModalData.newPassword}
                </span>
                <p className="text-[11px] text-stone-500">
                  (Hoặc mã PIN 4 số: <strong>{resetModalData.student.pin}</strong>)
                </p>
              </div>

              <div className="text-xs text-stone-600 space-y-1 pt-1">
                <p>• Tên đăng nhập: <strong>{resetModalData.student.id}</strong> hoặc <strong>{resetModalData.student.username || resetModalData.student.id.toLowerCase()}</strong></p>
                <p>• Giáo viên bàn giao: <strong>{TEACHER_CONFIG.name}</strong></p>
                <p>• Thời gian cấp: {new Date(resetModalData.issuedAt).toLocaleString('vi-VN')}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResetModalData(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Đóng lại
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>In phiếu bàn giao này</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: SỬA THÔNG TIN & CHUYỂN LỚP ================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-emerald-400 max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in relative">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-emerald-950 font-display">
                Chỉnh Sửa Hồ Sơ Học Sinh
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Mã {editingStudent.id} • Hoàn toàn giữ nguyên bài viết và lịch sử học tập
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Họ và tên đầy đủ:
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Lớp học & Đơn vị:
                </label>
                <input
                  type="text"
                  value={editClassName}
                  onChange={e => setEditClassName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Biểu tượng mầm hoa (Avatar):
                </label>
                <div className="flex items-center gap-2">
                  {['🌸', '🌻', '🌷', '🌼', '🌺', '🌱', '🦋', '🐝', '🍀', '🌿', '🌾', '🌲'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setEditAvatar(emoji)}
                      className={`w-8 h-8 rounded-xl border text-base flex items-center justify-center transition-all ${
                        editAvatar === emoji ? 'border-emerald-500 bg-emerald-100 scale-110 shadow-xs' : 'border-stone-200 bg-stone-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: LIÊN KẾT GIA ĐÌNH ================= */}
      {familyLinkStudent && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-purple-400 max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in relative">
            <button
              onClick={() => setFamilyLinkStudent(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-purple-950 font-display">
                Quản Lý Liên Kết Gia Đình
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Học sinh: {familyLinkStudent.name} ({familyLinkStudent.id})
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Mã kết nối phụ huynh (Đăng nhập Góc Gia Đình):
                </label>
                <input
                  type="text"
                  value={familyConnectionCode}
                  onChange={e => setFamilyConnectionCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-mono font-bold text-xs sm:text-sm uppercase text-purple-900 focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Người chăm sóc / Vai trò:
                </label>
                <select
                  value={familyCaregiverRelation}
                  onChange={e => setFamilyCaregiverRelation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="Bố / Mẹ">Bố / Mẹ</option>
                  <option value="Bố">Bố</option>
                  <option value="Mẹ">Mẹ</option>
                  <option value="Ông / Bà">Ông / Bà</option>
                  <option value="Người giám hộ">Người giám hộ</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Họ tên người chăm sóc:
                </label>
                <input
                  type="text"
                  value={familyCaregiverName}
                  onChange={e => setFamilyCaregiverName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Số điện thoại phụ huynh:
                </label>
                <input
                  type="text"
                  value={familyCaregiverPhone}
                  onChange={e => setFamilyCaregiverPhone(e.target.value)}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-purple-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setFamilyLinkStudent(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveFamilyLink}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs"
              >
                Lưu liên kết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: THÊM HỌC SINH MỚI ================= */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-emerald-400 max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in relative">
            <button
              onClick={() => setIsAddStudentOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-emerald-950 font-display">
                Thêm Học Sinh Mới Vào Lớp
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Tự động tạo mã học sinh và mã kết nối gia đình tiếp theo
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Họ và tên học sinh:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Chọn biểu tượng:
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['🌸', '🌻', '🌷', '🌼', '🌺', '🌱', '🦋', '🐝', '🍀', '🌿', '🌾', '🌲'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewStudentAvatar(emoji)}
                      className={`w-8 h-8 rounded-xl border text-base flex items-center justify-center transition-all ${
                        newStudentAvatar === emoji ? 'border-emerald-500 bg-emerald-100 scale-110 shadow-xs' : 'border-stone-200 bg-stone-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleAddNewStudent}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs"
              >
                Tạo tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
