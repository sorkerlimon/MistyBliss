'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Truck, Plus, Trash2, Save, Power } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { DeliveryZone, ShopSettings } from '../../types';
import { formatMoney } from '../../lib/money';

function newZoneId() {
  return `zone-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function cleanSettings(draft: ShopSettings, fallbackZones: DeliveryZone[]): ShopSettings {
  const cleanedZones = draft.deliveryZones
    .map((z) => ({
      ...z,
      name: (z.name || '').trim() || 'Zone',
      fee: Math.max(0, Number(z.fee) || 0),
      active: z.active !== false,
    }))
    .filter((z) => z.id);

  return {
    deliveryEnabled: Boolean(draft.deliveryEnabled),
    deliveryZones: cleanedZones.length ? cleanedZones : fallbackZones,
    taxEnabled: Boolean(draft.taxEnabled),
    taxPercent: Math.max(0, Number(draft.taxPercent) || 0),
  };
}

export const ShippingTaxAdminPanel: React.FC = () => {
  const { shopSettings, updateShopSettings } = useShop();
  const [draft, setDraft] = useState<ShopSettings>(shopSettings);
  const [savedFlash, setSavedFlash] = useState(false);
  const skipSyncRef = useRef(false);

  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    setDraft(shopSettings);
  }, [shopSettings]);

  const persist = (next: ShopSettings) => {
    const cleaned = cleanSettings(next, shopSettings.deliveryZones);
    skipSyncRef.current = true;
    setDraft(cleaned);
    updateShopSettings(cleaned);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  const updateZoneLocal = (id: string, patch: Partial<DeliveryZone>) => {
    setDraft((prev) => ({
      ...prev,
      deliveryZones: prev.deliveryZones.map((z) => (z.id === id ? { ...z, ...patch } : z)),
    }));
  };

  const addZone = () => {
    const next: ShopSettings = {
      ...draft,
      deliveryZones: [
        ...draft.deliveryZones,
        { id: newZoneId(), name: 'New Zone', fee: 0, active: true },
      ],
    };
    persist(next);
  };

  const removeZone = (id: string) => {
    if (draft.deliveryZones.length <= 1) return;
    persist({
      ...draft,
      deliveryZones: draft.deliveryZones.filter((z) => z.id !== id),
    });
  };

  const toggleZoneActive = (id: string) => {
    const next: ShopSettings = {
      ...draft,
      deliveryZones: draft.deliveryZones.map((z) =>
        z.id === id ? { ...z, active: !z.active } : z
      ),
    };
    persist(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    persist(draft);
  };

  const toggleDelivery = () => {
    persist({ ...draft, deliveryEnabled: !draft.deliveryEnabled });
  };

  const toggleTax = () => {
    persist({ ...draft, taxEnabled: !draft.taxEnabled });
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
            Add/remove zones and enable toggles save instantly. After editing names or fees, click Save Settings.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#C77F79] hover:bg-[#b56e68] text-white text-xs font-semibold rounded-md cursor-pointer shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          {savedFlash ? 'Saved' : 'Save Settings'}
        </button>
      </div>

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
            onClick={toggleDelivery}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
              draft.deliveryEnabled
                ? 'bg-[#5E6B56] text-white hover:bg-[#4f5a48]'
                : 'bg-[#77716C] text-white hover:bg-[#5f5954]'
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
                onChange={(e) => updateZoneLocal(zone.id, { name: e.target.value })}
                onBlur={(e) => {
                  const name = e.target.value;
                  persist({
                    ...draft,
                    deliveryZones: draft.deliveryZones.map((z) =>
                      z.id === zone.id ? { ...z, name } : z
                    ),
                  });
                }}
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
                  onChange={(e) => updateZoneLocal(zone.id, { fee: Number(e.target.value) })}
                  onBlur={(e) => {
                    const fee = Number(e.target.value);
                    persist({
                      ...draft,
                      deliveryZones: draft.deliveryZones.map((z) =>
                        z.id === zone.id ? { ...z, fee } : z
                      ),
                    });
                  }}
                  className="w-full pl-6 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] tabular-nums"
                />
              </div>
              <button
                type="button"
                onClick={() => toggleZoneActive(zone.id)}
                className={`px-2.5 py-2 rounded-md text-[10px] font-semibold uppercase cursor-pointer ${
                  zone.active ? 'bg-[#5E6B56] text-white' : 'bg-[#77716C] text-white'
                }`}
              >
                {zone.active ? 'Active' : 'Off'}
              </button>
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
        <div className="px-4 py-3 border-b border-[#E9E3DE] flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold text-[#292522] uppercase tracking-wider">Sales Tax</h3>
            <p className="text-[11px] text-[#77716C] mt-0.5">
              When off, tax is hidden on checkout and not added to totals.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTax}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
              draft.taxEnabled
                ? 'bg-[#5E6B56] text-white hover:bg-[#4f5a48]'
                : 'bg-[#77716C] text-white hover:bg-[#5f5954]'
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
              onBlur={(e) => persist({ ...draft, taxPercent: Number(e.target.value) })}
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
