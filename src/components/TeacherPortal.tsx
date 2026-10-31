import { firebaseAuth } from '../lib/firebase';
import React, { useState, useEffect } from 'react';
import { Student, Submission, AppSettings, LinkedCaregiver, AuthUser, Classroom, ClassAssignment, DifficultyLevel, PromptAnalysisData, WritingSkillId } from '../types';
import { TOPIC_GROUPS } from '../utils/promptAnalyzerEngine';
import { WRITING_SKILLS_META, getLevelFromScore } from '../utils/writingSkillsRubric';
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
  Plus,
  Layers,
  Calendar,
  User,
  Shield,
  TrendingUp
} from 'lucide-react';
import { StudentSkillProgressTab } from './StudentSkillProgressTab';

interface TeacherPortalProps {
  currentUser?: AuthUser | null;
  students: Student[];
  settings: AppSettings;
  onBackToGarden: () => void;
  onRefreshStudents?: () => void;
  onGoToAdminSystem?: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  currentUser,
  students,
  settings,
  onBackToGarden,
  onRefreshStudents,
  onGoToAdminSystem
}) => {
  // Dynamic Teacher Identity & RBAC Configuration
  const teacherName = currentUser?.teacherName || currentUser?.teacherProfile?.name || 'Giáo viên';
  const teacherRole = currentUser?.teacherRole || 'TEACHER';
  const isSuperAdmin = teacherRole === 'SUPER_ADMIN';
  const teacherId = currentUser?.teacherId || 'GV001';
  const teacherSalutation: 'thầy' | 'cô' = 
    currentUser?.teacherProfile?.salutation === 'thầy' || teacherName.toLowerCase().includes('thầy') || teacherId === 'GV002' 
      ? 'thầy' 
      : 'cô';
  const teacherSalutationCap = teacherSalutation === 'thầy' ? 'Thầy' : 'Cô';
  const teacherEmoji = teacherSalutation === 'thầy' ? '👨‍🏫' : '👩‍🏫';
  const teacherSchool = currentUser?.teacherProfile?.school || 'Trường Tiểu học Lê Đức Thọ';
  const teacherAssignedClassIds: string[] = isSuperAdmin
    ? []
    : (currentUser?.assignedClassIds && currentUser.assignedClassIds.length > 0
        ? currentUser.assignedClassIds
        : (teacherId === 'GV002' ? ['L4B'] : ['L3A']));

  // Navigation tabs within Teacher Portal
  const [activeTab, setActiveTab] = useState<'reviews' | 'accounts' | 'classes' | 'assignments' | 'profile'>('reviews');

  // Multi-Class Management State
  const [assignedClasses, setAssignedClasses] = useState<Classroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    return isSuperAdmin ? 'all' : (teacherAssignedClassIds[0] || 'L4B');
  });
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<number>(3);
  const [newClassYear, setNewClassYear] = useState('2025-2026');
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [classActionMsg, setClassActionMsg] = useState('');

  // Assignments Management State
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignGrade, setNewAssignGrade] = useState<number>(3);
  const [newAssignGenre, setNewAssignGenre] = useState<string>('Tả đồ vật');
  const [newAssignPrompt, setNewAssignPrompt] = useState('');
  const [newAssignIsExam, setNewAssignIsExam] = useState(false);
  const [newAssignDueDate, setNewAssignDueDate] = useState('');
  const [newAssignTopicCode, setNewAssignTopicCode] = useState<string>('CD06');
  const [newAssignDifficulty, setNewAssignDifficulty] = useState<DifficultyLevel>('co_ban');
  const [aiPreviewData, setAiPreviewData] = useState<PromptAnalysisData | null>(null);
  const [isAiPreviewLoading, setIsAiPreviewLoading] = useState<boolean>(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [assignmentActionMsg, setAssignmentActionMsg] = useState('');

  // Teacher Profile & Password Change State
  const [teacherProfilePhone, setTeacherProfilePhone] = useState(currentUser?.teacherProfile?.phone || '');
  const [teacherProfileEmail, setTeacherProfileEmail] = useState(currentUser?.teacherProfile?.email || '');
  const [teacherOldPassword, setTeacherOldPassword] = useState('');
  const [teacherNewPassword, setTeacherNewPassword] = useState('');
  const [teacherProfileMsg, setTeacherProfileMsg] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Review section state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentRightTab, setStudentRightTab] = useState<'submissions' | 'progress'>('submissions');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'reviewed' | 'draft'>('all');
  const [filterVolume, setFilterVolume] = useState<'all' | '1' | '2'>('all');
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Teacher feedback form state
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

  // Dual Assessment Mode: Regular practice vs Periodic test with 1-10 integer score
  const [isPeriodicExamReview, setIsPeriodicExamReview] = useState(false);
  const [examScore, setExamScore] = useState<number | ''>('');
  const [editableCorrections, setEditableCorrections] = useState<any[]>([]);

  // 7 Writing Skills Rubric State (GDPT 2018)
  const [skillScores, setSkillScores] = useState<Record<string, number>>({
    hieu_de: 90,
    tim_y: 85,
    sap_xep_y: 85,
    dien_dat: 85,
    chinh_ta_dau_cau: 90,
    cam_xuc_sang_tao: 90,
    tu_chinh_sua: 80
  });
  const [requestRevision, setRequestRevision] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [viewJourneySub, setViewJourneySub] = useState<Submission | null>(null);

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

  const fetch: typeof globalThis.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (!url.startsWith('/api/admin/') && !url.startsWith('/api/teacher/')) return globalThis.fetch(input, init);
    let token: string | undefined = undefined;
    try {
      token = await firebaseAuth?.currentUser?.getIdToken();
    } catch {
      // ignore
    }
    if (!token && currentUser?.token) {
      token = currentUser.token;
    }
    const headers = new Headers(init?.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (currentUser?.teacherId) {
      headers.set('x-teacher-id', currentUser.teacherId);
    }
    return globalThis.fetch(input, { ...init, headers });
  };
  // Fetch classes assigned to this teacher
  const fetchClasses = async () => {
    try {
      const token = currentUser?.token || (isSuperAdmin ? 'admin' : undefined);
      const res = await fetch(`/api/teacher/classes?teacherId=${teacherId}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-teacher-id': teacherId
        }
      });
      const data = await res.json();
      if (data.classes && Array.isArray(data.classes)) {
        setAssignedClasses(data.classes);
      }
    } catch (e) {
      console.warn('Error fetching classes:', e);
    }
  };

  // Fetch class assignments
  const fetchAssignments = async () => {
    try {
      const token = currentUser?.token || (isSuperAdmin ? 'admin' : undefined);
      const res = await fetch(`/api/teacher/assignments?classId=${selectedClassId !== 'all' ? selectedClassId : ''}&teacherId=${teacherId}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-teacher-id': teacherId
        }
      });
      const data = await res.json();
      if (data.assignments && Array.isArray(data.assignments)) {
        setAssignments(data.assignments);
      }
    } catch (e) {
      console.warn('Error fetching assignments:', e);
    }
  };

  // Clean transition and state reset when teacher session changes
  useEffect(() => {
    setSelectedStudent(null);
    setSelectedSubmission(null);
    setSuccessMsg('');
    setClassActionMsg('');
    setAssignmentActionMsg('');
    setTeacherProfilePhone(currentUser?.teacherProfile?.phone || '');
    setTeacherProfileEmail(currentUser?.teacherProfile?.email || '');
    if (!isSuperAdmin && teacherAssignedClassIds.length > 0) {
      setSelectedClassId(teacherAssignedClassIds[0]);
    } else {
      setSelectedClassId('all');
    }
    fetchClasses();
    fetchAssignments();
    fetchSubmissions();
  }, [currentUser?.teacherId]);

  useEffect(() => {
    fetchClasses();
    fetchAssignments();
  }, [currentUser, selectedClassId]);

  // Handler: Create Class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setIsCreatingClass(true);
    setClassActionMsg('');
    try {
      const res = await fetch('/api/teacher/classes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClassName.trim(),
          grade: Number(newClassGrade),
          schoolYear: newClassYear.trim() || '2025-2026',
          teacherId: currentUser?.teacherId || 'GV001'
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setClassActionMsg('✓ Đã tạo lớp học mới thành công!');
        setNewClassName('');
        setIsCreateClassOpen(false);
        fetchClasses();
      } else {
        setClassActionMsg(data.message || 'Không thể tạo lớp học.');
      }
    } catch (err) {
      setClassActionMsg('Lỗi kết nối khi tạo lớp học.');
    } finally {
      setIsCreatingClass(false);
    }
  };

  // AI Phân tích & Xem trước sơ đồ & dàn ý cho giáo viên
  const handlePreviewAssignmentWithAi = async () => {
    if (!newAssignPrompt.trim()) return;
    setIsAiPreviewLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-prompt-deep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: newAssignPrompt.trim(),
          grade: Number(newAssignGrade),
          difficultyLevel: newAssignDifficulty
        })
      });
      const data = await res.json();
      setAiPreviewData(data);
      if (data.topicCode) setNewAssignTopicCode(data.topicCode);
    } catch (e) {
      console.error('Error previewing assignment:', e);
    } finally {
      setIsAiPreviewLoading(false);
    }
  };

  // Handler: Create Assignment
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignTitle.trim() || !newAssignPrompt.trim()) return;
    setIsCreatingAssignment(true);
    setAssignmentActionMsg('');
    try {
      const res = await fetch('/api/teacher/assignments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAssignTitle.trim(),
          grade: Number(newAssignGrade),
          genre: newAssignGenre,
          prompt: newAssignPrompt.trim(),
          isExam: newAssignIsExam,
          dueDate: newAssignDueDate || undefined,
          classId: selectedClassId !== 'all' ? selectedClassId : (assignedClasses[0]?.id || (teacherId === 'GV002' ? 'L4B' : 'L3A')),
          teacherId: teacherId,
          teacherName: teacherName,
          difficultyLevel: newAssignDifficulty,
          topicCode: newAssignTopicCode,
          customOutline: aiPreviewData?.outline || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setAssignmentActionMsg('✓ Đã giao bài tập thành công cho học sinh!');
        setNewAssignTitle('');
        setNewAssignPrompt('');
        setNewAssignDueDate('');
        setAiPreviewData(null);
        setIsCreateAssignmentOpen(false);
        fetchAssignments();
      } else {
        setAssignmentActionMsg(data.message || 'Không thể giao bài tập.');
      }
    } catch (err) {
      setAssignmentActionMsg('Lỗi kết nối máy chủ khi giao bài.');
    } finally {
      setIsCreatingAssignment(false);
    }
  };

  // Handler: Update Teacher Profile & Password
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTeacherProfileMsg('');
    try {
      const res = await fetch('/api/teacher/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: currentUser?.teacherId || 'GV001',
          phone: teacherProfilePhone.trim(),
          email: teacherProfileEmail.trim(),
          oldPassword: teacherOldPassword.trim() || undefined,
          newPassword: teacherNewPassword.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setTeacherProfileMsg('✓ Đã cập nhật hồ sơ cá nhân thành công!');
        setTeacherOldPassword('');
        setTeacherNewPassword('');
      } else {
        setTeacherProfileMsg(data.message || 'Không thể cập nhật hồ sơ.');
      }
    } catch (err) {
      setTeacherProfileMsg('Lỗi kết nối khi cập nhật hồ sơ.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Sync students from props
  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  // Fetch submissions from backend
  const fetchSubmissions = async () => {
    setIsLoadingSubmissions(true);
    try {
      const token = currentUser?.token || (isSuperAdmin ? 'admin' : undefined);
      const res = await fetch('/api/submissions', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'x-teacher-id': teacherId
        }
      });
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

  // Students accessible by this teacher based on RBAC
  const accessibleStudents = localStudents.filter(s => {
    if (isSuperAdmin) return true;
    return teacherAssignedClassIds.includes(s.classId || '');
  });

  // Filter students for review view and account list
  const filteredStudents = accessibleStudents.filter(s => {
    if (selectedClassId !== 'all' && s.classId && s.classId !== selectedClassId) {
      return false;
    }
    const displayName = settings.demoPrivacyMode ? s.demoName : s.name;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Submissions accessible by this teacher based on RBAC
  const accessibleSubmissions = submissions.filter(sub => {
    if (isSuperAdmin) return true;
    if (sub.classId && teacherAssignedClassIds.includes(sub.classId)) return true;
    const st = localStudents.find(s => s.id === sub.studentId);
    return st && teacherAssignedClassIds.includes(st.classId || '');
  });

  // Filter submissions
  const filteredSubmissions = accessibleSubmissions.filter(sub => {
    if (selectedClassId !== 'all') {
      const st = localStudents.find(s => s.id === sub.studentId);
      const subClass = sub.classId || st?.classId;
      if (subClass && subClass !== selectedClassId) return false;
    }
    if (selectedStudent && sub.studentId !== selectedStudent.id) return false;
    if (filterStatus === 'submitted') return sub.status === 'submitted';
    if (filterStatus === 'reviewed') return sub.status === 'reviewed' && sub.teacherFeedback?.status === 'published';
    if (filterStatus === 'draft') return sub.teacherFeedback?.status === 'draft';
    if (filterVolume !== 'all' && String(sub.volume) !== filterVolume) return false;
    return true;
  });

  // Class statistics for "Cả lớp mình hôm nay"
  const completedCount = accessibleSubmissions.filter(s => s.status === 'submitted' || s.status === 'reviewed').length;
  const reviewedCount = accessibleSubmissions.filter(s => s.status === 'reviewed' && s.teacherFeedback?.status === 'published').length;
  const pendingCount = accessibleSubmissions.filter(s => s.status === 'submitted').length;
  const independentCount = accessibleSubmissions.filter(s => s.isIndependentTest).length;
  const needingHelpCount = accessibleStudents.filter(s => s.flowersEarned < 6).length;

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
    setExamScore(sub.score !== undefined ? sub.score : (sub.teacherFeedback?.score !== undefined ? sub.teacherFeedback.score : ''));
    setIsPeriodicExamReview(Boolean(sub.isExam || sub.teacherFeedback?.isExamGraded));
    setEditableCorrections(sub.comprehensiveFeedback?.corrections ? JSON.parse(JSON.stringify(sub.comprehensiveFeedback.corrections)) : []);
    
    // Load existing skill evaluations
    if (sub.teacherSkillEvaluations && sub.teacherSkillEvaluations.length > 0) {
      const map: Record<string, number> = {};
      sub.teacherSkillEvaluations.forEach(ev => {
        map[ev.skillId] = ev.score;
      });
      setSkillScores(prev => ({ ...prev, ...map }));
    } else {
      setSkillScores({
        hieu_de: 90,
        tim_y: 85,
        sap_xep_y: 85,
        dien_dat: 85,
        chinh_ta_dau_cau: 90,
        cam_xuc_sang_tao: 90,
        tu_chinh_sua: 80
      });
    }

    setRequestRevision(sub.lifecycleStatus === 'CAN_CHINH_SUA' || !!sub.revisionRequestedByTeacher);
    setRevisionNote(sub.revisionRequestNote || '');
    setSuccessMsg('');
  };

  const handleSaveTeacherFeedback = async (
    targetStatus: 'draft' | 'published',
    isRevisionOverride?: boolean
  ) => {
    if (!selectedSubmission) return;

    setIsSavingFeedback(true);
    playChime(settings.soundEnabled);

    const isRevision = isRevisionOverride !== undefined ? isRevisionOverride : requestRevision;

    // Build the 7 skills evaluation array according to GDPT 2018
    const teacherSkillEvaluations = WRITING_SKILLS_META.map(meta => {
      const score = skillScores[meta.id] ?? 85;
      const { level, label } = getLevelFromScore(score);
      return {
        skillId: meta.id,
        skillName: meta.name,
        score,
        level,
        levelLabel: label,
        evidence: `Được ${teacherName} đánh giá trong bài viết "${selectedSubmission.taskTitle}"`,
        evaluator: 'TEACHER' as const,
        evaluatedAt: new Date().toISOString()
      };
    });

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
          customCorrections: editableCorrections,
          score: isPeriodicExamReview && examScore !== '' ? Math.round(Number(examScore)) : undefined,
          status: targetStatus,
          teacherName: teacherName,
          teacherSkillEvaluations,
          revisionRequestedByTeacher: isRevision,
          revisionRequestNote: isRevision ? (revisionNote || teacherAdvice || `Con xem lại góp ý của ${teacherSalutation} để hoàn thiện bài văn nhé.`) : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          targetStatus === 'draft'
            ? `✓ Đã lưu bản nháp nhận xét. Chỉ ${teacherSalutation} mới thấy nội dung này.`
            : isRevision
              ? '✓ Đã gửi nhận xét và yêu cầu học sinh chỉnh sửa thêm (Trạng thái: Cần chỉnh sửa)!'
              : '✓ Đã công bố nhận xét và đánh giá 7 năng lực viết cho em thành công! Cập nhật ngay vào Hành trình của con.'
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
    setEditClassName(st.className || (st.classId === 'L4B' ? 'Lớp 4B – Trường TH Lê Đức Thọ' : 'Lớp 3 – Trường TH Lê Đức Thọ'));
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
    const text = customMsg || `Kính gửi Quý Phụ huynh em ${familyLinkStudent?.name},\n${teacherName} gửi mã mời kết nối ứng dụng "Vườn Chữ Nở Hoa" để theo dõi các bài viết và nhận xét của con: ${code} (Hạn dùng 7 ngày). Quý phụ huynh đăng nhập tại Góc Gia Đình nhé!`;
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
          className: `${assignedClasses.find(c => c.id === selectedClassId)?.name || 'Lớp học'} – ${teacherSchool}`
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

  // Filtered students for Account Management Table (restricted to teacher's scope)
  const accountStudentsList = accessibleStudents.filter(st => {
    if (selectedClassId !== 'all' && st.classId && st.classId !== selectedClassId) {
      return false;
    }
    const matchSearch = st.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
                        st.id.toLowerCase().includes(accountSearch.toLowerCase()) ||
                        st.parentCode.toLowerCase().includes(accountSearch.toLowerCase());
    if (accountFilter === 'active') return matchSearch && st.accountStatus !== 'locked' && st.accountStatus !== 'deleted';
    if (accountFilter === 'locked') return matchSearch && st.accountStatus === 'locked';
    if (accountFilter === 'deleted') return matchSearch && st.accountStatus === 'deleted';
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
            {teacherEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                {isSuperAdmin ? '👑 Ban Quản Trị / Góc Giáo Viên' : `${teacherEmoji} Góc Giáo Viên`}
              </span>
              <span className="text-xs text-stone-600 font-bold">
                {teacherName} – {teacherSchool}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-display">
              {isSuperAdmin 
                ? 'Không Gian Quản Lý Lớp Học & Đánh Giá Bài Làm' 
                : `${teacherName} – Lớp ${assignedClasses.find(c => c.id === selectedClassId)?.name || assignedClasses[0]?.name || '4B'}`}
            </h2>
          </div>
        </div>

        {/* Right side controls: Class selector & Admin shortcut & Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class selector */}
          {assignedClasses.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-emerald-300">
              <span className="text-xs font-bold text-stone-600">Lớp:</span>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="text-xs font-bold bg-transparent border-0 text-emerald-950 focus:outline-hidden cursor-pointer"
              >
                {isSuperAdmin && (
                  <option value="all">Tất cả lớp ({assignedClasses.length})</option>
                )}
                {assignedClasses.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Khối {c.grade})</option>
                ))}
              </select>
            </div>
          )}

          {/* Super Admin Switcher Button (Chỉ hiển thị khi có quyền SUPER_ADMIN) */}
          {isSuperAdmin && onGoToAdminSystem && (
            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                onGoToAdminSystem();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md transition-all hover:scale-102 cursor-pointer"
              title="Mở Trang Quản Trị Hệ Thống Toàn Trường"
            >
              <span>👑 Quản Trị Hệ Thống</span>
            </button>
          )}

          {/* Tab Switcher Buttons */}
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-2xl border border-emerald-300 shadow-xs flex-wrap">
            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setActiveTab('reviews');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sổ Chấm Bài ({completedCount})</span>
            </button>

            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setActiveTab('assignments');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'assignments'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Giao Bài Tập ({assignments.length})</span>
            </button>

            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setActiveTab('classes');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'classes'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Lớp Của Tôi ({assignedClasses.length})</span>
            </button>

            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setActiveTab('accounts');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'accounts'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Tài Khoản HS ({accessibleStudents.filter(s => s.accountStatus !== 'deleted').length})</span>
            </button>

            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setActiveTab('profile');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Hồ Sơ Của Tôi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hoa Nhỏ Personalized Teacher Greeting */}
      <div className="flex justify-start">
        <HoaNhoMascot
          mood="happy"
          size="sm"
          reducedMotion={settings.reducedMotion}
          message={getTeacherGreeting(
            teacherName,
            pendingCount,
            teacherSalutation,
            assignedClasses.find(c => c.id === selectedClassId)?.name || assignedClasses[0]?.name
          )}
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
                {accessibleStudents.length} học sinh
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                {assignedClasses.find(c => c.id === selectedClassId)?.name || (isSuperAdmin ? 'Toàn trường' : (assignedClasses[0]?.name || 'Lớp phụ trách'))}
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
                {reviewedCount} bài {teacherSalutation} đã nhận xét
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
                Những cây bút cần {teacherSalutation} giúp
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0 w-full">
            {/* Left Column: Students List (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-stone-200 p-4 shadow-xs space-y-3 min-w-0">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="font-extrabold text-xs uppercase tracking-wider text-stone-700">
                  Danh sách {filteredStudents.length} học sinh {assignedClasses.find(c => c.id === selectedClassId)?.name || (isSuperAdmin ? 'toàn trường' : (assignedClasses[0]?.name || ''))}
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
            <div className="lg:col-span-8 min-w-0 w-full space-y-4">
              {/* Header chuyển đổi 2 Tab khi giáo viên chọn 1 học sinh cụ thể */}
              {selectedStudent && (
                <div className="bg-white p-3 sm:p-4 rounded-3xl border-2 border-emerald-300 shadow-xs flex flex-wrap items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
                      {selectedStudent.avatar || '🌸'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm sm:text-base text-stone-900 font-display">
                          {settings.demoPrivacyMode ? selectedStudent.demoName : selectedStudent.name}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {selectedStudent.id}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Khối {selectedStudent.grade || 3}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 font-medium block mt-0.5">
                        {assignedClasses.find(c => c.id === selectedStudent.classId)?.name || 'Lớp học'} • Hồ sơ kỹ năng cá nhân
                      </span>
                    </div>
                  </div>

                  {/* 2 Tab: Bài viết của em & Tiến bộ kỹ năng */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200">
                    <button
                      type="button"
                      onClick={() => {
                        playPop(settings.soundEnabled);
                        setStudentRightTab('submissions');
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        studentRightTab === 'submissions'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Bài viết của em ({submissions.filter(s => s.studentId === selectedStudent.id).length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPop(settings.soundEnabled);
                        setStudentRightTab('progress');
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        studentRightTab === 'progress'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Hành trình tiến bộ</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Nội dung Tab: Nếu chọn "Hành trình tiến bộ" thì render hồ sơ 3 mục */}
              {selectedStudent && studentRightTab === 'progress' ? (
                <StudentSkillProgressTab
                  student={selectedStudent}
                  submissions={submissions.filter(s => s.studentId === selectedStudent.id)}
                  settings={settings}
                  onOpenSubmissionReview={(sub) => {
                    setStudentRightTab('submissions');
                    handleSelectSubmission(sub);
                  }}
                />
              ) : (
                <>
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

              {/* Submissions list - Hiển thị toàn bộ nội dung bài viết không cắt chữ */}
              <div className="space-y-4">
                {filteredSubmissions.map(sub => {
                  const student = localStudents.find(s => s.id === sub.studentId);
                  const isSelected = selectedSubmission?.id === sub.id;
                  const fullContent = sub.finalContent || sub.firstDraft || '';

                  return (
                    <div
                      key={sub.id}
                      className={`p-4 sm:p-5 rounded-3xl border-2 transition-all bg-white space-y-3.5 shadow-xs ${
                        isSelected
                          ? 'border-emerald-500 shadow-md ring-2 ring-emerald-200'
                          : 'border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      {/* DÒNG 1: Biểu tượng học sinh, Họ tên, Mã học sinh, Tên bài viết, Trạng thái */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-stone-100">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-lg shrink-0">
                            {student?.avatar || '🌸'}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-xs sm:text-sm text-stone-900 font-display">
                              {settings.demoPrivacyMode ? student?.demoName : student?.name}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                              {sub.studentId}
                            </span>
                            <span className="text-stone-300 hidden sm:inline">•</span>
                            <h4 className="font-bold text-xs sm:text-sm text-emerald-950 font-display">
                              {sub.taskTitle}
                            </h4>
                          </div>
                        </div>

                        {/* Trạng thái bài viết */}
                        <div className="flex items-center gap-2">
                          {sub.status === 'reviewed' && sub.teacherFeedback?.status === 'published' ? (
                            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                              ✓ Đã công bố nhận xét
                            </span>
                          ) : sub.teacherFeedback?.status === 'draft' ? (
                            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">
                              📝 Bản nháp của cô
                            </span>
                          ) : sub.lifecycleStatus === 'CAN_CHINH_SUA' ? (
                            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs">
                              ⚠️ Cần chỉnh sửa
                            </span>
                          ) : (
                            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                              ⏳ Chờ cô đọc
                            </span>
                          )}
                        </div>
                      </div>

                      {/* DÒNG 2: Toàn bộ nội dung bài viết - Tự động xuống dòng, chiều cao linh hoạt, không cắt chữ */}
                      <div 
                        className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-stone-900 text-sm sm:text-base font-medium leading-relaxed whitespace-pre-wrap break-words select-text"
                        style={{ height: 'auto', maxHeight: 'none', overflow: 'visible' }}
                      >
                        {fullContent || (
                          <span className="text-stone-400 italic">
                            Bài đang trong quá trình thực hiện hoặc chưa có nội dung nháp.
                          </span>
                        )}
                      </div>

                      {/* DÒNG 3: Nút thao tác (Xem hành trình, Chấm & Nhận xét) */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Nút Xem hành trình */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playPop(settings.soundEnabled);
                              setViewJourneySub(sub);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-all cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Xem hành trình 7 bước</span>
                          </button>

                          {/* Nút Mở phiếu chấm / Đóng phiếu chấm */}
                          <button
                            type="button"
                            onClick={() => {
                              playPop(settings.soundEnabled);
                              if (isSelected) {
                                setSelectedSubmission(null);
                              } else {
                                handleSelectSubmission(sub);
                                setTimeout(() => {
                                  const el = document.getElementById(`assessment-form-${sub.id}`);
                                  if (el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                }, 80);
                              }
                            }}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                              isSelected
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 shadow-2xs'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <X className="w-3.5 h-3.5 text-rose-600" />
                                <span>✕ Đóng phiếu chấm</span>
                              </>
                            ) : (
                              <>
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>✏️ Mở phiếu chấm</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Lời dặn / Hoa điểm nếu đã nhận xét */}
                        {sub.teacherFeedback && sub.teacherFeedback.status === 'published' && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                            <span>{sub.teacherFeedback.flowerSticker || '🌸 Bông hoa khen ngợi'}</span>
                          </div>
                        )}
                      </div>

                      {/* ========================================================================= */}
                      {/* DÒNG 4: PHIẾU CHẤM BÀI INLINE TRỰC TIẾP DƯỚI BÀI VĂN                      */}
                      {/* Gồm 5 phần A, B, C, D, E theo đúng chuẩn sư phạm Tiểu học                 */}
                      {/* ========================================================================= */}
                      {isSelected && (
                        <div 
                          id={`assessment-form-${sub.id}`}
                          className="mt-4 pt-4 border-t-2 border-emerald-300 rounded-2xl bg-gradient-to-b from-emerald-50/60 via-white to-teal-50/30 p-4 sm:p-5 border border-emerald-200 shadow-sm space-y-4 animate-fade-in"
                        >
                          {/* =================================================================== */}
                          {/* PHẦN A: THÔNG TIN BÀI VIẾT                                          */}
                          {/* =================================================================== */}
                          <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{teacherEmoji}</span>
                                <div>
                                  <h4 className="font-black text-sm sm:text-base text-emerald-950 font-display">
                                    Phiếu Nhận Xét & Đánh Giá Bài Viết – {teacherName}
                                  </h4>
                                  <p className="text-[11px] text-stone-500 font-semibold">
                                    Đánh giá thường xuyên theo định hướng phát triển năng lực
                                  </p>
                                </div>
                              </div>

                              {/* Chuyển đổi chế độ kiểm tra định kỳ */}
                              <button
                                type="button"
                                onClick={() => {
                                  const next = !isPeriodicExamReview;
                                  setIsPeriodicExamReview(next);
                                  if (!next) setExamScore('');
                                  else if (examScore === '') setExamScore(9);
                                }}
                                className={`px-2.5 py-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                                  isPeriodicExamReview
                                    ? 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-200'
                                    : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                                }`}
                              >
                                {isPeriodicExamReview ? '📝 Kiểm tra định kỳ (Điểm 1-10)' : '🌸 Luyện tập thường xuyên'}
                              </button>
                            </div>

                            {/* Lưới thông tin bài viết */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                                <span className="text-[10px] text-stone-400 font-bold block">Học sinh</span>
                                <span className="font-extrabold text-stone-900">{settings.demoPrivacyMode ? student?.demoName : student?.name}</span>
                              </div>
                              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                                <span className="text-[10px] text-stone-400 font-bold block">Mã học sinh</span>
                                <span className="font-mono font-bold text-stone-700">{sub.studentId}</span>
                              </div>
                              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                                <span className="text-[10px] text-stone-400 font-bold block">Lớp học</span>
                                <span className="font-bold text-stone-800">{student?.className || 'Lớp 3A'}</span>
                              </div>
                              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200 col-span-2 sm:col-span-1 lg:col-span-2">
                                <span className="text-[10px] text-stone-400 font-bold block">Đề bài</span>
                                <span className="font-bold text-emerald-950 truncate block" title={sub.taskTitle}>{sub.taskTitle}</span>
                              </div>
                              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                                <span className="text-[10px] text-stone-400 font-bold block">Thời gian nộp</span>
                                <span className="font-medium text-stone-700 text-[11px]">
                                  {sub.completedAt || sub.lastSavedAt || sub.startedAt
                                    ? new Date(sub.completedAt || sub.lastSavedAt || sub.startedAt!).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
                                    : 'Đã nộp bài'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Điểm số định kỳ (nếu đang ở chế độ kiểm tra định kỳ) */}
                          {isPeriodicExamReview && (
                            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 space-y-2 animate-fade-in">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                                  <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                                  <span>Điểm số định kỳ (Thang điểm 10):</span>
                                </span>
                                <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                                  {examScore !== '' ? `Điểm: ${examScore} / 10` : 'Chưa nhập điểm'}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 items-center pt-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => setExamScore(val)}
                                    className={`w-8 h-8 rounded-xl font-black text-xs transition-all cursor-pointer ${
                                      examScore === val
                                        ? 'bg-amber-500 text-white shadow-md scale-110 ring-2 ring-amber-300'
                                        : 'bg-white hover:bg-amber-100 text-stone-800 border border-amber-200 shadow-2xs'
                                    }`}
                                  >
                                    {val}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* =================================================================== */}
                          {/* PHẦN B: ĐÁNH GIÁ 7 KỸ NĂNG GDPT 2018 (4 MỨC ĐỘ)                     */}
                          {/* =================================================================== */}
                          <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                                <span>📊</span>
                                <span>B. Đánh giá 7 Năng lực viết (Bấm chọn mức độ rèn luyện):</span>
                              </span>
                              <span className="text-[11px] text-stone-500 font-semibold">Cô bấm chọn mức độ phù hợp</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {WRITING_SKILLS_META.map(meta => {
                                const currentScore = skillScores[meta.id] ?? 85;
                                return (
                                  <div key={meta.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                                    <div className="flex justify-between items-center text-xs font-bold text-stone-800">
                                      <span className="flex items-center gap-1">
                                        <span>{meta.icon}</span>
                                        <span>{meta.name}</span>
                                      </span>
                                      <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                        {getLevelFromScore(currentScore).label} ({currentScore}đ)
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
                                      {[
                                        { label: 'Rèn thêm', score: 50 },
                                        { label: 'Tiến bộ', score: 70 },
                                        { label: 'Tốt', score: 85 },
                                        { label: 'Xuất sắc', score: 95 }
                                      ].map(lvl => (
                                        <button
                                          key={lvl.score}
                                          type="button"
                                          onClick={() => setSkillScores(prev => ({ ...prev, [meta.id]: lvl.score }))}
                                          className={`py-1 rounded-lg border text-center transition-all cursor-pointer ${
                                            currentScore === lvl.score
                                              ? 'bg-emerald-600 text-white border-emerald-700 font-extrabold shadow-xs'
                                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                                          }`}
                                        >
                                          {lvl.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* =================================================================== */}
                          {/* PHẦN B2: RÀ SOÁT & CHỈNH SỬA CÁC ĐIỂM CẦN RÈN (AI ĐỀ XUẤT)           */}
                          {/* =================================================================== */}
                          <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                                <span>🔍</span>
                                <span>B2. Rà soát & Chỉnh sửa gợi ý sửa lỗi (Giáo viên toàn quyền điều chỉnh):</span>
                              </span>
                              <span className="text-[11px] text-stone-500 font-semibold">
                                {editableCorrections.length} gợi ý phát hiện
                              </span>
                            </div>

                            {editableCorrections.length === 0 ? (
                              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                                <span>✓</span>
                                <span>Không có lỗi sai nào cần chỉnh sửa. Học sinh viết bài rất chuẩn xác!</span>
                              </div>
                            ) : (
                              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {editableCorrections.map((corr: any, cIdx: number) => (
                                  <div key={cIdx} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                                    <div className="flex justify-between items-center">
                                      <span className="font-extrabold text-stone-800 flex items-center gap-1.5">
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-stone-200 text-stone-700">
                                          {corr.type === 'chinh_ta' ? 'Chính tả' : corr.type === 'dung_tu' ? 'Dùng từ' : corr.type === 'dat_cau' ? 'Đặt câu' : 'Bố cục'}
                                        </span>
                                        <span>"{corr.originalText || 'Trích đoạn'}"</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditableCorrections(prev => prev.filter((_, i) => i !== cIdx));
                                        }}
                                        className="text-[10px] text-rose-600 hover:text-rose-800 font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200 cursor-pointer"
                                        title="Bỏ qua gợi ý này nếu thấy không cần thiết"
                                      >
                                        ✕ Bỏ qua
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-bold text-emerald-800 shrink-0">Gợi ý sửa:</span>
                                      <input
                                        type="text"
                                        value={corr.suggestion || ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setEditableCorrections(prev => prev.map((item, i) => i === cIdx ? { ...item, suggestion: val } : item));
                                        }}
                                        className="w-full px-2 py-1 text-xs rounded-lg border border-stone-300 bg-white font-medium focus:border-emerald-500 focus:outline-hidden"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* =================================================================== */}
                          {/* PHẦN C: NHẬN XÉT CỦA GIÁO VIÊN (4 Ô NHẬP)                          */}
                          {/* =================================================================== */}
                          <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-3">
                            <span className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                              <span>✍️</span>
                              <span>C. Lời nhận xét định tính của {teacherSalutation} giáo (Tự do nhập & chỉnh sửa):</span>
                            </span>

                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-bold text-rose-900 block mb-1">
                                  🌸 1. Khen ngợi điểm nổi bật của bài viết:
                                </label>
                                <input
                                  type="text"
                                  value={praiseIdea}
                                  onChange={e => setPraiseIdea(e.target.value)}
                                  placeholder="Ví dụ: Ý tưởng gắn kết tình cảm gia đình rất gần gũi, nét quan sát chân thật..."
                                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-rose-200 focus:border-rose-400 focus:outline-hidden bg-rose-50/30 font-medium"
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
                                  placeholder="Ví dụ: Em dùng từ ngữ gợi cảm rất tốt, chú ý thêm dấu chấm ngắt câu rõ ý..."
                                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-emerald-200 focus:border-emerald-400 focus:outline-hidden bg-emerald-50/30 font-medium"
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
                                  placeholder="Ví dụ: Cảm xúc chân thành và nụ cười rạng rỡ của con làm bài văn bừng sáng..."
                                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-amber-200 focus:border-amber-400 focus:outline-hidden bg-amber-50/30 font-medium"
                                />
                              </div>

                              <div>
                                <label className="text-xs font-bold text-purple-900 block mb-1">
                                  💌 4. Lời dặn dò của {teacherSalutation} dành cho học sinh:
                                </label>
                                <textarea
                                  rows={2}
                                  value={teacherAdvice}
                                  onChange={e => setTeacherAdvice(e.target.value)}
                                  placeholder="Ví dụ: Con hãy bổ sung thêm 1 hình ảnh so sánh và kiểm tra lại chữ viết hoa nhé!"
                                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-purple-200 focus:border-purple-400 focus:outline-hidden bg-purple-50/30 font-medium"
                                />
                              </div>
                            </div>
                          </div>

                          {/* =================================================================== */}
                          {/* PHẦN D: YÊU CẦU CHỈNH SỬA                                            */}
                          {/* =================================================================== */}
                          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={requestRevision}
                                onChange={e => setRequestRevision(e.target.checked)}
                                className="w-4 h-4 text-amber-600 rounded-md focus:ring-amber-400 cursor-pointer"
                              />
                              <span className="text-xs font-black text-amber-950">
                                ⚠️ Yêu cầu học sinh chỉnh sửa và hoàn thiện thêm (Chuyển trạng thái sang "Cần chỉnh sửa")
                              </span>
                            </label>
                            {requestRevision && (
                              <input
                                type="text"
                                value={revisionNote}
                                onChange={e => setRevisionNote(e.target.value)}
                                placeholder="Ghi chú điểm con cần chỉnh sửa (ví dụ: Bổ sung câu kết đoạn và sửa 2 lỗi chính tả)..."
                                className="w-full p-2.5 text-xs rounded-xl border border-amber-300 bg-white font-medium"
                              />
                            )}
                          </div>

                          {/* Thông báo kết quả thao tác */}
                          {successMsg && (
                            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs sm:text-sm font-bold text-emerald-900 animate-pulse flex items-center gap-2">
                              <span>✓</span>
                              <span>{successMsg}</span>
                            </div>
                          )}

                          {/* =================================================================== */}
                          {/* LỊCH SỬ THAY ĐỔI NHẬN XÉT (NẾU ĐÃ CHỈNH SỬA SAU CÔNG BỐ)           */}
                          {/* =================================================================== */}
                          {sub.feedbackHistory && sub.feedbackHistory.length > 0 && (
                            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-black text-stone-800">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                <span>Lịch sử thay đổi nhận xét ({sub.feedbackHistory.length} lần chỉnh sửa sau công bố):</span>
                              </div>
                              <div className="space-y-1.5 pl-2 max-h-36 overflow-y-auto">
                                {sub.feedbackHistory.map((hist, hIdx) => (
                                  <div key={hIdx} className="text-[11px] p-2 bg-white rounded-xl border border-stone-200 space-y-0.5">
                                    <div className="flex justify-between items-center text-stone-500 font-medium">
                                      <span>{new Date(hist.editedAt).toLocaleString('vi-VN')}</span>
                                      <span className="font-bold text-stone-700">{hist.editedBy}</span>
                                    </div>
                                    {hist.previousComment && (
                                      <p className="text-stone-700 italic">
                                        Nội dung trước đó: "{hist.previousComment}"
                                      </p>
                                    )}
                                    {hist.previousScore !== undefined && (
                                      <p className="text-amber-700 font-bold">
                                        Điểm số trước đó: {hist.previousScore}/10
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* =================================================================== */}
                          {/* PHẦN E: CÁC NÚT CHỨC NĂNG CUỐI PHIẾU CHẤM                           */}
                          {/* =================================================================== */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-200 bg-white p-3.5 rounded-2xl border">
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

                            <div className="flex flex-wrap items-center gap-2">
                              {/* 1. Nút Lưu bản nháp nhận xét */}
                              <button
                                type="button"
                                onClick={() => handleSaveTeacherFeedback('draft', false)}
                                disabled={isSavingFeedback}
                                className="px-3.5 py-2 rounded-xl border-2 border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                                title="Lưu lại bản nháp, học sinh và phụ huynh chưa nhìn thấy"
                              >
                                💾 Lưu bản nháp nhận xét
                              </button>

                              {/* 2. Nút Gửi nhận xét cho học sinh (hoặc yêu cầu chỉnh sửa) */}
                              <button
                                type="button"
                                onClick={() => handleSaveTeacherFeedback('published', requestRevision)}
                                disabled={isSavingFeedback}
                                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                                  requestRevision
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white border border-amber-600'
                                    : 'bg-teal-600 hover:bg-teal-700 text-white border border-teal-700'
                                }`}
                                title={requestRevision ? 'Chuyển bài sang trạng thái Cần chỉnh sửa để con viết tiếp' : 'Gửi nhận xét góp ý cho học sinh'}
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{requestRevision ? 'Gửi yêu cầu chỉnh sửa' : 'Gửi nhận xét cho học sinh'}</span>
                              </button>

                              {/* 3. Nút Công bố nhận xét (Hoàn thành bài & cập nhật biểu đồ tiến bộ) */}
                              <button
                                type="button"
                                onClick={() => handleSaveTeacherFeedback('published', false)}
                                disabled={isSavingFeedback}
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                                title="Công bố nhận xét chính thức và cập nhật điểm vào Hành trình của con"
                              >
                                <span>🌟 Công bố nhận xét</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredSubmissions.length === 0 && (
                  <div className="p-8 text-center text-stone-400 bg-white rounded-3xl border-2 border-dashed border-stone-200">
                    Không có bài viết nào phù hợp với bộ lọc hiện tại.
                  </div>
                )}
              </div>
            </>
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
            const totalNonDeleted = accessibleStudents.filter(s => s.accountStatus !== 'deleted').length;
            const activeStudents = accessibleStudents.filter(s => s.accountStatus !== 'deleted' && s.accountStatus !== 'locked').length;
            const lockedStudents = accessibleStudents.filter(s => s.accountStatus === 'locked').length;
            const deletedStudents = accessibleStudents.filter(s => s.accountStatus === 'deleted').length;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-3xl border-2 border-emerald-200 shadow-xs">
                  <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wide">
                    Sĩ số lớp em
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 font-display">
                    {totalNonDeleted} / {accessibleStudents.length}
                  </div>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    {assignedClasses.find(c => c.id === selectedClassId)?.name || (isSuperAdmin ? 'Toàn trường' : (assignedClasses[0]?.name || 'Lớp phụ trách'))} • {teacherSchool}
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
                  Tất cả ({accessibleStudents.length})
                </button>
                <button
                  onClick={() => setAccountFilter('active')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    accountFilter === 'active' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Đang hoạt động ({accessibleStudents.filter(s => s.accountStatus !== 'deleted' && s.accountStatus !== 'locked').length})
                </button>
                <button
                  onClick={() => setAccountFilter('locked')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    accountFilter === 'locked' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  Tạm khóa ({accessibleStudents.filter(s => s.accountStatus === 'locked').length})
                </button>
                <button
                  onClick={() => setAccountFilter('deleted')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    accountFilter === 'deleted' ? 'bg-stone-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Đã xóa ({accessibleStudents.filter(s => s.accountStatus === 'deleted').length})
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

          {/* Accounts Table & Responsive Mobile Cards */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 overflow-hidden shadow-xs">
            {/* Desktop & Tablet Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
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

            {/* Mobile Card List (< md) */}
            <div className="block md:hidden divide-y divide-stone-100 p-2 sm:p-3">
              {accountStudentsList.length === 0 ? (
                <div className="py-8 text-center text-stone-400 font-medium text-xs">
                  Không tìm thấy học sinh nào trong mục này.
                </div>
              ) : (
                accountStudentsList.map((st, idx) => {
                  const isDeleted = st.accountStatus === 'deleted';
                  const isLocked = st.accountStatus === 'locked';
                  const caregiver = st.linkedCaregivers?.[0];

                  return (
                    <div key={st.id} className={`p-4 rounded-2xl mb-3 border border-stone-200/80 bg-white shadow-2xs space-y-3 ${isDeleted ? 'bg-stone-50/70 opacity-80' : ''}`}>
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-lg shrink-0">
                            {st.avatar}
                          </span>
                          <div className="min-w-0">
                            <span className={`font-black text-sm block truncate ${isDeleted ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                              {idx + 1}. {st.name}
                            </span>
                            <span className="text-[11px] text-stone-400 block truncate">
                              {st.demoName} • {st.className || 'Lớp 3 – TH Lê Đức Thọ'}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
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
                              <span>Hoạt động</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Detail Info Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Mã học sinh:</span>
                          <span className="font-mono font-bold text-emerald-900">{st.id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Tên đăng nhập:</span>
                          <span className="font-mono font-semibold text-stone-700">{st.username || st.id.toLowerCase()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Mã kết nối PH:</span>
                          <span className="font-mono font-bold text-purple-900 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 inline-block">
                            {st.parentCode}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Lần đăng nhập:</span>
                          <span className="text-stone-600 truncate block">{st.lastLogin || 'Chưa đăng nhập'}</span>
                        </div>
                      </div>

                      {/* Mobile Action Buttons (Min 38-40px touch targets) */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100">
                        {isDeleted ? (
                          <button
                            onClick={() => handleRestoreStudent(st)}
                            className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <RotateCcw className="w-4 h-4 text-emerald-600" />
                            <span>Khôi phục tài khoản</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenEdit(st)}
                              className="flex-1 min-h-[38px] px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                              <span>Sửa</span>
                            </button>

                            <button
                              onClick={() => handleOpenResetPassword(st)}
                              className="flex-1 min-h-[38px] px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <Key className="w-3.5 h-3.5 text-amber-700" />
                              <span>Cấp MK</span>
                            </button>

                            <button
                              onClick={() => handleToggleLock(st)}
                              className={`flex-1 min-h-[38px] px-2.5 py-1.5 rounded-xl font-bold text-xs border flex items-center justify-center gap-1 transition-colors ${
                                isLocked
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                              }`}
                            >
                              {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                              <span>{isLocked ? 'Mở' : 'Khóa'}</span>
                            </button>

                            <button
                              onClick={() => handleOpenDelete(st)}
                              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Xóa</span>
                            </button>

                            <button
                              onClick={() => handleOpenFamilyLink(st)}
                              className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                            >
                              <span>👨‍👩‍👧</span>
                              <span>Quản lý phụ huynh & mã kết nối ({st.linkedCaregivers?.length || 1})</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: GIAO BÀI TẬP ================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-5 rounded-3xl border-2 border-emerald-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-emerald-950 font-display flex items-center gap-2">
                <span>📝</span>
                <span>Danh Sách Đề Bài & Nhiệm Vụ Đã Giao</span>
              </h3>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                Giao bài tập luyện tập thường xuyên hoặc bài kiểm tra định kỳ theo Chương trình GDPT 2018 (Khối 1–5).
              </p>
            </div>

            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setIsCreateAssignmentOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Giao bài tập mới</span>
            </button>
          </div>

          {assignmentActionMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs sm:text-sm font-bold text-emerald-900 animate-fade-in">
              {assignmentActionMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl border-2 border-stone-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Khối {item.grade}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      item.isExam 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-sky-100 text-sky-800 border border-sky-200'
                    }`}>
                      {item.isExam ? '⭐ Kiểm tra định kỳ (Thang điểm 10)' : '🌸 Luyện tập thường xuyên'}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-stone-900 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-stone-600 line-clamp-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100 italic">
                    "{item.prompt}"
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span>Thể loại: <strong className="text-stone-700">{item.genre}</strong></span>
                  {item.dueDate && <span>Hạn: <strong className="text-rose-600">{new Date(item.dueDate).toLocaleDateString('vi-VN')}</strong></span>}
                </div>
              </div>
            ))}

            {assignments.length === 0 && (
              <div className="col-span-full bg-white p-8 rounded-3xl border-2 border-dashed border-stone-200 text-center text-stone-500">
                Chưa có bài tập nào được giao. Cô hãy bấm nút "Giao bài tập mới" ở góc trên để tạo đề bài nhé!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: LỚP HỌC CỦA TÔI ================= */}
      {activeTab === 'classes' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-5 rounded-3xl border-2 border-emerald-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-emerald-950 font-display flex items-center gap-2">
                <span>🏫</span>
                <span>Các Lớp Học Được Phân Công Quản Lý</span>
              </h3>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                Giáo viên chỉ quản lý học sinh và dữ liệu thuộc các lớp được phân công ({currentUser?.teacherRole === 'SUPER_ADMIN' ? 'Ban Quản Trị Hệ Thống' : 'Theo phân quyền'}).
              </p>
            </div>

            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setIsCreateClassOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo lớp học mới</span>
            </button>
          </div>

          {classActionMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs sm:text-sm font-bold text-emerald-900 animate-fade-in">
              {classActionMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedClasses.map((cls) => {
              const classStudents = localStudents.filter(s => s.classId === cls.id || (!s.classId && cls.id === 'L3A'));
              return (
                <div
                  key={cls.id}
                  className={`bg-white p-5 rounded-3xl border-2 transition-all shadow-xs ${
                    selectedClassId === cls.id ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Khối {cls.grade}
                    </span>
                    <span className="text-xs text-stone-500 font-bold font-mono">
                      Mã: {cls.id}
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-emerald-950 mt-2 font-display">
                    {cls.name}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    Năm học: {cls.schoolYear} • Trường Tiểu học Lê Đức Thọ
                  </p>

                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 my-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-600">Sĩ số học sinh:</span>
                    <span className="font-black text-emerald-700 text-sm">
                      {classStudents.length} em
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setSelectedClassId(cls.id);
                        setActiveTab('accounts');
                      }}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Xem học sinh</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClassId(cls.id);
                        setActiveTab('reviews');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                    >
                      Xem bài nộp
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 5: HỒ SƠ CỦA TÔI & ĐỔI MẬT KHẨU ================= */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-lg space-y-5">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center text-3xl shadow-xs">
                {teacherEmoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-emerald-950 font-display">
                    {teacherName}
                  </h3>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isSuperAdmin 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {isSuperAdmin ? '👑 SUPER_ADMIN' : `${teacherEmoji} GIÁO VIÊN`}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Mã GV: <strong className="text-stone-800">{teacherId}</strong> • Tên đăng nhập: <strong className="text-stone-800">{currentUser?.teacherProfile?.username || (teacherId === 'GV002' ? 'vanminh' : 'haiduyen')}</strong>
                </p>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Lớp phụ trách: <strong className="text-stone-800">{assignedClasses.map(c => c.name).join(', ') || 'Chưa phân công'}</strong> • Trường: <strong className="text-stone-800">{teacherSchool}</strong>
                </p>
              </div>
            </div>

            {teacherProfileMsg && (
              <div className={`p-3 rounded-2xl text-xs sm:text-sm font-bold ${
                teacherProfileMsg.startsWith('✓') ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {teacherProfileMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Số điện thoại liên hệ:
                  </label>
                  <input
                    type="text"
                    value={teacherProfilePhone}
                    onChange={e => setTeacherProfilePhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Email trao đổi:
                  </label>
                  <input
                    type="email"
                    value={teacherProfileEmail}
                    onChange={e => setTeacherProfileEmail(e.target.value)}
                    placeholder="giaovien@leductho.edu.vn"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-3">
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider block">
                  Đổi Mật Khẩu Đăng Nhập
                </span>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Mật khẩu hiện tại (để xác nhận):
                  </label>
                  <input
                    type="password"
                    value={teacherOldPassword}
                    onChange={e => setTeacherOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Mật khẩu mới (ít nhất 4 ký tự):
                  </label>
                  <input
                    type="password"
                    value={teacherNewPassword}
                    onChange={e => setTeacherNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-102 cursor-pointer"
                >
                  {isSavingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi Hồ Sơ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TẠO LỚP HỌC MỚI ================= */}
      {isCreateClassOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-emerald-400 max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in relative">
            <button
              onClick={() => setIsCreateClassOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-emerald-950 font-display flex items-center gap-2">
              <span>🏫</span>
              <span>Tạo Lớp Học Mới</span>
            </h3>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Tên lớp học (ví dụ: Lớp 3C, Lớp 5A...):
                </label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="Lớp 3C"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Khối lớp tiểu học (1–5 theo GDPT 2018):
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setNewClassGrade(g)}
                      className={`p-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        newClassGrade === g 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Năm học:
                </label>
                <input
                  type="text"
                  value={newClassYear}
                  onChange={e => setNewClassYear(e.target.value)}
                  placeholder="2025-2026"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateClassOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCreatingClass}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  {isCreatingClass ? 'Đang tạo...' : 'Tạo lớp học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: GIAO BÀI TẬP MỚI ================= */}
      {isCreateAssignmentOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-emerald-400 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateAssignmentOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-emerald-950 font-display flex items-center gap-2">
              <span>📝</span>
              <span>Giao Bài Tập Tiếng Việt Mới</span>
            </h3>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Tiêu đề bài tập:
                </label>
                <input
                  type="text"
                  required
                  value={newAssignTitle}
                  onChange={e => setNewAssignTitle(e.target.value)}
                  placeholder="Ví dụ: Tả chiếc bút mực thân yêu của em"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Khối lớp (1–5):
                  </label>
                  <select
                    value={newAssignGrade}
                    onChange={e => setNewAssignGrade(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white"
                  >
                    {[1, 2, 3, 4, 5].map(g => (
                      <option key={g} value={g}>Lớp {g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Mức độ thử thách:
                  </label>
                  <select
                    value={newAssignDifficulty}
                    onChange={e => setNewAssignDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white"
                  >
                    <option value="co_ban">🌱 Cơ bản (Chuẩn SGK)</option>
                    <option value="mo_rong">🌿 Mở rộng (Quan sát phong phú)</option>
                    <option value="nang_cao">⭐ Nâng cao (Từ ngữ gợi cảm & nghệ thuật)</option>
                    <option value="sang_tao">✨ Sáng tạo (Tư duy mới lạ, bứt phá)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Chủ đề (25 nhóm chủ đề GDPT 2018):
                  </label>
                  <select
                    value={newAssignTopicCode}
                    onChange={e => setNewAssignTopicCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white font-medium"
                  >
                    {TOPIC_GROUPS.map(t => (
                      <option key={t.code} value={t.code}>
                        {t.code}: {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Thể loại bài viết:
                  </label>
                  <select
                    value={newAssignGenre}
                    onChange={e => setNewAssignGenre(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white"
                  >
                    <option value="Tả đồ vật">Tả đồ vật</option>
                    <option value="Tả con vật">Tả con vật</option>
                    <option value="Tả cây cối">Tả cây cối</option>
                    <option value="Tả người">Tả người</option>
                    <option value="Tả cảnh vật">Tả cảnh vật</option>
                    <option value="Kể chuyện">Kể chuyện</option>
                    <option value="Thuật lại sự việc">Thuật lại sự việc</option>
                    <option value="Cảm nghĩ">Bày tỏ cảm xúc</option>
                    <option value="Nêu ý kiến">Nêu ý kiến</option>
                    <option value="Viết thư">Viết thư thăm hỏi / chia sẻ</option>
                    <option value="Lời nhắn">Viết lời nhắn / tin nhắn</option>
                    <option value="Thông báo">Viết thông báo</option>
                    <option value="Báo cáo">Viết báo cáo / kế hoạch</option>
                    <option value="Sáng tạo">Tưởng tượng / Sáng tạo</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    Đề bài & Yêu cầu chi tiết:
                  </label>
                  <button
                    type="button"
                    onClick={handlePreviewAssignmentWithAi}
                    disabled={isAiPreviewLoading || !newAssignPrompt.trim()}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAiPreviewLoading ? 'animate-spin text-purple-600' : ''}`} />
                    <span>{isAiPreviewLoading ? 'Đang phân tích...' : '🔍 Xem trước sơ đồ & dàn ý AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={newAssignPrompt}
                  onChange={e => {
                    setNewAssignPrompt(e.target.value);
                    setAiPreviewData(null);
                  }}
                  placeholder="Viết một đoạn văn từ 5 đến 7 câu tả một đồ dùng học tập gắn bó với em hàng ngày..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* AI PREVIEW CARD FOR TEACHER */}
              {aiPreviewData && (
                <div className="p-3.5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl space-y-2.5 text-xs animate-fade-in">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                    <span className="font-extrabold text-purple-950 flex items-center gap-1.5">
                      <span>🌸</span>
                      <span>Kết quả phân tích đề bài & Bản đồ ý tưởng</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] border border-emerald-300 flex items-center gap-1">
                      <span>✓</span>
                      <span>Đạt 20/20 tiêu chuẩn GDPT 2018</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/80 p-2 rounded-xl border border-purple-100">
                      <strong className="text-purple-900 block font-bold">Đối tượng chính:</strong>
                      <span className="text-stone-800">{aiPreviewData.mainObject || aiPreviewData.coreSubject}</span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl border border-purple-100">
                      <strong className="text-purple-900 block font-bold">Chủ đề & Thể loại:</strong>
                      <span className="text-stone-800">{aiPreviewData.topicName} • {aiPreviewData.writingFormat}</span>
                    </div>
                  </div>

                  {aiPreviewData.branches && aiPreviewData.branches.length > 0 && (
                    <div className="bg-white/90 p-2.5 rounded-xl border border-purple-100 space-y-1">
                      <strong className="text-purple-900 block font-bold text-[11px]">
                        5 nhánh gợi mở tư duy:
                      </strong>
                      <div className="flex flex-wrap gap-1.5">
                        {aiPreviewData.branches.map((b, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-semibold text-[10px]">
                            {b.icon} {b.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-purple-900 italic font-medium">
                    "{aiPreviewData.hoaNhoUnderstand}"
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Hạn nộp bài (tùy chọn):
                </label>
                <input
                  type="date"
                  value={newAssignDueDate}
                  onChange={e => setNewAssignDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Mode Selection */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAssignIsExam}
                    onChange={e => setNewAssignIsExam(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-sm"
                  />
                  <span className="text-xs font-black text-stone-800">
                    Đánh dấu đây là bài kiểm tra định kỳ (Có thang điểm số 1–10)
                  </span>
                </label>
                <p className="text-[11px] text-stone-500 pl-6">
                  {newAssignIsExam 
                    ? 'Bài kiểm tra định kỳ cho phép chấm điểm số 1 đến 10 kèm nhận xét chi tiết.' 
                    : 'Bài luyện tập thường xuyên, đánh giá bằng lời nhận xét khích lệ học sinh.'}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateAssignmentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCreatingAssignment}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  {isCreatingAssignment ? 'Đang giao...' : 'Giao bài tập'}
                </button>
              </div>
            </form>
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
                {teacherSchool} • {assignedClasses.find(c => c.id === selectedClassId)?.name || resetModalData.student.className || 'Lớp phụ trách'}
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
                  Mật khẩu mới (Hiển thị cho {teacherSalutation} bàn giao)
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
                <p>• Lớp: <strong>{resetModalData.student.className || assignedClasses.find(c => c.id === selectedClassId)?.name || 'Lớp phụ trách'}</strong></p>
                <p>• Giáo viên phụ trách: <strong>{teacherName}</strong></p>
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

      {/* Modal: Xem Hành Trình 7 Bước Cho Giáo Viên */}
      {viewJourneySub && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-emerald-400 overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-100 to-teal-50 border-b border-emerald-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                  Quá trình thực hiện 7 bước của học sinh
                </span>
                <h3 className="text-lg sm:text-xl font-black text-emerald-950 font-display mt-1">
                  {viewJourneySub.taskTitle}
                </h3>
              </div>
              <button
                onClick={() => setViewJourneySub(null)}
                className="w-9 h-9 rounded-2xl bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center border border-emerald-200 shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: 7 Steps */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              {/* Step 1: Hiểu đề */}
              <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1">
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  1
                </span>
                <h4 className="font-extrabold text-sm text-stone-900">
                  Bước 1: Hiểu đề & Định hướng
                </h4>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                  {viewJourneySub.understandingStage?.selectedDirectionTitle && (
                    <p className="font-bold text-emerald-800">
                      Hướng viết: {viewJourneySub.understandingStage.selectedDirectionTitle}
                    </p>
                  )}
                  {viewJourneySub.understandingStage?.selectedObject && (
                    <p className="font-bold text-emerald-800">
                      Đối tượng đã chọn: {viewJourneySub.understandingStage.selectedObject}
                    </p>
                  )}
                  {viewJourneySub.understandingStage?.promptRequirements?.map((req, rIdx) => (
                    <p key={rIdx} className="text-stone-700">• {req}</p>
                  ))}
                  {viewJourneySub.understandingStage?.studentWishes && (
                    <p className="text-purple-800 font-semibold">
                      Mong muốn của con: {viewJourneySub.understandingStage.studentWishes}
                    </p>
                  )}
                </div>
              </div>

              {/* Step 2: Tìm ý */}
              <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1">
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  2
                </span>
                <h4 className="font-extrabold text-sm text-stone-900">
                  Bước 2: Tìm ý & Trả lời câu hỏi gợi mở
                </h4>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                  {viewJourneySub.ideaFindingStage?.studentAnswers ? (
                    Object.entries(viewJourneySub.ideaFindingStage.studentAnswers).map(([k, ans], aIdx) => (
                      <div key={k} className="space-y-0.5">
                        <span className="font-bold text-stone-600 block">
                          Câu {aIdx + 1}: {viewJourneySub.ideaFindingStage?.questions?.[Number(k)] || 'Câu hỏi gợi mở'}
                        </span>
                        <p className="text-stone-800 font-semibold bg-white p-2 rounded-xl border border-stone-200">
                          {ans}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-500 italic">Dữ liệu trả lời câu hỏi trực tiếp.</p>
                  )}
                </div>
              </div>

              {/* Step 3: Sơ đồ tư duy */}
              <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1">
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  3
                </span>
                <h4 className="font-extrabold text-sm text-stone-900">
                  Bước 3: Sơ đồ tư duy các nhánh ý
                </h4>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
                  {viewJourneySub.mindMapStage?.branches ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {viewJourneySub.mindMapStage.branches.map(b => (
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
                    <p className="text-stone-500 italic">Sơ đồ tư duy đã lưu.</p>
                  )}
                </div>
              </div>

              {/* Step 4: Dàn ý chi tiết */}
              <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1">
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  4
                </span>
                <h4 className="font-extrabold text-sm text-stone-900">
                  Bước 4: Dàn ý chi tiết
                </h4>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                  {(viewJourneySub.developedOutline || viewJourneySub.initialOutline || []).map(item => (
                    <div key={item.id} className="flex gap-2">
                      <span className="font-bold text-emerald-800 shrink-0">{item.section}:</span>
                      <span className="text-stone-800 font-medium">{item.content}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 5: Bài viết & Các bản nháp */}
              <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1">
                <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  5
                </span>
                <h4 className="font-extrabold text-sm text-stone-900">
                  Bước 5: Lịch sử bản nháp ({viewJourneySub.drafts?.length || 1} bản)
                </h4>
                <div className="space-y-2">
                  {viewJourneySub.drafts && viewJourneySub.drafts.length > 0 ? (
                    viewJourneySub.drafts.map(d => (
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
                        {viewJourneySub.finalContent || viewJourneySub.firstDraft}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 6: AI Feedback */}
              {viewJourneySub.aiFeedback && (
                <div className="relative pl-7 border-l-2 border-emerald-300 space-y-1">
                  <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    6
                  </span>
                  <h4 className="font-extrabold text-sm text-stone-900">
                    Bước 6: Gợi ý từ trợ lý AI Hoa Nhỏ
                  </h4>
                  <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-200 text-xs space-y-1">
                    <p className="text-rose-900">
                      <strong>🌸 Bông hoa khen ngợi:</strong> {viewJourneySub.aiFeedback.flowerPraise}
                    </p>
                    <p className="text-emerald-900">
                      <strong>🍃 Chiếc lá nhắc em:</strong> {viewJourneySub.aiFeedback.leafReminder}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
              <span className="text-xs text-stone-500 font-medium">
                Mã bài viết: {viewJourneySub.id}
              </span>
              <button
                onClick={() => setViewJourneySub(null)}
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
