'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      fontFamily: 'var(--font-body, sans-serif)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⚠️</div>
      <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: '12px', color: 'var(--text-primary)' }}>
        Xatolik yuz berdi
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px' }}>
        Sahifani yuklashda kutilmagan xatolik yuz berdi. Sahifani qayta yuklab ko'ring.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '12px 24px',
            borderRadius: '50px',
            border: 'none',
            background: 'var(--accent-coral, #FF6B5B)',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Qayta yuklash
        </button>
        <Link
          href="/"
          style={{
            padding: '12px 24px',
            borderRadius: '50px',
            border: '1px solid var(--border-color)',
            background: 'white',
            color: 'var(--text-primary)',
            fontWeight: '600',
            textDecoration: 'none'
          }}
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
