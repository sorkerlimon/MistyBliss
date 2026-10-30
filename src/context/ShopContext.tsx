'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  CartItem,
  Product,
  ToastMessage,
  Order,
  OrderStatus,
  PromoCode,
  Category,
  RoomCollection,
  BlogPost,
  NewsletterSubscriber,
} from '../types';
import {
  PRODUCTS as INITIAL_PRODUCTS,
  CATEGORIES as INITIAL_CATEGORIES,
  ROOMS as INITIAL_ROOMS,
} from '../data/mockData';
import { BLOG_POSTS as INITIAL_BLOG_POSTS } from '../data/mockBlogData';
import {
  SUPABASE_URL,
  isSupabaseConfigured,
  testSupabaseConnection,
  fetchSupabaseProducts,
  ensureSupabaseProductsCatalog,
  upsertSupabaseProduct,
  deleteSupabaseProduct,
  fetchSupabaseOrders,
  saveSupabaseOrder,
  updateSupabaseOrderStatus,
  deleteSupabaseOrder,
  fetchSupabasePromoCodes,
  upsertSupabasePromoCode,
  fetchSupabaseCategories,
  upsertSupabaseCategory,
  deleteSupabaseCategory,
  ensureSupabaseRoomsCatalog,
  ensureSupabaseBlogCatalog,
  upsertSupabaseBlogPost,
  deleteSupabaseBlogPost,
  fetchSupabaseNewsletterSubscribers,
  deleteSupabaseNewsletterSubscriber,
  ConnectionTestResult,
} from '../lib/supabase';
import { validateAdminCredentials } from '../lib/adminConfig';
import { slugify, uniqueSlug } from '../lib/slug';

interface PromoDiscount {
  code: string;
  percent: number;
}

interface ShopContextType {
  // Storefront products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  promoDiscount: PromoDiscount | null;
  discountAmount: number;
  cartTotal: number;
  addToCart: (productId: string, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string) => void;

  // UI state
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;

  isAccountModalOpen: boolean;
  openAccountModal: () => void;
  closeAccountModal: () => void;

  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;

  // Orders Management (Admin & Customer)
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Promo Codes Management
  promoCodes: PromoCode[];
  createPromoCode: (promo: Omit<PromoCode, 'id' | 'usageCount'>) => void;
  togglePromoStatus: (promoId: string) => void;
  deletePromoCode: (promoId: string) => void;

  // Categories Management
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'slug'> & { slug?: string }) => Category | null;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;

  // Rooms (homepage / collections)
  rooms: RoomCollection[];

  // Journal / blog posts
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'slug'> & { slug?: string }) => BlogPost | null;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (postId: string) => void;

  // Newsletter Design Circle members
  newsletterSubscribers: NewsletterSubscriber[];
  refreshNewsletterSubscribers: () => Promise<void>;
  deleteNewsletterSubscriber: (id: number | string) => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, pass: string) => boolean;
  completeAdminSession: (email: string) => void;
  adminLogout: () => void;

  // Supabase Database Integration
  isSupabaseConfigured: boolean;
  supabaseStatus: ConnectionTestResult | null;
  supabaseProjectUrl: string;
  refreshSupabaseData: () => Promise<void>;
  resetDemoCart: () => void;
  isHydrated: boolean;
}

const ShopContext = createContext<ShopContextType | null>(null);

const CART_STORAGE_KEY = 'misty_bliss_cart_v2';
const WISHLIST_STORAGE_KEY = 'misty_bliss_wishlist_v2';
const PRODUCTS_STORAGE_KEY = 'misty_bliss_products_v4_db';
const ORDERS_STORAGE_KEY = 'misty_bliss_orders_v2';
const PROMOS_STORAGE_KEY = 'misty_bliss_promos_v2';
const CATEGORIES_STORAGE_KEY = 'misty_bliss_categories_v1';
const ROOMS_STORAGE_KEY = 'misty_bliss_rooms_v1';
const BLOG_STORAGE_KEY = 'misty_bliss_blog_posts_v1';
const ADMIN_AUTH_KEY = 'misty_bliss_admin_auth_v2';

const DEFAULT_CART: CartItem[] = [
  { productId: 'mb-001', quantity: 1, selectedColor: 'Warm Cream' },
  { productId: 'mb-005', quantity: 1, selectedColor: 'Blush & Petal' },
];

const DEFAULT_WISHLIST: string[] = ['mb-008', 'mb-011', 'mb-019'];

const INITIAL_PROMOS: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'BLISS15',
    discountPercent: 15,
    minSpend: 50,
    status: 'active',
    usageCount: 42,
    expiryDate: '2026-12-31',
  },
  {
    id: 'promo-2',
    code: 'WELCOME10',
    discountPercent: 10,
    status: 'active',
    usageCount: 89,
    expiryDate: '2026-12-31',
  },
  {
    id: 'promo-3',
    code: 'SPRING25',
    discountPercent: 25,
    minSpend: 100,
    status: 'active',
    usageCount: 19,
    expiryDate: '2026-06-30',
  },
  {
    id: 'promo-4',
    code: 'VIPCLUB20',
    discountPercent: 20,
    status: 'active',
    usageCount: 8,
    expiryDate: '2026-11-15',
  },
  {
    id: 'promo-5',
    code: 'ARCHIVE30',
    discountPercent: 30,
    status: 'inactive',
    usageCount: 54,
    expiryDate: '2026-03-31',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'MB-8921',
    date: 'Oct 14, 2026',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@example.com',
    customerPhone: '+1 (503) 555-0192',
    shippingAddress: '742 Evergreen Terrace, Apt 3B, Portland, OR 97201',
    items: [
      {
        productId: 'mb-001',
        name: 'Sculptural Fluted Stoneware Vase',
        price: 68,
        quantity: 1,
        selectedColor: 'Warm Cream',
        image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80',
      },
      {
        productId: 'mb-013',
        name: 'Heavyweight Washed Belgian Linen Cushion',
        price: 48,
        quantity: 1,
        selectedColor: 'Dusty Rose',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 116.0,
    discount: 0,
    shippingFee: 0,
    total: 116.0,
    status: 'delivered',
    paymentMethod: 'card',
    shippingSpeed: 'standard',
  },
  {
    id: 'MB-8734',
    date: 'Oct 19, 2026',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    customerName: 'Marcus Sterling',
    customerEmail: 'm.sterling@studioarch.com',
    customerPhone: '+1 (415) 555-3829',
    shippingAddress: '1280 Mission Street, Fl 4, San Francisco, CA 94103',
    items: [
      {
        productId: 'mb-008',
        name: 'Aurelia Fluted Linen Table Lamp',
        price: 135,
        quantity: 1,
        selectedColor: 'Ivory Linen',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 135.0,
    discount: 20.25,
    shippingFee: 0,
    total: 114.75,
    status: 'shipped',
    paymentMethod: 'card',
    shippingSpeed: 'standard',
  },
  {
    id: 'MB-8640',
    date: 'Oct 21, 2026',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    customerName: 'Sophia Chen',
    customerEmail: 'sophia.c@gmail.com',
    customerPhone: '+1 (206) 555-7741',
    shippingAddress: '402 Pine Street, Apt 11C, Seattle, WA 98101',
    items: [
      {
        productId: 'mb-005',
        name: 'Blush Garden Rose Botanical Stem Bundle',
        price: 52,
        quantity: 2,
        selectedColor: 'Blush & Petal',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80',
      },
      {
        productId: 'mb-018',
        name: 'Travertine Dual Arch Candelabra',
        price: 62,
        quantity: 1,
        selectedColor: 'Warm Travertine',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 166.0,
    discount: 16.6,
    shippingFee: 0,
    total: 149.4,
    status: 'processing',
    paymentMethod: 'card',
    shippingSpeed: 'standard',
  },
  {
    id: 'MB-8512',
    date: 'Oct 22, 2026',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    customerName: 'Liam Vance',
    customerEmail: 'liam.vance@lifestyle.org',
    customerPhone: '+1 (512) 555-9014',
    shippingAddress: '810 Congress Avenue, Austin, TX 78701',
    items: [
      {
        productId: 'mb-025',
        name: 'Hand-Carved Marble Infinity Knot',
        price: 78,
        quantity: 1,
        selectedColor: 'Ivory Marble',
        image: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 78.0,
    discount: 0,
    shippingFee: 0,
    total: 78.0,
    status: 'pending',
    paymentMethod: 'cod',
    shippingSpeed: 'standard',
  },
  {
    id: 'MB-8409',
    date: 'Oct 22, 2026',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    customerName: 'Chloe Dupont',
    customerEmail: 'chloe.dupont@parisienne.fr',
    customerPhone: '+1 (646) 555-1288',
    shippingAddress: '350 Bleecker Street, New York, NY 10014',
    items: [
      {
        productId: 'mb-019',
        name: 'Santal & Amberwood Ceramic Vessel Candle',
        price: 38,
        quantity: 1,
        selectedColor: 'Glazed Bone',
        image: 'https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 38.0,
    discount: 0,
    shippingFee: 8.5,
    total: 46.5,
    status: 'pending',
    paymentMethod: 'card',
    shippingSpeed: 'standard',
  },
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hydration safety flag
  const [isHydrated, setIsHydrated] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Promo Codes state
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMOS);

  // Categories state
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Rooms state
  const [rooms, setRooms] = useState<RoomCollection[]>(INITIAL_ROOMS);

  // Blog / journal posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);

  // Newsletter subscribers
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);

  // Admin Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Cart state - initialized identically on SSR and Client
  const [cart, setCart] = useState<CartItem[]>(DEFAULT_CART);

  // Wishlist state - initialized identically on SSR and Client
  const [wishlist, setWishlist] = useState<string[]>(DEFAULT_WISHLIST);

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [promoDiscount, setPromoDiscount] = useState<PromoDiscount | null>(null);

  // Supabase Database Status
  const [supabaseStatus, setSupabaseStatus] = useState<ConnectionTestResult | null>(null);

  // On client mount: safely hydrate from localStorage without SSR mismatch
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          const parsed = JSON.parse(storedCart);
          if (Array.isArray(parsed)) setCart(parsed);
        }

        const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedWishlist) {
          const parsed = JSON.parse(storedWishlist);
          if (Array.isArray(parsed)) setWishlist(parsed);
        }

        // Products / rooms: local cache only when Supabase is not configured.
        // With Supabase, refresh below replaces state from the database.
        if (!isSupabaseConfigured) {
          const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
          if (storedProducts) {
            const parsed = JSON.parse(storedProducts);
            if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
          }
          const storedRooms = localStorage.getItem(ROOMS_STORAGE_KEY);
          if (storedRooms) {
            const parsed = JSON.parse(storedRooms);
            if (Array.isArray(parsed) && parsed.length > 0) setRooms(parsed);
          }
          const storedBlog = localStorage.getItem(BLOG_STORAGE_KEY);
          if (storedBlog) {
            const parsed = JSON.parse(storedBlog);
            if (Array.isArray(parsed) && parsed.length > 0) setBlogPosts(parsed);
          }
        }

        const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (storedOrders) {
          const parsed = JSON.parse(storedOrders);
          if (Array.isArray(parsed)) setOrders(parsed);
        }

        const storedPromos = localStorage.getItem(PROMOS_STORAGE_KEY);
        if (storedPromos) {
          const parsed = JSON.parse(storedPromos);
          if (Array.isArray(parsed) && parsed.length > 0) setPromoCodes(parsed);
        }

        const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        if (storedCategories) {
          const parsed = JSON.parse(storedCategories);
          if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
        }

        const storedAdmin = localStorage.getItem(ADMIN_AUTH_KEY);
        if (storedAdmin === 'true') {
          setIsAdminLoggedIn(true);
        }
      }
    } catch (err) {
      console.warn('Hydration localStorage error:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync / Refresh data from Supabase
  const refreshSupabaseData = useCallback(async () => {
    try {
      const conn = await testSupabaseConnection();
      setSupabaseStatus(conn);

      if (conn.connected) {
        // Products always come from Supabase when the table exists.
        // Seed the full catalog if the remote table is empty/incomplete.
        if (conn.tablesStatus?.products) {
          const dbProducts = await ensureSupabaseProductsCatalog(INITIAL_PRODUCTS);
          if (dbProducts && dbProducts.length > 0) {
            setProducts(dbProducts);
          } else {
            const fallback = await fetchSupabaseProducts();
            if (fallback && fallback.length > 0) setProducts(fallback);
          }
        }

        // Fetch orders if table exists in Supabase
        if (conn.tablesStatus?.orders) {
          const dbOrders = await fetchSupabaseOrders();
          if (dbOrders && dbOrders.length > 0) {
            setOrders(dbOrders);
          }
        }

        // Fetch promo codes if table exists in Supabase
        if (conn.tablesStatus?.promo_codes) {
          const dbPromos = await fetchSupabasePromoCodes();
          if (dbPromos && dbPromos.length > 0) {
            setPromoCodes(dbPromos);
          }
        }

        // Fetch categories if table exists in Supabase
        if (conn.tablesStatus?.categories) {
          const dbCategories = await fetchSupabaseCategories();
          if (dbCategories && dbCategories.length > 0) {
            setCategories(dbCategories);
          }
        }

        // Rooms for homepage / collections
        if (conn.tablesStatus?.rooms) {
          const dbRooms = await ensureSupabaseRoomsCatalog(INITIAL_ROOMS);
          if (dbRooms && dbRooms.length > 0) {
            setRooms(dbRooms);
          }
        }

        // Journal blog posts
        if (conn.tablesStatus?.blog_posts) {
          const dbPosts = await ensureSupabaseBlogCatalog(INITIAL_BLOG_POSTS);
          if (dbPosts && dbPosts.length > 0) {
            setBlogPosts(dbPosts);
          }
        }

        // Newsletter Design Circle members
        if (conn.tablesStatus?.newsletter_subscribers) {
          const subs = await fetchSupabaseNewsletterSubscribers();
          if (subs) setNewsletterSubscribers(subs);
        }
      }
    } catch (err) {
      console.warn('Initial Supabase sync caught:', err);
    }
  }, []);

  // Run initial Supabase connectivity check & fetch
  useEffect(() => {
    refreshSupabaseData();
  }, [refreshSupabaseData]);

  // Sync to local storage only AFTER initial hydration has finished
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {}
  }, [products, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(promoCodes));
    } catch {}
  }, [promoCodes, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch {}
  }, [categories, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
    } catch {}
  }, [rooms, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogPosts));
    } catch {}
  }, [blogPosts, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ADMIN_AUTH_KEY, isAdminLoggedIn ? 'true' : 'false');
    } catch {}
  }, [isAdminLoggedIn, isHydrated]);

  const resetDemoCart = () => {
    setCart(DEFAULT_CART);
    addToast('Demo Cart Loaded', '2 curated items added to your shopping bag', 'success');
  };

  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find((p) => p.slug === slug);
  };

  // Product CRUD
  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    addToast('Product Created', `${product.name} added to catalog`);
    // Sync to Supabase in background
    upsertSupabaseProduct(product).catch((err) => {
      console.warn('Supabase product add failed:', err);
    });
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addToast('Product Updated', `${updated.name} has been updated`);
    // Sync to Supabase in background
    upsertSupabaseProduct(updated).catch((err) => {
      console.warn('Supabase product update failed:', err);
    });
  };

  const deleteProduct = (productId: string) => {
    const p = getProductById(productId);
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    // Also remove from cart and wishlist if present
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    addToast('Product Deleted', p ? `${p.name} removed from store` : 'Item deleted', 'info');
    // Delete in Supabase in background
    deleteSupabaseProduct(productId).catch((err) => {
      console.warn('Supabase product delete failed:', err);
    });
  };

  // Order CRUD
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const orderNumber = `MB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: orderNumber,
      createdAt: Date.now(),
      status: 'pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    // Save to Supabase in background
    saveSupabaseOrder(newOrder).catch((err) => {
      console.warn('Supabase order creation failed:', err);
    });
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    addToast('Order Status Updated', `Order #${orderId} marked as ${status}`);
    // Sync status to Supabase in background
    updateSupabaseOrderStatus(orderId, status).catch((err) => {
      console.warn('Supabase status update failed:', err);
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    addToast('Order Removed', `Order #${orderId} was deleted`, 'info');
    // Sync deletion to Supabase in background
    deleteSupabaseOrder(orderId).catch((err) => {
      console.warn('Supabase order delete failed:', err);
    });
  };

  // Promo Code CRUD
  const createPromoCode = (promo: Omit<PromoCode, 'id' | 'usageCount'>) => {
    const newCode: PromoCode = {
      ...promo,
      id: `promo-${Date.now()}`,
      code: promo.code.trim().toUpperCase(),
      usageCount: 0,
    };
    setPromoCodes((prev) => [newCode, ...prev]);
    addToast('Promo Code Added', `Code ${newCode.code} created with ${newCode.discountPercent}% off`);
    // Sync promo code to Supabase in background
    upsertSupabasePromoCode(newCode).catch((err) => {
      console.warn('Supabase promo creation failed:', err);
    });
  };

  const togglePromoStatus = (promoId: string) => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.id === promoId ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p))
    );
  };

  const deletePromoCode = (promoId: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== promoId));
    addToast('Promo Code Deleted', 'Code has been removed', 'info');
  };

  // Category CRUD
  const addCategory = (input: Omit<Category, 'id' | 'slug'> & { slug?: string }): Category | null => {
    const name = input.name.trim();
    if (!name) {
      addToast('Category name required', 'Enter a name before saving', 'info');
      return null;
    }
    if (!input.image?.trim()) {
      addToast('Image required', 'Provide an image link or upload a file', 'info');
      return null;
    }

    const slug = uniqueSlug(input.slug?.trim() || name, categories.map((c) => c.slug));
    const newCategory: Category = {
      id: `cat-${slug}-${Date.now().toString(36)}`,
      slug,
      name,
      shortName: (input.shortName || name).trim(),
      description: (input.description || '').trim(),
      image: input.image.trim(),
      imageSource: input.imageSource || 'url',
    };

    setCategories((prev) => [...prev, newCategory]);
    addToast('Category Created', `${newCategory.name} is live on the storefront`);
    upsertSupabaseCategory(newCategory, categories.length + 1).catch((err) => {
      console.warn('Supabase category add failed:', err);
    });
    return newCategory;
  };

  const updateCategory = (updated: Category) => {
    const others = categories.filter((c) => c.id !== updated.id).map((c) => c.slug);
    const slug = uniqueSlug(updated.slug || updated.name, others);
    const next: Category = {
      ...updated,
      slug: slugify(slug) || updated.slug,
      name: updated.name.trim(),
      shortName: (updated.shortName || updated.name).trim(),
      description: (updated.description || '').trim(),
      image: updated.image.trim(),
      imageSource: updated.imageSource || 'url',
    };
    setCategories((prev) => prev.map((c) => (c.id === next.id ? next : c)));
    addToast('Category Updated', `${next.name} saved`);
    const sortOrder = categories.findIndex((c) => c.id === next.id) + 1;
    upsertSupabaseCategory(next, sortOrder > 0 ? sortOrder : 1).catch((err) => {
      console.warn('Supabase category update failed:', err);
    });
  };

  const deleteCategory = (categoryId: string) => {
    const target = categories.find((c) => c.id === categoryId);
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    addToast('Category Deleted', target ? `${target.name} removed` : 'Category removed', 'info');
    deleteSupabaseCategory(categoryId).catch((err) => {
      console.warn('Supabase category delete failed:', err);
    });
  };

  // Blog / Journal CRUD
  const addBlogPost = (input: Omit<BlogPost, 'id' | 'slug'> & { slug?: string }): BlogPost | null => {
    const title = input.title.trim();
    if (!title) {
      addToast('Title required', 'Enter a blog title before saving', 'info');
      return null;
    }
    if (!input.coverImage?.trim()) {
      addToast('Cover image required', 'Add a cover image link', 'info');
      return null;
    }
    const slug = uniqueSlug(input.slug?.trim() || title, blogPosts.map((p) => p.slug));
    const newPost: BlogPost = {
      id: `post-${Date.now().toString(36)}`,
      slug,
      title,
      subtitle: (input.subtitle || '').trim(),
      excerpt: (input.excerpt || '').trim() || title,
      content: (input.content || []).map((p) => p.trim()).filter(Boolean),
      category: input.category || 'Studio Craft',
      author: {
        name: input.author?.name?.trim() || 'Misty Bliss Studio',
        role: input.author?.role?.trim() || 'Editor',
        avatar:
          input.author?.avatar?.trim() ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      publishedDate:
        input.publishedDate?.trim() ||
        new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: input.readTime?.trim() || '3 min read',
      coverImage: input.coverImage.trim(),
      tags: input.tags || [],
      featured: Boolean(input.featured),
      relatedProductSlugs: input.relatedProductSlugs || [],
    };

    // Only one featured post at a time
    setBlogPosts((prev) => {
      const next = newPost.featured ? prev.map((p) => ({ ...p, featured: false })) : prev;
      return [newPost, ...next];
    });
    addToast('Blog Post Created', `${newPost.title} is live in the Journal`);
    upsertSupabaseBlogPost(newPost).catch((err) => console.warn('Supabase blog add failed:', err));
    if (newPost.featured) {
      blogPosts
        .filter((p) => p.featured)
        .forEach((p) => {
          upsertSupabaseBlogPost({ ...p, featured: false }).catch(() => {});
        });
    }
    return newPost;
  };

  const updateBlogPost = (updated: BlogPost) => {
    const others = blogPosts.filter((p) => p.id !== updated.id).map((p) => p.slug);
    const slug = uniqueSlug(updated.slug || updated.title, others);
    const next: BlogPost = {
      ...updated,
      slug: slugify(slug) || updated.slug,
      title: updated.title.trim(),
      subtitle: (updated.subtitle || '').trim(),
      excerpt: (updated.excerpt || '').trim(),
      content: (updated.content || []).map((p) => p.trim()).filter(Boolean),
      coverImage: updated.coverImage.trim(),
      author: {
        name: updated.author.name.trim() || 'Misty Bliss Studio',
        role: updated.author.role.trim() || 'Editor',
        avatar: updated.author.avatar.trim(),
      },
    };

    setBlogPosts((prev) =>
      prev.map((p) => {
        if (p.id === next.id) return next;
        if (next.featured) return { ...p, featured: false };
        return p;
      })
    );
    addToast('Blog Post Updated', `${next.title} saved`);
    upsertSupabaseBlogPost(next).catch((err) => console.warn('Supabase blog update failed:', err));
    if (next.featured) {
      blogPosts
        .filter((p) => p.id !== next.id && p.featured)
        .forEach((p) => {
          upsertSupabaseBlogPost({ ...p, featured: false }).catch(() => {});
        });
    }
  };

  const deleteBlogPost = (postId: string) => {
    const target = blogPosts.find((p) => p.id === postId);
    setBlogPosts((prev) => prev.filter((p) => p.id !== postId));
    addToast('Blog Post Deleted', target ? `"${target.title}" removed` : 'Post removed', 'info');
    deleteSupabaseBlogPost(postId).catch((err) => console.warn('Supabase blog delete failed:', err));
  };

  const refreshNewsletterSubscribers = useCallback(async () => {
    const subs = await fetchSupabaseNewsletterSubscribers();
    if (subs) setNewsletterSubscribers(subs);
  }, []);

  const deleteNewsletterSubscriber = (id: number | string) => {
    const target = newsletterSubscribers.find((s) => s.id === id);
    setNewsletterSubscribers((prev) => prev.filter((s) => s.id !== id));
    addToast('Subscriber removed', target ? target.email : 'Email removed', 'info');
    deleteSupabaseNewsletterSubscriber(id).catch((err) =>
      console.warn('Supabase newsletter delete failed:', err)
    );
  };

  const persistAdminSession = (email: string) => {
    setIsAdminLoggedIn(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
        localStorage.setItem('misty_bliss_admin_email', email.trim().toLowerCase());
      } catch (e) {
        console.warn('Could not persist admin session', e);
      }
    }
  };

  // Admin Auth — env credentials only (no hardcoded fallbacks)
  const adminLogin = (email: string, pass: string): boolean => {
    if (!validateAdminCredentials(email, pass)) return false;
    const normalized = email.trim().toLowerCase();
    persistAdminSession(normalized);
    addToast('Welcome Admin', `Signed in as ${normalized}`);
    return true;
  };

  /** Mark admin session after server `/api/admin/login` succeeds */
  const completeAdminSession = (email: string) => {
    const normalized = email.trim().toLowerCase();
    persistAdminSession(normalized);
    addToast('Welcome Admin', `Signed in as ${normalized}`);
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(ADMIN_AUTH_KEY);
        localStorage.removeItem('misty_bliss_admin_email');
      } catch (e) {
        console.warn('Could not clear admin session', e);
      }
    }
    addToast('Logged Out', 'Admin session ended');
  };

  // Cart operations
  const addToCart = (productId: string, quantity = 1, selectedColor?: string) => {
    const product = getProductById(productId);
    if (!product) return;

    const defaultColor = selectedColor || (product.colors.length > 0 ? product.colors[0].name : undefined);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId && item.selectedColor === defaultColor
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { productId, quantity, selectedColor: defaultColor }];
      }
    });

    addToast('Added to bag', `${product.name} (Qty: ${quantity})`, 'success');
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string, selectedColor?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && (selectedColor ? item.selectedColor === selectedColor : true))
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && (selectedColor ? item.selectedColor === selectedColor : true)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    const product = getProductById(productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        if (product) addToast('Removed from wishlist', product.name, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        if (product) addToast('Saved to wishlist', product.name, 'sale');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const moveToCartFromWishlist = (productId: string) => {
    addToCart(productId, 1);
    toggleWishlist(productId);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const p = getProductById(item.productId);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);
  }, [cart, products]);

  const freeShippingThreshold = 75;
  const shippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 8.5;

  const discountAmount = useMemo(() => {
    if (!promoDiscount) return 0;
    return Math.round(cartSubtotal * (promoDiscount.percent / 100) * 100) / 100;
  }, [cartSubtotal, promoDiscount]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + shippingFee);
  }, [cartSubtotal, discountAmount, shippingFee]);

  const applyPromoCode = (code: string) => {
    const normalized = code.trim().toUpperCase();

    // Check dynamic promo codes
    const match = promoCodes.find((p) => p.code.toUpperCase() === normalized);
    if (match) {
      if (match.status !== 'active') {
        return { success: false, message: `Promo code "${normalized}" is currently expired or inactive.` };
      }
      if (match.minSpend && cartSubtotal < match.minSpend) {
        return {
          success: false,
          message: `Code "${normalized}" requires a minimum subtotal of $${match.minSpend}.`,
        };
      }
      setPromoDiscount({ code: normalized, percent: match.discountPercent });
      // Increment usage count
      setPromoCodes((prev) =>
        prev.map((p) => (p.id === match.id ? { ...p, usageCount: p.usageCount + 1 } : p))
      );
      addToast('Promo Code Applied', `${match.discountPercent}% savings applied to your order`, 'success');
      return { success: true, message: `${match.discountPercent}% discount applied!` };
    }

    // Fallbacks
    if (normalized === 'BLISS15') {
      setPromoDiscount({ code: 'BLISS15', percent: 15 });
      addToast('Promo Code Applied', '15% savings applied to your order', 'success');
      return { success: true, message: '15% discount applied!' };
    }
    if (normalized === 'WELCOME10') {
      setPromoDiscount({ code: 'WELCOME10', percent: 10 });
      addToast('Promo Code Applied', '10% savings applied to your order', 'success');
      return { success: true, message: '10% discount applied!' };
    }

    return { success: false, message: 'Invalid code. Try "BLISS15" or check with admin.' };
  };

  const removePromoCode = () => {
    setPromoDiscount(null);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        cart,
        cartCount,
        cartSubtotal,
        shippingFee,
        freeShippingThreshold,
        promoDiscount,
        discountAmount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,

        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,

        isMobileMenuOpen,
        openMobileMenu: () => setIsMobileMenuOpen(true),
        closeMobileMenu: () => setIsMobileMenuOpen(false),
        toggleMobileMenu: () => setIsMobileMenuOpen((prev) => !prev),

        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),

        isAccountModalOpen,
        openAccountModal: () => setIsAccountModalOpen(true),
        closeAccountModal: () => setIsAccountModalOpen(false),

        toasts,
        addToast,
        removeToast,

        getProductById,
        getProductBySlug,

        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,

        promoCodes,
        createPromoCode,
        togglePromoStatus,
        deletePromoCode,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        rooms,

        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,

        newsletterSubscribers,
        refreshNewsletterSubscribers,
        deleteNewsletterSubscriber,

        isAdminLoggedIn,
        adminLogin,
        completeAdminSession,
        adminLogout,

        isSupabaseConfigured,
        supabaseStatus,
        supabaseProjectUrl: SUPABASE_URL,
        refreshSupabaseData,
        resetDemoCart,
        isHydrated,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
