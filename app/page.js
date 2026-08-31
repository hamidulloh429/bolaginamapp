import Hero from '@/components/Hero/Hero';
import CategoryNav from '@/components/CategoryNav/CategoryNav';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import BlobShape from '@/components/BlobShape/BlobShape';
import * as store from '@/lib/store';
import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  const products = store.getProducts();
  const recommended = products.filter(p => p.badge === 'Tavsiya etilgan' || p.badge === "Eng ko'p sotilgan");
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

      {/* Recommended */}
      <section className={`${styles.section} container`}>
        <div className={styles.sectionHeader}>
          <h2 className={`section-title ${styles.sectionTitle}`}>
            Tavsiya etamiz
          </h2>
          <Link href="/products" className={styles.viewAll}>
            Hammasini ko'rish →
          </Link>
        </div>
        <ProductGrid products={recommended.length > 0 ? recommended : products.slice(0, 4)} />
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
