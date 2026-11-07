'use client';

import React, { useEffect, useState } from 'react';
import { Truck, Plus, Trash2, Save, Power } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { DeliveryZone, ShopSettings } from '../../types';
import { formatMoney } from '../../lib/money';

function newZoneId() {
  return `zone-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const ShippingTaxAdminPanel: React.FC = () => {
  const { shopSettings, updateShopSettings } = useShop();
  const [draft, setDraft] = useState<ShopSettings>(shopSettings);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setDraft(shopSettings);
  }, [shopSettings]);

  const updateZone = (id: string, patch: Partial<DeliveryZone>) => {
    setDraft((prev) => ({
      ...prev,
      deliveryZones: prev.deliveryZones.map((z) => (z.id === id ? { ...z, ...patch } : z)),
    }));
  };

  const addZone = () => {
    setDraft((prev) => ({
      ...prev,
      deliveryZones: [
        ...prev.deliveryZones,
        { id: newZoneId(), name: 'New Zone', fee: 0, active: true },
      ],
    }));
  };

  const removeZone = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      deliveryZones: prev.deliveryZones.filter((z) => z.id !== id),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedZones = draft.deliveryZones
      .map((z) => ({
        ...z,
        name: z.name.trim() || 'Zone',
        fee: Math.max(0, Number(z.fee) || 0),
      }))
      .filter((z) => z.name);

    updateShopSettings({
      ...draft,
      deliveryZones: cleanedZones.length
        ? cleanedZones
        : shopSettings.deliveryZones,
      taxPercent: Math.max(0, Number(draft.taxPercent) || 0),
    });
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#292522] flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#C77F79]" />
            Delivery & Tax
          </h2>
          <p className="text-[11px] text-[#77716C] mt-0.5">
            Control checkout delivery charges and sales tax. Disabled items are hidden and not calculated.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md cursor-pointer shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          {savedFlash ? 'Saved' : 'Save Settings'}
        </button>
      </div>

      {/* Delivery */}
      <section className="bg-white rounded-xl border border-[#E9E3DE] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E9E3DE] flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold text-[#292522] uppercase tracking-wider">Delivery Charge</h3>
            <p className="text-[11px] text-[#77716C] mt-0.5">
              When off, delivery is hidden on checkout and not added to totals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDraft((prev) => ({ ...prev, deliveryEnabled: !prev.deliveryEnabled }))}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold border cursor-pointer ${
              draft.deliveryEnabled
                ? 'bg-[#89947D]/15 text-[#5E6B56] border-[#89947D]/40'
                : 'bg-[#EFECE6] text-[#77716C] border-[#E9E3DE]'
            }`}
          >
            <Power className="w-3 h-3" />
            {draft.deliveryEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div className={`p-4 space-y-3 ${draft.deliveryEnabled ? '' : 'opacity-50 pointer-events-none'}`}>
          {draft.deliveryZones.map((zone) => (
            <div
              key={zone.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_120px_auto_auto] gap-2 items-center"
            >
              <input
                type="text"
                value={zone.name}
                onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                placeholder="Zone name"
              />
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#A89F97]">৳</span>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={zone.fee}
                  onChange={(e) => updateZone(zone.id, { fee: Number(e.target.value) })}
                  className="w-full pl-6 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] tabular-nums"
                />
              </div>
              <button
                type="button"
                onClick={() => updateZone(zone.id, { active: !zone.active })}
                className={`px-2.5 py-2 rounded-md text-[10px] font-semibold uppercase border cursor-pointer ${
                  zone.active
                    ? 'bg-[#89947D]/15 text-[#5E6B56] border-[#89947D]/40'
                    : 'bg-[#EFECE6] text-[#77716C] border-[#E9E3DE]'
                }`}
              >
                {zone.active ? 'Active' : 'Off'}
              </button>
              <button
                type="button"
                onClick={() => removeZone(zone.id)}
                className="p-2 text-[#A84940] hover:bg-[#F1E5E1] rounded-md cursor-pointer"
                aria-label={`Remove ${zone.name}`}
                disabled={draft.deliveryZones.length <= 1}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addZone}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#292522] border border-dashed border-[#E9E3DE] rounded-md hover:bg-[#FAF8F5] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Delivery Zone
          </button>
        </div>
      </section>

      {/* Tax */}
      <section className="bg-white rounded-xl border border-[#E9E3DE] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E9E3DE] flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold text-[#292522] uppercase tracking-wider">Sales Tax</h3>
            <p className="text-[11px] text-[#77716C] mt-0.5">
              When off, tax is hidden on checkout and not added to totals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDraft((prev) => ({ ...prev, taxEnabled: !prev.taxEnabled }))}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold border cursor-pointer ${
              draft.taxEnabled
                ? 'bg-[#89947D]/15 text-[#5E6B56] border-[#89947D]/40'
                : 'bg-[#EFECE6] text-[#77716C] border-[#E9E3DE]'
            }`}
          >
            <Power className="w-3 h-3" />
            {draft.taxEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div className={`p-4 ${draft.taxEnabled ? '' : 'opacity-50 pointer-events-none'}`}>
          <label className="block text-[11px] font-medium text-[#77716C] mb-1">Tax percent (%)</label>
          <div className="flex items-center gap-2 max-w-xs">
            <input
              type="number"
              min={0}
              step="0.01"
              value={draft.taxPercent}
              onChange={(e) => setDraft((prev) => ({ ...prev, taxPercent: Number(e.target.value) }))}
              className="w-28 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] tabular-nums"
            />
            <span className="text-[11px] text-[#77716C]">
              of subtotal · example {formatMoney((1000 * (Number(draft.taxPercent) || 0)) / 100)} on ৳1,000
            </span>
          </div>
        </div>
      </section>
    </form>
  );
};
