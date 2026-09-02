import { NextResponse } from 'next/server';
import * as store from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  await store.syncFromBlob();
  const products = store.getProducts();
  return NextResponse.json(products);
}
