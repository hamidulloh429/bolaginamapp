import { InlineKeyboard } from 'grammy';
import { bot, getAdminIds } from './bot';
import { formatPrice } from '@/utils/formatPrice';

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Yangi buyurtma haqida barcha adminlarga Telegram orqali xabar yuboradi.
 */
export async function notifyAdminsAboutOrder(order) {
  const adminIds = getAdminIds();
  if (!adminIds.length) {
    console.warn("⚠️ ADMIN_IDS belgilanmagan, bildirishnoma yuborilmadi.");
    return;
  }

  const itemsList = (order.items || [])
    .map(item => `- ${item.emoji || '🎁'} ${escapeHtml(item.name)} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`)
    .join('\n');

  const text = 
`🆕 <b>Yangi buyurtma! (#${order.id})</b>

👤 <b>Mijoz:</b> ${escapeHtml(order.customer?.name || 'Kiritilmagan')}
☎️ <b>Telefon:</b> ${escapeHtml(order.customer?.phone || 'Kiritilmagan')}
📍 <b>Manzil:</b> ${escapeHtml(order.customer?.address || 'Kiritilmagan')}

🛒 <b>Mahsulotlar:</b>
${itemsList}

💰 <b>Umumiy:</b> ${formatPrice(order.total || 0)}`;

  const keyboard = new InlineKeyboard()
    .text("✅ Qabul qilish", `accept_${order.id}`)
    .text("❌ Bekor qilish", `cancel_${order.id}`);

  for (const adminId of adminIds) {
    try {
      await bot.api.sendMessage(adminId, text, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    } catch (err) {
      console.error(`Telegram ID ${adminId} ga xabar yuborishda xatolik:`, err.message || err);
    }
  }
}
