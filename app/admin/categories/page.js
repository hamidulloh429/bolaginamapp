'use client';
import { useState, useEffect } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminModal from '@/components/admin/AdminModal';
import styles from './page.module.css';

const initialForm = { name: '', emoji: '', color: '#FF6B5B' };

function CategoriesContent() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const fetchCategories = () => {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat = null) => {
    setEditingCategory(cat);
    setFormData(cat ? { ...cat } : initialForm);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
    const method = editingCategory ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchCategories();
        handleCloseModal();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Rostdan ham o\'chirmoqchimisiz?')) {
      try {
        const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
        if (res.ok) fetchCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Kategoriyalar</h1>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>
          + Yangi kategoriya
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Emoji</th>
              <th className={styles.th}>Nom</th>
              <th className={styles.th}>Rang</th>
              <th className={styles.th}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td className={styles.td}><span className={styles.emoji}>{c.emoji}</span></td>
                <td className={styles.td}>{c.name}</td>
                <td className={styles.td}>
                  <div className={styles.colorSwatch} style={{ backgroundColor: c.color }} title={c.color} />
                </td>
                <td className={styles.td}>
                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => handleOpenModal(c)}>Tahrirlash</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(c.id)}>O'chirish</button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className={styles.td} style={{textAlign:'center'}}>Ma'lumot topilmadi</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminModal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        title={editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nomi</label>
            <input name="name" required value={formData.name} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Emoji</label>
            <input name="emoji" required value={formData.emoji} onChange={handleChange} className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Rang</label>
            <input type="color" name="color" required value={formData.color} onChange={handleChange} className={styles.colorInput} />
          </div>

          <button type="submit" className={styles.submitBtn}>Saqlash</button>
        </form>
      </AdminModal>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <CategoriesContent />
    </AdminGuard>
  );
}
