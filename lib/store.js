/**
 * BOLAGINAM — Server-side in-memory data store
 * Ma'lumotlar server qayta ishga tushganda yo'qoladi.
 * Keyinchalik database bilan almashtiriladi.
 */

import { products as mockProducts, categories as mockCategories } from '@/data/products';

// ===== Deep clone va stock qo'shish =====
let products = JSON.parse(JSON.stringify(mockProducts)).map((p, i) => ({
  ...p,
  stock: p.inStock ? [25, 14, 8, 32, 50, 100, 6, 45, 18, 30, 22, 3, 60, 38, 15, 20, 0, 12][i] || 10 : 0,
}));

let categories = JSON.parse(JSON.stringify(mockCategories));

// ===== Mock buyurtmalar =====
let orders = [
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

let nextProductId = Math.max(...products.map(p => p.id)) + 1;
let nextOrderId = Math.max(...orders.map(o => o.id)) + 1;

// ========== PRODUCTS ==========
export function getProducts() {
  return [...products];
}

export function getProduct(id) {
  return products.find(p => p.id === Number(id)) || null;
}

export function addProduct(data) {
  const product = {
    id: nextProductId++,
    name: data.name,
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
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
  products.push(product);
  return product;
}

export function updateProduct(id, data) {
  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    name: data.name ?? products[index].name,
    price: data.price !== undefined ? Number(data.price) : products[index].price,
    oldPrice: data.oldPrice !== undefined ? (data.oldPrice ? Number(data.oldPrice) : null) : products[index].oldPrice,
    category: data.category ?? products[index].category,
    description: data.description ?? products[index].description,
    stock: data.stock !== undefined ? Number(data.stock) : products[index].stock,
    inStock: data.stock !== undefined ? Number(data.stock) > 0 : products[index].inStock,
    badge: data.badge !== undefined ? (data.badge || null) : products[index].badge,
    emoji: data.emoji ?? products[index].emoji,
    image: data.image !== undefined ? data.image : products[index].image,
  };

  return products[index];
}

export function deleteProduct(id) {
  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

// ========== CATEGORIES ==========
export function getCategories() {
  return [...categories];
}

export function getCategory(id) {
  return categories.find(c => c.id === id) || null;
}

export function addCategory(data) {
  const category = {
    id: data.id || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: data.name,
    emoji: data.emoji || '📦',
    color: data.color || '#F1EEFB',
  };
  categories.push(category);
  return category;
}

export function updateCategory(id, data) {
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return null;

  categories[index] = {
    ...categories[index],
    name: data.name ?? categories[index].name,
    emoji: data.emoji ?? categories[index].emoji,
    color: data.color ?? categories[index].color,
  };

  return categories[index];
}

export function deleteCategory(id) {
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return false;
  categories.splice(index, 1);
  return true;
}

// ========== ORDERS ==========
export function getOrders() {
  return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getOrder(id) {
  return orders.find(o => o.id === Number(id)) || null;
}

export function addOrder(data) {
  const order = {
    id: nextOrderId++,
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
  orders.push(order);
  return order;
}

export function updateOrderStatus(id, status) {
  const validStatuses = ['yangi', 'tayyorlanmoqda', 'yolda', 'yetkazildi', 'bekor'];
  if (!validStatuses.includes(status)) return null;

  const index = orders.findIndex(o => o.id === Number(id));
  if (index === -1) return null;

  orders[index] = { ...orders[index], status };
  return orders[index];
}

// ========== STATS ==========
export function getStats() {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.slice(0, 7); // YYYY-MM

  const todayOrders = orders.filter(o =>
    o.createdAt.startsWith(today) && o.status !== 'bekor'
  );

  const monthOrders = orders.filter(o =>
    o.createdAt.startsWith(thisMonth) && o.status !== 'bekor'
  );

  const completedOrders = orders.filter(o => o.status === 'yetkazildi');

  // Eng ko'p sotilgan mahsulotlar
  const productSales = {};
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.name, emoji: item.emoji, total: 0, quantity: 0 };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].total += item.price * item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    todayOrders: todayOrders.length,
    todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
    monthOrders: monthOrders.length,
    monthRevenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
    totalProducts: products.length,
    inStockProducts: products.filter(p => p.inStock).length,
    totalOrders: orders.length,
    activeOrders: orders.filter(o => !['yetkazildi', 'bekor'].includes(o.status)).length,
    topProducts,
    recentOrders: getOrders().slice(0, 5),
  };
}

// ========== SITE SETTINGS ==========
let siteSettings = {
  siteName: "BOLAGINAM",
  tagline: "Bolalar quvonchini uyingizga olib kelamiz",
  phone: "+998 90 123 45 67",
  email: "info@bolaginam.uz",
  address: "Toshkent sh., Chilonzor t.",
  telegramUrl: "https://t.me/bolaginam",
  instagramUrl: "https://instagram.com/bolaginam",
  facebookUrl: "https://facebook.com/bolaginam",
};

export function getSiteSettings() {
  return { ...siteSettings };
}

export function updateSiteSettings(data) {
  siteSettings = {
    ...siteSettings,
    ...data,
  };
  return siteSettings;
}
