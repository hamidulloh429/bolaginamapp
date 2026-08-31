'use client';
import Link from 'next/link';
import { categories } from '@/data/products';
import styles from './CategoryNav.module.css';

export default function CategoryNav() {
  return (
    <div className={styles.container}>
      {categories.map((cat, index) => (
        <Link 
          key={cat.id} 
          href={`/products?category=${cat.id}`}
          className={styles.card}
          style={{ 
            backgroundColor: `${cat.color}26`, // roughly 15% opacity
            borderRadius: `var(--radius-card-${(index % 4) + 1})`,
            transform: `rotate(${index % 2 === 0 ? '1deg' : '-1.5deg'})`
          }}
        >
          <span className={styles.emoji}>{cat.emoji}</span>
          <span className={styles.name}>{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
