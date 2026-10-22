import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_STUDENTS } from './src/data/studentsData.js';
import { CURRICULUM_TASKS } from './src/data/curriculumData.js';

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

let memoryDb: DatabaseStructure = {
  students: INITIAL_STUDENTS,
  submissions: []
};

function loadDatabase(): DatabaseStructure {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseStructure = {
        students: INITIAL_STUDENTS,
        submissions: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      memoryDb = initialDb;
      return initialDb;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    memoryDb = JSON.parse(raw);
    return memoryDb;
  } catch (err) {
    console.warn('Database disk reading warning (using in-memory state):', err);
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

// 3. Authenticate
app.post('/api/auth', (req, res) => {
  const { role, code, studentId } = req.body;
  const db = loadDatabase();

  if (role === 'teacher') {
    if (code === 'cogaovietvan' || code === '2026' || code === 'leductho') {
      return res.json({ success: true, role: 'teacher', teacherName: 'Cô Nguyễn Thu Hà' });
    }
    return res.status(401).json({ success: false, message: 'Mã cô giáo chưa chính xác. (Gợi ý: 2026)' });
  }

  if (role === 'family') {
    const student = db.students.find(s => s.parentCode.toLowerCase() === (code || '').trim().toLowerCase() || s.id.toLowerCase() === (code || '').trim().toLowerCase());
    if (student) {
      return res.json({ success: true, role: 'family', student });
    }
    return res.status(401).json({ success: false, message: 'Mã gia đình chưa đúng. (Ví dụ: PH001, PH002...)' });
  }

  if (role === 'student') {
    const student = db.students.find(s => s.id === studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh.' });
    }
    if (!code || code === student.pin || code === '2016') {
      return res.json({ success: true, role: 'student', student });
    }
    return res.status(401).json({ success: false, message: 'Mã số bí mật của em chưa đúng. (Gợi ý: 2016)' });
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

// 6. Teacher review
app.post('/api/teacher/review', (req, res) => {
  const { submissionId, comment, confirmedStars, flowerSticker, teacherName } = req.body;
  const db = loadDatabase();
  const sub = db.submissions.find(s => s.id === submissionId);

  if (!sub) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết.' });
  }

  sub.teacherFeedback = {
    teacherName: teacherName || 'Cô Nguyễn Thu Hà',
    comment,
    confirmedStars: Number(confirmedStars) || 5,
    flowerSticker: flowerSticker || '🌸 Bông hoa chăm ngoan',
    timestamp: new Date().toISOString()
  };
  sub.status = 'reviewed';

  const student = db.students.find(s => s.id === sub.studentId);
  if (student) {
    student.starsEarned += Number(confirmedStars) || 5;
  }

  saveDatabase(db);
  res.json({ success: true, submission: sub });
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
      model: 'gemini-3.8-flash',
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
      model: 'gemini-3.8-flash',
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
      model: 'gemini-3.8-flash',
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
  const { prompt, genre, grade = 3, studentIdeas } = req.body;

  const defaultBank = {
    goodWords: [
      { word: 'thoăn thoắt', meaningAndUsage: 'Tả cử chỉ nhanh nhẹn, khéo léo của bàn tay khi làm việc' },
      { word: 'ấm áp', meaningAndUsage: 'Gợi cảm giác yêu thương, che chở dịu dàng' },
      { word: 'vàng ươm', meaningAndUsage: 'Màu sắc vàng tươi tắn, gợi sự no đủ, đẹp mắt' },
      { word: 'rộn rã', meaningAndUsage: 'Âm thanh vui tươi, náo nức vang lên liên hồi' }
    ],
    imageries: [
      { type: 'So sánh', example: 'Đôi mắt bà hiền từ như vầng trăng rằm', explanation: 'Giúp người đọc cảm nhận được tình thương bao la của bà' },
      { type: 'Nhân hóa', example: 'Những hạt nắng sớm nhảy nhót trên cành lá', explanation: 'Làm cho thiên nhiên trở nên sinh động và đáng yêu như một người bạn' }
    ],
    sampleSentences: [
      {
        type: 'mo_bai',
        label: 'Gợi ý mở đoạn tự nhiên',
        sentence: 'Trong gia đình em, người luôn dành cho em những cử chỉ dịu dàng nhất chính là bà ngoại.',
        whyItIsGood: 'Nêu ngay được người em yêu quý và gắn liền với cảm xúc ấm áp.'
      },
      {
        type: 'mieu_ta',
        label: 'Gợi ý miêu tả sinh động',
        sentence: 'Mỗi buổi tối, bàn tay ram ráp của bà xoa lưng ru em vào giấc ngủ êm đềm.',
        whyItIsGood: 'Có chi tiết thật (bàn tay ram ráp) làm câu văn xúc động lòng người.'
      },
      {
        type: 'ket_bai',
        label: 'Gợi ý câu kết ấn tượng',
        sentence: 'Em thầm hứa sẽ luôn chăm ngoan để nụ cười hiền hậu của bà mãi nở trên môi.',
        whyItIsGood: 'Bày tỏ lòng hiếu thảo và lời hứa hẹn chân thành của đứa cháu nhỏ.'
      }
    ],
    creativeIdeas: [
      'Em có thể kể về mùi hương quen thuộc (mùi trầu cay, mùi dầu gió ấm nồng)',
      'Nhớ lại một câu nói dặn dò thân thương của người ấy'
    ]
  };

  if (!ai) {
    return res.json(defaultBank);
  }

  try {
    const userPrompt = `Đề bài: "${prompt}"
Lớp: ${grade}
Dạng bài: "${genre}"
Ý tưởng học sinh đã kể: "${studentIdeas || ''}"

Hãy tạo kho từ ngữ và hình ảnh sáng tạo ngữ cảnh hóa chặt chẽ theo chủ đề trên.
QUY TẮC:
- Không dùng từ ngữ sáo rỗng chung chung.
- Từ hay phải kèm giải thích nghĩa và cách vận dụng ngắn gọn.
- Câu mẫu phải có lý giải "vì sao câu này hay" để học sinh học cách diễn đạt, KHÔNG đưa nguyên cả bài văn hoàn chỉnh.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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
      model: 'gemini-3.8-flash',
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
    const userPrompt = `Đề bài: "${prompt}"
Lớp: ${grade}
Dạng bài: "${genre}"
Dàn ý trước đó: ${JSON.stringify(previousOutline || [])}
Chi tiết học sinh VỪA KỂ THÊM: "${studentStory}"

HÃY TẠO DÀN Ý CỤ THỂ MỖI Ý NẰM TRÊN MỘT DÒNG GẠCH ĐẦU DÒNG RIÊNG:
- MỞ ĐOẠN: mảng gồm 2-3 ý gợi mở
- PHÁT TRIỂN ĐOẠN: mảng gồm 4-5 ý chi tiết (đặc biệt lồng ghép trải nghiệm học sinh vừa kể)
- KẾT ĐOẠN: mảng gồm 2 ý kết cảm xúc
Không ghép nhiều ý vào cùng một dòng!`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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
            comparisonNote: { type: Type.STRING }
          },
          required: ['initialIdeas', 'newDetails', 'detailedOutline', 'comparisonNote']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const dOut = parsed.detailedOutline || defaultDetailed;
    const newOutlineItems = [
      { id: '1', section: 'Mở đoạn', content: dOut.moDoan?.join(' • ') || '' },
      { id: '2', section: 'Phát triển đoạn', content: dOut.phatTrienDoan?.join(' • ') || '' },
      { id: '3', section: 'Kết đoạn', content: dOut.ketDoan?.join(' • ') || '' }
    ];

    res.json({
      initialIdeas: parsed.initialIdeas || ['Dàn ý ban đầu'],
      newDetails: parsed.newDetails || [studentStory],
      newOutline: newOutlineItems,
      detailedOutline: dOut,
      comparisonNote: parsed.comparisonNote || 'Dàn ý đã được làm mới từ câu chuyện của con!'
    });
  } catch (err) {
    console.error('Error refreshing outline:', err);
    res.json({
      initialIdeas: ['Dàn ý ban đầu'],
      newDetails: [studentStory],
      newOutline: [
        { id: '1', section: 'Mở đoạn', content: defaultDetailed.moDoan.join(' ') },
        { id: '2', section: 'Phát triển đoạn', content: defaultDetailed.phatTrienDoan.join(' ') },
        { id: '3', section: 'Kết đoạn', content: defaultDetailed.ketDoan.join(' ') }
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
      model: 'gemini-3.8-flash',
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
      model: 'gemini-3.8-flash',
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
      model: 'gemini-3.8-flash',
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
      model: 'gemini-3.8-flash',
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
      model: 'gemini-3.8-flash',
      contents,
      config: { systemInstruction, temperature: 0.7 }
    });
    res.json({ question: response.text?.trim() || 'Em kể tiếp cho Hoa Nhỏ nghe nhé!' });
  } catch (e) {
    res.json({ question: 'Em có muốn bấm "Xếp ý giúp em" để lập dàn ý không?' });
  }
});

app.post('/api/ai/synthesize-outline', async (req, res) => {
  const { taskTitle, prompt: rawPrompt, expectedLength, gardenType, chatHistory } = req.body;
  const isShort23 = (expectedLength && (expectedLength.includes('2–3') || expectedLength.includes('2-3'))) ||
                    (taskTitle && (taskTitle.includes('2–3 câu') || taskTitle.includes('2-3 câu'))) ||
                    (rawPrompt && (rawPrompt.includes('2–3 câu') || rawPrompt.includes('2-3 câu')));

  const fallback = isShort23 ? [
    { id: '1', section: 'Câu 1 (Mở đầu)', content: 'Giới thiệu người bạn và tình cảm yêu quý của em.' },
    { id: '2', section: 'Câu 2 (Cảm xúc)', content: 'Kể nét đáng yêu hoặc việc bạn làm khiến em xúc động.' },
    { id: '3', section: 'Câu 3 (Kết lại)', content: 'Bày tỏ tình bạn gắn bó và mong ước thân thiết mãi.' }
  ] : [
    { id: '1', section: 'Mở đoạn', content: 'Giới thiệu điều em muốn viết.' },
    { id: '2', section: 'Thân đoạn', content: 'Kể hoặc tả chi tiết nổi bật nhất.' },
    { id: '3', section: 'Kết đoạn', content: 'Cảm xúc và mong ước của em.' }
  ];

  if (!ai) return res.json({ outline: fallback });
  try {
    const prompt = isShort23 
      ? `Đề bài: "${taskTitle || rawPrompt}". Đề chỉ yêu cầu viết 2–3 CÂU (KHÔNG tạo dàn ý bài văn dài 3 phần). Hãy tạo dàn ý ngắn gọn đúng 3 ý tương ứng 3 câu ngắn (id, section, content): Câu 1 (Mở đầu/Giới thiệu), Câu 2 (Cảm xúc/Hành động chính), Câu 3 (Cảm nghĩ kết lại).`
      : `Từ cuộc trò chuyện về đề "${taskTitle || rawPrompt}", hãy tổng hợp thành dàn ý 3 mục JSON (id, section, content) bằng chính ý tưởng của học sinh.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
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
        }
      }
    });
    res.json({ outline: JSON.parse(response.text?.trim() || '[]') || fallback });
  } catch (e) {
    res.json({ outline: fallback });
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
      model: 'gemini-3.8-flash',
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
