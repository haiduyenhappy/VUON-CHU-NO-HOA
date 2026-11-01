/** Gợi ý theo HÀNH ĐỘNG CHÍNH của đề, sau đó mới xét đối tượng và số câu. */
export interface WritingWishContext { prompt: string; grade: number; selectedObject?: string | null; }

function sentenceCount(input: string): string | null {
  const text = input.toLocaleLowerCase('vi-VN');
  const range = text.match(/\b(\d{1,2})\s*(?:[-–—]|đến|tới)\s*(\d{1,2})\s*câu\b/u);
  if (range) {
    const a = Number(range[1]), b = Number(range[2]);
    if (a >= 1 && b >= a && b <= 30) return `Viết đúng ${a}–${b} câu`;
  }
  const single = text.match(/\b(\d{1,2})\s*câu\b/u);
  if (single && Number(single[1]) >= 1 && Number(single[1]) <= 30) return `Viết đúng ${single[1]} câu`;
  return null;
}

function dedupe(values: string[], max: number): string[] {
  return [...new Set(values.filter(Boolean))].slice(0, max);
}

export function getWritingWishes({prompt, grade, selectedObject}: WritingWishContext): string[] {
  const text = (prompt || '').toLocaleLowerCase('vi-VN').trim();
  const obj = (selectedObject || '').toLocaleLowerCase('vi-VN').trim();
  const has = (re: RegExp) => re.test(text);
  const length = sentenceCount(text);
  let hints: string[];

  // Ưu tiên THỂ LOẠI/GIAO TIẾP trước từ khóa đồ vật, người thân, cây, hoa.
  if (has(/tin nhắn|nhắn tin|lời nhắn/u)) {
    const thanks = has(/cảm ơn/u);
    const apology = has(/xin lỗi/u);
    if (thanks && apology && !obj) hints = [
      'Chọn viết lời cảm ơn hoặc lời xin lỗi',
      'Nói rõ việc khiến con muốn cảm ơn hoặc xin lỗi',
      'Viết lời nhắn chân thành, lịch sự'
    ];
    else if ((apology && !thanks) || /xin lỗi/u.test(obj)) hints = [
      'Gửi lời nhắn đúng người bạn', 'Nói rõ việc con muốn xin lỗi', 'Thể hiện sự chân thành và mong bạn thông cảm'
    ];
    else hints = ['Gửi lời nhắn đúng người bạn', 'Nói rõ việc con muốn cảm ơn', 'Viết lời cảm ơn chân thành, lịch sự'];
  } else if (has(/viết thư|lá thư|thư (?:cho|gửi|thăm)|bức thư/u)) {
    hints = ['Xác định đúng người nhận thư', 'Nêu điều con muốn hỏi thăm hoặc chia sẻ', 'Viết lời chúc và kết thư phù hợp'];
  } else if (has(/tình cảm|yêu mến|kính trọng|biết ơn|yêu thương/u) && has(/ông|bà|bố|mẹ|người thân|thầy|cô|bạn/u)) {
    if (has(/ông hoặc bà|ông hay bà/u) && !obj) hints = ['Chọn viết về ông hoặc bà', 'Nhớ lại một việc làm khiến con yêu quý người ấy', 'Nói rõ tình cảm yêu mến, kính trọng của con'];
    else hints = [`Nói về ${obj || 'người thân'} mà con yêu quý`, 'Nhắc đến một việc làm hoặc kỉ niệm đáng nhớ', 'Bày tỏ tình cảm chân thật của con'];
  } else if (has(/nêu ý kiến|ý kiến của em|đồng tình/u)) {
    hints = ['Nêu rõ ý kiến của con', 'Giải thích bằng một lí do gần gũi', 'Đưa ví dụ phù hợp với chủ đề'];
  } else if (has(/kỉ niệm|kỷ niệm|trải nghiệm|việc tốt|kể lại|kể về/u)) {
    hints = ['Kể đúng sự việc đề yêu cầu', 'Kể các việc theo trình tự', 'Nói cảm xúc của con sau sự việc'];
  } else if (has(/ngôi trường|sân trường|góc sân/u)) {
    hints = ['Chọn đúng cảnh hoặc góc sân trong đề', 'Nêu chi tiết con quan sát được', 'Nói điều con yêu thích ở nơi ấy'];
  } else if (/bút chì/u.test(obj) || (!obj && has(/bút chì/u) && !has(/hộp bút/u))) {
    hints = ['Tả màu sắc hoặc hình dáng bút chì', 'Nói bút chì giúp con viết hoặc vẽ', 'Nói điều con thích ở bút chì'];
  } else if (/hộp bút/u.test(obj) || (!obj && has(/hộp bút/u) && !has(/bút chì/u))) {
    hints = ['Tả màu sắc hoặc hình dáng hộp bút', 'Nói hộp bút dùng để đựng đồ gì', 'Nói điều con thích ở hộp bút'];
  } else if (!obj && has(/bút chì/u) && has(/hộp bút/u)) {
    hints = ['Chọn bút chì hoặc hộp bút', 'Tả một đặc điểm của đồ vật đã chọn', 'Nêu công dụng của đồ vật ấy'];
  } else if (has(/con vật|chó|mèo|gà|thú cưng/u)) {
    hints = ['Nêu đúng con vật con muốn tả', 'Tả đặc điểm hoặc hoạt động nổi bật', 'Nói tình cảm của con với con vật'];
  } else if (has(/cây|hoa|bông hoa/u)) {
    hints = ['Nêu tên cây hoặc loài hoa', 'Tả đặc điểm con quan sát được', 'Nói điều con yêu thích ở cây hoặc hoa'];
  } else if (has(/bố|mẹ|ông|bà|người thân|bạn thân|thầy|cô giáo/u)) {
    hints = ['Nói đúng người được nhắc trong đề', 'Nêu một đặc điểm hoặc việc làm đáng nhớ', 'Bày tỏ tình cảm của con'];
  } else if (has(/bản thân|họ tên|sở thích|giới thiệu.*em/u)) {
    hints = ['Giới thiệu đúng thông tin về bản thân', 'Nói về sở thích theo yêu cầu đề', 'Dùng lời văn tự nhiên của con'];
  } else if (has(/đồ vật|đồ chơi|đồ dùng|chiếc cặp|bàn học/u)) {
    hints = ['Chọn đúng đồ vật đề yêu cầu', 'Nêu một đặc điểm hoặc công dụng', 'Nói điều con yêu thích ở đồ vật'];
  } else {
    hints = ['Xác định đúng việc đề yêu cầu', 'Chọn chi tiết gắn với nội dung đề', 'Dùng lời văn tự nhiên của con'];
  }
  const lengthHint = length || (grade === 1 ? 'Viết câu ngắn, đủ ý' : grade === 2 ? 'Viết đoạn ngắn, rõ ý' : 'Viết đúng độ dài đề yêu cầu');
  const result = [lengthHint, ...hints];
  if (grade >= 4 && has(/so sánh|nhân hóa|từ láy/u)) result.push('Thực hiện đúng yêu cầu diễn đạt của đề');
  return dedupe(result, grade <= 2 ? 4 : 5);
}
