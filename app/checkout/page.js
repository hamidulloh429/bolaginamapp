'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        total: cartTotal,
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          emoji: item.product.emoji || '🎁',
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        clearCart();
      } else {
        alert("Buyurtma yuborishda xatolik yuz berdi. Qayta urinib ko'ring.");
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan aloqa o'rnatilmadi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.success}>
          <span className={styles.successEmoji}>✅</span>
          <h1 className={styles.successTitle}>Buyurtmangiz qabul qilindi!</h1>
          <p className={styles.successText}>Tez orada siz bilan bog'lanamiz.</p>
          <Link href="/" className={styles.homeLink}>
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`container ${styles.page}`} style={{textAlign: 'center', padding: '100px 0'}}>
        <h2>Savatingiz bo'sh</h2>
        <Link href="/products" className={styles.homeLink} style={{marginTop: '20px'}}>
          Mahsulotlar sahifasiga o'tish
        </Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Buyurtma berish</h1>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Ism</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>Telefon raqami</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            required 
            placeholder="+998 __ ___ __ __" 
            className={styles.input}
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.field}>
          <label htmlFor="address" className={styles.label}>Manzil</label>
          <textarea 
            id="address" 
            name="address" 
            required 
            className={styles.textarea}
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className={styles.orderSummary}>
          <h3>Buyurtma xulosasi</h3>
          {items.map(item => (
            <div key={item.product.id} className={styles.summaryItem}>
              <span>{item.product.name} x {item.quantity}</span>
              <span>{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          ))}
          <div className={styles.summaryTotal}>
            <span>Jami:</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? "Yuborilmoqda..." : "Tasdiqlash"}
        </button>
      </form>
    </div>
  );
}
