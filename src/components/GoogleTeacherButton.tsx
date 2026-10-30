import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseAuth } from '../lib/firebase';
import type { AuthUser } from '../types';

type Props = { onLoginSuccess: (user: AuthUser) => void };

export function GoogleTeacherButton({ onLoginSuccess }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const login = async () => {
    setBusy(true);
    setError('');
    try {
      const credential = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      const idToken = await credential.user.getIdToken();
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Tài khoản chưa được cấp quyền giáo viên.');
      onLoginSuccess({
        role: 'teacher',
        teacherId: data.teacherId,
        teacherRole: data.teacherRole,
        teacherName: data.teacherName,
        assignedClassIds: data.assignedClassIds,
        teacherProfile: data.teacherProfile,
        token: idToken,
      });
    } catch (e) {
      await signOut(firebaseAuth).catch(() => {});
      setError(e instanceof Error ? e.message : 'Đăng nhập Google thất bại.');
    } finally { setBusy(false); }
  };
  return <div className="mt-3">
    <button type="button" disabled={busy} onClick={login} className="w-full rounded-2xl border-2 border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-800 hover:bg-stone-50 disabled:opacity-60">
      {busy ? 'Đang xác thực Google…' : 'Tiếp tục với Google'}
    </button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>;
}
