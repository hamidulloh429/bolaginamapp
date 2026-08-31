'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar/SearchBar';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import { categories } from '@/data/products';
import styles from './page.module.css';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Barchasi';
  
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(err => console.error(err));
  }, []);
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'Barchasi' || product.category === activeCategory;
    const matchesSearch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Mahsulotlar</h1>
      
      <div className={styles.searchWrap}>
        <SearchBar 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="O'yinchoq izlash..." 
        />
      </div>
      
      <div className={styles.filters}>
        <button 
          className={`${styles.filterChip} ${activeCategory === 'Barchasi' ? styles.filterChipActive : ''}`}
          onClick={() => setActiveCategory('Barchasi')}
        >
          Barchasi
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            className={`${styles.filterChip} ${activeCategory === cat.name ? styles.filterChipActive : ''}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>
      
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyEmoji}>😕</span>
          <p>Hech narsa topilmadi — Boshqa kalit so'zlar bilan qidirib ko'ring</p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{padding: '60px 0', textAlign: 'center'}}>Yuklanmoqda...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
