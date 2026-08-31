'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { formatPrice } from '@/utils/formatPrice';
import styles from './ProductCard.module.css';

const categoryColors = {
  'yumshoq': '#FFE5E0',
  'konstruktor': '#D4F0DB',
  'mashina': '#FFF3D6',
  'qogirchoq': '#F1EEFB',
  'ilk-qadamlar': '#FFE8D6',
  'ijodkorlik': '#E8F5E9'
};

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addToCart(product);
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const radiusClass = `var(--radius-card-${(index % 4) + 1})`;
  const shadowClass = `var(--shadow-card-${(index % 3) + 1})`;
  const rotation = index % 3 === 1 ? 'rotate(1deg)' : index % 3 === 2 ? 'rotate(-0.8deg)' : 'none';

  return (
    <Link 
      href={`/products/${product.id}`}
      className={styles.card}
      style={{ borderRadius: radiusClass, boxShadow: shadowClass, transform: rotation }}
    >
      <div 
        className={styles.imageWrap}
        style={{ backgroundColor: categoryColors[product.categoryId] || '#F1EEFB' }}
      >
        {product.badge && (
          <span className={styles.badge} style={{ 
            backgroundColor: 
              product.badge === 'Chegirma' ? 'var(--accent-coral)' : 
              product.badge === 'Yangi' ? 'var(--accent-green)' : 
              product.badge === 'Tavsiya etilgan' ? 'var(--accent-yellow)' : 'var(--bg-lavender)',
            color: product.badge === 'Eng ko\'p sotilgan' ? 'var(--text-primary)' : 'white'
          }}>
            {product.badge}
          </span>
        )}
        <button 
          className={`${styles.heartBtn} ${isFavorite(product.id) ? styles.heartActive : ''}`}
          onClick={handleToggleFavorite}
          aria-label="Sevimlilarga qo'shish"
        >
          <svg className={styles.heartIcon} viewBox="0 0 24 24" fill={isFavorite(product.id) ? "var(--accent-coral)" : "none"} stroke={isFavorite(product.id) ? "var(--accent-coral)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        {product.image ? (
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span className={styles.emoji}>{product.emoji || '🧸'}</span>
        )}
        {!product.inStock && (
          <div className={styles.outOfStock}>
            <span className={styles.outOfStockLabel}>Hozircha yo'q</span>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceRow}>
          {product.oldPrice ? (
            <>
              <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
              <span className={`${styles.price} ${styles.salePrice}`}>{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className={styles.price}>{formatPrice(product.price)}</span>
          )}
        </div>
        <button 
          className={`${styles.addBtn} ${product.inStock ? styles.addBtnActive : styles.addBtnDisabled}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? "Savatga qo'shish" : "Hozircha yo'q"}
        </button>
      </div>
    </Link>
  );
}
