/** Học liệu E-learning theo từng hướng; giáo viên có thể chỉnh sửa trước khi giao. */
export type LearningDirection = { id: string; name: string; branches: string[]; questions: string[]; words: string[] };
const normalize = (s: unknown) => String(s || '').trim();
export function inferDirections(prompt: string, explicit: string[] = []): string[] {
  const given = explicit.map(normalize).filter(Boolean);
  if (given.length) return [...new Set(given)].slice(0, 8);
  const text = normalize(prompt).replace(/[.!?]+$/g, '');
  const match = text.match(/(?:tả|giới thiệu|kể về|viết về|miêu tả)\s+(.+?)\s+hoặc\s+(.+?)(?:\s+(?:mà|em|của em)\b|$)/i);
  if (match) return [match[1], match[2]].map(x=>x.trim()).filter(Boolean);
  const pieces = text.split(/\s+hoặc\s+/i);
  return pieces.length === 2 ? pieces.map(x=>x.trim().slice(0,120)) : [text.slice(0,120) || 'Hướng viết của em'];
}
export function createDirection(name: string, index: number, prompt: string): LearningDirection {
  const s = `${name} ${prompt}`.toLocaleLowerCase('vi');
  let branches: string[], questions: string[], words: string[];
  if (/ngôi trường|trường học|sân trường|góc sân/.test(s)) {
    const yard = /góc sân/.test(name.toLocaleLowerCase('vi'));
    branches = yard ? ['Vị trí góc sân', 'Cây cối, đồ vật', 'Âm thanh, màu sắc', 'Hoạt động', 'Cảm xúc'] : ['Cổng trường', 'Lớp học', 'Sân trường', 'Hoạt động', 'Cảm xúc'];
    questions = yard ? ['Em chọn góc sân nào?', 'Góc sân có những gì nổi bật?', 'Em làm gì ở đó và cảm thấy thế nào?'] : ['Ngôi trường của em có những khu vực nào?', 'Em ấn tượng nhất với điều gì?', 'Em yêu quý ngôi trường vì sao?'];
    words = yard ? ['xanh mát','rợp bóng','rộn ràng','thân thuộc'] : ['sạch đẹp','rộng rãi','thân quen','vui tươi'];
  } else if (/bố|mẹ|ông|bà|người thân|bạn bè|thầy|cô giáo/.test(s)) {
    branches=['Người em chọn','Đặc điểm nổi bật','Việc làm đáng nhớ','Kỉ niệm','Tình cảm'];
    questions=[`Em muốn kể về ${name} như thế nào?`,'Em nhớ việc làm hoặc kỉ niệm nào?','Em muốn bày tỏ tình cảm gì?'];
    words=['ân cần','ấm áp','vui vẻ','yêu thương'];
  } else if (/bút|hộp bút|đồ vật|cặp sách|quyển sách/.test(s)) {
    branches=['Tên đồ vật','Hình dáng','Màu sắc','Công dụng','Tình cảm'];
    questions=[`Em có ${name} từ khi nào?`,'Đồ vật có hình dáng, màu sắc và công dụng gì?','Em giữ gìn đồ vật như thế nào?'];
    words=['gọn gàng','xinh xắn','tiện lợi','quen thuộc'];
  } else if (/kỉ niệm|việc tốt|câu chuyện|sự việc/.test(s)) {
    branches=['Thời gian','Địa điểm','Nhân vật','Diễn biến','Cảm nghĩ'];
    questions=['Sự việc xảy ra ở đâu, khi nào?','Điều gì diễn ra trước, trong và sau sự việc?','Em học được điều gì từ sự việc đó?'];
    words=['đáng nhớ','bất ngờ','xúc động','vui mừng'];
  } else if (/cây|hoa|con vật|thú cưng|mèo|chó/.test(s)) {
    branches=['Đối tượng','Hình dáng','Đặc điểm','Hoạt động hoặc ích lợi','Tình cảm'];
    questions=[`Em chọn quan sát ${name} ở đâu?`,'Em thấy những đặc điểm gì nổi bật?','Em có tình cảm gì với đối tượng đó?'];
    words=['đáng yêu','sinh động','nổi bật','gần gũi'];
  } else {
    branches=['Đối tượng','Đặc điểm','Chi tiết cụ thể','Trải nghiệm','Cảm nghĩ'];
    questions=[`Em chọn viết về ${name} vì sao?`,'Em nhớ hoặc quan sát được những chi tiết nào?','Em muốn nói điều gì với người đọc?'];
    words=['rõ ràng','gần gũi','đáng nhớ','sinh động'];
  }
  return {id:`huong-${index+1}`,name,branches,questions,words};
}
export function buildDirections(prompt: string, names: string[] = [], stored: unknown = []): LearningDirection[] {
  const inferred = inferDirections(prompt,names);
  const saved = Array.isArray(stored) ? stored : [];
  return inferred.map((name,i)=>{
    const base=createDirection(name,i,prompt);
    const found=saved.find((x:any)=>x && (x.name===name || x.id===base.id)) as any;
    if(!found) return base;
    const pick=(value:unknown,len:number,fallback:string[])=>Array.isArray(value)&&value.length===len&&value.every(x=>typeof x==='string')?value:fallback;
    return {...base,branches:pick(found.branches,5,base.branches),questions:pick(found.questions,3,base.questions),words:pick(found.words,4,base.words)};
  });
}
