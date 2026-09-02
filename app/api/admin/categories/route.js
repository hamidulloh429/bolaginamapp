import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import * as store from '@/lib/store';

export async function GET() {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await store.syncFromBlob();
  const categories = store.getCategories();
  return NextResponse.json(categories);
}

export async function POST(request) {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await request.json();
  const newCategory = await store.addCategory(data);
  return NextResponse.json(newCategory, { status: 201 });
}
