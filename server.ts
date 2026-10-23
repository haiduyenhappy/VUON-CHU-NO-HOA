import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_STUDENTS } from './src/data/studentsData.js';
import type { Student, LinkedCaregiver, FamilyInviteCode, PromptAnalysisData } from './src/types/index.js';

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
  students: typeof INITIAL_STUDENTS;
  submissions: any[];
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

let memoryDb: DatabaseStructure = {
  students: INITIAL_STUDENTS,
  submissions: SEED_SUBMISSIONS
};

function loadDatabase(): DatabaseStructure {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseStructure = {
        students: INITIAL_STUDENTS,
        submissions: SEED_SUBMISSIONS
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

    // Normalize student accounts with full status and caregiver connections
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
    const validNames = ['cogaovietvan', '2026', 'leductho', 'coha', 'coduyen', 'nguyenthihaiduyen', 'haiduyen', 'cô duyên', 'cô hải duyên'];
    const lowerInput = rawInput.toLowerCase();
    const lowerPass = rawPass.toLowerCase();

    if (
      validNames.includes(lowerInput) ||
      validNames.includes(lowerPass) ||
      lowerPass === '2026' ||
      lowerInput === '2026'
    ) {
      return res.json({ success: true, role: 'teacher', teacherName: 'Cô Nguyễn Thị Hải Duyên' });
    }
    return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu cô giáo chưa chính xác. (Gợi ý mật khẩu: 2026)' });
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
    editedAiNotes: editedAiNotes || ''
  };

  sub.status = 'reviewed';

  const student = db.students.find(s => s.id === sub.studentId);
  if (student && status === 'published') {
    student.starsEarned += Number(confirmedStars) || 5;
  }

  saveDatabase(db);
  res.json({ success: true, submission: sub });
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

  const caregivers = student.linkedCaregivers || [];
  const target = caregivers.find(c => c.id === caregiverId);
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

  const caregivers = student.linkedCaregivers || [];
  const target = caregivers.find(c => c.id === caregiverId);
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

  student.linkedCaregivers = (student.linkedCaregivers || []).filter(c => c.id !== caregiverId);
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

  const inviteCodes = student.inviteCodes || [];
  const target = inviteCodes.find(i => i.code === code);
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

app.post('/api/ai/analyze-prompt-deep', async (req, res) => {
  const { prompt = '', grade = 3, specialWishes = '' } = req.body;
  const pLower = prompt.toLowerCase();

  // Intelligent domain categorization for guaranteed grounded fallback
  const isSelfIntro = pLower.includes('bản thân') || pLower.includes('chính mình') || (pLower.includes('giới thiệu') && (pLower.includes('em') || pLower.includes('mình'))) || (pLower.includes('họ tên') && pLower.includes('sở thích'));
  const isTree = pLower.includes('cây') || pLower.includes('bóng mát') || pLower.includes('cây bàng') || pLower.includes('cây phượng') || pLower.includes('sân trường');
  const isGrandparents = pLower.includes('ông') || pLower.includes('bà') || pLower.includes('ông bà') || (pLower.includes('kỷ niệm') && (pLower.includes('người thân') || pLower.includes('ông') || pLower.includes('bà')));
  const isFriend = (pLower.includes('bạn') || pLower.includes('người bạn') || pLower.includes('bạn thân')) && !isSelfIntro;
  const isHouse = pLower.includes('nhà') || pLower.includes('ngôi nhà') || pLower.includes('góc nhỏ') || pLower.includes('phòng') || pLower.includes('tổ ấm');

  let defaultSubject = 'Bài viết của em';
  let defaultUnderstand = `Đề bài muốn con bám sát chủ đề "${prompt.slice(0, 50)}..." để kể, tả và chia sẻ những cảm xúc chân thật nhất của mình.`;
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

  // 1. SPECIFIC DOMAIN: GIỚI THIỆU BẢN THÂN
  if (isSelfIntro) {
    defaultSubject = 'Giới thiệu về bản thân em';
    defaultUnderstand = 'Đề bài muốn con giới thiệu về chính mình. Con hãy cho người đọc biết tên của con, điều con thích, ước mơ của con và một điểm đặc biệt khiến con là chính con.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn giới thiệu',
      'Đối tượng: Bản thân học sinh',
      'Nội dung 1: Họ tên và tên gọi thân mật',
      'Nội dung 2: Sở thích khi rảnh rỗi',
      'Nội dung 3: Ước mơ tương lai',
      'Nội dung 4: Một điểm đặc biệt của bản thân'
    ];
    defaultQuestions = [
      'Con tên là gì? Con muốn mọi người gọi mình bằng tên nào?',
      'Con thích làm gì nhất khi có thời gian rảnh và vì sao con thích hoạt động ấy?',
      'Sau này con ước mơ trở thành ai hoặc làm được điều gì?',
      'Con có tài năng, thói quen hoặc đặc điểm nào khiến mình khác biệt và đáng yêu?',
      'Con muốn gửi lời chào hoặc mong ước gì đến thầy cô, bạn bè khi đọc bài này?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '🙋 Em là ai?', icon: '🙋', color: 'emerald', points: ['Họ và tên của em, tên thân mật ở nhà', 'Em bao nhiêu tuổi và học lớp mấy', 'Ấn tượng đầu tiên về tính cách của em'] },
      { id: 'br-2', title: '🎨 Sở thích của em', icon: '🎨', color: 'purple', points: ['Hoạt động em say mê làm khi rảnh (đọc sách, vẽ tranh, đá bóng)', 'Lý do em yêu thích hoạt động ấy', 'Cảm giác hào hứng mỗi khi được làm việc mình thích'] },
      { id: 'br-3', title: '✨ Ước mơ của em', icon: '✨', color: 'amber', points: ['Nghề nghiệp hoặc mong ước mai sau của em', 'Vì sao em ấp ủ ước mơ tươi đẹp ấy', 'Việc em đang cố gắng rèn luyện mỗi ngày'] },
      { id: 'br-4', title: '⭐ Điểm đặc biệt của em', icon: '⭐', color: 'sky', points: ['Một nét tính cách nổi bật (vui vẻ, hòa đồng, hay cười)', 'Một biệt tài nhỏ hoặc thói quen đáng yêu', 'Điều khiến em tự hào về bản thân'] },
      { id: 'br-5', title: '💖 Điều em muốn chia sẻ thêm', icon: '💖', color: 'rose', points: ['Mong muốn có thêm nhiều bạn mới', 'Cùng nhau học tập chăm chỉ, tiến bộ', 'Nụ cười và lời chào thân thương'] }
    ];
    defaultDetailedOutline = {
      moDoan: ['Giới thiệu họ tên và một nét chung nhất về bản thân con.'],
      phatTrienDoan: [
        'Nói về sở thích của con và giải thích vì sao con yêu thích điều đó.',
        'Chia sẻ ước mơ tươi đẹp mà con đang ấp ủ cho tương lai.',
        'Giới thiệu một điểm đặc biệt (tính cách, thói quen hoặc nụ cười) của bản thân.'
      ],
      ketDoan: ['Nêu cảm nghĩ hoặc điều con mong muốn mọi người hiểu và nhớ về mình.']
    };
    defaultVocab = {
      goodWords: [
        { word: 'vui vẻ', meaningAndUsage: 'Luôn tươi cười, mang niềm vui đến mọi người' },
        { word: 'hòa đồng', meaningAndUsage: 'Dễ gần, thân thiện và chan hòa với bạn bè' },
        { word: 'chăm chỉ', meaningAndUsage: 'Cần cù, siêng năng trong học tập và việc nhà' },
        { word: 'tò mò', meaningAndUsage: 'Thích tìm hiểu, khám phá những điều mới lạ' },
        { word: 'say mê', meaningAndUsage: 'Hết lòng yêu thích và tập trung vào việc mình làm' },
        { word: 'ước mơ', meaningAndUsage: 'Khát khao tốt đẹp hướng tới tương lai' },
        { word: 'cố gắng', meaningAndUsage: 'Nỗ lực không ngừng để tiến bộ hơn mỗi ngày' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Nụ cười rạng rỡ như ánh nắng ban mai sưởi ấm mọi người', explanation: 'Gợi nét tươi vui, đáng yêu của tuổi thơ' },
        { type: 'Nhân hóa', example: 'Mỗi trang sách như người bạn thì thầm kể cho em bao điều kỳ diệu', explanation: 'Biến sở thích đọc sách thành hình ảnh sống động' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn giới thiệu bản thân', sentence: 'Xin chào thầy cô và các bạn, em tên là ... - một bạn nhỏ luôn tràn đầy năng lượng và nụ cười rạng rỡ.', whyItIsGood: 'Mở đầu tự nhiên, thân thiện và tạo thiện cảm ngay.' },
        { type: 'mieu_ta', label: 'Gợi ý kể sở thích và ước mơ', sentence: 'Mỗi khi rảnh rỗi, em say mê lật mở từng trang sách khoa học và ấp ủ ước mơ sau này trở thành một bác sĩ giỏi chữa bệnh cho mọi người.', whyItIsGood: 'Kết hợp sở thích và ước mơ một cách mạch lạc, chân thật.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Em rất mong sẽ được làm quen và gắn bó thật nhiều kỷ niệm đẹp cùng các bạn dưới mái trường thân yêu này.', whyItIsGood: 'Bộc lộ mong ước gắn bó, ấm áp và chân thành.' }
      ],
      creativeIdeas: ['Kể về biệt danh đáng yêu mà người thân hay gọi con ở nhà', 'Kể về một điều con đã kiên trì làm và cảm thấy rất tự hào']
    };
  } else if (isTree) {
    // 2. SPECIFIC DOMAIN: TẢ CÂY BÓNG MÁT
    defaultSubject = 'Cây bóng mát ở sân trường';
    defaultUnderstand = 'Đề bài muốn con miêu tả một cây bóng mát quen thuộc ở sân trường – người bạn thầm lặng che mát cho chúng con trong những giờ ra chơi rộn rã tiếng cười.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn miêu tả cây cối / cảnh vật',
      'Đối tượng: Cây bóng mát ở sân trường (cây bàng, cây phượng...)',
      'Nội dung 1: Tên cây và vị trí sừng sững trên sân trường',
      'Nội dung 2: Gốc, thân xù xì và tán lá xum xuê che rợp',
      'Nội dung 3: Bóng râm mát rượi và hoạt động giờ ra chơi dưới gốc cây',
      'Nội dung 4: Tình cảm gắn bó và ý thức chăm sóc cây'
    ];
    defaultQuestions = [
      'Đó là cây bóng mát gì (cây bàng, cây phượng, cây xà cừ...) và đứng ở góc nào của sân trường?',
      'Thân cây, gốc rễ và tán lá có đặc điểm gì nổi bật khiến con nhớ nhất?',
      'Bóng râm của cây che mát cho các bạn học sinh vui chơi trong giờ ra chơi như thế nào?',
      'Kỷ niệm hoặc trò chơi nào dưới gốc cây làm con thấy vui nhất?',
      'Con có cảm xúc gì và muốn làm gì để cây luôn xanh tươi, tỏa bóng mát?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '🌳 Cây gì & Đứng ở đâu?', icon: '🌳', color: 'emerald', points: ['Tên loài cây bóng mát thân thuộc', 'Vị trí sừng sững giữa sân trường', 'Ấn tượng ban đầu về dáng cây to lớn'] },
      { id: 'br-2', title: '🪵 Gốc, thân & Cành lá', icon: '🪵', color: 'purple', points: ['Gốc cây to tròn, rễ nổi gồ ghề như con trăn', 'Thân cây khoác chiếc áo nâu xù xì bạc phếch', 'Cành lá vươn rộng như những cánh tay khổng lồ'] },
      { id: 'br-3', title: '🍃 Tán lá & Bóng râm', icon: '🍃', color: 'amber', points: ['Tán lá xanh um tùm đan cài vào nhau', 'Tạo thành chiếc ô khổng lồ che mát cả một góc sân', 'Tia nắng tinh nghịch nhảy nhót qua kẽ lá'] },
      { id: 'br-4', title: '🏃 Giờ ra chơi dưới gốc cây', icon: '🏃', color: 'sky', points: ['Các bạn tụ tập đọc sách, chơi nhảy dây, bắn bi', 'Gió mát rượi xua đi cái nóng nực', 'Tiếng cười nói rộn rã hòa cùng tiếng lá reo'] },
      { id: 'br-5', title: '💖 Tình cảm & Chăm sóc cây', icon: '💖', color: 'rose', points: ['Coi cây như người bạn lớn che chở cho tuổi thơ', 'Không bẻ cành hái lá, cùng tưới nước cho cây', 'Cây chứng kiến từng ngày em lớn khôn'] }
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
        { word: 'rì rào', meaningAndUsage: 'Âm thanh lá cây khẽ lay động trong gió thoảng' },
        { word: 'xanh mướt', meaningAndUsage: 'Màu xanh non tơ, mịn màng và tươi tắn' },
        { word: 'che chở', meaningAndUsage: 'Bảo vệ, đem lại cảm giác an tâm và dịu mát' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Tán cây xòe rộng như một chiếc ô xanh khổng lồ che mát cho chúng em', explanation: 'Gợi hình ảnh tán lá to lớn, che chở' },
        { type: 'Nhân hóa', example: 'Cây đứng sừng sững, mỉm cười lắng nghe từng tiếng cười nói rộn rã của tuổi học trò', explanation: 'Làm cây xanh trở nên gần gũi như một người bạn lớn' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn tả cây', sentence: 'Sừng sững giữa sân trường thân yêu của em là cây bàng cổ thụ tỏa bóng xanh mát rượi.', whyItIsGood: 'Nêu ngay tên cây và dáng vẻ vững chãi.' },
        { type: 'mieu_ta', label: 'Gợi ý miêu tả bóng mát', sentence: 'Vào mỗi giờ ra chơi, từng đợt gió nhẹ khẽ lướt qua làm tán lá reo rì rào, xua tan bao mệt mỏi cho chúng em.', whyItIsGood: 'Kết hợp âm thanh, bóng mát và cảm xúc học trò.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Cây không chỉ cho em bóng mát mà còn là nhân chứng lưu giữ bao kỷ niệm ngọt ngào của tuổi thơ.', whyItIsGood: 'Nâng tầm ý nghĩa của cây bóng mát.' }
      ],
      creativeIdeas: ['Nhặt một chiếc lá rụng ép vào trang vở làm kỷ niệm', 'Quan sát tia nắng chiếu qua kẽ lá rọi xuống mặt đất như những đồng xu bạc lấp lánh']
    };
  } else if (isGrandparents) {
    // 3. SPECIFIC DOMAIN: KỶ NIỆM VỚI ÔNG BÀ
    defaultSubject = 'Kỷ niệm đáng nhớ với ông bà';
    defaultUnderstand = 'Đề bài muốn con kể lại một kỷ niệm ấm áp, đáng nhớ bên người ông hoặc người bà kính yêu của mình.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn kể lại kỷ niệm',
      'Đối tượng: Ông bà kính yêu',
      'Nội dung 1: Giới thiệu người ông/người bà và kỷ niệm',
      'Nội dung 2: Thời gian, hoàn cảnh diễn ra sự việc',
      'Nội dung 3: Lời nói, cử chỉ ân cần, ánh mắt hiền hậu của ông bà',
      'Nội dung 4: Cảm xúc yêu thương và lòng biết ơn của con'
    ];
    defaultQuestions = [
      'Kỷ niệm đáng nhớ đó diễn ra vào lúc nào và ở đâu cùng ông hay bà?',
      'Điều gì đã xảy ra khiến con nhớ mãi không quên?',
      'Ánh mắt, nụ cười hoặc cử chỉ chăm sóc nào của ông/bà làm con thấy ấm lòng nhất?',
      'Con đã nói hoặc làm điều gì để thể hiện tình cảm với ông/bà?',
      'Kỷ niệm ấy dạy con bài học gì về tình cảm gia đình?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '👵 Giới thiệu ông/bà & Kỷ niệm', icon: '👵', color: 'emerald', points: ['Người em yêu quý nhất là ông hay bà', 'Kỷ niệm khó quên diễn ra vào dịp nào', 'Cảm xúc bồi hồi mỗi khi nhớ lại'] },
      { id: 'br-2', title: '🏡 Hoàn cảnh & Không gian', icon: '🏡', color: 'purple', points: ['Không gian yên bình bên hiên nhà hay góc vườn', 'Khoảnh khắc giản dị mà đầm ấm', 'Thời tiết và khung cảnh hôm ấy'] },
      { id: 'br-3', title: '📖 Diễn biến câu chuyện', icon: '📖', color: 'amber', points: ['Ông/bà dạy em làm một việc ý nghĩa hoặc kể chuyện cổ tích', 'Lời căn dặn ân cần, giọng nói trầm ấm', 'Em chăm chú lắng nghe và làm theo'] },
      { id: 'br-4', title: '💖 Cử chỉ & Nụ cười ân cần', icon: '💖', color: 'sky', points: ['Bàn tay nhăn nheo nhưng ấm áp xoa đầu em', 'Ánh mắt hiền từ bao dung che chở', 'Tình yêu thương vô bờ bến dành cho cháu'] },
      { id: 'br-5', title: '🌟 Cảm xúc & Lời hứa của con', icon: '🌟', color: 'rose', points: ['Lòng biết ơn và kính yêu sâu sắc', 'Mong ông bà luôn mạnh khỏe, sống lâu', 'Lời hứa ngoan ngoãn, chăm ngoan'] }
    ];
    defaultDetailedOutline = {
      moDoan: ['Giới thiệu người ông/bà kính yêu và kỷ niệm đẹp đẽ nhất trong lòng em.'],
      phatTrienDoan: [
        'Kể lại thời điểm và diễn biến câu chuyện đáng nhớ cùng ông/bà.',
        'Miêu tả cử chỉ ân cần, bàn tay ấm áp và ánh mắt hiền hậu của người thân.',
        'Bày tỏ cảm xúc xúc động khi được ở bên cạnh ông/bà.'
      ],
      ketDoan: ['Khẳng định tình yêu thương vô bờ và mong ước ông bà luôn khỏe mạnh.']
    };
    defaultVocab = {
      goodWords: [
        { word: 'hiền hậu', meaningAndUsage: 'Dịu dàng, nhân từ và bao dung' },
        { word: 'ân cần', meaningAndUsage: 'Chăm sóc chu đáo, nhẹ nhàng và chu toàn' },
        { word: 'ấm áp', meaningAndUsage: 'Chan chứa tình yêu thương che chở' },
        { word: 'kính yêu', meaningAndUsage: 'Tôn kính và yêu mến tha thiết' },
        { word: 'nhăn nheo', meaningAndUsage: 'Dấu ấn thời gian in hằn trên bàn tay vất vả' },
        { word: 'khắc sâu', meaningAndUsage: 'In đậm trong tâm trí, không bao giờ phai mờ' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Bàn tay bà ấm áp như ngọn lửa sưởi ấm tâm hồn em', explanation: 'Gợi sự che chở yêu thương vô bờ' },
        { type: 'Nhân hóa', example: 'Từng lời dặn dò của ông như hạt mầm gieo vào lòng em bao điều thiện lương', explanation: 'Làm lời khuyên của người lớn thêm sâu sắc' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn kể kỷ niệm', sentence: 'Trong ký ức êm đềm của tuổi thơ, kỷ niệm những buổi chiều ngồi nghe bà kể chuyện cổ tích luôn là điều em nâng niu nhất.', whyItIsGood: 'Gợi mở cảm xúc lắng đọng, thân thương.' },
        { type: 'mieu_ta', label: 'Gợi ý tả cử chỉ ông bà', sentence: 'Bàn tay bà nhăn nheo khẽ xoa đầu em, giọng bà trầm ấm như làn gió mát lành ru êm giấc ngủ.', whyItIsGood: 'Kết hợp cử chỉ và giọng nói đầy yêu thương.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Em thầm hứa sẽ luôn chăm ngoan, học giỏi để nụ cười hiền hậu của ông bà mãi rạng rỡ trên môi.', whyItIsGood: 'Bộc lộ lòng biết ơn và lời hứa hành động.' }
      ],
      creativeIdeas: ['Miêu tả mùi hương thơm thoang thoảng của trầu cau hay mùi thảo mộc quen thuộc bên bà', 'Kể lại một lời khuyên nhỏ của ông giúp con vượt qua khó khăn']
    };
  } else if (isFriend) {
    // 4. SPECIFIC DOMAIN: TÌNH CẢM BẠN THÂN
    defaultSubject = 'Tình cảm của em đối với người bạn thân';
    defaultUnderstand = 'Đề bài muốn con bày tỏ tình cảm chân thành, sự gắn bó và trân trọng đối với người bạn thân thiết cùng học, cùng chơi dưới mái trường.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn nêu tình cảm, cảm xúc',
      'Đối tượng: Người bạn thân thiết',
      'Nội dung 1: Giới thiệu tên bạn và thời gian quen biết',
      'Nội dung 2: Những nét tính cách đáng quý của bạn',
      'Nội dung 3: Kỷ niệm cùng nhau học tập hoặc giúp đỡ nhau',
      'Nội dung 4: Lời hứa giữ gìn tình bạn đẹp đẽ'
    ];
    defaultQuestions = [
      'Người bạn thân của con tên là gì và hai bạn đã gắn bó với nhau bao lâu?',
      'Nét tính cách, nụ cười hoặc thói quen nào của bạn làm con quý mến nhất?',
      'Một kỷ niệm đẹp đẽ hoặc một lần hai bạn cùng giúp đỡ nhau là gì?',
      'Khi ở bên cạnh bạn, con cảm thấy vui vẻ và an tâm như thế nào?',
      'Con muốn gửi lời chúc hoặc lời hứa gì đến tình bạn của hai đứa?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '👫 Giới thiệu người bạn thân', icon: '👫', color: 'emerald', points: ['Tên người bạn và ấn tượng đầu tiên khi gặp', 'Hai bạn ngồi cùng bàn hay cùng xóm', 'Tình bạn nảy nở từ khi nào'] },
      { id: 'br-2', title: '😊 Nụ cười & Tính cách', icon: '😊', color: 'purple', points: ['Nụ cười tươi tắn và đôi mắt sáng ngời', 'Tính tình hiền lành, trung thực và tốt bụng', 'Luôn sẵn lòng chia sẻ với mọi người'] },
      { id: 'br-3', title: '🤝 Cùng học, cùng chơi', icon: '🤝', color: 'amber', points: ['Cùng nhau trao đổi những bài toán khó', 'Những giờ ra chơi nô đùa rộn rã tiếng cười', 'Cùng nhau chia sẻ từng mẩu bánh, cuốn truyện'] },
      { id: 'br-4', title: '💖 Kỷ niệm gắn bó khó quên', icon: '💖', color: 'sky', points: ['Một lần bạn giúp em khi em gặp khó khăn', 'Lời động viên chân thành làm em ấm lòng', 'Bài học quý giá về sự sẻ chia'] },
      { id: 'br-5', title: '🌟 Tình bạn bền chặt & Lời hứa', icon: '🌟', color: 'rose', points: ['Trân trọng tình bạn trong sáng tuổi học trò', 'Mong hai đứa mãi thân thiết bên nhau', 'Cùng nhau cố gắng chăm ngoan, tiến bộ'] }
    ];
    defaultDetailedOutline = {
      moDoan: ['Giới thiệu người bạn thân thiết nhất của em dưới mái trường.'],
      phatTrienDoan: [
        'Nêu những nét tính cách đáng mến và nụ cười ấm áp của bạn.',
        'Kể lại kỷ niệm gắn bó khi cùng học bài hoặc giúp đỡ lẫn nhau.',
        'Cảm xúc vui vẻ và sự tin tưởng khi có bạn đồng hành.'
      ],
      ketDoan: ['Khẳng định tình bạn bền chặt và mong muốn cùng nhau tiến bộ mãi mãi.']
    };
    defaultVocab = {
      goodWords: [
        { word: 'chân thành', meaningAndUsage: 'Thật lòng, không dối trá' },
        { word: 'chan hòa', meaningAndUsage: 'Sống vui vẻ, hòa đồng và gần gũi' },
        { word: 'gắn bó', meaningAndUsage: 'Thân thiết, luôn ở bên nhau' },
        { word: 'tốt bụng', meaningAndUsage: 'Hay thương người và sẵn sàng giúp đỡ' },
        { word: 'đồng hành', meaningAndUsage: 'Cùng bước đi, cùng chia sẻ buồn vui' },
        { word: 'tin cậy', meaningAndUsage: 'Đáng tin tưởng, luôn giữ lời hứa' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Tình bạn của chúng em trong sáng như dòng suối đầu nguồn', explanation: 'Gợi sự thuần khiết, tươi đẹp của tuổi học trò' },
        { type: 'Nhân hóa', example: 'Mỗi kỷ niệm cùng bạn như một nốt nhạc vui ca vang trong lòng em', explanation: 'Tạo cảm giác rộn ràng, hạnh phúc' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn tình bạn', sentence: 'Dưới mái trường thân yêu, người bạn thân thiết và gắn bó nhất với em chính là...', whyItIsGood: 'Giới thiệu bạn thẳng thắn, ấm áp.' },
        { type: 'mieu_ta', label: 'Gợi ý kể tình cảm', sentence: 'Mỗi khi em gặp bài toán khó, bạn luôn kiên nhẫn giảng giải cho em với nụ cười dịu dàng và ánh mắt khích lệ.', whyItIsGood: 'Chi tiết cụ thể thể hiện tấm lòng bạn bè.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Em luôn thầm cảm ơn vì đã có một người bạn tuyệt vời cùng đồng hành trên con đường tuổi thơ.', whyItIsGood: 'Bộc lộ lòng biết ơn sâu sắc.' }
      ],
      creativeIdeas: ['Kể về một món quà nhỏ tự làm tặng nhau nhân ngày sinh nhật', 'Kể về lời hẹn cùng nhau thi đỗ điểm cao']
    };
  } else if (isHouse) {
    // 5. SPECIFIC DOMAIN: NGÔI NHÀ ẤM CÚNG
    defaultSubject = 'Ngôi nhà ấm cúng của gia đình em';
    defaultUnderstand = 'Đề bài muốn con miêu tả tổ ấm thân yêu của gia đình mình – nơi chan chứa tình yêu thương và lưu giữ bao khoảnh khắc sum họp ấm cúng.';
    defaultRequirements = [
      'Nhiệm vụ: Viết đoạn văn miêu tả cảnh vật / tổ ấm',
      'Đối tượng: Ngôi nhà thân yêu của gia đình',
      'Nội dung 1: Vị trí và cái nhìn bao quát ngôi nhà',
      'Nội dung 2: Các gian phòng, góc nhỏ ấm cúng bên trong',
      'Nội dung 3: Không khí sum họp gia đình mỗi buổi tối',
      'Nội dung 4: Tình cảm gắn bó và trách nhiệm giữ gìn nhà cửa'
    ];
    defaultQuestions = [
      'Ngôi nhà của con nằm ở đâu và có màu sơn hoặc nét gì quen thuộc nhất?',
      'Bước vào bên trong, góc nhỏ hoặc gian phòng nào làm con thấy ấm áp nhất?',
      'Mỗi buổi tối, tiếng cười nói và không khí sum họp gia đình diễn ra ra sao?',
      'Con thường làm việc gì để giúp bố mẹ giữ gìn ngôi nhà sạch đẹp?',
      'Con có cảm xúc gì mỗi khi được trở về ngôi nhà sau một ngày học tập?'
    ];
    defaultBranches = [
      { id: 'br-1', title: '🏡 Vị trí & Cảnh bao quát', icon: '🏡', color: 'emerald', points: ['Vị trí ngôi nhà nằm ở con phố hay ngõ nhỏ thân quen', 'Màu sơn tươi sáng, cánh cổng mở rộng chào đón', 'Cảm giác thân thương ngay khi bước đến gần'] },
      { id: 'br-2', title: '🛋️ Các gian phòng ấm cúng', icon: '🛋️', color: 'purple', points: ['Phòng khách trang nhã, nơi gia đình trò chuyện', 'Góc học tập ngăn nắp bên khung cửa sổ tràn nắng', 'Gian bếp nhỏ thơm thoang thoảng mùi cơm mẹ nấu'] },
      { id: 'br-3', title: '☀️ Ánh sáng & Không khí', icon: '☀️', color: 'amber', points: ['Ánh nắng sớm dịu dàng rọi qua rèm cửa', 'Không gian thoáng mát, sạch sẽ và tinh tươm', 'Bình yên, tĩnh lặng xua tan mọi ồn ã bên ngoài'] },
      { id: 'br-4', title: '👨‍👩‍👧 Bữa cơm sum họp gia đình', icon: '👨‍👩‍👧', color: 'sky', points: ['Cả nhà quây quần bên mâm cơm ấm cúng mỗi tối', 'Tiếng cười giòn tan của các thành viên', 'Chia sẻ những chuyện vui buồn trong ngày'] },
      { id: 'br-5', title: '💖 Tình cảm & Giữ gìn tổ ấm', icon: '💖', color: 'rose', points: ['Ngôi nhà là nơi bình yên và yêu thương nhất', 'Tự giác dọn dẹp phòng, quét nhà giúp bố mẹ', 'Dù đi đâu xa cũng luôn nhớ về tổ ấm'] }
    ];
    defaultDetailedOutline = {
      moDoan: ['Giới thiệu ngôi nhà ấm cúng – tổ ấm thân thương của gia đình em.'],
      phatTrienDoan: [
        'Bao quát vẻ ngoài và các gian phòng ngăn nắp, tinh tươm bên trong.',
        'Miêu tả góc nhỏ em yêu thích nhất và ánh sáng ấm áp chan hòa.',
        'Kể không khí sum họp, đầm ấm tiếng cười của gia đình mỗi buổi tối.'
      ],
      ketDoan: ['Khẳng định tình yêu thương tha thiết với ngôi nhà và lời hứa luôn giữ gìn sạch đẹp.']
    };
    defaultVocab = {
      goodWords: [
        { word: 'ấm cúng', meaningAndUsage: 'Gợi không gian thân thương, an yên và chan chứa tình yêu thương' },
        { word: 'ngăn nắp', meaningAndUsage: 'Mọi đồ dùng được xếp đặt gọn gàng, trật tự' },
        { word: 'sum họp', meaningAndUsage: 'Các thành viên quây quần đoàn tụ bên nhau' },
        { word: 'yên bình', meaningAndUsage: 'Tĩnh lặng, dễ chịu, không ồn ào vội vã' },
        { word: 'tinh tươm', meaningAndUsage: 'Sạch sẽ, gọn gàng và chu đáo' },
        { word: 'rộn rã', meaningAndUsage: 'Tiếng cười nói vui tươi vang vọng' }
      ],
      imageries: [
        { type: 'So sánh', example: 'Ngôi nhà như bến đỗ bình yên che chở cho em sau mỗi ngày đến trường', explanation: 'Gợi cảm giác được bảo bọc, an toàn' },
        { type: 'Nhân hóa', example: 'Mỗi gian phòng như biết mỉm cười đón từng bước chân em trở về', explanation: 'Tạo sự sống động, thân thuộc' }
      ],
      sampleSentences: [
        { type: 'mo_bai', label: 'Gợi ý mở đoạn tả ngôi nhà', sentence: 'Dù mai này có đi đâu xa, nơi em luôn hướng về với tất cả yêu thương chính là ngôi nhà ấm cúng của gia đình mình.', whyItIsGood: 'Khơi gợi tình cảm sâu sắc, tự nhiên.' },
        { type: 'mieu_ta', label: 'Gợi ý tả không khí ấm áp', sentence: 'Mỗi buổi tối, khi ánh đèn vàng ấm áp bật lên, cả nhà quây quần bên mâm cơm thơm nức, rộn rã tiếng cười nói.', whyItIsGood: 'Kết hợp ánh sáng, âm thanh và tình cảm gia đình.' },
        { type: 'ket_bai', label: 'Gợi ý câu kết', sentence: 'Em luôn tự giác lau dọn góc học tập và giữ gìn ngôi nhà sạch đẹp để tổ ấm mãi ngập tràn niềm vui.', whyItIsGood: 'Thể hiện trách nhiệm và tình yêu thương cụ thể.' }
      ],
      creativeIdeas: ['Miêu tả mùi hương ấm áp của bữa cơm chiều', 'Kể chi tiết một chậu hoa nhỏ do chính tay em chăm sóc đặt ngoài ban công']
    };
  }

  const defaultAnalysisResult: PromptAnalysisData = {
    originalPrompt: prompt,
    grade: Number(grade) || 3,
    coreSubject: defaultSubject,
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
    const systemInstruction = `Bạn là HOA NHỎ - trợ lý học tập sư phạm Tiếng Việt tiểu học (Lớp ${grade}), bám sát Chương trình GDPT 2018 (bộ sách Kết nối tri thức với cuộc sống).

QUY TẮC BẮT BUỘC TUYỆT ĐỐI (TRÁNH LẠC ĐỀ 100%):
1. NGUỒN DỮ LIỆU DUY NHẤT LÀ ĐỀ BÀI CỦA HỌC SINH: "${prompt}".
   - Bóc tách ĐÚNG nhiệm vụ, đối tượng và TỪNG nội dung cụ thể có trong đề.
   - TUYỆT ĐỐI KHÔNG BỊA RA HOẶC CHUYỂN SANG ĐỀ TÀI KHÁC!
   - Ví dụ:
     + Nếu đề là giới thiệu bản thân (họ tên, sở thích, ước mơ, điểm đặc biệt) -> TOÀN BỘ câu hỏi, 5 nhánh, dàn ý, từ ngữ PHẢI về bản thân học sinh. TUYỆT ĐỐI KHÔNG tả nhà cửa, góc học tập hay hoạt động ngoài trời!
     + Nếu đề là tả cây bóng mát -> TOÀN BỘ PHẢI về cây bóng mát ở sân trường.
     + Nếu đề là tả ngôi nhà -> TOÀN BỘ PHẢI về ngôi nhà.
     + Nếu đề là kỷ niệm với ông bà -> TOÀN BỘ PHẢI về ông bà và kỷ niệm.
     + Nếu đề là nêu tình cảm bạn thân -> TOÀN BỘ PHẢI về người bạn.
2. PHẦN "hoaNhoUnderstand": Viết một đoạn văn ngắn, ấm áp, trích xuất chính xác những yêu cầu của đề: "Đề bài muốn con...".
3. PHẦN "specificRequirements": Mảng chuỗi liệt kê rõ: Nhiệm vụ, Đối tượng, và các Nội dung chi tiết trong đề.
4. PHẦN "socraticQuestions": 4-5 câu hỏi Hoa Nhỏ khơi mở suy nghĩ, bám sát các nội dung trong đề để học sinh trả lời bằng trải nghiệm thật của mình.
5. PHẦN "branches": Đúng 5 nhánh sơ đồ tư duy màu sắc (emerald, purple, amber, sky, rose) tương ứng với từng nội dung trong đề.
6. PHẦN "outline": Dàn ý 3 phần (moDoan, phatTrienDoan, ketDoan) với các gợi ý cụ thể theo dung lượng ${grade <= 2 ? '3-4 câu' : grade === 3 ? '4-6 câu hoặc 7-9 câu' : '8-12 câu'}.
7. PHẦN "vocabularySuggestions": 6-8 từ ngữ giàu hình ảnh (goodWords), 2 hình ảnh nghệ thuật tự nhiên (imageries), 3 câu mẫu (sampleSentences: mo_bai, mieu_ta, ket_bai) bám sát đúng chủ đề đề bài.`;

    const userPrompt = `Đề bài học sinh nhập: "${prompt}"
Lớp: ${grade}
Yêu cầu bổ sung của học sinh: "${specialWishes}"

Hãy phân tích đề và trả về JSON theo đúng định dạng sau:
{
  "coreSubject": "Chủ đề cốt lõi ngắn gọn (Ví dụ: Giới thiệu về bản thân em)",
  "hoaNhoUnderstand": "Đề bài muốn con...",
  "specificRequirements": [
    "Nhiệm vụ: ...",
    "Đối tượng: ...",
    "Nội dung 1: ...",
    "Nội dung 2: ..."
  ],
  "suggestedLength": "${grade <= 2 ? '3–4 câu ngắn' : grade === 3 ? '4–6 câu hoặc 7–9 câu' : '8–12 câu'}",
  "socraticQuestions": [
    "Câu hỏi 1...",
    "Câu hỏi 2...",
    "Câu hỏi 3...",
    "Câu hỏi 4..."
  ],
  "branches": [
    { "id": "br-1", "title": "Nhánh 1", "icon": "🙋", "color": "emerald", "points": ["Ý a", "Ý b"] },
    { "id": "br-2", "title": "Nhánh 2", "icon": "🎨", "color": "purple", "points": ["Ý a", "Ý b"] },
    { "id": "br-3", "title": "Nhánh 3", "icon": "✨", "color": "amber", "points": ["Ý a", "Ý b"] },
    { "id": "br-4", "title": "Nhánh 4", "icon": "⭐", "color": "sky", "points": ["Ý a", "Ý b"] },
    { "id": "br-5", "title": "Nhánh 5", "icon": "💖", "color": "rose", "points": ["Ý a", "Ý b"] }
  ],
  "outline": {
    "moDoan": ["Gợi ý mở..."],
    "phatTrienDoan": ["Gợi ý phát triển 1...", "Gợi ý phát triển 2...", "Gợi ý phát triển 3..."],
    "ketDoan": ["Gợi ý kết..."]
  },
  "vocabularySuggestions": {
    "goodWords": [
      { "word": "Từ 1", "meaningAndUsage": "Giải thích ngắn gọn" }
    ],
    "imageries": [
      { "type": "So sánh", "example": "Ví dụ so sánh tự nhiên", "explanation": "Tác dụng" },
      { "type": "Nhân hóa", "example": "Ví dụ nhân hóa tự nhiên", "explanation": "Tác dụng" }
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({
      originalPrompt: prompt,
      grade: Number(grade) || 3,
      coreSubject: parsed.coreSubject || defaultSubject,
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
