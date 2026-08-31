'use client';

import Link from 'next/link';
import CartItem from '@/components/CartItem/CartItem';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import styles from './page.module.css';

export default function CartPage() {
  const { items, cartCount, cartTotal } = useCart();

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Savatingiz</h1>
      
      {items.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyEmoji}>🛒</span>
          <p className={styles.emptyText}>Savatingiz hali bo'sh</p>
          <Link href="/products" className={styles.shopBtn}>
            Xarid boshlash
          </Link>
        </div>
      ) : (
        <>
          <p className={styles.count}>{cartCount} ta mahsulot</p>
          
          <div className={styles.list}>
            {items.map(item => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
          
          <div className={styles.summary}>
            <div>
              <span className={styles.totalLabel}>Jami summa:</span>
              <div className={styles.totalAmount}>{formatPrice(cartTotal)}</div>
            </div>
            
            <Link href="/checkout" className={styles.checkoutBtn}>
              Buyurtma berish
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
