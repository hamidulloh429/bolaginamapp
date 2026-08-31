'use client';

import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import { useFavorites } from '@/context/FavoritesContext';
import { products } from '@/data/products';
import styles from './page.module.css';

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  
  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Sevimlilar 💝</h1>
      
      {favoriteProducts.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyEmoji}>💝</span>
          <p className={styles.emptyText}>Sevimli o'yinchoqlar hali yo'q</p>
          <Link href="/products" className={styles.shopBtn}>
            Mahsulotlarni ko'rish
          </Link>
        </div>
      ) : (
        <ProductGrid products={favoriteProducts} />
      )}
    </div>
  );
}
