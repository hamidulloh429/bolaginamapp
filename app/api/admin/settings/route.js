import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import * as store from '@/lib/store';

export async function GET() {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const settings = store.getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request) {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const data = await request.json();
    const updated = store.updateSiteSettings(data);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
