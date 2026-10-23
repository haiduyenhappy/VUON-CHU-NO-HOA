export interface LinkedCaregiver {
  relation: string; // 'Bố' | 'Mẹ' | 'Ông' | 'Bà' | 'Người giám hộ'
  name?: string;
  phone?: string;
  code: string; // PH001 - PH035
  pin?: string;
  status: 'active' | 'locked';
  linkedAt?: string;
}

export interface Student {
  id: string; // HS001 - HS035
  name: string; // Tên thật đầy đủ
  demoName: string; // Tên mẫu hiển thị khi cần bảo vệ riêng tư
  avatar: string; // Biểu tượng con vật / hoa đáng yêu
  pin: string; // Mã số 4 số (vd: 2016)
  parentCode: string; // Mã gia đình
  treeLevel: number; // 1: Mầm cây, 2: Cây non, 3: Cây ra nụ, 4: Cây nở hoa, 5: Vườn rực rỡ
  flowersEarned: number;
  starsEarned: number;
  learningTimeMinutes?: number; // Thời gian học tập thực tế
  consecutiveDays?: number; // Số ngày liên tiếp luyện viết
  className?: string; // Mặc định: Lớp 3 – Trường TH Lê Đức Thọ
  username?: string; // Tên đăng nhập tiện lợi (vd: hs001 hoặc phamtuean)
  accountStatus?: 'active' | 'locked' | 'deleted'; // Tình trạng tài khoản: đang hoạt động, tạm khóa, hoặc đã xóa
  lastLogin?: string; // Lần đăng nhập gần nhất
  temporaryPassword?: string; // Mật khẩu mới cấp một lần
  linkedCaregivers?: LinkedCaregiver[]; // Danh sách tài khoản gia đình liên kết
}

export type GardenType = 
  | 'ke_chuyen'    // Vườn kể chuyện
  | 'yeu_thuong'   // Vườn yêu thương
  | 'sac_mau'      // Vườn sắc màu
  | 'y_kien'       // Vườn ý kiến
  | 'cuoc_song';   // Vườn cuộc sống

export type EssayGenre =
  | 'ke_su_viec'        // Kể lại một sự việc hoặc hoạt động
  | 'ta_do_vat'         // Tả đồ vật
  | 'ta_canh_vat'       // Tả cảnh vật
  | 'ta_nguoi'          // Tả người
  | 'tinh_cam_cam_xuc'  // Viết đoạn văn nêu tình cảm, cảm xúc
  | 'y_kien_nhan_vat'   // Nêu suy nghĩ, ý kiến về nhân vật
  | 'ke_chuyen'         // Kể lại một câu chuyện
  | 'sang_tao'          // Viết đoạn văn sáng tạo
  | 'khac';             // Dạng bài khác

export interface WritingTask {
  id: string;
  volume: 1 | 2; // Tập 1 hoặc Tập 2
  week: number;
  title: string;
  gardenType: GardenType;
  prompt: string;
  suggestedQuestions: string[];
  evaluationCriteria: string[];
  textbookRef?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'hoanho' | 'student';
  text: string;
  timestamp: string;
}

export interface OutlineItem {
  id: string;
  section: string; // Mở đoạn, Phát triển đoạn, Kết đoạn...
  content: string;
}

export interface DetailedOutlineGroup {
  moDoan: string[];         // Mở đoạn: danh sách các ý gợi mở
  phatTrienDoan: string[];  // Phát triển đoạn: danh sách các ý chi tiết
  ketDoan: string[];        // Kết đoạn: danh sách các ý kết
}

export interface AIFeedback {
  flowerPraise: string; // 🌸 Bông hoa khen ngợi
  leafReminder: string; // 🍃 Chiếc lá nhắc em
  smallChallenge: string; // ⭐ Thử thách nhỏ
  suggestedStars: number;
  timestamp: string;
}

export interface TeacherFeedback {
  teacherName: string;
  comment: string;
  confirmedStars: number;
  flowerSticker?: string;
  timestamp: string;
  editedAiNotes?: string; // Ghi chú chỉnh sửa từ gợi ý của AI
  status?: 'draft' | 'published'; // Trạng thái: bản nháp của cô hoặc đã công bố cho học sinh & gia đình
  praiseIdea?: string; // Khen ngợi ý tưởng hay
  wordSentenceSuggestions?: string; // Góp ý dùng từ, đặt câu
  emotionCreativityEncouragement?: string; // Khích lệ cảm xúc & sáng tạo
  teacherAdvice?: string; // Lời dặn dò của cô
}

export interface AuthUser {
  role: 'student' | 'teacher' | 'family';
  student?: Student;
  teacherName?: string;
  parentCode?: string;
  token?: string;
}

export interface SubmissionDraft {
  version: number;
  content: string;
  timestamp: string;
}

export interface QualitativeSkillRating {
  id: 'chinh_ta' | 'bo_cuc' | 'von_tu' | 'cam_xuc';
  title: string;
  rating: 'Em đang luyện tập' | 'Em đã có tiến bộ' | 'Em thực hiện khá tốt' | 'Em tiếp tục phát huy nhé!';
  comment: string;
}

export interface FiveContentProgress {
  chinhTa: number; // 0 to 100%
  boCuc: number;
  noiDung: number;
  tuVung: number;
  camXuc: number;
}

export interface Submission {
  id: string;
  studentId: string;
  taskId: string;
  taskTitle: string;
  gardenType: GardenType;
  volume: 1 | 2;
  isIndependentTest: boolean;
  initialOutline: OutlineItem[];
  detailedOutline?: DetailedOutlineGroup;
  developedOutline: OutlineItem[];
  firstDraft: string;
  drafts: SubmissionDraft[];
  finalContent: string;
  aiFeedback?: AIFeedback;
  comprehensiveFeedback?: ComprehensiveFeedback;
  teacherFeedback?: TeacherFeedback;
  status: 'draft' | 'submitted' | 'reviewed';
  startedAt: string;
  completedAt?: string;
  handwrittenImages?: string[];
  studentNotesToTeacher?: string;
  isOffTopic?: boolean;
}

export interface SampleReading {
  id: string;
  title: string;
  gardenType: GardenType;
  volume: 1 | 2;
  author: string;
  content: string;
  goodPoints: string[];
  sampleOutline: OutlineItem[];
  learningQuestion: string;
  creativeMission: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  demoPrivacyMode: boolean;
}

// ------------------- BẢN ĐỒ Ý TƯỞNG & GÓP Ý BÀI VĂN -------------------

export interface PromptUnderstanding {
  target: string;
  genreEvaluation: string;
  contentRequirements: string[];
  suggestedSentenceCount: string;
  specialWishesNoted: string[];
  advice: string;
}

export interface VocabularyImageryBank {
  goodWords: { word: string; meaningAndUsage: string }[];
  imageries: { type: string; example: string; explanation: string }[];
  sampleSentences: {
    type: 'mo_bai' | 'mieu_ta' | 'ket_bai';
    label: string;
    sentence: string;
    whyItIsGood: string;
  }[];
  creativeIdeas: string[];
}

export interface RefreshOutlineResult {
  initialIdeas: string[];
  newDetails: string[];
  newOutline: OutlineItem[];
  detailedOutline?: DetailedOutlineGroup;
  comparisonNote: string;
}

export interface GoodSentenceHighlight {
  sentence: string;
  goodPoint: string;
  sensoryDetail: string;
  emotionExpressed: string;
  learningTip: string;
}

export interface ErrorCorrectionItem {
  type: 'chinh_ta' | 'dung_tu' | 'dat_cau';
  originalText: string;
  reviewPoint: string;
  suggestion: string;
  explanation: string;
  isCertainError: boolean;
}

export interface OffTopicCheckResult {
  isOffTopic: boolean;
  isUncertain: boolean;
  message: string;
  guidance: string;
}

export interface ComprehensiveFeedback {
  whatYouToldWell: string;
  ideasStructure: string;
  emotionsExpressed: string;
  highlightedSentences: GoodSentenceHighlight[];
  corrections: ErrorCorrectionItem[];
  overallEvaluation: string;
  improvementGuidance: string;
  skills: QualitativeSkillRating[];
  fiveContents: FiveContentProgress;
  criteriaScores: {
    criterion: string;
    rating: string;
    note: string;
  }[];
  personalEncouragement: string;
  timestamp: string;
}

export interface BadgeItem {
  id: 'nguoi_khoi_dau' | 'cay_but_cham_chi' | 'cay_but_vang' | 'bac_thay_tu_vung';
  title: string;
  icon: string;
  description: string;
  condition: string;
  isAchieved: boolean;
  achievedDate?: string;
}

// ------------------- ĐỌC ẢNH SGK VÀ TÁCH CÂU HỎI -------------------

export interface TextbookExercise {
  exercise_id: string; // Tên/số bài tập (vd: "Bài tập 2", "Bài tập 3")
  question_text: string; // Nguyên văn câu hỏi từ SGK
  sub_questions: string[]; // Các ý a, b, c, d nếu có
  related_prompts: string[]; // Gợi ý dẫn chiếu từ bài tập liên quan
  supporting_content?: string; // Đoạn văn, bảng hoặc thông tin tham khảo
  writing_type?: string; // Dạng bài viết dự kiến (vd: "tinh_cam_cam_xuc", "ke_su_viec")
  expected_length?: string; // Yêu cầu độ dài (vd: "2–3 câu", "đoạn văn 4–5 câu")
  uncertain_spans: string[]; // Các chữ chưa đọc chắc chắn
  missing_context?: string | null; // Cảnh báo nếu câu hỏi dẫn chiếu bài phía trên nhưng ảnh chưa chụp
  ready_for_confirmation: boolean;
}

export interface TextbookOcrResult {
  lesson_title?: string;
  page_number?: string;
  subject?: string;
  grade?: number;
  exercises: TextbookExercise[];
  overall_quality_note?: string;
}

