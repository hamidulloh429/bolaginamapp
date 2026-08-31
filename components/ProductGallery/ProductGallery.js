'use client';
import { useState } from 'react';
import styles from './ProductGallery.module.css';

const bgColors = [
  '#FFE5E0', // yumshoq like
  '#D4F0DB', // konstruktor like
  '#FFF3D6', // mashina like
  '#F1EEFB'  // qogirchoq like
];

export default function ProductGallery({ product }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={styles.gallery}>
      <div 
        className={styles.main}
        style={{ backgroundColor: bgColors[selectedIndex] }}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} />
        ) : (
          <span className={styles.mainEmoji}>{product.emoji || '🧸'}</span>
        )}
      </div>
      <div className={styles.thumbs}>
        {bgColors.map((color, index) => (
          <div 
            key={index}
            className={`${styles.thumb} ${selectedIndex === index ? styles.thumbActive : ''}`}
            style={{ backgroundColor: color, overflow: 'hidden' }}
            onClick={() => setSelectedIndex(index)}
          >
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span className={styles.thumbEmoji}>{product.emoji || '🧸'}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
