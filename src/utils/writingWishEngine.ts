/** Gợi mở ý tưởng theo nhiệm vụ giao tiếp và nội dung đề; không viết bài thay học sinh. */
export interface WritingWishContext { prompt: string; grade: number; selectedObject?: string | null; }

const lower = (s: string) => (s || '').toLocaleLowerCase('vi-VN').trim();
const matches = (s: string, re: RegExp) => re.test(s);

function lengthHint(text: string): string | null {
  const range = text.match(/(?:\b|từ\s+)(\d{1,2})\s*(?:[-–—]|đến|tới)\s*(\d{1,2})\s*câu\b/u);
  if (range) {
    const a = Number(range[1]), b = Number(range[2]);
    if (a > 0 && b >= a && b <= 30) return `Viết ${a}–${b} câu`;
  }
  const single = text.match(/\b(\d{1,2})\s*câu\b/u);
  return single && Number(single[1]) > 0 && Number(single[1]) <= 30 ? `Viết ${single[1]} câu` : null;
}

export function getWritingWishes({ prompt, grade, selectedObject }: WritingWishContext): string[] {
  const text = lower(prompt);
  const object = lower(selectedObject || '');
  const has = (re: RegExp) => matches(text, re);
  const ideas: string[] = [];

  // Xác định hành động giao tiếp trước khi xét những danh từ xuất hiện trong đề.
  if (has(/tin nhắn|nhắn tin|lời nhắn/u)) {
    const thanks = has(/cảm ơn/u), sorry = has(/xin lỗi/u);
    if (thanks && sorry && !object) ideas.push('Chọn cảm ơn hay xin lỗi bạn');
    const apology = /xin lỗi/u.test(object) || (sorry && !thanks);
    ideas.push('Nói rõ việc đã xảy ra', apology ? 'Nói lời xin lỗi chân thành' : thanks && !sorry ? 'Nói lời cảm ơn chân thành' : 'Chọn lời cảm ơn hoặc xin lỗi phù hợp', 'Gửi lời nhắn thân thiện đến bạn');
  } else if (has(/viết thư|lá thư|bức thư|thư (?:cho|gửi|thăm)/u)) {
    ideas.push('Nghĩ về người con muốn gửi thư', 'Chia sẻ một điều con muốn kể hoặc hỏi thăm', 'Gửi một lời chúc chân thành');
  } else if (has(/giới thiệu.*bản thân|giới thiệu.*về em|họ tên.*sở thích|sở thích.*ước mơ/u)) {
    ideas.push('Kể một sở thích con yêu nhất', 'Chia sẻ ước mơ của con', 'Nói một điều đặc biệt về chính mình', 'Kể vì sao con thích điều ấy');
  } else if (has(/tình cảm|yêu mến|kính trọng|biết ơn|yêu thương/u) && has(/ông|bà|bố|mẹ|cha|người thân|thầy|cô|bạn/u)) {
    if (has(/ông hoặc bà|ông hay bà/u) && !object) ideas.push('Chọn kể về ông hay bà');
    ideas.push('Nhớ một việc ông/bà làm cho con', 'Kể một kỉ niệm ấm áp cùng người ấy', 'Nói điều khiến con yêu quý, kính trọng');
  } else if (has(/nêu ý kiến|ý kiến của em|đồng tình|không đồng tình/u)) {
    ideas.push('Con nghĩ gì về vấn đề này?', 'Điều gì khiến con nghĩ như vậy?', 'Kể một ví dụ con từng thấy');
  } else if (has(/kỉ niệm|kỷ niệm|trải nghiệm|việc tốt|kể lại|kể về|chuyến đi/u)) {
    ideas.push('Nhớ lại sự việc đã xảy ra ở đâu', 'Kể một khoảnh khắc con nhớ nhất', 'Nói cảm xúc của con sau sự việc');
  } else if (has(/ngôi trường|sân trường|góc sân/u)) {
    ideas.push('Chọn tả ngôi trường hay góc sân', 'Nhớ một hình ảnh nổi bật nơi ấy', 'Kể điều con thích nhất ở nơi đó');
  } else if (has(/bút chì|hộp bút/u)) {
    if (!object && has(/bút chì/u) && has(/hộp bút/u)) ideas.push('Chọn chiếc bút chì hay hộp bút');
    const thing = object || (has(/bút chì/u) && !has(/hộp bút/u) ? 'bút chì' : has(/hộp bút/u) && !has(/bút chì/u) ? 'hộp bút' : 'đồ vật con chọn');
    ideas.push(`Con thích màu sắc nào của ${thing}?`, `Điều gì ở ${thing} khiến con chú ý?`, `${thing} giúp con làm gì mỗi ngày?`);
  } else if (has(/con vật|chó|mèo|gà|thú cưng/u)) {
    ideas.push('Nhớ hình dáng con vật con thích', 'Kể một hoạt động đáng yêu của nó', 'Nói điều khiến con yêu quý con vật');
  } else if (has(/cây|bông hoa|loài hoa|vườn hoa/u)) {
    ideas.push('Nhớ màu sắc, hình dáng cây hoặc hoa', 'Chọn một chi tiết con thấy đẹp nhất', 'Kể điều con thích khi ngắm cây hoặc hoa');
  } else if (has(/tả người|người thân|bạn thân|bố|mẹ|ông|bà|thầy|cô giáo/u)) {
    ideas.push('Nhớ nét riêng của người con muốn kể', 'Kể một việc người ấy thường làm', 'Nói tình cảm của con với người ấy');
  } else if (has(/đồ vật|đồ chơi|đồ dùng|chiếc cặp|bàn học/u)) {
    ideas.push('Chọn một đồ vật con thật sự yêu thích', 'Nhớ màu sắc hoặc hình dáng nổi bật', 'Kể đồ vật ấy giúp con làm gì');
  } else {
    ideas.push('Con nhớ đến điều gì khi đọc đề?', 'Chọn một chi tiết con từng thấy hoặc trải qua', 'Nói điều con muốn chia sẻ nhất');
  }

  const count = lengthHint(text);
  const result = count ? [count, ...ideas] : ideas;
  // Đề không quy định số câu thì không tự áp một con số bất kỳ.
  if (grade >= 4 && has(/so sánh|nhân hóa|từ láy/u)) result.push('Thử dùng cách diễn đạt mà đề yêu cầu');
  return [...new Set(result)].slice(0, grade <= 2 ? 5 : 6);
}
