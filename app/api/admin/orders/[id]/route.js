import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import * as store from '@/lib/store';

export async function PUT(request, { params }) {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const { status } = await request.json();
  const updated = await store.updateOrderStatus(id, status);
  return NextResponse.json(updated);
}
