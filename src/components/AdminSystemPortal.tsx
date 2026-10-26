import React, { useState, useEffect } from 'react';
import { 
  TeacherAccount, 
  Classroom, 
  AuditLogItem, 
  AppSettings, 
  Student, 
  Submission 
} from '../types';
import { TEACHER_CONFIG } from '../constants/teacherConfig';
import { playPop, playChime, playSparkle } from '../utils/audio';
import { 
  Users, 
  ShieldCheck, 
  Layers, 
  BarChart3, 
  FileText, 
  Plus, 
  Lock, 
  Unlock, 
  KeyRound, 
  UserX, 
  Edit3, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  GraduationCap, 
  BookOpen, 
  Award, 
  ArrowLeft,
  X,
  RefreshCw,
  Clock,
  Printer
} from 'lucide-react';

import { AuthUser } from '../types';

interface AdminSystemPortalProps {
  settings?: AppSettings;
  adminProfile?: TeacherAccount;
  currentUser?: AuthUser | null;
  onBackToHome: () => void;
  onGoToTeacherClass: () => void;
}

export const AdminSystemPortal: React.FC<AdminSystemPortalProps> = ({
  settings = { soundEnabled: true, reducedMotion: false, demoPrivacyMode: false },
  adminProfile: propAdminProfile,
  currentUser,
  onBackToHome,
  onGoToTeacherClass
}) => {
  const adminProfile: TeacherAccount = propAdminProfile || (currentUser?.teacherProfile as unknown as TeacherAccount) || {
    id: currentUser?.teacherId || 'GV001',
    fullName: currentUser?.teacherName || TEACHER_CONFIG.name,
    username: 'haiduyen',
    role: 'SUPER_ADMIN',
    status: 'active',
    salutation: 'cô',
    school: TEACHER_CONFIG.school,
    assignedClassIds: ['L3A'],
    createdAt: new Date().toISOString()
  };
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'classes' | 'reports' | 'audit'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Real Database state
  const [overviewStats, setOverviewStats] = useState({
    totalTeachers: 0,
    activeTeachers: 0,
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
    pendingReviews: 0,
    reviewedCount: 0
  });

  const [teachers, setTeachers] = useState<TeacherAccount[]>([]);
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Search queries
  const [teacherSearch, setTeacherSearch] = useState('');
  const [classSearch, setClassSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');

  // Modals state
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isEditTeacherOpen, setIsEditTeacherOpen] = useState(false);
  const [isResetPassOpen, setIsResetPassOpen] = useState(false);
  const [isTransferClassOpen, setIsTransferClassOpen] = useState(false);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isClassDetailOpen, setIsClassDetailOpen] = useState(false);

  // Selected entities for modals
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherAccount | null>(null);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);

  // Form states
  const [newTeacherForm, setNewTeacherForm] = useState({
    fullName: '',
    username: '',
    salutation: 'cô' as 'cô' | 'thầy',
    phone: '',
    email: '',
    school: TEACHER_CONFIG.school,
    assignedClassId: ''
  });

  const [newClassForm, setNewClassForm] = useState({
    name: '',
    grade: 3 as 1 | 2 | 3 | 4 | 5,
    school: TEACHER_CONFIG.school,
    schoolYear: '2025-2026',
    primaryTeacherId: ''
  });

  const [resetPassResult, setResetPassResult] = useState<{ teacherName: string; password: string } | null>(null);
  const [transferClassForm, setTransferClassForm] = useState({
    classId: '',
    fromTeacherId: '',
    toTeacherId: '',
    reason: 'Phân công nhiệm vụ năm học mới'
  });

  // Fetch admin data from server
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminProfile.id ? 'tok_' + adminProfile.id : 'tok_GV001'}`,
        'x-teacher-id': adminProfile.id || 'GV001'
      };

      const [resOverview, resTeachers, resClasses, resAudit, resStudents, resSubs] = await Promise.all([
        fetch('/api/admin/overview', { headers }).then(r => r.json()).catch(() => null),
        fetch('/api/admin/teachers', { headers }).then(r => r.json()).catch(() => null),
        fetch('/api/admin/classes', { headers }).then(r => r.json()).catch(() => null),
        fetch('/api/admin/audit-logs', { headers }).then(r => r.json()).catch(() => null),
        fetch('/api/students').then(r => r.json()).catch(() => null),
        fetch('/api/submissions').then(r => r.json()).catch(() => null)
      ]);

      if (resOverview && resOverview.success) {
        setOverviewStats(resOverview.stats);
      }
      if (resTeachers && resTeachers.success) {
        setTeachers(resTeachers.teachers);
      }
      if (resClasses && resClasses.success) {
        setClasses(resClasses.classes);
      }
      if (resAudit && resAudit.success) {
        setAuditLogs(resAudit.auditLogs);
      }
      if (resStudents && resStudents.students) {
        setStudents(resStudents.students);
      }
      if (resSubs && resSubs.submissions) {
        setSubmissions(resSubs.submissions);
      }
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Show temporary message
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // 1. Action: Create Teacher
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.fullName.trim() || !newTeacherForm.username.trim()) {
      showToast('Vui lòng nhập đầy đủ Họ và tên và Tên đăng nhập.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/teachers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer tok_${adminProfile.id}`,
          'x-teacher-id': adminProfile.id
        },
        body: JSON.stringify(newTeacherForm)
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        showToast(`Đã tạo thành công tài khoản giáo viên: ${data.teacher.fullName} (Mã: ${data.teacher.id})`);
        setIsAddTeacherOpen(false);
        setNewTeacherForm({
          fullName: '',
          username: '',
          salutation: 'cô',
          phone: '',
          email: '',
          school: TEACHER_CONFIG.school,
          assignedClassId: ''
        });
        loadAdminData();
      } else {
        showToast(data.message || 'Lỗi khi tạo giáo viên', 'error');
      }
    } catch (err) {
      showToast('Không thể kết nối đến máy chủ.', 'error');
    }
  };

  // 2. Action: Toggle Teacher Status (Lock / Unlock / Deactivate)
  const handleToggleTeacherStatus = async (teacher: TeacherAccount, newStatus: 'active' | 'locked' | 'inactive') => {
    if (teacher.id === adminProfile.id && newStatus !== 'active') {
      showToast('Không thể khóa hoặc ngừng kích hoạt tài khoản Quản trị viên chính.', 'error');
      return;
    }

    // Check if deactivating a teacher with active classes
    if (newStatus === 'inactive' && teacher.assignedClassIds && teacher.assignedClassIds.length > 0) {
      showToast(`Giáo viên ${teacher.name} đang phụ trách ${teacher.assignedClassIds.length} lớp học. Vui lòng chuyển giao các lớp trước khi ngừng kích hoạt.`, 'error');
      return;
    }

    playPop(settings.soundEnabled);
    try {
      const res = await fetch('/api/admin/teachers/toggle-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer tok_${adminProfile.id}`,
          'x-teacher-id': adminProfile.id
        },
        body: JSON.stringify({ id: teacher.id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        playSparkle(settings.soundEnabled);
        showToast(
          newStatus === 'locked' 
            ? `Đã khóa tài khoản giáo viên ${teacher.name}.` 
            : newStatus === 'active' 
            ? `Đã mở khóa tài khoản giáo viên ${teacher.name}.` 
            : `Đã ngừng kích hoạt tài khoản giáo viên ${teacher.name}.`
        );
        loadAdminData();
      } else {
        showToast(data.message || 'Lỗi xử lý.', 'error');
      }
    } catch (e) {
      showToast('Không thể kết nối máy chủ.', 'error');
    }
  };

  // 3. Action: Reset Teacher Password
  const handleResetTeacherPassword = async (teacher: TeacherAccount) => {
    playPop(settings.soundEnabled);
    setSelectedTeacher(teacher);
    const generatedPass = 'GV' + Math.floor(100000 + Math.random() * 900000);

    try {
      const res = await fetch('/api/admin/teachers/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer tok_${adminProfile.id}`,
          'x-teacher-id': adminProfile.id
        },
        body: JSON.stringify({ id: teacher.id, newPassword: generatedPass })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setResetPassResult({
          teacherName: teacher.name,
          password: generatedPass
        });
        setIsResetPassOpen(true);
        loadAdminData();
      } else {
        showToast(data.message || 'Lỗi cấp lại mật khẩu.', 'error');
      }
    } catch (e) {
      showToast('Không thể kết nối máy chủ.', 'error');
    }
  };

  // 4. Action: Create Class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassForm.name.trim()) {
      showToast('Vui lòng nhập tên lớp (ví dụ: Lớp 4A).', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/classes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer tok_${adminProfile.id}`,
          'x-teacher-id': adminProfile.id
        },
        body: JSON.stringify(newClassForm)
      });
      const data = await res.json();
      if (data.success) {
        playSparkle(settings.soundEnabled);
        showToast(`Đã tạo thành công lớp học mới: ${data.classroom.name}`);
        setIsCreateClassOpen(false);
        setNewClassForm({
          name: '',
          grade: 3,
          school: TEACHER_CONFIG.school,
          schoolYear: '2025-2026',
          primaryTeacherId: ''
        });
        loadAdminData();
      } else {
        showToast(data.message || 'Lỗi khi tạo lớp học.', 'error');
      }
    } catch (e) {
      showToast('Không thể kết nối máy chủ.', 'error');
    }
  };

  // 5. Action: Transfer Class from Teacher A to Teacher B
  const handleTransferClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferClassForm.classId || !transferClassForm.toTeacherId) {
      showToast('Vui lòng chọn lớp học và giáo viên tiếp nhận.', 'error');
      return;
    }

    if (transferClassForm.fromTeacherId === transferClassForm.toTeacherId) {
      showToast('Giáo viên tiếp nhận phải khác với giáo viên hiện tại.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/classes/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer tok_${adminProfile.id}`,
          'x-teacher-id': adminProfile.id
        },
        body: JSON.stringify(transferClassForm)
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        showToast(`Chuyển giao lớp ${data.class?.name || 'thành công'} sang giáo viên tiếp nhận! Toàn bộ học sinh và bài làm được bảo toàn.`);
        setIsTransferClassOpen(false);
        loadAdminData();
      } else {
        showToast(data.message || 'Lỗi khi chuyển giao lớp.', 'error');
      }
    } catch (e) {
      showToast('Không thể kết nối máy chủ.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Toast Alert */}
      {message && (
        <div className={`p-4 rounded-2xl shadow-md flex items-center justify-between gap-3 animate-fade-in ${
          message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner: Super Admin Header with Class Switcher */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-purple-800">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-400/40 flex items-center justify-center text-3xl shadow-md">
            👑
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-black text-xs uppercase tracking-wider shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>QUẢN TRỊ VIÊN CHÍNH (SUPER_ADMIN)</span>
              </span>
              <span className="text-xs text-purple-200 font-semibold">
                {TEACHER_CONFIG.school}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight mt-1 flex items-center gap-2">
              <span>{adminProfile.fullName || TEACHER_CONFIG.fullName}</span>
              <span className="text-sm font-normal text-purple-200">({adminProfile.id || 'GV001'})</span>
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 font-medium">
              Hệ thống Quản lý Nhiều Giáo viên & Phân quyền Trường học – Vườn Chữ Nở Hoa
            </p>
          </div>
        </div>

        {/* Quick Actions for Admin */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              playPop(settings.soundEnabled);
              onGoToTeacherClass();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-102 cursor-pointer"
            title="Chuyển sang góc quản lý lớp 3 trực tiếp của cô"
          >
            <GraduationCap className="w-4 h-4 text-emerald-100" />
            <span>👩‍🏫 Lớp học của tôi</span>
          </button>

          <button
            onClick={() => {
              playPop(settings.soundEnabled);
              loadAdminData();
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Làm mới dữ liệu hệ thống"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              playPop(settings.soundEnabled);
              onBackToHome();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Trang chủ</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs for Super Admin */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 sm:p-2.5 rounded-3xl border-2 border-purple-200 shadow-xs">
        <button
          onClick={() => { playPop(settings.soundEnabled); setActiveTab('overview'); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-stone-700 hover:bg-purple-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>1. Tổng quan hệ thống</span>
        </button>

        <button
          onClick={() => { playPop(settings.soundEnabled); setActiveTab('teachers'); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-stone-700 hover:bg-purple-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. Quản lý giáo viên ({teachers.length})</span>
        </button>

        <button
          onClick={() => { playPop(settings.soundEnabled); setActiveTab('classes'); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-stone-700 hover:bg-purple-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Quản lý lớp học ({classes.length})</span>
        </button>

        <button
          onClick={() => { playPop(settings.soundEnabled); setActiveTab('reports'); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-stone-700 hover:bg-purple-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Báo cáo & Đánh giá</span>
        </button>

        <button
          onClick={() => { playPop(settings.soundEnabled); setActiveTab('audit'); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-stone-700 hover:bg-purple-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>5. Nhật ký quản trị ({auditLogs.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: TỔNG QUAN HỆ THỐNG ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stat Cards Grid (Real Data) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-purple-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  Đội ngũ giáo viên
                </span>
                <div className="text-3xl font-black text-purple-950 mt-1 font-display">
                  {overviewStats.totalTeachers || teachers.length}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 pt-3 border-t border-purple-100 mt-3">
                <span>Đang hoạt động:</span>
                <span className="font-extrabold">{overviewStats.activeTeachers || teachers.filter(t => t.status === 'active').length}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-sky-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  Tổng số lớp học
                </span>
                <div className="text-3xl font-black text-sky-950 mt-1 font-display">
                  {overviewStats.totalClasses || classes.length}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-sky-700 pt-3 border-t border-sky-100 mt-3">
                <span>Khối 1 đến Khối 5</span>
                <span className="font-extrabold">GDPT 2018</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  Tổng số học sinh
                </span>
                <div className="text-3xl font-black text-amber-950 mt-1 font-display">
                  {overviewStats.totalStudents || students.length}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-amber-700 pt-3 border-t border-amber-100 mt-3">
                <span>Có liên kết gia đình:</span>
                <span className="font-extrabold">{students.filter(s => s.linkedCaregivers && s.linkedCaregivers.length > 0).length}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-rose-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  Bài viết & Nhận xét
                </span>
                <div className="text-3xl font-black text-rose-950 mt-1 font-display">
                  {overviewStats.totalSubmissions || submissions.length}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-rose-700 pt-3 border-t border-rose-100 mt-3">
                <span>Chờ cô nhận xét:</span>
                <span className="font-extrabold">{overviewStats.pendingReviews || submissions.filter(s => s.status === 'submitted').length}</span>
              </div>
            </div>
          </div>

          {/* Highlights & Security Notice */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 bg-white rounded-3xl border-2 border-purple-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h3 className="font-bold text-base text-purple-950 font-display flex items-center gap-2">
                  <span>🏫</span>
                  <span>Nguyên tắc phân quyền & An toàn trường học</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                  Bảo vệ mức máy chủ
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 leading-relaxed font-medium">
                <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-1">
                  <strong className="text-purple-950 block">🔒 Phân quyền nghiêm ngặt</strong>
                  <p>Mỗi giáo viên chỉ được truy cập học sinh và bài tập thuộc lớp mình phụ trách. Mọi thao tác trái quyền đều bị máy chủ từ chối.</p>
                </div>
                <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-200 space-y-1">
                  <strong className="text-sky-950 block">🔄 Chuyển giao lớp an toàn</strong>
                  <p>Khi đổi giáo viên phụ trách, toàn bộ lịch sử nộp bài, nhận xét và cây hoa tiến bộ của học sinh được bảo toàn nguyên vẹn 100%.</p>
                </div>
                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                  <strong className="text-amber-950 block">📝 Đánh giá kết hợp</strong>
                  <p>Luyện viết thường xuyên nhận xét bằng lời khích lệ; bài kiểm tra định kỳ cho phép chấm điểm theo thang điểm 10 chuẩn mực.</p>
                </div>
                <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-1">
                  <strong className="text-rose-950 block">📜 Nhật ký kiểm toán đầy đủ</strong>
                  <p>Mọi hành động tạo, sửa, khóa, cấp lại mật khẩu và chuyển lớp đều được ghi nhận chi tiết trong Audit Log có thời gian chính xác.</p>
                </div>
              </div>
            </div>

            {/* Admin Profile Box */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 rounded-3xl border-2 border-purple-200 p-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-purple-300 flex items-center justify-center text-2xl shadow-xs">
                  🌸
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-purple-700 tracking-wider">
                    Quản trị viên đang đăng nhập:
                  </span>
                  <h4 className="text-lg font-black text-purple-950 font-display">
                    {adminProfile.fullName || TEACHER_CONFIG.fullName}
                  </h4>
                  <p className="text-xs text-stone-600 font-medium">
                    Tên đăng nhập: <strong>{adminProfile.username || 'haiduyen'}</strong>
                  </p>
                  <p className="text-xs text-stone-600 font-medium">
                    Trường: {adminProfile.school || TEACHER_CONFIG.school}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-200/80">
                <button
                  onClick={onGoToTeacherClass}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-purple-200" />
                  <span>Vào sổ chấm bài lớp 3 của cô</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: QUẢN LÝ GIÁO VIÊN ================= */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl border-2 border-purple-200 p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                placeholder="Tìm theo tên giáo viên, mã số, lớp..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-purple-400"
              />
            </div>

            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                setIsAddTeacherOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm giáo viên mới</span>
            </button>
          </div>

          {/* Teachers Table & Mobile Responsive Cards */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-purple-50/80 text-purple-950 font-extrabold border-b border-purple-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">STT</th>
                  <th className="py-3 px-3">Họ và tên</th>
                  <th className="py-3 px-3">Mã GV</th>
                  <th className="py-3 px-3">Tên đăng nhập</th>
                  <th className="py-3 px-3">Lớp phụ trách</th>
                  <th className="py-3 px-3 text-center">Vai trò</th>
                  <th className="py-3 px-3 text-center">Trạng thái</th>
                  <th className="py-3 px-3">Lần đăng nhập</th>
                  <th className="py-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {teachers
                  .filter(t => {
                    if (!teacherSearch.trim()) return true;
                    const q = teacherSearch.toLowerCase();
                    return t.fullName.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.username.toLowerCase().includes(q);
                  })
                  .map((teacher, idx) => {
                    const isSuper = teacher.role === 'SUPER_ADMIN';

                    return (
                      <tr key={teacher.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-stone-400">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-stone-900 flex items-center gap-1.5">
                            <span>{teacher.salutation === 'thầy' ? '👨‍🏫' : '👩‍🏫'}</span>
                            <span>{teacher.fullName}</span>
                          </div>
                          {teacher.email && <span className="text-[11px] text-stone-500 block">{teacher.email}</span>}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-purple-800">{teacher.id}</td>
                        <td className="py-3 px-3 font-semibold text-stone-700">{teacher.username}</td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {teacher.assignedClassIds && teacher.assignedClassIds.length > 0 ? (
                              teacher.assignedClassIds.map(cId => {
                                const cls = classes.find(c => c.id === cId);
                                return (
                                  <span key={cId} className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[11px] font-bold border border-purple-200">
                                    {cls?.name || cId}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-stone-400 text-xs italic">Chưa phân công</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {isSuper ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] border border-amber-300">
                              👑 SUPER_ADMIN
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[11px] border border-stone-200">
                              TEACHER
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {teacher.status === 'active' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                              Hoạt động
                            </span>
                          ) : teacher.status === 'locked' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                              Đang khóa
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 font-bold text-[11px]">
                              Ngừng K/H
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-xs text-stone-500">{teacher.lastLogin || 'Chưa đăng nhập'}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Reset Password */}
                            <button
                              onClick={() => handleResetTeacherPassword(teacher)}
                              className="p-1.5 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors"
                              title="Cấp lại mật khẩu mới"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>

                            {/* Lock / Unlock */}
                            {!isSuper && (
                              teacher.status === 'locked' ? (
                                <button
                                  onClick={() => handleToggleTeacherStatus(teacher, 'active')}
                                  className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-700 transition-colors"
                                  title="Mở khóa tài khoản"
                                >
                                  <Unlock className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleTeacherStatus(teacher, 'locked')}
                                  className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-700 transition-colors"
                                  title="Khóa tài khoản"
                                >
                                  <Lock className="w-4 h-4" />
                                </button>
                              )
                            )}

                            {/* Deactivate */}
                            {!isSuper && teacher.status !== 'inactive' && (
                              <button
                                onClick={() => handleToggleTeacherStatus(teacher, 'inactive')}
                                className="p-1.5 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors"
                                title="Ngừng kích hoạt tài khoản"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List (< md) */}
          <div className="block md:hidden space-y-3">
            {teachers
              .filter(t => {
                if (!teacherSearch.trim()) return true;
                const q = teacherSearch.toLowerCase();
                return t.fullName.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.username.toLowerCase().includes(q);
              })
              .map((teacher, idx) => {
                const isSuper = teacher.role === 'SUPER_ADMIN';

                return (
                  <div key={teacher.id} className="p-4 rounded-2xl border border-stone-200 bg-white shadow-2xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{teacher.salutation === 'thầy' ? '👨‍🏫' : '👩‍🏫'}</span>
                        <div className="min-w-0">
                          <span className="font-black text-sm block text-stone-900 truncate">
                            {idx + 1}. {teacher.fullName}
                          </span>
                          <span className="text-[11px] text-stone-400 block font-mono">
                            {teacher.id} • {teacher.username}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1">
                        {isSuper ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] border border-amber-300">
                            👑 ADMIN
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px] border border-stone-200">
                            GV
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          teacher.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {teacher.status === 'active' ? 'Hoạt động' : 'Đang khóa'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs bg-stone-50 p-2.5 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 font-medium">Lớp phụ trách:</span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {teacher.assignedClassIds && teacher.assignedClassIds.length > 0 ? (
                            teacher.assignedClassIds.map(cId => {
                              const cls = classes.find(c => c.id === cId);
                              return (
                                <span key={cId} className="px-2 py-0.2 rounded-md bg-purple-100 text-purple-900 text-[10px] font-bold border border-purple-200">
                                  {cls?.name || cId}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-stone-400 text-xs italic">Chưa phân công</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 font-medium">Lần đăng nhập:</span>
                        <span className="text-stone-700 font-semibold">{teacher.lastLogin || 'Chưa đăng nhập'}</span>
                      </div>
                    </div>

                    {/* Mobile Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-100">
                      <button
                        onClick={() => handleResetTeacherPassword(teacher)}
                        className="px-3 py-1.5 min-h-[36px] bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-purple-700" />
                        <span>Cấp lại MK</span>
                      </button>

                      {!isSuper && (
                        teacher.status === 'locked' ? (
                          <button
                            onClick={() => handleToggleTeacherStatus(teacher, 'active')}
                            className="px-3 py-1.5 min-h-[36px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mở khóa</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleTeacherStatus(teacher, 'locked')}
                            className="px-3 py-1.5 min-h-[36px] bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <Lock className="w-3.5 h-3.5 text-rose-600" />
                            <span>Khóa</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: QUẢN LÝ LỚP HỌC ================= */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-3xl border-2 border-purple-200 p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
                placeholder="Tìm theo tên lớp, khối lớp, giáo viên..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-purple-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setIsTransferClassOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4 text-amber-700" />
                <span>Chuyển giao lớp</span>
              </button>

              <button
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setIsCreateClassOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo lớp mới</span>
              </button>
            </div>
          </div>

          {/* Classes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes
              .filter(c => {
                if (!classSearch.trim()) return true;
                const q = classSearch.toLowerCase();
                return c.name.toLowerCase().includes(q) || String(c.grade).includes(q);
              })
              .map(cls => {
                const primaryTeacher = teachers.find(t => t.id === cls.primaryTeacherId);
                const classStudents = students.filter(s => s.className?.includes(cls.name) || s.classId === cls.id);

                return (
                  <div key={cls.id} className="p-5 rounded-3xl border-2 border-stone-200 hover:border-purple-300 hover:shadow-md transition-all bg-white flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-950 font-black text-sm font-display border border-purple-200">
                          {cls.name}
                        </span>
                        <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                          Khối {cls.grade}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-stone-700">
                        <p className="flex items-center gap-1.5">
                          <span className="text-stone-400">🏫</span>
                          <span className="font-semibold">{cls.school}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span className="text-stone-400">👩‍🏫 Giáo viên phụ trách:</span>
                          <strong className="text-purple-950 font-bold">{primaryTeacher?.fullName || 'Chưa phân công'}</strong>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span className="text-stone-400">👥 Sĩ số học sinh:</span>
                          <span className="font-bold text-emerald-700">{classStudents.length} học sinh</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400">Mã lớp: {cls.id}</span>
                      <button
                        onClick={() => {
                          setTransferClassForm({
                            classId: cls.id,
                            fromTeacherId: cls.primaryTeacherId,
                            toTeacherId: '',
                            reason: 'Chuyển giao lớp phân công lại'
                          });
                          setIsTransferClassOpen(true);
                        }}
                        className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                      >
                        <span>Chuyển GV</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: BÁO CÁO & ĐÁNH GIÁ ================= */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border-2 border-purple-200 p-5 sm:p-6 shadow-xs space-y-6 animate-fade-in">
          <div className="border-b border-purple-100 pb-3">
            <h3 className="font-bold text-base text-purple-950 font-display flex items-center gap-2">
              <span>📊</span>
              <span>Báo cáo tiến trình dạy và học toàn trường</span>
            </h3>
            <p className="text-xs text-stone-600 font-medium">
              Thống kê bài viết, chất lượng nhận xét và kết quả kiểm tra định kỳ theo thang điểm 10
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* By Classes */}
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
              <h4 className="font-bold text-sm text-purple-950 flex items-center gap-2">
                <span>🏫</span>
                <span>Hoạt động theo từng lớp</span>
              </h4>
              <div className="space-y-2">
                {classes.map(c => {
                  const cSubs = submissions.filter(s => s.classId === c.id || students.some(st => st.id === s.studentId && st.className?.includes(c.name)));
                  const reviewed = cSubs.filter(s => s.status === 'reviewed');
                  return (
                    <div key={c.id} className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-purple-950 font-bold block">{c.name} (Khối {c.grade})</strong>
                        <span className="text-stone-500">GV: {teachers.find(t => t.id === c.primaryTeacherId)?.name || 'Chưa gán'}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-purple-900 block">{cSubs.length} bài nộp</span>
                        <span className="text-emerald-700 text-[11px] font-semibold">{reviewed.length} bài đã nhận xét</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Teachers */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                <span>👩‍🏫</span>
                <span>Tiến độ nhận xét của giáo viên</span>
              </h4>
              <div className="space-y-2">
                {teachers.map(t => {
                  const tClasses = classes.filter(c => t.assignedClassIds?.includes(c.id));
                  return (
                    <div key={t.id} className="p-3 bg-white rounded-xl border border-amber-100 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-amber-950 font-bold block">{t.fullName}</strong>
                        <span className="text-stone-500">Phụ trách: {tClasses.map(c => c.name).join(', ') || 'Chưa gán lớp'}</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          Hoàn thành tốt
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: NHẬT KÝ QUẢN TRỊ (AUDIT LOG) ================= */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border-2 border-purple-200 p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-purple-950 font-display flex items-center gap-2">
                <span>📜</span>
                <span>Nhật ký thao tác quản trị hệ thống (Audit Logs)</span>
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Ghi nhận trung thực, đầy đủ thời gian và người thực hiện mọi thao tác quản trị
              </p>
            </div>

            <div className="relative w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Lọc nhật ký..."
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-purple-50/80 text-purple-950 font-extrabold border-b border-purple-200">
                <tr>
                  <th className="py-3 px-3 w-36">Thời gian</th>
                  <th className="py-3 px-3">Người thao tác</th>
                  <th className="py-3 px-3">Hành động</th>
                  <th className="py-3 px-3">Đối tượng</th>
                  <th className="py-3 px-3">Nội dung chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {auditLogs
                  .filter(log => {
                    if (!auditSearch.trim()) return true;
                    const q = auditSearch.toLowerCase();
                    return log.action.toLowerCase().includes(q) || log.actorName.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
                  })
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 px-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-purple-950 font-bold block">{log.actorName}</strong>
                        <span className="text-[10px] text-stone-400 font-mono">{log.actorId} ({log.actorRole})</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-xs text-indigo-700">
                        {log.action}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-bold">
                          {log.targetType}: {log.targetId}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-700 leading-relaxed font-normal">
                        {log.details}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: THÊM GIÁO VIÊN MỚI ================= */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-purple-300 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👩‍🏫</span>
                <h3 className="font-extrabold text-base sm:text-lg text-purple-950 font-display">
                  Thêm tài khoản giáo viên mới
                </h3>
              </div>
              <button onClick={() => setIsAddTeacherOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Họ và tên giáo viên: *
                </label>
                <input
                  type="text"
                  required
                  value={newTeacherForm.fullName}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, fullName: e.target.value })}
                  placeholder="Ví dụ: Trần Văn Minh"
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Danh xưng:
                  </label>
                  <select
                    value={newTeacherForm.salutation}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, salutation: e.target.value as 'cô' | 'thầy' })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium bg-white"
                  >
                    <option value="cô">Cô giáo</option>
                    <option value="thầy">Thầy giáo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tên đăng nhập: *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeacherForm.username}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, username: e.target.value.toLowerCase().trim() })}
                    placeholder="Ví dụ: vanminh"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Số điện thoại:
                  </label>
                  <input
                    type="tel"
                    value={newTeacherForm.phone}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email liên hệ:
                  </label>
                  <input
                    type="email"
                    value={newTeacherForm.email}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                    placeholder="gv@leductho.edu.vn"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Phân công lớp phụ trách ban đầu:
                </label>
                <select
                  value={newTeacherForm.assignedClassId}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, assignedClassId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium bg-white"
                >
                  <option value="">-- Chưa phân công lớp ngay --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Khối {c.grade}) - {c.school}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 leading-relaxed font-medium">
                💡 Mật khẩu khởi tạo mặc định là: <strong>2026</strong>. Giáo viên sẽ được nhắc đổi mật khẩu trong lần đăng nhập đầu tiên.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-xs cursor-pointer"
                >
                  Tạo tài khoản giáo viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: TẠO LỚP HỌC MỚI ================= */}
      {isCreateClassOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-purple-300 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏫</span>
                <h3 className="font-extrabold text-base sm:text-lg text-purple-950 font-display">
                  Tạo lớp học mới (Khối 1 – 5)
                </h3>
              </div>
              <button onClick={() => setIsCreateClassOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tên lớp học: *
                </label>
                <input
                  type="text"
                  required
                  value={newClassForm.name}
                  onChange={(e) => setNewClassForm({ ...newClassForm, name: e.target.value })}
                  placeholder="Ví dụ: Lớp 4A hoặc Lớp 2B"
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Khối lớp (1 – 5): *
                  </label>
                  <select
                    value={newClassForm.grade}
                    onChange={(e) => setNewClassForm({ ...newClassForm, grade: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium bg-white"
                  >
                    {[1, 2, 3, 4, 5].map(g => (
                      <option key={g} value={g}>Lớp {g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Năm học:
                  </label>
                  <input
                    type="text"
                    value={newClassForm.schoolYear}
                    onChange={(e) => setNewClassForm({ ...newClassForm, schoolYear: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Giáo viên chủ nhiệm phụ trách:
                </label>
                <select
                  value={newClassForm.primaryTeacherId}
                  onChange={(e) => setNewClassForm({ ...newClassForm, primaryTeacherId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium bg-white"
                >
                  <option value="">-- Chọn giáo viên phụ trách --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsCreateClassOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-xs cursor-pointer"
                >
                  Tạo lớp học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CHUYỂN GIAO LỚP HỌC ================= */}
      {isTransferClassOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-300 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔄</span>
                <h3 className="font-extrabold text-base sm:text-lg text-amber-950 font-display">
                  Chuyển giao lớp học giữa các giáo viên
                </h3>
              </div>
              <button onClick={() => setIsTransferClassOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferClass} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Chọn lớp học cần chuyển giao: *
                </label>
                <select
                  required
                  value={transferClassForm.classId}
                  onChange={(e) => {
                    const c = classes.find(cl => cl.id === e.target.value);
                    setTransferClassForm({
                      ...transferClassForm,
                      classId: e.target.value,
                      fromTeacherId: c?.primaryTeacherId || ''
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:outline-hidden font-medium bg-white"
                >
                  <option value="">-- Chọn lớp cần chuyển --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Khối {c.grade}) - Hiện tại: {teachers.find(t => t.id === c.primaryTeacherId)?.fullName || 'Chưa gán'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Giáo viên tiếp nhận mới: *
                </label>
                <select
                  required
                  value={transferClassForm.toTeacherId}
                  onChange={(e) => setTransferClassForm({ ...transferClassForm, toTeacherId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:outline-hidden font-medium bg-white"
                >
                  <option value="">-- Chọn giáo viên tiếp nhận --</option>
                  {teachers
                    .filter(t => t.id !== transferClassForm.fromTeacherId && t.status === 'active')
                    .map(t => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.id})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Lý do chuyển giao:
                </label>
                <input
                  type="text"
                  value={transferClassForm.reason}
                  onChange={(e) => setTransferClassForm({ ...transferClassForm, reason: e.target.value })}
                  placeholder="Ví dụ: Phân công nhiệm vụ học kỳ mới..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:outline-hidden font-medium"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 leading-relaxed font-medium">
                ✅ <strong>Cam kết bảo toàn dữ liệu:</strong> Toàn bộ học sinh, mã số học sinh, bài tập đã giao, bài đã nộp, nhận xét và lịch sử tiến bộ của lớp được bảo toàn nguyên vẹn 100%. Quyền quản lý lớp sẽ được chuyển giao tức thì.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setIsTransferClassOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black shadow-xs cursor-pointer"
                >
                  Xác nhận chuyển giao lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: PHIẾU CẤP LẠI MẬT KHẨU ================= */}
      {isResetPassOpen && resetPassResult && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-purple-300 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔑</span>
                <h3 className="font-extrabold text-base sm:text-lg text-purple-950 font-display">
                  Phiếu bàn giao mật khẩu mới
                </h3>
              </div>
              <button onClick={() => setIsResetPassOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-center space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase">
                Giáo viên nhận mật khẩu:
              </span>
              <h4 className="text-base font-extrabold text-purple-950 font-display">
                {resetPassResult.teacherName}
              </h4>
              <div className="py-2 px-4 bg-white rounded-xl border border-purple-300 inline-block font-mono text-xl font-black text-purple-900 tracking-wider">
                {resetPassResult.password}
              </div>
              <p className="text-[11px] text-stone-600">
                Cô Duyên có thể gửi thông tin này cho giáo viên để đăng nhập lại vào hệ thống.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In phiếu</span>
              </button>
              <button
                onClick={() => setIsResetPassOpen(false)}
                className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-xs"
              >
                Đã xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
