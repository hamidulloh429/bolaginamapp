import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import * as store from '@/lib/store';

export async function GET() {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const products = store.getProducts();
  return NextResponse.json(products);
}

export async function POST(request) {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await request.json();
  const newProduct = store.addProduct(data);
  try {
    revalidatePath('/');
    revalidatePath('/products');
  } catch (e) {
    console.error("Revalidation error:", e);
  }
  return NextResponse.json(newProduct, { status: 201 });
}
