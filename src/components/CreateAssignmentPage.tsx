import React, { useState, useEffect, useMemo } from 'react';
import { 
  Classroom, 
  Student, 
  ClassAssignment, 
  DifficultyLevel, 
  PromptAnalysisData, 
  AppSettings,
  AuthUser 
} from '../types';
import { TOPIC_GROUPS } from '../utils/promptAnalyzerEngine';
import { playPop, playChime, playSparkle } from '../utils/audio';
import { 
  ArrowLeft, 
  Check, 
  CheckSquare, 
  Square, 
  Search, 
  Sparkles, 
  Calendar, 
  Users, 
  Award, 
  BookOpen, 
  AlertCircle, 
  Save, 
  Send,
  HelpCircle,
  Clock,
  GraduationCap
} from 'lucide-react';

interface CreateAssignmentPageProps {
  currentUser?: AuthUser | null;
  classes: Classroom[];
  allStudents: Student[];
  initialClassId?: string;
  initialAssignment?: ClassAssignment | null;
  settings: AppSettings;
  onBack: () => void;
  onSuccess: (assignment: ClassAssignment, isDraft: boolean) => void;
}

export const CreateAssignmentPage: React.FC<CreateAssignmentPageProps> = ({
  currentUser,
  classes,
  allStudents,
  initialClassId,
  initialAssignment,
  settings,
  onBack,
  onSuccess
}) => {
  const isSuperAdmin = currentUser?.teacherRole === 'SUPER_ADMIN';
  const teacherName = currentUser?.teacherProfile?.fullName || currentUser?.teacherName || currentUser?.teacherProfile?.name || 'Cô Nguyễn Thị Hải Duyên';

  // 1. Class Selection
  const availableClasses = useMemo(() => {
    if (isSuperAdmin) return classes;
    return classes.filter(c => currentUser?.teacherProfile?.assignedClassIds?.includes(c.id));
  }, [classes, isSuperAdmin, currentUser]);

  const defaultClassId = useMemo(() => {
    if (initialAssignment?.classId) return initialAssignment.classId;
    if (initialClassId && availableClasses.some(c => c.id === initialClassId)) return initialClassId;
    return availableClasses[0]?.id || 'L3A';
  }, [initialAssignment, initialClassId, availableClasses]);

  const [selectedClassId, setSelectedClassId] = useState<string>(defaultClassId);

  // 2. Assignment Form State
  const [title, setTitle] = useState(initialAssignment?.title || '');
  const [grade, setGrade] = useState<number>(initialAssignment?.grade || 3);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(initialAssignment?.difficultyLevel || 'co_ban');
  const [topicCode, setTopicCode] = useState<string>(initialAssignment?.topicCode || 'CD06');
  const [genre, setGenre] = useState<string>(initialAssignment?.genre || 'Tả đồ vật');
  const [prompt, setPrompt] = useState(initialAssignment?.prompt || '');
  const [instructions, setInstructions] = useState(initialAssignment?.instructions || '');
  const [dueDate, setDueDate] = useState(initialAssignment?.dueDate || '');
  const [isExam, setIsExam] = useState<boolean>(Boolean(initialAssignment?.isExam));

  // 3. AI Outline Preview
  const [aiPreviewData, setAiPreviewData] = useState<PromptAnalysisData | null>(null);
  const [isAiPreviewLoading, setIsAiPreviewLoading] = useState(false);

  // 4. Student Selection for the Class
  const [studentSearch, setStudentSearch] = useState('');
  const classStudents = useMemo(() => {
    return allStudents.filter(s => (s.classId === selectedClassId || (!s.classId && selectedClassId === 'L3A')) && s.accountStatus !== 'deleted');
  }, [allStudents, selectedClassId]);

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(() => {
    if (initialAssignment?.assignedStudentIds && initialAssignment.assignedStudentIds.length > 0) {
      return initialAssignment.assignedStudentIds;
    }
    // Default to all active students in the selected class
    return classStudents.map(s => s.id);
  });

  // When class changes, update student list and select all of the new class
  const handleClassChange = (newClassId: string) => {
    setSelectedClassId(newClassId);
    const newClassStudents = allStudents.filter(s => (s.classId === newClassId || (!s.classId && newClassId === 'L3A')) && s.accountStatus !== 'deleted');
    setSelectedStudentIds(newClassStudents.map(s => s.id));
    // Auto-update grade to match class grade
    const targetClass = availableClasses.find(c => c.id === newClassId);
    if (targetClass && targetClass.grade) {
      setGrade(targetClass.grade);
    }
  };

  // Filtered students by search keyword
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return classStudents;
    const q = studentSearch.toLowerCase().trim();
    return classStudents.filter(s => 
      s.name.toLowerCase().includes(q) || 
      (s.demoName && s.demoName.toLowerCase().includes(q)) ||
      s.id.toLowerCase().includes(q)
    );
  }, [classStudents, studentSearch]);

  // Submission & validation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Select all / Deselect all
  const handleSelectAll = () => {
    playPop(settings.soundEnabled);
    setSelectedStudentIds(classStudents.map(s => s.id));
  };

  const handleDeselectAll = () => {
    playPop(settings.soundEnabled);
    setSelectedStudentIds([]);
  };

  const handleToggleStudent = (stId: string) => {
    playPop(settings.soundEnabled);
    setSelectedStudentIds(prev => 
      prev.includes(stId) ? prev.filter(id => id !== stId) : [...prev, stId]
    );
  };

  // AI Prompt analysis & outline preview
  const handlePreviewAssignmentWithAi = async () => {
    if (!prompt.trim()) return;
    setIsAiPreviewLoading(true);
    playSparkle(settings.soundEnabled);
    try {
      const res = await fetch('/api/ai/preview-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          grade: Number(grade),
          difficultyLevel
        })
      });
      const data = await res.json();
      setAiPreviewData(data);
      if (data.topicCode) setTopicCode(data.topicCode);
    } catch (e) {
      console.error('Error previewing assignment:', e);
    } finally {
      setIsAiPreviewLoading(false);
    }
  };

  // Submit Handler: Saves as Draft or Publishes as Active Assignment
  const handleSubmit = async (targetStatus: 'active' | 'draft') => {
    setErrorMessage('');
    setSuccessBanner(null);

    if (!selectedClassId) {
      setErrorMessage('Vui lòng chọn lớp học trước khi giao bài.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề bài tập.');
      return;
    }
    if (!prompt.trim()) {
      setErrorMessage('Vui lòng nhập nội dung đề bài và yêu cầu chi tiết.');
      return;
    }
    if (selectedStudentIds.length === 0) {
      setErrorMessage('Bắt buộc phải chọn ít nhất một học sinh nhận bài.');
      return;
    }

    setIsSubmitting(true);
    playChime(settings.soundEnabled);

    try {
      const currentTopicObj = TOPIC_GROUPS.find(t => t.code === topicCode);
      const isEditing = Boolean(initialAssignment?.id);
      const endpoint = isEditing ? '/api/teacher/assignments/update' : '/api/teacher/assignments/create';

      const payload = {
        ...(isEditing ? { id: initialAssignment?.id } : {}),
        classId: selectedClassId,
        title: title.trim(),
        grade: Number(grade),
        genre,
        difficultyLevel,
        topicCode,
        topicName: currentTopicObj?.name || 'Chủ đề GDPT 2018',
        prompt: prompt.trim(),
        instructions: instructions.trim() || undefined,
        dueDate: dueDate || undefined,
        isExam,
        assignedStudentIds: selectedStudentIds,
        status: targetStatus,
        customOutline: aiPreviewData?.outline || undefined
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.assignment) {
        const className = availableClasses.find(c => c.id === selectedClassId)?.name || selectedClassId;
        const msg = targetStatus === 'draft'
          ? `✓ Đã lưu bản nháp bài tập "${data.assignment.title}" thành công!`
          : `✓ Đã giao bài tập "${data.assignment.title}" cho ${selectedStudentIds.length} học sinh ${className}! Bài tập đã có hiệu lực trên toàn hệ thống.`;
        setSuccessBanner(msg);

        setTimeout(() => {
          onSuccess(data.assignment, targetStatus === 'draft');
        }, 1500);
      } else {
        setErrorMessage(data.message || 'Không thể lưu bài tập. Vui lòng thử lại.');
      }
    } catch (err) {
      setErrorMessage('Đã xảy ra lỗi kết nối với máy chủ khi giao bài.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in font-sans">
      {/* Top Header Bar */}
      <div className="bg-white p-5 rounded-3xl border-2 border-emerald-300 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playPop(settings.soundEnabled);
              onBack();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-sm sm:text-base border border-stone-300 transition-all cursor-pointer"
            title="Quay lại danh sách bài tập"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-800" />
            <span>Quay lại</span>
          </button>

          <div>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              {initialAssignment ? 'CHỈNH SỬA BÀI TẬP' : 'TRANG GIAO BÀI TẬP MỚI'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-display mt-0.5">
              {initialAssignment ? `Chỉnh sửa: ${initialAssignment.title}` : 'Giao Bài Tập Tiếng Việt Mới'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Người giao: <strong className="text-stone-900">{teacherName}</strong> • Chuẩn GDPT 2018 (Khối 1–5)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSubmitting || selectedStudentIds.length === 0}
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-sm sm:text-base flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Lưu lại dạng bản nháp để hoàn thiện sau"
          >
            <Save className="w-4 h-4 text-amber-700" />
            <span>Lưu nháp</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting || selectedStudentIds.length === 0}
            onClick={() => handleSubmit('active')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm sm:text-base shadow-md transition-all hover:scale-102 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang giao...' : 'Giao bài tập'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation & Alert Banners */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-3xl text-emerald-950 font-bold text-base flex items-center gap-3 animate-fade-in shadow-xs">
          <span className="text-2xl">🎉</span>
          <span>{successBanner}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-3xl text-rose-900 font-bold text-base flex items-center gap-3 animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="space-y-6">
        {/* ================= PHẦN 1: THÔNG TIN CHUNG BÀI TẬP ================= */}
        <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <span className="text-2xl">📋</span>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 font-display">
              1. Thông Tin Chung Bài Tập
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-extrabold text-stone-800 mb-1.5">
                Tiêu đề bài tập <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ví dụ: Tả một đồ dùng học tập gắn bó với em hàng ngày"
                className="w-full p-3.5 rounded-2xl border-2 border-stone-200 text-base sm:text-lg focus:border-emerald-500 focus:outline-hidden font-medium bg-stone-50/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                  Khối lớp (1–5) <span className="text-rose-500">*</span>:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        playPop(settings.soundEnabled);
                        setGrade(g);
                      }}
                      className={`py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${
                        grade === g 
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
                <label className="block text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                  Mức độ thử thách:
                </label>
                <select
                  value={difficultyLevel}
                  onChange={e => setDifficultyLevel(e.target.value as DifficultyLevel)}
                  className="w-full p-3 rounded-2xl border-2 border-stone-200 text-sm sm:text-base bg-white font-medium focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="co_ban">🌱 Cơ bản (Chuẩn SGK)</option>
                  <option value="mo_rong">🌿 Mở rộng (Quan sát phong phú)</option>
                  <option value="nang_cao">⭐ Nâng cao (Từ ngữ gợi cảm & nghệ thuật)</option>
                  <option value="sang_tao">✨ Sáng tạo (Tư duy mới lạ, bứt phá)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                  Thể loại bài viết:
                </label>
                <select
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                  className="w-full p-3 rounded-2xl border-2 border-stone-200 text-sm sm:text-base bg-white font-medium focus:border-emerald-500 focus:outline-hidden"
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
              <label className="block text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                Chủ đề GDPT 2018 (25 nhóm chủ đề tích hợp):
              </label>
              <select
                value={topicCode}
                onChange={e => setTopicCode(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-stone-200 text-sm sm:text-base bg-white font-medium focus:border-emerald-500 focus:outline-hidden"
              >
                {TOPIC_GROUPS.map(t => (
                  <option key={t.code} value={t.code}>
                    {t.code}: {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ================= PHẦN 2: ĐỀ BÀI & YÊU CẦU CHI TIẾT ================= */}
        <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✍️</span>
              <h3 className="text-lg sm:text-xl font-black text-stone-900 font-display">
                2. Đề Bài & Yêu Cầu Chi Tiết
              </h3>
            </div>

            <button
              type="button"
              onClick={handlePreviewAssignmentWithAi}
              disabled={isAiPreviewLoading || !prompt.trim()}
              className="text-xs sm:text-sm font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAiPreviewLoading ? 'animate-spin text-purple-600' : ''}`} />
              <span>{isAiPreviewLoading ? 'Đang phân tích...' : '🔍 Xem trước sơ đồ & dàn ý AI'}</span>
            </button>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-bold text-stone-800 mb-1.5">
              Nội dung đề bài chi tiết <span className="text-rose-500">*</span>:
            </label>
            <textarea
              rows={4}
              required
              value={prompt}
              onChange={e => {
                setPrompt(e.target.value);
                setAiPreviewData(null);
              }}
              placeholder="Ví dụ: Viết một đoạn văn từ 5 đến 7 câu tả một đồ dùng học tập gắn bó với em hàng ngày. Chú ý miêu tả hình dáng, màu sắc, công dụng và tình cảm nâng niu của em đối với đồ dùng đó."
              className="w-full p-3.5 rounded-2xl border-2 border-stone-200 text-sm sm:text-base leading-relaxed focus:border-emerald-500 focus:outline-hidden font-medium bg-stone-50/40"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-bold text-stone-800 mb-1.5">
              Lời dặn dò / Hướng dẫn của giáo viên (tùy chọn):
            </label>
            <input
              type="text"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Ví dụ: Các em nhớ kiểm tra kỹ dấu chấm câu và viết hoa đầu câu nhé!"
              className="w-full p-3 rounded-2xl border-2 border-stone-200 text-sm sm:text-base focus:border-emerald-500 focus:outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-sm sm:text-base font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-stone-500" />
                <span>Hạn nộp bài (không bắt buộc):</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-stone-200 text-sm sm:text-base bg-white focus:border-emerald-500 focus:outline-hidden font-medium"
              />
            </div>
          </div>

          {/* AI PREVIEW CARD */}
          {aiPreviewData && (
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-3xl space-y-3 animate-fade-in text-sm">
              <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                <span className="font-extrabold text-purple-950 flex items-center gap-1.5 text-base">
                  <span>🌸</span>
                  <span>Kết quả phân tích đề bài & Bản đồ ý tưởng</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300">
                  ✓ Đạt 20/20 tiêu chuẩn GDPT 2018
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-white/90 p-2.5 rounded-2xl border border-purple-100">
                  <strong className="text-purple-900 block font-bold">Đối tượng chính:</strong>
                  <span className="text-stone-800">{aiPreviewData.mainObject || aiPreviewData.coreSubject}</span>
                </div>
                <div className="bg-white/90 p-2.5 rounded-2xl border border-purple-100">
                  <strong className="text-purple-900 block font-bold">Chủ đề & Thể loại:</strong>
                  <span className="text-stone-800">{aiPreviewData.topicName} • {aiPreviewData.writingFormat}</span>
                </div>
              </div>

              {aiPreviewData.branches && aiPreviewData.branches.length > 0 && (
                <div className="bg-white/90 p-3 rounded-2xl border border-purple-100 space-y-1.5">
                  <strong className="text-purple-900 block font-bold text-xs sm:text-sm">
                    5 nhánh gợi mở tư duy cho học sinh:
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {aiPreviewData.branches.map((b, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs">
                        {b.icon} {b.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs sm:text-sm text-purple-900 italic font-medium bg-purple-100/50 p-2.5 rounded-xl border border-purple-200">
                "{aiPreviewData.hoaNhoUnderstand}"
              </p>
            </div>
          )}
        </div>

        {/* ================= PHẦN 3: HÌNH THỨC ĐÁNH GIÁ ================= */}
        <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <span className="text-2xl">🏆</span>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 font-display">
              3. Hình Thức Đánh Giá
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => {
                playPop(settings.soundEnabled);
                setIsExam(false);
              }}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer space-y-2 ${
                !isExam 
                  ? 'bg-emerald-50/80 border-emerald-500 shadow-xs ring-2 ring-emerald-200' 
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🌸</span>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  !isExam ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-400 bg-white'
                }`}>
                  {!isExam && <Check className="w-3.5 h-3.5" />}
                </span>
              </div>
              <h4 className="font-extrabold text-base sm:text-lg text-emerald-950">
                Bài Luyện Tập Thường Xuyên
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                Đánh giá bằng nhận xét khích lệ, chấm hoa khen thưởng và gợi mở phát triển kỹ năng viết theo GDPT 2018 (Không cho điểm số).
              </p>
            </div>

            <div
              onClick={() => {
                playPop(settings.soundEnabled);
                setIsExam(true);
              }}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer space-y-2 ${
                isExam 
                  ? 'bg-amber-50/80 border-amber-500 shadow-xs ring-2 ring-amber-200' 
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">⭐</span>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isExam ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-400 bg-white'
                }`}>
                  {isExam && <Check className="w-3.5 h-3.5" />}
                </span>
              </div>
              <h4 className="font-extrabold text-base sm:text-lg text-amber-950">
                Bài Kiểm Tra Định Kỳ
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                Đánh giá tổng kết định kỳ theo <strong>Thang điểm 10</strong> (Điểm số nguyên từ 1 đến 10) kèm nhận xét chi tiết của giáo viên.
              </p>
            </div>
          </div>
        </div>

        {/* ================= PHẦN 4: CHỌN LỚP & HỌC SINH NHẬN BÀI ================= */}
        <div className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-emerald-950 font-display">
                  4. Chọn Lớp Học & Học Sinh Nhận Bài
                </h3>
                <p className="text-xs text-stone-600 font-medium">
                  Bắt buộc chọn lớp trước, sau đó chọn các em học sinh sẽ nhận bài tập này.
                </p>
              </div>
            </div>

            {/* Selected Count Badge */}
            <div className={`px-4 py-2 rounded-2xl font-black text-sm sm:text-base border ${
              selectedStudentIds.length > 0 
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                : 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse'
            }`}>
              <span>Đã chọn: </span>
              <span className="text-lg">{selectedStudentIds.length}</span>
              <span> / {classStudents.length} học sinh</span>
            </div>
          </div>

          {/* Class Selector Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm sm:text-base font-extrabold text-stone-800 mb-1.5">
                Lớp học phụ trách <span className="text-rose-500">*</span>:
              </label>
              <select
                value={selectedClassId}
                onChange={e => handleClassChange(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-emerald-300 text-sm sm:text-base font-bold bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                {availableClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} (Khối {cls.grade} – {cls.studentCount || 0} học sinh)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-bold text-stone-800 mb-1.5">
                Tìm kiếm nhanh học sinh:
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc mã HS..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border-2 border-stone-200 text-sm sm:text-base focus:border-emerald-500 focus:outline-hidden bg-stone-50/50"
                />
              </div>
            </div>
          </div>

          {/* Select All / Deselect All Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Chọn cả lớp ({classStudents.length} em)</span>
              </button>

              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Square className="w-4 h-4 text-stone-400" />
                <span>Bỏ chọn tất cả</span>
              </button>
            </div>

            {selectedStudentIds.length === 0 && (
              <span className="text-xs sm:text-sm font-bold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>Cô cần chọn ít nhất 1 học sinh để có thể giao bài.</span>
              </span>
            )}
          </div>

          {/* Student Roster Grid with Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1 pt-1 border border-stone-100 p-2 rounded-2xl bg-stone-50/40">
            {filteredStudents.map((st, idx) => {
              const isChecked = selectedStudentIds.includes(st.id);
              return (
                <div
                  key={st.id}
                  onClick={() => handleToggleStudent(st.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-400 shadow-2xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-stone-400 w-5 text-right shrink-0">
                      {idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-lg shrink-0">
                      {st.avatar || '🌸'}
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-sm sm:text-base text-stone-900 truncate">
                        {settings.demoPrivacyMode ? st.demoName : st.name}
                      </h4>
                      <span className="text-xs text-stone-500 font-mono">
                        {st.id}
                      </span>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                    isChecked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}

            {filteredStudents.length === 0 && (
              <div className="col-span-full p-6 text-center text-stone-400 bg-white rounded-2xl border border-dashed border-stone-200 text-sm">
                Không tìm thấy học sinh nào phù hợp trong lớp này.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              playPop(settings.soundEnabled);
              onBack();
            }}
            className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-sm sm:text-base border border-stone-300 transition-colors cursor-pointer"
          >
            ← Quay lại danh sách
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting || selectedStudentIds.length === 0}
              onClick={() => handleSubmit('draft')}
              className="px-5 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-amber-700" />
              <span>Lưu bản nháp</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting || selectedStudentIds.length === 0}
              onClick={() => handleSubmit('active')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm sm:text-base shadow-md transition-all hover:scale-102 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Đang giao bài...' : 'Giao bài tập'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
