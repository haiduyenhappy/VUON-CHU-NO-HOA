import { EssayGenre } from '../types';

/**
 * Hàm phân loại chính xác thể loại bài viết học sinh tiểu học theo Chương trình GDPT 2018
 * Phân biệt rõ rệt 12 thể loại:
 * 1. Viết câu ('viet_cau')
 * 2. Viết đoạn văn ('viet_doan_van')
 * 3. Kể chuyện ('ke_chuyen')
 * 4. Thuật lại sự việc ('thuat_lai')
 * 5. Miêu tả ('mieu_ta')
 * 6. Nêu tình cảm, cảm xúc ('tinh_cam_cam_xuc')
 * 7. Nêu ý kiến ('neu_y_kien')
 * 8. Viết thư ('viet_thu')
 * 9. Viết lời nhắn ('loi_nhan')
 * 10. Viết thông báo ('thong_bao')
 * 11. Viết hướng dẫn ('huong_dan')
 * 12. Viết sáng tạo ('sang_tao')
 */
export function detectGenre(promptText: string): EssayGenre {
  if (!promptText || typeof promptText !== 'string') return 'khac';
  const p = promptText.toLowerCase().trim();

  // 1. LỜI NHẮN (Ưu tiên cao nhất để không bị ép thành bức thư hay bài văn)
  if (
    p.includes('lời nhắn') || 
    p.includes('tin nhắn') || 
    p.includes('để lại lời nhắn') || 
    p.includes('nhắn nhủ') ||
    p.includes('viết lời nhắn') ||
    p.includes('viết tin nhắn') ||
    p.includes('nhắn tin cho') ||
    p.includes('nhắn cho') ||
    (p.includes('nhắn') && (p.includes('bố') || p.includes('mẹ') || p.includes('người thân') || p.includes('bạn')))
  ) {
    return 'loi_nhan';
  }

  // 2. VIẾT THƯ (Bắt chính xác từ khóa 'thư' nguyên từ, tránh nhầm với 'thường ngày', 'yêu thương', 'thước')
  const letterKeywords = [
    'bức thư',
    'lá thư',
    'viết thư',
    'gửi thư',
    'thư ngắn',
    'thư thăm hỏi',
    'thư cảm ơn',
    'thư chúc mừng',
    'thư gửi',
    'viết một bức thư',
    'gửi một bức thư',
    'hồi âm'
  ];
  const hasLetterKeyword = letterKeywords.some(kw => p.includes(kw));
  const hasWholeLetterWord = /(?:^|[^\p{L}])thư(?:[^\p{L}]|$)/u.test(p);
  const hasLetterContext = hasWholeLetterWord && (
    p.includes('ông') || 
    p.includes('bà') || 
    p.includes('bạn') || 
    p.includes('thăm hỏi') || 
    p.includes('cảm ơn') || 
    p.includes('chúc mừng') || 
    p.includes('người thân') ||
    p.includes('thầy') ||
    p.includes('cô') ||
    p.includes('chuyển trường')
  );

  if (hasLetterKeyword || hasLetterContext) {
    return 'viet_thu';
  }

  // 3. THÔNG BÁO
  if (p.includes('thông báo') || p.includes('bản tin')) {
    return 'thong_bao';
  }

  // 4. HƯỚNG DẪN
  if (p.includes('hướng dẫn') || p.includes('các bước thực hiện') || p.includes('cách làm') || p.includes('hướng dẫn làm')) {
    return 'huong_dan';
  }

  // 5. VIẾT CÂU (1–2 câu, 2–3 câu)
  if (
    p.includes('viết câu') || 
    p.includes('đặt câu') || 
    p.includes('đặt 1-2 câu') || 
    p.includes('viết 1-2 câu') || 
    p.includes('viết 1 câu') || 
    p.includes('viết 2 câu') ||
    p.includes('đặt từ 1 đến 2 câu') ||
    p.includes('viết 2–3 câu') ||
    p.includes('viết 2-3 câu') ||
    p.includes('từ 2 đến 3 câu')
  ) {
    return 'viet_cau';
  }

  // 6. NÊU Ý KIẾN / SUY NGHĨ (Nhận diện trước kể chuyện và miêu tả)
  if (
    p.includes('nêu ý kiến') || 
    p.includes('ý kiến của em') || 
    p.includes('suy nghĩ của em') || 
    p.includes('quan điểm') || 
    p.includes('bày tỏ ý kiến') ||
    p.includes('em đồng ý') ||
    (p.includes('việc làm tốt') && (p.includes('ý kiến') || p.includes('suy nghĩ') || p.includes('nêu')))
  ) {
    return 'neu_y_kien';
  }

  // 7. NÊU TÌNH CẢM, CẢM XÚC
  if (
    p.includes('tình cảm') || 
    p.includes('cảm xúc') || 
    p.includes('bày tỏ tình cảm') || 
    p.includes('bộc lộ cảm xúc') || 
    p.includes('nêu tình cảm') ||
    (p.includes('người thân') && (p.includes('yêu quý') || p.includes('kính yêu') || p.includes('gắn bó')) && !p.includes('kể') && !p.includes('tả '))
  ) {
    return 'tinh_cam_cam_xuc';
  }

  // 8. VIẾT SÁNG TẠO / TƯỞNG TƯỢNG
  if (p.includes('sáng tạo') || p.includes('tưởng tượng') || p.includes('đóng vai') || p.includes('nếu em là') || p.includes('hóa thân')) {
    return 'sang_tao';
  }

  // 9. THUẬT LẠI SỰ VIỆC
  if (p.includes('thuật lại') || p.includes('thuật lại sự việc') || p.includes('tường thuật') || p.includes('thuật lại hoạt động')) {
    return 'thuat_lai';
  }

  // 10. KỂ CHUYỆN / KỂ LẠI KỶ NIỆM (Ưu tiên kể trước tả nếu có "kể lại một kỷ niệm")
  if (p.startsWith('kể ') || p.includes('kể ') || p.includes('kể lại') || p.includes('kể chuyện') || p.includes('kỷ niệm')) {
    return 'ke_chuyen';
  }

  // 11. MIÊU TẢ (tả cảnh, tả đồ vật, tả cây cối, tả người, góc sân, ngôi trường...)
  if (p.startsWith('tả ') || p.includes('tả ') || p.includes('miêu tả') || p.includes('hình dáng') || p.includes('đặc điểm') || p.includes('quang cảnh')) {
    return 'mieu_ta';
  }

  // 12. VIẾT ĐOẠN VĂN (bao gồm giới thiệu bản thân)
  if (
    p.includes('đoạn văn') || 
    p.includes('viết một đoạn') || 
    p.includes('giới thiệu bản thân') || 
    p.includes('giới thiệu về bản thân') ||
    p.includes('bản thân em')
  ) {
    return 'viet_doan_van';
  }

  return 'khac';
}

/**
 * Trả về tên hiển thị tiếng Việt của thể loại bài viết
 */
export function getGenreLabel(genre: EssayGenre): string {
  switch (genre) {
    case 'viet_thu':
      return 'Viết thư';
    case 'loi_nhan':
      return 'Viết lời nhắn';
    case 'thong_bao':
      return 'Viết thông báo';
    case 'huong_dan':
      return 'Viết hướng dẫn';
    case 'viet_cau':
      return 'Viết câu';
    case 'thuat_lai':
      return 'Thuật lại sự việc';
    case 'neu_y_kien':
    case 'y_kien_nhan_vat':
      return 'Nêu ý kiến';
    case 'tinh_cam_cam_xuc':
      return 'Nêu tình cảm, cảm xúc';
    case 'sang_tao':
      return 'Viết sáng tạo';
    case 'mieu_ta':
    case 'ta_canh_vat':
    case 'ta_do_vat':
    case 'ta_nguoi':
      return 'Miêu tả';
    case 'ke_chuyen':
    case 'ke_su_viec':
      return 'Kể chuyện';
    case 'viet_doan_van':
      return 'Viết đoạn văn';
    default:
      return 'Bài viết của em';
  }
}
