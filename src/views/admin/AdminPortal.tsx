'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';
import { MistyBlissIcon } from '../../components/common/MistyBlissIcon';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Package,
  ShoppingCart,
  Tag,
  FolderTree,
  BookOpen,
  Mail,
  LayoutDashboard,
} from 'lucide-react';
import { cleanCredential } from '../../lib/adminConfig';
import { CategoryAdminPanel } from './CategoryAdminPanel';
import { ProductAdminPanel } from './ProductAdminPanel';
import { PromoAdminPanel } from './PromoAdminPanel';
import { BlogAdminPanel } from './BlogAdminPanel';
import { NewsletterAdminPanel } from './NewsletterAdminPanel';
import { AdminDashboard } from './AdminDashboard';

type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'promos'
  | 'categories'
  | 'blog'
  | 'subscribers';

export const AdminPortal: React.FC = () => {
  const {
    products,
    orders,
    promoCodes,
    categories,
    blogPosts,
    newsletterSubscribers,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    updateOrderStatus,
  } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  const navItems: { id: AdminTab; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      count: pendingCount,
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    { id: 'orders', label: 'Orders', count: orders.length, icon: <ShoppingCart className="w-3.5 h-3.5" /> },
    { id: 'categories', label: 'Categories', count: categories.length, icon: <FolderTree className="w-3.5 h-3.5" /> },
    { id: 'products', label: 'Products', count: products.length, icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'blog', label: 'Journal', count: blogPosts.length, icon: <BookOpen className="w-3.5 h-3.5" /> },
    {
      id: 'subscribers',
      label: 'Subscribers',
      count: newsletterSubscribers.length,
      icon: <Mail className="w-3.5 h-3.5" />,
    },
    { id: 'promos', label: 'Promotions', count: promoCodes.length, icon: <Tag className="w-3.5 h-3.5" /> },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const cleanedEmail = cleanCredential(email);
    const cleanedPass = cleanCredential(password);

    // 1. First attempt context adminLogin
    let success = adminLogin(cleanedEmail, cleanedPass);

    // 2. Fallback to API route check if needed
    if (!success) {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanedEmail, password: cleanedPass }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            success = adminLogin(cleanedEmail, cleanedPass) || true;
          }
        }
      } catch (apiErr) {
        console.warn('API login check fallback failed:', apiErr);
      }
    }

    setIsSubmitting(false);

    if (!success) {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F6F4F0]">
        <div className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E3DE] shadow-xs space-y-5">
          <div className="text-center space-y-2">
            <MistyBlissIcon size={48} className="mx-auto ring-1 ring-[#E9E3DE]" />
            <h1 className="text-xl font-bold text-[#292522]">Admin Portal</h1>
            <p className="text-xs text-[#77716C]">Sign in to studio management & operations</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5 text-xs" autoComplete="off">
            <div>
              <label className="block text-[11px] font-medium text-[#77716C] mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your email"
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] placeholder:text-[#A89F97]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#77716C] mb-1">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-1p-ignore
                  className="w-full px-3 py-2 pr-10 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] placeholder:text-[#A89F97]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#77716C] hover:text-[#292522] p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-[#FAF0F0] border border-[#F2D7D5] rounded-md text-[11px] text-[#A84940] leading-tight">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#292522] hover:bg-[#3D3834] disabled:opacity-70 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-[#77716C] hover:text-[#292522]">
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4F0]">
      <header className="sticky top-0 z-20 bg-[#F6F4F0]/95 backdrop-blur border-b border-[#E9E3DE]">
        <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <MistyBlissIcon size={32} className="ring-1 ring-[#E9E3DE]" />
            <h1 className="text-base sm:text-lg font-bold text-[#292522] truncate">Studio Management Portal</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFECE6] text-[#292522] font-mono text-[11px] border border-[#E9E3DE]">
              <ShieldCheck size={12} className="text-[#89947D]" />
              limon@technobd.com
            </span>
            <Link href="/" className="text-[#77716C] hover:text-[#292522]">
              Storefront
            </Link>
            <button
              onClick={adminLogout}
              className="px-3 py-1.5 bg-white border border-[#E9E3DE] rounded text-[#A84940] hover:bg-[#F1E5E1] font-medium cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-start">
          {/* Left sidebar — sticks beside content, no large middle gap */}
          <aside className="w-full lg:w-48 xl:w-52 shrink-0 lg:sticky lg:top-[4.25rem]">
            <nav className="bg-white rounded-xl border border-[#E9E3DE] p-1.5 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#292522] text-white'
                      : 'text-[#77716C] hover:bg-[#FAF8F5] hover:text-[#292522]'
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  <span
                    className={`tabular-nums text-[10px] ${
                      activeTab === item.id ? 'text-white/70' : 'text-[#A89F97]'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content fills remaining width */}
          <main className="flex-1 min-w-0 w-full">
            {activeTab === 'dashboard' && (
              <AdminDashboard
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-[#292522] flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-[#C77F79]" />
                    Orders
                  </h2>
                  <p className="text-[11px] text-[#77716C] mt-0.5">{orders.length} customer orders</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E9E3DE] divide-y divide-[#E9E3DE] overflow-hidden">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#292522]">{ord.id}</span>
                          <span className="text-[#77716C]">· {ord.date}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF8F5] border border-[#E9E3DE] capitalize">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[#77716C] mt-0.5">
                          {ord.customerName} ({ord.customerEmail}) · {ord.items.length} items
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#292522] tabular-nums">${ord.total.toFixed(2)}</span>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className="bg-[#FAF8F5] border border-[#E9E3DE] px-2 py-1 rounded text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'categories' && <CategoryAdminPanel />}
            {activeTab === 'products' && <ProductAdminPanel />}
            {activeTab === 'blog' && <BlogAdminPanel />}
            {activeTab === 'subscribers' && <NewsletterAdminPanel />}
            {activeTab === 'promos' && <PromoAdminPanel />}
          </main>
        </div>
      </div>
    </div>
  );
};
