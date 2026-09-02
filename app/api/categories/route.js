import { NextResponse } from 'next/server';
import * as store from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const categories = store.getCategories();
  return NextResponse.json(categories);
}
