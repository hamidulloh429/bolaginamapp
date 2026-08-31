import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';

// In-memory active sessions store
const activeSessions = new Set();

/**
 * Yangi sessiya yaratish — tasodifiy token generatsiya qiladi
 */
export function createSession() {
  const token = crypto.randomUUID();
  activeSessions.add(token);
  return token;
}

/**
 * Sessiyani o'chirish
 */
export function deleteSession(token) {
  activeSessions.delete(token);
}

/**
 * Sessiya tokenini tekshirish
 */
export function isValidSession(token) {
  return token && activeSessions.has(token);
}

/**
 * API route'larda admin autentifikatsiyasini tekshirish.
 * Cookie'dan tokenni o'qib, valid ekanligini aniqlaydi.
 * @returns {boolean}
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
    maxAge: 60 * 60 * 24, // 24 soat
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
