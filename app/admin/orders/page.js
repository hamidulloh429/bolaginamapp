'use client';
import { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/formatDate';
import styles from './page.module.css';

function OrdersContent() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch('/api/admin/orders', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // 10 soniyada avto-yangilanish
    return () => clearInterval(interval);
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
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className={styles.title} style={{ margin: 0 }}>Buyurtmalar</h1>
        <button 
          onClick={fetchOrders} 
          style={{ padding: '8px 16px', borderRadius: '12px', background: 'var(--accent-coral)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          🔄 Yangilash
        </button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>№</th>
              <th className={styles.th}>Sana</th>
              <th className={styles.th}>Mijoz</th>
              <th className={styles.th}>Telefon</th>
              <th className={styles.th}>Manzil</th>
              <th className={styles.th}>Mahsulotlar (Tan narxi & Foyda)</th>
              <th className={styles.th}>Jami Summa / Foyda</th>
              <th className={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => {
              const date = formatDate(o.createdAt);
              
              let orderTotalCost = 0;
              (o.items || []).forEach(item => {
                orderTotalCost += (item.costPrice || 0) * (item.quantity || 0);
              });
              const orderTotalProfit = (o.total || 0) - orderTotalCost;

              return (
                <tr key={o.id}>
                  <td className={styles.td}>#{o.id}</td>
                  <td className={`${styles.td} ${styles.dateCell}`}>{date}</td>
                  <td className={styles.td}><strong>{o.customer?.name}</strong></td>
                  <td className={styles.td}>{o.customer?.phone}</td>
                  <td className={`${styles.td} ${styles.addressCell}`} title={o.customer?.address}>
                    {o.customer?.address}
                  </td>
                  <td className={styles.td}>
                    <ul className={styles.itemsList} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {(o.items || []).map((item, idx) => {
                        const itemProfit = ((item.price || 0) - (item.costPrice || 0)) * (item.quantity || 0);
                        return (
                          <li key={idx} className={styles.itemRow} style={{ marginBottom: '6px', fontSize: '0.85rem' }}>
                            <div>
                              <span>{item.emoji || '🎁'} <strong>{item.name}</strong> x{item.quantity}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              Sotish: {formatPrice(item.price * item.quantity)} | Tan narx: {formatPrice((item.costPrice || 0) * item.quantity)}
                              {item.costPrice ? (
                                <span style={{ color: 'var(--accent-green)', fontWeight: 600, marginLeft: '6px' }}>
                                  (Foyda: +{formatPrice(itemProfit)})
                                </span>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td className={`${styles.td} ${styles.totalCell}`}>
                    <div style={{ fontWeight: 700 }}>{formatPrice(o.total)}</div>
                    {orderTotalCost > 0 ? (
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                        Foyda: +{formatPrice(orderTotalProfit)}
                      </div>
                    ) : null}
                  </td>
                  <td className={styles.td}>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`${styles.statusSelect} ${styles[o.status]}`}
                    >
                      <option value="yangi">Yangi</option>
                      <option value="tayyorlanmoqda">Tayyorlanmoqda</option>
                      <option value="yolda">Yo'lda</option>
                      <option value="yetkazildi">Yetkazildi (Foydaga o'tadi)</option>
                      <option value="bekor">Bekor</option>
                    </select>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan="8" className={styles.td} style={{textAlign:'center', padding: '40px 0'}}>
                  Baza bo'sh. Hali birorta ham yangi buyurtma kelmadi.
                </td>
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
