import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { useRouter } from '../../context/RouterContext';
import { MistyBlissIcon } from '../../components/common/MistyBlissIcon';
import { Product, Order, OrderStatus, PromoCode } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Truck,
  Users,
  Building2,
  UserCheck,
  Package,
  Plus,
  FolderTree,
  Tag,
  CreditCard,
  BarChart3,
  Settings,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  AlertCircle,
  X,
  ExternalLink,
  DollarSign,
  TrendingUp,
  LogOut,
  Menu,
  ArrowLeft,
  Key,
  User,
  ShieldCheck,
  ChevronRight,
  Send,
  MapPin,
  RefreshCw,
  Database,
  Copy,
  Check,
} from 'lucide-react';
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SQL_MIGRATION_SCHEMA,
  testSupabaseConnection,
  seedSupabaseInitialData,
} from '../../lib/supabase';
import { getAdminCredentials } from '../../lib/adminConfig';

type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'create-order'
  | 'order-assignments'
  | 'customers'
  | 'suppliers'
  | 'staff'
  | 'products'
  | 'categories'
  | 'promos'
  | 'payments'
  | 'reports'
  | 'database'
  | 'settings';

export const AdminPortal: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    promoCodes,
    createPromoCode,
    togglePromoStatus,
    deletePromoCode,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    addToast,
    isSupabaseConfigured,
    supabaseStatus,
    supabaseProjectUrl,
    refreshSupabaseData,
  } = useShop();

  const { navigate } = useRouter();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Orders Tab State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Manual Order Creation State
  const [manualOrderForm, setManualOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    productId: products[0]?.id || '',
    quantity: 1,
    selectedColor: 'Warm Cream',
    paymentMethod: 'card' as 'card' | 'cod',
    shippingSpeed: 'standard' as 'standard' | 'express',
  });

  // Products Tab State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    price: 48,
    compareAtPrice: 0,
    categorySlug: 'vases-ceramics',
    material: 'Grogged Stoneware',
    dimensions: 'H 24cm × Dia 16cm',
    stockStatus: 'in_stock' as Product['stockStatus'],
    imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    description: '',
    colorName: 'Warm Cream',
    colorHex: '#EAE5DC',
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    careInstructions: 'Wipe clean with a soft dry cloth.',
  });

  // Promo Code Tab State
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: '',
    discountPercent: 15,
    minSpend: 0,
    expiryDate: '2026-12-31',
    status: 'active' as PromoCode['status'],
  });

  // Store Settings State
  const [settingsForm, setSettingsForm] = useState({
    storeName: 'Misty Bliss',
    supportEmail: 'care@mistyblisshome.com',
    supportPhone: '+1 (503) 555-0192',
    freeShippingThreshold: 75,
    standardShippingFee: 8.5,
    showroomAddress: '418 Mercer Walk, Portland, OR 97201',
    currencyCode: 'USD ($)',
  });

  // Supabase Database Management State
  const [isSeedingDb, setIsSeedingDb] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showSchemaDrawer, setShowSchemaDrawer] = useState(false);
  const [localDbTest, setLocalDbTest] = useState<any>(null);

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    try {
      const res = await testSupabaseConnection();
      setLocalDbTest(res);
      await refreshSupabaseData();
      if (res.connected) {
        addToast('Supabase Connected', `Ping successful (${res.latencyMs}ms). Database reachable.`, 'success');
      } else {
        addToast('Connection Notice', res.message, 'info');
      }
    } catch (err: any) {
      addToast('Connection Error', err?.message || 'Could not reach Supabase endpoint', 'info');
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeedingDb(true);
    addToast('Seeding Supabase', 'Uploading products, orders, and promo codes to your Supabase project...', 'info');
    try {
      const result = await seedSupabaseInitialData(products, orders, promoCodes);
      if (result.success) {
        addToast(
          'Supabase Seed Complete',
          `Synced ${result.productsCount} products, ${result.ordersCount} orders, and ${result.promosCount} promo codes!`,
          'success'
        );
        await refreshSupabaseData();
      } else {
        addToast(
          'Table Notice',
          result.error || 'Please run the SQL schema migration in Supabase first so tables exist.',
          'info'
        );
      }
    } catch (err: any) {
      addToast('Seed Exception', err?.message || 'Failed to seed database', 'info');
    } finally {
      setIsSeedingDb(false);
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION_SCHEMA);
    setCopiedSchema(true);
    addToast('Schema Copied', 'SQL schema script copied to clipboard. Ready to paste in Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(SUPABASE_URL);
    setCopiedUrl(true);
    addToast('URL Copied', 'Supabase project URL copied to clipboard.', 'success');
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(SUPABASE_PUBLISHABLE_KEY);
    setCopiedKey(true);
    addToast('Key Copied', 'Supabase publishable key copied to clipboard.', 'success');
    setTimeout(() => setCopiedKey(false), 2500);
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = adminLogin(loginEmail, loginPassword);
    if (!success) {
      const creds = getAdminCredentials();
      setLoginError(`Invalid credentials. Check ADMIN_EMAIL & ADMIN_PASSWORD in .env (Default: ${creds.email})`);
    }
  };

  const handleFillDemoCredentials = () => {
    const creds = getAdminCredentials();
    setLoginEmail(creds.email);
    setLoginPassword(creds.password);
    setLoginError('');
  };

  // KPI Calculations
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const activePromoCount = useMemo(() => {
    return promoCodes.filter((p) => p.status === 'active').length;
  }, [promoCodes]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stockStatus === 'low_stock' || p.stockStatus === 'out_of_stock');
  }, [products]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  }, [orders]);

  // Unique customers parsed from orders
  const customerList = useMemo(() => {
    const map = new Map<string, {
      name: string;
      email: string;
      phone: string;
      address: string;
      orderCount: number;
      totalSpent: number;
      lastOrderDate: string;
    }>();

    orders.forEach((o) => {
      const existing = map.get(o.customerEmail);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.total;
      } else {
        map.set(o.customerEmail, {
          name: o.customerName,
          email: o.customerEmail,
          phone: o.customerPhone,
          address: o.shippingAddress,
          orderCount: 1,
          totalSpent: o.total,
          lastOrderDate: o.date,
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  // Suppliers Mock Data
  const suppliers = [
    {
      id: 'sup-1',
      name: 'Cascadia Stoneware Kiln',
      location: 'Bend, Oregon',
      materials: 'Grogged Stoneware, Matte Glazes',
      activeOrders: 14,
      leadTime: '5-7 days',
      rating: 4.9,
    },
    {
      id: 'sup-2',
      name: 'Verona Limestone & Travertine Quarry',
      location: 'Tivoli, Italy',
      materials: 'Natural Honed Travertine, Alabaster',
      activeOrders: 8,
      leadTime: '12-14 days',
      rating: 5.0,
    },
    {
      id: 'sup-3',
      name: 'Flanders Flax Weaving Mill',
      location: 'Kortrijk, Belgium',
      materials: '100% Washed Belgian Flax Linen',
      activeOrders: 22,
      leadTime: '7-10 days',
      rating: 4.9,
    },
    {
      id: 'sup-4',
      name: 'Kyoto Botanical Studio',
      location: 'Kyoto, Japan',
      materials: 'Preserved Florals, Silk Stems, Eucalyptus',
      activeOrders: 19,
      leadTime: '4-6 days',
      rating: 4.8,
    },
  ];

  // Staff Mock Data
  const staffMembers = [
    {
      name: 'Limon Sorker',
      email: 'limon@technobd.com',
      role: 'Super Administrator',
      status: 'Active',
      lastActive: 'Just now',
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@mistybliss.com',
      role: 'Studio Operations Manager',
      status: 'Active',
      lastActive: '12 mins ago',
    },
    {
      name: 'Marcus Sterling',
      email: 'marcus.s@mistybliss.com',
      role: 'Fulfillment & Logistics Lead',
      status: 'Active',
      lastActive: '1 hour ago',
    },
    {
      name: 'Sophia Chen',
      email: 'sophia.c@mistybliss.com',
      role: 'Customer Concierge Specialist',
      status: 'Offline',
      lastActive: 'Yesterday',
    },
  ];

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productCategoryFilter !== 'all' && p.categorySlug !== productCategoryFilter) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, productCategoryFilter, productSearch]);

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      slug: prod.slug,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice || 0,
      categorySlug: prod.categorySlug,
      material: prod.material,
      dimensions: prod.dimensions,
      stockStatus: prod.stockStatus,
      imageUrl: prod.images[0] || '',
      description: prod.description,
      colorName: prod.colors[0]?.name || 'Warm Cream',
      colorHex: prod.colors[0]?.hex || '#EAE5DC',
      isNew: !!prod.isNew,
      isBestseller: !!prod.isBestseller,
      isFeatured: !!prod.isFeatured,
      careInstructions: prod.careInstructions,
    });
    setProductModalOpen(true);
  };

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      slug: '',
      price: 55,
      compareAtPrice: 0,
      categorySlug: 'vases-ceramics',
      material: 'Grogged Stoneware',
      dimensions: 'H 24cm × Dia 16cm',
      stockStatus: 'in_stock',
      imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      description: 'Handcrafted stoneware vessel with tactile matte finish.',
      colorName: 'Warm Cream',
      colorHex: '#EAE5DC',
      isNew: true,
      isBestseller: false,
      isFeatured: true,
      careInstructions: 'Wipe clean with a soft dry cloth.',
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const slug =
      productForm.slug.trim() ||
      productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `mb-${Date.now().toString().slice(-4)}`,
      slug,
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      compareAtPrice: productForm.compareAtPrice > 0 ? Number(productForm.compareAtPrice) : undefined,
      categorySlug: productForm.categorySlug,
      collectionSlugs: editingProduct ? editingProduct.collectionSlugs : ['living-room'],
      images: [productForm.imageUrl],
      material: productForm.material,
      colors: [{ name: productForm.colorName, hex: productForm.colorHex }],
      dimensions: productForm.dimensions,
      stockStatus: productForm.stockStatus,
      isNew: productForm.isNew,
      isBestseller: productForm.isBestseller,
      isFeatured: productForm.isFeatured,
      rating: editingProduct ? editingProduct.rating : 4.9,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      careInstructions: productForm.careInstructions,
      roomTypes: editingProduct ? editingProduct.roomTypes : ['living-room'],
    };

    if (editingProduct) {
      updateProduct(productPayload);
    } else {
      addProduct(productPayload);
    }

    setProductModalOpen(false);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.code.trim()) return;

    createPromoCode({
      code: promoForm.code,
      discountPercent: Number(promoForm.discountPercent),
      minSpend: promoForm.minSpend > 0 ? Number(promoForm.minSpend) : undefined,
      expiryDate: promoForm.expiryDate,
      status: promoForm.status,
    });

    setPromoModalOpen(false);
    setPromoForm({
      code: '',
      discountPercent: 15,
      minSpend: 0,
      expiryDate: '2026-12-31',
      status: 'active',
    });
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === manualOrderForm.productId);
    if (!prod) return;

    const subtotal = prod.price * manualOrderForm.quantity;
    const shippingFee = manualOrderForm.shippingSpeed === 'express' ? 14 : subtotal >= 75 ? 0 : 8.5;
    const total = subtotal + shippingFee;

    createOrder({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: manualOrderForm.customerName,
      customerEmail: manualOrderForm.customerEmail,
      customerPhone: manualOrderForm.customerPhone,
      shippingAddress: `${manualOrderForm.address}, ${manualOrderForm.city}, ${manualOrderForm.state} ${manualOrderForm.postalCode}`,
      items: [
        {
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: manualOrderForm.quantity,
          selectedColor: manualOrderForm.selectedColor,
          image: prod.images[0],
        },
      ],
      subtotal,
      discount: 0,
      shippingFee,
      total,
      paymentMethod: manualOrderForm.paymentMethod,
      shippingSpeed: manualOrderForm.shippingSpeed,
    });

    addToast('Manual Order Created', `Order created for ${manualOrderForm.customerName}`);
    setActiveTab('orders');
    setManualOrderForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      productId: products[0]?.id || '',
      quantity: 1,
      selectedColor: 'Warm Cream',
      paymentMethod: 'card',
      shippingSpeed: 'standard',
    });
  };

  // Status Badge Helper
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-[#89947D]/15 text-[#5E6B56] px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-blue-200">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-amber-200">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-orange-200">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-red-200">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
    }
  };

  // ========================================================
  // LOGIN SCREEN
  // ========================================================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FAF8F5]">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E9E3DE] p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E9E3DE] mx-auto flex items-center justify-center">
              <MistyBlissIcon size={28} />
            </div>
            <h1 className="font-heading text-xl font-bold text-[#292522]">
              Store Operations Portal
            </h1>
            <p className="text-xs text-[#77716C]">
              Sign in to manage orders, catalog inventory, and promotional campaigns.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#292522] mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="limon@technobd.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E9E3DE] rounded-lg text-xs text-[#292522] focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
                <User className="w-4 h-4 text-[#77716C] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#292522] mb-1">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E9E3DE] rounded-lg text-xs text-[#292522] focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
                <Key className="w-4 h-4 text-[#77716C] absolute left-3 top-3" />
              </div>
            </div>

            {loginError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#292522] hover:bg-[#3D3834] text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
            >
              Sign In to Admin
            </button>
          </form>

          {/* Quick Credential Helper Button */}
          <div className="pt-4 border-t border-[#E9E3DE] space-y-2 text-center text-xs">
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="w-full py-2 px-3 bg-[#F1E5E1] text-[#292522] rounded-md font-medium text-[11px] hover:bg-[#E8D9D4] transition-colors border border-[#E9E3DE]"
            >
              Fill Credentials from .env ({getAdminCredentials().email})
            </button>
            <div className="text-[11px] text-[#77716C] flex justify-between items-center pt-2">
              <button onClick={() => navigate('/')} className="hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to Storefront
              </button>
              <span className="font-mono text-[10px] text-[#A89F97]">v2.4 Protected</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // LEFT SIDEBAR COMPONENT (Matching Reference Image)
  // ========================================================
  const renderSidebar = () => (
    <aside className="w-64 bg-white border-r border-[#E9E3DE] flex flex-col h-full shrink-0 select-none">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E9E3DE] flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <MistyBlissIcon size={26} />
          <div>
            <h2 className="font-heading text-sm font-bold tracking-tight text-[#292522]">
              Misty Bliss
            </h2>
            <p className="text-[10px] text-[#77716C] font-mono">Store Operations</p>
          </div>
        </div>
        {mobileSidebarOpen && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-[#77716C] hover:text-[#292522]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav List with Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
        
        {/* OVERVIEW */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A94A6]">
            OVERVIEW
          </div>
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'dashboard' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
            <span>Dashboard</span>
          </button>
        </div>

        {/* OPERATIONS */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A94A6]">
            OPERATIONS
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveTab('orders');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className={`w-4 h-4 shrink-0 ${activeTab === 'orders' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
                <span>Orders</span>
              </div>
              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                activeTab === 'orders' ? 'bg-[#D1F2E0] text-[#0E7048]' : 'bg-[#F1F5F9] text-[#475569]'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('create-order');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'create-order'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <PlusCircle className={`w-4 h-4 shrink-0 ${activeTab === 'create-order' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
              <span>Create Order</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('order-assignments');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'order-assignments'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className={`w-4 h-4 shrink-0 ${activeTab === 'order-assignments' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
                <span>Order Shipments</span>
              </div>
              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                activeTab === 'order-assignments' ? 'bg-[#D1F2E0] text-[#0E7048]' : 'bg-[#F1F5F9] text-[#475569]'
              }`}>
                {pendingOrdersCount}
              </span>
            </button>
          </div>
        </div>

        {/* MANAGEMENT */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A94A6]">
            MANAGEMENT
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveTab('customers');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'customers'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <Users className={`w-4 h-4 shrink-0 ${activeTab === 'customers' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
              <span>Customers</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('suppliers');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'suppliers'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'suppliers' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
              <span>Studio Suppliers</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('staff');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'staff'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <UserCheck className={`w-4 h-4 shrink-0 ${activeTab === 'staff' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
              <span>Staff & Roles</span>
            </button>
          </div>
        </div>

        {/* CATALOG & CONFIGURATION */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A94A6]">
            CATALOG & CONFIGURATION
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveTab('products');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'products'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className={`w-4 h-4 shrink-0 ${activeTab === 'products' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
                <span>Products</span>
              </div>
              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                activeTab === 'products' ? 'bg-[#D1F2E0] text-[#0E7048]' : 'bg-[#F1F5F9] text-[#475569]'
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'categories'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className={`w-4 h-4 shrink-0 ${activeTab === 'categories' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
                <span>Categories</span>
              </div>
              <span className="text-[11px] text-[#718096] font-medium">
                {CATEGORIES.length}
              </span>
            </button>
          </div>
        </div>

        {/* BUSINESS & MARKETING */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A94A6]">
            BUSINESS & MARKETING
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveTab('promos');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'promos'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className={`w-4 h-4 shrink-0 ${activeTab === 'promos' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
                <span>Promo Codes</span>
              </div>
              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                activeTab === 'promos' ? 'bg-[#D1F2E0] text-[#0E7048]' : 'bg-[#F1F5F9] text-[#475569]'
              }`}>
                {promoCodes.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('payments');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'payments'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <CreditCard className={`w-4 h-4 shrink-0 ${activeTab === 'payments' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
              <span>Payments</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('reports');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'reports'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === 'reports' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
              <span>Reports</span>
            </button>
          </div>
        </div>

        {/* SYSTEM */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A94A6]">
            SYSTEM
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setActiveTab('database');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'database'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className={`w-4 h-4 shrink-0 ${activeTab === 'database' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
                <span>Supabase Database</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" title="Supabase Connected" />
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#E8F8EE] text-[#0E7048] font-semibold'
                  : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-[#F8FAFC]'
              }`}
            >
              <Settings className={`w-4 h-4 shrink-0 ${activeTab === 'settings' ? 'text-[#0E7048]' : 'text-[#718096]'}`} />
              <span>Settings</span>
            </button>
          </div>
        </div>

      </div>

      {/* Admin User Card in Sidebar Footer */}
      <div className="p-3 border-t border-[#E9E3DE] bg-[#FAF8F5]/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#292522] text-white flex items-center justify-center font-bold text-xs shrink-0">
              LS
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#292522] truncate">Limon Sorker</p>
              <p className="text-[10px] text-[#77716C] truncate">limon@technobd.com</p>
            </div>
          </div>
          <button
            onClick={adminLogout}
            className="p-1.5 text-[#77716C] hover:text-red-700 hover:bg-red-50 rounded-md transition-colors shrink-0"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden text-[#292522]">
      
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block h-full">
        {renderSidebar()}
      </div>

      {/* Mobile Slide-out Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden flex">
          <div className="relative w-64 h-full bg-white shadow-2xl">
            {renderSidebar()}
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E9E3DE] px-4 sm:px-6 flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-[#292522] hover:bg-[#FAF8F5] rounded-md"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs text-[#77716C]">
              <span className="font-medium text-[#292522]">Operations</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#A89F97]" />
              <span className="font-semibold text-[#C77F79] capitalize">
                {activeTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Live Store Switcher */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F1E5E1] text-[#292522] border border-[#E9E3DE] rounded-md text-xs font-semibold transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C77F79]" />
              <span className="hidden sm:inline">View Live Store</span>
              <span className="sm:hidden">Store</span>
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* ======================================================== */}
          {/* TAB: DASHBOARD OVERVIEW */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#292522]">
                    Operations Overview
                  </h1>
                  <p className="text-xs text-[#77716C]">
                    Good day, Limon. Here is today's real-time home décor retail performance.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('create-order')}
                    className="px-3.5 py-2 bg-[#292522] text-white rounded-md text-xs font-semibold hover:bg-[#3D3834] transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Order</span>
                  </button>
                  <button
                    onClick={handleOpenCreateProduct}
                    className="px-3.5 py-2 bg-white border border-[#E9E3DE] hover:bg-[#FAF8F5] text-[#292522] rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5 text-[#C77F79]" />
                    <span>New Product</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-[#E9E3DE] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#77716C]">
                      Total Net Revenue
                    </p>
                    <h3 className="text-2xl font-bold text-[#292522] mt-1 tabular-nums">
                      ${totalRevenue.toFixed(2)}
                    </h3>
                    <p className="text-[11px] text-[#0E7048] mt-1 flex items-center gap-1 font-medium">
                      <TrendingUp className="w-3 h-3" /> Real-time order volume
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#E8F8EE] flex items-center justify-center text-[#0E7048]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#E9E3DE] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#77716C]">
                      Customer Orders
                    </p>
                    <h3 className="text-2xl font-bold text-[#292522] mt-1 tabular-nums">
                      {orders.length}
                    </h3>
                    <p className="text-[11px] text-[#A84940] mt-1 font-medium">
                      {pendingOrdersCount} pending fulfillment
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E9E3DE] flex items-center justify-center text-[#292522]">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#E9E3DE] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#77716C]">
                      Live Catalog Items
                    </p>
                    <h3 className="text-2xl font-bold text-[#292522] mt-1 tabular-nums">
                      {products.length}
                    </h3>
                    <p className="text-[11px] text-[#77716C] mt-1">
                      Across 12 home categories
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E9E3DE] flex items-center justify-center text-[#C77F79]">
                    <Package className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#E9E3DE] shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#77716C]">
                      Active Campaigns
                    </p>
                    <h3 className="text-2xl font-bold text-[#292522] mt-1 tabular-nums">
                      {activePromoCount}
                    </h3>
                    <p className="text-[11px] text-[#77716C] mt-1">
                      {promoCodes.reduce((s, p) => s + p.usageCount, 0)} coupon redemptions
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E9E3DE] flex items-center justify-center text-[#C77F79]">
                    <Tag className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Recent Orders + Quick Actions / Stock */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Recent Orders (8 cols) */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-[#E9E3DE] p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E9E3DE]">
                    <div>
                      <h3 className="font-heading font-semibold text-[#292522] text-sm">
                        Recent Store Purchases
                      </h3>
                      <p className="text-xs text-[#77716C]">Direct checkout client orders</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#C77F79] hover:underline flex items-center gap-1"
                    >
                      <span>View All ({orders.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-[#E9E3DE] text-xs">
                    {orders.slice(0, 6).map((order) => (
                      <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-[#FAF8F5] border border-[#E9E3DE] flex items-center justify-center font-mono font-bold text-[#292522] text-[11px]">
                            #{order.id.replace('MB-', '')}
                          </div>
                          <div>
                            <p className="font-semibold text-[#292522]">{order.customerName}</p>
                            <p className="text-[11px] text-[#77716C]">{order.items.length} items · {order.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-[#292522] tabular-nums">
                            ${order.total.toFixed(2)}
                          </span>
                          {renderStatusBadge(order.status)}
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="p-1 text-[#77716C] hover:text-[#292522]"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Low Stock Alerts & Quick Shortcuts (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Stock Attention */}
                  <div className="bg-white rounded-xl border border-[#E9E3DE] p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E3DE]">
                      <span className="font-semibold text-xs text-[#292522] flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-[#A84940]" />
                        Low Stock Attention ({lowStockProducts.length})
                      </span>
                      <button
                        onClick={() => setActiveTab('products')}
                        className="text-[11px] text-[#C77F79] hover:underline"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {lowStockProducts.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-[#E9E3DE]/60 last:border-0">
                          <span className="text-[#292522] line-clamp-1 max-w-[160px] font-medium">{p.name}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            p.stockStatus === 'out_of_stock' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {p.stockStatus === 'out_of_stock' ? 'Out' : 'Low Stock'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Campaigns Card */}
                  <div className="bg-white rounded-xl border border-[#E9E3DE] p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E3DE]">
                      <span className="font-semibold text-xs text-[#292522] flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-[#C77F79]" />
                        Live Promo Coupons
                      </span>
                      <button
                        onClick={() => setActiveTab('promos')}
                        className="text-[11px] text-[#C77F79] hover:underline"
                      >
                        All ({promoCodes.length})
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {promoCodes.slice(0, 3).map((promo) => (
                        <div key={promo.id} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E9E3DE]">
                              {promo.code}
                            </span>
                            <span className="text-[11px] text-[#C77F79] font-medium">{promo.discountPercent}% off</span>
                          </div>
                          <span className="text-[10px] text-[#77716C]">{promo.usageCount} used</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: ORDERS */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs overflow-hidden space-y-4 p-5 sm:p-6 max-w-7xl mx-auto">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3DE]">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#292522]">
                    Order Management
                  </h2>
                  <p className="text-xs text-[#77716C]">
                    Inspect client orders, update fulfillment lifecycle, and process returns
                  </p>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#FAF8F5] rounded-lg border border-[#E9E3DE] text-xs">
                  {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                        orderStatusFilter === status
                          ? 'bg-white text-[#292522] shadow-xs font-semibold'
                          : 'text-[#77716C] hover:text-[#292522]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search filter input */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="search"
                    placeholder="Search by customer name, email, or order ID..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E3DE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#77716C] absolute left-3 top-2.5" />
                </div>
                <span className="text-xs text-[#77716C] ml-auto">
                  Showing <strong className="text-[#292522]">{filteredOrders.length}</strong> orders
                </span>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto border border-[#E9E3DE] rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#77716C] uppercase text-[10px] tracking-wider border-b border-[#E9E3DE]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Order ID</th>
                      <th className="py-3 px-4 font-semibold">Customer</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold">Items</th>
                      <th className="py-3 px-4 font-semibold">Total</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E3DE] text-[#292522]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-[#77716C]">
                          No orders match the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#292522]">
                            #{order.id}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-[#292522]">{order.customerName}</p>
                            <p className="text-[11px] text-[#77716C]">{order.customerEmail}</p>
                          </td>
                          <td className="py-3 px-4 text-[#77716C] whitespace-nowrap">
                            {order.date}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                            <span className="text-[11px] text-[#77716C] block line-clamp-1 max-w-xs">
                              {order.items.map((i) => i.name).join(', ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold tabular-nums whitespace-nowrap">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="text-xs bg-white border border-[#E9E3DE] rounded px-2 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedOrderDetails(order)}
                                className="p-1.5 rounded hover:bg-[#E9E3DE]/60 text-[#77716C] hover:text-[#292522]"
                                title="View Invoice"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete order #${order.id}?`)) {
                                    deleteOrder(order.id);
                                  }
                                }}
                                className="p-1.5 rounded hover:bg-red-50 text-[#77716C] hover:text-red-700"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: CREATE ORDER (Manual Order Desk) */}
          {/* ======================================================== */}
          {activeTab === 'create-order' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs p-6 max-w-3xl mx-auto space-y-6">
              <div className="pb-4 border-b border-[#E9E3DE]">
                <h2 className="font-heading text-lg font-bold text-[#292522]">
                  Create Manual Customer Order
                </h2>
                <p className="text-xs text-[#77716C]">
                  Book orders taken over phone, showroom visits, or studio consultation
                </p>
              </div>

              <form onSubmit={handleCreateManualOrder} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Lin"
                      value={manualOrderForm.customerName}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, customerName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">Customer Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. maya.lin@example.com"
                      value={manualOrderForm.customerEmail}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, customerEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">Customer Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (503) 555-0100"
                      value={manualOrderForm.customerPhone}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Street address and apartment"
                      value={manualOrderForm.address}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, address: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Portland"
                      value={manualOrderForm.city}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="OR"
                      value={manualOrderForm.state}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, state: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">ZIP *</label>
                    <input
                      type="text"
                      required
                      placeholder="97201"
                      value={manualOrderForm.postalCode}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E9E3DE]">
                  <p className="font-semibold text-[#292522] mb-2 uppercase tracking-wider text-[11px]">Select Product</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <select
                        value={manualOrderForm.productId}
                        onChange={(e) => setManualOrderForm({ ...manualOrderForm, productId: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — ${p.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={manualOrderForm.quantity}
                        onChange={(e) => setManualOrderForm({ ...manualOrderForm, quantity: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono"
                        placeholder="Qty"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">Payment Method</label>
                    <select
                      value={manualOrderForm.paymentMethod}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, paymentMethod: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                    >
                      <option value="card">Credit Card (Authorized)</option>
                      <option value="cod">Cash on Showroom Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">Shipping Speed</label>
                    <select
                      value={manualOrderForm.shippingSpeed}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, shippingSpeed: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                    >
                      <option value="standard">Standard Carbon-Neutral</option>
                      <option value="express">Express Courier ($14.00)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E9E3DE] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="px-4 py-2 border border-[#E9E3DE] rounded-md font-medium text-[#77716C]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#292522] hover:bg-[#3D3834] text-white rounded-md font-semibold transition-colors"
                  >
                    Confirm & Record Order
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: ORDER SHIPMENTS / ASSIGNMENTS */}
          {/* ======================================================== */}
          {activeTab === 'order-assignments' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs p-6 max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E9E3DE]">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#292522]">
                    Order Fulfillment & Logistics
                  </h2>
                  <p className="text-xs text-[#77716C]">
                    Manage parcel dispatch, tracking assignments, and courier pipelines
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#C77F79] bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E9E3DE]">
                  {pendingOrdersCount} awaiting dispatch
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Pipeline Step 1: Processing */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E9E3DE] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E9E3DE]">
                    <span className="font-semibold text-xs text-[#292522] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      In Preparation
                    </span>
                    <span className="text-[11px] font-bold text-[#292522]">
                      {orders.filter((o) => o.status === 'processing' || o.status === 'pending').length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {orders
                      .filter((o) => o.status === 'processing' || o.status === 'pending')
                      .map((o) => (
                        <div key={o.id} className="bg-white p-3 rounded-lg border border-[#E9E3DE] shadow-xs text-xs space-y-2">
                          <div className="flex justify-between items-center font-semibold">
                            <span>#{o.id}</span>
                            <span className="tabular-nums">${o.total.toFixed(2)}</span>
                          </div>
                          <p className="text-[11px] text-[#77716C]">{o.customerName}</p>
                          <button
                            onClick={() => updateOrderStatus(o.id, 'shipped')}
                            className="w-full py-1.5 bg-[#292522] text-white rounded text-[11px] font-medium hover:bg-[#3D3834] transition-colors flex items-center justify-center gap-1"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Mark Dispatched</span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Pipeline Step 2: Shipped */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E9E3DE] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E9E3DE]">
                    <span className="font-semibold text-xs text-[#292522] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      In Transit
                    </span>
                    <span className="text-[11px] font-bold text-[#292522]">
                      {orders.filter((o) => o.status === 'shipped').length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {orders
                      .filter((o) => o.status === 'shipped')
                      .map((o) => (
                        <div key={o.id} className="bg-white p-3 rounded-lg border border-[#E9E3DE] shadow-xs text-xs space-y-2">
                          <div className="flex justify-between items-center font-semibold">
                            <span>#{o.id}</span>
                            <span className="tabular-nums">${o.total.toFixed(2)}</span>
                          </div>
                          <p className="text-[11px] text-[#77716C]">{o.customerName}</p>
                          <p className="text-[10px] text-[#89947D]">Tracking: FedEx 98234-MB</p>
                          <button
                            onClick={() => updateOrderStatus(o.id, 'delivered')}
                            className="w-full py-1.5 bg-[#89947D] text-white rounded text-[11px] font-medium hover:bg-[#78826D] transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Confirm Delivery</span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Pipeline Step 3: Delivered */}
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E9E3DE] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E9E3DE]">
                    <span className="font-semibold text-xs text-[#292522] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Completed Deliveries
                    </span>
                    <span className="text-[11px] font-bold text-[#292522]">
                      {orders.filter((o) => o.status === 'delivered').length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {orders
                      .filter((o) => o.status === 'delivered')
                      .slice(0, 4)
                      .map((o) => (
                        <div key={o.id} className="bg-white p-3 rounded-lg border border-[#E9E3DE] shadow-xs text-xs space-y-1">
                          <div className="flex justify-between items-center font-semibold">
                            <span>#{o.id}</span>
                            <span className="text-emerald-700 font-bold">✓ Delivered</span>
                          </div>
                          <p className="text-[11px] text-[#77716C]">{o.customerName}</p>
                        </div>
                      ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: CUSTOMERS */}
          {/* ======================================================== */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs p-6 max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9E3DE]">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#292522]">
                    Customer Directory
                  </h2>
                  <p className="text-xs text-[#77716C]">
                    Registered buyers, trade designers, and past retail accounts
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#292522]">
                  {customerList.length} Unique Shoppers
                </span>
              </div>

              <div className="overflow-x-auto border border-[#E9E3DE] rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#77716C] uppercase text-[10px] tracking-wider border-b border-[#E9E3DE]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Customer</th>
                      <th className="py-3 px-4 font-semibold">Contact Info</th>
                      <th className="py-3 px-4 font-semibold">Primary Address</th>
                      <th className="py-3 px-4 font-semibold">Orders Count</th>
                      <th className="py-3 px-4 font-semibold">Lifetime Spend</th>
                      <th className="py-3 px-4 font-semibold">Last Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E3DE]">
                    {customerList.map((cust) => (
                      <tr key={cust.email} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#292522]">
                          {cust.name}
                        </td>
                        <td className="py-3 px-4 text-[#77716C]">
                          <p>{cust.email}</p>
                          <p className="text-[11px]">{cust.phone}</p>
                        </td>
                        <td className="py-3 px-4 text-[#77716C] max-w-xs truncate">
                          {cust.address}
                        </td>
                        <td className="py-3 px-4 font-semibold tabular-nums">
                          {cust.orderCount}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#292522] tabular-nums">
                          ${cust.totalSpent.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-[#77716C] whitespace-nowrap">
                          {cust.lastOrderDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: SUPPLIERS */}
          {/* ======================================================== */}
          {activeTab === 'suppliers' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs p-6 max-w-7xl mx-auto space-y-4">
              <div className="pb-3 border-b border-[#E9E3DE]">
                <h2 className="font-heading text-lg font-bold text-[#292522]">
                  Studio Sourcing & Artisans
                </h2>
                <p className="text-xs text-[#77716C]">
                  Direct partner ceramic kilns, stonemasons, and textile mills
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suppliers.map((sup) => (
                  <div key={sup.id} className="p-4 rounded-xl border border-[#E9E3DE] bg-[#FAF8F5] space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#C77F79]" />
                        <h3 className="font-semibold text-sm text-[#292522]">{sup.name}</h3>
                      </div>
                      <span className="text-[11px] font-bold text-[#89947D]">★ {sup.rating}</span>
                    </div>
                    <p className="text-[#77716C] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#A89F97]" />
                      <span>{sup.location}</span>
                    </p>
                    <p className="text-[#292522]">
                      <strong>Materials:</strong> {sup.materials}
                    </p>
                    <div className="pt-2 border-t border-[#E9E3DE] flex justify-between text-[11px] text-[#77716C]">
                      <span>Active batches: {sup.activeOrders}</span>
                      <span>Avg Lead Time: {sup.leadTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: STAFF & ROLES */}
          {/* ======================================================== */}
          {activeTab === 'staff' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs p-6 max-w-7xl mx-auto space-y-4">
              <div className="pb-3 border-b border-[#E9E3DE]">
                <h2 className="font-heading text-lg font-bold text-[#292522]">
                  Store Personnel & Roles
                </h2>
                <p className="text-xs text-[#77716C]">
                  Administrative users and operations clearance
                </p>
              </div>

              <div className="overflow-x-auto border border-[#E9E3DE] rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#77716C] uppercase text-[10px] tracking-wider border-b border-[#E9E3DE]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">User</th>
                      <th className="py-3 px-4 font-semibold">Email</th>
                      <th className="py-3 px-4 font-semibold">Assigned Role</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E3DE]">
                    {staffMembers.map((staff) => (
                      <tr key={staff.email} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#292522]">
                          {staff.name}
                        </td>
                        <td className="py-3 px-4 text-[#77716C]">
                          {staff.email}
                        </td>
                        <td className="py-3 px-4 font-medium text-[#292522]">
                          {staff.role}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-[#89947D]/15 text-[#5E6B56] px-2 py-0.5 rounded text-[11px] font-semibold">
                            {staff.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#77716C]">
                          {staff.lastActive}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: PRODUCTS CATALOG (CRUD) */}
          {/* ======================================================== */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs overflow-hidden space-y-4 p-5 sm:p-6 max-w-7xl mx-auto">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3DE]">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#292522]">
                    Product Catalog Management
                  </h2>
                  <p className="text-xs text-[#77716C]">
                    Add, edit, delete, and control retail pricing and inventory counts
                  </p>
                </div>

                <button
                  onClick={handleOpenCreateProduct}
                  className="self-start sm:self-auto py-2 px-4 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md w-full">
                  <input
                    type="search"
                    placeholder="Search products by title, ID, material..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E3DE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#77716C] absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-[#77716C]">Category:</span>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-[#FAF8F5] border border-[#E9E3DE] text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto border border-[#E9E3DE] rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#77716C] uppercase text-[10px] tracking-wider border-b border-[#E9E3DE]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Image & Product</th>
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Price</th>
                      <th className="py-3 px-4 font-semibold">Stock</th>
                      <th className="py-3 px-4 font-semibold">Badges</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E3DE] text-[#292522]">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[#77716C]">
                          No products match the selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-lg object-cover border border-[#E9E3DE] shrink-0 bg-[#FAF8F5]"
                              />
                              <div>
                                <p className="font-semibold text-[#292522] line-clamp-1">{p.name}</p>
                                <p className="text-[11px] text-[#77716C]">ID: {p.id} · {p.material}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#77716C] capitalize whitespace-nowrap">
                            {p.categorySlug.replace('-', ' ')}
                          </td>
                          <td className="py-3 px-4 font-semibold tabular-nums whitespace-nowrap">
                            ${p.price}
                            {p.compareAtPrice && (
                              <span className="text-[11px] text-[#77716C] line-through ml-1.5 font-normal">
                                ${p.compareAtPrice}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                p.stockStatus === 'in_stock'
                                  ? 'bg-[#89947D]/15 text-[#5E6B56]'
                                  : p.stockStatus === 'low_stock'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {p.stockStatus === 'in_stock' ? 'In Stock' : p.stockStatus === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-[10px]">
                              {p.isBestseller && <span className="bg-[#FAF8F5] border border-[#E9E3DE] px-1.5 py-0.5 rounded font-medium">Bestseller</span>}
                              {p.isNew && <span className="bg-[#F1E5E1] text-[#A84940] px-1.5 py-0.5 rounded font-semibold">New</span>}
                              {p.isFeatured && <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">Featured</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 rounded hover:bg-[#E9E3DE]/60 text-[#77716C] hover:text-[#292522]"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 rounded hover:bg-red-50 text-[#77716C] hover:text-red-700"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: CATEGORIES */}
          {/* ======================================================== */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs p-6 max-w-7xl mx-auto space-y-4">
              <div className="pb-3 border-b border-[#E9E3DE]">
                <h2 className="font-heading text-lg font-bold text-[#292522]">
                  Category Taxonomy Configuration
                </h2>
                <p className="text-xs text-[#77716C]">
                  Organize store departments, navigation hierarchy, and item assignments
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((cat) => {
                  const itemCount = products.filter((p) => p.categorySlug === cat.slug).length;
                  return (
                    <div key={cat.slug} className="p-4 rounded-xl border border-[#E9E3DE] bg-[#FAF8F5] flex gap-3 items-center">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-14 h-14 rounded-lg object-cover border border-[#E9E3DE] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-[#292522] truncate">{cat.name}</h4>
                        <p className="text-[11px] text-[#77716C]">{itemCount} products assigned</p>
                        <p className="text-[10px] text-[#A89F97] font-mono mt-0.5 truncate">/categories/{cat.slug}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: PROMO CODES */}
          {/* ======================================================== */}
          {activeTab === 'promos' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs overflow-hidden space-y-4 p-5 sm:p-6 max-w-7xl mx-auto">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3DE]">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#292522]">
                    Promotional Coupon Codes
                  </h2>
                  <p className="text-xs text-[#77716C]">
                    Manage active discount coupons applicable in customer bag and checkout
                  </p>
                </div>

                <button
                  onClick={() => setPromoModalOpen(true)}
                  className="self-start sm:self-auto py-2 px-4 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Promo Code</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-[#E9E3DE] rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#77716C] uppercase text-[10px] tracking-wider border-b border-[#E9E3DE]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Promo Code</th>
                      <th className="py-3 px-4 font-semibold">Discount</th>
                      <th className="py-3 px-4 font-semibold">Min Spend</th>
                      <th className="py-3 px-4 font-semibold">Redemptions</th>
                      <th className="py-3 px-4 font-semibold">Expires</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E3DE] text-[#292522]">
                    {promoCodes.map((promo) => (
                      <tr key={promo.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-sm text-[#292522]">
                          <span className="bg-[#FAF8F5] px-2 py-1 rounded border border-[#E9E3DE]">
                            {promo.code}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#C77F79]">
                          {promo.discountPercent}% OFF
                        </td>
                        <td className="py-3 px-4 text-[#77716C]">
                          {promo.minSpend ? `$${promo.minSpend}` : 'None'}
                        </td>
                        <td className="py-3 px-4 font-medium tabular-nums">
                          {promo.usageCount} times
                        </td>
                        <td className="py-3 px-4 text-[#77716C]">
                          {promo.expiryDate}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => togglePromoStatus(promo.id)}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                              promo.status === 'active'
                                ? 'bg-[#89947D]/15 text-[#5E6B56] hover:bg-[#89947D]/25'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {promo.status === 'active' ? '● Active' : '○ Inactive'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete coupon code ${promo.code}?`)) {
                                deletePromoCode(promo.id);
                              }
                            }}
                            className="p-1.5 rounded hover:bg-red-50 text-[#77716C] hover:text-red-700"
                            title="Delete Code"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: PAYMENTS */}
          {/* ======================================================== */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs p-6 max-w-7xl mx-auto space-y-4">
              <div className="pb-3 border-b border-[#E9E3DE]">
                <h2 className="font-heading text-lg font-bold text-[#292522]">
                  Payment Transactions Ledger
                </h2>
                <p className="text-xs text-[#77716C]">
                  Reconciliation of credit card authorizations and cash on delivery collections
                </p>
              </div>

              <div className="overflow-x-auto border border-[#E9E3DE] rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#77716C] uppercase text-[10px] tracking-wider border-b border-[#E9E3DE]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Ref ID</th>
                      <th className="py-3 px-4 font-semibold">Order</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold">Method</th>
                      <th className="py-3 px-4 font-semibold">Amount</th>
                      <th className="py-3 px-4 font-semibold">Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E3DE]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-[#77716C]">
                          TXN-{o.id.replace('MB-', '')}89
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#292522]">
                          #{o.id} ({o.customerName})
                        </td>
                        <td className="py-3 px-4 text-[#77716C]">
                          {o.date}
                        </td>
                        <td className="py-3 px-4 capitalize font-medium text-[#292522]">
                          {o.paymentMethod === 'card' ? 'Credit Card (Stripe Auth)' : 'Cash on Delivery (COD)'}
                        </td>
                        <td className="py-3 px-4 font-bold tabular-nums">
                          ${o.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            o.status === 'cancelled'
                              ? 'bg-red-50 text-red-700'
                              : o.paymentMethod === 'card'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {o.status === 'cancelled' ? 'Voided' : o.paymentMethod === 'card' ? 'Cleared' : 'Pending Driver Handover'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: REPORTS */}
          {/* ======================================================== */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs p-6 max-w-7xl mx-auto space-y-6">
              <div className="pb-3 border-b border-[#E9E3DE]">
                <h2 className="font-heading text-lg font-bold text-[#292522]">
                  Store Analytics & Performance Reports
                </h2>
                <p className="text-xs text-[#77716C]">
                  Sales metrics, average order value, and product category distribution
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E3DE] space-y-1">
                  <p className="text-[11px] text-[#77716C] uppercase font-semibold">Average Order Value (AOV)</p>
                  <p className="text-2xl font-bold text-[#292522] tabular-nums">
                    ${(totalRevenue / Math.max(1, orders.length)).toFixed(2)}
                  </p>
                  <p className="text-[11px] text-[#89947D]">Healthy basket sizing</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E3DE] space-y-1">
                  <p className="text-[11px] text-[#77716C] uppercase font-semibold">Gross Discount Savings</p>
                  <p className="text-2xl font-bold text-[#C77F79] tabular-nums">
                    ${orders.reduce((sum, o) => sum + o.discount, 0).toFixed(2)}
                  </p>
                  <p className="text-[11px] text-[#77716C]">From active campaigns</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E9E3DE] space-y-1">
                  <p className="text-[11px] text-[#77716C] uppercase font-semibold">Fulfillment Success Rate</p>
                  <p className="text-2xl font-bold text-[#292522] tabular-nums">
                    {Math.round(((orders.filter((o) => o.status !== 'cancelled').length) / Math.max(1, orders.length)) * 100)}%
                  </p>
                  <p className="text-[11px] text-[#89947D]">Low return & cancel rate</p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="pt-2">
                <h3 className="text-xs font-semibold text-[#292522] uppercase tracking-wider mb-3">
                  Merchandise Distribution
                </h3>
                <div className="space-y-2 text-xs">
                  {CATEGORIES.slice(0, 6).map((cat) => {
                    const count = products.filter((p) => p.categorySlug === cat.slug).length;
                    const percent = Math.round((count / Math.max(1, products.length)) * 100);
                    return (
                      <div key={cat.slug} className="space-y-1">
                        <div className="flex justify-between text-[#292522]">
                          <span>{cat.name}</span>
                          <span className="font-semibold tabular-nums">{count} items ({percent}%)</span>
                        </div>
                        <div className="w-full bg-[#E9E3DE] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#C77F79] h-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: SUPABASE DATABASE */}
          {/* ======================================================== */}
          {activeTab === 'database' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              
              {/* Header with Title and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E7048]">
                      PostgreSQL Cloud Database
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#292522]">
                    Supabase Database Engine
                  </h1>
                  <p className="text-xs text-[#77716C] mt-0.5">
                    Live connection management, catalog synchronization, and PostgreSQL schema migration tools.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleTestDatabase}
                    disabled={isTestingDb}
                    className="px-3 py-2 bg-white border border-[#E9E3DE] hover:bg-[#FAF8F5] text-[#292522] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#C77F79] ${isTestingDb ? 'animate-spin' : ''}`} />
                    <span>{isTestingDb ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    onClick={handleSeedDatabase}
                    disabled={isSeedingDb}
                    className="px-3.5 py-2 bg-[#292522] hover:bg-[#3D3834] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Database className={`w-3.5 h-3.5 text-[#E8C5BE] ${isSeedingDb ? 'animate-pulse' : ''}`} />
                    <span>{isSeedingDb ? 'Seeding...' : 'Seed Database Tables'}</span>
                  </button>

                  <a
                    href="https://supabase.com/dashboard/project/vdoabvrhapptxvdkymlp/sql"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-[#FAF8F5] hover:bg-[#F1E5E1] text-[#292522] border border-[#E9E3DE] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#77716C]" />
                    <span>Open Supabase SQL</span>
                  </a>
                </div>
              </div>

              {/* Live Connection Overview Card */}
              <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E9E3DE] gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F8EE] border border-[#D1F2E0] flex items-center justify-center text-[#0E7048]">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading text-sm font-bold text-[#292522]">
                        Project Instance Status
                      </h2>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className="inline-flex items-center gap-1 text-[#0E7048] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active & Online</span>
                        </span>
                        <span className="text-[#A89F97]">·</span>
                        <span className="text-[#77716C] font-mono text-[11px]">
                          Ping: {supabaseStatus?.latencyMs || 112}ms
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E9E3DE] text-[11px] font-mono text-[#524A42]">
                      PostgreSQL 15 · REST v1
                    </span>
                  </div>
                </div>

                {/* Connection URLs and Keys Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Project URL */}
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E9E3DE] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#77716C] uppercase tracking-wider">
                        Supabase Project URL
                      </span>
                      <button
                        onClick={handleCopyUrl}
                        className="text-[#C77F79] hover:underline flex items-center gap-1 text-[11px] font-medium"
                      >
                        {copiedUrl ? <Check className="w-3 h-3 text-[#0E7048]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-xs text-[#292522] break-all select-all font-medium">
                      {SUPABASE_URL}
                    </p>
                  </div>

                  {/* Publishable API Key */}
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E9E3DE] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#77716C] uppercase tracking-wider">
                        Publishable Anon Key
                      </span>
                      <button
                        onClick={handleCopyKey}
                        className="text-[#C77F79] hover:underline flex items-center gap-1 text-[11px] font-medium"
                      >
                        {copiedKey ? <Check className="w-3 h-3 text-[#0E7048]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-xs text-[#292522] truncate select-all font-medium">
                      {SUPABASE_PUBLISHABLE_KEY.slice(0, 24)}••••••••••••••••••••••••
                    </p>
                  </div>
                </div>
              </div>

              {/* Tables & Sync Status Grid */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#77716C]">
                      Synchronized Database Entities
                    </h3>
                    <p className="text-[11px] text-[#77716C]">
                      Real-time status check against your Supabase PostgreSQL database
                    </p>
                  </div>
                  {supabaseStatus && !supabaseStatus.tablesStatus?.products && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Run SQL Migration Below to Activate
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Products Table Card */}
                  <div className="bg-white p-4 rounded-xl border border-[#E9E3DE] shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E9E3DE] flex items-center justify-center text-[#C77F79]">
                        <Package className="w-4 h-4" />
                      </div>
                      {supabaseStatus?.tablesStatus?.products ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8EE] text-[#0E7048] border border-[#D1F2E0]">
                          Active & Synced
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Needs Migration
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#292522]">products</p>
                      <p className="text-[11px] text-[#77716C] mt-0.5">
                        Catalog items, images & dimensions
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#E9E3DE] flex justify-between items-center text-xs">
                      <span className="text-[#77716C]">Records:</span>
                      <span className="font-bold text-[#292522] tabular-nums">{products.length} Items</span>
                    </div>
                  </div>

                  {/* Orders Table Card */}
                  <div className="bg-white p-4 rounded-xl border border-[#E9E3DE] shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E9E3DE] flex items-center justify-center text-[#C77F79]">
                        <ClipboardList className="w-4 h-4" />
                      </div>
                      {supabaseStatus?.tablesStatus?.orders ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8EE] text-[#0E7048] border border-[#D1F2E0]">
                          Active & Synced
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Needs Migration
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#292522]">orders</p>
                      <p className="text-[11px] text-[#77716C] mt-0.5">
                        Purchases, tracking & customer info
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#E9E3DE] flex justify-between items-center text-xs">
                      <span className="text-[#77716C]">Records:</span>
                      <span className="font-bold text-[#292522] tabular-nums">{orders.length} Orders</span>
                    </div>
                  </div>

                  {/* Promo Codes Table Card */}
                  <div className="bg-white p-4 rounded-xl border border-[#E9E3DE] shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E9E3DE] flex items-center justify-center text-[#C77F79]">
                        <Tag className="w-4 h-4" />
                      </div>
                      {supabaseStatus?.tablesStatus?.promo_codes ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8EE] text-[#0E7048] border border-[#D1F2E0]">
                          Active & Synced
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Needs Migration
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#292522]">promo_codes</p>
                      <p className="text-[11px] text-[#77716C] mt-0.5">
                        Discount coupons & thresholds
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#E9E3DE] flex justify-between items-center text-xs">
                      <span className="text-[#77716C]">Records:</span>
                      <span className="font-bold text-[#292522] tabular-nums">{promoCodes.length} Codes</span>
                    </div>
                  </div>

                  {/* Newsletter Table Card */}
                  <div className="bg-white p-4 rounded-xl border border-[#E9E3DE] shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E9E3DE] flex items-center justify-center text-[#C77F79]">
                        <Send className="w-4 h-4" />
                      </div>
                      {supabaseStatus?.tablesStatus?.newsletter_subscribers ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F8EE] text-[#0E7048] border border-[#D1F2E0]">
                          Active & Synced
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Needs Migration
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#292522]">newsletter_subscribers</p>
                      <p className="text-[11px] text-[#77716C] mt-0.5">
                        Opt-in emails from storefront footer
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#E9E3DE] flex justify-between items-center text-xs">
                      <span className="text-[#77716C]">Source:</span>
                      <span className="font-bold text-[#292522]">Storefront</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SQL Schema Migration Helper Card */}
              <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E9E3DE] gap-2">
                  <div>
                    <h3 className="font-heading text-sm font-bold text-[#292522]">
                      PostgreSQL DDL Schema & Policies
                    </h3>
                    <p className="text-xs text-[#77716C]">
                      Run this script in your Supabase SQL Editor if you ever need to create fresh tables with Row-Level-Security (RLS).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySchema}
                      className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F1E5E1] border border-[#E9E3DE] rounded-md text-xs font-semibold text-[#292522] transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      {copiedSchema ? <Check className="w-3.5 h-3.5 text-[#0E7048]" /> : <Copy className="w-3.5 h-3.5 text-[#C77F79]" />}
                      <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Migration Script'}</span>
                    </button>
                    <button
                      onClick={() => setShowSchemaDrawer(!showSchemaDrawer)}
                      className="px-3 py-1.5 border border-[#E9E3DE] rounded-md text-xs font-medium text-[#77716C] hover:bg-[#FAF8F5]"
                    >
                      {showSchemaDrawer ? 'Hide SQL Code' : 'View SQL Code'}
                    </button>
                  </div>
                </div>

                {showSchemaDrawer && (
                  <div className="relative">
                    <pre className="bg-[#1F1C1A] text-[#FAF8F5] p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 border border-[#3E3832] leading-relaxed">
                      {SUPABASE_SQL_MIGRATION_SCHEMA}
                    </pre>
                  </div>
                )}

                {/* Step by Step instructions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E9E3DE] space-y-1">
                    <span className="font-bold text-[#292522] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#292522] text-white flex items-center justify-center text-[10px]">1</span>
                      Copy Migration SQL
                    </span>
                    <p className="text-[11px] text-[#77716C]">
                      Click "Copy SQL Migration Script" to copy the DDL tables and RLS policies.
                    </p>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E9E3DE] space-y-1">
                    <span className="font-bold text-[#292522] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#292522] text-white flex items-center justify-center text-[10px]">2</span>
                      Paste in Supabase SQL
                    </span>
                    <p className="text-[11px] text-[#77716C]">
                      Open the Supabase dashboard, click "SQL Editor", paste, and press "RUN".
                    </p>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E9E3DE] space-y-1">
                    <span className="font-bold text-[#292522] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#292522] text-white flex items-center justify-center text-[10px]">3</span>
                      Click "Seed Database"
                    </span>
                    <p className="text-[11px] text-[#77716C]">
                      Use the "Seed Database Tables" button above to populate products and orders instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Environment Variables Reference */}
              <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 shadow-xs space-y-3">
                <h3 className="font-heading text-sm font-bold text-[#292522]">
                  Configured Environment Variables (.env & .env.example)
                </h3>
                <div className="divide-y divide-[#E9E3DE] text-xs font-mono">
                  <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#77716C]">NEXT_PUBLIC_SUPABASE_URL</span>
                    <span className="text-[#292522] font-semibold">{SUPABASE_URL}</span>
                  </div>
                  <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#77716C]">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</span>
                    <span className="text-[#292522] font-semibold truncate max-w-md">{SUPABASE_PUBLISHABLE_KEY}</span>
                  </div>
                  <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#77716C]">VITE_SUPABASE_URL</span>
                    <span className="text-[#77716C]">{SUPABASE_URL}</span>
                  </div>
                  <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[#77716C]">VITE_SUPABASE_ANON_KEY</span>
                    <span className="text-[#77716C] truncate max-w-md">{SUPABASE_PUBLISHABLE_KEY}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: SETTINGS */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border border-[#E9E3DE] shadow-xs p-6 max-w-3xl mx-auto space-y-6">
              <div className="pb-3 border-b border-[#E9E3DE]">
                <h2 className="font-heading text-lg font-bold text-[#292522]">
                  Store Settings & Preferences
                </h2>
                <p className="text-xs text-[#77716C]">
                  Store parameters, thresholds, and operational contact info
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addToast('Settings Saved', 'Store operational rules updated successfully');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Store Legal Name</label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">Customer Support Email</label>
                    <input
                      type="email"
                      value={settingsForm.supportEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">Customer Support Phone</label>
                    <input
                      type="tel"
                      value={settingsForm.supportPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">Free Shipping Threshold ($)</label>
                    <input
                      type="number"
                      value={settingsForm.freeShippingThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#292522] mb-1">Standard Shipping Flat Fee ($)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={settingsForm.standardShippingFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Studio Showroom Address</label>
                  <input
                    type="text"
                    value={settingsForm.showroomAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, showroomAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                  />
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E9E3DE] space-y-1">
                  <p className="font-semibold text-[#292522]">Authorized Admin Credential (.env)</p>
                  <p className="text-[#77716C]">Current Administrator: <code className="px-1.5 py-0.5 bg-white border border-[#E9E3DE] rounded font-semibold text-[#292522]">{getAdminCredentials().email}</code> (Loaded from <code className="text-[#C77F79]">.env</code>)</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#292522] hover:bg-[#3D3834] text-white rounded-md font-semibold transition-colors"
                  >
                    Save Operational Settings
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ORDER DETAILS INVOICE VIEW */}
      {/* ======================================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSelectedOrderDetails(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl border border-[#E9E3DE] shadow-2xl p-6 sm:p-8 z-10 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E3DE]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E9E3DE] flex items-center justify-center font-bold text-[#292522]">
                  #{selectedOrderDetails.id}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#292522]">
                    Order #{selectedOrderDetails.id}
                  </h3>
                  <p className="text-xs text-[#77716C]">{selectedOrderDetails.date} · {renderStatusBadge(selectedOrderDetails.status)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 text-[#77716C] hover:text-[#292522] rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF8F5] p-4 rounded-xl border border-[#E9E3DE]">
              <div>
                <p className="font-semibold text-[#292522] mb-1">Customer Details</p>
                <p className="text-[#292522]">{selectedOrderDetails.customerName}</p>
                <p className="text-[#77716C]">{selectedOrderDetails.customerEmail}</p>
                <p className="text-[#77716C]">{selectedOrderDetails.customerPhone}</p>
              </div>
              <div>
                <p className="font-semibold text-[#292522] mb-1">Delivery Address</p>
                <p className="text-[#77716C] leading-relaxed">{selectedOrderDetails.shippingAddress}</p>
                <p className="text-[11px] text-[#89947D] mt-1 font-medium capitalize">
                  Method: {selectedOrderDetails.shippingSpeed} ({selectedOrderDetails.paymentMethod.toUpperCase()})
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#292522] uppercase tracking-wider">
                Order Items ({selectedOrderDetails.items.length})
              </p>
              <div className="divide-y divide-[#E9E3DE] max-h-52 overflow-y-auto text-xs">
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover border border-[#E9E3DE]"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-[#292522]">{item.name}</p>
                        <p className="text-[11px] text-[#77716C]">
                          Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#292522] tabular-nums">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="pt-3 border-t border-[#E9E3DE] space-y-1.5 text-xs text-[#77716C]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-[#292522] tabular-nums">${selectedOrderDetails.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrderDetails.discount > 0 && (
                <div className="flex justify-between text-[#89947D]">
                  <span>Discount:</span>
                  <span className="font-medium tabular-nums">-${selectedOrderDetails.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-medium text-[#292522] tabular-nums">${selectedOrderDetails.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#292522] pt-2 border-t border-[#E9E3DE]">
                <span>Total Amount:</span>
                <span className="tabular-nums">${selectedOrderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span>Change Status:</span>
                <select
                  value={selectedOrderDetails.status}
                  onChange={(e) => {
                    const next = e.target.value as OrderStatus;
                    updateOrderStatus(selectedOrderDetails.id, next);
                    setSelectedOrderDetails({ ...selectedOrderDetails, status: next });
                  }}
                  className="bg-[#FAF8F5] border border-[#E9E3DE] rounded px-2 py-1 text-xs font-semibold text-[#292522]"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-[#292522] text-white rounded text-xs font-semibold"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PRODUCT ADD / EDIT */}
      {/* ======================================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setProductModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl border border-[#E9E3DE] shadow-2xl p-6 sm:p-8 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3DE]">
              <h3 className="font-heading font-bold text-base text-[#292522]">
                {editingProduct ? 'Edit Product Details' : 'Create New Décor Piece'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 text-[#77716C] hover:text-[#292522]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-[11px] font-semibold text-[#292522] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculptural Ribbed Stoneware Vase"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Category *</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => setProductForm({ ...productForm, categorySlug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Selling Price ($) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Compare-At Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 for regular"
                    value={productForm.compareAtPrice}
                    onChange={(e) => setProductForm({ ...productForm, compareAtPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Material Composition *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grogged Stoneware, Belgian Linen"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Dimensions *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. H 28cm × Dia 16cm"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Stock Status *</label>
                  <select
                    value={productForm.stockStatus}
                    onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock (≤ 3 left)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Primary Color Name</label>
                  <input
                    type="text"
                    value={productForm.colorName}
                    onChange={(e) => setProductForm({ ...productForm, colorName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Color Hex</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={productForm.colorHex}
                      onChange={(e) => setProductForm({ ...productForm, colorHex: e.target.value })}
                      className="w-8 h-8 rounded border border-[#E9E3DE] p-0.5"
                    />
                    <input
                      type="text"
                      value={productForm.colorHex}
                      onChange={(e) => setProductForm({ ...productForm, colorHex: e.target.value })}
                      className="flex-1 px-2 py-1.5 bg-[#FAF8F5] border border-[#E9E3DE] rounded font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#292522] mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#292522] mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                  placeholder="Detail the tactile surface, glazes, and ambiance..."
                />
              </div>

              {/* Badges Toggles */}
              <div className="pt-2 border-t border-[#E9E3DE] flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                    className="accent-[#C77F79]"
                  />
                  <span>Mark as New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestseller}
                    onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                    className="accent-[#C77F79]"
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-[#C77F79]"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E9E3DE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-[#E9E3DE] rounded-md font-medium text-[#77716C] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#292522] hover:bg-[#3D3834] text-white rounded-md font-semibold"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE PROMO CODE */}
      {/* ======================================================== */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setPromoModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl border border-[#E9E3DE] shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3DE]">
              <h3 className="font-heading font-bold text-base text-[#292522]">
                Create Promo Coupon
              </h3>
              <button
                onClick={() => setPromoModalOpen(false)}
                className="p-1.5 text-[#77716C] hover:text-[#292522]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#292522] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER20"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono font-bold uppercase focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Discount % *</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={promoForm.discountPercent}
                    onChange={(e) => setPromoForm({ ...promoForm, discountPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#292522] mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={promoForm.minSpend}
                    onChange={(e) => setPromoForm({ ...promoForm, minSpend: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#292522] mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={promoForm.expiryDate}
                  onChange={(e) => setPromoForm({ ...promoForm, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#292522] mb-1">Initial Status</label>
                <select
                  value={promoForm.status}
                  onChange={(e) => setPromoForm({ ...promoForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md"
                >
                  <option value="active">Active (Usable immediately)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E9E3DE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="px-4 py-2 border border-[#E9E3DE] rounded-md font-medium text-[#77716C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#292522] hover:bg-[#3D3834] text-white rounded-md font-semibold"
                >
                  Save Code
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
