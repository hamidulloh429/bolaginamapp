'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import QuantitySelector from '@/components/QuantitySelector/QuantitySelector';
import { formatPrice } from '@/utils/formatPrice';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import styles from './page.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find(p => String(p.id) === String(id));
          setProduct(found || null);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={`container ${styles.page}`} style={{textAlign: 'center', padding: '100px 0'}}>
        <h2>Yuklanmoqda...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`container ${styles.page}`} style={{textAlign: 'center', padding: '100px 0'}}>
        <h2>Mahsulot topilmadi</h2>
        <Link href="/products" className={styles.back} style={{marginTop: '20px'}}>
          ← Barcha mahsulotlarga qaytish
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getBadgeStyle = (badge) => {
    switch(badge) {
      case 'Chegirma': return { backgroundColor: 'var(--accent-coral)' };
      case 'Yangi': return { backgroundColor: 'var(--accent-green)' };
      case 'Tavsiya etilgan': return { backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' };
      case "Eng ko'p sotilgan": return { backgroundColor: '#7C6BC4' };
      default: return { backgroundColor: 'var(--accent-coral)' };
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <Link href="/products" className={styles.back}>
        ← Orqaga
      </Link>
      
      <div className={styles.grid}>
        <div>
          <ProductGallery product={product} />
        </div>
        
        <div className={styles.info}>
          <h1 className={styles.name}>{product.name}</h1>
          
          {product.badge && (
            <span className={styles.badge} style={getBadgeStyle(product.badge)}>
              {product.badge}
            </span>
          )}
          
          <div className={styles.priceArea}>
            <span className={`${styles.currentPrice} ${product.oldPrice ? styles.salePrice : ''}`}>
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.actions}>
            {product.inStock ? (
              <>
                <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
                <button 
                  className={styles.addToCartBtn} 
                  onClick={handleAddToCart}
                >
                  Savatga qo'shish
                </button>
              </>
            ) : (
              <button className={styles.addToCartBtn} disabled>
                Hozircha omborda yo'q
              </button>
            )}
            
            <button 
              className={`${styles.heartBtn} ${isFavorite(product.id) ? styles.heartActive : ''}`}
              onClick={() => toggleFavorite(product.id)}
              aria-label="Sevimlilarga qo'shish"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite(product.id) ? "var(--accent-coral)" : "none"} stroke={isFavorite(product.id) ? "var(--accent-coral)" : "var(--text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            
            {added && <span className={styles.added}>Qo'shildi ✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
