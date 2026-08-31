import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import * as store from '@/lib/store';

export async function PUT(request, { params }) {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const data = await request.json();
  const updatedProduct = store.updateProduct(id, data);
  if (!updatedProduct) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    revalidatePath('/');
    revalidatePath('/products');
  } catch (e) {
    console.error("Revalidation error:", e);
  }
  return NextResponse.json(updatedProduct);
}

export async function DELETE(request, { params }) {
  const isAuthed = await verifyAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const success = store.deleteProduct(id);
  if (!success) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    revalidatePath('/');
    revalidatePath('/products');
  } catch (e) {
    console.error("Revalidation error:", e);
  }
  return NextResponse.json({ success: true });
}
