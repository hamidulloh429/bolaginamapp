/**
 * Narxni "so'm" formatida chiqaradi (Server va Client hydration xatolarisiz).
 * 89000 → "89 000 so'm"
 */
export function formatPrice(price) {
  const safePrice = Number(price) || 0;
  const formatted = Math.round(safePrice)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} so'm`;
}
