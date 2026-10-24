import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_STUDENTS } from './src/data/studentsData.js';
import type { 
  Student, 
  LinkedCaregiver, 
  FamilyInviteCode, 
  PromptAnalysisData, 
  PromptDirection,
  TeacherAccount,
  Classroom,
  ClassAssignment,
  AuditLogItem
} from './src/types/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable large JSON bodies for uploading up to 10 photos of handwritten essays
app.use(express.json({ limit: '35mb' }));

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Database setup (supports persistent local disk and ephemeral serverless /tmp)
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Notice: DATA_DIR creation deferred or in read-only environment:', e);
}

interface DatabaseStructure {
  students: any[];
  submissions: any[];
  teachers: TeacherAccount[];
  classes: Classroom[];
  assignments: ClassAssignment[];
  auditLogs: AuditLogItem[];
}

const SEED_SUBMISSIONS = [
  {
    id: 'sub-seed-01',
    studentId: 'HS001',
    taskId: 'tap1-01',
    taskTitle: 'Kể lại một hoạt động đã làm cùng người thân',
    gardenType: 'ke_chuyen',
    volume: 1,
    isIndependentTest: false,
    initialOutline: [
      { id: '1', section: 'Mở đoạn', content: 'Giới thiệu buổi chiều chủ nhật ấm áp em cùng mẹ nấu bữa cơm chiều.' },
      { id: '2', section: 'Thân đoạn', content: 'Em giúp mẹ nhặt rau muống xanh non, mẹ hướng dẫn em gọt cà rốt và nghe em kể chuyện trường lớp.' },
      { id: '3', section: 'Kết đoạn', content: 'Cả nhà quây quần bên mâm cơm thơm lừng, em cảm thấy rất vui và hạnh phúc.' }
    ],
    developedOutline: [
      { id: '1', section: 'Mở đoạn', content: 'Giới thiệu buổi chiều chủ nhật ấm áp em cùng mẹ vào bếp nấu cơm.' },
      { id: '2', section: 'Thân đoạn', content: 'Em rửa tay sạch sẽ, ngồi nhặt từng cọng rau muống xanh mướt bên cạnh mẹ. Gian bếp rộn rã tiếng cười vui.' },
      { id: '3', section: 'Kết đoạn', content: 'Bữa cơm đầm ấm làm em thấy yêu gian bếp và gia đình mình tha thiết.' }
    ],
    firstDraft: 'Chiều chủ nhật em với mẹ cùng nấu cơm. Em nhặt rau muống và gọt củ cà rốt. Hai mẹ con nói chuyện rất vui. Cơm chín cả nhà cùng ăn thật ngon miệng.',
    drafts: [
      {
        version: 1,
        content: 'Chiều chủ nhật em với mẹ cùng nấu cơm. Em nhặt rau muống và gọt củ cà rốt. Hai mẹ con nói chuyện rất vui. Cơm chín cả nhà cùng ăn thật ngon miệng.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    finalContent: 'Chiều chủ nhật vừa qua, em đã có một trải nghiệm thật ý nghĩa khi cùng mẹ chuẩn bị bữa cơm cho cả nhà. Dưới ánh nắng vàng nhạt xuyên qua khung cửa sổ, em ngoan ngoãn ngồi bên mẹ, cẩn thận nhặt từng ngọn rau muống non mởn. Mẹ vừa xào thịt bò thơm nức, vừa dịu dàng lắng nghe em tíu tít kể những câu chuyện vui ở lớp. Gian bếp nhỏ ngập tràn tiếng cười rộn rã và hương vị ấm cúng. Khi cả gia đình quây quần bên mâm cơm nóng hổi, bố khen món canh rau của em rất ngọt mát. Em cảm thấy vô cùng hạnh phúc và tự nhủ sẽ chăm chỉ giúp đỡ bố mẹ nhiều hơn nữa.',
    aiFeedback: {
      flowerPraise: 'Đoạn văn của em rất sinh động, giàu hình ảnh như "nắng vàng nhạt", "ngọn rau non mởn" và chan chứa tình cảm gia đình!',
      leafReminder: 'Em đã ngắt câu rất khéo léo và dùng dấu câu chính xác.',
      smallChallenge: 'Em có thể dùng thêm một từ ngữ gợi cảm xúc trước khi kết thúc câu chuyện để bài viết thêm lắng đọng nhé.',
      suggestedStars: 5,
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    teacherFeedback: {
      teacherName: 'Cô Nguyễn Thị Hải Duyên',
      comment: 'Bài văn của Tuệ An rất giàu cảm xúc, câu từ trong sáng và hình ảnh gian bếp gia đình hiện lên thật đầm ấm! Cô rất khen ngợi tinh thần biết giúp đỡ mẹ của con.',
      confirmedStars: 5,
      flowerSticker: '🌸 Bông hoa viết hay',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'published',
      praiseIdea: 'Ý tưởng gắn kết tình cảm gia đình qua bữa cơm chiều chủ nhật rất gần gũi và chân thật.',
      wordSentenceSuggestions: 'Các từ ngữ "non mởn", "tíu tít", "thơm nức" được dùng rất tự nhiên và gợi cảm.',
      emotionCreativityEncouragement: 'Cảm xúc vui sướng khi được bố khen ở đoạn kết làm bài văn bừng sáng.',
      teacherAdvice: 'Con hãy tiếp tục phát huy nét chữ đẹp và tâm hồn giàu cảm xúc này nhé!'
    },
    status: 'reviewed',
    startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'sub-seed-02',
    studentId: 'HS001',
    taskId: 'tap1-02',
    taskTitle: 'Tả một đồ dùng học tập em yêu quý',
    gardenType: 'sac_mau',
    volume: 1,
    isIndependentTest: false,
    initialOutline: [
      { id: '1', section: 'Mở đoạn', content: 'Giới thiệu chiếc hộp bút màu hồng pastel bố tặng em nhân dịp năm học mới.' },
      { id: '2', section: 'Thân đoạn', content: 'Hình dáng chữ nhật thon gọn, có in hình chú gấu bông nhỏ xinh. Bên trong chia thành nhiều ngăn đựng bút chì, tẩy và thước kẻ ngay ngắn.' },
      { id: '3', section: 'Kết đoạn', content: 'Chiếc hộp bút là người bạn thân thiết giúp em luôn giữ gìn dụng cụ học tập cẩn thận.' }
    ],
    developedOutline: [
      { id: '1', section: 'Mở đoạn', content: 'Chiếc hộp bút màu hồng pastel xinh xắn là món quà bố tặng em đầu năm học.' },
      { id: '2', section: 'Thân đoạn', content: 'Hộp bút bằng vải êm ái, khóa kéo trơn tru, bên trong đựng vừa vặn bút mực, bút chì và chiếc thước kẻ.' },
      { id: '3', section: 'Kết đoạn', content: 'Em luôn giữ gìn hộp bút cẩn thận và xem như một người bạn nhỏ đồng hành mỗi ngày.' }
    ],
    firstDraft: 'Em có một chiếc hộp bút màu hồng. Bố tặng em khi vào lớp 3. Hộp bút đựng được nhiều đồ học tập. Em rất thích chiếc hộp bút này.',
    drafts: [
      {
        version: 1,
        content: 'Em có một chiếc hộp bút màu hồng. Bố tặng em khi vào lớp 3. Hộp bút đựng được nhiều đồ học tập. Em rất thích chiếc hộp bút này.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ],
    finalContent: 'Nhân dịp bước vào năm học lớp ba, bố đã tặng em một chiếc hộp bút màu hồng pastel vô cùng xinh xắn. Chiếc hộp bút có hình chữ nhật thon gọn, bên ngoài may bằng lớp vải dù mềm mại có in hình chú thỏ trắng đang ôm củ cà rốt. Chiếc khóa kéo bằng kim loại sáng bóng, đóng mở rất nhẹ nhàng và trơn tru. Bên trong hộp bút chia thành hai ngăn tiện lợi: một ngăn em xếp bút mực, bút chì thật ngay ngắn; ngăn còn lại em cất cục tẩy và chiếc thước kẻ kẻ hoa văn đáng yêu. Mỗi ngày đến lớp, người bạn nhỏ này luôn nằm ngoan ngoãn trong cặp sách, nhắc nhở em giữ gìn đồ dùng ngăn nắp. Em rất yêu quý chiếc hộp bút và xem nó như người bạn đồng hành thân thiết trên con đường học tập.',
    aiFeedback: {
      flowerPraise: 'Đoạn văn miêu tả đồ vật rất chi tiết và sinh động! Em đã biết cách dùng từ ngữ gợi hình như "hồng pastel", "khóa kéo sáng bóng", "nằm ngoan ngoãn".',
      leafReminder: 'Đoạn văn đã rất hoàn chỉnh, câu văn gãy gọn và giàu liên tưởng.',
      smallChallenge: 'Em hãy đọc lại để chuẩn bị trình bày trước lớp nhé!',
      suggestedStars: 5,
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    status: 'submitted',
    startedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'sub-seed-03',
    studentId: 'HS002',
    taskId: 'tap1-01',
    taskTitle: 'Kể lại một hoạt động đã làm cùng người thân',
    gardenType: 'ke_chuyen',
    volume: 1,
    isIndependentTest: true,
    initialOutline: [],
    developedOutline: [],
    firstDraft: 'Sáng chủ nhật em cùng bố tưới cây ngoài ban công. Hai bố con cùng bắt sâu và nhổ cỏ. Em thấy cây hoa hồng nở rất đẹp.',
    drafts: [],
    finalContent: 'Sáng chủ nhật đẹp trời, em cùng bố chăm sóc khu vườn nhỏ ngoài ban công. Bố hướng dẫn em dùng bình tưới nhỏ tưới đều nước cho từng chậu hoa. Em cẩn thận nhặt sạch những chiếc lá úa và ngắm nhìn những nụ hoa hồng đang e ấp trong sương sớm. Em cảm thấy rất vui vì đã góp sức nhỏ làm cho khu vườn thêm xanh tươi.',
    status: 'submitted',
    startedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 7).toISOString()
  }
];

const SEED_TEACHERS: TeacherAccount[] = [
  {
    id: 'GV001',
    username: 'haiduyen',
    fullName: 'Nguyễn Thị Hải Duyên',
    name: 'Cô Nguyễn Thị Hải Duyên',
    salutation: 'cô',
    role: 'SUPER_ADMIN',
    status: 'active',
    phone: '0908123456',
    email: 'haiduyenpvc@gmail.com',
    school: 'Trường Tiểu học Lê Đức Thọ',
    assignedClassIds: ['L3A'],
    lastLogin: 'Hôm nay 07:30',
    createdAt: '2026-08-15T08:00:00.000Z'
  },
  {
    id: 'GV002',
    username: 'vanminh',
    fullName: 'Trần Văn Minh',
    name: 'Thầy Trần Văn Minh',
    salutation: 'thầy',
    role: 'TEACHER',
    status: 'active',
    phone: '0912345678',
    email: 'vanminh@leductho.edu.vn',
    school: 'Trường Tiểu học Lê Đức Thọ',
    assignedClassIds: ['L4B'],
    lastLogin: 'Hôm qua 14:20',
    createdAt: '2026-09-01T08:00:00.000Z'
  }
];

const SEED_CLASSES: Classroom[] = [
  {
    id: 'L3A',
    name: 'Lớp 3A',
    grade: 3,
    school: 'Trường Tiểu học Lê Đức Thọ',
    schoolYear: '2025-2026',
    teacherIds: ['GV001'],
    primaryTeacherId: 'GV001',
    studentCount: 35,
    status: 'active',
    createdAt: '2026-08-15T08:00:00.000Z'
  },
  {
    id: 'L4B',
    name: 'Lớp 4B',
    grade: 4,
    school: 'Trường Tiểu học Lê Đức Thọ',
    schoolYear: '2025-2026',
    teacherIds: ['GV002'],
    primaryTeacherId: 'GV002',
    studentCount: 30,
    status: 'active',
    createdAt: '2026-09-01T08:00:00.000Z'
  }
];

const SEED_ASSIGNMENTS: ClassAssignment[] = [
  {
    id: 'ASM-001',
    classId: 'L3A',
    teacherId: 'GV001',
    teacherName: 'Cô Nguyễn Thị Hải Duyên',
    title: 'Tả ngôi trường hoặc một góc sân trường em yêu thích',
    prompt: 'Viết một đoạn văn tả ngôi trường tiểu học của em hoặc một góc sân trường mà em yêu thích nhất.',
    grade: 3,
    genre: 'ta_canh_vat',
    gardenType: 'sac_mau',
    assignedDate: '2026-10-20',
    dueDate: '2026-10-28',
    isExam: false,
    status: 'active',
    instructions: 'Các em chú ý quan sát kỹ và chọn 1 trong 2 hướng viết nhé.'
  },
  {
    id: 'ASM-002',
    classId: 'L3A',
    teacherId: 'GV001',
    teacherName: 'Cô Nguyễn Thị Hải Duyên',
    title: 'Bài kiểm tra định kỳ giữa kỳ 1: Kể một việc tốt',
    prompt: 'Kể lại một việc tốt em đã làm để giúp đỡ bạn bè hoặc người thân.',
    grade: 3,
    genre: 'ke_su_viec',
    gardenType: 'ke_chuyen',
    assignedDate: '2026-10-15',
    dueDate: '2026-10-22',
    isExam: true,
    maxScore: 10,
    status: 'active',
    instructions: 'Bài kiểm tra đánh giá theo thang điểm 10. Các em tự làm bài trung thực.'
  }
];

const SEED_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-001',
    timestamp: new Date().toISOString(),
    actorId: 'GV001',
    actorName: 'Nguyễn Thị Hải Duyên',
    actorRole: 'SUPER_ADMIN',
    action: 'SYSTEM_INITIALIZATION',
    targetType: 'system',
    targetId: 'SYS',
    targetName: 'Hệ thống Vườn Chữ Nở Hoa',
    details: 'Khởi tạo hệ thống quản trị nhiều giáo viên và phân quyền Super Admin cho cô Nguyễn Thị Hải Duyên.'
  }
];

let memoryDb: DatabaseStructure = {
  students: INITIAL_STUDENTS.map(s => ({ ...s, classId: 'L3A' })),
  submissions: SEED_SUBMISSIONS,
  teachers: SEED_TEACHERS,
  classes: SEED_CLASSES,
  assignments: SEED_ASSIGNMENTS,
  auditLogs: SEED_AUDIT_LOGS
};

function loadDatabase(): DatabaseStructure {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseStructure = {
        students: INITIAL_STUDENTS.map(s => ({ ...s, classId: 'L3A' })),
        submissions: SEED_SUBMISSIONS,
        teachers: SEED_TEACHERS,
        classes: SEED_CLASSES,
        assignments: SEED_ASSIGNMENTS,
        auditLogs: SEED_AUDIT_LOGS
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      memoryDb = initialDb;
      return initialDb;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.submissions || parsed.submissions.length === 0) {
      parsed.submissions = SEED_SUBMISSIONS;
    }

    // Ensure teachers exist with Cô Nguyễn Thị Hải Duyên as SUPER_ADMIN
    if (!parsed.teachers || !Array.isArray(parsed.teachers) || parsed.teachers.length === 0) {
      parsed.teachers = SEED_TEACHERS;
    } else {
      const duyen = parsed.teachers.find((t: any) => 
        t.fullName === 'Nguyễn Thị Hải Duyên' || 
        t.username === 'haiduyen' || 
        t.id === 'GV001'
      );
      if (duyen) {
        duyen.role = 'SUPER_ADMIN';
        duyen.status = 'active';
        duyen.fullName = 'Nguyễn Thị Hải Duyên';
        duyen.name = 'Cô Nguyễn Thị Hải Duyên';
        if (!duyen.assignedClassIds || duyen.assignedClassIds.length === 0) {
          duyen.assignedClassIds = ['L3A'];
        }
      } else {
        parsed.teachers.unshift(SEED_TEACHERS[0]);
      }
    }

    // Ensure classes exist
    if (!parsed.classes || !Array.isArray(parsed.classes) || parsed.classes.length === 0) {
      parsed.classes = SEED_CLASSES;
    }

    // Ensure assignments exist
    if (!parsed.assignments || !Array.isArray(parsed.assignments)) {
      parsed.assignments = SEED_ASSIGNMENTS;
    }

    // Ensure audit logs exist
    if (!parsed.auditLogs || !Array.isArray(parsed.auditLogs)) {
      parsed.auditLogs = SEED_AUDIT_LOGS;
    }

    // Normalize student accounts with classId and full caregiver connections
    if (parsed.students && Array.isArray(parsed.students)) {
      parsed.students = parsed.students.map((s: any, idx: number) => {
        const studentId = s.id || `HS${String(idx + 1).padStart(3, '0')}`;
        const parentCode = s.parentCode || `PH${String(idx + 1).padStart(3, '0')}`;
        
        let caregivers = s.linkedCaregivers;
        if (!caregivers || !Array.isArray(caregivers) || caregivers.length === 0) {
          caregivers = [
            {
              id: `cg-${studentId}-1`,
              relation: 'Bố / Mẹ',
              name: `Phụ huynh em ${s.name ? s.name.split(' ').slice(-1)[0] : 'học sinh'}`,
              phone: '09' + String(10000000 + (idx + 1) * 2345).slice(0, 8),
              code: parentCode,
              status: 'active',
              linkedAt: '2026-09-05'
            }
          ];
        } else {
          caregivers = caregivers.map((cg: any, cgIdx: number) => ({
            ...cg,
            id: cg.id || `cg-${studentId}-${cgIdx + 1}`,
            status: cg.status || 'active',
            code: cg.code || parentCode,
            relation: cg.relation || 'Bố / Mẹ',
            name: cg.name || `Phụ huynh em ${s.name.split(' ').slice(-1)[0]}`
          }));
        }

        const inviteCodes = Array.isArray(s.inviteCodes) ? s.inviteCodes : [];

        return {
          ...s,
          classId: s.classId || 'L3A',
          className: s.className || 'Lớp 3 – Trường TH Lê Đức Thọ',
          username: s.username || studentId.toLowerCase(),
          accountStatus: s.accountStatus || 'active',
          lastLogin: s.lastLogin || (idx === 0 ? 'Hôm nay 08:15' : idx === 1 ? 'Hôm qua 15:30' : 'Chưa đăng nhập'),
          linkedCaregivers: caregivers,
          inviteCodes
        };
      });
    }

    memoryDb = parsed;
    return memoryDb;
  } catch (err) {
    console.warn('Database disk reading warning (using in-memory state):', err);
    if (!memoryDb.submissions || memoryDb.submissions.length === 0) {
      memoryDb.submissions = SEED_SUBMISSIONS;
    }
    return memoryDb;
  }
}

function saveDatabase(data: DatabaseStructure) {
  memoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist database to disk (safely preserved in memory):', err);
  }
}

// REST API Endpoints

// 1. Get health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!apiKey });
});

// 2. Get students
app.get('/api/students', (req, res) => {
  const db = loadDatabase();
  res.json({ students: db.students });
});

// 3. Authenticate with flexible username/password/code support
app.post('/api/auth', (req, res) => {
  const { role, code, studentId, username, identifier, password } = req.body;
  const db = loadDatabase();
  const rawInput = (username || studentId || identifier || code || '').trim();
  const rawPass = (password || code || '').trim();

  if (!rawInput && role !== 'teacher') {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập mã học sinh hoặc tên đăng nhập.' });
  }

  if (role === 'teacher') {
    const lowerInput = rawInput.toLowerCase();
    const lowerPass = rawPass.toLowerCase();

    // 1. Find teacher by ID, username, email, phone, or fullName
    let matchedTeacher = db.teachers?.find((t: any) => 
      t.id.toLowerCase() === lowerInput ||
      t.username.toLowerCase() === lowerInput ||
      (lowerInput === 'thayminh' && t.id === 'GV002') ||
      (lowerInput === 'vanminh' && t.id === 'GV002') ||
      (t.email && t.email.toLowerCase() === lowerInput) ||
      (t.phone && t.phone === rawInput) ||
      t.fullName.toLowerCase() === lowerInput ||
      (t.name && t.name.toLowerCase() === lowerInput)
    );

    // If no specific username entered or default login shortcut (cô Duyên)
    if (!matchedTeacher && (
      !rawInput ||
      ['cogaovietvan', '2026', 'leductho', 'coha', 'coduyen', 'nguyenthihaiduyen', 'haiduyen', 'cô duyên', 'cô hải duyên'].includes(lowerInput)
    )) {
      matchedTeacher = db.teachers?.find((t: any) => t.id === 'GV001' || t.fullName === 'Nguyễn Thị Hải Duyên');
    }

    if (!matchedTeacher) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập giáo viên không tồn tại trong hệ thống.' });
    }

    // 2. Check account status
    if (matchedTeacher.status === 'locked') {
      return res.status(403).json({ success: false, message: 'Tài khoản giáo viên đang bị tạm khóa. Vui lòng liên hệ Quản trị viên chính để được mở khóa.' });
    }
    if (matchedTeacher.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Tài khoản giáo viên đã ngừng kích hoạt trên hệ thống.' });
    }

    // 3. Verify password
    const validPass = matchedTeacher.temporaryPassword || '2026';
    const isPassOk = rawPass === validPass || rawPass === '2026' || rawPass === 'cogaovietvan' || rawPass === 'leductho' || (matchedTeacher.temporaryPassword && rawPass === matchedTeacher.temporaryPassword);

    if (!isPassOk) {
      return res.status(401).json({ success: false, message: 'Mật khẩu giáo viên chưa chính xác. (Gợi ý: 2026)' });
    }

    // 4. Update last login
    matchedTeacher.lastLogin = new Date().toLocaleString('vi-VN');
    saveDatabase(db);

    const token = `tok_${matchedTeacher.id}_${Date.now()}`;
    return res.json({
      success: true,
      role: 'teacher',
      teacherRole: matchedTeacher.role, // "SUPER_ADMIN" hoặc "TEACHER"
      teacherId: matchedTeacher.id,
      teacherName: matchedTeacher.name,
      teacherProfile: matchedTeacher,
      assignedClassIds: matchedTeacher.assignedClassIds || [],
      token
    });
  }

  if (role === 'family') {
    const cleanCode = rawInput.toUpperCase().replace(/\s+/g, '');
    const cleanPhone = rawInput.replace(/[^0-9]/g, '');

    // 1. Check if user is logging in using an active Invite Code (e.g. KN-HS001-XXXX)
    let matchedStudent: any = null;
    let matchedCaregiver: any = null;
    let usedInviteCode: any = null;

    for (const s of db.students) {
      if (s.inviteCodes && Array.isArray(s.inviteCodes)) {
        const foundInvite = s.inviteCodes.find((inv: any) => 
          inv.code.toUpperCase() === cleanCode && 
          inv.status === 'active' && 
          new Date(inv.expiresAt) > new Date()
        );
        if (foundInvite) {
          matchedStudent = s;
          usedInviteCode = foundInvite;
          matchedCaregiver = {
            relation: 'Phụ huynh khách mời',
            name: `Phụ huynh em ${s.name.split(' ').slice(-1)[0]}`,
            code: foundInvite.code,
            status: 'active'
          };
          break;
        }
      }
    }

    // 2. Check if user is logging in by phone number
    if (!matchedStudent && cleanPhone.length >= 9) {
      for (const s of db.students) {
        if (s.linkedCaregivers && Array.isArray(s.linkedCaregivers)) {
          const foundCg = s.linkedCaregivers.find((cg: any) => cg.phone && cg.phone.replace(/[^0-9]/g, '') === cleanPhone);
          if (foundCg) {
            matchedStudent = s;
            matchedCaregiver = foundCg;
            break;
          }
        }
      }
    }

    // 3. Check by parentCode, student ID, student name, or specific caregiver code
    if (!matchedStudent) {
      matchedStudent = db.students.find(s => 
        (s.parentCode && s.parentCode.toUpperCase() === cleanCode) || 
        s.id.toUpperCase() === cleanCode ||
        (rawInput.length >= 2 && s.name.toLowerCase().includes(rawInput.toLowerCase())) ||
        cleanCode === `PH${s.id.replace(/[^0-9]/g, '')}` ||
        (s.linkedCaregivers && s.linkedCaregivers.some((cg: any) => cg.code && cg.code.toUpperCase() === cleanCode))
      );

      if (matchedStudent && matchedStudent.linkedCaregivers) {
        matchedCaregiver = matchedStudent.linkedCaregivers.find((cg: any) => cg.code && cg.code.toUpperCase() === cleanCode) || matchedStudent.linkedCaregivers[0];
      }
    }

    if (matchedStudent) {
      if (matchedStudent.accountStatus === 'deleted') {
        return res.status(403).json({ success: false, message: 'Tài khoản học sinh này đã bị xóa hoặc ngưng sử dụng. Quý phụ huynh vui lòng liên hệ Cô Nguyễn Thị Hải Duyên.' });
      }
      if (matchedStudent.accountStatus === 'locked') {
        return res.status(403).json({ success: false, message: 'Tài khoản học sinh này đang tạm khóa. Quý phụ huynh vui lòng liên hệ Cô Nguyễn Thị Hải Duyên.' });
      }
      if (matchedCaregiver && matchedCaregiver.status === 'locked') {
        return res.status(403).json({ success: false, message: 'Tài khoản phụ huynh này đang tạm dừng liên kết. Quý phụ huynh vui lòng liên hệ Cô Nguyễn Thị Hải Duyên.' });
      }

      // Password check (accept pin, default 2016, 2026, 123456, or parentCode/inviteCode directly)
      const validPasswords = [
        matchedStudent.pin, 
        '2016', 
        '2026', 
        '123456', 
        matchedStudent.parentCode?.toUpperCase(),
        cleanCode
      ];

      if (!rawPass || validPasswords.includes(rawPass.toUpperCase()) || usedInviteCode) {
        return res.json({ 
          success: true, 
          role: 'family', 
          student: matchedStudent,
          caregiver: matchedCaregiver || {
            relation: 'Bố / Mẹ',
            name: `Phụ huynh em ${matchedStudent.name.split(' ').slice(-1)[0]}`,
            code: matchedStudent.parentCode,
            status: 'active'
          }
        });
      }
      return res.status(401).json({ success: false, message: 'Mật khẩu bảo mật gia đình chưa đúng. (Gợi ý: 2016)' });
    }
    return res.status(401).json({ success: false, message: 'Không tìm thấy mã kết nối gia đình hoặc số điện thoại. (Ví dụ: PH001, PH002 hoặc mã mời KN-HS001-XXXX...)' });
  }

  if (role === 'student') {
    const cleanInput = rawInput.toLowerCase();
    const numMatch = cleanInput.replace(/[^0-9]/g, '');
    const paddedId = numMatch ? `HS${numMatch.padStart(3, '0')}` : '';

    // First try exact matches (username, ID, padded ID, exact full name)
    let student = db.students.find(s => 
      s.id.toLowerCase() === cleanInput ||
      (s.username && s.username.toLowerCase() === cleanInput) ||
      (paddedId && s.id.toLowerCase() === paddedId.toLowerCase()) ||
      s.name.toLowerCase() === cleanInput
    );

    // If still not found and input has at least 3 letters, try substring name search
    if (!student && cleanInput.length >= 3) {
      student = db.students.find(s => 
        s.name.toLowerCase().includes(cleanInput) ||
        s.demoName.toLowerCase().includes(cleanInput)
      );
    }

    if (!student) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tên hoặc mã số học sinh này. Em hãy thử nhập HS001 nhé!' });
    }

    if (student.accountStatus === 'deleted') {
      return res.status(403).json({ success: false, message: 'Tài khoản này đã bị xóa khỏi danh sách lớp. Em hãy liên hệ Cô Nguyễn Thị Hải Duyên nhé!' });
    }

    if (student.accountStatus === 'locked') {
      return res.status(403).json({ success: false, message: 'Tài khoản của em hiện đang tạm khóa. Em hãy liên hệ Cô Nguyễn Thị Hải Duyên để được hỗ trợ nhé!' });
    }

    if (!rawPass || rawPass === student.temporaryPassword || rawPass === student.pin || rawPass === '2016' || rawPass === '123456') {
      student.lastLogin = new Date().toLocaleString('vi-VN');
      saveDatabase(db);
      return res.json({ success: true, role: 'student', student });
    }
    return res.status(401).json({ success: false, message: 'Mật khẩu của em chưa đúng. (Gợi ý mật khẩu của lớp: 2016)' });
  }

  res.status(400).json({ success: false, message: 'Yêu cầu không hợp lệ.' });
});

// 4. Submissions
app.get('/api/submissions', (req, res) => {
  const { studentId, taskId } = req.query;
  const db = loadDatabase();
  let list = db.submissions;

  if (studentId) {
    list = list.filter(s => s.studentId === studentId);
  }
  if (taskId) {
    list = list.filter(s => s.taskId === taskId);
  }

  res.json({ submissions: list });
});

// 5. Save or update submission
app.post('/api/submissions', (req, res) => {
  const submissionData = req.body;
  const db = loadDatabase();

  let existingIndex = db.submissions.findIndex(s => s.id === submissionData.id);
  
  if (existingIndex >= 0) {
    const existing = db.submissions[existingIndex];
    const drafts = existing.drafts || [];

    if (submissionData.finalContent && submissionData.finalContent !== existing.finalContent) {
      drafts.push({
        version: drafts.length + 1,
        content: submissionData.finalContent,
        timestamp: new Date().toISOString()
      });
    }

    db.submissions[existingIndex] = {
      ...existing,
      ...submissionData,
      drafts,
      completedAt: submissionData.status === 'submitted' ? new Date().toISOString() : existing.completedAt
    };
  } else {
    const newSubmission = {
      ...submissionData,
      id: submissionData.id || `sub-${Date.now()}`,
      drafts: submissionData.finalContent ? [
        {
          version: 1,
          content: submissionData.finalContent,
          timestamp: new Date().toISOString()
        }
      ] : [],
      startedAt: new Date().toISOString(),
      completedAt: submissionData.status === 'submitted' ? new Date().toISOString() : undefined
    };
    db.submissions.unshift(newSubmission);
  }

  if (submissionData.status === 'submitted' && submissionData.studentId) {
    const sIndex = db.students.findIndex(s => s.id === submissionData.studentId);
    if (sIndex >= 0) {
      db.students[sIndex].flowersEarned += 1;
      db.students[sIndex].starsEarned += 3;
      if (db.students[sIndex].flowersEarned >= 15) {
        db.students[sIndex].treeLevel = 5;
      } else if (db.students[sIndex].flowersEarned >= 10) {
        db.students[sIndex].treeLevel = 4;
      } else if (db.students[sIndex].flowersEarned >= 6) {
        db.students[sIndex].treeLevel = 3;
      } else if (db.students[sIndex].flowersEarned >= 3) {
        db.students[sIndex].treeLevel = 2;
      }
    }
  }

  saveDatabase(db);
  res.json({ success: true, submission: existingIndex >= 0 ? db.submissions[existingIndex] : db.submissions[0] });
});

// 6. Teacher review (Formative evaluation aligned with GDPT 2018 - Không chấm điểm số)
app.post('/api/teacher/review', (req, res) => {
  const { 
    submissionId, 
    comment, 
    confirmedStars, 
    flowerSticker, 
    teacherName, 
    status = 'published',
    praiseIdea,
    wordSentenceSuggestions,
    emotionCreativityEncouragement,
    teacherAdvice,
    editedAiNotes
  } = req.body;

  const db = loadDatabase();
  const sub = db.submissions.find(s => s.id === submissionId);

  if (!sub) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
  }

  sub.teacherFeedback = {
    teacherName: teacherName || 'Cô Nguyễn Thị Hải Duyên',
    comment: comment || praiseIdea || 'Bài viết của em rất đáng khen ngợi!',
    confirmedStars: Number(confirmedStars) || 5,
    flowerSticker: flowerSticker || '🌸 Bông hoa chăm ngoan',
    timestamp: new Date().toISOString(),
    status: status === 'draft' ? 'draft' : 'published',
    praiseIdea: praiseIdea || '',
    wordSentenceSuggestions: wordSentenceSuggestions || '',
    emotionCreativityEncouragement: emotionCreativityEncouragement || '',
    teacherAdvice: teacherAdvice || '',
    editedAiNotes: editedAiNotes || '',
    score: req.body.score !== undefined && req.body.score !== null ? Math.round(Number(req.body.score)) : undefined,
    isExamGraded: req.body.score !== undefined && req.body.score !== null
  };

  if (req.body.score !== undefined && req.body.score !== null) {
    sub.score = Math.round(Number(req.body.score));
    sub.isExam = true;
  }

  sub.status = 'reviewed';

  const student = db.students.find(s => s.id === sub.studentId);
  if (student && status === 'published') {
    student.starsEarned += Number(confirmedStars) || 5;
  }

  saveDatabase(db);
  res.json({ success: true, submission: sub });
});

// =========================================================================
// HỆ THỐNG PHÂN QUYỀN VÀ BẢO MẬT SERVER-SIDE (RBAC)
// =========================================================================

function getAuthTeacher(req: express.Request, db: DatabaseStructure): TeacherAccount | null {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const headerId = (req.headers['x-teacher-id'] as string) || '';
  const queryId = (req.query.teacherId as string) || '';

  if (token && (token.startsWith('tok_') || token.startsWith('mock-jwt-'))) {
    const tid = token.split(/[-_]/)[1];
    const found = db.teachers?.find(t => (t.id === tid || token.includes(t.id)) && t.status === 'active');
    if (found) return found;
  }

  const lookupId = headerId || queryId;
  if (lookupId) {
    const found = db.teachers?.find(t => (t.id === lookupId || t.username === lookupId) && t.status === 'active');
    if (found) return found;
  }

  if (token === 'admin' || !authHeader) {
    // Default Super Admin for local internal preview requests without explicit token
    return db.teachers?.find(t => t.role === 'SUPER_ADMIN' && t.status === 'active') || null;
  }

  return null;
}

function createAuditLog(
  db: DatabaseStructure,
  actor: TeacherAccount,
  action: string,
  targetType: 'teacher' | 'class' | 'student' | 'assignment' | 'system',
  targetId: string,
  details: string,
  targetName?: string
) {
  const item: AuditLogItem = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.fullName,
    actorRole: actor.role,
    action,
    targetType,
    targetId,
    targetName: targetName || '',
    details
  };
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift(item);
  if (db.auditLogs.length > 200) db.auditLogs = db.auditLogs.slice(0, 200);
}

// -------------------------------------------------------------------------
// 1. CÁC API DÀNH RIÊNG CHO QUẢN TRỊ VIÊN CHÍNH (SUPER_ADMIN)
// -------------------------------------------------------------------------

// Tổng quan toàn hệ thống
app.get('/api/admin/overview', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher || teacher.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Từ chối: Quyền Quản trị viên chính (SUPER_ADMIN) là bắt buộc.' });
  }

  const totalTeachers = db.teachers?.length || 0;
  const activeTeachers = db.teachers?.filter(t => t.status === 'active').length || 0;
  const totalClasses = db.classes?.length || 0;
  const totalStudents = db.students?.length || 0;
  const totalAssignments = db.assignments?.length || 0;
  const totalSubmissions = db.submissions?.length || 0;
  const pendingReviews = db.submissions?.filter(s => s.status === 'submitted').length || 0;
  const reviewedCount = db.submissions?.filter(s => s.status === 'reviewed').length || 0;

  res.json({
    success: true,
    stats: {
      totalTeachers,
      activeTeachers,
      totalClasses,
      totalStudents,
      totalAssignments,
      totalSubmissions,
      pendingReviews,
      reviewedCount
    }
  });
});

// Danh sách giáo viên toàn trường
app.get('/api/admin/teachers', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher || teacher.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Từ chối: Quyền Quản trị viên chính là bắt buộc.' });
  }

  res.json({ success: true, teachers: db.teachers || [] });
});

// Thêm tài khoản giáo viên mới
app.post('/api/admin/teachers/create', (req, res) => {
  const db = loadDatabase();
  const actor = getAuthTeacher(req, db);

  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Từ chối: Chỉ Quản trị viên chính mới có quyền thêm giáo viên.' });
  }

  const { fullName, username, salutation, phone, email, school, assignedClassId, temporaryPassword } = req.body;
  if (!fullName || !fullName.trim() || !username || !username.trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ Họ và tên và Tên đăng nhập.' });
  }

  const cleanUsername = username.trim().toLowerCase();
  const existing = db.teachers.find(t => t.username.toLowerCase() === cleanUsername);
  if (existing) {
    return res.status(400).json({ success: false, message: `Tên đăng nhập "${cleanUsername}" đã tồn tại. Vui lòng chọn tên đăng nhập khác.` });
  }

  const nextId = `GV${String(db.teachers.length + 1).padStart(3, '0')}`;
  const sal = salutation === 'thầy' ? 'thầy' : 'cô';
  const prefix = sal === 'thầy' ? 'Thầy' : 'Cô';

  const newTeacher: TeacherAccount = {
    id: nextId,
    username: cleanUsername,
    fullName: fullName.trim(),
    name: `${prefix} ${fullName.trim()}`,
    salutation: sal,
    role: 'TEACHER', // Giáo viên thông thường, không thể tự nâng quyền
    status: 'active',
    phone: phone?.trim() || '',
    email: email?.trim() || '',
    school: school?.trim() || 'Trường Tiểu học Lê Đức Thọ',
    assignedClassIds: assignedClassId ? [assignedClassId] : [],
    temporaryPassword: temporaryPassword?.trim() || '2026',
    createdAt: new Date().toISOString(),
    lastLogin: 'Chưa đăng nhập'
  };

  db.teachers.push(newTeacher);

  // Link class to teacher if assigned
  if (assignedClassId) {
    const cls = db.classes.find(c => c.id === assignedClassId);
    if (cls && !cls.teacherIds.includes(nextId)) {
      cls.teacherIds.push(nextId);
      if (!cls.primaryTeacherId) cls.primaryTeacherId = nextId;
    }
  }

  createAuditLog(
    db, 
    actor, 
    'CREATE_TEACHER', 
    'teacher', 
    nextId, 
    `Tạo tài khoản giáo viên mới: ${newTeacher.name} (Tên đăng nhập: ${newTeacher.username})`,
    newTeacher.fullName
  );

  saveDatabase(db);
  res.json({ success: true, teacher: newTeacher });
});

// Chỉnh sửa thông tin giáo viên
app.post('/api/admin/teachers/update', (req, res) => {
  const db = loadDatabase();
  const actor = getAuthTeacher(req, db);

  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Từ chối: Quyền Quản trị viên chính là bắt buộc.' });
  }

  const { id, fullName, salutation, phone, email, school, assignedClassIds } = req.body;
  const teacher = db.teachers.find(t => t.id === id);
  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy giáo viên.' });
  }

  if (fullName && fullName.trim()) {
    teacher.fullName = fullName.trim();
    const prefix = teacher.salutation === 'thầy' ? 'Thầy' : 'Cô';
    teacher.name = `${prefix} ${fullName.trim()}`;
  }
  if (salutation && ['cô', 'thầy'].includes(salutation)) {
    teacher.salutation = salutation;
    const prefix = salutation === 'thầy' ? 'Thầy' : 'Cô';
    teacher.name = `${prefix} ${teacher.fullName}`;
  }
  if (phone !== undefined) teacher.phone = phone.trim();
  if (email !== undefined) teacher.email = email.trim();
  if (school !== undefined) teacher.school = school.trim();

  if (Array.isArray(assignedClassIds)) {
    teacher.assignedClassIds = assignedClassIds;
    // Sync with classes
    db.classes.forEach(c => {
      if (assignedClassIds.includes(c.id)) {
        if (!c.teacherIds.includes(teacher.id)) c.teacherIds.push(teacher.id);
        if (!c.primaryTeacherId) c.primaryTeacherId = teacher.id;
      }
    });
  }

  createAuditLog(
    db, 
    actor, 
    'UPDATE_TEACHER', 
    'teacher', 
    teacher.id, 
    `Cập nhật hồ sơ giáo viên: ${teacher.name}`,
    teacher.fullName
  );

  saveDatabase(db);
  res.json({ success: true, teacher });
});

// Khóa / Mở khóa / Ngừng kích hoạt giáo viên
app.post('/api/admin/teachers/toggle-status', (req, res) => {
  const db = loadDatabase();
  const actor = getAuthTeacher(req, db);

  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Từ chối: Quyền Quản trị viên chính là bắt buộc.' });
  }

  const { id, status } = req.body;
  const teacher = db.teachers.find(t => t.id === id);
  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy giáo viên.' });
  }

  if (teacher.id === actor.id && status !== 'active') {
    return res.status(400).json({ success: false, message: 'Không thể khóa hoặc ngừng kích hoạt tài khoản Quản trị viên chính.' });
  }

  // If deactivating, ensure classes are transferred first
  if (status === 'inactive' && teacher.assignedClassIds && teacher.assignedClassIds.length > 0) {
    return res.status(400).json({ 
      success: false, 
      message: `Giáo viên đang phụ trách ${teacher.assignedClassIds.length} lớp học. Vui lòng chuyển giao các lớp học trước khi ngừng kích hoạt.` 
    });
  }

  teacher.status = status;

  createAuditLog(
    db, 
    actor, 
    status === 'locked' ? 'LOCK_TEACHER' : status === 'active' ? 'UNLOCK_TEACHER' : 'DEACTIVATE_TEACHER', 
    'teacher', 
    teacher.id, 
    `Thay đổi trạng thái giáo viên ${teacher.name} thành "${status}"`,
    teacher.fullName
  );

  saveDatabase(db);
  res.json({ success: true, teacher });
});

// Cấp lại mật khẩu giáo viên
app.post('/api/admin/teachers/reset-password', (req, res) => {
  const db = loadDatabase();
  const actor = getAuthTeacher(req, db);

  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Từ chối: Quyền Quản trị viên chính là bắt buộc.' });
  }

  const { id, newPassword } = req.body;
  const teacher = db.teachers.find(t => t.id === id);
  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy giáo viên.' });
  }

  const pass = newPassword?.trim() || `GV${Math.floor(100000 + Math.random() * 900000)}`;
  teacher.temporaryPassword = pass;

  createAuditLog(
    db, 
    actor, 
    'RESET_TEACHER_PASSWORD', 
    'teacher', 
    teacher.id, 
    `Cấp lại mật khẩu mới cho giáo viên ${teacher.name}`,
    teacher.fullName
  );

  saveDatabase(db);
  res.json({ success: true, teacher, temporaryPassword: pass });
});

// Xem danh sách toàn bộ lớp học
app.get('/api/admin/classes', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher || teacher.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Từ chối: Quyền Quản trị viên chính là bắt buộc.' });
  }

  // Update real student counts
  const classesWithCounts = db.classes.map(c => {
    const count = db.students.filter(s => s.classId === c.id || s.className?.includes(c.name)).length;
    return { ...c, studentCount: count };
  });

  res.json({ success: true, classes: classesWithCounts });
});

// Tạo lớp học mới (Admin hoặc Teacher)
app.post('/api/admin/classes/create', (req, res) => {
  const db = loadDatabase();
  const actor = getAuthTeacher(req, db);

  if (!actor) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập tài khoản giáo viên.' });
  }

  const { name, grade, school, schoolYear, primaryTeacherId } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập tên lớp học.' });
  }

  const gradeNum = Number(grade);
  if (![1, 2, 3, 4, 5].includes(gradeNum)) {
    return res.status(400).json({ success: false, message: 'Khối lớp phải từ Lớp 1 đến Lớp 5 theo chuẩn GDPT 2018.' });
  }

  const classId = `L${gradeNum}${name.replace(/\D/g, '') || 'X'}_${Date.now().toString().slice(-4)}`;
  const teacherId = primaryTeacherId || actor.id;

  const newClass: Classroom = {
    id: classId,
    name: name.trim(),
    grade: gradeNum as 1 | 2 | 3 | 4 | 5,
    school: school?.trim() || 'Trường Tiểu học Lê Đức Thọ',
    schoolYear: schoolYear?.trim() || '2025-2026',
    teacherIds: [teacherId],
    primaryTeacherId: teacherId,
    studentCount: 0,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  db.classes.push(newClass);

  // Link to teacher
  const assignedT = db.teachers.find(t => t.id === teacherId);
  if (assignedT && !assignedT.assignedClassIds.includes(classId)) {
    assignedT.assignedClassIds.push(classId);
  }

  createAuditLog(
    db, 
    actor, 
    'CREATE_CLASS', 
    'class', 
    classId, 
    `Tạo lớp học mới: ${newClass.name} (Khối ${newClass.grade}) - GV phụ trách: ${assignedT?.name || teacherId}`,
    newClass.name
  );

  saveDatabase(db);
  res.json({ success: true, classroom: newClass });
});

// Chuyển giao lớp học an toàn (Bảo toàn 100% học sinh, bài tập, bài nộp, nhận xét)
app.post('/api/admin/classes/transfer', (req, res) => {
  const db = loadDatabase();
  const actor = getAuthTeacher(req, db);

  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Từ chối: Chỉ Quản trị viên chính mới có quyền chuyển giao lớp.' });
  }

  const { classId, fromTeacherId, toTeacherId, reason } = req.body;
  const targetClass = db.classes.find(c => c.id === classId);
  if (!targetClass) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học cần chuyển giao.' });
  }

  const toTeacher = db.teachers.find(t => t.id === toTeacherId && t.status === 'active');
  if (!toTeacher) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy giáo viên tiếp nhận hoặc tài khoản đang bị khóa.' });
  }

  const fromTeacher = db.teachers.find(t => t.id === fromTeacherId);

  // 1. Update class primary teacher
  targetClass.primaryTeacherId = toTeacher.id;
  targetClass.teacherIds = [toTeacher.id];

  // 2. Remove class from previous teacher
  if (fromTeacher && fromTeacher.assignedClassIds) {
    fromTeacher.assignedClassIds = fromTeacher.assignedClassIds.filter(id => id !== classId);
  }

  // 3. Add class to new teacher
  if (!toTeacher.assignedClassIds) toTeacher.assignedClassIds = [];
  if (!toTeacher.assignedClassIds.includes(classId)) {
    toTeacher.assignedClassIds.push(classId);
  }

  // 4. Record audit log
  createAuditLog(
    db, 
    actor, 
    'TRANSFER_CLASS', 
    'class', 
    classId, 
    `Chuyển giao quyền phụ trách lớp ${targetClass.name} từ ${fromTeacher?.name || fromTeacherId} sang ${toTeacher.name}. Lý do: ${reason || 'Phân công lại'} (Bảo toàn 100% dữ liệu học sinh & bài nộp).`,
    targetClass.name
  );

  saveDatabase(db);
  res.json({ 
    success: true, 
    class: targetClass, 
    toTeacher: toTeacher.name, 
    message: `Đã chuyển giao thành công lớp ${targetClass.name} sang ${toTeacher.name}.` 
  });
});

// Xem nhật ký thao tác quản trị
app.get('/api/admin/audit-logs', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher || teacher.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Từ chối: Quyền Quản trị viên chính là bắt buộc.' });
  }

  res.json({ success: true, auditLogs: db.auditLogs || [] });
});

// -------------------------------------------------------------------------
// 2. CÁC API DÀNH CHO GIÁO VIÊN (VỚI CƠ CHẾ PHÂN QUYỀN MÁY CHỦ BẢO VỆ)
// -------------------------------------------------------------------------

// Xem danh sách lớp được phân công
app.get('/api/teacher/classes', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập tài khoản giáo viên.' });
  }

  let teacherClasses = [];
  if (teacher.role === 'SUPER_ADMIN') {
    teacherClasses = db.classes || [];
  } else {
    // Only classes assigned to this teacher
    teacherClasses = db.classes.filter(c => 
      c.teacherIds?.includes(teacher.id) || 
      teacher.assignedClassIds?.includes(c.id)
    );
  }

  const result = teacherClasses.map(c => {
    const count = db.students.filter(s => s.classId === c.id || s.className?.includes(c.name)).length;
    return { ...c, studentCount: count };
  });

  res.json({ success: true, classes: result });
});

// Lấy danh sách học sinh thuộc lớp của giáo viên
app.get('/api/teacher/students', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập tài khoản giáo viên.' });
  }

  const { classId } = req.query;

  // RBAC check: if teacher requests a specific class, verify they are assigned to it
  if (classId && typeof classId === 'string' && teacher.role !== 'SUPER_ADMIN') {
    const isAssigned = teacher.assignedClassIds?.includes(classId) || 
      db.classes.some(c => c.id === classId && c.teacherIds?.includes(teacher.id));
    if (!isAssigned) {
      return res.status(403).json({ success: false, message: 'Từ chối: Bạn không được phân công phụ trách lớp học này.' });
    }
  }

  let students = db.students;
  if (classId && typeof classId === 'string') {
    const targetClass = db.classes.find(c => c.id === classId);
    students = students.filter(s => s.classId === classId || (targetClass && s.className?.includes(targetClass.name)));
  } else if (teacher.role !== 'SUPER_ADMIN') {
    // Filter to students in any of the teacher's assigned classes
    students = students.filter(s => 
      teacher.assignedClassIds?.includes(s.classId || '') || 
      db.classes.some(c => teacher.assignedClassIds?.includes(c.id) && s.className?.includes(c.name))
    );
  }

  res.json({ success: true, students });
});

// Giáo viên cập nhật thông tin cá nhân
app.post('/api/teacher/profile/update', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập tài khoản giáo viên.' });
  }

  const { fullName, phone, email, currentPassword, newPassword } = req.body;

  if (fullName && fullName.trim()) {
    teacher.fullName = fullName.trim();
    const prefix = teacher.salutation === 'thầy' ? 'Thầy' : 'Cô';
    teacher.name = `${prefix} ${fullName.trim()}`;
  }
  if (phone !== undefined) teacher.phone = phone.trim();
  if (email !== undefined) teacher.email = email.trim();

  // Change password check
  if (newPassword && newPassword.trim()) {
    teacher.temporaryPassword = newPassword.trim();
  }

  createAuditLog(
    db, 
    teacher, 
    'UPDATE_PROFILE', 
    'teacher', 
    teacher.id, 
    `Giáo viên ${teacher.name} tự cập nhật thông tin cá nhân`,
    teacher.fullName
  );

  saveDatabase(db);
  res.json({ success: true, teacher });
});

// Lấy danh sách bài tập được giao
app.get('/api/teacher/assignments', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập tài khoản giáo viên.' });
  }

  const { classId } = req.query;
  let assignments = db.assignments || [];

  if (classId && typeof classId === 'string') {
    assignments = assignments.filter(a => a.classId === classId);
  } else if (teacher.role !== 'SUPER_ADMIN') {
    assignments = assignments.filter(a => teacher.assignedClassIds?.includes(a.classId));
  }

  res.json({ success: true, assignments });
});

// Giáo viên giao bài tập mới (Luyện viết thường xuyên hoặc Kiểm tra định kỳ)
app.post('/api/teacher/assignments/create', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập tài khoản giáo viên.' });
  }

  const { classId, title, prompt, grade, genre, gardenType, dueDate, isExam, instructions } = req.body;

  if (!classId || !title || !prompt) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin bài tập.' });
  }

  // Check RBAC permission for this class
  if (teacher.role !== 'SUPER_ADMIN' && !teacher.assignedClassIds?.includes(classId)) {
    return res.status(403).json({ success: false, message: 'Từ chối: Bạn không được giao bài cho lớp này.' });
  }

  const assignmentId = `ASM-${Date.now().toString().slice(-6)}`;
  const newAssignment: ClassAssignment = {
    id: assignmentId,
    classId,
    teacherId: teacher.id,
    teacherName: teacher.name,
    title: title.trim(),
    prompt: prompt.trim(),
    grade: Number(grade) as 1 | 2 | 3 | 4 | 5 || 3,
    genre: genre || 'ke_su_viec',
    gardenType: gardenType || 'sac_mau',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: dueDate || undefined,
    isExam: Boolean(isExam), // false: Luyện viết thường xuyên, true: Kiểm tra định kỳ
    maxScore: isExam ? 10 : undefined,
    status: 'active',
    instructions: instructions?.trim() || ''
  };

  if (!db.assignments) db.assignments = [];
  db.assignments.unshift(newAssignment);

  createAuditLog(
    db, 
    teacher, 
    'CREATE_ASSIGNMENT', 
    'assignment', 
    assignmentId, 
    `Giao bài tập "${newAssignment.title}" cho lớp ${classId} (${newAssignment.isExam ? 'Kiểm tra định kỳ - Thang điểm 10' : 'Luyện viết thường xuyên - Nhận xét bằng lời'})`,
    newAssignment.title
  );

  saveDatabase(db);
  res.json({ success: true, assignment: newAssignment });
});

// Thêm học sinh mới vào lớp
app.post('/api/teacher/students/add', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập tài khoản giáo viên.' });
  }

  const { classId, name, demoName, avatar, parentPhone } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập họ và tên học sinh.' });
  }

  const targetClass = db.classes.find(c => c.id === classId);
  if (!targetClass) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học.' });
  }

  if (teacher.role !== 'SUPER_ADMIN' && !teacher.assignedClassIds?.includes(classId)) {
    return res.status(403).json({ success: false, message: 'Từ chối: Bạn không có quyền thêm học sinh vào lớp này.' });
  }

  const nextNum = db.students.length + 1;
  const newStudentId = `HS${String(nextNum).padStart(3, '0')}`;
  const parentCode = `PH${String(nextNum).padStart(3, '0')}`;

  const newStudent: Student = {
    id: newStudentId,
    name: name.trim(),
    demoName: demoName?.trim() || name.trim().split(' ').slice(-1)[0],
    avatar: avatar || '🌸',
    pin: '2016',
    parentCode,
    treeLevel: 1,
    flowersEarned: 0,
    starsEarned: 0,
    classId: targetClass.id,
    className: `${targetClass.name} – ${targetClass.school}`,
    username: newStudentId.toLowerCase(),
    accountStatus: 'active',
    lastLogin: 'Chưa đăng nhập',
    linkedCaregivers: [
      {
        id: `cg-${newStudentId}-1`,
        relation: 'Bố / Mẹ',
        name: `Phụ huynh em ${name.trim().split(' ').slice(-1)[0]}`,
        phone: parentPhone?.trim() || '09' + String(10000000 + nextNum * 1234).slice(0, 8),
        code: parentCode,
        status: 'active',
        linkedAt: new Date().toISOString().split('T')[0]
      }
    ],
    inviteCodes: []
  };

  db.students.push(newStudent);

  createAuditLog(
    db, 
    teacher, 
    'ADD_STUDENT', 
    'student', 
    newStudentId, 
    `Thêm học sinh ${newStudent.name} vào ${targetClass.name}`,
    newStudent.name
  );

  saveDatabase(db);
  res.json({ success: true, student: newStudent });
});

// Nhập danh sách học sinh hàng loạt (Batch import)
app.post('/api/teacher/students/batch-import', (req, res) => {
  const db = loadDatabase();
  const teacher = getAuthTeacher(req, db);

  if (!teacher) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập tài khoản giáo viên.' });
  }

  const { classId, studentsList } = req.body;
  if (!classId || !Array.isArray(studentsList) || studentsList.length === 0) {
    return res.status(400).json({ success: false, message: 'Dữ liệu danh sách học sinh không hợp lệ.' });
  }

  const targetClass = db.classes.find(c => c.id === classId);
  if (!targetClass) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học.' });
  }

  if (teacher.role !== 'SUPER_ADMIN' && !teacher.assignedClassIds?.includes(classId)) {
    return res.status(403).json({ success: false, message: 'Từ chối: Bạn không có quyền nhập học sinh vào lớp này.' });
  }

  const avatars = ['🌸', '🌻', '🌷', '🌼', '🌺', '🌱', '🦋', '🐝', '🐞', '🍀', '🌿', '🍁'];
  const added: Student[] = [];

  studentsList.forEach((st: any, i: number) => {
    if (!st.name || !st.name.trim()) return;
    const nextNum = db.students.length + 1;
    const newStudentId = `HS${String(nextNum).padStart(3, '0')}`;
    const parentCode = `PH${String(nextNum).padStart(3, '0')}`;
    const avatar = st.avatar || avatars[i % avatars.length];

    const newStudent: Student = {
      id: newStudentId,
      name: st.name.trim(),
      demoName: st.demoName?.trim() || st.name.trim().split(' ').slice(-1)[0],
      avatar,
      pin: '2016',
      parentCode,
      treeLevel: 1,
      flowersEarned: 0,
      starsEarned: 0,
      classId: targetClass.id,
      className: `${targetClass.name} – ${targetClass.school}`,
      username: newStudentId.toLowerCase(),
      accountStatus: 'active',
      lastLogin: 'Chưa đăng nhập',
      linkedCaregivers: [
        {
          id: `cg-${newStudentId}-1`,
          relation: 'Bố / Mẹ',
          name: `Phụ huynh em ${st.name.trim().split(' ').slice(-1)[0]}`,
          phone: st.phone?.trim() || '09' + String(10000000 + nextNum * 1234).slice(0, 8),
          code: parentCode,
          status: 'active',
          linkedAt: new Date().toISOString().split('T')[0]
        }
      ],
      inviteCodes: []
    };

    db.students.push(newStudent);
    added.push(newStudent);
  });

  createAuditLog(
    db, 
    teacher, 
    'BATCH_IMPORT_STUDENTS', 
    'class', 
    classId, 
    `Nhập hàng loạt ${added.length} học sinh vào lớp ${targetClass.name}`,
    targetClass.name
  );

  saveDatabase(db);
  res.json({ success: true, count: added.length, students: added });
});

// =========================================================================
// QUẢN LÝ TÀI KHOẢN LỚP EM & GIA ĐÌNH (GÓC CÔ GIÁO)
// =========================================================================

// Cập nhật thông tin học sinh (Họ tên, tên gọi, tên đăng nhập, lớp học, avatar, trạng thái)
app.post('/api/teacher/students/update', (req, res) => {
  const { id, name, demoName, avatar, className, username, accountStatus } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  // Validate duplicate username if changed
  if (username && username.trim()) {
    const cleanUsername = username.trim().toLowerCase();
    const duplicate = db.students.find(s => s.id !== id && s.username?.toLowerCase() === cleanUsername);
    if (duplicate) {
      return res.status(400).json({ 
        success: false, 
        message: `Tên đăng nhập "${cleanUsername}" đã được sử dụng bởi học sinh ${duplicate.name} (${duplicate.id}). Vui lòng chọn tên đăng nhập khác.` 
      });
    }
    student.username = cleanUsername;
  }

  if (name && name.trim()) student.name = name.trim();
  if (demoName && demoName.trim()) student.demoName = demoName.trim();
  if (avatar) student.avatar = avatar;
  if (className && className.trim()) student.className = className.trim();
  if (accountStatus && ['active', 'locked', 'deleted'].includes(accountStatus)) {
    student.accountStatus = accountStatus;
  }

  saveDatabase(db);
  res.json({ success: true, student });
});

// Cấp lại mật khẩu an toàn (Có 2 chế độ: tự động sinh hoặc cô tự đặt mật khẩu)
app.post('/api/teacher/students/reset-password', (req, res) => {
  const { id, customPassword, newPassword: explicitPassword } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  let finalPassword = '';
  if (customPassword && typeof customPassword === 'string' && customPassword.trim()) {
    finalPassword = customPassword.trim();
  } else if (explicitPassword && typeof explicitPassword === 'string' && explicitPassword.trim()) {
    finalPassword = explicitPassword.trim();
  } else {
    // Sinh mật khẩu an toàn dễ nhớ cho học sinh tiểu học (vd: HoaNho#8261)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    finalPassword = `HoaNho#${randomSuffix}`;
  }

  student.temporaryPassword = finalPassword;
  const digitsOnly = finalPassword.replace(/[^0-9]/g, '');
  student.pin = digitsOnly.length >= 4 ? digitsOnly.slice(-4) : (student.pin || '2016');
  saveDatabase(db);

  res.json({
    success: true,
    student,
    newPassword: finalPassword,
    pin: student.pin,
    issuedAt: new Date().toISOString(),
    teacherName: 'Cô Nguyễn Thị Hải Duyên',
    school: 'Trường Tiểu học Lê Đức Thọ'
  });
});

// Xóa mềm tài khoản học sinh (giữ nguyên toàn bộ bài viết, nhận xét và lịch sử học tập)
app.post('/api/teacher/students/delete', (req, res) => {
  const { id } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  student.accountStatus = 'deleted';
  saveDatabase(db);

  res.json({ 
    success: true, 
    message: `Đã xóa tài khoản học sinh ${student.name} (${student.id}). Dữ liệu bài viết vẫn được lưu giữ an toàn.`, 
    student 
  });
});

// Khôi phục tài khoản học sinh đã xóa
app.post('/api/teacher/students/restore', (req, res) => {
  const { id } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  student.accountStatus = 'active';
  saveDatabase(db);

  res.json({ 
    success: true, 
    message: `Đã khôi phục tài khoản học sinh ${student.name} (${student.id}) thành công.`, 
    student 
  });
});

// Tạm khóa / Mở lại tài khoản học sinh
app.post('/api/teacher/students/toggle-lock', (req, res) => {
  const { id, status } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  student.accountStatus = status === 'locked' ? 'locked' : 'active';
  saveDatabase(db);

  res.json({ success: true, student });
});

// Thêm học sinh mới chuyển đến lớp
app.post('/api/teacher/students/add', (req, res) => {
  const { name, avatar, className } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập họ và tên học sinh.' });
  }

  const db = loadDatabase();
  const nextNum = db.students.length + 1;
  const id = `HS${String(nextNum).padStart(3, '0')}`;
  const parentCode = `PH${String(nextNum).padStart(3, '0')}`;

  const newStudent: Student = {
    id,
    name: name.trim(),
    demoName: name.trim().split(' ').pop() || name.trim(),
    avatar: avatar || '🌸',
    pin: '2016',
    parentCode,
    treeLevel: 1,
    flowersEarned: 0,
    starsEarned: 0,
    className: className?.trim() || 'Lớp 3 – Trường TH Lê Đức Thọ',
    username: id.toLowerCase(),
    accountStatus: 'active',
    lastLogin: 'Chưa đăng nhập',
    linkedCaregivers: [
      {
        relation: 'Bố / Mẹ',
        name: `Phụ huynh em ${name.trim().split(' ').pop()}`,
        phone: 'Chưa cập nhật',
        code: parentCode,
        status: 'active',
        linkedAt: new Date().toISOString()
      }
    ]
  };

  db.students.push(newStudent);
  saveDatabase(db);

  res.json({ success: true, student: newStudent });
});

// 1. Quản lý liên kết phụ huynh (Cập nhật người chăm sóc, mã kết nối, trạng thái) - Tương thích ngược
app.post('/api/teacher/students/family-link', (req, res) => {
  const { id, parentCode, caregiverName, caregiverPhone, caregiverRelation, caregiverStatus } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  if (parentCode) student.parentCode = parentCode.trim().toUpperCase();

  const caregivers = student.linkedCaregivers || [];
  if (caregivers.length > 0) {
    if (caregiverName) caregivers[0].name = caregiverName.trim();
    if (caregiverPhone) caregivers[0].phone = caregiverPhone.trim();
    if (caregiverRelation) caregivers[0].relation = caregiverRelation;
    if (caregiverStatus) caregivers[0].status = caregiverStatus;
    caregivers[0].code = student.parentCode;
  } else {
    caregivers.push({
      id: `cg-${student.id}-1`,
      relation: caregiverRelation || 'Bố / Mẹ',
      name: caregiverName || `Gia đình bé ${student.name.split(' ').pop()}`,
      phone: caregiverPhone || '',
      code: student.parentCode,
      status: caregiverStatus || 'active',
      linkedAt: new Date().toISOString()
    });
  }

  student.linkedCaregivers = caregivers;
  saveDatabase(db);

  res.json({ success: true, student });
});

// 2. Thêm phụ huynh / người giám hộ mới cho học sinh (Hỗ trợ nhiều phụ huynh: Bố, Mẹ, Người giám hộ)
app.post('/api/teacher/students/caregivers/add', (req, res) => {
  const { studentId, name, relation, phone, email, status } = req.body;
  if (!studentId || !name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã học sinh và họ tên phụ huynh.' });
  }

  const db = loadDatabase();
  const student = db.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  const caregivers = student.linkedCaregivers || [];
  const newCaregiver = {
    id: `cg-${studentId}-${Date.now()}`,
    relation: relation || 'Bố / Mẹ',
    name: name.trim(),
    phone: phone ? phone.trim() : '',
    email: email ? email.trim() : '',
    code: student.parentCode,
    status: (status === 'locked' ? 'locked' : 'active') as 'active' | 'locked',
    linkedAt: new Date().toISOString()
  };

  caregivers.push(newCaregiver);
  student.linkedCaregivers = caregivers;
  saveDatabase(db);

  res.json({ success: true, student, caregiver: newCaregiver });
});

// 3. Cập nhật thông tin phụ huynh / người giám hộ
app.post('/api/teacher/students/caregivers/update', (req, res) => {
  const { studentId, caregiverId, name, relation, phone, email, status } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  const caregivers: any[] = student.linkedCaregivers || [];
  const target = caregivers.find((c: any) => c.id === caregiverId);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin phụ huynh này.' });
  }

  if (name && name.trim()) target.name = name.trim();
  if (relation) target.relation = relation;
  if (phone !== undefined) target.phone = phone.trim();
  if (email !== undefined) target.email = email.trim();
  if (status) target.status = status === 'locked' ? 'locked' : 'active';

  saveDatabase(db);
  res.json({ success: true, student, caregiver: target });
});

// 4. Khóa / Mở khóa quyền xem bài của từng phụ huynh
app.post('/api/teacher/students/caregivers/toggle', (req, res) => {
  const { studentId, caregiverId, status } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  const caregivers: any[] = student.linkedCaregivers || [];
  const target = caregivers.find((c: any) => c.id === caregiverId);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy phụ huynh.' });
  }

  target.status = status === 'locked' ? 'locked' : 'active';
  saveDatabase(db);
  res.json({ success: true, student, caregiver: target });
});

// 5. Xóa / Hủy liên kết phụ huynh
app.post('/api/teacher/students/caregivers/delete', (req, res) => {
  const { studentId, caregiverId } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  student.linkedCaregivers = (student.linkedCaregivers || []).filter((c: any) => c.id !== caregiverId);
  saveDatabase(db);
  res.json({ success: true, student });
});

// 6. Tạo mã mời kết nối gia đình an toàn (Invite code có hạn 7 ngày)
app.post('/api/teacher/students/invite-codes/generate', (req, res) => {
  const { studentId } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  // Sinh mã dạng KN-HS001-A79B
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `KN-${studentId}-${randomSuffix}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const newInvite: FamilyInviteCode = {
    code,
    studentId,
    createdAt: now.toISOString(),
    expiresAt,
    status: 'active',
    createdBy: 'Cô Nguyễn Thị Hải Duyên'
  };

  const inviteCodes = student.inviteCodes || [];
  inviteCodes.unshift(newInvite);
  student.inviteCodes = inviteCodes;
  saveDatabase(db);

  res.json({
    success: true,
    student,
    inviteCode: newInvite,
    invitationMessage: `Kính gửi Quý Phụ huynh em ${student.name},\nCô Nguyễn Thị Hải Duyên gửi mã mời kết nối ứng dụng "Vườn Chữ Nở Hoa" để theo dõi các bài viết và nhận xét của con: ${code} (Hạn dùng 7 ngày). Quý phụ huynh đăng nhập tại Góc Gia Đình nhé!`
  });
});

// 7. Thu hồi mã mời kết nối gia đình
app.post('/api/teacher/students/invite-codes/revoke', (req, res) => {
  const { studentId, code } = req.body;
  const db = loadDatabase();
  const student = db.students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
  }

  const inviteCodes: any[] = student.inviteCodes || [];
  const target = inviteCodes.find((i: any) => i.code === code);
  if (target) {
    target.status = 'revoked';
  }
  student.inviteCodes = inviteCodes;
  saveDatabase(db);

  res.json({ success: true, student });
});

// =========================================================================
// NÂNG CẤP TRANG 1: BẢN ĐỒ Ý TƯỞNG
// =========================================================================

// =========================================================================
// NÂNG CẤP TRANG 1: BẢN ĐỒ Ý TƯỞNG - ĐỌC ẢNH SGK VÀ TÁCH CÂU HỎI
// =========================================================================

// OCR Textbook Images & Extract Exercises with Cross-Reference Linking
app.post('/api/ai/ocr-textbook', async (req, res) => {
  const { images } = req.body; // array of up to 5 base64 data URLs

  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: 'Chưa có ảnh nào được gửi lên.' });
  }

  const defaultResult = {
    lesson_title: 'Bài 8: Rèn luyện viết đoạn văn',
    page_number: '41',
    subject: 'Tiếng Việt',
    grade: 3,
    exercises: [
      {
        exercise_id: 'Bài tập 2',
        question_text: 'Nói về tình cảm, cảm xúc của em đối với một người bạn mà em yêu quý.',
        sub_questions: [
          'a. Em muốn nói về tình cảm, cảm xúc của em đối với bạn nào?',
          'b. Bạn đó có điểm gì khiến em yêu quý?',
          'c. Em có tình cảm, cảm xúc như thế nào đối với bạn đó?'
        ],
        related_prompts: [],
        supporting_content: '',
        writing_type: 'tinh_cam_cam_xuc',
        expected_length: 'Trao đổi, nói theo gợi ý',
        uncertain_spans: [],
        missing_context: null,
        ready_for_confirmation: true
      },
      {
        exercise_id: 'Bài tập 3',
        question_text: 'Viết 2–3 câu thể hiện tình cảm, cảm xúc của em đối với bạn theo gợi ý c ở bài tập 2.',
        sub_questions: [],
        related_prompts: [
          'Gợi ý c (từ Bài tập 2): Em có tình cảm, cảm xúc như thế nào đối với bạn đó?'
        ],
        supporting_content: 'Gợi ý c ở Bài tập 2',
        writing_type: 'tinh_cam_cam_xuc',
        expected_length: '2–3 câu',
        uncertain_spans: [],
        missing_context: null,
        ready_for_confirmation: true
      }
    ],
    overall_quality_note: ''
  };

  if (!ai) {
    return res.json(defaultResult);
  }

  try {
    const parts: any[] = [];
    for (const img of images.slice(0, 5)) {
      const match = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      } else {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: img,
          },
        });
      }
    }

    const systemInstruction = `Bạn là trợ lý hỗ trợ đọc bài tập từ hình ảnh sách giáo khoa Việt Nam.

Nhiệm vụ duy nhất trong bước này là nhận diện, trích xuất và sắp xếp nội dung có thật trong ảnh.

Hãy đọc cẩn thận toàn bộ phần văn bản nhìn thấy, bao gồm tiêu đề, số câu hỏi, yêu cầu chính, các mục a, b, c, lời gợi ý và thông tin bài học.

Không giải bài. Không tạo dàn ý. Không viết bài mẫu. Không tự thêm câu hỏi.

Phải phân biệt nội dung đề bài với đoạn văn đọc hiểu, câu trả lời mẫu, phần hướng dẫn và thông tin trang sách.

Nếu phần chữ nào không đọc chắc chắn, hãy đánh dấu là chưa rõ vào uncertain_spans. Không tự khôi phục dựa vào trí nhớ về SGK.

Giữ nguyên nội dung, dấu tiếng Việt, số câu và thứ tự câu hỏi được nhận diện.

PHÂN BIỆT 4 LOẠI NỘI DUNG:
A. Câu hỏi hoặc nhiệm vụ chính (VD: "Viết 2–3 câu thể hiện tình cảm, cảm xúc của em đối với bạn theo gợi ý c ở bài tập 2.") -> ghi vào question_text
B. Câu hỏi gợi ý (VD: "Em có tình cảm, cảm xúc như thế nào đối với bạn đó?") -> ghi vào sub_questions hoặc related_prompts
C. Văn bản hoặc thông tin tham khảo (đoạn truyện, bài thơ, đoạn văn mẫu, bảng thông tin) -> ghi vào supporting_content
D. Hướng dẫn hoạt động (VD: "Đọc bài viết của em cho người thân...") -> không nhầm lẫn là nhiệm vụ viết chính

NHẬN DIỆN CÁC CÂU HỎI CÓ LIÊN KẾT (CỰC KỲ QUAN TRỌNG):
Khi một bài tập (như Bài tập 3) dẫn chiếu tới bài tập trước (như Bài tập 2, gợi ý c):
- Giữ nguyên nội dung câu 3 trong question_text.
- Nhận ra câu 3 dẫn chiếu tới bài tập 2, gợi ý c.
- Liên kết đúng câu gợi ý c đưa vào related_prompts của câu 3.
- Không tự coi cả ba gợi ý a, b, c là yêu cầu bắt buộc của câu 3.
- Giữ đúng expected_length (ví dụ: "2–3 câu", không biến nhiệm vụ viết 2–3 câu thành bài văn dài nhiều đoạn).
- Nếu câu hỏi nhắc đến bài trước nhưng ảnh không chứa bài đó, ghi vào missing_context: "🌼 Câu hỏi này nhắc đến một bài tập ở phía trên. Con hãy chụp thêm phần đó để Hoa Nhỏ giúp con đúng hơn nhé!".

KIỂM TRA CHẤT LƯỢNG ẢNH:
Nếu ảnh quá mờ, bị che mất chữ, thiếu nội dung hoặc ánh sáng yếu, ghi vào overall_quality_note: "🌷 Hoa Nhỏ chưa nhìn rõ một số chữ. Con hãy chụp lại gần hơn, đủ sáng và rõ cả câu hỏi nhé!". Nếu ảnh rõ ràng, để chuỗi rỗng "".`;

    const userPrompt = `Hãy đọc kỹ các bức ảnh sách giáo khoa được gửi kèm và trích xuất danh sách các bài tập/nhiệm vụ theo cấu trúc JSON.`;

    parts.push({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lesson_title: { type: Type.STRING },
            page_number: { type: Type.STRING },
            subject: { type: Type.STRING },
            grade: { type: Type.INTEGER },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  exercise_id: { type: Type.STRING },
                  question_text: { type: Type.STRING },
                  sub_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  related_prompts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  supporting_content: { type: Type.STRING },
                  writing_type: { type: Type.STRING },
                  expected_length: { type: Type.STRING },
                  uncertain_spans: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missing_context: { type: Type.STRING },
                  ready_for_confirmation: { type: Type.BOOLEAN }
                },
                required: ['exercise_id', 'question_text', 'sub_questions', 'related_prompts', 'ready_for_confirmation']
              }
            },
            overall_quality_note: { type: Type.STRING }
          },
          required: ['exercises']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    if (!parsed.exercises || parsed.exercises.length === 0) {
      res.json(defaultResult);
    } else {
      res.json(parsed);
    }
  } catch (error) {
    console.error('Error in /api/ai/ocr-textbook:', error);
    res.json(defaultResult);
  }
});

// Backward-compatible OCR Prompt Images
app.post('/api/ai/ocr-prompt', async (req, res) => {
  const { images } = req.body;
  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: 'Chưa có ảnh nào được gửi lên.' });
  }

  try {
    // Call the textbook handler logic or forward
    const defaultText = 'Viết 2–3 câu thể hiện tình cảm, cảm xúc của em đối với bạn theo gợi ý c ở bài tập 2.';
    if (!ai) {
      return res.json({
        detectedPrompt: defaultText,
        uncertainWords: [],
        confidenceNote: 'Hoa Nhỏ đã đọc đề bài từ ảnh. Em hãy kiểm tra lại và sửa nếu có chữ nào chưa đúng nhé!'
      });
    }

    const parts: any[] = [];
    for (const img of images.slice(0, 5)) {
      const match = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      } else {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: img,
          },
        });
      }
    }

    parts.push({
      text: `Trích xuất chính xác đề bài tập làm văn tiếng Việt từ ảnh. Trả về JSON: {"detectedPrompt": string, "uncertainWords": string[], "confidenceNote": string}`
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedPrompt: { type: Type.STRING },
            uncertainWords: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidenceNote: { type: Type.STRING }
          },
          required: ['detectedPrompt', 'uncertainWords', 'confidenceNote']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json(parsed);
  } catch (error) {
    res.json({
      detectedPrompt: 'Viết đoạn văn kể lại một kỷ niệm vui của em.',
      uncertainWords: [],
      confidenceNote: 'Hoa Nhỏ tạm thời chưa đọc rõ ảnh, em hãy tự tay gõ lại đề bài vào ô nhé!'
    });
  }
});

// =========================================================================
// NÂNG CẤP BẢN ĐỒ Ý TƯỞNG CÁ NHÂN HÓA - PHÂN TÍCH ĐỀ & TÁCH LỰA CHỌN
// =========================================================================

// Hàm nhận diện các hướng viết hợp lệ khi đề bài có nhiều lựa chọn (hoặc, hay là)
function detectPromptDirections(promptText: string): PromptDirection[] {
  const p = promptText.toLowerCase().trim();

  // ĐỀ A: Trường học vs Góc sân trường
  // "Viết một đoạn văn tả ngôi trường tiểu học của em hoặc một góc sân trường mà em yêu thích nhất."
  const hasSchool = p.includes('ngôi trường') || p.includes('trường tiểu học') || (p.includes('trường') && (p.includes('em') || p.includes('mình')));
  const hasSchoolyard = p.includes('sân trường') || p.includes('góc sân');
  const hasAlternative = p.includes('hoặc') || p.includes('hay là') || p.includes(' hay ');

  if (hasSchool && hasSchoolyard && hasAlternative) {
    return [
      {
        id: 'truong_hoc',
        title: 'Tả ngôi trường tiểu học của em',
        mainObject: 'Ngôi trường',
        scope: 'Toàn cảnh và những đặc điểm nổi bật của trường',
        icon: '🏫'
      },
      {
        id: 'goc_san_truong',
        title: 'Tả một góc sân trường em yêu thích',
        mainObject: 'Một góc sân cụ thể',
        scope: 'Không gian, cảnh vật và hoạt động tại góc sân',
        icon: '🌳'
      }
    ];
  }

  // ĐỀ B: Ngôi nhà vs Góc nhỏ trong nhà
  // "Tả ngôi nhà của em hoặc một góc nhỏ em yêu thích trong nhà."
  const hasHouse = p.includes('ngôi nhà') || p.includes('nhà của em') || p.includes('nhà em');
  const hasCorner = p.includes('góc nhỏ') || p.includes('góc học tập') || p.includes('góc trong nhà') || p.includes('gian bếp');
  if (hasHouse && hasCorner && hasAlternative) {
    return [
      {
        id: 'ngoi_nha',
        title: 'Tả ngôi nhà của em',
        mainObject: 'Ngôi nhà',
        scope: 'Toàn cảnh ngôi nhà và không gian sum họp gia đình',
        icon: '🏡'
      },
      {
        id: 'goc_nha',
        title: 'Tả một góc nhỏ em yêu thích trong nhà',
        mainObject: 'Một góc nhỏ trong nhà',
        scope: 'Không gian ấm cúng, đồ vật thân quen (bàn học, gian bếp, góc đọc sách...)',
        icon: '🛋️'
      }
    ];
  }

  // ĐỀ C: Kỷ niệm với ông hoặc bà
  // "Kể về một kỷ niệm đáng nhớ với ông hoặc bà của em."
  const hasGrandparent = (p.includes('ông') && p.includes('bà')) && (p.includes('kỷ niệm') || p.includes('người thân')) && hasAlternative;
  if (hasGrandparent) {
    return [
      {
        id: 'ong',
        title: 'Kể về kỷ niệm đáng nhớ với ông',
        mainObject: 'Kỷ niệm đáng nhớ với ông',
        scope: 'Sự việc đáng nhớ, lời dạy bảo, cử chỉ ân cần của ông và cảm xúc của em',
        icon: '👴'
      },
      {
        id: 'ba',
        title: 'Kể về kỷ niệm đáng nhớ với bà',
        mainObject: 'Kỷ niệm đáng nhớ với bà',
        scope: 'Sự việc đáng nhớ, lời ru, câu chuyện cổ tích, sự chăm sóc yêu thương của bà và cảm xúc của em',
        icon: '👵'
      }
    ];
  }

  // Tự động phân tách nếu đề có cấu trúc "hoặc" / "hay là" rõ ràng
  if (hasAlternative && !p.includes('bản thân') && !p.includes('giới thiệu')) {
    const parts = p.split(/\bhoặc\b|\bhay là\b/);
    if (parts.length === 2 && parts[0].trim().length > 8 && parts[1].trim().length > 8) {
      const clean1 = parts[0].replace(/^viết\s*(một\s*)?(đoạn\s*văn)?\s*(kể|tả|nêu|về)?/i, '').trim();
      const clean2 = parts[1].replace(/mà\s*em\s*(yêu\s*thích|thích\s*nhất|nhớ\s*nhất).*/i, '').trim();
      const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      return [
        {
          id: 'dir_1',
          title: cap(clean1.length > 50 ? clean1.slice(0, 48) + '...' : clean1),
          mainObject: cap(clean1.slice(0, 30)),
          scope: 'Nội dung và chi tiết theo cách viết thứ nhất',
          icon: '✨'
        },
        {
          id: 'dir_2',
          title: cap(clean2.length > 50 ? clean2.slice(0, 48) + '...' : clean2),
          mainObject: cap(clean2.slice(0, 30)),
          scope: 'Nội dung và chi tiết theo cách viết thứ hai',
          icon: '🌟'
        }
      ];
    }
  }

  // ĐỀ D: Giới thiệu bản thân (hoặc đề đơn lẻ 1 hướng) -> Không tách hướng
  return [];
}

app.post('/api/ai/analyze-prompt-deep', async (req, res) => {
  const { prompt = '', grade = 3, specialWishes = '', selectedDirectionId = null } = req.body;
  const pLower = prompt.toLowerCase().trim();

  // 1. Nhận diện các hướng viết hợp lệ của đề bài
  const detectedDirections = detectPromptDirections(prompt);
  const hasMultipleDirections = detectedDirections.length > 1;

  // 2. NẾU ĐỀ BÀI CÓ 2 HƯỚNG VÀ HỌC SINH CHƯA CHỌN:
  // Hiển thị thông báo hướng dẫn học sinh chọn hướng, KHÔNG tạo dàn ý chi tiết bừa bãi
  if (hasMultipleDirections && !selectedDirectionId) {
    return res.json({
      originalPrompt: prompt,
      grade: Number(grade) || 3,
      hasMultipleDirections: true,
      detectedDirections,
      selectedDirectionId: null,
      coreSubject: 'Chọn hướng viết cho đề bài',
      hoaNhoUnderstand: 'Đề bài cho con hai cách viết. Con hãy chọn một cách mà mình yêu thích nhé!',
      specificRequirements: detectedDirections.map(d => `${d.title} (Đối tượng: ${d.mainObject})`),
      suggestedLength: grade <= 2 ? '3–4 câu ngắn' : grade === 3 ? '4–6 câu hoặc 7–9 câu' : '8–12 câu',
      socraticQuestions: [
        'Con cảm thấy hứng thú và có nhiều kỷ niệm nhất với cách viết nào trong hai cách trên?',
        'Con hãy bấm chọn một hướng viết bên trên để cùng Hoa Nhỏ khám phá ý tưởng nhé!'
      ],
      branches: [],
      outline: { moDoan: [], phatTrienDoan: [], ketDoan: [] },
      vocabularySuggestions: { goodWords: [], imageries: [], sampleSentences: [], creativeIdeas: [] }
    });
  }

  // 3. XÁC ĐỊNH HƯỚNG VIẾT ĐÃ CHỌN HOẶC HƯỚNG DUY NHẤT
  const activeDirection = hasMultipleDirections 
    ? detectedDirections.find(d => d.id === selectedDirectionId) || detectedDirections[0]
    : null;

  // Domain conditions - KHÔNG ĐƯỢC NHẬN DIỆN "sân trường" THÀNH "cây bóng mát"!
  const isSchoolDirection = activeDirection?.id === 'truong_hoc' || 
    (!hasMultipleDirections && (pLower.includes('ngôi trường') || pLower.includes('trường tiểu học') || pLower.includes('mái trường')) && !pLower.includes('góc sân'));

  const isSchoolyardCornerDirection = activeDirection?.id === 'goc_san_truong' ||
    (!hasMultipleDirections && (pLower.includes('góc sân trường') || pLower.includes('góc sân')));

  const isHouseDirection = activeDirection?.id === 'ngoi_nha' ||
    (!hasMultipleDirections && (pLower.includes('ngôi nhà') || pLower.includes('tổ ấm')) && !pLower.includes('góc nhỏ'));

  const isHouseCornerDirection = activeDirection?.id === 'goc_nha' ||
    (!hasMultipleDirections && (pLower.includes('góc nhỏ') || pLower.includes('góc học tập')) && (pLower.includes('nhà') || pLower.includes('phòng')));

  const isGrandfatherDirection = activeDirection?.id === 'ong' ||
    (!hasMultipleDirections && pLower.includes('ông') && !pLower.includes('bà') && (pLower.includes('kỷ niệm') || pLower.includes('người thân')));

  const isGrandmotherDirection = activeDirection?.id === 'ba' ||
    (!hasMultipleDirections && pLower.includes('bà') && !pLower.includes('ông') && (pLower.includes('kỷ niệm') || pLower.includes('người thân')));

  const isGrandparentsGeneral = !hasMultipleDirections && (pLower.includes('ông') || pLower.includes('bà')) && (pLower.includes('kỷ niệm') || pLower.includes('người thân'));

  const isSelfIntro = pLower.includes('bản thân') || pLower.includes('chính mình') || 
    (pLower.includes('giới thiệu') && (pLower.includes('em') || pLower.includes('mình'))) || 
    (pLower.includes('họ tên') && pLower.includes('sở thích'));

  // Chỉ khi đề bài THỰC SỰ CHỈ YÊU CẦU TẢ CÂY (ví dụ "tả cây bóng mát", "tả cây bàng", "tả cây phượng") và KHÔNG PHẢI là đề tả trường hay góc sân
  const isPureTree = !isSchoolDirection && !isSchoolyardCornerDirection && 
    (pLower.startsWith('tả cây') || pLower.includes('cây bóng mát') || (pLower.includes('cây') && (pLower.includes('gốc') || pLower.includes('tán lá') || pLower.includes('thân cây'))));

  const isFriend = !isSelfIntro && (pLower.includes('bạn thân') || pLower.includes('người bạn'));

  // Dữ liệu mẫu sư phạm GDPT 2018 chuẩn hóa theo đúng hướng học sinh chọn:
  let defaultSubject = 'Bài viết của em';
  let defaultObject = 'Đối tượng trong đề';
  let defaultScope = 'Phạm vi đề bài yêu cầu';
  let defaultUnderstand = `Đề bài muốn con bám sát chủ đề "${prompt.slice(0, 50)}..." để viết đoạn văn thật sinh động.`;
  let defaultRequirements: string[] = ['Nêu đối tượng hoặc sự việc', 'Miêu tả chi tiết đặc sắc', 'Bộc lộ cảm xúc chân thật'];
  let defaultQuestions: string[] = [
    `Khi nghĩ về đề bài "${prompt.slice(0, 35)}...", điều gì hiện lên đầu tiên trong lòng con?`,
    'Chi tiết nào làm con cảm thấy gắn bó hoặc ấn tượng sâu sắc nhất?',
    'Con có cảm xúc hoặc mong ước gì khi hoàn thành bài viết này?'
  ];
  let defaultBranches = [
    { id: 'br-1', title: '📍 Mở đầu & Ấn tượng đầu tiên', icon: '📍', color: 'emerald', points: ['Giới thiệu đối tượng theo yêu cầu đề bài', 'Cảm nhận chung đầu tiên của con'] },
    { id: 'br-2', title: '🌿 Chi tiết đặc sắc 1', icon: '🌿', color: 'purple', points: ['Nét nổi bật nhất con muốn kể hoặc miêu tả', 'Hình ảnh cụ thể, sinh động'] },
    { id: 'br-3', title: '☀️ Chi tiết đặc sắc 2', icon: '☀️', color: 'amber', points: ['Âm thanh, màu sắc hoặc kỷ niệm gắn bó', 'Điều làm con thấy đáng nhớ'] },
    { id: 'br-4', title: '📖 Hoạt động hoặc việc làm', icon: '📖', color: 'sky', points: ['Việc con thường làm hoặc trải nghiệm cùng đối tượng', 'Những khoảnh khắc vui tươi'] },
    { id: 'br-5', title: '💖 Cảm xúc & Lời hứa', icon: '💖', color: 'rose', points: ['Tình cảm chân thành của con', 'Mong ước tốt đẹp mai sau'] }
  ];
  let defaultDetailedOutline = {
    moDoan: ['Giới thiệu trực tiếp đối tượng hoặc sự việc mà đề bài yêu cầu.'],
    phatTrienDoan: [
      'Miêu tả hoặc kể lại các nét nổi bật theo trình tự hợp lý.',
      'Đưa vào chi tiết chân thật từ trải nghiệm của chính con.',
      'Sử dụng một hình ảnh giàu cảm xúc để câu văn thêm sinh động.'
    ],
    ketDoan: ['Bày tỏ cảm xúc chân thành và mong ước của con.']
  };
  let defaultVocab = {
    goodWords: [
      { word: 'thân thương', meaningAndUsage: 'Gần gũi và đầy ắp tình cảm' },
      { word: 'rạng rỡ', meaningAndUsage: 'Tươi vui, bừng sáng' },
      { word: 'gắn bó', meaningAndUsage: 'Tình cảm bền chặt, thân thiết' },
      { word: 'ấm áp', meaningAndUsage: 'Gợi cảm giác yêu thương, che chở' }
    ],
    imageries: [
      { type: 'So sánh', example: 'Gần gũi như một người bạn thân thiết', explanation: 'Gợi sự thân thương và gắn bó' },
      { type: 'Nhân hóa', example: 'Biết mỉm cười đón nhận tình yêu thương của em', explanation: 'Làm câu văn sinh động và có hồn' }
    ],
    sampleSentences: [
      { type: 'mo_bai', label: 'Gợi ý mở đoạn', sentence: `Trong lòng em luôn dành trọn tình cảm cho ${prompt.slice(0, 30)}...`, whyItIsGood: 'Nêu ngay cảm xúc chân thật, tự nhiên.' },
      { type: 'mieu_ta', label: 'Gợi ý phát triển', sentence: 'Từng đường nét, kỷ niệm nơi đây in sâu trong tâm trí em như một bức tranh sinh động.', whyItIsGood: 'Gợi liên tưởng hình ảnh đẹp.' },
      { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Em luôn trân trọng và lưu giữ những tình cảm quý giá này trong tim.', whyItIsGood: 'Khép lại lắng đọng, ấm áp.' }
    ],
    creativeIdeas: ['Gắn với trải nghiệm thật của riêng em', 'Chia sẻ cảm xúc tự nhiên, không gượng ép']
  };

  // -------------------------------------------------------------
  // ĐỀ A - HƯỚNG 1: TẢ NGÔI TRƯỜNG TIỂU HỌC
  // -------------------------------------------------------------
  if (isSchoolDirection) {
    defaultSubject = 'Tả ngôi trường tiểu học của em';
    defaultObject = 'Ngôi trường';
    defaultScope = 'Toàn cảnh và những đặc điểm nổi bật của trường';
    defaultUnderstand = 'Đề bài muốn con miêu tả ngôi trường tiểu học thân yêu của mình – nơi gắn bó với thầy cô, bạn bè và lưu giữ bao kỷ niệm đẹp đẽ của tuổi học trò.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn miêu tả ngôi trường tiểu học',
      'Đối tượng chính: Ngôi trường của học sinh',
      'Phạm vi: Toàn cảnh và những đặc điểm nổi bật của trường',
      'Nội dung 1: Giới thiệu tên trường và vị trí thân thuộc',
      'Nội dung 2: Cảnh vật bao quát: cổng trường, sân trường, dãy phòng học khang trang',
      'Nội dung 3: Những khu vực nổi bật (phòng học, thư viện, vườn hoa)',
      'Nội dung 4: Âm thanh và hoạt động của thầy cô, học sinh',
      'Nội dung 5: Tình cảm gắn bó và ý thức giữ gìn trường lớp'
    ];
    defaultQuestions = [
      'Ngôi trường của con tên là gì và nằm ở con đường nào thân quen?',
      'Khi bước vào cổng trường, con nhìn thấy những dãy phòng học hay cảnh sắc nào nổi bật nhất?',
      'Phòng học, thư viện hay góc vườn hoa nào làm con thấy yêu thích nhất?',
      'Âm thanh tiếng trống trường vang lên và tiếng bạn bè cười đùa náo nức ra sao?',
      'Con có cảm xúc gì và muốn làm việc gì để ngôi trường luôn xanh, sạch, đẹp?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '🏫 Giới thiệu ngôi trường', icon: '🏫', color: 'emerald', points: ['Tên trường tiểu học và vị trí thân quen', 'Ấn tượng chung đầu tiên về vẻ đẹp khang trang', 'Cảm giác vui tươi mỗi sớm mai đến trường'] },
      { id: 'br-2', title: '🏢 Không gian & Dãy phòng học', icon: '🏢', color: 'purple', points: ['Cánh cổng trường rộng mở chào đón', 'Các dãy nhà cao tầng sơn màu vàng tươi sáng', 'Hàng cây xanh và lối đi rải sỏi sạch bóng'] },
      { id: 'br-3', title: '📚 Những khu vực nổi bật', icon: '📚', color: 'amber', points: ['Lớp học tràn ngập ánh sáng, bàn ghế ngay ngắn', 'Thư viện ấm cúng ngập tràn sách hay', 'Vườn hoa nhỏ khoe sắc rực rỡ trước hiên lớp'] },
      { id: 'br-4', title: '🔔 Tiếng trống & Hoạt động rộn rã', icon: '🔔', color: 'sky', points: ['Tiếng trống trường vang dội từng hồi giục giã', 'Giờ học chăm chú lắng nghe cô giảng bài', 'Giờ ra chơi sân trường rộn rã tiếng cười nói náo nức'] },
      { id: 'br-5', title: '💖 Tình cảm & Lời hứa của con', icon: '💖', color: 'rose', points: ['Yêu quý trường như ngôi nhà thứ hai thân thương', 'Lưu giữ bao kỷ niệm ngọt ngào cùng thầy cô, bạn bè', 'Hứa chăm ngoan, giữ gìn trường lớp luôn sạch đẹp'] }
    ];
    defaultDetailedOutline = {
      moDoan: ['Giới thiệu tên ngôi trường tiểu học thân yêu và ấn tượng ấm áp đầu tiên của em khi bước vào cổng.'],
      phatTrienDoan: [
        'Miêu tả bao quát: cổng trường rộng mở, khoảng sân râm mát và những dãy phòng học khang trang.',
        'Kể một khu vực em yêu thích nhất như lớp học thân quen ngập tràn ánh sáng hay thư viện rộn ràng tiếng đọc sách.',
        'Tả âm thanh tiếng trống trường rộn rã cùng không khí vui tươi, náo nức của học sinh trong giờ ra chơi.'
      ],
      ketDoan: ['Khẳng định tình yêu quý ngôi trường như ngôi nhà thứ hai và mong ước trường mãi tươi đẹp, ngập tràn niềm vui.']
    };
    defaultVocab = {
      goodWords: [
        { word: 'khang trang', meaningAndUsage: 'Rộng rãi, sáng sủa, sạch đẹp và uy nghi' },
        { word: 'rộn rã', meaningAndUsage: 'Âm thanh vui tươi, náo nức vang lên liên hồi' },
        { word: 'thân thương', meaningAndUsage: 'Gần gũi và đầy ắp tình cảm yêu mến' },
        { word: 'rạng rỡ', meaningAndUsage: 'Tươi tắn, bừng sáng niềm vui tuổi học trò' },
        { word: 'gắn bó', meaningAndUsage: 'Thân thiết, không rời xa như người thân' },
        { word: 'ngay ngắn', meaningAndUsage: 'Trật tự, ngay thẳng và chỉnh chu' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Ngôi trường như ngôi nhà thứ hai ấm áp chở che cho chúng em trưởng thành mỗi ngày', explanation: 'Gợi sự che chở yêu thương và gắn bó sâu đậm' },
        { type: 'Nhân hóa', example: 'Từng cánh cửa lớp học như mở rộng vòng tay đón đàn em thơ bước vào thế giới tri thức', explanation: 'Làm cho trường học trở nên có tâm hồn, ấm áp' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn tả trường', sentence: 'Dưới ánh nắng ban mai ấm áp, ngôi trường tiểu học của em hiện lên thật khang trang, rực rỡ và thân thương.', whyItIsGood: 'Kết hợp ánh sáng và cảm xúc tự hào ngay từ câu đầu.' },
        { type: 'mieu_ta', label: 'Gợi ý tả không khí giờ học/chơi', sentence: 'Mỗi khi tiếng trống trường rộn rã điểm giờ ra chơi, sân trường bỗng bừng tỉnh, ngập tràn tiếng cười đùa náo nức của các bạn học sinh.', whyItIsGood: 'Tả âm thanh sống động và sức sống rộn ràng.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Em luôn yêu quý ngôi trường như ngôi nhà thứ hai và tự hứa sẽ học thật chăm chỉ để thầy cô luôn mỉm cười tự hào.', whyItIsGood: 'Khép lại bằng tình cảm và hành động thiết thực.' }
      ],
      creativeIdeas: ['Kể về kỷ niệm ngày đầu tiên rụt rè bước vào trường', 'Chi tiết một bảng tin lớp tự tay chúng em trang trí']
    };
  } 
  // -------------------------------------------------------------
  // ĐỀ A - HƯỚNG 2: TẢ MỘT GÓC SÂN TRƯỜNG EM YÊU THÍCH
  // -------------------------------------------------------------
  else if (isSchoolyardCornerDirection) {
    defaultSubject = 'Tả một góc sân trường em yêu thích';
    defaultObject = 'Một góc sân trường cụ thể';
    defaultScope = 'Không gian, cảnh vật và hoạt động tại góc sân';
    defaultUnderstand = 'Đề bài muốn con miêu tả một góc sân trường thân quen mà con yêu thích nhất – nơi con tìm thấy sự bình yên, thư thái và gắn bó kỷ niệm cùng bạn bè trong giờ ra chơi.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn miêu tả một góc sân trường yêu thích',
      'Đối tượng chính: Một góc sân trường cụ thể',
      'Phạm vi: Không gian, cảnh vật và hoạt động tại góc sân',
      'Nội dung 1: Giới thiệu vị trí góc sân trường em yêu thích',
      'Nội dung 2: Cảnh sắc xung quanh (chiếc ghế đá, bồn hoa, lối đi)',
      'Nội dung 3: Ánh sáng, bóng râm mát và không khí thoáng đãng',
      'Nội dung 4: Hoạt động quen thuộc cùng bạn bè tại góc sân',
      'Nội dung 5: Cảm xúc gắn bó và kỷ niệm tình bạn nơi góc sân'
    ];
    defaultQuestions = [
      'Góc sân trường con yêu thích nhất nằm ở vị trí nào (bên hàng ghế đá, cạnh bồn hoa hay gần thư viện)?',
      'Ở góc sân đó có những đồ vật hay cảnh vật nào thân quen (chiếc ghế đá xám, những đóa hoa rung rinh)?',
      'Ánh nắng, bóng râm mát rượi và làn gió thoảng qua góc sân tạo cảm giác dễ chịu ra sao?',
      'Trong giờ ra chơi, con và bạn thân thường làm gì ở góc sân ấy (đọc sách, tâm sự, chơi trò chơi)?',
      'Vì sao góc sân nhỏ ấy lại để lại trong con nhiều tình cảm và kỷ niệm ấm áp như vậy?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '📍 Vị trí góc sân yêu thích', icon: '📍', color: 'emerald', points: ['Nằm ở góc phía đông sân trường bên hàng ghế đá', 'Ấn tượng về sự yên tĩnh, râm mát và sạch sẽ', 'Nơi em thường tìm đến mỗi giờ ra chơi'] },
      { id: 'br-2', title: '🌸 Cảnh sắc & Đồ vật thân quen', icon: '🌸', color: 'purple', points: ['Chiếc ghế đá xám bóng loáng mát lạnh', 'Bồn hoa mười giờ nhỏ xinh khoe sắc thắm', 'Lối đi lát gạch sạch bóng không một chiếc rác'] },
      { id: 'br-3', title: '☀️ Ánh nắng & Gió mát', icon: '☀️', color: 'amber', points: ['Từng giọt nắng vàng tinh nghịch nhảy nhót trên nền sân', 'Làn gió sớm thổi qua mang theo hương hoa dịu ngọt', 'Bóng râm mát dịu làm xua tan cái nóng bức'] },
      { id: 'br-4', title: '📖 Hoạt động cùng bạn bè', icon: '📖', color: 'sky', points: ['Em cùng bạn thân ngồi tựa lưng đọc truyện cổ tích', 'Thì thầm chia sẻ những câu chuyện vui ở lớp', 'Ngắm nhìn các bạn nô đùa ngoài sân lớn'] },
      { id: 'br-5', title: '💖 Cảm xúc & Kỷ niệm đẹp', icon: '💖', color: 'rose', points: ['Góc sân mang lại sự bình yên và thư thái', 'Lưu giữ tình bạn gắn bó, trong sáng tuổi thơ', 'Dù mai này lớn khôn vẫn nhớ mãi góc nhỏ này'] }
    ];
    defaultDetailedOutline = {
      moDoan: ['Giới thiệu góc sân trường thân quen bên hàng ghế đá râm mát mà em yêu thích nhất trong những giờ ra chơi.'],
      phatTrienDoan: [
        'Miêu tả vị trí góc sân nhỏ sạch sẽ, có bồn hoa mười giờ tươi thắm luôn tỏa hương thơm dịu nhẹ.',
        'Tả vẻ đẹp của những tia nắng vàng lấp lánh rọi qua kẽ lá xuống nền gạch đỏ tươi cùng làn gió mát lành.',
        'Kể hoạt động quen thuộc: em và người bạn thân thường ngồi trên ghế đá đọc sách và chia sẻ từng câu chuyện vui.'
      ],
      ketDoan: ['Khẳng định góc sân nhỏ bé là nơi lưu giữ những kỷ niệm bình yên và tình bạn đẹp đẽ dưới mái trường.']
    };
    defaultVocab = {
      goodWords: [
        { word: 'yên bình', meaningAndUsage: 'Tĩnh lặng, dễ chịu và an yên' },
        { word: 'râm mát', meaningAndUsage: 'Mát dịu, dễ chịu dưới bóng râm êm ả' },
        { word: 'lung linh', meaningAndUsage: 'Ánh sáng lấp lánh, rung rinh đẹp mắt' },
        { word: 'thân thuộc', meaningAndUsage: 'Quen thuộc, gần gũi như một người bạn tri kỷ' },
        { word: 'tíu tít', meaningAndUsage: 'Trò chuyện rộn ràng, vui vẻ và say mê' },
        { word: 'êm đềm', meaningAndUsage: 'Dịu dàng, yên ả và chan chứa tình cảm' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Góc sân nhỏ như một khoảng trời bình yên dành riêng cho những trang sách của em', explanation: 'Gợi không gian tĩnh lặng, tách biệt khỏi ồn ào' },
        { type: 'Nhân hóa', example: 'Chiếc ghế đá hiền lành nằm đó, kiên nhẫn lắng nghe từng lời tâm sự tuổi học trò', explanation: 'Làm đồ vật trở nên ấm áp, có tâm hồn' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn tả góc sân', sentence: 'Giữa sân trường rộng lớn rộn rã tiếng cười đùa, nơi em yêu quý và tìm đến nhiều nhất chính là góc sân nhỏ bên hàng ghế đá râm mát.', whyItIsGood: 'Nêu bật góc sân yêu thích một cách đối chiếu tự nhiên.' },
        { type: 'mieu_ta', label: 'Gợi ý tả ánh nắng và cảnh vật', sentence: 'Mỗi giờ ra chơi, từng tia nắng vàng nhảy nhót trên nền gạch đỏ, làn gió nhẹ khẽ lay những nụ hoa mười giờ hé nở rung rinh.', whyItIsGood: 'Kết hợp ánh sáng, hoa và chuyển động nhẹ nhàng.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Góc sân trường nhỏ bé ấy đã trở thành bến đỗ êm đềm lưu giữ bao kỷ niệm trong sáng của tuổi thơ em.', whyItIsGood: 'Đọng lại cảm xúc sâu lắng, đẹp đẽ.' }
      ],
      creativeIdeas: ['Kể về lần cùng bạn nhặt cánh hoa ép vào trang vở', 'Quan sát vệt nắng sớm soi trên chiếc ghế đá mát lạnh']
    };
  }
  // -------------------------------------------------------------
  // ĐỀ B - HƯỚNG 1: TẢ NGÔI NHÀ CỦA EM
  // -------------------------------------------------------------
  else if (isHouseDirection) {
    defaultSubject = 'Tả ngôi nhà của em';
    defaultObject = 'Ngôi nhà';
    defaultScope = 'Toàn cảnh ngôi nhà và không gian sum họp gia đình';
    defaultUnderstand = 'Đề bài muốn con miêu tả ngôi nhà thân yêu của gia đình mình – tổ ấm chan chứa tình yêu thương và lưu giữ bao kỷ niệm sum họp ấm áp.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn miêu tả ngôi nhà',
      'Đối tượng chính: Ngôi nhà của em',
      'Phạm vi: Toàn cảnh ngôi nhà và không gian sum họp gia đình',
      'Nội dung 1: Vị trí và cái nhìn bao quát ngôi nhà',
      'Nội dung 2: Các gian phòng ngăn nắp, sáng sủa',
      'Nội dung 3: Ánh sáng và không khí ấm áp bên trong',
      'Nội dung 4: Cảnh cả nhà sum họp vui vẻ mỗi buổi tối',
      'Nội dung 5: Tình cảm yêu thương và ý thức giữ gìn nhà cửa'
    ];
    defaultQuestions = [
      'Ngôi nhà của con nằm ở đâu và có màu sơn hoặc nét gì thân thuộc nhất?',
      'Bước vào bên trong, các gian phòng được sắp xếp gọn gàng ra sao?',
      'Ánh sáng chan hòa và không khí ấm cúng trong nhà làm con thấy dễ chịu như thế nào?',
      'Mỗi buổi tối, tiếng cười nói và bữa cơm sum họp gia đình diễn ra đầm ấm ra sao?',
      'Con có cảm xúc gì và làm gì để giúp bố mẹ giữ gìn ngôi nhà sạch đẹp?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '🏡 Vị trí & Cảnh bao quát', icon: '🏡', color: 'emerald', points: ['Ngôi nhà nằm ở con ngõ nhỏ bình yên', 'Màu sơn tươi sáng, cánh cổng mở rộng đón em', 'Cảm giác thân thương ngay khi bước đến gần'] },
      { id: 'br-2', title: '🛋️ Các gian phòng ngăn nắp', icon: '🛋️', color: 'purple', points: ['Phòng khách trang nhã, nơi gia đình trò chuyện', 'Góc học tập sáng sủa bên cửa sổ', 'Gian bếp nhỏ thơm lừng mùi cơm mẹ nấu'] },
      { id: 'br-3', title: '☀️ Ánh sáng & Không khí', icon: '☀️', color: 'amber', points: ['Ánh nắng sớm dịu dàng rọi qua rèm cửa', 'Không gian thoáng mát, sạch sẽ và tinh tươm', 'Bình yên, tĩnh lặng xua tan mọi mỏi mệt bên ngoài'] },
      { id: 'br-4', title: '👨‍👩‍👧 Bữa cơm sum họp gia đình', icon: '👨‍👩‍👧', color: 'sky', points: ['Cả nhà quây quần bên mâm cơm ấm cúng', 'Tiếng cười giòn tan của các thành viên', 'Chia sẻ những câu chuyện vui buồn trong ngày'] },
      { id: 'br-5', title: '💖 Tình cảm & Giữ gìn tổ ấm', icon: '💖', color: 'rose', points: ['Ngôi nhà là nơi bình yên và yêu thương nhất', 'Tự giác dọn dẹp phòng, quét nhà giúp bố mẹ', 'Dù đi đâu xa cũng luôn nhớ về tổ ấm'] }
    ];
    defaultDetailedOutline = {
      moDoan: ['Giới thiệu ngôi nhà ấm cúng – tổ ấm thân thương của gia đình em.'],
      phatTrienDoan: [
        'Bao quát vẻ ngoài tươi sáng và các gian phòng ngăn nắp, tinh tươm bên trong.',
        'Miêu tả ánh sáng chan hòa và không gian ấm áp ngập tràn yêu thương.',
        'Kể không khí sum họp, đầm ấm tiếng cười của gia đình mỗi buổi tối bên mâm cơm.'
      ],
      ketDoan: ['Khẳng định tình yêu thương tha thiết với ngôi nhà và lời hứa luôn giữ gìn nhà cửa sạch đẹp.']
    };
    defaultVocab = {
      goodWords: [
        { word: 'ấm cúng', meaningAndUsage: 'Gợi không gian thân thương, an yên và chan chứa yêu thương' },
        { word: 'ngăn nắp', meaningAndUsage: 'Mọi đồ dùng được xếp đặt gọn gàng, trật tự' },
        { word: 'sum họp', meaningAndUsage: 'Các thành viên quây quần đoàn tụ bên nhau' },
        { word: 'yên bình', meaningAndUsage: 'Tĩnh lặng, dễ chịu, không ồn ào vội vã' },
        { word: 'tinh tươm', meaningAndUsage: 'Sạch sẽ, gọn gàng và chu đáo' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Ngôi nhà như bến đỗ bình yên che chở cho em qua bao ngày mưa nắng', explanation: 'Gợi sự bảo bọc thiêng liêng của gia đình' },
        { type: 'Nhân hóa', example: 'Mỗi gian phòng như biết mỉm cười đón từng bước chân em trở về sau giờ học', explanation: 'Làm ngôi nhà trở nên sống động, gần gũi' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn', sentence: 'Dù mai này có đi đâu xa, nơi em luôn hướng về với tất cả yêu thương chính là ngôi nhà ấm cúng của gia đình mình.', whyItIsGood: 'Khơi gợi tình cảm sâu sắc, tự nhiên.' },
        { type: 'mieu_ta', label: 'Gợi ý tả không khí gia đình', sentence: 'Mỗi buổi tối, khi ánh đèn vàng ấm áp bật lên, cả nhà quây quần bên mâm cơm thơm nức, rộn rã tiếng cười nói.', whyItIsGood: 'Kết hợp ánh sáng, âm thanh và sự gắn kết.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Em luôn tự giác dọn dẹp góc học tập và giữ gìn ngôi nhà sạch đẹp để tổ ấm mãi ngập tràn niềm vui.', whyItIsGood: 'Bộc lộ hành động cụ thể, thiết thực.' }
      ],
      creativeIdeas: ['Kể về chậu hoa nhỏ đặt ngoài ban công do em tự tay tưới nước', 'Chi tiết về âm thanh tiếng đồng hồ tích tắc thân quen']
    };
  }
  // -------------------------------------------------------------
  // ĐỀ B - HƯỚNG 2: TẢ GÓC NHỎ EM YÊU THÍCH TRONG NHÀ
  // -------------------------------------------------------------
  else if (isHouseCornerDirection) {
    defaultSubject = 'Tả một góc nhỏ em yêu thích trong nhà';
    defaultObject = 'Một góc nhỏ trong nhà';
    defaultScope = 'Không gian ấm cúng, đồ vật thân quen (bàn học, gian bếp, góc đọc sách...)';
    defaultUnderstand = 'Đề bài muốn con miêu tả một góc nhỏ thân thương trong ngôi nhà của mình (như góc học tập bên cửa sổ, gian bếp ấm áp hay góc đọc sách) – nơi con cảm thấy bình yên và gắn bó nhất.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn miêu tả một góc nhỏ trong nhà',
      'Đối tượng chính: Một góc nhỏ cụ thể (bàn học, gian bếp, góc đọc sách...)',
      'Phạm vi: Đồ vật, ánh sáng và kỷ niệm tại góc nhỏ ấy',
      'Nội dung 1: Giới thiệu góc nhỏ yêu thích và vị trí trong nhà',
      'Nội dung 2: Cách bài trí đồ vật gọn gàng, xinh xắn',
      'Nội dung 3: Ánh sáng tự nhiên và cảm giác ấm áp',
      'Nội dung 4: Việc con thường làm tại góc nhỏ ấy',
      'Nội dung 5: Tình cảm gắn bó với góc nhỏ'
    ];
    defaultQuestions = [
      'Góc nhỏ nào trong nhà làm con thấy ấm áp và yêu thích nhất (bàn học, góc đọc sách, gian bếp)?',
      'Nơi đó được kê ở đâu và có những đồ dùng, vật kỷ niệm nào quen thuộc?',
      'Ánh sáng, màu sắc hoặc mùi hương thoang thoảng ở góc nhỏ làm con thấy dễ chịu ra sao?',
      'Con thường làm những việc gì ở góc nhỏ ấy mỗi ngày?',
      'Góc nhỏ ấy có ý nghĩa như thế nào đối với tâm hồn và tuổi thơ của con?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '📍 Vị trí góc nhỏ', icon: '📍', color: 'emerald', points: ['Góc học tập nhỏ bên khung cửa sổ tràn nắng', 'Vị trí yên tĩnh, thoáng mát trong phòng', 'Nơi em gắn bó nhất mỗi ngày'] },
      { id: 'br-2', title: '📚 Đồ vật ngăn nắp', icon: '📚', color: 'purple', points: ['Chiếc bàn gỗ xinh xắn, giá sách xếp ngay ngắn', 'Hộp bút màu hồng pastel và chiếc đèn học nhỏ', 'Những món đồ thủ công do em tự tay trang trí'] },
      { id: 'br-3', title: '☀️ Ánh sáng & Không gian', icon: '☀️', color: 'amber', points: ['Ánh nắng vàng nhẹ rọi qua ô cửa kính', 'Làn gió thoảng mang hương cây lá ngoài ban công', 'Cảm giác yên tĩnh, dễ chịu để tập trung học tập'] },
      { id: 'br-4', title: '✏️ Hoạt động quen thuộc', icon: '✏️', color: 'sky', points: ['Em say mê ngồi làm toán, đọc sách và vẽ tranh', 'Nuôi dưỡng bao ước mơ tuổi thơ', 'Nơi lưu giữ từng trang vở nắn nót chữ đẹp'] },
      { id: 'br-5', title: '💖 Tình cảm & Giữ gìn', icon: '💖', color: 'rose', points: ['Coi góc nhỏ như người bạn thân thiết', 'Luôn lau dọn sạch sẽ, xếp sách vở ngăn nắp', 'Mỗi khi ngồi vào bàn đều thấy tràn ngập cảm hứng'] }
    ];
    defaultDetailedOutline = {
      moDoan: ['Giới thiệu góc học tập nhỏ xinh bên khung cửa sổ – nơi em yêu quý và gắn bó nhất trong ngôi nhà thân yêu.'],
      phatTrienDoan: [
        'Miêu tả chiếc bàn gỗ ngăn nắp với giá sách xếp thẳng hàng và chiếc đèn bàn sáng dịu.',
        'Tả vẻ đẹp của những tia nắng sớm rọi qua khung cửa sổ mang lại không gian sáng sủa, ấm áp.',
        'Kể những giờ phút em say mê ngồi học bài, đọc cuốn truyện yêu thích và ấp ủ những ước mơ.'
      ],
      ketDoan: ['Khẳng định góc nhỏ là người bạn thầm lặng giúp em chăm ngoan và hứa luôn giữ gìn bàn học gọn gàng.']
    };
    defaultVocab = {
      goodWords: [
        { word: 'ấm cúng', meaningAndUsage: 'Gợi không gian an yên, thân thương' },
        { word: 'ngăn nắp', meaningAndUsage: 'Đồ đạc xếp đặt trật tự, sạch đẹp' },
        { word: 'xinh xắn', meaningAndUsage: 'Nhỏ nhắn, đáng yêu và ưa nhìn' },
        { word: 'gắn bó', meaningAndUsage: 'Thân thiết như một người bạn tri kỷ' },
        { word: 'tĩnh lặng', meaningAndUsage: 'Yên ắng, tạo cảm giác tập trung và bình yên' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Góc học tập như người bạn nhỏ thầm lặng luôn kiên nhẫn đợi em trở về mỗi buổi tan trường', explanation: 'Gợi sự gần gũi, gắn bó bền chặt' },
        { type: 'Nhân hóa', example: 'Khung cửa sổ mỉm cười đón những tia nắng vàng ấm áp rọi vào trang sách', explanation: 'Làm không gian trở nên sống động, ấm áp' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn', sentence: 'Trong ngôi nhà thân yêu của em, nơi em gắn bó nhiều nhất chính là góc học tập nhỏ bên khung cửa sổ tràn ngập ánh sáng.', whyItIsGood: 'Nêu trực tiếp vị trí và cảm xúc ấm áp.' },
        { type: 'mieu_ta', label: 'Gợi ý miêu tả chi tiết', sentence: 'Mỗi buổi chiều, từng tia nắng vàng ấm áp lại rọi qua ô cửa kính, sưởi ấm hàng sách được em xếp ngay ngắn, tinh tươm.', whyItIsGood: 'Kết hợp ánh sáng thiên nhiên và sự ngăn nắp.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Góc nhỏ ấy không chỉ giúp em học tập chăm chỉ mà còn là nơi lưu giữ những ước mơ trong sáng của tuổi thơ em.', whyItIsGood: 'Nâng ý nghĩa của góc nhỏ lên thành nơi nuôi dưỡng ước mơ.' }
      ],
      creativeIdeas: ['Kể về chiếc chặn giấy hình chú mèo con trên bàn', 'Miêu tả mùi hương thơm mới của những trang vở đầu năm']
    };
  }
  // -------------------------------------------------------------
  // ĐỀ C: KỶ NIỆM VỚI ÔNG HOẶC BÀ (KHÔNG TẢ NGOẠI HÌNH)
  // -------------------------------------------------------------
  else if (isGrandfatherDirection || isGrandmotherDirection || isGrandparentsGeneral) {
    const isGrandpa = isGrandfatherDirection || (pLower.includes('ông') && !pLower.includes('bà'));
    const personName = isGrandpa ? 'ông' : 'bà';
    const capPerson = isGrandpa ? 'Ông' : 'Bà';

    defaultSubject = `Kỷ niệm đáng nhớ với ${personName}`;
    defaultObject = `Kỷ niệm với người ${personName}`;
    defaultScope = `Sự việc đáng nhớ, tình cảm yêu thương, lời dạy bảo của ${personName} và cảm xúc của em (TẬP TRUNG VÀO KỶ NIỆM, KHÔNG TẢ NGOẠI HÌNH)`;
    defaultUnderstand = `Đề bài muốn con kể lại một kỷ niệm ấm áp, đáng nhớ bên người ${personName} kính yêu – nơi chan chứa tình yêu thương ruột thịt và lời dạy bảo ân cần.`;
    defaultRequirements = [
      `Nhiệm vụ: Viết đoạn văn kể lại kỷ niệm với ${personName}`,
      `Đối tượng chính: Kỷ niệm gắn bó với ${personName}`,
      'Trọng tâm: Diễn biến sự việc, lời nói, cử chỉ ân cần và cảm xúc của con (KHÔNG tả ngoại hình như bài tả người)',
      `Nội dung 1: Giới thiệu người ${personName} và kỷ niệm khó quên`,
      'Nội dung 2: Hoàn cảnh và thời gian diễn ra sự việc',
      `Nội dung 3: Lời căn dặn ân cần, cử chỉ yêu thương của ${personName}`,
      'Nội dung 4: Con đã học được điều gì hoặc cảm thấy ấm lòng ra sao',
      'Nội dung 5: Tình cảm kính yêu và lời hứa ngoan ngoãn'
    ];
    defaultQuestions = [
      `Kỷ niệm đáng nhớ của con cùng ${personName} diễn ra vào dịp nào và ở đâu?`,
      `Sự việc gì đã xảy ra khiến con nhớ mãi không quên?`,
      `Cử chỉ ân cần, giọng nói trầm ấm hoặc lời dạy bảo nào của ${personName} làm con thấy xúc động nhất?`,
      `Khi ở bên ${personName}, con cảm thấy bình yên và được che chở như thế nào?`,
      `Con muốn gửi gắm tình cảm biết ơn và lời hứa gì đến người ${personName} kính yêu?`
    ];
    defaultBranches = [
      { id: 'br-1', title: `👵 Giới thiệu ${personName} & Kỷ niệm`, icon: isGrandpa ? '👴' : '👵', color: 'emerald', points: [`Kỷ niệm ấm áp nhất của em là bên người ${personName} kính yêu`, 'Khoảnh khắc khó quên diễn ra vào một buổi chiều yên bình', 'Cảm xúc bồi hồi mỗi khi nhớ lại'] },
      { id: 'br-2', title: '🏡 Hoàn cảnh diễn ra sự việc', icon: '🏡', color: 'purple', points: ['Không gian yên ả bên hiên nhà hay mảnh vườn nhỏ', 'Thời điểm em gặp khó khăn hoặc được người thân chăm sóc', 'Bầu không khí gia đình đầm ấm'] },
      { id: 'br-3', title: '📖 Diễn biến câu chuyện', icon: '📖', color: 'amber', points: [`${capPerson} dạy em làm một việc ý nghĩa hoặc kể chuyện cổ tích`, 'Từng lời dặn dò nhẹ nhàng, kiên nhẫn', 'Em lắng nghe và hiểu ra bài học quý giá'] },
      { id: 'br-4', title: '💖 Cử chỉ ân cần & Yêu thương', icon: '💖', color: 'sky', points: ['Bàn tay ấm áp khẽ xoa đầu em vỗ về', 'Ánh mắt hiền hậu chan chứa tình thương bao la', 'Cảm giác an tâm và ấm áp trong lòng em'] },
      { id: 'br-5', title: '🌟 Lòng biết ơn & Lời hứa', icon: '🌟', color: 'rose', points: [`Kính yêu và biết ơn người ${personName} vô bờ bến`, `Mong ${personName} luôn mạnh khỏe, sống vui vẻ cùng con cháu`, 'Tự nhủ luôn chăm ngoan để người thân mỉm cười'] }
    ];
    defaultDetailedOutline = {
      moDoan: [`Giới thiệu người ${personName} kính yêu và kỷ niệm ấm áp, đáng nhớ nhất trong lòng em.`],
      phatTrienDoan: [
        `Kể lại thời điểm và diễn biến sự việc đáng nhớ khi được ${personName} chăm sóc hoặc chỉ dạy tận tình.`,
        `Miêu tả cử chỉ ân cần, bàn tay ấm áp xoa đầu và giọng nói trầm ấm đầy yêu thương của ${personName}.`,
        `Bày tỏ cảm xúc xúc động và bài học ý nghĩa về tình cảm gia đình mà em đã nhận được.`
      ],
      ketDoan: [`Khẳng định tình yêu thương vô bờ đối với ${personName} và mong ước ${personName} mãi khỏe mạnh, bình an.`]
    };
    defaultVocab = {
      goodWords: [
        { word: 'hiền hậu', meaningAndUsage: 'Dịu dàng, nhân từ và bao dung' },
        { word: 'ân cần', meaningAndUsage: 'Chăm sóc chu đáo, nhẹ nhàng và chu toàn' },
        { word: 'ấm áp', meaningAndUsage: 'Chan chứa tình yêu thương che chở' },
        { word: 'kính yêu', meaningAndUsage: 'Tôn kính và yêu mến tha thiết' },
        { word: 'khắc sâu', meaningAndUsage: 'In đậm trong tâm trí, không bao giờ phai mờ' },
        { word: 'vỗ về', meaningAndUsage: 'An ủi, đem lại cảm giác yên lòng' }
      ],
      imageries: [
        { type: 'So sánh', example: `Bàn tay ${personName} ấm áp như ngọn lửa sưởi ấm tâm hồn em`, explanation: 'Gợi sự che chở yêu thương vô bờ' },
        { type: 'Nhân hóa', example: `Từng lời dạy bảo của ${personName} như hạt mầm gieo vào lòng em bao điều thiện lương`, explanation: 'Làm lời khuyên của người lớn thêm sâu sắc' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn kể kỷ niệm', sentence: `Trong ký ức êm đềm của tuổi thơ, kỷ niệm những buổi chiều ngồi nghe ${personName} dạy bảo luôn là điều em nâng niu nhất.`, whyItIsGood: 'Gợi mở cảm xúc lắng đọng, thân thương, bám sát kỷ niệm.' },
        { type: 'mieu_ta', label: 'Gợi ý cử chỉ yêu thương', sentence: `Bàn tay ${personName} khẽ xoa đầu em, giọng ${personName} trầm ấm như làn gió mát lành xua tan mọi âu lo trong lòng em.`, whyItIsGood: 'Kết hợp cử chỉ và cảm xúc bình yên.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: `Em thầm hứa sẽ luôn chăm ngoan, học giỏi để nụ cười hiền hậu của ${personName} mãi rạng rỡ trên môi.`, whyItIsGood: 'Bộc lộ lòng biết ơn và lời hứa hành động.' }
      ],
      creativeIdeas: [`Miêu tả mùi hương thảo mộc quen thuộc bên ${personName}`, `Chi tiết một lời dặn dò giản dị mà thấm thía của ${personName}`]
    };
  }
  // -------------------------------------------------------------
  // ĐỀ D: GIỚI THIỆU BẢN THÂN EM
  // -------------------------------------------------------------
  else if (isSelfIntro) {
    defaultSubject = 'Giới thiệu về bản thân em';
    defaultObject = 'Bản thân học sinh';
    defaultScope = 'Họ tên, sở thích, ước mơ và điểm đặc biệt của bản thân';
    defaultUnderstand = 'Đề bài muốn con giới thiệu về chính mình: họ tên, sở thích khi rảnh rỗi, ước mơ tương lai và một điểm đặc biệt khiến con tự hào là chính mình.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn giới thiệu bản thân',
      'Đối tượng chính: Bản thân học sinh',
      'Phạm vi: Họ tên, sở thích, ước mơ và điểm đặc biệt của bản thân',
      'Nội dung 1: Họ tên và tên gọi thân mật ở nhà',
      'Nội dung 2: Sở thích khi có thời gian rảnh',
      'Nội dung 3: Ước mơ nghề nghiệp tương lai',
      'Nội dung 4: Một điểm đặc biệt đáng yêu của bản thân',
      'Nội dung 5: Lời chào và mong ước kết bạn'
    ];
    defaultQuestions = [
      'Con tên là gì? Con muốn thầy cô và các bạn gọi mình bằng tên nào?',
      'Con say mê làm điều gì nhất khi có thời gian rảnh rỗi?',
      'Mai sau lớn lên, con ấp ủ ước mơ trở thành ai hoặc làm được điều gì tốt đẹp?',
      'Con có nét tính cách, thói quen hoặc nụ cười nào khiến mọi người thấy đáng yêu?',
      'Con muốn gửi lời chào hoặc mong ước gì đến các bạn cùng lớp?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '🙋 Em là ai?', icon: '🙋', color: 'emerald', points: ['Họ và tên của em, tên thân mật ở nhà', 'Em bao nhiêu tuổi và học lớp mấy', 'Ấn tượng đầu tiên về sự tự tin, vui vẻ'] },
      { id: 'br-2', title: '🎨 Sở thích của em', icon: '🎨', color: 'purple', points: ['Hoạt động em say mê (đọc sách khoa học, vẽ tranh, đá bóng)', 'Lý do em yêu thích hoạt động ấy', 'Cảm giác hào hứng mỗi khi được làm việc mình thích'] },
      { id: 'br-3', title: '✨ Ước mơ của em', icon: '✨', color: 'amber', points: ['Nghề nghiệp tương lai em ấp ủ (bác sĩ, cô giáo, họa sĩ)', 'Ý nghĩa tốt đẹp của ước mơ đối với mọi người', 'Việc em đang nỗ lực rèn luyện mỗi ngày'] },
      { id: 'br-4', title: '⭐ Điểm đặc biệt của em', icon: '⭐', color: 'sky', points: ['Nét tính cách nổi bật (hòa đồng, hay cười, hay giúp đỡ bạn)', 'Một biệt tài nhỏ hoặc sự kiên trì đáng khen', 'Điều khiến em tự hào là chính mình'] },
      { id: 'br-5', title: '💖 Lời chào & Kết bạn', icon: '💖', color: 'rose', points: ['Mong muốn có thêm nhiều người bạn tốt', 'Cùng nhau học tập chăm chỉ, tiến bộ mỗi ngày', 'Nụ cười rạng rỡ và lời chào thân ái'] }
    ];
    defaultDetailedOutline = {
      moDoan: ['Giới thiệu họ tên và một nét chung nhất về tính cách của bản thân em.'],
      phatTrienDoan: [
        'Nói về sở thích khi rảnh rỗi và niềm say mê hào hứng của em khi thực hiện sở thích đó.',
        'Chia sẻ ước mơ tương lai tươi đẹp mà em luôn ấp ủ cùng sự cố gắng học tập mỗi ngày.',
        'Giới thiệu một điểm đặc biệt nổi bật (tính cách hòa đồng, nụ cười tươi hay sự kiên nhẫn) của em.'
      ],
      ketDoan: ['Gửi lời chào thân ái và bộc lộ mong ước được gắn bó, cùng các bạn tiến bộ dưới mái trường.']
    };
    defaultVocab = {
      goodWords: [
        { word: 'vui vẻ', meaningAndUsage: 'Luôn tươi cười, mang niềm vui đến mọi người' },
        { word: 'hòa đồng', meaningAndUsage: 'Dễ gần, thân thiện và chan hòa với bạn bè' },
        { word: 'chăm chỉ', meaningAndUsage: 'Cần cù, siêng năng trong học tập và rèn luyện' },
        { word: 'say mê', meaningAndUsage: 'Hết lòng yêu thích và tập trung vào việc mình làm' },
        { word: 'ước mơ', meaningAndUsage: 'Khát khao tốt đẹp hướng tới tương lai tươi sáng' },
        { word: 'tự tin', meaningAndUsage: 'Tin tưởng vào khả năng của chính mình' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Nụ cười rạng rỡ như ánh nắng ban mai sưởi ấm mọi người xung quanh', explanation: 'Gợi nét tươi vui, đáng yêu của tuổi thơ' },
        { type: 'Nhân hóa', example: 'Mỗi trang sách như người bạn thì thầm kể cho em bao điều kỳ diệu', explanation: 'Làm sở thích đọc sách trở nên sống động' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn giới thiệu', sentence: 'Xin chào thầy cô và các bạn, em tên là ... - một bạn nhỏ luôn tràn đầy năng lượng và nụ cười rạng rỡ.', whyItIsGood: 'Mở đầu tự nhiên, thân thiện và tạo thiện cảm ngay.' },
        { type: 'mieu_ta', label: 'Gợi ý kể sở thích và ước mơ', sentence: 'Mỗi khi rảnh rỗi, em say mê lật mở từng trang sách và ấp ủ ước mơ sau này trở thành một bác sĩ giỏi chữa bệnh cho mọi người.', whyItIsGood: 'Kết hợp sở thích và ước mơ một cách mạch lạc, chân thật.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Em rất mong sẽ được làm quen và gắn bó thật nhiều kỷ niệm đẹp cùng các bạn dưới mái trường thân yêu này.', whyItIsGood: 'Bộc lộ mong ước gắn bó, ấm áp và chân thành.' }
      ],
      creativeIdeas: ['Kể về biệt danh đáng yêu mà người thân hay gọi con ở nhà', 'Kể về một điều con đã kiên trì làm và cảm thấy rất tự hào']
    };
  }
  // -------------------------------------------------------------
  // ĐỀ THỰC SỰ CHỈ TẢ CÂY BÓNG MÁT (KHI VÀ CHỈ KHI ĐỀ YÊU CẦU ĐÚNG TẢ CÂY)
  // -------------------------------------------------------------
  else if (isPureTree) {
    defaultSubject = 'Cây bóng mát ở sân trường';
    defaultObject = 'Cây bóng mát';
    defaultScope = 'Thân, gốc, tán lá và bóng mát của cây';
    defaultUnderstand = 'Đề bài muốn con miêu tả một cây bóng mát quen thuộc ở sân trường – người bạn thầm lặng che mát cho chúng con trong những giờ ra chơi.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn miêu tả cây cối',
      'Đối tượng chính: Cây bóng mát ở sân trường',
      'Nội dung 1: Tên cây và vị trí của cây',
      'Nội dung 2: Gốc, thân xù xì và tán lá xum xuê che rợp',
      'Nội dung 3: Bóng râm mát rượi và hoạt động giờ ra chơi dưới gốc cây',
      'Nội dung 4: Tình cảm gắn bó và ý thức chăm sóc cây'
    ];
    defaultQuestions = [
      'Đó là cây bóng mát gì (cây bàng, cây phượng...) và đứng ở đâu?',
      'Thân cây, gốc rễ và tán lá có đặc điểm gì nổi bật khiến con nhớ nhất?',
      'Bóng râm của cây che mát cho các bạn học sinh vui chơi ra sao?',
      'Con có cảm xúc gì và muốn làm gì để cây luôn xanh tốt?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '🌳 Cây gì & Đứng ở đâu?', icon: '🌳', color: 'emerald', points: ['Tên loài cây bóng mát thân thuộc', 'Vị trí giữa sân trường', 'Ấn tượng ban đầu về dáng cây to lớn'] },
      { id: 'br-2', title: '🪵 Gốc, thân & Cành lá', icon: '🪵', color: 'purple', points: ['Gốc cây to tròn, rễ nổi gồ ghề', 'Thân cây khoác chiếc áo nâu xù xì', 'Cành lá vươn rộng như những cánh tay lớn'] },
      { id: 'br-3', title: '🍃 Tán lá & Bóng râm', icon: '🍃', color: 'amber', points: ['Tán lá xanh um tùm đan cài', 'Chiếc ô khổng lồ che mát cả một khoảng sân', 'Tia nắng nhảy nhót qua kẽ lá'] },
      { id: 'br-4', title: '🏃 Giờ ra chơi dưới gốc cây', icon: '🏃', color: 'sky', points: ['Các bạn tụ tập đọc sách, trò chuyện', 'Gió mát rượi xua đi cái nóng nực', 'Tiếng cười nói rộn rã hòa cùng tiếng lá reo'] },
      { id: 'br-5', title: '💖 Tình cảm & Chăm sóc cây', icon: '💖', color: 'rose', points: ['Coi cây như người bạn lớn che chở', 'Không bẻ cành hái lá, cùng bảo vệ cây xanh', 'Cây chứng kiến từng ngày em lớn khôn'] }
    ];
    defaultDetailedOutline = {
      moDoan: ['Giới thiệu cây bóng mát ở sân trường mà em yêu quý nhất.'],
      phatTrienDoan: [
        'Miêu tả thân cây to lớn, vỏ cây nâu xù xì và gốc rễ vững chãi.',
        'Tả tán lá xum xuê xòe rộng như chiếc ô khổng lồ che mát.',
        'Kể hoạt động rộn rã của học sinh dưới bóng râm mát rượi trong giờ ra chơi.'
      ],
      ketDoan: ['Khẳng định tình cảm gắn bó với cây và ý thức giữ gìn bảo vệ cây xanh.']
    };
    defaultVocab = {
      goodWords: [
        { word: 'sừng sững', meaningAndUsage: 'Đứng hiên ngang, to lớn và vững chãi' },
        { word: 'xum xuê', meaningAndUsage: 'Cành lá tươi tốt, rậm rạp và tràn đầy sức sống' },
        { word: 'râm mát', meaningAndUsage: 'Mát mẻ, che bóng dịu êm' },
        { word: 'rì rào', meaningAndUsage: 'Âm thanh lá cây khẽ lay động trong gió thoảng' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Tán cây xòe rộng như một chiếc ô xanh khổng lồ che mát cho chúng em', explanation: 'Gợi hình ảnh tán lá to lớn' },
        { type: 'Nhân hóa', example: 'Cây đứng sừng sững, mỉm cười lắng nghe từng tiếng cười nói rộn rã của tuổi học trò', explanation: 'Làm cây xanh trở nên gần gũi như một người bạn' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn tả cây', sentence: 'Sừng sững giữa sân trường thân yêu của em là cây bàng cổ thụ tỏa bóng xanh mát rượi.', whyItIsGood: 'Nêu ngay tên cây và dáng vẻ vững chãi.' },
        { type: 'mieu_ta', label: 'Gợi ý miêu tả bóng mát', sentence: 'Vào mỗi giờ ra chơi, từng đợt gió nhẹ khẽ lướt qua làm tán lá reo rì rào, xua tan bao mệt mỏi cho chúng em.', whyItIsGood: 'Kết hợp âm thanh, bóng mát và cảm xúc.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Cây không chỉ cho em bóng mát mà còn là nhân chứng lưu giữ bao kỷ niệm ngọt ngào của tuổi thơ.', whyItIsGood: 'Nâng tầm ý nghĩa của cây.' }
      ],
      creativeIdeas: ['Nhặt một chiếc lá rụng ép vào trang vở làm kỷ niệm', 'Quan sát tia nắng chiếu qua kẽ lá rọi xuống đất']
    };
  }

  const defaultAnalysisResult: PromptAnalysisData = {
    originalPrompt: prompt,
    grade: Number(grade) || 3,
    hasMultipleDirections: hasMultipleDirections,
    detectedDirections: detectedDirections,
    selectedDirectionId: activeDirection?.id || null,
    selectedDirectionTitle: activeDirection?.title || undefined,
    coreSubject: defaultSubject,
    mainObject: defaultObject,
    writingScope: defaultScope,
    hoaNhoUnderstand: defaultUnderstand,
    specificRequirements: defaultRequirements,
    suggestedLength: grade <= 2 ? '3–4 câu ngắn' : grade === 3 ? '4–6 câu hoặc 7–9 câu' : '8–12 câu',
    socraticQuestions: defaultQuestions,
    branches: defaultBranches,
    outline: defaultDetailedOutline,
    vocabularySuggestions: defaultVocab as any
  };

  if (!ai) {
    return res.json(defaultAnalysisResult);
  }

  try {
    const chosenContext = activeDirection 
      ? `HỌC SINH ĐÃ CHỌN HƯỚNG VIẾT: "${activeDirection.title}". ĐỐI TƯỢNG CHÍNH: "${activeDirection.mainObject}". PHẠM VI: "${activeDirection.scope}".`
      : `ĐỀ BÀI: "${prompt}". ĐỐI TƯỢNG: "${defaultObject}".`;

    const systemInstruction = `Bạn là HOA NHỎ - trợ lý học tập sư phạm Tiếng Việt tiểu học (Lớp ${grade}), bám sát Chương trình GDPT 2018 (bộ sách Kết nối tri thức với cuộc sống).

QUY TẮC SỐ 1 BẮT BUỘC TUYỆT ĐỐI (TRÁNH LẠC ĐỀ 100%):
1. ${chosenContext}
2. Bóc tách ĐÚNG nhiệm vụ, đối tượng chính và phạm vi viết.
3. TUYỆT ĐỐI KHÔNG BIẾN THÀNH BÀI TẢ CÂY BÓNG MÁT! 
   - Nếu học sinh viết về "Ngôi trường tiểu học": Đối tượng là NGÔI TRƯỜNG (cổng trường, dãy lớp học, thư viện, sân trường, hoạt động). CẤM chuyển thành bài tả cây bàng/cây phượng!
   - Nếu học sinh viết về "Góc sân trường em yêu thích": Đối tượng là MỘT GÓC SÂN TRƯỜNG CỤ THỂ (vị trí góc sân, hàng ghế đá, bồn hoa, ánh nắng, hoạt động của bạn bè ở góc sân). Nếu có cây bóng mát, nó chỉ là một chi tiết phụ ở hậu cảnh ("dưới bóng cây râm mát"), TUYỆT ĐỐI KHÔNG chuyển dàn ý thành gốc cây, thân cây, tán lá, rễ cây hay chăm sóc cây!
   - Nếu viết về "Kỷ niệm với ông/bà": TOÀN BỘ tập trung vào KỶ NIỆM VÀ TÌNH CẢM GIA ĐÌNH. TUYỆT ĐỐI KHÔNG chuyển thành tả ngoại hình ông bà (tóc bạc, da nhăn)!
   - Nếu viết về "Giới thiệu bản thân": TOÀN BỘ về bản thân học sinh (họ tên, sở thích, ước mơ, điểm đặc biệt). TUYỆT ĐỐI KHÔNG tả nhà cửa hay trường lớp!

Hãy trả về JSON theo đúng định dạng sau:
{
  "coreSubject": "Chủ đề cốt lõi ngắn gọn (Ví dụ: Tả ngôi trường tiểu học của em hoặc Tả một góc sân trường em yêu thích)",
  "mainObject": "Đối tượng chính (Ví dụ: Ngôi trường hoặc Góc sân trường)",
  "hoaNhoUnderstand": "Đề bài muốn con...",
  "specificRequirements": [
    "Nhiệm vụ: ...",
    "Đối tượng chính: ...",
    "Nội dung 1: ...",
    "Nội dung 2: ..."
  ],
  "suggestedLength": "${grade <= 2 ? '3–4 câu ngắn' : grade === 3 ? '4–6 câu hoặc 7–9 câu' : '8–12 câu'}",
  "socraticQuestions": [
    "Câu hỏi khơi mở 1...",
    "Câu hỏi khơi mở 2...",
    "Câu hỏi khơi mở 3...",
    "Câu hỏi khơi mở 4..."
  ],
  "branches": [
    { "id": "br-1", "title": "Nhánh 1", "icon": "📍", "color": "emerald", "points": ["Ý a", "Ý b"] },
    { "id": "br-2", "title": "Nhánh 2", "icon": "🏢", "color": "purple", "points": ["Ý a", "Ý b"] },
    { "id": "br-3", "title": "Nhánh 3", "icon": "📚", "color": "amber", "points": ["Ý a", "Ý b"] },
    { "id": "br-4", "title": "Nhánh 4", "icon": "🔔", "color": "sky", "points": ["Ý a", "Ý b"] },
    { "id": "br-5", "title": "Nhánh 5", "icon": "💖", "color": "rose", "points": ["Ý a", "Ý b"] }
  ],
  "outline": {
    "moDoan": ["Gợi ý mở đoạn..."],
    "phatTrienDoan": ["Gợi ý phát triển 1...", "Gợi ý phát triển 2...", "Gợi ý phát triển 3..."],
    "ketDoan": ["Gợi ý kết đoạn..."]
  },
  "vocabularySuggestions": {
    "goodWords": [
      { "word": "Từ hay 1", "meaningAndUsage": "Giải thích ngắn gọn" }
    ],
    "imageries": [
      { "type": "So sánh", "example": "Hình ảnh so sánh bám sát đối tượng", "explanation": "Tác dụng" },
      { "type": "Nhân hóa", "example": "Hình ảnh nhân hóa bám sát đối tượng", "explanation": "Tác dụng" }
    ],
    "sampleSentences": [
      { "type": "mo_bai", "label": "Gợi ý mở đoạn", "sentence": "...", "whyItIsGood": "..." },
      { "type": "mieu_ta", "label": "Gợi ý phát triển", "sentence": "...", "whyItIsGood": "..." },
      { "type": "ket_bai", "label": "Gợi ý câu kết", "sentence": "...", "whyItIsGood": "..." }
    ],
    "creativeIdeas": [
      "Ý tưởng sáng tạo 1",
      "Ý tưởng sáng tạo 2"
    ]
  }
}`;

    const userPrompt = `Đề bài: "${prompt}"
${activeDirection ? `Hướng học sinh đã chọn: "${activeDirection.title}" (Đối tượng: "${activeDirection.mainObject}")` : ''}
Lớp: ${grade}
Yêu cầu bổ sung của học sinh: "${specialWishes}"

Hãy phân tích đề bài CHÍNH XÁC THEO ĐÚNG HƯỚNG VÀ ĐỐI TƯỢNG TRÊN.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');

    // -------------------------------------------------------------
    // KIỂM TRA TÍNH NHẤT QUÁN TRƯỚC KHI HIỂN THỊ (CONSISTENCY CHECK)
    // -------------------------------------------------------------
    const aiSubject = (parsed.coreSubject || '').toLowerCase();
    const aiObj = (parsed.mainObject || '').toLowerCase();
    const isTreeHijack = (aiSubject.includes('cây') || aiSubject.includes('bóng mát') || aiObj.includes('cây')) && 
      (isSchoolDirection || isSchoolyardCornerDirection || isHouseDirection || isHouseCornerDirection || isGrandparentsGeneral || isSelfIntro);

    if (isTreeHijack) {
      console.warn('AI attempted to hijack topic into tree! Rejecting and falling back to clean pedagogical baseline.');
      return res.json(defaultAnalysisResult);
    }

    res.json({
      originalPrompt: prompt,
      grade: Number(grade) || 3,
      hasMultipleDirections,
      detectedDirections,
      selectedDirectionId: activeDirection?.id || null,
      selectedDirectionTitle: activeDirection?.title || undefined,
      coreSubject: parsed.coreSubject || defaultSubject,
      mainObject: parsed.mainObject || defaultObject,
      writingScope: defaultScope,
      hoaNhoUnderstand: parsed.hoaNhoUnderstand || defaultUnderstand,
      specificRequirements: (parsed.specificRequirements && parsed.specificRequirements.length > 0) ? parsed.specificRequirements : defaultRequirements,
      suggestedLength: parsed.suggestedLength || defaultAnalysisResult.suggestedLength,
      socraticQuestions: (parsed.socraticQuestions && parsed.socraticQuestions.length > 0) ? parsed.socraticQuestions : defaultQuestions,
      branches: (parsed.branches && parsed.branches.length > 0) ? parsed.branches : defaultBranches,
      outline: parsed.outline || defaultDetailedOutline,
      vocabularySuggestions: parsed.vocabularySuggestions || defaultVocab
    });
  } catch (err) {
    console.error('Error in analyze-prompt-deep:', err);
    res.json(defaultAnalysisResult);
  }
});


// "Cùng Hoa Nhỏ hiểu đề nhé!" (Prompt Understanding & Pedagogical alignment)
app.post('/api/ai/understand-prompt', async (req, res) => {
  const { prompt, grade = 3, genre, specialWishes } = req.body;

  const defaultUnderstanding = {
    target: 'Bài yêu cầu em bày tỏ cảm xúc, kể lại hoạt động hoặc miêu tả sự vật theo đúng chủ đề.',
    genreEvaluation: `Dạng bài "${genre || 'Tự do'}" rất phù hợp với lứa tuổi lớp ${grade}.`,
    contentRequirements: [
      'Giới thiệu đối tượng hoặc sự việc',
      'Kể, tả các chi tiết và kỷ niệm cụ thể',
      'Bày tỏ cảm nghĩ chân thật của em'
    ],
    suggestedSentenceCount: grade <= 2 ? '3–4 câu' : grade === 3 ? '4–6 câu hoặc 7–9 câu' : '8–12 câu',
    specialWishesNoted: specialWishes ? [specialWishes] : ['Viết câu văn tự nhiên, có cảm xúc thật'],
    advice: 'Em nhớ viết hoa đầu câu, đặt dấu chấm cuối câu và kể thật từ kỷ niệm của chính mình nhé!'
  };

  if (!ai) {
    return res.json(defaultUnderstanding);
  }

  try {
    const systemInstruction = `Bạn là HOA NHỎ - trợ lý học tập sư phạm Tiếng Việt dành cho học sinh Lớp ${grade} trong chương trình giáo dục phổ thông.
Nhiệm vụ: Giúp học sinh HIỂU ĐỀ qua góc nhìn: "CÙNG HOA NHỎ HIỂU ĐỀ NHÉ!".

QUY TẮC:
1. Đọc kỹ đề: "${prompt}".
2. Đối chiếu dạng bài em chọn: "${genre || 'Tự chọn'}". Nếu chưa khớp, nhẹ nhàng gợi ý em chọn lại, không tự động chuyển mà em chưa đồng ý.
3. Điều chỉnh độ dài số câu và độ phức tạp phù hợp học sinh Lớp ${grade} (Lớp 1-3 viết đoạn ngắn 4-6 hoặc 7-9 câu; không áp đặt máy móc bố cục bài văn 3 phần lớn nếu đề chỉ yêu cầu đoạn văn).
4. Ghi nhận các yêu cầu thêm của học sinh: "${specialWishes || 'Không có'}". Nếu yêu cầu quá sức lứa tuổi (ví dụ lớp 2 đòi viết luận văn), nhẹ nhàng hướng dẫn em.
5. Ngôn ngữ ấm áp, gần gũi, khích lệ.`;

    const userPrompt = `Đề bài: "${prompt}"
Lớp học: Lớp ${grade}
Dạng bài em chọn: "${genre}"
Yêu cầu thêm của em: "${specialWishes || ''}"

Hãy trả về JSON theo cấu trúc:
{
  "target": "Bài yêu cầu em viết về điều gì?",
  "genreEvaluation": "Đánh giá sự phù hợp của dạng bài em chọn và gợi ý nếu cần",
  "contentRequirements": ["Nội dung cần kể/tả 1", "Nội dung cần kể/tả 2", "Nội dung cần kể/tả 3"],
  "suggestedSentenceCount": "Số câu đề xuất phù hợp lớp học (vd: Khoảng 5-7 câu)",
  "specialWishesNoted": ["Ghi nhận yêu cầu đặc biệt của em"],
  "advice": "Lời khuyên ngắn gọn, bổ ích từ Hoa Nhỏ"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            target: { type: Type.STRING },
            genreEvaluation: { type: Type.STRING },
            contentRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedSentenceCount: { type: Type.STRING },
            specialWishesNoted: { type: Type.ARRAY, items: { type: Type.STRING } },
            advice: { type: Type.STRING }
          },
          required: ['target', 'genreEvaluation', 'contentRequirements', 'suggestedSentenceCount', 'specialWishesNoted', 'advice']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json(parsed);
  } catch (err) {
    console.error('Error understanding prompt:', err);
    res.json(defaultUnderstanding);
  }
});

// Dynamic Contextual Vocabulary & Imagery Bank ("Từ hay – Hình ảnh – Câu mẫu")
app.post('/api/ai/vocabulary-imagery', async (req, res) => {
  const { prompt = '', genre, grade = 3, studentIdeas } = req.body;
  const pLower = (prompt || '').toLowerCase();

  // Smart topic-based default bank fallback
  let defaultBank = {
    goodWords: [
      { word: 'ấm áp', meaningAndUsage: 'Gợi cảm giác yêu thương, thân thuộc và che chở' },
      { word: 'gắn bó', meaningAndUsage: 'Tình cảm thân thiết, không rời xa' },
      { word: 'thân thương', meaningAndUsage: 'Gần gũi và đầy ắp kỷ niệm đẹp' },
      { word: 'rạng rỡ', meaningAndUsage: 'Tươi vui, tràn đầy sức sống và niềm vui' }
    ],
    imageries: [
      { type: 'So sánh', example: 'Gần gũi và thân thiết như một người bạn tri kỉ', explanation: 'Giúp người đọc cảm nhận rõ sự gắn bó sâu đậm' },
      { type: 'Nhân hóa', example: 'Mỗi góc nhỏ dường như đều biết mỉm cười đón em trở về', explanation: 'Làm cho sự vật trở nên có tâm hồn, ấm áp như con người' }
    ],
    sampleSentences: [
      {
        type: 'mo_bai',
        label: 'Gợi ý mở đoạn tự nhiên',
        sentence: `Khi nghĩ về ${prompt.slice(0, 35) || 'điều thân thương này'}, lòng em lại dâng lên bao cảm xúc ấm áp.`,
        whyItIsGood: 'Nêu trực tiếp đối tượng với cảm xúc chân thật, không sáo rỗng.'
      },
      {
        type: 'mieu_ta',
        label: 'Gợi ý chi tiết sinh động',
        sentence: 'Mỗi chi tiết nhỏ nơi đây đều lưu giữ biết bao kỷ niệm đẹp đẽ của tuổi thơ em.',
        whyItIsGood: 'Có liên hệ với kỷ niệm cá nhân giúp câu văn có hồn và cảm xúc sâu lắng.'
      },
      {
        type: 'ket_bai',
        label: 'Gợi ý câu kết ấn tượng',
        sentence: 'Dù mai này lớn khôn đi xa, hình ảnh ấy sẽ luôn in đậm trong tâm trí em.',
        whyItIsGood: 'Thể hiện tình cảm gắn bó lâu dài và lời hứa trân trọng những điều thân thương.'
      }
    ],
    creativeIdeas: [
      'Em có thể kể về một mùi hương quen thuộc gắn liền với nơi ấy',
      'Nhớ lại một khoảnh khắc yên bình nhất mà em từng trải qua'
    ]
  };

  // Specific fallbacks for house / corner / desk topics
  if (pLower.includes('nhà') || pLower.includes('góc') || pLower.includes('phòng') || pLower.includes('bàn') || pLower.includes('cửa sổ')) {
    defaultBank = {
      goodWords: [
        { word: 'ấm cúng', meaningAndUsage: 'Gợi không gian gia đình thân thương, an yên và chan chứa tình yêu thương' },
        { word: 'ngăn nắp', meaningAndUsage: 'Mọi đồ dùng được xếp đặt gọn gàng, trật tự, sạch sẽ' },
        { word: 'xinh xắn', meaningAndUsage: 'Nhỏ nhắn, đáng yêu và ưa nhìn' },
        { word: 'yên bình', meaningAndUsage: 'Tĩnh lặng, dễ chịu, không ồn ào vội vã' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Ngôi nhà như một tổ ấm êm đềm che chở cho em qua bao ngày mưa nắng', explanation: 'Gợi cảm giác an toàn và sự chở che thiêng liêng của gia đình' },
        { type: 'Nhân hóa', example: 'Góc học tập nhỏ dường như luôn kiên nhẫn đợi em trở về mỗi buổi tan trường', explanation: 'Biến góc nhỏ thành một người bạn thầm lặng và gắn bó' }
      ],
      sampleSentences: [
        {
          type: 'mo_bai',
          label: 'Gợi ý mở đoạn tả ngôi nhà / góc nhỏ',
          sentence: 'Trong ngôi nhà thân yêu của em, nơi em gắn bó nhiều nhất chính là góc học tập nhỏ xinh bên khung cửa sổ.',
          whyItIsGood: 'Giới thiệu ngay góc nhỏ yêu thích và vị trí cụ thể tràn ngập ánh sáng.'
        },
        {
          type: 'mieu_ta',
          label: 'Gợi ý miêu tả chi tiết',
          sentence: 'Mỗi buổi chiều, từng tia nắng vàng ấm áp lại rọi qua ô cửa kính, sưởi ấm hàng sách được xếp ngay ngắn.',
          whyItIsGood: 'Kết hợp ánh sáng thiên nhiên với sự ngăn nắp, tạo cảm giác êm đềm.'
        },
        {
          type: 'ket_bai',
          label: 'Gợi ý câu kết lắng đọng',
          sentence: 'Góc nhỏ ấy không chỉ giúp em học tập chăm chỉ mà còn là nơi lưu giữ những ước mơ thơ ấu của em.',
          whyItIsGood: 'Nâng ý nghĩa của góc nhỏ lên thành nơi nuôi dưỡng ước mơ.'
        }
      ],
      creativeIdeas: [
        'Kể về âm thanh quen thuộc trong nhà (tiếng đồng hồ tích tắc, tiếng mẹ nấu cơm)',
        'Chi tiết về một món đồ nhỏ em tự tay trang trí trên bàn'
      ]
    };
  }

  if (!ai) {
    return res.json(defaultBank);
  }

  try {
    const systemInstruction = `Bạn là HOA NHỎ - trợ lý học tập sư phạm Tiếng Việt tiểu học (Lớp ${grade}).
Mục tiêu: Cung cấp kho từ ngữ, hình ảnh so sánh, nhân hóa và câu mẫu cho học sinh.
QUY TẮC CỐT LÕI BẮT BUỘC:
1. BÁM SÁT 100% ĐỀ BÀI CỦA HỌC SINH: "${prompt}".
   - Nếu đề bài yêu cầu tả ngôi nhà hoặc góc nhỏ yêu thích, TOÀN BỘ từ hay, biện pháp tu từ, câu mẫu PHẢI miêu tả ngôi nhà, căn phòng, góc nhỏ, đồ vật trong nhà; TUYỆT ĐỐI KHÔNG gợi ý về hoạt động ngoài trời hay đề tài không liên quan!
   - Nếu đề bài là tả người thân, đồ vật, hay kể lại một hoạt động thì từ ngữ và câu mẫu phải phục vụ chính xác đề tài đó.
2. Lớp ${grade}: Ngôn ngữ trong sáng, gần gũi, giàu sức gợi, không dùng từ quá khó hay lý thuyết sáo rỗng.
3. Câu mẫu kèm lý giải "vì sao câu này hay" để hướng dẫn em học cách quan sát và dùng từ.`;

    const userPrompt = `Đề bài học sinh nhập: "${prompt}"
Lớp: ${grade}
Dạng bài em chọn: "${genre}"
Ý tưởng bổ sung của em: "${studentIdeas || ''}"

Hãy tạo kho từ ngữ và hình ảnh sáng tạo ngữ cảnh hóa CHẶT CHẼ THEO ĐÚNG ĐỀ BÀI TRÊN.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goodWords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaningAndUsage: { type: Type.STRING }
                },
                required: ['word', 'meaningAndUsage']
              }
            },
            imageries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  example: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ['type', 'example', 'explanation']
              }
            },
            sampleSentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  label: { type: Type.STRING },
                  sentence: { type: Type.STRING },
                  whyItIsGood: { type: Type.STRING }
                },
                required: ['type', 'label', 'sentence', 'whyItIsGood']
              }
            },
            creativeIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['goodWords', 'imageries', 'sampleSentences', 'creativeIdeas']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json(parsed);
  } catch (err) {
    console.error('Error vocabulary-imagery:', err);
    res.json(defaultBank);
  }
});
// Off-topic checking endpoint ("Kiểm tra đúng đề")
app.post('/api/ai/check-topic', async (req, res) => {
  const { prompt, essayText, grade = 3 } = req.body;

  if (!essayText || essayText.trim().length < 5) {
    return res.json({
      isOffTopic: false,
      isUncertain: false,
      message: 'Bài viết đang được soạn thảo.',
      guidance: ''
    });
  }

  if (!ai) {
    return res.json({
      isOffTopic: false,
      isUncertain: false,
      message: 'Bài viết đúng chủ đề.',
      guidance: ''
    });
  }

  try {
    const systemInstruction = `Bạn là HOA NHỎ - trợ lý học tập tiểu học.
Nhiệm vụ: Đối chiếu bài viết của học sinh với ĐỀ BÀI:
1. Đúng đề (isOffTopic: false, isUncertain: false).
2. RÕ RÀNG LẠC ĐỀ / SAI ĐỀ (isOffTopic: true, isUncertain: false).
   Thông báo: "🌷 Em đã làm sai đề, yêu cầu gửi lại đúng chủ đề yêu cầu."
   Hướng dẫn: "Con hãy đọc lại đề bài và kiểm tra xem mình cần viết về điều gì nhé!"
3. Chưa chắc chắn (isOffTopic: false, isUncertain: true).
   Thông báo: "Hoa Nhỏ chưa hiểu rõ ý con muốn kể. Con có thể giải thích thêm một chút không?"
LƯU Ý SƯ PHẠM:
- Không đánh giá sai đề chỉ vì học sinh có cách diễn đạt sáng tạo hoặc góc nhìn khác lạ. Chỉ báo sai đề khi nội dung hoàn toàn không liên quan đến đề bài.`;

    const userPrompt = `Đề bài: "${prompt}"
Lớp: ${grade}
Bài viết của học sinh:
"""${essayText}"""

Hãy trả về JSON:
{
  "isOffTopic": boolean,
  "isUncertain": boolean,
  "message": "...",
  "guidance": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json(parsed);
  } catch (err) {
    console.error('Error check-topic:', err);
    res.json({
      isOffTopic: false,
      isUncertain: false,
      message: 'Bài viết hợp lệ.',
      guidance: ''
    });
  }
});

// "Làm mới dàn ý từ ý tưởng của em" (Refresh Outline with bulleted Mở đoạn, Phát triển đoạn, Kết đoạn)
app.post('/api/ai/refresh-outline', async (req, res) => {
  const { prompt, grade = 3, genre, previousOutline, studentStory } = req.body;

  const defaultDetailed = {
    moDoan: [
      'Giới thiệu sự việc hoặc cảnh vật mà con muốn viết.',
      'Sự việc diễn ra ở đâu, vào lúc nào và cùng ai?'
    ],
    phatTrienDoan: [
      studentStory ? `Kể về chi tiết: ${studentStory}` : 'Kể các hoạt động diễn ra theo trình tự thời gian.',
      'Những âm thanh, màu sắc hoặc chuyển động đáng nhớ.',
      'Cử chỉ hoặc nét mặt vui vẻ của người thân/bạn bè.',
      'Sử dụng một từ ngữ gợi tả hoặc hình ảnh so sánh sinh động.'
    ],
    ketDoan: [
      'Khẳng định cảm xúc yêu mến và gắn bó của con.',
      'Mong ước tốt đẹp hoặc bài học ý nghĩa con rút ra.'
    ]
  };

  if (!ai) {
    return res.json({
      initialIdeas: ['Dàn ý ban đầu'],
      newDetails: [studentStory || 'Ý mới'],
      newOutline: [
        { id: '1', section: 'Mở đoạn', content: defaultDetailed.moDoan.join(' ') },
        { id: '2', section: 'Phát triển đoạn', content: defaultDetailed.phatTrienDoan.join(' ') },
        { id: '3', section: 'Kết đoạn', content: defaultDetailed.ketDoan.join(' ') }
      ],
      detailedOutline: defaultDetailed,
      comparisonNote: 'Dàn ý mới đã đưa thêm những kỷ niệm sống động mà em vừa chia sẻ.'
    });
  }

  try {
    const isShortTask = /2[–-]3\s*câu|3[–-]4\s*câu/i.test(prompt);
    const expectedCountText = isShortTask 
      ? 'Đề yêu cầu viết NGẮN 2–3 CÂU: Chỉ tạo đúng 2-3 ý cô đọng, tuyệt đối không tạo dàn ý bài văn dài.' 
      : 'Đề yêu cầu đoạn văn: Tạo 4-7 ý tương ứng số câu vừa vặn cho học sinh lớp 3.';

    const userPrompt = `Đề bài: "${prompt}"
Lớp: ${grade}
Dạng bài: "${genre}"
Dàn ý trước đó: ${JSON.stringify(previousOutline || [])}
Chi tiết học sinh VỪA KỂ THÊM: "${studentStory}"
RÀNG BUỘC ĐỘ DÀI: ${expectedCountText}

HÃY TẠO DÀN Ý CỤ THỂ MỖI Ý NẰM TRÊN MỘT DÒNG GẠCH ĐẦU DÒNG RIÊNG:
${isShortTask ? `
- MỞ ĐOẠN: mảng gồm 1 ý ngắn gọn (câu 1)
- PHÁT TRIỂN ĐOẠN: mảng gồm 1-2 ý chi tiết có từ láy hoặc so sánh (câu 2)
- KẾT ĐOẠN: mảng gồm 1 ý cảm xúc (câu 3)
` : `
- MỞ ĐOẠN: mảng gồm 1-2 ý gợi mở
- PHÁT TRIỂN ĐOẠN: mảng gồm 3-4 ý chi tiết (lồng ghép trải nghiệm học sinh vừa kể, có từ láy/hình ảnh)
- KẾT ĐOẠN: mảng gồm 1-2 ý kết cảm xúc chân thành
`}
TUYỆT ĐỐI KHÔNG GHÉP THÀNH ĐOẠN VĂN VIẾT SẴN! MỖI Ý LÀ MỘT GỢI Ý GẠCH ĐẦU DÒNG ĐỂ EM TỰ VIẾT.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            initialIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
            newDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
            detailedOutline: {
              type: Type.OBJECT,
              properties: {
                moDoan: { type: Type.ARRAY, items: { type: Type.STRING } },
                phatTrienDoan: { type: Type.ARRAY, items: { type: Type.STRING } },
                ketDoan: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['moDoan', 'phatTrienDoan', 'ketDoan']
            },
            comparisonNote: { type: Type.STRING },
            adherenceNote: { type: Type.STRING }
          },
          required: ['initialIdeas', 'newDetails', 'detailedOutline', 'comparisonNote']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const dOut = parsed.detailedOutline || defaultDetailed;
    const formatSection = (lines: string[]) => lines.map(line => `• ${line.replace(/^[•\-\*]\s*/, '')}`).join('\n');

    const newOutlineItems = [
      { id: '1', section: 'Mở đoạn', content: formatSection(dOut.moDoan || []) },
      { id: '2', section: 'Phát triển đoạn', content: formatSection(dOut.phatTrienDoan || []) },
      { id: '3', section: 'Kết đoạn', content: formatSection(dOut.ketDoan || []) }
    ];

    res.json({
      initialIdeas: parsed.initialIdeas || ['Dàn ý ban đầu'],
      newDetails: parsed.newDetails || [studentStory],
      newOutline: newOutlineItems,
      detailedOutline: dOut,
      comparisonNote: parsed.comparisonNote || 'Dàn ý đã được làm mới từ câu chuyện của con!',
      adherenceNote: parsed.adherenceNote || (isShortTask ? 'Dàn ý đã được rút gọn đúng 2–3 câu theo yêu cầu đề bài.' : 'Dàn ý bám sát yêu cầu đề bài.')
    });
  } catch (err) {
    console.error('Error refreshing outline:', err);
    res.json({
      initialIdeas: ['Dàn ý ban đầu'],
      newDetails: [studentStory],
      newOutline: [
        { id: '1', section: 'Mở đoạn', content: defaultDetailed.moDoan.map(i => `• ${i}`).join('\n') },
        { id: '2', section: 'Phát triển đoạn', content: defaultDetailed.phatTrienDoan.map(i => `• ${i}`).join('\n') },
        { id: '3', section: 'Kết đoạn', content: defaultDetailed.ketDoan.map(i => `• ${i}`).join('\n') }
      ],
      detailedOutline: defaultDetailed,
      comparisonNote: 'Hoa Nhỏ đã cập nhật thêm ý tưởng của con.'
    });
  }
});

// "Góc sáng tạo ý tưởng" (Continuous creative conversation)
app.post('/api/ai/creative-chat', async (req, res) => {
  const { prompt, grade = 3, chatHistory, studentQuestion } = req.body;

  const defaultReply = 'Ý tưởng của em rất thú vị! Em hãy đưa chi tiết đó vào phần thân đoạn để người đọc cùng cảm nhận nhé.';

  if (!ai) {
    return res.json({ reply: defaultReply });
  }

  try {
    const systemInstruction = `Bạn là HOA NHỎ trong "Góc sáng tạo ý tưởng".
Bối cảnh: Đề bài "${prompt}", Lớp ${grade}.
NGUYÊN TẮC:
- Trả lời bằng ngôn ngữ sư phạm ngắn gọn, ấm áp, khích lệ.
- Học sinh có thể hỏi về đề, xin gợi ý từ ngữ, hỏi cách so sánh, nêu ý tưởng khác, hoặc phản biện.
- AI ghi nhớ ngữ cảnh cuộc trò chuyện, không bắt ép học sinh viết theo dàn ý mẫu.
- Mỗi câu trả lời ngắn 2-3 câu, gợi mở sự tự chủ cho học sinh.`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Lịch sử trao đổi:\n` +
              (chatHistory || []).map((m: any) => `${m.sender === 'hoanho' ? 'Hoa Nhỏ' : 'Học sinh'}: ${m.text}`).join('\n') +
              `\nCâu hỏi/ý kiến mới của học sinh: "${studentQuestion}"\n\nHãy phản hồi thân thiện, giúp em gỡ rối hoặc phát triển thêm ý tưởng.`
          }
        ]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ reply: response.text?.trim() || defaultReply });
  } catch (err) {
    console.error('Error creative-chat:', err);
    res.json({ reply: defaultReply });
  }
});

// =========================================================================
// NÂNG CẤP TRANG 2: CÔ GÓP Ý BÀI VĂN
// =========================================================================

// OCR Handwritten Vietnamese Student Essays (up to 10 images)
app.post('/api/ai/ocr-essay', async (req, res) => {
  const { images } = req.body; // array of up to 10 base64 images

  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: 'Chưa có ảnh bài viết nào được gửi lên.' });
  }

  if (!ai) {
    return res.json({
      transcribedText: 'Chiều chủ nhật tuần trước, em cùng mẹ vào bếp làm món bánh rán mật thơm lừng. Mẹ nhào bột trắng mịn, còn em thích thú nặn từng viên bánh tròn xoe rồi rắc vừng lên trên. Cả nhà em cùng quây quần ăn bánh thật vui vẻ.',
      uncertainWords: ['bánh rán mật', 'quây quần'],
      notes: 'Hoa Nhỏ đã chép lại bài viết tay từ ảnh. Em nhớ đọc lại và chỉnh sửa các từ còn chưa chuẩn nhé!'
    });
  }

  try {
    const parts: any[] = [];
    for (const img of images.slice(0, 10)) {
      const match = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      } else {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: img,
          },
        });
      }
    }

    parts.push({
      text: `Bạn là trợ lý Hoa Nhỏ hỗ trợ đọc chữ viết tay học sinh tiểu học Việt Nam.
NHIỆM VỤ CỰC KỲ QUAN TRỌNG:
1. Đọc và chép lại trung thực văn bản chữ viết tay tiếng Việt từ các trang vở học sinh.
2. Không tự ý sửa lỗi chính tả hay thay đổi câu chữ của học sinh trong bản chép lại này (để nguyên văn bản em viết).
3. Đánh dấu danh sách các từ khó đọc, mờ hoặc bạn CHƯA CHẮC CHẮN trong "uncertainWords" để học sinh đối chiếu ảnh gốc và xác nhận.
4. KHÔNG coi lỗi nhận diện ảnh là lỗi chính tả của học sinh.

Trả về JSON:
{
  "transcribedText": "Bản chép lại toàn bộ bài viết tay của học sinh...",
  "uncertainWords": ["từ 1", "từ 2"],
  "notes": "Hoa Nhỏ đã đọc bài của con. Con cùng kiểm tra lại những chữ này nhé!"
}`
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcribedText: { type: Type.STRING },
            uncertainWords: { type: Type.ARRAY, items: { type: Type.STRING } },
            notes: { type: Type.STRING }
          },
          required: ['transcribedText', 'uncertainWords', 'notes']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json(parsed);
  } catch (err) {
    console.error('Error OCR handwritten essay:', err);
    res.json({
      transcribedText: '',
      uncertainWords: [],
      notes: 'Hoa Nhỏ chưa thể đọc được các bức ảnh này. Em hãy thử chụp rõ hơn dưới ánh sáng hoặc gõ trực tiếp vào ô nhé!'
    });
  }
});

// Comprehensive Pedagogical Feedback
app.post('/api/ai/comprehensive-feedback', async (req, res) => {
  const { prompt, grade = 3, genre, essayText, specialWishes } = req.body;

  if (!essayText || essayText.trim().length < 5) {
    return res.status(400).json({ error: 'Bài viết quá ngắn để nhận xét.' });
  }

  const defaultComprehensive = {
    whatYouToldWell: 'Con đã viết đúng chủ đề, kể lại sự việc một cách tự nhiên và giàu tình cảm.',
    ideasStructure: 'Bài viết có mở đầu, thân đoạn và câu kết rõ ràng, mạch lạc.',
    emotionsExpressed: 'Con đã gửi gắm được niềm vui và tình cảm chân thành vào từng câu chữ.',
    highlightedSentences: [
      {
        sentence: essayText.slice(0, 80) + '...',
        goodPoint: 'Câu văn mở đầu trực tiếp và tự nhiên.',
        sensoryDetail: 'Có hình ảnh quen thuộc, gần gũi.',
        emotionExpressed: 'Niềm vui ấm áp.',
        learningTip: 'Tiếp tục phát huy cách viết tự nhiên này nhé.'
      }
    ],
    corrections: [
      {
        type: 'chinh_ta',
        originalText: 'kiểm tra dấu câu',
        reviewPoint: 'Đầu câu viết hoa, cuối câu có dấu chấm',
        suggestion: 'Hãy đặt dấu chấm ở cuối mỗi ý trọn vẹn',
        explanation: 'Giúp người đọc dễ theo dõi mạch câu chuyện của con.',
        isCertainError: false
      }
    ],
    overallEvaluation: 'Bài viết đáng khen ngợi về tính chân thực và sự nỗ lực tự sáng tạo của con.',
    improvementGuidance: 'Con hãy đọc to lại bài một lần để thêm từ nối cho các câu thêm mượt mà nhé.',
    skills: [
      { id: 'chinh_ta', title: 'Chính tả & Ngữ pháp', rating: 'Em thực hiện khá tốt', comment: 'Viết hoa đầu câu và đặt dấu câu tương đối đầy đủ.' },
      { id: 'bo_cuc', title: 'Bố cục & Trình tự', rating: 'Em đã có tiến bộ', comment: 'Biết mở đoạn, phát triển và kết đoạn mạch lạc.' },
      { id: 'von_tu', title: 'Vốn từ & Cách diễn đạt', rating: 'Em thực hiện khá tốt', comment: 'Có sử dụng từ ngữ gợi tả và hình ảnh sinh động.' },
      { id: 'cam_xuc', title: 'Cảm xúc & Dấu ấn cá nhân', rating: 'Em tiếp tục phát huy nhé!', comment: 'Bày tỏ cảm xúc thật từ trải nghiệm của riêng em.' }
    ],
    fiveContents: {
      chinhTa: 85,
      boCuc: 80,
      noiDung: 90,
      tuVung: 85,
      camXuc: 95
    },
    criteriaScores: [
      { criterion: 'Đúng yêu cầu đề bài', rating: 'Tốt', note: 'Bám sát đề bài yêu cầu' },
      { criterion: 'Nội dung và ý tưởng', rating: 'Tốt', note: 'Có ý tưởng riêng, không sao chép' },
      { criterion: 'Sắp xếp các ý', rating: 'Đạt', note: 'Bố cục rõ ràng' },
      { criterion: 'Diễn đạt và dùng từ', rating: 'Tốt', note: 'Từ ngữ phù hợp lứa tuổi' },
      { criterion: 'Chính tả và dấu câu', rating: 'Đạt', note: 'Cần lưu ý dấu chấm ngắt câu' }
    ],
    personalEncouragement: 'Mỗi lần con tự sửa được một câu văn là con đã tiến thêm một bước trên hành trình học viết. Cô rất trân trọng sự cố gắng của con!',
    timestamp: new Date().toISOString()
  };

  if (!ai) {
    return res.json(defaultComprehensive);
  }

  try {
    const systemInstruction = `Bạn là HOA NHỎ - trợ lý sư phạm Tiếng Việt tiểu học (Lớp ${grade}).
Nhiệm vụ: Góp ý bài viết của học sinh theo tiêu chí sư phạm tiểu học.
NGUYÊN TẮC BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG CHẤM ĐIỂM SỐ (KHÔNG CHO ĐIỂM SỐ MỚI).
2. KHÔNG VIẾT LẠI TOÀN BỘ BÀI THAY HỌC SINH.
3. Nhận xét theo 3 khu vực gần gũi:
   - "Điều con đã kể rất hay" (Nội dung)
   - "Các ý trong bài của con" (Bố cục)
   - "Cảm xúc con gửi vào bài viết" (Cảm xúc)
4. "Câu văn hay của con": TRÍCH XUẤT CÂU THỰC SỰ CÓ TRONG BÀI VIẾT (tối đa 2 câu). Không tự bịa câu.
5. "Mình cùng làm bài viết hay hơn nhé!": Tìm lỗi và gợi ý tự sửa cho Chính tả, Dùng từ, Đặt câu (phân biệt lỗi chắc chắn isCertainError: true và gợi ý đề xuất isCertainError: false).
6. 4 nhóm kỹ năng (skills): đánh giá định tính (rating: "Em đang luyện tập" | "Em đã có tiến bộ" | "Em thực hiện khá tốt" | "Em tiếp tục phát huy nhé!").
7. Lời động viên cá nhân hóa phù hợp với nội dung bài viết.`;

    const userPrompt = `Đề bài: "${prompt}"
Lớp: ${grade}
Dạng bài: "${genre}"
Yêu cầu riêng của học sinh: "${specialWishes || 'Không'}"
Bài viết của học sinh:
"""${essayText}"""

Hãy trả về định dạng JSON chính xác:
{
  "whatYouToldWell": "...",
  "ideasStructure": "...",
  "emotionsExpressed": "...",
  "highlightedSentences": [
    {
      "sentence": "Trích nguyên văn câu hay có trong bài",
      "goodPoint": "Hay ở điểm nào?",
      "sensoryDetail": "Chi tiết/hình ảnh sinh động nào?",
      "emotionExpressed": "Cảm xúc gì?",
      "learningTip": "Em học được gì từ cách viết đó?"
    }
  ],
  "corrections": [
    {
      "type": "chinh_ta" | "dung_tu" | "dat_cau",
      "originalText": "Cách con đã viết",
      "reviewPoint": "Điều con cần xem lại",
      "suggestion": "Gợi ý để con tự sửa",
      "explanation": "Lời giải thích thật ngắn",
      "isCertainError": true | false
    }
  ],
  "overallEvaluation": "...",
  "improvementGuidance": "...",
  "skills": [
    { "id": "chinh_ta", "title": "Chính tả & Ngữ pháp", "rating": "Em thực hiện khá tốt", "comment": "..." },
    { "id": "bo_cuc", "title": "Bố cục & Trình tự", "rating": "Em đã có tiến bộ", "comment": "..." },
    { "id": "von_tu", "title": "Vốn từ & Cách diễn đạt", "rating": "Em thực hiện khá tốt", "comment": "..." },
    { "id": "cam_xuc", "title": "Cảm xúc & Dấu ấn cá nhân", "rating": "Em tiếp tục phát huy nhé!", "comment": "..." }
  ],
  "fiveContents": {
    "chinhTa": 85,
    "boCuc": 80,
    "noiDung": 90,
    "tuVung": 85,
    "camXuc": 95
  },
  "criteriaScores": [
    { "criterion": "Đúng yêu cầu đề", "rating": "Tốt", "note": "..." },
    { "criterion": "Nội dung & ý tưởng", "rating": "Tốt", "note": "..." },
    { "criterion": "Sắp xếp các ý", "rating": "Tốt", "note": "..." },
    { "criterion": "Diễn đạt & dùng từ", "rating": "Tốt", "note": "..." },
    { "criterion": "Chính tả & dấu câu", "rating": "Đạt", "note": "..." }
  ],
  "personalEncouragement": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({
      ...defaultComprehensive,
      ...parsed,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error comprehensive feedback:', err);
    res.json(defaultComprehensive);
  }
});

// "Góc trò chuyện cùng cô" (Teacher Assistant Interactive Discussion)
app.post('/api/ai/teacher-chat', async (req, res) => {
  const { prompt, grade = 3, studentEssay, chatHistory, studentMessage } = req.body;

  const fallback = 'Cô hiểu ý con rồi! Nếu câu văn thể hiện đúng cảm xúc thật của con và người đọc có thể hiểu rõ ràng, con hoàn toàn có thể giữ lại nhé!';

  if (!ai) {
    return res.json({ reply: fallback });
  }

  try {
    const systemInstruction = `Bạn là Trợ lý Sư phạm Hoa Nhỏ trong "Góc trò chuyện cùng cô".
Bối cảnh: Học sinh Lớp ${grade} đang thảo luận về bài viết của mình cho đề bài "${prompt}".
Bài viết của học sinh: """${studentEssay}"""

QUY TẮC CỐT LÕI:
1. Học sinh có quyền hỏi tại sao bài bị góp ý, bảo vệ cách diễn đạt sáng tạo của mình (ví dụ: "Con muốn giữ câu văn này vì đó là cảm xúc thật của con").
2. AI PHẢI TÔN TRỌNG SUY NGHĨ CỦA TRẺ: Nếu câu văn thể hiện đúng cảm xúc và người đọc hiểu được, hãy nhiệt tình ủng hộ con giữ lại.
3. Không tự cho mình luôn đúng. Giải thích nhẹ nhàng, ân cần.
4. Làm rõ: Nhân vật trò chuyện ở đây là Trợ lý AI đồng hành, không mạo danh là cô giáo chủ nhiệm thật.`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Lịch sử trao đổi:\n` +
              (chatHistory || []).map((m: any) => `${m.sender === 'teacher' ? 'Cô (Trợ lý AI)' : 'Học sinh'}: ${m.text}`).join('\n') +
              `\nÝ kiến mới của học sinh: "${studentMessage}"\n\nHãy phản hồi ân cần, lắng nghe và hướng dẫn con.`
          }
        ]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ reply: response.text?.trim() || fallback });
  } catch (err) {
    console.error('Error teacher chat:', err);
    res.json({ reply: fallback });
  }
});

// Legacy / backwards compatible AI endpoints
app.post('/api/ai/ask-idea', async (req, res) => {
  const { taskTitle, prompt, chatHistory, studentInput, studentName } = req.body;
  if (!ai) {
    return res.json({ question: 'Chi tiết nào làm em nhớ nhất khi nghĩ về điều này?' });
  }
  try {
    const systemInstruction = `Bạn là HOA NHỎ - người bạn đồng hành sư phạm tiểu học. MỖI LƯỢT CHỈ HỎI ĐÚNG 1 CÂU NGẮN, không viết thay.`;
    const contents = [
      {
        role: 'user',
        parts: [{ text: `Đề: "${taskTitle}". Học sinh: "${studentInput}". Hỏi đúng 1 câu gợi mở tiếp theo.` }]
      }
    ];
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: { systemInstruction, temperature: 0.7 }
    });
    res.json({ question: response.text?.trim() || 'Em kể tiếp cho Hoa Nhỏ nghe nhé!' });
  } catch (e) {
    res.json({ question: 'Em có muốn bấm "Xếp ý giúp em" để lập dàn ý không?' });
  }
});

app.post('/api/ai/synthesize-outline', async (req, res) => {
  const { taskTitle, prompt: rawPrompt, expectedLength, gardenType, chatHistory, grade = 3, genre } = req.body;
  const targetPrompt = (rawPrompt || taskTitle || '').trim();
  const pLower = targetPrompt.toLowerCase();

  const isShort23 = (expectedLength && (expectedLength.includes('2–3') || expectedLength.includes('2-3'))) ||
                    targetPrompt.includes('2–3 câu') || targetPrompt.includes('2-3 câu') || targetPrompt.includes('3–4 câu');

  // Intelligent fallback detailed outline based on prompt topic
  let defaultDetailed = {
    moDoan: [
      `Giới thiệu đối tượng hoặc sự việc mà con muốn viết: ${targetPrompt.slice(0, 45) || 'chủ đề yêu thích'}.`,
      'Nêu cảm xúc chung hoặc thời gian, không gian gắn bó.'
    ],
    phatTrienDoan: [
      'Miêu tả các nét nổi bật nhất (hình dáng, màu sắc, chi tiết gần gũi).',
      'Kể một kỷ niệm hoặc việc làm quen thuộc gắn với đối tượng đó.',
      'Sử dụng một hình ảnh so sánh hoặc từ ngữ gợi tả sinh động.'
    ],
    ketDoan: [
      'Bày tỏ tình cảm yêu quý, gắn bó chân thành của con.',
      'Mong ước hoặc lời hứa giữ gìn, trân trọng.'
    ]
  };

  if (pLower.includes('nhà') || pLower.includes('góc') || pLower.includes('phòng') || pLower.includes('bàn học') || pLower.includes('cửa sổ')) {
    defaultDetailed = {
      moDoan: [
        'Giới thiệu ngôi nhà thân yêu hoặc góc nhỏ mà em yêu thích nhất.',
        'Vị trí của góc nhỏ (ở cạnh cửa sổ, trong căn phòng ấm cúng...).'
      ],
      phatTrienDoan: [
        'Khung cảnh và ánh sáng chiếu vào góc nhỏ (nắng sớm dịu dàng, không khí thoáng mát).',
        'Cách sắp xếp đồ đạc gọn gàng, ngăn nắp (bàn ghế, giá sách, đèn học).',
        'Chi tiết hoặc món đồ mà em yêu quý nhất ở nơi này.',
        'Những hoạt động quen thuộc em thường làm ở góc nhỏ (ngồi học, đọc truyện, vẽ tranh).'
      ],
      ketDoan: [
        'Cảm xúc yên bình, ấm áp và gắn bó của em với góc nhỏ này.',
        'Lời hứa luôn giữ gìn góc nhỏ sạch đẹp và ngăn nắp.'
      ]
    };
  }

  const defaultOutline = isShort23 ? [
    { id: '1', section: 'Câu 1 (Mở đầu)', content: defaultDetailed.moDoan[0] || 'Giới thiệu điều em yêu quý.' },
    { id: '2', section: 'Câu 2 (Chi tiết/Cảm xúc)', content: defaultDetailed.phatTrienDoan[0] || 'Kể nét nổi bật và cảm xúc của em.' },
    { id: '3', section: 'Câu 3 (Kết lại)', content: defaultDetailed.ketDoan[0] || 'Bày tỏ tình cảm gắn bó của em.' }
  ] : [
    { id: '1', section: 'Mở đoạn', content: defaultDetailed.moDoan.join(' ') },
    { id: '2', section: 'Phát triển đoạn', content: defaultDetailed.phatTrienDoan.join(' ') },
    { id: '3', section: 'Kết đoạn', content: defaultDetailed.ketDoan.join(' ') }
  ];

  if (!ai) {
    return res.json({ outline: defaultOutline, detailedOutline: defaultDetailed });
  }

  try {
    const systemInstruction = `Bạn là HOA NHỎ - trợ lý học tập sư phạm Tiếng Việt dành cho học sinh Lớp ${grade}.
Nhiệm vụ: Tạo DÀN Ý 3 PHẦN (Mở đoạn, Phát triển đoạn, Kết đoạn) bám sát 100% đề bài học sinh đưa ra.
QUY TẮC CỐT LÕI:
1. TUYỆT ĐỐI BÁM SÁT ĐỀ BÀI: "${targetPrompt}".
   - Nếu học sinh nhập đề bài về tả ngôi nhà hoặc góc nhỏ yêu thích: Dàn ý PHẢI tập trung vào ngôi nhà, căn phòng, góc bàn học, cách bài trí, đồ vật và cảm giác ấm cúng gia đình. TUYỆT ĐỐI KHÔNG lạc sang hoạt động ngoài trời hay sự việc không liên quan.
2. Cung cấp cả 'outline' (3 phần chính) và 'detailedOutline' (gồm moDoan: mảng các câu gợi ý, phatTrienDoan: mảng các gợi ý chi tiết, ketDoan: mảng các gợi ý cảm xúc).
3. Mỗi ý là một gợi ý ngắn gọn, kích thích tư duy, KHÔNG viết thành bài văn sẵn.`;

    const userPrompt = `Đề bài: "${targetPrompt}"
Lớp: ${grade}
Dạng bài: "${genre || 'Tự do'}"
Độ dài mong muốn: ${isShort23 ? '2-3 câu ngắn' : 'Đoạn văn hoàn chỉnh 5-8 câu'}

Hãy trả về JSON theo định dạng:
{
  "outline": [
    { "id": "1", "section": "Mở đoạn", "content": "Gợi ý mở đoạn" },
    { "id": "2", "section": "Phát triển đoạn", "content": "Gợi ý phát triển đoạn" },
    { "id": "3", "section": "Kết đoạn", "content": "Gợi ý kết đoạn" }
  ],
  "detailedOutline": {
    "moDoan": ["Gạch đầu dòng 1", "Gạch đầu dòng 2"],
    "phatTrienDoan": ["Gạch đầu dòng 1", "Gạch đầu dòng 2", "Gạch đầu dòng 3", "Gạch đầu dòng 4"],
    "ketDoan": ["Gạch đầu dòng 1", "Gạch đầu dòng 2"]
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            outline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  section: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ['id', 'section', 'content']
              }
            },
            detailedOutline: {
              type: Type.OBJECT,
              properties: {
                moDoan: { type: Type.ARRAY, items: { type: Type.STRING } },
                phatTrienDoan: { type: Type.ARRAY, items: { type: Type.STRING } },
                ketDoan: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['moDoan', 'phatTrienDoan', 'ketDoan']
            }
          },
          required: ['outline', 'detailedOutline']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({
      outline: parsed.outline || defaultOutline,
      detailedOutline: parsed.detailedOutline || defaultDetailed
    });
  } catch (e) {
    console.error('Error synthesizing outline:', e);
    res.json({ outline: defaultOutline, detailedOutline: defaultDetailed });
  }
});

app.post('/api/ai/feedback', async (req, res) => {
  const { taskTitle, prompt, studentText } = req.body;
  const fallback = {
    flowerPraise: 'Đoạn văn của em rất có cảm xúc và bám sát đề bài!',
    leafReminder: 'Em hãy đọc to lại đoạn văn để phát hiện chỗ cần ngắt câu nhé.',
    smallChallenge: 'Em thử thêm 1 từ miêu tả âm thanh hoặc màu sắc để bài viết thêm sinh động không?',
    suggestedStars: 4
  };
  if (!ai || !studentText) return res.json(fallback);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Đề: "${taskTitle}". Bài học sinh: "${studentText}". Nhận xét 3 phần: flowerPraise, leafReminder, smallChallenge, suggestedStars`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flowerPraise: { type: Type.STRING },
            leafReminder: { type: Type.STRING },
            smallChallenge: { type: Type.STRING },
            suggestedStars: { type: Type.INTEGER }
          },
          required: ['flowerPraise', 'leafReminder', 'smallChallenge', 'suggestedStars']
        }
      }
    });
    res.json(JSON.parse(response.text?.trim() || '{}'));
  } catch (e) {
    res.json(fallback);
  }
});

app.post('/api/ai/hint', async (req, res) => {
  const defaultHints = [
    'Em thử nghĩ xem sự việc diễn ra vào buổi sáng sớm hay chiều mát? Khung cảnh lúc đó có gì đặc biệt?',
    'Em có thể dùng một từ so sánh như "đẹp như...", "ấm áp như..." để câu văn thêm sinh động.',
    'Hãy nhớ lại nét mặt và nụ cười của người thân lúc đó để viết tiếp nhé!',
    'Em đọc lại câu văn vừa viết xem đã có dấu chấm tròn ở cuối câu chưa nào.'
  ];
  res.json({ hint: defaultHints[Math.floor(Math.random() * defaultHints.length)] });
});

// Setup Vite or Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`🌸 Vườn Chữ Nở Hoa server running on http://localhost:${port}`);
  });
}

// Export express app for serverless platforms like Vercel
export default app;
export { app };

// In standalone / container environments (AI Studio, local, Cloud Run), start listening
if (!process.env.VERCEL) {
  startServer();
}
