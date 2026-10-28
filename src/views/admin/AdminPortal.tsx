'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';
import { MistyBlissIcon } from '../../components/common/MistyBlissIcon';
import { Lock, Package, ShoppingCart, Tag, CheckCircle2, ArrowRight, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';
import { cleanCredential } from '../../lib/adminConfig';

export const AdminPortal: React.FC = () => {
  const {
    products,
    orders,
    promoCodes,
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
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'promos'>('orders');

  const handleFillDemoCredentials = () => {
    setEmail('limon@technobd.com');
    setPassword('admin@123');
    setError('');
  };

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
      setError('Invalid admin credentials. Please enter email limon@technobd.com and password admin@123');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F6F4F0]">
        <div className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E3DE] shadow-xs space-y-5">
          <div className="text-center space-y-2">
            <MistyBlissIcon size={32} className="mx-auto" />
            <h1 className="text-xl font-bold text-[#292522]">Admin Portal</h1>
            <p className="text-xs text-[#77716C]">Sign in to studio management & operations</p>
          </div>

          {/* Quick Credential Helper Pill */}
          <div className="p-3 bg-[#FAF8F5] border border-[#E9E3DE] rounded-xl text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#292522] flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#89947D]" />
                Admin Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="text-[10px] font-semibold text-[#C77F79] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <KeyRound size={10} />
                Auto-Fill
              </button>
            </div>
            <p className="text-[11px] text-[#77716C] font-mono leading-relaxed">
              Email: <span className="text-[#292522]">limon@technobd.com</span><br />
              Password: <span className="text-[#292522]">admin@123</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
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
                placeholder="limon@technobd.com"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
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
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
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
    <div className="min-h-screen bg-[#F6F4F0] p-4 sm:p-8 space-y-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between pb-4 border-b border-[#E9E3DE]">
        <div className="flex items-center gap-3">
          <MistyBlissIcon size={24} />
          <h1 className="text-xl font-bold text-[#292522]">Studio Management Portal</h1>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFECE6] text-[#292522] font-mono text-[11px] border border-[#E9E3DE]">
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

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation tabs */}
        <div className="flex gap-2 border-b border-[#E9E3DE] pb-2 text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded font-medium cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#292522] text-white' : 'bg-white text-[#77716C]'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-1.5 rounded font-medium cursor-pointer ${
              activeTab === 'products' ? 'bg-[#292522] text-white' : 'bg-white text-[#77716C]'
            }`}
          >
            Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('promos')}
            className={`px-4 py-1.5 rounded font-medium cursor-pointer ${
              activeTab === 'promos' ? 'bg-[#292522] text-white' : 'bg-white text-[#77716C]'
            }`}
          >
            Promotions ({promoCodes.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-[#E9E3DE] divide-y divide-[#E9E3DE] overflow-hidden">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
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
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-[#E9E3DE] divide-y divide-[#E9E3DE] overflow-hidden">
            {products.slice(0, 15).map((p) => (
              <div key={p.id} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover border border-[#E9E3DE]" />
                  <div>
                    <h4 className="font-semibold text-[#292522]">{p.name}</h4>
                    <p className="text-[11px] text-[#77716C]">{p.material} · ${p.price}</p>
                  </div>
                </div>
                <span className="text-[11px] text-[#89947D] font-medium capitalize">{p.stockStatus.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Promos Tab */}
        {activeTab === 'promos' && (
          <div className="bg-white rounded-xl border border-[#E9E3DE] divide-y divide-[#E9E3DE] overflow-hidden">
            {promoCodes.map((pr) => (
              <div key={pr.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-[#292522]">{pr.code}</span>
                  <p className="text-[11px] text-[#77716C]">{pr.discountPercent}% discount · used {pr.usageCount} times</p>
                </div>
                <span className="text-[11px] text-[#89947D] font-medium uppercase">{pr.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
