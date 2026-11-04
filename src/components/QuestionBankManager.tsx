import React, { useEffect, useMemo, useState } from 'react';
import { getManagedCurriculumTasks, saveManagedCurriculumTask, LOCAL_TASKS_EVENT, type ManagedWritingTask } from '../data/curriculumData';
import type { GardenType, EssayGenre, PromptAnalysisData } from '../types';
import { analyzePromptSemantics } from '../utils/promptAnalyzerEngine';

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
  const importImage = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setMessage('Vui lòng chọn tệp ảnh.'); return; }
    if (file.size > 8 * 1024 * 1024) { setMessage('Ảnh quá lớn. Vui lòng chọn ảnh dưới 8 MB.'); return; }
    setReadingImage(true);
    setMessage('');
    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Không mở được ảnh.'));
        reader.readAsDataURL(file);
      });
      setImagePreview(imageData);
      const response = await fetch('/api/ai/import-writing-task-image', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData, grade: draft?.grade || 3 })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không đọc được nội dung trong ảnh.');
      if (!data.prompt || !String(data.prompt).trim()) throw new Error('Chưa nhận diện được đề bài.');
      const fields = ['directions','requirements','quickWishes','suggestedQuestions','mindMap','outline','words','images','examples','evaluationCriteria'] as const;
      setDraft(prev => {
        const next: ManagedWritingTask = { ...(prev || newTask()),
          title: String(data.title || prev?.title || '').trim(),
          prompt: String(data.prompt).trim() };
        if (Number.isInteger(data.grade) && data.grade >= 1 && data.grade <= 5) next.grade = data.grade;
        for (const key of fields) {
          if (Array.isArray(data[key])) (next as any)[key] = data[key].filter((v: unknown) => typeof v === 'string').map((v: string) => v.trim());
        }
        return next;
      });
      setMessage('Đã đọc ảnh. Cô xem và chỉnh sửa nội dung trước khi lưu bài.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không đọc được ảnh.');
    } finally { setReadingImage(false); }
  };
  useEffect(() => { const refresh = () => setTasks(getManagedCurriculumTasks(true)); window.addEventListener(LOCAL_TASKS_EVENT, refresh); window.addEventListener('storage', refresh); return () => { window.removeEventListener(LOCAL_TASKS_EVENT, refresh); window.removeEventListener('storage', refresh); }; }, []);
  const visible = useMemo(() => tasks.filter(t => !!t.deleted === showDeleted && (!grade || t.grade === grade) && `${t.id} ${t.title} ${t.prompt}`.toLowerCase().includes(query.toLowerCase())), [tasks, query, grade, showDeleted]);
  const loadActualContent = async (task: ManagedWritingTask) => {
    if (!task.prompt.trim()) return;
    const fill = (existing: string[] | undefined, incoming: string[]) =>
      existing?.some(v => v.trim()) ? existing : incoming.filter(v => v.trim());
    const semantic = analyzePromptSemantics(task.prompt, task.grade);
    const semanticDirections = semantic.detectedDirections?.map(d =>
      [d.title, d.scope].filter(Boolean).join(' – ')) || [];
    const defaultDirection = [semantic.coreSubject, semantic.writingScope].filter(Boolean).join(' – ');
    // Không để trống hướng viết khi đề chỉ có một hướng.
    setDraft(prev => prev?.id === task.id && prev.prompt === task.prompt
      ? { ...prev, directions: fill(prev.directions, semanticDirections.length ? semanticDirections : [defaultDirection]) }
      : prev);
    const alreadyComplete = task.mindMap?.filter(Boolean).length === 5 &&
      task.outline?.filter(Boolean).length === 3 && task.words?.some(Boolean) &&
      task.images?.some(Boolean) && task.examples?.some(Boolean);
    if (alreadyComplete) return;
    setLoadingContent(true);
    setMessage('Đang nạp nội dung bài theo đúng đề gốc...');
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
      const generatedDirections = (data.detectedDirections || []).map(d =>
        [d.title, d.scope].filter(Boolean).join(' – '));
      setDraft(prev => prev?.id === task.id && prev.prompt === task.prompt ? {
        ...prev,
        directions: fill(prev.directions, generatedDirections.length ? generatedDirections :
          [data.writingScope || semantic.writingScope || data.coreSubject || semantic.coreSubject]),
        requirements: fill(prev.requirements, data.specificRequirements || []),
        mindMap: fill(prev.mindMap, branches.length === 5 ? branches : []),
        outline: fill(prev.outline, outline.length === 3 ? outline : []),
        words: fill(prev.words, (bank?.goodWords || []).map(w => `${w.word}: ${w.meaningAndUsage}`)),
        images: fill(prev.images, (bank?.imageries || []).map(i => `${i.type}: ${i.example} — ${i.explanation}`)),
        examples: fill(prev.examples, (bank?.sampleSentences || []).map(e =>
          `${e.label}: ${e.sentence} — ${e.whyItIsGood}`))
      } : prev);
      setMessage('');
    } catch {
      setMessage('Không kết nối được bộ phân tích đề. Hướng viết cơ bản đã nạp; dàn ý chưa có dữ liệu, không tự tạo nội dung giả.');
    } finally { setLoadingContent(false); }
  };
  const edit = (t: ManagedWritingTask) => {
    const copy = JSON.parse(JSON.stringify(t)) as ManagedWritingTask;
    setDraft(copy); setPreview(false); setMessage(''); setImagePreview('');
    void loadActualContent(copy);
  };
  const change = (key: keyof ManagedWritingTask, value: unknown) => setDraft(prev => prev ? ({ ...prev, [key]: value }) : prev);
  const save = () => {
    if (!draft) return;
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
        <div className="flex justify-between items-center gap-2"><strong>{draft.id ? `Chỉnh sửa ${draft.id}` : 'Thêm bài mới'}</strong><button className="rounded-xl border px-3 py-2" onClick={() => setPreview(v => !v)}>{preview ? 'Chỉnh sửa' : 'Xem trước'}</button></div>
        {!draft.id && <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
          <label className="block font-semibold text-emerald-900" htmlFor="vcnh-task-image">Tải ảnh đề bài</label>
          <input id="vcnh-task-image" type="file" accept="image/*" className="block w-full rounded-xl border bg-white p-3" disabled={readingImage}
            onChange={e => { void importImage(e.target.files?.[0]); e.target.value = ''; }} />
          {readingImage && <p role="status" className="text-emerald-800">Đang đọc đề bài và chuẩn bị các mục để cô kiểm tra…</p>}
          {imagePreview && <img src={imagePreview} alt="Ảnh đề bài vừa tải lên" className="max-h-48 w-auto max-w-full rounded-xl border object-contain" />}
        </div>}
        {loadingContent && <p role="status" className="rounded-xl bg-sky-50 p-3 text-sky-900">Đang tải nội dung bài từ bộ phân tích đề…</p>}
        {preview ? <div className="rounded-xl bg-emerald-50 p-4 space-y-3"><strong>{draft.title}</strong><p>{draft.prompt}</p>{listFields.map(f => <div key={f.key}><strong>{f.label}</strong><ul className="list-disc pl-6">{((draft[f.key] as string[] | undefined) || []).map((s,i) => <li key={i}>{s}</li>)}</ul></div>)}</div> : <>
          <div className="grid grid-cols-2 gap-2"><label>Lớp<select className="w-full rounded-xl border p-3" value={draft.grade} onChange={e => change('grade', Number(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>Lớp {n}</option>)}</select></label><label>Tập<select className="w-full rounded-xl border p-3" value={draft.volume} onChange={e => change('volume', Number(e.target.value))}><option value={1}>Tập 1</option><option value={2}>Tập 2</option></select></label></div>
          <label className="block">Tên bài<input className="block w-full rounded-xl border p-3" value={draft.title} onChange={e => change('title', e.target.value)}/></label>
          <label className="block">Đề bài<textarea rows={3} className="block w-full rounded-xl border p-3" value={draft.prompt} onChange={e => change('prompt', e.target.value)}/></label>
          <label className="block">Thể loại<input className="block w-full rounded-xl border p-3" value={draft.genre || ''} onChange={e => change('genre', e.target.value as EssayGenre)}/></label>
          <label className="block">Vườn<select className="block w-full rounded-xl border p-3" value={draft.gardenType} onChange={e => change('gardenType', e.target.value as GardenType)}>{(['ke_chuyen','yeu_thuong','sac_mau','y_kien','cuoc_song'] as GardenType[]).map(g => <option key={g} value={g}>{g.replaceAll('_',' ')}</option>)}</select></label>
          <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/30 p-4 space-y-3">
            <h4 className="text-lg font-bold text-violet-900">🌸 Các hướng viết và yêu cầu của đề</h4>
            {listFields.filter(f => ['directions','requirements','suggestedQuestions','quickWishes'].includes(f.key)).map(f => <label className="block font-semibold" key={f.key}>{f.label}<textarea className="mt-1 block w-full rounded-xl border p-3 font-normal" rows={3} value={((draft[f.key] as string[] | undefined) || []).join('\n')} onChange={e => change(f.key, lines(e.target.value))}/></label>)}
          </div>
          <div className="rounded-2xl border-2 border-pink-200 bg-pink-50/30 p-4 space-y-3">
            <h4 className="text-lg font-bold text-pink-900">🌟 3. Con muốn bài viết của mình có điều gì đặc biệt?</h4>
            <p className="text-sm text-stone-600">Các gợi ý chọn nhanh được nhập ở phần trên, mỗi dòng một gợi ý. Giáo viên có thể chỉnh sửa nội dung mặc định và tên các mức độ.</p>
            <label className="block font-semibold">Nội dung mặc định trong ô mong muốn của học sinh
              <input className="mt-1 block w-full rounded-xl border bg-white p-3 font-normal" value={draft.defaultWish ?? ''} placeholder="Viết đúng yêu cầu đề bài, dùng lời văn tự nhiên." onChange={e => change('defaultWish', e.target.value)}/>
            </label>
            <div className="space-y-2"><strong>Mức độ thử thách rèn luyện</strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Cơ bản','Mở rộng','Nâng cao','Sáng tạo'].map((name, n) => <label key={name} className="block rounded-xl border bg-white p-3 font-semibold">{name}
                  <input className="mt-1 block w-full rounded-lg border p-2 font-normal" value={draft.difficultyOptions?.[n] ?? ['Chuẩn SGK','Thêm quan sát','Từ ngữ gợi cảm','Ý tưởng mới lạ'][n]} onChange={e => { const next = [...(draft.difficultyOptions || ['Chuẩn SGK','Thêm quan sát','Từ ngữ gợi cảm','Ý tưởng mới lạ'])]; next[n] = e.target.value; change('difficultyOptions', next); }}/>
                </label>)}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-violet-200 p-4 space-y-3">
            <h4 className="text-lg font-bold text-violet-900">🗺️ Sơ đồ tư duy 5 nhánh – Tỏa sáng ý tưởng</h4>
            <p className="text-sm text-stone-600">Giáo viên chỉnh sửa nội dung từng nhánh. Mỗi nhánh có thể chứa nhiều ý, mỗi ý một dòng.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">{[0,1,2,3,4].map((n) => <label key={n} className={`block rounded-xl border-2 p-3 ${['border-emerald-200 bg-emerald-50','border-violet-200 bg-violet-50','border-amber-200 bg-amber-50','border-sky-200 bg-sky-50','border-rose-200 bg-rose-50'][n]}`}><strong>Nhánh {n+1}</strong><textarea rows={7} className="mt-2 block w-full rounded-lg border p-2 bg-white text-sm" placeholder={`Tên nhánh ${n+1} và các ý liên quan`} value={(draft.mindMap || [])[n] || ''} onChange={e => { const next = [...(draft.mindMap || [])]; while(next.length < 5) next.push(''); next[n] = e.target.value; change('mindMap',next); }}/></label>)}</div>
          </div>
          <div className="rounded-2xl border-2 border-emerald-200 p-4 space-y-3">
            <h4 className="text-lg font-bold text-emerald-900">📋 Dàn ý chi tiết các phần của bài</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">{['Phần 1 – Mở đầu','Phần 2 – Nội dung chính','Phần 3 – Kết thúc'].map((label,n) => <label key={n} className="block rounded-xl bg-emerald-50 p-3"><strong>{label}</strong><textarea rows={6} className="mt-2 block w-full rounded-lg border bg-white p-3" value={(draft.outline || [])[n] || ''} onChange={e => { const next = [...(draft.outline || [])]; while(next.length < 3) next.push(''); next[n] = e.target.value; change('outline',next); }}/></label>)}</div>
          </div>
          <div className="rounded-2xl border-2 border-pink-200 p-4 space-y-3">
            <h4 className="text-lg font-bold text-pink-900">🌸 Kho từ ngữ và hình ảnh sáng tạo</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">{listFields.filter(f => ['words','images','examples'].includes(f.key)).map(f => <label key={f.key} className="block rounded-xl bg-pink-50 p-3"><strong>{f.label}</strong><textarea rows={6} className="mt-2 block w-full rounded-lg border bg-white p-3" value={((draft[f.key] as string[] | undefined) || []).join('\n')} onChange={e => change(f.key, lines(e.target.value))}/></label>)}</div>
          </div>
          <div className="rounded-2xl border p-4"><label className="block font-semibold">Tiêu chí đánh giá<textarea className="mt-2 block w-full rounded-xl border p-3 font-normal" rows={4} value={(draft.evaluationCriteria || []).join('\n')} onChange={e => change('evaluationCriteria',lines(e.target.value))}/></label></div>
        </>}
        <div className="flex flex-wrap gap-2"><button className="rounded-xl bg-emerald-700 px-5 py-3 text-white font-bold" onClick={save}>Lưu bài</button>{draft.id && <button className="rounded-xl border border-red-300 px-4 py-3 text-red-700" onClick={toggleDeleted}>{draft.deleted ? 'Khôi phục' : 'Xóa bài'}</button>}<button className="rounded-xl border px-4 py-3" onClick={() => setDraft(null)}>Đóng</button></div>
      </> : <p className="rounded-xl bg-stone-50 p-5">Chọn bài trong danh sách để xem và chỉnh sửa.</p>}</div>
    </div>
    {message && <p role="status" className="rounded-xl bg-amber-50 p-3 text-amber-900">{message}</p>}
  </section>;
};
