import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export function getFirebaseAdminAuth() {
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (raw) {
      const credentials = JSON.parse(raw);
      initializeApp({ credential: cert(credentials), projectId: 'vuon-chu-no-hoa-7e8d8' });
    } else {
      initializeApp({ credential: applicationDefault(), projectId: 'vuon-chu-no-hoa-7e8d8' });
    }
  }
  return getAuth();
}
