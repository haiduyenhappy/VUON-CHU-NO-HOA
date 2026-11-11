import React, { useEffect, useMemo, useState, useRef } from 'react';
import { firebaseAuth } from '../lib/firebase';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, RotateCcw, Volume2 } from 'lucide-react';


type Direction = 'school' | 'yard';
type Progress = { step: number; direction: Direction | ''; answers: string[]; ideas: string[]; outline: string[]; writing: string; checklist: boolean[]; completed: boolean };
const blank = (): Progress => ({ step: 0, direction: '', answers: ['', '', ''], ideas: ['', '', '', '', ''], outline: ['', '', ''], writing: '', checklist: [false, false, false], completed: false });
const directions = {
  school: { name: 'Ngôi trường của em', questions: ['Ngôi trường của em có những khu vực nào?', 'Em thích điều gì nhất ở trường?', 'Em có cảm xúc gì khi đến trường?'], ideas: ['Cổng trường', 'Lớp học', 'Sân trường', 'Hoạt động', 'Cảm xúc'], words: ['rộng rãi', 'sạch đẹp', 'thân quen', 'rộn ràng'] },
  yard: { name: 'Một góc sân trường', questions: ['Em chọn góc nào của sân trường?', 'Góc sân ấy có những gì?', 'Em thường làm gì và cảm thấy thế nào ở đó?'], ideas: ['Vị trí', 'Cây cối', 'Đồ vật', 'Hoạt động', 'Cảm xúc'], words: ['rợp bóng', 'xanh mát', 'vui nhộn', 'yên bình'] }
};
const stages = ['Khởi động', 'Khám phá đề', 'Tìm ý', 'Lập dàn ý', 'Luyện tập', 'Tự viết', 'Tự đánh giá'];

export const ELearningLessonPage: React.FC<{ studentId: string; assignment: any; onBack: () => void }> = ({ studentId, assignment, onBack }) => {
  
  const [data, setData] = useState<Progress>(blank);
  const [feedback, setFeedback] = useState('');
  const [loaded,setLoaded]=useState(false);
  const [syncState,setSyncState]=useState('Đang tải tiến độ...');
  const saveVersion=useRef(0);
  useEffect(()=>{let live=true;setLoaded(false);(async()=>{try{
    const token=await firebaseAuth?.currentUser?.getIdToken();if(!token)throw Error('Chưa kết nối được dữ liệu bài học');
    const r=await fetch(`/api/elearning/progress/${encodeURIComponent(assignment.id)}`,{headers:{Authorization:`Bearer ${token}`}});
    if(!r.ok)throw Error('Không đọc được tiến độ');const d=await r.json();
    if(live){setData(d.progress?{...blank(),...d.progress}:blank());setSyncState('Đã tải tiến độ từ Firebase');setLoaded(true);}
  }catch(e){if(live){setSyncState('Lỗi kết nối Firebase. Không thể lưu bài.');setLoaded(false);}}})();return()=>{live=false}},[assignment.id,studentId]);
  useEffect(()=>{if(!loaded)return;const version=++saveVersion.current;const timer=setTimeout(async()=>{try{
    const token=await firebaseAuth?.currentUser?.getIdToken();if(!token)throw Error();
    const r=await fetch(`/api/elearning/progress/${encodeURIComponent(assignment.id)}`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({progress:data})});
    if(!r.ok)throw Error();if(version===saveVersion.current)setSyncState('Đã lưu trên Firebase');
  }catch(e){setSyncState('Lưu Firebase thất bại. Hãy giữ trang mở và thử lại.');}},850);
  return()=>clearTimeout(timer)},[data,loaded,assignment.id]);

  const update = (patch: Partial<Progress>) => { setData(old => ({ ...old, ...patch, completed: false })); setFeedback(''); };
  const schoolTask = /ngôi trường|sân trường/i.test(assignment.prompt || '');
  const choices = schoolTask ? directions : {
    school: {name: (assignment.prompt || 'Đề bài').split(/\s+hoặc\s+/i)[0].slice(0,90), questions: ['Em muốn giới thiệu điều gì?', 'Em quan sát hoặc nhớ được những chi tiết nào?', 'Em có cảm xúc hoặc suy nghĩ gì?'], ideas:['Đối tượng','Đặc điểm','Chi tiết','Trải nghiệm','Cảm xúc'], words:['rõ ràng','gần gũi','đáng nhớ']},
    yard: {name: ((assignment.prompt || '').split(/\s+hoặc\s+/i)[1] || 'Hướng viết khác').slice(0,90), questions: ['Em chọn đối tượng nào?', 'Em nhớ những chi tiết cụ thể nào?', 'Em có cảm xúc gì?'], ideas:['Đối tượng','Đặc điểm','Chi tiết','Trải nghiệm','Cảm xúc'], words:['sinh động','thân thuộc','đáng yêu']}
  };
  const configuredDirections: string[] = Array.isArray(assignment.eLearningDirections) ? assignment.eLearningDirections.filter((x:any)=>typeof x==='string'&&x.trim()) : [];
  if(configuredDirections.length){ choices.school.name=configuredDirections[0]; if(configuredDirections[1])choices.yard.name=configuredDirections[1]; }
  const current = choices[(data.direction || 'school') as Direction];
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
  const finish = () => { if (canAdvance) { setData(old => ({ ...old, completed: true })); setFeedback('Đã hoàn thành các hoạt động. Hệ thống đang lưu lên Firebase.'); } };
  return <section className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
    <div className="rounded-3xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-7">
      <div className="flex justify-between gap-3 items-center mb-5"><button onClick={onBack} aria-label="Quay lại trang trước" title="Quay lại trang trước" className="rounded-xl border border-emerald-200 p-3 hover:bg-emerald-50"><ArrowLeft size={20}/></button><span className="text-sm font-semibold text-emerald-800">Bài học E-learning · Tiếng Việt lớp {assignment.grade}</span></div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mb-2">{assignment.title}</h1>
      <p className="text-stone-600 mb-4">Mục tiêu: Hiểu đề, tìm ý, lập dàn ý, tự viết đoạn văn và tự kiểm tra bài viết.</p>
      {!loaded && <p className="rounded-xl bg-amber-50 p-3 text-amber-900 mb-3">{syncState}</p>}
      <div className="flex gap-1 mb-2" aria-label={`Chặng ${data.step+1} trong 7 chặng`}>{stages.map((s, i) => <div key={s} className={`h-2 rounded-full flex-1 ${i <= data.step ? 'bg-emerald-500' : 'bg-stone-200'}`}/>)}</div>
      <div className="flex justify-between items-center mb-5"><strong className="text-emerald-900">{data.step+1}/7 · {stages[data.step]}</strong><button className="flex gap-2 items-center text-sm text-emerald-700 font-semibold" onClick={() => speak(`Chặng ${data.step+1}. ${stages[data.step]}. ${data.step===1?'Em chọn một trong hai hướng viết.':''}`)}><Volume2 size={18}/> Nghe hướng dẫn</button></div>
      {assignment.eLearningStages?.[data.step] && <p className="mb-3 rounded-xl bg-blue-50 p-3 text-blue-900 font-medium">{assignment.eLearningStages[data.step]}</p>}
      <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 mb-5">
        {data.step === 0 && <><h2 className="font-bold text-lg mb-2">Cùng khám phá đề bài nhé!</h2><p>Em đọc tên bài và nghĩ về những điều mình đã nhìn thấy hoặc trải nghiệm. Khi sẵn sàng, em bấm Tiếp theo.</p></>}
        {data.step === 1 && <><h2 className="font-bold text-lg mb-2">Đọc đề và chọn một hướng</h2><p className="mb-3">Đề bài: {assignment.prompt}</p><div className="grid sm:grid-cols-2 gap-3">{(configuredDirections.length>1 || schoolTask || /\s+hoặc\s+/i.test(assignment.prompt || '') ? (Object.keys(choices) as Direction[]) : ['school' as Direction]).map(k => <button key={k} onClick={() => update({ direction: k, ideas: ['', '', '', '', ''], outline: ['', '', ''], answers: ['', '', ''] })} className={`rounded-xl border-2 p-4 text-left font-bold ${data.direction === k ? 'border-emerald-600 bg-white' : 'border-emerald-200 bg-white/70'}`}>{data.direction === k ? '✓ ' : ''}{choices[k].name}</button>)}</div></>}
        {data.step === 2 && <><h2 className="font-bold text-lg mb-2">Sơ đồ 5 nhánh: {current.name}</h2><p className="mb-3">Mỗi nhánh ghi ít nhất một ý quan sát hoặc trải nghiệm thật của em.</p>{renderFields(data.ideas, current.ideas, 'ideas')}</>}
        {data.step === 3 && <><h2 className="font-bold text-lg mb-2">Lập dàn ý của em</h2><p className="mb-3">Dựa vào các ý đã ghi, em tự sắp xếp theo trình tự.</p>{renderFields(data.outline, ['Mở đoạn – Giới thiệu đối tượng', 'Thân đoạn – Những đặc điểm nổi bật', 'Kết đoạn – Tình cảm của em'], 'outline')}</>}
        {data.step === 4 && <><h2 className="font-bold text-lg mb-2">Luyện tập trước khi viết</h2><p className="mb-2">Một số từ gợi ý: {current.words.join(', ')}. Em chỉ chọn từ phù hợp với quan sát của mình.</p>{renderFields(data.answers, current.questions, 'answers')}</>}
        {data.step === 5 && <><h2 className="font-bold text-lg mb-2">Em tự viết đoạn văn</h2><p className="mb-3">Viết theo dàn ý của em. Hãy sử dụng câu văn của chính mình, không chép nguyên gợi ý.</p><textarea rows={9} className={inputClass} value={data.writing} onChange={e => update({ writing: e.target.value })} placeholder="Em viết đoạn văn của mình tại đây..."/><p className="text-sm text-stone-600 mt-2">{data.writing.trim().length} ký tự</p></>}
        {data.step === 6 && <><h2 className="font-bold text-lg mb-2">Tự kiểm tra bài viết</h2><div className="rounded-xl bg-white p-3 whitespace-pre-wrap mb-4">{data.writing}</div>{['Bài viết đúng đối tượng em đã chọn.', 'Các câu được sắp xếp rõ ý, có dấu câu.', 'Em đã đọc lại và sửa những lỗi mình nhận thấy.'].map((label,i)=><label key={label} className="flex gap-3 items-start mb-3"><input type="checkbox" className="mt-1 h-5 w-5" checked={!!data.checklist[i]} onChange={e=>update({ checklist:data.checklist.map((v,j)=>i===j?e.target.checked:v) })}/><span>{label}</span></label>)}</>}
      </div>
      {feedback && <p role="status" className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900">{feedback}</p>}
      {data.completed && <div className="mb-4 flex items-center gap-2 text-emerald-800 font-bold"><CheckCircle2/> Đã hoàn thành bài học</div>}
      <div className="flex flex-wrap justify-between gap-2"><button disabled={!loaded || data.step===0} onClick={()=>{update({step:data.step-1})}} className="flex items-center gap-1 px-4 py-3 border rounded-xl font-semibold disabled:opacity-40"><ArrowLeft size={18}/> Trước</button><div className="flex gap-2"><button onClick={()=>{if(window.confirm('Em muốn bắt đầu lại bài học? Nội dung đã viết trên thiết bị này sẽ bị xóa.')){setData(blank());setFeedback('')}}} className="px-3 py-3 rounded-xl border" title="Làm lại"><RotateCcw size={18}/></button>{data.step<6?<button disabled={!loaded} onClick={()=>{if(canAdvance) update({step:data.step+1}); else setFeedback('Em hãy hoàn thành các ô trả lời trước khi tiếp tục nhé.')}} className="flex items-center gap-2 px-5 py-3 bg-emerald-700 text-white rounded-xl font-bold">Tiếp theo <ArrowRight size={18}/></button>:<button disabled={!loaded} onClick={finish} className="px-5 py-3 bg-emerald-700 text-white rounded-xl font-bold">Hoàn thành</button>}</div></div>
      <p role="status" className="mt-4 text-xs text-stone-600">{syncState}</p>
    </div>
  </section>;
};
