'use client';
import { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminModal from '@/components/admin/AdminModal';
import { formatPrice } from '@/utils/formatPrice';
import { categories as defaultCategories } from '@/data/products';
import styles from './page.module.css';

const initialForm = {
  name: '', emoji: '', price: '', costPrice: '', oldPrice: '', category: '', description: '', stock: '', badge: '', image: ''
};

function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const fetchProducts = () => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleOpenModal = (prod = null) => {
    setEditingProduct(prod);
    setFormData(prod ? { 
      ...prod, 
      oldPrice: prod.oldPrice || '', 
      costPrice: prod.costPrice || '', 
      image: prod.image || '',
      category: prod.category || (categories[0]?.id || '')
    } : {
      ...initialForm,
      category: categories[0]?.id || ''
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
    const method = editingProduct ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          costPrice: formData.costPrice ? Number(formData.costPrice) : null,
          oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
          stock: Number(formData.stock)
        })
      });
      if (res.ok) {
        fetchProducts();
        handleCloseModal();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Xatolik: ${errData.error || 'Mahsulotni saqlab bo\'lmadi.'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan ulanishda xatolik yuz berdi.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Rostdan ham o\'chirmoqchimisiz?')) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        if (res.ok) fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Mahsulotlar</h1>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>
          + Yangi mahsulot
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Rasm</th>
              <th className={styles.th}>Nomi</th>
              <th className={styles.th}>Narx</th>
              <th className={styles.th}>Tan narxi</th>
              <th className={styles.th}>Chegirma</th>
              <th className={styles.th}>Kategoriya</th>
              <th className={styles.th}>Ombor</th>
              <th className={styles.th}>Badge</th>
              <th className={styles.th}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className={styles.td}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '10px' }} />
                  ) : (
                    <span className={styles.emoji}>{p.emoji || '🎁'}</span>
                  )}
                </td>
                <td className={styles.td}>{p.name}</td>
                <td className={`${styles.td} ${styles.priceCell}`}>{formatPrice(p.price)}</td>
                <td className={styles.td}>{p.costPrice ? formatPrice(p.costPrice) : '-'}</td>
                <td className={`${styles.td} ${styles.oldPriceCell}`}>{p.oldPrice ? formatPrice(p.oldPrice) : '-'}</td>
                <td className={styles.td}>
                  {categories.find(c => c.id === p.category || c.name === p.category)?.name || p.category}
                </td>
                <td className={`${styles.td} ${p.stock < 10 ? styles.stockLow : styles.stockOk}`}>{p.stock} ta</td>
                <td className={styles.td}>{p.badge || '-'}</td>
                <td className={styles.td}>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => handleOpenModal(p)}>Tahrirlash</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>O'chirish</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="9" className={styles.td} style={{textAlign:'center'}}>Ma'lumot topilmadi</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        title={editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Nomi</label>
              <input name="name" required value={formData.name} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Emoji (Zaxira)</label>
              <input name="emoji" value={formData.emoji} onChange={handleChange} placeholder="🎁" className={styles.input} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mahsulot rasmi (Fayl yuklash yoki URL)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ fontSize: '0.85rem' }}
              />
              <input
                type="text"
                name="image"
                placeholder="yoki URL (https://...)"
                value={formData.image}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            {formData.image && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={formData.image} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} style={{ color: '#E74C3C', cursor: 'pointer', fontSize: '0.85rem', border: 'none', background: 'none' }}>
                  ❌ Rasmni o'chirish
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.row} style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className={styles.field}>
              <label className={styles.label}>Sotish narxi (so'm)</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Tan narxi (so'm)</label>
              <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} className={styles.input} placeholder="Ixtiyoriy" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Chegirma narx (so'm)</label>
              <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Kategoriya</label>
              <select 
                name="category" 
                required 
                value={formData.category} 
                onChange={handleChange} 
                className={styles.select}
              >
                <option value="">Tanlang...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.emoji ? `${c.emoji} ` : ''}{c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Ombordagi soni</label>
              <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className={styles.input} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Badge</label>
            <select name="badge" value={formData.badge} onChange={handleChange} className={styles.select}>
              <option value="">Yo'q</option>
              <option value="Yangi">Yangi</option>
              <option value="Chegirma">Chegirma</option>
              <option value="Tavsiya etilgan">Tavsiya etilgan</option>
              <option value="Eng ko'p sotilgan">Eng ko'p sotilgan</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tavsif</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className={styles.textarea} />
          </div>

          <button type="submit" className={styles.submitBtn}>Saqlash</button>
        </form>
      </AdminModal>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <ProductsContent />
    </AdminGuard>
  );
}
