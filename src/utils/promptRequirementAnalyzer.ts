import { EssayGenre, DifficultyLevel } from '../types';

export interface PromptRequirementAnalysis {
  grade: number;
  detectedGenre: EssayGenre;
  targetObject: string;
  exactSentenceNotice: string;
  minSentences: number;
  maxSentences: number;
  isExactSentencePrompt: boolean;
  quickWishes: string[];
  defaultWish: string;
  difficultyLevels: {
    id: DifficultyLevel;
    label: string;
    icon: string;
    shortDesc: string;
    badgeText: string;
    criteria: string[];
  }[];
}

/**
 * Phân tích yêu cầu số câu chuẩn xác từ văn bản đề bài
 */
export function extractSentenceConstraint(prompt: string, grade: number): {
  min: number;
  max: number;
  display: string;
  isExplicit: boolean;
} {
  const p = (prompt || '').toLowerCase();

  // Kiểm tra các mẫu số câu rõ ràng trong đề bài
  if (/1\s*[-–—]\s*2\s*câu/i.test(p) || /từ\s*1\s*(đến|-|–)\s*2\s*câu/i.test(p) || /\b1\s*đến\s*2\s*câu/i.test(p)) {
    return { min: 1, max: 2, display: 'Viết đúng 1–2 câu', isExplicit: true };
  }
  if (/2\s*[-–—]\s*3\s*câu/i.test(p) || /từ\s*2\s*(đến|-|–)\s*3\s*câu/i.test(p) || /\b2\s*đến\s*3\s*câu/i.test(p)) {
    return { min: 2, max: 3, display: 'Viết đúng 2–3 câu', isExplicit: true };
  }
  if (/3\s*[-–—]\s*4\s*câu/i.test(p) || /từ\s*3\s*(đến|-|–)\s*4\s*câu/i.test(p) || /\b3\s*đến\s*4\s*câu/i.test(p)) {
    return { min: 3, max: 4, display: 'Viết đúng 3–4 câu', isExplicit: true };
  }
  if (/3\s*[-–—]\s*5\s*câu/i.test(p) || /từ\s*3\s*(đến|-|–)\s*5\s*câu/i.test(p) || /\b3\s*đến\s*5\s*câu/i.test(p)) {
    return { min: 3, max: 5, display: 'Viết đoạn ngắn 3–5 câu', isExplicit: true };
  }
  if (/4\s*[-–—]\s*5\s*câu/i.test(p) || /từ\s*4\s*(đến|-|–)\s*5\s*câu/i.test(p) || /\b4\s*đến\s*5\s*câu/i.test(p)) {
    return { min: 4, max: 5, display: 'Viết đoạn ngắn 4–5 câu', isExplicit: true };
  }
  if (/4\s*[-–—]\s*6\s*câu/i.test(p) || /từ\s*4\s*(đến|-|–)\s*6\s*câu/i.test(p) || /\b4\s*đến\s*6\s*câu/i.test(p)) {
    return { min: 4, max: 6, display: 'Viết khoảng 4–6 câu', isExplicit: true };
  }
  if (/5\s*[-–—]\s*7\s*câu/i.test(p) || /từ\s*5\s*(đến|-|–)\s*7\s*câu/i.test(p) || /\b5\s*đến\s*7\s*câu/i.test(p)) {
    return { min: 5, max: 7, display: 'Viết khoảng 5–7 câu', isExplicit: true };
  }
  if (/7\s*[-–—]\s*9\s*câu/i.test(p) || /từ\s*7\s*(đến|-|–)\s*9\s*câu/i.test(p) || /\b7\s*đến\s*9\s*câu/i.test(p)) {
    return { min: 7, max: 9, display: 'Viết khoảng 7–9 câu', isExplicit: true };
  }
  if (/8\s*[-–—]\s*10\s*câu/i.test(p) || /từ\s*8\s*(đến|-|–)\s*10\s*câu/i.test(p)) {
    return { min: 8, max: 10, display: 'Viết khoảng 8–10 câu', isExplicit: true };
  }
  if (/8\s*[-–—]\s*12\s*câu/i.test(p) || /từ\s*8\s*(đến|-|–)\s*12\s*câu/i.test(p)) {
    return { min: 8, max: 12, display: 'Viết khoảng 8–12 câu', isExplicit: true };
  }
  if (/\b1\s*câu\b/i.test(p) || /viết\s*câu\b/i.test(p)) {
    return { min: 1, max: 2, display: 'Viết câu trọn vẹn (1–2 câu)', isExplicit: true };
  }

  // Mặc định sư phạm theo từng khối lớp chuẩn GDPT 2018 (Kết nối tri thức)
  if (grade === 1) {
    return { min: 1, max: 2, display: 'Viết đúng 1–2 câu', isExplicit: false };
  }
  if (grade === 2) {
    return { min: 3, max: 5, display: 'Đoạn văn ngắn 3–5 câu', isExplicit: false };
  }
  if (grade === 3) {
    return { min: 4, max: 6, display: 'Đoạn văn 4–6 câu', isExplicit: false };
  }
  if (grade === 4) {
    return { min: 7, max: 9, display: 'Đoạn văn 7–9 câu hoặc bài văn ngắn', isExplicit: false };
  }
  return { min: 8, max: 15, display: 'Bài văn hoàn chỉnh hoặc đoạn văn 8–12 câu', isExplicit: false };
}

/**
 * Phân tích đề bài, trích xuất đối tượng, số câu, yêu cầu cốt lõi
 * Tạo bộ gợi ý Phần 3 VÀ 4 mức độ thử thách ĐỒNG BỘ TUYỆT ĐỐI với đề bài
 */
export function analyzePromptRequirements(
  prompt: string,
  gradeInput: number = 1,
  manualGenre?: EssayGenre
): PromptRequirementAnalysis {
  const p = (prompt || '').trim();
  const pLower = p.toLowerCase();
  const grade = gradeInput >= 1 && gradeInput <= 5 ? gradeInput : 1;

  // 1. Phân tích số câu
  const sentenceConstraint = extractSentenceConstraint(p, grade);
  const isOneOrTwoSentences = sentenceConstraint.max <= 2;
  const isShortThreeFive = sentenceConstraint.max <= 5 && sentenceConstraint.max > 2;

  // 2. Nhận diện thể loại
  let detectedGenre: EssayGenre = manualGenre || 'khac';
  if (pLower.includes('viết thư') || pLower.includes('bức thư')) detectedGenre = 'viet_thu';
  else if (pLower.includes('lời nhắn') || pLower.includes('tin nhắn')) detectedGenre = 'loi_nhan';
  else if (pLower.includes('nêu ý kiến') || pLower.includes('suy nghĩ của em')) detectedGenre = 'neu_y_kien';
  else if (pLower.includes('tình cảm') || pLower.includes('cảm xúc') || pLower.includes('yêu quý') || pLower.includes('kính trọng')) detectedGenre = 'tinh_cam_cam_xuc';
  else if (pLower.includes('miêu tả') || pLower.includes('tả con') || pLower.includes('tả cây') || pLower.includes('tả đồ') || pLower.includes('tả cảnh') || pLower.includes('tả người')) detectedGenre = 'mieu_ta';
  else if (pLower.includes('kể lại') || pLower.includes('kể chuyện') || pLower.includes('kỷ niệm')) detectedGenre = 'ke_chuyen';
  else if (pLower.includes('thuật lại') || pLower.includes('chào cờ') || pLower.includes('buổi sinh hoạt')) detectedGenre = 'thuat_lai';
  else if (pLower.includes('thông báo')) detectedGenre = 'thong_bao';
  else if (pLower.includes('hướng dẫn')) detectedGenre = 'huong_dan';
  else if (isOneOrTwoSentences || grade === 1) detectedGenre = 'viet_cau';
  else detectedGenre = 'viet_doan_van';

  // 3. Nhận diện đối tượng và chủ đề
  let targetObject = 'đề bài';
  const isSelfIntro = pLower.includes('giới thiệu') && (pLower.includes('bản thân') || pLower.includes('họ tên') || pLower.includes('sở thích') || pLower.includes('ước mơ'));
  const isFamily = pLower.includes('bố') || pLower.includes('mẹ') || pLower.includes('ông') || pLower.includes('bà') || pLower.includes('người thân') || pLower.includes('gia đình');
  const isFriend = pLower.includes('bạn thân') || pLower.includes('bạn cùng lớp') || pLower.includes('người bạn') || pLower.includes('tình bạn');
  const isTeacher = pLower.includes('thầy giáo') || pLower.includes('cô giáo') || pLower.includes('thầy cô');
  const isCatOrPet = pLower.includes('mèo') || pLower.includes('chó') || pLower.includes('cún') || pLower.includes('con vật') || pLower.includes('vật nuôi');
  const isSchoolSupply = pLower.includes('hộp bút') || pLower.includes('bút chì') || pLower.includes('cặp sách') || pLower.includes('thước kẻ') || pLower.includes('đồ dùng') || pLower.includes('đồ vật');
  const isSchoolScene = pLower.includes('ngôi trường') || pLower.includes('sân trường') || pLower.includes('góc sân') || pLower.includes('lớp học');
  const isTree = pLower.includes('cây bàng') || pLower.includes('phượng vĩ') || pLower.includes('cây đa') || pLower.includes('cây bóng mát') || pLower.includes('cây ăn quả');
  const isGoodDeed = pLower.includes('việc tốt') || pLower.includes('giúp đỡ') || pLower.includes('nhặt được');

  if (isSelfIntro) targetObject = 'bản thân em';
  else if (isFamily) targetObject = 'người thân trong gia đình';
  else if (isFriend) targetObject = 'người bạn của em';
  else if (isTeacher) targetObject = 'thầy cô giáo kính yêu';
  else if (isCatOrPet) targetObject = 'con vật cưng';
  else if (isSchoolSupply) targetObject = 'đồ dùng học tập';
  else if (isSchoolScene) targetObject = 'mái trường thân yêu';
  else if (isTree) targetObject = 'cây bóng mát';
  else if (isGoodDeed) targetObject = 'việc tốt em đã làm';

  // 4. Xây dựng danh sách gợi ý Phần 3 phụ thuộc 100% vào Phần 1
  const quickWishes: string[] = [];

  // 4.1. Điều kiện tiên quyết: SỐ CÂU PHẢI TUÂN THỦ ĐÚNG ĐỀ BÀI
  quickWishes.push(sentenceConstraint.display);

  // 4.2. Gợi ý theo đề cụ thể:
  if (isSelfIntro) {
    quickWishes.push('Giới thiệu rõ về bản thân');
    if (pLower.includes('sở thích')) {
      quickWishes.push('Nói về một sở thích của em');
    }
    if (pLower.includes('ước mơ')) {
      quickWishes.push('Nêu ước mơ đáng yêu của em');
    }
    quickWishes.push('Dùng từ ngữ tự nhiên, dễ thương');
    quickWishes.push('Viết câu rõ ý, đúng chính tả');
    if (!isOneOrTwoSentences && grade >= 2) {
      quickWishes.push('Các câu liên kết mượt mà');
    }
  } else if (isOneOrTwoSentences || grade === 1) {
    // ĐỀ BÀI LỚP 1 HOẶC ĐỀ YÊU CẦU 1-2 CÂU
    if (isFamily) {
      quickWishes.push('Bày tỏ tình cảm yêu thương chân thành');
      quickWishes.push('Dùng từ xưng hô lễ phép, ấm áp');
    } else if (isCatOrPet) {
      quickWishes.push('Tả nét đáng yêu của chú mèo/con vật');
      quickWishes.push('Nêu màu lông hoặc hành động ngộ nghĩnh');
    } else if (isSchoolSupply) {
      quickWishes.push('Tả một đặc điểm hoặc công dụng nổi bật');
      quickWishes.push('Từ ngữ sinh động, gần gũi');
    } else {
      quickWishes.push('Câu văn diễn đạt đủ ý, trọn vẹn');
      quickWishes.push('Từ ngữ trong sáng, gần gũi');
    }
    quickWishes.push('Đầu câu viết hoa, cuối câu có dấu chấm');
    quickWishes.push('Viết câu rõ ý, đúng chính tả');
  } else if (isShortThreeFive || grade === 2) {
    // ĐỀ BÀI LỚP 2 HOẶC ĐOẠN 3-5 CÂU
    if (detectedGenre === 'loi_nhan') {
      quickWishes.push('Lời nhắn ngắn gọn, lễ phép');
      quickWishes.push('Ghi rõ người nhận và nội dung dặn dò');
      quickWishes.push('Ký tên người nhắn ở cuối');
    } else if (isFamily) {
      quickWishes.push('Kể một kỷ niệm hoặc việc làm cùng người thân');
      quickWishes.push('Bày tỏ lòng biết ơn và yêu quý');
      quickWishes.push('Từ ngữ ấm áp, chân thành');
    } else if (isSchoolSupply) {
      quickWishes.push('Tả hình dáng và màu sắc nổi bật');
      quickWishes.push('Nêu ích lợi và cách em giữ gìn cẩn thận');
    } else {
      quickWishes.push('Đầu câu viết hoa, cuối câu có dấu chấm');
      quickWishes.push('Câu văn diễn đạt tự nhiên, rõ ý');
      quickWishes.push('Từ ngữ trong sáng, giàu cảm xúc');
    }
    quickWishes.push('Các câu liên kết mạch lạc');
  } else if (grade === 3) {
    // ĐỀ BÀI LỚP 3
    if (detectedGenre === 'viet_thu') {
      quickWishes.push('Đủ các phần chuẩn mực của bức thư');
      quickWishes.push('Lời xưng hô thân mật, lễ phép');
      quickWishes.push('Thăm hỏi sức khỏe và kể chuyện học tập');
      quickWishes.push('Lời chúc ấm áp và lời hứa chăm ngoan');
    } else if (detectedGenre === 'neu_y_kien') {
      quickWishes.push('Nêu rõ ý kiến đồng tình / ủng hộ');
      quickWishes.push('Lý lẽ chân thực, thuyết phục');
      quickWishes.push('Có ví dụ minh họa gần gũi');
    } else {
      quickWishes.push('Có mở đoạn và kết đoạn rõ ràng');
      quickWishes.push('Dùng từ ngữ gợi tả sinh động');
      quickWishes.push('Có câu văn so sánh giản dị');
      quickWishes.push('Bộc lộ cảm xúc thật của em');
    }
  } else {
    // ĐỀ BÀI LỚP 4 & LỚP 5
    if (detectedGenre === 'viet_thu') {
      quickWishes.push('Đủ 5 phần chuẩn mực của bức thư');
      quickWishes.push('Thăm hỏi tình cảm, kể chuyện trường lớp');
      quickWishes.push('Cảm xúc gắn bó, thiết tha');
      quickWishes.push('Lời chúc tốt đẹp và lời hứa phấn đấu');
    } else if (detectedGenre === 'neu_y_kien') {
      quickWishes.push('Khẳng định rõ ràng quan điểm cá nhân');
      quickWishes.push('Lập luận chặt chẽ với lý lẽ xác đáng');
      quickWishes.push('Dẫn chứng sinh động từ đời sống thực tế');
      quickWishes.push('Thông điệp ý nghĩa gửi tới mọi người');
    } else {
      const isEssay = pLower.includes('bài văn') || (!pLower.includes('đoạn văn') && grade === 5);
      if (isEssay) {
        quickWishes.push('Bố cục 3 phần rõ ràng: Mở bài – Thân bài – Kết bài');
        quickWishes.push('Có mở bài gián tiếp cuốn hút');
        quickWishes.push('Có kết bài mở rộng sâu sắc');
      } else {
        quickWishes.push('Đoạn văn có câu mở đoạn và kết đoạn ấn tượng');
      }
      quickWishes.push('Vận dụng hình ảnh so sánh và nhân hóa');
      quickWishes.push('Sử dụng từ láy và từ ngữ gợi cảm');
      quickWishes.push('Chi tiết chân thật từ trải nghiệm riêng của em');
    }
  }

  // 5. Xác định defaultWish phù hợp
  let defaultWish = '';
  if (isSelfIntro) {
    defaultWish = `${sentenceConstraint.display}, giới thiệu rõ họ tên và sở thích, chữ viết sạch đẹp, đúng chính tả.`;
  } else if (isOneOrTwoSentences || grade === 1) {
    defaultWish = `${sentenceConstraint.display}, câu văn rõ ý, từ ngữ tự nhiên, đầu câu viết hoa, cuối câu có dấu chấm.`;
  } else if (isShortThreeFive || grade === 2) {
    defaultWish = `${sentenceConstraint.display}, diễn đạt liền mạch, từ ngữ trong sáng, bộc lộ tình cảm chân thật.`;
  } else if (grade === 3) {
    defaultWish = `${sentenceConstraint.display}, có mở đoạn và kết đoạn, từ ngữ gợi cảm, đúng chính tả.`;
  } else {
    defaultWish = `Bố cục chuẩn mực, diễn đạt mạch lạc, có hình ảnh gợi cảm và cảm xúc chân thành.`;
  }

  // 6. TÙY CHỈNH 4 MỨC ĐỘ THỬ THÁCH THEO ĐÚNG ĐỀ VÀ KHỐI LỚP (KHÔNG TỰ TĂNG SỐ CÂU)
  let difficultyLevels: PromptRequirementAnalysis['difficultyLevels'] = [];

  if (isOneOrTwoSentences || grade === 1) {
    // Khối lớp 1 hoặc đề 1–2 câu
    difficultyLevels = [
      {
        id: 'co_ban',
        label: 'Cơ bản',
        icon: '🌱',
        shortDesc: 'Đủ ý, đúng số câu',
        badgeText: `🌱 Cơ bản: Viết đủ ý, đúng ${sentenceConstraint.display.toLowerCase()}`,
        criteria: [
          `Viết đúng ${sentenceConstraint.display.toLowerCase()}, không viết thiếu hoặc thừa`,
          'Chữ cái đầu câu viết hoa, cuối câu có dấu chấm',
          'Nêu đúng thông tin đề bài yêu cầu'
        ]
      },
      {
        id: 'mo_rong',
        label: 'Mở rộng',
        icon: '🌿',
        shortDesc: 'Từ ngữ gần gũi',
        badgeText: '🌿 Mở rộng: Chọn từ ngữ rõ ràng, gần gũi, đúng chính tả',
        criteria: [
          `Giữ đúng số lượng ${sentenceConstraint.display.toLowerCase()}`,
          'Chọn từ ngữ tự nhiên, đúng từ chỉ đặc điểm hoặc cảm xúc',
          'Viết đúng chính tả các tiếng có dấu thanh và phụ âm đầu'
        ]
      },
      {
        id: 'nang_cao',
        label: 'Nâng cao',
        icon: '⭐',
        shortDesc: 'Diễn đạt tự nhiên',
        badgeText: '⭐ Nâng cao: Diễn đạt tự nhiên, tránh lặp từ',
        criteria: [
          `Tuân thủ chính xác ${sentenceConstraint.display.toLowerCase()}`,
          'Câu văn trôi chảy, không lặp lại từ ngữ',
          'Thể hiện nét dễ thương, sinh động của học sinh lớp 1'
        ]
      },
      {
        id: 'sang_tao',
        label: 'Sáng tạo',
        icon: '✨',
        shortDesc: 'Nét riêng đáng yêu',
        badgeText: '✨ Sáng tạo: Thêm nét riêng nhưng không vượt quá số câu',
        criteria: [
          `Tuyệt đối không vượt quá ${sentenceConstraint.display.toLowerCase()}`,
          'Gợi mở một chi tiết ngộ nghĩnh hoặc cảm xúc yêu thương chân thật',
          'Lời văn ấm áp, tạo ấn tượng tốt cho người đọc'
        ]
      }
    ];
  } else if (isShortThreeFive || grade === 2) {
    // Khối lớp 2 hoặc đoạn ngắn 3–5 câu
    difficultyLevels = [
      {
        id: 'co_ban',
        label: 'Cơ bản',
        icon: '🌱',
        shortDesc: 'Chuẩn 3–5 câu',
        badgeText: `🌱 Cơ bản: Đúng kết cấu ${sentenceConstraint.display.toLowerCase()}`,
        criteria: [
          `Viết đúng ${sentenceConstraint.display.toLowerCase()}`,
          'Đầu câu viết hoa, cuối mỗi câu có dấu chấm',
          'Đủ các ý trả lời câu hỏi gợi ý'
        ]
      },
      {
        id: 'mo_rong',
        label: 'Mở rộng',
        icon: '🌿',
        shortDesc: 'Thêm quan sát',
        badgeText: '🌿 Mở rộng: Quan sát cụ thể, dùng từ chỉ màu sắc, hoạt động',
        criteria: [
          `Giữ đúng độ dài ${sentenceConstraint.display.toLowerCase()}`,
          'Thêm từ ngữ gợi tả màu sắc, hình dáng hoặc hành động cụ thể',
          'Bộc lộ cảm xúc yêu quý rõ nét'
        ]
      },
      {
        id: 'nang_cao',
        label: 'Nâng cao',
        icon: '⭐',
        shortDesc: 'Liên kết mượt mà',
        badgeText: '⭐ Nâng cao: Các câu liên kết tự nhiên, không rời rạc',
        criteria: [
          `Đúng dung lượng ${sentenceConstraint.display.toLowerCase()}`,
          'Sử dụng từ nối thích hợp để các câu văn liền mạch',
          'Tránh lặp từ xưng hô quá nhiều lần'
        ]
      },
      {
        id: 'sang_tao',
        label: 'Sáng tạo',
        icon: '✨',
        shortDesc: 'Ý tưởng ngộ nghĩnh',
        badgeText: '✨ Sáng tạo: Chi tiết mới mẻ nhưng không kéo dài đoạn văn',
        criteria: [
          `Không vượt quá số câu quy định (${sentenceConstraint.display.toLowerCase()})`,
          'Có một liên tưởng ngộ nghĩnh hoặc kỷ niệm ấm áp',
          'Lời văn hồn nhiên, trong sáng'
        ]
      }
    ];
  } else if (grade === 3) {
    // Khối lớp 3
    difficultyLevels = [
      {
        id: 'co_ban',
        label: 'Cơ bản',
        icon: '🌱',
        shortDesc: 'Chuẩn đoạn văn',
        badgeText: '🌱 Cơ bản: Đủ mở đoạn, phát triển và kết đoạn',
        criteria: [
          `Dung lượng khoảng ${sentenceConstraint.display.toLowerCase()}`,
          'Đoạn văn trọn vẹn, trả lời đầy đủ yêu cầu đề',
          'Chính tả và dấu câu chuẩn mực'
        ]
      },
      {
        id: 'mo_rong',
        label: 'Mở rộng',
        icon: '🌿',
        shortDesc: 'Từ ngữ gợi tả',
        badgeText: '🌿 Mở rộng: Mở rộng chi tiết, dùng từ ngữ gợi cảm',
        criteria: [
          'Có từ ngữ gợi tả âm thanh, hình ảnh sống động',
          'Diễn biến các sự việc theo trình tự thời gian rõ ràng',
          'Bộc lộ tình cảm gắn bó sâu sắc'
        ]
      },
      {
        id: 'nang_cao',
        label: 'Nâng cao',
        icon: '⭐',
        shortDesc: 'Có hình ảnh so sánh',
        badgeText: '⭐ Nâng cao: Vận dụng 1 hình ảnh so sánh giản dị',
        criteria: [
          'Vận dụng so sánh phù hợp với lứa tuổi tiểu học',
          'Câu văn nhịp nhàng, giàu cảm xúc',
          'Tránh sáo rỗng, sử dụng trải nghiệm thật'
        ]
      },
      {
        id: 'sang_tao',
        label: 'Sáng tạo',
        icon: '✨',
        shortDesc: 'Góc nhìn riêng',
        badgeText: '✨ Sáng tạo: Góc nhìn mới mẻ từ trải nghiệm thực tế',
        criteria: [
          'Chọn lọc chi tiết độc đáo, không rập khuôn bài mẫu',
          'Kết đoạn để lại ấn tượng tốt đẹp',
          'Bảo đảm đúng số lượng câu của đề'
        ]
      }
    ];
  } else {
    // Khối lớp 4 & 5
    difficultyLevels = [
      {
        id: 'co_ban',
        label: 'Cơ bản',
        icon: '🌱',
        shortDesc: 'Đúng bố cục',
        badgeText: '🌱 Cơ bản: Bố cục rõ ràng, bám sát trọng tâm đề',
        criteria: [
          'Đúng thể loại và cấu trúc bài văn / đoạn văn chuẩn SGK',
          'Diễn đạt trôi chảy, đúng ngữ pháp và chính tả',
          'Nêu đủ các ý chính theo dàn ý'
        ]
      },
      {
        id: 'mo_rong',
        label: 'Mở rộng',
        icon: '🌿',
        shortDesc: 'Đa giác quan',
        badgeText: '🌿 Mở rộng: Quan sát đa giác quan, bộc lộ cảm xúc sâu sắc',
        criteria: [
          'Kết hợp thị giác, thính giác, xúc giác khi miêu tả / kể chuyện',
          'Mở rộng bối cảnh không gian và thời gian hợp lý',
          'Thể hiện suy nghĩ chín chắn, nhân ái'
        ]
      },
      {
        id: 'nang_cao',
        label: 'Nâng cao',
        icon: '⭐',
        shortDesc: 'So sánh & Nhân hóa',
        badgeText: '⭐ Nâng cao: Vận dụng khéo léo biện pháp nghệ thuật',
        criteria: [
          'Kết hợp hài hòa so sánh, nhân hóa và từ láy gợi cảm',
          'Chuyển đoạn tự nhiên, mạch văn truyền cảm',
          'Khắc họa nét riêng nổi bật của đối tượng'
        ]
      },
      {
        id: 'sang_tao',
        label: 'Sáng tạo',
        icon: '✨',
        shortDesc: 'Mở rộng & Triết lý',
        badgeText: '✨ Sáng tạo: Mở bài gián tiếp, kết bài mở rộng sâu sắc',
        criteria: [
          'Mở bài gián tiếp dẫn dắt bất ngờ, cuốn hút',
          'Kết bài mở rộng đúc kết bài học nhân văn',
          'Dấu ấn cá nhân độc đáo và ngôn từ tinh tế'
        ]
      }
    ];
  }

  return {
    grade,
    detectedGenre,
    targetObject,
    exactSentenceNotice: sentenceConstraint.display,
    minSentences: sentenceConstraint.min,
    maxSentences: sentenceConstraint.max,
    isExactSentencePrompt: sentenceConstraint.isExplicit,
    quickWishes,
    defaultWish,
    difficultyLevels
  };
}

/**
 * Lọc bỏ những mong muốn cũ không còn phù hợp khi học sinh đổi đề hoặc đổi lớp
 */
export function purgeIncompatibleWishes(
  currentWishes: string,
  analysis: PromptRequirementAnalysis
): string {
  if (!currentWishes || !currentWishes.trim()) return analysis.defaultWish;

  const forbiddenTerms: string[] = [];

  // Nếu đề 1–2 câu hoặc lớp 1: cấm tiệt 4–6 câu, 7–9 câu, mở bài, kết bài, so sánh, nhân hóa
  if (analysis.maxSentences <= 2 || analysis.grade === 1) {
    forbiddenTerms.push(
      '4–6 câu', '4-6 câu', '7–9 câu', '7-9 câu', '5–7 câu', '8–12 câu',
      'mở bài hấp dẫn', 'câu kết ấn tượng', 'kết bài', 'mở bài',
      'nhân hóa', 'so sánh', 'thư ngắn', '5 phần', 'lập luận'
    );
  } else if (analysis.maxSentences <= 5) {
    // Đoạn 3–5 câu: cấm 7–9 câu, mở bài thân bài kết bài
    forbiddenTerms.push('7–9 câu', '7-9 câu', '8–12 câu', 'mở bài hấp dẫn', 'nhân hóa phức tạp');
  }

  const items = currentWishes
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const keptItems = items.filter(item => {
    const itemLower = item.toLowerCase();
    // Bỏ nếu trùng từ cấm
    for (const forbidden of forbiddenTerms) {
      if (itemLower.includes(forbidden)) return false;
    }
    return true;
  });

  if (keptItems.length === 0) {
    return analysis.defaultWish;
  }

  return keptItems.join(', ');
}
