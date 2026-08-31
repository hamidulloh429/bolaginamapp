/**
 * BOLAGINAM — Server-side data store
 * Uses globalThis so that state is shared across all Next.js compilation chunks (Server Components, Route Handlers, etc.)
 */

import { products as mockProducts, categories as mockCategories } from '@/data/products';

if (!globalThis._bolaginamProducts) {
  globalThis._bolaginamProducts = JSON.parse(JSON.stringify(mockProducts)).map((p, i) => ({
    ...p,
    stock: p.inStock ? [25, 14, 8, 32, 50, 100, 6, 45, 18, 30, 22, 3, 60, 38, 15, 20, 0, 12][i] || 10 : 0,
  }));
}

if (!globalThis._bolaginamCategories) {
  globalThis._bolaginamCategories = JSON.parse(JSON.stringify(mockCategories));
}

if (!globalThis._bolaginamOrders) {
  globalThis._bolaginamOrders = [
    {
      id: 1001,
      createdAt: '2026-08-30T10:15:00Z',
      customer: { name: 'Aziz Karimov', phone: '+998901234567', address: "Toshkent sh., Chilonzor t., 7-kvartal, 15-uy" },
      items: [
        { productId: 1, name: "Yumshoq ayiqcha «Bobo»", quantity: 1, price: 89000, emoji: '🧸' },
        { productId: 6, name: "Suvda suzuvchi o'rdaklar (5 ta)", quantity: 2, price: 35000, emoji: '🐥' },
      ],
      total: 159000,
      status: 'yangi',
    },
    {
      id: 1002,
      createdAt: '2026-08-29T14:30:00Z',
      customer: { name: 'Nodira Xolmatova', phone: '+998931112233', address: "Samarqand sh., Registon ko'chasi, 42-uy" },
      items: [
        { productId: 7, name: 'Magnit konstruktor (64 detal)', quantity: 1, price: 320000, emoji: '🔷' },
      ],
      total: 320000,
      status: 'tayyorlanmoqda',
    },
    {
      id: 1003,
      createdAt: '2026-08-28T09:45:00Z',
      customer: { name: 'Sardor Alimov', phone: '+998901009090', address: "Buxoro sh., Navoiy ko'chasi, 8-uy" },
      items: [
        { productId: 3, name: "Pultli mashina «Tezkor»", quantity: 1, price: 210000, emoji: '🏎️' },
        { productId: 13, name: "Rasm chizish nabori «Rassomcha»", quantity: 2, price: 55000, emoji: '🖍️' },
      ],
      total: 320000,
      status: 'yolda',
    },
    {
      id: 1004,
      createdAt: '2026-08-27T16:20:00Z',
      customer: { name: "Malika To'rayeva", phone: '+998951234567', address: "Toshkent sh., Sergeli t., 3-kvartal" },
      items: [
        { productId: 4, name: "Ballerina qo'g'irchog'i «Laylo»", quantity: 1, price: 125000, emoji: '🩰' },
        { productId: 8, name: "Oshxona nabori «Kichkina oshpaz»", quantity: 1, price: 95000, emoji: '🍳' },
      ],
      total: 220000,
      status: 'yetkazildi',
    },
    {
      id: 1005,
      createdAt: '2026-08-26T11:00:00Z',
      customer: { name: 'Bobur Rahimov', phone: '+998907776655', address: "Namangan sh., Mustaqillik ko'chasi" },
      items: [
        { productId: 12, name: 'Uzakdan boshqariladigan vertolyot', quantity: 1, price: 350000, emoji: '🚁' },
      ],
      total: 350000,
      status: 'bekor',
    },
    {
      id: 1006,
      createdAt: '2026-08-31T08:30:00Z',
      customer: { name: 'Dilnoza Yusupova', phone: '+998933334455', address: "Andijon sh., Bobur ko'chasi, 21-uy" },
      items: [
        { productId: 15, name: 'Chaqaloq uchun karavot mobili', quantity: 1, price: 115000, emoji: '🎠' },
        { productId: 5, name: 'Ranglar piramidasi', quantity: 1, price: 65000, emoji: '🔺' },
        { productId: 9, name: 'Dinozavr oilasi (5 ta)', quantity: 1, price: 78000, emoji: '🦕' },
      ],
      total: 258000,
      status: 'yangi',
    },
    {
      id: 1007,
      createdAt: '2026-08-31T12:45:00Z',
      customer: { name: 'Jasur Toshmatov', phone: '+998901122334', address: "Farg'ona sh., Navbahor t., 5-uy" },
      items: [
        { productId: 2, name: "Yog'och konstruktor «Shahar»", quantity: 2, price: 145000, emoji: '🏗️' },
      ],
      total: 290000,
      status: 'yangi',
    },
    {
      id: 1008,
      createdAt: '2026-08-25T15:10:00Z',
      customer: { name: 'Zulfiya Karimova', phone: '+998945556677', address: "Toshkent sh., Yunusobod t., 19-kvartal" },
      items: [
        { productId: 10, name: "Yirik bloklar to'plami (80 dona)", quantity: 1, price: 185000, emoji: '🧊' },
        { productId: 14, name: "Plastelin to'plami (24 rang)", quantity: 3, price: 42000, emoji: '🎭' },
      ],
      total: 311000,
      status: 'yetkazildi',
    },
  ];
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

export function addProduct(data) {
  const product = {
    id: getNextProductId(),
    name: data.name,
    slug: (data.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    price: Number(data.price),
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
  return product;
}

export function updateProduct(id, data) {
  const index = globalThis._bolaginamProducts.findIndex(p => String(p.id) === String(id));
  if (index === -1) return null;

  globalThis._bolaginamProducts[index] = {
    ...globalThis._bolaginamProducts[index],
    name: data.name ?? globalThis._bolaginamProducts[index].name,
    price: data.price !== undefined ? Number(data.price) : globalThis._bolaginamProducts[index].price,
    oldPrice: data.oldPrice !== undefined ? (data.oldPrice ? Number(data.oldPrice) : null) : globalThis._bolaginamProducts[index].oldPrice,
    category: data.category ?? globalThis._bolaginamProducts[index].category,
    description: data.description ?? globalThis._bolaginamProducts[index].description,
    stock: data.stock !== undefined ? Number(data.stock) : globalThis._bolaginamProducts[index].stock,
    inStock: data.stock !== undefined ? Number(data.stock) > 0 : globalThis._bolaginamProducts[index].inStock,
    badge: data.badge !== undefined ? (data.badge || null) : globalThis._bolaginamProducts[index].badge,
    emoji: data.emoji ?? globalThis._bolaginamProducts[index].emoji,
    image: data.image !== undefined ? data.image : globalThis._bolaginamProducts[index].image,
  };

  return globalThis._bolaginamProducts[index];
}

export function deleteProduct(id) {
  const index = globalThis._bolaginamProducts.findIndex(p => String(p.id) === String(id));
  if (index === -1) return false;
  globalThis._bolaginamProducts.splice(index, 1);
  return true;
}

// ========== CATEGORIES ==========
export function getCategories() {
  return globalThis._bolaginamCategories;
}

export function getCategory(id) {
  return globalThis._bolaginamCategories.find(c => String(c.id) === String(id)) || null;
}

export function addCategory(data) {
  const category = {
    id: data.id || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: data.name,
    emoji: data.emoji || '📦',
    color: data.color || '#F1EEFB',
  };
  globalThis._bolaginamCategories.push(category);
  return category;
}

export function updateCategory(id, data) {
  const index = globalThis._bolaginamCategories.findIndex(c => String(c.id) === String(id));
  if (index === -1) return null;

  globalThis._bolaginamCategories[index] = {
    ...globalThis._bolaginamCategories[index],
    name: data.name ?? globalThis._bolaginamCategories[index].name,
    emoji: data.emoji ?? globalThis._bolaginamCategories[index].emoji,
    color: data.color ?? globalThis._bolaginamCategories[index].color,
  };

  return globalThis._bolaginamCategories[index];
}

export function deleteCategory(id) {
  const index = globalThis._bolaginamCategories.findIndex(c => String(c.id) === String(id));
  if (index === -1) return false;
  globalThis._bolaginamCategories.splice(index, 1);
  return true;
}

// ========== ORDERS ==========
export function getOrders() {
  return [...globalThis._bolaginamOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getOrder(id) {
  return globalThis._bolaginamOrders.find(o => String(o.id) === String(id)) || null;
}

export function addOrder(data) {
  const order = {
    id: getNextOrderId(),
    createdAt: new Date().toISOString(),
    customer: {
      name: data.name,
      phone: data.phone,
      address: data.address,
    },
    items: data.items || [],
    total: data.total || 0,
    status: 'yangi',
  };
  globalThis._bolaginamOrders.push(order);
  return order;
}

export function updateOrderStatus(id, status) {
  const validStatuses = ['yangi', 'tayyorlanmoqda', 'yolda', 'yetkazildi', 'bekor'];
  if (!validStatuses.includes(status)) return null;

  const index = globalThis._bolaginamOrders.findIndex(o => String(o.id) === String(id));
  if (index === -1) return null;

  globalThis._bolaginamOrders[index] = { ...globalThis._bolaginamOrders[index], status };
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
          productSales[item.productId] = { name: item.name || '', emoji: item.emoji || '🎁', total: 0, quantity: 0 };
        }
        productSales[item.productId].quantity += (item.quantity || 0);
        productSales[item.productId].total += (item.price || 0) * (item.quantity || 0);
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      monthOrders: monthOrders.length,
      monthRevenue: monthOrders.reduce((sum, o) => sum + (o.total || 0), 0),
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

export function updateSiteSettings(data) {
  globalThis._bolaginamSettings = {
    ...globalThis._bolaginamSettings,
    ...data,
  };
  return globalThis._bolaginamSettings;
}
