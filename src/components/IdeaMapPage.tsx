import React, { useState, useRef, useEffect } from 'react';
import { 
  Student, 
  WritingTask, 
  OutlineItem, 
  DetailedOutlineGroup,
  AppSettings, 
  EssayGenre, 
  PromptUnderstanding, 
  VocabularyImageryBank,
  RefreshOutlineResult,
  ChatMessage,
  TextbookExercise,
  TextbookOcrResult 
} from '../types';
import { HoaNhoMascot } from './HoaNhoMascot';
import { AiStatusBar } from './AiStatusBar';
import { playPop, playChime, playSparkle } from '../utils/audio';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  Check, 
  Edit3, 
  MessageSquare, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw, 
  Send, 
  Trash2, 
  Lightbulb, 
  HelpCircle, 
  CheckCircle2, 
  X,
  Compass,
  Smile,
  FileText,
  Plus,
  RotateCw,
  Crop,
  AlertTriangle,
  MoveLeft,
  MoveRight
} from 'lucide-react';

interface IdeaMapPageProps {
  student: Student;
  settings: AppSettings;
  onProceedToWrite: (data: {
    prompt: string;
    grade: number;
    genre: EssayGenre;
    specialWishes: string;
    selectedOutline: OutlineItem[];
    detailedOutline?: DetailedOutlineGroup;
  }) => void;
  onBackToGarden?: () => void;
  initialPrompt?: string;
  initialGenre?: EssayGenre;
}

export const IdeaMapPage: React.FC<IdeaMapPageProps> = ({
  student,
  settings,
  onProceedToWrite,
  onBackToGarden,
  initialPrompt = '',
  initialGenre = 'ke_su_viec'
}) => {
  // 1. Prompt input & image OCR
  const [promptText, setPromptText] = useState(initialPrompt || 'Kể lại một hoạt động ngoài trời em đã tham gia cùng người thân hoặc bạn bè.');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [uncertainWords, setUncertainWords] = useState<string[]>([]);
  const [hasCheckedPrompt, setHasCheckedPrompt] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Textbook OCR & Exercise extraction states
  const [detectedOcrResult, setDetectedOcrResult] = useState<TextbookOcrResult | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<TextbookExercise | null>(null);
  const [isConfirmingExercise, setIsConfirmingExercise] = useState<boolean>(false);
  const [editedExerciseText, setEditedExerciseText] = useState<string>('');
  const [rawDetectedText, setRawDetectedText] = useState<string>('');
  const [ocrStepMessage, setOcrStepMessage] = useState<string>('🌷 Hoa Nhỏ đang xem bức ảnh của con...');
  const [ocrErrorMessage, setOcrErrorMessage] = useState<string>('');
  const [isCroppingIndex, setIsCroppingIndex] = useState<number | null>(null);
  const [cropSettings, setCropSettings] = useState<{ top: number; bottom: number; left: number; right: number }>({ top: 5, bottom: 5, left: 5, right: 5 });
  const [confirmedExerciseId, setConfirmedExerciseId] = useState<string | null>(null);

  // Keep prompt in sync if initialPrompt changes
  useEffect(() => {
    if (initialPrompt) {
      setPromptText(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (initialGenre) {
      setGenre(initialGenre);
    }
  }, [initialGenre]);

  // 2. Grade and Genre selection
  const [grade, setGrade] = useState<number>(3); // Mặc định Lớp 3
  const [genre, setGenre] = useState<EssayGenre>(initialGenre || 'ke_su_viec');
  const [specialWishes, setSpecialWishes] = useState<string>('Có hình ảnh so sánh, kể thật từ trải nghiệm của em');

  // 3. AI Understanding state ("Cùng Hoa Nhỏ hiểu đề nhé!")
  const [isUnderstandingLoading, setIsUnderstandingLoading] = useState(false);
  const [understanding, setUnderstanding] = useState<PromptUnderstanding | null>(null);

  // 4. Outline state - 3 Parts with bullet points
  const [detailedOutline, setDetailedOutline] = useState<DetailedOutlineGroup>({
    moDoan: [
      'Giới thiệu hoạt động ngoài trời em đã tham gia là gì.',
      'Thời gian và địa điểm diễn ra hoạt động đó (một buổi sáng đẹp trời, ở công viên...).'
    ],
    phatTrienDoan: [
      'Khung cảnh thiên nhiên, thời tiết và không khí hôm đó thế nào.',
      'Em và người thân/bạn bè đã chuẩn bị và bắt đầu hoạt động ra sao.',
      'Kể lần lượt các việc đã làm theo thứ tự (chạy nhảy, thả diều, đá bóng...).',
      'Chi tiết vui nhất hoặc kỷ niệm đáng nhớ nhất trong buổi hoạt động.'
    ],
    ketDoan: [
      'Cảm xúc vui tươi, sảng khoái và gắn bó sau hoạt động.',
      'Mong ước hoặc lời hứa cùng người thân/bạn bè tiếp tục tham gia lần sau.'
    ]
  });

  const [activeOutline, setActiveOutline] = useState<OutlineItem[]>([
    { id: '1', section: 'Mở đoạn', content: 'Giới thiệu hoạt động ngoài trời em đã tham gia vào lúc nào và ở đâu.' },
    { id: '2', section: 'Phát triển đoạn', content: 'Kể các việc em và người thân/bạn bè đã làm theo thứ tự và chi tiết đáng nhớ.' },
    { id: '3', section: 'Kết đoạn', content: 'Cảm nghĩ vui sướng và kỷ niệm khó quên trong lòng em.' }
  ]);
  const [initialOutlineBackup, setInitialOutlineBackup] = useState<OutlineItem[]>([]);
  const [refreshComparison, setRefreshComparison] = useState<RefreshOutlineResult | null>(null);
  const [isRefreshingOutline, setIsRefreshingOutline] = useState(false);

  // Editing state for outline bullets
  const [newBulletText, setNewBulletText] = useState<{ section: 'moDoan' | 'phatTrienDoan' | 'ketDoan'; text: string } | null>(null);

  // 5. Socratic Brainstorming / Personal experiences chat
  const [studentExperienceText, setStudentExperienceText] = useState('');
  const [socraticQuestion, setSocraticQuestion] = useState('Em đã từng tham gia hoạt động đó vào một ngày nắng đẹp hay chiều mát thế nào?');
  const [isSocraticLoading, setIsSocraticLoading] = useState(false);

  // 6. "Góc sáng tạo ý tưởng" (Continuous creative conversation)
  const [creativeChat, setCreativeChat] = useState<ChatMessage[]>([
    {
      id: 'c-1',
      sender: 'hoanho',
      text: 'Con còn điều gì băn khoăn? Hãy chia sẻ với Hoa Nhỏ nhé! Mỗi ý tưởng của con đều rất đáng quý.',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [creativeInput, setCreativeInput] = useState('');
  const [isCreativeChatLoading, setIsCreativeChatLoading] = useState(false);

  // 7. Contextual Vocabulary & Imagery Bank
  const [vocabBank, setVocabBank] = useState<VocabularyImageryBank | null>(null);
  const [isLoadingVocab, setIsLoadingVocab] = useState(false);
  const [activeVocabTab, setActiveVocabTab] = useState<'words' | 'images' | 'sentences'>('words');

  // Genre labels mapping
  const genreOptions: { value: EssayGenre; label: string; icon: string }[] = [
    { value: 'ke_su_viec', label: 'Kể lại một sự việc hoặc hoạt động', icon: '🏃' },
    { value: 'ta_do_vat', label: 'Tả đồ vật', icon: '🎒' },
    { value: 'ta_canh_vat', label: 'Tả cảnh vật', icon: '🌅' },
    { value: 'ta_nguoi', label: 'Tả người', icon: '👵' },
    { value: 'tinh_cam_cam_xuc', label: 'Viết đoạn văn nêu tình cảm, cảm xúc', icon: '💖' },
    { value: 'y_kien_nhan_vat', label: 'Nêu suy nghĩ, ý kiến về nhân vật', icon: '💡' },
    { value: 'ke_chuyen', label: 'Kể lại một câu chuyện', icon: '📖' },
    { value: 'sang_tao', label: 'Viết đoạn văn sáng tạo', icon: '✨' },
    { value: 'khac', label: 'Dạng bài khác', icon: '📝' }
  ];

  // Quick special wish tags
  const quickWishes = [
    'Viết khoảng 4–6 câu',
    'Viết khoảng 7–9 câu',
    'Có sử dụng từ láy',
    'Có hình ảnh so sánh',
    'Có hình ảnh nhân hóa',
    'Thể hiện cảm xúc chân thật',
    'Có mở bài hấp dẫn',
    'Có câu kết ấn tượng',
    'Có chi tiết từ trải nghiệm của em'
  ];

  // Image Rotation (Canvas-based)
  const rotateImage = (dataUrl: string, degrees: 90 | 180 | 270): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        if (degrees === 90 || degrees === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = dataUrl;
    });
  };

  // Image Cropping (Canvas-based)
  const cropImageByPercent = (
    dataUrl: string, 
    crop: { top: number; bottom: number; left: number; right: number }
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const sx = (crop.left / 100) * img.width;
        const sy = (crop.top / 100) * img.height;
        const sWidth = img.width * (1 - (crop.left + crop.right) / 100);
        const sHeight = img.height * (1 - (crop.top + crop.bottom) / 100);

        canvas.width = Math.max(50, Math.floor(sWidth));
        canvas.height = Math.max(50, Math.floor(sHeight));

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = dataUrl;
    });
  };

  const handleRotateImage = async (index: number) => {
    playPop(settings.soundEnabled);
    const original = uploadedImages[index];
    const rotated = await rotateImage(original, 90);
    const updated = [...uploadedImages];
    updated[index] = rotated;
    setUploadedImages(updated);
  };

  const handleStartCrop = (index: number) => {
    playPop(settings.soundEnabled);
    setIsCroppingIndex(index);
    setCropSettings({ top: 5, bottom: 5, left: 5, right: 5 });
  };

  const handleApplyCrop = async () => {
    if (isCroppingIndex === null) return;
    playSparkle(settings.soundEnabled);
    const original = uploadedImages[isCroppingIndex];
    const cropped = await cropImageByPercent(original, cropSettings);
    const updated = [...uploadedImages];
    updated[isCroppingIndex] = cropped;
    setUploadedImages(updated);
    setIsCroppingIndex(null);
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    playPop(settings.soundEnabled);
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= uploadedImages.length) return;
    const updated = [...uploadedImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setUploadedImages(updated);
  };

  // Handle image upload & OCR
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    playPop(settings.soundEnabled);
    const newImgs: string[] = [];
    const maxFiles = Math.min(files.length, 5 - uploadedImages.length);

    Array.from(files).slice(0, maxFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImgs.push(event.target.result as string);
          if (newImgs.length === maxFiles) {
            const combined = [...uploadedImages, ...newImgs];
            setUploadedImages(combined);
            processPromptOcr(combined);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const processPromptOcr = async (imagesToProcess: string[]) => {
    if (imagesToProcess.length === 0) return;
    setIsOcrLoading(true);
    setOcrErrorMessage('');
    setHasCheckedPrompt(false);
    setSelectedExercise(null);
    setIsConfirmingExercise(false);

    // Animated step progress messages
    const stepMessages = [
      '🌷 Hoa Nhỏ đang xem bức ảnh của con...',
      '📖 Hoa Nhỏ đang đọc từng dòng chữ...',
      '🌼 Hoa Nhỏ đang tìm các bài tập trong ảnh...',
      '🌱 Hoa Nhỏ đang tìm những lời gợi ý liên quan...',
      '🎉 Hoa Nhỏ đã tìm thấy bài tập! Con chọn câu mình muốn làm nhé!'
    ];

    let currentStepIdx = 0;
    setOcrStepMessage(stepMessages[0]);
    const stepInterval = setInterval(() => {
      currentStepIdx = Math.min(currentStepIdx + 1, stepMessages.length - 2);
      setOcrStepMessage(stepMessages[currentStepIdx]);
    }, 900);

    try {
      const res = await fetch('/api/ai/ocr-textbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imagesToProcess })
      });
      const data: TextbookOcrResult = await res.json();
      clearInterval(stepInterval);
      setOcrStepMessage(stepMessages[4]);
      setDetectedOcrResult(data);
      playChime(settings.soundEnabled);

      if (data.exercises && data.exercises.length > 0) {
        if (data.exercises.length === 1) {
          handleSelectExercise(data.exercises[0]);
        }
      }
    } catch (err) {
      console.error(err);
      clearInterval(stepInterval);
      setOcrErrorMessage('Hoa Nhỏ chưa đọc xong ảnh. Con hãy thử lại nhé!');
    } finally {
      setIsOcrLoading(false);
    }
  };

  const handleSelectExercise = (exercise: TextbookExercise) => {
    playPop(settings.soundEnabled);
    setSelectedExercise(exercise);
    setRawDetectedText(exercise.question_text);
    setEditedExerciseText(exercise.question_text);
    setIsConfirmingExercise(true);
  };

  const handleConfirmExercise = () => {
    if (!selectedExercise) return;
    playSparkle(settings.soundEnabled);
    const confirmedText = editedExerciseText.trim() || selectedExercise.question_text;
    setPromptText(confirmedText);
    setHasCheckedPrompt(true);
    setConfirmedExerciseId(selectedExercise.exercise_id);
    setIsConfirmingExercise(false);

    // If writing_type is recognized, update genre
    if (selectedExercise.writing_type) {
      const matched = genreOptions.find(g => g.value === selectedExercise.writing_type);
      if (matched) {
        setGenre(matched.value);
      }
    }

    // If expected_length is 2-3 sentences, adapt wishes and outline accordingly
    const isShort23 = selectedExercise.expected_length?.includes('2–3') || 
                      selectedExercise.expected_length?.includes('2-3') ||
                      confirmedText.includes('2–3 câu') ||
                      confirmedText.includes('2-3 câu');

    if (isShort23) {
      setSpecialWishes('Viết 2–3 câu theo đúng yêu cầu đề bài; lời văn tự nhiên, chân thật.');
      setDetailedOutline({
        moDoan: ['Câu 1: Giới thiệu người bạn em yêu quý và cảm xúc ấm áp.'],
        phatTrienDoan: ['Câu 2: Kể một nét đáng yêu hoặc việc bạn làm khiến em xúc động.'],
        ketDoan: ['Câu 3: Bày tỏ tình bạn gắn bó bền chặt và lời hứa với bạn.']
      });
      setActiveOutline([
        { id: '1', section: 'Câu 1 (Mở đầu)', content: 'Giới thiệu người bạn em yêu quý và cảm xúc ấm áp.' },
        { id: '2', section: 'Câu 2 (Cảm xúc)', content: 'Kể nét đáng yêu hoặc việc bạn làm khiến em xúc động.' },
        { id: '3', section: 'Câu 3 (Kết lại)', content: 'Bày tỏ tình bạn gắn bó bền chặt và lời hứa với bạn.' }
      ]);
    }
  };

  const removeImage = (index: number) => {
    playPop(settings.soundEnabled);
    const remaining = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(remaining);
    if (remaining.length === 0) {
      setDetectedOcrResult(null);
      setSelectedExercise(null);
      setIsConfirmingExercise(false);
    }
  };

  // Generate / Update Idea Map ("Tạo bản đồ ý tưởng")
  const handleGenerateIdeaMap = async () => {
    playChime(settings.soundEnabled);
    setIsUnderstandingLoading(true);
    setIsLoadingVocab(true);

    try {
      // 1. Understand prompt
      const resUnderstand = await fetch('/api/ai/understand-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          grade,
          genre,
          specialWishes
        })
      });
      const understandData = await resUnderstand.json();
      setUnderstanding(understandData);

      // 2. Synthesize base outline
      const resOutline = await fetch('/api/ai/synthesize-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: promptText,
          prompt: promptText,
          grade,
          genre,
          specialWishes,
          chatHistory: []
        })
      });
      const outlineData = await resOutline.json();
      if (outlineData.outline?.length) {
        setActiveOutline(outlineData.outline);
        setInitialOutlineBackup(outlineData.outline);
      }
      if (outlineData.detailedOutline) {
        setDetailedOutline(outlineData.detailedOutline);
      }

      // Update Socratic question contextually
      const pLow = promptText.toLowerCase();
      if (pLow.includes('nhà') || pLow.includes('góc') || pLow.includes('phòng') || pLow.includes('bàn học')) {
        setSocraticQuestion('Trong ngôi nhà thân yêu, góc nhỏ nào hoặc món đồ nào khiến con cảm thấy ấm áp và yêu quý nhất?');
      } else if (pLow.includes('bạn') || pLow.includes('thầy') || pLow.includes('cô') || pLow.includes('mẹ') || pLow.includes('bà')) {
        setSocraticQuestion('Kỷ niệm hoặc cử chỉ đáng yêu nào của người ấy làm con nhớ mãi không quên?');
      } else {
        setSocraticQuestion(`Khi nghĩ về "${promptText.slice(0, 35)}...", hình ảnh hoặc kỷ niệm nào hiện lên đầu tiên trong lòng con?`);
      }

      // 3. Fetch vocabulary & imagery bank
      const resVocab = await fetch('/api/ai/vocabulary-imagery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          genre,
          grade,
          studentIdeas: specialWishes
        })
      });
      const vocabData = await resVocab.json();
      setVocabBank(vocabData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUnderstandingLoading(false);
      setIsLoadingVocab(false);
    }
  };

  // Socratic question response & outline refreshing
  const handleAnswerSocratic = async () => {
    if (!studentExperienceText.trim()) return;

    playPop(settings.soundEnabled);
    setIsSocraticLoading(true);

    try {
      const res = await fetch('/api/ai/ask-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: promptText,
          prompt: promptText,
          chatHistory: [
            { sender: 'hoanho', text: socraticQuestion },
            { sender: 'student', text: studentExperienceText }
          ],
          studentInput: studentExperienceText,
          studentName: student.name
        })
      });
      const data = await res.json();
      setSocraticQuestion(data.question || 'Em nhớ lại cảm giác vui sướng khi ấy như thế nào?');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSocraticLoading(false);
    }
  };

  // "Làm mới dàn ý từ ý tưởng của em"
  const handleRefreshOutline = async () => {
    if (!studentExperienceText.trim()) return;

    playSparkle(settings.soundEnabled);
    setIsRefreshingOutline(true);

    try {
      const res = await fetch('/api/ai/refresh-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          grade,
          genre,
          previousOutline: activeOutline,
          studentStory: studentExperienceText
        })
      });
      const data: RefreshOutlineResult = await res.json();
      setRefreshComparison(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshingOutline(false);
    }
  };

  const handleApplyNewOutline = () => {
    if (refreshComparison?.newOutline) {
      playChime(settings.soundEnabled);
      setActiveOutline(refreshComparison.newOutline);
      if (refreshComparison.detailedOutline) {
        setDetailedOutline(refreshComparison.detailedOutline);
      }
      setRefreshComparison(null);
    }
  };

  const handleAddBullet = (section: 'moDoan' | 'phatTrienDoan' | 'ketDoan', text: string) => {
    if (!text.trim()) return;
    setDetailedOutline(prev => ({
      ...prev,
      [section]: [...prev[section], text.trim()]
    }));
    setNewBulletText(null);
    playPop(settings.soundEnabled);
  };

  const handleDeleteBullet = (section: 'moDoan' | 'phatTrienDoan' | 'ketDoan', index: number) => {
    setDetailedOutline(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
    playPop(settings.soundEnabled);
  };

  // "Góc sáng tạo ý tưởng" chat send
  const handleSendCreativeChat = async () => {
    if (!creativeInput.trim() || isCreativeChatLoading) return;

    playPop(settings.soundEnabled);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: creativeInput.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...creativeChat, newMsg];
    setCreativeChat(updated);
    const question = creativeInput.trim();
    setCreativeInput('');
    setIsCreativeChatLoading(true);

    try {
      const res = await fetch('/api/ai/creative-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          grade,
          chatHistory: updated,
          studentQuestion: question
        })
      });
      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'hoanho',
        text: data.reply || 'Hoa Nhỏ rất thích cách suy nghĩ riêng của em!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setCreativeChat([...updated, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreativeChatLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Banner with Soft Pastel Pink / Lavender / Sky Blue Gradient */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-sky-100 rounded-3xl p-4 sm:p-5 border-2 border-pink-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToGarden && (
            <button
              onClick={() => {
                playPop(settings.soundEnabled);
                onBackToGarden();
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-purple-900 border-2 border-purple-200 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-102"
              title="Quay lại vườn chính mà không mất nội dung"
            >
              <ArrowLeft className="w-4 h-4 text-purple-700" />
              <span>← Quay lại</span>
            </button>
          )}

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-purple-300 flex items-center justify-center text-2xl sm:text-3xl shadow-xs">
            🗺️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500 text-white">
                Trang 1 • Bản Đồ Ý Tưởng
              </span>
              <span className="text-xs text-purple-900 font-bold">Lớp {grade}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-purple-950 font-display">
              Khơi Nguồn Ý Tưởng – Kiến Tạo Dàn Ý Riêng
            </h2>
          </div>
        </div>

        <button
          onClick={() => onProceedToWrite({
            prompt: promptText,
            grade,
            genre,
            specialWishes,
            selectedOutline: activeOutline,
            detailedOutline
          })}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white font-extrabold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <span>Chuyển sang viết bài & nhận góp ý</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Animated AI Status Bars */}
      <AiStatusBar
        isLoading={isUnderstandingLoading}
        message="🌼 Hoa Nhỏ đang đọc đề bài và chuẩn bị dàn ý cho em..."
        reducedMotion={settings.reducedMotion}
      />
      <AiStatusBar
        isLoading={isOcrLoading}
        message={ocrStepMessage}
        reducedMotion={settings.reducedMotion}
      />
      <AiStatusBar
        isLoading={isRefreshingOutline}
        message="🌱 Những ý tưởng đầu tiên đang nảy mầm... Dàn ý sắp xong rồi!"
        reducedMotion={settings.reducedMotion}
      />
      <AiStatusBar
        isLoading={isLoadingVocab}
        message="🌸 Hoa Nhỏ đang chọn những từ ngữ và hình ảnh hay nhất cho bài viết của em..."
        reducedMotion={settings.reducedMotion}
      />

      {/* SECTION 1: NHẬP ĐỀ BÀI (Văn bản + Tối đa 5 ảnh đề bài với OCR kiểm tra) */}
      <div className="bg-white rounded-3xl border-2 border-pink-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">✏️</span>
            <h3 className="text-lg font-bold text-stone-900 font-display">
              1. Đề bài của con
            </h3>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Có thể nhập chữ hoặc tải ảnh chụp đề (Tối đa 5 ảnh)
          </span>
        </div>

        {/* Text input area */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700">
            Nội dung đề bài tập làm văn:
          </label>
          <textarea
            rows={3}
            value={promptText}
            onChange={(e) => {
              setPromptText(e.target.value);
              setHasCheckedPrompt(true);
            }}
            placeholder="Nhập đề bài của con vào đây..."
            className="w-full p-3.5 rounded-2xl border-2 border-purple-100 focus:border-purple-300 focus:outline-hidden text-sm sm:text-base leading-relaxed bg-pink-50/20"
          />
        </div>

        {/* Photo upload for prompt & textbook exercise parsing */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              multiple
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploadedImages.length >= 5 || isOcrLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-300 text-xs sm:text-sm font-bold transition-colors disabled:opacity-50 shadow-2xs"
            >
              <Camera className="w-4 h-4 text-pink-600" />
              <span>📷 Chụp bằng máy ảnh</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadedImages.length >= 5 || isOcrLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs sm:text-sm font-bold transition-colors disabled:opacity-50 shadow-2xs"
            >
              <Upload className="w-4 h-4 text-purple-600" />
              <span>📁 Tải ảnh SGK ({uploadedImages.length}/5)</span>
            </button>

            {uploadedImages.length > 0 && (
              <button
                onClick={() => processPromptOcr(uploadedImages)}
                disabled={isOcrLoading}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>🔍 Hoa Nhỏ đọc bài tập từ ảnh</span>
              </button>
            )}

            {isOcrLoading && (
              <span className="text-xs text-purple-700 font-bold flex items-center gap-1.5 animate-pulse bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
                <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
                <span>{ocrStepMessage}</span>
              </span>
            )}
          </div>

          {/* Uploaded images thumbnails with Rotate, Crop, Reorder & Delete */}
          {uploadedImages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                <span>Ảnh đã tải lên (con có thể xoay, cắt hoặc đổi thứ tự trang):</span>
                <span className="text-purple-700 font-semibold">{uploadedImages.length}/5 trang ảnh</span>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative w-28 sm:w-32 bg-white rounded-2xl overflow-hidden border-2 border-purple-200 shadow-sm flex flex-col group">
                    <div className="relative h-24 w-full bg-stone-100">
                      <img src={img} alt={`Trang ${i + 1}`} className="w-full h-full object-contain" />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-stone-900/80 text-white rounded-md text-[10px] font-bold">
                        Trang {i + 1}
                      </span>
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 bg-stone-900/70 text-white rounded-full hover:bg-rose-600 transition-colors"
                        title="Xóa ảnh này"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Image Action toolbar: Rotate, Crop, Move */}
                    <div className="p-1.5 bg-purple-50/70 flex items-center justify-between border-t border-purple-100 text-stone-700">
                      <button
                        onClick={() => handleRotateImage(i)}
                        className="p-1 hover:bg-purple-200 rounded-lg text-purple-800 transition-colors"
                        title="Xoay ảnh 90 độ"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleStartCrop(i)}
                        className="p-1 hover:bg-purple-200 rounded-lg text-purple-800 transition-colors"
                        title="Cắt ảnh để chọn phần bài tập"
                      >
                        <Crop className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleMoveImage(i, 'left')}
                          disabled={i === 0}
                          className="p-1 hover:bg-purple-200 rounded-lg text-purple-800 disabled:opacity-30 transition-colors"
                          title="Chuyển sang trái"
                        >
                          <MoveLeft className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveImage(i, 'right')}
                          disabled={i === uploadedImages.length - 1}
                          className="p-1 hover:bg-purple-200 rounded-lg text-purple-800 disabled:opacity-30 transition-colors"
                          title="Chuyển sang phải"
                        >
                          <MoveRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error notice */}
          {ocrErrorMessage && (
            <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs sm:text-sm text-rose-950 flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{ocrErrorMessage}</span>
              </div>
              <button
                onClick={() => processPromptOcr(uploadedImages)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 transition-colors"
              >
                Thử đọc lại
              </button>
            </div>
          )}

          {/* Quality notice */}
          {detectedOcrResult?.overall_quality_note && (
            <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs sm:text-sm text-amber-950 flex items-center gap-2 animate-fade-in">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium">{detectedOcrResult.overall_quality_note}</span>
            </div>
          )}

          {/* 8. GIAO DIỆN "HOA NHỎ ĐÃ TÌM THẤY CÂU HỎI" */}
          {detectedOcrResult && detectedOcrResult.exercises && detectedOcrResult.exercises.length > 0 && (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 border-2 border-purple-300 rounded-3xl space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h4 className="font-extrabold text-base sm:text-lg text-purple-950 font-display">
                    Hoa Nhỏ đã tìm thấy những bài tập này!
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-purple-800 bg-white/80 px-3 py-1 rounded-full border border-purple-200">
                  {detectedOcrResult.lesson_title && <span>{detectedOcrResult.lesson_title}</span>}
                  {detectedOcrResult.page_number && <span>• Trang {detectedOcrResult.page_number}</span>}
                  {detectedOcrResult.grade && <span>• Khối {detectedOcrResult.grade}</span>}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 font-medium">
                Hoa Nhỏ đã đọc và tách riêng từng bài tập trong ảnh. Con hãy bấm chọn bài mình muốn làm nhé!
              </p>

              {/* Exercises Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detectedOcrResult.exercises.map((ex, idx) => {
                  const isSelected = selectedExercise?.exercise_id === ex.exercise_id;
                  const isConfirmed = confirmedExerciseId === ex.exercise_id && hasCheckedPrompt;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl p-4 transition-all border-2 flex flex-col justify-between ${
                        isSelected || isConfirmed
                          ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-200'
                          : 'bg-white/90 border-purple-200 hover:border-pink-300 shadow-xs'
                      }`}
                    >
                      <div className="space-y-2.5">
                        {/* Header: Exercise ID & Expected Length Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-950 font-black text-xs sm:text-sm font-display border border-purple-300">
                            {ex.exercise_id || `Bài tập ${idx + 1}`}
                          </span>

                          {ex.expected_length && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-extrabold">
                              Độ dài: {ex.expected_length}
                            </span>
                          )}
                        </div>

                        {/* Question Text verbatim */}
                        <p className="text-xs sm:text-sm text-stone-900 font-bold leading-relaxed">
                          {ex.question_text}
                        </p>

                        {/* Sub questions (a, b, c) if any */}
                        {ex.sub_questions && ex.sub_questions.length > 0 && (
                          <div className="space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-700">
                            <span className="font-bold text-stone-800 block text-[11px] uppercase tracking-wide">
                              Gợi ý trong bài:
                            </span>
                            {ex.sub_questions.map((sub, sIdx) => (
                              <p key={sIdx} className="leading-relaxed pl-1 font-medium">
                                {sub}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Cross-exercise related prompts (e.g. linked from Exercise 2) */}
                        {ex.related_prompts && ex.related_prompts.length > 0 && (
                          <div className="space-y-1 bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-xs text-purple-900">
                            <span className="font-bold text-purple-950 flex items-center gap-1 text-[11px]">
                              <span>🔗</span>
                              <span>Gợi ý liên kết từ bài tập trước:</span>
                            </span>
                            {ex.related_prompts.map((rp, rIdx) => (
                              <p key={rIdx} className="leading-relaxed font-semibold pl-1 text-purple-950">
                                {rp}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Missing context warning if exercise references previous task not in photo */}
                        {ex.missing_context && (
                          <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 font-medium flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>{ex.missing_context}</span>
                          </div>
                        )}
                      </div>

                      {/* Select button */}
                      <div className="pt-3 border-t border-purple-100 mt-3">
                        <button
                          onClick={() => handleSelectExercise(ex)}
                          className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                            isSelected || isConfirmed
                              ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs'
                              : 'bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-300'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>
                            {isConfirmed ? '✓ Con đang làm bài này' : '🌸 Con chọn bài này'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 9. CHO HỌC SINH KIỂM TRA NỘI DUNG (Review & Confirmation Card) */}
          {isConfirmingExercise && selectedExercise && (
            <div className="p-4 sm:p-5 bg-white border-2 border-purple-400 rounded-3xl shadow-sm space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌸</span>
                  <h4 className="font-bold text-base text-purple-950 font-display">
                    Con cùng Hoa Nhỏ kiểm tra đề bài nhé!
                  </h4>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  {selectedExercise.exercise_id}
                </span>
              </div>

              <p className="text-xs text-stone-600">
                Con hãy đọc lại câu hỏi. Nếu có chữ nào AI đọc chưa đúng, con có thể trực tiếp sửa lại vào ô bên dưới:
              </p>

              <textarea
                rows={3}
                value={editedExerciseText}
                onChange={(e) => setEditedExerciseText(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-hidden text-sm sm:text-base font-medium leading-relaxed bg-pink-50/20"
                placeholder="Nguyên văn câu hỏi đã nhận diện..."
              />

              {/* Details banner */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {selectedExercise.expected_length && (
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold">
                    📏 Yêu cầu độ dài: {selectedExercise.expected_length}
                  </span>
                )}
                {selectedExercise.writing_type && (
                  <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-300 font-bold">
                    🏷️ Kiểu bài: {genreOptions.find(g => g.value === selectedExercise.writing_type)?.label || selectedExercise.writing_type}
                  </span>
                )}
                {selectedExercise.related_prompts && selectedExercise.related_prompts.length > 0 && (
                  <span className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-900 border border-sky-300 font-bold">
                    💡 Có gợi ý dẫn chiếu liên quan
                  </span>
                )}
              </div>

              {/* Uncertain words if any */}
              {selectedExercise.uncertain_spans && selectedExercise.uncertain_spans.length > 0 && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 font-medium">
                  <span>Những chữ cần kiểm tra: </span>
                  {selectedExercise.uncertain_spans.map((u, uIdx) => (
                    <span key={uIdx} className="font-bold underline ml-1">
                      "{u}"
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons: Edit or Confirm */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleConfirmExercise}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>✅ Đúng đề bài của con rồi!</span>
                </button>

                <button
                  onClick={() => {
                    playPop(settings.soundEnabled);
                    // Focus on textarea
                  }}
                  className="py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4 text-amber-700" />
                  <span>✏️ Con muốn sửa lại</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Crop Modal */}
          {isCroppingIndex !== null && uploadedImages[isCroppingIndex] && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3">
              <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-xl border-2 border-purple-200 animate-scale-in">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Crop className="w-5 h-5 text-purple-700" />
                    <h4 className="font-extrabold text-base text-purple-950 font-display">
                      Cắt ảnh bài tập {isCroppingIndex + 1}
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsCroppingIndex(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-stone-600">
                  Điều chỉnh các thanh kéo bên dưới để chỉ giữ lại đúng phần bài tập con muốn làm:
                </p>

                {/* Preview with crop guide lines */}
                <div className="relative h-56 bg-stone-100 rounded-2xl overflow-hidden border-2 border-purple-200 flex items-center justify-center">
                  <img
                    src={uploadedImages[isCroppingIndex]}
                    alt="Cắt ảnh"
                    className="h-full w-full object-contain"
                  />
                  {/* Dashed crop frame overlay */}
                  <div
                    className="absolute border-2 border-dashed border-rose-500 bg-rose-500/10 pointer-events-none transition-all"
                    style={{
                      top: `${cropSettings.top}%`,
                      bottom: `${cropSettings.bottom}%`,
                      left: `${cropSettings.left}%`,
                      right: `${cropSettings.right}%`
                    }}
                  >
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold">
                      Vùng giữ lại
                    </span>
                  </div>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-stone-700">
                  <div>
                    <label className="block mb-1">Cắt mép trên: {cropSettings.top}%</label>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={cropSettings.top}
                      onChange={(e) => setCropSettings({ ...cropSettings, top: Number(e.target.value) })}
                      className="w-full accent-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Cắt mép dưới: {cropSettings.bottom}%</label>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={cropSettings.bottom}
                      onChange={(e) => setCropSettings({ ...cropSettings, bottom: Number(e.target.value) })}
                      className="w-full accent-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Cắt mép trái: {cropSettings.left}%</label>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={cropSettings.left}
                      onChange={(e) => setCropSettings({ ...cropSettings, left: Number(e.target.value) })}
                      className="w-full accent-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Cắt mép phải: {cropSettings.right}%</label>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={cropSettings.right}
                      onChange={(e) => setCropSettings({ ...cropSettings, right: Number(e.target.value) })}
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-100">
                  <button
                    onClick={() => setIsCroppingIndex(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 font-bold text-xs hover:bg-stone-100"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleApplyCrop}
                    className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-xs"
                  >
                    ✅ Áp dụng cắt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2 & 3: CHỌN LỚP & DẠNG BÀI */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Grade selector (Lớp 1 đến Lớp 12, mặc định Lớp 3) */}
        <div className="md:col-span-4 bg-white rounded-3xl border-2 border-purple-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <span className="font-extrabold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <span>🎒</span>
              <span>2. Chọn lớp học của con</span>
            </span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Lớp {grade}
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            AI sẽ tự động điều chỉnh độ dài câu, vốn từ và dàn ý phù hợp theo từng lớp.
          </p>

          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
              <button
                key={g}
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setGrade(g);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  grade === g
                    ? 'bg-purple-600 text-white shadow-xs scale-105'
                    : 'bg-stone-50 text-stone-700 hover:bg-purple-50 border border-stone-200'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
        </div>

        {/* Genre selector (9 nhóm bài chi tiết) */}
        <div className="md:col-span-8 bg-white rounded-3xl border-2 border-sky-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-sky-100 pb-2">
            <span className="font-extrabold text-xs uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
              <span>📚</span>
              <span>3. Dạng bài con muốn viết</span>
            </span>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
              Đúng cấu trúc lớp {grade}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {genreOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  playPop(settings.soundEnabled);
                  setGenre(opt.value);
                }}
                className={`p-2.5 rounded-2xl border text-xs font-bold text-left transition-all flex items-center gap-2 ${
                  genre === opt.value
                    ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-xs ring-2 ring-sky-200'
                    : 'bg-white border-stone-200 hover:border-sky-200 hover:bg-sky-50/40 text-stone-700'
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span className="line-clamp-2 leading-snug">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: YÊU CẦU THÊM CỦA HỌC SINH */}
      <div className="bg-white rounded-3xl border-2 border-pink-200 p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-pink-100 pb-2">
          <span className="text-xl">🌟</span>
          <h3 className="text-base font-bold text-stone-900 font-display">
            4. Con muốn bài viết của mình có điều gì đặc biệt?
          </h3>
        </div>

        <p className="text-xs text-stone-600 font-medium">
          Con có thể tự gõ mong muốn riêng hoặc bấm chọn nhanh những gợi ý đáng yêu dưới đây:
        </p>

        {/* Quick wish pills */}
        <div className="flex flex-wrap gap-2">
          {quickWishes.map((w, idx) => {
            const isSelected = specialWishes.includes(w);
            return (
              <button
                key={idx}
                onClick={() => {
                  playPop(settings.soundEnabled);
                  if (isSelected) {
                    setSpecialWishes(specialWishes.replace(w, '').replace(/,\s*,/g, ',').trim());
                  } else {
                    setSpecialWishes(specialWishes ? `${specialWishes}, ${w}` : w);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'bg-pink-50 text-pink-900 hover:bg-pink-100 border border-pink-200'
                }`}
              >
                {isSelected ? '✓ ' : '+ '} {w}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={specialWishes}
          onChange={(e) => setSpecialWishes(e.target.value)}
          placeholder="Nhập mong muốn riêng của con (ví dụ: Tả thật sinh động, có câu văn cảm xúc về mẹ...)"
          className="w-full px-4 py-2.5 rounded-2xl border-2 border-pink-100 focus:border-pink-300 focus:outline-hidden text-sm"
        />

        <div className="pt-2 flex justify-center">
          <button
            onClick={handleGenerateIdeaMap}
            disabled={isUnderstandingLoading || isLoadingVocab}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white font-black text-sm sm:text-base shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Sparkles className={`w-5 h-5 ${isUnderstandingLoading || isLoadingVocab ? 'animate-spin text-yellow-300' : ''}`} />
            <span>
              {isUnderstandingLoading 
                ? '🌸 Hoa Nhỏ đang khởi tạo dàn ý...' 
                : isLoadingVocab 
                ? '🌼 Đang chọn lọc từ ngữ sinh động...' 
                : 'Tạo bản đồ ý tưởng'}
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 5: "CÙNG HOA NHỎ HIỂU ĐỀ NHÉ!" */}
      {understanding && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-sky-50 rounded-3xl border-3 border-purple-300 p-5 sm:p-6 shadow-md space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 border-b border-purple-200 pb-3">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-purple-400 flex items-center justify-center text-2xl shadow-xs">
              🌸
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-800">
                Hiểu đề sâu sắc
              </span>
              <h3 className="text-xl font-black text-purple-950 font-display">
                Cùng Hoa Nhỏ hiểu đề nhé!
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700 font-medium">
            <div className="p-3.5 bg-white/90 rounded-2xl border border-purple-200 shadow-2xs space-y-1">
              <strong className="text-purple-900 block font-bold">1. Bài yêu cầu em viết về điều gì?</strong>
              <p>{understanding.target}</p>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-purple-200 shadow-2xs space-y-1">
              <strong className="text-purple-900 block font-bold">2. Kiểu bài phù hợp:</strong>
              <p>{understanding.genreEvaluation}</p>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-purple-200 shadow-2xs space-y-1">
              <strong className="text-purple-900 block font-bold">3. Nội dung cần kể hoặc miêu tả:</strong>
              <ul className="list-disc list-inside space-y-0.5 pl-1">
                {understanding.contentRequirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-purple-200 shadow-2xs space-y-1">
              <strong className="text-purple-900 block font-bold">4. Số câu & Lưu ý khi viết:</strong>
              <p>• Dung lượng: <span className="font-bold text-sky-800">{understanding.suggestedSentenceCount}</span></p>
              <p>• Lời dặn dò: {understanding.advice}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: DÀN Ý CHI TIẾT 3 PHẦN & KHƠI MỞ Ý TƯỞNG RIÊNG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Dàn ý chi tiết 3 phần theo gạch đầu dòng */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-purple-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h3 className="text-base font-bold text-stone-900 font-display">
                Dàn ý chi tiết 3 phần của con
              </h3>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Mở đoạn • Phát triển đoạn • Kết đoạn
            </span>
          </div>

          <p className="text-xs text-stone-600 font-medium">
            Dàn ý giúp con định hướng từng câu văn. Con có thể thêm, bớt hoặc chỉnh sửa từng gạch đầu dòng theo ý mình:
          </p>

          {/* 1. MỞ ĐOẠN (2-3 gạch đầu dòng) */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5 font-display">
                <span>🌱</span>
                <span>1. MỞ ĐOẠN (2–3 gạch đầu dòng)</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                {detailedOutline.moDoan.length} ý
              </span>
            </div>

            <div className="space-y-1.5">
              {detailedOutline.moDoan.map((bullet, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 bg-white p-2.5 rounded-xl border border-emerald-100 text-xs sm:text-sm text-stone-800">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-black">•</span>
                    <span className="leading-relaxed font-medium">{bullet}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteBullet('moDoan', idx)}
                    className="text-stone-300 hover:text-rose-500 p-0.5 transition-colors"
                    title="Xóa ý này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {newBulletText?.section === 'moDoan' ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newBulletText.text}
                  onChange={(e) => setNewBulletText({ section: 'moDoan', text: e.target.value })}
                  placeholder="Nhập ý mở đoạn mới của con..."
                  className="flex-1 p-2 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-hidden"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddBullet('moDoan', newBulletText.text);
                  }}
                />
                <button
                  onClick={() => handleAddBullet('moDoan', newBulletText.text)}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setNewBulletText(null)}
                  className="px-2 py-2 text-stone-500 text-xs"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={() => setNewBulletText({ section: 'moDoan', text: '' })}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ý mở đoạn</span>
              </button>
            )}
          </div>

          {/* 2. PHÁT TRIỂN ĐOẠN (4-5 gạch đầu dòng) */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border-2 border-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-950 uppercase tracking-wide flex items-center gap-1.5 font-display">
                <span>🌿</span>
                <span>2. PHÁT TRIỂN ĐOẠN (4–5 gạch đầu dòng)</span>
              </span>
              <span className="text-[11px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                {detailedOutline.phatTrienDoan.length} ý
              </span>
            </div>

            <div className="space-y-1.5">
              {detailedOutline.phatTrienDoan.map((bullet, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 bg-white p-2.5 rounded-xl border border-purple-100 text-xs sm:text-sm text-stone-800">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-black">•</span>
                    <span className="leading-relaxed font-medium">{bullet}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteBullet('phatTrienDoan', idx)}
                    className="text-stone-300 hover:text-rose-500 p-0.5 transition-colors"
                    title="Xóa ý này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {newBulletText?.section === 'phatTrienDoan' ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newBulletText.text}
                  onChange={(e) => setNewBulletText({ section: 'phatTrienDoan', text: e.target.value })}
                  placeholder="Nhập ý phát triển đoạn mới..."
                  className="flex-1 p-2 rounded-xl border border-purple-300 text-xs bg-white focus:outline-hidden"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddBullet('phatTrienDoan', newBulletText.text);
                  }}
                />
                <button
                  onClick={() => handleAddBullet('phatTrienDoan', newBulletText.text)}
                  className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setNewBulletText(null)}
                  className="px-2 py-2 text-stone-500 text-xs"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={() => setNewBulletText({ section: 'phatTrienDoan', text: '' })}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ý phát triển đoạn</span>
              </button>
            )}
          </div>

          {/* 3. KẾT ĐOẠN (2 gạch đầu dòng) */}
          <div className="p-4 rounded-2xl bg-sky-50/60 border-2 border-sky-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-950 uppercase tracking-wide flex items-center gap-1.5 font-display">
                <span>🌸</span>
                <span>3. KẾT ĐOẠN (2 gạch đầu dòng)</span>
              </span>
              <span className="text-[11px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded-full border border-sky-200">
                {detailedOutline.ketDoan.length} ý
              </span>
            </div>

            <div className="space-y-1.5">
              {detailedOutline.ketDoan.map((bullet, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 bg-white p-2.5 rounded-xl border border-sky-100 text-xs sm:text-sm text-stone-800">
                  <div className="flex items-start gap-2">
                    <span className="text-sky-600 font-black">•</span>
                    <span className="leading-relaxed font-medium">{bullet}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteBullet('ketDoan', idx)}
                    className="text-stone-300 hover:text-rose-500 p-0.5 transition-colors"
                    title="Xóa ý này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {newBulletText?.section === 'ketDoan' ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newBulletText.text}
                  onChange={(e) => setNewBulletText({ section: 'ketDoan', text: e.target.value })}
                  placeholder="Nhập ý kết đoạn mới..."
                  className="flex-1 p-2 rounded-xl border border-sky-300 text-xs bg-white focus:outline-hidden"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddBullet('ketDoan', newBulletText.text);
                  }}
                />
                <button
                  onClick={() => handleAddBullet('ketDoan', newBulletText.text)}
                  className="px-3 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setNewBulletText(null)}
                  className="px-2 py-2 text-stone-500 text-xs"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={() => setNewBulletText({ section: 'ketDoan', text: '' })}
                className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ý kết đoạn</span>
              </button>
            )}
          </div>

          {/* Socratic question to break vague ideas into personal details */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-950 font-display">
              <HoaNhoMascot mood="thinking" size="sm" reducedMotion={settings.reducedMotion} />
              <span>Hoa Nhỏ khơi mở kỷ niệm thật của con:</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 font-semibold pl-1">
              "{socraticQuestion}"
            </p>

            <div className="space-y-2">
              <textarea
                rows={2}
                value={studentExperienceText}
                onChange={(e) => setStudentExperienceText(e.target.value)}
                placeholder="Con kể chi tiết kỷ niệm hoặc cảnh vật thật mà con nhớ nhất vào đây nhé..."
                className="w-full p-2.5 rounded-xl border border-amber-300 focus:outline-hidden text-xs sm:text-sm bg-white"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleAnswerSocratic}
                  disabled={!studentExperienceText.trim() || isSocraticLoading}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs shadow-xs transition-colors"
                >
                  Gửi câu trả lời cho Hoa Nhỏ
                </button>

                <button
                  onClick={handleRefreshOutline}
                  disabled={!studentExperienceText.trim() || isRefreshingOutline}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>🌱 Làm mới dàn ý của em</span>
                </button>
              </div>
            </div>
          </div>

          {/* Refresh comparison modal / card */}
          {refreshComparison && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-3 animate-fade-in">
              <span className="font-extrabold text-xs text-emerald-900 uppercase block">
                ✨ So sánh: Dàn ý mới mang dấu ấn của con
              </span>
              <p className="text-xs text-emerald-800 font-medium">
                {refreshComparison.comparisonNote}
              </p>

              {refreshComparison.detailedOutline ? (
                <div className="space-y-2 bg-white p-3 rounded-xl border border-emerald-200 text-xs">
                  <div>
                    <strong className="text-emerald-900 block font-bold mb-1">🌱 Mở đoạn:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-700 pl-1">
                      {refreshComparison.detailedOutline.moDoan.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-purple-900 block font-bold mb-1">🌿 Phát triển đoạn:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-700 pl-1">
                      {refreshComparison.detailedOutline.phatTrienDoan.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-sky-900 block font-bold mb-1">🌸 Kết đoạn:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-700 pl-1">
                      {refreshComparison.detailedOutline.ketDoan.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-emerald-200 text-xs">
                  {refreshComparison.newOutline.map((item, i) => (
                    <div key={i}>
                      <strong className="text-emerald-900">{item.section}: </strong>
                      <span className="text-stone-700">{item.content}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setRefreshComparison(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200"
                >
                  Giữ dàn ý cũ
                </button>
                <button
                  onClick={handleApplyNewOutline}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Dùng dàn ý mới này ✓
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right (5 cols): "GÓC SÁNG TẠO Ý TƯỞNG" (Trò chuyện liên tục) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-sky-200 p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 border-b border-sky-100 pb-2 mb-2">
              <span className="text-xl">💡</span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-sky-950 font-display">
                  Góc sáng tạo ý tưởng
                </h3>
                <span className="text-[11px] text-stone-500 font-medium">
                  Trao đổi liên tục cùng Hoa Nhỏ
                </span>
              </div>
            </div>

            {/* Chat conversation area */}
            <div className="bg-sky-50/40 rounded-2xl border border-sky-100 p-3 min-h-[220px] max-h-[300px] overflow-y-auto space-y-2.5">
              {creativeChat.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'student'
                      ? 'bg-purple-600 text-white ml-6 rounded-br-none font-medium'
                      : 'bg-white text-stone-800 mr-6 rounded-bl-none border border-sky-200 shadow-2xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`block text-[9px] mt-1 ${m.sender === 'student' ? 'text-purple-200' : 'text-stone-400'}`}>
                    {m.timestamp}
                  </span>
                </div>
              ))}
              {isCreativeChatLoading && (
                <div className="text-[11px] text-purple-700 font-bold p-1 animate-pulse">
                  Hoa Nhỏ đang lắng nghe và suy nghĩ...
                </div>
              )}
            </div>
          </div>

          {/* Chat input */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={creativeInput}
                onChange={(e) => setCreativeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendCreativeChat(); }}
                placeholder="Con muốn hỏi từ ngữ, hình ảnh hoặc nêu ý tưởng khác..."
                className="flex-1 px-3 py-2 rounded-xl border border-sky-200 text-xs focus:outline-hidden bg-white"
              />
              <button
                onClick={handleSendCreativeChat}
                disabled={!creativeInput.trim() || isCreativeChatLoading}
                className="p-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-50 transition-colors"
                title="Gửi câu hỏi"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[10px] text-stone-400 italic block text-center">
              * Con có thể tự do nêu suy nghĩ khác, Hoa Nhỏ luôn tôn trọng ý tưởng của con.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 7: KHO TỪ NGỮ VÀ HÌNH ẢNH SÁNG TẠO (Từ hay – Hình ảnh – Câu mẫu ngữ cảnh hóa) */}
      {vocabBank && (
        <div className="bg-white rounded-3xl border-2 border-pink-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              <h3 className="text-base sm:text-lg font-bold text-pink-950 font-display">
                Kho từ ngữ và hình ảnh sáng tạo (Được gợi ý theo đề của con)
              </h3>
            </div>

            {/* Tabs: Từ hay / Hình ảnh / Câu mẫu */}
            <div className="flex items-center gap-1.5 bg-pink-50 p-1 rounded-2xl border border-pink-200">
              <button
                onClick={() => { playPop(settings.soundEnabled); setActiveVocabTab('words'); }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeVocabTab === 'words' ? 'bg-pink-500 text-white shadow-2xs' : 'text-pink-900 hover:bg-pink-100'
                }`}
              >
                Từ hay ({vocabBank.goodWords.length})
              </button>
              <button
                onClick={() => { playPop(settings.soundEnabled); setActiveVocabTab('images'); }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeVocabTab === 'images' ? 'bg-purple-500 text-white shadow-2xs' : 'text-purple-900 hover:bg-purple-100'
                }`}
              >
                Hình ảnh ({vocabBank.imageries.length})
              </button>
              <button
                onClick={() => { playPop(settings.soundEnabled); setActiveVocabTab('sentences'); }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeVocabTab === 'sentences' ? 'bg-sky-500 text-white shadow-2xs' : 'text-sky-900 hover:bg-sky-100'
                }`}
              >
                Câu mẫu ({vocabBank.sampleSentences.length})
              </button>
            </div>
          </div>

          {/* TAB 1: TỪ HAY */}
          {activeVocabTab === 'words' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
              {vocabBank.goodWords.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-pink-50/50 border border-pink-200 space-y-1">
                  <span className="font-extrabold text-sm text-pink-800 block">
                    "{item.word}"
                  </span>
                  <p className="text-xs text-stone-600 font-medium">
                    {item.meaningAndUsage}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: HÌNH ẢNH (So sánh, nhân hóa) */}
          {activeVocabTab === 'images' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
              {vocabBank.imageries.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-purple-900">
                    <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-extrabold text-[10px]">
                      {item.type}
                    </span>
                    <span>Ví dụ gợi ý:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-800 italic">
                    "{item.example}"
                  </p>
                  <p className="text-xs text-stone-500 font-medium">
                    💡 {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CÂU MẪU (Kèm lý giải tại sao hay) */}
          {activeVocabTab === 'sentences' && (
            <div className="space-y-3 animate-fade-in">
              {vocabBank.sampleSentences.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-sky-800 uppercase tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400">
                      Gợi ý cách viết
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-800 italic">
                    "{item.sentence}"
                  </p>
                  <p className="text-xs text-emerald-800 font-medium bg-white/80 p-2 rounded-xl border border-sky-100">
                    ✨ <strong>Vì sao câu này hay:</strong> {item.whyItIsGood}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOTTOM ACTION: CHUYỂN SANG VIẾT BÀI VÀ GÓP Ý */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-sky-100 rounded-3xl p-5 border-2 border-purple-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-stone-900 text-base font-display">
            Con đã sẵn sàng viết bài chưa?
          </h4>
          <p className="text-xs text-stone-600 font-medium">
            Mang toàn bộ dàn ý và từ ngữ vừa chọn sang <strong className="text-purple-900">Trang 2: Cô góp ý bài văn</strong> nhé!
          </p>
        </div>

        <button
          onClick={() => {
            playSparkle(settings.soundEnabled);
            onProceedToWrite({
              prompt: promptText,
              grade,
              genre,
              specialWishes,
              selectedOutline: activeOutline
            });
          }}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <span>Sang Trang 2: Cô góp ý bài văn</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
