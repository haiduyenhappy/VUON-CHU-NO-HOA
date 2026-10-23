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
  AlertCircle,
  Trash2,
  RotateCcw,
  EyeOff,
  AlertTriangle,
  Plus
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
  const [accountFilter, setAccountFilter] = useState<'all' | 'active' | 'locked' | 'deleted'>('all');

  // Modal 1: Choice & Prompt to Reset Password (Auto vs Manual)
  const [promptResetStudent, setPromptResetStudent] = useState<Student | null>(null);
  const [resetMode, setResetMode] = useState<'auto' | 'manual'>('auto');
  const [customPasswordInput, setCustomPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [resetErrorMsg, setResetErrorMsg] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Modal 1b: Handover Slip after successful password reset
  const [resetModalData, setResetModalData] = useState<{
    student: Student;
    newPassword: string;
    pin?: string;
    issuedAt: string;
  } | null>(null);

  // Modal 2: Edit student / Change class & username
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState('');
  const [editDemoName, setEditDemoName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editClassName, setEditClassName] = useState('');
  const [editAccountStatus, setEditAccountStatus] = useState<'active' | 'locked'>('active');
  const [editAvatar, setEditAvatar] = useState('🌸');
  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Modal 3: Family connection management (Quản lý gia đình đa người chăm sóc & mã mời)
  const [familyLinkStudent, setFamilyLinkStudent] = useState<Student | null>(null);
  const [familyCaregiverName, setFamilyCaregiverName] = useState('');
  const [familyCaregiverPhone, setFamilyCaregiverPhone] = useState('');
  const [familyCaregiverRelation, setFamilyCaregiverRelation] = useState('Bố / Mẹ');
  const [familyCaregiverEmail, setFamilyCaregiverEmail] = useState('');
  const [familyConnectionCode, setFamilyConnectionCode] = useState('');
  const [isAddingCaregiver, setIsAddingCaregiver] = useState(false);
  const [editingCaregiverId, setEditingCaregiverId] = useState<string | null>(null);
  const [copiedInviteCode, setCopiedInviteCode] = useState<string | null>(null);
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [familyActionMsg, setFamilyActionMsg] = useState('');

  // Modal 4: Add new student
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentAvatar, setNewStudentAvatar] = useState('🌸');

  // Modal 5: Soft Delete confirmation
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);

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

  // Action: Open Reset Password Choice Modal
  const handleOpenResetPassword = (st: Student) => {
    playPop(settings.soundEnabled);
    setPromptResetStudent(st);
    setResetMode('auto');
    setCustomPasswordInput('');
    setConfirmPasswordInput('');
    setShowPasswordText(false);
    setResetErrorMsg('');
  };

  // Action: Confirm Reset Password (Auto or Manual)
  const handleConfirmResetPassword = async () => {
    if (!promptResetStudent) return;

    if (resetMode === 'manual') {
      const cleanCustom = customPasswordInput.trim();
      const cleanConfirm = confirmPasswordInput.trim();
      if (!cleanCustom || cleanCustom.length < 4) {
        setResetErrorMsg('Mật khẩu mới phải có ít nhất 4 ký tự để đảm bảo an toàn.');
        return;
      }
      if (cleanCustom !== cleanConfirm) {
        setResetErrorMsg('Mật khẩu xác nhận không trùng khớp. Cô vui lòng kiểm tra lại.');
        return;
      }
    }

    setIsResetting(true);
    setResetErrorMsg('');

    try {
      const res = await fetch('/api/teacher/students/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: promptResetStudent.id,
          customPassword: resetMode === 'manual' ? customPasswordInput.trim() : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setResetModalData({
          student: data.student,
          newPassword: data.newPassword,
          pin: data.pin || data.student.pin,
          issuedAt: data.issuedAt
        });
        setLocalStudents(prev => prev.map(s => s.id === promptResetStudent.id ? data.student : s));
        setPromptResetStudent(null);
      } else {
        setResetErrorMsg(data.message || 'Không thể cấp lại mật khẩu vào lúc này.');
      }
    } catch (e) {
      setResetErrorMsg('Đã xảy ra lỗi khi kết nối máy chủ.');
    } finally {
      setIsResetting(false);
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
    setEditDemoName(st.demoName || st.name.split(' ').slice(-1)[0] || st.name);
    setEditUsername(st.username || st.id.toLowerCase());
    setEditClassName(st.className || `${TEACHER_CONFIG.className} – ${TEACHER_CONFIG.schoolShort}`);
    setEditAccountStatus(st.accountStatus === 'locked' ? 'locked' : 'active');
    setEditAvatar(st.avatar || '🌸');
    setEditErrorMsg('');
  };

  // Action: Save Edited Student
  const handleSaveEdit = async () => {
    if (!editingStudent) return;
    if (!editName.trim()) {
      setEditErrorMsg('Vui lòng nhập họ và tên học sinh.');
      return;
    }
    if (!editUsername.trim()) {
      setEditErrorMsg('Vui lòng nhập tên đăng nhập cho học sinh.');
      return;
    }

    setIsSavingEdit(true);
    setEditErrorMsg('');

    try {
      const res = await fetch('/api/teacher/students/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStudent.id,
          name: editName.trim(),
          demoName: editDemoName.trim(),
          username: editUsername.trim().toLowerCase(),
          className: editClassName.trim(),
          avatar: editAvatar,
          accountStatus: editAccountStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setLocalStudents(prev => prev.map(s => s.id === editingStudent.id ? data.student : s));
        setEditingStudent(null);
        setSuccessMsg(`✓ Đã lưu thay đổi hồ sơ học sinh ${data.student.name} thành công!`);
        if (onRefreshStudents) onRefreshStudents();
      } else {
        setEditErrorMsg(data.message || 'Không thể lưu thông tin học sinh.');
      }
    } catch (e) {
      setEditErrorMsg('Đã xảy ra lỗi khi lưu thông tin.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Action: Open Soft Delete Confirmation
  const handleOpenDelete = (st: Student) => {
    playPop(settings.soundEnabled);
    setDeletingStudent(st);
  };

  // Action: Confirm Soft Delete
  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeletingStudent(true);
    try {
      const res = await fetch('/api/teacher/students/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingStudent.id })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setLocalStudents(prev => prev.map(s => s.id === deletingStudent.id ? { ...s, accountStatus: 'deleted' } : s));
        setSuccessMsg(`✓ Đã xóa tài khoản em ${deletingStudent.name}. Toàn bộ bài viết được bảo lưu an toàn.`);
        setDeletingStudent(null);
        if (onRefreshStudents) onRefreshStudents();
      } else {
        alert(data.message || 'Không thể xóa tài khoản học sinh.');
      }
    } catch (e) {
      alert('Đã xảy ra lỗi khi xóa tài khoản.');
    } finally {
      setIsDeletingStudent(false);
    }
  };

  // Action: Restore Soft-Deleted Student
  const handleRestoreStudent = async (st: Student) => {
    playPop(settings.soundEnabled);
    try {
      const res = await fetch('/api/teacher/students/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: st.id })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setLocalStudents(prev => prev.map(s => s.id === st.id ? { ...s, accountStatus: 'active' } : s));
        setSuccessMsg(`✓ Đã khôi phục tài khoản học sinh ${st.name} thành công!`);
        if (onRefreshStudents) onRefreshStudents();
      } else {
        alert(data.message || 'Không thể khôi phục tài khoản.');
      }
    } catch (e) {
      alert('Đã xảy ra lỗi khi khôi phục tài khoản.');
    }
  };

  // Action: Open Family Management Modal
  const handleOpenFamilyLink = (st: Student) => {
    playPop(settings.soundEnabled);
    setFamilyLinkStudent(st);
    setFamilyConnectionCode(st.parentCode || `PH${st.id.replace(/[^0-9]/g, '')}`);
    setIsAddingCaregiver(false);
    setEditingCaregiverId(null);
    setFamilyCaregiverName('');
    setFamilyCaregiverPhone('');
    setFamilyCaregiverRelation('Bố / Mẹ');
    setFamilyCaregiverEmail('');
    setFamilyActionMsg('');
    setCopiedInviteCode(null);
  };

  // Action: Save Primary Family Connection Code
  const handleSavePrimaryCode = async () => {
    if (!familyLinkStudent || !familyConnectionCode.trim()) return;
    try {
      const res = await fetch('/api/teacher/students/family-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: familyLinkStudent.id,
          parentCode: familyConnectionCode.trim().toUpperCase()
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setLocalStudents(prev => prev.map(s => s.id === familyLinkStudent.id ? data.student : s));
        setFamilyLinkStudent(data.student);
        setFamilyActionMsg('✓ Đã cập nhật mã kết nối gia đình chính!');
        setTimeout(() => setFamilyActionMsg(''), 3000);
      }
    } catch (e) {
      alert('Không thể cập nhật mã kết nối gia đình.');
    }
  };

  // Action: Add New Caregiver to Student
  const handleAddNewCaregiver = async () => {
    if (!familyLinkStudent || !familyCaregiverName.trim()) return;
    try {
      const res = await fetch('/api/teacher/students/caregivers/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: familyLinkStudent.id,
          name: familyCaregiverName.trim(),
          relation: familyCaregiverRelation,
          phone: familyCaregiverPhone.trim(),
          email: familyCaregiverEmail.trim(),
          status: 'active'
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setLocalStudents(prev => prev.map(s => s.id === familyLinkStudent.id ? data.student : s));
        setFamilyLinkStudent(data.student);
        setIsAddingCaregiver(false);
        setFamilyCaregiverName('');
        setFamilyCaregiverPhone('');
        setFamilyCaregiverEmail('');
        setFamilyActionMsg(`✓ Đã thêm ${familyCaregiverRelation} (${data.caregiver.name}) thành công!`);
        setTimeout(() => setFamilyActionMsg(''), 3500);
      }
    } catch (e) {
      alert('Không thể thêm người chăm sóc.');
    }
  };

  // Action: Update Existing Caregiver
  const handleUpdateCaregiver = async (cgId: string) => {
    if (!familyLinkStudent || !familyCaregiverName.trim()) return;
    try {
      const res = await fetch('/api/teacher/students/caregivers/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: familyLinkStudent.id,
          caregiverId: cgId,
          name: familyCaregiverName.trim(),
          relation: familyCaregiverRelation,
          phone: familyCaregiverPhone.trim(),
          email: familyCaregiverEmail.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setLocalStudents(prev => prev.map(s => s.id === familyLinkStudent.id ? data.student : s));
        setFamilyLinkStudent(data.student);
        setEditingCaregiverId(null);
        setFamilyActionMsg('✓ Đã cập nhật thông tin phụ huynh thành công!');
        setTimeout(() => setFamilyActionMsg(''), 3000);
      }
    } catch (e) {
      alert('Không thể cập nhật thông tin phụ huynh.');
    }
  };

  // Action: Toggle Caregiver Access (Active / Locked)
  const handleToggleCaregiver = async (cgId: string, currentStatus: string) => {
    if (!familyLinkStudent) return;
    playPop(settings.soundEnabled);
    const nextStatus = currentStatus === 'locked' ? 'active' : 'locked';
    try {
      const res = await fetch('/api/teacher/students/caregivers/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: familyLinkStudent.id,
          caregiverId: cgId,
          status: nextStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setLocalStudents(prev => prev.map(s => s.id === familyLinkStudent.id ? data.student : s));
        setFamilyLinkStudent(data.student);
      }
    } catch (e) {
      alert('Không thể thay đổi trạng thái phụ huynh.');
    }
  };

  // Action: Delete Caregiver
  const handleDeleteCaregiver = async (cgId: string, cgName: string) => {
    if (!familyLinkStudent) return;
    if (!confirm(`Cô có chắc chắn muốn xóa liên kết của phụ huynh "${cgName}"?`)) return;
    playPop(settings.soundEnabled);
    try {
      const res = await fetch('/api/teacher/students/caregivers/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: familyLinkStudent.id,
          caregiverId: cgId
        })
      });
      const data = await res.json();
      if (data.success) {
        setLocalStudents(prev => prev.map(s => s.id === familyLinkStudent.id ? data.student : s));
        setFamilyLinkStudent(data.student);
        setFamilyActionMsg('✓ Đã xóa người chăm sóc.');
        setTimeout(() => setFamilyActionMsg(''), 3000);
      }
    } catch (e) {
      alert('Không thể xóa người chăm sóc.');
    }
  };

  // Action: Generate Safe Family Invite Code (7-day validity)
  const handleGenerateInviteCode = async () => {
    if (!familyLinkStudent) return;
    setIsGeneratingInvite(true);
    try {
      const res = await fetch('/api/teacher/students/invite-codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: familyLinkStudent.id })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setLocalStudents(prev => prev.map(s => s.id === familyLinkStudent.id ? data.student : s));
        setFamilyLinkStudent(data.student);
        setFamilyActionMsg(`✓ Đã tạo mã mời mới: ${data.inviteCode.code}`);
        handleCopyInviteMessage(data.inviteCode.code, data.invitationMessage);
      }
    } catch (e) {
      alert('Không thể tạo mã mời vào lúc này.');
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  // Action: Revoke Invite Code
  const handleRevokeInviteCode = async (code: string) => {
    if (!familyLinkStudent) return;
    playPop(settings.soundEnabled);
    try {
      const res = await fetch('/api/teacher/students/invite-codes/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: familyLinkStudent.id, code })
      });
      const data = await res.json();
      if (data.success) {
        setLocalStudents(prev => prev.map(s => s.id === familyLinkStudent.id ? data.student : s));
        setFamilyLinkStudent(data.student);
      }
    } catch (e) {
      alert('Không thể thu hồi mã mời.');
    }
  };

  // Action: Copy Invite Text
  const handleCopyInviteMessage = (code: string, customMsg?: string) => {
    const text = customMsg || `Kính gửi Quý Phụ huynh em ${familyLinkStudent?.name},\nCô Nguyễn Thị Hải Duyên gửi mã mời kết nối ứng dụng "Vườn Chữ Nở Hoa" để theo dõi các bài viết và nhận xét của con: ${code} (Hạn dùng 7 ngày). Quý phụ huynh đăng nhập tại Góc Gia Đình nhé!`;
    navigator.clipboard?.writeText(text);
    setCopiedInviteCode(code);
    setTimeout(() => setCopiedInviteCode(null), 3000);
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
          {(() => {
            const totalNonDeleted = localStudents.filter(s => s.accountStatus !== 'deleted').length;
            const activeStudents = localStudents.filter(s => s.accountStatus !== 'deleted' && s.accountStatus !== 'locked').length;
            const lockedStudents = localStudents.filter(s => s.accountStatus === 'locked').length;
            const deletedStudents = localStudents.filter(s => s.accountStatus === 'deleted').length;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-3xl border-2 border-emerald-200 shadow-xs">
                  <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
                    Sĩ số lớp em
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 font-display">
                    {totalNonDeleted} / {localStudents.length}
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
                    {activeStudents} em
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
                    {lockedStudents} em
                  </div>
                  <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
                    Có thể mở lại bất cứ lúc nào
                  </p>
                </div>

                <div className="bg-white p-4 rounded-3xl border-2 border-amber-200 shadow-xs">
                  <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
                    Đã xóa lưu trữ
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-1 font-display">
                    {deletedStudents} em
                  </div>
                  <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                    Bài viết vẫn bảo lưu an toàn
                  </p>
                </div>
              </div>
            );
          })()}

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

              <div className="flex items-center gap-1 flex-wrap">
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
                  Đang hoạt động ({localStudents.filter(s => s.accountStatus !== 'deleted' && s.accountStatus !== 'locked').length})
                </button>
                <button
                  onClick={() => setAccountFilter('locked')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    accountFilter === 'locked' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  Tạm khóa ({localStudents.filter(s => s.accountStatus === 'locked').length})
                </button>
                <button
                  onClick={() => setAccountFilter('deleted')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    accountFilter === 'deleted' ? 'bg-stone-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Đã xóa ({localStudents.filter(s => s.accountStatus === 'deleted').length})
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
                  {accountStudentsList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-stone-400 font-medium">
                        Không tìm thấy học sinh nào trong mục này.
                      </td>
                    </tr>
                  ) : (
                    accountStudentsList.map((st, idx) => {
                      const isDeleted = st.accountStatus === 'deleted';
                      const isLocked = st.accountStatus === 'locked';
                      const caregiver = st.linkedCaregivers?.[0];

                      return (
                        <tr key={st.id} className={`hover:bg-emerald-50/20 transition-colors ${isDeleted ? 'bg-stone-50/60 opacity-80' : ''}`}>
                          <td className="py-3 px-3 text-center font-bold text-stone-400">
                            {idx + 1}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-sm">
                                {st.avatar}
                              </span>
                              <div>
                                <span className={`font-extrabold block ${isDeleted ? 'line-through text-stone-500' : 'text-stone-900'}`}>
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
                            {isDeleted ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-300">
                                <Trash2 className="w-3 h-3 text-stone-400" />
                                <span>Đã xóa</span>
                              </span>
                            ) : isLocked ? (
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
                              {isDeleted ? (
                                <button
                                  onClick={() => handleRestoreStudent(st)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                                  title="Khôi phục tài khoản học sinh này"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Khôi phục</span>
                                </button>
                              ) : (
                                <>
                                  {/* Sửa thông tin (Họ tên, username, lớp học...) */}
                                  <button
                                    onClick={() => handleOpenEdit(st)}
                                    className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-bold text-xs flex items-center gap-1 transition-colors"
                                    title="Sửa họ tên, tên đăng nhập, đổi lớp mà không xóa lịch sử"
                                  >
                                    <Edit3 className="w-3 h-3 text-stone-600" />
                                    <span>Sửa</span>
                                  </button>

                                  {/* Cấp lại mật khẩu */}
                                  <button
                                    onClick={() => handleOpenResetPassword(st)}
                                    className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1 transition-colors"
                                    title="Cấp lại mật khẩu an toàn và in phiếu"
                                  >
                                    <Key className="w-3 h-3 text-amber-700" />
                                    <span>Cấp lại MK</span>
                                  </button>

                                  {/* Khóa / Mở khóa */}
                                  <button
                                    onClick={() => handleToggleLock(st)}
                                    className={`px-2 py-1 rounded-xl font-bold text-xs border flex items-center gap-1 transition-colors ${
                                      isLocked
                                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                        : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                                    }`}
                                    title={isLocked ? 'Mở lại tài khoản' : 'Tạm khóa tài khoản'}
                                  >
                                    {isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                    <span>{isLocked ? 'Mở khóa' : 'Khóa'}</span>
                                  </button>

                                  {/* Xóa tài khoản */}
                                  <button
                                    onClick={() => handleOpenDelete(st)}
                                    className="px-2 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 transition-colors"
                                    title="Xóa mềm tài khoản học sinh (bài viết được giữ nguyên an toàn)"
                                  >
                                    <Trash2 className="w-3 h-3 text-rose-600" />
                                    <span>Xóa</span>
                                  </button>

                                  {/* Quản lý gia đình */}
                                  <button
                                    onClick={() => handleOpenFamilyLink(st)}
                                    className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 font-extrabold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                                    title="Quản lý kết nối phụ huynh (Bố, Mẹ, Người giám hộ) & mã mời"
                                  >
                                    <span>👨‍👩‍👧</span>
                                    <span>Gia đình ({st.linkedCaregivers?.length || 1})</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1A: CẤP LẠI MẬT KHẨU (TỰ ĐỘNG HOẶC TỰ ĐẶT) ================= */}
      {promptResetStudent && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-amber-400 max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in relative">
            <button
              onClick={() => setPromptResetStudent(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-amber-100 pb-3">
              <span className="text-2xl">🔑</span>
              <div>
                <h3 className="text-lg font-black text-amber-950 font-display">
                  Cấp Lại Mật Khẩu Cho Học Sinh
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Em: <strong className="text-stone-900">{promptResetStudent.name}</strong> ({promptResetStudent.id})
                </p>
              </div>
            </div>

            {/* Error Message */}
            {resetErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{resetErrorMsg}</span>
              </div>
            )}

            {/* Choice: Auto vs Manual */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 block">
                Cô muốn chọn hình thức cấp mật khẩu nào?
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResetMode('auto')}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                    resetMode === 'auto'
                      ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-200'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className="block text-sm mb-0.5">🎲 Tự động sinh</span>
                  <span className="text-[11px] font-normal text-stone-500">Mật khẩu an toàn, dễ nhớ (vd: HoaNho#8261)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResetMode('manual')}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                    resetMode === 'manual'
                      ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-200'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className="block text-sm mb-0.5">✍️ Cô tự đặt mật khẩu</span>
                  <span className="text-[11px] font-normal text-stone-500">Nhập mật khẩu riêng theo quy ước của lớp</span>
                </button>
              </div>

              {resetMode === 'manual' && (
                <div className="space-y-2.5 pt-1 animate-fade-in">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Mật khẩu mới:
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswordText ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu mới (ít nhất 4 ký tự)..."
                        value={customPasswordInput}
                        onChange={e => setCustomPasswordInput(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 rounded-xl border border-stone-200 font-mono text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordText(!showPasswordText)}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                        title={showPasswordText ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Xác nhận lại mật khẩu:
                    </label>
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu mới..."
                      value={confirmPasswordInput}
                      onChange={e => setConfirmPasswordInput(e.target.value)}
                      className="w-full p-2 rounded-xl border border-stone-200 font-mono text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <p className="text-[11px] text-stone-500 bg-amber-50/60 p-2 rounded-xl border border-amber-200">
                💡 Sau khi bấm xác nhận, hệ thống sẽ lưu mật khẩu mới và xuất phiếu bàn giao có đầy đủ thông tin để cô gửi phụ huynh hoặc in ấn.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setPromptResetStudent(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmResetPassword}
                disabled={isResetting}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <Key className="w-4 h-4" />
                <span>{isResetting ? 'Đang cấp lại...' : 'Xác nhận cấp lại'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1B: PHIẾU BÀN GIAO MẬT KHẨU AN TOÀN ================= */}
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
                  Mật khẩu mới (Hiển thị cho cô bàn giao)
                </span>
                <span className="text-2xl font-black font-mono text-amber-900 tracking-wider">
                  {resetModalData.newPassword}
                </span>
                {resetModalData.pin && (
                  <p className="text-[11px] text-stone-500">
                    (Hoặc mã PIN 4 số đăng nhập nhanh: <strong>{resetModalData.pin}</strong>)
                  </p>
                )}
              </div>

              <div className="text-xs text-stone-600 space-y-1 pt-1">
                <p>• Tên đăng nhập: <strong>{resetModalData.student.id}</strong> hoặc <strong>{resetModalData.student.username || resetModalData.student.id.toLowerCase()}</strong></p>
                <p>• Lớp: <strong>{resetModalData.student.className || TEACHER_CONFIG.className}</strong></p>
                <p>• Giáo viên chủ nhiệm: <strong>{TEACHER_CONFIG.name}</strong></p>
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

      {/* ================= MODAL 2: CHỈNH SỬA TÀI KHOẢN HỌC SINH ================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-emerald-400 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-emerald-950 font-display">
                CHỈNH SỬA TÀI KHOẢN HỌC SINH
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Cập nhật thông tin tài khoản cho em • Giữ nguyên toàn bộ lịch sử học tập
              </p>
            </div>

            {/* Error banner */}
            {editErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editErrorMsg}</span>
              </div>
            )}

            <div className="space-y-3.5">
              {/* Họ và tên thật */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Họ và tên học sinh: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Ví dụ: Phạm Tuệ An"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Tên gọi / Demo name */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Tên gọi thân mật của học sinh:
                </label>
                <input
                  type="text"
                  value={editDemoName}
                  onChange={e => setEditDemoName(e.target.value)}
                  placeholder="Ví dụ: Tuệ An hoặc Bé An"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Mã học sinh (Readonly) & Tên đăng nhập (Editable!) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Mã học sinh (Cố định):
                  </label>
                  <input
                    type="text"
                    value={editingStudent.id}
                    disabled
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-mono font-bold text-xs sm:text-sm bg-stone-100 text-stone-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-stone-400 block mt-0.5">Theo mã số bộ GD</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Tên đăng nhập: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value.toLowerCase())}
                    placeholder="Ví dụ: hs001 hoặc tuean"
                    className="w-full p-2.5 rounded-xl border border-stone-200 font-mono font-bold text-xs sm:text-sm text-emerald-950 focus:border-emerald-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-stone-400 block mt-0.5">Dùng để đăng nhập</span>
                </div>
              </div>

              {/* Lớp học (Editable with quick pills) */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Lớp học & Đơn vị trường: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editClassName}
                  onChange={e => setEditClassName(e.target.value)}
                  placeholder="Ví dụ: Lớp 3 – Trường TH Lê Đức Thọ"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-hidden mb-1.5"
                />
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-stone-400 self-center">Gợi ý nhanh:</span>
                  {[
                    'Lớp 3 – Trường TH Lê Đức Thọ',
                    'Lớp 3A – Trường TH Lê Đức Thọ',
                    'Lớp 3B – Trường TH Lê Đức Thọ',
                    'Lớp 3C – Trường TH Lê Đức Thọ'
                  ].map(cls => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setEditClassName(cls)}
                      className="px-2 py-0.5 bg-stone-100 hover:bg-emerald-50 text-[11px] font-semibold text-stone-700 rounded-md border border-stone-200 transition-colors"
                    >
                      {cls.split(' – ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trạng thái tài khoản */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Trạng thái tài khoản:
                </label>
                <select
                  value={editAccountStatus}
                  onChange={e => setEditAccountStatus(e.target.value as 'active' | 'locked')}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="active">🟢 Đang hoạt động (Được đăng nhập)</option>
                  <option value="locked">🔴 Tạm khóa (Tạm ngừng quyền đăng nhập)</option>
                </select>
              </div>

              {/* Biểu tượng mầm hoa (Avatar) */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Biểu tượng mầm hoa (Avatar):
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['🌸', '🌻', '🌷', '🌼', '🌺', '🌱', '🦋', '🐝', '🍀', '🌿', '🌾', '🌲'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
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
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs disabled:opacity-50"
              >
                {isSavingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: XÁC NHẬN XÓA TÀI KHOẢN HỌC SINH ================= */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-rose-400 max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in relative">
            <button
              onClick={() => setDeletingStudent(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-2xl text-rose-600 shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-rose-950 font-display">
                  Xác Nhận Xóa Tài Khoản Học Sinh
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Quy trình xóa mềm an toàn của trường
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-xs text-rose-950">
              <p>
                Cô có chắc chắn muốn xóa tài khoản của học sinh <strong>{deletingStudent.name}</strong> ({deletingStudent.id})?
              </p>
              <p className="text-stone-600">
                • Sau khi xóa, tài khoản sẽ được chuyển vào mục <strong>"Đã xóa"</strong> và học sinh không thể đăng nhập.
              </p>
              <p className="text-stone-600 font-semibold text-emerald-800">
                • <strong>LƯU Ý QUAN TRỌNG:</strong> Toàn bộ bài viết, lời nhận xét và lịch sử học tập của em vẫn được lưu giữ an toàn, cô có thể khôi phục lại bất cứ lúc nào!
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeletingStudent}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs disabled:opacity-50"
              >
                {isDeletingStudent ? 'Đang xóa...' : 'Xác nhận xóa tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: QUẢN LÝ GIA ĐÌNH ĐA PHỤ HUYNH & MÃ MỜI ================= */}
      {familyLinkStudent && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-purple-400 max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-fade-in relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setFamilyLinkStudent(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-purple-100 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-2xl shadow-xs">
                {familyLinkStudent.avatar || '🌸'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                    Quản Lý Gia Đình
                  </span>
                  <span className="text-xs text-stone-500 font-mono font-bold">
                    {familyLinkStudent.id}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-purple-950 font-display">
                  Hồ Sơ Gia Đình Em {familyLinkStudent.name}
                </h3>
              </div>
            </div>

            {/* Action Feedback Banner */}
            {familyActionMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{familyActionMsg}</span>
              </div>
            )}

            {/* Primary Family Code Configuration */}
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-purple-900 block">
                  Mã kết nối gia đình chính (Cố định):
                </span>
                <span className="text-[11px] text-stone-500">
                  Dùng để phụ huynh đăng nhập nhanh tại Góc Gia Đình
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={familyConnectionCode}
                  onChange={e => setFamilyConnectionCode(e.target.value.toUpperCase())}
                  className="w-28 px-3 py-1.5 rounded-xl border border-purple-300 font-mono font-black text-xs text-center text-purple-900 uppercase bg-white focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleSavePrimaryCode}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs"
                >
                  Lưu mã
                </button>
              </div>
            </div>

            {/* SECTION A: DANH SÁCH PHỤ HUYNH / NGƯỜI CHĂM SÓC */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                    <span>👨‍👩‍👧</span>
                    <span>Tài khoản người thân & phụ huynh ({familyLinkStudent.linkedCaregivers?.length || 0})</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Mỗi học sinh có thể liên kết nhiều phụ huynh (Bố, Mẹ, Ông, Bà, Người giám hộ)
                  </p>
                </div>
                {!isAddingCaregiver && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCaregiver(true);
                      setEditingCaregiverId(null);
                      setFamilyCaregiverName('');
                      setFamilyCaregiverPhone('');
                      setFamilyCaregiverEmail('');
                      setFamilyCaregiverRelation('Bố');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm người thân</span>
                  </button>
                )}
              </div>

              {/* Add New Caregiver Form */}
              {isAddingCaregiver && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border-2 border-emerald-300 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5">
                    <span className="text-xs font-bold text-emerald-900">
                      Thêm người thân / người chăm sóc mới
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingCaregiver(false)}
                      className="text-stone-400 hover:text-stone-700 text-xs"
                    >
                      ✕ Hủy
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Mối quan hệ:
                      </label>
                      <select
                        value={familyCaregiverRelation}
                        onChange={e => setFamilyCaregiverRelation(e.target.value)}
                        className="w-full p-2 rounded-xl border border-stone-200 text-xs bg-white"
                      >
                        <option value="Bố">Bố</option>
                        <option value="Mẹ">Mẹ</option>
                        <option value="Bố / Mẹ">Bố / Mẹ</option>
                        <option value="Ông">Ông</option>
                        <option value="Bà">Bà</option>
                        <option value="Người giám hộ">Người giám hộ</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Họ và tên: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Nguyễn Văn Hải"
                        value={familyCaregiverName}
                        onChange={e => setFamilyCaregiverName(e.target.value)}
                        className="w-full p-2 rounded-xl border border-stone-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Số điện thoại (để đăng nhập):
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: 0912345678"
                        value={familyCaregiverPhone}
                        onChange={e => setFamilyCaregiverPhone(e.target.value)}
                        className="w-full p-2 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        Email (tùy chọn):
                      </label>
                      <input
                        type="email"
                        placeholder="Ví dụ: phuhuynh@gmail.com"
                        value={familyCaregiverEmail}
                        onChange={e => setFamilyCaregiverEmail(e.target.value)}
                        className="w-full p-2 rounded-xl border border-stone-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingCaregiver(false)}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleAddNewCaregiver}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                    >
                      Lưu người chăm sóc
                    </button>
                  </div>
                </div>
              )}

              {/* Caregivers List */}
              <div className="space-y-2">
                {(!familyLinkStudent.linkedCaregivers || familyLinkStudent.linkedCaregivers.length === 0) ? (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-400">
                    Chưa có phụ huynh nào được liên kết riêng.
                  </div>
                ) : (
                  familyLinkStudent.linkedCaregivers.map((cg, idx) => {
                    const isLocked = cg.status === 'locked';
                    const isEditingThis = editingCaregiverId === cg.id;

                    if (isEditingThis) {
                      return (
                        <div key={cg.id || idx} className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2.5 animate-fade-in">
                          <span className="text-xs font-bold text-amber-900 block">
                            Chỉnh sửa thông tin: {cg.name}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-stone-600 block">Quan hệ:</label>
                              <select
                                value={familyCaregiverRelation}
                                onChange={e => setFamilyCaregiverRelation(e.target.value)}
                                className="w-full p-1.5 rounded-lg border text-xs bg-white"
                              >
                                <option value="Bố">Bố</option>
                                <option value="Mẹ">Mẹ</option>
                                <option value="Bố / Mẹ">Bố / Mẹ</option>
                                <option value="Ông">Ông</option>
                                <option value="Bà">Bà</option>
                                <option value="Người giám hộ">Người giám hộ</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-stone-600 block">Họ tên:</label>
                              <input
                                type="text"
                                value={familyCaregiverName}
                                onChange={e => setFamilyCaregiverName(e.target.value)}
                                className="w-full p-1.5 rounded-lg border text-xs bg-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-stone-600 block">SĐT:</label>
                              <input
                                type="text"
                                value={familyCaregiverPhone}
                                onChange={e => setFamilyCaregiverPhone(e.target.value)}
                                className="w-full p-1.5 rounded-lg border text-xs bg-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-stone-600 block">Email:</label>
                              <input
                                type="email"
                                value={familyCaregiverEmail}
                                onChange={e => setFamilyCaregiverEmail(e.target.value)}
                                className="w-full p-1.5 rounded-lg border text-xs bg-white"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingCaregiverId(null)}
                              className="px-3 py-1 rounded-lg bg-stone-100 text-stone-600 text-xs font-bold"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateCaregiver(cg.id || '')}
                              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold"
                            >
                              Lưu thay đổi
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={cg.id || idx}
                        className={`p-3 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
                          isLocked 
                            ? 'bg-stone-50 border-stone-200 opacity-75' 
                            : 'bg-white border-purple-100 hover:border-purple-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-xs">
                            {cg.relation.charAt(0)}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs sm:text-sm text-stone-900">
                                {cg.name}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                                {cg.relation}
                              </span>
                              {isLocked ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                  Tạm dừng
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  Đang hoạt động
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500 flex items-center gap-3 mt-0.5">
                              {cg.phone && <span>📞 SĐT: <strong className="text-stone-700 font-mono">{cg.phone}</strong></span>}
                              {cg.email && <span>✉️ {cg.email}</span>}
                              {cg.linkedAt && <span>🗓️ {cg.linkedAt}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Actions per caregiver */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCaregiverId(cg.id || String(idx));
                              setFamilyCaregiverName(cg.name);
                              setFamilyCaregiverRelation(cg.relation);
                              setFamilyCaregiverPhone(cg.phone || '');
                              setFamilyCaregiverEmail(cg.email || '');
                            }}
                            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit3 className="w-3 h-3 inline mr-1" />
                            Sửa
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleCaregiver(cg.id || '', cg.status)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                              isLocked
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                            title={isLocked ? 'Cho phép phụ huynh đăng nhập lại' : 'Tạm dừng quyền đăng nhập'}
                          >
                            {isLocked ? 'Mở khóa' : 'Khóa'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCaregiver(cg.id || '', cg.name)}
                            className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Xóa liên kết"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* SECTION B: MÃ MỜI KẾT NỐI GIA ĐÌNH AN TOÀN (INVITE CODES) */}
            <div className="pt-2 border-t border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                    <span>🎟️</span>
                    <span>Mã mời kết nối gia đình an toàn (Hạn dùng 7 ngày)</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Cô có thể tạo mã mời ngẫu nhiên gửi phụ huynh qua Zalo/tin nhắn mà không sợ lộ mật khẩu cố định
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateInviteCode}
                  disabled={isGeneratingInvite}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{isGeneratingInvite ? 'Đang tạo...' : 'Tạo mã mời mới'}</span>
                </button>
              </div>

              {/* List of active invite codes */}
              {familyLinkStudent.inviteCodes && familyLinkStudent.inviteCodes.length > 0 ? (
                <div className="space-y-2">
                  {familyLinkStudent.inviteCodes.map((inv, idx) => {
                    const isExpired = new Date(inv.expiresAt) <= new Date();
                    const isRevoked = inv.status === 'revoked';
                    const isActive = inv.status === 'active' && !isExpired;

                    return (
                      <div
                        key={inv.code || idx}
                        className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300'
                            : 'bg-stone-50 border-stone-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-purple-950 bg-white px-2.5 py-1 rounded-xl border border-purple-200">
                            {inv.code}
                          </span>
                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-900'
                                : isRevoked
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}>
                              {isActive ? '🟢 Còn hiệu lực' : isRevoked ? 'Đã thu hồi' : 'Hết hạn'}
                            </span>
                            <span className="text-[11px] text-stone-500 block mt-0.5">
                              Hết hạn: {new Date(inv.expiresAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleCopyInviteMessage(inv.code)}
                                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-2xs flex items-center gap-1"
                              >
                                {copiedInviteCode === inv.code ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Đã chép!</span>
                                  </>
                                ) : (
                                  <>
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span>Chép tin nhắn Zalo</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRevokeInviteCode(inv.code)}
                                className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-bold"
                                title="Thu hồi mã mời này ngay"
                              >
                                Thu hồi
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-purple-50/50 rounded-2xl border border-dashed border-purple-200 text-center text-xs text-stone-500">
                  Chưa có mã mời tạm thời nào. Bấm nút <strong>"Tạo mã mời mới"</strong> ở trên để tạo mã an toàn gửi cho phụ huynh.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setFamilyLinkStudent(null)}
                className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Đóng lại
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
