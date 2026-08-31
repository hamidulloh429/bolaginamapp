'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    siteName: 'BOLAGINAM',
    tagline: "Bolalar quvonchini uyingizga olib kelamiz",
    phone: '+998 90 123 45 67',
    email: 'info@bolaginam.uz',
    address: 'Toshkent sh.',
    telegramUrl: '#',
    instagramUrl: '#',
    facebookUrl: '#',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setSettings(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <footer className={styles.footer}>
      <svg className={styles.wave} viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,53.3C1120,53,1280,75,1360,85.3L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
      </svg>
      <div className={styles.inner}>
        <div>
          <h2 className={styles.footerLogo}>{settings.siteName || 'BOLAGINAM'}</h2>
          <p className={styles.footerTagline}>{settings.tagline}</p>
        </div>
        <div>
          <h3 className={styles.footerHeading}>Aloqa</h3>
          <p className={styles.footerLink}>{settings.phone}</p>
          <p className={styles.footerLink}>{settings.email}</p>
          <p className={styles.footerLink}>{settings.address}</p>
        </div>
        <div>
          <h3 className={styles.footerHeading}>Biz ijtimoiy tarmoqlarda</h3>
          <div className={styles.socialLinks}>
            <a href={settings.telegramUrl || '#'} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 1 0 24 12.056A12.013 12.013 0 0 0 11.944 0Zm5.655 7.204l-1.974 9.302c-.149.658-.537.818-1.089.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.842.92Z"/></svg>
            </a>
            <a href={settings.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
            </a>
            <a href={settings.facebookUrl || '#'} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.886v2.283h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {currentYear} {settings.siteName || 'BOLAGINAM'}. Barcha huquqlar himoyalangan.</span>
        <Link href="/admin" className={styles.adminLink}>Admin</Link>
      </div>
    </footer>
  );
}
