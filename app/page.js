import Hero from '@/components/Hero/Hero';
import CategoryNav from '@/components/CategoryNav/CategoryNav';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import BlobShape from '@/components/BlobShape/BlobShape';
import * as store from '@/lib/store';
import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  await store.syncFromBlob();
  const products = store.getProducts() || [];
  
  // Eng oxirgi qo'shilgan mahsulotlar birinchi chiqadi
  const recentProducts = [...products].reverse();
  const onSale = products.filter(p => p.oldPrice !== null && p.inStock);
  const newProducts = products.filter(p => p.badge === 'Yangi');

  return (
    <>
      <Hero />

      {/* Categories */}
      <section className={`${styles.section} container`}>
        <h2 className={`section-title ${styles.sectionTitle}`}>
          Kategoriyalar
        </h2>
        <CategoryNav />
      </section>

      {/* Bizning o'yinchoqlar */}
      <section className={`${styles.section} container`}>
        <div className={styles.sectionHeader}>
          <h2 className={`section-title ${styles.sectionTitle}`}>
            🧸 Bizning o'yinchoqlar
          </h2>
          <Link href="/products" className={styles.viewAll}>
            Barchasini ko'rish →
          </Link>
        </div>
        {recentProducts.length > 0 ? (
          <ProductGrid products={recentProducts.slice(0, 8)} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)', background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-soft)' }}>
            Hozircha mahsulotlar mavjud emas. Admin panel orqali yangi mahsulotlar qo'shishingiz mumkin!
          </div>
        )}
      </section>

      {/* On Sale */}
      {onSale.length > 0 && (
        <section className={styles.saleSection}>
          <div className="container">
            <BlobShape color="#FFC857" size={300} className={styles.saleBlob} style={{ top: '-50px', right: '-80px' }} />
            <h2 className={`section-title ${styles.sectionTitle}`}>
              🎉 Chegirmadagi o'yinchoqlar
            </h2>
            <ProductGrid products={onSale} />
          </div>
        </section>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className={`${styles.section} container`}>
          <h2 className={`section-title ${styles.sectionTitle}`}>
            Yangi kelganlar ✨
          </h2>
          <ProductGrid products={newProducts} />
        </section>
      )}
    </>
  );
}
