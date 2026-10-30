'use client';

import React, { useMemo } from 'react';
import {
  Clock,
  Truck,
  PackageCheck,
  Star,
  ShoppingCart,
  Package,
  Ban,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import type { OrderStatus } from '../../types';

interface AdminDashboardProps {
  onNavigate: (tab: 'orders' | 'products') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { orders, products } = useShop();

  const stats = useMemo(() => {
    const byStatus = (status: OrderStatus) => orders.filter((o) => o.status === status).length;
    const pending = byStatus('pending');
    const processing = byStatus('processing');
    const shipped = byStatus('shipped');
    const delivered = byStatus('delivered');
    const cancelled = byStatus('cancelled');
    const totalReviews = products.reduce((sum, p) => sum + (p.reviewCount || 0), 0);
    const avgRating =
      products.length > 0
        ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length
        : 0;
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      totalOrders: orders.length,
      totalReviews,
      avgRating,
      productCount: products.length,
      revenue,
    };
  }, [orders, products]);

  const cards = [
    {
      label: 'Pending Orders',
      value: stats.pending,
      hint: 'Awaiting action',
      icon: <Clock className="w-4 h-4" />,
      accent: 'text-[#A84940] bg-[#F1E5E1]',
      onClick: () => onNavigate('orders'),
    },
    {
      label: 'Delivered',
      value: stats.delivered,
      hint: 'Completed orders',
      icon: <PackageCheck className="w-4 h-4" />,
      accent: 'text-[#5B6B4F] bg-[#E8EDE4]',
      onClick: () => onNavigate('orders'),
    },
    {
      label: 'Total Reviews',
      value: stats.totalReviews,
      hint: `Avg rating ${stats.avgRating.toFixed(1)} ★`,
      icon: <Star className="w-4 h-4" />,
      accent: 'text-[#8A6A2F] bg-[#F5EEDC]',
      onClick: () => onNavigate('products'),
    },
    {
      label: 'All Orders',
      value: stats.totalOrders,
      hint: `$${stats.revenue.toFixed(0)} revenue`,
      icon: <ShoppingCart className="w-4 h-4" />,
      accent: 'text-[#C77F79] bg-[#FAF0EE]',
      onClick: () => onNavigate('orders'),
    },
  ];

  const pipeline = [
    { label: 'Pending', count: stats.pending, icon: <Clock className="w-3.5 h-3.5" /> },
    { label: 'Processing', count: stats.processing, icon: <Package className="w-3.5 h-3.5" /> },
    { label: 'Shipped', count: stats.shipped, icon: <Truck className="w-3.5 h-3.5" /> },
    { label: 'Delivered', count: stats.delivered, icon: <PackageCheck className="w-3.5 h-3.5" /> },
    { label: 'Cancelled', count: stats.cancelled, icon: <Ban className="w-3.5 h-3.5" /> },
  ];

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);
  const topReviewed = useMemo(
    () => [...products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 5),
    [products]
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-[#292522]">Dashboard</h2>
        <p className="text-[11px] text-[#77716C] mt-0.5">
          Orders, deliveries, and customer reviews at a glance
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={card.onClick}
            className="text-left bg-white rounded-xl border border-[#E9E3DE] p-4 hover:border-[#C77F79]/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2">
              <span className={`inline-flex p-2 rounded-lg ${card.accent}`}>{card.icon}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C4BBB4] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-3 text-2xl font-bold text-[#292522] tabular-nums leading-none">
              {card.value}
            </p>
            <p className="mt-1.5 text-xs font-semibold text-[#292522]">{card.label}</p>
            <p className="text-[10px] text-[#77716C] mt-0.5">{card.hint}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E9E3DE] p-4">
        <h3 className="text-xs font-semibold text-[#292522] mb-3">Order pipeline</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {pipeline.map((step) => (
            <div
              key={step.label}
              className="rounded-lg bg-[#FAF8F5] border border-[#E9E3DE] px-3 py-2.5 flex items-center gap-2"
            >
              <span className="text-[#C77F79]">{step.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] text-[#77716C] truncate">{step.label}</p>
                <p className="text-sm font-bold text-[#292522] tabular-nums">{step.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#E9E3DE] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E9E3DE] flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#292522]">Recent orders</h3>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-[10px] font-semibold text-[#C77F79] hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-[#E9E3DE]">
            {recentOrders.length === 0 ? (
              <p className="p-4 text-xs text-[#77716C]">No orders yet.</p>
            ) : (
              recentOrders.map((ord) => (
                <div key={ord.id} className="px-4 py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#292522] truncate">{ord.id}</p>
                    <p className="text-[10px] text-[#77716C] truncate">
                      {ord.customerName} · {ord.date}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[#292522] tabular-nums">${ord.total.toFixed(2)}</p>
                    <p className="text-[10px] capitalize text-[#77716C]">{ord.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E9E3DE] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E9E3DE] flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#292522]">Most reviewed products</h3>
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="text-[10px] font-semibold text-[#C77F79] hover:underline cursor-pointer"
            >
              Products
            </button>
          </div>
          <div className="divide-y divide-[#E9E3DE]">
            {topReviewed.length === 0 ? (
              <p className="p-4 text-xs text-[#77716C]">No products yet.</p>
            ) : (
              topReviewed.map((p) => (
                <div key={p.id} className="px-4 py-3 flex items-center gap-3 text-xs">
                  <img
                    src={p.images?.[0]}
                    alt=""
                    className="w-9 h-9 rounded object-cover border border-[#E9E3DE] bg-[#FAF8F5] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#292522] truncate">{p.name}</p>
                    <p className="text-[10px] text-[#77716C]">
                      {p.rating.toFixed(1)} ★ · {p.reviewCount} reviews
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
