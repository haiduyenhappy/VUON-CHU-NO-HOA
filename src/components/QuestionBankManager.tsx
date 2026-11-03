import React, { useEffect, useMemo, useState } from 'react';

export interface EditableWritingTask {
  id: string;
  grade: number;
  title: string;
  prompt: string;
  genre: string;
  directions: string[];
  requirements: string[];
  mindMap: string[];
  outline: string[];
  words: string[];
  images: string[];
  examples: string[];
  updatedAt: string;
  updatedBy: string;
  deleted?: boolean;
}
const STORAGE_KEY = 'vcnh_question_bank_local_v1';
const emptyTask = (): EditableWritingTask => ({ id: '', grade: 1, title: '', prompt: '', genre: '', directions: [], requirements: [], mindMap: ['', '', '', '', ''], outline: ['', '', ''], words: [], images: [], examples: [], updatedAt: '', updatedBy: '' });
const splitLines = (s: string) => s.split('\n').map(v => v.trim()).filter(Boolean);
const fields: Array<{ key: keyof EditableWritingTask; title: string; hint: string }> = [
  { key: 'directions', title: 'Các hướng viết', hint: 'Mỗi hướng viết một dòng' },
  { key: 'requirements', title: 'Yêu cầu bổ sung', hint: 'Mỗi yêu cầu một dòng' },
  { key: 'mindMap', title: 'Sơ đồ tư duy – 5 nhánh', hint: 'Đúng 5 dòng, mỗi dòng là một nhánh' },
  { key: 'outline', title: 'Dàn ý chi tiết – 3 phần', hint: 'Đúng 3 dòng: mở đầu, nội dung, kết thúc (điều chỉnh theo thể loại)' },
  { key: 'words', title: 'Từ ngữ gợi ý', hint: 'Mỗi từ/cụm từ một dòng' },
  { key: 'images', title: 'Hình ảnh sáng tạo', hint: 'Mỗi hình ảnh một dòng' },
  { key: 'examples', title: 'Câu mẫu', hint: 'Mỗi câu một dòng' },
];
function readSaved(): EditableWritingTask[] {
  try { const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
}
export const QuestionBankManager: React.FC<{ editorName: string }> = ({ editorName }) => {
  const [tasks, setTasks] = useState<EditableWritingTask[]>(readSaved);
  const [selected, setSelected] = useState<string>('');
  const [draft, setDraft] = useState<EditableWritingTask | null>(null);
  const [query, setQuery] = useState('');
  const [grade, setGrade] = useState(0);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(false);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch { setMessage('Không đủ dung lượng lưu trên trình duyệt.'); } }, [tasks]);
  const visible = useMemo(() => tasks.filter(t => !t.deleted && (!grade || t.grade === grade) && `${t.title} ${t.prompt} ${t.id}`.toLowerCase().includes(query.toLowerCase())), [tasks, grade, query]);
  const startEdit = (t: EditableWritingTask) => { setDraft(JSON.parse(JSON.stringify(t))); setSelected(t.id); setPreview(false); setMessage(''); };
  const update = (key: keyof EditableWritingTask, value: any) => setDraft(prev => prev ? { ...prev, [key]: value } : prev);
  const save = () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.prompt.trim() || !draft.genre.trim()) { setMessage('Cần nhập tên bài, đề bài và thể loại.'); return; }
    if (draft.mindMap.filter(Boolean).length !== 5 || draft.outline.filter(Boolean).length !== 3) { setMessage('Sơ đồ phải có đúng 5 nhánh và dàn ý phải có đúng 3 phần.'); return; }
    const id = draft.id || `CUSTOM-${Date.now()}`;
    const next = { ...draft, id, title: draft.title.trim(), prompt: draft.prompt.trim(), updatedAt: new Date().toISOString(), updatedBy: editorName };
    setTasks(prev => prev.some(t => t.id === id) ? prev.map(t => t.id === id ? next : t) : [...prev, next]);
    setDraft(next); setSelected(id); setMessage('Đã lưu trên trình duyệt này. Chưa đồng bộ Google Sheets/Firebase.');
  };
  const remove = (id: string) => {
    if (!window.confirm('Chuyển bài này vào mục đã xóa?')) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, deleted: true, updatedAt: new Date().toISOString(), updatedBy: editorName } : t));
    setDraft(null); setSelected(''); setMessage('Đã chuyển vào mục đã xóa.');
  };
  return <section className="space-y-4 rounded-2xl border border-emerald-200 bg-white p-4 sm:p-6">
    <h3 className="text-xl font-bold text-emerald-900">Ngân hàng đề – Thêm, xem, sửa, xóa</h3>
    <p className="text-sm text-amber-800">Bản bước 1: dữ liệu được lưu trên trình duyệt đang sử dụng; chưa tự đồng bộ với ngân hàng đề gốc, học sinh, Google Sheets hoặc Firebase.</p>
    <div className="flex flex-wrap gap-2">
      <button className="rounded-xl bg-emerald-700 px-4 py-2 text-white font-bold" onClick={() => { setDraft(emptyTask()); setSelected(''); setMessage(''); }}>+ Thêm bài</button>
    </div>
    <div className="flex flex-wrap gap-2">
      <input className="min-w-0 flex-1 rounded-xl border p-3" placeholder="Tìm tên bài, mã bài, nội dung đề..." value={query} onChange={e => setQuery(e.target.value)} />
      <select className="rounded-xl border p-3" value={grade} onChange={e => setGrade(Number(e.target.value))}><option value={0}>Tất cả lớp</option>{[1,2,3,4,5].map(g => <option key={g} value={g}>Lớp {g}</option>)}</select>
    </div>
    <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)]">
      <div className="max-h-[550px] space-y-2 overflow-y-auto rounded-xl border p-2">
        {visible.length === 0 && <p className="p-3 text-sm text-stone-600">Chưa có bài lưu trong trình duyệt. Chọn “Thêm bài” để bắt đầu.</p>}
        {visible.map(t => <button key={t.id} className={`block w-full rounded-xl border p-3 text-left ${selected === t.id ? 'border-emerald-600 bg-emerald-50' : 'bg-white'}`} onClick={() => startEdit(t)}><span className="text-xs text-stone-500">Lớp {t.grade} · {t.id}</span><div className="font-semibold">{t.title}</div><div className="line-clamp-2 text-sm text-stone-600">{t.prompt}</div></button>)}
      </div>
      <div className="space-y-3 min-w-0">
        {!draft ? <p className="rounded-xl bg-stone-50 p-5">Chọn một bài bên trái hoặc thêm bài mới để chỉnh sửa.</p> : <>
          <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-bold">{draft.id ? 'Chỉnh sửa bài' : 'Tạo bài mới'}</h4><button className="rounded-lg border px-3 py-2" onClick={() => setPreview(!preview)}>{preview ? 'Quay lại chỉnh sửa' : 'Xem trước'}</button></div>
          {preview ? <div className="space-y-3 rounded-xl bg-emerald-50 p-4"><h4 className="text-lg font-bold">{draft.title}</h4><p>{draft.prompt}</p>{fields.map(f => <div key={f.key}><strong>{f.title}</strong><ul className="list-disc pl-6">{(draft[f.key] as string[]).map((s,i) => <li key={i}>{s}</li>)}</ul></div>)}</div> : <>
            <label className="block text-sm font-semibold">Lớp<select className="mt-1 block w-full rounded-xl border p-3" value={draft.grade} onChange={e => update('grade', Number(e.target.value))}>{[1,2,3,4,5].map(g => <option key={g} value={g}>Lớp {g}</option>)}</select></label>
            {(['title','prompt','genre'] as const).map(k => <label className="block text-sm font-semibold" key={k}>{k === 'title' ? 'Tên bài' : k === 'prompt' ? 'Đề bài' : 'Thể loại'}<textarea className="mt-1 block w-full rounded-xl border p-3 font-normal" rows={k === 'prompt' ? 3 : 1} value={draft[k]} onChange={e => update(k, e.target.value)} /></label>)}
            {fields.map(f => <label key={f.key} className="block text-sm font-semibold">{f.title}<span className="block text-xs font-normal text-stone-500">{f.hint}</span><textarea className="mt-1 block w-full rounded-xl border p-3 font-normal" rows={f.key === 'mindMap' ? 5 : 3} value={(draft[f.key] as string[]).join('\n')} onChange={e => update(f.key, splitLines(e.target.value))} /></label>)}
          </>}
          <div className="flex flex-wrap gap-2"><button className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white" onClick={save}>Lưu bài</button>{draft.id && <button className="rounded-xl border border-red-300 px-4 py-3 text-red-700" onClick={() => remove(draft.id)}>Xóa bài</button>}<button className="rounded-xl border px-4 py-3" onClick={() => { setDraft(null); setSelected(''); }}>Đóng</button></div>
        </>}
      </div>
    </div>
    {message && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}
  </section>;
};
