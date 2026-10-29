'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Trash2, Plus, X, Check, Power } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { PromoCode } from '../../types';

const emptyForm = {
  code: '',
  discountPercent: '10',
  minSpend: '',
  expiryDate: '',
};

export const PromoAdminPanel: React.FC = () => {
  const { promoCodes, createPromoCode, togglePromoStatus, deletePromoCode } = useShop();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<PromoCode | null>(null);

  useEffect(() => {
    if (!formOpen && !deleteTarget) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deleteTarget) setDeleteTarget(null);
        else setFormOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [formOpen, deleteTarget]);

  const closeForm = () => {
    setFormOpen(false);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const discountPercent = Number(form.discountPercent);
    if (!code || !Number.isFinite(discountPercent) || discountPercent <= 0) return;

    createPromoCode({
      code,
      discountPercent,
      minSpend: form.minSpend.trim() ? Number(form.minSpend) : undefined,
      status: 'active',
      expiryDate: form.expiryDate || undefined,
    });
    closeForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#292522] flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#C77F79]" />
            Promotions
          </h2>
          <p className="text-[11px] text-[#77716C] mt-0.5">{promoCodes.length} promo codes</p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Promo
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E9E3DE] divide-y divide-[#E9E3DE] overflow-hidden">
        {promoCodes.length === 0 && (
          <p className="p-4 text-xs text-[#77716C]">No promo codes yet.</p>
        )}
        {promoCodes.map((pr) => (
          <div key={pr.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0">
              <span className="font-mono font-bold text-[#292522]">{pr.code}</span>
              <p className="text-[11px] text-[#77716C]">
                {pr.discountPercent}% off
                {pr.minSpend ? ` · min $${pr.minSpend}` : ''}
                {pr.expiryDate ? ` · expires ${pr.expiryDate}` : ''}
                {' · '}
                used {pr.usageCount}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                  pr.status === 'active'
                    ? 'bg-[#89947D]/15 text-[#5E6B56]'
                    : 'bg-[#EFECE6] text-[#77716C]'
                }`}
              >
                {pr.status}
              </span>
              <button
                type="button"
                onClick={() => togglePromoStatus(pr.id)}
                className="p-1.5 rounded border border-[#E9E3DE] text-[#77716C] hover:text-[#292522] hover:bg-[#FAF8F5] cursor-pointer"
                title="Toggle active"
              >
                <Power className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(pr)}
                className="p-1.5 rounded border border-[#E9E3DE] text-[#A84940] hover:bg-[#F1E5E1] cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeForm} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E9E3DE] shadow-2xl z-10">
            <div className="border-b border-[#E9E3DE] px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#292522]">Add Promo</h3>
              <button type="button" onClick={closeForm} className="p-1.5 text-[#77716C] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Code *</label>
                <input
                  required
                  autoFocus
                  value={form.code}
                  onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="WELCOME10"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Discount % *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="100"
                    value={form.discountPercent}
                    onChange={(e) => setForm((prev) => ({ ...prev, discountPercent: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Min spend</label>
                  <input
                    type="number"
                    min="0"
                    value={form.minSpend}
                    onChange={(e) => setForm((prev) => ({ ...prev, minSpend: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Expiry date</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E3DE]">
                <button type="button" onClick={closeForm} className="px-3.5 py-2 text-xs text-[#77716C] cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#292522] text-white text-xs font-semibold rounded-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Add Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E9E3DE] shadow-2xl z-10 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#292522]">Delete promo?</h3>
              <p className="text-xs text-[#77716C] mt-1">
                Code “{deleteTarget.code}” will be permanently removed.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 text-xs text-[#77716C] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePromoCode(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 bg-[#A84940] text-white text-xs font-semibold rounded-md cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
