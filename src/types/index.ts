export interface LinkedCaregiver {
  id?: string;
  relation: string; // 'Bố' | 'Mẹ' | 'Ông' | 'Bà' | 'Người giám hộ'
  name: string;
  phone?: string;
  email?: string;
  code: string; // PH001 hoặc mã định danh phụ huynh
  pin?: string;
  status: 'active' | 'locked';
  linkedAt?: string;
}

export interface FamilyInviteCode {
  code: string; // vd: KN-HS001-7281
  studentId: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'used' | 'revoked' | 'expired';
  createdBy?: string;
  redeemedBy?: string;
}

export interface Student {
  id: string; // HS001 - HS035
  name: string; // Tên thật đầy đủ
  demoName: string; // Tên mẫu hiển thị khi cần bảo vệ riêng tư
  avatar: string; // Biểu tượng con vật / hoa đáng yêu
  pin: string; // Mã số 4 số (vd: 2016)
  parentCode: string; // Mã gia đình chính
  treeLevel: number; // 1: Mầm cây, 2: Cây non, 3: Cây ra nụ, 4: Cây nở hoa, 5: Vườn rực rỡ
  flowersEarned: number;
  starsEarned: number;
  learningTimeMinutes?: number; // Thời gian học tập thực tế
  consecutiveDays?: number; // Số ngày liên tiếp luyện viết
  className?: string; // Mặc định: Lớp 3 – Trường TH Lê Đức Thọ
  classId?: string; // ID lớp học (ví dụ: L3A)
  username?: string; // Tên đăng nhập tiện lợi (vd: hs001 hoặc phamtuean)
  accountStatus?: 'active' | 'locked' | 'deleted'; // Tình trạng tài khoản: đang hoạt động, tạm khóa, hoặc đã xóa
  lastLogin?: string; // Lần đăng nhập gần nhất
  temporaryPassword?: string; // Mật khẩu mới cấp một lần
  linkedCaregivers?: LinkedCaregiver[]; // Danh sách tài khoản gia đình liên kết (Bố, Mẹ, Người giám hộ)
  inviteCodes?: FamilyInviteCode[]; // Danh sách mã mời kết nối gia đình tạm thời
}

export type GardenType = 
  | 'ke_chuyen'    // Vườn kể chuyện
  | 'yeu_thuong'   // Vườn yêu thương
  | 'sac_mau'      // Vườn sắc màu
  | 'y_kien'       // Vườn ý kiến
  | 'cuoc_song';   // Vườn cuộc sống

export type EssayGenre =
  | 'viet_cau'          // Viết câu
  | 'viet_doan_van'     // Viết đoạn văn
  | 'ke_chuyen'         // Kể lại một câu chuyện / Kể chuyện
  | 'thuat_lai'         // Thuật lại sự việc
  | 'mieu_ta'           // Miêu tả
  | 'tinh_cam_cam_xuc'  // Viết đoạn văn nêu tình cảm, cảm xúc
  | 'neu_y_kien'        // Nêu ý kiến / suy nghĩ
  | 'viet_thu'          // Viết thư
  | 'loi_nhan'          // Viết lời nhắn
  | 'thong_bao'         // Viết thông báo
  | 'huong_dan'         // Viết hướng dẫn
  | 'bao_cao'           // Viết báo cáo
  | 'ke_hoach'          // Viết kế hoạch
  | 'sang_tao'          // Viết sáng tạo
  // Các định danh tương thích ngược
  | 'ke_su_viec'        // Kể lại một sự việc hoặc hoạt động
  | 'ta_do_vat'         // Tả đồ vật
  | 'ta_canh_vat'       // Tả cảnh vật
  | 'ta_nguoi'          // Tả người
  | 'y_kien_nhan_vat'   // Nêu suy nghĩ, ý kiến về nhân vật
  | 'khac';             // Dạng bài khác

export interface WritingTask {
  id: string;
  grade?: 1 | 2 | 3 | 4 | 5; // Khối lớp 1 đến 5 (mặc định Lớp 3)
  volume: 1 | 2; // Tập 1 hoặc Tập 2
  week: number;
  title: string;
  gardenType: GardenType;
  genre?: EssayGenre;
  prompt: string;
  suggestedQuestions: string[];
  evaluationCriteria: string[];
  textbookRef?: string;
  gradeMission?: string; // e.g. "Em tập viết câu", "Em tập viết đoạn 3–5 câu"...
  expectedLength?: string; // e.g. "1–2 câu hoàn chỉnh", "3–5 câu ngắn gọn"...
}

export interface ChatMessage {
  id: string;
  sender: 'hoanho' | 'student';
  text: string;
  timestamp: string;
}

export interface OutlineItem {
  id: string;
  section: string; // Mở đoạn, Phát triển đoạn, Kết đoạn... hoặc Phần 1, Phần 2...
  content: string;
}

export interface DetailedOutlineSection {
  id: string;
  title: string;
  bulletPoints?: string[];
  bullets?: string[];
  guideNote?: string;
  guide?: string;
  icon?: string;
  color?: string;
}

export interface DetailedOutlineGroup {
  moDoan: string[];         // Mở đoạn: danh sách các ý gợi mở
  phatTrienDoan: string[];  // Phát triển đoạn: danh sách các ý chi tiết
  ketDoan: string[];        // Kết đoạn: danh sách các ý kết
  sections?: DetailedOutlineSection[]; // Cấu trúc động chuyên biệt (ví dụ: Viết thư 5 phần)
  genre?: EssayGenre;
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
  score?: number; // Điểm số bài kiểm tra định kỳ (1–10)
  isExamGraded?: boolean;
}

export type TeacherRole = 'SUPER_ADMIN' | 'TEACHER';
export type TeacherStatus = 'active' | 'locked' | 'inactive';

export interface TeacherAccount {
  id: string; // Mã giáo viên, ví dụ: GV001
  username: string; // Tên đăng nhập
  fullName: string; // Họ tên đầy đủ: Nguyễn Thị Hải Duyên
  name: string; // Tên hiển thị: Cô Nguyễn Thị Hải Duyên
  salutation: 'cô' | 'thầy';
  role: TeacherRole; // SUPER_ADMIN hoặc TEACHER
  status: TeacherStatus; // active | locked | inactive
  phone?: string;
  email?: string;
  school: string; // Trường TH Lê Đức Thọ
  assignedClassIds: string[]; // Danh sách mã lớp phụ trách
  lastLogin?: string;
  createdAt: string;
  temporaryPassword?: string;
}

export interface Classroom {
  id: string; // L3A
  name: string; // Lớp 3A
  grade: 1 | 2 | 3 | 4 | 5;
  school: string;
  schoolYear: string;
  teacherIds: string[]; // Danh sách giáo viên phụ trách
  primaryTeacherId: string; // Giáo viên chủ nhiệm chính
  studentCount?: number;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface ClassAssignment {
  id: string; // ASM-001
  classId: string;
  teacherId: string;
  teacherName: string;
  title: string;
  prompt: string;
  grade: 1 | 2 | 3 | 4 | 5;
  genre: EssayGenre;
  gardenType: GardenType;
  assignedDate: string;
  dueDate?: string;
  isExam: boolean; // false: Luyện viết thường xuyên (nhận xét bằng lời); true: Kiểm tra định kỳ (chấm điểm thang 10)
  maxScore?: number; // 10
  status: 'active' | 'closed';
  instructions?: string;
  difficultyLevel?: DifficultyLevel;
  topicCode?: string;
  customOutline?: DetailedOutlineGroup;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: TeacherRole;
  action: string;
  targetType: 'teacher' | 'class' | 'student' | 'assignment' | 'system';
  targetId: string;
  targetName?: string;
  details: string;
}

export interface AuthUser {
  role: 'student' | 'teacher' | 'family';
  student?: Student;
  teacherName?: string;
  teacherSalutation?: 'thầy' | 'cô' | 'thầy/cô';
  parentName?: string;
  parentRelation?: string;
  parentCode?: string;
  caregiver?: LinkedCaregiver;
  token?: string;
  // Multi-teacher & RBAC fields
  teacherId?: string;
  teacherRole?: TeacherRole;
  assignedClassIds?: string[];
  teacherProfile?: TeacherAccount;
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
  classId?: string;
  assignmentId?: string;
  isExam?: boolean; // Bài kiểm tra định kỳ có chấm điểm
  score?: number; // Điểm số từ 1 đến 10 (chỉ dùng cho bài kiểm tra định kỳ)
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

// ------------------- BẢN ĐỒ Ý TƯỞNG & PHÂN TÍCH ĐỀ CÁ NHÂN HÓA -------------------

export interface PromptChoice {
  id: string;
  label: string;
  description: string;
  suggestedGenre: EssayGenre;
  icon?: string;
}

export interface PromptDirection {
  id: string;
  title: string;
  mainObject: string;
  scope: string;
  description?: string;
  icon?: string;
  recipient?: string;
  purpose?: string;
  pointOfView?: string;
  topicCode?: string;
  topicName?: string;
}

export interface MindMapBranch {
  id: string;
  title: string;
  name?: string;
  icon: string;
  color: string;
  points: string[];
  items?: string[];
}

export type PromptChoiceType = 'object_selection' | 'direction_selection' | 'task_selection' | 'none';

export interface ObjectChoiceItem {
  id: string;
  name: string;
  icon?: string;
  isCustom?: boolean;
}

export interface PromptAnalysisData {
  originalPrompt: string;
  grade: number;
  writingType?: EssayGenre;
  writingFormat?: string;
  topicCode?: string;
  topicName?: string;
  difficultyLevel?: DifficultyLevel;
  detectedTaskCodes?: string[];
  detectedTaskLabels?: string[];
  hasChoices?: boolean;
  choices?: PromptChoice[];
  hasMultipleDirections?: boolean;
  detectedDirections?: PromptDirection[];
  selectedDirectionId?: string | null;
  selectedDirectionTitle?: string;
  // LOẠI A - Lựa chọn đối tượng
  choiceType?: PromptChoiceType;
  objectChoiceQuestion?: string;
  availableObjects?: ObjectChoiceItem[];
  selectedObjectId?: string | null;
  selectedObjectName?: string | null;
  customObjectName?: string;
  coreSubject: string;
  mainObject?: string;
  writingScope?: string;
  audienceOrRecipient?: string;
  pointOfView?: string;
  promptEvidence?: string[];
  suggestedLength: string;
  hoaNhoUnderstand?: string;
  specificRequirements?: string[];
  socraticQuestions: string[];
  branches: MindMapBranch[];
  outline: DetailedOutlineGroup;
  vocabularySuggestions: VocabularyImageryBank;
  validationChecks?: ValidationCheckItem[];
  allChecksPassed?: boolean;
}

// ------------------- HỆ THỐNG 25 CHỦ ĐỀ & 64 NHIỆM VỤ VIẾT & KIỂM ĐỊNH 20 TIÊU CHÍ -------------------

export type DifficultyLevel = 'co_ban' | 'mo_rong' | 'nang_cao' | 'sang_tao';

export interface TopicGroupInfo {
  code: string;
  name: string;
  icon: string;
  description: string;
}

export interface WritingTaskDefinition {
  code: string;
  name: string;
  genre: EssayGenre;
  description: string;
  targetGrades: number[];
}

export interface ValidationCheckItem {
  id: string; // CHECK 01 - CHECK 20
  title: string;
  passed: boolean;
  note: string;
}

export interface PromptValidationReport {
  prompt: string;
  passedCount: number;
  totalChecks: number;
  isFullyValid: boolean;
  checks: ValidationCheckItem[];
}




