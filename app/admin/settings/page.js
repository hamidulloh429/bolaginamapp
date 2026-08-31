'use client';
import { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import styles from './page.module.css';

function SettingsContent() {
  const [formData, setFormData] = useState({
    siteName: '',
    tagline: '',
    phone: '',
    email: '',
    address: '',
    telegramUrl: '',
    instagramUrl: '',
    facebookUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setFormData(data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Sozlamalarni saqlashda xatolik yuz berdi.");
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan ulanishda xatolik.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Sayt Sozlamalari</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>🏷️ Asosiy ma'lumotlar</h2>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Sayt / Brend nomi</label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Shior (Tagline)</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>📞 Aloqa ma'lumotlari</h2>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Telefon raqami</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email manzil</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.field} style={{ marginTop: '16px' }}>
            <label className={styles.label}>Manzil / Joylashuv</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>🌐 Ijtimoiy tarmoqlar (Havolalar)</h2>
          <div className={styles.field} style={{ marginBottom: '16px' }}>
            <label className={styles.label}>Telegram havola</label>
            <input
              type="text"
              name="telegramUrl"
              value={formData.telegramUrl}
              onChange={handleChange}
              placeholder="https://t.me/..."
              className={styles.input}
            />
          </div>
          <div className={styles.field} style={{ marginBottom: '16px' }}>
            <label className={styles.label}>Instagram havola</label>
            <input
              type="text"
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Facebook havola</label>
            <input
              type="text"
              name="facebookUrl"
              value={formData.facebookUrl}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
              className={styles.input}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saqlanmoqda...' : '💾 Sozlamalarni saqlash'}
          </button>
          {saved && <span className={styles.successMsg}>✅ Muvaffaqiyatli saqlandi!</span>}
        </div>
      </form>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <SettingsContent />
    </AdminGuard>
  );
}
