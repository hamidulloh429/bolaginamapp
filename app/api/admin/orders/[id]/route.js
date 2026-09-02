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

export async function DELETE(request, { params }) {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const success = await store.deleteOrder(id);
  if (!success) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
