import { webhookCallback } from 'grammy';
import { bot } from '@/lib/bot/bot';

const handleUpdate = webhookCallback(bot, 'std/http');

export async function POST(request) {
  try {
    return await handleUpdate(request);
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response("Error", { status: 500 });
  }
}

export async function GET() {
  return new Response("BOLAGINAM Telegram Webhook Active", { status: 200 });
}
