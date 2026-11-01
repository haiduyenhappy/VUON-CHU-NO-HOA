/** Gợi ý ngắn theo chính đề bài; không sinh nội dung ngoài yêu cầu hoặc tăng số câu. */
export interface WritingWishContext { prompt: string; grade: number; selectedObject?: string | null; }
export function getWritingWishes({prompt,grade,selectedObject}:WritingWishContext): string[] {
  const text = (prompt || '').toLocaleLowerCase('vi-VN');
  const obj = (selectedObject || '').toLocaleLowerCase('vi-VN');
  const found = text.match(/(?:viết|khoảng|từ|độ dài)?\s*(\d+)\s*[-–—]\s*(\d+)\s*câu/i) || text.match(/(?:viết|khoảng|từ)\s*(\d+)\s*câu/i);
  const length = found ? `Viết đúng ${found[2] ? `${found[1]}–${found[2]}` : found[1]} câu` : (grade === 1 ? 'Viết câu ngắn, đủ ý' : grade === 2 ? 'Viết đoạn ngắn, rõ ý' : 'Viết đúng độ dài đề yêu cầu');
  const has = (re:RegExp) => re.test(text);
  let hints:string[] = [];
  const pencil = /bút chì/.test(obj) || (!obj && /bút chì/.test(text) && !/hộp bút/.test(text));
  const caseBox = /hộp bút/.test(obj) || (!obj && /hộp bút/.test(text) && !/bút chì/.test(text));
  if (pencil) hints = ['Tả màu sắc hoặc hình dáng bút chì', 'Nói bút chì giúp em viết hoặc vẽ', 'Nói điều em thích ở bút chì'];
  else if (caseBox) hints = ['Tả màu sắc hoặc hình dáng hộp bút', 'Nói hộp bút dùng để đựng đồ gì', 'Nói điều em thích ở hộp bút'];
  else if (!obj && has(/bút chì/) && has(/hộp bút/)) hints = ['Chọn bút chì hoặc hộp bút để viết', 'Nêu một đặc điểm của đồ vật đã chọn', 'Nói đồ vật giúp em làm gì'];
  else if (has(/viết thư|lá thư|thư (cho|gửi|thăm)/)) hints = ['Nêu đúng người nhận thư', 'Viết điều con muốn hỏi thăm hoặc chia sẻ', 'Kết thư bằng lời chúc phù hợp'];
  else if (has(/ngôi trường|sân trường|góc sân/)) hints = ['Chọn đúng cảnh hoặc góc sân cần tả', 'Nêu chi tiết con quan sát được', 'Nói điều con yêu thích ở nơi ấy'];
  else if (has(/kỉ niệm|kỷ niệm|trải nghiệm|việc tốt|kể lại|kể về/)) hints = ['Kể đúng sự việc đề yêu cầu', 'Nêu việc xảy ra theo trình tự', 'Nói cảm xúc thật của con'];
  else if (has(/con vật|chó|mèo|gà|thú cưng/)) hints = ['Nêu tên con vật cần tả', 'Tả đặc điểm hoặc hoạt động nổi bật', 'Nói tình cảm của con với con vật'];
  else if (has(/cây|hoa|bông hoa/)) hints = ['Nêu tên cây hoặc loài hoa', 'Tả đặc điểm con quan sát được', 'Nói điều con thích ở cây hoặc hoa'];
  else if (has(/bố|mẹ|ông|bà|người thân|bạn thân|thầy|cô giáo/)) hints = ['Nói đúng người được nhắc trong đề', 'Nêu một đặc điểm hoặc việc làm đáng nhớ', 'Thể hiện tình cảm chân thật'];
  else if (has(/bản thân|họ tên|sở thích|giới thiệu.*em/)) hints = ['Giới thiệu đúng thông tin về bản thân', 'Nêu sở thích hoặc điểm riêng theo đề', 'Dùng lời văn tự nhiên của con'];
  else if (has(/đồ vật|đồ chơi|đồ dùng|chiếc cặp|bàn học/)) hints = ['Nêu đúng đồ vật cần tả', 'Nêu một đặc điểm hoặc công dụng', 'Nói điều con thích ở đồ vật'];
  else if (has(/nêu ý kiến|ý kiến của em|đồng tình/)) hints = ['Nêu rõ ý kiến của con', 'Giải thích bằng lý do gần gũi', 'Đưa một ví dụ đúng chủ đề'];
  else hints = ['Nói đúng đối tượng trong đề', 'Chọn chi tiết phù hợp nội dung', 'Dùng lời văn tự nhiên của con'];
  const result = [length, ...hints];
  if (grade <= 2) return result.slice(0, 4);
  if (grade >= 4 && has(/so sánh|nhân hóa|từ láy/)) result.push('Thực hiện đúng yêu cầu nghệ thuật của đề');
  return result.slice(0, 5);
}
