import React, { useState, useEffect, useRef } from 'react';
import { 
  Student, 
  WritingTask, 
  Submission, 
  ChatMessage, 
  OutlineItem, 
  AIFeedback, 
  AppSettings,
  GardenType,
  EssayGenre
} from '../types';
import { CURRICULUM_TASKS, GARDEN_INFOS } from '../data/curriculumData';
import { OTHER_CREATIVE_TOPICS, OTHER_TOPICS_CATEGORIES } from '../data/otherTopicsData';
import { TEACHER_CONFIG } from '../constants/teacherConfig';
import { HoaNhoMascot } from './HoaNhoMascot';
import { playPop, playChime, playSparkle } from '../utils/audio';
import { getStudentGreeting } from '../utils/timeGreeting';
import { 
  BookOpen, 
  Pencil, 
  Sparkles, 
  Send, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  Star, 
  Trees, 
  Clock, 
  Award, 
  RotateCcw,
  Volume2,
  Compass,
  Palette
} from 'lucide-react';

interface StudentPortalProps {
  student: Student;
  settings: AppSettings;
  onUpdateStudent: (updatedStudent: Student) => void;
  onBackToGarden: () => void;
  onOpenProgressGarden: () => void;
  onOpenReadingGarden: () => void;
  onGoToIdeaMap?: (prompt: string, grade: number, genre: EssayGenre) => void;
}

type StudentStep = 'choose_task' | 'brainstorm' | 'outline' | 'write' | 'feedback' | 'success';

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  settings,
  onUpdateStudent,
  onBackToGarden,
  onOpenProgressGarden,
  onOpenReadingGarden,
  onGoToIdeaMap
}) => {
  // Navigation & Workflow state
  const [currentStep, setCurrentStep] = useState<StudentStep>('choose_task');
  const [activeMainTab, setActiveMainTab] = useState<'volume1' | 'volume2' | 'other_topics' | 'my_submissions'>('volume1');
  const [selectedVolume, setSelectedVolume] = useState<1 | 2>(1);
  const [selectedGardenFilter, setSelectedGardenFilter] = useState<GardenType | 'all'>('all');
  const [selectedOtherCategory, setSelectedOtherCategory] = useState<string>('all');
  const [activeTask, setActiveTask] = useState<WritingTask | null>(null);
  const [isIndependentMode, setIsIndependentMode] = useState<boolean>(false);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);

  // Fetch student submissions for the authenticated student
  const fetchMySubmissions = async () => {
    try {
      const res = await fetch(`/api/submissions?studentId=${student.id}`);
      const data = await res.json();
      setMySubmissions(data.submissions || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchMySubmissions();
  }, [student.id]);

  // Ideation (Cùng em tìm ý) state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [studentInput, setStudentInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Smart Outline (Dàn ý của em) state
  const [initialOutline, setInitialOutline] = useState<OutlineItem[]>([]);
  const [currentOutline, setCurrentOutline] = useState<OutlineItem[]>([]);
  const [newOutlineItemText, setNewOutlineItemText] = useState('');

  // Writing Notebook (Trang viết của em) state
  const [essayContent, setEssayContent] = useState('');
  const [firstDraftContent, setFirstDraftContent] = useState('');
  const [draftVersions, setDraftVersions] = useState<{ version: number; content: string; timestamp: string }[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [writingHint, setWritingHint] = useState<string>('');

  // AI Feedback state
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [revisionSub, setRevisionSub] = useState<Submission | null>(null);

  const handleStartRevision = (sub: Submission) => {
    playSparkle(settings.soundEnabled);
    setRevisionSub(sub);
    const matched = CURRICULUM_TASKS.find(t => t.id === sub.taskId);
    if (matched) {
      setActiveTask(matched);
    } else {
      setActiveTask({
        id: sub.taskId,
        volume: sub.volume || 1,
        week: 1,
        title: sub.taskTitle,
        gardenType: sub.gardenType,
        prompt: sub.taskTitle,
        suggestedQuestions: ['Bản sửa mới theo góp ý của cô giáo.'],
        evaluationCriteria: ['Bám sát lời dặn dò của cô', 'Dùng từ ngữ sinh động', 'Cảm xúc tự nhiên']
      });
    }
    setEssayContent(sub.finalContent);
    setFirstDraftContent(sub.firstDraft || sub.finalContent);
    setCurrentOutline(sub.developedOutline && sub.developedOutline.length > 0 ? sub.developedOutline : sub.initialOutline || []);
    setIsIndependentMode(sub.isIndependentTest || false);
    setCurrentStep('write');
  };

  // Filter tasks
  const filteredTasks = CURRICULUM_TASKS.filter(t => {
    const matchVolume = t.volume === (activeMainTab === 'volume2' ? 2 : 1);
    const matchGarden = selectedGardenFilter === 'all' || t.gardenType === selectedGardenFilter;
    return matchVolume && matchGarden;
  });

  const filteredOtherTopics = OTHER_CREATIVE_TOPICS.filter(t => {
    if (selectedOtherCategory === 'all') return true;
    return t.category === selectedOtherCategory;
  });

  // Action: "🌸 Luyện viết với Hoa Nhỏ" -> Go directly to Trang 1 (Bản đồ ý tưởng)
  const handlePracticeWithHoaNho = (prompt: string, genre: EssayGenre = 'ke_su_viec', task?: WritingTask) => {
    playSparkle(settings.soundEnabled);
    if (onGoToIdeaMap) {
      onGoToIdeaMap(prompt, 3, genre);
    } else if (task) {
      handleSelectTask(task, false);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiLoading]);

  // Auto-save draft every 15 seconds while writing
  useEffect(() => {
    if (currentStep !== 'write' || !activeTask || !essayContent.trim()) return;

    const timer = setTimeout(() => {
      saveDraftSilently();
    }, 15000);

    return () => clearTimeout(timer);
  }, [essayContent, currentStep]);

  // Start a new task
  const handleSelectTask = (task: WritingTask, independent: boolean = false) => {
    playPop(settings.soundEnabled);
    setActiveTask(task);
    setIsIndependentMode(independent);
    setSubmissionId(`sub-${Date.now()}`);

    if (independent) {
      // Independent Test: bypass brainstorming, go directly to writing
      setEssayContent('');
      setInitialOutline([]);
      setCurrentOutline([]);
      setCurrentStep('write');
    } else {
      // Practice Mode with Hoa Nho
      setCurrentStep('brainstorm');
      const initialGreeting: ChatMessage = {
        id: 'msg-1',
        sender: 'hoanho',
        text: `Chào ${student.name.split(' ').pop()}! Chúng mình cùng viết về đề "${task.title}" nhé. ${task.suggestedQuestions[0] || 'Em muốn kể về điều gì đầu tiên nào?'}`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([initialGreeting]);
      setEssayContent('');
      setFirstDraftContent('');
      setDraftVersions([]);
      setAiFeedback(null);
    }
  };

  // Student sends an idea to Hoa Nho
  const handleSendIdea = async () => {
    if (!studentInput.trim() || isAiLoading || !activeTask) return;

    playPop(settings.soundEnabled);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: studentInput.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    const sentInput = studentInput.trim();
    setStudentInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/ask-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: activeTask.title,
          prompt: activeTask.prompt,
          chatHistory: newHistory,
          studentInput: sentInput,
          studentName: student.name
        })
      });

      const data = await res.json();
      const hoanhoMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'hoanho',
        text: data.question || 'Em kể tiếp cho Hoa Nhỏ nghe nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...newHistory, hoanhoMsg]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'hoanho',
        text: 'Hoa Nhỏ đang lắng nghe em đây. Em có muốn bấm "Xếp ý giúp em" để chúng mình lập dàn ý không?',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...newHistory, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Synthesize Outline from brainstorming
  const handleSynthesizeOutline = async () => {
    if (!activeTask) return;
    playChime(settings.soundEnabled);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/synthesize-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: activeTask.title,
          gardenType: activeTask.gardenType,
          chatHistory: chatMessages
        })
      });

      const data = await res.json();
      const outline = data.outline || [];
      setInitialOutline(outline);
      setCurrentOutline(outline);
      setCurrentStep('outline');
    } catch (e) {
      // Default outline
      const fallback = [
        { id: '1', section: 'Mở đoạn', content: 'Giới thiệu điều em muốn viết.' },
        { id: '2', section: 'Thân đoạn', content: 'Kể hoặc tả chi tiết nổi bật nhất.' },
        { id: '3', section: 'Kết đoạn', content: 'Cảm xúc và mong ước của em.' }
      ];
      setInitialOutline(fallback);
      setCurrentOutline(fallback);
      setCurrentStep('outline');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Add / Edit / Remove Outline Items
  const handleAddOutlineItem = () => {
    if (!newOutlineItemText.trim()) return;
    playPop(settings.soundEnabled);
    const newItem: OutlineItem = {
      id: `out-${Date.now()}`,
      section: 'Ý bổ sung',
      content: newOutlineItemText.trim()
    };
    setCurrentOutline([...currentOutline, newItem]);
    setNewOutlineItemText('');
  };

  const handleUpdateOutlineItem = (id: string, newContent: string) => {
    setCurrentOutline(currentOutline.map(item => item.id === id ? { ...item, content: newContent } : item));
  };

  const handleDeleteOutlineItem = (id: string) => {
    playPop(settings.soundEnabled);
    setCurrentOutline(currentOutline.filter(item => item.id !== id));
  };

  // Move to writing step
  const handleStartWriting = () => {
    playSparkle(settings.soundEnabled);
    setCurrentStep('write');
  };

  // Save draft
  const saveDraftSilently = async () => {
    if (!activeTask || !essayContent.trim()) return;

    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: submissionId,
          studentId: student.id,
          taskId: activeTask.id,
          taskTitle: activeTask.title,
          gardenType: activeTask.gardenType,
          volume: activeTask.volume,
          isIndependentTest: isIndependentMode,
          initialOutline,
          developedOutline: currentOutline,
          firstDraft: firstDraftContent || essayContent,
          finalContent: essayContent,
          status: 'draft'
        })
      });
      setSaveStatus('Đã tự động giữ bản nháp');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {}
  };

  const handleManualSaveDraft = () => {
    playPop(settings.soundEnabled);
    if (!firstDraftContent && essayContent) {
      setFirstDraftContent(essayContent);
    }
    saveDraftSilently();
    setSaveStatus('Đã giữ bản nháp an toàn!');
  };

  // Request a gentle hint from Hoa Nho
  const handleGetHint = async () => {
    if (!activeTask || isAiLoading) return;
    playPop(settings.soundEnabled);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: activeTask.title,
          currentText: essayContent,
          currentSection: 'Thân đoạn'
        })
      });
      const data = await res.json();
      setWritingHint(data.hint || 'Em hãy đọc lại câu trước xem mình muốn kể thêm việc gì tiếp theo nhé!');
    } catch (e) {
      setWritingHint('Em hãy thêm một hình ảnh hoặc âm thanh để câu văn thêm sinh động nhé!');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Student finished writing, request AI feedback
  const handleFinishedWriting = async () => {
    if (!essayContent.trim() || !activeTask) return;

    playChime(settings.soundEnabled);
    if (!firstDraftContent) {
      setFirstDraftContent(essayContent);
    }

    if (isIndependentMode) {
      // In independent test: skip AI feedback, submit directly to teacher!
      handleSubmitToTeacher(null);
      return;
    }

    setIsAiLoading(true);
    setCurrentStep('feedback');

    try {
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: activeTask.title,
          prompt: activeTask.prompt,
          studentText: essayContent
        })
      });
      const data = await res.json();
      setAiFeedback(data);
    } catch (e) {
      setAiFeedback({
        flowerPraise: 'Em đã hoàn thành một đoạn văn rất đúng yêu cầu đề bài và giàu tình cảm!',
        leafReminder: 'Em hãy đọc to lại bài một lần để kiểm tra dấu chấm câu ở cuối mỗi câu nhé.',
        smallChallenge: 'Em có muốn viết thêm 1 câu bộc lộ cảm xúc sâu sắc hơn ở phần kết bài không?',
        suggestedStars: 5,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Submit final version to teacher
  const handleSubmitToTeacher = async (feedbackData: AIFeedback | null = aiFeedback) => {
    if (!activeTask) return;
    playSparkle(settings.soundEnabled);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: submissionId,
          studentId: student.id,
          taskId: activeTask.id,
          taskTitle: activeTask.title,
          gardenType: activeTask.gardenType,
          volume: activeTask.volume,
          isIndependentTest: isIndependentMode,
          initialOutline,
          developedOutline: currentOutline,
          firstDraft: firstDraftContent || essayContent,
          finalContent: essayContent,
          aiFeedback: feedbackData,
          status: 'submitted'
        })
      });

      if (res.ok) {
        // Update local student progress
        const updatedStudent: Student = {
          ...student,
          flowersEarned: student.flowersEarned + 1,
          starsEarned: student.starsEarned + 3,
          treeLevel: Math.min(5, Math.floor((student.flowersEarned + 1) / 3) + 1)
        };
        onUpdateStudent(updatedStudent);
      }
    } catch (e) {}

    setCurrentStep('success');
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Student Welcome & Garden Status Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-rose-50 to-emerald-100 rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playPop(settings.soundEnabled);
              onBackToGarden();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-amber-900 border-2 border-amber-300 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-102"
            title="Quay lại vườn hoa chính"
          >
            <ArrowLeft className="w-4 h-4 text-amber-700" />
            <span>← Quay lại</span>
          </button>

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-amber-400 flex items-center justify-center text-2xl sm:text-3xl shadow-xs">
            {student.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                Góc của em
              </span>
              <span className="text-xs text-stone-500 font-bold">Mã số: {student.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-display">
              {settings.demoPrivacyMode ? student.demoName : student.name}
            </h2>
          </div>
        </div>

        {/* Progress pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenProgressGarden}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all"
            title="Bấm để ngắm cây hoa lớn lên"
          >
            <Trees className="w-4 h-4 text-emerald-600" />
            <span>Cây nở hoa: Cấp {student.treeLevel}/5</span>
            <span className="px-2 py-0.5 bg-emerald-100 rounded-full text-emerald-900 font-extrabold">
              {student.flowersEarned} 🌸
            </span>
          </button>

          <button
            onClick={onOpenReadingGarden}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 hover:bg-white text-amber-800 border border-amber-300 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all"
            title="Đọc văn mẫu lớp 3"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Vườn đọc</span>
          </button>
        </div>
      </div>

      {/* Hoa Nhỏ Student Personalized Greeting */}
      <div className="mb-6 flex justify-start">
        <HoaNhoMascot
          mood="happy"
          size="sm"
          reducedMotion={settings.reducedMotion}
          message={getStudentGreeting(settings.demoPrivacyMode ? student.demoName : student.name, student.flowersEarned)}
        />
      </div>

      {/* ================= STEP 1: CHOOSE TASK ================= */}
      {currentStep === 'choose_task' && (
        <div className="space-y-6 animate-fade-in">
          {/* Main 4 Tabs Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-3xl border-2 border-stone-200">
            {/* 4 Main Tab Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setActiveMainTab('volume1'); setSelectedVolume(1); playPop(settings.soundEnabled); }}
                className={`px-3.5 sm:px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                  activeMainTab === 'volume1'
                    ? 'bg-amber-400 text-amber-950 shadow-sm border border-amber-500'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                📘 Tập 1 (15 bài SGK)
              </button>
              <button
                onClick={() => { setActiveMainTab('volume2'); setSelectedVolume(2); playPop(settings.soundEnabled); }}
                className={`px-3.5 sm:px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                  activeMainTab === 'volume2'
                    ? 'bg-emerald-500 text-white shadow-sm border border-emerald-600'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                📗 Tập 2 (17 bài SGK)
              </button>
              <button
                onClick={() => { setActiveMainTab('other_topics'); playSparkle(settings.soundEnabled); }}
                className={`px-3.5 sm:px-4 py-2 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                  activeMainTab === 'other_topics'
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 text-white shadow-md'
                    : 'bg-pink-50 text-purple-900 hover:bg-pink-100 border border-pink-200'
                }`}
              >
                <span>🌈</span>
                <span>CÁC CHỦ ĐỀ KHÁC</span>
              </button>
              <button
                onClick={() => { setActiveMainTab('my_submissions'); playPop(settings.soundEnabled); }}
                className={`px-3.5 sm:px-4 py-2 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                  activeMainTab === 'my_submissions'
                    ? 'bg-rose-500 text-white shadow-md border border-rose-600'
                    : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <span>🌸</span>
                <span>Bài của em & Lời cô giáo ({mySubmissions.length})</span>
              </button>
            </div>

            {/* Filter Pills (only when in volume 1 & 2) */}
            {activeMainTab === 'volume1' || activeMainTab === 'volume2' ? (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedGardenFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedGardenFilter === 'all'
                      ? 'bg-stone-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Tất cả vườn
                </button>
                {(Object.keys(GARDEN_INFOS) as GardenType[]).map(key => (
                  <button
                    key={key}
                    onClick={() => { setSelectedGardenFilter(key); playPop(settings.soundEnabled); }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                      selectedGardenFilter === key
                        ? 'bg-amber-200 text-amber-900 border border-amber-400'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span>{GARDEN_INFOS[key].icon}</span>
                    <span className="hidden sm:inline">{GARDEN_INFOS[key].name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedOtherCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedOtherCategory === 'all'
                      ? 'bg-purple-700 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-purple-50'
                  }`}
                >
                  Tất cả ({OTHER_CREATIVE_TOPICS.length})
                </button>
                {OTHER_TOPICS_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedOtherCategory(cat.id); playPop(settings.soundEnabled); }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                      selectedOtherCategory === cat.id
                        ? 'bg-purple-100 text-purple-900 border border-purple-300 font-extrabold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="hidden md:inline">{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Intro instruction from Hoa Nho */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 flex items-center gap-4">
            <HoaNhoMascot mood="happy" size="sm" reducedMotion={settings.reducedMotion} />
            <div>
              <h3 className="font-bold text-amber-950 text-base sm:text-lg font-display">
                {activeMainTab === 'other_topics' ? 'Khám phá 24 chủ đề sáng tạo mở rộng!' : 'Em chọn bài viết hôm nay nhé!'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 font-medium">
                {activeMainTab === 'other_topics'
                  ? 'Bấm "🌸 Luyện viết với Hoa Nhỏ" để lập tức mở Bản đồ ý tưởng (Trang 1) với dàn ý chi tiết và ngân hàng từ ngữ sinh động!'
                  : 'Em có thể chọn "🌸 Luyện viết với Hoa Nhỏ" để bắt đầu tìm ý và lập dàn ý 3 phần, hoặc chọn "⭐ Em tự thử sức" để tự mình viết độc lập.'}
              </p>
            </div>
          </div>

          {/* TASKS GRID: Either Curriculum Tasks, Other Creative Topics, or My Submissions */}
          {activeMainTab === 'my_submissions' ? (
            <div className="space-y-4">
              {mySubmissions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-3xl border-2 border-rose-200 p-5 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 pb-2.5">
                    <div>
                      <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                        {sub.taskTitle}
                      </span>
                      <div className="text-xs text-stone-500 font-medium">
                        Ngày làm: {new Date(sub.startedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${
                      sub.teacherFeedback?.status === 'published'
                        ? 'bg-emerald-600 text-white'
                        : sub.status === 'submitted'
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {sub.teacherFeedback?.status === 'published' 
                        ? '✓ ĐÃ CÓ LỜI NHẬN XÉT CỦA CÔ' 
                        : sub.status === 'submitted' 
                        ? '⏳ ĐÃ NỘP - CHỜ CÔ XEM' 
                        : '📝 BÀI ĐANG LÀM'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 text-stone-800 text-sm sm:text-base font-medium leading-relaxed italic">
                    "{sub.finalContent}"
                  </div>

                  {sub.teacherFeedback && sub.teacherFeedback.status === 'published' ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                          <span>👩‍🏫</span>
                          <span>Lời cô giáo ({sub.teacherFeedback.teacherName || TEACHER_CONFIG.name}):</span>
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                          {sub.teacherFeedback.flowerSticker || '🌸 Bông hoa chăm ngoan'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-stone-800 italic bg-white p-2.5 rounded-xl border border-emerald-100">
                        "{sub.teacherFeedback.comment}"
                      </p>
                      {/* Qualitative criteria details */}
                      {(sub.teacherFeedback.praiseIdea || sub.teacherFeedback.wordSentenceSuggestions || sub.teacherFeedback.emotionCreativityEncouragement || sub.teacherFeedback.teacherAdvice) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                          {sub.teacherFeedback.praiseIdea && (
                            <div className="bg-rose-50/80 p-2 rounded-xl border border-rose-200">
                              <span className="font-bold text-rose-800 block">🌸 Ý tưởng hay:</span>
                              <p className="text-stone-700">{sub.teacherFeedback.praiseIdea}</p>
                            </div>
                          )}
                          {sub.teacherFeedback.wordSentenceSuggestions && (
                            <div className="bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
                              <span className="font-bold text-emerald-800 block">✏️ Góp ý câu từ:</span>
                              <p className="text-stone-700">{sub.teacherFeedback.wordSentenceSuggestions}</p>
                            </div>
                          )}
                          {sub.teacherFeedback.emotionCreativityEncouragement && (
                            <div className="bg-amber-50/80 p-2 rounded-xl border border-amber-200">
                              <span className="font-bold text-amber-800 block">💖 Khích lệ cảm xúc:</span>
                              <p className="text-stone-700">{sub.teacherFeedback.emotionCreativityEncouragement}</p>
                            </div>
                          )}
                          {sub.teacherFeedback.teacherAdvice && (
                            <div className="bg-purple-50/80 p-2 rounded-xl border border-purple-200">
                              <span className="font-bold text-purple-800 block">💌 Lời dặn dò của cô:</span>
                              <p className="text-stone-700">{sub.teacherFeedback.teacherAdvice}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Step 5: Viết bản sửa mới theo lời dặn của cô */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleStartRevision(sub)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-sm hover:shadow-md transition-all hover:scale-102"
                          title="Tạo bản sửa mới theo hướng dẫn của cô"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Viết bản sửa mới (Bản số {(sub.drafts?.length || 1) + 1})</span>
                        </button>
                      </div>
                    </div>
                  ) : sub.status === 'submitted' ? (
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                      Bài của em đã được gửi an toàn đến cô giáo. Cô đang đọc và sẽ sớm gửi lời nhận xét cùng hoa thưởng cho em nhé!
                    </div>
                  ) : null}
                </div>
              ))}

              {mySubmissions.length === 0 && (
                <div className="bg-white rounded-3xl border-2 border-dashed border-stone-300 p-8 text-center text-stone-500 text-sm">
                  Em chưa có bài viết nào đã nộp. Em hãy bấm sang thẻ <strong>📘 Tập 1</strong> hoặc <strong>📗 Tập 2</strong> để chọn bài và cùng Hoa Nhỏ gieo hạt ý tưởng nhé!
                </div>
              )}
            </div>
          ) : activeMainTab === 'other_topics' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOtherTopics.map((item) => {
                const categoryObj = OTHER_TOPICS_CATEGORIES.find(c => c.id === item.category);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border-2 border-purple-200 hover:border-pink-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                          <span>{item.categoryIcon || categoryObj?.icon || '🌸'}</span>
                          <span>{categoryObj?.name || 'Sáng tạo'}</span>
                        </span>
                        <span className="text-[11px] font-bold text-stone-400">
                          Chủ đề sáng tạo
                        </span>
                      </div>

                    <h4 className="text-base sm:text-lg font-bold text-stone-900 mb-2 font-display">
                      {item.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 mb-4 leading-relaxed font-medium bg-stone-50/60 p-2.5 rounded-2xl border border-stone-100">
                      {item.prompt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-purple-50">
                    <button
                      onClick={() => handlePracticeWithHoaNho(item.prompt, item.suggestedGenre)}
                      className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-200" />
                      <span>🌸 Luyện viết với Hoa Nhỏ</span>
                    </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => {
                const garden = GARDEN_INFOS[task.gardenType];
                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-3xl border-2 border-stone-200 hover:border-amber-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Garden badge & week */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${garden.bgLight} ${garden.color} border ${garden.border}`}>
                          <span>{garden.icon}</span>
                          <span>{garden.name}</span>
                        </span>
                        <span className="text-xs font-bold text-stone-400">
                          Tuần {task.week} • {task.textbookRef || 'Tiếng Việt 3'}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-stone-900 mb-2 font-display">
                        {task.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                        {task.prompt}
                      </p>
                    </div>

                    {/* Two Action Buttons: Practice with AI or Independent Test */}
                    <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                      <button
                        onClick={() => handlePracticeWithHoaNho(task.prompt, 'ke_su_viec', task)}
                        className="flex-1 py-2.5 px-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>🌸 Luyện viết với Hoa Nhỏ</span>
                      </button>
                      <button
                        onClick={() => handleSelectTask(task, true)}
                        className="py-2.5 px-3 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1"
                        title="Tự viết độc lập không có AI gợi mở"
                      >
                        <span>⭐ Em tự thử sức</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= STEP 2: BRAINSTORMING WITH HOA NHO ================= */}
      {currentStep === 'brainstorm' && activeTask && (
        <div className="bg-white rounded-3xl border-3 border-amber-300 p-4 sm:p-6 shadow-lg animate-fade-in space-y-4">
          {/* Header navigation */}
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <button
              onClick={() => { setCurrentStep('choose_task'); playPop(settings.soundEnabled); }}
              className="flex items-center gap-1 text-xs sm:text-sm font-bold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-full hover:bg-stone-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Chọn bài khác</span>
            </button>

            <div className="text-center">
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Bước 1: Cùng em tìm ý
              </span>
              <h3 className="text-base sm:text-lg font-bold text-amber-950 font-display mt-0.5">
                {activeTask.title}
              </h3>
            </div>

            <button
              onClick={handleSynthesizeOutline}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-500 text-amber-950 px-3.5 py-1.5 rounded-full shadow-xs transition-colors"
            >
              <span>Xếp ý giúp em</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt card */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-stone-700">
            <span className="font-bold text-amber-900">Yêu cầu đề bài: </span>
            {activeTask.prompt}
          </div>

          {/* Socratic Chat Box */}
          <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-4 min-h-[300px] max-h-[420px] overflow-y-auto space-y-3.5">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'hoanho' && (
                  <div className="flex-shrink-0 mt-1">
                    <HoaNhoMascot mood="happy" size="sm" reducedMotion={settings.reducedMotion} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                    msg.sender === 'student'
                      ? 'bg-amber-500 text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-white text-stone-800 rounded-bl-none border border-amber-200 shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[10px] mt-1 ${msg.sender === 'student' ? 'text-amber-100' : 'text-stone-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'student' && (
                  <div className="w-8 h-8 rounded-full bg-amber-400 border border-amber-500 flex items-center justify-center text-sm flex-shrink-0 mt-1">
                    {student.avatar}
                  </div>
                )}
              </div>
            ))}

            {isAiLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-800 font-bold p-2 bg-amber-100/60 rounded-xl w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
                <span>Hoa Nhỏ đang suy nghĩ câu hỏi gợi mở cho em...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Student Input Field */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendIdea(); }}
              placeholder="Em chia sẻ suy nghĩ, kỷ niệm hoặc cảm xúc của em vào đây nhé..."
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-400 focus:outline-hidden text-sm bg-white"
            />
            <button
              onClick={handleSendIdea}
              disabled={!studentInput.trim() || isAiLoading}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Gửi ý</span>
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Quick pedagogical action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100 text-xs font-bold">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStudentInput('Em muốn kể thêm ')}
                className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
              >
                ✏️ Em muốn kể thêm
              </button>
              <button
                onClick={() => {
                  setStudentInput('');
                  handleSendIdea();
                }}
                className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-900 hover:bg-rose-200 transition-colors"
              >
                🌸 Hoa Nhỏ hỏi em nhé
              </button>
            </div>

            <button
              onClick={handleSynthesizeOutline}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Xếp ý giúp em</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: SMART OUTLINE ================= */}
      {currentStep === 'outline' && activeTask && (
        <div className="bg-white rounded-3xl border-3 border-emerald-300 p-4 sm:p-6 shadow-lg animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <button
              onClick={() => { setCurrentStep('brainstorm'); playPop(settings.soundEnabled); }}
              className="flex items-center gap-1 text-xs sm:text-sm font-bold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-full hover:bg-stone-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tìm thêm ý</span>
            </button>

            <div className="text-center">
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Bước 2: Dàn ý của em
              </span>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950 font-display mt-0.5">
                {activeTask.title}
              </h3>
            </div>

            <button
              onClick={handleStartWriting}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-xs transition-colors"
            >
              <span>Em bắt đầu viết</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Friendly note */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-900 font-medium flex items-center gap-2">
            <span>💡</span>
            <span>
              Hoa Nhỏ đã gom các ý của em thành 3 phần rõ ràng. Em có thể tự do bấm vào từng dòng để sửa chữ, thêm ý mới hoặc bỏ ý theo ý thích nhé!
            </span>
          </div>

          {/* Editable Outline List */}
          <div className="space-y-3">
            {currentOutline.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-2xl border-2 border-stone-200 hover:border-emerald-400 bg-white shadow-xs transition-all flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
                    {item.section}
                  </span>
                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => handleUpdateOutlineItem(item.id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:outline-hidden text-sm text-stone-800 font-medium bg-stone-50/50"
                  />
                </div>
                <button
                  onClick={() => handleDeleteOutlineItem(item.id)}
                  className="p-2 text-stone-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Bỏ ý này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add item */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newOutlineItemText}
              onChange={(e) => setNewOutlineItemText(e.target.value)}
              placeholder="Thêm một ý mới em muốn đưa vào đoạn văn..."
              className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-stone-200 focus:border-emerald-400 focus:outline-hidden text-sm"
            />
            <button
              onClick={handleAddOutlineItem}
              className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 border border-stone-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm ý</span>
            </button>
          </div>

          {/* Bottom Action */}
          <div className="pt-3 border-t border-emerald-100 flex items-center justify-between">
            <button
              onClick={() => {
                // Reset to initial outline
                setCurrentOutline(initialOutline);
                playPop(settings.soundEnabled);
              }}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục dàn ý ban đầu</span>
            </button>

            <button
              onClick={handleStartWriting}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <span>Em bắt đầu viết</span>
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: WRITING NOTEBOOK (TRANG VIẾT CỦA EM) ================= */}
      {currentStep === 'write' && activeTask && (
        <div className="bg-white rounded-3xl border-3 border-amber-300 p-4 sm:p-6 shadow-xl animate-fade-in space-y-4">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isIndependentMode) {
                    setCurrentStep('choose_task');
                  } else {
                    setCurrentStep('outline');
                  }
                  playPop(settings.soundEnabled);
                }}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-full hover:bg-stone-100 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isIndependentMode ? 'Chọn bài khác' : 'Dàn ý của em'}</span>
              </button>

              <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                isIndependentMode 
                  ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {isIndependentMode ? '⭐ Em tự thử sức (Viết độc lập)' : 'Bước 3: Em tập viết'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {saveStatus && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-pulse">
                  ✓ {saveStatus}
                </span>
              )}

              <button
                onClick={handleManualSaveDraft}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-300 transition-colors"
                title="Lưu lại bài viết hiện tại vào máy"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Giữ bản nháp</span>
              </button>
            </div>
          </div>

          {/* Title and prompt */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-amber-950 font-display">
                {activeTask.title}
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                {activeTask.prompt}
              </p>
            </div>
            {!isIndependentMode && (
              <button
                onClick={handleGetHint}
                disabled={isAiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-xs transition-colors"
                title="Bấm nếu em cần một gợi ý nhỏ"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>Em cần một gợi ý</span>
              </button>
            )}
          </div>

          {/* Revision Banner if student is writing revision based on teacher guidance */}
          {revisionSub && revisionSub.teacherFeedback && (
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-2 border-emerald-300 rounded-2xl space-y-1.5 animate-fade-in shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span>👩‍🏫</span>
                  <span>Bản sửa mới theo lời dặn của {TEACHER_CONFIG.name}:</span>
                </span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Bản thảo {(revisionSub.drafts?.length || 1) + 1}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-950 italic">
                "{revisionSub.teacherFeedback.teacherAdvice || revisionSub.teacherFeedback.comment}"
              </p>
              {revisionSub.teacherFeedback.wordSentenceSuggestions && (
                <div className="text-xs text-stone-700 bg-white/80 p-2 rounded-xl border border-emerald-200">
                  <strong>💡 Gợi ý câu từ:</strong> {revisionSub.teacherFeedback.wordSentenceSuggestions}
                </div>
              )}
            </div>
          )}

          {/* Writing hint bubble if requested */}
          {writingHint && !isIndependentMode && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-900 font-medium flex items-start justify-between gap-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <span>🌸</span>
                <span><strong>Hoa Nhỏ gợi ý:</strong> {writingHint}</span>
              </div>
              <button
                onClick={() => setWritingHint('')}
                className="text-stone-400 hover:text-stone-700 font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Split Screen: Outline on Left, Notebook on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
            {/* Left side: Student's Outline (unless in independent mode where student writes freely) */}
            {!isIndependentMode ? (
              <div className="lg:col-span-4 bg-amber-50/60 rounded-2xl border-2 border-amber-200 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <span className="font-extrabold text-xs text-amber-900 uppercase tracking-wide flex items-center gap-1">
                    <span>📋</span>
                    <span>Dàn ý của em</span>
                  </span>
                  <button
                    onClick={() => setCurrentStep('outline')}
                    className="text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    Sửa dàn ý
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {currentOutline.map((item, idx) => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-white border border-amber-200 shadow-xs text-xs">
                      <span className="font-extrabold text-amber-800 block text-[10px] uppercase">
                        {idx + 1}. {item.section}
                      </span>
                      <p className="text-stone-700 font-medium mt-0.5">{item.content}</p>
                    </div>
                  ))}
                  {currentOutline.length === 0 && (
                    <p className="text-xs text-stone-500 italic p-2">
                      Em chưa lập dàn ý. Em có thể tự do viết sang bên phải nhé!
                    </p>
                  )}
                </div>

                {/* Helpful reminder note */}
                <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-stone-600 font-medium">
                  ✏️ Nhớ viết hoa chữ cái đầu câu và đặt dấu chấm ở cuối mỗi câu em nhé!
                </div>
              </div>
            ) : (
              <div className="lg:col-span-4 bg-purple-50/60 rounded-2xl border-2 border-purple-200 p-4 space-y-3">
                <span className="font-extrabold text-xs text-purple-900 uppercase tracking-wide flex items-center gap-1">
                  <span>⭐</span>
                  <span>Chế độ tự thử sức</span>
                </span>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  Trong phần tự thử sức, em tự suy nghĩ và trình bày đoạn văn của mình không có gợi ý trước.
                </p>
                <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs text-purple-900 font-semibold space-y-1">
                  <p>✓ Viết từ 4 đến 6 câu hoàn chỉnh.</p>
                  <p>✓ Nêu cảm xúc chân thật của em.</p>
                  <p>✓ Kiểm tra chính tả trước khi nộp bài cho cô giáo.</p>
                </div>
              </div>
            )}

            {/* Right side: Lined Notebook Paper */}
            <div className="lg:col-span-8 space-y-3">
              <div className="relative rounded-2xl border-2 border-amber-300 p-4 bg-amber-50/20 shadow-inner">
                {/* Lined paper visual */}
                <div className="flex items-center justify-between text-xs text-stone-500 font-bold pb-2 border-b border-amber-200">
                  <span>Trang vở của em (Vở ô li)</span>
                  <span>{essayContent.trim().split(/\s+/).filter(Boolean).length} từ</span>
                </div>

                <textarea
                  value={essayContent}
                  onChange={(e) => setEssayContent(e.target.value)}
                  placeholder="Em hãy nắn nót viết từng câu văn bằng chính suy nghĩ và cảm xúc của mình nhé..."
                  rows={10}
                  className="w-full mt-2 p-2 bg-transparent focus:outline-hidden text-base sm:text-lg leading-relaxed text-stone-800 font-medium resize-y"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #fde68a 31px, #fde68a 32px)',
                    lineHeight: '32px'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleManualSaveDraft}
                  className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm border border-stone-300 transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Giữ bản nháp</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFinishedWriting}
                    disabled={!essayContent.trim() || isAiLoading}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-colors flex items-center gap-2"
                  >
                    <span>{isIndependentMode ? 'Em nộp bài cho cô giáo' : 'Hoa Nhỏ góp ý cho em'}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 5: AI FEEDBACK (HOA NHỎ GÓP Ý) ================= */}
      {currentStep === 'feedback' && activeTask && (
        <div className="bg-white rounded-3xl border-3 border-amber-300 p-4 sm:p-6 shadow-xl animate-fade-in space-y-5">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              <h3 className="text-lg sm:text-xl font-bold text-amber-950 font-display">
                Hoa Nhỏ đọc và góp ý bài viết của em
              </h3>
            </div>
            <button
              onClick={() => { setCurrentStep('write'); playPop(settings.soundEnabled); }}
              className="text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-full hover:bg-stone-100 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Em sửa bài</span>
            </button>
          </div>

          {/* Student's Current Essay Preview */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
            <span className="text-xs font-extrabold uppercase text-amber-800 tracking-wider block mb-1">
              Bài viết của em:
            </span>
            <p className="text-base text-stone-800 font-medium leading-relaxed italic">
              "{essayContent}"
            </p>
          </div>

          {/* Three Pedagogical Feedback Sections */}
          {aiFeedback && (
            <div className="space-y-4">
              {/* 1. Bông hoa khen ngợi */}
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-xs">
                <div className="flex items-center gap-2 font-black text-rose-950 text-sm sm:text-base font-display mb-1.5">
                  <span className="text-xl">🌸</span>
                  <span>Bông hoa khen ngợi</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-medium">
                  {aiFeedback.flowerPraise}
                </p>
              </div>

              {/* 2. Chiếc lá nhắc em */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-xs">
                <div className="flex items-center gap-2 font-black text-emerald-950 text-sm sm:text-base font-display mb-1.5">
                  <span className="text-xl">🍃</span>
                  <span>Chiếc lá nhắc em</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-medium">
                  {aiFeedback.leafReminder}
                </p>
              </div>

              {/* 3. Thử thách nhỏ */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs">
                <div className="flex items-center gap-2 font-black text-amber-950 text-sm sm:text-base font-display mb-1.5">
                  <span className="text-xl">⭐</span>
                  <span>Thử thách nhỏ để em tự hoàn thiện</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-medium">
                  {aiFeedback.smallChallenge}
                </p>
              </div>

              {/* Suggested Stars Note */}
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <span>Hoa Nhỏ đề xuất:</span>
                  <div className="flex text-amber-500">
                    {[...Array(aiFeedback.suggestedStars || 4)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <span className="italic">* Điểm sao này chỉ mang tính tham khảo, cô giáo sẽ xem và nhận xét chính thức.</span>
              </div>
            </div>
          )}

          {/* Action Buttons: Edit or Submit to Teacher */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-100">
            <button
              onClick={() => {
                setCurrentStep('write');
                playPop(settings.soundEnabled);
              }}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold text-sm shadow-xs transition-colors flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              <span>Em quay lại sửa bài</span>
            </button>

            <button
              onClick={() => handleSubmitToTeacher()}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <span>Em gửi bài cho cô giáo</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 6: SUCCESS CELEBRATION ================= */}
      {currentStep === 'success' && activeTask && (
        <div className="bg-gradient-to-b from-white to-amber-50 rounded-3xl border-3 border-emerald-400 p-6 sm:p-8 shadow-xl text-center max-w-xl mx-auto space-y-5 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-3 border-emerald-400 flex items-center justify-center text-4xl mx-auto shadow-md">
            🌸
          </div>

          <div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
              Chúc mừng em đã hoàn thành!
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 font-display mt-2">
              Bông hoa chữ của em đã nở rộ!
            </h3>
            <p className="text-sm text-stone-600 font-medium mt-1 max-w-md mx-auto">
              Bài viết của em đã được giữ an toàn và gửi đến cô giáo. Em nhận được thêm <span className="font-bold text-rose-600">+1 đóa hoa xinh</span> vào khu vườn của mình!
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-emerald-200 text-left space-y-1">
            <span className="text-xs font-bold text-emerald-800">Bài đã hoàn thành:</span>
            <h4 className="font-bold text-stone-900 text-sm font-display">{activeTask.title}</h4>
            <p className="text-xs text-stone-600 line-clamp-3 italic mt-1">"{essayContent}"</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenProgressGarden}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <Trees className="w-4 h-4" />
              <span>Xem khu vườn của em</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep('choose_task');
                setActiveTask(null);
                setEssayContent('');
                playPop(settings.soundEnabled);
              }}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm shadow-xs transition-colors"
            >
              Viết thêm bài mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
