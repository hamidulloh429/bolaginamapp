'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import styles from './AdminGuard.module.css';

export default function AdminGuard({ children }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/verify')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(() => setAuthed(true))
      .catch(() => router.replace('/admin'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className={styles.loading}>Yuklanmoqda...</div>;
  if (!authed) return null;

  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
