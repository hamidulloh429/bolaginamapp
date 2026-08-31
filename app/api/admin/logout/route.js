import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession, getDeleteCookie, COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) deleteSession(token);
    
    const response = NextResponse.json({ success: true });
    response.cookies.set(getDeleteCookie());
    return response;
  } catch {
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
