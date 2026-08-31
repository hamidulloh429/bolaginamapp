import { Bot, InlineKeyboard } from 'grammy';
import * as store from '@/lib/store';

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.warn("⚠️ BOT_TOKEN o'rnatilmagan! Telegram bot ishlamaydi.");
}

export const bot = new Bot(botToken || 'placeholder');

// Admin ID'lar ro'yxatini olish
export function getAdminIds() {
  const raw = process.env.ADMIN_IDS || '';
  return raw.split(',').map(id => id.trim()).filter(Boolean);
}

// /start komandasi
bot.command('start', async (ctx) => {
  const webAppUrl = process.env.WEBAPP_URL || 'http://localhost:3000';
  const userId = String(ctx.from?.id || '');
  const adminIds = getAdminIds();

  const keyboard = new InlineKeyboard()
    .webApp("🧸 Do'konni ochish", webAppUrl);

  if (adminIds.includes(userId)) {
    keyboard.row().url("⚙️ Admin panel", `${webAppUrl}/admin`);
  }

  await ctx.reply(
    "👋 *BOLAGINAM* do'konimiz rasmiy botiga xush kelibsiz!\n\n" +
    "Kichkintoyingiz uchun eng sara, xavfsiz va quvonchli o'yinchoqlarni xarid qilish uchun quyidagi tugmani bosing:",
    { reply_markup: keyboard, parse_mode: 'Markdown' }
  );
});

// ✅ Buyurtmani qabul qilish callback'i
bot.callbackQuery(/^accept_(\d+)$/, async (ctx) => {
  const orderId = Number(ctx.match[1]);
  const updated = store.updateOrderStatus(orderId, 'tayyorlanmoqda');

  if (updated) {
    await ctx.answerCallbackQuery({ text: `Buyurtma #${orderId} qabul qilindi! ✅` });
    try {
      const originalText = ctx.callbackQuery.message?.text || '';
      await ctx.editMessageText(
        `${originalText}\n\n✅ *STATUS:* Qabul qilindi (Tayyorlanmoqda)`,
        { parse_mode: 'Markdown' }
      );
    } catch (e) {
      console.error("Xabar tahrirlashda xatolik:", e);
    }
  } else {
    await ctx.answerCallbackQuery({ text: "Buyurtma topilmadi yoki allaqachon o'zgartirilgan!" });
  }
});

// ❌ Buyurtmani bekor qilish callback'i
bot.callbackQuery(/^cancel_(\d+)$/, async (ctx) => {
  const orderId = Number(ctx.match[1]);
  const updated = store.updateOrderStatus(orderId, 'bekor');

  if (updated) {
    await ctx.answerCallbackQuery({ text: `Buyurtma #${orderId} bekor qilindi! ❌` });
    try {
      const originalText = ctx.callbackQuery.message?.text || '';
      await ctx.editMessageText(
        `${originalText}\n\n❌ *STATUS:* Bekor qilindi`,
        { parse_mode: 'Markdown' }
      );
    } catch (e) {
      console.error("Xabar tahrirlashda xatolik:", e);
    }
  } else {
    await ctx.answerCallbackQuery({ text: "Buyurtma topilmadi yoki allaqachon o'zgartirilgan!" });
  }
});
