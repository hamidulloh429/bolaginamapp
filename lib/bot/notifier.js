import { InlineKeyboard } from 'grammy';
import { bot, getAdminIds } from './bot';
import { formatPrice } from '@/utils/formatPrice';

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
    .map(item => `- ${item.emoji || '🎁'} ${item.name} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`)
    .join('\n');

  const text = 
`🆕 *Yangi buyurtma! (#${order.id})*

👤 *Mijoz:* ${order.customer?.name || 'Kiritilmagan'}
☎️ *Telefon:* ${order.customer?.phone || 'Kiritilmagan'}
📍 *Manzil:* ${order.customer?.address || 'Kiritilmagan'}

🛒 *Mahsulotlar:*
${itemsList}

💰 *Umumiy:* ${formatPrice(order.total || 0)}`;

  const keyboard = new InlineKeyboard()
    .text("✅ Qabul qilish", `accept_${order.id}`)
    .text("❌ Bekor qilish", `cancel_${order.id}`);

  for (const adminId of adminIds) {
    try {
      await bot.api.sendMessage(adminId, text, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    } catch (err) {
      console.error(`Telegram ID ${adminId} ga xabar yuborishda xatolik:`, err.message);
    }
  }
}
