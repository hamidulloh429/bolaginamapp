import { NextResponse } from 'next/server';
import { createSession, getSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const expectedPassword = process.env.ADMIN_PANEL_PASSWORD || 'bolaginam2024';
    
    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Noto'g'ri parol" }, { status: 401 });
    }
    
    const token = createSession();
    const cookie = getSessionCookie(token);
    const response = NextResponse.json({ success: true });
    response.cookies.set(cookie);
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
