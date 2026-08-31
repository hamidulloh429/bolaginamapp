'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { cartCount, justAdded } = useCart();
  const { favoritesCount } = useFavorites();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [animatedCart, setAnimatedCart] = useState(false);

  useEffect(() => {
    if (justAdded) {
      setAnimatedCart(true);
      const timer = setTimeout(() => setAnimatedCart(false), 500);
      return () => clearTimeout(timer);
    }
  }, [justAdded]);

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span style={{ color: 'var(--accent-coral)' }}>BOLA</span>GINAM
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Bosh sahifa</Link>
          <Link href="/products" className={styles.navLink}>Mahsulotlar</Link>
        </nav>
        <div className={styles.actions}>
          <Link href="/products" className={styles.iconBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
          </Link>
          <Link href="/favorites" className={styles.iconBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {favoritesCount > 0 && <span className={styles.badge}>{favoritesCount}</span>}
          </Link>
          <Link href="/cart" className={`${styles.iconBtn} ${animatedCart ? styles.cartBounce : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>
          <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Bosh sahifa</Link>
          <Link href="/products" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Mahsulotlar</Link>
        </div>
      )}
    </header>
  );
}
