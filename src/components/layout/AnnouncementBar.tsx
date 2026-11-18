'use client';

import React, { useMemo, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const DELIVERY_ANNOUNCEMENT = 'Upto 3999 TK delivery Free';

export const AnnouncementBar: React.FC = () => {
  const { promoCodes } = useShop();
  const [isVisible, setIsVisible] = useState(true);

  const activePromo = useMemo(
    () => promoCodes.find((p) => p.status === 'active') || null,
    [promoCodes]
  );

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Store announcement"
      className="bg-[#F1E5E1] text-[#292522] border-b border-[#E9E3DE] py-1.5 sm:py-2 px-3 sm:px-4 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs tracking-tight">
        <div className="flex-1 text-center flex items-center justify-center gap-1.5 sm:gap-2 px-1 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-[#C77F79] shrink-0 hidden sm:inline-block" />

          <span className="sm:hidden text-[11px] leading-tight truncate">
            {DELIVERY_ANNOUNCEMENT}
            {activePromo ? (
              <>
                {' · '}
                Code:{' '}
                <span className="font-mono font-semibold text-[#292522]">{activePromo.code}</span>
                {' · '}
                {activePromo.discountPercent}% off
              </>
            ) : null}
          </span>

          <span className="hidden sm:inline truncate">
            <strong className="font-semibold">{DELIVERY_ANNOUNCEMENT}</strong>
            {activePromo && (
              <span className="text-[#77716C]">
                {' · '}
                Use code{' '}
                <span className="font-mono font-medium text-[#292522] bg-[#FAF8F5] px-1 py-0.5 rounded border border-[#E9E3DE]">
                  {activePromo.code}
                </span>{' '}
                for {activePromo.discountPercent}% off
              </span>
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="p-1 -mr-1 text-[#77716C] hover:text-[#292522] transition-colors shrink-0 cursor-pointer rounded"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
