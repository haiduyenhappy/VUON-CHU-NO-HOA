import { firebaseAuth } from '../lib/firebase';
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
  Printer,
  Eye,
  EyeOff,
  Filter
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
    const teacherId = currentUser?.teacherId || adminProfile?.id || 'GV001';
    headers.set('x-teacher-id', teacherId);
    return globalThis.fetch(input, { ...init, headers });
  };
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
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'classes' | 'reports' | 'audit' | 'demoLogin'>('overview');
  const [demoConfig, setDemoConfig] = useState({enabled:true,student:['HS001','HS002','HS020'],teacher:['haiduyen','vanminh'],family:['PH001','PH002','PH020']});
  const [demoSaving, setDemoSaving] = useState(false);
  useEffect(() => { fetch('/api/demo-login-config').then(r=>r.json()).then(d=>{if(d.success)setDemoConfig(d.config)}).catch(()=>{}); }, []);
  const saveDemoConfig = async () => {
    setDemoSaving(true);
    try {
      const res = await fetch('/api/admin/demo-login-config',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer tok_${adminProfile.id}`,'x-teacher-id':adminProfile.id},body:JSON.stringify({config:demoConfig})});
      const data = await res.json();
      if(!res.ok || !data.success) throw new Error(data.message || 'Không thể lưu');
      setDemoConfig(data.config); setMessage({text:'Đã lưu cấu hình đăng nhập nhanh.',type:'success'});
    } catch(e:any) { setMessage({text:e.message || 'Không thể lưu cấu hình.',type:'error'}); }
    finally {setDemoSaving(false)}
  };
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

  // Teacher Management Filters
  const [teacherClassFilter, setTeacherClassFilter] = useState<string>('all');
  const [teacherStatusFilter, setTeacherStatusFilter] = useState<string>('all');

  // Modals state
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isEditTeacherOpen, setIsEditTeacherOpen] = useState(false);
  const [isResetPassOpen, setIsResetPassOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountModalTab, setAccountModalTab] = useState<'username' | 'password'>('password');
  const [isPrintSlipOpen, setIsPrintSlipOpen] = useState(false);
  const [slipMode, setSlipMode] = useState<'info' | 'handover'>('info');
  const [slipTeacher, setSlipTeacher] = useState<TeacherAccount | null>(null);
  const [slipPassword, setSlipPassword] = useState<string>('');
  const [isPrintListOpen, setIsPrintListOpen] = useState(false);
  const [isLockConfirmOpen, setIsLockConfirmOpen] = useState(false);
  const [lockTargetTeacher, setLockTargetTeacher] = useState<TeacherAccount | null>(null);
  const [lockTargetStatus, setLockTargetStatus] = useState<'active' | 'locked' | 'inactive'>('locked');
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

  const [editTeacherForm, setEditTeacherForm] = useState({
    id: '',
    fullName: '',
    salutation: 'cô' as 'cô' | 'thầy',
    phone: '',
    email: '',
    school: TEACHER_CONFIG.school,
    role: 'TEACHER' as 'SUPER_ADMIN' | 'TEACHER',
    status: 'active' as 'active' | 'locked' | 'inactive',
    assignedClassIds: [] as string[]
  });

  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [tempPasswordResult, setTempPasswordResult] = useState<string | null>(null);

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

  // Action: Open Edit Teacher Modal
  const handleOpenEditTeacher = (teacher: TeacherAccount) => {
    playPop(settings.soundEnabled);
    setSelectedTeacher(teacher);
    setEditTeacherForm({
      id: teacher.id,
      fullName: teacher.fullName,
      salutation: teacher.salutation || 'cô',
      phone: teacher.phone || '',
      email: teacher.email || '',
      school: teacher.school || TEACHER_CONFIG.school,
      role: teacher.role || 'TEACHER',
      status: teacher.status || 'active',
      assignedClassIds: teacher.assignedClassIds || []
    });
    setIsEditTeacherOpen(true);
  };

  // Action: Save Edit Teacher Form
  const handleSaveEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeacherForm.fullName.trim()) {
      showToast('Vui lòng nhập họ và tên giáo viên.', 'error');
      return;
    }

    // Last Super Admin Demotion Safeguard
    if (selectedTeacher?.role === 'SUPER_ADMIN' && editTeacherForm.role === 'TEACHER') {
      const activeSuperAdmins = teachers.filter(t => t.role === 'SUPER_ADMIN' && t.status === 'active' && t.id !== selectedTeacher.id);
      if (activeSuperAdmins.length === 0) {
        showToast('Không thể hạ quyền Quản trị viên chính duy nhất đang hoạt động.', 'error');
        return;
      }
    }

    try {
      const res = await fetch('/api/admin/teachers/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer tok_${adminProfile.id}`,
          'x-teacher-id': adminProfile.id
        },
        body: JSON.stringify(editTeacherForm)
      });
      const data = await res.json();
      if (data.success) {
        playSparkle(settings.soundEnabled);
        showToast(`Đã cập nhật thành công hồ sơ giáo viên ${data.teacher.name}.`);
        setIsEditTeacherOpen(false);
        loadAdminData();
      } else {
        showToast(data.message || 'Lỗi cập nhật hồ sơ giáo viên.', 'error');
      }
    } catch (e) {
      showToast('Không thể kết nối máy chủ.', 'error');
    }
  };

  // Action: Open Account Management Modal
  const handleOpenAccountModal = (teacher: TeacherAccount, tab: 'username' | 'password' = 'password') => {
    playPop(settings.soundEnabled);
    setSelectedTeacher(teacher);
    setAccountModalTab(tab);
    setNewUsernameInput(teacher.username || '');
    const randPass = 'GV' + Math.floor(100000 + Math.random() * 900000);
    setNewPasswordInput(randPass);
    setConfirmPasswordInput(randPass);
    setShowPassword(false);
    setRequirePasswordChange(true);
    setTempPasswordResult(null);
    setIsAccountModalOpen(true);
  };

  // Action: Change Teacher Username
  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    const clean = newUsernameInput.trim().toLowerCase();
    if (clean.length < 3 || clean.length > 30) {
      showToast('Tên đăng nhập phải từ 3 đến 30 ký tự.', 'error');
      return;
    }
    if (!/^[a-z0-9_.]+$/.test(clean)) {
      showToast('Tên đăng nhập chỉ chứa chữ cái thường không dấu, số, dấu gạch dưới (_) hoặc dấu chấm (.).', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/teachers/change-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer tok_${adminProfile.id}`,
          'x-teacher-id': adminProfile.id
        },
        body: JSON.stringify({ id: selectedTeacher.id, newUsername: clean })
      });
      const data = await res.json();
      if (data.success) {
        playSparkle(settings.soundEnabled);
        showToast(`Đã đổi tên đăng nhập thành công sang "${data.teacher.username}".`);
        setSelectedTeacher(data.teacher);
        loadAdminData();
      } else {
        showToast(data.message || 'Lỗi khi đổi tên đăng nhập.', 'error');
      }
    } catch (e) {
      showToast('Không thể kết nối máy chủ.', 'error');
    }
  };

  // Action: Reset Teacher Password in Account Modal
  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    if (!newPasswordInput.trim()) {
      showToast('Vui lòng nhập mật khẩu mới.', 'error');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      showToast('Mật khẩu xác nhận không khớp.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/teachers/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer tok_${adminProfile.id}`,
          'x-teacher-id': adminProfile.id
        },
        body: JSON.stringify({
          id: selectedTeacher.id,
          newPassword: newPasswordInput.trim(),
          mustChangePasswordNextLogin: requirePasswordChange
        })
      });
      const data = await res.json();
      if (data.success) {
        playChime(settings.soundEnabled);
        setTempPasswordResult(data.temporaryPassword);
        showToast(`Đã cấp lại mật khẩu thành công cho giáo viên ${selectedTeacher.name}.`);
        loadAdminData();
      } else {
        showToast(data.message || 'Lỗi cấp lại mật khẩu.', 'error');
      }
    } catch (e) {
      showToast('Không thể kết nối máy chủ.', 'error');
    }
  };

  // Action: Open Print Slip Modal
  const handleOpenPrintSlip = (teacher: TeacherAccount, mode: 'info' | 'handover' = 'info', tempPass: string = '') => {
    playPop(settings.soundEnabled);
    setSlipTeacher(teacher);
    setSlipMode(mode);
    setSlipPassword(tempPass);
    setIsPrintSlipOpen(true);
  };

  // Action: Open Lock / Unlock Confirmation
  const handleOpenLockConfirm = (teacher: TeacherAccount, targetStatus: 'active' | 'locked' | 'inactive') => {
    playPop(settings.soundEnabled);
    if (teacher.id === adminProfile.id && targetStatus !== 'active') {
      showToast('Không thể khóa tài khoản Quản trị viên chính của bạn.', 'error');
      return;
    }
    if ((targetStatus === 'locked' || targetStatus === 'inactive') && teacher.role === 'SUPER_ADMIN') {
      const activeSuperAdmins = teachers.filter(t => t.role === 'SUPER_ADMIN' && t.status === 'active' && t.id !== teacher.id);
      if (activeSuperAdmins.length === 0) {
        showToast('Không thể khóa Quản trị viên chính duy nhất đang hoạt động.', 'error');
        return;
      }
    }
    setLockTargetTeacher(teacher);
    setLockTargetStatus(targetStatus);
    setIsLockConfirmOpen(true);
  };

  const handleExecuteLockToggle = async () => {
    if (!lockTargetTeacher) return;
    await handleToggleTeacherStatus(lockTargetTeacher, lockTargetStatus);
    setIsLockConfirmOpen(false);
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
        <button onClick={() => setActiveTab('demoLogin')} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold ${activeTab === 'demoLogin' ? 'bg-purple-700 text-white' : 'text-stone-700 hover:bg-purple-50'}`}><KeyRound className="w-4 h-4"/>6. Đăng nhập nhanh</button>
      </div>

      {activeTab === 'demoLogin' && (
        <section className="bg-white border-2 border-purple-200 rounded-3xl p-5 sm:p-7 space-y-5">
          <h2 className="text-xl font-black text-purple-950">Quản lý tài khoản đăng nhập nhanh</h2>
          <p className="text-sm text-stone-600">Chỉ dùng cho tài khoản trình diễn khi chấm điểm. Tắt để ẩn toàn bộ gợi ý tại ba trang đăng nhập.</p>
          <label className="flex items-center gap-3 font-bold"><input type="checkbox" className="w-5 h-5" checked={demoConfig.enabled} onChange={e=>setDemoConfig(v=>({...v,enabled:e.target.checked}))}/> Bật gợi ý đăng nhập nhanh</label>
          {(['student','teacher','family'] as const).map(role => <div key={role} className="rounded-2xl border border-purple-100 p-4 space-y-3"><h3 className="font-bold text-purple-900">{{student:'Học sinh',teacher:'Giáo viên',family:'Phụ huynh'}[role]}</h3><div className="flex flex-wrap gap-4">{({student:[['HS001','Tuệ An'],['HS002','Bảo An'],['HS020','Tuệ Lâm']],teacher:[['haiduyen','Cô Duyên – Quản trị & Giáo viên'],['vanminh','Thầy Minh – Giáo viên']],family:[['PH001','PH bé Tuệ An'],['PH002','PH bé Bảo An'],['PH020','PH bé Tuệ Lâm']]} as Record<string,string[][]>)[role].map(([id,name])=><label key={id} className="flex gap-2 items-center text-sm"><input type="checkbox" checked={demoConfig[role].includes(id)} onChange={e=>setDemoConfig(v=>({...v,[role]:e.target.checked?[...v[role],id]:v[role].filter(x=>x!==id)}))}/>{name} ({id})</label>)}</div></div>)}
          <div className="flex flex-wrap gap-3"><button disabled={demoSaving} onClick={saveDemoConfig} className="px-5 py-3 rounded-xl bg-purple-700 text-white font-bold disabled:opacity-50">{demoSaving?'Đang lưu...':'Lưu thay đổi'}</button><button onClick={()=>setDemoConfig({enabled:true,student:['HS001','HS002','HS020'],teacher:['haiduyen','vanminh'],family:['PH001','PH002','PH020']})} className="px-5 py-3 rounded-xl bg-stone-100 font-bold">Khôi phục mặc định (sau đó bấm Lưu)</button></div>
        </section>
      )}

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
          {/* Action & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  placeholder="Tìm theo tên giáo viên, mã GV, username..."
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-purple-400 focus:bg-white"
                />
              </div>

              {/* Class Filter */}
              <div className="relative min-w-[150px]">
                <select
                  value={teacherClassFilter}
                  onChange={(e) => setTeacherClassFilter(e.target.value)}
                  className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-hidden focus:border-purple-400 focus:bg-white"
                >
                  <option value="all">Tất cả lớp học</option>
                  <option value="unassigned">Chưa phân công</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Khối {c.grade})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative min-w-[140px]">
                <select
                  value={teacherStatusFilter}
                  onChange={(e) => setTeacherStatusFilter(e.target.value)}
                  className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-hidden focus:border-purple-400 focus:bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">🟢 Đang hoạt động</option>
                  <option value="locked">🔴 Đang bị khóa</option>
                  <option value="inactive">⚪ Ngừng kích hoạt</option>
                </select>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setIsPrintListOpen(true);
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[40px] rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs shadow-xs transition-all cursor-pointer"
                title="In danh sách giáo viên toàn trường"
              >
                <Printer className="w-4 h-4 text-purple-700" />
                <span>🖨️ In danh sách</span>
              </button>

              <button
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setIsAddTeacherOpen(true);
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[40px] rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm giáo viên mới</span>
              </button>
            </div>
          </div>

          {/* Quick Summary of Filtered Teachers */}
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>
              Hiển thị <strong>{
                teachers.filter(t => {
                  if (teacherSearch.trim()) {
                    const q = teacherSearch.toLowerCase();
                    const matchName = t.fullName?.toLowerCase().includes(q);
                    const matchId = t.id?.toLowerCase().includes(q);
                    const matchUser = (t.username || '').toLowerCase().includes(q);
                    if (!matchName && !matchId && !matchUser) return false;
                  }
                  if (teacherClassFilter !== 'all') {
                    if (teacherClassFilter === 'unassigned') {
                      if (t.assignedClassIds && t.assignedClassIds.length > 0) return false;
                    } else {
                      if (!t.assignedClassIds || !t.assignedClassIds.includes(teacherClassFilter)) return false;
                    }
                  }
                  if (teacherStatusFilter !== 'all') {
                    if (t.status !== teacherStatusFilter) return false;
                  }
                  return true;
                }).length
              }</strong> / <strong>{teachers.length}</strong> giáo viên
            </span>
            {(teacherSearch || teacherClassFilter !== 'all' || teacherStatusFilter !== 'all') && (
              <button
                onClick={() => {
                  setTeacherSearch('');
                  setTeacherClassFilter('all');
                  setTeacherStatusFilter('all');
                }}
                className="text-purple-700 hover:underline font-semibold"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Teachers Table (Desktop) */}
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
                  <th className="py-3 px-3 text-center min-w-[290px]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {teachers
                  .filter(t => {
                    if (teacherSearch.trim()) {
                      const q = teacherSearch.toLowerCase();
                      const matchName = t.fullName?.toLowerCase().includes(q);
                      const matchId = t.id?.toLowerCase().includes(q);
                      const matchUser = (t.username || '').toLowerCase().includes(q);
                      if (!matchName && !matchId && !matchUser) return false;
                    }
                    if (teacherClassFilter !== 'all') {
                      if (teacherClassFilter === 'unassigned') {
                        if (t.assignedClassIds && t.assignedClassIds.length > 0) return false;
                      } else {
                        if (!t.assignedClassIds || !t.assignedClassIds.includes(teacherClassFilter)) return false;
                      }
                    }
                    if (teacherStatusFilter !== 'all') {
                      if (t.status !== teacherStatusFilter) return false;
                    }
                    return true;
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
                          {teacher.phone && <span className="text-[10px] text-stone-400 block font-mono">{teacher.phone}</span>}
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
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                            {/* 1. Sửa */}
                            <button
                              onClick={() => handleOpenEditTeacher(teacher)}
                              className="px-2.5 py-1.5 min-h-[36px] bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-102"
                              title="Chỉnh sửa thông tin giáo viên"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                              <span>Sửa</span>
                            </button>

                            {/* 2. Tài khoản */}
                            <button
                              onClick={() => handleOpenAccountModal(teacher, 'password')}
                              className="px-2.5 py-1.5 min-h-[36px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-102"
                              title="Quản lý tài khoản: Đổi username & cấp mật khẩu"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>Tài khoản</span>
                            </button>

                            {/* 3. In phiếu */}
                            <button
                              onClick={() => handleOpenPrintSlip(teacher, 'info')}
                              className="px-2.5 py-1.5 min-h-[36px] bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-102"
                              title="In phiếu tài khoản giáo viên"
                            >
                              <Printer className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                              <span>In phiếu</span>
                            </button>

                            {/* 4. Khóa / Mở khóa */}
                            {teacher.status === 'locked' ? (
                              <button
                                onClick={() => handleOpenLockConfirm(teacher, 'active')}
                                className="px-2.5 py-1.5 min-h-[36px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-102"
                                title="Mở khóa tài khoản"
                              >
                                <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Mở khóa</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenLockConfirm(teacher, 'locked')}
                                className="px-2.5 py-1.5 min-h-[36px] bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-102"
                                title="Khóa tài khoản"
                              >
                                <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                <span>Khóa</span>
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
                if (teacherSearch.trim()) {
                  const q = teacherSearch.toLowerCase();
                  const matchName = t.fullName?.toLowerCase().includes(q);
                  const matchId = t.id?.toLowerCase().includes(q);
                  const matchUser = (t.username || '').toLowerCase().includes(q);
                  if (!matchName && !matchId && !matchUser) return false;
                }
                if (teacherClassFilter !== 'all') {
                  if (teacherClassFilter === 'unassigned') {
                    if (t.assignedClassIds && t.assignedClassIds.length > 0) return false;
                  } else {
                    if (!t.assignedClassIds || !t.assignedClassIds.includes(teacherClassFilter)) return false;
                  }
                }
                if (teacherStatusFilter !== 'all') {
                  if (t.status !== teacherStatusFilter) return false;
                }
                return true;
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

                    {/* Mobile 4 Action buttons grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                      {/* 1. Sửa */}
                      <button
                        onClick={() => handleOpenEditTeacher(teacher)}
                        className="px-2.5 py-2 min-h-[36px] bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                        <span>✏️ Sửa</span>
                      </button>

                      {/* 2. Tài khoản */}
                      <button
                        onClick={() => handleOpenAccountModal(teacher, 'password')}
                        className="px-2.5 py-2 min-h-[36px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>🔐 Tài khoản</span>
                      </button>

                      {/* 3. In phiếu */}
                      <button
                        onClick={() => handleOpenPrintSlip(teacher, 'info')}
                        className="px-2.5 py-2 min-h-[36px] bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                        <span>🖨️ In phiếu</span>
                      </button>

                      {/* 4. Khóa / Mở khóa */}
                      {teacher.status === 'locked' ? (
                        <button
                          onClick={() => handleOpenLockConfirm(teacher, 'active')}
                          className="px-2.5 py-2 min-h-[36px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>🔓 Mở khóa</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenLockConfirm(teacher, 'locked')}
                          className="px-2.5 py-2 min-h-[36px] bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>🔒 Khóa</span>
                        </button>
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

      {/* Print Styles for Slip and List */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-slip, #printable-slip *,
          #printable-list, #printable-list * {
            visibility: visible !important;
          }
          #printable-slip, #printable-list {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: white !important;
            color: #000 !important;
            box-shadow: none !important;
            border: none !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ================= MODAL: CHỈNH SỬA THÔNG TIN GIÁO VIÊN ================= */}
      {isEditTeacherOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-purple-300 space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✏️</span>
                <h3 className="font-extrabold text-base sm:text-lg text-purple-950 font-display">
                  Chỉnh sửa thông tin giáo viên
                </h3>
              </div>
              <button 
                onClick={() => setIsEditTeacherOpen(false)} 
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTeacher} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Họ và tên giáo viên: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTeacherForm.fullName}
                    onChange={(e) => setEditTeacherForm({ ...editTeacherForm, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Xưng hô:
                  </label>
                  <select
                    value={editTeacherForm.salutation}
                    onChange={(e) => setEditTeacherForm({ ...editTeacherForm, salutation: e.target.value as 'cô' | 'thầy' })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium bg-white"
                  >
                    <option value="cô">Cô giáo</option>
                    <option value="thầy">Thầy giáo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={editTeacherForm.email}
                    onChange={(e) => setEditTeacherForm({ ...editTeacherForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium"
                    placeholder="email@thnguyendu.edu.vn"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Số điện thoại:
                  </label>
                  <input
                    type="tel"
                    value={editTeacherForm.phone}
                    onChange={(e) => setEditTeacherForm({ ...editTeacherForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium"
                    placeholder="0912 345 678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Vai trò hệ thống:
                  </label>
                  <select
                    value={editTeacherForm.role}
                    onChange={(e) => setEditTeacherForm({ ...editTeacherForm, role: e.target.value as 'SUPER_ADMIN' | 'TEACHER' })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium bg-white"
                  >
                    <option value="TEACHER">Giáo viên bộ môn / Chủ nhiệm (TEACHER)</option>
                    <option value="SUPER_ADMIN">👑 Quản trị viên chính (SUPER_ADMIN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Trạng thái hoạt động:
                  </label>
                  <select
                    value={editTeacherForm.status}
                    onChange={(e) => setEditTeacherForm({ ...editTeacherForm, status: e.target.value as 'active' | 'locked' | 'inactive' })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-medium bg-white"
                  >
                    <option value="active">🟢 Đang hoạt động</option>
                    <option value="locked">🔴 Đang bị khóa</option>
                    <option value="inactive">⚪ Ngừng kích hoạt</option>
                  </select>
                </div>
              </div>

              {/* Class Assignment Multi-select Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Lớp được phân công phụ trách:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200 max-h-36 overflow-y-auto">
                  {classes.map(c => {
                    const isChecked = editTeacherForm.assignedClassIds.includes(c.id);
                    return (
                      <label 
                        key={c.id} 
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors border ${
                          isChecked ? 'bg-purple-100 text-purple-950 border-purple-300' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditTeacherForm({
                                ...editTeacherForm,
                                assignedClassIds: [...editTeacherForm.assignedClassIds, c.id]
                              });
                            } else {
                              setEditTeacherForm({
                                ...editTeacherForm,
                                assignedClassIds: editTeacherForm.assignedClassIds.filter(id => id !== c.id)
                              });
                            }
                          }}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span>{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsEditTeacherOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 font-bold hover:bg-stone-100 text-xs sm:text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-xs cursor-pointer text-xs sm:text-sm"
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUẢN LÝ TÀI KHOẢN (ĐỔI USERNAME / CẤP MẬT KHẨU) ================= */}
      {isAccountModalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-300 space-y-4 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔐</span>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-amber-950 font-display">
                    Quản lý tài khoản giáo viên
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    {selectedTeacher.fullName} • Mã GV: <strong className="font-mono text-purple-800">{selectedTeacher.id}</strong>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAccountModalOpen(false)} 
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2 Tabs switcher */}
            <div className="flex rounded-2xl bg-stone-100 p-1 border border-stone-200">
              <button
                type="button"
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setAccountModalTab('username');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  accountModalTab === 'username' 
                    ? 'bg-white text-purple-950 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                👤 Đổi tên đăng nhập (Username)
              </button>
              <button
                type="button"
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setAccountModalTab('password');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  accountModalTab === 'password' 
                    ? 'bg-white text-purple-950 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🔑 Cấp lại mật khẩu
              </button>
            </div>

            {/* TAB 1: Change Username */}
            {accountModalTab === 'username' && (
              <form onSubmit={handleChangeUsername} className="space-y-4 text-xs sm:text-sm pt-2">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-stone-500 text-xs block mb-0.5">Tên đăng nhập hiện tại:</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{selectedTeacher.username}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tên đăng nhập mới: *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsernameInput}
                    onChange={(e) => setNewUsernameInput(e.target.value.toLowerCase().trim())}
                    placeholder="ví dụ: gv_minhtri"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-purple-500 focus:outline-hidden font-mono font-semibold"
                  />
                  <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                    ℹ️ Chỉ gồm 4–20 ký tự chữ thường không dấu, số và dấu gạch dưới (<code>a-z, 0-9, _</code>). Không được chứa khoảng trắng hoặc ký tự đặc biệt.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-100">
                  <button
                    type="button"
                    onClick={() => setIsAccountModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-xs cursor-pointer"
                  >
                    Lưu tên đăng nhập mới
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Reset Password */}
            {accountModalTab === 'password' && (
              <form onSubmit={handleConfirmResetPassword} className="space-y-4 text-xs sm:text-sm pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700">
                      Mật khẩu mới: *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomSix = Math.floor(100000 + Math.random() * 900000);
                        const autoPass = `GV${randomSix}`;
                        setNewPasswordInput(autoPass);
                        setConfirmPasswordInput(autoPass);
                      }}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sinh ngẫu nhiên (GV + 6 số)</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPasswordInput}
                      onChange={(e) => {
                        setNewPasswordInput(e.target.value);
                        setConfirmPasswordInput(e.target.value);
                      }}
                      placeholder="Nhập hoặc tạo mật khẩu mới..."
                      className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:outline-hidden font-mono font-bold tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requirePasswordChange}
                      onChange={(e) => setRequirePasswordChange(e.target.checked)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <div className="text-xs">
                      <strong className="text-amber-950 block">Yêu cầu giáo viên đổi mật khẩu ở lần đăng nhập tiếp theo</strong>
                      <span className="text-stone-600">
                        Giáo viên sẽ nhận được thông báo yêu cầu đặt mật khẩu cá nhân mới ngay khi đăng nhập thành công.
                      </span>
                    </div>
                  </label>
                </div>

                {/* If tempPasswordResult is available, show quick handover slip button */}
                {tempPasswordResult && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between gap-3 animate-fade-in">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">✅ Đã cấp mật khẩu mới:</span>
                      <span className="font-mono font-black text-emerald-950 text-base">{tempPasswordResult}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenPrintSlip(selectedTeacher, 'handover', tempPasswordResult)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>In phiếu bàn giao ngay</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-100">
                  <button
                    type="button"
                    onClick={() => setIsAccountModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black shadow-xs cursor-pointer"
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: IN PHIẾU TÀI KHOẢN GIÁO VIÊN (A4 PORTRAIT) ================= */}
      {isPrintSlipOpen && slipTeacher && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-purple-300 space-y-4 animate-scale-in my-auto">
            {/* Action Bar (Not printed) */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-3 no-print">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🖨️</span>
                <h3 className="font-extrabold text-base sm:text-lg text-purple-950 font-display">
                  Xem trước phiếu tài khoản giáo viên
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Switcher Mode */}
                <div className="flex rounded-xl bg-stone-100 p-0.5 border border-stone-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setSlipMode('info')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      slipMode === 'info' ? 'bg-white text-purple-900 shadow-2xs' : 'text-stone-600'
                    }`}
                  >
                    Phiếu thông tin
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlipMode('handover')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      slipMode === 'handover' ? 'bg-white text-purple-900 shadow-2xs' : 'text-stone-600'
                    }`}
                  >
                    Phiếu bàn giao (có MK)
                  </button>
                </div>

                <button 
                  onClick={() => setIsPrintSlipOpen(false)} 
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Preview Area */}
            <div id="printable-slip" className="p-6 bg-white border border-stone-200 rounded-2xl shadow-inner space-y-5 text-stone-900 font-sans">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-purple-900 pb-4">
                <div>
                  <h4 className="font-bold text-xs uppercase text-stone-600 tracking-wider">
                    {TEACHER_CONFIG.school}
                  </h4>
                  <h5 className="font-black text-sm text-purple-900 uppercase">
                    VƯỜN CHỮ NỞ HOA • TRỢ LÝ TẬP LÀM VĂN TIỂU HỌC AI
                  </h5>
                  <p className="text-[11px] text-stone-500">
                    Địa chỉ: P. Hàng Bạc, Q. Hoàn Kiếm, TP. Hà Nội
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Số phiếu: <strong>{slipTeacher.id}-{new Date().getFullYear()}</strong></span>
                  <span className="text-[11px] text-stone-500 block">Ngày lập: {new Date().toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-2">
                <h2 className="text-xl font-black text-purple-950 uppercase tracking-tight">
                  {slipMode === 'handover' ? 'PHIẾU BÀN GIAO TÀI KHOẢN GIÁO VIÊN' : 'PHIẾU THÔNG TIN TÀI KHOẢN GIÁO VIÊN'}
                </h2>
                <p className="text-xs text-stone-600 italic">
                  (Dùng để đăng nhập và quản lý lớp học trên nền tảng Vườn Chữ Nở Hoa)
                </p>
              </div>

              {/* Information Table */}
              <div className="border border-stone-300 rounded-xl overflow-hidden text-xs sm:text-sm">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-stone-200 bg-stone-50/60">
                      <td className="p-2.5 font-bold text-stone-700 w-1/3">Họ và tên giáo viên:</td>
                      <td className="p-2.5 font-extrabold text-stone-950 text-base">{slipTeacher.fullName}</td>
                    </tr>
                    <tr className="border-b border-stone-200">
                      <td className="p-2.5 font-bold text-stone-700">Mã giáo viên (Mã GV):</td>
                      <td className="p-2.5 font-mono font-bold text-purple-900">{slipTeacher.id}</td>
                    </tr>
                    <tr className="border-b border-stone-200 bg-stone-50/60">
                      <td className="p-2.5 font-bold text-stone-700">Tên đăng nhập (Username):</td>
                      <td className="p-2.5 font-mono font-bold text-stone-950 text-base">{slipTeacher.username}</td>
                    </tr>
                    {slipMode === 'handover' && (
                      <tr className="border-b border-stone-200 bg-amber-50/70">
                        <td className="p-2.5 font-bold text-amber-900">Mật khẩu tạm thời:</td>
                        <td className="p-2.5 font-mono font-black text-amber-950 text-lg tracking-wider">
                          {slipPassword || '(Đã bảo mật - Liên hệ Quản trị viên để đặt lại)'}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-stone-200">
                      <td className="p-2.5 font-bold text-stone-700">Lớp phụ trách:</td>
                      <td className="p-2.5 font-semibold text-stone-800">
                        {slipTeacher.assignedClassIds && slipTeacher.assignedClassIds.length > 0 ? (
                          slipTeacher.assignedClassIds.map(cId => classes.find(c => c.id === cId)?.name || cId).join(', ')
                        ) : 'Chưa phân công'}
                      </td>
                    </tr>
                    <tr className="border-b border-stone-200 bg-stone-50/60">
                      <td className="p-2.5 font-bold text-stone-700">Vai trò trong hệ thống:</td>
                      <td className="p-2.5 font-bold text-stone-800">
                        {slipTeacher.role === 'SUPER_ADMIN' ? '👑 Quản trị viên chính (SUPER_ADMIN)' : '👩‍🏫 Giáo viên (TEACHER)'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-stone-700">Địa chỉ truy cập:</td>
                      <td className="p-2.5 font-mono text-purple-700 font-semibold">https://vuonchunohua.edu.vn</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Instructions & Security note */}
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs space-y-1">
                <strong className="text-purple-950 block">📌 Lưu ý bảo mật sư phạm:</strong>
                <p className="text-stone-700">
                  1. Giáo viên bảo quản thông tin tài khoản cẩn thận, không chia sẻ mật khẩu cho học sinh hoặc người ngoài.
                </p>
                <p className="text-stone-700">
                  2. {slipMode === 'handover' ? 'Vui lòng đăng nhập và đổi sang mật khẩu cá nhân mới ngay lần đầu tiên truy cập.' : 'Khi quên mật khẩu, vui lòng liên hệ cô Nguyễn Thị Hải Duyên - Quản trị viên chính để được cấp lại.'}
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-6 text-center text-xs">
                <div>
                  <span className="font-bold text-stone-700 block">GIÁO VIÊN NHẬN TÀI KHOẢN</span>
                  <span className="text-[11px] text-stone-400 italic block mb-12">(Ký và ghi rõ họ tên)</span>
                  <span className="font-bold text-stone-900">{slipTeacher.fullName}</span>
                </div>
                <div>
                  <span className="font-bold text-purple-950 block">QUẢN TRỊ VIÊN HỆ THỐNG</span>
                  <span className="text-[11px] text-stone-400 italic block mb-12">(Đã ký duyệt điện tử)</span>
                  <span className="font-bold text-purple-950">{adminProfile.fullName || TEACHER_CONFIG.fullName}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions (Not printed) */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-100 no-print">
              <button
                type="button"
                onClick={() => setIsPrintSlipOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100 text-xs sm:text-sm"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-xs cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>In phiếu ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: IN DANH SÁCH GIÁO VIÊN TOÀN TRƯỜNG (A4 PORTRAIT) ================= */}
      {isPrintListOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border-2 border-purple-300 space-y-4 animate-scale-in my-auto">
            {/* Action Bar (Not printed) */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-3 no-print">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-purple-950 font-display">
                    Xem trước danh sách giáo viên toàn trường
                  </h3>
                  <p className="text-xs text-stone-500">
                    Định dạng trang in chuẩn A4 dọc • Bộ lọc hiện tại: {teachers.filter(t => {
                      if (teacherSearch.trim()) {
                        const q = teacherSearch.toLowerCase();
                        const matchName = t.fullName?.toLowerCase().includes(q);
                        const matchId = t.id?.toLowerCase().includes(q);
                        const matchUser = (t.username || '').toLowerCase().includes(q);
                        if (!matchName && !matchId && !matchUser) return false;
                      }
                      if (teacherClassFilter !== 'all') {
                        if (teacherClassFilter === 'unassigned') {
                          if (t.assignedClassIds && t.assignedClassIds.length > 0) return false;
                        } else {
                          if (!t.assignedClassIds || !t.assignedClassIds.includes(teacherClassFilter)) return false;
                        }
                      }
                      if (teacherStatusFilter !== 'all') {
                        if (t.status !== teacherStatusFilter) return false;
                      }
                      return true;
                    }).length} giáo viên
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsPrintListOpen(false)} 
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable List Area */}
            <div id="printable-list" className="p-6 bg-white border border-stone-200 rounded-2xl shadow-inner space-y-4 text-stone-900 font-sans">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-purple-900 pb-3">
                <div>
                  <h4 className="font-bold text-xs uppercase text-stone-600 tracking-wider">
                    {TEACHER_CONFIG.school}
                  </h4>
                  <h5 className="font-black text-sm text-purple-900 uppercase">
                    HỆ THỐNG TRỢ LÝ TẬP LÀM VĂN TIỂU HỌC AI - VƯỜN CHỮ NỞ HOA
                  </h5>
                  <p className="text-[11px] text-stone-500">
                    Năm học: 2025 - 2026
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Thời gian xuất: {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN')}</span>
                  <span className="text-[11px] text-stone-500 block">Người xuất: <strong>{adminProfile.fullName || TEACHER_CONFIG.fullName}</strong></span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-2">
                <h2 className="text-xl font-black text-purple-950 uppercase tracking-tight">
                  DANH SÁCH GIÁO VIÊN QUẢN LÝ VÀ GIẢNG DẠY
                </h2>
                <p className="text-xs text-stone-600 italic">
                  Tổng số giáo viên: {teachers.filter(t => {
                    if (teacherSearch.trim()) {
                      const q = teacherSearch.toLowerCase();
                      const matchName = t.fullName?.toLowerCase().includes(q);
                      const matchId = t.id?.toLowerCase().includes(q);
                      const matchUser = (t.username || '').toLowerCase().includes(q);
                      if (!matchName && !matchId && !matchUser) return false;
                    }
                    if (teacherClassFilter !== 'all') {
                      if (teacherClassFilter === 'unassigned') {
                        if (t.assignedClassIds && t.assignedClassIds.length > 0) return false;
                      } else {
                        if (!t.assignedClassIds || !t.assignedClassIds.includes(teacherClassFilter)) return false;
                      }
                    }
                    if (teacherStatusFilter !== 'all') {
                      if (t.status !== teacherStatusFilter) return false;
                    }
                    return true;
                  }).length} đồng chí
                </p>
              </div>

              {/* Table */}
              <div className="border border-stone-300 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 border-b border-stone-300 font-bold text-stone-800">
                    <tr>
                      <th className="p-2 text-center w-10">STT</th>
                      <th className="p-2">Mã GV</th>
                      <th className="p-2">Họ và tên</th>
                      <th className="p-2">Tên đăng nhập</th>
                      <th className="p-2">Lớp phụ trách</th>
                      <th className="p-2 text-center">Vai trò</th>
                      <th className="p-2 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {teachers
                      .filter(t => {
                        if (teacherSearch.trim()) {
                          const q = teacherSearch.toLowerCase();
                          const matchName = t.fullName?.toLowerCase().includes(q);
                          const matchId = t.id?.toLowerCase().includes(q);
                          const matchUser = (t.username || '').toLowerCase().includes(q);
                          if (!matchName && !matchId && !matchUser) return false;
                        }
                        if (teacherClassFilter !== 'all') {
                          if (teacherClassFilter === 'unassigned') {
                            if (t.assignedClassIds && t.assignedClassIds.length > 0) return false;
                          } else {
                            if (!t.assignedClassIds || !t.assignedClassIds.includes(teacherClassFilter)) return false;
                          }
                        }
                        if (teacherStatusFilter !== 'all') {
                          if (t.status !== teacherStatusFilter) return false;
                        }
                        return true;
                      })
                      .map((t, index) => (
                        <tr key={t.id} className="hover:bg-stone-50">
                          <td className="p-2 text-center font-bold text-stone-400">{index + 1}</td>
                          <td className="p-2 font-mono font-bold text-purple-900">{t.id}</td>
                          <td className="p-2 font-bold text-stone-900">{t.fullName}</td>
                          <td className="p-2 font-mono text-stone-700">{t.username}</td>
                          <td className="p-2">
                            {t.assignedClassIds && t.assignedClassIds.length > 0 ? (
                              t.assignedClassIds.map(cId => classes.find(c => c.id === cId)?.name || cId).join(', ')
                            ) : (
                              <span className="italic text-stone-400">Chưa gán</span>
                            )}
                          </td>
                          <td className="p-2 text-center font-semibold">
                            {t.role === 'SUPER_ADMIN' ? '👑 Quản trị viên' : 'Giáo viên'}
                          </td>
                          <td className="p-2 text-center">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              t.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {t.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-6 text-center text-xs">
                <div>
                  <span className="font-bold text-stone-700 block">NGƯỜI LẬP DANH SÁCH</span>
                  <span className="text-[11px] text-stone-400 italic block mb-12">(Ký và ghi rõ họ tên)</span>
                  <span className="font-bold text-stone-900">{adminProfile.fullName || TEACHER_CONFIG.fullName}</span>
                </div>
                <div>
                  <span className="font-bold text-purple-950 block">HIỆU TRƯỞNG / BAN GIÁM HIỆU DUYỆT</span>
                  <span className="text-[11px] text-stone-400 italic block mb-12">(Ký tên và đóng dấu)</span>
                  <span className="font-bold text-purple-950">TS. Phạm Mai Lan</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions (Not printed) */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-100 no-print">
              <button
                type="button"
                onClick={() => setIsPrintListOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100 text-xs sm:text-sm"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-xs cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>In danh sách ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: XÁC NHẬN KHÓA / MỞ KHÓA TÀI KHOẢN ================= */}
      {isLockConfirmOpen && lockTargetTeacher && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-300 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{lockTargetStatus === 'locked' ? '🔒' : '🔓'}</span>
                <h3 className="font-extrabold text-base sm:text-lg text-rose-950 font-display">
                  {lockTargetStatus === 'locked' ? 'Khóa tài khoản giáo viên' : 'Mở khóa tài khoản giáo viên'}
                </h3>
              </div>
              <button 
                onClick={() => setIsLockConfirmOpen(false)} 
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2 text-xs sm:text-sm">
              <p className="font-semibold text-rose-950">
                {lockTargetStatus === 'locked' ? (
                  <>Bạn có chắc chắn muốn <strong>KHÓA</strong> tài khoản của giáo viên sau không?</>
                ) : (
                  <>Bạn có chắc chắn muốn <strong>MỞ KHÓA</strong> tài khoản của giáo viên sau không?</>
                )}
              </p>
              <div className="p-3 bg-white rounded-xl border border-rose-200">
                <div className="font-bold text-stone-900 text-sm">{lockTargetTeacher.fullName}</div>
                <div className="text-xs text-stone-500 font-mono">
                  Mã: {lockTargetTeacher.id} • Username: {lockTargetTeacher.username}
                </div>
              </div>
              {lockTargetStatus === 'locked' ? (
                <p className="text-rose-800 text-xs leading-relaxed">
                  ⚠️ <strong>Hệ quả:</strong> Giáo viên sẽ không thể đăng nhập vào ứng dụng cho đến khi được Quản trị viên mở khóa trở lại. Toàn bộ dữ liệu lớp học và học sinh vẫn được bảo toàn tuyệt đối.
                </p>
              ) : (
                <p className="text-emerald-800 text-xs leading-relaxed">
                  ✅ Giáo viên sẽ có thể tiếp tục đăng nhập và chấm bài bình thường.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-100">
              <button
                type="button"
                onClick={() => setIsLockConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100 text-xs sm:text-sm"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleExecuteLockToggle}
                className={`px-5 py-2.5 rounded-xl text-white font-black shadow-xs cursor-pointer text-xs sm:text-sm ${
                  lockTargetStatus === 'locked' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {lockTargetStatus === 'locked' ? 'Xác nhận khóa' : 'Xác nhận mở khóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PHIẾU CẤP LẠI MẬT KHẨU (LEGACY COMPAT) ================= */}
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
