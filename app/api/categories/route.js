import { NextResponse } from 'next/server';
import * as store from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  await store.syncFromBlob();
  const categories = store.getCategories();
  return NextResponse.json(categories);
}
