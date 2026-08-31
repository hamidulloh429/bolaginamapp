import dotenv from 'dotenv';
import path from 'path';

// .env.local faylini yuklash
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Core bot moduli
const { bot } = await import('../lib/bot/bot.js');

console.log("🤖 BOLAGINAM Telegram boti ishga tushmoqda (Polling rejimida)...");

bot.start({
  onStart: (botInfo) => {
    console.log(`✅ Bot muvaffaqiyatli ishga tushdi: @${botInfo.username}`);
    console.log("Press Ctrl+C to stop.");
  },
});
