'use client';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import Link from 'next/link';
import styles from './CartItem.module.css';

const categoryColors = {
  'yumshoq': '#FFE5E0',
  'konstruktor': '#D4F0DB',
  'mashina': '#FFF3D6',
  'qogirchoq': '#F1EEFB',
  'ilk-qadamlar': '#FFE8D6',
  'ijodkorlik': '#E8F5E9'
};

export default function CartItem({ item }) {
  const { product, quantity } = item;
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className={styles.item}>
      <Link href={`/products/${product.id}`} className={styles.imageBox} style={{ backgroundColor: categoryColors[product.categoryId] || '#F1EEFB', overflow: 'hidden' }}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span className={styles.emoji}>{product.emoji || '🧸'}</span>
        )}
      </Link>
      <div className={styles.details}>
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h4 className={styles.name}>{product.name}</h4>
        </Link>
        <div className={styles.price}>{formatPrice(product.price)}</div>
      </div>
      <div className={styles.controls}>
        <button className={styles.qtyBtn} onClick={() => updateQuantity(product.id, quantity - 1)}>-</button>
        <span className={styles.qtyValue}>{quantity}</span>
        <button className={styles.qtyBtn} onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
      </div>
      <div className={styles.subtotal}>
        {formatPrice(product.price * quantity)}
      </div>
      <button className={styles.removeBtn} onClick={() => removeFromCart(product.id)} aria-label="O'chirish">
        ✕
      </button>
    </div>
  );
}
