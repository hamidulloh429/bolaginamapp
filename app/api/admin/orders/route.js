import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import * as store from '@/lib/store';

export async function GET() {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await store.syncFromBlob();
  const orders = store.getOrders();
  return NextResponse.json(orders);
}
