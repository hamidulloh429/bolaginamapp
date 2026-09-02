/**
 * BOLAGINAM — Server-side data store with Vercel Blob persistence
 */

import { put, list } from '@vercel/blob';
import { categories as mockCategories } from '@/data/products';

const sampleProducts = [
  {
    id: 1,
    name: "Yumshoq ayiqcha «Bobo»",
    slug: 'yumshoq-ayiqcha-bobo',
    price: 89000,
    costPrice: 50000,
    oldPrice: 120000,
    category: 'yumshoq',
    description: "Juda yumshoq va qulay ayiqcha — bolangiz uyqu do'sti sifatida yaxshi ko'rib qoladi. Gipoallergik materialdan tikilgan, yuvilganda shakli buzilmaydi. Balandligi 35 sm.",
    inStock: true,
    stock: 25,
    badge: 'Chegirma',
    emoji: '🧸',
    image: '',
  },
  {
    id: 2,
    name: "Yog'och konstruktor «Shahar»",
    slug: 'yogoch-konstruktor-shahar',
    price: 145000,
    costPrice: 90000,
    oldPrice: null,
    category: 'konstruktor',
    description: "100 ta rangli yog'och detaldan iborat konstruktor. Bolalar o'z shaharchasini qurishadi — uylar, ko'priklar, daraxtlar. Tabiiy yog'ochdan, bo'yoqsiz qismlari ham bor. 3 yoshdan.",
    inStock: true,
    stock: 14,
    badge: 'Tavsiya etilgan',
    emoji: '🏗️',
    image: '',
  },
  {
    id: 3,
    name: "Pultli mashina «Tezkor»",
    slug: 'pultli-mashina-tezkor',
    price: 210000,
    costPrice: 140000,
    oldPrice: 280000,
    category: 'mashina',
    description: "Tezlikni sevadigan bolalar uchun — pultli boshqariladigan sport mashina. Oldinga, orqaga, chapga, o'ngga harakat qiladi. LED chiroqlari bilan. Batareya bilan ishlaydi. 5 yoshdan.",
    inStock: true,
    stock: 8,
    badge: 'Chegirma',
    emoji: '🏎️',
    image: '',
  }
];

const sampleOrders = [
  {
    id: 1001,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: {
      name: 'Aziz Karimov',
      phone: '+998901234567',
      address: "Toshkent sh., Chilonzor t., 7-kvartal, 15-uy"
    },
    items: [
      { productId: 1, name: "Yumshoq ayiqcha «Bobo»", quantity: 1, price: 89000, costPrice: 50000, emoji: '🧸' },
      { productId: 2, name: "Yog'och konstruktor «Shahar»", quantity: 1, price: 145000, costPrice: 90000, emoji: '🏗️' }
    ],
    total: 234000,
    status: 'yangi'
  },
  {
    id: 1002,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    customer: {
      name: "Malika To'rayeva",
      phone: '+998951234567',
      address: "Toshkent sh., Sergeli t., 3-kvartal, 8-uy"
    },
    items: [
      { productId: 3, name: "Pultli mashina «Tezkor»", quantity: 1, price: 210000, costPrice: 140000, emoji: '🏎️' }
    ],
    total: 210000,
    status: 'yetkazildi'
  }
];

if (!globalThis._bolaginamProducts || globalThis._bolaginamProducts.length === 0) {
  globalThis._bolaginamProducts = JSON.parse(JSON.stringify(sampleProducts));
}

if (!globalThis._bolaginamOrders || globalThis._bolaginamOrders.length === 0) {
  globalThis._bolaginamOrders = JSON.parse(JSON.stringify(sampleOrders));
}

if (!globalThis._bolaginamCategories) {
  globalThis._bolaginamCategories = JSON.parse(JSON.stringify(mockCategories));
}

if (!globalThis._bolaginamSettings) {
  globalThis._bolaginamSettings = {
    siteName: "BOLAGINAM",
    tagline: "Bolalar quvonchini uyingizga olib kelamiz",
    phone: "+998 90 123 45 67",
    email: "info@bolaginam.uz",
    address: "Toshkent sh., Chilonzor t.",
    telegramUrl: "https://t.me/bolaginam",
    instagramUrl: "https://instagram.com/bolaginam",
    facebookUrl: "https://facebook.com/bolaginam",
  };
}

let isSynced = false;

export async function syncFromBlob() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    const { blobs } = await list({ prefix: 'store/data.json' });
    if (blobs && blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) globalThis._bolaginamProducts = data.products;
        if (Array.isArray(data.orders) && data.orders.length > 0) globalThis._bolaginamOrders = data.orders;
        if (Array.isArray(data.categories)) globalThis._bolaginamCategories = data.categories;
        if (data.settings) globalThis._bolaginamSettings = data.settings;
      }
    }
    isSynced = true;
  } catch (err) {
    console.error("Vercel Blob sync error:", err);
  }
}

export async function saveToBlob() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    const payload = {
      products: globalThis._bolaginamProducts,
      orders: globalThis._bolaginamOrders,
      categories: globalThis._bolaginamCategories,
      settings: globalThis._bolaginamSettings,
    };
    await put('store/data.json', JSON.stringify(payload), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });
  } catch (err) {
    console.error("Vercel Blob save error:", err);
  }
}

const getNextProductId = () => {
  const ids = globalThis._bolaginamProducts.map(p => Number(p.id)).filter(id => !isNaN(id));
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
};

const getNextOrderId = () => {
  const ids = globalThis._bolaginamOrders.map(o => Number(o.id)).filter(id => !isNaN(id));
  return ids.length > 0 ? Math.max(...ids) + 1 : 1001;
};

// ========== PRODUCTS ==========
export function getProducts() {
  return globalThis._bolaginamProducts;
}

export function getProduct(id) {
  return globalThis._bolaginamProducts.find(p => String(p.id) === String(id)) || null;
}

export async function addProduct(data) {
  await syncFromBlob();
  const product = {
    id: getNextProductId(),
    name: data.name,
    slug: (data.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    price: Number(data.price),
    costPrice: data.costPrice ? Number(data.costPrice) : null,
    oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
    category: data.category,
    description: data.description || '',
    inStock: Number(data.stock) > 0,
    stock: Number(data.stock) || 0,
    badge: data.badge || null,
    emoji: data.emoji || '🎁',
    image: data.image || '',
  };
  globalThis._bolaginamProducts.push(product);
  await saveToBlob();
  return product;
}

export async function updateProduct(id, data) {
  await syncFromBlob();
  const index = globalThis._bolaginamProducts.findIndex(p => String(p.id) === String(id));
  if (index === -1) return null;

  globalThis._bolaginamProducts[index] = {
    ...globalThis._bolaginamProducts[index],
    name: data.name ?? globalThis._bolaginamProducts[index].name,
    price: data.price !== undefined ? Number(data.price) : globalThis._bolaginamProducts[index].price,
    costPrice: data.costPrice !== undefined ? (data.costPrice ? Number(data.costPrice) : null) : globalThis._bolaginamProducts[index].costPrice,
    oldPrice: data.oldPrice !== undefined ? (data.oldPrice ? Number(data.oldPrice) : null) : globalThis._bolaginamProducts[index].oldPrice,
    category: data.category ?? globalThis._bolaginamProducts[index].category,
    description: data.description ?? globalThis._bolaginamProducts[index].description,
    stock: data.stock !== undefined ? Number(data.stock) : globalThis._bolaginamProducts[index].stock,
    inStock: data.stock !== undefined ? Number(data.stock) > 0 : globalThis._bolaginamProducts[index].inStock,
    badge: data.badge !== undefined ? (data.badge || null) : globalThis._bolaginamProducts[index].badge,
    emoji: data.emoji ?? globalThis._bolaginamProducts[index].emoji,
    image: data.image !== undefined ? data.image : globalThis._bolaginamProducts[index].image,
  };

  await saveToBlob();
  return globalThis._bolaginamProducts[index];
}

export async function deleteProduct(id) {
  await syncFromBlob();
  const index = globalThis._bolaginamProducts.findIndex(p => String(p.id) === String(id));
  if (index === -1) return false;
  globalThis._bolaginamProducts.splice(index, 1);
  await saveToBlob();
  return true;
}

// ========== CATEGORIES ==========
export function getCategories() {
  return globalThis._bolaginamCategories;
}

export function getCategory(id) {
  return globalThis._bolaginamCategories.find(c => String(c.id) === String(id)) || null;
}

export async function addCategory(data) {
  await syncFromBlob();
  const category = {
    id: data.id || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: data.name,
    emoji: data.emoji || '📦',
    color: data.color || '#F1EEFB',
  };
  globalThis._bolaginamCategories.push(category);
  await saveToBlob();
  return category;
}

export async function updateCategory(id, data) {
  await syncFromBlob();
  const index = globalThis._bolaginamCategories.findIndex(c => String(c.id) === String(id));
  if (index === -1) return null;

  globalThis._bolaginamCategories[index] = {
    ...globalThis._bolaginamCategories[index],
    name: data.name ?? globalThis._bolaginamCategories[index].name,
    emoji: data.emoji ?? globalThis._bolaginamCategories[index].emoji,
    color: data.color ?? globalThis._bolaginamCategories[index].color,
  };

  await saveToBlob();
  return globalThis._bolaginamCategories[index];
}

export async function deleteCategory(id) {
  await syncFromBlob();
  const index = globalThis._bolaginamCategories.findIndex(c => String(c.id) === String(id));
  if (index === -1) return false;
  globalThis._bolaginamCategories.splice(index, 1);
  await saveToBlob();
  return true;
}

// ========== ORDERS ==========
export function getOrders() {
  return [...globalThis._bolaginamOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getOrder(id) {
  return globalThis._bolaginamOrders.find(o => String(o.id) === String(id)) || null;
}

export async function addOrder(data) {
  await syncFromBlob();
  const enrichedItems = (data.items || []).map(item => {
    const product = globalThis._bolaginamProducts.find(p => String(p.id) === String(item.productId));
    return {
      ...item,
      costPrice: product?.costPrice || item.costPrice || 0,
    };
  });

  const order = {
    id: getNextOrderId(),
    createdAt: new Date().toISOString(),
    customer: {
      name: data.name,
      phone: data.phone,
      address: data.address,
    },
    items: enrichedItems,
    total: data.total || 0,
    status: 'yangi',
  };
  globalThis._bolaginamOrders.push(order);
  await saveToBlob();
  return order;
}

export async function updateOrderStatus(id, status) {
  const validStatuses = ['yangi', 'tayyorlanmoqda', 'yolda', 'yetkazildi', 'bekor'];
  if (!validStatuses.includes(status)) return null;

  await syncFromBlob();
  const index = globalThis._bolaginamOrders.findIndex(o => String(o.id) === String(id));
  if (index === -1) return null;

  globalThis._bolaginamOrders[index] = { ...globalThis._bolaginamOrders[index], status };
  await saveToBlob();
  return globalThis._bolaginamOrders[index];
}

// ========== STATS ==========
export function getStats() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = today.slice(0, 7); // YYYY-MM

    const todayOrders = globalThis._bolaginamOrders.filter(o =>
      o.createdAt && String(o.createdAt).startsWith(today) && o.status !== 'bekor'
    );

    const monthOrders = globalThis._bolaginamOrders.filter(o =>
      o.createdAt && String(o.createdAt).startsWith(thisMonth) && o.status !== 'bekor'
    );

    const completedOrders = globalThis._bolaginamOrders.filter(o => o.status === 'yetkazildi');

    const productSales = {};
    completedOrders.forEach(order => {
      (order.items || []).forEach(item => {
        if (!item || !item.productId) return;
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.name || '', emoji: item.emoji || '🎁', total: 0, cost: 0, quantity: 0 };
        }
        const qty = item.quantity || 0;
        const sellPrice = item.price || 0;
        const costPrice = item.costPrice || 0;
        productSales[item.productId].quantity += qty;
        productSales[item.productId].total += sellPrice * qty;
        productSales[item.productId].cost += costPrice * qty;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const monthCompletedOrders = globalThis._bolaginamOrders.filter(o =>
      o.createdAt && String(o.createdAt).startsWith(thisMonth) && o.status === 'yetkazildi'
    );

    let monthRevenueSold = 0;
    let monthCostSold = 0;
    monthCompletedOrders.forEach(order => {
      (order.items || []).forEach(item => {
        if (!item) return;
        const qty = item.quantity || 0;
        monthRevenueSold += (item.price || 0) * qty;
        monthCostSold += (item.costPrice || 0) * qty;
      });
    });

    let totalRevenueSold = 0;
    let totalCostSold = 0;
    completedOrders.forEach(order => {
      (order.items || []).forEach(item => {
        if (!item) return;
        const qty = item.quantity || 0;
        totalRevenueSold += (item.price || 0) * qty;
        totalCostSold += (item.costPrice || 0) * qty;
      });
    });

    return {
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      monthOrders: monthOrders.length,
      monthRevenue: monthOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      monthProfit: monthRevenueSold - monthCostSold,
      totalProfit: totalRevenueSold - totalCostSold,
      totalProducts: globalThis._bolaginamProducts.length,
      inStockProducts: globalThis._bolaginamProducts.filter(p => p.inStock).length,
      totalOrders: globalThis._bolaginamOrders.length,
      activeOrders: globalThis._bolaginamOrders.filter(o => !['yetkazildi', 'bekor'].includes(o.status)).length,
      topProducts,
      recentOrders: getOrders().slice(0, 5),
    };
  } catch (err) {
    console.error("getStats error:", err);
    return {
      todayOrders: 0,
      todayRevenue: 0,
      monthOrders: 0,
      monthRevenue: 0,
      monthProfit: 0,
      totalProfit: 0,
      totalProducts: (globalThis._bolaginamProducts || []).length,
      inStockProducts: (globalThis._bolaginamProducts || []).filter(p => p.inStock).length,
      totalOrders: (globalThis._bolaginamOrders || []).length,
      activeOrders: 0,
      topProducts: [],
      recentOrders: [],
    };
  }
}

// ========== SITE SETTINGS ==========
export function getSiteSettings() {
  return { ...globalThis._bolaginamSettings };
}

export async function updateSiteSettings(data) {
  await syncFromBlob();
  globalThis._bolaginamSettings = {
    ...globalThis._bolaginamSettings,
    ...data,
  };
  await saveToBlob();
  return globalThis._bolaginamSettings;
}
