import React, { useState, useRef, useEffect } from 'react';
import { 
  Student, 
  WritingTask, 
  OutlineItem, 
  AppSettings, 
  EssayGenre, 
  ComprehensiveFeedback,
  ChatMessage,
  Submission,
  QualitativeSkillRating,
  FiveContentProgress
} from '../types';
import { HoaNhoMascot } from './HoaNhoMascot';
import { AiStatusBar } from './AiStatusBar';
import { playPop, playChime, playSparkle } from '../utils/audio';
import { 
  BookOpen,
  Camera, 
  Upload, 
  Check, 
  Pencil, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Star, 
  AlertCircle, 
  HelpCircle, 
  ArrowLeft, 
  Save, 
  Mail, 
  Printer, 
  X, 
  CheckCircle2,
  Heart,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  Trees
} from 'lucide-react';

interface EssayFeedbackPageProps {
  student: Student;
  settings: AppSettings;
  initialPrompt?: string;
  initialGrade?: number;
  initialGenre?: EssayGenre;
  initialSpecialWishes?: string;
  initialOutline?: OutlineItem[];
  initialEssayText?: string;
  onBackToIdeaMap: () => void;
  onSaveSubmission: (submission: Partial<Submission>) => void;
  onOpenProgressGarden: () => void;
}

export const EssayFeedbackPage: React.FC<EssayFeedbackPageProps> = ({
  student,
  settings,
  initialPrompt = 'Viết một đoạn văn giới thiệu về bản thân em: họ tên, sở thích, ước mơ và một điểm đặc biệt của mình.',
  initialGrade = 3,
  initialGenre = 'khac',
  initialSpecialWishes = '',
  initialOutline = [],
  initialEssayText = '',
  onBackToIdeaMap,
  onSaveSubmission,
  onOpenProgressGarden
}) => {
  // Input mode: typing / pasting or handwriting photos
  const [essayText, setEssayText] = useState(initialEssayText || '');
  const [firstDraftBackup, setFirstDraftBackup] = useState(initialEssayText || '');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [uncertainWords, setUncertainWords] = useState<string[]>([]);
  const [hasVerifiedTranscribe, setHasVerifiedTranscribe] = useState(true);
  const [ocrTranscribeNotice, setOcrTranscribeNotice] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Feedback state
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<ComprehensiveFeedback | null>(null);

  // Student edits after feedback
  const [isEditingMode, setIsEditingMode] = useState(false);

  // "Góc trò chuyện cùng cô" (Socratic discussion with AI Teacher Assistant)
  const [teacherChat, setTeacherChat] = useState<ChatMessage[]>([
    {
      id: 'tc-1',
      sender: 'hoanho',
      text: `Chào con! Cô đã đọc bài viết của con. Con có thắc mắc hay muốn trao đổi điều gì về các nhận xét không? Cô luôn sẵn sàng lắng nghe con!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // "Gửi kết quả cho giáo viên" dialog & options
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendOptions, setSendOptions] = useState({
    includeStudentInfo: true,
    includePrompt: true,
    includeOutline: true,
    includeFirstDraft: true,
    includeRevisedDraft: true,
    includeAiFeedback: true,
    includeStudentFeedback: true
  });
  const [studentNoteToTeacher, setStudentNoteToTeacher] = useState('');
  const [isSubmittingToTeacher, setIsSubmittingToTeacher] = useState(false);
  const [submissionSuccessNotice, setSubmissionSuccessNotice] = useState('');

  // Handle uploading up to 10 photos of handwritten essays
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    playPop(settings.soundEnabled);
    const newPhotos: string[] = [];
    const maxFiles = Math.min(files.length, 10 - uploadedPhotos.length);

    Array.from(files).slice(0, maxFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotos.push(event.target.result as string);
          if (newPhotos.length === maxFiles) {
            const combined = [...uploadedPhotos, ...newPhotos];
            setUploadedPhotos(combined);
            processHandwritingOcr(combined);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const processHandwritingOcr = async (photos: string[]) => {
    setIsOcrLoading(true);
    setHasVerifiedTranscribe(false);

    try {
      const res = await fetch('/api/ai/ocr-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: photos })
      });
      const data = await res.json();
      if (data.transcribedText) {
        setEssayText(data.transcribedText);
        if (!firstDraftBackup) setFirstDraftBackup(data.transcribedText);
      }
      setUncertainWords(data.uncertainWords || []);
      setOcrTranscribeNotice(data.notes || 'Hoa Nhỏ đã đọc bài của con. Con cùng kiểm tra lại những chữ này nhé!');
      playChime(settings.soundEnabled);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOcrLoading(false);
    }
  };

  const removePhoto = (index: number) => {
    playPop(settings.soundEnabled);
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  // Off-topic alert state
  const [isCheckingTopic, setIsCheckingTopic] = useState(false);
  const [offTopicAlert, setOffTopicAlert] = useState<{ isOffTopic: boolean; message: string; guidance: string } | null>(null);
  const [isCompletedSuccessModal, setIsCompletedSuccessModal] = useState(false);

  // Request comprehensive pedagogical feedback with off-topic check
  const handleGetFeedback = async () => {
    if (!essayText.trim() || isLoadingFeedback || isCheckingTopic) return;

    playSparkle(settings.soundEnabled);
    if (!firstDraftBackup) {
      setFirstDraftBackup(essayText);
    }

    // Step 1: Check if the essay is off-topic
    setIsCheckingTopic(true);
    setOffTopicAlert(null);

    try {
      const topicRes = await fetch('/api/ai/check-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: initialPrompt,
          essayText
        })
      });
      const topicData = await topicRes.json();
      if (topicData.isOffTopic) {
        setOffTopicAlert({
          isOffTopic: true,
          message: topicData.message || '🌷 Em đã làm sai đề, yêu cầu gửi lại đúng chủ đề yêu cầu.',
          guidance: topicData.guidance || 'Em hãy đọc kỹ lại đề bài và điều chỉnh nội dung cho đúng nhé.'
        });
        setIsCheckingTopic(false);
        return;
      }
    } catch (e) {
      console.warn('Topic check warning:', e);
    } finally {
      setIsCheckingTopic(false);
    }

    // Step 2: If on topic, generate feedback
    setIsLoadingFeedback(true);
    try {
      const res = await fetch('/api/ai/comprehensive-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: initialPrompt,
          grade: initialGrade,
          genre: initialGenre,
          essayText,
          specialWishes: initialSpecialWishes
        })
      });
      const data = await res.json();
      setFeedback(data);
      playChime(settings.soundEnabled);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // Complete writing celebration handler
  const handleCompleteEssay = async () => {
    playSparkle(settings.soundEnabled);
    playChime(settings.soundEnabled);

    const submissionData: Partial<Submission> = {
      studentId: student.id,
      taskId: `custom-${Date.now()}`,
      taskTitle: initialPrompt.slice(0, 50),
      gardenType: 'ke_chuyen',
      volume: 1,
      isIndependentTest: false,
      initialOutline,
      developedOutline: initialOutline,
      firstDraft: firstDraftBackup || essayText,
      finalContent: essayText,
      comprehensiveFeedback: feedback || undefined,
      status: 'submitted',
      handwrittenImages: uploadedPhotos,
      studentNotesToTeacher: studentNoteToTeacher
    };

    onSaveSubmission(submissionData);

    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `sub-${Date.now()}`,
          ...submissionData
        })
      });
    } catch (e) {
      console.error(e);
    }

    setIsCompletedSuccessModal(true);
  };

  // Chat with teacher assistant
  const handleSendTeacherChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    playPop(settings.soundEnabled);
    const newMsg: ChatMessage = {
      id: `tc-${Date.now()}`,
      sender: 'student',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...teacherChat, newMsg];
    setTeacherChat(updated);
    const msg = chatInput.trim();
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/teacher-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: initialPrompt,
          grade: initialGrade,
          studentEssay: essayText,
          chatHistory: updated,
          studentMessage: msg
        })
      });
      const data = await res.json();
      const replyMsg: ChatMessage = {
        id: `tc-${Date.now() + 1}`,
        sender: 'hoanho',
        text: data.reply || 'Cô luôn đồng hành và ủng hộ cảm xúc chân thật của con!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setTeacherChat([...updated, replyMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Send result safely to teacher portal & database
  const handleFinalSubmitToTeacher = async () => {
    setIsSubmittingToTeacher(true);
    playChime(settings.soundEnabled);

    try {
      const submissionData: Partial<Submission> = {
        studentId: student.id,
        taskId: `custom-${Date.now()}`,
        taskTitle: initialPrompt.slice(0, 50),
        gardenType: 'ke_chuyen',
        volume: 1,
        isIndependentTest: false,
        initialOutline,
        developedOutline: initialOutline,
        firstDraft: firstDraftBackup || essayText,
        finalContent: essayText,
        comprehensiveFeedback: feedback || undefined,
        status: 'submitted',
        handwrittenImages: uploadedPhotos,
        studentNotesToTeacher: studentNoteToTeacher
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      const data = await res.json();

      if (data.success) {
        setSubmissionSuccessNotice('Bài viết đã được lưu an toàn vào Góc Cô Giáo! Cô sẽ sớm đọc và gửi lời nhận xét chính thức cho con nhé.');
        onSaveSubmission(submissionData);
        setTimeout(() => {
          setIsSendModalOpen(false);
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingToTeacher(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Banner with Soft Pastel Pink / Lavender / Sky Blue Gradient */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-sky-100 rounded-3xl p-3.5 sm:p-5 border-2 border-pink-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap min-w-0">
          <button
            onClick={() => {
              playPop(settings.soundEnabled);
              onBackToIdeaMap();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-purple-900 border-2 border-purple-200 font-extrabold text-xs sm:text-sm shadow-xs transition-all min-h-[42px]"
            title="Quay lại Bản đồ ý tưởng mà không mất bài viết"
          >
            <ArrowLeft className="w-4 h-4 text-purple-700" />
            <span>← Quay lại</span>
          </button>

          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-pink-300 flex items-center justify-center text-xl sm:text-3xl shadow-xs shrink-0">
            ✍️
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-500 text-white">
                Trang 2 • Cô Góp Ý Bài Văn
              </span>
              <span className="text-[11px] sm:text-xs text-purple-900 font-bold">Lớp {initialGrade}</span>
            </div>
            <h2 className="text-base sm:text-2xl font-black text-purple-950 font-display break-words mt-0.5">
              Lắng Nghe Góp Ý – Tự Tay Hoàn Thiện Bài Viết
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onBackToIdeaMap}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 font-bold text-xs sm:text-sm shadow-xs transition-colors min-h-[42px]"
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Xem lại dàn ý & từ vựng</span>
          </button>
        </div>
      </div>

      {/* Animated AI Status Bars */}
      <AiStatusBar
        isLoading={isCheckingTopic}
        message="🌼 Hoa Nhỏ đang đọc bài viết và kiểm tra đề bài của em..."
        reducedMotion={settings.reducedMotion}
      />
      <AiStatusBar
        isLoading={isLoadingFeedback}
        message="🌸 Hoa Nhỏ đang lắng nghe câu chữ và chuẩn bị những gợi ý ấm áp cho em..."
        reducedMotion={settings.reducedMotion}
      />
      <AiStatusBar
        isLoading={isOcrLoading}
        message="📸 Hoa Nhỏ đang đọc ảnh bài viết viết tay của em..."
        reducedMotion={settings.reducedMotion}
      />

      {/* SECTION 1: HỌC SINH GỬI BÀI VIẾT (Nhập / Dán / Tải ảnh bài viết tay tối đa 10 ảnh) */}
      <div className="bg-white rounded-3xl border-2 border-pink-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display">
              1. Bài viết của con
            </h3>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Dán bài đánh máy hoặc chụp ảnh chữ viết tay (Tối đa 10 ảnh)
          </span>
        </div>

        {/* Prompt recap */}
        <div className="p-3.5 bg-pink-50/60 rounded-2xl border border-pink-200 text-xs text-stone-700 font-medium space-y-1">
          <div className="flex items-center justify-between">
            <strong className="text-pink-900 block font-bold">Đề bài yêu cầu:</strong>
            <span className="text-[11px] text-pink-700 font-bold bg-pink-100 px-2 py-0.5 rounded-full">
              Lớp {initialGrade}
            </span>
          </div>
          <p className="text-stone-800 font-semibold">{initialPrompt}</p>
        </div>

        {/* OFF-TOPIC ALERT BANNER */}
        {offTopicAlert && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-3 border-rose-400 shadow-md space-y-2.5 animate-fade-in">
            <div className="flex items-center gap-2 text-rose-950 font-black text-sm sm:text-base font-display">
              <span className="text-2xl">🌷</span>
              <span>{offTopicAlert.message}</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 font-medium">
              {offTopicAlert.guidance}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  playPop(settings.soundEnabled);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white text-stone-800 border-2 border-stone-300 font-bold text-xs hover:bg-stone-50"
              >
                📖 Xem lại đề bài
              </button>
              <button
                onClick={() => {
                  playPop(settings.soundEnabled);
                  const el = document.getElementById('essay-textarea');
                  el?.focus();
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                ✏️ Em sửa bài
              </button>
            </div>
          </div>
        )}

        {/* Text area for essay */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-bold">
            <span>Trang viết của con</span>
            <span>{essayText.trim().split(/\s+/).filter(Boolean).length} từ</span>
          </div>

          <textarea
            id="essay-textarea"
            rows={8}
            value={essayText}
            onChange={(e) => {
              setEssayText(e.target.value);
              setHasVerifiedTranscribe(true);
            }}
            placeholder="Con hãy nắn nót gõ hoặc dán bài viết của mình vào đây..."
            className="w-full p-4 rounded-2xl border-2 border-purple-100 focus:border-purple-300 focus:outline-hidden text-base leading-relaxed bg-pink-50/20"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #fbcfe8 31px, #fbcfe8 32px)',
              lineHeight: '32px'
            }}
          />
        </div>

        {/* Photo upload for handwritten essay */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadedPhotos.length >= 10 || isOcrLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs sm:text-sm font-bold transition-colors disabled:opacity-50"
            >
              <Camera className="w-4 h-4 text-purple-600" />
              <span>Tải ảnh chụp bài viết tay ({uploadedPhotos.length}/10 ảnh)</span>
            </button>

            {isOcrLoading && (
              <span className="text-xs text-purple-700 font-bold flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
                <span>Hoa Nhỏ đang đọc chữ viết tay tiếng Việt từ ảnh...</span>
              </span>
            )}
          </div>

          {/* Uploaded photos gallery */}
          {uploadedPhotos.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-1">
              {uploadedPhotos.map((img, i) => (
                <div key={i} className="relative w-20 h-24 rounded-2xl overflow-hidden border-2 border-purple-200 shadow-xs group">
                  <img src={img} alt={`Trang ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 p-1 bg-stone-900/70 text-white rounded-full hover:bg-rose-600 transition-colors"
                    title="Xóa trang này"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-white/90 rounded-md text-[10px] font-bold text-stone-700">
                    Trang {i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Handwriting OCR Verification Notice */}
          {ocrTranscribeNotice && !hasVerifiedTranscribe && (
            <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-2xl text-xs sm:text-sm text-purple-950 font-medium space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-purple-900">
                <HoaNhoMascot mood="thinking" size="sm" reducedMotion={settings.reducedMotion} />
                <span>{ocrTranscribeNotice}</span>
              </div>

              {uncertainWords.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs text-purple-800 font-bold">Các chữ cần con kiểm tra kỹ đối chiếu với ảnh gốc:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {uncertainWords.map((w, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-purple-200 text-purple-900 font-bold text-xs">
                        "{w}"
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-stone-600 italic">
                * Con có thể chỉnh sửa lại trực tiếp trên khung bài viết phía trên để bài chuẩn xác nhất nhé!
              </p>

              <button
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setHasVerifiedTranscribe(true);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
              >
                Con đã kiểm tra bài chép lại ✓
              </button>
            </div>
          )}
        </div>

        {/* Button: Nhận xét bài viết */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleGetFeedback}
            disabled={!essayText.trim() || isLoadingFeedback}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white font-black text-sm sm:text-base shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Cô góp ý bài văn cho con</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK RESULTS AREA */}
      {feedback && (
        <div className="space-y-6 animate-fade-in">
          {/* SECTION 2: NHẬN XÉT NỘI DUNG – BỐ CỤC – CẢM XÚC */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Nội dung: Điều con đã kể rất hay */}
            <div className="bg-pink-50 rounded-3xl border-2 border-pink-300 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-pink-900 font-bold text-sm sm:text-base font-display">
                <span className="text-xl">🌸</span>
                <span>Điều con đã kể rất hay</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {feedback.whatYouToldWell}
              </p>
            </div>

            {/* 2. Bố cục: Các ý trong bài của con */}
            <div className="bg-purple-50 rounded-3xl border-2 border-purple-300 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm sm:text-base font-display">
                <span className="text-xl">📋</span>
                <span>Các ý trong bài của con</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {feedback.ideasStructure}
              </p>
            </div>

            {/* 3. Cảm xúc: Cảm xúc con gửi vào bài viết */}
            <div className="bg-sky-50 rounded-3xl border-2 border-sky-300 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-sm sm:text-base font-display">
                <span className="text-xl">💖</span>
                <span>Cảm xúc con gửi vào bài viết</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {feedback.emotionsExpressed}
              </p>
            </div>
          </div>

          {/* SECTION 3: CÂU VĂN HAY CỦA CON (Trích câu thật trong bài + giải thích ngắn) */}
          {feedback.highlightedSentences?.length > 0 && (
            <div className="bg-white rounded-3xl border-2 border-purple-200 p-5 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
                <span className="text-xl">✨</span>
                <h3 className="text-base sm:text-lg font-bold text-purple-950 font-display">
                  Câu văn hay của con
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.highlightedSentences.map((h, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 space-y-2">
                    <span className="font-extrabold text-xs text-purple-900 block uppercase">
                      Câu văn được chọn {i + 1}:
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-stone-900 italic bg-white p-2.5 rounded-xl border border-purple-100 leading-relaxed">
                      "{h.sentence}"
                    </p>
                    <div className="text-xs text-stone-600 space-y-1 font-medium pt-1">
                      <p>• <strong>Điểm hay:</strong> {h.goodPoint}</p>
                      <p>• <strong>Chi tiết sinh động:</strong> {h.sensoryDetail}</p>
                      <p>• <strong>Cảm xúc:</strong> {h.emotionExpressed}</p>
                      <p className="text-emerald-800 font-bold">💡 Học tập: {h.learningTip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: CÙNG CON TÌM LỖI VÀ SỬA LỖI ("Mình cùng làm bài viết hay hơn nhé!") */}
          <div className="bg-white rounded-3xl border-2 border-pink-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-pink-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <h3 className="text-base sm:text-lg font-bold text-pink-950 font-display">
                  Mình cùng làm bài viết hay hơn nhé!
                </h3>
              </div>
              <span className="text-xs font-semibold text-stone-500">
                Phân biệt lỗi chính tả và cách diễn đạt gợi ý thêm
              </span>
            </div>

            <div className="space-y-3">
              {feedback.corrections?.map((c, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border-2 space-y-2 ${
                    c.isCertainError
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      c.type === 'chinh_ta'
                        ? 'bg-rose-200 text-rose-900'
                        : c.type === 'dung_tu'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-purple-200 text-purple-900'
                    }`}>
                      {c.type === 'chinh_ta' ? 'Chính tả' : c.type === 'dung_tu' ? 'Dùng từ' : 'Đặt câu'}
                      {c.isCertainError ? ' • Lỗi cần sửa' : ' • Gợi ý diễn đạt'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                      <span className="font-bold text-stone-500 block text-[11px]">Cách con đã viết:</span>
                      <p className="font-medium text-stone-800 mt-0.5">"{c.originalText}"</p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-800 block text-[11px]">Gợi ý để con tự sửa:</span>
                      <p className="font-medium text-emerald-950 mt-0.5">{c.suggestion}</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 font-medium">
                    💡 <em>Lời giải thích ngắn:</em> {c.explanation}
                  </p>
                </div>
              ))}

              {(!feedback.corrections || feedback.corrections.length === 0) && (
                <p className="text-xs text-emerald-700 font-bold p-3 bg-emerald-50 rounded-xl">
                  ✓ Bài viết của con rất sạch đẹp, câu từ rõ ràng và không có lỗi chính tả nào đáng kể!
                </p>
              )}
            </div>

            {/* Overall and Improvement guidance */}
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1 text-xs sm:text-sm text-stone-700 font-medium">
              <strong className="text-purple-900 block font-bold">Hướng cải thiện tiếp theo:</strong>
              <p>{feedback.improvementGuidance}</p>
            </div>
          </div>

          {/* SECTION 5: ĐÁNH GIÁ 4 KỸ NĂNG VÀ TIẾN ĐỘ 5 NỘI DUNG (HOÀN TOÀN ĐỊNH TÍNH - KHÔNG CHẤM ĐIỂM SỐ) */}
          <div className="bg-white rounded-3xl border-2 border-purple-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-purple-950 font-display flex items-center gap-2">
                  <span>🌸</span>
                  <span>Đánh giá 4 năng lực viết văn của em</span>
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Hoa Nhỏ khích lệ từng bước tiến bộ của con (Không dùng điểm số áp lực)
                </p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Lớp {initialGrade} • Đánh giá định tính
              </span>
            </div>

            {/* 4 Qualitative Skill Cards: Green, Orange, Blue, Pink */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Green - Chính tả & Dấu câu */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs uppercase tracking-wide">
                    <span>🌿</span>
                    <span>Chính tả & Dấu câu</span>
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-2xs">
                    {feedback.skills?.[0]?.rating || 'Em thực hiện khá tốt'}
                  </span>
                </div>
                <p className="text-xs text-stone-700 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  {feedback.skills?.[0]?.comment || 'Em viết câu rõ ràng, nhớ chấm câu đầy đủ ở cuối mỗi ý văn.'}
                </p>
              </div>

              {/* Card 2: Orange - Bố cục đoạn văn */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs uppercase tracking-wide">
                    <span>🟧</span>
                    <span>Bố cục đoạn văn</span>
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-2xs">
                    {feedback.skills?.[1]?.rating || 'Em đã có tiến bộ'}
                  </span>
                </div>
                <p className="text-xs text-stone-700 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-amber-100">
                  {feedback.skills?.[1]?.comment || 'Đoạn văn có đủ mở đầu, các việc nối tiếp nhau và câu kết bộc lộ cảm xúc.'}
                </p>
              </div>

              {/* Card 3: Blue - Vốn từ & Hình ảnh */}
              <div className="p-4 rounded-2xl bg-sky-50/80 border-2 border-sky-300 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sky-950 font-bold text-xs uppercase tracking-wide">
                    <span>🌊</span>
                    <span>Vốn từ & Hình ảnh</span>
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-full bg-sky-600 text-white font-black text-xs shadow-2xs">
                    {feedback.skills?.[2]?.rating || 'Em thực hiện khá tốt'}
                  </span>
                </div>
                <p className="text-xs text-stone-700 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-sky-100">
                  {feedback.skills?.[2]?.comment || 'Có nhiều từ ngữ gợi cảm, biết dùng từ ngữ miêu tả cảnh sắc xung quanh.'}
                </p>
              </div>

              {/* Card 4: Pink - Cảm xúc & Ý tưởng riêng */}
              <div className="p-4 rounded-2xl bg-pink-50/80 border-2 border-pink-300 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-pink-950 font-bold text-xs uppercase tracking-wide">
                    <span>💖</span>
                    <span>Cảm xúc & Sáng tạo</span>
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-full bg-pink-600 text-white font-black text-xs shadow-2xs">
                    {feedback.skills?.[3]?.rating || 'Em tiếp tục phát huy nhé!'}
                  </span>
                </div>
                <p className="text-xs text-stone-700 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-pink-100">
                  {feedback.skills?.[3]?.comment || 'Kể lại thật lòng kỷ niệm của riêng em, không sao chép văn mẫu.'}
                </p>
              </div>
            </div>

            {/* 5-Content Progress Indicators */}
            {feedback.fiveContents && (
              <div className="pt-2 border-t border-purple-100 space-y-2">
                <span className="text-xs font-black text-purple-900 uppercase tracking-wide block">
                  Tiến độ 5 nội dung trọng tâm bài viết:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Chính tả', val: feedback.fiveContents.chinhTa, color: 'bg-emerald-500' },
                    { label: 'Bố cục', val: feedback.fiveContents.boCuc, color: 'bg-amber-500' },
                    { label: 'Nội dung', val: feedback.fiveContents.noiDung, color: 'bg-purple-500' },
                    { label: 'Từ vựng', val: feedback.fiveContents.tuVung, color: 'bg-sky-500' },
                    { label: 'Cảm xúc', val: feedback.fiveContents.camXuc, color: 'bg-pink-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-center space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
                        <span>{item.label}</span>
                        <span>{item.val}%</span>
                      </div>
                      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: GÓC TRÒ CHUYỆN CÙNG CÔ (Trợ lý sư phạm AI) */}
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 rounded-3xl border-2 border-purple-300 p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-purple-200 pb-2">
              <span className="text-xl">👩‍🏫</span>
              <div>
                <h3 className="text-base font-bold text-purple-950 font-display">
                  Góc trò chuyện cùng cô (Trợ lý AI)
                </h3>
                <span className="text-[11px] text-purple-700 font-medium">
                  Con có thể hỏi lí do góp ý, xin gợi ý thêm hoặc bảo vệ cách diễn đạt sáng tạo của mình
                </span>
              </div>
            </div>

            <div className="bg-white/90 rounded-2xl border border-purple-200 p-3 min-h-[160px] max-h-[260px] overflow-y-auto space-y-2.5">
              {teacherChat.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'student'
                      ? 'bg-purple-600 text-white ml-8 rounded-br-none font-medium'
                      : 'bg-pink-50 text-stone-800 mr-8 rounded-bl-none border border-pink-200'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`block text-[9px] mt-1 ${m.sender === 'student' ? 'text-purple-200' : 'text-stone-400'}`}>
                    {m.timestamp}
                  </span>
                </div>
              ))}
              {isChatLoading && (
                <div className="text-[11px] text-purple-700 font-bold p-1 animate-pulse">
                  Cô đang lắng nghe và giải thích cho con...
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendTeacherChat(); }}
                placeholder="Con muốn hỏi thêm hoặc nêu lí do con muốn giữ câu văn này..."
                className="flex-1 px-4 py-2.5 rounded-2xl border border-purple-200 text-xs sm:text-sm focus:outline-hidden bg-white"
              />
              <button
                onClick={handleSendTeacherChat}
                disabled={!chatInput.trim() || isChatLoading}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi</span>
              </button>
            </div>
          </div>

          {/* LỜI NHẮN ĐỘNG VIÊN DÀNH CHO CON */}
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-xs sm:text-sm text-emerald-950 font-medium flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <strong className="text-emerald-900 block font-bold">Lời động viên gửi con:</strong>
              <p className="mt-0.5">{feedback.personalEncouragement}</p>
            </div>
          </div>

          {/* ACTION BUTTONS: TỰ SỬA BÀI + HOÀN THÀNH BÀI VIẾT + GỬI CHO GIÁO VIÊN */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              <span>Con quay lại tự sửa bài</span>
            </button>

            {/* Nút Hoàn Thành Bài Viết Nổi Bật */}
            <button
              onClick={handleCompleteEssay}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white font-black text-sm sm:text-base shadow-lg transition-all transform hover:scale-102 flex items-center gap-2 animate-bounce-gentle"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span>🌸 HOÀN THÀNH BÀI VIẾT</span>
            </button>

            <button
              onClick={() => {
                playSparkle(settings.soundEnabled);
                setIsSendModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Gửi kết quả cho giáo viên</span>
            </button>
          </div>
        </div>
      )}

      {/* CELEBRATION MODAL: HOÀN THÀNH BÀI VIẾT */}
      {isCompletedSuccessModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-3 border-pink-400 max-w-md w-full p-6 text-center shadow-2xl space-y-4 animate-fade-in relative">
            <button
              onClick={() => setIsCompletedSuccessModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-amber-200 flex items-center justify-center text-4xl shadow-md animate-pulse">
              🌸
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-purple-950 font-display">
              CHÚC MỪNG CON ĐÃ HOÀN THÀNH BÀI VIẾT!
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-medium italic">
              "Mỗi em một ý tưởng – Mỗi bài viết một sắc màu."
            </p>

            <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200 flex items-center justify-around text-xs sm:text-sm font-bold text-stone-800">
              <span className="flex items-center gap-1 text-pink-700">
                🌸 +1 Bông hoa nở rộ
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                ⭐ +4 Ngôi sao sáng tạo
              </span>
            </div>

            <p className="text-xs text-stone-500">
              Bài viết của con đã được lưu an toàn vào Khu Vườn Chữ và gửi đến Góc Cô Giáo.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsCompletedSuccessModal(false);
                  onOpenProgressGarden();
                }}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-1.5"
              >
                <Trees className="w-4 h-4" />
                <span>🌿 Đến Vườn Hoa Của Em</span>
              </button>

              <button
                onClick={() => {
                  setIsCompletedSuccessModal(false);
                  onBackToIdeaMap();
                }}
                className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
              >
                Viết đề khác
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG: GỬI KẾT QUẢ CHO GIÁO VIÊN */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl border-3 border-purple-400 max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-fade-in relative">
            <button
              onClick={() => setIsSendModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
              <span className="text-2xl">📬</span>
              <h3 className="text-lg font-bold text-purple-950 font-display">
                Gửi kết quả cho giáo viên
              </h3>
            </div>

            <p className="text-xs text-stone-600 font-medium">
              Con có thể lựa chọn những phần muốn gửi kèm bài viết để cô giáo theo dõi hành trình tiến bộ của con:
            </p>

            {/* Checkbox selections */}
            <div className="space-y-2 text-xs font-semibold text-stone-700 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendOptions.includeStudentInfo}
                  onChange={(e) => setSendOptions({ ...sendOptions, includeStudentInfo: e.target.checked })}
                  className="rounded-sm text-purple-600"
                />
                <span>Họ tên học sinh: <strong>{student.name} ({student.id})</strong></span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendOptions.includePrompt}
                  onChange={(e) => setSendOptions({ ...sendOptions, includePrompt: e.target.checked })}
                  className="rounded-sm text-purple-600"
                />
                <span>Đề bài và dạng bài</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendOptions.includeOutline}
                  onChange={(e) => setSendOptions({ ...sendOptions, includeOutline: e.target.checked })}
                  className="rounded-sm text-purple-600"
                />
                <span>Dàn ý con đã chọn</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendOptions.includeFirstDraft}
                  onChange={(e) => setSendOptions({ ...sendOptions, includeFirstDraft: e.target.checked })}
                  className="rounded-sm text-purple-600"
                />
                <span>Bản viết đầu tiên</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendOptions.includeRevisedDraft}
                  onChange={(e) => setSendOptions({ ...sendOptions, includeRevisedDraft: e.target.checked })}
                  className="rounded-sm text-purple-600"
                />
                <span>Bài viết sau khi con tự sửa</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendOptions.includeAiFeedback}
                  onChange={(e) => setSendOptions({ ...sendOptions, includeAiFeedback: e.target.checked })}
                  className="rounded-sm text-purple-600"
                />
                <span>Góp ý của trợ lý AI</span>
              </label>
            </div>

            {/* Note to teacher */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">
                Lời nhắn gửi cô giáo (nếu con muốn chia sẻ thêm):
              </label>
              <textarea
                rows={2}
                value={studentNoteToTeacher}
                onChange={(e) => setStudentNoteToTeacher(e.target.value)}
                placeholder="Thưa cô, con đã tự sửa câu văn thứ hai cho tự nhiên hơn rồi ạ..."
                className="w-full p-2.5 rounded-xl border border-purple-200 text-xs focus:outline-hidden"
              />
            </div>

            {submissionSuccessNotice && (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{submissionSuccessNotice}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-100">
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Đóng
              </button>

              <button
                onClick={handleFinalSubmitToTeacher}
                disabled={isSubmittingToTeacher}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Xác nhận gửi vào Góc Cô Giáo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
