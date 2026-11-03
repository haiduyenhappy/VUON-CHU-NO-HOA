import React, { useEffect, useMemo, useState } from 'react';
import { getManagedCurriculumTasks, saveManagedCurriculumTask, LOCAL_TASKS_EVENT, type ManagedWritingTask } from '../data/curriculumData';
import type { GardenType, EssayGenre } from '../types';

const lines = (v: string) => v.split('\n').map(s => s.trim()).filter(Boolean);
const listFields: { key: keyof ManagedWritingTask; label: string }[] = [
  { key: 'directions', label: '1. Các hướng viết (mỗi hướng một dòng)' },
  { key: 'requirements', label: '2. Yêu cầu cần đạt' },
  { key: 'suggestedQuestions', label: '3. Câu hỏi gợi ý' },
  { key: 'mindMap', label: '4. Sơ đồ tư duy (5 nhánh)' },
  { key: 'outline', label: '5. Dàn ý chi tiết (3 phần)' },
  { key: 'words', label: '6. Từ hay' },
  { key: 'images', label: '7. Hình ảnh sáng tạo' },
  { key: 'examples', label: '8. Câu mẫu' },
  { key: 'evaluationCriteria', label: '9. Tiêu chí đánh giá' }
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
  useEffect(() => { const refresh = () => setTasks(getManagedCurriculumTasks(true)); window.addEventListener(LOCAL_TASKS_EVENT, refresh); window.addEventListener('storage', refresh); return () => { window.removeEventListener(LOCAL_TASKS_EVENT, refresh); window.removeEventListener('storage', refresh); }; }, []);
  const visible = useMemo(() => tasks.filter(t => !!t.deleted === showDeleted && (!grade || t.grade === grade) && `${t.id} ${t.title} ${t.prompt}`.toLowerCase().includes(query.toLowerCase())), [tasks, query, grade, showDeleted]);
  const edit = (t: ManagedWritingTask) => { setDraft(JSON.parse(JSON.stringify(t))); setPreview(false); setMessage(''); };
  const change = (key: keyof ManagedWritingTask, value: unknown) => setDraft(prev => prev ? ({ ...prev, [key]: value }) : prev);
  const save = () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.prompt.trim()) { setMessage('Vui lòng nhập tên bài và đề bài.'); return; }
    if (draft.mindMap?.length && draft.mindMap.length !== 5) { setMessage('Nếu nhập sơ đồ tư duy, cần đúng 5 nhánh.'); return; }
    if (draft.outline?.length && draft.outline.length !== 3) { setMessage('Nếu nhập dàn ý, cần đúng 3 phần.'); return; }
    const updated = { ...draft, id: draft.id || `GV-${Date.now()}`, updatedAt: new Date().toISOString(), updatedBy: editorName };
    try { saveManagedCurriculumTask(updated); setDraft(updated); setMessage('Đã lưu vào ngân hàng đề trên trình duyệt này. Học sinh dùng cùng trình duyệt sẽ thấy đề cập nhật khi mở lại danh sách.'); }
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
    <div className="grid grid-cols-1 gap-5">
      <div className="max-h-[280px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 rounded-xl border p-2">{visible.map(t => <button key={t.id} className={`w-full text-left rounded-xl border p-3 ${draft?.id === t.id ? 'border-emerald-600 bg-emerald-50' : ''}`} onClick={() => edit(t)}><span className="text-xs text-stone-500">Lớp {t.grade} · {t.id} · Tập {t.volume}</span><div className="font-semibold">{t.title}</div><div className="text-sm line-clamp-2">{t.prompt}</div></button>)}{!visible.length && <p className="p-3">Không có bài phù hợp.</p>}</div>
      <div className="space-y-4 min-w-0">{draft ? <>
        <div className="flex justify-between items-center gap-2 sticky top-0 z-10 bg-white border-b pb-3"><strong>{draft.id ? `Chỉnh sửa ${draft.id}` : 'Thêm bài mới'}</strong><button className="rounded-xl border px-3 py-2" onClick={() => setPreview(v => !v)}>{preview ? 'Chỉnh sửa' : 'Xem trước'}</button></div>
        {preview ? <div className="rounded-xl bg-emerald-50 p-4 space-y-3"><strong>{draft.title}</strong><p>{draft.prompt}</p>{listFields.map(f => <div key={f.key}><strong>{f.label}</strong><ul className="list-disc pl-6">{((draft[f.key] as string[] | undefined) || []).map((s,i) => <li key={i}>{s}</li>)}</ul></div>)}</div> : <>
          <div className="grid grid-cols-2 gap-2"><label>Lớp<select className="w-full rounded-xl border p-3" value={draft.grade} onChange={e => change('grade', Number(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>Lớp {n}</option>)}</select></label><label>Tập<select className="w-full rounded-xl border p-3" value={draft.volume} onChange={e => change('volume', Number(e.target.value))}><option value={1}>Tập 1</option><option value={2}>Tập 2</option></select></label></div>
          <label className="block">Tên bài<input className="block w-full rounded-xl border p-3" value={draft.title} onChange={e => change('title', e.target.value)}/></label>
          <label className="block">Đề bài<textarea rows={3} className="block w-full rounded-xl border p-3" value={draft.prompt} onChange={e => change('prompt', e.target.value)}/></label>
          <label className="block">Thể loại<input className="block w-full rounded-xl border p-3" value={draft.genre || ''} onChange={e => change('genre', e.target.value as EssayGenre)}/></label>
          <label className="block">Vườn<select className="block w-full rounded-xl border p-3" value={draft.gardenType} onChange={e => change('gardenType', e.target.value as GardenType)}>{(['ke_chuyen','yeu_thuong','sac_mau','y_kien','cuoc_song'] as GardenType[]).map(g => <option key={g} value={g}>{g.replaceAll('_',' ')}</option>)}</select></label>
          {listFields.map(f => <label className="block" key={f.key}>{f.label}<textarea className="block w-full rounded-xl border p-3 text-base leading-relaxed" rows={f.key === 'mindMap' ? 5 : f.key === 'outline' ? 4 : 3} value={((draft[f.key] as string[] | undefined) || []).join('\n')} onChange={e => change(f.key, lines(e.target.value))}/></label>)}
        </>}
        <div className="sticky bottom-0 z-10 bg-white border-t py-3 flex flex-wrap gap-2"><button className="rounded-xl bg-emerald-700 px-5 py-3 text-white font-bold" onClick={save}>Lưu bài</button>{draft.id && <button className="rounded-xl border border-red-300 px-4 py-3 text-red-700" onClick={toggleDeleted}>{draft.deleted ? 'Khôi phục' : 'Xóa bài'}</button>}<button className="rounded-xl border px-4 py-3" onClick={() => setDraft(null)}>Đóng</button></div>
      </> : <p className="rounded-xl bg-stone-50 p-5">Chọn bài trong danh sách để xem và chỉnh sửa.</p>}</div>
    </div>
    {message && <p role="status" className="rounded-xl bg-amber-50 p-3 text-amber-900">{message}</p>}
  </section>;
};
