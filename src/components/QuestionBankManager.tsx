import { recognizeVietnameseImages } from '../utils/browserOcr';
import React, { useEffect, useMemo, useState } from 'react';
import { getManagedCurriculumTasks, saveManagedCurriculumTask, LOCAL_TASKS_EVENT, type ManagedWritingTask } from '../data/curriculumData';
import type { GardenType, EssayGenre, PromptAnalysisData } from '../types';
import { analyzePromptSemantics } from '../utils/promptAnalyzerEngine';
import { getWritingWishes } from '../utils/writingWishEngine';

const lines = (v: string) => v.split('\n').map(s => s.trim()).filter(Boolean);
const listFields: { key: keyof ManagedWritingTask; label: string }[] = [
  { key: 'suggestedQuestions', label: 'Câu hỏi gợi ý' },
  { key: 'evaluationCriteria', label: 'Tiêu chí đánh giá' },
  { key: 'directions', label: 'Các hướng viết' },
  { key: 'requirements', label: 'Yêu cầu bổ sung' },
  { key: 'quickWishes', label: 'Gợi ý chọn nhanh cho học sinh' },
  { key: 'mindMap', label: 'Sơ đồ tư duy (5 nhánh)' },
  { key: 'outline', label: 'Dàn ý (3 phần)' },
  { key: 'words', label: 'Từ hay' },
  { key: 'images', label: 'Hình ảnh sáng tạo' },
  { key: 'examples', label: 'Câu mẫu' }
];
// Các gợi ý an toàn cho đề kể hoạt động cùng người thân; không tự thêm yêu cầu số câu.
const familyActivitySupport = (prompt: string) => {
  const p = prompt.toLocaleLowerCase('vi');
  if (!/(hoạt động|việc làm)/.test(p) || !/(bố|mẹ|ông|bà|anh chị|người thân)/.test(p)) return null;
  return {
    questions: ['Em đã làm hoạt động gì cùng người thân?', 'Ai đã cùng em tham gia?', 'Hoạt động diễn ra ở đâu và khi nào?', 'Mọi người đã làm những việc gì?', 'Khoảnh khắc nào khiến em nhớ nhất?', 'Em cảm thấy thế nào sau hoạt động ấy?'],
    branches: ['Thời gian và địa điểm\nHoạt động diễn ra khi nào?\nHoạt động diễn ra ở đâu?', 'Người thân tham gia\nEm đã làm cùng ai?\nMỗi người tham gia thế nào?', 'Diễn biến hoạt động\nHoạt động bắt đầu ra sao?\nEm và người thân đã làm những gì?', 'Khoảnh khắc đáng nhớ\nĐiều gì khiến em vui hoặc xúc động?\nMọi người phản ứng thế nào?', 'Cảm xúc và ý nghĩa\nEm cảm thấy ra sao?\nEm trân trọng điều gì?'],
    outline: ['Giới thiệu hoạt động em đã làm cùng người thân.\nNêu người cùng tham gia, thời gian hoặc địa điểm nếu em nhớ.', 'Kể hoạt động bắt đầu như thế nào.\nKể lần lượt những việc em và người thân đã làm.\nChọn một khoảnh khắc em nhớ nhất để kể rõ hơn.', 'Nêu cảm xúc của em sau hoạt động.\nChia sẻ điều làm em trân trọng người thân.'],
    words: ['vui vẻ: thể hiện niềm vui khi cùng làm việc', 'ấm áp: cảm giác được quan tâm, gần gũi', 'háo hức: mong chờ một hoạt động', 'gắn bó: tình cảm gần gũi giữa người thân'],
    images: ['Nụ cười của người thân trong lúc cùng làm việc', 'Ánh mắt động viên hoặc cử chỉ quan tâm'],
    examples: ['Em nhớ nhất khoảnh khắc cả nhà cùng nhau hoàn thành công việc.', 'Hoạt động ấy khiến em cảm thấy gần gũi với người thân hơn.'],
    criteria: ['Kể đúng một hoạt động cùng người thân theo yêu cầu đề.', 'Các việc được kể theo trình tự dễ hiểu.', 'Có chi tiết thực tế và cảm xúc của bản thân.', 'Dùng từ và viết câu phù hợp với lớp học.']
  };
};
// Chỉ tạo nội dung mẫu khi xác định chắc chắn dạng đề; không suy đoán yêu cầu SGK.
const sportsActivitySupport = (prompt: string) => {
  const p = prompt.toLocaleLowerCase('vi');
  if (!/(thể thao|trò chơi|vui chơi)/.test(p) || !/(tham gia|đã chơi|hoạt động)/.test(p)) return null;
  return {
    questions: ['Em đã tham gia hoạt động thể thao hoặc trò chơi nào?', 'Hoạt động diễn ra ở đâu và khi nào?', 'Ai cùng tham gia với em?', 'Em đã làm gì lúc bắt đầu?', 'Trong lúc tham gia, điều gì khiến em nhớ nhất?', 'Kết thúc hoạt động, em cảm thấy thế nào?'],
    branches: ['Thời gian và địa điểm\nHoạt động diễn ra khi nào?\nỞ đâu?', 'Người cùng tham gia\nEm chơi cùng ai?\nMọi người làm gì?', 'Bắt đầu hoạt động\nEm chuẩn bị những gì?\nHoạt động bắt đầu ra sao?', 'Diễn biến và kết quả\nEm đã làm những gì?\nĐiều gì đáng nhớ nhất?', 'Cảm xúc và ý nghĩa\nEm cảm thấy thế nào?\nEm học được điều gì?'],
    outline: ['Giới thiệu tên hoạt động thể thao hoặc trò chơi em đã tham gia.\nNêu thời gian, địa điểm hoặc người tham gia nếu em nhớ.', 'Kể hoạt động bắt đầu như thế nào.\nKể những việc em trực tiếp tham gia theo trình tự.\nChọn một chi tiết đáng nhớ hoặc kết quả để kể rõ.', 'Nêu cảm xúc sau hoạt động.\nChia sẻ điều em thích hoặc bài học em rút ra.'],
    words: ['hào hứng: mong chờ được tham gia', 'sôi nổi: không khí vui và náo nhiệt', 'phấn khởi: cảm giác vui sau hoạt động', 'đoàn kết: cùng nhau hợp tác'],
    images: ['Tiếng cổ vũ vang lên quanh sân chơi', 'Những nụ cười sau khi hoạt động kết thúc'],
    examples: ['Em rất hào hứng khi được tham gia hoạt động cùng các bạn.', 'Sau hoạt động, em cảm thấy vui và thêm yêu những giờ sinh hoạt tập thể.'],
    criteria: ['Kể đúng hoạt động thể thao hoặc trò chơi đã tham gia.', 'Nêu rõ các việc theo trình tự dễ hiểu.', 'Có chi tiết thực tế và cảm xúc của bản thân.', 'Dùng từ và viết câu phù hợp trình độ lớp học.']
  };
};
const newTask = (): ManagedWritingTask => ({ id: '', grade: 3, volume: 1, week: 1, title: '', prompt: '', gardenType: 'ke_chuyen', genre: 'ke_su_viec', suggestedQuestions: [], evaluationCriteria: [] });
export const QuestionBankManager: React.FC<{ editorName: string }> = ({ editorName }) => {
  const [tasks, setTasks] = useState<ManagedWritingTask[]>(() => getManagedCurriculumTasks(true));
  const [draft, setDraft] = useState<ManagedWritingTask | null>(null);
  const [query, setQuery] = useState('');
  const [grade, setGrade] = useState(0);
  const [showDeleted, setShowDeleted] = useState(false);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [readingImage, setReadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [generated, setGenerated] = useState(false);
  const selectImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setMessage('Vui lòng chọn ảnh JPG, PNG hoặc WEBP.'); return; }
    if (file.size > 8 * 1024 * 1024) { setMessage('Ảnh quá lớn. Vui lòng chọn ảnh dưới 8 MB.'); return; }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setGenerated(false);
    setMessage('Đã chọn ảnh. Cô chọn lớp, tập rồi bấm Tạo bài.');
  };
  const generateFromImage = async () => {
    if (!draft || !selectedImage || readingImage) {
      setMessage('Cô chọn ảnh đề bài trước khi bấm Tạo bài.'); return;
    }
    setReadingImage(true);
    setMessage('Đang đọc ảnh và tạo thông tin bài học…');
    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Không mở được ảnh.'));
        reader.readAsDataURL(selectedImage);
      });
      const prompt = (await recognizeVietnameseImages([imageData])).trim();
      if (!prompt) throw new Error('Ảnh chưa nhận dạng được chữ. Cô thử ảnh rõ hơn.');
      const title = prompt.split(/\n/).map(v => v.trim()).find(Boolean)?.slice(0, 100) || 'Bài viết mới';
      const next: ManagedWritingTask = {
        ...draft, title, prompt,
        quickWishes: getWritingWishes({ prompt, grade: draft.grade }),
        suggestedQuestions: [], directions: [], requirements: [], mindMap: [], outline: [],
        words: [], images: [], examples: [], evaluationCriteria: []
      };
      setDraft(next);
      setGenerated(true);
      setMessage('Đã nhận dạng đề bài. Cô kiểm tra nội dung và các gợi ý bên dưới trước khi lưu.');
      await loadActualContent(next);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không đọc được ảnh. Cô thử ảnh rõ hơn.');
    } finally { setReadingImage(false); }
  };
  useEffect(() => { const refresh = () => setTasks(getManagedCurriculumTasks(true)); window.addEventListener(LOCAL_TASKS_EVENT, refresh); window.addEventListener('storage', refresh); return () => { window.removeEventListener(LOCAL_TASKS_EVENT, refresh); window.removeEventListener('storage', refresh); }; }, []);
  const visible = useMemo(() => tasks.filter(t => !!t.deleted === showDeleted && (!grade || t.grade === grade) && `${t.id} ${t.title} ${t.prompt}`.toLowerCase().includes(query.toLowerCase())), [tasks, query, grade, showDeleted]);
  const loadActualContent = async (task: ManagedWritingTask) => {
    if (!task.prompt.trim()) return;
    const fill = (existing: string[] | undefined, incoming: string[]) =>
      existing?.some(v => v.trim()) ? existing : incoming.filter(v => v.trim());
    const semantic = analyzePromptSemantics(task.prompt, task.grade);
    const semanticDirections = semantic.detectedDirections?.map(d => d.title?.trim()).filter(Boolean) || [];
    const defaultDirection = semantic.coreSubject || task.prompt;
    // Không để trống hướng viết khi đề chỉ có một hướng.
    setDraft(prev => prev?.id === task.id && prev.prompt === task.prompt
      ? { ...prev, directions: fill(prev.directions, semanticDirections.length ? semanticDirections : [defaultDirection]) }
      : prev);
    const alreadyComplete = task.suggestedQuestions?.some(Boolean) && task.mindMap?.filter(Boolean).length === 5 &&
      task.outline?.filter(Boolean).length === 3 && task.words?.some(Boolean) &&
      task.images?.some(Boolean) && task.examples?.some(Boolean);
    if (alreadyComplete) return;
    const family = familyActivitySupport(task.prompt) || sportsActivitySupport(task.prompt);
    if (family) setDraft(prev => prev?.prompt === task.prompt ? {
      ...prev, suggestedQuestions: fill(prev.suggestedQuestions, family.questions),
      mindMap: fill(prev.mindMap, family.branches), outline: fill(prev.outline, family.outline),
      words: fill(prev.words, family.words), images: fill(prev.images, family.images),
      examples: fill(prev.examples, family.examples), evaluationCriteria: fill(prev.evaluationCriteria, family.criteria)
    } : prev);
    setLoadingContent(true);
    setMessage('Đang tạo gợi ý theo đúng đề bài...');
    try {
      const response = await fetch('/api/ai/analyze-prompt-deep', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: task.prompt, grade: task.grade, difficultyLevel: 'co_ban',
          specialWishes: (task.requirements || []).join('. ') })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: PromptAnalysisData = await response.json();
      const branches = (data.branches || []).map(branch =>
        [branch.title || branch.name, ...(branch.points || branch.items || [])].filter(Boolean).join('\n'));
      const sections = data.outline?.sections || [];
      const sectionTexts = sections.map(section =>
        [section.title, section.guide || section.guideNote,
          ...(section.bullets || section.bulletPoints || [])].filter(Boolean).join('\n'));
      const baseOutline = [data.outline?.moDoan || [], data.outline?.phatTrienDoan || [],
        data.outline?.ketDoan || []].map(lines => lines.join('\n'));
      // Một số dạng bài (ví dụ thư) có trên 3 mục. Giữ đủ nội dung bằng cách
      // gom phần giữa vào mục 2, không âm thầm bỏ bớt.
      const outline = sections.length === 3 ? sectionTexts : sections.length > 3
        ? [sectionTexts[0], sectionTexts.slice(1, -1).join('\n'), sectionTexts[sectionTexts.length - 1]]
        : baseOutline.some(Boolean) ? baseOutline : sectionTexts;
      const bank = data.vocabularySuggestions;
      const generatedDirections = (data.detectedDirections || []).map(d => d.title?.trim()).filter(Boolean) as string[];
      setDraft(prev => prev?.id === task.id && prev.prompt === task.prompt ? {
        ...prev,
        directions: fill(prev.directions, generatedDirections.length ? generatedDirections :
          [data.writingScope || semantic.writingScope || data.coreSubject || semantic.coreSubject]),
        requirements: fill(prev.requirements, (data.specificRequirements || []).filter(v => task.prompt.toLocaleLowerCase('vi').includes(v.toLocaleLowerCase('vi')))),
        mindMap: fill(prev.mindMap, branches.length === 5 ? branches : []),
        outline: fill(prev.outline, outline.length === 3 ? outline : []),
        words: fill(prev.words, (bank?.goodWords || []).map(w => `${w.word}: ${w.meaningAndUsage}`)),
        images: fill(prev.images, (bank?.imageries || []).map(i => `${i.type}: ${i.example} — ${i.explanation}`)),
        examples: fill(prev.examples, (bank?.sampleSentences || []).map(e =>
          `${e.label}: ${e.sentence} — ${e.whyItIsGood}`))
      } : prev);
      setMessage('Đã nạp nội dung. Cô kiểm tra từng mục trước khi lưu.');
    } catch {
      setMessage(family ? 'Đã tạo gợi ý theo dạng đề được nhận diện. Cô kiểm tra và chỉnh sửa trước khi lưu.' : 'Chưa tạo đủ gợi ý: bộ phân tích đề không phản hồi. Cô kiểm tra nội dung trước khi lưu.');
    } finally { setLoadingContent(false); }
  };
  const edit = (t: ManagedWritingTask) => {
    const copy = JSON.parse(JSON.stringify(t)) as ManagedWritingTask;
    setDraft(copy); setPreview(false); setMessage(''); setImagePreview('');
    setSelectedImage(null); setGenerated(!!copy.id);
    if (copy.id) void loadActualContent(copy);
  };
  const change = (key: keyof ManagedWritingTask, value: unknown) => setDraft(prev => prev ? ({ ...prev, [key]: value }) : prev);
  const generateQuickWishes = () => {
    if (!draft?.prompt.trim()) { setMessage('Cô nhập đề bài trước khi tạo gợi ý.'); return; }
    const suggestions = getWritingWishes({ prompt: draft.prompt, grade: draft.grade });
    setDraft(prev => prev ? { ...prev, quickWishes: suggestions } : prev);
    setMessage('Đã tạo gợi ý theo đề bài. Cô có thể chỉnh sửa trước khi lưu.');
  };

  const save = () => {
    if (!draft) return;
    if (!draft.id && !generated) { setMessage('Cô hãy tạo bài từ ảnh trước khi lưu.'); return; }
    if (draft.mindMap?.filter(Boolean).length !== 5 || draft.outline?.filter(Boolean).length !== 3 || !draft.suggestedQuestions?.some(Boolean) || !draft.words?.some(Boolean) || !draft.evaluationCriteria?.some(Boolean)) { setMessage('Chưa đủ 5 nhánh, 3 phần dàn ý, câu hỏi gợi ý, từ ngữ hoặc tiêu chí đánh giá. Cô kiểm tra trước khi lưu.'); return; }
    if (!draft.title.trim() || !draft.prompt.trim()) { setMessage('Vui lòng nhập tên bài và đề bài.'); return; }
    
    
    const updated = { ...draft, id: draft.id || `GV-${Date.now()}`, updatedAt: new Date().toISOString(), updatedBy: editorName };
    try { saveManagedCurriculumTask(updated); setDraft(updated); setMessage('Đã lưu bài.'); }
    catch { setMessage('Không lưu được dữ liệu trên trình duyệt.'); }
  };
  const toggleDeleted = () => {
    if (!draft?.id) return;
    const next = { ...draft, deleted: !draft.deleted, updatedAt: new Date().toISOString(), updatedBy: editorName };
    try { saveManagedCurriculumTask(next); setDraft(null); setMessage(next.deleted ? 'Đã chuyển vào mục đã xóa.' : 'Đã khôi phục bài.'); } catch { setMessage('Không lưu được thay đổi.'); }
  };
  return <section className="space-y-4 rounded-2xl border border-emerald-200 bg-white p-4 sm:p-6">
    <h3 className="text-xl font-bold text-emerald-900">Ngân hàng đề lớp 1–5 – Quản lý bài tập</h3>
    <div className="flex flex-wrap gap-2"><button className="rounded-xl bg-emerald-700 px-4 py-2 text-white font-bold" onClick={() => edit(newTask())}>+ Thêm bài</button><button className="rounded-xl border px-4 py-2" onClick={() => { setShowDeleted(v => !v); setDraft(null); }}>{showDeleted ? 'Xem bài đang dùng' : 'Xem bài đã xóa'}</button></div>
    <div className="flex flex-wrap gap-2"><input className="min-w-0 flex-1 rounded-xl border p-3" placeholder="Tìm theo mã, tên hoặc nội dung đề..." value={query} onChange={e => setQuery(e.target.value)}/><select className="rounded-xl border p-3" value={grade} onChange={e => setGrade(Number(e.target.value))}><option value={0}>Tất cả lớp</option>{[1,2,3,4,5].map(n => <option key={n} value={n}>Lớp {n}</option>)}</select></div>
    <p className="text-sm text-stone-600">Tìm thấy {visible.length} bài.</p>
    <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)]">
      <div className="max-h-[600px] overflow-y-auto space-y-2 rounded-xl border p-2">{visible.map(t => <button key={t.id} className={`w-full text-left rounded-xl border p-3 ${draft?.id === t.id ? 'border-emerald-600 bg-emerald-50' : ''}`} onClick={() => edit(t)}><span className="text-xs text-stone-500">Lớp {t.grade} · {t.id} · Tập {t.volume}</span><div className="font-semibold">{t.title}</div><div className="text-sm line-clamp-2">{t.prompt}</div></button>)}{!visible.length && <p className="p-3">Không có bài phù hợp.</p>}</div>
      <div className="space-y-3 min-w-0">{draft ? <>
        <div className="flex justify-between items-center gap-2"><strong>{draft.id ? `Chỉnh sửa ${draft.id}` : 'Thêm bài mới'}</strong><button className="rounded-xl border px-3 py-2" disabled={!draft.id && !generated} onClick={() => setPreview(v => !v)}>{preview ? 'Chỉnh sửa' : 'Xem trước'}</button></div>
                 {!draft.id && !generated && !preview && <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-4">
           <h4 className="text-lg font-bold text-emerald-900">Tạo bài từ ảnh SGK</h4>
           <label className="block font-semibold text-emerald-900" htmlFor="vcnh-task-image">1. Chụp hoặc tải ảnh đề bài</label>
           <input id="vcnh-task-image" type="file" accept="image/*" className="block w-full rounded-xl border bg-white p-3" disabled={readingImage}
             onChange={e => { selectImage(e.target.files?.[0]); e.target.value = ''; }} />
           {imagePreview && <img src={imagePreview} alt="Ảnh đề bài vừa chọn" className="max-h-56 w-auto max-w-full rounded-xl border object-contain" />}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             <label className="font-semibold">2. Chọn lớp<select className="mt-1 w-full rounded-xl border bg-white p-3" value={draft.grade} onChange={e => change('grade', Number(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>Lớp {n}</option>)}</select></label>
             <label className="font-semibold">3. Chọn tập<select className="mt-1 w-full rounded-xl border bg-white p-3" value={draft.volume} onChange={e => change('volume', Number(e.target.value))}><option value={1}>Tập 1</option><option value={2}>Tập 2</option></select></label>
           </div>
           <button type="button" disabled={!selectedImage || readingImage} onClick={() => void generateFromImage()} className="w-full rounded-xl bg-emerald-700 px-5 py-3 text-lg font-bold text-white disabled:opacity-50">{readingImage ? 'Đang tạo bài…' : '✨ Tạo bài'}</button>
           <p className="text-sm text-stone-600">Các thông tin và gợi ý sẽ xuất hiện bên dưới sau khi tạo bài.</p>
         </div>}
         {!draft.id && generated && imagePreview && <img src={imagePreview} alt="Ảnh đề bài" className="max-h-48 max-w-full rounded-xl border object-contain" />}
{loadingContent && <p role="status" className="rounded-xl bg-sky-50 p-3 text-sky-900">Đang tải nội dung bài từ bộ phân tích đề…</p>}
        {(!!draft.id || generated) && (preview ? <div className="rounded-xl bg-emerald-50 p-4 space-y-3"><strong>{draft.title}</strong><p>{draft.prompt}</p>{listFields.map(f => <div key={f.key}><strong>{f.label}</strong><ul className="list-disc pl-6">{((draft[f.key] as string[] | undefined) || []).map((s,i) => <li key={i}>{s}</li>)}</ul></div>)}</div> : <>
          <div className="rounded-2xl border border-pink-200 bg-white p-4 space-y-3">
            <h4 className="text-lg font-bold">✏️ 1. Đề bài của con</h4>
            <label className="block font-semibold">Tên bài<input className="mt-1 block w-full rounded-xl border p-3 font-normal" value={draft.title} onChange={e => change('title',e.target.value)}/></label>
            <label className="block font-semibold">Nội dung đề bài<textarea rows={4} className="mt-1 block w-full rounded-xl border p-3 font-normal" value={draft.prompt} onChange={e => change('prompt',e.target.value)}/></label>
            <p className="text-sm text-stone-600">Cô kiểm tra nội dung nhận dạng từ ảnh. Nếu sửa đề, bấm “Tạo lại gợi ý” để cập nhật nội dung theo đề mới.</p>
            <button type="button" disabled={loadingContent} className="rounded-xl border border-violet-300 px-4 py-2 font-semibold text-violet-800" onClick={() => { if (!draft.prompt.trim()) { setMessage('Cô nhập đề bài trước.'); return; } const t = {...draft, suggestedQuestions: [], directions: [], requirements: [], mindMap: [], outline: [], words: [], images: [], examples: [], evaluationCriteria: []}; setDraft(t); void loadActualContent(t); }}>Tạo lại gợi ý theo đề đã sửa</button>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-white p-4 space-y-3">
            <h4 className="text-lg font-bold">📚 2. Chọn khối lớp và tập</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><label className="font-semibold">Lớp<select className="mt-1 block w-full rounded-xl border p-3" value={draft.grade} onChange={e => change('grade',Number(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>Lớp {n}</option>)}</select></label><label className="font-semibold">Tập<select className="mt-1 block w-full rounded-xl border p-3" value={draft.volume} onChange={e => change('volume',Number(e.target.value))}><option value={1}>Tập 1</option><option value={2}>Tập 2</option></select></label></div>
          </div>
          <div className="rounded-2xl border border-pink-200 bg-pink-50/30 p-4 space-y-3">
            <h4 className="text-lg font-bold">🌟 3. Con muốn bài viết của mình có điều gì đặc biệt?</h4>
            <label className="block font-semibold">Gợi ý chọn nhanh cho học sinh<textarea rows={4} className="mt-1 block w-full rounded-xl border p-3 font-normal" value={(draft.quickWishes || []).join('\n')} onChange={e => change('quickWishes',lines(e.target.value))}/></label>
            <button type="button" className="rounded-xl bg-violet-700 px-4 py-2 text-white font-semibold" onClick={generateQuickWishes}>Tạo gợi ý chọn nhanh</button>
            <label className="block font-semibold">Mong muốn của học sinh<input className="mt-1 block w-full rounded-xl border p-3 font-normal" value={draft.defaultWish || ''} placeholder="Viết đúng yêu cầu đề bài, dùng lời văn tự nhiên." onChange={e => change('defaultWish',e.target.value)}/></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{['Cơ bản','Mở rộng','Nâng cao','Sáng tạo'].map((name,n) => <label key={name} className="rounded-xl border bg-white p-3 font-semibold">{name}<input className="mt-2 block w-full rounded-lg border p-2 font-normal" value={draft.difficultyOptions?.[n] ?? ['Chuẩn SGK','Thêm quan sát','Từ ngữ gợi cảm','Ý tưởng mới lạ'][n]} onChange={e => { const a=[...(draft.difficultyOptions || ['Chuẩn SGK','Thêm quan sát','Từ ngữ gợi cảm','Ý tưởng mới lạ'])]; a[n]=e.target.value; change('difficultyOptions',a); }}/></label>)}</div>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50/30 p-4 space-y-3">
            <h4 className="text-lg font-bold text-violet-900">🌸 4. Hoa Nhỏ cùng con hiểu đề</h4>
            <p className="text-sm">Đề gốc: {draft.prompt}</p>
            {listFields.filter(f => ['directions','requirements','suggestedQuestions'].includes(f.key)).map(f => <label key={f.key} className="block font-semibold">{f.label}<textarea rows={4} className="mt-1 block w-full rounded-xl border bg-white p-3 font-normal" value={((draft[f.key] as string[] | undefined) || []).join('\n')} onChange={e => change(f.key,lines(e.target.value))}/></label>)}
            <p className="text-sm text-stone-600">Không tự đặt thêm số câu hoặc yêu cầu không có trong đề.</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-white p-4 space-y-3">
            <h4 className="text-lg font-bold">🗺️ 5. Sơ đồ tư duy 5 nhánh – Tỏa sáng ý tưởng</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">{[0,1,2,3,4].map(n => <label key={n} className={`rounded-xl border-2 p-3 ${['border-emerald-200 bg-emerald-50','border-violet-200 bg-violet-50','border-amber-200 bg-amber-50','border-sky-200 bg-sky-50','border-rose-200 bg-rose-50'][n]}`}><strong>Nhánh {n+1}</strong><textarea rows={8} className="mt-2 block w-full rounded-lg border bg-white p-2" value={(draft.mindMap || [])[n] || ''} onChange={e => {const a=[...(draft.mindMap || [])]; while(a.length<5)a.push(''); a[n]=e.target.value; change('mindMap',a);}}/></label>)}</div>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white p-4 space-y-3">
            <h4 className="text-lg font-bold">📋 6. Dàn ý chi tiết các phần của bài</h4>
            <div className="space-y-3">{['Phần 1 – Mở đầu','Phần 2 – Nội dung chính','Phần 3 – Kết thúc'].map((name,n) => <label key={n} className="block rounded-xl border border-emerald-200 bg-emerald-50 p-3 font-semibold">{name}<textarea rows={5} className="mt-2 block w-full rounded-lg border bg-white p-3 font-normal" value={(draft.outline || [])[n] || ''} onChange={e => {const a=[...(draft.outline || [])];while(a.length<3)a.push('');a[n]=e.target.value;change('outline',a);}}/></label>)}</div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4 space-y-3">
            <h4 className="text-lg font-bold">🌼 7. Hoa Nhỏ khơi mở trải nghiệm thật của con</h4>
            <p className="text-sm text-stone-600">Những câu hỏi này giúp học sinh tự nhớ lại trải nghiệm, không viết bài thay học sinh.</p>
            <div className="space-y-2">{(draft.suggestedQuestions || []).map((q,n) => <p key={n} className="rounded-xl border bg-white p-3">{n+1}. {q}</p>)}{!draft.suggestedQuestions?.length && <p className="text-amber-800">Chưa có câu hỏi khơi mở phù hợp; cô cần bổ sung trước khi lưu.</p>}</div>
          </div>
          <div className="rounded-2xl border border-pink-200 bg-white p-4 space-y-3">
            <h4 className="text-lg font-bold">🌸 8. Kho từ ngữ và hình ảnh sáng tạo</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">{listFields.filter(f => ['words','images','examples'].includes(f.key)).map(f => <label key={f.key} className="rounded-xl border bg-pink-50 p-3 font-semibold">{f.label}<textarea rows={7} className="mt-2 block w-full rounded-lg border bg-white p-3 font-normal" value={((draft[f.key] as string[] | undefined) || []).join('\n')} onChange={e => change(f.key,lines(e.target.value))}/></label>)}</div>
            <label className="block font-semibold">Tiêu chí đánh giá<textarea rows={4} className="mt-1 block w-full rounded-xl border p-3 font-normal" value={(draft.evaluationCriteria || []).join('\n')} onChange={e => change('evaluationCriteria',lines(e.target.value))}/></label>
          </div>
        </>)}
        {(!!draft.id || generated) && <div className="flex flex-wrap gap-2"><button className="rounded-xl bg-emerald-700 px-5 py-3 text-white font-bold" onClick={save}>Lưu bài</button>{draft.id && <button className="rounded-xl border border-red-300 px-4 py-3 text-red-700" onClick={toggleDeleted}>{draft.deleted ? 'Khôi phục' : 'Xóa bài'}</button>}<button className="rounded-xl border px-4 py-3" onClick={() => setDraft(null)}>Đóng</button></div>}
      </> : <p className="rounded-xl bg-stone-50 p-5">Chọn bài trong danh sách để xem và chỉnh sửa.</p>}</div>
    </div>
    {message && <p role="status" className="rounded-xl bg-amber-50 p-3 text-amber-900">{message}</p>}
  </section>;
};
