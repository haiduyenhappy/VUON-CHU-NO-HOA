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

  // Lớp 1: ước mơ nghề nghiệp – ưu tiên nhiệm vụ nói về nghề, không tả người.
  if (grade === 1 && has(/ước mơ/u) && has(/lớn lên/u) && has(/làm nghề gì|muốn làm nghề|bác sĩ|phi công/u)) {
    ideas.push('Chọn nghề con muốn làm khi lớn lên', 'Nói điều con thích ở nghề ấy', 'Kể một việc tốt con muốn làm với nghề đó');
    const count = lengthHint(text);
    return [...new Set(count ? [count, ...ideas] : ideas)].slice(0, 5);
  }

  // Bài lớp 1: cảm ơn cô giáo hoặc thầy giáo đã dạy những nét chữ đầu đời.
  if (grade === 1 && has(/cảm ơn/u) && has(/nét chữ đầu đời/u) && has(/cô giáo/u) && has(/thầy giáo/u)) {
    const isMale = /thầy giáo|thay_giao/u.test(object) && !/cô giáo|co_giao/u.test(object);
    const person = isMale ? 'thầy' : 'cô';
    if (!object) ideas.push('Chọn cảm ơn cô giáo hoặc thầy giáo');
    ideas.push(`Nhớ lúc ${person} dạy con tập viết`, `Kể một điều ${person} đã tận tình chỉ bảo`, `Nói lời cảm ơn ${person} bằng lời của con`);
    const count = lengthHint(text);
    return [...new Set(count ? [count, ...ideas] : ideas)].slice(0, 5);
  }

  // Hai bài lớp 1 cần gợi ý riêng theo nhiệm vụ chính.
  if (grade === 1 && has(/giờ ra chơi/u) && has(/niềm vui/u) && has(/sân trường/u)) {
    ideas.push('Nhớ trò chơi con và các bạn cùng chơi', 'Kể một việc vui xảy ra khi chơi', 'Nói điều làm con vui nhất');
  } else if (grade === 1 && has(/sắc hoa rực rỡ/u) && has(/bông hoa/u) && has(/trong vườn/u)) {
    ideas.push('Chọn sắc hoa ngày Tết hoặc bông hoa trong vườn', 'Nhớ màu hoa con thấy đẹp nhất', 'Nói một nét đẹp con chú ý', 'Chia sẻ cảm xúc khi ngắm hoa');
  } else if (has(/tin nhắn|nhắn tin|lời nhắn/u)) {
    const thanks = has(/cảm ơn/u), sorry = has(/xin lỗi/u);
    if (thanks && sorry && !object) ideas.push('Chọn cảm ơn hay xin lỗi bạn');
    const apology = /xin lỗi/u.test(object) || (sorry && !thanks);
    ideas.push('Nói rõ việc đã xảy ra', apology ? 'Nói lời xin lỗi chân thành' : thanks && !sorry ? 'Nói lời cảm ơn chân thành' : 'Chọn lời cảm ơn hoặc xin lỗi phù hợp', 'Gửi lời nhắn thân thiện đến bạn');
  } else if (has(/viết thư|lá thư|bức thư|thư (?:cho|gửi|thăm)/u)) {
    ideas.push('Nghĩ về người con muốn gửi thư', 'Chia sẻ một điều con muốn kể hoặc hỏi thăm', 'Gửi một lời chúc chân thành');
  } else if (has(/giới thiệu.*bản thân|giới thiệu.*về em|họ tên.*sở thích|sở thích.*ước mơ/u)) {
    ideas.push('Kể một sở thích con yêu nhất', 'Chia sẻ ước mơ của con', 'Nói một điều đặc biệt về chính mình', 'Kể vì sao con thích điều ấy');
  } else if (has(/tình cảm|yêu mến|kính trọng|biết ơn|yêu thương/u) && has(/ông|bà|bố|mẹ|cha|người thân|thầy|cô|bạn/u)) {
    // Ưu tiên đúng toàn bộ đối tượng có trong đề, không thu hẹp thành "ông/bà".
    const familyOptions: string[] = [];
    if (has(/\bbố\b|\bcha\b/u)) familyOptions.push('bố');
    if (has(/\bmẹ\b/u)) familyOptions.push('mẹ');
    if (has(/\bông\b/u)) familyOptions.push('ông');
    if (has(/\bbà\b/u)) familyOptions.push('bà');
    const chosen = familyOptions.find(person => object.includes(person));
    if (familyOptions.length > 1 && !chosen) {
      const names = familyOptions.length === 2
        ? familyOptions.join(' hoặc ')
        : `${familyOptions.slice(0, -1).join(', ')} hoặc ${familyOptions[familyOptions.length - 1]}`;
      ideas.push(`Chọn kể về ${names}`);
    }
    const person = chosen || (familyOptions.length === 1 ? familyOptions[0] : 'người thân con chọn');
    ideas.push(`Nhớ một việc ${person} làm cho con`, `Kể một kỉ niệm ấm áp cùng ${person}`, `Nói điều khiến con yêu quý ${person}`);
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
