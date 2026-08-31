'use client';
import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import StatsCard from '@/components/admin/StatsCard';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/formatDate';
import styles from './page.module.css';

function DashboardContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (!stats) return <div>Xatolik yuz berdi</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <StatsCard 
          title="Bugungi buyurtmalar" 
          value={stats.todayOrders || 0} 
          icon="📦" 
          color="coral" 
        />
        <StatsCard 
          title="Oylik tushum" 
          value={formatPrice(stats.monthRevenue || 0)} 
          icon="💰" 
          color="green" 
        />
        <StatsCard 
          title="Jami mahsulotlar" 
          value={stats.totalProducts || 0} 
          icon="🧸" 
          color="yellow" 
        />
        <StatsCard 
          title="Faol buyurtmalar" 
          value={stats.activeOrders || 0} 
          icon="🚚" 
          color="lavender" 
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Eng ko'p sotilgan mahsulotlar</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>№</th>
                <th className={styles.th}>Mahsulot</th>
                <th className={styles.th}>Sotilgan soni</th>
                <th className={styles.th}>Tushum</th>
              </tr>
            </thead>
            <tbody>
              {(stats.topProducts || []).map((prod, idx) => (
                <tr key={idx}>
                  <td className={styles.td}>{idx + 1}</td>
                  <td className={styles.td}>{prod.emoji} {prod.name}</td>
                  <td className={styles.td}>{prod.quantity} ta</td>
                  <td className={styles.td}>{formatPrice(prod.total)}</td>
                </tr>
              ))}
              {(!stats.topProducts || stats.topProducts.length === 0) && (
                <tr>
                  <td colSpan="4" className={styles.td} style={{textAlign:'center'}}>Ma'lumot yo'q</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Oxirgi buyurtmalar</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Sana</th>
                <th className={styles.th}>Mijoz</th>
                <th className={styles.th}>Summa</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(stats.recentOrders || []).map(order => {
                const date = formatDate(order.createdAt);
                return (
                  <tr key={order.id}>
                    <td className={styles.td}>#{order.id}</td>
                    <td className={styles.td}>{date}</td>
                    <td className={styles.td}>{order.customer?.name}</td>
                    <td className={styles.td}>{formatPrice(order.total)}</td>
                    <td className={styles.td}>
                      <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                <tr>
                  <td colSpan="5" className={styles.td} style={{textAlign:'center'}}>Ma'lumot yo'q</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
