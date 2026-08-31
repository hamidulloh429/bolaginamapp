'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.bg}></div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Bolalar do'koni</p>
        <h1 className={styles.title}>
          Kichkintoyingiz uchun <br />
          <span className={styles.titleHighlight}>sevgi bilan tanlangan</span> <br />
          o'yinchoqlar
        </h1>
        <p className={styles.subtitle}>
          Xavfsiz, sifatli va quvonch bag'ishlaydigan o'yinchoqlarni bir joyda toping
        </p>
        <Link href="/products" className={styles.cta}>
          Xarid boshlash →
        </Link>
      </div>
      
      {animated && (
        <>
          <div className={`${styles.shape} ${styles.shape1}`}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="var(--accent-yellow)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div className={`${styles.shape} ${styles.shape2}`}>
            <svg width="180" height="180" viewBox="0 0 24 24" fill="var(--accent-coral)" style={{opacity: 0.3}}><circle cx="12" cy="12" r="10"/><circle cx="8" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/><circle cx="12" cy="15" r="2"/></svg>
          </div>
          <div className={`${styles.shape} ${styles.shape3}`}>
            <svg width="90" height="90" viewBox="0 0 24 24" fill="var(--accent-green)"><rect x="3" y="3" width="18" height="18" rx="2" transform="rotate(15 12 12)"/></svg>
          </div>
          <div className={`${styles.shape} ${styles.shape4}`}>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="#E2DCF5"><circle cx="12" cy="12" r="12"/></svg>
          </div>
          <div className={`${styles.shape} ${styles.shape5}`}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="var(--accent-coral)" style={{opacity: 0.4}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
        </>
      )}
    </section>
  );
}
