import { NextResponse } from 'next/server';
import * as store from '@/lib/store';
import { notifyAdminsAboutOrder } from '@/lib/bot/notifier';

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name || !data.phone || !data.address || !data.items?.length) {
      return NextResponse.json({ error: "Ma'lumotlar to'liq emas" }, { status: 400 });
    }

    const order = await store.addOrder(data);

    try {
      await notifyAdminsAboutOrder(order);
    } catch (err) {
      console.error("Telegram bildirishnoma yuborishda xatolik:", err);
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

export async function GET() {
  await store.syncFromBlob();
  const orders = store.getOrders();
  return NextResponse.json(orders);
}
