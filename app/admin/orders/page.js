'use client';
import { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/formatDate';
import styles from './page.module.css';

function OrdersContent() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className={styles.title}>Buyurtmalar</h1>
      
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>№</th>
              <th className={styles.th}>Sana</th>
              <th className={styles.th}>Mijoz</th>
              <th className={styles.th}>Telefon</th>
              <th className={styles.th}>Manzil</th>
              <th className={styles.th}>Mahsulotlar</th>
              <th className={styles.th}>Summa</th>
              <th className={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => {
              const date = formatDate(o.createdAt);
              return (
                <tr key={o.id}>
                  <td className={styles.td}>#{o.id}</td>
                  <td className={`${styles.td} ${styles.dateCell}`}>{date}</td>
                  <td className={styles.td}>{o.customer?.name}</td>
                  <td className={styles.td}>{o.customer?.phone}</td>
                  <td className={`${styles.td} ${styles.addressCell}`} title={o.customer?.address}>
                    {o.customer?.address}
                  </td>
                  <td className={styles.td}>
                    <ul className={styles.itemsList}>
                      {(o.items || []).map((item, idx) => (
                        <li key={idx} className={styles.itemRow}>
                          <span>{item.emoji} {item.name}</span>
                          <span style={{color: 'var(--text-muted)'}}>x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className={`${styles.td} ${styles.totalCell}`}>{formatPrice(o.total)}</td>
                  <td className={styles.td}>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`${styles.statusSelect} ${styles[o.status]}`}
                    >
                      <option value="yangi">Yangi</option>
                      <option value="tayyorlanmoqda">Tayyorlanmoqda</option>
                      <option value="yolda">Yo'lda</option>
                      <option value="yetkazildi">Yetkazildi</option>
                      <option value="bekor">Bekor</option>
                    </select>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan="8" className={styles.td} style={{textAlign:'center'}}>Ma'lumot topilmadi</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <OrdersContent />
    </AdminGuard>
  );
}
