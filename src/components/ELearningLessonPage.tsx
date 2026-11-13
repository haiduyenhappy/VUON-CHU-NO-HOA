import React, { useEffect, useMemo, useState, useRef } from 'react';
import { firebaseAuth } from '../lib/firebase';
import { buildDirections } from '../utils/eLearningContent';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, RotateCcw, Volume2 } from 'lucide-react';


type Progress = { step: number; direction: string; warmup?: string; chosenWords?: string[]; answers: string[]; ideas: string[]; outline: string[]; writing: string; checklist: boolean[]; completed: boolean };
const blank = (): Progress => ({ step: 0, direction: '', warmup: '', chosenWords: [], answers: ['', '', ''], ideas: ['', '', '', '', ''], outline: ['', '', ''], writing: '', checklist: [false, false, false], completed: false });
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
    if(!r.ok)throw Error();if(version===saveVersion.current){setSyncState('Đã lưu trên Firebase');setSavedVersion(version);}
  }catch(e){setSyncState('Lưu Firebase thất bại. Hãy giữ trang mở và thử lại.');}},850);
  return()=>clearTimeout(timer)},[data,loaded,assignment.id]);

  const update = (patch: Partial<Progress>) => { setData(old => ({ ...old, ...patch, completed: false })); setFeedback(''); };
  const availableDirections = useMemo(()=>buildDirections(assignment.prompt || '',assignment.eLearningDirections || [],assignment.eLearningActivities),[assignment.prompt,assignment.eLearningDirections,assignment.eLearningActivities]);
  const current = availableDirections.find(d=>d.id===data.direction) || availableDirections[0];
  const [showHints,setShowHints] = useState(false);
  const [showReview,setShowReview] = useState(false);
  const [savedVersion,setSavedVersion] = useState(0);
  const filled = (items: string[]) => items.every(v => v.trim().length >= 3);
  const canAdvance = useMemo(() => {
    switch (data.step) {
      case 0: return !!data.warmup?.trim();
      case 1: return availableDirections.some(d=>d.id===data.direction);
      case 2: return filled(data.ideas);
      case 3: return filled(data.outline);
      case 4: return filled(data.answers);
      case 5: return data.writing.trim().length >= (Number(assignment.grade) <= 2 ? 12 : 40);
      case 6: return data.checklist.every(Boolean);
      default: return false;
    }
  }, [data, availableDirections]);
  const speak = (message: string) => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(message); u.lang = 'vi-VN'; u.rate = 0.88; window.speechSynthesis.speak(u); } };
  const inputClass = 'w-full rounded-xl border-2 border-emerald-200 bg-white p-3 text-base text-stone-800 focus:outline-none focus:border-emerald-500';
  const renderFields = (values: string[], labels: string[], field: 'ideas' | 'outline' | 'answers') => labels.map((label, index) => <label key={`${field}-${index}`} className="block mb-3"><span className="block mb-1 font-semibold text-stone-700">{label}</span>{field==='ideas'&&showHints&&<span className="block text-sm text-emerald-800 mb-1">Gợi ý: Em quan sát hoặc nhớ lại một chi tiết thật về {label.toLowerCase()}.</span>}<textarea rows={2} className={inputClass} value={values[index] || ''} onChange={e => update({ [field]: values.map((v, i) => i === index ? e.target.value : v) } as Partial<Progress>)} placeholder="Em tự ghi ý của mình vào đây..." /></label>);
  const stageFeedback = () => {
    if (!canAdvance) {
      const messages = ['Em hãy chọn một điều mình muốn khám phá nhé.', 'Em hãy chọn một hướng viết trước nhé.', 'Em hãy ghi ý vào đủ 5 nhánh. Có thể bấm “Em cần gợi ý”.', 'Em hãy hoàn thành cả ba phần của dàn ý.', 'Em hãy trả lời đủ ba câu hỏi bằng ý của chính mình.', 'Em hãy viết thêm một chút để hoàn thành đoạn văn nhé.', 'Em hãy đọc lại bài và đánh dấu ba điều đã kiểm tra.'];
      setFeedback(messages[data.step] || 'Em hãy hoàn thành nhiệm vụ trước nhé.');return;
    }
    setFeedback('Tốt lắm! Em đã hoàn thành nhiệm vụ của chặng này.');
    update({step:data.step+1});
  };
  const finish = () => { if (canAdvance) { setData(old => ({ ...old, completed: true })); setFeedback('Em đã hoàn thành! Bài đang được lưu. Hãy chờ dòng “Đã lưu trên Firebase” trước khi rời trang.'); } else setFeedback('Em hãy kiểm tra đủ ba điều trước khi hoàn thành nhé.'); };
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
        {data.step === 0 && <><h2 className="font-bold text-lg mb-2">Cùng khám phá đề bài nhé!</h2><p className="mb-3">Em đọc tên bài và chọn một điều em muốn khám phá. Không có đáp án sai.</p><div className="grid sm:grid-cols-3 gap-2">{['Em muốn kể điều em nhớ', 'Em muốn tìm ý mới', 'Em muốn viết hay hơn'].map(t=><button key={t} type="button" onClick={()=>update({warmup:t})} className={`rounded-xl border-2 p-3 text-left ${data.warmup===t?'border-emerald-600 bg-emerald-100':'border-emerald-200 bg-white'}`}>{data.warmup===t?'✓ ':''}{t}</button>)}</div></>}
        {data.step === 1 && <><h2 className="font-bold text-lg mb-2">Đọc đề và chọn một hướng</h2><p className="mb-3">Đề bài: {assignment.prompt}</p><div className="grid sm:grid-cols-2 gap-3">{availableDirections.map(d => <button key={d.id} onClick={() => update({ direction: d.id, ideas: ['', '', '', '', ''], outline: ['', '', ''], answers: ['', '', ''] })} className={`rounded-xl border-2 p-4 text-left font-bold ${data.direction === d.id ? 'border-emerald-600 bg-white' : 'border-emerald-200 bg-white/70'}`}>{data.direction === d.id ? '✓ ' : ''}{d.name}</button>)}</div></>}
        {data.step === 2 && <><h2 className="font-bold text-lg mb-2">Sơ đồ 5 nhánh: {current.name}</h2><p className="mb-3">Mỗi nhánh ghi ít nhất một ý quan sát hoặc trải nghiệm thật của em.</p><button type="button" className="mb-3 rounded-lg bg-white border border-emerald-300 px-3 py-2 text-sm font-semibold" onClick={()=>setShowHints(x=>!x)}>{showHints?'Ẩn gợi ý':'Em cần gợi ý'}</button>{renderFields(data.ideas, current.branches, 'ideas')}</>}
        {data.step === 3 && <><h2 className="font-bold text-lg mb-2">Lập dàn ý của em</h2><p className="mb-3">Dựa vào các ý đã ghi, em tự sắp xếp theo trình tự. Những ý em vừa ghi:</p><div className="rounded-xl bg-white p-3 mb-3 text-sm">{data.ideas.map((idea,i)=><p key={i}><strong>{current.branches[i]}:</strong> {idea}</p>)}</div>{renderFields(data.outline, ['Mở đoạn – Giới thiệu đối tượng', 'Thân đoạn – Những đặc điểm nổi bật', 'Kết đoạn – Tình cảm của em'], 'outline')}</>}
        {data.step === 4 && <><h2 className="font-bold text-lg mb-2">Luyện tập trước khi viết</h2><p className="mb-2">Chạm vào những từ em muốn dùng, sau đó trả lời câu hỏi bằng lời của mình.</p><div className="flex flex-wrap gap-2 mb-3">{current.words.map(w=><button type="button" key={w} onClick={()=>update({chosenWords:(data.chosenWords||[]).includes(w)?(data.chosenWords||[]).filter(x=>x!==w):[...(data.chosenWords||[]),w]})} className={`rounded-full border px-3 py-2 ${data.chosenWords?.includes(w)?'bg-emerald-700 text-white':'bg-white border-emerald-300'}`}>{data.chosenWords?.includes(w)?'✓ ':''}{w}</button>)}</div><p className="text-sm mb-3 text-emerald-900">Từ em đã chọn: {(data.chosenWords||[]).join(', ')||'Chưa chọn từ nào (không bắt buộc).'}</p>{renderFields(data.answers, current.questions, 'answers')}</>}
        {data.step === 5 && <><h2 className="font-bold text-lg mb-2">Em tự viết đoạn văn</h2><p className="mb-3">Viết theo dàn ý của em. Hãy sử dụng câu văn của chính mình, không chép nguyên gợi ý.</p><textarea rows={9} className={inputClass} value={data.writing} onChange={e => update({ writing: e.target.value })} placeholder="Em viết đoạn văn của mình tại đây..."/><p className="text-sm text-stone-600 mt-2">{data.writing.trim().length} ký tự · {data.writing.trim()?data.writing.trim().split(/\s+/).length:0} từ</p><button type="button" className="mt-3 rounded-lg border border-emerald-300 bg-white px-3 py-2 font-semibold" onClick={()=>setShowReview(x=>!x)}>{showReview?'Ẩn bảng tự kiểm tra':'Em muốn tự kiểm tra'}</button>{showReview&&<div className="mt-3 rounded-xl bg-white p-3 text-sm space-y-1"><p>• Bài của em có đúng đối tượng đã chọn không?</p><p>• Em đã dùng dấu câu ở cuối câu chưa?</p><p>• Em có thể bổ sung một chi tiết thật của mình không?</p><p className="text-stone-500">Đây là câu hỏi tự kiểm tra, không phải chấm điểm tự động.</p></div>}</>}
        {data.step === 6 && <><h2 className="font-bold text-lg mb-2">Tự kiểm tra bài viết</h2><div className="rounded-xl bg-white p-3 whitespace-pre-wrap mb-4">{data.writing}</div>{['Bài viết đúng đối tượng em đã chọn.', 'Các câu được sắp xếp rõ ý, có dấu câu.', 'Em đã đọc lại và sửa những lỗi mình nhận thấy.'].map((label,i)=><label key={label} className="flex gap-3 items-start mb-3"><input type="checkbox" className="mt-1 h-5 w-5" checked={!!data.checklist[i]} onChange={e=>update({ checklist:data.checklist.map((v,j)=>i===j?e.target.checked:v) })}/><span>{label}</span></label>)}</>}
      </div>
      {feedback && <p role="status" className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900">{feedback}</p>}
      {data.completed && <div className="mb-4 flex items-center gap-2 text-emerald-800 font-bold"><CheckCircle2/> Đã hoàn thành bài học</div>}
      <div className="flex flex-wrap justify-between gap-2"><button disabled={!loaded || data.step===0} onClick={()=>{update({step:data.step-1})}} className="flex items-center gap-1 px-4 py-3 border rounded-xl font-semibold disabled:opacity-40"><ArrowLeft size={18}/> Trước</button><div className="flex gap-2"><button onClick={()=>{if(window.confirm('Em muốn bắt đầu lại bài học? Nội dung đã viết trên thiết bị này sẽ bị xóa.')){setData(blank());setFeedback('')}}} className="px-3 py-3 rounded-xl border" title="Làm lại"><RotateCcw size={18}/></button>{data.step<6?<button disabled={!loaded} onClick={stageFeedback} className="flex items-center gap-2 px-5 py-3 bg-emerald-700 text-white rounded-xl font-bold">Tiếp theo <ArrowRight size={18}/></button>:<button disabled={!loaded} onClick={finish} className="px-5 py-3 bg-emerald-700 text-white rounded-xl font-bold">Hoàn thành</button>}</div></div>
      <p role="status" className="mt-4 text-xs text-stone-600">{syncState}{data.completed && savedVersion===saveVersion.current?' · Có thể rời bài học':''}</p>
    </div>
  </section>;
};
