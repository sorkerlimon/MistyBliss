'use client';

import React, { useEffect, useState } from 'react';
import { Truck, Plus, Trash2, Save } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { DeliveryZone, ShopSettings } from '../../types';
import { formatMoney } from '../../lib/money';

function newZoneId() {
  return `zone-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function cleanSettings(draft: ShopSettings, fallbackZones: DeliveryZone[]): ShopSettings {
  const cleanedZones = draft.deliveryZones
    .map((z) => ({
      id: z.id || newZoneId(),
      name: (z.name || '').trim() || 'Zone',
      fee: Math.max(0, Number(z.fee) || 0),
      active: true,
    }))
    .filter((z) => z.name);

  return {
    deliveryEnabled: true,
    deliveryZones: cleanedZones.length ? cleanedZones : fallbackZones,
    taxEnabled: true,
    taxPercent: Math.max(0, Number(draft.taxPercent) || 0),
  };
}

export const ShippingTaxAdminPanel: React.FC = () => {
  const { shopSettings, updateShopSettings } = useShop();
  const [draft, setDraft] = useState<ShopSettings>(shopSettings);
  const [saving, setSaving] = useState(false);
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
    setDraft((prev) => {
      if (prev.deliveryZones.length <= 1) return prev;
      return {
        ...prev,
        deliveryZones: prev.deliveryZones.filter((z) => z.id !== id),
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleaned = cleanSettings(draft, shopSettings.deliveryZones);
      setDraft(cleaned);
      await updateShopSettings(cleaned);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-[#292522] flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-[#C77F79]" />
          Delivery & Tax
        </h2>
        <p className="text-[11px] text-[#77716C] mt-0.5">
          Edit delivery zones and tax, then save once. Saved zones appear on checkout for all visitors.
        </p>
      </div>

      <section className="bg-white rounded-xl border border-[#E9E3DE] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E9E3DE]">
          <h3 className="text-xs font-semibold text-[#292522] uppercase tracking-wider">Delivery Charge</h3>
          <p className="text-[11px] text-[#77716C] mt-0.5">Zones shown as delivery options at checkout.</p>
        </div>

        <div className="p-4 space-y-3">
          {draft.deliveryZones.map((zone) => (
            <div key={zone.id} className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-2 items-center">
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
                onClick={() => removeZone(zone.id)}
                className="p-2 text-[#A84940] hover:bg-[#F1E5E1] rounded-md cursor-pointer disabled:opacity-40"
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

      <section className="bg-white rounded-xl border border-[#E9E3DE] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E9E3DE]">
          <h3 className="text-xs font-semibold text-[#292522] uppercase tracking-wider">Sales Tax</h3>
          <p className="text-[11px] text-[#77716C] mt-0.5">Percent of cart subtotal added at checkout.</p>
        </div>

        <div className="p-4">
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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C77F79] hover:bg-[#b56e68] disabled:opacity-60 text-white text-xs font-semibold rounded-md cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving…' : savedFlash ? 'Saved' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};
