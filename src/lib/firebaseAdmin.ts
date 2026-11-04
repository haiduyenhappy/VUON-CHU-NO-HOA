import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let firestoreConfigured = false;

function initializeFirebaseAdmin() {
  if (getApps().length > 0) return;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const credential = raw ? cert(JSON.parse(raw)) : applicationDefault();
  initializeApp({ credential, projectId: 'vuon-chu-no-hoa-7e8d8' });
}

export function getFirebaseAdminAuth() {
  initializeFirebaseAdmin();
  return getAuth();
}

export function getFirebaseAdminFirestore() {
  initializeFirebaseAdmin();
  const db = getFirestore();
  if (!firestoreConfigured) {
    db.settings({ ignoreUndefinedProperties: true });
    firestoreConfigured = true;
  }
  return db;
}
