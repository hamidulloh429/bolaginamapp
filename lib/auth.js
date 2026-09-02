import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';

const SECRET_KEY = process.env.ADMIN_PANEL_PASSWORD || 'bolaginam_secret_session_key_2026';

function getSignedToken() {
  return crypto.createHmac('sha256', SECRET_KEY).update('admin_authenticated_session').digest('hex');
}

/**
 * Yangi sessiya yaratish — signed token qaytaradi (Serverless bilan 100% mos)
 */
export function createSession() {
  return getSignedToken();
}

/**
 * Sessiyani o'chirish
 */
export function deleteSession(token) {
  // Stateless token
}

/**
 * Sessiya tokenini tekshirish
 */
export function isValidSession(token) {
  if (!token) return false;
  const expected = getSignedToken();
  return token === expected;
}

/**
 * API route'larda admin autentifikatsiyasini tekshirish.
 * @returns {Promise<boolean>}
 */
export async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return isValidSession(token);
  } catch {
    return false;
  }
}

/**
 * Sessiya cookie parametrlari
 */
export function getSessionCookie(token) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 kun
  };
}

/**
 * Cookie'ni o'chirish uchun parametrlar
 */
export function getDeleteCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  };
}

export { COOKIE_NAME };
