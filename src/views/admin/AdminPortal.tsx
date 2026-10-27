'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';
import { MistyBlissIcon } from '../../components/common/MistyBlissIcon';
import { Lock, Package, ShoppingCart, Tag, CheckCircle2, ArrowRight } from 'lucide-react';

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
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'promos'>('orders');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = adminLogin(email, password);
    if (!success) {
      setError('Invalid admin credentials. Check .env configuration.');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F6F4F0]">
        <div className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E3DE] shadow-xs space-y-5">
          <div className="text-center space-y-2">
            <MistyBlissIcon size={32} className="mx-auto" />
            <h1 className="text-xl font-bold text-[#292522]">Admin Portal</h1>
            <p className="text-xs text-[#77716C]">Enter your studio management credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-[#77716C] mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mistybliss.com"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#77716C] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
              />
            </div>

            {error && <p className="text-[11px] text-[#A84940]">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Sign In to Dashboard
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
