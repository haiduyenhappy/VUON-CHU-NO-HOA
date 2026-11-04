import { collection, doc, onSnapshot, setDoc, getDoc, runTransaction, type Unsubscribe } from 'firebase/firestore';
import { firebaseAuth, firestore } from './firebase';
import { readTaskOverrides, setRemoteTaskOverrides, type ManagedWritingTask } from '../data/curriculumData';

const COLLECTION = 'vcnh_curriculum_overrides_v1';
const taskKey = (task: ManagedWritingTask) => `${task.grade}_${task.id}`;
export function subscribeCurriculum(onError: (error: string) => void): Unsubscribe {
  if (!firestore) { onError('Firebase chưa được cấu hình. Không thể đồng bộ bài tập giữa các thiết bị.'); return () => {}; }
  return onSnapshot(collection(firestore, COLLECTION), snapshot => {
    const items: Record<string, ManagedWritingTask> = {};
    snapshot.forEach(item => { const data = item.data(); if (typeof data.id === 'string' && `${data.grade}_${data.id}` === item.id) items[item.id] = data as ManagedWritingTask; });
    setRemoteTaskOverrides(items);
  }, error => onError(`Không đọc được ngân hàng đề trên Firebase: ${error.message}`));
}
export async function saveCurriculumToCloud(task: ManagedWritingTask): Promise<void> {
  if (!firestore || !firebaseAuth?.currentUser) throw new Error('Cần đăng nhập Firebase bằng tài khoản giáo viên được cấp quyền để lưu đồng bộ.');
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(task.id)) throw new Error('Mã đề không hợp lệ.');
  await setDoc(doc(firestore, COLLECTION, taskKey(task)), JSON.parse(JSON.stringify(task)));
}
export async function importLocalEditsToCloud(): Promise<{ imported: number; skipped: number }> {
  if (!firestore || !firebaseAuth?.currentUser) throw new Error('Cần đăng nhập Firebase bằng tài khoản giáo viên được cấp quyền.');
  let imported = 0, skipped = 0;
  for (const task of Object.values(readTaskOverrides())) {
    if (!task?.id || !/^[a-zA-Z0-9_-]{1,100}$/.test(task.id)) { skipped++; continue; }
    const reference = doc(firestore, COLLECTION, taskKey(task));
    // Tuyệt đối không ghi đè bản đã được giáo viên khác lưu trên Firestore.
    // Create-only transaction: a second device cannot overwrite a newer teacher edit.
    const created = await runTransaction(firestore, async tx => {
      const existing = await tx.get(reference);
      if (existing.exists()) return false;
      tx.set(reference, JSON.parse(JSON.stringify(task)));
      return true;
    });
    if (created) imported++; else skipped++;
  }
  return { imported, skipped };
}
