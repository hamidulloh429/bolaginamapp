import { NextResponse } from 'next/server';
import * as store from '@/lib/store';

export async function GET() {
  const settings = store.getSiteSettings();
  return NextResponse.json(settings);
}
