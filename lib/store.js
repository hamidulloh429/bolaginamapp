/**
 * BOLAGINAM — Server-side data store
 * Uses globalThis so that state is shared across all Next.js compilation chunks (Server Components, Route Handlers, etc.)
 */

import { products as mockProducts, categories as mockCategories } from '@/data/products';

// Bo'sh boshlang'ich holat — barcha mahsulotlar va buyurtmalar o'chirilgan
globalThis._bolaginamProducts = [];
globalThis._bolaginamOrders = [];

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
  return product;
}

export function updateProduct(id, data) {
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
  // Enrich items with costPrice from product catalog
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

    // Profit calculations
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
      totalProducts: 0,
      inStockProducts: 0,
      totalOrders: 0,
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
