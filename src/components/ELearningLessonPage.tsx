import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, RotateCcw, Volume2 } from 'lucide-react';

const LESSON_ID = 'el3-ta-truong-goc-san-v1';
type Direction = 'school' | 'yard';
type Progress = { step: number; direction: Direction | ''; answers: string[]; ideas: string[]; outline: string[]; writing: string; checklist: boolean[]; completed: boolean };
const blank = (): Progress => ({ step: 0, direction: '', answers: ['', '', ''], ideas: ['', '', '', '', ''], outline: ['', '', ''], writing: '', checklist: [false, false, false], completed: false });
const directions = {
  school: { name: 'Ngôi trường của em', questions: ['Ngôi trường của em có những khu vực nào?', 'Em thích điều gì nhất ở trường?', 'Em có cảm xúc gì khi đến trường?'], ideas: ['Cổng trường', 'Lớp học', 'Sân trường', 'Hoạt động', 'Cảm xúc'], words: ['rộng rãi', 'sạch đẹp', 'thân quen', 'rộn ràng'] },
  yard: { name: 'Một góc sân trường', questions: ['Em chọn góc nào của sân trường?', 'Góc sân ấy có những gì?', 'Em thường làm gì và cảm thấy thế nào ở đó?'], ideas: ['Vị trí', 'Cây cối', 'Đồ vật', 'Hoạt động', 'Cảm xúc'], words: ['rợp bóng', 'xanh mát', 'vui nhộn', 'yên bình'] }
};
const stages = ['Khởi động', 'Khám phá đề', 'Tìm ý', 'Lập dàn ý', 'Luyện tập', 'Tự viết', 'Tự đánh giá'];

export const ELearningLessonPage: React.FC<{ studentId: string; onBack: () => void }> = ({ studentId, onBack }) => {
  const key = `vcnh-elearning:${LESSON_ID}:${studentId}`;
  const [data, setData] = useState<Progress>(() => {
    try { const saved = JSON.parse(localStorage.getItem(key) || 'null'); return saved && typeof saved.step === 'number' && Array.isArray(saved.answers) ? { ...blank(), ...saved } : blank(); }
    catch { return blank(); }
  });
  const [feedback, setFeedback] = useState('');
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(data)); } catch {} }, [key, data]);
  const update = (patch: Partial<Progress>) => { setData(old => ({ ...old, ...patch, completed: false })); setFeedback(''); };
  const current = directions[(data.direction || 'school') as Direction];
  const filled = (items: string[]) => items.every(v => v.trim().length >= 3);
  const canAdvance = useMemo(() => {
    switch (data.step) {
      case 0: return true;
      case 1: return !!data.direction;
      case 2: return filled(data.ideas);
      case 3: return filled(data.outline);
      case 4: return filled(data.answers);
      case 5: return data.writing.trim().length >= 40;
      case 6: return data.checklist.every(Boolean);
      default: return false;
    }
  }, [data]);
  const speak = (message: string) => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(message); u.lang = 'vi-VN'; u.rate = 0.88; window.speechSynthesis.speak(u); } };
  const inputClass = 'w-full rounded-xl border-2 border-emerald-200 bg-white p-3 text-base text-stone-800 focus:outline-none focus:border-emerald-500';
  const renderFields = (values: string[], labels: string[], field: 'ideas' | 'outline' | 'answers') => labels.map((label, index) => <label key={label} className="block mb-3"><span className="block mb-1 font-semibold text-stone-700">{label}</span><textarea rows={2} className={inputClass} value={values[index] || ''} onChange={e => update({ [field]: values.map((v, i) => i === index ? e.target.value : v) } as Partial<Progress>)} placeholder="Em tự ghi ý của mình vào đây..." /></label>);
  const finish = () => { if (canAdvance) { setData(old => ({ ...old, completed: true })); setFeedback('Em đã hoàn thành bài học! Bài viết được lưu tạm trên thiết bị này.'); } };
  return <section className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
    <div className="rounded-3xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-7">
      <div className="flex justify-between gap-3 items-center mb-5"><button onClick={onBack} aria-label="Quay lại trang trước" title="Quay lại trang trước" className="rounded-xl border border-emerald-200 p-3 hover:bg-emerald-50"><ArrowLeft size={20}/></button><span className="text-sm font-semibold text-emerald-800">Bài học E-learning · Tiếng Việt lớp 3</span></div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mb-2">Ngôi trường hoặc góc sân trường em yêu thích</h1>
      <p className="text-stone-600 mb-4">Mục tiêu: Hiểu đề, tìm ý, lập dàn ý, tự viết đoạn văn và tự kiểm tra bài viết.</p>
      <div className="flex gap-1 mb-2" aria-label={`Chặng ${data.step+1} trong 7 chặng`}>{stages.map((s, i) => <div key={s} className={`h-2 rounded-full flex-1 ${i <= data.step ? 'bg-emerald-500' : 'bg-stone-200'}`}/>)}</div>
      <div className="flex justify-between items-center mb-5"><strong className="text-emerald-900">{data.step+1}/7 · {stages[data.step]}</strong><button className="flex gap-2 items-center text-sm text-emerald-700 font-semibold" onClick={() => speak(`Chặng ${data.step+1}. ${stages[data.step]}. ${data.step===1?'Em chọn một trong hai hướng viết.':''}`)}><Volume2 size={18}/> Nghe hướng dẫn</button></div>
      <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 mb-5">
        {data.step === 0 && <><h2 className="font-bold text-lg mb-2">Em yêu điều gì ở ngôi trường?</h2><p>Hãy nhớ lại một buổi đến trường: em nhìn thấy những gì, thích nơi nào và cảm thấy ra sao? Khi sẵn sàng, em bấm Tiếp theo.</p></>}
        {data.step === 1 && <><h2 className="font-bold text-lg mb-2">Đọc đề và chọn một hướng</h2><p className="mb-3">Đề bài: Viết đoạn văn tả ngôi trường tiểu học của em hoặc một góc sân trường mà em yêu thích.</p><div className="grid sm:grid-cols-2 gap-3">{(Object.keys(directions) as Direction[]).map(k => <button key={k} onClick={() => update({ direction: k, ideas: ['', '', '', '', ''], outline: ['', '', ''], answers: ['', '', ''] })} className={`rounded-xl border-2 p-4 text-left font-bold ${data.direction === k ? 'border-emerald-600 bg-white' : 'border-emerald-200 bg-white/70'}`}>{data.direction === k ? '✓ ' : ''}{directions[k].name}</button>)}</div></>}
        {data.step === 2 && <><h2 className="font-bold text-lg mb-2">Sơ đồ 5 nhánh: {current.name}</h2><p className="mb-3">Mỗi nhánh ghi ít nhất một ý quan sát hoặc trải nghiệm thật của em.</p>{renderFields(data.ideas, current.ideas, 'ideas')}</>}
        {data.step === 3 && <><h2 className="font-bold text-lg mb-2">Lập dàn ý của em</h2><p className="mb-3">Dựa vào các ý đã ghi, em tự sắp xếp theo trình tự.</p>{renderFields(data.outline, ['Mở đoạn – Giới thiệu đối tượng', 'Thân đoạn – Những đặc điểm nổi bật', 'Kết đoạn – Tình cảm của em'], 'outline')}</>}
        {data.step === 4 && <><h2 className="font-bold text-lg mb-2">Luyện tập trước khi viết</h2><p className="mb-2">Một số từ gợi ý: {current.words.join(', ')}. Em chỉ chọn từ phù hợp với quan sát của mình.</p>{renderFields(data.answers, current.questions, 'answers')}</>}
        {data.step === 5 && <><h2 className="font-bold text-lg mb-2">Em tự viết đoạn văn</h2><p className="mb-3">Viết theo dàn ý của em. Hãy sử dụng câu văn của chính mình, không chép nguyên gợi ý.</p><textarea rows={9} className={inputClass} value={data.writing} onChange={e => update({ writing: e.target.value })} placeholder="Em viết đoạn văn của mình tại đây..."/><p className="text-sm text-stone-600 mt-2">{data.writing.trim().length} ký tự</p></>}
        {data.step === 6 && <><h2 className="font-bold text-lg mb-2">Tự kiểm tra bài viết</h2><div className="rounded-xl bg-white p-3 whitespace-pre-wrap mb-4">{data.writing}</div>{['Bài viết đúng đối tượng em đã chọn.', 'Các câu được sắp xếp rõ ý, có dấu câu.', 'Em đã đọc lại và sửa những lỗi mình nhận thấy.'].map((label,i)=><label key={label} className="flex gap-3 items-start mb-3"><input type="checkbox" className="mt-1 h-5 w-5" checked={!!data.checklist[i]} onChange={e=>update({ checklist:data.checklist.map((v,j)=>i===j?e.target.checked:v) })}/><span>{label}</span></label>)}</>}
      </div>
      {feedback && <p role="status" className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900">{feedback}</p>}
      {data.completed && <div className="mb-4 flex items-center gap-2 text-emerald-800 font-bold"><CheckCircle2/> Đã hoàn thành bài học trên thiết bị này</div>}
      <div className="flex flex-wrap justify-between gap-2"><button disabled={data.step===0} onClick={()=>{update({step:data.step-1})}} className="flex items-center gap-1 px-4 py-3 border rounded-xl font-semibold disabled:opacity-40"><ArrowLeft size={18}/> Trước</button><div className="flex gap-2"><button onClick={()=>{if(window.confirm('Em muốn bắt đầu lại bài học? Nội dung đã viết trên thiết bị này sẽ bị xóa.')){setData(blank());setFeedback('')}}} className="px-3 py-3 rounded-xl border" title="Làm lại"><RotateCcw size={18}/></button>{data.step<6?<button onClick={()=>{if(canAdvance) update({step:data.step+1}); else setFeedback('Em hãy hoàn thành các ô trả lời trước khi tiếp tục nhé.')}} className="flex items-center gap-2 px-5 py-3 bg-emerald-700 text-white rounded-xl font-bold">Tiếp theo <ArrowRight size={18}/></button>:<button onClick={finish} className="px-5 py-3 bg-emerald-700 text-white rounded-xl font-bold">Hoàn thành</button>}</div></div>
      <p className="mt-4 text-xs text-stone-500">Tiến độ đang được lưu trên thiết bị này. Chức năng đồng bộ tài khoản sẽ được bổ sung ở bản tiếp theo.</p>
    </div>
  </section>;
};
